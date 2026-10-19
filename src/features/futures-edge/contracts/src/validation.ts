/**
 * Runtime validators (plain TypeScript, zero dependencies — the repo has no zod/ajv; verified 2026-10-19).
 * Owner: EDGE-00. Every validator accepts `unknown`, never throws on bad input, and returns all issues found.
 */
import {
  ID_PATTERNS, LESSON_IDS, isLessonId, isPhaseId, isValidId, lessonIdOf,
  type LessonId, type FixtureId,
} from './ids';
import { phaseOfLesson, PHASES } from './phases';
import { SCHEMA_MAJOR, SEMVER_PATTERN, schemaMajorOf } from './version';
import { CONTENT_BLOCK_KINDS, FORBIDDEN_MARKUP_PATTERN, extractGlossaryLinks, type ContentBlock } from './content';
import { SLIDE_KINDS, SLIDES_MIN, SLIDES_MAX } from './slide';
import { REQUIRED_NOTES_HEADINGS, NOTES_WORDS } from './notes';
import { SCENES_MIN, SCENES_MAX, TIMELINE_TARGET_MS, SCENE_VARIANTS, BRANCH_ID_PATTERN, isSceneType, type AnimationScene } from './animation';
import { DECISION_SETS, isDecisionWord, RETIRED_DECISION_WORDS, type DecisionSet } from './decisions';
import { isSimulatorId, SIMULATOR_IDS } from './simulators';
import { GLOSSARY_ALIASES, glossaryOwnerOf } from './glossary-owners';
import {
  EXERCISE_TYPES, EXERCISE_CONTROLS, EXERCISE_STEPS_MIN, EXERCISE_STEPS_MAX,
  type Exercise,
} from './exercise';
import {
  QUESTION_TYPES, SAFETY_TOPICS, LESSON_QUESTIONS_MIN, LESSON_QUESTIONS_MAX,
  type Question, type CheckpointConfig,
} from './question';
import { PROGRESS_SCHEMA_VERSION, type Progress } from './progress';
import { FIXTURE_KINDS, type Fixture } from './exercise';
import { FIXTURE_INTERVAL_PATTERN } from './fixture-shapes';
import { CANDLE_DIRECTIONS, type OhlcAnatomyResult } from './simulators';
import type { Lesson } from './lesson';
import type { GlossaryEntry } from './glossary';
import { isJsonObject } from './json';
import type { ValidationIssue, ValidationResult } from './validation-types';

export type { ValidationIssue, ValidationResult } from './validation-types';

/** Text that marks unfinished content. Any match is an ERROR — no placeholder lessons may ship. */
export const PLACEHOLDER_PATTERN = /\b(TODO|TBD|FIXME|lorem ipsum|placeholder|content here|coming soon)\b/i;

export interface ValidateOptions {
  /** If given, scene `type` must be registered (EDGE-07 registry), not merely in SCENE_TYPES. */
  sceneRegistry?: { has(type: string): boolean };
  /** If given, every fixtureId referenced must exist (EDGE-08 provider). */
  fixtureProvider?: { has(id: FixtureId): boolean };
}

type Obj = Record<string, unknown>;

class Ctx {
  errors: ValidationIssue[] = [];
  warnings: ValidationIssue[] = [];
  err(path: string, code: string, message: string) { this.errors.push({ path, code, message, severity: 'error' }); }
  warn(path: string, code: string, message: string) { this.warnings.push({ path, code, message, severity: 'warning' }); }
  result<T>(value: unknown): ValidationResult<T> {
    return this.errors.length === 0
      ? { ok: true, value: value as T, warnings: this.warnings }
      : { ok: false, errors: this.errors, warnings: this.warnings };
  }
}

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const nonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const words = (s: string) => s.replace(/\[\[[^\]|]+\|?([^\]]*)\]\]/g, '$1').split(/\s+/).filter(Boolean).length;

function str(c: Ctx, o: Obj, key: string, path: string): string | undefined {
  const v = o[key];
  if (!nonEmpty(v)) { c.err(`${path}.${key}`, 'REQUIRED_TEXT', `"${key}" must be a non-empty string`); return undefined; }
  return v;
}
function arr(c: Ctx, o: Obj, key: string, path: string, min = 0, max = Infinity): unknown[] {
  const v = o[key];
  if (!Array.isArray(v)) { c.err(`${path}.${key}`, 'REQUIRED_ARRAY', `"${key}" must be an array`); return []; }
  if (v.length < min || v.length > max) {
    c.err(`${path}.${key}`, 'COUNT', `"${key}" must have ${min}–${max === Infinity ? '∞' : max} items (has ${v.length})`);
  }
  return v;
}
function oneOf<T extends string>(c: Ctx, v: unknown, allowed: readonly T[], path: string): v is T {
  if (typeof v !== 'string' || !(allowed as readonly string[]).includes(v)) {
    c.err(path, 'ENUM', `must be one of: ${allowed.join(', ')} (got ${JSON.stringify(v)})`);
    return false;
  }
  return true;
}
function id(c: Ctx, v: unknown, kind: keyof typeof ID_PATTERNS, path: string, lesson?: LessonId, seen?: Set<string>): v is string {
  if (!isValidId(kind, v)) { c.err(path, 'ID_FORMAT', `invalid ${kind} id ${JSON.stringify(v)}`); return false; }
  if (lesson && lessonIdOf(v) !== lesson) c.err(path, 'ID_LESSON_PREFIX', `id ${v} must start with ${lesson}-`);
  if (seen) { if (seen.has(v)) c.err(path, 'ID_DUPLICATE', `duplicate id ${v}`); seen.add(v); }
  return true;
}
function fixtureRef(c: Ctx, v: unknown, path: string, opts: ValidateOptions) {
  if (!id(c, v, 'fixture', path)) return;
  if (opts.fixtureProvider && !opts.fixtureProvider.has(v as FixtureId)) c.err(path, 'FIXTURE_MISSING', `fixture ${v} not found`);
}

/** Deep scan of every string: forbidden markup and placeholder text. */
function scanStrings(c: Ctx, v: unknown, path: string, depth = 0): void {
  if (depth > 40) return;
  if (typeof v === 'string') {
    if (FORBIDDEN_MARKUP_PATTERN.test(v)) c.err(path, 'MARKUP', 'HTML/script-like markup is not allowed in content');
    if (PLACEHOLDER_PATTERN.test(v)) c.err(path, 'PLACEHOLDER', `placeholder text found: "${v.slice(0, 60)}"`);
  } else if (Array.isArray(v)) v.forEach((x, i) => scanStrings(c, x, `${path}[${i}]`, depth + 1));
  else if (isObj(v)) for (const [k, x] of Object.entries(v)) scanStrings(c, x, `${path}.${k}`, depth + 1);
}

/**
 * v1.2.0 (D-37): tolerance vs rounding. Applies to exercise `numeric`, `numeric-set` fields and numeric question answers.
 *  - rounding.decimals must be an integer 0..8.
 *  - tolerance < 0.5·10^-d: ERROR if the value is not on the d-decimal grid (a correctly rounded answer would be
 *    rejected), WARNING otherwise (harmless, but normalise to the half step).
 *  - tolerance > 10^-d: WARNING (accepts a neighbouring wrong rounding).
 *  - value ≠ 0 and tolerance ≥ |value|: ERROR (zero or the opposite sign would be accepted).
 *  - no rounding, tolerance 0 and a non-integer value: WARNING (exact float equality).
 */
function checkTolerance(c: Ctx, o: Obj, p: string): void {
  const value = o['value'];
  const tol = o['tolerance'];
  if (typeof value !== 'number' || !Number.isFinite(value) || typeof tol !== 'number' || !(tol >= 0)) return;
  if (value !== 0 && tol >= Math.abs(value)) c.err(`${p}.tolerance`, 'TOLERANCE_ACCEPTS_SIGN_FLIP', `tolerance ${tol} ≥ |value| ${Math.abs(value)}: zero or the opposite sign would be accepted`);
  const r = o['rounding'];
  if (r === undefined) {
    if (tol === 0 && !Number.isInteger(value)) c.warn(`${p}.tolerance`, 'TOLERANCE_ZERO_FLOAT', 'tolerance 0 on a non-integer value relies on exact float equality; add rounding + half-step tolerance');
    return;
  }
  if (!isObj(r) || typeof r['decimals'] !== 'number' || !Number.isInteger(r['decimals']) || r['decimals'] < 0 || r['decimals'] > 8) {
    c.err(`${p}.rounding.decimals`, 'ROUNDING', 'rounding.decimals must be an integer 0..8');
    return;
  }
  const d = r['decimals'];
  const step = 10 ** -d;
  const half = step / 2;
  const eps = step * 1e-6;
  const onGrid = Math.abs(value - Math.round(value / step) * step) <= eps;
  if (tol + eps < half) {
    if (!onGrid) c.err(`${p}.tolerance`, 'TOLERANCE_BELOW_ROUNDING', `tolerance ${tol} < half step ${half} for ${d} decimals and value ${value} is not on the ${d}-decimal grid: a correctly rounded answer would be marked wrong`);
    else c.warn(`${p}.tolerance`, 'TOLERANCE_BELOW_HALF_STEP', `tolerance ${tol} < half step ${half}; use ${half} for ${d} decimals`);
  }
  if (tol > step + eps) c.warn(`${p}.tolerance`, 'TOLERANCE_LOOSE', `tolerance ${tol} > one step ${step} at ${d} decimals: a neighbouring wrong answer is accepted; justify or tighten`);
}

