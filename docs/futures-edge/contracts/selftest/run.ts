/** Contract self-test. Run from repo root: npx -y tsx docs/futures-edge/contracts/selftest/run.ts  (exit code 0 = all checks passed) */
// Minimal ambient declarations so the self-test typechecks without @types/node.
declare const console: { log(...args: unknown[]): void };
declare const process: { exit(code: number): never };

import {
  validateLesson, validateProgress, validateQuestion, validateCourse, emptyProgress, parseFeatureFlag,
  FEATURE_FLAG_DEFAULT, ID_PATTERNS, PHASES, LESSON_IDS, l10nKey, L10N_KEY_PATTERN, lessonIdFromSlug,
  defaultMigrationPolicy, SCENE_TYPES, EXERCISE_TYPES, SCHEMA_VERSION, FORBIDDEN_MARKUP_PATTERN,
  GLOSSARY_TERM_OWNERS, GLOSSARY_ALIASES, SCENE_VARIANTS, SCENE_DEFAULT_VARIANTS, FIXTURE_KINDS, validateAnimationScene, SIMULATOR_KEYS, MODEL_KIND_SIMULATORS, validateFixture, validateOhlcAnatomyResult, phaseOfLesson, buildCourseGlossary, validateExercise, DECISION_WORDS,
  ABSTAIN_DECISIONS, SIMULATOR_IDS,
} from '../../../../src/features/futures-edge/contracts/index';
import { sampleLesson } from './sample-lesson';

let failed = 0, passed = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) { passed++; console.log(`  ok   ${name}`); }
  else { failed++; console.log(`  FAIL ${name}`, detail ?? ''); }
}
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

const r = validateLesson(sampleLesson);
check('sample lesson validates', r.ok, r.ok ? undefined : r.errors);
if (r.ok && r.warnings.length) console.log('  (warnings)', r.warnings.map((w) => w.code).join(', '));

const bad1 = clone(sampleLesson) as any; bad1.slides = bad1.slides.slice(0, 3);
check('rejects < 5 slides', !validateLesson(bad1).ok);
const bad2 = clone(sampleLesson) as any; bad2.summary = 'TODO write summary';
check('rejects placeholder text', !validateLesson(bad2).ok);
const bad3 = clone(sampleLesson) as any; bad3.slides[0].blocks[0].text = 'hi <script>alert(1)</script>';
check('rejects HTML markup', !validateLesson(bad3).ok);
const bad4 = clone(sampleLesson) as any; bad4.animationScenes[0].type = 'confetti';
check('rejects unknown scene type', !validateLesson(bad4).ok);
const bad5 = clone(sampleLesson) as any; delete bad5.quizQuestions[0].misconceptionFeedback;
check('rejects missing distractor feedback', !validateLesson(bad5).ok);
const bad6 = clone(sampleLesson) as any; bad6.phaseId = 'P1';
check('rejects wrong phase for lesson', !validateLesson(bad6).ok);
const bad7 = clone(sampleLesson) as any; bad7.exercises[0].allowedControls = ['drag'];
check('rejects drag-only / no-reset exercise', !validateLesson(bad7).ok);
const bad8 = clone(sampleLesson) as any; bad8.quizQuestions[1].safetyTopic = undefined; delete bad8.quizQuestions[1].safetyTopic;
check('rejects safetyCritical without safetyTopic', !validateLesson(bad8).ok);
const bad9 = clone(sampleLesson) as any; bad9.id = 'T24';
check('rejects T24 (out of scope)', !validateLesson(bad9).ok);
check('validateLesson never throws on garbage', [null, 1, 'x', [], { id: 'T14' }].every((g) => validateLesson(g).ok === false));

check('question validator standalone', validateQuestion(sampleLesson.quizQuestions[0]).ok);

const p = emptyProgress('local-anonymous', 'T14', '0.1.0', '2026-10-19T01:40:00Z');
check('empty progress validates', validateProgress(p).ok);
check('rejects completed without score', !validateProgress({ ...p, completed: true }).ok);
check('migration keep same major', defaultMigrationPolicy('1.2.0', '1.3.1') === 'keep');
check('migration reset on major', defaultMigrationPolicy('1.2.0', '2.0.0') === 'reset-assessment');

