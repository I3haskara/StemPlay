// src/lib/simulationConfig.ts

/**
 * Core types used to represent a simulation configuration
 * generated from an AI "blueprint" text.
 *
 * This is intentionally generic and forgiving:
 * - It parses obvious headings like "Scene:", "Objects:", "Variables:", "Timeline:"
 * - It tries to infer variables from formulas (v, a, t, m, etc.)
 * - It always returns a valid SimulationConfig, even if the blueprint is messy
 */

export type SimulationVariableRole = 'given' | 'unknown' | 'derived' | 'constant';

export interface SimulationVariable {
  name: string;
  description?: string;
  unit?: string;
  initialValue?: number | null;
  role?: SimulationVariableRole;
}

export interface SimulationObject {
  id: string;
  label: string;
  role?: string; // e.g. "projectile", "ground", "reference frame"
  variables: SimulationVariable[];
}

export interface SimulationTimelineEvent {
  id: string;
  label: string;
  time?: number | null; // seconds if present
  description?: string;
}

export interface SimulationConfig {
  sceneTitle: string;
  description: string;
  objects: SimulationObject[];
  variables: SimulationVariable[];
  timeline: SimulationTimelineEvent[];
}

/**
 * Utility: generate a simple unique ID with a prefix.
 */
function makeId(prefix: string, index: number): string {
  return `${prefix}-${index}-${Date.now().toString(36)}`;
}

/**
 * Try to parse a number from a string safely.
 */
function safeParseNumber(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const n = Number(raw.trim());
  return Number.isFinite(n) ? n : null;
}

/**
 * Very loose pattern to detect section headings in the blueprint.
 * We support variations like:
 * - "Scene:"
 * - "Scene Setup:"
 * - "Objects:"
 * - "Variables:"
 * - "Timeline:"
 */
type SectionKey = 'scene' | 'objects' | 'variables' | 'timeline' | null;

function detectSection(line: string): SectionKey {
  const normalized = line.toLowerCase();

  if (/^scene\b/.test(normalized) || /^setup\b/.test(normalized)) return 'scene';
  if (/^objects?\b/.test(normalized)) return 'objects';
  if (/^variables?\b/.test(normalized)) return 'variables';
  if (/^timeline\b/.test(normalized) || /^events?\b/.test(normalized)) return 'timeline';

  return null;
}

/**
 * Parse a bullet-style line into a label (for objects or events).
 * E.g. "- Cart on a track" -> "Cart on a track"
 */
function stripBullet(line: string): string {
  return line.replace(/^[-*•]\s*/, '').trim();
}

/**
 * Attempt to parse variable definition lines.
 * Supports shapes like:
 * - "- v: velocity of the cart (m/s)"
 * - "v — initial velocity (m/s)"
 * - "a = acceleration (m/s²)"
 */
function parseVariableLine(rawLine: string): SimulationVariable | null {
  const line = stripBullet(rawLine);

  // Try "name: description (unit)"
  const colonMatch = line.match(/^([a-zA-Z][a-zA-Z0-9_]*)\s*[:\-—]\s*(.+)$/);
  if (colonMatch) {
    const name = colonMatch[1].trim();
    const rest = colonMatch[2].trim();

    // Try to grab "(unit)" at the end
    const unitMatch = rest.match(/\(([^)]+)\)\s*$/);
    const unit = unitMatch ? unitMatch[1].trim() : undefined;
    const description = unitMatch ? rest.replace(/\([^)]+\)\s*$/, '').trim() : rest;

    return {
      name,
      description,
      unit,
      initialValue: null,
    };
  }

  // Try "name = something"
  const eqMatch = line.match(/^([a-zA-Z][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
  if (eqMatch) {
    const name = eqMatch[1].trim();
    const rest = eqMatch[2].trim();

    const unitMatch = rest.match(/\(([^)]+)\)\s*$/);
    const unit = unitMatch ? unitMatch[1].trim() : undefined;
    const description = unitMatch ? rest.replace(/\([^)]+\)\s*$/, '').trim() : rest;

    return {
      name,
      description,
      unit,
      initialValue: null,
    };
  }

  return null;
}

/**
 * Attempt to parse a timeline/event line.
 * Supports shapes like:
 * - "- t = 0s: object starts moving"
 * - "At t = 2.5s, the ball hits the ground"
 */
function parseTimelineLine(rawLine: string, index: number): SimulationTimelineEvent {
  const line = stripBullet(rawLine);

  // Try to find "t = Xs" pattern
  const timeMatch = line.match(/t\s*=\s*([0-9.]+)\s*s?/i);
  const timeValue = timeMatch ? safeParseNumber(timeMatch[1]) : null;

  return {
    id: makeId('event', index),
    label: line,
    time: timeValue,
    description: line,
  };
}

