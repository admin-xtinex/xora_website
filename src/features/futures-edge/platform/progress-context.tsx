/** React state for local progress: loads once, applies events through the pure reducer, saves after each change. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { emptyProgress, type CheckpointId, type CheckpointProgress, type Lesson, type LessonId, type Progress, type QuizAttempt } from '@futures-edge/contracts';
import { applyEvent, migrate, progressAdapter, USER, type ProgressEvent } from '../assessment/progress';

interface ProgressApi {
  ready: boolean;
  lessons: Partial<Record<LessonId, Progress>>;
  checkpoints: Partial<Record<CheckpointId, CheckpointProgress>>;
  record: (lesson: Lesson, e: ProgressEvent) => void;
  recordCheckpoint: (id: CheckpointId, version: string, attempt: QuizAttempt, passed: boolean) => void;
  reset: () => void;
}

const Ctx = createContext<ProgressApi>({ ready: false, lessons: {}, checkpoints: {}, record: () => {}, recordCheckpoint: () => {}, reset: () => {} });
export const useProgress = () => useContext(Ctx);

const now = () => new Date().toISOString();

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lessons, setLessons] = useState<Partial<Record<LessonId, Progress>>>({});
  const [checkpoints, setCheckpoints] = useState<Partial<Record<CheckpointId, CheckpointProgress>>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const all = await progressAdapter.loadAll(USER);
      const cps: Partial<Record<CheckpointId, CheckpointProgress>> = {};
      for (const id of ['CP1', 'CPA', 'CPB'] as const) { const c = await progressAdapter.loadCheckpoint(USER, id); if (c) cps[id] = c; }
      if (!alive) return;
      setLessons(Object.fromEntries(all.map((p) => [p.lessonId, p])));
      setCheckpoints(cps);
      setReady(true);
    })();
    return () => { alive = false; };
  }, []);

  const record = useCallback((lesson: Lesson, e: ProgressEvent) => {
    setLessons((cur) => {
      const t = now();
      const base = cur[lesson.id] ? migrate(cur[lesson.id] as Progress, lesson.version, t) : emptyProgress(USER, lesson.id, lesson.version, t);
      const next = applyEvent(base, e, lesson.completionRequirements, lesson.slides.map((s) => s.id), lesson.animationScenes.map((s) => s.id), t);
      if (next === cur[lesson.id]) return cur;
      void progressAdapter.saveLesson(next);
      return { ...cur, [lesson.id]: next };
    });
  }, []);

  const recordCheckpoint = useCallback((id: CheckpointId, version: string, attempt: QuizAttempt, passed: boolean) => {
    setCheckpoints((cur) => {
      const prev = cur[id];
      const next: CheckpointProgress = {
        progressSchemaVersion: 1, userId: USER, checkpointId: id, checkpointVersion: version,
        attempts: [...(prev?.checkpointVersion === version ? prev.attempts : []), attempt].slice(-20),
        passed: (prev?.checkpointVersion === version && prev.passed) || passed,
        lastUpdatedAt: now(), educationOnly: true,
      };
      void progressAdapter.saveCheckpoint(next);
      return { ...cur, [id]: next };
    });
  }, []);

  const reset = useCallback(() => {
    void progressAdapter.clear(USER);
    setLessons({});
    setCheckpoints({});
  }, []);

  const api = useMemo(() => ({ ready, lessons, checkpoints, record, recordCheckpoint, reset }), [ready, lessons, checkpoints, record, recordCheckpoint, reset]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
