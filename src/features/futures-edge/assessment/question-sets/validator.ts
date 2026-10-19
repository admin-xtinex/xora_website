/**
 * Question-set validator (EDGE-09). Runs the frozen contract validators AND the assessment-specific rules:
 *  IDs (format, scope prefix, duplicates) · answer keys exist in choices · rationale present · distractor feedback ·
 *  safety-critical items carry a topic · shuffle safety · decision tagging · per-lesson question count / mix ·
 *  required safety topics per lesson · Phase 5 abstention-item rule (T19–T23) · D-37 numeric rounding/tolerance ·
 *  manifest integrity.
 * Checkpoint coverage lives in checkpoints/build.ts (validateCheckpointBuild).
 */
import {
  ABSTAIN_DECISIONS, DECISION_WORDS, ID_PATTERNS, LESSON_QUESTIONS_MAX, LESSON_QUESTIONS_MIN, PHASES, SAFETY_TOPICS,
  isLessonId, lessonIdOf, validateQuestion,
  type Lesson, type LessonId, type Question, type SafetyTopic, type ValidationIssue,
} from '../../contracts';
import { verifyManifest, type QuestionSetManifest } from './manifest';

export interface AssessmentReport { ok: boolean; errors: ValidationIssue[]; warnings: ValidationIssue[] }

class Issues {
  errors: ValidationIssue[] = [];
  warnings: ValidationIssue[] = [];
  err(path: string, code: string, message: string) { this.errors.push({ path, code, message, severity: 'error' }); }
  warn(path: string, code: string, message: string) { this.warnings.push({ path, code, message, severity: 'warning' }); }
  report(): AssessmentReport { return { ok: this.errors.length === 0, errors: this.errors, warnings: this.warnings }; }
  absorb(r: AssessmentReport) { this.errors.push(...r.errors); this.warnings.push(...r.warnings); }
}

/** Phase 5 lessons: each needs ≥1 item whose best answer is WAIT / NO_TRADE / STOP_TRADING (Mission Control rule). */
export const PHASE5_LESSON_IDS: readonly LessonId[] = PHASES.find((p) => p.id === 'P5')?.tutorialIds ?? [];

/** EDGE-09 policy (configurable): lessons that must contain a safety-critical item on one of these topics. */
export const REQUIRED_SAFETY_TOPICS_BY_LESSON: Readonly<Partial<Record<LessonId, readonly SafetyTopic[]>>> = {
  T10: ['account-security'],
  T12: ['leverage'],
  T13: ['liquidation'],
  T22: ['leverage', 'liquidation', 'loss-limits'],
  T23: ['loss-limits'],
};

const UNSAFE_TO_SHUFFLE = /\b(all|none|both|neither) of the (above|below)\b|\bboth [a-d] and [a-d]\b|\b(option|answer|choice) [a-d]\b/i;
const DECISION_TEXT = new RegExp(`^\\s*(?:DEMO\\s+)?(${DECISION_WORDS.map((w) => w.replaceAll('_', '[_ ]')).join('|')})\\b`);

export function bestAnswerIsAbstain(q: Question): boolean {
  if (!q.choices) return false;
  const keys = q.answer.kind === 'choice' ? [q.answer.choiceId] : q.answer.kind === 'choices' ? q.answer.choiceIds : [];
  return keys.some((id) => {
    const d = q.choices?.find((c) => c.id === id)?.decision;
    return d !== undefined && ABSTAIN_DECISIONS.includes(d);
  });
}

/**
 * D-37 rounding rule, EDGE-09 strict form (applies to numeric answers):
 *  - `rounding: { decimals }` is REQUIRED (integer 0..8), so the UI can tell the learner how to round;
 *  - tolerance must lie in [half step, one step] = [0.5·10^-d, 10^-d] (inclusive, tiny epsilon).
 * The contract validator only warns on some of these; EDGE-09 makes them errors for checkpoint-owned items and
 * reports them as warnings for lesson items (owned by the lesson authors).
 */
