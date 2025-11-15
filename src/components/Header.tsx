// src/components/Header.tsx

import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="w-full px-6 py-4 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md shadow-lg shadow-black/30">
      {/* Center-aligned logo and caption */}
      <div className="flex flex-col items-center text-center select-none">
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
    </header>
  );
};
