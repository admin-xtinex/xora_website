/** Grader, progress reducer, local storage adapter, version migration and router. */
import { describe, expect, it } from 'vitest';
import { emptyProgress, LOCAL_PROGRESS_KEY_PREFIX, validateProgress, type Question } from '@futures-edge/contracts';
import { feedbackFor, grade, isCorrect, seededShuffle, toAttempt } from '../assessment/grader';
import { applyEvent, createLocalAdapter, isComplete, memoryStore, migrate } from '../assessment/progress';
import { hrefFor, parseRoute } from '../platform/router';

const single: Question = {
  id: 'T14-Q01', type: 'single', prompt: 'p', choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], answer: { kind: 'choice', choiceId: 'a' },
  rationale: 'because A', misconceptionFeedback: { b: 'B is wrong because…' }, learningOutcome: 'x', linkedLessonId: 'T14', cognitiveTag: 'interpretation',
};
const multi: Question = { ...single, id: 'T14-Q02', type: 'multi', choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }, { id: 'c', text: 'C' }], answer: { kind: 'choices', choiceIds: ['a', 'c'] }, misconceptionFeedback: { b: 'no' } };
const numeric: Question = { ...single, id: 'T14-Q03', type: 'numeric', choices: undefined, answer: { kind: 'numeric', value: 9.5, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } }, misconceptionFeedback: undefined };
const safety: Question = { ...single, id: 'T14-Q04', safetyCritical: true, safetyTopic: 'not-advice', cognitiveTag: 'mistake-risk' };
const order: Question = { ...single, id: 'T14-Q05', type: 'ordering', choices: [{ id: 'x', text: 'X' }, { id: 'y', text: 'Y' }], answer: { kind: 'order', choiceIds: ['y', 'x'] } };

describe('grader', () => {
  it('grades every answer kind', () => {
    expect(isCorrect(single, { choiceIds: ['a'] })).toBe(true);
    expect(isCorrect(single, { choiceIds: ['b'] })).toBe(false);
    expect(isCorrect(multi, { choiceIds: ['c', 'a'] })).toBe(true);
    expect(isCorrect(multi, { choiceIds: ['a'] })).toBe(false);
    expect(isCorrect(multi, { choiceIds: ['a', 'b', 'c'] })).toBe(false);
    expect(isCorrect(numeric, { numeric: 9.5 })).toBe(true);
    expect(isCorrect(numeric, { numeric: 9.504 })).toBe(true);
    expect(isCorrect(numeric, { numeric: 9.51 })).toBe(false);
    expect(isCorrect(numeric, { numeric: Number.NaN })).toBe(false);
    expect(isCorrect(order, { choiceIds: ['y', 'x'] })).toBe(true);
    expect(isCorrect(order, { choiceIds: ['x', 'y'] })).toBe(false);
    expect(isCorrect(single, undefined)).toBe(false);
  });
  it('scores, and tracks safety-critical misses separately from the score', () => {
    const g = grade([single, multi, numeric, safety], { 'T14-Q01': { choiceIds: ['a'] }, 'T14-Q02': { choiceIds: ['a', 'c'] }, 'T14-Q03': { numeric: 9.5 }, 'T14-Q04': { choiceIds: ['b'] } });
    expect(g.score).toBe(0.75);
    expect(g.safetyCriticalAllCorrect).toBe(false);
    expect(g.missedSafety.map((q) => q.id)).toEqual(['T14-Q04']);
  });
  it('gives distractor feedback when wrong and the rationale when right', () => {
    expect(feedbackFor(single, { choiceIds: ['b'] })).toBe('B is wrong because…');
    expect(feedbackFor(single, { choiceIds: ['a'] })).toBe('because A');
  });
  it('shuffles deterministically and keeps every id', () => {
    const a = seededShuffle(['a', 'b', 'c', 'd'], 'T14-Q01#0');
    expect(seededShuffle(['a', 'b', 'c', 'd'], 'T14-Q01#0')).toEqual(a);
    expect([...a].sort()).toEqual(['a', 'b', 'c', 'd']);
  });
});

const RULE = { requireAllSlidesViewed: true, requireAnimationCompleted: false, requireExerciseIds: ['T14-X01'], minQuizScore: 0.8, requireSafetyCriticalCorrect: true };
const SLIDES = ['T14-S01', 'T14-S02'];
const now = '2026-10-19T10:00:00.000Z';

