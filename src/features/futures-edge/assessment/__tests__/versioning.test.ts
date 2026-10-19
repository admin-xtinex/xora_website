import { describe, it, assert } from './harness';
import { buildManifest, buildLessonManifest, compareQuestionSetVersion, verifyManifest, parseQuestionSetVersion } from '../question-sets/manifest';
import { classifyAttempts, summarizeHistory } from '../engine/retry';
import { gradeAttempt } from '../engine/grader';
import { LocalOnlyDemoProgressAdapter } from '../progress/local-demo-adapter';
import { MemoryStorage } from '../progress/storage';
import { ProgressService } from '../progress/service';
import { validateManifestIntegrity } from '../question-sets/validator';
import { SAMPLE_SET, Q_SINGLE_WAIT, Q_TF_LEVERAGE, Q_SINGLE_PLAIN, Q_MULTI, asLessonQuestion, testLesson } from './fixtures/sample';
import type { Question } from '../../contracts';

const pol = { passThreshold: 0.8, safetyCriticalMustBeCorrect: true };
const mk = (qs: Question[], v = '0.1.0') => buildManifest({ scope: { kind: 'checkpoint', checkpointId: 'CPB' }, contentVersion: v, questions: qs, policy: pol });

describe('question-set manifests', () => {
  it('questionSetVersion = contentVersion + content/grading hashes; stable under key order', () => {
    const a = mk(SAMPLE_SET);
    const reordered = SAMPLE_SET.map((q) => Object.fromEntries(Object.entries(q).reverse()) as unknown as Question);
    assert.equal(mk(reordered).questionSetVersion, a.questionSetVersion);
    const p = parseQuestionSetVersion(a.questionSetVersion);
    assert.equal(p?.contentVersion, '0.1.0');
    assert.match(a.questionSetVersion, /^0\.1\.0\+c\.[0-9a-f]{12}\.g\.[0-9a-f]{12}$/);
    assert.ok(verifyManifest(a));
    assert.equal(Object.isFrozen(a.questions[0]), true);
  });
  it('text-only edit vs answer-key edit are distinguished', () => {
    const a = mk(SAMPLE_SET);
    const text = mk([{ ...Q_SINGLE_WAIT, prompt: `${Q_SINGLE_WAIT.prompt} (reworded)` }, ...SAMPLE_SET.slice(1)]);
    const key = mk([{ ...Q_SINGLE_WAIT, answer: { kind: 'choice', choiceId: 'no-trade' } }, ...SAMPLE_SET.slice(1)]);
    const safety = mk([Q_SINGLE_WAIT, Q_MULTI, { ...Q_TF_LEVERAGE, safetyCritical: false }, ...SAMPLE_SET.slice(3)]);
    assert.equal(compareQuestionSetVersion(a.questionSetVersion, a), 'identical');
    assert.equal(compareQuestionSetVersion(a.questionSetVersion, text), 'text-only');
    assert.equal(compareQuestionSetVersion(a.questionSetVersion, key), 'grading-changed');
    assert.equal(compareQuestionSetVersion(a.questionSetVersion, safety), 'grading-changed');
    assert.equal(compareQuestionSetVersion('garbage', a), 'unparseable');
  });
  it('detects a tampered manifest', () => {
    const a = mk(SAMPLE_SET);
    const forged = { ...a, questions: [{ ...Q_SINGLE_WAIT, answer: { kind: 'choice' as const, choiceId: 'buy' } }, ...a.questions.slice(1)] };
    assert.equal(verifyManifest(forged), false);
    assert.equal(validateManifestIntegrity(forged).errors[0]?.code, 'MANIFEST_TAMPERED');
  });
});

describe('stale attempts are invalidated, never silently counted', () => {
  const v1 = mk(SAMPLE_SET);
  const v2 = mk([{ ...Q_SINGLE_WAIT, answer: { kind: 'choice', choiceId: 'no-trade' } }, ...SAMPLE_SET.slice(1)]);
  const textOnly = mk([{ ...Q_SINGLE_WAIT, prompt: 'Reworded.' }, ...SAMPLE_SET.slice(1)]);
  const all = Object.fromEntries(SAMPLE_SET.map((q) => [q.id, q.answer.kind === 'numeric' ? { numeric: q.answer.value } : { choiceIds: q.answer.kind === 'choice' ? [q.answer.choiceId] : q.answer.choiceIds }]));
  const passOnV1 = gradeAttempt({ scope: v1.scope, questionSetVersion: v1.questionSetVersion, questions: v1.questions, responses: all, attemptId: 'a1', startedAt: '2026-10-19T02:00:00Z', finishedAt: '2026-10-19T02:01:00Z' });
  it('a passing v1 attempt does not pass v2', () => {
    assert.equal(passOnV1.passed, true);
    const h = summarizeHistory([passOnV1.attempt], v2);
    assert.equal(h.passed, false); assert.equal(h.countedAttempts, 0); assert.equal(h.staleAttempts, 1); assert.equal(h.bestScore, null);
    assert.equal(classifyAttempts([passOnV1.attempt], v2).stale[0]?.change, 'grading-changed');
  });
  it("text-only change: stale under 'any-change' (default), kept under 'grading-change'", () => {
    assert.equal(summarizeHistory([passOnV1.attempt], textOnly).passed, false);
    assert.equal(summarizeHistory([passOnV1.attempt], textOnly, textOnly.policy, { staleWhen: 'grading-change' }).passed, true);
  });
  it('attempts for another scope are ignored', () => {
    const other = { ...passOnV1.attempt, scope: { kind: 'checkpoint' as const, checkpointId: 'CPA' as const } };
    assert.equal(summarizeHistory([other], v1).countedAttempts, 0);
  });
});