/** v1.3.0 (D-53): parameters.branchId must be kebab-case and needs a fixtureId on the same item. */
function checkBranchId(c: Ctx, o: Obj, p: string): void {
  const params = o['parameters'];
  if (!isObj(params) || params['branchId'] === undefined) return;
  const b = params['branchId'];
  if (typeof b !== 'string' || !BRANCH_ID_PATTERN.test(b)) c.err(`${p}.parameters.branchId`, 'BRANCH_ID', 'branchId must be a kebab-case string');
  else if (o['fixtureId'] === undefined) c.err(`${p}.parameters.branchId`, 'BRANCH_ID_NO_FIXTURE', 'branchId selects a path in a branching-paths fixture: set fixtureId');
}

function blockWords(b: ContentBlock): number {
  switch (b.kind) {
    case 'paragraph': case 'heading': case 'analogy': case 'callout': return words(b.text);
    case 'definition': return b.text ? words(b.text) : 0;
    case 'list': return b.items.reduce((n, s) => n + words(s), 0);
    case 'formula': return words(b.expression) + b.variables.reduce((n, x) => n + words(x.meaning), 0);
    case 'worked-example': return words(b.title) + b.steps.reduce((n, s) => n + words(s.text), 0) + words(b.conclusion);
    case 'table': return b.rows.flat().reduce((n, s) => n + words(s), 0);
    case 'comparison': return [...b.left.points, ...b.right.points].reduce((n, s) => n + words(s), 0);
    case 'learn-more': return b.blocks.reduce((n, x) => n + blockWords(x), 0);
    default: return 0;
  }
}

export function validateBlocks(c: Ctx, v: unknown, path: string, opts: ValidateOptions, minCount = 1): ContentBlock[] {
  if (!Array.isArray(v)) { c.err(path, 'REQUIRED_ARRAY', 'blocks must be an array'); return []; }
  if (v.length < minCount) c.err(path, 'COUNT', `needs at least ${minCount} block(s)`);
  v.forEach((b, i) => {
    const p = `${path}[${i}]`;
    if (!isObj(b) || !oneOf(c, b['kind'], CONTENT_BLOCK_KINDS, `${p}.kind`)) return;
    switch (b['kind']) {
      case 'paragraph': case 'analogy': str(c, b, 'text', p); break;
      case 'heading': str(c, b, 'text', p); if (b['level'] !== 3 && b['level'] !== 4) c.err(`${p}.level`, 'ENUM', 'level must be 3 or 4'); break;
      case 'list': arr(c, b, 'items', p, 1).forEach((s, j) => { if (!nonEmpty(s)) c.err(`${p}.items[${j}]`, 'REQUIRED_TEXT', 'empty item'); }); break;
      case 'definition': id(c, b['termId'], 'glossaryTerm', `${p}.termId`); break;
      case 'formula':
        str(c, b, 'expression', p);
        arr(c, b, 'variables', p, 1).forEach((x, j) => {
          if (!isObj(x)) return c.err(`${p}.variables[${j}]`, 'TYPE', 'must be an object');
          str(c, x, 'symbol', `${p}.variables[${j}]`); str(c, x, 'meaning', `${p}.variables[${j}]`); str(c, x, 'unit', `${p}.variables[${j}]`);
        });
        break;
      case 'worked-example':
        str(c, b, 'title', p); str(c, b, 'conclusion', p);
        if (b['fictional'] !== true) c.err(`${p}.fictional`, 'FICTIONAL_REQUIRED', 'worked examples must set fictional: true');
        arr(c, b, 'steps', p, 1).forEach((s, j) => { if (!isObj(s) || !nonEmpty(s['text'])) c.err(`${p}.steps[${j}]`, 'REQUIRED_TEXT', 'step needs text'); });
        break;
      case 'callout': oneOf(c, b['callout'], ['safety', 'tip', 'mistake', 'fictional-data', 'not-advice', 'approximation'] as const, `${p}.callout`); str(c, b, 'text', p); break;
      case 'table': {
        str(c, b, 'caption', p);
        const h = arr(c, b, 'headers', p, 1);
        arr(c, b, 'rows', p, 1).forEach((r, j) => { if (!Array.isArray(r) || r.length !== h.length) c.err(`${p}.rows[${j}]`, 'TABLE_SHAPE', 'row length must equal headers length'); });
        break;
      }
      case 'comparison':
        for (const side of ['left', 'right'] as const) {
          const s = b[side];
          if (!isObj(s)) { c.err(`${p}.${side}`, 'TYPE', 'must be an object'); continue; }
          str(c, s, 'title', `${p}.${side}`); arr(c, s, 'points', `${p}.${side}`, 1);
        }
        break;
      case 'scene-embed': id(c, b['sceneId'], 'scene', `${p}.sceneId`); str(c, b, 'caption', p); break;
      case 'fixture-figure': fixtureRef(c, b['fixtureId'], `${p}.fixtureId`, opts); str(c, b, 'caption', p); str(c, b, 'textAlternative', p); break;
      case 'learn-more': str(c, b, 'title', p); validateBlocks(c, b['blocks'], `${p}.blocks`, opts); break;
    }
  });
  return v as ContentBlock[];
}

function validateGlossaryEntry(c: Ctx, g: unknown, p: string, lessonId: LessonId | undefined, seen: Set<string>) {
  if (!isObj(g)) return c.err(p, 'TYPE', 'glossary entry must be an object');
  id(c, g['id'], 'glossaryTerm', `${p}.id`, undefined, seen);
  for (const k of ['term', 'plainDefinition', 'technicalMeaning', 'example']) str(c, g, k, p);
  arr(c, g, 'relatedTermIds', p).forEach((r, i) => id(c, r, 'glossaryTerm', `${p}.relatedTermIds[${i}]`));
  if (lessonId && g['introducedIn'] !== lessonId) c.err(`${p}.introducedIn`, 'GLOSSARY_OWNER', `must equal ${lessonId}`);
  const gid = g['id'];
  if (typeof gid === 'string') {
    const alias = GLOSSARY_ALIASES[gid];
    const owner = glossaryOwnerOf(gid);
    if (alias) c.err(`${p}.id`, 'GLOSSARY_ALIAS', `"${gid}" is an alias; the canonical term is "${alias}" (owned by ${glossaryOwnerOf(alias)}). Reference it instead of defining it.`);
    else if (owner && lessonId && owner !== lessonId) c.err(`${p}.id`, 'GLOSSARY_OWNER_MISMATCH', `term "${gid}" is owned by ${owner} (GLOSSARY_TERM_OWNERS); reference it instead of defining it`);
    else if (!owner) c.warn(`${p}.id`, 'GLOSSARY_UNREGISTERED', `term "${gid}" is not in GLOSSARY_TERM_OWNERS; ask EDGE-00 to register it for ${lessonId ?? 'this lesson'}`);
  }
}

function validateSlide(c: Ctx, s: unknown, p: string, L: LessonId, seen: Set<string>, opts: ValidateOptions) {
  if (!isObj(s)) return c.err(p, 'TYPE', 'slide must be an object');
  id(c, s['id'], 'slide', `${p}.id`, L, seen);
  oneOf(c, s['kind'], SLIDE_KINDS, `${p}.kind`);
  str(c, s, 'title', p); str(c, s, 'narrationText', p);
  const blocks = validateBlocks(c, s['blocks'], `${p}.blocks`, opts);
  arr(c, s, 'glossaryRefs', p).forEach((g, i) => id(c, g, 'glossaryTerm', `${p}.glossaryRefs[${i}]`));
  try {
    const n = blocks.reduce((acc, b) => acc + (isObj(b) ? blockWords(b) : 0), 0);
    if (n > 60) c.warn(`${p}.blocks`, 'SLIDE_DENSE', `slide has ~${n} main words (target ≤35)`);
  } catch { /* shape errors already reported */ }
  const vr = s['visualRef'];
  if (vr !== undefined) {
    if (!isObj(vr)) c.err(`${p}.visualRef`, 'TYPE', 'must be an object');
    else if (vr['kind'] === 'scene') id(c, vr['sceneId'], 'scene', `${p}.visualRef.sceneId`, L);
    else if (vr['kind'] === 'fixture') { fixtureRef(c, vr['fixtureId'], `${p}.visualRef.fixtureId`, opts); str(c, vr, 'textAlternative', `${p}.visualRef`); }
    else if (vr['kind'] !== 'none') c.err(`${p}.visualRef.kind`, 'ENUM', 'must be scene | fixture | none');
  }
}

