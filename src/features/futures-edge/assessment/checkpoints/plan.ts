/**
 * Checkpoint PLAN data model (EDGE-09). A plan is the editable data config; `buildCheckpoint()` resolves it against
 * the question bank into a contract `CheckpointConfig` and lists every gap. Plans reference authored question ids;
 * EDGE-09 does not write lesson question text.
 */
import type { CheckpointId, CheckpointQuestionId, LessonId, QuestionId, SafetyTopic } from '../../contracts';

export type AuthorBot = 'EDGE-02' | 'EDGE-03' | 'EDGE-04' | 'EDGE-05' | 'EDGE-06' | 'EDGE-09';

export type CheckpointSlot =
  /** A specific authored lesson question. `expect` is checked when the question resolves. */
  | {
      kind: 'lesson-question'; questionId: QuestionId; lessonId: LessonId;
      expect?: { safetyTopic?: SafetyTopic; abstain?: boolean };
      /** Pre-contract draft location when the id is not yet in a contract-shaped lesson (e.g. EDGE-06 JSON). */
      draftSource?: string;
    }
  /** Lesson has no authored questions yet; N items to be picked once it exists. */
  | { kind: 'lesson-pending'; lessonId: LessonId; count: number; owner: AuthorBot; wants?: SafetyTopic[]; note: string }
  /**
   * Checkpoint-only item (CPx-Qnn) authored by EDGE-09 (passed to buildCheckpoint as `authoredItems`).
   * `expect` is checked like a lesson-question slot. `pendingConfirmation` keeps the build PROVISIONAL (resolved, but
   * not passable) until the named external confirmation arrives; it is an error in integration mode (requireReady).
   */
  | {
      kind: 'checkpoint-item'; id: CheckpointQuestionId;
      purpose: 'chart-interpretation' | 'risk-math' | 'demo-scenario' | 'foundations-review';
      basis: string;
      expect?: { safetyTopic?: SafetyTopic; abstain?: boolean };
      pendingConfirmation?: string;
    }
  /** Checkpoint-only item (CPx-Qnn) that EDGE-09 authors once its dependencies exist. Not authored yet. */
  | {
      kind: 'checkpoint-item-pending'; id: CheckpointQuestionId;
      purpose: 'chart-interpretation' | 'risk-math' | 'demo-scenario' | 'foundations-review';
      dependsOn: string; wants?: SafetyTopic[]; note: string;
    };

export interface CheckpointPlan {
  id: CheckpointId;
  title: string;
  afterLessonId: LessonId;
  coversLessonIds: LessonId[];
  version: string;
  passThreshold: number;
  safetyCriticalMustBeCorrect: boolean;
  gating: boolean;
  questionCount: { min: number; max: number };
  /** Topics that MUST be present as safety-critical items (never bypassed by aggregate score). */
  mandatorySafetyTopics: SafetyTopic[];
  /** Minimum number of items whose best answer is an abstain decision (CPB: no-trade practice). */
  minAbstainItems: number;
  /** Shuffle question order between attempts (seeded). */
  shuffleQuestions: boolean;
  disclaimer: string;
  slots: CheckpointSlot[];
}
