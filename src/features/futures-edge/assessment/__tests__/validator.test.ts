import { describe, it, assert } from './harness';
import { validateAssessmentQuestion, validateLessonQuestionSet, validatePhase5Abstention, bestAnswerIsAbstain, numericRoundingIssues } from '../question-sets/validator';
import { BROKEN_QUESTIONS } from './fixtures/negative';
import { SAMPLE_SET, Q_SINGLE_WAIT, Q_SINGLE_PLAIN, Q_TF_LEVERAGE, Q_SCENARIO_STOP, Q_NUMERIC_LIQ, asLessonQuestion, testLesson } from './fixtures/sample';

describe('question validator: positive', () => {
  it('every sample question passes contract + EDGE-09 rules', () => {
    for (const q of SAMPLE_SET) {
      const r = validateAssessmentQuestion(q, q.id, { checkpointId: 'CPB' });
      assert.deepEqual(r.errors, [], q.id);
    }
  });
  it('warns when a choice reads as a decision word but has no Choice.decision tag', () => {
    const q = { ...Q_SINGLE_PLAIN, choices: [{ id: 'a', text: 'NO_TRADE: skip it' }, { id: 'b', text: 'Months' }] };
    assert.ok(validateAssessmentQuestion(q, 'q').warnings.some((w) => w.code === 'Q_DECISION_TAG_MISSING'));
  });
});

describe('question validator: negative fixture', () => {
  for (const { expect, q } of BROKEN_QUESTIONS) {
    it(`${(q as { id: string }).id} → ${expect.join(' + ')}`, () => {
      const r = validateAssessmentQuestion(q, 'q');
      const codes = r.errors.map((e) => e.code);
      assert.equal(r.ok, false);
      for (const c of expect) assert.ok(codes.includes(c), `expected ${c}, got ${codes.join(',')}`);
    });
  }
  it('id scope: lesson question with the wrong prefix', () => {
    assert.ok(validateAssessmentQuestion(Q_SINGLE_PLAIN, 'q', { lessonId: 'T19' }).errors.some((e) => e.code === 'Q_ID_SCOPE'));
  });
});

describe('lesson question-set rules', () => {
  const p5 = (qs = [asLessonQuestion(Q_SINGLE_PLAIN, 'T21', 1), asLessonQuestion(Q_SINGLE_WAIT, 'T21', 2), asLessonQuestion(Q_TF_LEVERAGE, 'T21', 3)]) => testLesson('T21', qs);
  it('a Phase 5 lesson with an abstain item passes the abstention rule', () => {
    const r = validateLessonQuestionSet(p5());
    assert.ok(!r.errors.some((e) => e.code === 'P5_ABSTAIN_ITEM_MISSING'), JSON.stringify(r.errors));
  });
  it('NEGATIVE: a Phase 5 lesson without any WAIT/NO_TRADE/STOP_TRADING best answer fails', () => {
    const l = p5([asLessonQuestion(Q_SINGLE_PLAIN, 'T21', 1), asLessonQuestion(Q_TF_LEVERAGE, 'T21', 2), asLessonQuestion({ ...Q_SINGLE_WAIT, answer: { kind: 'choice', choiceId: 'buy' }, misconceptionFeedback: { wait: 'x', 'no-trade': 'y' } }, 'T21', 3)]);
    const r = validateLessonQuestionSet(l);
    assert.ok(r.errors.some((e) => e.code === 'P5_ABSTAIN_ITEM_MISSING'));
  });
  it('NEGATIVE: abstain text without the decision tag does not count (tag is the source of truth)', () => {
    const untagged = { ...Q_SINGLE_WAIT, choices: Q_SINGLE_WAIT.choices!.map(({ id, text }) => ({ id, text })) };
    assert.equal(bestAnswerIsAbstain(untagged), false);
    assert.equal(bestAnswerIsAbstain(Q_SCENARIO_STOP), true);
  });
  it('non-Phase-5 lessons are not subject to the abstention rule', () => {
    const l = testLesson('T08', [asLessonQuestion(Q_SINGLE_PLAIN, 'T08', 1), asLessonQuestion(Q_SINGLE_PLAIN, 'T08', 2), asLessonQuestion(Q_SINGLE_PLAIN, 'T08', 3)]);
    assert.ok(!validateLessonQuestionSet(l).errors.some((e) => e.code === 'P5_ABSTAIN_ITEM_MISSING'));
  });
  it('question count, duplicate ids, linked lesson, required safety topic', () => {
    const one = testLesson('T12', [asLessonQuestion(Q_SINGLE_PLAIN, 'T12', 1)]);
    const codes = validateLessonQuestionSet(one).errors.map((e) => e.code);
    assert.ok(codes.includes('L_QUESTION_COUNT'));
    assert.ok(codes.includes('L_REQUIRED_SAFETY_TOPIC'), 'T12 needs a leverage safety item');
    const dup = testLesson('T08', [asLessonQuestion(Q_SINGLE_PLAIN, 'T08', 1), asLessonQuestion(Q_SINGLE_PLAIN, 'T08', 1), asLessonQuestion(Q_SINGLE_PLAIN, 'T08', 2)]);
    assert.ok(validateLessonQuestionSet(dup).errors.some((e) => e.code === 'Q_DUPLICATE_ID'));
    const wrongLink = testLesson('T08', [asLessonQuestion(Q_SINGLE_PLAIN, 'T08', 1), asLessonQuestion(Q_SINGLE_PLAIN, 'T08', 2), { ...asLessonQuestion(Q_SINGLE_PLAIN, 'T08', 3), linkedLessonId: 'T07' }]);
    assert.ok(validateLessonQuestionSet(wrongLink).errors.some((e) => e.code === 'Q_LINKED_LESSON'));
  });
  it('phase-level: missing P5 lessons are warnings in partial mode, errors otherwise', () => {
    assert.equal(validatePhase5Abstention([p5()], { partial: true }).ok, true);
    assert.equal(validatePhase5Abstention([p5()]).ok, false);
  });
});

