import { describe, it, assert } from './harness';
import { gradeQuestion, gradeAttempt, formatCorrectAnswer } from '../engine/grader';
import { Q_SINGLE_WAIT, Q_MULTI, Q_TF_LEVERAGE, Q_NUMERIC_LIQ, Q_ORDER, Q_CHART, Q_SCENARIO_STOP, Q_SINGLE_PLAIN, SAMPLE_SET, ALL_CORRECT } from './fixtures/sample';
import { QUESTION_TYPES } from '../../contracts';

const base = { scope: { kind: 'checkpoint', checkpointId: 'CPB' } as const, questionSetVersion: '0.1.0+c.aaaaaaaaaaaa.g.bbbbbbbbbbbb', attemptId: 'a1', startedAt: '2026-10-19T02:00:00Z', finishedAt: '2026-10-19T02:10:00Z' };

describe('grader: every contract question type', () => {
  it('fixture set covers all 7 QUESTION_TYPES', () => {
    assert.deepEqual([...new Set(SAMPLE_SET.map((q) => q.type))].sort(), [...QUESTION_TYPES].sort());
  });
  it('single / true-false / chart / scenario: exactly the key is correct', () => {
    for (const [q, key, wrong] of [[Q_SINGLE_WAIT, 'wait', 'buy'], [Q_TF_LEVERAGE, 'false', 'true'], [Q_CHART, 'fakeout', 'breakout'], [Q_SCENARIO_STOP, 'stop', 'continue']] as const) {
      assert.equal(gradeQuestion(q, { choiceIds: [key] }).correct, true, `${q.id} key`);
      const r = gradeQuestion(q, { choiceIds: [wrong] });
      assert.equal(r.correct, false, `${q.id} wrong`);
      assert.equal(r.misconception, q.misconceptionFeedback?.[wrong]);
    }
  });
  it('single: two selections are invalid, not correct', () => {
    const r = gradeQuestion(Q_SINGLE_WAIT, { choiceIds: ['wait', 'buy'] });
    assert.equal(r.status, 'invalid'); assert.equal(r.correct, false);
  });
  it('multi: exact set, order-insensitive; subsets and supersets are wrong', () => {
    assert.equal(gradeQuestion(Q_MULTI, { choiceIds: ['d', 'b', 'a'] }).correct, true);
    assert.equal(gradeQuestion(Q_MULTI, { choiceIds: ['a', 'b'] }).correct, false);
    const sup = gradeQuestion(Q_MULTI, { choiceIds: ['a', 'b', 'c', 'd'] });
    assert.equal(sup.correct, false);
    assert.match(sup.misconception ?? '', /a target is a plan/);
    assert.equal(gradeQuestion(Q_MULTI, { choiceIds: ['a', 'a', 'b', 'd'] }).status, 'invalid');
  });
  it('ordering: exact sequence; partial or reordered is wrong; missing items invalid', () => {
    assert.equal(gradeQuestion(Q_ORDER, { choiceIds: ['plan', 'size', 'enter', 'review'] }).correct, true);
    assert.equal(gradeQuestion(Q_ORDER, { choiceIds: ['size', 'plan', 'enter', 'review'] }).correct, false);
    assert.equal(gradeQuestion(Q_ORDER, { choiceIds: ['plan', 'size', 'enter'] }).status, 'invalid');
  });
  it('numeric: within tolerance inclusive; outside wrong; NaN invalid; missing unanswered', () => {
    assert.equal(gradeQuestion(Q_NUMERIC_LIQ, { numeric: 1810.5 }).correct, true);
    assert.equal(gradeQuestion(Q_NUMERIC_LIQ, { numeric: 1809.5 }).correct, true);
    assert.equal(gradeQuestion(Q_NUMERIC_LIQ, { numeric: 1810.51 }).correct, false);
    assert.equal(gradeQuestion(Q_NUMERIC_LIQ, { numeric: Number.NaN }).status, 'invalid');
    assert.equal(gradeQuestion(Q_NUMERIC_LIQ, {}).status, 'unanswered');
    assert.equal(gradeQuestion(Q_NUMERIC_LIQ, undefined).status, 'unanswered');
  });
  it('numeric float noise never flips a correct answer (tolerance 0)', () => {
    const q = { ...Q_NUMERIC_LIQ, answer: { kind: 'numeric' as const, value: 0.3, tolerance: 0, unit: 'USDT' } };
    assert.equal(gradeQuestion(q, { numeric: 0.1 + 0.2 }).correct, true);
  });
  it('unknown choice ids are invalid (never throw)', () => {
    const r = gradeQuestion(Q_SINGLE_PLAIN, { choiceIds: ['zzz'] });
    assert.equal(r.status, 'invalid'); assert.equal(r.correct, false);
  });
  it('malformed question (type/answer.kind mismatch) grades invalid instead of throwing', () => {
    const bad = { ...Q_MULTI, answer: { kind: 'choice' as const, choiceId: 'a' } };
    const r = gradeQuestion(bad, { choiceIds: ['a'] });
    assert.equal(r.status, 'invalid'); assert.match(r.invalidReason ?? '', /MALFORMED_QUESTION/);
  });
});

