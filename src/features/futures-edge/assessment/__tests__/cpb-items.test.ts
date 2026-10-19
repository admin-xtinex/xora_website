/**
 * CPB-Q01..Q05 (EDGE-09 checkpoint-only items) and the CPB v0.3.0 plan. Repo-only: no lesson banks needed.
 * Golden answers are recomputed here from the course formulas (independent of EDGE-08's code); the EDGE-08
 * cross-check values are recorded in CPB_ITEM_PROVENANCE.
 */
import { describe, it, assert } from './harness';
import { CPB_ITEMS, CPB_ITEM_PROVENANCE } from '../checkpoints/cpb-items';
import { CPB_PLAN } from '../checkpoints/cpb';
import { CP1_PLAN } from '../checkpoints/cp1';
import { CPA_PLAN } from '../checkpoints/cpa';
import { buildCheckpoint } from '../checkpoints/build';
import { checkpointGate } from '../checkpoints/gate';
import type { CheckpointPlan, CheckpointSlot } from '../checkpoints/plan';
import { buildQuestionBank } from '../question-sets/bank';
import { bestAnswerIsAbstain, numericRoundingIssues, validateAssessmentQuestion } from '../question-sets/validator';
import { gradeAttempt } from '../engine/grader';
import { ProgressService } from '../progress/service';
import { LocalOnlyDemoProgressAdapter } from '../progress/local-demo-adapter';
import { MemoryStorage } from '../progress/storage';
import { Q_SINGLE_PLAIN, Q_TF_LEVERAGE, Q_SINGLE_WAIT, Q_SCENARIO_STOP, Q_NUMERIC_LIQ, testLesson } from './fixtures/sample';
import { validateQuestion, type LessonId, type Question } from '../../contracts';

const byId = new Map(CPB_ITEMS.map((q) => [q.id, q]));
const numericValue = (id: string) => { const a = byId.get(id as 'CPB-Q01')?.answer; return a?.kind === 'numeric' ? a : undefined; };

describe('CPB-Q01..Q05 checkpoint-only items', () => {
  it('exactly CPB-Q01..Q05, each contract-valid and EDGE-09-valid as a checkpoint-owned item (D-37 errors enforced)', () => {
    assert.deepEqual(CPB_ITEMS.map((q) => q.id), ['CPB-Q01', 'CPB-Q02', 'CPB-Q03', 'CPB-Q04', 'CPB-Q05']);
    for (const q of CPB_ITEMS) {
      const c = validateQuestion(q); assert.ok(c.ok, c.ok ? '' : JSON.stringify(c.errors));
      const r = validateAssessmentQuestion(q, q.id, { checkpointId: 'CPB' });
      assert.deepEqual(r.errors, [], JSON.stringify(r.errors));
      assert.deepEqual(r.warnings.filter((w) => w.code.startsWith('Q_REMEDIATION')), [], q.id);
      assert.deepEqual(numericRoundingIssues(q), [], q.id);
      assert.ok(CPB_PLAN.coversLessonIds.includes(q.linkedLessonId), q.id);
    }
  });
  it('all data is fictional and labelled as such in every prompt; nothing names a real exchange or asset', () => {
    for (const q of CPB_ITEMS) {
      assert.match(q.prompt, /Fictional educational data: DEMO\/USDT is not a real market/, q.id);
      assert.doesNotMatch(`${q.prompt} ${q.rationale}`, /\b(BTC|ETH|Bitcoin|Ethereum|Binance|Bybit|OKX)\b/i, q.id);
    }
  });
  it('golden answers recomputed from the course formulas (D-13 short liquidation, D-27 risk sizing) with D-37 rounding', () => {
    const q3 = numericValue('CPB-Q03'); const q4 = numericValue('CPB-Q04');
    const liq = 2000 * (1 + 1 / 20 - 0.005);
    assert.ok(q3 && Math.abs(Math.round(liq) - q3.value) < 1e-9 && q3.rounding?.decimals === 0 && q3.tolerance === 0.5);
    const size = 10 / (2000 - 1980);
    assert.ok(q4 && Math.abs(Number(size.toFixed(2)) - q4.value) < 1e-9 && q4.rounding?.decimals === 2 && q4.tolerance === 0.005);
    // Recorded EDGE-08 cross-check values agree with the keys.
    assert.equal(CPB_ITEM_PROVENANCE['CPB-Q03']?.simulator?.output['approxLiquidationPrice'], q3?.value);
    assert.equal(CPB_ITEM_PROVENANCE['CPB-Q04']?.simulator?.output['size'], q4?.value);
  });
  it('CPB-Q03/Q04 are marked pending confirmation of the v1.3.1 simulator ids, in provenance AND in the plan', () => {
    for (const id of ['CPB-Q03', 'CPB-Q04']) {
      assert.match(CPB_ITEM_PROVENANCE[id]?.pendingConfirmation ?? '', /v1\.3\.1/);
      const slot = CPB_PLAN.slots.find((s) => s.kind === 'checkpoint-item' && s.id === id);
      assert.ok(slot && slot.kind === 'checkpoint-item' && /v1\.3\.1/.test(slot.pendingConfirmation ?? ''), id);
    }
    assert.deepEqual(CPB_ITEM_PROVENANCE['CPB-Q03']?.simulator?.id, 'liquidation.approx');
    assert.deepEqual(CPB_ITEM_PROVENANCE['CPB-Q04']?.simulator?.id, 'risk.position-size');
  });
  it('leverage teaching: the leverage-related items say leverage amplifies losses; none says it makes a trade safer', () => {
    for (const id of ['CPB-Q03', 'CPB-Q04']) assert.match(byId.get(id as 'CPB-Q03')?.rationale ?? '', /leverage amplifies losses/i, id);
    for (const q of CPB_ITEMS) assert.doesNotMatch(q.rationale, /leverage (makes|is) (it |a trade |the trade )?safe/i, q.id);
  });
  it('CPB-Q02 best answer NO_TRADE (no-trade safety item); CPB-Q05 best answer STOP_TRADING (loss-limits safety item); every distractor has feedback', () => {
    const q2 = byId.get('CPB-Q02'); const q5 = byId.get('CPB-Q05');
    assert.ok(q2 && bestAnswerIsAbstain(q2) && q2.safetyCritical && q2.safetyTopic === 'no-trade');
    assert.ok(q5 && bestAnswerIsAbstain(q5) && q5.safetyCritical && q5.safetyTopic === 'loss-limits');
    for (const q of CPB_ITEMS) if (q.answer.kind === 'choice') {
      const key = q.answer.choiceId;
      for (const c of q.choices ?? []) if (c.id !== key) assert.ok((q.misconceptionFeedback ?? {})[c.id], `${q.id}.${c.id}`);
    }
  });
});