check('feature flag default off', FEATURE_FLAG_DEFAULT === false && parseFeatureFlag(undefined) === false && parseFeatureFlag('1') === false && parseFeatureFlag('true') === true);
check('id patterns', ID_PATTERNS.slide.test('T14-S03') && !ID_PATTERNS.slide.test('T24-S03') && !ID_PATTERNS.slide.test('T14-S00') && ID_PATTERNS.checkpointQuestion.test('CPA-Q17'));
check('phases map 23 lessons once', PHASES.flatMap((x) => x.tutorialIds).length === 23 && LESSON_IDS.length === 23);
check('l10n key convention', L10N_KEY_PATTERN.test(l10nKey('T14', 'T14-S03', 'title')));
check('slug roundtrip', lessonIdFromSlug('t14') === 'T14' && lessonIdFromSlug('t24') === undefined);
check('registries non-empty', SCENE_TYPES.length === 25 && EXERCISE_TYPES.length === 15);

const course = validateCourse([sampleLesson]);
check('course validator reports 22 missing lessons', !course.ok && course.errors.filter((e) => e.code === 'LESSON_MISSING').length === 22);

// ---------------- v1.1.0 additions
check('schema version 1.3.0', SCHEMA_VERSION === '1.3.0');
check('lesson declaring schemaVersion 1.0.0 still validates (backward compatible)', validateLesson({ ...clone(sampleLesson), schemaVersion: '1.0.0' }).ok);
check('markup: "Notional = 500" allowed', !FORBIDDEN_MARKUP_PATTERN.test('Notional = 500 USDT; Position = long; one = 1'));
check('markup: onclick= still rejected', FORBIDDEN_MARKUP_PATTERN.test('x onclick=alert(1)') && FORBIDDEN_MARKUP_PATTERN.test('<img src=x>'));
const ownerPhaseOk = Object.values(GLOSSARY_TERM_OWNERS).every((l) => !!phaseOfLesson(l));
check('owner map: every owner is a valid lesson', ownerPhaseOk);
check('owner map: no alias is itself a registered term', Object.keys(GLOSSARY_ALIASES).every((a) => !(a in GLOSSARY_TERM_OWNERS)));
check('owner map: funding-rate→T11, mark-price→T06 (D-35), last-price→T10', GLOSSARY_TERM_OWNERS['funding-rate'] === 'T11' && GLOSSARY_TERM_OWNERS['mark-price'] === 'T06' && GLOSSARY_TERM_OWNERS['last-price'] === 'T10');
const b10 = clone(sampleLesson) as any; b10.glossaryEntries.push({ id: 'leverage', term: 'Leverage', plainDefinition: 'x', technicalMeaning: 'x', example: 'x', relatedTermIds: [], introducedIn: 'T14' });
check('rejects defining a term owned by another lesson', !validateLesson(b10).ok);
const b11 = clone(sampleLesson) as any; b11.slides[0].blocks[0].text = 'See [[approx-liquidation]].';
check('rejects alias glossary reference', !validateLesson(b11).ok);
const pc = validateCourse([(() => { const l = clone(sampleLesson) as any; l.slides[0].blocks[0].text = 'See [[trading-pair]].'; return l; })()], [], { partial: true });
check('partial course: pending owner + missing lessons are warnings', pc.ok && pc.warnings.some((w) => w.code === 'GLOSSARY_PENDING_OWNER') && pc.warnings.some((w) => w.code === 'LESSON_NOT_PRESENT'));
const full = validateCourse([(() => { const l = clone(sampleLesson) as any; l.slides[0].blocks[0].text = 'See [[trading-pair]].'; return l; })()]);
check('full course: pending owner is an error', !full.ok && full.errors.some((e) => e.code === 'GLOSSARY_UNRESOLVED'));
check('buildCourseGlossary merges + reports pending', (() => { const g = buildCourseGlossary([sampleLesson]); return g.byId.has('candlestick') && g.entries.length === 1; })());
// scene variants
const b12 = clone(sampleLesson) as any; b12.animationScenes[0] = { ...b12.animationScenes[0], type: 'margin-buffer', parameters: { variant: 'tier-comparison' } };
check('accepts registered scene variant', validateLesson(b12).ok);
b12.animationScenes[0].parameters = { variant: 'sparkles' };
check('rejects unregistered variant on listed type', !validateLesson(b12).ok);
b12.animationScenes[0].parameters = { mode: 'tier-comparison' };
const r12 = validateLesson(b12);
check('mode alias accepted with DEPRECATED_MODE warning', r12.ok && r12.warnings.some((w) => w.code === 'DEPRECATED_MODE'));
// exercise choices + numeric-set + decisions + simulators
const ex = clone(sampleLesson.exercises[0]) as any;
const cf = { ...ex, type: 'choice-feedback', simulatorId: undefined, choices: [{ id: 'a', text: 'A' }, { id: 'wait', text: 'Wait', decision: 'WAIT' }], expectedEvaluation: { kind: 'exact-choice', choiceId: 'wait' } };
delete cf.simulatorId;
check('choice-feedback with top-level choices validates', validateExercise(cf).ok);
check('choice-feedback answer must reference a choice', !validateExercise({ ...cf, expectedEvaluation: { kind: 'exact-choice', choiceId: 'zzz' } }).ok);
const legacy = { ...cf, choices: undefined, parameters: { choices: cf.choices } }; delete legacy.choices;
const rl = validateExercise(legacy);
check('parameters.choices accepted with deprecation warning', rl.ok && rl.warnings.some((w) => w.code === 'DEPRECATED_PARAM_CHOICES'));
check('choice-feedback without choices rejected', !validateExercise({ ...legacy, parameters: {} }).ok);
check('numeric-set evaluation validates', validateExercise({ ...ex, expectedEvaluation: { kind: 'numeric-set', fields: [{ key: 'size', label: 'Size', value: 17.5, tolerance: 0.01, unit: 'DEMO' }, { key: 'notional', label: 'Notional', value: 875, tolerance: 0.01, unit: 'USDT' }] } }).ok);
const dec = (acceptable: string[], decisionSet?: string) => validateExercise({ ...ex, type: 'decision-with-rationale', expectedEvaluation: { kind: 'decision', acceptable, requiresRationale: true, rationaleCues: ['cue'], ...(decisionSet ? { decisionSet } : {}) } });
check('decision: NO_TRADE in trade set ok', dec(['NO_TRADE']).ok);
check('decision: STOP_TRADING needs session set', !dec(['STOP_TRADING']).ok && dec(['STOP_TRADING'], 'session').ok);
check('decision: retired SIM_ENTRY_ALLOWED rejected', !dec(['SIM_ENTRY_ALLOWED']).ok);
check('decision words include abstentions', ABSTAIN_DECISIONS.every((d) => DECISION_WORDS.includes(d)));
check('unknown simulatorId rejected', !validateExercise({ ...ex, simulatorId: 'binance.order' }).ok);
check('simulator registry has liquidation.approx + funding.payment', SIMULATOR_IDS.includes('liquidation.approx') && SIMULATOR_IDS.includes('funding.payment'));
// formulas
const b13 = clone(sampleLesson) as any;
b13.formulas = [{ id: 'T14-F01', name: 'Body size', expression: 'body = |close − open|', variables: [{ symbol: 'body', meaning: 'size', unit: 'USDT' }], simulatorId: 'ohlc.validate', approximate: false, workedExamples: [{ label: 'ex', inputs: { open: 100, close: 104 }, outputs: { body: 4 }, tolerance: 0, assumptions: [] }] }];
b13.slides[3].blocks.push({ kind: 'formula', expression: 'body = |close − open|', variables: [{ symbol: 'body', meaning: 'size', unit: 'USDT' }], formulaId: 'T14-F01' });
check('formulas + formulaId block validate', validateLesson(b13).ok);
b13.slides[3].blocks[1].formulaId = 'T14-F09';
check('dangling formulaId rejected', !validateLesson(b13).ok);
const b14 = clone(sampleLesson) as any; b14.formulas = [{ ...clone(b13.formulas[0]), simulatorId: 'liquidation.approx', approximate: false }];
check('liquidation formula must be approximate', !validateLesson(b14).ok);

