import React, { useState } from "react";

interface OnboardingOverlayProps {
  onDone?: () => void;
}

const steps = [
  {
    title: "WELCOME, PHYSICS PLAYER 01",
    body: [
      "STEMPlay AI turns your physics notes into tiny 2D labs.",
      "Tonight's mission: make Newton's laws feel like a game, not a worksheet.",
    ],
    hint: "Tip: let this play out once in your demo recording.",
  },
  {
    title: "STEP 1 — FEED THE BRAIN",
    body: [
      "On the left, choose how you give us content:",
      "• Paste a formula or short note.",
      "• Drop a PDF / screenshot (future: full OCR).",
      "• Paste a video link to auto-transcribe later.",
    ],
    hint: "For this hack build, you'll mostly use the text + formula input.",
  },
  {
    title: "STEP 2 — WATCH FORMULAS COME ALIVE",
    body: [
      "On the right, the Visual Sandbox turns F = m · a into motion.",
      "Slide lab: blocks sliding with force arrows.",
      "Rocket lab: a tiny rocket fighting gravity.",
    ],
    hint: "Change mass & acceleration and rerun the sim to show the effect.",
  },
  {
    title: "STEP 3 — YOU CONTROL THE SHOW",
    body: [
      "Use ▶ Play, ⏸ Pause, ⏹ Stop to control any simulation.",
      "Pause mid-motion to talk through the numbers floating next to the object.",
      "Every run updates the short 'lab notes' text so viewers don't get overwhelmed.",
    ],
    hint: "When you're ready, close this box and start recording your demo.",
  },
];

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  onDone,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      if (onDone) onDone();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const handleSkip = () => {
    if (onDone) onDone();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      {/* Pixel frame */}
      <div className="relative max-w-xl w-[92%] md:w-[480px] bg-slate-950 text-slate-100 border-[3px] border-cyan-400 shadow-[0_0_0_3px_#020617]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-700">
          <span className="text-[11px] font-mono text-cyan-200">
            STEMPlay OS ▸ Onboarding
          </span>
          <button
            type="button"
            onClick={handleSkip}
            className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600"
          >
            SKIP ▶
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs md:text-sm font-mono font-semibold text-cyan-200">
              {step.title}
            </h2>
            <span className="text-[10px] font-mono text-slate-400">
              {String(stepIndex + 1).padStart(2, "0")} /{" "}
              {String(steps.length).padStart(2, "0")}
            </span>
          </div>

          <div className="rounded-none border border-slate-700 bg-slate-950/90 px-3 py-2 text-[11px] font-mono leading-snug space-y-1">
            {step.body.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          {step.hint && (
            <p className="text-[10px] font-mono text-slate-400">
              ⓘ {step.hint}
            </p>
          )}

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-900 border border-slate-700 mt-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 transition-all duration-300"
              style={{
                width: `${((stepIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="text-[10px] font-mono text-slate-400 hover:text-slate-200"
            >
              ✖ Close & jump into the lab
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1 text-[11px] font-mono bg-cyan-400 text-slate-950 border border-slate-900 hover:bg-cyan-300"
            >
              {isLast ? "LET ME PLAY ▶" : "NEXT ▸"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