export interface NumericRoundingIssue { code: 'Q_NUMERIC_ROUNDING_MISSING' | 'Q_NUMERIC_ROUNDING_INVALID' | 'Q_TOLERANCE_BELOW_HALF_STEP' | 'Q_TOLERANCE_ABOVE_STEP'; message: string }
export function numericRoundingIssues(q: Pick<Question, 'answer'>): NumericRoundingIssue[] {
  const a = q.answer;
  if (!a || a.kind !== 'numeric') return [];
  const out: NumericRoundingIssue[] = [];
  const r = (a as { rounding?: unknown }).rounding;
  if (r === undefined) {
    out.push({ code: 'Q_NUMERIC_ROUNDING_MISSING', message: `numeric answer ${a.value} ${a.unit} (tolerance ${a.tolerance}) has no rounding.decimals` });
    return out;
  }
  const d = typeof r === 'object' && r !== null ? (r as { decimals?: unknown }).decimals : undefined;
  if (typeof d !== 'number' || !Number.isInteger(d) || d < 0 || d > 8) {
    out.push({ code: 'Q_NUMERIC_ROUNDING_INVALID', message: 'rounding.decimals must be an integer 0..8' });
    return out;
  }
  const step = 10 ** -d;
  const eps = step * 1e-6;
  if (a.tolerance + eps < step / 2) out.push({ code: 'Q_TOLERANCE_BELOW_HALF_STEP', message: `tolerance ${a.tolerance} < half step ${step / 2} at ${d} decimals (use ${step / 2})` });
  if (a.tolerance > step + eps) out.push({ code: 'Q_TOLERANCE_ABOVE_STEP', message: `tolerance ${a.tolerance} > one step ${step} at ${d} decimals (accepts a neighbouring wrong rounding)` });
  return out;
}

