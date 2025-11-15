import React, { useState } from "react";

interface SocialSharePanelProps {
  /** Short label for the current lesson, e.g. "Newton's Second Law" */
  currentLessonTitle?: string;
  /** Short summary of what the sandbox is showing, e.g. "m = 4 kg, a = 2 m/s² → F = 8 N" */
  currentLessonSummary?: string;
}

interface Friend {
  id: number;
  name: string;
  streak: number;
  lastLesson: string;
}

interface SharedLesson {
  id: number;
  title: string;
  summary: string;
  sharedBy: string;
  timestampLabel: string;
  isYou: boolean;
}

export const SocialSharePanel: React.FC<SocialSharePanelProps> = ({
  currentLessonTitle = "Newton's Second Law – F = m · a",
  currentLessonSummary = "m = 4.0 kg, a = 2.0 m/s² → F ≈ 8.0 N",
}) => {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: "Aditi",
      streak: 3,
      lastLesson: "Projectile Motion Basics",
    },
    {
      id: 2,
      name: "Leo",
      streak: 1,
      lastLesson: "Work & Energy – Intro",
    },
  ]);

  const [sharedLessons, setSharedLessons] = useState<SharedLesson[]>([
    {
      id: 1,
      title: "Weight as W = m · g",
      summary: "m = 5 kg, g = 9.8 m/s² → W ≈ 49 N (downwards).",
      sharedBy: "Aditi",
      timestampLabel: "10 min ago",
      isYou: false,
    },
    {
      id: 2,
      title: "Friction lab – tiny block vs. heavy block",
      summary: "Comparing motion when friction changes.",
      sharedBy: "Leo",
      timestampLabel: "1 hr ago",
      isYou: false,
    },
  ]);

  const [newFriendName, setNewFriendName] = useState("");
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleAddFriend = () => {
    const trimmed = newFriendName.trim();
    if (!trimmed) return;

    setFriends((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: trimmed,
        streak: 0,
        lastLesson: "No lessons yet",
      },
    ]);
    setNewFriendName("");
  };

  const handleShareLesson = () => {
    // For the hack demo we just add to local list
    const now = new Date();
    const label = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const entry: SharedLesson = {
      id: Date.now(),
      title: currentLessonTitle,
      summary: currentLessonSummary,
      sharedBy: "You",
      timestampLabel: `Today · ${label}`,
      isYou: true,
    };

    setSharedLessons((prev) => [entry, ...prev]);
    setShareStatus("Shared with your study circle ✔ This is a local demo feed.");
    setTimeout(() => setShareStatus(null), 3500);
  };

  return (
    <section className="w-full lg:w-[320px] xl:w-[360px] bg-slate-950/70 border border-cyan-500/40 rounded-xl px-4 py-4 flex flex-col gap-3 shadow-[0_0_20px_rgba(34,211,238,0.18)]">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold tracking-wide text-cyan-300 font-mono">
            FRIENDS & SHARED LESSONS
          </h2>
          <p className="text-[11px] text-slate-300">
            Share today's run and peek at what your friends are learning.
          </p>
        </div>
      </header>

      {/* Share current lesson */}
      <div className="border border-slate-700 rounded-lg p-3 bg-slate-900/80 flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-mono">
          CURRENT LESSON SNAPSHOT
        </p>
        <p className="text-[11px] font-semibold text-slate-50">{currentLessonTitle}</p>
        <p className="text-[11px] text-slate-300">{currentLessonSummary}</p>
        <button
          type="button"
          onClick={handleShareLesson}
          className="mt-2 inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-mono rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-slate-950 hover:from-cyan-300 hover:to-fuchsia-300 border border-slate-900"
        >
          🚀 Share this lesson with friends
        </button>
        {shareStatus && (
          <p className="mt-1 text-[10px] text-emerald-300 font-mono">{shareStatus}</p>
        )}
      </div>

      {/* Friends list */}
      <div className="border border-slate-700 rounded-lg p-3 bg-slate-900/70 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-mono">
            YOUR FRIENDS
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            {friends.length} online learners
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            placeholder="Add friend by name"
            className="flex-1 bg-slate-950/80 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400"
          />
          <button
            type="button"
            onClick={handleAddFriend}
            className="px-2 py-1 text-[11px] font-mono rounded bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-600"
          >
            + Add
          </button>
        </div>

        <ul className="mt-2 space-y-1 max-h-28 overflow-y-auto pr-1">
          {friends.map((f) => (
            <li
              key={f.id}
              className="flex items-start justify-between text-[11px] bg-slate-950/70 border border-slate-800 rounded px-2 py-1"
            >
              <div>
                <p className="font-semibold text-slate-50">{f.name}</p>
                <p className="text-slate-400 text-[10px]">
                  Last: <span className="text-slate-300">{f.lastLesson}</span>
                </p>
              </div>
              <span className="text-[10px] text-amber-300 font-mono">
                🔥 {f.streak}d
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Shared lessons feed */}
      <div className="border border-slate-700 rounded-lg p-3 bg-slate-900/70 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-mono">
            LESSON FEED
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            Tap cards in your narration.
          </span>
        </div>

        <ul className="mt-1 space-y-1 max-h-40 overflow-y-auto pr-1">
          {sharedLessons.map((l) => (
            <li
              key={l.id}
              className="text-[11px] bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-50 truncate">{l.title}</p>
                <span className="text-[9px] text-slate-400 ml-2">
                  {l.timestampLabel}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] line-clamp-2">{l.summary}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                From{" "}
                <span className={l.isYou ? "text-cyan-300" : "text-emerald-300"}>
                  {l.sharedBy}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[9px] text-slate-500 font-mono mt-1">
        For the hackathon demo, this feed is local to your browser. In a full
        version it would sync to a class or friend group.
      </p>
    </section>
  );
};

export default SocialSharePanel;
