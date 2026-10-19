/** Question bank: every authored lesson question + checkpoint-only items, keyed by id (EDGE-09). */
import type { CheckpointConfig, Lesson, Question, QuestionId, ValidationIssue } from '../../contracts';

export interface QuestionBank {
  readonly byId: ReadonlyMap<QuestionId, Question>;
  readonly lessonIds: ReadonlySet<string>;
  readonly issues: readonly ValidationIssue[];
}

export function buildQuestionBank(lessons: readonly Lesson[], checkpoints: readonly CheckpointConfig[] = []): QuestionBank {
  const byId = new Map<QuestionId, Question>();
  const issues: ValidationIssue[] = [];
  const add = (q: Question, where: string) => {
    if (byId.has(q.id)) issues.push({ path: where, code: 'BANK_DUPLICATE_ID', message: `question ${q.id} defined more than once`, severity: 'error' });
    else byId.set(q.id, q);
  };
  for (const l of lessons) l.quizQuestions.forEach((q, i) => add(q, `[${l.id}].quizQuestions[${i}]`));
  for (const c of checkpoints) c.items.forEach((q, i) => add(q, `[${c.id}].items[${i}]`));
  return { byId, lessonIds: new Set(lessons.map((l) => l.id)), issues };
}