describe('D-37 numeric rounding + tolerance (EDGE-09 strict form)', () => {
  const num = (answer: Record<string, unknown>) => ({ ...Q_NUMERIC_LIQ, answer: { kind: 'numeric', unit: 'USDT', ...answer } } as typeof Q_NUMERIC_LIQ);
  const codes = (q: typeof Q_NUMERIC_LIQ) => numericRoundingIssues(q).map((i) => i.code);
  it('accepts tolerance at half step, inside the band, and at one step', () => {
    assert.deepEqual(codes(num({ value: 1.22, tolerance: 0.005, rounding: { decimals: 2 } })), []);
    assert.deepEqual(codes(num({ value: 1.22, tolerance: 0.0075, rounding: { decimals: 2 } })), []);
    assert.deepEqual(codes(num({ value: 1.22, tolerance: 0.01, rounding: { decimals: 2 } })), []);
    assert.deepEqual(codes(num({ value: 30, tolerance: 0.5, rounding: { decimals: 0 } })), []);
  });
  it('flags missing rounding, invalid decimals, below half step and above one step', () => {
    assert.deepEqual(codes(num({ value: 200, tolerance: 0.01 })), ['Q_NUMERIC_ROUNDING_MISSING']);
    assert.deepEqual(codes(num({ value: 200, tolerance: 0.01, rounding: { decimals: 1.5 } })), ['Q_NUMERIC_ROUNDING_INVALID']);
    assert.deepEqual(codes(num({ value: 30, tolerance: 0, rounding: { decimals: 0 } })), ['Q_TOLERANCE_BELOW_HALF_STEP']);
    assert.deepEqual(codes(num({ value: 1000, tolerance: 1, rounding: { decimals: 2 } })), ['Q_TOLERANCE_ABOVE_STEP']);
  });
  it('checkpoint-owned numeric items: ERROR; lesson items: WARNING (author fix)', () => {
    const bad = num({ value: 200, tolerance: 0.01 });
    assert.ok(validateAssessmentQuestion(bad, 'q', { checkpointId: 'CPB' }).errors.some((e) => e.code === 'Q_NUMERIC_ROUNDING_MISSING'));
    const asLesson = asLessonQuestion(bad, 'T01', 2);
    const r = validateAssessmentQuestion(asLesson, 'q', { lessonId: 'T01' });
    assert.ok(!r.errors.some((e) => e.code.startsWith('Q_NUMERIC') || e.code.startsWith('Q_TOLERANCE')));
    assert.ok(r.warnings.some((w) => w.code === 'Q_NUMERIC_ROUNDING_MISSING'));
  });
  it('non-numeric questions are not affected', () => assert.deepEqual(numericRoundingIssues(Q_SINGLE_PLAIN), []));
});
