export default function ThemeSelector({ theme, setTheme }) {
  const buttons = [
    { id: "B", label: "Gamified" },
    { id: "C", label: "Science Lab" },
    { id: "D", label: "Kids Mode" },
  ];

  return (
    <div className="flex gap-2 px-8 py-3 bg-slate-800/50 border-b border-slate-700">
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
  );
}
