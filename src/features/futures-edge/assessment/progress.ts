/**
 * Local-only progress (the host site has no backend or auth). Saved in this browser only, labelled as such in the UI.
 * Progress is educational and never enables any trading capability.
 */
import {
  ANONYMOUS_USER_ID, LOCAL_PROGRESS_KEY_PREFIX, PROGRESS_SCHEMA_VERSION, defaultMigrationPolicy, emptyProgress, validateProgress,
  type CheckpointId, type CheckpointProgress, type LessonId, type Progress, type ProgressStorageAdapter, type QuizAttempt, type StepPointer,
} from '@futures-edge/contracts';

export interface KeyValueStore { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void; key(i: number): string | null; readonly length: number }

/** In-memory fallback when localStorage is blocked (private mode, tests). */
export function memoryStore(): KeyValueStore {
  const m = new Map<string, string>();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => { m.set(k, v); },
    removeItem: (k) => { m.delete(k); },
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
  };
}

function browserStore(): KeyValueStore {
  try {
    const s = window.localStorage;
    const probe = `${LOCAL_PROGRESS_KEY_PREFIX}probe`;
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return memoryStore();
  }
}

interface Blob { lessons: Partial<Record<LessonId, Progress>>; checkpoints: Partial<Record<CheckpointId, CheckpointProgress>> }

export function createLocalAdapter(store: KeyValueStore = typeof window === 'undefined' ? memoryStore() : browserStore()): ProgressStorageAdapter {
  const key = (u: string) => `${LOCAL_PROGRESS_KEY_PREFIX}${u}`;
  const read = (u: string): Blob => {
    try {
      const raw = store.getItem(key(u));
      if (!raw) return { lessons: {}, checkpoints: {} };
      const b = JSON.parse(raw) as Partial<Blob>;
      const lessons: Blob['lessons'] = {};
      for (const [id, p] of Object.entries(b.lessons ?? {})) if (validateProgress(p).ok) lessons[id as LessonId] = p as Progress;
      const checkpoints: Blob['checkpoints'] = {};
      for (const [id, c] of Object.entries(b.checkpoints ?? {})) if (c && (c as CheckpointProgress).progressSchemaVersion === PROGRESS_SCHEMA_VERSION && (c as CheckpointProgress).educationOnly === true) checkpoints[id as CheckpointId] = c as CheckpointProgress;
      return { lessons, checkpoints };
    } catch {
      return { lessons: {}, checkpoints: {} };
    }
  };
  const write = (u: string, b: Blob) => { try { store.setItem(key(u), JSON.stringify(b)); } catch { /* storage full or blocked: progress stays in memory for this visit */ } };
  return {
    kind: 'local-demo',
    durable: false,
    loadLesson: async (u, id) => read(u).lessons[id] ?? null,
    loadAll: async (u) => Object.values(read(u).lessons).filter((p): p is Progress => !!p),
    saveLesson: async (p) => { const b = read(p.userId); b.lessons[p.lessonId] = p; write(p.userId, b); },
    loadCheckpoint: async (u, id) => read(u).checkpoints[id] ?? null,
    saveCheckpoint: async (c) => { const b = read(c.userId); b.checkpoints[c.checkpointId] = c; write(c.userId, b); },
    clear: async (u) => { try { store.removeItem(key(u)); } catch { /* ignore */ } },
  };
}

/** Bring stored progress in line with the current lesson content version (D: default migration policy). */
export function migrate(p: Progress, currentVersion: string, nowIso: string): Progress {
  if (p.contentVersion === currentVersion) return p;
  const policy = defaultMigrationPolicy(p.contentVersion, currentVersion);
  if (policy === 'keep') return { ...p, contentVersion: currentVersion, lastUpdatedAt: nowIso };
  if (policy === 'reset-assessment') {
    const { completedAt: _drop, ...rest } = p;
    void _drop;
    return { ...rest, contentVersion: currentVersion, assessed: { bestScore: null, attempts: 0, safetyCriticalPassed: false }, completed: false, lastUpdatedAt: nowIso };
  }
  return emptyProgress(p.userId, p.lessonId, currentVersion, nowIso);
}

export interface CompletionRule { requireAllSlidesViewed: boolean; requireAnimationCompleted: boolean; requireExerciseIds: string[]; minQuizScore: number; requireSafetyCriticalCorrect: boolean }

/** Completion needs every required part: viewing alone never completes a lesson. */
export function isComplete(p: Progress, rule: CompletionRule, slideIds: string[], sceneIds: string[]): boolean {
  if (rule.requireAllSlidesViewed && !slideIds.every((s) => p.viewed.slides.includes(s))) return false;
  if (rule.requireAnimationCompleted && !sceneIds.every((s) => p.viewed.scenesCompleted.includes(s))) return false;
  if (!rule.requireExerciseIds.every((x) => p.practiced.exerciseIdsCompleted.includes(x))) return false;
  if (p.assessed.bestScore === null || p.assessed.bestScore < rule.minQuizScore) return false;
  if (rule.requireSafetyCriticalCorrect && !p.assessed.safetyCriticalPassed) return false;
  return true;
}

export type ProgressEvent =
  | { kind: 'slide'; id: string }
  | { kind: 'scene'; id: string }
  | { kind: 'notes' }
  | { kind: 'exercise'; id: string }
  | { kind: 'quiz'; attempt: QuizAttempt }
  | { kind: 'step'; step: StepPointer };

const addUnique = (xs: string[], x: string) => (xs.includes(x) ? xs : [...xs, x]);

/** Pure reducer for progress events; completion is recomputed after every event. */
export function applyEvent(p: Progress, e: ProgressEvent, rule: CompletionRule, slideIds: string[], sceneIds: string[], nowIso: string): Progress {
  let n: Progress = p;
  switch (e.kind) {
    case 'slide': n = { ...p, viewed: { ...p.viewed, slides: addUnique(p.viewed.slides, e.id) } }; break;
    case 'scene': n = { ...p, viewed: { ...p.viewed, scenesCompleted: addUnique(p.viewed.scenesCompleted, e.id) } }; break;
    case 'notes': n = { ...p, viewed: { ...p.viewed, notesRead: true } }; break;
    case 'exercise': n = { ...p, practiced: { exerciseIdsCompleted: addUnique(p.practiced.exerciseIdsCompleted, e.id) } }; break;
    case 'step': n = { ...p, lastStepId: e.step }; break;
    case 'quiz': {
      const best = p.assessed.bestScore === null ? e.attempt.score : Math.max(p.assessed.bestScore, e.attempt.score);
      n = { ...p, assessed: { bestScore: best, attempts: p.assessed.attempts + 1, safetyCriticalPassed: p.assessed.safetyCriticalPassed || e.attempt.safetyCriticalAllCorrect } };
      break;
    }
  }
  if (n === p) return p;
  const done = isComplete(n, rule, slideIds, sceneIds);
  const withDone: Progress = done
    ? { ...n, completed: true, completedAt: p.completedAt ?? nowIso }
    : (() => { const { completedAt: _c, ...rest } = n; void _c; return { ...rest, completed: false }; })();
  return { ...withDone, lastUpdatedAt: nowIso };
}

export const USER = ANONYMOUS_USER_ID;
export const progressAdapter = createLocalAdapter();
