import { describe, it, assert } from './harness';
import { gradeAttempt, resolveScoringPolicy, DEFAULT_PASS_THRESHOLD, policyFromLesson } from '../engine/grader';
import { SAMPLE_SET, ALL_CORRECT, testLesson, Q_SINGLE_PLAIN } from './fixtures/sample';
import { EDUCATION_ONLY_NOTICE } from '../engine/strings';

const base = { scope: { kind: 'checkpoint', checkpointId: 'CPB' } as const, questionSetVersion: 'v', attemptId: 'a1', startedAt: '2026-10-19T02:00:00Z', finishedAt: '2026-10-19T02:10:00Z', questions: SAMPLE_SET };

describe('scoring policy', () => {
  it('default threshold is 0.8 and configurable', () => {
    assert.equal(DEFAULT_PASS_THRESHOLD, 0.8);
    assert.equal(resolveScoringPolicy().passThreshold, 0.8);
    assert.equal(resolveScoringPolicy({ passThreshold: 0.6 }).passThreshold, 0.6);
  });
  it('rejects out-of-range thresholds loudly', () => {
    assert.throws(() => resolveScoringPolicy({ passThreshold: 1.2 }), /0\.\.1/);
    assert.throws(() => resolveScoringPolicy({ passThreshold: Number.NaN }), /0\.\.1/);
  });
  it('lesson policy uses minQuizScore and never weakens the safety gate', () => {
    const l = testLesson('T19', [Q_SINGLE_PLAIN], { completionRequirements: { requireAllSlidesViewed: false, requireAnimationCompleted: false, requireExerciseIds: [], minQuizScore: 0.7, requireSafetyCriticalCorrect: false } });
    const p = policyFromLesson(l);
    assert.equal(p.passThreshold, 0.7); assert.equal(p.safetyCriticalMustBeCorrect, true);
  });
  it('exactly at threshold passes (7/8 = 0.875 ≥ 0.8; 6/8 = 0.75 fails)', () => {
    const seven = gradeAttempt({ ...base, responses: { ...ALL_CORRECT, 'CPB-Q08': { choiceIds: ['b'] } } });
    assert.equal(seven.passed, true);
    const six = gradeAttempt({ ...base, responses: { ...ALL_CORRECT, 'CPB-Q08': { choiceIds: ['b'] }, 'CPB-Q02': { choiceIds: ['a'] } } });
    assert.equal(six.passed, false); assert.deepEqual(six.failReasons, ['BELOW_THRESHOLD']);
    const t75 = gradeAttempt({ ...base, policy: { passThreshold: 0.75 }, responses: { ...ALL_CORRECT, 'CPB-Q08': { choiceIds: ['b'] }, 'CPB-Q02': { choiceIds: ['a'] } } });
    assert.equal(t75.passed, true);
  });
});

describe('safety-critical gating', () => {
  it('one wrong safety-critical item fails even at 87.5%', () => {
    const r = gradeAttempt({ ...base, responses: { ...ALL_CORRECT, 'CPB-Q03': { choiceIds: ['true'] } } });
    assert.equal(r.score, 0.875); assert.equal(r.meetsThreshold, true);
    assert.equal(r.passed, false); assert.deepEqual(r.failReasons, ['SAFETY_CRITICAL_WRONG']);
    assert.equal(r.safetyCriticalAllCorrect, false);
  });
  it('surfaces each failure with its topic, answers and correction', () => {
    const r = gradeAttempt({ ...base, responses: { ...ALL_CORRECT, 'CPB-Q03': { choiceIds: ['true'] }, 'CPB-Q04': { numeric: 1800 }, 'CPB-Q07': { choiceIds: ['continue'] } } });
    assert.deepEqual(r.safetyFailures.map((f) => [f.questionId, f.safetyTopic]), [['CPB-Q03', 'leverage'], ['CPB-Q04', 'liquidation'], ['CPB-Q07', 'loss-limits']]);
    const lev = r.safetyFailures[0];
    assert.equal(lev?.correctAnswerText, 'False');
    assert.equal(lev?.learnerAnswerText, 'True');
    assert.match(lev?.correction ?? '', /moves liquidation closer/);
    assert.match(lev?.misconception ?? '', /amplifies losses/);
    assert.deepEqual(lev?.remediationRef, { lessonId: 'T22', anchorId: 'T22-N03' });
    assert.deepEqual(r.bySafetyTopic['liquidation'], { total: 1, correct: 0, failedQuestionIds: ['CPB-Q04'] });
    assert.deepEqual(r.bySafetyTopic['loss-limits'], { total: 1, correct: 0, failedQuestionIds: ['CPB-Q07'] });
  });
  it('safety gate can be switched off only explicitly (config), and then aggregate decides', () => {
    const r = gradeAttempt({ ...base, policy: { safetyCriticalMustBeCorrect: false }, responses: { ...ALL_CORRECT, 'CPB-Q03': { choiceIds: ['true'] } } });
    assert.equal(r.passed, true); assert.equal(r.safetyFailures.length, 1, 'still surfaced');
  });
  it('unanswered items make the attempt INCOMPLETE', () => {
    const { ['CPB-Q08']: _skip, ...rest } = ALL_CORRECT;
    const r = gradeAttempt({ ...base, responses: rest });
    assert.equal(r.score, 0.875); assert.ok(r.failReasons.includes('INCOMPLETE')); assert.equal(r.passed, false);
  });
  it('every result is education-only and never authorizes trading', () => {
    const r = gradeAttempt({ ...base, responses: ALL_CORRECT });
    assert.equal(r.passed, true); assert.equal(r.score, 1);
    assert.equal(r.educationOnly, true); assert.equal(r.authorizesLiveTrading, false);
    assert.equal(r.notice, EDUCATION_ONLY_NOTICE);
    assert.match(r.notice, /never permission to trade/);
  });
  it('a practice attempt never passes', () => {
    assert.equal(gradeAttempt({ ...base, kind: 'practice', responses: ALL_CORRECT }).passed, false);
  });
  it('produces a contract-shaped QuizAttempt', () => {
    const r = gradeAttempt({ ...base, responses: ALL_CORRECT });
    assert.equal(r.attempt.answers.length, 8);
    assert.equal(r.attempt.questionSetVersion, 'v');
    assert.equal(r.attempt.answers.find((a) => a.questionId === 'CPB-Q04')?.safetyCritical, true);
  });
});
