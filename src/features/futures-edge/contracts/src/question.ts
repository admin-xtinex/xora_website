/**
 * Question + checkpoint contracts. Owner: EDGE-00 (types). Questions authored by content bots inside lessons;
 * checkpoint configs + any checkpoint-only items owned by EDGE-09.
 */
import type { QuestionId, ChoiceId, LessonId, CheckpointId, FixtureId, CheckpointQuestionId } from './ids';
import type { RichText } from './content';
import type { DecisionWord } from './decisions';
import type { Rounding } from './exercise';

export const QUESTION_TYPES = ['single', 'multi', 'true-false', 'numeric', 'ordering', 'chart', 'scenario'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const SAFETY_TOPICS = [
  'leverage', 'liquidation', 'execution', 'account-security', 'fees-costs', 'no-trade', 'stablecoin-risk',
  'not-advice',
  'loss-limits', // v1.1.0: daily loss limit, consecutive-loss stop, "winning back" losses
] as const;
export type SafetyTopic = (typeof SAFETY_TOPICS)[number];

export interface Choice {
  id: ChoiceId;
  text: RichText;
  /** v1.1.0: set when the choice IS a decision word (e.g. id "wait" → decision "WAIT"), so the engine can track abstentions. */
  decision?: DecisionWord;
}

export type Answer =
  | { kind: 'choice'; choiceId: ChoiceId }                 // single, true-false, chart, scenario
  | { kind: 'choices'; choiceIds: ChoiceId[] }             // multi (exact set)
  | { kind: 'numeric'; value: number; tolerance: number; unit: string; rounding?: Rounding }
  | { kind: 'order'; choiceIds: ChoiceId[] };              // ordering

export interface Question {
  id: QuestionId;
  type: QuestionType;
  prompt: RichText;
  /** Required for every type except 'numeric'. Choice ids are stable and never renumbered. */
  choices?: Choice[];
  answer: Answer;
  /** Why the correct answer is correct. */
  rationale: RichText;
  /** Why each distractor is wrong, keyed by choice id. Required for every wrong choice. */
  misconceptionFeedback?: Record<ChoiceId, RichText>;
  /** Must be answered correctly (or remediated) regardless of aggregate score. */
  safetyCritical?: boolean;
  /** Required when safetyCritical is true. */
  safetyTopic?: SafetyTopic;
  /** What understanding this item tests (one sentence). */
  learningOutcome: RichText;
  linkedLessonId: LessonId;
  /** e.g. "interpretation" or "mistake-risk" — each lesson needs at least one of each. */
  cognitiveTag: 'recall' | 'interpretation' | 'mistake-risk' | 'calculation' | 'application';
  remediationRef?: { lessonId: LessonId; anchorId?: string };
  /** Shuffle allowed only when choice order carries no meaning (never for ordering / "all of the above"). */
  shuffleChoices?: boolean;
  fixtureId?: FixtureId;
}
export const LESSON_QUESTIONS_MIN = 3;
export const LESSON_QUESTIONS_MAX = 5;

export interface CheckpointConfig {
  id: CheckpointId;
  title: string;
  afterLessonId: LessonId;              // CP1: T04, CPA: T13, CPB: T23
  coversLessonIds: LessonId[];
  /** References to lesson questions (T..-Q..) and/or checkpoint-only items (CPA-Q..). */
  questionIds: QuestionId[];
  /** Checkpoint-only items authored by EDGE-09. */
  items: Array<Question & { id: CheckpointQuestionId }>;
  /** Fraction 0..1. Proposal: 0.8. Configurable, NOT a proof of trading readiness. */
  passThreshold: number;
  /** When true, every safetyCritical item must be correct (or remediated + re-answered) to pass. */
  safetyCriticalMustBeCorrect: boolean;
  /** CP1 is non-gating. No checkpoint ever unlocks real trading. */
  gating: boolean;
  questionCount: { min: number; max: number };
  disclaimer: RichText;
  version: string;
}
