/**
 * CP1: optional foundations review after T04 (8 items, NON-gating; master prompt §5 "Checkpoint after T04").
 * v0.2.0 (contracts v1.3, D-51): EDGE-02's 8 proposals (drafts/edge-02/README.md "CP1 proposals") are adopted by
 * REFERENCING the existing T01–T04 lesson items they were derived from, so EDGE-09 authors no new question text
 * and every CP1 item stays in sync with its lesson. Proposal → reference: CP1-Q01→T01-Q01, Q02→T01-Q02 (value =
 * quantity × price), Q03→T01-Q04, Q04→T02-Q02 (percent change), Q05→T02-Q05, Q06→T03-Q02 (quantity from spend),
 * Q07→T03-Q04 (stablecoin-risk), Q08→T04-Q03 (account-security). The proposal numbers differ slightly from the
 * lesson items (e.g. 0.003 BTC vs 0.005 BTC); the skill tested is the same.
 */
import { CHECKPOINT_DISCLAIMER } from './disclaimer';
import type { LessonId, QuestionId, SafetyTopic } from '../../contracts';
import type { CheckpointPlan, CheckpointSlot } from './plan';

const ref = (questionId: QuestionId, expect?: { safetyTopic: SafetyTopic }): CheckpointSlot =>
  ({ kind: 'lesson-question', questionId, lessonId: questionId.slice(0, 3) as LessonId, ...(expect ? { expect } : {}) });

export const CP1_PLAN: CheckpointPlan = {
  id: 'CP1',
  title: 'Foundations review (optional)',
  afterLessonId: 'T04',
  coversLessonIds: ['T01', 'T02', 'T03', 'T04'],
  version: '0.2.0',
  passThreshold: 0.8,
  safetyCriticalMustBeCorrect: true,
  gating: false,
  questionCount: { min: 8, max: 8 },
  mandatorySafetyTopics: ['stablecoin-risk', 'account-security'],
  minAbstainItems: 0,
  shuffleQuestions: true,
  disclaimer: CHECKPOINT_DISCLAIMER,
  slots: [
    ref('T01-Q01'), ref('T01-Q02'), ref('T01-Q04'),
    ref('T02-Q02'), ref('T02-Q05'),
    ref('T03-Q02'), ref('T03-Q04', { safetyTopic: 'stablecoin-risk' }),
    ref('T04-Q03', { safetyTopic: 'account-security' }),
  ],
};
