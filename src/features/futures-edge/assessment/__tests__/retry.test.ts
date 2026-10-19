import { describe, it, assert } from './harness';
import { gradeAttempt } from '../engine/grader';
import {
  planFirstAttempt, planRetry, planRemediation, combineWithRemediation, summarizeHistory, remediationAttemptId, presentChoices,
} from '../engine/retry';
import { buildManifest } from '../question-sets/manifest';
import { initSession, sessionReducer, blockedByRemediation, parseNumericInput } from '../engine/session';
import { resolveScoringPolicy } from '../engine/grader';
import { SAMPLE_SET, ALL_CORRECT, Q_ORDER, Q_TF_LEVERAGE } from './fixtures/sample';

const m = buildManifest({ scope: { kind: 'checkpoint', checkpointId: 'CPB' }, contentVersion: '0.1.0', questions: SAMPLE_SET, policy: { passThreshold: 0.8, safetyCriticalMustBeCorrect: true } });
const grade = (attemptId: string, responses: Record<string, unknown>, extra: object = {}) => gradeAttempt({
  scope: m.scope, questionSetVersion: m.questionSetVersion, questions: m.questions, responses: responses as never,
  attemptId, startedAt: '2026-10-19T02:00:00Z', finishedAt: '2026-10-19T02:10:00Z', ...extra,
});
const wrongLev = { ...ALL_CORRECT, 'CPB-Q03': { choiceIds: ['true'] } };

describe('presentation plans', () => {
  it('shuffles choices only when shuffleChoices is true, deterministically, with stable ids', () => {
    const a = planFirstAttempt(m, 'seed-A');
    const b = planFirstAttempt(m, 'seed-A');
    assert.deepEqual(a.choiceOrder, b.choiceOrder);
    assert.deepEqual(a.choiceOrder['CPB-Q03'], ['true', 'false'], 'shuffleChoices unset → authored order');
    assert.deepEqual([...(a.choiceOrder['CPB-Q02'] ?? [])].sort(), ['a', 'b', 'c', 'd']);
    const seeds = ['1', '2', '3', '4', '5', '6', '7', '8'].map((s) => presentChoices(Q_ORDER, s, true).join(','));
    assert.ok(new Set(seeds).size > 1);
    assert.deepEqual(presentChoices(Q_ORDER, 'x', false), ['plan', 'size', 'enter', 'review']);
  });
  it('question order shuffles only when the policy asks', () => {
    assert.deepEqual(planFirstAttempt(m, 's').questionOrder, m.questionIds);
    const sh = planFirstAttempt(m, 's', { shuffleQuestions: true }).questionOrder;
    assert.deepEqual([...sh].sort(), [...m.questionIds].sort());
  });
});