/** Fill every lesson-question slot of a plan synthetically; keep the REAL CPB items. */
function syntheticLessons(plan: CheckpointPlan) {
  const byLesson = new Map<LessonId, Question[]>();
  for (const s of plan.slots) if (s.kind === 'lesson-question') {
    const t = s.expect?.safetyTopic; const ab = s.expect?.abstain;
    const base = ab ? (t === 'loss-limits' ? Q_SCENARIO_STOP : Q_SINGLE_WAIT) : t === 'liquidation' ? Q_NUMERIC_LIQ : t ? Q_TF_LEVERAGE : Q_SINGLE_PLAIN;
    const q = { ...base, id: s.questionId, linkedLessonId: s.lessonId, ...(t ? { safetyCritical: true, safetyTopic: t } : {}) } as Question;
    byLesson.set(s.lessonId, [...(byLesson.get(s.lessonId) ?? []), q]);
  }
  return buildQuestionBank([...byLesson].map(([l, qs]) => testLesson(l, qs)));
}

describe('CPB v0.3.0 plan', () => {
  it('T17-Q06 is the leverage safety item; T17-Q02 (retired by EDGE-05) is referenced by no plan', () => {
    const t17 = CPB_PLAN.slots.find((s) => s.kind === 'lesson-question' && s.questionId === 'T17-Q06');
    assert.ok(t17 && t17.kind === 'lesson-question' && t17.expect?.safetyTopic === 'leverage');
    for (const p of [CP1_PLAN, CPA_PLAN, CPB_PLAN]) assert.ok(!JSON.stringify(p.slots).includes('T17-Q02'), p.id);
  });
  it('26 planned items: 2 each from T14–T18 (10) + 11 from T19–T23 + 5 checkpoint items', () => {
    const lessonRefs = CPB_PLAN.slots.filter((s): s is Extract<CheckpointSlot, { kind: 'lesson-question' }> => s.kind === 'lesson-question');
    for (const l of ['T14', 'T15', 'T16', 'T17', 'T18'] as const) assert.equal(lessonRefs.filter((s) => s.lessonId === l).length, 2, l);
    assert.equal(lessonRefs.length, 21);
    assert.equal(buildCheckpoint(CPB_PLAN, buildQuestionBank([]), CPB_ITEMS).plannedCount, 26);
  });
  it('with every lesson slot resolved and the real CPB items: PROVISIONAL (Q03/Q04 pending) → preview only, never a recorded pass', async () => {
    const bank = syntheticLessons(CPB_PLAN);
    const b = buildCheckpoint(CPB_PLAN, bank, CPB_ITEMS);
    assert.deepEqual(b.report.errors, [], JSON.stringify(b.report.errors.slice(0, 5)));
    assert.equal(b.status, 'provisional'); assert.equal(b.resolvedCount, 26); assert.deepEqual(b.gaps, []);
    assert.deepEqual(b.pendingConfirmations.map((p) => p.questionId), ['CPB-Q03', 'CPB-Q04']);
    assert.deepEqual(b.config.items.map((q) => q.id), ['CPB-Q01', 'CPB-Q02', 'CPB-Q03', 'CPB-Q04', 'CPB-Q05']);
    for (const t of CPB_PLAN.mandatorySafetyTopics) assert.ok((b.coverage.safetyTopics[t] ?? 0) > 0, t);
    assert.ok(b.coverage.abstainItems >= CPB_PLAN.minAbstainItems);
    assert.ok(buildCheckpoint(CPB_PLAN, bank, CPB_ITEMS, { requireReady: true }).report.errors.some((e) => e.code === 'CP_PENDING_CONFIRMATION'));
    const now = () => '2026-10-19T03:15:00.000Z';
    const svc = new ProgressService(new LocalOnlyDemoProgressAdapter({ storage: new MemoryStorage(), now }), { now });
    const responses = Object.fromEntries(b.manifest.questions.map((q) => [q.id, q.answer.kind === 'numeric' ? { numeric: q.answer.value } : { choiceIds: q.answer.kind === 'choice' ? [q.answer.choiceId] : [...q.answer.choiceIds] }]));
    const r = gradeAttempt({ scope: b.manifest.scope, questionSetVersion: b.manifest.questionSetVersion, questions: b.manifest.questions, responses, attemptId: 'a1', startedAt: now(), finishedAt: now() });
    assert.equal(r.passed, true); assert.equal(r.authorizesLiveTrading, false);
    const st = await svc.recordCheckpointAttempt(b, r);
    assert.equal(st.status, 'preview-only'); assert.equal(st.progress.passed, false); assert.equal(st.previewReason, 'provisional');
    assert.match(checkpointGate(CPB_PLAN, await svc.courseSummary(), st).message, /still being checked/);
    // Clearing the confirmations (what EDGE-08's sign-off will do) makes it READY.
    const confirmed: CheckpointPlan = { ...CPB_PLAN, slots: CPB_PLAN.slots.map((s) => { if (s.kind !== 'checkpoint-item') return s; const { pendingConfirmation: _p, ...rest } = s; return rest; }) };
    assert.equal(buildCheckpoint(confirmed, bank, CPB_ITEMS, { requireReady: true }).status, 'ready');
  });
  it('NEGATIVE: a checkpoint-item slot without its authored item is a gap; an unused authored item is a warning', () => {
    const b = buildCheckpoint(CPB_PLAN, syntheticLessons(CPB_PLAN), CPB_ITEMS.filter((q) => q.id !== 'CPB-Q05'));
    assert.equal(b.status, 'incomplete'); assert.ok(b.gaps.some((g) => g.questionId === 'CPB-Q05' && g.kind === 'checkpoint-item-not-authored'));
    const extra = { ...CPB_ITEMS[0]!, id: 'CPB-Q09' as const };
    assert.ok(buildCheckpoint(CPB_PLAN, syntheticLessons(CPB_PLAN), [...CPB_ITEMS, extra]).report.warnings.some((w) => w.code === 'CP_ITEM_UNUSED'));
  });
  it('NEGATIVE: a checkpoint item with a D-37 problem or a bad anchor is an ERROR (EDGE-09 owns it)', () => {
    const q4 = CPB_ITEMS.find((q) => q.id === 'CPB-Q04')!;
    const bad = [...CPB_ITEMS.filter((q) => q.id !== 'CPB-Q04'), { ...q4, answer: { kind: 'numeric' as const, value: 0.5, tolerance: 0.05, unit: 'DEMO', rounding: { decimals: 2 } }, remediationRef: { lessonId: 'T22' as const, anchorId: 'T13-S02' } }];
    const codes = buildCheckpoint(CPB_PLAN, syntheticLessons(CPB_PLAN), bad).report.errors.map((e) => e.code);
    assert.ok(codes.includes('Q_TOLERANCE_ABOVE_STEP')); assert.ok(codes.includes('Q_REMEDIATION_ANCHOR_OTHER_LESSON'));
  });
});