/**
 * Infer variables from any formulas in the blueprint text.
 * Looks for single-letter variables commonly used in kinematics:
 * v, u, a, t, s, x, y, m, g, F, etc.
 *
 * This is intentionally simple and safe; we avoid words like "sin", "cos", etc.
 */
const COMMON_VARIABLE_CANDIDATES = [
  'v',
  'u',
  'a',
  't',
  's',
  'x',
  'y',
  'm',
  'g',
  'F',
];

function inferVariablesFromFormulas(blueprint: string): SimulationVariable[] {
  const result: SimulationVariable[] = [];
  const seen = new Set<string>();

  const tokens = blueprint.match(/[A-Za-z][A-Za-z0-9_]*/g) || [];

  for (const token of tokens) {
    if (!COMMON_VARIABLE_CANDIDATES.includes(token)) continue;
    if (seen.has(token)) continue;

    seen.add(token);
    result.push({
      name: token,
      description: undefined,
      unit: undefined,
      initialValue: null,
      role: 'unknown',
    });
  }

  return result;
}

/**
 * Main function: generate a SimulationConfig from the AI blueprint text.
 *
 * This does NOT need the blueprint to be in any strict format.
 * It will:
 * - Look for section headings
 * - Attach bullets under those headings
 * - Infer variables from formulas if the "Variables" section is missing or sparse
 */
export function generateSimulationConfigFromBlueprint(
  blueprint: string,
  options?: {
    defaultSceneTitle?: string;
  }
): SimulationConfig {
  const defaultSceneTitle = options?.defaultSceneTitle ?? 'Physics Simulation';

  const lines = blueprint
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0);

  let currentSection: SectionKey = null;
  let sceneTitle = defaultSceneTitle;
  let sceneDescriptionLines: string[] = [];

  const objects: SimulationObject[] = [];
  const variables: SimulationVariable[] = [];
  const timeline: SimulationTimelineEvent[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check if this line is a section heading
    const maybeSection = detectSection(line);
    if (maybeSection) {
      currentSection = maybeSection;

      // If it's a scene heading with content on the same line, e.g. "Scene: Projectile motion"
      if (currentSection === 'scene') {
        const afterColon = line.split(':').slice(1).join(':').trim();
        if (afterColon) {
          sceneTitle = afterColon;
        }
      }

      // Don't treat heading itself as part of content
      continue;
    }

    // Handle content based on currentSection
    switch (currentSection) {
      case 'scene': {
        sceneDescriptionLines.push(stripBullet(line));
        break;
      }

      case 'objects': {
        // Treat any bullet or sentence line as a potential object
        if (/^[-*•]/.test(rawLine) || /^object/i.test(line)) {
          const label = stripBullet(line).replace(/^object\s*/i, '').trim() || 'Object';
          objects.push({
            id: makeId('obj', objects.length),
            label,
            role: undefined,
            variables: [],
          });
        }
        break;
      }

      case 'variables': {
        const variable = parseVariableLine(rawLine);
        if (variable) {
          variables.push(variable);
        }
        break;
      }

      case 'timeline': {
        if (/^[-*•]/.test(rawLine) || /t\s*=/i.test(line) || /^at\s+t/i.test(line)) {
          timeline.push(parseTimelineLine(rawLine, timeline.length));
        }
        break;
      }

      default: {
        // No active section — we just ignore or treat as general description
        break;
      }
    }
  }

  // If we didn't get any variables from an explicit section, try to infer them from formulas
  if (variables.length === 0) {
    const inferred = inferVariablesFromFormulas(blueprint);
    for (const v of inferred) {
      // avoid duplicates by name
      if (!variables.some((existing) => existing.name === v.name)) {
        variables.push(v);
      }
    }
  }

  // If we still have no objects, create a generic one
  if (objects.length === 0) {
    objects.push({
      id: makeId('obj', 0),
      label: 'Default Object',
      role: 'body',
      variables: [],
    });
  }

  // Simple policy: attach all variables to the first object if it has none
  if (variables.length > 0) {
    if (objects[0].variables.length === 0) {
      objects[0].variables = [...variables];
    }
  }

  const description =
    sceneDescriptionLines.join(' ') ||
    'Automatically generated simulation configuration from AI blueprint text.';

  return {
    sceneTitle,
    description,
    objects,
    variables,
    timeline,
  };
}
