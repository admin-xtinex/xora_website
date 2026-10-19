# Contracts changelog

## 1.3.0 (19 Oct 2026, ~08:10 IST): MINOR, additive (D-41 … D-47)

Backward compatible: lessons declaring 1.0.0–1.2.0 still validate. `validateLesson` behaviour is unchanged apart from
the new variant lists and owner-map entries. All 14 staged TS lessons validate with 0 errors and 0 warnings.

### Added
- `SIMULATOR_IDS`: `ohlc.anatomy` (D-41), `price.linear-toy` (D-47).
- `CANDLE_DIRECTIONS`, `CandleDirection`, `DojiThreshold`, `OhlcAnatomyInput`, `OhlcAnatomyResult`, `validateOhlcAnatomyResult()`; optional `EducationalConstants.dojiBodyToRangeMax`.
- `SIMULATOR_KEYS` / `SimulatorSignature` (pair.convert ×2, price.percent-change, price.linear-toy); `MODEL_KIND_SIMULATORS` / `ModelKind`.
- `SCENE_VARIANTS`: `candle-formation` (forming, measure, compare, groups); `value-exchange` (ledger-record, balance-quantity, value-from-price, swap); `supply-demand` (balanced, demand-up, supply-up, thin-market); `trading-pair` (price-tag, split, size-compare, convert-quote-to-base, reprice); `order-book-matching` + `empty-book`.
- `fixture-shapes.ts`: `FIXTURE_INTERVAL_PATTERN`, `FixtureTime`, `OhlcSeriesCandle`, `OhlcSeriesData`, `PricePathTick`, `PricePathData`. `validateFixture()` (common fields + standard data shape for ohlc-series / price-path) (D-43).
- `Fixture.units.time` accepts `'seconds' | 'ms'`.
- `GLOSSARY_TERM_OWNERS`: `candle-range` → T14, `blockchain` → T01, `peg` → T03.
- `SCENE_VARIANTS['pnl-meter']` + `single-position`; `SCENE_DEFAULT_VARIANTS` (meaning of an omitted variant) (D-52).
- Reserved `parameters.branchId` on scenes and exercises (`BRANCH_ID_PATTERN`; errors `BRANCH_ID`, `BRANCH_ID_NO_FIXTURE`) (D-53).
- `FIXTURE_KINDS` + `toy-model`; optional `PricePathTick.mark` (D-54).
- Self-test: 95 checks (was 65).

### Migration (D-55, D-56): do this in ONE edit per bot, before your per-bot branch is created
1. Set every lesson to `schemaVersion: '1.3.0'` (a literal, not `SCHEMA_VERSION`). Older 1.x lessons still validate, but EDGE-11 blocks merge below the integration minor.
2. Make every `ohlc-series` / `price-path` fixture pass `validateFixture` (run `cd docs/tools && npx -y tsx probe-drafts.ts`, section "validateFixture"):
   - add `data.label: 'fictional'` (keep the top-level `label` sentence too);
   - rename `data.timeframe` → `data.interval` (required for `ohlc-series`);
   - `t` = integer **ms** offset from series start (minute index `i` → `i * 60_000`; seconds `s` → `s * 1_000`), strictly increasing, or ISO-8601 for synthetic series. Do not mix the two;
   - `ohlc-series` needs `candles[]` (builder-style fixtures put the start state in `candles: [start]`; extra keys are allowed); `price-path` needs `ticks: {t, p, mark?}[]` (≥ 2) and an optional `finalCandle` equal to first/max/min/last;
   - a fixture that is not a path or series changes `kind` (e.g. model config → `toy-model`).
3. Optional: set `variant` explicitly where D-52 has no default; replace any `parameters.branch` with `variant` (+ `branchId`).
4. Glossary: T01 adds `blockchain`, T03 adds `peg`, T14 adds `candle-range` (each has an owner since 1.3.0; owner tests fail until added).


## 1.2.0 (19 Oct 2026, ~08:02 IST): MINOR, additive (D-35 … D-38)

Backward compatible: lessons declaring `schemaVersion` 1.0.0 or 1.1.0 still validate (self-test).

### Changed
- `GLOSSARY_TERM_OWNERS['mark-price']`: `T10` → `T06` (D-35). T10 must reference it, not define it.