describe('retry', () => {
  it('requires missed safety-critical items to be re-answered, first, after reading the correction', () => {
    const r1 = grade('a1', wrongLev);
    const d = planRetry(m, [r1.attempt], r1, 'seed-2');
    assert.ok(d.ok);
    if (!d.ok) return;
    assert.equal(d.plan.attemptNumber, 2);
    assert.deepEqual(d.plan.mustReanswer, ['CPB-Q03']);
    assert.equal(d.plan.questionOrder[0], 'CPB-Q03');
    assert.equal(d.plan.remediationRequired[0]?.safetyTopic, 'leverage');
    assert.match(d.plan.remediationRequired[0]?.correction ?? '', /liquidation closer/);
  });
  it('a retake that skips the must-reanswer item cannot pass', () => {
    const { ['CPB-Q03']: _x, ...rest } = ALL_CORRECT;
    const r = grade('a2', rest, { mustReanswer: ['CPB-Q03'], policy: { requireAllAnswered: false } });
    assert.ok(r.failReasons.includes('SAFETY_REANSWER_MISSING'));
    assert.equal(r.passed, false);
  });
  it('remediation: threshold met + only safety misses → re-answer just those to pass; score unchanged', () => {
    const r1 = grade('a1', wrongLev);
    const plan = planRemediation(m, r1, 'seed-r');
    assert.ok(plan.ok);
    if (!plan.ok) return;
    assert.deepEqual(plan.plan.questionOrder, ['CPB-Q03']);
    assert.equal(plan.plan.kind, 'remediation');
    const rem = gradeAttempt({ scope: m.scope, questionSetVersion: m.questionSetVersion, questions: [Q_TF_LEVERAGE], responses: { 'CPB-Q03': { choiceIds: ['false'] } }, attemptId: remediationAttemptId('a1', 1), startedAt: 't', finishedAt: '2026-10-19T02:20:00Z', kind: 'remediation', mustReanswer: ['CPB-Q03'] });
    assert.deepEqual(combineWithRemediation(r1, rem), { passed: true, outstanding: [] });
    const h = summarizeHistory([r1.attempt, rem.attempt], m);
    assert.equal(h.passed, true); assert.deepEqual(h.passedVia, { attemptId: 'a1', remediationAttemptId: 'a1~rem1' });
    assert.equal(h.bestScore, 0.875, 'remediation does not raise the score');
    assert.equal(h.countedAttempts, 1);
  });
  it('remediation is refused when the base attempt was below threshold', () => {
    const low = grade('a1', { ...wrongLev, 'CPB-Q01': { choiceIds: ['buy'] }, 'CPB-Q02': { choiceIds: ['a'] } });
    assert.deepEqual(planRemediation(m, low, 's'), { ok: false, reason: 'NOT_ELIGIBLE_FOR_REMEDIATION' });
    assert.deepEqual(planRemediation(m, grade('a3', ALL_CORRECT), 's'), { ok: false, reason: 'NOTHING_TO_REMEDIATE' });
  });
  it('a wrong remediation answer leaves the item outstanding', () => {
    const r1 = grade('a1', wrongLev);
    const rem = gradeAttempt({ scope: m.scope, questionSetVersion: m.questionSetVersion, questions: [Q_TF_LEVERAGE], responses: { 'CPB-Q03': { choiceIds: ['true'] } }, attemptId: 'a1~rem1', startedAt: 't', finishedAt: '2026-10-19T02:20:00Z', kind: 'remediation' });
    const h = summarizeHistory([r1.attempt, rem.attempt], m);
    assert.equal(h.passed, false); assert.deepEqual(h.outstandingSafetyIds, ['CPB-Q03']);
  });
  it('missed-only practice round never counts', () => {
    const r1 = grade('a1', { ...wrongLev, 'CPB-Q08': { choiceIds: ['b'] } });
    const d = planRetry(m, [r1.attempt], r1, 's', { scope: 'missed-only' });
    assert.ok(d.ok);
    if (d.ok) { assert.equal(d.plan.kind, 'practice'); assert.deepEqual(d.plan.questionOrder, ['CPB-Q03', 'CPB-Q08']); }
  });
  it('maxAttempts is enforced only when configured (default unlimited)', () => {
    const r1 = grade('a1', wrongLev);
    assert.ok(planRetry(m, [r1.attempt, grade('a2', wrongLev).attempt, grade('a3', wrongLev).attempt], r1, 's').ok);
    assert.deepEqual(planRetry(m, [r1.attempt], r1, 's', { maxAttempts: 1 }), { ok: false, reason: 'MAX_ATTEMPTS_REACHED' });
  });
  it('best score and pass come from history, not from stored flags', () => {
    const h = summarizeHistory([grade('a1', wrongLev).attempt, { ...grade('a2', ALL_CORRECT).attempt }], m);
    assert.equal(h.passed, true); assert.equal(h.bestScore, 1); assert.equal(h.countedAttempts, 2);
    const tightened = summarizeHistory([grade('a1', { ...ALL_CORRECT, 'CPB-Q08': { choiceIds: ['b'] } }).attempt], m, { passThreshold: 0.9, safetyCriticalMustBeCorrect: true });
    assert.equal(tightened.passed, false, 'raising the threshold re-evaluates history');
  });
});

