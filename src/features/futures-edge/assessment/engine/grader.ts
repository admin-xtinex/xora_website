/**
 * Quiz grader (EDGE-09). Pure, deterministic, no I/O. Grades every contract QuestionType:
 *   single | true-false | chart | scenario  -> answer.kind 'choice'   (exactly one choice)
 *   multi                                   -> answer.kind 'choices'  (exact set, order ignored)
 *   ordering                                -> answer.kind 'order'    (exact sequence of every choice)
 *   numeric                                 -> answer.kind 'numeric'  (|value − key| ≤ tolerance)
 * The same function is meant to run on a future server (see docs/MIGRATION-server-adapter.md), so the client score
 * is only a preview there.
 */
import {
  ABSTAIN_DECISIONS, type Choice, type ChoiceId, type CheckpointConfig, type DecisionWord, type Lesson, type Question,
  type QuestionAttempt, type QuestionId, type QuizAttempt, type SafetyTopic,
} from '../../contracts';
import { EDUCATION_ONLY_NOTICE } from './strings';
import type {
  AbstentionInfo, AbstentionSummary, AttemptKind, AttemptResult, AttemptScope, ChoiceFeedback, FailReason, LearnerResponse,
  QuestionResult, ResponseStatus, SafetyFailure, ScoringPolicy, TopicTally,
} from './types';

export const DEFAULT_PASS_THRESHOLD = 0.8;
export const DEFAULT_SCORING_POLICY: Readonly<ScoringPolicy> = Object.freeze({
  passThreshold: DEFAULT_PASS_THRESHOLD,
  safetyCriticalMustBeCorrect: true,
  requireAllAnswered: true,
});

/** Merge overrides onto the default policy. Throws RangeError on an out-of-range threshold (config bug, fail loudly). */
export function resolveScoringPolicy(overrides: Partial<ScoringPolicy> = {}): ScoringPolicy {
  const p: ScoringPolicy = { ...DEFAULT_SCORING_POLICY, ...overrides };
  if (typeof p.passThreshold !== 'number' || !Number.isFinite(p.passThreshold) || p.passThreshold < 0 || p.passThreshold > 1) {
    throw new RangeError(`passThreshold must be a number in 0..1, got ${String(p.passThreshold)}`);
  }
  return p;
}
export function policyFromCheckpoint(cfg: Pick<CheckpointConfig, 'passThreshold' | 'safetyCriticalMustBeCorrect'>, overrides: Partial<ScoringPolicy> = {}): ScoringPolicy {
  return resolveScoringPolicy({ passThreshold: cfg.passThreshold, safetyCriticalMustBeCorrect: cfg.safetyCriticalMustBeCorrect, ...overrides });
}
export function policyFromLesson(lesson: Pick<Lesson, 'completionRequirements'>, overrides: Partial<ScoringPolicy> = {}): ScoringPolicy {
  return resolveScoringPolicy({
    passThreshold: lesson.completionRequirements.minQuizScore,
    // D-06: safety-critical items gate passing even if an author set requireSafetyCriticalCorrect=false. A lesson can
    // only make this stricter, never weaker; the validator warns when the flag is false.
    safetyCriticalMustBeCorrect: true,
    ...overrides,
  });
}

const isAbstain = (d: DecisionWord | undefined): boolean => d !== undefined && ABSTAIN_DECISIONS.includes(d);
const expectedKind = (t: Question['type']) => (t === 'numeric' ? 'numeric' : t === 'multi' ? 'choices' : t === 'ordering' ? 'order' : 'choice');

function keyChoiceIds(q: Question): ChoiceId[] {
  const a = q.answer;
  if (a.kind === 'choice') return [a.choiceId];
  if (a.kind === 'choices' || a.kind === 'order') return [...a.choiceIds];
  return [];
}

function choiceText(q: Question, id: ChoiceId): string {
  return q.choices?.find((c) => c.id === id)?.text ?? id;
}

