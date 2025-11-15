export default function ThemeSelector({ theme, setTheme, view, setView }) {
  const buttons = [
    { id: "B", label: "Gamified" },
    { id: "C", label: "Science Lab" },
    { id: "D", label: "Kids Mode" },
  ];

  return (
    <div className="flex items-center justify-between px-8 py-3 bg-slate-800/50 border-b border-slate-700">
      {/* Theme tabs */}
      <div className="flex gap-2">
        {buttons.map((b) => (
          <button
            key={b.id}
            onClick={() => setTheme(b.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${theme === b.id ? "bg-blue-600 text-white shadow-lg" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}
            `}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("dashboard")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${view === "dashboard" ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}
          `}
        >
          Dashboard
        </button>
        <button
          onClick={() => setView("simulation")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${view === "simulation" ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}
          `}
        >
          Simulation Lab
        </button>
      </div>
    </div>
  );
}
