/**
 * Quiz session state machine (EDGE-09). Pure reducer used by the React QuizRunner (useReducer) and by tests.
 * Timestamps and attempt ids arrive in actions, so the reducer stays deterministic.
 */
import type { ChoiceId, Question, QuestionId } from '../../contracts';
import { gradeAttempt, gradeQuestion } from './grader';
import type { PresentationPlan } from './retry';
import type { AttemptResult, AttemptScope, LearnerResponse, QuestionResult, ScoringPolicy } from './types';

export type FeedbackMode = 'immediate' | 'end';

export interface SessionConfig {
  scope: AttemptScope;
  questions: readonly Question[];
  plan: PresentationPlan;
  policy: ScoringPolicy;
  /** Lesson mini-quiz: 'immediate' (check each answer); checkpoint exam: 'end'. */
  feedbackMode: FeedbackMode;
}

export interface SessionState {
  config: SessionConfig;
  index: number;
  responses: Partial<Record<QuestionId, LearnerResponse>>;
  /** Raw text typed into numeric inputs (kept so "1,8" mid-typing is not lost). */
  numericDrafts: Partial<Record<QuestionId, string>>;
  /** Immediate mode: per-question checked result (locked after check). */
  checked: Partial<Record<QuestionId, QuestionResult>>;
  /** Remediation acknowledgements (learner opened the correction). */
  acknowledged: QuestionId[];
  startedAt: string;
  phase: 'answering' | 'finished';
  result?: AttemptResult;
}

export type SessionAction =
  | { type: 'select'; questionId: QuestionId; choiceId: ChoiceId }
  | { type: 'numeric'; questionId: QuestionId; raw: string }
  | { type: 'move'; questionId: QuestionId; choiceId: ChoiceId; delta: -1 | 1 }
  | { type: 'check'; questionId: QuestionId }
  | { type: 'acknowledge'; questionId: QuestionId }
  | { type: 'goto'; index: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'submit'; attemptId: string; nowIso: string };

/** Parse learner numeric text: accepts "1,810", "1810.00", " -3.5 ", "10%"; anything else → NaN (graded invalid). */
export function parseNumericInput(raw: string): number | undefined {
  const t = raw.trim().replace(/,/g, '').replace(/\s*(%|usdt)$/i, '');
  if (t === '') return undefined;
  if (!/^[-+−]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return Number.NaN;
  return Number(t.replace('−', '-'));
}

export function initSession(config: SessionConfig, startedAt: string): SessionState {
  const responses: SessionState['responses'] = {};
  // Ordering items start in the presented order, so "submit without moving" is a real (probably wrong) answer.
  for (const id of config.plan.questionOrder) {
    const q = config.questions.find((x) => x.id === id);
    if (q?.type === 'ordering') responses[id] = { choiceIds: [...(config.plan.choiceOrder[id] ?? [])] };
  }
  return { config, index: 0, responses, numericDrafts: {}, checked: {}, acknowledged: [], startedAt, phase: 'answering' };
}

export function currentQuestion(s: SessionState): Question | undefined {
  const id = s.config.plan.questionOrder[s.index];
  return s.config.questions.find((q) => q.id === id);
}

export function blockedByRemediation(s: SessionState, id: QuestionId): boolean {
  return s.config.plan.remediationRequired.some((r) => r.questionId === id) && !s.acknowledged.includes(id);
}

export function sessionReducer(s: SessionState, a: SessionAction): SessionState {
  if (s.phase === 'finished' && a.type !== 'goto') return s;
  const qById = (id: QuestionId) => s.config.questions.find((q) => q.id === id);
  const locked = (id: QuestionId) => s.checked[id] !== undefined || blockedByRemediation(s, id);
  switch (a.type) {
    case 'select': {
      const q = qById(a.questionId);
      if (!q || locked(q.id) || !(q.choices ?? []).some((c) => c.id === a.choiceId) || q.type === 'ordering') return s;
      const prev = s.responses[q.id]?.choiceIds ?? [];
      const choiceIds = q.type === 'multi'
        ? (prev.includes(a.choiceId) ? prev.filter((x) => x !== a.choiceId) : [...prev, a.choiceId])
        : [a.choiceId];
      return { ...s, responses: { ...s.responses, [q.id]: { choiceIds } } };
    }
    case 'numeric': {
      const q = qById(a.questionId);
      if (!q || q.type !== 'numeric' || locked(q.id)) return s;
      const v = parseNumericInput(a.raw);
      const responses = { ...s.responses };
      if (v === undefined) delete responses[q.id]; else responses[q.id] = { numeric: v };
      return { ...s, responses, numericDrafts: { ...s.numericDrafts, [q.id]: a.raw } };
    }
    case 'move': {
      const q = qById(a.questionId);
      if (!q || q.type !== 'ordering' || locked(q.id)) return s;
      const ids = [...(s.responses[q.id]?.choiceIds ?? s.config.plan.choiceOrder[q.id] ?? [])];
      const i = ids.indexOf(a.choiceId);
      const j = i + a.delta;
      if (i < 0 || j < 0 || j >= ids.length) return s;
      [ids[i], ids[j]] = [ids[j] as string, ids[i] as string];
      return { ...s, responses: { ...s.responses, [q.id]: { choiceIds: ids } } };
    }
    case 'check': {
      if (s.config.feedbackMode !== 'immediate') return s;
      const q = qById(a.questionId);
      if (!q || locked(q.id) || s.responses[q.id] === undefined) return s;
      return { ...s, checked: { ...s.checked, [q.id]: gradeQuestion(q, s.responses[q.id]) } };
    }
    case 'acknowledge':
      return s.acknowledged.includes(a.questionId) ? s : { ...s, acknowledged: [...s.acknowledged, a.questionId] };
    case 'goto':
      return a.index >= 0 && a.index < s.config.plan.questionOrder.length ? { ...s, index: a.index } : s;
    case 'next':
      return s.index + 1 < s.config.plan.questionOrder.length ? { ...s, index: s.index + 1 } : s;
    case 'prev':
      return s.index > 0 ? { ...s, index: s.index - 1 } : s;
    case 'submit': {
      const order = s.config.plan.questionOrder;
      const questions = order.map((id) => qById(id)).filter((q): q is Question => q !== undefined);
      const result = gradeAttempt({
        scope: s.config.scope, questionSetVersion: s.config.plan.questionSetVersion, questions, responses: s.responses,
        policy: s.config.policy, attemptId: a.attemptId, startedAt: s.startedAt, finishedAt: a.nowIso,
        kind: s.config.plan.kind, mustReanswer: s.config.plan.mustReanswer,
      });
      return { ...s, phase: 'finished', result };
    }
  }
}

export function answeredCount(s: SessionState): number {
  return s.config.plan.questionOrder.filter((id) => s.responses[id] !== undefined).length;
}