function validateScene(c: Ctx, s: unknown, p: string, L: LessonId | undefined, seen: Set<string>, opts: ValidateOptions): number {
  if (!isObj(s)) { c.err(p, 'TYPE', 'scene must be an object'); return 0; }
  id(c, s['id'], 'scene', `${p}.id`, L, seen);
  const t = s['type'];
  if (!isSceneType(t)) c.err(`${p}.type`, 'SCENE_TYPE', `unknown scene type ${JSON.stringify(t)} (see SCENE_TYPES; request new types via EDGE-00/EDGE-07)`);
  else if (opts.sceneRegistry && !opts.sceneRegistry.has(t)) c.err(`${p}.type`, 'SCENE_UNREGISTERED', `scene type ${t} not registered by EDGE-07`);
  str(c, s, 'caption', p); str(c, s, 'reducedMotionDescription', p);
  const params = s['parameters'];
  if (!isJsonObject(params)) c.err(`${p}.parameters`, 'JSON_OBJECT', 'parameters must be a plain JSON object');
  else {
    if (params['mode'] !== undefined) c.warn(`${p}.parameters.mode`, 'DEPRECATED_MODE', 'use parameters.variant (mode is a deprecated alias since 1.1.0)');
    if (params['mode'] !== undefined && params['variant'] !== undefined) c.err(`${p}.parameters`, 'VARIANT_CONFLICT', 'set either variant or mode, not both');
    const variant = params['variant'] ?? params['mode'];
    if (variant !== undefined && isSceneType(t)) {
      const allowed = SCENE_VARIANTS[t];
      if (typeof variant !== 'string') c.err(`${p}.parameters.variant`, 'TYPE', 'variant must be a string');
      else if (allowed && !allowed.includes(variant)) c.err(`${p}.parameters.variant`, 'SCENE_VARIANT', `variant "${variant}" not registered for ${t} (allowed: ${allowed.join(', ')})`);
      else if (!allowed) c.warn(`${p}.parameters.variant`, 'SCENE_VARIANT_UNLISTED', `${t} has no registered variants; ask EDGE-00/EDGE-07 to register "${variant}"`);
    }
  }
  if (s['fixtureId'] !== undefined) fixtureRef(c, s['fixtureId'], `${p}.fixtureId`, opts);
  checkBranchId(c, s, p);
  if (s['pauseForInteraction'] !== undefined && (!isObj(s['pauseForInteraction']) || !nonEmpty(s['pauseForInteraction']['prompt']))) {
    c.err(`${p}.pauseForInteraction`, 'REQUIRED_TEXT', 'pauseForInteraction needs a prompt');
  }
  const d = s['durationMs'];
  if (d !== undefined && (typeof d !== 'number' || !Number.isFinite(d) || d <= 0 || d > 120_000)) {
    c.err(`${p}.durationMs`, 'RANGE', 'durationMs must be a number in (0, 120000]');
    return 0;
  }
  return typeof d === 'number' ? d : 0;
}

function checkExercise(c: Ctx, x: unknown, p: string, L: LessonId | undefined, seen: Set<string>, opts: ValidateOptions) {
  if (!isObj(x)) return c.err(p, 'TYPE', 'exercise must be an object');
  const xid = x['id'];
  id(c, xid, 'exercise', `${p}.id`, L, seen);
  oneOf(c, x['type'], EXERCISE_TYPES, `${p}.type`);
  fixtureRef(c, x['fixtureId'], `${p}.fixtureId`, opts);
  checkBranchId(c, x, p);
  for (const k of ['title', 'instructions', 'explanation', 'fictionalDataLabel']) str(c, x, k, p);
  if (x['simulatorId'] !== undefined && !isSimulatorId(x['simulatorId'])) c.err(`${p}.simulatorId`, 'SIMULATOR_ID', `unknown simulator ${JSON.stringify(x['simulatorId'])} (see SIMULATOR_IDS)`);
  // Choices (v1.1.0): top-level preferred, parameters.choices deprecated
  const exChoiceIds = new Set<string>();
  const paramChoices = isObj(x['parameters']) ? x['parameters']['choices'] : undefined;
  let choiceList: unknown = x['choices'];
  if (choiceList === undefined && paramChoices !== undefined) {
    c.warn(`${p}.parameters.choices`, 'DEPRECATED_PARAM_CHOICES', 'move choices to the top-level `choices` field (since 1.1.0)');
    choiceList = paramChoices;
  } else if (choiceList !== undefined && paramChoices !== undefined) {
    c.err(`${p}.parameters.choices`, 'CHOICES_CONFLICT', 'choices defined twice (top-level and parameters.choices)');
  }
  if (choiceList !== undefined) {
    if (!Array.isArray(choiceList) || choiceList.length < 2) c.err(`${p}.choices`, 'COUNT', 'choices must be an array of at least 2');
    else choiceList.forEach((ch, i) => {
      const cp = `${p}.choices[${i}]`;
      if (!isObj(ch)) return c.err(cp, 'TYPE', 'choice must be an object');
      if (id(c, ch['id'], 'choice', `${cp}.id`)) {
        if (exChoiceIds.has(ch['id'] as string)) c.err(`${cp}.id`, 'ID_DUPLICATE', 'duplicate choice id');
        exChoiceIds.add(ch['id'] as string);
      }
      str(c, ch, 'text', cp);
      if (ch['decision'] !== undefined && !isDecisionWord(ch['decision'])) c.err(`${cp}.decision`, 'DECISION_WORD', 'unknown decision word');
    });
  } else if (x['type'] === 'choice-feedback') {
    c.err(`${p}.choices`, 'CHOICES_REQUIRED', "'choice-feedback' exercises need `choices`");
  }
  const refChoice = (v: unknown, path: string) => {
    if (exChoiceIds.size > 0 && (typeof v !== 'string' || !exChoiceIds.has(v))) c.err(path, 'ANSWER_REF', `references unknown choice ${JSON.stringify(v)}`);
  };
  arr(c, x, 'steps', p, EXERCISE_STEPS_MIN, EXERCISE_STEPS_MAX).forEach((s, i) => {
    const sp = `${p}.steps[${i}]`;
    if (!isObj(s)) return c.err(sp, 'TYPE', 'step must be an object');
    if (id(c, s['id'], 'exerciseStep', `${sp}.id`, undefined, seen) && typeof xid === 'string' && !(s['id'] as string).startsWith(`${xid}-`)) {
      c.err(`${sp}.id`, 'ID_PARENT', `step id must start with ${xid}-`);
    }
    str(c, s, 'prompt', sp); str(c, s, 'hint', sp);
  });
  const controls = arr(c, x, 'allowedControls', p, 1);
  controls.forEach((k, i) => oneOf(c, k, EXERCISE_CONTROLS, `${p}.allowedControls[${i}]`));
  if (!controls.includes('reset')) c.err(`${p}.allowedControls`, 'RESET_REQUIRED', "exercises must allow 'reset'");
  if (controls.includes('drag') && !controls.some((k) => k === 'keyboard-move' || k === 'numeric-input' || k === 'choice' || k === 'tap-select')) {
    c.err(`${p}.allowedControls`, 'A11Y_DRAG_ALTERNATIVE', "'drag' requires a keyboard/numeric/choice equivalent");
  }
  if (!isJsonObject(x['parameters'])) c.err(`${p}.parameters`, 'JSON_OBJECT', 'parameters must be a plain JSON object');
  const e = x['expectedEvaluation'];
  if (!isObj(e)) return c.err(`${p}.expectedEvaluation`, 'TYPE', 'must be an object');
  const ep = `${p}.expectedEvaluation`;
  switch (e['kind']) {
    case 'exact-choice': if (id(c, e['choiceId'], 'choice', `${ep}.choiceId`)) refChoice(e['choiceId'], `${ep}.choiceId`); break;
    case 'choice-set': arr(c, e, 'choiceIds', ep, 1).forEach((v, i) => { if (id(c, v, 'choice', `${ep}.choiceIds[${i}]`)) refChoice(v, `${ep}.choiceIds[${i}]`); }); break;
    case 'numeric-set': {
      const keys = new Set<string>();
      arr(c, e, 'fields', ep, 1).forEach((f, i) => {
        const fp = `${ep}.fields[${i}]`;
        if (!isObj(f)) return c.err(fp, 'TYPE', 'field must be an object');
        const k = str(c, f, 'key', fp); str(c, f, 'label', fp); str(c, f, 'unit', fp);
        if (k) { if (keys.has(k)) c.err(`${fp}.key`, 'ID_DUPLICATE', `duplicate key ${k}`); keys.add(k); }
        if (typeof f['value'] !== 'number' || !Number.isFinite(f['value'])) c.err(`${fp}.value`, 'NUMBER', 'finite number required');
        if (typeof f['tolerance'] !== 'number' || !(f['tolerance'] >= 0)) c.err(`${fp}.tolerance`, 'NUMBER', 'tolerance ≥ 0 required');
        checkTolerance(c, f, fp);
      });
      break;
    }
    case 'numeric':
      if (typeof e['value'] !== 'number' || !Number.isFinite(e['value'])) c.err(`${ep}.value`, 'NUMBER', 'finite number required');
      if (typeof e['tolerance'] !== 'number' || !(e['tolerance'] >= 0)) c.err(`${ep}.tolerance`, 'NUMBER', 'tolerance ≥ 0 required');
      str(c, e, 'unit', ep);
      checkTolerance(c, e, ep);
      break;
    case 'sequence': arr(c, e, 'order', ep, 2); break;
    case 'classification': if (!isObj(e['buckets'])) c.err(`${ep}.buckets`, 'TYPE', 'buckets object required'); break;
    case 'constraint':
      str(c, e, 'description', ep);
      if (!isSimulatorId(e['simulatorId'])) c.err(`${ep}.simulatorId`, 'SIMULATOR_ID', `unknown simulator ${JSON.stringify(e['simulatorId'])} (allowed: ${SIMULATOR_IDS.join(', ')})`);
      break;
    case 'decision':
    {
      const setName = (e['decisionSet'] ?? 'trade') as DecisionSet;
      const set = DECISION_SETS[setName];
      if (!set) { c.err(`${ep}.decisionSet`, 'ENUM', 'decisionSet must be trade | session | risk-check'); break; }
      arr(c, e, 'acceptable', ep, 1).forEach((d, i) => {
        if (typeof d === 'string' && RETIRED_DECISION_WORDS[d]) c.err(`${ep}.acceptable[${i}]`, 'DECISION_RETIRED', `${d} is retired: ${RETIRED_DECISION_WORDS[d]}`);
        else oneOf(c, d, set, `${ep}.acceptable[${i}]`);
      });
    }
      if (typeof e['requiresRationale'] !== 'boolean') c.err(`${ep}.requiresRationale`, 'BOOLEAN', 'boolean required');
      arr(c, e, 'rationaleCues', ep, 1); break;
    case 'rubric': arr(c, e, 'criteria', ep, 1); break;
    default: c.err(`${ep}.kind`, 'ENUM', 'unknown evaluation kind');
  }
}

