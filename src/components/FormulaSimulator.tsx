import React, { useEffect, useMemo, useState } from "react";

interface FormulaSimulatorProps {
  sourceLabel?: string;
  formulaText?: string;
}

type ViewMode = "slide" | "rocket";

export const FormulaSimulator: React.FC<FormulaSimulatorProps> = ({
  sourceLabel,
  formulaText,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("slide");

  const [mass, setMass] = useState(4); // kg
  const [acc, setAcc] = useState(2); // m/s^2 (upward in rocket mode)
  const [runningSlide, setRunningSlide] = useState(false);
  const [hasRunOnce, setHasRunOnce] = useState(false);

  // Rocket-specific animation state
  const [rocketRunning, setRocketRunning] = useState(false);
  const [rocketPaused, setRocketPaused] = useState(false);
  const [rocketCycle, setRocketCycle] = useState(0); // used as key to reset

  const g = 9.8;
  const force = mass * acc;
  const netAccRocket = acc - g; // simple net: upward minus gravity

  const maxForce = 100;
  const clampedForce = Math.min(force, maxForce);
  const distanceScale = 2.3;
  const travel = clampedForce * distanceScale;

  // Inject keyframes for rocket animation once
  useEffect(() => {
    const styleId = "rocket-flight-keyframes";
    if (document.getElementById(styleId)) return;
    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.innerHTML = `
      @keyframes rocketFlight {
        0% { transform: translateY(0); }
        30% { transform: translateY(-80px); }
        60% { transform: translateY(-180px); }
        100% { transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleEl);
  }, []);

  // Mini parser: pull m / a from text when user types them
  useEffect(() => {
    if (!formulaText) return;
    const mMatch = formulaText.match(/m\s*=\s*([\d.]+)/i);
    const aMatch = formulaText.match(/a\s*=\s*([\d.]+)/i);

    if (mMatch) {
      const mVal = parseFloat(mMatch[1]);
      if (!Number.isNaN(mVal) && mVal > 0) setMass(mVal);
    }
    if (aMatch) {
      const aVal = parseFloat(aMatch[1]);
      if (!Number.isNaN(aVal) && aVal >= 0) setAcc(aVal);
    }
  }, [formulaText]);

  // SLIDE: run button
  const handleRunSlide = () => {
    setViewMode("slide");
    setHasRunOnce(true);
    setRunningSlide(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRunningSlide(true));
    });
  };

  // ROCKET controls
  const handleRocketPlay = () => {
    setViewMode("rocket");
    setHasRunOnce(true);
    setRocketPaused(false);
    setRocketRunning(false);
    // bump key so animation restarts from ground
    setRocketCycle((c) => c + 1);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRocketRunning(true));
    });
  };

  const handleRocketPause = () => {
    if (!rocketRunning) return;
    setRocketPaused((prev) => !prev);
  };

  const handleRocketStop = () => {
    setRocketRunning(false);
    setRocketPaused(false);
    setRocketCycle((c) => c + 1); // reset to ground
  };

  // FUN, SHORT NARRATION
  const narrationLines = useMemo(() => {
    const lines: string[] = [];

    if (viewMode === "slide") {
      if (!hasRunOnce) {
        lines.push("👋 Hey physicist! This block is your test dummy.");
      } else if (runningSlide && force > 0) {
        lines.push("🚀 Nice shove! Watch the block slide across the track.");
      } else {
        lines.push("🔁 Tweak mass or acceleration, then run it again.");
      }

      lines.push(
        `m = ${mass.toFixed(1)} kg · a = ${acc.toFixed(
          1
        )} m/s² → F ≈ ${force.toFixed(1)} N`
      );

      if (force === 0 || acc === 0) {
        lines.push("Right now F = 0 N, so the block just chills. Add some a.");
      } else if (force < 20) {
        lines.push("Small force: a gentle nudge, it creeps forward.");
      } else if (force < 60) {
        lines.push("Medium force: solid shove, clearly speeding up.");
      } else {
        lines.push("Huge force: mega shove — imagine a rocket-powered cart.");
      }
    } else {
      // Rocket mode
      if (!hasRunOnce) {
        lines.push("🚀 Rocket lab online. Give it thrust and hit Play.");
      } else if (rocketRunning && !rocketPaused) {
        lines.push("⬆️ Liftoff! Upwards thrust is battling gravity.");
      } else if (rocketPaused) {
        lines.push("⏸ Paused mid-flight. Check the numbers on the side.");
      } else {
        lines.push("🔁 Ready for another launch. Tune m or a and Play.");
      }

      lines.push(
        `Up thrust: a_up = ${acc.toFixed(
          1
        )} m/s², gravity g ≈ 9.8 m/s² → a_net ≈ ${netAccRocket.toFixed(1)} m/s²`
      );

      if (acc < g) {
        lines.push("Gravity wins: it jumps a bit, then falls back down.");
      } else if (acc < g + 5) {
        lines.push("Almost balanced: slow climb, then it starts dropping.");
      } else {
        lines.push("Thrust dominates: strong climb before gravity drags it back.");
      }
    }

    return lines;
  }, [
    viewMode,
    hasRunOnce,
    runningSlide,
    rocketRunning,
    rocketPaused,
    mass,
    acc,
    force,
    netAccRocket,
    g,
  ]);

  // Rocket animation style
  const rocketStyle: React.CSSProperties = rocketRunning
    ? {
        animationName: "rocketFlight",
        animationDuration: "3s",
        animationTimingFunction: "linear",
        animationFillMode: "forwards",
        animationPlayState: rocketPaused ? ("paused" as const) : ("running" as const),
      }
    : { transform: "translateY(0)" };

  return (
    <div className="rounded-2xl border border-cyan-500/60 bg-slate-950/90 p-4 flex flex-col gap-3 h-full">
      {/* Header + view toggle */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs md:text-sm font-semibold text-cyan-100">
            Live Formula Playground
          </h2>
          <p className="text-[11px] text-slate-400">
            Use Newton&apos;s Second Law, then pick a view: sliding block or rocket
            launch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-slate-900 border border-slate-700 p-1 text-[10px]">
            <button
              type="button"
              onClick={() => setViewMode("slide")}
              className={
                "px-3 py-1 rounded-full " +
                (viewMode === "slide"
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "text-slate-200 hover:bg-slate-800")
              }
            >
              Slide lab
            </button>
            <button
              type="button"
              onClick={() => setViewMode("rocket")}
              className={
                "px-3 py-1 rounded-full " +
                (viewMode === "rocket"
                  ? "bg-violet-500 text-slate-950 font-semibold"
                  : "text-slate-200 hover:bg-slate-800")
              }
            >
              Rocket lab
            </button>
          </div>
        </div>
      </div>

      {sourceLabel && (
        <div className="text-[10px] text-slate-300 bg-slate-900/80 border border-slate-700 rounded-full px-3 py-1 inline-flex items-center gap-1">
          <span className="text-cyan-400">●</span>
          <span>Current source: {sourceLabel}</span>
        </div>
      )}

      {/* Formula controls */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-100 font-semibold">
          <span>F</span>
          <span className="text-cyan-300">=</span>
          <span>m</span>
          <span className="text-cyan-300">·</span>
          <span>a</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-200 mt-1">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-slate-400">
              Mass (m, kg)
            </label>
            <input
              type="number"
              min={0.5}
              max={100}
              step={0.5}
              value={mass}
              onChange={(e) => setMass(Number(e.target.value) || 0)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-slate-400">
              Acceleration (a, m/s²)
            </label>
            <input
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={acc}
              onChange={(e) => setAcc(Number(e.target.value) || 0)}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wide text-slate-400">
              Force (F, N)
            </label>
            <div className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs flex items-center justify-between">
              <span className="font-semibold text-cyan-300">
                {force.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500">N</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick, fun narration */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-[11px] text-slate-200 flex flex-col gap-1 h-20 md:h-24 overflow-y-auto">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs">💬</span>
          <span className="text-[11px] font-semibold text-cyan-200">
            Quick lab notes
          </span>
        </div>
        {narrationLines.map((line, idx) => (
          <p key={idx} className="leading-snug">
            {line}
          </p>
        ))}
      </div>

      {/* Main sandbox area */}
      {viewMode === "slide" ? (
        <div className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 flex flex-col gap-2 h-52 md:h-56">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>2D sandbox (top-down)</span>
            <span>Block, ground, and force arrow act as a tiny virtual lab.</span>
          </div>

          <div className="relative mt-2 flex-1 rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden border border-slate-800">
            {/* Ground */}
            <div className="absolute left-0 right-0 bottom-6 h-1.5 bg-slate-700/80" />

            {/* Block */}
            <div
              className="absolute bottom-6 left-6 w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/40 transition-transform duration-700 ease-out"
              style={{
                transform: runningSlide
                  ? `translateX(${travel}px)`
                  : "translateX(0px)",
              }}
            />

            {/* Force arrow */}
            <div
              className="absolute bottom-20 left-6 flex items-center gap-1 transition-all duration-700 ease-out"
              style={{
                width: 35 + clampedForce,
              }}
            >
              <div className="h-1 bg-rose-500 flex-1" />
              <div className="w-0 h-0 border-t-4 border-b-4 border-l-[8px] border-t-transparent border-b-transparent border-l-rose-500" />
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 text-[10px] text-slate-300 bg-slate-950/80 px-2 py-1 rounded-full border border-slate-700">
              m = {mass.toFixed(1)} kg, a = {acc.toFixed(1)} m/s²
            </div>
            <div className="absolute top-3 right-3 text-[10px] text-rose-300 bg-slate-950/80 px-2 py-1 rounded-full border border-rose-500/70">
              F = {force.toFixed(1)} N
            </div>
          </div>

          {/* Run button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRunSlide}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 shadow shadow-cyan-500/40"
            >
              Run slide simulation
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 flex flex-col gap-2 h-52 md:h-56">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Rocket sandbox (side view)</span>
            <span>See thrust vs gravity with a simple launch &amp; fall.</span>
          </div>

          <div className="relative mt-2 flex-1 rounded-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden border border-slate-800">
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-slate-800" />

            {/* Height markers */}
            <div className="absolute left-2 bottom-6 text-[9px] text-slate-500 flex flex-col justify-between h-40">
              <span>High</span>
              <span>Mid</span>
              <span>Ground</span>
            </div>

            {/* Rocket + label */}
            <div
              key={rocketCycle}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
              style={rocketStyle}
            >
              <div className="w-4 h-8 bg-gradient-to-b from-rose-400 via-rose-500 to-amber-300 rounded-full relative shadow-lg shadow-rose-500/40">
                {/* Nose cone */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-emerald-300" />
                {/* Fins */}
                <div className="absolute bottom-1 -left-2 w-2 h-2 bg-rose-500 rotate-45 rounded-sm" />
                <div className="absolute bottom-1 -right-2 w-2 h-2 bg-rose-500 -rotate-45 rounded-sm" />
              </div>

              {/* Little flame when running */}
              {rocketRunning && !rocketPaused && (
                <div className="w-3 h-3 bg-gradient-to-t from-amber-400 via-yellow-300 to-transparent rounded-full blur-[1px]" />
              )}

              {/* Text bubble beside rocket */}
              <div className="mt-1 max-w-[150px] text-[10px] bg-slate-950/90 border border-slate-700 rounded-xl px-2 py-1 text-slate-200">
                {netAccRocket <= 0
                  ? "Thrust can't beat gravity, so this jump is short."
                  : `Net up accel ≈ ${netAccRocket.toFixed(
                      1
                    )} m/s² — it climbs before gravity pulls it back.`}
              </div>
            </div>

            {/* Gravity label */}
            <div className="absolute top-3 right-3 text-[10px] text-slate-300 bg-slate-950/80 px-2 py-1 rounded-full border border-slate-700">
              g ≈ 9.8 m/s²
            </div>
          </div>

          {/* Rocket controls */}
          <div className="flex items-center justify-between gap-3 mt-1">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRocketPlay}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow shadow-emerald-600/40"
              >
                ▶ Play
              </button>
              <button
                type="button"
                onClick={handleRocketPause}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100"
              >
                {rocketPaused ? "⏯ Resume" : "⏸ Pause"}
              </button>
              <button
                type="button"
                onClick={handleRocketStop}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-rose-500 hover:bg-rose-400 text-slate-950"
              >
                ⏹ Stop
              </button>
            </div>
            <span className="text-[10px] text-slate-400">
              Tip: try m small + a big, then m big + a small.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