/** Validate one question with contract + EDGE-09 rules. `expect` = owning lesson or checkpoint id prefix. */
export function validateAssessmentQuestion(q: unknown, path: string, expect?: { lessonId?: LessonId; checkpointId?: string }): AssessmentReport {
  const is = new Issues();
  const contract = validateQuestion(q);
  if (!contract.ok) contract.errors.forEach((e) => is.err(`${path}${e.path.slice('question'.length)}`, e.code, e.message));
  contract.warnings.forEach((w) => is.warn(`${path}${w.path.slice('question'.length)}`, w.code, w.message));
  if (typeof q !== 'object' || q === null) return is.report();
  const x = q as Partial<Question> & Record<string, unknown>;
  const id = typeof x.id === 'string' ? x.id : '';
  if (!ID_PATTERNS.question.test(id)) is.err(`${path}.id`, 'Q_ID_FORMAT', `question id ${JSON.stringify(x.id)} must be Tnn-Qnn or CPx-Qnn`);
  if (expect?.lessonId && lessonIdOf(id) !== expect.lessonId) is.err(`${path}.id`, 'Q_ID_SCOPE', `${id} must start with ${expect.lessonId}-Q`);
  if (expect?.checkpointId && !id.startsWith(`${expect.checkpointId}-Q`)) is.err(`${path}.id`, 'Q_ID_SCOPE', `${id} must start with ${expect.checkpointId}-Q`);
  if (typeof x.rationale !== 'string' || x.rationale.trim().length < 10) is.err(`${path}.rationale`, 'Q_RATIONALE_MISSING', 'every question needs a rationale explaining the correct answer');
  const choices = Array.isArray(x.choices) ? x.choices : [];
  const ids = new Set(choices.map((c) => c?.id));
  const a = x.answer as Question['answer'] | undefined;
  if (a && x.type !== 'numeric') {
    const keys = a.kind === 'choice' ? [a.choiceId] : a.kind === 'choices' || a.kind === 'order' ? a.choiceIds ?? [] : [];
    if (keys.length === 0 || keys.some((k) => !ids.has(k))) is.err(`${path}.answer`, 'Q_ANSWER_KEY_MISSING', `answer key ${JSON.stringify(keys)} is not among choices ${JSON.stringify([...ids])}`);
    if (x.type !== 'ordering') {
      const fb = (x.misconceptionFeedback ?? {}) as Record<string, string>;
      for (const c of choices) if (c && !keys.includes(c.id) && !(typeof fb[c.id] === 'string' && fb[c.id]!.trim())) {
        is.err(`${path}.misconceptionFeedback.${c.id}`, 'Q_DISTRACTOR_FEEDBACK_MISSING', `no feedback for wrong choice "${c.id}"`);
      }
    }
  }
  if (x.safetyCritical === true && !(SAFETY_TOPICS as readonly string[]).includes(String(x.safetyTopic))) {
    is.err(`${path}.safetyTopic`, 'Q_SAFETY_TOPIC_MISSING', 'safety-critical items need a safetyTopic so failures can be surfaced by topic');
  }
  if (x.safetyCritical === true && !x.remediationRef) is.warn(`${path}.remediationRef`, 'Q_SAFETY_REMEDIATION_MISSING', 'safety-critical item has no remediationRef; the correction falls back to the linked lesson');
  if (x.shuffleChoices === true && choices.some((c) => typeof c?.text === 'string' && UNSAFE_TO_SHUFFLE.test(c.text))) {
    is.err(`${path}.shuffleChoices`, 'Q_SHUFFLE_UNSAFE', 'a choice refers to other choices by position ("all of the above", "option b"); shuffling would break it');
  }
  if (a && a.kind === 'numeric') {
    // Checkpoint-owned items (EDGE-09) must comply; lesson items are reported to their authors as warnings.
    const sev = expect?.checkpointId ? is.err.bind(is) : is.warn.bind(is);
    for (const n of numericRoundingIssues({ answer: a })) sev(`${path}.answer`, n.code, n.message);
  }
  choices.forEach((c, i) => {
    if (!c || typeof c.text !== 'string') return;
    const m = DECISION_TEXT.exec(c.text);
    if (m && c.decision === undefined) is.warn(`${path}.choices[${i}].decision`, 'Q_DECISION_TAG_MISSING', `choice "${c.id}" reads as decision ${m[1]} but has no Choice.decision tag (abstention tracking needs it)`);
    if (c.decision !== undefined && m && m[1]!.replaceAll(' ', '_') !== c.decision) is.err(`${path}.choices[${i}].decision`, 'Q_DECISION_TAG_MISMATCH', `choice text says ${m[1]} but decision tag is ${c.decision}`);
  });
  return is.report();
}

export interface LessonCheckOptions {
  requiredSafetyTopics?: Readonly<Partial<Record<LessonId, readonly SafetyTopic[]>>>;
}