function validateQuestionInto(c: Ctx, q: unknown, p: string, expectLesson: LessonId | undefined, seen: Set<string>, opts: ValidateOptions) {
  if (!isObj(q)) return c.err(p, 'TYPE', 'question must be an object');
  id(c, q['id'], 'question', `${p}.id`, undefined, seen);
  if (expectLesson && typeof q['id'] === 'string' && lessonIdOf(q['id']) !== expectLesson) c.err(`${p}.id`, 'ID_LESSON_PREFIX', `id must start with ${expectLesson}-Q`);
  const type = q['type'];
  oneOf(c, type, QUESTION_TYPES, `${p}.type`);
  str(c, q, 'prompt', p); str(c, q, 'rationale', p); str(c, q, 'learningOutcome', p);
  oneOf(c, q['cognitiveTag'], ['recall', 'interpretation', 'mistake-risk', 'calculation', 'application'] as const, `${p}.cognitiveTag`);
  if (!isLessonId(q['linkedLessonId'])) c.err(`${p}.linkedLessonId`, 'ID_FORMAT', 'linkedLessonId must be T01..T23');
  else if (expectLesson && q['linkedLessonId'] !== expectLesson) c.err(`${p}.linkedLessonId`, 'LINK', `must equal ${expectLesson}`);
  if (q['fixtureId'] !== undefined) fixtureRef(c, q['fixtureId'], `${p}.fixtureId`, opts);
  if (q['safetyCritical'] === true) oneOf(c, q['safetyTopic'], SAFETY_TOPICS, `${p}.safetyTopic`);

  const choiceIds = new Set<string>();
  if (type !== 'numeric') {
    arr(c, q, 'choices', p, type === 'true-false' ? 2 : 2, type === 'true-false' ? 2 : 8).forEach((ch, i) => {
      const cp = `${p}.choices[${i}]`;
      if (!isObj(ch)) return c.err(cp, 'TYPE', 'choice must be an object');
      if (id(c, ch['id'], 'choice', `${cp}.id`)) {
        if (choiceIds.has(ch['id'] as string)) c.err(`${cp}.id`, 'ID_DUPLICATE', 'duplicate choice id');
        choiceIds.add(ch['id'] as string);
      }
      str(c, ch, 'text', cp);
      if (ch['decision'] !== undefined && !isDecisionWord(ch['decision'])) c.err(`${cp}.decision`, 'DECISION_WORD', 'unknown decision word');
    });
  }
  if (type === 'ordering' && q['shuffleChoices'] === true) { /* shuffling the presented list is the point; allowed */ }
  const a = q['answer'];
  const ap = `${p}.answer`;
  if (!isObj(a)) return c.err(ap, 'TYPE', 'answer must be an object');
  const expectKind = type === 'numeric' ? 'numeric' : type === 'multi' ? 'choices' : type === 'ordering' ? 'order' : 'choice';
  if (a['kind'] !== expectKind) c.err(`${ap}.kind`, 'ANSWER_KIND', `question type ${String(type)} requires answer.kind "${expectKind}"`);
  const correct = new Set<string>();
  const checkRef = (v: unknown, path: string) => {
    if (typeof v !== 'string' || !choiceIds.has(v)) c.err(path, 'ANSWER_REF', `answer references unknown choice ${JSON.stringify(v)}`);
    else correct.add(v);
  };
  if (a['kind'] === 'choice') checkRef(a['choiceId'], `${ap}.choiceId`);
  if (a['kind'] === 'choices' || a['kind'] === 'order') {
    const ids = Array.isArray(a['choiceIds']) ? a['choiceIds'] : [];
    if (ids.length === 0) c.err(`${ap}.choiceIds`, 'COUNT', 'at least one choice id required');
    ids.forEach((v, i) => checkRef(v, `${ap}.choiceIds[${i}]`));
    if (a['kind'] === 'order' && ids.length !== choiceIds.size) c.err(`${ap}.choiceIds`, 'ORDER_COMPLETE', 'ordering answer must list every choice once');
  }
  if (a['kind'] === 'numeric') {
    if (typeof a['value'] !== 'number' || !Number.isFinite(a['value'])) c.err(`${ap}.value`, 'NUMBER', 'finite number required');
    if (typeof a['tolerance'] !== 'number' || !(a['tolerance'] >= 0)) c.err(`${ap}.tolerance`, 'NUMBER', 'tolerance ≥ 0 required');
    str(c, a, 'unit', ap);
    checkTolerance(c, a, ap);
  }
  // Every wrong choice needs misconception feedback (except ordering, where rationale covers it).
  if (type !== 'numeric' && type !== 'ordering') {
    const fb = isObj(q['misconceptionFeedback']) ? q['misconceptionFeedback'] : {};
    for (const cid of choiceIds) {
      if (!correct.has(cid) && !nonEmpty(fb[cid])) c.err(`${p}.misconceptionFeedback.${cid}`, 'DISTRACTOR_FEEDBACK', `explain why choice "${cid}" is wrong`);
    }
  }
}

// ------------------------------------------------------------------ public API

export function validateQuestion(q: unknown, opts: ValidateOptions = {}): ValidationResult<Question> {
  const c = new Ctx();
  validateQuestionInto(c, q, 'question', undefined, new Set(), opts);
  scanStrings(c, q, 'question');
  return c.result<Question>(q);
}

export function validateExercise(x: unknown, opts: ValidateOptions = {}): ValidationResult<Exercise> {
  const c = new Ctx();
  validateExercise_(c, x, opts);
  return c.result<Exercise>(x);
}
function validateExercise_(c: Ctx, x: unknown, opts: ValidateOptions) {
  checkExercise(c, x, 'exercise', undefined, new Set(), opts);
  scanStrings(c, x, 'exercise');
}

