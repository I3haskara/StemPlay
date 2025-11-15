// =====================================
// File: src/components/AnalysisPanel.tsx
// =====================================
import React, { DragEvent, useState } from "react";
import { FormulaSimulator } from "./FormulaSimulator";
import DaytonaAutoParser from "./DaytonaAutoParser";

type InputKind = "video" | "pdfNotes" | "formula";

export const AnalysisPanel: React.FC = () => {
  const [inputKind, setInputKind] = useState<InputKind>("formula");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [textInput, setTextInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [currentSourceLabel, setCurrentSourceLabel] =
    useState<string>("No source selected");

  // 🔔 Simple upload popup
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  // 🎬 YouTube parsing state
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  function showUploadToast(message: string) {
    setUploadToast(message);
    setTimeout(() => setUploadToast(null), 2200);
  }

  function updateSourceFromVideo(url: string) {
    if (!url) return;
    try {
      const u = new URL(url);
      setCurrentSourceLabel(`Video: ${u.hostname}${u.pathname}`);
    } catch {
      setCurrentSourceLabel("Video: custom link");
    }
  }

  async function handleAnalyzeVideo() {
    if (!youtubeUrl || !youtubeUrl.includes("youtube.com")) {
      setYoutubeError("Please enter a valid YouTube URL");
      return;
    }

    setYoutubeLoading(true);
    setYoutubeError(null);

    try {
      const res = await fetch("http://localhost:3001/api/youtube-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      
      // Update source label
      updateSourceFromVideo(youtubeUrl);
      
      // Auto-populate text input with formulas found
      if (data.formulas && data.formulas.length > 0) {
        const formulaText = data.formulas
          .map((f: any) => `${f.formula} - ${f.description || 'No description'}`)
          .join("\n");
        setTextInput(formulaText);
        showUploadToast(`Found ${data.formulas.length} formula(s) from video transcript!`);
      } else {
        showUploadToast("Video analyzed, but no formulas detected.");
      }
    } catch (err: any) {
      setYoutubeError(err.message || "Failed to analyze video");
      console.error("YouTube parse error:", err);
    } finally {
      setYoutubeLoading(false);
    }
  }

  function handleFile(file: File) {
    setFileName(file.name);
    setCurrentSourceLabel(`Notes: ${file.name}`);
    showUploadToast(`Uploaded: ${file.name}`);
    // later: send to backend (PDF → layout → OCR)
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

  function handleAnalyzeFormulaClick() {
    if (textInput.trim().length === 0) return;
    setCurrentSourceLabel("Formula: text input");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col">
      {/* Upload popup */}
      {uploadToast && (
        <div className="fixed inset-0 z-40 flex items-start justify-center mt-16 pointer-events-none">
          <div className="pointer-events-auto rounded-2xl bg-slate-950/95 border border-cyan-500/70 px-4 py-2 shadow-xl shadow-cyan-500/30 text-xs md:text-sm text-cyan-100 flex items-center gap-2">
            <span>✅</span>
            <span>{uploadToast}</span>
          </div>
        </div>
      )}

      {/* Top bar */}
      <header 
        className="w-full px-6 md:px-10 py-4 flex items-center justify-between border-b border-slate-800/80 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url("/top panel background .png")' }}
      >
        {/* Background overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/60" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="STEMPlay AI Logo" 
            className="h-10 w-auto object-contain"
          />
          <span className="hidden md:inline text-[11px] text-slate-400">
            Visualize. Simulate. Understand.
          </span>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="inline-flex rounded-full bg-slate-900 border border-slate-700 p-1 text-[11px]">
            <button className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-semibold shadow shadow-emerald-600/40">
              Dashboard
            </button>
            <button className="px-3 py-1 rounded-full text-slate-300 hover:bg-slate-800 transition-colors">
              Simulation Lab
            </button>
          </div>
          <div className="hidden md:flex items-center text-[10px] bg-slate-900/80 border border-slate-700 rounded-full px-3 py-1 text-slate-300 max-w-xs truncate">
            <span className="text-cyan-400 mr-1">●</span>
            <span className="truncate">Source: {currentSourceLabel}</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 flex justify-center items-stretch p-6 md:p-10">
        <div className="w-full max-w-6xl grid gap-6 lg:grid-cols-[1.3fr,1.2fr]">
          {/* LEFT: input panel */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl px-5 py-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                STEMPlay AI — Visual Physics Editor
              </h1>
              <p className="text-xs md:text-sm text-slate-300">
                Choose how you want to start, then we turn formulas &amp; notes
                into a live 2D visualization on the right.
              </p>
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
                  Video / lecture link
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
                  PDF / notes file
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

            {/* Video link */}
            <section className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📺</span>
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-slate-100">
                      YouTube / Video link
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Paste a lecture link. In the full version we auto-fetch
                      the transcript and visualize it.
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
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  setYoutubeError(null);
                }}
              />

              <button
                type="button"
                onClick={handleAnalyzeVideo}
                disabled={youtubeLoading || !youtubeUrl}
                className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 text-xs md:text-sm font-semibold py-2 shadow shadow-violet-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{youtubeLoading ? "🔄 Analyzing..." : "🎬 Analyze Video & Extract Formulas"}</span>
            </button>

              {youtubeError && (
                <p className="text-[10px] text-rose-400">
                  ⚠️ {youtubeError}
                </p>
              )}

              <p className="text-[10px] text-slate-500">
                This feature fetches the YouTube transcript and uses Daytona AI to automatically extract physics formulas. The formulas will appear in the text input below.
              </p>
            </section>

            {/* Upload section */}
            <section className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-slate-100">
                      Upload notes / slides / screenshots
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Drop a physics PDF, PPT or screenshot. For now we just
                      record the file and confirm upload; later this goes
                      through HURIDOCS + OCR.
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
                  Supported for now: we just keep the filename and update the
                  source. In the real pipeline this is sent to PDF layout +
                  OCR.
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

            {/* Text / formula input */}
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
                      right panel shows a live 2D example and commentary.
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
                placeholder="Example: 'Newton's Second Law, F = m * a, where F is force, m is mass, and a is acceleration... Let m = 4 and a = 2.'"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTextInput("");
                    setCurrentSourceLabel("No source selected");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 hover:bg-slate-800"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleAnalyzeFormulaClick}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs md:text-sm font-semibold text-slate-950 shadow shadow-emerald-600/40"
                >
                  Analyze with AI (future hook)
                </button>
              </div>

              <p className="text-[10px] text-slate-500">
                For the hack demo, if you include snippets like &quot;m = 4&quot; and
                &quot;a = 2&quot; here, the sandbox will auto-apply those values
                and update both the text explanation and the animation.
              </p>
            </section>

            {/* DAYTONA AUTO PARSER - Sponsor Integration */}
            <section className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-slate-100">
                      Daytona AI Auto-Parser
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Powered by Daytona workspace automation. Paste physics text
                      and let AI extract formulas automatically.
                    </p>
                  </div>
                </div>
              </div>

              <DaytonaAutoParser />
            </section>
          </div>

          {/* RIGHT: visual sandbox */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/95 shadow-2xl p-4 flex flex-col gap-3">
            <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-300">
              2 · Visual formula sandbox
            </h2>
            <p className="text-[11px] text-slate-400 mb-1">
              This panel is where formulas become playable 2D examples{" "}
              <span className="text-slate-200 font-semibold">
                with live text narration
              </span>
              . For now we showcase Newton&apos;s Second Law.
            </p>
            <FormulaSimulator
              sourceLabel={currentSourceLabel}
              formulaText={textInput}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
