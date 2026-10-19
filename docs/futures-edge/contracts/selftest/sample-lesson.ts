/**
 * CONTRACT SELF-TEST SAMPLE — NOT LEARNER CONTENT. Never import from the app; exists only to prove that
 * the types and validators accept a structurally complete lesson. Real T14 is authored by EDGE-05.
 */
import { SCHEMA_VERSION, type Lesson, type Slide, type NotesSection, type AnimationScene } from '../../../../src/features/futures-edge/contracts/index';

const slide = (n: number, kind: Slide['kind']): Slide => ({
  id: `T14-S0${n}` as Slide['id'],
  kind,
  title: `Contract sample slide ${n}`,
  narrationText: 'Narration used by the contract self-test.',
  blocks: [{ kind: 'paragraph', text: 'A [[candlestick]] shows open, high, low and close for one period.' }],
  glossaryRefs: ['candlestick'],
});
const notes = (n: number, heading: NotesSection['heading']): NotesSection => ({
  id: `T14-N0${n}` as NotesSection['id'],
  heading,
  title: `Section ${heading}`,
  blocks: [{ kind: 'paragraph', text: 'Self-test notes paragraph. '.repeat(12) }],
});
const scene = (n: number): AnimationScene => ({
  id: `T14-A0${n}` as AnimationScene['id'],
  type: 'candle-formation',
  durationMs: 30_000,
  caption: `Step ${n}: the fictional candle changes.`,
  parameters: { step: n },
  fixtureId: 'FX-SELFTEST-OHLC-01',
  reducedMotionDescription: `Static description of step ${n}.`,
});

export const sampleLesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  id: 'T14',
  phaseId: 'P4',
  title: 'Contract self-test lesson',
  summary: 'Proves the contract accepts a complete lesson.',
  objectives: ['Learner can name O, H, L, C.', 'Learner can tell body from wick.', 'Learner can spot a doji.'],
  prerequisites: ['T03'],
  durationMinutes: 15,
  difficulty: 'beginner',
  glossaryEntries: [{
    id: 'candlestick', term: 'Candlestick', plainDefinition: 'A picture of price over one period.',
    technicalMeaning: 'An OHLC bar drawn as body and wicks.', example: 'A 1-minute candle.', relatedTermIds: [],
    introducedIn: 'T14',
  }],
  slides: [slide(1, 'cover-problem'), slide(2, 'key-definition'), slide(3, 'visual-breakdown'), slide(4, 'worked-example'), slide(5, 'recap')],
  notesSections: [
    notes(1, 'meaning'), notes(2, 'why-it-matters'), notes(3, 'example'), notes(4, 'how-to-recognize'),
    notes(5, 'common-mistakes'), notes(6, 'safety-note'), notes(7, 'quick-revision'),
  ],
  animationScenes: [scene(1), scene(2), scene(3), scene(4), scene(5)],
  exercises: [{
    id: 'T14-X01', type: 'candle-builder', title: 'Build a candle', fixtureId: 'FX-SELFTEST-OHLC-01',
    simulatorId: 'ohlc.validate', instructions: 'Set O, H, L, C so the candle is valid.',
    steps: [
      { id: 'T14-X01-01', prompt: 'Set the open.', hint: 'Open is the first price.' },
      { id: 'T14-X01-02', prompt: 'Set the close.', hint: 'Close is the last price.' },
    ],
    allowedControls: ['slider', 'numeric-input', 'reset', 'hint'],
    parameters: { min: 100, max: 200 },
    expectedEvaluation: { kind: 'constraint', description: 'high ≥ max(open, close) and low ≤ min(open, close)', simulatorId: 'ohlc.validate' },
    explanation: 'High and low bound the body.',
    fictionalDataLabel: 'Fictional educational data — not a real market.',
  }],
  quizQuestions: [
    {
      id: 'T14-Q01', type: 'single', prompt: 'Which price is the close?', cognitiveTag: 'interpretation',
      choices: [{ id: 'a', text: 'Last price of the period' }, { id: 'b', text: 'Highest price' }],
      answer: { kind: 'choice', choiceId: 'a' }, rationale: 'Close is the last traded price in the period.',
      misconceptionFeedback: { b: 'That is the high.' }, learningOutcome: 'Identify close.', linkedLessonId: 'T14',
    },
    {
      id: 'T14-Q02', type: 'true-false', prompt: 'A green candle guarantees the next one is green.', cognitiveTag: 'mistake-risk',
      choices: [{ id: 'true', text: 'True' }, { id: 'false', text: 'False' }],
      answer: { kind: 'choice', choiceId: 'false' }, rationale: 'Candles describe the past, they do not predict.',
      misconceptionFeedback: { true: 'Past candles do not guarantee future direction.' },
      learningOutcome: 'Reject candle certainty.', linkedLessonId: 'T14', safetyCritical: true, safetyTopic: 'not-advice',
    },
    {
      id: 'T14-Q03', type: 'numeric', prompt: 'Open 100, close 104: body size in USDT?', cognitiveTag: 'calculation',
      answer: { kind: 'numeric', value: 4, tolerance: 0, unit: 'USDT' }, rationale: '|104 − 100| = 4 USDT.',
      learningOutcome: 'Compute body size.', linkedLessonId: 'T14',
    },
  ],
  commonMistakes: [{ mistake: 'Reading a wick as the close.', correction: 'The close is the body edge.' }],
  takeaways: ['OHLC = four prices.', 'Body = open to close.', 'Wicks = extremes.'],
  reviewCard: { keyTermIds: ['candlestick'], safetyNote: 'Candles do not predict.', reviewMinutes: 3, retrievalQuestion: 'What does the upper wick show?' },
  completionRequirements: { requireAllSlidesViewed: true, requireAnimationCompleted: true, requireExerciseIds: ['T14-X01'], minQuizScore: 0.8, requireSafetyCriticalCorrect: true },
  version: '0.1.0',
  fictionalDataNotice: 'All prices in this lesson are fictional.',
  notesComplexity: 'simple',
};