### Added
- `SCENE_VARIANTS['sl-tp-lines']` = setup, target-hit, stop-filled, gap-fill, stop-limit-unfilled, near-miss (D-36).
- `SCENE_VARIANTS['order-book-matching']` = match, market-sweep, limit-partial-fill, bid-ask-spread (D-36).
- `Rounding` type (`{ decimals }`), exported from exercise.ts. Optional `rounding` on `numeric-set` fields and on numeric question `Answer` (D-37).
- Tolerance checks (D-37): errors `ROUNDING`, `TOLERANCE_BELOW_ROUNDING`, `TOLERANCE_ACCEPTS_SIGN_FLIP`; warnings `TOLERANCE_BELOW_HALF_STEP`, `TOLERANCE_LOOSE`, `TOLERANCE_ZERO_FLOAT`.
- Self-test: 65 checks (was 52).

## 1.1.1 (19 Oct 2026): PATCH (recorded retroactively)
- validation.ts: removed the unused `type Slide` import so the module compiles under the xora_website tsconfig (`noUnusedLocals`). `SCHEMA_VERSION` was not bumped at the time; 1.2.0 supersedes it.

## 1.1.0 (19 Oct 2026, IST): MINOR, additive (decisions D-07 … D-28 in `docs/futures-edge/decisions.md`)

Backward compatibility: every v1.0.0 lesson stays structurally valid (lessons declaring `schemaVersion: '1.0.0'`
still pass; self-test). The new **errors** apply only to things that were silently wrong or ambiguous before:
a glossary term defined by a non-owner lesson, alias term ids, unknown `simulatorId`, unregistered variant on a
type that has a variant list, a dangling `formulaId`, a choice answer pointing to a missing choice, the retired
decision word `SIM_ENTRY_ALLOWED`, and `mode` + `variant` both set. Deprecations produce **warnings** only.

### Added
- `index.ts` at the package root (alias target for `@futures-edge/contracts`) (D-10).
- `glossary-owners.ts`: `GLOSSARY_TERM_OWNERS` (165 terms → owning lesson), `GLOSSARY_ALIASES` (10),
  `glossaryOwnerOf()`, `RegisteredTermId` (D-11).
- `decisions.ts`: `TRADE_DECISIONS`, `SESSION_DECISIONS`, `RISK_CHECK_VERDICTS`, `DECISION_WORDS`, `DECISION_SETS`,
  `ABSTAIN_DECISIONS`, `RETIRED_DECISION_WORDS`, `isDecisionWord()`, types `DecisionWord`, `DecisionSet`, … (D-16).
- `simulators.ts`: `SIMULATOR_IDS` (14), `SimulatorId`, `isSimulatorId()`, `EducationalConstants` interface (values owned by EDGE-08) (D-12, D-14).
- `formula.ts`: `Formula`, `FormulaWorkedExample`. `Lesson.formulas?` (D-15). ID kind `formula` (`Tnn-Fnn`), type `FormulaId`.
- `animation.ts`: `SCENE_VARIANTS` registry (D-08).
- `exercise.ts`: `Exercise.choices?: Choice[]` (D-09); `ExpectedEvaluation` kind `numeric-set` (D-23);
  `decision.decisionSet?`; `decision.acceptable` widened to `DecisionWord[]`.
- `question.ts`: `Choice.decision?: DecisionWord`; safety topic `loss-limits`.
- `content.ts`: `formula` block `formulaId?`.
- `validation.ts`: `buildCourseGlossary()`, `CourseValidateOptions.partial` (D-24), `CourseGlossary` type; checks for
  everything above.

### Changed
- `SCHEMA_VERSION` `1.0.0` → `1.1.0`.
- `FORBIDDEN_MARKUP_PATTERN`: the event-handler branch now matches only real handler names at a word boundary.
  "Notional = …" is no longer flagged (D-07).
- `DEMO_DECISIONS` is now an alias of `TRADE_DECISIONS` (same four values).
- `Exercise.simulatorId`, `SimulatorDescriptor.id`, `constraint.simulatorId` typed as `SimulatorId`.

### Deprecated (warning, still accepted in 1.x)
- Scene `parameters.mode` → use `parameters.variant`.
- Exercise `parameters.choices` → use top-level `choices`.

### Verification
`npx -y -p typescript@5.9.3 tsc -p tsconfig.json` → exit 0 · `npx -y tsx selftest/run.ts` → 52 passed, 0 failed.

## 1.0.0 (19 Oct 2026, IST)
Initial frozen contracts (EDGE-00 Wave 0).

## v1.1.1 (2026-10-19)
- Removed unused `type Slide` import in src/validation.ts so contracts pass the xora_website tsconfig (noUnusedLocals). Verified: repo `npx tsc --noEmit` exit 0 with contracts at src/features/futures-edge/contracts; selftest 52/0.
