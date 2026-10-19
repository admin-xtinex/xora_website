/**
 * CPB: Checkpoint B after T23, covering Phases 4–5 (T14–T23): 21 lesson items + 5 applied items
 * (2 chart interpretation, 2 risk math, 1 demo scenario: master prompt §5/§9). Gating, 0.8 configurable,
 * mandatory safety topics leverage, liquidation, loss-limits, no-trade, and ≥3 items whose best answer is to abstain.
 *
 * v0.3.0 (EDGE-00 routing, contracts v1.3.1 content):
 *  - T16–T18 picked from EDGE-05's final drafts (drafts/edge-05/content/phase-04, v1.3.1-final; only variant
 *    names/params and EDGE-08 cross-checks can still change, none of which touch these question ids).
 *  - Leverage safety item = T17-Q06 (EDGE-05; safetyCritical 'leverage', remediation T12-S03). T17-Q02 was retired
 *    by EDGE-05 and is not referenced anywhere.
 *  - CPB-Q01..Q05 are authored by EDGE-09 in ./cpb-items.ts (pass CPB_ITEMS to buildCheckpoint). CPB-Q03/Q04 are
 *    PENDING CONFIRMATION of the v1.3.1 simulator ids by EDGE-08, so a complete build is `provisional` (practice
 *    only, cannot record a pass) until those two flags are cleared.
 *  - T19–T23 reference EDGE-06's contract port; T14–T15 EDGE-05's drafts (unchanged ids).
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
const V131_SIM =
  'EDGE-08 to confirm the simulator id, input/output keys and golden value on contracts v1.3.1 (box: D-76 lists the id, D-77 key alignment still proposed; repo still on v1.3.0)';

export const CPB_PLAN: CheckpointPlan = {
  id: 'CPB',
  title: 'Checkpoint B: Chart reading, scalping process and risk management (T14–T23)',
  afterLessonId: 'T23',
  coversLessonIds: ['T14', 'T15', 'T16', 'T17', 'T18', 'T19', 'T20', 'T21', 'T22', 'T23'],
  version: '0.3.0',
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
    p4ref('T16-Q03'), p4ref('T16-Q04'),
    p4ref('T17-Q03'), p4ref('T17-Q06', { safetyTopic: 'leverage' }),
    p4ref('T18-Q01'), p4ref('T18-Q05', { safetyTopic: 'not-advice' }),
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
    { kind: 'checkpoint-item', id: 'CPB-Q01', purpose: 'chart-interpretation', basis: 'EDGE-05 FX-T16-CHART-C-01: sideways structure with the 3 USDT band' },
    { kind: 'checkpoint-item', id: 'CPB-Q02', purpose: 'chart-interpretation', basis: 'EDGE-05 FX-T17-BRANCHES-01 fakeout path', expect: { safetyTopic: 'no-trade', abstain: true } },
    { kind: 'checkpoint-item', id: 'CPB-Q03', purpose: 'risk-math', basis: 'EDGE-08 liquidation.approx (short, D-13, MMR 0.5%)', pendingConfirmation: V131_SIM },
    { kind: 'checkpoint-item', id: 'CPB-Q04', purpose: 'risk-math', basis: 'EDGE-08 risk.position-size (D-27, 1% risk budget)', pendingConfirmation: V131_SIM },
    { kind: 'checkpoint-item', id: 'CPB-Q05', purpose: 'demo-scenario', basis: 'EDGE-05 FX-T17-BRANCHES-01 + T23 consecutive-loss rule', expect: { safetyTopic: 'loss-limits', abstain: true } },
  ],
};
