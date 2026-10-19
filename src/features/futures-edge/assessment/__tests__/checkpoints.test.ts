import { describe, it, assert } from './harness';
import { buildCheckpoint } from '../checkpoints/build';
import { CP1_PLAN } from '../checkpoints/cp1';
import { CPA_PLAN } from '../checkpoints/cpa';
import { CPB_PLAN } from '../checkpoints/cpb';
import type { CheckpointPlan, CheckpointSlot } from '../checkpoints/plan';
import { buildQuestionBank } from '../question-sets/bank';
import { checkpointGate } from '../checkpoints/gate';
import { ProgressService } from '../progress/service';
import { LocalOnlyDemoProgressAdapter } from '../progress/local-demo-adapter';
import { MemoryStorage } from '../progress/storage';
import { gradeAttempt } from '../engine/grader';
import { Q_SINGLE_PLAIN, Q_TF_LEVERAGE, Q_SINGLE_WAIT, Q_SCENARIO_STOP, Q_NUMERIC_LIQ, testLesson } from './fixtures/sample';
import type { CheckpointQuestionId, LessonId, Question, QuestionId } from '../../contracts';

/** Synthetic bank that fills EVERY slot of a plan with a fixture question meeting the slot's expectations. */
function syntheticComplete(plan: CheckpointPlan) {
  const byLesson = new Map<LessonId, Question[]>();
  const items: Array<Question & { id: CheckpointQuestionId }> = [];
  const pendingIds: QuestionId[] = [];
  const counter = new Map<LessonId, number>();
  const nextId = (l: LessonId) => { const n = (counter.get(l) ?? 10) + 1; counter.set(l, n); return `${l}-Q${n}` as QuestionId; };
  const make = (id: QuestionId, l: LessonId, topic?: string, abstain?: boolean): Question => {
    const baseQ = abstain ? (topic === 'loss-limits' ? Q_SCENARIO_STOP : Q_SINGLE_WAIT) : topic === 'liquidation' ? Q_NUMERIC_LIQ : topic ? Q_TF_LEVERAGE : Q_SINGLE_PLAIN;
    return { ...baseQ, id, linkedLessonId: l, ...(topic ? { safetyCritical: true, safetyTopic: topic as Question['safetyTopic'] & string } : {}) } as Question;
  };
  const resolvedPlan: CheckpointPlan = { ...plan, slots: plan.slots.flatMap((s): CheckpointSlot[] => {
    if (s.kind === 'lesson-question') {
      const q = make(s.questionId, s.lessonId, s.expect?.safetyTopic, s.expect?.abstain);
      byLesson.set(s.lessonId, [...(byLesson.get(s.lessonId) ?? []), q]);
      return [s];
    }
    if (s.kind === 'lesson-pending') return Array.from({ length: s.count }, (_, i) => {
      const id = nextId(s.lessonId); pendingIds.push(id);
      const topic = s.wants?.[i];
      byLesson.set(s.lessonId, [...(byLesson.get(s.lessonId) ?? []), make(id, s.lessonId, topic, topic === 'no-trade')]);
      return { kind: 'lesson-question' as const, questionId: id, lessonId: s.lessonId, ...(topic ? { expect: { safetyTopic: topic } } : {}) };
    });
    if (s.kind === 'checkpoint-item') {
      const { pendingConfirmation: _pending, ...rest } = s;
      items.push({ ...make(s.id, plan.coversLessonIds.at(-1) as LessonId, s.expect?.safetyTopic, s.expect?.abstain), id: s.id } as Question & { id: CheckpointQuestionId });
      return [rest];
    }
    const topic = s.wants?.[0];
    items.push({ ...make(s.id, plan.coversLessonIds.at(-1) as LessonId, topic, topic === 'no-trade' || topic === 'loss-limits'), id: s.id } as Question & { id: CheckpointQuestionId });
    return [s];
  }) };
  const lessons = [...byLesson].map(([l, qs]) => testLesson(l, qs));
  return { plan: resolvedPlan, bank: buildQuestionBank(lessons), items };
}

