/**
 * EDGE-09 assessment storage interface = contract ProgressStorageAdapter + lesson quiz attempt history.
 * (The contract Progress has no attempt list, so lesson attempts bound to a question-set version live here.
 *  See docs/contract-change-requests.md CR-1.)
 */
import type { LessonId, ProgressStorageAdapter, QuizAttempt } from '../../contracts';

export type PersistenceMode = 'local-storage' | 'memory' | 'server';

export interface StorageIssue {
  code: 'STORAGE_UNAVAILABLE' | 'CORRUPT_JSON' | 'UNKNOWN_FORMAT' | 'FUTURE_SCHEMA' | 'INVALID_RECORD' | 'USER_MISMATCH' | 'WRITE_FAILED' | 'MIGRATED';
  message: string;
  at: string;
}

export interface AssessmentStorageAdapter extends ProgressStorageAdapter {
  /** Visible label the UI must show next to any progress display. */
  readonly label: string;
  /** Where data actually lives right now (local-storage can degrade to memory at runtime). */
  persistence(): PersistenceMode;
  loadLessonAttempts(userId: string, lessonId: LessonId): Promise<QuizAttempt[]>;
  appendLessonAttempt(userId: string, lessonId: LessonId, attempt: QuizAttempt): Promise<void>;
  /** Problems found while loading/saving (corruption, migration, fallback). Never thrown at the learner. */
  issues(): readonly StorageIssue[];
}
