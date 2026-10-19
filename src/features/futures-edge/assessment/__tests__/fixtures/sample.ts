/**
 * TEST FIXTURES ONLY: synthetic questions used to exercise the engine. NOT lesson content, never shipped to learners,
 * not imported by any runtime module. Text is deliberately short and generic.
 */
import type { CheckpointQuestionId, Lesson, LessonId, Question } from '../../../contracts';
import type { LearnerResponse } from '../../engine/types';

type CPQ = Question & { id: CheckpointQuestionId };

export const Q_SINGLE_WAIT: CPQ = {
  id: 'CPB-Q01', type: 'single', linkedLessonId: 'T21', cognitiveTag: 'application', learningOutcome: 'Test fixture: abstain when the checklist is not met.',
  prompt: 'Test fixture: the trigger candle has not closed. What is the decision?',
  choices: [{ id: 'buy', text: 'DEMO BUY now', decision: 'BUY' }, { id: 'wait', text: 'WAIT for the close', decision: 'WAIT' }, { id: 'no-trade', text: 'NO_TRADE today', decision: 'NO_TRADE' }],
  answer: { kind: 'choice', choiceId: 'wait' },
  rationale: 'Test fixture rationale: the rule requires a closed candle, so waiting is correct.',
  misconceptionFeedback: { buy: 'Test fixture: buying before the close skips the rule.', 'no-trade': 'Test fixture: the setup may still form; waiting fits better.' },
  shuffleChoices: true,
};
export const Q_MULTI: CPQ = {
  id: 'CPB-Q02', type: 'multi', linkedLessonId: 'T22', cognitiveTag: 'recall', learningOutcome: 'Test fixture: costs.',
  prompt: 'Test fixture: which are trading costs?',
  choices: [{ id: 'a', text: 'Fees' }, { id: 'b', text: 'Slippage' }, { id: 'c', text: 'The take-profit level' }, { id: 'd', text: 'Funding' }],
  answer: { kind: 'choices', choiceIds: ['a', 'b', 'd'] },
  rationale: 'Test fixture rationale: fees, slippage and funding all reduce net results.',
  misconceptionFeedback: { c: 'Test fixture: a target is a plan, not a cost.' }, shuffleChoices: true,
};
export const Q_TF_LEVERAGE: CPQ = {
  id: 'CPB-Q03', type: 'true-false', linkedLessonId: 'T22', cognitiveTag: 'mistake-risk', learningOutcome: 'Test fixture: leverage.',
  safetyCritical: true, safetyTopic: 'leverage', remediationRef: { lessonId: 'T22', anchorId: 'T22-N03' },
  prompt: 'Test fixture: higher leverage makes a trade safer.',
  choices: [{ id: 'true', text: 'True' }, { id: 'false', text: 'False' }],
  answer: { kind: 'choice', choiceId: 'false' },
  rationale: 'Test fixture rationale: leverage enlarges exposure and moves liquidation closer.',
  misconceptionFeedback: { true: 'Test fixture: leverage amplifies losses as well as gains.' },
};
export const Q_NUMERIC_LIQ: CPQ = {
  id: 'CPB-Q04', type: 'numeric', linkedLessonId: 'T22', cognitiveTag: 'calculation', learningOutcome: 'Test fixture: approximate liquidation.',
  safetyCritical: true, safetyTopic: 'liquidation',
  prompt: 'Test fixture: approximate liquidation for a 10x long from 2,000 with MMR 0.5%?',
  answer: { kind: 'numeric', value: 1810, tolerance: 0.5, unit: 'USDT', rounding: { decimals: 0 } },
  rationale: 'Test fixture rationale: 2,000 × (1 − 0.1 + 0.005) = 1,810 (approximate model).',
};
export const Q_ORDER: CPQ = {
  id: 'CPB-Q05', type: 'ordering', linkedLessonId: 'T23', cognitiveTag: 'recall', learningOutcome: 'Test fixture: lifecycle order.',
  prompt: 'Test fixture: order the lifecycle.',
  choices: [{ id: 'plan', text: 'Plan' }, { id: 'size', text: 'Size' }, { id: 'enter', text: 'Enter (demo)' }, { id: 'review', text: 'Review' }],
  answer: { kind: 'order', choiceIds: ['plan', 'size', 'enter', 'review'] },
  rationale: 'Test fixture rationale: plan and size before entering; review after.',
  shuffleChoices: true,
};
export const Q_CHART: CPQ = {
  id: 'CPB-Q06', type: 'chart', linkedLessonId: 'T21', cognitiveTag: 'interpretation', learningOutcome: 'Test fixture: fakeout.',
  fixtureId: 'FX-TEST-FAKEOUT-01', prompt: 'Test fixture: the wick broke the level but the candle closed below. What is it?',
  choices: [{ id: 'breakout', text: 'A confirmed breakout' }, { id: 'fakeout', text: 'A possible fakeout' }],
  answer: { kind: 'choice', choiceId: 'fakeout' },
  rationale: 'Test fixture rationale: no close above the level means no confirmation.',
  misconceptionFeedback: { breakout: 'Test fixture: a wick alone does not confirm.' },
};
export const Q_SCENARIO_STOP: CPQ = {
  id: 'CPB-Q07', type: 'scenario', linkedLessonId: 'T23', cognitiveTag: 'application', learningOutcome: 'Test fixture: consecutive-loss rule.',
  safetyCritical: true, safetyTopic: 'loss-limits', remediationRef: { lessonId: 'T23' },
  prompt: 'Test fixture: two losses in a row; the plan says stop after two. Next setup looks perfect.',
  choices: [{ id: 'continue', text: 'CONTINUE_SIM_PRACTICE with half size', decision: 'CONTINUE_SIM_PRACTICE' }, { id: 'stop', text: 'STOP_TRADING for this session', decision: 'STOP_TRADING' }, { id: 'wait', text: 'WAIT ten minutes then continue', decision: 'WAIT' }],
  answer: { kind: 'choice', choiceId: 'stop' },
  rationale: 'Test fixture rationale: the consecutive-loss rule has triggered; the session ends.',
  misconceptionFeedback: { continue: 'Test fixture: smaller size still breaks the rule.', wait: 'Test fixture: a pause does not reset the rule.' },
};
export const Q_SINGLE_PLAIN: CPQ = {
  id: 'CPB-Q08', type: 'single', linkedLessonId: 'T19', cognitiveTag: 'recall', learningOutcome: 'Test fixture: horizon.',
  prompt: 'Test fixture: typical scalping horizon?',
  choices: [{ id: 'a', text: 'Seconds to minutes' }, { id: 'b', text: 'Months' }],
  answer: { kind: 'choice', choiceId: 'a' },
  rationale: 'Test fixture rationale: scalps are short-horizon.',
  misconceptionFeedback: { b: 'Test fixture: months is long-term investing.' },
};

