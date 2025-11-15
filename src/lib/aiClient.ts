// src/lib/aiClient.ts
// Tiny Gemini helper for your STEMPlay AI app

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

// NOTE: Using the generateContent endpoint for text-only prompts.
// Docs: https://ai.google.dev/gemini-api/docs/quickstart
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

if (!GEMINI_API_KEY) {
  console.warn(
    "⚠️ VITE_GEMINI_API_KEY is not set. Set it in your .env.local file."
  );
}

type AnalysisMode = "formula" | "pdf" | "lecture";

export interface VisualBlueprint {
  scenarioTitle: string;
  shortDescription: string;
  recommendedScene: string;
  variables: Array<{
    name: string;
    symbol: string;
    units: string;
    typicalRange: string;
    roleInFormula: string;
  }>;
  timelineSteps: string[];
  suggested2DObjects: string[];
}

export interface AnalysisResult {
  explanation: string;
  difficultyLevel: "school" | "university" | "advanced";
  blueprint: VisualBlueprint;
}

/**
 * Low-level helper that calls Gemini with a structured system prompt.
 */
export async function analyzeStemContent(
  userText: string,
  mode: AnalysisMode
): Promise<AnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key missing. Set VITE_GEMINI_API_KEY.");
  }

  const modeLabel =
    mode === "formula"
      ? "PHYSICS_FORMULA"
      : mode === "pdf"
      ? "PDF_TEXT"
      : "LECTURE_NOTES";

  const systemInstruction = `
You are STEMPlay AI, an assistant that turns physics content into 2D simulation blueprints.

Input type: ${modeLabel}.

Return STRICT JSON with this exact TypeScript-like shape:

{
  "explanation": string,              // Plain English explanation for students
  "difficultyLevel": "school" | "university" | "advanced",
  "blueprint": {
    "scenarioTitle": string,
    "shortDescription": string,
    "recommendedScene": string,      // e.g. "side-view 2D rocket launch"
    "variables": [
      {
        "name": string,              // e.g. "Force"
        "symbol": string,            // e.g. "F"
        "units": string,             // e.g. "N"
        "typicalRange": string,      // e.g. "0 - 1000"
        "roleInFormula": string      // e.g. "main driving force"
      }
    ],
    "timelineSteps": string[],        // 3–6 bullet steps of how the visual plays out
    "suggested2DObjects": string[]    // object tags we can render: "rocket", "ground", "vectorArrow", "graphPanel"
  }
}

Rules:
- Use concise text (1–2 sentences per field).
- For formulas, parse variables and units carefully.
- For PDF/lecture text, infer ONE key formula or relationship to visualize.
- DO NOT include any markdown, backticks or comments. JSON only.
`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              systemInstruction +
              "\n\n---\n\nUSER_CONTENT_START\n\n" +
              userText +
              "\n\nUSER_CONTENT_END",
          },
        ],
      },
    ],
  };

  const res = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Gemini error:", errorText);
    throw new Error("Gemini API error: " + res.status);
  }

  const data = await res.json();

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text || "")
      .join("") ?? "";

  // Try to parse JSON from model response
  let parsed: AnalysisResult;
  try {
    // Sometimes models wrap JSON in extra text. Try to sniff out the JSON object.
    const jsonMatch = text.match(/\{[\s\S]*\}$/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    parsed = JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse Gemini JSON:", text);
    throw new Error("Failed to parse AI response as JSON.");
  }

  return parsed;
}

/**
 * Simple XP system: award points when a user runs an analysis.
 */
export function awardXP(amount: number): number {
  const key = "stemplay_xp";
  const current = Number(localStorage.getItem(key) || "0");
  const next = current + amount;
  localStorage.setItem(key, String(next));
  return next;
}

export function getXP(): number {
  const key = "stemplay_xp";
  return Number(localStorage.getItem(key) || "0");
}

/**
 * New simplified API for analyzing physics content
 * Returns structured analysis with explanation, breakdown, blueprint, and XP
 */
export interface PhysicsAnalysisResult {
  explanation: string;
  physicsBreakdown: string;
  difficulty: string;
  blueprint: string;
  xpGain: number;
}

export async function analyzePhysicsContent(
  userText: string,
  mode: "formula" | "notes" | "lecture"
): Promise<PhysicsAnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key missing. Set VITE_GEMINI_API_KEY.");
  }

  const modeLabel =
    mode === "formula"
      ? "FORMULA_INPUT"
      : mode === "notes"
      ? "PDF_NOTES"
      : "LECTURE_TRANSCRIPT";

  const systemInstruction = `
You are STEMPlay AI, an expert physics tutor that analyzes physics content and creates simulation blueprints.

Input type: ${modeLabel}.

Return STRICT JSON with this exact structure:

{
  "explanation": string,              // Plain English explanation of the physics concept (2-4 sentences)
  "physicsBreakdown": string,         // Detailed breakdown of formulas, variables, relationships (3-5 sentences)
  "difficulty": "school" | "university" | "advanced",
  "blueprint": string,                // Multi-line text blueprint for simulation with sections:
                                      // Scene: [description]
                                      // Objects: [list]
                                      // Variables: [name, units, role]
                                      // Timeline: [steps]
  "xpGain": number                    // XP points to award (10-50 based on difficulty)
}

Blueprint format example:
Scene: Projectile motion in 2D
Objects:
- Projectile (ball)
- Ground
Variables:
- v: initial velocity (m/s)
- angle: launch angle (degrees)
- g: gravity (m/s²)
Timeline:
- t = 0s: Ball launched
- t = peak: Maximum height reached
- t = landing: Ball hits ground

Rules:
- Use concise, student-friendly language
- For formulas, extract all variables and their meanings
- For notes/lectures, identify ONE key physics relationship to visualize
- Blueprint should be parseable text (not JSON), with clear sections
- DO NOT include markdown formatting or code blocks. JSON only.
`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              systemInstruction +
              "\n\n---\n\nUSER_CONTENT_START\n\n" +
              userText +
              "\n\nUSER_CONTENT_END",
          },
        ],
      },
    ],
  };

  const res = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Gemini error:", errorText);
    throw new Error("Gemini API error: " + res.status);
  }

  const data = await res.json();

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text || "")
      .join("") ?? "";

  // Try to parse JSON from model response
  let parsed: PhysicsAnalysisResult;
  try {
    // Sometimes models wrap JSON in extra text. Try to sniff out the JSON object.
    const jsonMatch = text.match(/\{[\s\S]*\}$/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    parsed = JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse Gemini JSON:", text);
    throw new Error("Failed to parse AI response as JSON.");
  }

  return parsed;
}
