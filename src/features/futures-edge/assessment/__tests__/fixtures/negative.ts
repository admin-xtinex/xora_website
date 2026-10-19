/**
 * NEGATIVE TEST FIXTURE: deliberately broken question data. Each entry names the validator code it must trigger.
 * Test-only; never shipped.
 */
export const BROKEN_QUESTIONS: Array<{ expect: string[]; q: unknown }> = [
  { expect: ['Q_ANSWER_KEY_MISSING', 'ANSWER_REF'], q: {
    id: 'T19-Q01', type: 'single', linkedLessonId: 'T19', cognitiveTag: 'recall', learningOutcome: 'x outcome',
    prompt: 'Broken: answer key not among choices', choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }],
    answer: { kind: 'choice', choiceId: 'z' }, rationale: 'Long enough rationale text.', misconceptionFeedback: { a: 'no', b: 'no' } } },
  { expect: ['Q_RATIONALE_MISSING'], q: {
    id: 'T19-Q02', type: 'single', linkedLessonId: 'T19', cognitiveTag: 'recall', learningOutcome: 'x outcome',
    prompt: 'Broken: empty rationale', choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }],
    answer: { kind: 'choice', choiceId: 'a' }, rationale: ' ', misconceptionFeedback: { b: 'no' } } },
  { expect: ['Q_DISTRACTOR_FEEDBACK_MISSING', 'DISTRACTOR_FEEDBACK'], q: {
    id: 'T19-Q03', type: 'single', linkedLessonId: 'T19', cognitiveTag: 'recall', learningOutcome: 'x outcome',
    prompt: 'Broken: distractor without feedback', choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }],
    answer: { kind: 'choice', choiceId: 'a' }, rationale: 'Long enough rationale text.' } },
  { expect: ['Q_SAFETY_TOPIC_MISSING'], q: {
    id: 'T19-Q04', type: 'true-false', linkedLessonId: 'T19', cognitiveTag: 'mistake-risk', learningOutcome: 'x outcome',
    safetyCritical: true, prompt: 'Broken: safety item without topic', choices: [{ id: 'true', text: 'True' }, { id: 'false', text: 'False' }],
    answer: { kind: 'choice', choiceId: 'false' }, rationale: 'Long enough rationale text.', misconceptionFeedback: { true: 'no' } } },
  { expect: ['Q_ID_FORMAT'], q: {
    id: 'T19-Q4', type: 'single', linkedLessonId: 'T19', cognitiveTag: 'recall', learningOutcome: 'x outcome',
    prompt: 'Broken: one-digit id (pre-contract style)', choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }],
    answer: { kind: 'choice', choiceId: 'a' }, rationale: 'Long enough rationale text.', misconceptionFeedback: { b: 'no' } } },
  { expect: ['Q_SHUFFLE_UNSAFE'], q: {
    id: 'T19-Q05', type: 'single', linkedLessonId: 'T19', cognitiveTag: 'recall', learningOutcome: 'x outcome', shuffleChoices: true,
    prompt: 'Broken: shuffled "all of the above"', choices: [{ id: 'a', text: 'Fees' }, { id: 'b', text: 'Slippage' }, { id: 'c', text: 'All of the above' }],
    answer: { kind: 'choice', choiceId: 'c' }, rationale: 'Long enough rationale text.', misconceptionFeedback: { a: 'no', b: 'no' } } },
  { expect: ['Q_DECISION_TAG_MISMATCH'], q: {
    id: 'T19-Q06', type: 'single', linkedLessonId: 'T19', cognitiveTag: 'application', learningOutcome: 'x outcome',
    prompt: 'Broken: decision tag disagrees with text', choices: [{ id: 'a', text: 'WAIT for the close', decision: 'NO_TRADE' }, { id: 'b', text: 'DEMO BUY', decision: 'BUY' }],
    answer: { kind: 'choice', choiceId: 'a' }, rationale: 'Long enough rationale text.', misconceptionFeedback: { b: 'no' } } },
  { expect: ['ANSWER_KIND'], q: {
    id: 'T19-Q07', type: 'multi', linkedLessonId: 'T19', cognitiveTag: 'recall', learningOutcome: 'x outcome',
    prompt: 'Broken: multi with single answer kind', choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }],
    answer: { kind: 'choice', choiceId: 'a' }, rationale: 'Long enough rationale text.', misconceptionFeedback: { b: 'no' } } },
];