/** Validate a lesson's quiz as a versioned question set. */
export function validateLessonQuestionSet(lesson: Lesson, opts: LessonCheckOptions = {}): AssessmentReport {
  const is = new Issues();
  const P = `[${lesson.id}]`;
  const qs = Array.isArray(lesson.quizQuestions) ? lesson.quizQuestions : [];
  if (qs.length < LESSON_QUESTIONS_MIN || qs.length > LESSON_QUESTIONS_MAX) is.err(`${P}.quizQuestions`, 'L_QUESTION_COUNT', `has ${qs.length} questions; expected ${LESSON_QUESTIONS_MIN}–${LESSON_QUESTIONS_MAX}`);
  const seen = new Set<string>();
  qs.forEach((q, i) => {
    is.absorb(validateAssessmentQuestion(q, `${P}.quizQuestions[${i}]`, { lessonId: lesson.id }));
    if (seen.has(q.id)) is.err(`${P}.quizQuestions[${i}].id`, 'Q_DUPLICATE_ID', `duplicate question id ${q.id}`);
    seen.add(q.id);
    if (q.linkedLessonId !== lesson.id) is.err(`${P}.quizQuestions[${i}].linkedLessonId`, 'Q_LINKED_LESSON', `must be ${lesson.id}`);
  });
  const tags = new Set(qs.map((q) => q.cognitiveTag));
  if (!tags.has('interpretation')) is.warn(`${P}.quizQuestions`, 'L_COGNITIVE_MIX', 'no interpretation question');
  if (!tags.has('mistake-risk')) is.warn(`${P}.quizQuestions`, 'L_COGNITIVE_MIX', 'no mistake-risk question');
  const t = lesson.completionRequirements?.minQuizScore;
  if (typeof t !== 'number' || t < 0 || t > 1) is.err(`${P}.completionRequirements.minQuizScore`, 'L_THRESHOLD_RANGE', 'must be 0..1');
  if (lesson.completionRequirements && lesson.completionRequirements.requireSafetyCriticalCorrect === false) {
    is.warn(`${P}.completionRequirements.requireSafetyCriticalCorrect`, 'L_SAFETY_GATE_WEAKENED', 'false is ignored: EDGE-09 always gates on safety-critical items (D-06)');
  }
  const required = (opts.requiredSafetyTopics ?? REQUIRED_SAFETY_TOPICS_BY_LESSON)[lesson.id];
  if (required && !qs.some((q) => q.safetyCritical === true && q.safetyTopic !== undefined && required.includes(q.safetyTopic))) {
    is.err(`${P}.quizQuestions`, 'L_REQUIRED_SAFETY_TOPIC', `${lesson.id} needs a safety-critical item on one of: ${required.join(', ')}`);
  }
  if (PHASE5_LESSON_IDS.includes(lesson.id) && !qs.some(bestAnswerIsAbstain)) {
    is.err(`${P}.quizQuestions`, 'P5_ABSTAIN_ITEM_MISSING', `${lesson.id} (Phase 5) needs ≥1 item whose best answer is ${ABSTAIN_DECISIONS.join(' / ')} (tagged with Choice.decision)`);
  }
  return is.report();
}

/** Phase-level checks across the present lessons (partial = missing lessons are warnings). */
export function validatePhase5Abstention(lessons: readonly Lesson[], opts: { partial?: boolean } = {}): AssessmentReport {
  const is = new Issues();
  for (const id of PHASE5_LESSON_IDS) {
    const l = lessons.find((x) => x.id === id);
    if (!l) { (opts.partial ? is.warn.bind(is) : is.err.bind(is))(`[${id}]`, 'P5_LESSON_NOT_PRESENT', `${id} not loaded; abstention rule unverified`); continue; }
    if (!l.quizQuestions.some(bestAnswerIsAbstain)) is.err(`[${id}].quizQuestions`, 'P5_ABSTAIN_ITEM_MISSING', `${id} has no item whose best answer is an abstain decision`);
  }
  const p5 = lessons.filter((l) => PHASE5_LESSON_IDS.includes(l.id));
  if (p5.length === PHASE5_LESSON_IDS.length && !p5.some((l) => l.quizQuestions.some((q) => q.safetyCritical && q.safetyTopic === 'loss-limits'))) {
    is.err('[P5]', 'P5_LOSS_LIMITS_MISSING', 'Phase 5 needs at least one safety-critical loss-limits item');
  }
  return is.report();
}

export function validateManifestIntegrity(m: QuestionSetManifest): AssessmentReport {
  const is = new Issues();
  if (!verifyManifest(m)) is.err(`[${m.scopeKey}]`, 'MANIFEST_TAMPERED', 'manifest hashes do not match its questions');
  if (m.scope.kind === 'lesson' && !isLessonId(m.scope.lessonId)) is.err(`[${m.scopeKey}]`, 'MANIFEST_SCOPE', 'bad lesson id');
  return is.report();
}
