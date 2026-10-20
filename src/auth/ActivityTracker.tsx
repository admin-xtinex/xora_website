import { useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import type { ProgressSummary } from "./firebase";

// Records what a signed-in learner does, without touching the course module itself:
//  - opening a lesson or checkpoint (from the address),
//  - how far into a lesson video they get (the video player posts "futures-edge:progress" messages),
//  - course progress (the course saves it in this browser; a summary is copied to their account),
//    including newly completed lessons and new quiz attempts.

// Same key as src/features/futures-edge (LOCAL_PROGRESS_KEY_PREFIX + ANONYMOUS_USER_ID).
const PROGRESS_KEY = "xora.futuresEdge.v1.progress.local-anonymous";

type Stored = {
  lessons?: Record<string, { completed?: boolean; assessed?: { bestScore: number | null; attempts: number } }>;
  checkpoints?: Record<string, { passed?: boolean; attempts?: { score: number }[] }>;
};

function readProgress(): ProgressSummary | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(PROGRESS_KEY); } catch { return null; }
  if (!raw) return null;
  try {
    const b = JSON.parse(raw) as Stored;
    const lessons: ProgressSummary["lessons"] = {};
    for (const [id, p] of Object.entries(b.lessons || {})) {
      lessons[id] = { done: !!p.completed, best: p.assessed?.bestScore ?? null, attempts: p.assessed?.attempts ?? 0 };
    }
    const checkpoints: ProgressSummary["checkpoints"] = {};
    for (const [id, c] of Object.entries(b.checkpoints || {})) {
      const scores = (c.attempts || []).map((a) => a.score);
      checkpoints[id] = { passed: !!c.passed, best: scores.length ? Math.max(...scores) : null, attempts: scores.length };
    }
    const all = Object.values(lessons);
    return { lessons, checkpoints, started: all.length, completed: all.filter((l) => l.done).length };
  } catch {
    return null;
  }
}

export function ActivityTracker({ path }: { path: string }) {
  const { user, api } = useAuth();
  const last = useRef<{ json: string; p: ProgressSummary | null }>({ json: "", p: null });
  const videos = useRef<Record<string, number>>({});

  // Lesson and checkpoint opens.
  useEffect(() => {
    if (!user) return;
    const m = /^\/learn\/futures-edge\/(?:(checkpoint)\/)?([a-z0-9]+)$/.exec(path);
    if (!m) return;
    const id = m[2].toUpperCase();
    if (!/^(T\d\d|V00|CP[1AB])$/.test(id)) return; // the glossary and other pages are not lessons
    api().then((a) => a.logEvent(user, m[1] ? "checkpoint_open" : "lesson_open", id)).catch(() => {});
  }, [path, user, api]);

  // Video progress from the lesson player (inside an iframe on this site).
  useEffect(() => {
    if (!user) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.data?.type !== "futures-edge:progress") return;
      const id = String(e.data.lesson || ""), pct = Number(e.data.pct);
      if (!/^[A-Z0-9]{2,4}$/.test(id) || ![0, 25, 50, 75, 100].includes(pct)) return;
      if ((videos.current[id] ?? -1) >= pct) return;
      videos.current[id] = pct;
      const type = pct === 0 ? "video_start" : pct === 100 ? "video_complete" : `video_${pct}`;
      api().then((a) => Promise.all([a.logEvent(user, type, id), pct > 0 ? a.recordVideo(user, id, pct) : null])).catch(() => {});
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [user, api]);

  // Course progress: on every page change, when the tab is hidden, and every two minutes.
  useEffect(() => {
    if (!user) return;
    const sync = () => {
      const p = readProgress();
      if (!p) return;
      const json = JSON.stringify(p);
      if (json === last.current.json) return;
      const before = last.current.p;
      last.current = { json, p };
      api()
        .then(async (a) => {
          await a.saveProgress(user, p);
          if (!before) return; // first look in this visit: no "new" events
          for (const [id, l] of Object.entries(p.lessons)) {
            const was = before.lessons[id];
            if (l.done && !was?.done) await a.logEvent(user, "lesson_complete", id);
            if (l.attempts > (was?.attempts ?? 0)) await a.logEvent(user, "quiz_attempt", id, l.best == null ? "" : `best ${Math.round(l.best * 100)}%`);
          }
          for (const [id, c] of Object.entries(p.checkpoints)) {
            const was = before.checkpoints[id];
            if (c.attempts > (was?.attempts ?? 0)) await a.logEvent(user, "checkpoint_attempt", id, `${c.passed ? "passed" : "not passed"}, best ${Math.round((c.best ?? 0) * 100)}%`);
          }
        })
        .catch(() => {});
    };
    sync();
    const onHide = () => document.visibilityState === "hidden" && sync();
    document.addEventListener("visibilitychange", onHide);
    const timer = setInterval(sync, 120000);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      clearInterval(timer);
    };
  }, [path, user, api]);

  return null;
}