describe('session reducer (QuizRunner state)', () => {
  const policy = resolveScoringPolicy();
  it('blocks re-answering a missed safety item until the correction is acknowledged', () => {
    const r1 = grade('a1', wrongLev);
    const d = planRetry(m, [r1.attempt], r1, 's');
    if (!d.ok) throw new Error('plan');
    let s = initSession({ scope: m.scope, questions: m.questions, plan: d.plan, policy, feedbackMode: 'end' }, '2026-10-19T03:00:00Z');
    assert.equal(blockedByRemediation(s, 'CPB-Q03'), true);
    s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q03', choiceId: 'false' });
    assert.equal(s.responses['CPB-Q03'], undefined, 'locked before acknowledgement');
    s = sessionReducer(s, { type: 'acknowledge', questionId: 'CPB-Q03' });
    s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q03', choiceId: 'false' });
    assert.deepEqual(s.responses['CPB-Q03'], { choiceIds: ['false'] });
  });
  it('full flow: select, multi toggle, numeric parse, ordering moves, submit → graded result', () => {
    const plan = planFirstAttempt(m, 'seed');
    let s = initSession({ scope: m.scope, questions: m.questions, plan, policy, feedbackMode: 'end' }, '2026-10-19T03:00:00Z');
    s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q01', choiceId: 'wait' });
    for (const c of ['a', 'b', 'c', 'd', 'c']) s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q02', choiceId: c });
    assert.deepEqual(s.responses['CPB-Q02'], { choiceIds: ['a', 'b', 'd'] });
    s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q03', choiceId: 'false' });
    s = sessionReducer(s, { type: 'numeric', questionId: 'CPB-Q04', raw: '1,810.00' });
    assert.deepEqual(s.responses['CPB-Q04'], { numeric: 1810 });
    // put ordering into the right order from whatever the seeded presentation was
    const target = ['plan', 'size', 'enter', 'review'];
    for (let pass = 0; pass < 6; pass++) for (const id of target) {
      const cur = s.responses['CPB-Q05']?.choiceIds ?? [];
      if (cur.indexOf(id) > target.indexOf(id)) s = sessionReducer(s, { type: 'move', questionId: 'CPB-Q05', choiceId: id, delta: -1 });
    }
    assert.deepEqual(s.responses['CPB-Q05'], { choiceIds: target });
    s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q06', choiceId: 'fakeout' });
    s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q07', choiceId: 'stop' });
    s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q08', choiceId: 'a' });
    s = sessionReducer(s, { type: 'next' }); assert.equal(s.index, 1);
    s = sessionReducer(s, { type: 'submit', attemptId: 'a1', nowIso: '2026-10-19T03:05:00Z' });
    assert.equal(s.phase, 'finished'); assert.equal(s.result?.passed, true); assert.equal(s.result?.score, 1);
    assert.equal(sessionReducer(s, { type: 'select', questionId: 'CPB-Q01', choiceId: 'buy' }), s, 'finished session is immutable');
  });
  it('immediate mode locks a question after Check', () => {
    let s = initSession({ scope: m.scope, questions: m.questions, plan: planFirstAttempt(m, 's'), policy, feedbackMode: 'immediate' }, 't');
    s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q01', choiceId: 'buy' });
    s = sessionReducer(s, { type: 'check', questionId: 'CPB-Q01' });
    assert.equal(s.checked['CPB-Q01']?.correct, false);
    s = sessionReducer(s, { type: 'select', questionId: 'CPB-Q01', choiceId: 'wait' });
    assert.deepEqual(s.responses['CPB-Q01'], { choiceIds: ['buy'] });
  });
  it('parseNumericInput', () => {
    assert.equal(parseNumericInput(' 1,810.5 '), 1810.5);
    assert.equal(parseNumericInput('10%'), 10);
    assert.equal(parseNumericInput('−3.5'), -3.5);
    assert.equal(parseNumericInput(''), undefined);
    assert.ok(Number.isNaN(parseNumericInput('12abc') as number));
  });
});