describe('grader: per-choice feedback', () => {
  it('key gets rationale, distractors get misconceptionFeedback, selection flagged', () => {
    const r = gradeQuestion(Q_SINGLE_WAIT, { choiceIds: ['buy'] });
    const by = Object.fromEntries(r.choiceFeedback.map((c) => [c.choiceId, c]));
    assert.equal(by['wait']?.isKey, true); assert.equal(by['wait']?.feedback, Q_SINGLE_WAIT.rationale);
    assert.equal(by['buy']?.selected, true); assert.equal(by['buy']?.feedback, Q_SINGLE_WAIT.misconceptionFeedback?.['buy']);
    assert.equal(r.correctAnswerText, 'WAIT for the close');
    assert.equal(r.learnerAnswerText, 'DEMO BUY now');
  });
  it('formats numeric and ordering answers readably', () => {
    assert.equal(formatCorrectAnswer(Q_NUMERIC_LIQ), '1,810 USDT (accepted within ±0.5)');
    assert.equal(formatCorrectAnswer(Q_ORDER), '1. Plan → 2. Size → 3. Enter (demo) → 4. Review');
  });
});

describe('grader: abstention tracking via Choice.decision', () => {
  it('correct abstain', () => {
    const r = gradeQuestion(Q_SINGLE_WAIT, { choiceIds: ['wait'] });
    assert.equal(r.abstention.outcome, 'correct-abstain'); assert.equal(r.abstention.bestDecision, 'WAIT');
  });
  it('missed abstain = forced a trade', () => {
    const r = gradeQuestion(Q_SINGLE_WAIT, { choiceIds: ['buy'] });
    assert.equal(r.abstention.outcome, 'missed-abstain'); assert.equal(r.abstention.learnerDecision, 'BUY');
  });
  it('abstained with the wrong word (WAIT where STOP_TRADING required)', () => {
    assert.equal(gradeQuestion(Q_SCENARIO_STOP, { choiceIds: ['wait'] }).abstention.outcome, 'abstain-word-mismatch');
    assert.equal(gradeQuestion(Q_SCENARIO_STOP, { choiceIds: ['continue'] }).abstention.outcome, 'missed-abstain');
  });
  it('items without decision tags are not-applicable', () => {
    assert.equal(gradeQuestion(Q_SINGLE_PLAIN, { choiceIds: ['a'] }).abstention.outcome, 'not-applicable');
  });
  it('attempt summary counts abstention outcomes', () => {
    const r = gradeAttempt({ ...base, questions: SAMPLE_SET, responses: { ...ALL_CORRECT, 'CPB-Q01': { choiceIds: ['buy'] }, 'CPB-Q07': { choiceIds: ['wait'] } } });
    assert.deepEqual(r.abstention, { expected: 2, correctAbstain: 0, missedAbstain: 1, wordMismatch: 1, unneededAbstain: 0 });
  });
  it('unneeded abstain is recorded when acting was correct', () => {
    const q = { ...Q_SINGLE_WAIT, answer: { kind: 'choice' as const, choiceId: 'buy' }, misconceptionFeedback: { wait: 'x', 'no-trade': 'y' } };
    assert.equal(gradeQuestion(q, { choiceIds: ['no-trade'] }).abstention.outcome, 'unneeded-abstain');
  });
});
