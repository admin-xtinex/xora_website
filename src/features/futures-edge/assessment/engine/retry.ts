/**
 * Review / retry (EDGE-09).
 *  - Attempts are bound to a question-set version. Stale attempts are INVALIDATED (kept for history, never counted).
 *  - Retries reshuffle deterministically from a seed (stable choice ids; only presentation order changes).
 *  - Missed safety-critical items must be re-answered (and their correction acknowledged) on the next attempt.
 *  - "Remediation" (D-06 "correct or remediated"): if a full attempt met the threshold but missed safety-critical
 *    items, re-answering exactly those items correctly completes the pass. The aggregate score is NOT raised.
 *  - Unlimited retries by default (master prompt §9: education, not punitive gatekeeping).
 */
import type { ChoiceId, QuestionId, QuizAttempt, SafetyTopic, Question } from '../../contracts';
import { compareQuestionSetVersion, type QuestionSetChange, type QuestionSetManifest } from '../question-sets/manifest';
import { seededShuffle } from './shuffle';
import type { AttemptKind, AttemptResult } from './types';

export interface RetryPolicy {
  /** 'all' = full counted retake; 'missed-only' = practice round of missed items (never counts). */
  scope: 'all' | 'missed-only';
  reshuffle: boolean;
  /** Shuffle question order too (checkpoints). Lessons keep authored order by default. */
  shuffleQuestions: boolean;
  /** Put missed safety-critical items first on a retake. */
  missedSafetyFirst: boolean;
  /** Learner must open the correction (remediation) of each missed safety item before re-answering it. */
  requireRemediationAck: boolean;
  /** null = unlimited. */
  maxAttempts: number | null;
  /** What invalidates an older attempt: any change (default, conservative) or only answer-key/safety changes. */
  staleWhen: 'any-change' | 'grading-change';
}
export const DEFAULT_RETRY_POLICY: Readonly<RetryPolicy> = Object.freeze({
  scope: 'all', reshuffle: true, shuffleQuestions: false, missedSafetyFirst: true, requireRemediationAck: true,
  maxAttempts: null, staleWhen: 'any-change',
});

export interface PresentationPlan {
  questionSetVersion: string;
  kind: AttemptKind;
  attemptNumber: number;
  seed: string;
  questionOrder: QuestionId[];
  /** Presented choice order per question; ids are never renamed. */
  choiceOrder: Partial<Record<QuestionId, ChoiceId[]>>;
  mustReanswer: QuestionId[];
  remediationRequired: Array<{ questionId: QuestionId; safetyTopic: SafetyTopic | 'unspecified'; correction: string; remediationRef?: Question['remediationRef'] }>;
  /** For remediation plans: the base attempt being completed. */
  remediatesAttemptId?: string;
}

/** Remediation attempt ids are `<baseAttemptId>~rem<n>`; practice attempts are never stored. */
export const REMEDIATION_SEPARATOR = '~rem';
export function remediationAttemptId(baseId: string, n: number): string { return `${baseId}${REMEDIATION_SEPARATOR}${n}`; }
export function attemptKindOf(a: Pick<QuizAttempt, 'attemptId'>): 'full' | 'remediation' {
  return a.attemptId.includes(REMEDIATION_SEPARATOR) ? 'remediation' : 'full';
}
export function baseIdOf(a: Pick<QuizAttempt, 'attemptId'>): string {
  const i = a.attemptId.indexOf(REMEDIATION_SEPARATOR);
  return i < 0 ? a.attemptId : a.attemptId.slice(0, i);
}

/** Choice presentation order honouring `shuffleChoices` (only shuffled when the author marked it safe). */
export function presentChoices(q: Question, seed: string, reshuffle: boolean): ChoiceId[] {
  const ids = (q.choices ?? []).map((c) => c.id);
  if (!reshuffle || q.shuffleChoices !== true || ids.length < 2) return ids;
  return seededShuffle(ids, `${seed}|${q.id}`);
}

function orderQuestions(m: QuestionSetManifest, seed: string, policy: RetryPolicy, priority: readonly QuestionId[]): QuestionId[] {
  const base = policy.shuffleQuestions ? seededShuffle(m.questionIds, `${seed}|questions`) : [...m.questionIds];
  if (!policy.missedSafetyFirst || priority.length === 0) return base;
  const p = new Set(priority);
  return [...base.filter((id) => p.has(id)), ...base.filter((id) => !p.has(id))];
}

export function planFirstAttempt(m: QuestionSetManifest, seed: string, policy: Partial<RetryPolicy> = {}): PresentationPlan {
  const pol = { ...DEFAULT_RETRY_POLICY, ...policy };
  const order = orderQuestions(m, seed, pol, []);
  return {
    questionSetVersion: m.questionSetVersion, kind: 'full', attemptNumber: 1, seed, questionOrder: order,
    choiceOrder: Object.fromEntries(m.questions.map((q) => [q.id, presentChoices(q, seed, pol.reshuffle)])),
    mustReanswer: [], remediationRequired: [],
  };
}