export function validateAnimationScene(s: unknown, opts: ValidateOptions = {}): ValidationResult<AnimationScene> {
  const c = new Ctx();
  validateScene(c, s, 'scene', undefined, new Set(), opts);
  scanStrings(c, s, 'scene');
  return c.result<AnimationScene>(s);
}

export function validateLesson(x: unknown, opts: ValidateOptions = {}): ValidationResult<Lesson> {
  const c = new Ctx();
  const P = 'lesson';
  if (!isObj(x)) { c.err(P, 'TYPE', 'lesson must be an object'); return c.result(x); }

  const sv = x['schemaVersion'];
  if (typeof sv !== 'string' || schemaMajorOf(sv) !== SCHEMA_MAJOR) c.err(`${P}.schemaVersion`, 'SCHEMA_VERSION', `schemaVersion must be ${SCHEMA_MAJOR}.x.y`);
  if (typeof x['version'] !== 'string' || !SEMVER_PATTERN.test(x['version'])) c.err(`${P}.version`, 'SEMVER', 'version must be semver MAJOR.MINOR.PATCH');

  const L = isLessonId(x['id']) ? x['id'] : undefined;
  if (!L) { c.err(`${P}.id`, 'ID_FORMAT', 'id must be T01..T23'); }
  if (!isPhaseId(x['phaseId'])) c.err(`${P}.phaseId`, 'ID_FORMAT', 'phaseId must be P1..P5');
  else if (L && phaseOfLesson(L).id !== x['phaseId']) c.err(`${P}.phaseId`, 'PHASE_MISMATCH', `${L} belongs to ${phaseOfLesson(L).id}`);

  for (const k of ['title', 'summary', 'fictionalDataNotice']) str(c, x, k, P);
  arr(c, x, 'objectives', P, 3).forEach((o, i) => { if (!nonEmpty(o)) c.err(`${P}.objectives[${i}]`, 'REQUIRED_TEXT', 'empty objective'); });
  arr(c, x, 'prerequisites', P).forEach((r, i) => {
    if (!isLessonId(r)) c.err(`${P}.prerequisites[${i}]`, 'ID_FORMAT', 'must be T01..T23');
    else if (L && LESSON_IDS.indexOf(r) >= LESSON_IDS.indexOf(L)) c.err(`${P}.prerequisites[${i}]`, 'PREREQ_ORDER', 'prerequisites must be earlier lessons');
  });
  const dm = x['durationMinutes'];
  if (typeof dm !== 'number' || !Number.isFinite(dm) || dm <= 0 || dm > 120) c.err(`${P}.durationMinutes`, 'RANGE', 'durationMinutes must be in (0, 120]');
  oneOf(c, x['difficulty'], ['beginner', 'beginner-plus', 'intermediate'] as const, `${P}.difficulty`);
  oneOf(c, x['notesComplexity'], ['simple', 'complex-risk'] as const, `${P}.notesComplexity`);

  if (!L) { scanStrings(c, x, P); return c.result(x); }

  const seen = new Set<string>();
  const glossarySeen = new Set<string>();
  arr(c, x, 'glossaryEntries', P).forEach((g, i) => validateGlossaryEntry(c, g, `${P}.glossaryEntries[${i}]`, L, glossarySeen));
  arr(c, x, 'slides', P, SLIDES_MIN, SLIDES_MAX).forEach((s, i) => validateSlide(c, s, `${P}.slides[${i}]`, L, seen, opts));

  // Notes
  const notes = arr(c, x, 'notesSections', P, REQUIRED_NOTES_HEADINGS.length);
  const headings = new Set<string>();
  let noteWords = 0;
  notes.forEach((n, i) => {
    const p = `${P}.notesSections[${i}]`;
    if (!isObj(n)) return c.err(p, 'TYPE', 'notes section must be an object');
    id(c, n['id'], 'notesSection', `${p}.id`, L, seen);
    if (oneOf(c, n['heading'], [...REQUIRED_NOTES_HEADINGS, 'learn-more'] as const, `${p}.heading`)) headings.add(n['heading'] as string);
    str(c, n, 'title', p);
    const blocks = validateBlocks(c, n['blocks'], `${p}.blocks`, opts);
    if (n['heading'] !== 'learn-more') try { noteWords += blocks.reduce((a, b) => a + (isObj(b) ? blockWords(b) : 0), 0); } catch { /* reported */ }
  });
  for (const h of REQUIRED_NOTES_HEADINGS) if (!headings.has(h)) c.err(`${P}.notesSections`, 'NOTES_HEADING', `missing required notes heading "${h}"`);
  const target = x['notesComplexity'] === 'complex-risk' ? NOTES_WORDS.complexRisk : NOTES_WORDS.simple;
  const minWords = L === 'T14' ? Math.max(target.min, NOTES_WORDS.referenceT14Min) : target.min;
  if (noteWords < minWords || noteWords > target.max) c.warn(`${P}.notesSections`, 'NOTES_LENGTH', `notes ~${noteWords} words; target ${minWords}–${target.max}`);

  // Animation timeline
  let total = 0;
  arr(c, x, 'animationScenes', P, SCENES_MIN, SCENES_MAX).forEach((s, i) => { total += validateScene(c, s, `${P}.animationScenes[${i}]`, L, seen, opts); });
  if (total > 0 && (total < TIMELINE_TARGET_MS.min || total > TIMELINE_TARGET_MS.max)) {
    c.warn(`${P}.animationScenes`, 'TIMELINE_LENGTH', `timeline ${Math.round(total / 1000)}s; target ${TIMELINE_TARGET_MS.min / 1000}–${TIMELINE_TARGET_MS.max / 1000}s`);
  }

  arr(c, x, 'exercises', P, 1).forEach((e, i) => checkExercise(c, e, `${P}.exercises[${i}]`, L, seen, opts));

  // Formulas (v1.1.0, optional)
  const formulaIds = new Set<string>();
  if (x['formulas'] !== undefined) {
    arr(c, x, 'formulas', P).forEach((f, i) => {
      const fp = `${P}.formulas[${i}]`;
      if (!isObj(f)) return c.err(fp, 'TYPE', 'formula must be an object');
      if (id(c, f['id'], 'formula', `${fp}.id`, L, seen)) formulaIds.add(f['id'] as string);
      str(c, f, 'name', fp); str(c, f, 'expression', fp);
      if (!isSimulatorId(f['simulatorId'])) c.err(`${fp}.simulatorId`, 'SIMULATOR_ID', `unknown simulator ${JSON.stringify(f['simulatorId'])}`);
      if (typeof f['approximate'] !== 'boolean') c.err(`${fp}.approximate`, 'BOOLEAN', 'boolean required');
      if (f['simulatorId'] === 'liquidation.approx' && f['approximate'] !== true) c.err(`${fp}.approximate`, 'LIQUIDATION_APPROXIMATE', 'liquidation formulas must set approximate: true');
      arr(c, f, 'variables', fp, 1).forEach((v, j) => {
        if (!isObj(v)) return c.err(`${fp}.variables[${j}]`, 'TYPE', 'must be an object');
        for (const k of ['symbol', 'meaning', 'unit']) str(c, v, k, `${fp}.variables[${j}]`);
      });
      arr(c, f, 'workedExamples', fp, 1).forEach((w, j) => {
        const wp = `${fp}.workedExamples[${j}]`;
        if (!isObj(w)) return c.err(wp, 'TYPE', 'must be an object');
        str(c, w, 'label', wp);
        for (const k of ['inputs', 'outputs']) {
          const o = w[k];
          if (!isObj(o) || Object.keys(o).length === 0 || !Object.values(o).every((n) => typeof n === 'number' && Number.isFinite(n))) c.err(`${wp}.${k}`, 'NUMBER_MAP', `${k} must be a non-empty map of finite numbers`);
        }
        if (typeof w['tolerance'] !== 'number' || !(w['tolerance'] >= 0)) c.err(`${wp}.tolerance`, 'NUMBER', 'tolerance ≥ 0 required');
        arr(c, w, 'assumptions', wp);
        if (w['side'] !== undefined) oneOf(c, w['side'], ['long', 'short'] as const, `${wp}.side`);
      });
    });
  }

  const qs = arr(c, x, 'quizQuestions', P, LESSON_QUESTIONS_MIN, LESSON_QUESTIONS_MAX);
  qs.forEach((q, i) => validateQuestionInto(c, q, `${P}.quizQuestions[${i}]`, L, seen, opts));
  const tags = new Set(qs.map((q) => (isObj(q) ? q['cognitiveTag'] : undefined)));
  if (!tags.has('interpretation')) c.err(`${P}.quizQuestions`, 'QUIZ_MIX', 'needs at least one "interpretation" question');
  if (!tags.has('mistake-risk')) c.err(`${P}.quizQuestions`, 'QUIZ_MIX', 'needs at least one "mistake-risk" question');

  arr(c, x, 'commonMistakes', P, 1).forEach((m, i) => {
    if (!isObj(m)) return c.err(`${P}.commonMistakes[${i}]`, 'TYPE', 'must be an object');
    str(c, m, 'mistake', `${P}.commonMistakes[${i}]`); str(c, m, 'correction', `${P}.commonMistakes[${i}]`);
  });
  const tk = arr(c, x, 'takeaways', P, 3);
  if (tk.length > 3) c.warn(`${P}.takeaways`, 'TAKEAWAYS', 'three-point takeaway recommended');

  const rc = x['reviewCard'];
  if (!isObj(rc)) c.err(`${P}.reviewCard`, 'TYPE', 'reviewCard required');
  else {
    const kt = arr(c, rc, 'keyTermIds', `${P}.reviewCard`, 1);
    kt.forEach((k, i) => id(c, k, 'glossaryTerm', `${P}.reviewCard.keyTermIds[${i}]`));
    if (kt.length !== 3) c.warn(`${P}.reviewCard.keyTermIds`, 'KEY_TERMS', 'review card should show exactly 3 key terms');
    str(c, rc, 'safetyNote', `${P}.reviewCard`); str(c, rc, 'retrievalQuestion', `${P}.reviewCard`);
    if (typeof rc['reviewMinutes'] !== 'number' || !(rc['reviewMinutes'] > 0)) c.err(`${P}.reviewCard.reviewMinutes`, 'NUMBER', 'positive number required');
  }
  const cr = x['completionRequirements'];
  if (!isObj(cr)) c.err(`${P}.completionRequirements`, 'TYPE', 'completionRequirements required');
  else {
    const s = cr['minQuizScore'];
    if (typeof s !== 'number' || s < 0 || s > 1) c.err(`${P}.completionRequirements.minQuizScore`, 'RANGE', 'must be 0..1');
    for (const k of ['requireAllSlidesViewed', 'requireAnimationCompleted', 'requireSafetyCriticalCorrect']) {
      if (typeof cr[k] !== 'boolean') c.err(`${P}.completionRequirements.${k}`, 'BOOLEAN', 'boolean required');
    }
    const exIds = new Set((Array.isArray(x['exercises']) ? x['exercises'] : []).map((e) => (isObj(e) ? e['id'] : undefined)));
    arr(c, cr, 'requireExerciseIds', `${P}.completionRequirements`).forEach((e, i) => {
      if (!exIds.has(e as string)) c.err(`${P}.completionRequirements.requireExerciseIds[${i}]`, 'REF', `unknown exercise ${String(e)}`);
    });
  }

  // Cross-reference: scene-embed / visualRef scene ids must exist in this lesson's timeline
  const sceneIds = new Set((Array.isArray(x['animationScenes']) ? x['animationScenes'] : []).map((s) => (isObj(s) ? s['id'] : undefined)));
  const walkRefs = (v: unknown, p: string): void => {
    if (Array.isArray(v)) v.forEach((y, i) => walkRefs(y, `${p}[${i}]`));
    else if (isObj(v)) {
      if ((v['kind'] === 'scene-embed' || v['kind'] === 'scene') && typeof v['sceneId'] === 'string' && !sceneIds.has(v['sceneId'])) {
        c.err(`${p}.sceneId`, 'REF', `scene ${v['sceneId']} not in this lesson's animationScenes`);
      }
      for (const [k, y] of Object.entries(v)) walkRefs(y, `${p}.${k}`);
    }
  };
  walkRefs(x['slides'], `${P}.slides`); walkRefs(x['notesSections'], `${P}.notesSections`);

  // formula blocks citing formulaId must point to this lesson's formulas
  const walkFormula = (v: unknown, p: string): void => {
    if (Array.isArray(v)) v.forEach((y, i) => walkFormula(y, `${p}[${i}]`));
    else if (isObj(v)) {
      if (v['kind'] === 'formula' && v['formulaId'] !== undefined && !formulaIds.has(v['formulaId'] as string)) c.err(`${p}.formulaId`, 'REF', `formula ${String(v['formulaId'])} not in this lesson's formulas`);
      for (const [k, y] of Object.entries(v)) walkFormula(y, `${p}.${k}`);
    }
  };
  walkFormula(x['slides'], `${P}.slides`); walkFormula(x['notesSections'], `${P}.notesSections`);

  // Glossary references (v1.1.0): aliases are errors; references to unregistered, undefined terms are warnings here
  // (course-level validation decides resolution).
  try {
    const own = new Set((Array.isArray(x['glossaryEntries']) ? x['glossaryEntries'] : []).map((g) => (isObj(g) ? g['id'] : undefined)));
    for (const t of collectGlossaryRefs(x as unknown as Lesson)) {
      if (own.has(t)) continue;
      if (GLOSSARY_ALIASES[t]) c.err(`${P}`, 'GLOSSARY_ALIAS', `reference "${t}" is an alias; use "${GLOSSARY_ALIASES[t]}"`);
      else if (!glossaryOwnerOf(t)) c.warn(`${P}`, 'GLOSSARY_UNKNOWN_REF', `reference "${t}" is neither defined here nor registered in GLOSSARY_TERM_OWNERS`);
    }
  } catch { /* shape errors already reported */ }

  scanStrings(c, x, P);
  return c.result<Lesson>(x);
}

