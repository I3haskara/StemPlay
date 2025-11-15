// src/components/Header.tsx

import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="w-full px-6 py-4 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md shadow-lg shadow-black/30">
      {/* Full-width flex */}
      <div className="w-full flex items-center justify-between">
        
        {/* LEFT — MODE BUTTONS */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/40 border border-blue-300/50 hover:bg-blue-500 transition">
            Generalized
          </button>

          <button className="px-4 py-2 rounded-lg bg-slate-900 text-slate-200 text-xs border border-slate-700 hover:border-blue-300/60 hover:bg-slate-800 transition">
            Science Lab
          </button>

          <button className="px-4 py-2 rounded-lg bg-slate-900 text-slate-200 text-xs border border-slate-700 hover:border-blue-300/60 hover:bg-slate-800 transition">
            Kids Mode
          </button>
        </div>

        {/* CENTER — LOGO + TITLE */}
        <div className="flex flex-col items-center text-center -mt-1 select-none">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="STEMPlay"
            className="w-44 opacity-95 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]"
          />

          {/* Caption */}
          <p className="text-sm text-cyan-300/80 tracking-wide mt-1 font-medium">
            Visualize. Simulate. Understand.
          </p>
        </div>

        {/* RIGHT — NAV BUTTONS */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/40 border border-emerald-300/50 hover:bg-emerald-500 transition">
            Dashboard
          </button>

          <button className="px-4 py-2 rounded-lg bg-slate-900 text-slate-200 text-xs border border-slate-700 hover:border-cyan-400/60 hover:bg-slate-800 transition">
            Simulation Lab
          </button>
        </div>

      </div>
    </header>
  );
};
