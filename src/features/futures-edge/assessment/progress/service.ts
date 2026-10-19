/**
 * ProgressService (EDGE-09): resume, viewed/practiced/assessed tracking, version-aware migration, completion,
 * checkpoint status and course summary, on top of any AssessmentStorageAdapter.
 * Passing is always DERIVED from current-version attempts; stored flags are recomputed, never trusted.
 */
import {
  ANONYMOUS_USER_ID, LESSON_IDS, defaultMigrationPolicy, emptyProgress,
  type CheckpointId, type CheckpointProgress, type Lesson, type LessonId, type Progress, type ProgressMigrationPolicy,
  type StepPointer, PROGRESS_SCHEMA_VERSION,
} from '../../contracts';
import { DEFAULT_RETRY_POLICY, summarizeHistory, type HistorySummary, type RetryPolicy } from '../engine/retry';
import type { AttemptResult } from '../engine/types';
import { EDUCATION_ONLY_NOTICE } from '../engine/strings';
import { buildLessonManifest, type QuestionSetManifest } from '../question-sets/manifest';
import type { CheckpointBuild } from '../checkpoints/build';
import type { AssessmentStorageAdapter } from './adapter';
import { completionRecord, type CompletionRecord } from './completion';

export interface CompletionEvaluation { completed: boolean; missing: string[] }

export interface LessonState {
  progress: Progress;
  manifest: QuestionSetManifest;
  history: HistorySummary;
  completion: CompletionEvaluation;
  record: CompletionRecord;
  migration: ProgressMigrationPolicy | 'none';
}

export type CheckpointStatus = 'not-attempted' | 'passed' | 'below-threshold' | 'safety-remediation-needed' | 'incomplete-attempt' | 'preview-only';
export interface CheckpointState {
  progress: CheckpointProgress;
  history: HistorySummary;
  status: CheckpointStatus;
  isPreview: boolean;
  record: CompletionRecord;
}

export type LessonStatus = 'not-started' | 'in-progress' | 'completed' | 'needs-review';
export interface CourseSummary {
  userId: string;
  lessons: Array<{ lessonId: LessonId; status: LessonStatus; bestScore: number | null; lastStepId: StepPointer | null }>;
  checkpoints: Array<{ checkpointId: CheckpointId; passed: boolean; attempts: number }>;
  lessonsCompleted: number;
  lessonsTotal: number;
  percentComplete: number;
  courseCompleted: boolean;
  record: CompletionRecord;
  persistenceLabel: string;
  educationOnly: true;
  notice: string;
}

export function evaluateLessonCompletion(lesson: Lesson, p: Progress, h: HistorySummary): CompletionEvaluation {
  const r = lesson.completionRequirements;
  const missing: string[] = [];
  if (r.requireAllSlidesViewed) {
    const left = lesson.slides.filter((s) => !p.viewed.slides.includes(s.id)).length;
    if (left) missing.push(`view ${left} more slide(s)`);
  }
  if (r.requireAnimationCompleted) {
    const left = lesson.animationScenes.filter((s) => !p.viewed.scenesCompleted.includes(s.id)).length;
    if (left) missing.push(`finish ${left} more animation step(s)`);
  }
  for (const x of r.requireExerciseIds) if (!p.practiced.exerciseIdsCompleted.includes(x)) missing.push(`complete exercise ${x}`);
  if (!h.passed) {
    if (h.bestScore === null) missing.push('take the quiz');
    else if (h.outstandingSafetyIds.length) missing.push(`re-answer safety-critical item(s) ${h.outstandingSafetyIds.join(', ')}`);
    else missing.push(`reach the quiz target (${Math.round(lesson.completionRequirements.minQuizScore * 100)}%)`);
  }
  return { completed: missing.length === 0, missing };
}

export class ProgressService {
  readonly userId: string;
  private readonly now: () => string;
  private readonly retry: RetryPolicy;
  constructor(readonly adapter: AssessmentStorageAdapter, opts: { userId?: string; now?: () => string; retry?: Partial<RetryPolicy> } = {}) {
    this.userId = opts.userId ?? ANONYMOUS_USER_ID;
    this.now = opts.now ?? (() => new Date().toISOString());
    this.retry = { ...DEFAULT_RETRY_POLICY, ...opts.retry };
  }

