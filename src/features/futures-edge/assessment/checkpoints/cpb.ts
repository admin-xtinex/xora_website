/**
 * CPB: Checkpoint B after T23, covering Phases 4–5 (T14–T23): 20–25 lesson items + 5 applied items
 * (2 chart interpretation, 2 risk math, 1 demo scenario: master prompt §5/§9). Gating, 0.8 configurable,
 * mandatory safety topics leverage, liquidation, loss-limits, no-trade, and ≥3 items whose best answer is to abstain.
 *
 * v0.2.0 (contracts v1.3): T19–T23 reference EDGE-06's contract port (drafts/edge-06/…/phase-05/Tnn/lesson.ts),
 * re-picked because the port renumbered several items versus the pre-contract JSON. T14–T15 reference EDGE-05's
 * staged items; T16–T18 are not staged → pending. CPB-Q01..Q05 are EDGE-09 checkpoint-only items, NOT authored yet:
 * they need EDGE-05 chart fixtures and EDGE-08 simulators to exist first. No staged P4/P5 item is a safety-critical
 * `leverage` item, so the mandatory `leverage` topic rests on CPB-Q04 (pending).
 */
import type { LessonId, QuestionId, SafetyTopic } from '../../contracts';
import { CHECKPOINT_DISCLAIMER } from './disclaimer';
import type { CheckpointPlan, CheckpointSlot } from './plan';

const ref = (questionId: QuestionId, draftSource: string, expect: { safetyTopic?: SafetyTopic; abstain?: boolean } = {}): CheckpointSlot => ({
  kind: 'lesson-question', questionId, lessonId: questionId.slice(0, 3) as LessonId,
  draftSource: `${draftSource}/${questionId.slice(0, 3)}/lesson.ts#${questionId}`,
  ...(Object.keys(expect).length ? { expect } : {}),
});
const p5 = (id: QuestionId, expect: { safetyTopic?: SafetyTopic; abstain?: boolean } = {}) => ref(id, 'drafts/edge-06/features/futures-edge/content/phase-05', expect);
const p4ref = (id: QuestionId, expect: { safetyTopic?: SafetyTopic } = {}) => ref(id, 'drafts/edge-05/content/phase-04', expect);
const p4 = (lessonId: LessonId, note: string): CheckpointSlot => ({ kind: 'lesson-pending', lessonId, count: 2, owner: 'EDGE-05', note });

export const CPB_PLAN: CheckpointPlan = {
  id: 'CPB',
  title: 'Checkpoint B: Chart reading, scalping process and risk management (T14–T23)',
  afterLessonId: 'T23',
  coversLessonIds: ['T14', 'T15', 'T16', 'T17', 'T18', 'T19', 'T20', 'T21', 'T22', 'T23'],
  version: '0.2.0',
  passThreshold: 0.8,
  safetyCriticalMustBeCorrect: true,
  gating: true,
  questionCount: { min: 25, max: 30 },
  mandatorySafetyTopics: ['leverage', 'liquidation', 'loss-limits', 'no-trade'],
  minAbstainItems: 3,
  shuffleQuestions: true,
  disclaimer: CHECKPOINT_DISCLAIMER,
  slots: [
    p4ref('T14-Q04'), p4ref('T14-Q05', { safetyTopic: 'not-advice' }),
    p4ref('T15-Q01'), p4ref('T15-Q03'),
    p4('T16', 'trend vs sideways structure'),
    p4('T17', 'breakout vs fakeout (one abstain item welcome)'),
    p4('T18', 'volume / historical range is not a prediction'),
    p5('T19-Q03'),
    p5('T19-Q04', { safetyTopic: 'loss-limits', abstain: true }),
    p5('T20-Q02', { safetyTopic: 'no-trade', abstain: true }),
    p5('T20-Q03'),
    p5('T21-Q03'),
    p5('T21-Q04', { safetyTopic: 'no-trade', abstain: true }),
    p5('T22-Q03'),
    p5('T22-Q04', { safetyTopic: 'liquidation', abstain: true }),
    p5('T22-Q05', { safetyTopic: 'liquidation' }),
    p5('T23-Q02', { safetyTopic: 'no-trade', abstain: true }),
    p5('T23-Q04', { safetyTopic: 'loss-limits', abstain: true }),
    { kind: 'checkpoint-item-pending', id: 'CPB-Q01', purpose: 'chart-interpretation', dependsOn: 'EDGE-05 T14–T18 OHLC fixtures (FX-T1x-…)', note: 'read a fictional candle sequence; identify trend with uncertainty' },
    { kind: 'checkpoint-item-pending', id: 'CPB-Q02', purpose: 'chart-interpretation', dependsOn: 'EDGE-05 T17 breakout/fakeout fixture', wants: ['no-trade'], note: 'fakeout: best answer WAIT/NO_TRADE' },
    { kind: 'checkpoint-item-pending', id: 'CPB-Q03', purpose: 'risk-math', dependsOn: 'EDGE-08 liquidation.approx (MMR 0.5%, D-13)', wants: ['liquidation'], note: 'approximate liquidation vs stop distance, short side (D-17)' },
    { kind: 'checkpoint-item-pending', id: 'CPB-Q04', purpose: 'risk-math', dependsOn: 'EDGE-08 risk.position-size (D-27)', wants: ['leverage'], note: 'position size from 1% risk budget; leverage does not change planned loss' },
    { kind: 'checkpoint-item-pending', id: 'CPB-Q05', purpose: 'demo-scenario', dependsOn: 'EDGE-06 T23 session fixture (ported)', wants: ['loss-limits'], note: 'daily loss limit / consecutive-loss rule: best answer STOP_TRADING' },
  ],
};