// ---------------- v1.2.0 additions
check('lesson declaring schemaVersion 1.1.0 still validates', validateLesson({ ...clone(sampleLesson), schemaVersion: '1.1.0' }).ok);
check('EDGE-06 refs resolve to T06/T09 owners (gross-pnl, net-pnl → T06; taker-fee alias → taker T09)', GLOSSARY_TERM_OWNERS['gross-pnl'] === 'T06' && GLOSSARY_TERM_OWNERS['net-pnl'] === 'T06' && GLOSSARY_ALIASES['taker-fee'] === 'taker' && GLOSSARY_TERM_OWNERS['taker'] === 'T09');
check('variants registered: sl-tp-lines + order-book-matching', ['setup', 'target-hit', 'stop-filled', 'gap-fill', 'stop-limit-unfilled', 'near-miss'].every((v) => (SCENE_VARIANTS['sl-tp-lines'] ?? []).includes(v)) && ['match', 'market-sweep', 'limit-partial-fill', 'bid-ask-spread'].every((v) => (SCENE_VARIANTS['order-book-matching'] ?? []).includes(v)));
const num = (value: number, tolerance: number, decimals?: number) => validateExercise({ ...ex, expectedEvaluation: { kind: 'numeric', value, tolerance, unit: 'USDT', ...(decimals === undefined ? {} : { rounding: { decimals } }) } });
check('tolerance: half step at 2dp ok, 0 warnings', (() => { const r = num(11.394, 0.005, 2); return r.ok && r.warnings.length === 0; })());
check('tolerance: below half step with off-grid value → error', (() => { const r = num(11.394, 0.001, 2); return !r.ok && r.errors.some((e) => e.code === 'TOLERANCE_BELOW_ROUNDING'); })());
check('tolerance: below half step with on-grid value → warning only', (() => { const r = num(97, 0.001, 2); return r.ok && r.warnings.some((w) => w.code === 'TOLERANCE_BELOW_HALF_STEP'); })());
check('tolerance: > one step → TOLERANCE_LOOSE warning', (() => { const r = num(1610, 0.5, 2); return r.ok && r.warnings.some((w) => w.code === 'TOLERANCE_LOOSE'); })());
check('tolerance: one step (0.01 @ 2dp) is not loose', (() => { const r = num(23.41, 0.01, 2); return r.ok && r.warnings.length === 0; })());
check('tolerance: ≥ |value| → sign-flip error', (() => { const r = num(-0.4, 0.5); return !r.ok && r.errors.some((e) => e.code === 'TOLERANCE_ACCEPTS_SIGN_FLIP'); })());
check('tolerance: bad decimals rejected', !num(1, 0.5, 1.5).ok && !num(1, 0.5, 9).ok);
check('tolerance: 0 on non-integer without rounding → warning', num(2.5, 0).warnings.some((w) => w.code === 'TOLERANCE_ZERO_FLOAT'));
check('tolerance rule applies to numeric-set fields', !validateExercise({ ...ex, expectedEvaluation: { kind: 'numeric-set', fields: [{ key: 'a', label: 'A', value: 17.555, tolerance: 0.0001, unit: 'DEMO', rounding: { decimals: 2 } }] } }).ok);
const q0 = clone(sampleLesson.quizQuestions[0]) as any;
check('tolerance rule applies to numeric question answers', (() => { const q = { ...q0, type: 'numeric', choices: undefined, answer: { kind: 'numeric', value: 3.795, tolerance: 0.001, unit: 'USDT', rounding: { decimals: 2 } } }; const r = validateQuestion(q); return !r.ok && r.errors.some((e) => e.code === 'TOLERANCE_BELOW_ROUNDING'); })());