export function isLesson(x: unknown, opts?: ValidateOptions): x is Lesson {
  return validateLesson(x, opts).ok;
}

/** Glossary term ids referenced anywhere in a lesson (inline [[links]], glossaryRefs, definition blocks, keyTermIds). */
export function collectGlossaryRefs(lesson: Lesson): Set<string> {
  const out = new Set<string>();
  const walk = (v: unknown): void => {
    if (typeof v === 'string') extractGlossaryLinks(v).forEach((t) => out.add(t));
    else if (Array.isArray(v)) v.forEach(walk);
    else if (isObj(v)) {
      if (v['kind'] === 'definition' && typeof v['termId'] === 'string') out.add(v['termId']);
      for (const [k, y] of Object.entries(v)) {
        if ((k === 'glossaryRefs' || k === 'keyTermIds' || k === 'relatedTermIds') && Array.isArray(y)) y.forEach((t) => typeof t === 'string' && out.add(t));
        else walk(y);
      }
    }
  };
  walk(lesson);
  return out;
}

export function validateCheckpoint(x: unknown, opts: ValidateOptions = {}): ValidationResult<CheckpointConfig> {
  const c = new Ctx();
  const P = 'checkpoint';
  if (!isObj(x)) { c.err(P, 'TYPE', 'checkpoint must be an object'); return c.result(x); }
  if (!isValidId('checkpoint', x['id'])) c.err(`${P}.id`, 'ID_FORMAT', 'id must be CP1 | CPA | CPB');
  str(c, x, 'title', P); str(c, x, 'disclaimer', P);
  if (!isLessonId(x['afterLessonId'])) c.err(`${P}.afterLessonId`, 'ID_FORMAT', 'must be a lesson id');
  arr(c, x, 'coversLessonIds', P, 1).forEach((l, i) => { if (!isLessonId(l)) c.err(`${P}.coversLessonIds[${i}]`, 'ID_FORMAT', 'must be a lesson id'); });
  arr(c, x, 'questionIds', P).forEach((q, i) => id(c, q, 'question', `${P}.questionIds[${i}]`));
  const seen = new Set<string>();
  arr(c, x, 'items', P).forEach((q, i) => {
    validateQuestionInto(c, q, `${P}.items[${i}]`, undefined, seen, opts);
    if (isObj(q) && typeof q['id'] === 'string' && !q['id'].startsWith(`${String(x['id'])}-Q`)) c.err(`${P}.items[${i}].id`, 'ID_PREFIX', `checkpoint items must be ${String(x['id'])}-Qnn`);
  });
  const t = x['passThreshold'];
  if (typeof t !== 'number' || t < 0 || t > 1) c.err(`${P}.passThreshold`, 'RANGE', 'must be 0..1');
  for (const k of ['safetyCriticalMustBeCorrect', 'gating']) if (typeof x[k] !== 'boolean') c.err(`${P}.${k}`, 'BOOLEAN', 'boolean required');
  if (typeof x['version'] !== 'string' || !SEMVER_PATTERN.test(x['version'])) c.err(`${P}.version`, 'SEMVER', 'semver required');
  const qc = x['questionCount'];
  if (!isObj(qc) || typeof qc['min'] !== 'number' || typeof qc['max'] !== 'number') c.err(`${P}.questionCount`, 'TYPE', '{min,max} required');
  else {
    const n = (Array.isArray(x['questionIds']) ? x['questionIds'].length : 0) + (Array.isArray(x['items']) ? x['items'].length : 0);
    if (n < qc['min'] || n > qc['max']) c.err(`${P}.questionCount`, 'COUNT', `has ${n} questions; expected ${qc['min']}–${qc['max']}`);
  }
  scanStrings(c, x, P);
  return c.result<CheckpointConfig>(x);
}