export interface HistoryClassification {
  current: QuizAttempt[];
  stale: Array<{ attempt: QuizAttempt; change: QuestionSetChange }>;
}
export function classifyAttempts(attempts: readonly QuizAttempt[], m: QuestionSetManifest, staleWhen: RetryPolicy['staleWhen'] = 'any-change'): HistoryClassification {
  const out: HistoryClassification = { current: [], stale: [] };
  for (const a of attempts) {
    const sameScope = a.scope.kind === m.scope.kind
      && (a.scope.kind === 'lesson' ? m.scope.kind === 'lesson' && a.scope.lessonId === m.scope.lessonId
        : m.scope.kind === 'checkpoint' && a.scope.checkpointId === m.scope.checkpointId);
    if (!sameScope) continue;
    const change = compareQuestionSetVersion(a.questionSetVersion, m);
    const ok = change === 'identical' || (staleWhen === 'grading-change' && change === 'text-only');
    // Answers must still reference questions in the current set (defensive; ids are never reused).
    const ids = new Set(m.questionIds);
    if (ok && a.answers.every((x) => ids.has(x.questionId))) out.current.push(a);
    else out.stale.push({ attempt: a, change: ok ? 'grading-changed' : change });
  }
  return out;
}

function missedSafetyIds(a: QuizAttempt): QuestionId[] {
  return a.answers.filter((x) => x.safetyCritical && !x.correct).map((x) => x.questionId);
}

export interface HistorySummary {
  questionSetVersion: string;
  countedAttempts: number;
  staleAttempts: number;
  bestScore: number | null;
  passed: boolean;
  /** Attempt that produced the pass (full attempt id; remediation id if it completed one). */
  passedVia?: { attemptId: string; remediationAttemptId?: string };
  /** Safety-critical ids missed in the latest full attempt and not yet remediated. */
  outstandingSafetyIds: QuestionId[];
  lastFullAttempt?: QuizAttempt;
  attemptsRemaining: number | null;
}

/**
 * Re-evaluate the whole history against the CURRENT manifest and policy. A pass is only ever derived here, from
 * current-version attempts: a stored `passed` flag is never trusted.
 */
export function summarizeHistory(
  attempts: readonly QuizAttempt[], m: QuestionSetManifest,
  policy: { passThreshold: number; safetyCriticalMustBeCorrect: boolean } = m.policy,
  retry: Partial<RetryPolicy> = {},
): HistorySummary {
  const pol = { ...DEFAULT_RETRY_POLICY, ...retry };
  const { current, stale } = classifyAttempts(attempts, m, pol.staleWhen);
  const full = current.filter((a) => attemptKindOf(a) === 'full' && a.answers.length === m.questionIds.length);
  const rem = current.filter((a) => attemptKindOf(a) === 'remediation');
  const meets = (a: QuizAttempt) => a.score + 1e-9 >= policy.passThreshold && a.answers.every((x) => x.response.choiceIds !== undefined || x.response.numeric !== undefined);
  let passedVia: HistorySummary['passedVia'];
  for (const a of full) {
    if (!meets(a)) continue;
    const missed = missedSafetyIds(a);
    if (!policy.safetyCriticalMustBeCorrect || missed.length === 0) { passedVia = { attemptId: a.attemptId }; break; }
    const fix = rem.find((r) => baseIdOf(r) === a.attemptId
      && missed.every((id) => r.answers.some((x) => x.questionId === id && x.correct)));
    if (fix) { passedVia = { attemptId: a.attemptId, remediationAttemptId: fix.attemptId }; break; }
  }
  const lastFull = full.at(-1);
  let outstanding: QuestionId[] = [];
  if (lastFull) {
    const fixed = new Set(rem.filter((r) => baseIdOf(r) === lastFull.attemptId).flatMap((r) => r.answers.filter((x) => x.correct).map((x) => x.questionId)));
    outstanding = missedSafetyIds(lastFull).filter((id) => !fixed.has(id));
  }
  const best = full.length ? Math.max(...full.map((a) => a.score)) : null;
  return {
    questionSetVersion: m.questionSetVersion, countedAttempts: full.length, staleAttempts: stale.length, bestScore: best,
    passed: passedVia !== undefined,
    ...(passedVia ? { passedVia } : {}),
    outstandingSafetyIds: outstanding,
    ...(lastFull ? { lastFullAttempt: lastFull } : {}),
    attemptsRemaining: pol.maxAttempts === null ? null : Math.max(0, pol.maxAttempts - full.length),
  };
}