export const SAMPLE_SET: CPQ[] = [Q_SINGLE_WAIT, Q_MULTI, Q_TF_LEVERAGE, Q_NUMERIC_LIQ, Q_ORDER, Q_CHART, Q_SCENARIO_STOP, Q_SINGLE_PLAIN];

/** Every response correct, keyed by id. */
export const ALL_CORRECT: Readonly<Record<string, LearnerResponse>> = {
  'CPB-Q01': { choiceIds: ['wait'] }, 'CPB-Q02': { choiceIds: ['d', 'a', 'b'] }, 'CPB-Q03': { choiceIds: ['false'] },
  'CPB-Q04': { numeric: 1810.3 }, 'CPB-Q05': { choiceIds: ['plan', 'size', 'enter', 'review'] }, 'CPB-Q06': { choiceIds: ['fakeout'] },
  'CPB-Q07': { choiceIds: ['stop'] }, 'CPB-Q08': { choiceIds: ['a'] },
};

/** Re-id a fixture question for a lesson (Tnn-Qnn). */
export function asLessonQuestion(q: Question, lessonId: LessonId, n: number): Question {
  return { ...q, id: `${lessonId}-Q${String(n).padStart(2, '0')}` as Question['id'], linkedLessonId: lessonId };
}

/** Minimal, type-correct Lesson for engine tests (NOT valid authored content: arrays are short on purpose). */
export function testLesson(id: LessonId, questions: Question[], over: Partial<Lesson> = {}): Lesson {
  const phaseId = (['P1', 'P1', 'P1', 'P1', 'P2', 'P2', 'P2', 'P2', 'P2', 'P3', 'P3', 'P3', 'P3', 'P4', 'P4', 'P4', 'P4', 'P4', 'P5', 'P5', 'P5', 'P5', 'P5'] as const)[Number(id.slice(1)) - 1] ?? 'P1';
  return {
    schemaVersion: '1.1.0', id, phaseId, title: `Test ${id}`, summary: 'Test fixture lesson.', objectives: ['a', 'b', 'c'],
    prerequisites: [], durationMinutes: 10, difficulty: 'beginner', glossaryEntries: [],
    slides: [{ id: `${id}-S01`, kind: 'cover-problem', title: 'Test', narrationText: 'Test.', blocks: [], glossaryRefs: [] }, { id: `${id}-S02`, kind: 'recap', title: 'Test', narrationText: 'Test.', blocks: [], glossaryRefs: [] }],
    notesSections: [], animationScenes: [], exercises: [], quizQuestions: questions, commonMistakes: [], takeaways: [],
    reviewCard: { keyTermIds: [], safetyNote: 'x', reviewMinutes: 2, retrievalQuestion: 'x' },
    completionRequirements: { requireAllSlidesViewed: true, requireAnimationCompleted: false, requireExerciseIds: [], minQuizScore: 0.8, requireSafetyCriticalCorrect: true },
    version: '1.0.0', fictionalDataNotice: 'Fictional.', notesComplexity: 'simple',
    ...over,
  };
}
