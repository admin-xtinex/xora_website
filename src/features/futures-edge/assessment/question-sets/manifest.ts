/**
 * Versioned question-set manifests (EDGE-09). Every attempt is bound to a manifest's `questionSetVersion`:
 *   "<contentVersion>+c.<contentHash12>.g.<gradingHash12>"   (valid SemVer build metadata)
 * gradingHash covers what decides correctness (ids, types, answer keys, choice ids/decisions, safety flags/topics).
 * contentHash covers every field of every question (prompt, choices, rationales, feedback ...).
 * So an author who edits a question but forgets to bump Lesson.version still invalidates old attempts.
 */
import {
  SCHEMA_VERSION, type CheckpointConfig, type Lesson, type Question, type QuestionId,
} from '../../contracts';
import { canonicalJson, sha256Hex } from '../engine/hash';
import type { AttemptScope } from '../engine/types';

export const MANIFEST_SCHEMA = 1 as const;

export interface QuestionSetManifest {
  manifestSchema: typeof MANIFEST_SCHEMA;
  scopeKey: string; // "lesson:T12" | "checkpoint:CPA"
  scope: AttemptScope;
  /** Lesson.version or CheckpointConfig.version. */
  contentVersion: string;
  contractSchemaVersion: string;
  questionIds: QuestionId[];
  contentHash: string;
  gradingHash: string;
  questionSetVersion: string;
  /** Pass policy carried for convenience; NOT part of the hash (changing the threshold re-evaluates, it never invalidates). */
  policy: { passThreshold: number; safetyCriticalMustBeCorrect: boolean };
  /** Deep-frozen copies of the graded questions, in authored order. */
  questions: readonly Question[];
}

export function scopeKeyOf(scope: AttemptScope): string {
  return scope.kind === 'lesson' ? `lesson:${scope.lessonId}` : `checkpoint:${scope.checkpointId}`;
}

function gradingView(q: Question): unknown {
  return {
    id: q.id, type: q.type, answer: q.answer, safetyCritical: q.safetyCritical === true, safetyTopic: q.safetyTopic ?? null,
    choices: (q.choices ?? []).map((c) => ({ id: c.id, decision: c.decision ?? null })),
  };
}

export function hashQuestions(questions: readonly Question[]): { contentHash: string; gradingHash: string } {
  return {
    contentHash: sha256Hex(canonicalJson(questions)),
    gradingHash: sha256Hex(canonicalJson(questions.map(gradingView))),
  };
}

export function makeQuestionSetVersion(contentVersion: string, contentHash: string, gradingHash: string): string {
  return `${contentVersion}+c.${contentHash.slice(0, 12)}.g.${gradingHash.slice(0, 12)}`;
}

export interface ParsedQuestionSetVersion { contentVersion: string; content12: string; grading12: string }
export function parseQuestionSetVersion(v: string): ParsedQuestionSetVersion | null {
  const m = /^(\d+\.\d+\.\d+)\+c\.([0-9a-f]{12})\.g\.([0-9a-f]{12})$/.exec(v);
  return m ? { contentVersion: m[1] as string, content12: m[2] as string, grading12: m[3] as string } : null;
}

function deepFreeze<T>(v: T): T {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) {
    Object.freeze(v);
    for (const x of Object.values(v as Record<string, unknown>)) deepFreeze(x);
  }
  return v;
}

function structuredCopy<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function buildManifest(args: {
  scope: AttemptScope; contentVersion: string; questions: readonly Question[];
  policy: { passThreshold: number; safetyCriticalMustBeCorrect: boolean };
}): QuestionSetManifest {
  const questions = deepFreeze(structuredCopy([...args.questions]));
  const { contentHash, gradingHash } = hashQuestions(questions);
  return deepFreeze({
    manifestSchema: MANIFEST_SCHEMA,
    scopeKey: scopeKeyOf(args.scope),
    scope: args.scope,
    contentVersion: args.contentVersion,
    contractSchemaVersion: SCHEMA_VERSION,
    questionIds: questions.map((q) => q.id),
    contentHash, gradingHash,
    questionSetVersion: makeQuestionSetVersion(args.contentVersion, contentHash, gradingHash),
    policy: { ...args.policy },
    questions,
  });
}

export function buildLessonManifest(lesson: Lesson): QuestionSetManifest {
  return buildManifest({
    scope: { kind: 'lesson', lessonId: lesson.id },
    contentVersion: lesson.version,
    questions: lesson.quizQuestions,
    policy: { passThreshold: lesson.completionRequirements.minQuizScore, safetyCriticalMustBeCorrect: true },
  });
}

/** Resolve a checkpoint's `questionIds` against the bank + its own `items`, in config order. Throws on unresolved ids. */
export function buildCheckpointManifest(cfg: CheckpointConfig, bank: ReadonlyMap<QuestionId, Question>): QuestionSetManifest {
  const own = new Map<QuestionId, Question>(cfg.items.map((q) => [q.id, q]));
  const missing: string[] = [];
  const questions: Question[] = [];
  for (const id of cfg.questionIds) {
    const q = bank.get(id) ?? own.get(id);
    if (!q) missing.push(id); else questions.push(q);
  }
  for (const q of cfg.items) if (!cfg.questionIds.includes(q.id)) questions.push(q);
  if (missing.length) throw new Error(`checkpoint ${cfg.id}: unresolved question ids ${missing.join(', ')}`);
  return buildManifest({
    scope: { kind: 'checkpoint', checkpointId: cfg.id }, contentVersion: cfg.version, questions,
    policy: { passThreshold: cfg.passThreshold, safetyCriticalMustBeCorrect: cfg.safetyCriticalMustBeCorrect },
  });
}

/** Recompute hashes; false means the manifest was edited after build (or built by different code). */
export function verifyManifest(m: QuestionSetManifest): boolean {
  const { contentHash, gradingHash } = hashQuestions(m.questions);
  return contentHash === m.contentHash && gradingHash === m.gradingHash
    && m.questionSetVersion === makeQuestionSetVersion(m.contentVersion, contentHash, gradingHash)
    && m.questionIds.length === m.questions.length && m.questionIds.every((id, i) => m.questions[i]?.id === id);
}

export type QuestionSetChange = 'identical' | 'text-only' | 'grading-changed' | 'major-version-changed' | 'unparseable';
/**
 * Compare an attempt's stored questionSetVersion to the current manifest.
 * - Same hashes and same MAJOR content version → 'identical' (a minor/patch bump with unchanged questions keeps attempts).
 * - Different MAJOR → 'major-version-changed' (matches the contract's defaultMigrationPolicy → reset-assessment).
 * - Otherwise the hashes decide: 'text-only' (wording changed, grading identical) or 'grading-changed'.
 */
export function compareQuestionSetVersion(stored: string, current: QuestionSetManifest): QuestionSetChange {
  if (stored === current.questionSetVersion) return 'identical';
  const p = parseQuestionSetVersion(stored);
  if (!p) return 'unparseable';
  if (p.contentVersion.split('.')[0] !== current.contentVersion.split('.')[0]) return 'major-version-changed';
  if (p.content12 === current.contentHash.slice(0, 12) && p.grading12 === current.gradingHash.slice(0, 12)) return 'identical';
  return p.grading12 === current.gradingHash.slice(0, 12) ? 'text-only' : 'grading-changed';
}
