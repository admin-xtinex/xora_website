/**
 * @futures-edge/assessment: public entry (D-10 alias → features/futures-edge/assessment/index.ts).
 * Other modules import ONLY from here. Owner: EDGE-09. Education-only; no trading, order or exchange code.
 */
export * from './engine/types';
export * from './engine/strings';
export {
  DEFAULT_PASS_THRESHOLD, DEFAULT_SCORING_POLICY, resolveScoringPolicy, policyFromCheckpoint, policyFromLesson,
  gradeQuestion, gradeAttempt, formatCorrectAnswer, type GradeAttemptInput,
} from './engine/grader';
export {
  DEFAULT_RETRY_POLICY, planFirstAttempt, planRetry, planRemediation, combineWithRemediation, classifyAttempts,
  summarizeHistory, presentChoices, remediationAttemptId, attemptKindOf,
  type RetryPolicy, type PresentationPlan, type HistorySummary, type HistoryClassification, type RetryDecision,
} from './engine/retry';
export {
  initSession, sessionReducer, currentQuestion, answeredCount, blockedByRemediation, parseNumericInput,
  type SessionConfig, type SessionState, type SessionAction, type FeedbackMode,
} from './engine/session';
export {
  resolveRemediationTarget, parseRemediationAnchor, anchorIndexFromLessons,
  type RemediationTarget, type RemediationAnchorKind, type RemediationFallbackReason, type AnchorIndex,
} from './engine/remediation';
export { seededShuffle } from './engine/shuffle';
export { sha256Hex, canonicalJson } from './engine/hash';
export {
  buildManifest, buildLessonManifest, buildCheckpointManifest, verifyManifest, compareQuestionSetVersion,
  parseQuestionSetVersion, hashQuestions, scopeKeyOf, type QuestionSetManifest, type QuestionSetChange,
} from './question-sets/manifest';
export { buildQuestionBank, type QuestionBank } from './question-sets/bank';
export {
  validateAssessmentQuestion, validateLessonQuestionSet, validatePhase5Abstention, validateManifestIntegrity,
  bestAnswerIsAbstain, numericRoundingIssues, remediationRefIssues, REQUIRED_SAFETY_TOPICS_BY_LESSON, PHASE5_LESSON_IDS,
  type AssessmentReport, type NumericRoundingIssue, type RemediationRefIssue,
} from './question-sets/validator';
export type { CheckpointPlan, CheckpointSlot, AuthorBot } from './checkpoints/plan';
export { CP1_PLAN } from './checkpoints/cp1';
export { CPA_PLAN } from './checkpoints/cpa';
export { CPB_PLAN } from './checkpoints/cpb';
export { CPB_ITEMS, CPB_ITEM_PROVENANCE, type CheckpointItem, type CheckpointItemProvenance } from './checkpoints/cpb-items';
export { CHECKPOINT_DISCLAIMER } from './checkpoints/disclaimer';
export { buildCheckpoint, type CheckpointBuild, type CheckpointGap, type CheckpointPendingConfirmation } from './checkpoints/build';
export { checkpointGate, type CheckpointGateView } from './checkpoints/gate';
export type { AssessmentStorageAdapter, PersistenceMode, StorageIssue } from './progress/adapter';
export { LocalOnlyDemoProgressAdapter, type LocalDemoAdapterOptions } from './progress/local-demo-adapter';
export { MemoryStorage, probeLocalStorage, type StorageLike } from './progress/storage';
export { STORAGE_SCHEMA_VERSION, storageKeyFor } from './progress/schema';
export { ProgressService, evaluateLessonCompletion, type LessonState, type CheckpointState, type CourseSummary, type LessonStatus, type CheckpointStatus } from './progress/service';
export { completionRecord, type CompletionRecord } from './progress/completion';
export {
  ServerBackedProgressAdapter, serverGradeSubmission,
  type ServerAssessmentTransport, type AttemptSubmission, type ServerGradedAttempt, type LessonActivityUpdate,
} from './progress/server-adapter';
export { assessmentEnabled } from './flag';
export { QuizRunner, type QuizRunnerProps } from './ui/QuizRunner';
export { QuestionView } from './ui/QuestionView';
export { FeedbackPanel } from './ui/FeedbackPanel';
export { SafetyCriticalCallout } from './ui/SafetyCriticalCallout';
export { RetryPanel } from './ui/RetryPanel';
export { CheckpointGate } from './ui/CheckpointGate';
export { ProgressDisplay } from './ui/ProgressDisplay';
export { EducationOnlyNotice } from './ui/EducationOnlyNotice';
export { plainRichText, richTextToPlain } from './ui/RichText';
