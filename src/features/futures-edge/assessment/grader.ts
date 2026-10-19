/** Grades lesson quizzes and checkpoints. Pure functions; never trusts a stored score without the questions. */
import type { Question, QuestionAttempt, QuizAttempt } from '@futures-edge/contracts';

export interface Response { choiceIds?: string[]; numeric?: number }

const EPS = 1e-9;

export function isCorrect(q: Question, r: Response | undefined): boolean {
  if (!r) return false;
  const a = q.answer;
  switch (a.kind) {
    case 'choice': return r.choiceIds?.length === 1 && r.choiceIds[0] === a.choiceId;
    case 'choices': {
      const got = new Set(r.choiceIds ?? []);
      return got.size === a.choiceIds.length && a.choiceIds.every((c) => got.has(c));
    }
    case 'order': return (r.choiceIds ?? []).length === a.choiceIds.length && a.choiceIds.every((c, i) => r.choiceIds?.[i] === c);
    case 'numeric': return typeof r.numeric === 'number' && Number.isFinite(r.numeric) && Math.abs(r.numeric - a.value) <= a.tolerance + EPS;
  }
}

export interface GradeResult {
  score: number;
  correctCount: number;
  total: number;
  safetyCriticalAllCorrect: boolean;
  missedSafety: Question[];
  perQuestion: Array<{ question: Question; correct: boolean }>;
}

export function grade(questions: Question[], responses: Readonly<Record<string, Response>>): GradeResult {
  const perQuestion = questions.map((q) => ({ question: q, correct: isCorrect(q, responses[q.id]) }));
  const correctCount = perQuestion.filter((x) => x.correct).length;
  const missedSafety = perQuestion.filter((x) => x.question.safetyCritical && !x.correct).map((x) => x.question);
  return {
    score: questions.length ? correctCount / questions.length : 0,
    correctCount,
    total: questions.length,
    safetyCriticalAllCorrect: missedSafety.length === 0,
    missedSafety,
    perQuestion,
  };
}

/** Feedback text for one answer: the rationale when correct, otherwise the distractor's misconception note. */
export function feedbackFor(q: Question, r: Response | undefined): string {
  if (isCorrect(q, r)) return q.rationale;
  const picked = r?.choiceIds ?? [];
  const notes = picked.map((c) => q.misconceptionFeedback?.[c]).filter((s): s is string => typeof s === 'string');
  return notes.length ? notes.join(' ') : q.rationale;
}

export function toAttempt(scope: QuizAttempt['scope'], version: string, questions: Question[], responses: Readonly<Record<string, Response>>, startedAt: string, finishedAt: string): QuizAttempt {
  const g = grade(questions, responses);
  const answers: QuestionAttempt[] = questions.map((q) => ({
    questionId: q.id,
    response: { ...(responses[q.id]?.choiceIds ? { choiceIds: responses[q.id]?.choiceIds } : {}), ...(responses[q.id]?.numeric !== undefined ? { numeric: responses[q.id]?.numeric } : {}) },
    correct: isCorrect(q, responses[q.id]),
    safetyCritical: q.safetyCritical === true,
    answeredAt: finishedAt,
  }));
  return { attemptId: `${scope.kind === 'lesson' ? scope.lessonId : scope.checkpointId}-${finishedAt}`, scope, questionSetVersion: version, answers, score: g.score, safetyCriticalAllCorrect: g.safetyCriticalAllCorrect, startedAt, finishedAt };
}

/** Deterministic shuffle (seeded) so a refresh does not reorder options under the learner. */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}
