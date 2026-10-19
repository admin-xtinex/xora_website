/**
 * PRODUCTION MIGRATION PATH (not active in v1: no authenticated backend exists; the site is a static Vite build on
 * Azure Static Web Apps). See docs/MIGRATION-server-adapter.md.
 *
 * Design: the client NEVER submits a score, a `correct` flag or a pass. It submits raw responses + the
 * questionSetVersion it was shown. The server looks up that exact versioned question set, grades with the same pure
 * grader, and stores the result. Unknown/stale versions are rejected. Completion is derived server-side.
 *
 * This module makes NO network calls. A host-provided `ServerAssessmentTransport` (bound to the host's real auth
 * session, added only after a backend is audited) does the I/O.
 */
import type {
  CheckpointId, CheckpointProgress, LessonId, Progress, QuestionId, QuizAttempt, StepPointer,
} from '../../contracts';
import { gradeAttempt } from '../engine/grader';
import { combineWithRemediation } from '../engine/retry';
import type { AttemptKind, AttemptResult, AttemptScope, LearnerResponse } from '../engine/types';
import type { QuestionSetManifest } from '../question-sets/manifest';
import type { AssessmentStorageAdapter, PersistenceMode, StorageIssue } from './adapter';

export interface AttemptSubmission {
  scope: AttemptScope;
  questionSetVersion: string;
  attemptId: string;
  kind: Exclude<AttemptKind, 'practice'>;
  remediatesAttemptId?: string;
  responses: Partial<Record<QuestionId, LearnerResponse>>;
  startedAt: string;
}

export interface ServerGradedAttempt {
  result: AttemptResult;
  gradedBy: 'server';
  /** For remediation submissions: combined verdict with the base attempt. */
  combinedPassed?: boolean;
}

/** Activity the client may write directly (never assessment results). */
export interface LessonActivityUpdate {
  lessonId: LessonId;
  contentVersion: string;
  lastStepId: StepPointer | null;
  viewed: Progress['viewed'];
  practiced: Progress['practiced'];
}

export interface ServerAssessmentTransport {
  getLessonProgress(lessonId: LessonId): Promise<Progress | null>;
  listLessonProgress(): Promise<Progress[]>;
  putLessonActivity(update: LessonActivityUpdate): Promise<void>;
  listLessonAttempts(lessonId: LessonId): Promise<QuizAttempt[]>;
  getCheckpointProgress(id: CheckpointId): Promise<CheckpointProgress | null>;
  submitAttempt(sub: AttemptSubmission): Promise<ServerGradedAttempt>;
  clearMyProgress(): Promise<void>;
}

export class ServerBackedProgressAdapter implements AssessmentStorageAdapter {
  readonly kind = 'server' as const;
  readonly durable = true as const;
  readonly label = 'Saved to your XORA account.';
  private readonly log: StorageIssue[] = [];
  constructor(private readonly transport: ServerAssessmentTransport) {}
  persistence(): PersistenceMode { return 'server'; }
  issues(): readonly StorageIssue[] { return this.log; }
  /** userId comes from the server session; the argument is ignored on purpose (no client-chosen identity). */
  loadLesson(_userId: string, lessonId: LessonId) { return this.transport.getLessonProgress(lessonId); }
  loadAll(_userId: string) { return this.transport.listLessonProgress(); }
  /** Only activity fields are sent. `assessed`, `completed` and `completedAt` are derived by the server. */
  saveLesson(p: Progress) {
    return this.transport.putLessonActivity({ lessonId: p.lessonId, contentVersion: p.contentVersion, lastStepId: p.lastStepId, viewed: p.viewed, practiced: p.practiced });
  }
  loadCheckpoint(_userId: string, id: CheckpointId) { return this.transport.getCheckpointProgress(id); }
  /** Checkpoint state changes only through submitAttempt. Re-derivation writes from ProgressService are ignored. */
  async saveCheckpoint(_p: CheckpointProgress): Promise<void> { /* server-derived; nothing to send */ }
  loadLessonAttempts(_userId: string, lessonId: LessonId) { return this.transport.listLessonAttempts(lessonId); }
  async appendLessonAttempt(): Promise<void> {
    throw new Error('CLIENT_ATTEMPTS_NOT_ACCEPTED: submit raw responses with submitAttempt(); the server grades them');
  }
  submitAttempt(sub: AttemptSubmission) { return this.transport.submitAttempt(sub); }
  clear(_userId: string) { return this.transport.clearMyProgress(); }
}

