/**
 * CPA: Checkpoint A after T13, covering Phases 1–3 (T01–T13). 20–25 items, gating, 0.8 configurable,
 * safety-critical items mandatory (leverage, liquidation, execution, account-security: master prompt §9).
 * Lesson question ids below were read from the staged drafts (read-only):
 *   T05–T09 drafts/edge-03/features/futures-edge/content/phase-02/Tnn/lesson.ts (EDGE-03, v0.2.0)
 *   T10–T13 drafts/edge-04/features/futures-edge/content/phase-03/Tnn/lesson.ts (EDGE-04)
 * v0.2.0: T01–T04 now reference EDGE-02's staged items (drafts/edge-02, contracts v1.3) instead of 5 pending slots.
 * They avoid CP1's items so CPA is not a repeat of CP1; account-security is covered by T10-Q01.
 */
import type { LessonId, QuestionId, SafetyTopic } from '../../contracts';
import { CHECKPOINT_DISCLAIMER } from './disclaimer';
import type { CheckpointPlan, CheckpointSlot } from './plan';

const ref = (questionId: QuestionId, safetyTopic?: SafetyTopic): CheckpointSlot => ({
  kind: 'lesson-question', questionId, lessonId: questionId.slice(0, 3) as LessonId,
  ...(safetyTopic ? { expect: { safetyTopic } } : {}),
});

export const CPA_PLAN: CheckpointPlan = {
  id: 'CPA',
  title: 'Checkpoint A: Foundations, trading basics and futures risks (T01–T13)',
  afterLessonId: 'T13',
  coversLessonIds: ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12', 'T13'],
  version: '0.2.0',
  passThreshold: 0.8,
  safetyCriticalMustBeCorrect: true,
  gating: true,
  questionCount: { min: 20, max: 25 },
  mandatorySafetyTopics: ['leverage', 'liquidation', 'execution', 'account-security'],
  minAbstainItems: 0,
  shuffleQuestions: true,
  disclaimer: CHECKPOINT_DISCLAIMER,
  slots: [
    { kind: 'lesson-question', questionId: 'T01-Q05', lessonId: 'T01', expect: { safetyTopic: 'not-advice' } },
    { kind: 'lesson-question', questionId: 'T02-Q03', lessonId: 'T02' },
    { kind: 'lesson-question', questionId: 'T03-Q03', lessonId: 'T03' },
    { kind: 'lesson-question', questionId: 'T04-Q01', lessonId: 'T04' },
    { kind: 'lesson-question', questionId: 'T04-Q04', lessonId: 'T04' },
    ref('T05-Q04', 'leverage'),
    ref('T06-Q01'), ref('T06-Q05', 'fees-costs'),
    ref('T07-Q02', 'execution'), ref('T07-Q04', 'execution'),
    ref('T08-Q01', 'execution'), ref('T08-Q04'),
    ref('T09-Q02', 'fees-costs'), ref('T09-Q05', 'fees-costs'),
    ref('T10-Q01', 'account-security'), ref('T10-Q05', 'not-advice'),
    ref('T11-Q01'), ref('T11-Q03', 'liquidation'),
    ref('T12-Q02', 'leverage'), ref('T12-Q03', 'leverage'), ref('T12-Q05', 'leverage'),
    ref('T13-Q01', 'liquidation'), ref('T13-Q04', 'liquidation'), ref('T13-Q05', 'liquidation'),
  ],
};