export function validateProgress(x: unknown): ValidationResult<Progress> {
  const c = new Ctx();
  const P = 'progress';
  if (!isObj(x)) { c.err(P, 'TYPE', 'progress must be an object'); return c.result(x); }
  if (x['progressSchemaVersion'] !== PROGRESS_SCHEMA_VERSION) c.err(`${P}.progressSchemaVersion`, 'SCHEMA_VERSION', `must be ${PROGRESS_SCHEMA_VERSION}`);
  str(c, x, 'userId', P);
  if (!isLessonId(x['lessonId'])) c.err(`${P}.lessonId`, 'ID_FORMAT', 'must be T01..T23');
  if (typeof x['contentVersion'] !== 'string' || !SEMVER_PATTERN.test(x['contentVersion'])) c.err(`${P}.contentVersion`, 'SEMVER', 'semver required');
  if (typeof x['completed'] !== 'boolean') c.err(`${P}.completed`, 'BOOLEAN', 'boolean required');
  if (x['educationOnly'] !== true) c.err(`${P}.educationOnly`, 'EDUCATION_ONLY', 'must be literally true');
  const ts = x['lastUpdatedAt'];
  if (typeof ts !== 'string' || Number.isNaN(Date.parse(ts))) c.err(`${P}.lastUpdatedAt`, 'TIMESTAMP', 'ISO-8601 timestamp required');
  if (!isObj(x['viewed']) || !isObj(x['practiced']) || !isObj(x['assessed'])) c.err(P, 'SHAPE', 'viewed, practiced and assessed objects are required');
  else {
    const s = x['assessed']['bestScore'];
    if (s !== null && (typeof s !== 'number' || s < 0 || s > 1)) c.err(`${P}.assessed.bestScore`, 'RANGE', 'null or 0..1');
    if (x['completed'] === true && s === null) c.err(`${P}.completed`, 'COMPLETION_WITHOUT_ASSESSMENT', 'cannot be completed without an assessment score');
  }
  return c.result<Progress>(x);
}

export interface CourseValidateOptions extends ValidateOptions {
  /**
   * v1.1.0: validate a SUBSET of the course (staging, one phase). Lessons not present become warnings
   * (LESSON_NOT_PRESENT), and references to registered terms whose owner lesson is not present become warnings
   * (GLOSSARY_PENDING_OWNER) instead of errors. Integration (EDGE-10/11) must run with partial = false.
   */
  partial?: boolean;
}

export interface CourseGlossary {
  /** term id → entry, sorted by term label. */
  entries: GlossaryEntry[];
  byId: ReadonlyMap<string, GlossaryEntry>;
  /** Registered terms whose owner lesson is not loaded yet. */
  pending: Array<{ termId: string; owner: LessonId }>;
}

/** Build the single course-wide glossary index from the owning lessons (used by EDGE-01's glossary UI). */
export function buildCourseGlossary(lessons: Lesson[]): CourseGlossary {
  const byId = new Map<string, GlossaryEntry>();
  for (const l of lessons) for (const g of l.glossaryEntries) if (!byId.has(g.id)) byId.set(g.id, g);
  const present = new Set(lessons.map((l) => l.id));
  const pending: Array<{ termId: string; owner: LessonId }> = [];
  for (const l of lessons) for (const t of collectGlossaryRefs(l)) {
    const owner = glossaryOwnerOf(t);
    if (!byId.has(t) && owner && !present.has(owner) && !pending.some((p) => p.termId === t)) pending.push({ termId: t, owner });
  }
  const entries = [...byId.values()].sort((a, b) => a.term.localeCompare(b.term));
  return { entries, byId, pending };
}

/** Course-level checks across all lessons (+ optional checkpoints). Use in CI once all content exists. */
export function validateCourse(lessons: unknown[], checkpoints: unknown[] = [], opts: CourseValidateOptions = {}): ValidationResult<Lesson[]> {
  const c = new Ctx();
  const ok: Lesson[] = [];
  lessons.forEach((l, i) => {
    const r = validateLesson(l, opts);
    const tag = isObj(l) && typeof l['id'] === 'string' ? l['id'] : `#${i}`;
    if (r.ok) ok.push(r.value);
    else r.errors.forEach((e) => c.errors.push({ ...e, path: `[${tag}]${e.path}` }));
    r.warnings.forEach((w) => c.warnings.push({ ...w, path: `[${tag}]${w.path}` }));
  });
  const byId = new Map<string, Lesson>();
  for (const l of ok) { if (byId.has(l.id)) c.err(`[${l.id}]`, 'LESSON_DUPLICATE', `lesson ${l.id} appears twice`); byId.set(l.id, l); }
  const presentIds = new Set(lessons.map((l) => (isObj(l) ? l['id'] : undefined)));
  for (const lid of LESSON_IDS) {
    if (byId.has(lid)) continue;
    if (opts.partial && !presentIds.has(lid)) c.warn('course', 'LESSON_NOT_PRESENT', `lesson ${lid} not in this partial set`);
    else c.err('course', 'LESSON_MISSING', `lesson ${lid} missing or invalid`);
  }
  // Glossary uniqueness + resolution
  const glossary = new Map<string, GlossaryEntry>();
  for (const l of ok) for (const g of l.glossaryEntries) {
    if (glossary.has(g.id)) c.err(`[${l.id}].glossaryEntries`, 'GLOSSARY_DUPLICATE', `term ${g.id} also introduced in ${glossary.get(g.id)?.introducedIn}`);
    glossary.set(g.id, g);
  }
  for (const l of ok) for (const t of collectGlossaryRefs(l)) {
    if (glossary.has(t)) continue;
    const owner = glossaryOwnerOf(t);
    if (opts.partial && owner && !byId.has(owner)) c.warn(`[${l.id}]`, 'GLOSSARY_PENDING_OWNER', `glossary term "${t}" will be defined by ${owner} (not in this partial set)`);
    else c.err(`[${l.id}]`, 'GLOSSARY_UNRESOLVED', `glossary term "${t}" is referenced but never defined${owner ? ` (owner ${owner})` : ''}`);
  }
  // Question id uniqueness and checkpoint references
  const qIds = new Set<string>();
  for (const l of ok) for (const q of l.quizQuestions) qIds.add(q.id);
  checkpoints.forEach((cp, i) => {
    const r = validateCheckpoint(cp, opts);
    if (!r.ok) r.errors.forEach((e) => c.errors.push({ ...e, path: `[checkpoint#${i}]${e.path}` }));
    if (r.ok) for (const q of r.value.questionIds) if (!qIds.has(q)) {
      const owner = lessonIdOf(q);
      if (opts.partial && owner && !byId.has(owner)) c.warn(`[${r.value.id}].questionIds`, 'REF_PENDING', `question ${q} belongs to ${owner} (not present)`);
      else c.err(`[${r.value.id}].questionIds`, 'REF', `question ${q} not found in lessons`);
    }
  });
  // Phase map self-consistency
  const mapped = PHASES.flatMap((p) => p.tutorialIds);
  if (mapped.length !== LESSON_IDS.length || new Set(mapped).size !== LESSON_IDS.length) c.err('phases', 'PHASE_MAP', 'PHASES must map T01..T23 exactly once');
  return c.errors.length === 0 ? { ok: true, value: ok, warnings: c.warnings } : { ok: false, errors: c.errors, warnings: c.warnings };
}

// ---------------------------------------------------------------- fixtures (v1.3.0, D-43)

const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
const posNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;