  /** Load + migrate + re-derive a lesson's progress against the current lesson and question set. Saves if changed. */
  async openLesson(lesson: Lesson, manifest: QuestionSetManifest = buildLessonManifest(lesson)): Promise<LessonState> {
    const now = this.now();
    const stored = await this.adapter.loadLesson(this.userId, lesson.id);
    let p: Progress = stored ? structuredCopy(stored) : emptyProgress(this.userId, lesson.id, lesson.version, now);
    let migration: LessonState['migration'] = 'none';
    if (stored && stored.contentVersion !== lesson.version) {
      migration = defaultMigrationPolicy(stored.contentVersion, lesson.version);
      if (migration === 'reset-all') p = { ...emptyProgress(this.userId, lesson.id, lesson.version, now), lastStepId: null };
      else if (migration === 'reset-assessment') p = { ...p, assessed: { bestScore: null, attempts: 0, safetyCriticalPassed: false }, completed: false };
      p.contentVersion = lesson.version;
      // Drop pointers to items that no longer exist (resume falls back to the lesson start).
      const ids = new Set<string>([...lesson.slides.map((s) => s.id), ...lesson.animationScenes.map((s) => s.id), ...lesson.exercises.map((x) => x.id), ...lesson.quizQuestions.map((q) => q.id), ...lesson.notesSections.map((n) => n.id)]);
      if (p.lastStepId?.itemId && !ids.has(p.lastStepId.itemId)) p.lastStepId = { mode: p.lastStepId.mode };
    }
    const attempts = await this.adapter.loadLessonAttempts(this.userId, lesson.id);
    // Even under 'keep', attempts graded against a different question set are stale and do not count.
    const history = summarizeHistory(attempts, manifest, manifest.policy, this.retry);
    p.assessed = { bestScore: history.bestScore, attempts: history.countedAttempts, safetyCriticalPassed: history.passed };
    const completion = evaluateLessonCompletion(lesson, p, history);
    const wasCompleted = p.completed;
    p.completed = completion.completed;
    if (p.completed && !wasCompleted) p.completedAt = now;
    if (!p.completed) delete p.completedAt;
    if (!stored || JSON.stringify(stored) !== JSON.stringify(p)) { p.lastUpdatedAt = now; await this.adapter.saveLesson(p); }
    return { progress: p, manifest, history, completion, migration, record: completionRecord({ kind: 'lesson', lessonId: lesson.id }, p.completed, p.completedAt ?? null) };
  }

  async resume(lessonId: LessonId): Promise<StepPointer | null> {
    return (await this.adapter.loadLesson(this.userId, lessonId))?.lastStepId ?? null;
  }

  private async mutate(lesson: Lesson, f: (p: Progress) => void): Promise<LessonState> {
    const state = await this.openLesson(lesson);
    const p = structuredCopy(state.progress);
    f(p);
    p.lastUpdatedAt = this.now();
    await this.adapter.saveLesson(p);
    return this.openLesson(lesson, state.manifest);
  }
  recordStep(lesson: Lesson, step: StepPointer) { return this.mutate(lesson, (p) => { p.lastStepId = step; }); }
  markSlideViewed(lesson: Lesson, slideId: string) { return this.mutate(lesson, (p) => { if (!p.viewed.slides.includes(slideId)) p.viewed.slides.push(slideId); }); }
  markSceneCompleted(lesson: Lesson, sceneId: string) { return this.mutate(lesson, (p) => { if (!p.viewed.scenesCompleted.includes(sceneId)) p.viewed.scenesCompleted.push(sceneId); }); }
  markNotesRead(lesson: Lesson) { return this.mutate(lesson, (p) => { p.viewed.notesRead = true; }); }
  markExerciseCompleted(lesson: Lesson, exerciseId: string) { return this.mutate(lesson, (p) => { if (!p.practiced.exerciseIdsCompleted.includes(exerciseId)) p.practiced.exerciseIdsCompleted.push(exerciseId); }); }

  /** Store a graded lesson attempt. Practice rounds are never stored; stale results are rejected. */
  async recordLessonAttempt(lesson: Lesson, result: AttemptResult, manifest: QuestionSetManifest = buildLessonManifest(lesson)): Promise<LessonState> {
    if (result.attempt.questionSetVersion !== manifest.questionSetVersion) throw new Error('STALE_QUESTION_SET: attempt was graded against another question-set version');
    if (result.kind !== 'practice') await this.adapter.appendLessonAttempt(this.userId, lesson.id, result.attempt);
    return this.openLesson(lesson, manifest);
  }