export type ServerGradeOutcome =
  | { ok: true; graded: ServerGradedAttempt }
  | { ok: false; code: 'BAD_SUBMISSION' | 'UNKNOWN_QUESTION_SET' | 'SCOPE_MISMATCH' | 'REMEDIATION_BASE_MISSING' };

/**
 * Reference implementation of what the server runs (pure; usable in a Node/Azure Functions backend unchanged).
 * `registry`: questionSetVersion → manifest, built at deploy time from the same content (never from the client).
 * Any client-supplied score/correct/passed fields are ignored because they are never read.
 */
export function serverGradeSubmission(
  registry: ReadonlyMap<string, QuestionSetManifest>, raw: unknown, nowIso: string,
  findBaseResult?: (attemptId: string) => AttemptResult | undefined,
): ServerGradeOutcome {
  if (typeof raw !== 'object' || raw === null) return { ok: false, code: 'BAD_SUBMISSION' };
  const s = raw as Partial<AttemptSubmission>;
  if (typeof s.questionSetVersion !== 'string' || typeof s.attemptId !== 'string' || !s.scope || typeof s.startedAt !== 'string'
    || (s.kind !== 'full' && s.kind !== 'remediation') || typeof s.responses !== 'object' || s.responses === null) {
    return { ok: false, code: 'BAD_SUBMISSION' };
  }
  const m = registry.get(s.questionSetVersion);
  if (!m) return { ok: false, code: 'UNKNOWN_QUESTION_SET' };
  const sameScope = JSON.stringify(m.scope) === JSON.stringify(s.scope);
  if (!sameScope) return { ok: false, code: 'SCOPE_MISMATCH' };
  // Copy only well-formed responses for questions in this set.
  const responses: Partial<Record<QuestionId, LearnerResponse>> = {};
  for (const id of m.questionIds) {
    const r = (s.responses as Record<string, unknown>)[id];
    if (typeof r !== 'object' || r === null) continue;
    const rr = r as Record<string, unknown>;
    const clean: LearnerResponse = {};
    if (Array.isArray(rr['choiceIds']) && rr['choiceIds'].every((x) => typeof x === 'string')) clean.choiceIds = [...(rr['choiceIds'] as string[])];
    if (typeof rr['numeric'] === 'number') clean.numeric = rr['numeric'];
    responses[id] = clean;
  }
  let questions = m.questions;
  let base: AttemptResult | undefined;
  if (s.kind === 'remediation') {
    base = typeof s.remediatesAttemptId === 'string' ? findBaseResult?.(s.remediatesAttemptId) : undefined;
    if (!base || base.attempt.questionSetVersion !== m.questionSetVersion) return { ok: false, code: 'REMEDIATION_BASE_MISSING' };
    const ids = new Set(base.safetyFailures.map((f) => f.questionId));
    questions = m.questions.filter((q) => ids.has(q.id));
  }
  const result = gradeAttempt({
    scope: m.scope, questionSetVersion: m.questionSetVersion, questions, responses, policy: m.policy,
    attemptId: s.attemptId, startedAt: s.startedAt, finishedAt: nowIso, kind: s.kind,
    ...(s.kind === 'remediation' ? { mustReanswer: questions.map((q) => q.id) } : {}),
  });
  const graded: ServerGradedAttempt = { result, gradedBy: 'server', ...(base ? { combinedPassed: combineWithRemediation(base, result).passed } : {}) };
  return { ok: true, graded };
}