describe('checkpoint plans (data configs)', () => {
  for (const plan of [CP1_PLAN, CPA_PLAN, CPB_PLAN]) {
    it(`${plan.id}: plan-level rules hold with the real (partial) bank shape`, () => {
      const b = buildCheckpoint(plan, buildQuestionBank([]));
      const planErrors = b.report.errors.filter((e) => e.code.startsWith('CP_'));
      assert.deepEqual(planErrors, [], JSON.stringify(planErrors));
      assert.equal(b.status, 'incomplete');
      assert.ok(b.plannedCount >= plan.questionCount.min && b.plannedCount <= plan.questionCount.max);
    });
    it(`${plan.id}: with every slot filled it is READY and passes the contract validateCheckpoint`, () => {
      const s = syntheticComplete(plan);
      const b = buildCheckpoint(s.plan, s.bank, s.items, { requireReady: true });
      assert.equal(b.status, 'ready');
      assert.deepEqual(b.report.errors, [], JSON.stringify(b.report.errors.slice(0, 5)));
      assert.equal(b.resolvedCount, b.plannedCount);
      for (const t of plan.mandatorySafetyTopics) assert.ok((b.coverage.safetyTopics[t] ?? 0) > 0, `${plan.id} ${t}`);
    });
  }
  it('CPA after T13 covers T01–T13 with leverage, liquidation, execution and account-security mandatory; CPB after T23 covers T14–T23 with loss-limits', () => {
    assert.equal(CPA_PLAN.afterLessonId, 'T13'); assert.equal(CPA_PLAN.coversLessonIds.length, 13);
    assert.deepEqual(CPA_PLAN.mandatorySafetyTopics, ['leverage', 'liquidation', 'execution', 'account-security']);
    assert.equal(CPB_PLAN.afterLessonId, 'T23'); assert.deepEqual(CPB_PLAN.coversLessonIds, ['T14', 'T15', 'T16', 'T17', 'T18', 'T19', 'T20', 'T21', 'T22', 'T23']);
    for (const t of ['leverage', 'liquidation', 'loss-limits'] as const) assert.ok(CPB_PLAN.mandatorySafetyTopics.includes(t));
    const cpItems = CPB_PLAN.slots.filter((s) => s.kind === 'checkpoint-item');
    assert.deepEqual(cpItems.map((s) => s.kind === 'checkpoint-item' ? s.purpose : ''), ['chart-interpretation', 'chart-interpretation', 'risk-math', 'risk-math', 'demo-scenario'], '2 chart + 2 risk math + 1 demo scenario');
    assert.equal(CPB_PLAN.slots.filter((s) => s.kind === 'checkpoint-item-pending' || s.kind === 'lesson-pending').length, 0, 'CPB v0.3.0 has no pending slots');
    assert.equal(CP1_PLAN.gating, false); assert.equal(CPA_PLAN.gating, true); assert.equal(CPB_PLAN.gating, true);
    for (const p of [CP1_PLAN, CPA_PLAN, CPB_PLAN]) assert.equal(p.passThreshold, 0.8);
  });
  it('NEGATIVE: missing mandatory topic, out-of-coverage slot, bad gating and disclaimer are errors', () => {
    const bad: CheckpointPlan = { ...CPA_PLAN, gating: false, disclaimer: 'Good luck!', mandatorySafetyTopics: [...CPA_PLAN.mandatorySafetyTopics, 'loss-limits'],
      slots: [...CPA_PLAN.slots, { kind: 'lesson-question', questionId: 'T20-Q01', lessonId: 'T20' }] };
    const codes = buildCheckpoint(bad, buildQuestionBank([])).report.errors.map((e) => e.code);
    for (const c of ['CP_GATING', 'CP_DISCLAIMER', 'CP_MANDATORY_TOPIC', 'CP_SLOT_OUTSIDE_COVERAGE']) assert.ok(codes.includes(c), c);
  });
  it('NEGATIVE: an expectation mismatch (slot expects liquidation safety item, question is not one) is an error', () => {
    const l = testLesson('T13', [{ ...Q_SINGLE_PLAIN, id: 'T13-Q01', linkedLessonId: 'T13' }]);
    const b = buildCheckpoint({ ...CPA_PLAN, slots: [{ kind: 'lesson-question', questionId: 'T13-Q01', lessonId: 'T13', expect: { safetyTopic: 'liquidation' } }] }, buildQuestionBank([l]));
    assert.ok(b.report.errors.some((e) => e.code === 'CP_EXPECT_MISMATCH'));
  });
  it('requireReady turns gaps into errors (integration mode)', () => {
    assert.ok(buildCheckpoint(CPB_PLAN, buildQuestionBank([]), [], { requireReady: true }).report.errors.some((e) => e.code === 'CP_GAP'));
  });
});