describe('progress', () => {
  it('viewing alone never completes a lesson; practice + quiz + safety does', () => {
    let p = emptyProgress('local-anonymous', 'T14', '1.0.0', now);
    for (const s of SLIDES) p = applyEvent(p, { kind: 'slide', id: s }, RULE, SLIDES, [], now);
    expect(p.completed).toBe(false);
    p = applyEvent(p, { kind: 'exercise', id: 'T14-X01' }, RULE, SLIDES, [], now);
    expect(p.completed).toBe(false);
    const fail = toAttempt({ kind: 'lesson', lessonId: 'T14' }, '1.0.0', [single, safety], { 'T14-Q01': { choiceIds: ['a'] }, 'T14-Q04': { choiceIds: ['b'] } }, now, now);
    p = applyEvent(p, { kind: 'quiz', attempt: fail }, RULE, SLIDES, [], now);
    expect(p.completed).toBe(false);
    const pass = toAttempt({ kind: 'lesson', lessonId: 'T14' }, '1.0.0', [single, safety], { 'T14-Q01': { choiceIds: ['a'] }, 'T14-Q04': { choiceIds: ['a'] } }, now, now);
    p = applyEvent(p, { kind: 'quiz', attempt: pass }, RULE, SLIDES, [], now);
    expect(p).toMatchObject({ completed: true, completedAt: now, assessed: { bestScore: 1, attempts: 2, safetyCriticalPassed: true } });
    expect(validateProgress(p).ok).toBe(true);
    expect(isComplete(p, RULE, SLIDES, [])).toBe(true);
  });
  it('duplicate events do not change state', () => {
    const p = applyEvent(emptyProgress('u', 'T14', '1.0.0', now), { kind: 'slide', id: 'T14-S01' }, RULE, SLIDES, [], now);
    expect(applyEvent(p, { kind: 'slide', id: 'T14-S01' }, RULE, SLIDES, [], now).viewed.slides).toEqual(['T14-S01']);
  });
  it('migrates safely across content versions', () => {
    const p = { ...emptyProgress('u', 'T14', '1.0.0', now), assessed: { bestScore: 1, attempts: 1, safetyCriticalPassed: true }, completed: true, completedAt: now };
    expect(migrate(p, '1.2.0', now)).toMatchObject({ contentVersion: '1.2.0', completed: true });
    const m = migrate(p, '2.0.0', now);
    expect(m).toMatchObject({ contentVersion: '2.0.0', completed: false, assessed: { bestScore: null, attempts: 0 } });
    expect(m.completedAt).toBeUndefined();
    expect(migrate({ ...p, contentVersion: 'garbage' }, '1.0.0', now)).toMatchObject({ completed: false, viewed: { slides: [] } });
  });
  it('local adapter round-trips, ignores corrupted data and survives a full store', async () => {
    const store = memoryStore();
    const a = createLocalAdapter(store);
    expect(a.kind).toBe('local-demo');
    expect(a.durable).toBe(false);
    const p = emptyProgress('local-anonymous', 'T14', '1.0.0', now);
    await a.saveLesson(p);
    expect(await a.loadLesson('local-anonymous', 'T14')).toEqual(p);
    store.setItem(`${LOCAL_PROGRESS_KEY_PREFIX}local-anonymous`, '{not json');
    expect(await a.loadAll('local-anonymous')).toEqual([]);
    store.setItem(`${LOCAL_PROGRESS_KEY_PREFIX}local-anonymous`, JSON.stringify({ lessons: { T14: { ...p, educationOnly: false } } }));
    expect(await a.loadLesson('local-anonymous', 'T14')).toBeNull();
    const full = { ...memoryStore(), setItem: () => { throw new Error('QuotaExceeded'); } };
    await expect(createLocalAdapter(full as never).saveLesson(p)).resolves.toBeUndefined();
    await a.clear('local-anonymous');
    expect(await a.loadAll('local-anonymous')).toEqual([]);
  });
});

describe('router', () => {
  it('parses and builds course routes', () => {
    expect(parseRoute('/learn/futures-edge')).toEqual({ kind: 'home' });
    expect(parseRoute('/learn/futures-edge/')).toEqual({ kind: 'home' });
    expect(parseRoute('/learn/futures-edge/t14')).toEqual({ kind: 'lesson', id: 'T14' });
    expect(parseRoute('/learn/futures-edge/T23')).toEqual({ kind: 'lesson', id: 'T23' });
    expect(parseRoute('/learn/futures-edge/t24')).toEqual({ kind: 'not-found' });
    expect(parseRoute('/learn/futures-edge/checkpoint/cpa')).toEqual({ kind: 'checkpoint', id: 'CPA' });
    expect(parseRoute('/learn/futures-edge/glossary')).toEqual({ kind: 'glossary' });
    expect(parseRoute('/course')).toEqual({ kind: 'not-found' });
    expect(hrefFor({ kind: 'lesson', id: 'T05' })).toBe('/learn/futures-edge/t05');
    expect(hrefFor({ kind: 'checkpoint', id: 'CPB' })).toBe('/learn/futures-edge/checkpoint/cpb');
  });
});
