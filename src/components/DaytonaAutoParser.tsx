import React, { useState } from "react";

type ParsedFormula = {
  formula: string;
  variables?: string[];
  description?: string;
};

const DaytonaAutoParser: React.FC = () => {
  const [inputText, setInputText] = useState(
    "In classical mechanics we often use F = m * g to describe weight."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formulas, setFormulas] = useState<ParsedFormula[]>([]);

  const handleParse = async () => {
    setLoading(true);
    setError(null);
    setFormulas([]);

    try {
      const res = await fetch("http://localhost:3001/api/parse-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`HTTP ${res.status}: ${t}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Backend error");
      }

      const parsed = (data.parsed?.formulas || []) as ParsedFormula[];
      setFormulas(parsed);
    } catch (e: any) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Auto Parser
          </h3>
          <p className="text-[11px] text-slate-400">
            Paste a sentence with a physics formula and let the backend parse it.
          </p>
        </div>
        <span className="text-[10px] font-medium text-slate-500">
          Powered by{" "}
          <span className="text-sky-300 font-semibold">Daytona.io</span>
        </span>
      </div>

      <textarea
        className="w-full h-20 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste text from your PDF / notes containing F = m * g, etc..."
      />

      <div className="flex items-center gap-3">
        <button
          onClick={handleParse}
          disabled={loading}
          className="rounded-lg bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-sky-950 shadow-md shadow-sky-500/40 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Parsing via Daytona..." : "Parse with Daytona Auto Parser"}
        </button>
        {error && (
          <span className="text-[11px] text-rose-400">
            Error: <span className="font-mono">{error}</span>
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Detected Formulas
        </h4>
        {formulas.length === 0 && !loading && (
          <p className="text-[11px] text-slate-500">
            Nothing yet. Try a sentence with{" "}
            <span className="font-mono">F = m * g</span>.
          </p>
        )}
        {formulas.map((f, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[11px]"
          >
            <div className="font-semibold text-sky-200">
              {f.formula || "Unknown formula"}
            </div>
            {f.variables && (
              <div className="mt-1 text-slate-400">
                Variables:{" "}
                <span className="font-mono">
                  {f.variables.join(", ")}
                </span>
              </div>
            )}
            {f.description && (
              <div className="mt-1 text-slate-400">{f.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaytonaAutoParser;