export function formatCorrectAnswer(q: Question): string {
  const a = q.answer;
  switch (a.kind) {
    case 'choice': return choiceText(q, a.choiceId);
    case 'choices': return a.choiceIds.map((id) => choiceText(q, id)).join('; ');
    case 'order': return a.choiceIds.map((id, i) => `${i + 1}. ${choiceText(q, id)}`).join(' → ');
    case 'numeric': return `${formatNumber(a.value)} ${a.unit}`.trim() + (a.tolerance > 0 ? ` (accepted within ±${formatNumber(a.tolerance)})` : '');
  }
}

function formatNumber(n: number): string {
  return Number.isInteger(n) ? n.toLocaleString('en-US') : n.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

function formatLearnerAnswer(q: Question, r: LearnerResponse, status: ResponseStatus): string {
  if (status === 'unanswered') return 'No answer';
  if (q.type === 'numeric') return r.numeric === undefined ? 'No answer' : `${formatNumber(r.numeric)} ${q.answer.kind === 'numeric' ? q.answer.unit : ''}`.trim();
  const ids = r.choiceIds ?? [];
  if (q.type === 'ordering') return ids.map((id, i) => `${i + 1}. ${choiceText(q, id)}`).join(' → ');
  return ids.map((id) => choiceText(q, id)).join('; ');
}

/** Classify the response shape before checking correctness. Invalid responses are graded wrong, never thrown. */
function responseStatus(q: Question, r: LearnerResponse | undefined): { status: ResponseStatus; reason?: string } {
  if (!r) return { status: 'unanswered' };
  if (expectedKind(q.type) !== q.answer.kind) return { status: 'invalid', reason: `MALFORMED_QUESTION: type ${q.type} with answer.kind ${q.answer.kind}` };
  if (q.type === 'numeric') {
    if (r.numeric === undefined) return { status: 'unanswered' };
    if (typeof r.numeric !== 'number' || !Number.isFinite(r.numeric)) return { status: 'invalid', reason: 'numeric answer must be a finite number' };
    return { status: 'answered' };
  }
  const ids = r.choiceIds ?? [];
  if (ids.length === 0) return { status: 'unanswered' };
  const known = new Set((q.choices ?? []).map((c) => c.id));
  if (ids.some((id) => typeof id !== 'string' || !known.has(id))) return { status: 'invalid', reason: 'response references an unknown choice' };
  if (new Set(ids).size !== ids.length) return { status: 'invalid', reason: 'duplicate choice in response' };
  if ((q.type === 'single' || q.type === 'true-false' || q.type === 'chart' || q.type === 'scenario') && ids.length !== 1) {
    return { status: 'invalid', reason: 'exactly one choice must be selected' };
  }
  if (q.type === 'ordering' && ids.length !== known.size) return { status: 'invalid', reason: 'ordering must place every item exactly once' };
  return { status: 'answered' };
}

function isCorrect(q: Question, r: LearnerResponse): boolean {
  const a = q.answer;
  switch (a.kind) {
    case 'choice': return (r.choiceIds ?? [])[0] === a.choiceId;
    case 'choices': {
      const got = new Set(r.choiceIds ?? []);
      return got.size === a.choiceIds.length && a.choiceIds.every((id) => got.has(id));
    }
    case 'order': {
      const got = r.choiceIds ?? [];
      return got.length === a.choiceIds.length && a.choiceIds.every((id, i) => got[i] === id);
    }
    case 'numeric': {
      const v = r.numeric;
      if (typeof v !== 'number') return false;
      // Tiny relative slack so 0.1+0.2-style float noise never flips a correct answer.
      const slack = 1e-9 * Math.max(1, Math.abs(a.value));
      return Math.abs(v - a.value) <= a.tolerance + slack;
    }
  }
}

function abstentionOf(q: Question, r: LearnerResponse, status: ResponseStatus, correct: boolean): AbstentionInfo {
  if (q.type === 'numeric' || q.type === 'ordering' || !q.choices) return { bestIsAbstain: false, learnerAbstained: false, outcome: 'not-applicable' };
  const byId = new Map<ChoiceId, Choice>(q.choices.map((c) => [c.id, c]));
  const keyDecisions = keyChoiceIds(q).map((id) => byId.get(id)?.decision).filter((d): d is DecisionWord => d !== undefined);
  const bestDecision = keyDecisions.find(isAbstain) ?? keyDecisions[0];
  const bestIsAbstain = keyDecisions.some(isAbstain);
  const picked = status === 'answered' ? (r.choiceIds ?? []).map((id) => byId.get(id)?.decision).filter((d): d is DecisionWord => d !== undefined) : [];
  const learnerDecision = picked.find(isAbstain) ?? picked[0];
  const learnerAbstained = picked.some(isAbstain);
  let outcome: AbstentionInfo['outcome'] = 'not-applicable';
  if (bestIsAbstain) outcome = correct ? 'correct-abstain' : learnerAbstained ? 'abstain-word-mismatch' : 'missed-abstain';
  else if (learnerAbstained && !correct) outcome = 'unneeded-abstain';
  return {
    bestIsAbstain, learnerAbstained, outcome,
    ...(bestDecision !== undefined ? { bestDecision } : {}),
    ...(learnerDecision !== undefined ? { learnerDecision } : {}),
  };
}

/** Grade one question. Never throws on learner input. */
export function gradeQuestion(q: Question, response: LearnerResponse | undefined): QuestionResult {
  const { status, reason } = responseStatus(q, response);
  const r: LearnerResponse = response ?? {};
  const correct = status === 'answered' && isCorrect(q, r);
  const key = new Set(keyChoiceIds(q));
  const selected = new Set(status === 'answered' ? r.choiceIds ?? [] : []);
  const fb = q.misconceptionFeedback ?? {};
  const choiceFeedback: ChoiceFeedback[] = (q.choices ?? []).map((c) => ({
    choiceId: c.id, text: c.text, selected: selected.has(c.id), isKey: key.has(c.id),
    feedback: key.has(c.id) ? q.rationale : fb[c.id] ?? null,
    ...(c.decision !== undefined ? { decision: c.decision } : {}),
  }));
  let misconception: string | undefined;
  if (!correct && status === 'answered' && q.answer.kind === 'choice') {
    const picked = (r.choiceIds ?? [])[0];
    if (picked !== undefined) misconception = fb[picked];
  } else if (!correct && status === 'answered' && q.answer.kind === 'choices') {
    const wrongPicks = [...selected].filter((id) => !key.has(id)).map((id) => fb[id]).filter((x): x is string => !!x);
    if (wrongPicks.length) misconception = wrongPicks.join(' ');
  }
  return {
    questionId: q.id, type: q.type, linkedLessonId: q.linkedLessonId, status, correct,
    safetyCritical: q.safetyCritical === true,
    ...(q.safetyTopic !== undefined ? { safetyTopic: q.safetyTopic } : {}),
    ...(reason !== undefined ? { invalidReason: reason } : {}),
    ...(misconception !== undefined ? { misconception } : {}),
    ...(q.remediationRef !== undefined ? { remediationRef: q.remediationRef } : {}),
    prompt: q.prompt, rationale: q.rationale,
    learnerAnswerText: formatLearnerAnswer(q, r, status),
    correctAnswerText: formatCorrectAnswer(q),
    choiceFeedback,
    abstention: abstentionOf(q, r, status, correct),
    response: status === 'answered' ? r : {},
  };
}

export interface GradeAttemptInput {
  scope: AttemptScope;
  questionSetVersion: string;
  /** The questions the learner was asked, in any order. */
  questions: readonly Question[];
  responses: Readonly<Partial<Record<QuestionId, LearnerResponse>>>;
  policy?: Partial<ScoringPolicy>;
  attemptId: string;
  startedAt: string;
  finishedAt: string;
  kind?: AttemptKind;
  /** Retry rule: these ids (missed safety-critical items) must be answered in this attempt. */
  mustReanswer?: readonly QuestionId[];
}

const round4 = (x: number) => Math.round(x * 10000) / 10000;

/** Grade a whole attempt and apply the scoring policy + safety-critical gate. */
export function gradeAttempt(input: GradeAttemptInput): AttemptResult {
  const policy = resolveScoringPolicy(input.policy);
  const kind: AttemptKind = input.kind ?? 'full';
  const results = input.questions.map((q) => gradeQuestion(q, input.responses[q.id]));
  const total = results.length;
  const correctCount = results.filter((r) => r.correct).length;
  const score = total === 0 ? 0 : round4(correctCount / total);
  const meetsThreshold = total > 0 && score + 1e-9 >= policy.passThreshold;
  const safetyWrong = results.filter((r) => r.safetyCritical && !r.correct);
  const safetyCriticalAllCorrect = safetyWrong.length === 0;
  const failReasons: FailReason[] = [];
  if (!meetsThreshold) failReasons.push('BELOW_THRESHOLD');
  if (policy.safetyCriticalMustBeCorrect && !safetyCriticalAllCorrect) failReasons.push('SAFETY_CRITICAL_WRONG');
  if (policy.requireAllAnswered && results.some((r) => r.status !== 'answered')) failReasons.push('INCOMPLETE');
  const asked = new Set(results.map((r) => r.questionId));
  const answered = new Set(results.filter((r) => r.status === 'answered').map((r) => r.questionId));
  if ((input.mustReanswer ?? []).some((id) => !asked.has(id) || !answered.has(id))) failReasons.push('SAFETY_REANSWER_MISSING');

  const safetyFailures: SafetyFailure[] = safetyWrong.map((r) => ({
    questionId: r.questionId, safetyTopic: r.safetyTopic ?? 'unspecified', prompt: r.prompt,
    learnerAnswerText: r.learnerAnswerText, correctAnswerText: r.correctAnswerText, correction: r.rationale,
    ...(r.misconception !== undefined ? { misconception: r.misconception } : {}),
    ...(r.remediationRef !== undefined ? { remediationRef: r.remediationRef } : {}),
  }));
  const bySafetyTopic: Partial<Record<SafetyTopic, TopicTally>> = {};
  for (const r of results) {
    if (!r.safetyCritical || !r.safetyTopic) continue;
    const t = (bySafetyTopic[r.safetyTopic] ??= { total: 0, correct: 0, failedQuestionIds: [] });
    t.total++;
    if (r.correct) t.correct++; else t.failedQuestionIds.push(r.questionId);
  }
  const abstention: AbstentionSummary = { expected: 0, correctAbstain: 0, missedAbstain: 0, wordMismatch: 0, unneededAbstain: 0 };
  for (const r of results) {
    if (r.abstention.bestIsAbstain) abstention.expected++;
    if (r.abstention.outcome === 'correct-abstain') abstention.correctAbstain++;
    if (r.abstention.outcome === 'missed-abstain') abstention.missedAbstain++;
    if (r.abstention.outcome === 'abstain-word-mismatch') abstention.wordMismatch++;
    if (r.abstention.outcome === 'unneeded-abstain') abstention.unneededAbstain++;
  }
  const answers: QuestionAttempt[] = results.map((r) => ({
    questionId: r.questionId, response: r.response, correct: r.correct, safetyCritical: r.safetyCritical, answeredAt: input.finishedAt,
  }));
  const attempt: QuizAttempt = {
    attemptId: input.attemptId, scope: input.scope, questionSetVersion: input.questionSetVersion, answers, score,
    safetyCriticalAllCorrect, startedAt: input.startedAt, finishedAt: input.finishedAt,
  };
  const passed = kind !== 'practice' && failReasons.length === 0;
  return {
    attempt, kind, results, correctCount, total, score, passThreshold: policy.passThreshold, meetsThreshold,
    safetyCriticalAllCorrect, passed, failReasons, safetyFailures, bySafetyTopic, abstention,
    educationOnly: true, authorizesLiveTrading: false, notice: EDUCATION_ONLY_NOTICE,
  };
}