// ---------------- v1.3.0 additions
check('lesson declaring schemaVersion 1.2.0 still validates', validateLesson({ ...clone(sampleLesson), schemaVersion: '1.2.0' }).ok);
check('simulator ohlc.anatomy registered, ohlc.validate kept', SIMULATOR_IDS.includes('ohlc.anatomy') && SIMULATOR_IDS.includes('ohlc.validate'));
check('candle-formation variants: forming, measure, compare, groups', ['forming', 'measure', 'compare', 'groups'].every((v) => (SCENE_VARIANTS['candle-formation'] ?? []).includes(v)));
check('candle-range owned by T14; price-range stays T18', GLOSSARY_TERM_OWNERS['candle-range'] === 'T14' && GLOSSARY_TERM_OWNERS['price-range'] === 'T18');
const fxBase = { id: 'FX-T14-OHLC-SET-01', kind: 'ohlc-series', fictional: true, label: 'Fictional educational data', version: '1.0.0' };
const series = (candles: unknown[], extra: Record<string, unknown> = {}) => validateFixture({ ...fxBase, data: { interval: '1m', label: 'fictional', candles, ...extra } });
const A = { o: 2000, h: 2030, l: 1985, c: 2020 };
check('ohlc-series with ms offsets validates (0 warnings)', (() => { const r = series([{ t: 0, ...A }, { t: 60_000, o: 2020, h: 2026, l: 1990, c: 1995, v: 10 }], { labels: ['A', 'B'] }); return r.ok && r.warnings.length === 0; })());
check('ohlc-series with ISO t validates', series([{ t: '2000-01-01T00:00:00Z', ...A }, { t: '2000-01-01T00:01:00Z', ...A }]).ok);
check('ohlc-series rejects mixed t forms', !series([{ t: 0, ...A }, { t: '2000-01-01T00:01:00Z', ...A }]).ok);
check('ohlc-series rejects non-increasing t', !series([{ t: 60_000, ...A }, { t: 60_000, ...A }]).ok);
check('ohlc-series rejects inconsistent OHLC', (() => { const r = series([{ t: 0, o: 2000, h: 2003, l: 1990, c: 2005 }]); return !r.ok && r.errors.some((e) => e.code === 'INCONSISTENT_OHLC'); })());
check("ohlc-series requires data.label 'fictional' + interval", !validateFixture({ ...fxBase, data: { candles: [{ t: 0, ...A }] } }).ok);
check('ohlc-series legacy timeframe key → warning', series([{ t: 0, ...A }], { timeframe: '1m' }).warnings.some((w) => w.code === 'FIXTURE_LEGACY_KEY'));
const ticks = [0, 5, 10, 15, 20, 30, 40, 50, 60].map((sec, i) => ({ t: sec * 1000, p: [2000, 2006, 1996, 1990, 1985, 2008, 2030, 2015, 2020][i] }));
const path = (finalCandle: unknown) => validateFixture({ ...fxBase, id: 'FX-T14-CANDLE-FORMING-01', kind: 'price-path', data: { interval: '1m', label: 'fictional', ticks, finalCandle } });
check('price-path with sub-minute ms offsets + matching finalCandle validates', path({ t: 0, ...A }).ok);
check('price-path rejects finalCandle not matching ticks', !path({ t: 0, ...A, c: 2019 }).ok);
check('ohlc-series minute-index t (0,1,2) → FIXTURE_TIME_GAP warning', series([{ t: 0, ...A }, { t: 1, ...A }]).warnings.some((w) => w.code === 'FIXTURE_TIME_GAP'));
check('validateFixture never throws on garbage', [null, 1, 'x', [], { kind: 'ohlc-series' }].every((g) => validateFixture(g).ok === false));
const B = { o: 2020, h: 2026, l: 1990, c: 1995 };
check('ohlc.anatomy result check: correct B passes', validateOhlcAnatomyResult(B, { direction: 'bearish', body: 25, upperWick: 6, lowerWick: 5, range: 36, dojiThreshold: { bodyToRangeMax: 0 } }).ok);
check('ohlc.anatomy result check: wrong body fails', !validateOhlcAnatomyResult(B, { direction: 'bearish', body: 24, upperWick: 6, lowerWick: 5, range: 36, dojiThreshold: { bodyToRangeMax: 0 } }).ok);
check('ohlc.anatomy: doji by declared threshold; threshold required', validateOhlcAnatomyResult({ o: 2000, h: 2012, l: 1988, c: 2001 }, { direction: 'doji', body: 1, upperWick: 11, lowerWick: 12, range: 24, dojiThreshold: { bodyToRangeMax: 0.1 } }).ok && !validateOhlcAnatomyResult(B, { direction: 'bearish', body: 25, upperWick: 6, lowerWick: 5, range: 36 }).ok);

