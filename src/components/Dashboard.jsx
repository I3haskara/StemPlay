// src/components/Dashboard.jsx
import React from "react";
import { THEMES } from "../theme/themeConfig";

const modules = [
  {
    id: "physics-101",
    title: "Mass & Gravity Explorer",
    level: "Foundation",
    status: "In progress",
    tag: "Physics",
  },
  {
    id: "rocket-basics",
    title: "Launch Dynamics",
    level: "Intermediate",
    status: "Locked",
    tag: "Applied Physics",
  },
  {
    id: "gas-law",
    title: "Ideal Gas Law Lab",
    level: "Advanced",
    status: "Planned",
    tag: "Thermodynamics",
  },
];

const quickChecks = [
  { id: "check-01", title: "Concept Check · F = m · g", est: "5 min" },
  { id: "check-02", title: "Target Force Challenge", est: "8 min" },
];

const sessions = [
  { id: 1, module: "Mass & Gravity Explorer", outcome: "Score 8 / 10", time: "Today · 14:32" },
  { id: 2, module: "Mass & Gravity Explorer", outcome: "Score 6 / 10", time: "Yesterday · 19:05" },
  { id: 3, module: "Sandbox Session", outcome: "Free exploration", time: "2 days ago · 17:21" },
];

export default function Dashboard({ theme }) {
  const themeStyles = THEMES[theme];

  return (
    <div className="w-full h-full flex justify-center">
      {/* Centered container */}
      <div className="max-w-7xl w-full flex flex-col gap-10 mx-auto text-base">
        {/* Top row: Overview + snapshot */}
        <div className="grid grid-cols-3 gap-10">
          {/* Overview card */}
          <div className="col-span-2 rounded-2xl border-2 border-slate-700/70 bg-slate-900/80 p-10 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-semibold text-sky-100 tracking-tight">
                STEMPlay AI — Session Workspace
              </h1>

              {/* Functional feature list instead of flavor text */}
              <div className="grid grid-cols-3 gap-6 text-lg text-slate-300">
                <div className="space-y-2">
                  <p className="uppercase tracking-wide text-slate-500 text-base">
                    Modules
                  </p>
                  <p>Interactive physics simulations with adjustable variables.</p>
                </div>
                <div className="space-y-2">
                  <p className="uppercase tracking-wide text-slate-500 text-base">
                    Checks
                  </p>
                  <p>Short concept checks linked to each module.</p>
                </div>
                <div className="space-y-2">
                  <p className="uppercase tracking-wide text-slate-500 text-base">
                    History
                  </p>
                  <p>Session log with scores and timestamps.</p>
                </div>
              </div>
            </div>

            {/* Simple metrics row */}
            <div className="mt-10 grid grid-cols-3 gap-6 text-base text-slate-200">
              <div>
                <p className="uppercase tracking-wide text-slate-400 text-sm">
                  Current streak
                </p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">3 days</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-slate-400 text-sm">
                  Modules completed
                </p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">5</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-slate-400 text-sm">
                  Focus time (this week)
                </p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">42 min</p>
              </div>
            </div>
          </div>

          {/* Snapshot card */}
          <div className={`rounded-2xl ${themeStyles.panel} p-8 flex flex-col justify-between`}>
            <div>
              <p className={`text-lg uppercase tracking-wide ${themeStyles.text} opacity-70`}>
                Session snapshot
              </p>
              <div className="mt-5 space-y-3 text-lg">
                <p className={themeStyles.text}>
                  Last module:{" "}
                  <span className="font-semibold text-sky-300">
                    Mass &amp; Gravity Explorer
                  </span>
                </p>
                <p className={themeStyles.text}>
                  Best score:{" "}
                  <span className="font-semibold text-emerald-300">8 / 10</span>
                </p>
                <p className={themeStyles.text}>
                  View: <span className="font-semibold">{THEMES[theme].name}</span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-base text-slate-400 mb-2">Weekly activity</p>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-3/5 bg-gradient-to-r from-emerald-400 to-sky-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: Modules / Checks / History */}
        <div className="grid grid-cols-3 gap-10">
          {/* Modules list */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-wide text-slate-300 uppercase">
                Modules
              </h2>
              <span className="text-lg text-slate-400">
                Select a module to open in Simulation Lab.
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border-2 border-slate-700/70 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-sky-500/80 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm uppercase tracking-wide text-slate-500">
                      {m.level}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-100 leading-snug">
                      {m.title}
                    </h3>
                    <p className="mt-3 text-base text-slate-400">{m.tag}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-base">
                    <span className="px-3 py-2 rounded-full bg-slate-800 text-slate-200">
                      {m.status}
                    </span>
                    <span className="text-sky-300 font-medium">Open ▶</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Concept checks */}
            <div className={`${themeStyles.panel} rounded-2xl p-6`}>
              <h2 className="text-xl font-semibold tracking-wide text-slate-300 uppercase">
                Concept checks
              </h2>
              <p className="text-base text-slate-400 mt-2">
                Short tasks linked to the current module.
              </p>
              <div className="mt-5 space-y-3 text-base">
                {quickChecks.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between rounded-lg bg-slate-900/75 px-4 py-3 hover:bg-slate-800 cursor-pointer"
                  >
                    <div>
                      <p className="text-slate-100 font-medium text-lg">{q.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{q.est}</p>
                    </div>
                    <span className="text-base text-emerald-300 font-mono">
                      Start
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Session history */}
            <div className={`${themeStyles.panel} rounded-2xl p-6`}>
              <h2 className="text-xl font-semibold tracking-wide text-slate-300 uppercase">
                Session history
              </h2>
              <div className="mt-5 space-y-3 text-base max-h-60 overflow-y-auto">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-md bg-slate-900/75 px-4 py-3 flex flex-col"
                  >
                    <p className="text-slate-100 font-medium text-lg">{s.module}</p>
                    <div className="flex justify-between text-sm text-slate-400 mt-2">
                      <span>{s.outcome}</span>
                      <span>{s.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