  async openCheckpoint(build: CheckpointBuild): Promise<CheckpointState> {
    const now = this.now();
    const stored = await this.adapter.loadCheckpoint(this.userId, build.plan.id);
    const p: CheckpointProgress = stored ? structuredCopy(stored) : {
      progressSchemaVersion: PROGRESS_SCHEMA_VERSION, userId: this.userId, checkpointId: build.plan.id,
      checkpointVersion: build.plan.version, attempts: [], passed: false, lastUpdatedAt: now, educationOnly: true,
    };
    const history = summarizeHistory(p.attempts, build.manifest, build.manifest.policy, this.retry);
    const isPreview = build.status !== 'ready';
    const passed = !isPreview && history.passed;
    let status: CheckpointStatus;
    if (isPreview) status = 'preview-only';
    else if (passed) status = 'passed';
    else if (!history.lastFullAttempt) status = 'not-attempted';
    else if (history.lastFullAttempt.answers.some((a) => a.response.choiceIds === undefined && a.response.numeric === undefined)) status = 'incomplete-attempt';
    else if (history.lastFullAttempt.score + 1e-9 >= build.manifest.policy.passThreshold && history.outstandingSafetyIds.length) status = 'safety-remediation-needed';
    else status = 'below-threshold';
    if (p.passed !== passed || p.checkpointVersion !== build.plan.version) {
      p.passed = passed; p.checkpointVersion = build.plan.version; p.lastUpdatedAt = now;
      await this.adapter.saveCheckpoint(p);
    }
    return { progress: p, history, status, isPreview, record: completionRecord({ kind: 'checkpoint', checkpointId: build.plan.id }, passed, passed ? p.lastUpdatedAt : null) };
  }

  async recordCheckpointAttempt(build: CheckpointBuild, result: AttemptResult): Promise<CheckpointState> {
    if (result.attempt.questionSetVersion !== build.manifest.questionSetVersion) throw new Error('STALE_QUESTION_SET: attempt was graded against another question-set version');
    if (result.kind !== 'practice') {
      const state = await this.openCheckpoint(build);
      const p = structuredCopy(state.progress);
      p.attempts.push(result.attempt);
      p.lastUpdatedAt = this.now();
      await this.adapter.saveCheckpoint(p);
    }
    return this.openCheckpoint(build);
  }

  /**
   * Course overview from stored data. `currentVersions` (lesson id → Lesson.version) marks lessons whose stored
   * progress was recorded against another content version as 'needs-review' until reopened.
   */
  async courseSummary(currentVersions: Partial<Record<LessonId, string>> = {}): Promise<CourseSummary> {
    const all = await this.adapter.loadAll(this.userId);
    const by = new Map(all.map((p) => [p.lessonId, p]));
    const lessons = LESSON_IDS.map((lessonId) => {
      const p = by.get(lessonId);
      const cur = currentVersions[lessonId];
      let status: LessonStatus = 'not-started';
      if (p) {
        const touched = p.lastStepId !== null || p.viewed.slides.length > 0 || p.assessed.attempts > 0 || p.practiced.exerciseIdsCompleted.length > 0;
        status = cur !== undefined && cur !== p.contentVersion ? 'needs-review' : p.completed ? 'completed' : touched ? 'in-progress' : 'not-started';
      }
      return { lessonId, status, bestScore: p?.assessed.bestScore ?? null, lastStepId: p?.lastStepId ?? null };
    });
    const checkpoints: CourseSummary['checkpoints'] = [];
    for (const id of ['CP1', 'CPA', 'CPB'] as const) {
      const c = await this.adapter.loadCheckpoint(this.userId, id);
      checkpoints.push({ checkpointId: id, passed: c?.passed ?? false, attempts: c?.attempts.length ?? 0 });
    }
    const lessonsCompleted = lessons.filter((l) => l.status === 'completed').length;
    const courseCompleted = lessonsCompleted === LESSON_IDS.length && checkpoints.filter((c) => c.checkpointId !== 'CP1').every((c) => c.passed);
    return {
      userId: this.userId, lessons, checkpoints, lessonsCompleted, lessonsTotal: LESSON_IDS.length,
      percentComplete: Math.round((lessonsCompleted / LESSON_IDS.length) * 100), courseCompleted,
      record: completionRecord({ kind: 'course' }, courseCompleted, courseCompleted ? this.now() : null),
      persistenceLabel: this.adapter.label, educationOnly: true, notice: EDUCATION_ONLY_NOTICE,
    };
  }
}

function structuredCopy<T>(v: T): T { return JSON.parse(JSON.stringify(v)) as T; }