check('EDGE-02 terms: blockchain→T01, peg→T03', GLOSSARY_TERM_OWNERS['blockchain'] === 'T01' && GLOSSARY_TERM_OWNERS['peg'] === 'T03');
check('price.linear-toy registered + model.kind map', SIMULATOR_IDS.includes('price.linear-toy') && MODEL_KIND_SIMULATORS['linear-toy'] === 'price.linear-toy');
check('simulator keys: pair.convert both ways, percent-change', JSON.stringify(SIMULATOR_KEYS['pair.convert']?.map((x) => x.outputs)) === '[["quoteValue"],["quantity"]]' && SIMULATOR_KEYS['price.percent-change']?.[0]?.inputs.join() === 'oldPrice,newPrice' && SIMULATOR_KEYS['price.percent-change']?.[0]?.outputs.join() === 'percentChange');
check('every SIMULATOR_KEYS id is a registered simulator', Object.keys(SIMULATOR_KEYS).every((k) => (SIMULATOR_IDS as readonly string[]).includes(k)));
check('Phase 1 variants registered', ['value-exchange', 'supply-demand', 'trading-pair'].every((t) => (SCENE_VARIANTS[t as keyof typeof SCENE_VARIANTS] ?? []).length >= 4) && (SCENE_VARIANTS['order-book-matching'] ?? []).includes('empty-book'));