export type RetryDecision =
  | { ok: true; plan: PresentationPlan }
  | { ok: false; reason: 'MAX_ATTEMPTS_REACHED' | 'NOTHING_TO_REMEDIATE' | 'NOT_ELIGIBLE_FOR_REMEDIATION' };

/** Plan the next counted retake (or a practice round with scope 'missed-only'). */
export function planRetry(
  m: QuestionSetManifest, attempts: readonly QuizAttempt[], last: AttemptResult | null, seed: string,
  policy: Partial<RetryPolicy> = {},
): RetryDecision {
  const pol = { ...DEFAULT_RETRY_POLICY, ...policy };
  const hist = summarizeHistory(attempts, m, m.policy, pol);
  if (pol.maxAttempts !== null && hist.countedAttempts >= pol.maxAttempts && pol.scope === 'all') return { ok: false, reason: 'MAX_ATTEMPTS_REACHED' };
  // A last result graded against another version is stale: nothing carries over, plan a fresh full attempt.
  const lastCurrent = last && last.attempt.questionSetVersion === m.questionSetVersion ? last : null;
  const missedSafety = lastCurrent ? lastCurrent.safetyFailures.map((f) => f.questionId) : hist.outstandingSafetyIds;
  const missedAll = lastCurrent ? lastCurrent.results.filter((r) => !r.correct).map((r) => r.questionId) : [];
  const byId = new Map(m.questions.map((q) => [q.id, q]));
  const remediationRequired = missedSafety.map((id) => {
    const q = byId.get(id);
    return {
      questionId: id, safetyTopic: q?.safetyTopic ?? ('unspecified' as const), correction: q?.rationale ?? '',
      ...(q?.remediationRef ? { remediationRef: q.remediationRef } : {}),
    };
  });
  const ids = pol.scope === 'missed-only' ? m.questionIds.filter((id) => missedAll.includes(id) || missedSafety.includes(id)) : null;
  const order = ids ?? orderQuestions(m, seed, pol, missedSafety);
  return {
    ok: true,
    plan: {
      questionSetVersion: m.questionSetVersion, kind: pol.scope === 'missed-only' ? 'practice' : 'full',
      attemptNumber: hist.countedAttempts + 1, seed, questionOrder: order,
      choiceOrder: Object.fromEntries(order.map((id) => [id, presentChoices(byId.get(id) as Question, seed, pol.reshuffle)])),
      mustReanswer: missedSafety.filter((id) => order.includes(id)),
      remediationRequired: pol.requireRemediationAck ? remediationRequired : [],
    },
  };
}

/** Plan a remediation round: only the missed safety-critical items of a full attempt that met the threshold. */
export function planRemediation(m: QuestionSetManifest, base: AttemptResult, seed: string, n = 1, policy: Partial<RetryPolicy> = {}): RetryDecision {
  const pol = { ...DEFAULT_RETRY_POLICY, ...policy };
  if (base.kind !== 'full' || base.attempt.questionSetVersion !== m.questionSetVersion || !base.meetsThreshold || base.failReasons.includes('INCOMPLETE')) {
    return { ok: false, reason: 'NOT_ELIGIBLE_FOR_REMEDIATION' };
  }
  if (base.safetyFailures.length === 0) return { ok: false, reason: 'NOTHING_TO_REMEDIATE' };
  const byId = new Map(m.questions.map((q) => [q.id, q]));
  const order = base.safetyFailures.map((f) => f.questionId);
  return {
    ok: true,
    plan: {
      questionSetVersion: m.questionSetVersion, kind: 'remediation', attemptNumber: n, seed, questionOrder: order,
      choiceOrder: Object.fromEntries(order.map((id) => [id, presentChoices(byId.get(id) as Question, `${seed}|rem${n}`, pol.reshuffle)])),
      mustReanswer: order,
      remediationRequired: base.safetyFailures.map((f) => ({
        questionId: f.questionId, safetyTopic: f.safetyTopic, correction: f.correction,
        ...(f.remediationRef ? { remediationRef: f.remediationRef } : {}),
      })),
      remediatesAttemptId: base.attempt.attemptId,
    },
  };
}

/** Combined verdict of a base full attempt + its remediation round (same rule summarizeHistory applies). */
export function combineWithRemediation(base: AttemptResult, remediation: AttemptResult): { passed: boolean; outstanding: QuestionId[] } {
  if (base.attempt.questionSetVersion !== remediation.attempt.questionSetVersion || !base.meetsThreshold || base.failReasons.includes('INCOMPLETE')) {
    return { passed: false, outstanding: base.safetyFailures.map((f) => f.questionId) };
  }
  const fixed = new Set(remediation.results.filter((r) => r.correct).map((r) => r.questionId));
  const outstanding = base.safetyFailures.map((f) => f.questionId).filter((id) => !fixed.has(id));
  return { passed: outstanding.length === 0, outstanding };
}
