/**
 * EDGE-09 engine types. Built ON the frozen contracts (v1.1.0); nothing here redefines a contract type.
 */
import type {
  ChoiceId, DecisionWord, LessonId, Question, QuestionId, QuizAttempt, RichText, SafetyTopic, QuestionAttempt,
} from '../../contracts';
import type { RemediationTarget } from './remediation';

export type AttemptScope = QuizAttempt['scope'];
/** Same shape as the contract's QuestionAttempt.response. Ordering answers use `choiceIds` in the learner's order. */
export type LearnerResponse = QuestionAttempt['response'];

export interface ScoringPolicy {
  /** Fraction 0..1. Default 0.8 (D-06). A learning target, not trading readiness. */
  passThreshold: number;
  /** D-06: every safetyCritical item must be correct (or remediated + re-answered) to pass. */
  safetyCriticalMustBeCorrect: boolean;
  /** Unanswered items make the attempt INCOMPLETE (not passable). Default true. */
  requireAllAnswered: boolean;
}

export type ResponseStatus = 'answered' | 'unanswered' | 'invalid';

export interface ChoiceFeedback {
  choiceId: ChoiceId;
  text: RichText;
  selected: boolean;
  /** Part of the answer key. */
  isKey: boolean;
  /** Rationale for the key, misconception feedback for a distractor. */
  feedback: RichText | null;
  decision?: DecisionWord;
}

export type AbstentionOutcome =
  | 'correct-abstain'        // best answer was WAIT/NO_TRADE/STOP_TRADING and the learner chose it
  | 'missed-abstain'         // best answer was to abstain, learner acted (forced a trade) or answered otherwise
  | 'abstain-word-mismatch'  // learner abstained, but with the wrong word (e.g. WAIT where STOP_TRADING was required)
  | 'unneeded-abstain'       // learner abstained where abstaining was not the best answer
  | 'not-applicable';

export interface AbstentionInfo {
  bestIsAbstain: boolean;
  bestDecision?: DecisionWord;
  learnerDecision?: DecisionWord;
  learnerAbstained: boolean;
  outcome: AbstentionOutcome;
}

export interface QuestionResult {
  questionId: QuestionId;
  type: Question['type'];
  linkedLessonId: LessonId;
  status: ResponseStatus;
  invalidReason?: string;
  correct: boolean;
  safetyCritical: boolean;
  safetyTopic?: SafetyTopic;
  prompt: RichText;
  rationale: RichText;
  /** The chosen distractor's misconception feedback (single-answer types), if wrong. */
  misconception?: RichText;
  learnerAnswerText: string;
  correctAnswerText: string;
  choiceFeedback: ChoiceFeedback[];
  abstention: AbstentionInfo;
  remediationRef?: Question['remediationRef'];
  response: LearnerResponse;
}

export interface SafetyFailure {
  questionId: QuestionId;
  safetyTopic: SafetyTopic | 'unspecified';
  prompt: RichText;
  learnerAnswerText: string;
  correctAnswerText: string;
  /** The correction shown to the learner: the item's rationale. */
  correction: RichText;
  misconception?: RichText;
  remediationRef?: Question['remediationRef'];
  linkedLessonId: LessonId;
  /** Where "Review" sends the learner (D-67 anchor rules; falls back to the lesson start). See engine/remediation.ts. */
  remediationTarget: RemediationTarget;
}

export type FailReason =
  | 'BELOW_THRESHOLD'
  | 'SAFETY_CRITICAL_WRONG'
  | 'INCOMPLETE'
  | 'SAFETY_REANSWER_MISSING'
  | 'STALE_QUESTION_SET';

export interface TopicTally { total: number; correct: number; failedQuestionIds: QuestionId[] }

export interface AbstentionSummary {
  /** Items whose best answer is an abstain decision. */
  expected: number;
  correctAbstain: number;
  missedAbstain: number;
  wordMismatch: number;
  unneededAbstain: number;
}

export interface AttemptResult {
  attempt: QuizAttempt;
  kind: AttemptKind;
  results: QuestionResult[];
  correctCount: number;
  total: number;
  /** 0..1, rounded to 4 decimals. Computed by the grader, never read from the client in server mode. */
  score: number;
  passThreshold: number;
  meetsThreshold: boolean;
  safetyCriticalAllCorrect: boolean;
  passed: boolean;
  failReasons: FailReason[];
  safetyFailures: SafetyFailure[];
  bySafetyTopic: Partial<Record<SafetyTopic, TopicTally>>;
  abstention: AbstentionSummary;
  educationOnly: true;
  /** Never true. Typed as the literal `false` so no caller can flip it. */
  authorizesLiveTrading: false;
  notice: string;
}

/** full = counts toward pass; remediation = re-answer of missed safety-critical items of a base attempt; practice = never counts. */
export type AttemptKind = 'full' | 'remediation' | 'practice';
