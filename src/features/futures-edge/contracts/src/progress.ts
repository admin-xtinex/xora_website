/**
 * Progress + storage adapter contracts. Owner: EDGE-00 (types). Implementation: EDGE-09.
 *
 * The audited repo has NO backend, auth or persistence (verified 2026-10-19). Therefore v1 ships ONLY a
 * local-only demo adapter (browser localStorage), clearly labelled in UI as "saved on this device only".
 * A server adapter may be added later behind the same interface, after a real auth/back-end exists and is audited.
 * Progress is education-only: it NEVER authorizes or enables real-money trading.
 */
import type { LessonId, CheckpointId, QuestionId, ChoiceId } from './ids';

export const PROGRESS_SCHEMA_VERSION = 1 as const;
/** localStorage key prefix for the local demo adapter: `${prefix}${userId}` */
export const LOCAL_PROGRESS_KEY_PREFIX = 'xora.futuresEdge.v1.progress.' as const;
export const ANONYMOUS_USER_ID = 'local-anonymous' as const;

/** Lesson step the learner was last on (mode + item id inside that mode). */
export type LessonMode = 'learn' | 'slides' | 'animation' | 'practice' | 'quiz' | 'notes' | 'review';
export interface StepPointer { mode: LessonMode; itemId?: string; offsetMs?: number }

export interface QuestionAttempt {
  questionId: QuestionId;
  /** Selected choice ids, numeric value, or order. */
  response: { choiceIds?: ChoiceId[]; numeric?: number };
  correct: boolean;
  safetyCritical: boolean;
  answeredAt: string; // ISO-8601 UTC
}

export interface QuizAttempt {
  attemptId: string;
  /** Lesson quiz or checkpoint. */
  scope: { kind: 'lesson'; lessonId: LessonId } | { kind: 'checkpoint'; checkpointId: CheckpointId };
  /** Version of the question set this attempt was graded against. */
  questionSetVersion: string;
  answers: QuestionAttempt[];
  score: number; // 0..1, computed by the grader, never trusted from a client for server-backed completion
  safetyCriticalAllCorrect: boolean;
  startedAt: string;
  finishedAt?: string;
}

/** Per-lesson progress. `viewed`, `practiced` and `assessed` are tracked separately — viewing is not passing. */
export interface Progress {
  progressSchemaVersion: typeof PROGRESS_SCHEMA_VERSION;
  userId: string; // ANONYMOUS_USER_ID for the local adapter
  lessonId: LessonId;
  /** Lesson.version the progress was recorded against (used for migrations). */
  contentVersion: string;
  lastStepId: StepPointer | null;
  viewed: { slides: string[]; scenesCompleted: string[]; notesRead: boolean };
  practiced: { exerciseIdsCompleted: string[] };
  assessed: { bestScore: number | null; attempts: number; safetyCriticalPassed: boolean };
  completed: boolean;
  completedAt?: string;
  lastUpdatedAt: string; // ISO-8601 UTC
  /** Literal marker: completion is educational only. */
  educationOnly: true;
}

export interface CheckpointProgress {
  progressSchemaVersion: typeof PROGRESS_SCHEMA_VERSION;
  userId: string;
  checkpointId: CheckpointId;
  checkpointVersion: string;
  attempts: QuizAttempt[];
  passed: boolean;
  lastUpdatedAt: string;
  educationOnly: true;
}

export interface ProgressStorageAdapter {
  /** 'local-demo' = this device only, not synced, can be cleared by the browser. */
  readonly kind: 'local-demo' | 'server';
  /** false for local-demo. UI must not claim cloud persistence when false. */
  readonly durable: boolean;
  loadLesson(userId: string, lessonId: LessonId): Promise<Progress | null>;
  loadAll(userId: string): Promise<Progress[]>;
  saveLesson(progress: Progress): Promise<void>;
  loadCheckpoint(userId: string, id: CheckpointId): Promise<CheckpointProgress | null>;
  saveCheckpoint(progress: CheckpointProgress): Promise<void>;
  clear(userId: string): Promise<void>;
}

/** What to do when stored progress was recorded against another content version. */
export type ProgressMigrationPolicy =
  | 'keep'             // patch/minor content change: keep progress
  | 'reset-assessment' // questions changed: keep viewed/practiced, clear assessed + completed
  | 'reset-all';

/** Default policy: same major content version -> keep; different major -> reset assessment. */
export function defaultMigrationPolicy(storedVersion: string, currentVersion: string): ProgressMigrationPolicy {
  const maj = (v: string) => Number(v.split('.')[0]);
  if (!Number.isFinite(maj(storedVersion)) || !Number.isFinite(maj(currentVersion))) return 'reset-all';
  return maj(storedVersion) === maj(currentVersion) ? 'keep' : 'reset-assessment';
}

export function emptyProgress(userId: string, lessonId: LessonId, contentVersion: string, nowIso: string): Progress {
  return {
    progressSchemaVersion: PROGRESS_SCHEMA_VERSION,
    userId, lessonId, contentVersion,
    lastStepId: null,
    viewed: { slides: [], scenesCompleted: [], notesRead: false },
    practiced: { exerciseIdsCompleted: [] },
    assessed: { bestScore: null, attempts: 0, safetyCriticalPassed: false },
    completed: false,
    lastUpdatedAt: nowIso,
    educationOnly: true,
  };
}
