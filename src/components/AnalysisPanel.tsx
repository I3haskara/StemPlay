// =====================================
// File: src/components/AnalysisPanel.tsx
// =====================================
import React, { useState, DragEvent } from "react";
import { FormulaSimulator } from "./FormulaSimulator";

type InputKind = "video" | "pdfNotes" | "formula";

export const AnalysisPanel: React.FC = () => {
  const [inputKind, setInputKind] = useState<InputKind>("formula");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [textInput, setTextInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFile(file: File) {
    setFileName(file.name);
    // For now this demo just notes the file name.
    // In the full build you'll send this to a backend (HURIDOCS / OCR).
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex justify-center items-center p-6 md:p-10">
      <div className="w-full max-w-6xl grid gap-6 lg:grid-cols-[1.3fr,1.2fr]">
        {/* LEFT SIDE: INPUT PANEL */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl px-5 py-6 flex flex-col gap-4">
          {/* Heading with background */}
          <div 
            className="flex flex-col gap-1 rounded-2xl p-6 bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ backgroundImage: 'url(/background.png)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/70 to-slate-950/80 backdrop-blur-[2px]" />
            <div className="relative z-10">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50 drop-shadow-lg">
                STEMPlay AI — Visual Physics Editor
              </h1>
              <p className="text-xs md:text-sm text-slate-200 drop-shadow-md">
                Choose how you want to start, then we turn formulas & notes into a
                live 2D visualization on the right.
              </p>
            </div>
          </div>

          {/* Input type selector */}
          <section className="rounded-2xl bg-slate-950 border border-slate-800 p-3 flex flex-col gap-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              1 · How do you want to give the content?
            </h2>
            <div className="flex flex-wrap gap-2 mt-1">
              <button
                type="button"
                onClick={() => setInputKind("video")}
                className={
                  "px-3 py-1.5 rounded-full text-[11px] md:text-xs border transition-all " +
                  (inputKind === "video"
                    ? "bg-violet-500 text-slate-950 border-violet-300 shadow shadow-violet-500/40"
                    : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800")
                }
              >
                Video / Lecture link
              </button>
              <button
                type="button"
                onClick={() => setInputKind("pdfNotes")}
                className={
                  "px-3 py-1.5 rounded-full text-[11px] md:text-xs border transition-all " +
                  (inputKind === "pdfNotes"
                    ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow shadow-cyan-500/40"
                    : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800")
                }
              >
                PDF / Notes file
              </button>
              <button
                type="button"
                onClick={() => setInputKind("formula")}
                className={
                  "px-3 py-1.5 rounded-full text-[11px] md:text-xs border transition-all " +
                  (inputKind === "formula"
                    ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow shadow-emerald-500/40"
                    : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800")
                }
              >
                Formula + quick notes
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              • Video: paste a YouTube / lecture link. <br />
              • PDF / Notes: drag-drop files (future: auto OCR + transcript).{" "}
              <br />• Formula: type F = m · a, projectile equations, etc.
            </p>
          </section>

          {/* YOUTUBE / VIDEO LINK (shown for any mode; emphasized when "video" chosen) */}
          <section className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📺</span>
                <div>
                  <h3 className="text-xs md:text-sm font-semibold text-slate-100">
                    YouTube / Video link
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Paste a lecture link. In the full version we auto-fetch the
                    transcript and visualize it.
                  </p>
                </div>
              </div>
              {inputKind === "video" && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/20 border border-violet-400/70 text-violet-100">
                  Active choice
                </span>
              )}
            </div>

            <input
              type="url"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs md:text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500"
              placeholder="Paste YouTube or video URL here (e.g., https://youtube.com/watch?v=...)"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />

            <button
              type="button"
              className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 text-xs md:text-sm font-semibold py-2 shadow shadow-violet-600/40"
            >
              <span>🎬 Analyze Video (demo)</span>
            </button>

            <p className="text-[10px] text-slate-500">
              For this hack slice we don&apos;t actually call YouTube yet – we
              show where BrowserUse / Daytona would plug in.
            </p>
          </section>

          {/* UPLOAD AREA FOR PDF / NOTES */}
          <section className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <div>
                  <h3 className="text-xs md:text-sm font-semibold text-slate-100">
                    Upload notes / slides / screenshots
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Drop a physics PDF, PPT or screenshot. In the full version
                    we pass it through the HURIDOCS layout analyzer + OCR.
                  </p>
                </div>
              </div>
              {inputKind === "pdfNotes" && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/70 text-cyan-100">
                  Active choice
                </span>
              )}
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex flex-col items-center justify-center gap-2 px-3 py-6 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/80 text-center cursor-pointer hover:border-cyan-400 hover:bg-slate-900 transition-colors"
            >
              <p className="text-xs text-slate-100">Drag &amp; drop a file</p>
              <p className="text-[11px] text-slate-400">
                Supported for now: we just record the file name. In the real
                pipeline this is sent to PDF layout + OCR.
              </p>
              <label className="mt-2 inline-flex items-center px-3 py-1.5 rounded-full bg-slate-900 border border-slate-600 text-[11px] text-slate-200 hover:border-cyan-400">
                <span>Browse files</span>
                <input
                  type="file"
                  accept=".txt,.pdf,.ppt,.pptx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </label>
              {fileName && (
                <span className="text-[11px] text-cyan-300 mt-1">
                  Selected: {fileName}
                </span>
              )}
            </div>
          </section>

          {/* TEXT / FORMULA INPUT */}
          <section className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">✏️</span>
                <div>
                  <h3 className="text-xs md:text-sm font-semibold text-slate-100">
                    Text &amp; formula input
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Type or paste a formula and any plain language notes. The
                    right panel shows a live 2D example.
                  </p>
                </div>
              </div>
              {inputKind === "formula" && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/70 text-emerald-100">
                  Active choice
                </span>
              )}
            </div>

            <textarea
              className="w-full h-28 md:h-32 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs md:text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 resize-none font-mono leading-relaxed text-slate-200"
              placeholder="Example: 'Newton's Second Law, F = m * a, where F is force, m is mass, and a is acceleration...'"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setTextInput("")}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 hover:bg-slate-800"
              >
                Clear
              </button>
              <button
                type="button"
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs md:text-sm font-semibold text-slate-950 shadow shadow-emerald-600/40"
              >
                Analyze with AI (future hook)
              </button>
            </div>

            <p className="text-[10px] text-slate-500">
              For the hack demo, the right panel uses a built-in F = m · a
              playground. Later we can map arbitrary formulas to different
              visual templates.
            </p>
          </section>
        </div>

        {/* RIGHT SIDE: SIMULATION / VISUALIZATION */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/95 shadow-2xl p-4 flex flex-col gap-3">
          <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-300">
            2 · Visual formula sandbox
          </h2>
          <p className="text-[11px] text-slate-400 mb-1">
            This panel is where formulas become playable 2D examples. For now
            we showcase Newton&apos;s Second Law, but the same layout can host
            multiple formula templates.
          </p>
          <FormulaSimulator />
        </div>
      </div>
    </div>
  );
};
