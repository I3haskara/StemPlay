// =====================================
// File: src/components/FormulaSimulator.tsx
// =====================================
import React, { useState } from "react";

export const FormulaSimulator: React.FC = () => {
  // Simple F = m * a playground
  const [mass, setMass] = useState(5); // kg
  const [acc, setAcc] = useState(2); // m/s^2
  const [running, setRunning] = useState(false);

  const force = mass * acc; // Newtons
  const maxForce = 100;
  const clampedForce = Math.min(force, maxForce);
  const distanceScale = 3; // px per N (clamped)
  const travel = clampedForce * distanceScale;

  const handleRun = () => {
    // toggle animation by flipping "running" flag
    setRunning(false);
    // small timeout to re-trigger CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRunning(true);
      });
    });
  };

  return (
    <div className="rounded-2xl border border-cyan-500/60 bg-slate-950/90 p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs md:text-sm font-semibold text-cyan-100">
            Live Formula Playground
          </h2>
          <p className="text-[11px] text-slate-400">
            Explore Newton&apos;s Second Law: F = m · a. Change values, then run
            the 2D simulation.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRun}
          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 shadow shadow-cyan-500/40"
        >
          Run Simulation
        </button>
      </div>

      {/* Formula row */}
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

      {/* 2D scene */}
      <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>2D Visualization (top-down)</span>
          <span>
            Stronger force ➜ block slides further & arrow grows longer.
          </span>
        </div>

        <div className="relative mt-3 flex-1 rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden border border-slate-800">
          {/* Ground */}
          <div className="absolute left-0 right-0 bottom-6 h-1.5 bg-slate-700/80" />

          {/* Block (object) */}
          <div
            className="absolute bottom-6 left-6 w-10 h-10 rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/40 transition-transform duration-700 ease-out"
            style={{
              transform: running ? `translateX(${travel}px)` : "translateX(0px)",
            }}
          />

          {/* Force arrow */}
          <div
            className="absolute bottom-20 left-6 flex items-center gap-1 transition-all duration-700 ease-out"
            style={{
              width: 40 + clampedForce, // arrow length
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

        <p className="text-[10px] text-slate-500 mt-1">
          This is intentionally simple and 2D so it feels like a tiny physics
          sandbox. You can extend this pattern for other formulas (projectile
          motion, energy, etc.) and attach more shapes / objects like in a
          Unity-style editor.
        </p>
      </div>
    </div>
  );
};
