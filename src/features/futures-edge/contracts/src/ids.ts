/**
 * Stable ID conventions. Owner: EDGE-00. FROZEN.
 *
 *   Phase            P1..P5
 *   Lesson           T01..T23                      (T24..T32 are a separate future scope — rejected here)
 *   Slide            <LessonId>-S<NN>              e.g. T14-S03
 *   Notes section    <LessonId>-N<NN>              e.g. T14-N01
 *   Animation scene  <LessonId>-A<NN>              e.g. T14-A05
 *   Exercise         <LessonId>-X<NN>              e.g. T14-X01
 *   Exercise step    <ExerciseId>-<NN>             e.g. T14-X01-02
 *   Lesson question  <LessonId>-Q<NN>              e.g. T14-Q04
 *   Checkpoint       CP1 | CPA | CPB              (CP1 after T04 non-gating; CPA after T13; CPB after T23)
 *   Checkpoint item  <CheckpointId>-Q<NN>          e.g. CPA-Q17
 *   Choice           lowercase slug, unique within its question, never renumbered: a, b, c ... or "wait", "no-trade"
 *   Glossary term    lowercase kebab slug          e.g. trading-pair, take-profit, mark-price
 *   Fixture          FX-<UPPER-KEBAB>              e.g. FX-T14-CANDLE-FORMING-01, FX-OHLC-1M-UPTREND-01
 *                    (lesson-local fixtures MUST start FX-<LessonId>-, e.g. FX-T22-SIZING-01)
 *   Formula          <LessonId>-F<NN>              e.g. T22-F01                          (v1.1.0)
 *
 * IDs are never reused for different meaning. Removing an item retires its ID; do not renumber siblings.
 * NN is two digits, 01-99.
 */

export const LESSON_IDS = [
  'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12',
  'T13', 'T14', 'T15', 'T16', 'T17', 'T18', 'T19', 'T20', 'T21', 'T22', 'T23',
] as const;
export type LessonId = (typeof LESSON_IDS)[number];

export const PHASE_IDS = ['P1', 'P2', 'P3', 'P4', 'P5'] as const;
export type PhaseId = (typeof PHASE_IDS)[number];

export const CHECKPOINT_IDS = ['CP1', 'CPA', 'CPB'] as const;
export type CheckpointId = (typeof CHECKPOINT_IDS)[number];

// Template-literal types give compile-time help; the regexes below are the runtime source of truth.
type D = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type TwoDigits = `${D}${D}`;
export type SlideId = `${LessonId}-S${TwoDigits}`;
export type NotesSectionId = `${LessonId}-N${TwoDigits}`;
export type SceneId = `${LessonId}-A${TwoDigits}`;
export type ExerciseId = `${LessonId}-X${TwoDigits}`;
/** `${ExerciseId}-NN`; widened to string suffix to keep the union small (regex enforces NN). */
export type ExerciseStepId = `${ExerciseId}-${string}`;
export type LessonQuestionId = `${LessonId}-Q${TwoDigits}`;
export type FormulaId = `${LessonId}-F${TwoDigits}`;
export type CheckpointQuestionId = `${CheckpointId}-Q${TwoDigits}`;
export type QuestionId = LessonQuestionId | CheckpointQuestionId;
/** Lowercase kebab-case slug. */
export type GlossaryTermId = string;
/** FX-UPPER-KEBAB. */
export type FixtureId = `FX-${string}`;
export type ChoiceId = string;

const L = '(?:T0[1-9]|T1\\d|T2[0-3])';
const NN = '(?:0[1-9]|[1-9]\\d)';
export const ID_PATTERNS = {
  phase: /^P[1-5]$/,
  lesson: new RegExp(`^${L}$`),
  slide: new RegExp(`^${L}-S${NN}$`),
  notesSection: new RegExp(`^${L}-N${NN}$`),
  scene: new RegExp(`^${L}-A${NN}$`),
  exercise: new RegExp(`^${L}-X${NN}$`),
  exerciseStep: new RegExp(`^${L}-X${NN}-${NN}$`),
  lessonQuestion: new RegExp(`^${L}-Q${NN}$`),
  formula: new RegExp(`^${L}-F${NN}$`),
  checkpointQuestion: new RegExp(`^CP(?:1|A|B)-Q${NN}$`),
  question: new RegExp(`^(?:${L}|CP1|CPA|CPB)-Q${NN}$`),
  checkpoint: /^CP(?:1|A|B)$/,
  choice: /^[a-z][a-z0-9-]{0,31}$/,
  glossaryTerm: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  fixture: /^FX-[A-Z0-9]+(?:-[A-Z0-9]+)*$/,
} as const;

export type IdKind = keyof typeof ID_PATTERNS;

export function isValidId(kind: IdKind, value: unknown): value is string {
  return typeof value === 'string' && ID_PATTERNS[kind].test(value);
}
export function isLessonId(v: unknown): v is LessonId {
  return typeof v === 'string' && (LESSON_IDS as readonly string[]).includes(v);
}
export function isPhaseId(v: unknown): v is PhaseId {
  return typeof v === 'string' && (PHASE_IDS as readonly string[]).includes(v);
}

/** The lesson an item id belongs to (T14-S03 -> T14), or undefined for checkpoint/other ids. */
export function lessonIdOf(itemId: string): LessonId | undefined {
  const prefix = itemId.slice(0, 3);
  return isLessonId(prefix) && (itemId.length === 3 || itemId[3] === '-') ? prefix : undefined;
}

/** URL slug for a lesson: T14 -> "t14". Route: `${ROUTE_BASE}/t14`. */
export function lessonSlug(id: LessonId): string {
  return id.toLowerCase();
}
export function lessonIdFromSlug(slug: string): LessonId | undefined {
  const up = slug.toUpperCase();
  return isLessonId(up) ? up : undefined;
}
