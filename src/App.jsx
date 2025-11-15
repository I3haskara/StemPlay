// src/App.jsx
import { useState } from "react";
import SimulationCanvas from "./components/SimulationCanvas";
import ControlPanel from "./components/ControlPanel";
import FormulaPanel from "./components/FormulaPanel";
import ThemeSelector from "./components/ThemeSelector";
import Dashboard from "./components/Dashboard";
import { THEMES } from "./theme/themeConfig";
import "./index.css";

export default function App() {
  const [mass, setMass] = useState(5);
  const [gravity, setGravity] = useState(1);
  const [height, setHeight] = useState(0);

  const [theme, setTheme] = useState("B"); // default to Gamified for dashboard
  const themeStyles = THEMES[theme];

  const [view, setView] = useState("dashboard"); // 'dashboard' | 'simulation'

  return (
    <div className={`min-h-screen ${themeStyles.bg} flex flex-col`}>

      {/* Header */}
      <header className={`${themeStyles.header} p-6 flex items-center justify-between`}>
        <div className="flex items-center gap-5">
          <img 
            src="/logo.png" 
            alt="STEMPlay AI Logo" 
            className="w-64 h-64 object-contain cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => setView("dashboard")}
            title="Go to Dashboard"
          />
          <h1 className="text-3xl sm:text-4xl font-bold">
            STEMPlay AI 🚀 — {THEMES[theme].name} Mode
          </h1>
        </div>

        {/* View toggle */}
        <div className="flex gap-4 text-xl">
          <button
            onClick={() => setView("dashboard")}
            className={`px-6 py-3 rounded-md border-2 font-semibold ${
              view === "dashboard"
                ? "bg-emerald-400 text-slate-900 border-emerald-300"
                : "bg-slate-900 text-slate-100 border-slate-600"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView("simulation")}
            className={`px-6 py-3 rounded-md border-2 font-semibold ${
              view === "simulation"
                ? "bg-emerald-400 text-slate-900 border-emerald-300"
                : "bg-slate-900 text-slate-100 border-slate-600"
            }`}
          >
            Simulation Lab
          </button>
        </div>
      </header>

      {/* Theme selector tabs below header */}
      <ThemeSelector theme={theme} setTheme={setTheme} />

      {/* Main content */}
      <main className="flex-1 p-8">
        {view === "dashboard" ? (
          <Dashboard theme={theme} />
        ) : (
          <div className="flex gap-8 h-full">
            <div className="flex-1 bg-slate-900/40 rounded-2xl p-6 border-2 border-slate-700 shadow-inner">
              <SimulationCanvas
                mass={mass}
                gravity={gravity}
                onHeightChange={setHeight}
              />
            </div>

            <div className="flex flex-col gap-6 w-auto">
              <ControlPanel
                mass={mass}
                setMass={setMass}
                gravity={gravity}
                setGravity={setGravity}
                themeStyles={themeStyles}
              />
              <FormulaPanel
                mass={mass}
                gravity={gravity}
                height={height}
                themeStyles={themeStyles}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