describe('ProgressService: content-version migration + question-set binding', () => {
  const now = () => '2026-10-19T02:30:00.000Z';
  const qs = [asLessonQuestion(Q_SINGLE_PLAIN, 'T19', 1), asLessonQuestion(Q_TF_LEVERAGE, 'T19', 2), asLessonQuestion(Q_SINGLE_WAIT, 'T19', 3)];
  const lesson = testLesson('T19', qs, { completionRequirements: { requireAllSlidesViewed: false, requireAnimationCompleted: false, requireExerciseIds: [], minQuizScore: 0.8, requireSafetyCriticalCorrect: true } });
  const allRight = { 'T19-Q01': { choiceIds: ['a'] }, 'T19-Q02': { choiceIds: ['false'] }, 'T19-Q03': { choiceIds: ['wait'] } };
  async function passed(storage: MemoryStorage) {
    const svc = new ProgressService(new LocalOnlyDemoProgressAdapter({ storage, now }), { now });
    const man = buildLessonManifest(lesson);
    const r = gradeAttempt({ scope: man.scope, questionSetVersion: man.questionSetVersion, questions: man.questions, responses: allRight, attemptId: 'a1', startedAt: now(), finishedAt: now() });
    const st = await svc.recordLessonAttempt(lesson, r, man);
    assert.equal(st.progress.completed, true);
    return svc;
  }
  it('same version, edited answer key (author forgot to bump): completion is revoked, viewed kept', async () => {
    const storage = new MemoryStorage();
    const svc = await passed(storage);
    await svc.markSlideViewed(lesson, 'T19-S01');
    const edited = { ...lesson, quizQuestions: [qs[0]!, qs[1]!, { ...qs[2]!, answer: { kind: 'choice' as const, choiceId: 'no-trade' } }] };
    const st = await svc.openLesson(edited);
    assert.equal(st.progress.completed, false);
    assert.equal(st.history.staleAttempts, 1);
    assert.equal(st.progress.assessed.bestScore, null);
    assert.deepEqual(st.progress.viewed.slides, ['T19-S01']);
    assert.ok(st.completion.missing.includes('take the quiz'));
  });
  it('major content version bump → reset-assessment (contract defaultMigrationPolicy); resume pointer survives if item still exists', async () => {
    const storage = new MemoryStorage();
    const svc = await passed(storage);
    await svc.recordStep(lesson, { mode: 'slides', itemId: 'T19-S02' });
    const v2 = { ...lesson, version: '2.0.0' };
    const st = await svc.openLesson(v2);
    assert.equal(st.migration, 'reset-assessment');
    assert.equal(st.progress.contentVersion, '2.0.0');
    assert.equal(st.progress.completed, false);
    assert.deepEqual(st.progress.lastStepId, { mode: 'slides', itemId: 'T19-S02' });
  });
  it('minor bump with identical questions keeps completion', async () => {
    const storage = new MemoryStorage();
    const svc = await passed(storage);
    const st = await svc.openLesson({ ...lesson, version: '1.1.0' });
    assert.equal(st.migration, 'keep'); assert.equal(st.progress.completed, true);
  });
  it('removed resume target falls back to the mode start', async () => {
    const storage = new MemoryStorage();
    const svc = await passed(storage);
    await svc.recordStep(lesson, { mode: 'slides', itemId: 'T19-S02' });
    const st = await svc.openLesson({ ...lesson, version: '1.2.0', slides: lesson.slides.slice(0, 1) });
    assert.deepEqual(st.progress.lastStepId, { mode: 'slides' });
  });
  it('rejects recording a result graded against another question-set version', async () => {
    const svc = new ProgressService(new LocalOnlyDemoProgressAdapter({ storage: new MemoryStorage(), now }), { now });
    const r = gradeAttempt({ scope: { kind: 'lesson', lessonId: 'T19' }, questionSetVersion: '1.0.0+c.000000000000.g.000000000000', questions: qs, responses: allRight, attemptId: 'x', startedAt: now(), finishedAt: now() });
    await assert.rejects(() => svc.recordLessonAttempt(lesson, r), /STALE_QUESTION_SET/);
  });
});