check('pnl-meter single-position registered', (SCENE_VARIANTS['pnl-meter'] ?? []).includes('single-position'));
check('every default variant is a registered variant of its type', Object.entries(SCENE_DEFAULT_VARIANTS).every(([t, v]) => (SCENE_VARIANTS[t as keyof typeof SCENE_VARIANTS] ?? []).includes(v as string)));
const scn = (parameters: Record<string, unknown>, fixtureId?: string) => validateAnimationScene({ id: 'T14-A01', type: 'sl-tp-lines', durationMs: 30_000, caption: 'c', parameters, reducedMotionDescription: 'r', ...(fixtureId ? { fixtureId } : {}) });
check('branchId with fixtureId + variant validates', scn({ variant: 'gap-fill', branchId: 'gap-down' }, 'FX-T14-PATHS-01').ok);
check('branchId without fixtureId rejected', !scn({ variant: 'gap-fill', branchId: 'gap-down' }).ok);
check('branchId must be kebab-case', !scn({ branchId: 'Gap Down' }, 'FX-T14-PATHS-01').ok);
check('fixture kind toy-model registered + validates free-form', FIXTURE_KINDS.includes('toy-model') && validateFixture({ ...fxBase, id: 'FX-T02-SLIDER-MODEL-01', kind: 'toy-model', data: { basePrice: 100, stepPerLevel: 2 } }).ok);
check('price-path tick mark accepted, bad mark rejected', validateFixture({ ...fxBase, kind: 'price-path', data: { label: 'fictional', ticks: [{ t: 0, p: 2000, mark: 2000 }, { t: 1000, p: 1950, mark: 1952 }] } }).ok && !validateFixture({ ...fxBase, kind: 'price-path', data: { label: 'fictional', ticks: [{ t: 0, p: 2000, mark: 0 }, { t: 1000, p: 1950 }] } }).ok);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