function checkTimes(c: Ctx, items: unknown[], p: string, key: string): void {
  let mode: 'ms' | 'iso' | undefined;
  let prev = -Infinity;
  items.forEach((it, i) => {
    if (!isObj(it)) return;
    const t = it['t'];
    const tp = `${p}.${key}[${i}].t`;
    let ms: number;
    if (typeof t === 'number') {
      if (!Number.isInteger(t) || t < 0) { c.err(tp, 'FIXTURE_TIME', 't (number) must be an integer ms offset ≥ 0'); return; }
      if (mode === 'iso') { c.err(tp, 'FIXTURE_TIME_MIXED', 'do not mix ms offsets and ISO strings in one series'); return; }
      mode = 'ms'; ms = t;
    } else if (typeof t === 'string') {
      if (!ISO_DATETIME.test(t) || Number.isNaN(Date.parse(t))) { c.err(tp, 'FIXTURE_TIME', 't (string) must be an ISO-8601 date-time'); return; }
      if (mode === 'ms') { c.err(tp, 'FIXTURE_TIME_MIXED', 'do not mix ms offsets and ISO strings in one series'); return; }
      mode = 'iso'; ms = Date.parse(t);
    } else { c.err(tp, 'FIXTURE_TIME', 't must be a ms offset (number) or ISO-8601 string'); return; }
    if (ms <= prev) c.err(tp, 'FIXTURE_TIME_ORDER', 't must strictly increase');
    prev = ms;
  });
}

function checkCandle(c: Ctx, k: unknown, p: string): void {
  if (!isObj(k)) { c.err(p, 'TYPE', 'candle must be an object'); return; }
  const [o, h, l, cl] = [k['o'], k['h'], k['l'], k['c']];
  let ok = true;
  for (const [name, v] of [['o', o], ['h', h], ['l', l], ['c', cl]] as const) {
    if (!posNum(v)) { c.err(`${p}.${name}`, 'NUMBER', `${name} must be a finite number > 0`); ok = false; }
  }
  if (k['v'] !== undefined && !(typeof k['v'] === 'number' && Number.isFinite(k['v']) && k['v'] >= 0)) c.err(`${p}.v`, 'NUMBER', 'v must be a finite number ≥ 0');
  if (ok && ((h as number) < Math.max(o as number, cl as number) || (l as number) > Math.min(o as number, cl as number))) {
    c.err(p, 'INCONSISTENT_OHLC', 'needs h ≥ max(o, c) and l ≤ min(o, c)');
  }
}

/**
 * Validates a Fixture: common fields for every kind, plus the standard data shape for 'ohlc-series' and 'price-path'
 * (fixture-shapes.ts). Never throws. Extra data keys are allowed.
 */
export function validateFixture(x: unknown): ValidationResult<Fixture> {
  const c = new Ctx();
  const p = 'fixture';
  if (!isObj(x)) { c.err(p, 'TYPE', 'fixture must be an object'); return c.result<Fixture>(x); }
  id(c, x['id'], 'fixture', `${p}.id`);
  const kindOk = oneOf(c, x['kind'], FIXTURE_KINDS, `${p}.kind`);
  if (x['fictional'] !== true) c.err(`${p}.fictional`, 'FICTIONAL', 'fictional must be true');
  str(c, x, 'label', p);
  if (typeof x['version'] !== 'string' || !SEMVER_PATTERN.test(x['version'])) c.err(`${p}.version`, 'SEMVER', 'version must be semver');
  const d = x['data'];
  const dp = `${p}.data`;
  if (kindOk && (x['kind'] === 'ohlc-series' || x['kind'] === 'price-path')) {
    if (!isObj(d)) { c.err(dp, 'TYPE', 'data must be an object'); return c.result<Fixture>(x); }
    if (d['label'] !== 'fictional') c.err(`${dp}.label`, 'FICTIONAL', "data.label must be 'fictional'");
    const iv = d['interval'];
    if (x['kind'] === 'ohlc-series' || iv !== undefined) {
      if (typeof iv !== 'string' || !FIXTURE_INTERVAL_PATTERN.test(iv)) c.err(`${dp}.interval`, 'FIXTURE_INTERVAL', "interval like '1m', '5m', '15s' required");
    }
    if (d['timeframe'] !== undefined) c.warn(`${dp}.timeframe`, 'FIXTURE_LEGACY_KEY', "use 'interval' (standard shape, D-43)");
    if (x['kind'] === 'ohlc-series') {
      const candles = arr(c, d, 'candles', dp, 1);
      candles.forEach((k, i) => checkCandle(c, k, `${dp}.candles[${i}]`));
      checkTimes(c, candles, dp, 'candles');
      // Guard against legacy minute-index t (0, 1, 2…) being read as ms: candles closer than one interval are suspicious.
      const unit = typeof iv === 'string' && FIXTURE_INTERVAL_PATTERN.test(iv) ? ({ s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const)[iv.slice(-1) as 's' | 'm' | 'h' | 'd'] * parseInt(iv, 10) : 0;
      const ts = candles.map((k) => (isObj(k) && typeof k['t'] === 'number' ? k['t'] : undefined));
      if (unit > 0 && ts.every((t): t is number => t !== undefined)) {
        for (let i = 1; i < ts.length; i++) {
          const gap = (ts[i] ?? 0) - (ts[i - 1] ?? 0);
          if (gap > 0 && gap < unit) { c.warn(`${dp}.candles[${i}].t`, 'FIXTURE_TIME_GAP', `t gap ${gap} ms < one ${iv} interval (${unit} ms): t is a ms offset, not a minute index`); break; }
        }
      }
      if (d['labels'] !== undefined) {
        const labels = d['labels'];
        if (!Array.isArray(labels) || labels.length !== candles.length || !labels.every(nonEmpty)) c.err(`${dp}.labels`, 'COUNT', 'labels must be non-empty strings, one per candle');
      }
    } else {
      const ticks = arr(c, d, 'ticks', dp, 2);
      ticks.forEach((tk, i) => {
        if (!isObj(tk) || !posNum(tk['p'])) c.err(`${dp}.ticks[${i}].p`, 'NUMBER', 'p must be a finite number > 0');
        if (isObj(tk) && tk['mark'] !== undefined && !posNum(tk['mark'])) c.err(`${dp}.ticks[${i}].mark`, 'NUMBER', 'mark must be a finite number > 0');
      });
      checkTimes(c, ticks, dp, 'ticks');
      const fc = d['finalCandle'];
      if (fc !== undefined) {
        checkCandle(c, fc, `${dp}.finalCandle`);
        const ps = ticks.map((tk) => (isObj(tk) ? tk['p'] : NaN)).filter(posNum);
        if (isObj(fc) && ps.length === ticks.length && ps.length >= 2) {
          const exp = { o: ps[0], h: Math.max(...ps), l: Math.min(...ps), c: ps[ps.length - 1] };
          for (const k of ['o', 'h', 'l', 'c'] as const) {
            if (fc[k] !== exp[k]) c.err(`${dp}.finalCandle.${k}`, 'FIXTURE_FINAL_CANDLE', `${k} must equal ${exp[k]} (first/max/min/last tick)`);
          }
        }
      }
    }
  }
  scanStrings(c, x, p);
  return c.result<Fixture>(x);
}

/** Checks an `ohlc.anatomy` result against its inputs (D-41). For EDGE-08 tests and content golden tests. */
export function validateOhlcAnatomyResult(
  input: { o: number; h: number; l: number; c: number }, result: unknown, eps = 1e-9,
): ValidationResult<OhlcAnatomyResult> {
  const c = new Ctx();
  const p = 'ohlcAnatomy';
  if (!isObj(result)) { c.err(p, 'TYPE', 'result must be an object'); return c.result<OhlcAnatomyResult>(result); }
  const { o, h, l, c: cl } = input;
  const exp: Record<string, number> = { body: Math.abs(cl - o), upperWick: h - Math.max(o, cl), lowerWick: Math.min(o, cl) - l, range: h - l };
  for (const [k, v] of Object.entries(exp)) {
    const got = result[k];
    if (typeof got !== 'number' || Math.abs(got - v) > eps) c.err(`${p}.${k}`, 'ANATOMY_MISMATCH', `${k} must be ${v} (got ${String(got)})`);
  }
  const th = result['dojiThreshold'];
  if (!isObj(th) || typeof th['bodyToRangeMax'] !== 'number' || !(th['bodyToRangeMax'] >= 0) || th['bodyToRangeMax'] >= 1) {
    c.err(`${p}.dojiThreshold.bodyToRangeMax`, 'DOJI_THRESHOLD', 'declared bodyToRangeMax in [0, 1) required');
  } else if (oneOf(c, result['direction'], CANDLE_DIRECTIONS, `${p}.direction`)) {
    const range = exp['range'] ?? 0;
    const body = exp['body'] ?? 0;
    const want = range === 0 || body <= th['bodyToRangeMax'] * range + eps ? 'doji' : cl > o ? 'bullish' : 'bearish';
    if (result['direction'] !== want) c.err(`${p}.direction`, 'ANATOMY_MISMATCH', `direction must be ${want}`);
  }
  return c.result<OhlcAnatomyResult>(result);
}