describe('checkpoint gate + progress', () => {
  const now = () => '2026-10-19T02:30:00.000Z';
  it('a PREVIEW (incomplete) checkpoint can be practised but never recorded as passed', async () => {
    const l = testLesson('T12', [{ ...Q_TF_LEVERAGE, id: 'T12-Q02', linkedLessonId: 'T12' }]);
    const b = buildCheckpoint(CPA_PLAN, buildQuestionBank([l]));
    assert.equal(b.status, 'incomplete'); assert.equal(b.resolvedCount, 1);
    const svc = new ProgressService(new LocalOnlyDemoProgressAdapter({ storage: new MemoryStorage(), now }), { now });
    const r = gradeAttempt({ scope: b.manifest.scope, questionSetVersion: b.manifest.questionSetVersion, questions: b.manifest.questions, responses: { 'T12-Q02': { choiceIds: ['false'] } }, attemptId: 'a1', startedAt: now(), finishedAt: now() });
    assert.equal(r.passed, true, 'the attempt itself is fine');
    const st = await svc.recordCheckpointAttempt(b, r);
    assert.equal(st.isPreview, true); assert.equal(st.status, 'preview-only'); assert.equal(st.progress.passed, false);
    const view = checkpointGate(CPA_PLAN, await svc.courseSummary(), st);
    assert.equal(view.canStart, true); assert.equal(view.isPreview, true); assert.equal(view.blocksCourseCompletion, true);
    assert.equal(view.recommendedFirst.length, 13);
  });
  it('a READY checkpoint passes, then is invalidated when its questions change', async () => {
    const s = syntheticComplete(CPA_PLAN);
    const b = buildCheckpoint(s.plan, s.bank, s.items);
    const svc = new ProgressService(new LocalOnlyDemoProgressAdapter({ storage: new MemoryStorage(), now }), { now });
    const responses = Object.fromEntries(b.manifest.questions.map((q) => [q.id, q.answer.kind === 'numeric' ? { numeric: q.answer.value } : { choiceIds: q.answer.kind === 'choice' ? [q.answer.choiceId] : q.answer.choiceIds }]));
    const r = gradeAttempt({ scope: b.manifest.scope, questionSetVersion: b.manifest.questionSetVersion, questions: b.manifest.questions, responses, attemptId: 'a1', startedAt: now(), finishedAt: now() });
    const st = await svc.recordCheckpointAttempt(b, r);
    assert.equal(st.status, 'passed'); assert.equal(st.record.authorizesLiveTrading, false); assert.equal(st.record.educationOnly, true);
    // An author edits one referenced question's answer key → new manifest → stale.
    const first = s.plan.slots.find((x) => x.kind === 'lesson-question');
    const qid = first && first.kind === 'lesson-question' ? first.questionId : '';
    const lessons = [...new Set([...s.bank.byId.values()].filter((q) => !q.id.startsWith('CP')).map((q) => q.linkedLessonId))].map((l) => testLesson(l, [...s.bank.byId.values()].filter((q) => q.linkedLessonId === l && !q.id.startsWith('CP')).map((q) => q.id === qid ? { ...q, rationale: `${q.rationale} Edited.` } : q)));
    const b2 = buildCheckpoint(s.plan, buildQuestionBank(lessons), s.items);
    const st2 = await svc.openCheckpoint(b2);
    assert.equal(st2.status, 'not-attempted'); assert.equal(st2.history.staleAttempts, 1); assert.equal(st2.progress.passed, false);
  });
  it('status safety-remediation-needed when threshold met but a safety item missed', async () => {
    const s = syntheticComplete(CPA_PLAN);
    const b = buildCheckpoint(s.plan, s.bank, s.items);
    const svc = new ProgressService(new LocalOnlyDemoProgressAdapter({ storage: new MemoryStorage(), now }), { now });
    const sc = b.manifest.questions.find((q) => q.safetyCritical && q.type === 'true-false');
    const responses = Object.fromEntries(b.manifest.questions.map((q) => [q.id, q === sc ? { choiceIds: ['true'] } : q.answer.kind === 'numeric' ? { numeric: q.answer.value } : { choiceIds: q.answer.kind === 'choice' ? [q.answer.choiceId] : q.answer.choiceIds }]));
    const r = gradeAttempt({ scope: b.manifest.scope, questionSetVersion: b.manifest.questionSetVersion, questions: b.manifest.questions, responses, attemptId: 'a1', startedAt: now(), finishedAt: now() });
    const st = await svc.recordCheckpointAttempt(b, r);
    assert.equal(st.status, 'safety-remediation-needed'); assert.deepEqual(st.history.outstandingSafetyIds, [sc?.id]);
  });
});

describe('checkpoint D-37 handling of referenced numeric lesson items', () => {
  it('a referenced lesson numeric item without rounding is a warning while staging, an error with requireReady', () => {
    const l = testLesson('T01', [{ ...Q_NUMERIC_LIQ, id: 'T01-Q02', linkedLessonId: 'T01', answer: { kind: 'numeric', value: 200, tolerance: 0.01, unit: 'USDT' } } as Question]);
    const plan: CheckpointPlan = { ...CP1_PLAN, slots: [{ kind: 'lesson-question', questionId: 'T01-Q02', lessonId: 'T01' }] };
    const staging = buildCheckpoint(plan, buildQuestionBank([l]));
    assert.ok(staging.report.warnings.some((w) => w.code === 'CP_NUMERIC_D37' && w.message.includes('EDGE-02')));
    assert.ok(buildCheckpoint(plan, buildQuestionBank([l]), [], { requireReady: true }).report.errors.some((e) => e.code === 'CP_NUMERIC_D37'));
  });
});
