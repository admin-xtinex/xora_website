# XORA Futures Edge — Decision log (EDGE-00 Mission Control)

Contracts version after this log: **1.1.0** (MINOR, backward compatible for content data, see CHANGELOG).
Updated Mon 19 Oct 2026, ~07:52 IST. Inputs: `drafts/edge-04/` (EDGE-04 README + tools), `drafts/phase-03/` (EDGE-04's earlier JSON draft, now superseded by `drafts/edge-04/`), `drafts/phase-05/` (EDGE-06 README, 10 open questions), `drafts/edge-03/` (EDGE-03 T05–T09; it has no README, so it raised no requests, but I probed it). No bot's drafts folder was edited.

Status keys: **DECIDED**, **OPEN** (needs the user), **ACCEPTED / ADJUSTED / REJECTED** (for bot requests).

## A. Project-level decisions

| ID | Decision | Status |
|---|---|---|
| D-01 | Stack (Vite+React+TS site in `xora_website` vs inside the `xora` Expo app). Contracts stay stack-agnostic: no React/DOM types, no deps, a plain alias import. | **OPEN** (user) |
| D-02 | Per-bot branches `futures-edge/edge-XX-<slug>` off `feature/futures-edge`: **approved by the user**. Committing EDGE-00 docs/contracts to GitHub still needs an explicit go. | Branches DECIDED; commit OPEN |
| D-03 | Hosting / CNAME for xora.xtinex.com | **OPEN** (user) |
| D-04 | Brand tokens | **OPEN** (user). Provisional scoped tokens in the meantime |
| D-05 | Animation timeline length: validator **warns outside 90–360 s**. Authoring target is **180–360 s (3–6 min, blueprint)** where the content supports it. Under 180 s is allowed but must be justified in the handoff. | DECIDED |
| D-06 | Pass threshold **0.8, configurable** (`CheckpointConfig.passThreshold`, `Lesson.completionRequirements.minQuizScore`). Safety-critical items must be correct or remediated, whatever the aggregate score. Passing never authorizes trading. | DECIDED |

## B. Contract decisions in v1.1.0

| ID | Decision | Why |
|---|---|---|
| D-07 | `FORBIDDEN_MARKUP_PATTERN`: the event-handler branch now matches only **real DOM handler names at a word boundary** (`\bon(click\|load\|error\|mouse…\|key…\|…)\s*=`). Tags (`<x`, `</`, `<!`), `javascript:` stay rejected. | `on[a-z]+\s*=` flagged "Notional =" (verified: the old regex matched "onal =" in EDGE-04 and EDGE-06 text). Plain `\bon[a-z]+\s*=` would still flag "one = 1" or "only =". Handlers cannot run without a tag, and tags are always rejected. |
| D-08 | **Scene `parameters.variant`** is the single reserved key for sub-visualisations. `mode` is a deprecated alias (warning). Setting both is an error. `SCENE_VARIANTS` registry (EDGE-07 implements): text-card {plain, checklist, recap, red-flags, risk-warning}; order-placement {open-close-buttons, market-vs-limit, stop-trigger, slippage-jump}; pnl-meter {long-short-parallel, timeline}; fee-buildup {compare-roles, waterfall, gross-to-net, break-even, accumulate}; spot-vs-futures {ownership, crash-comparison}; leverage-exposure {exposure-bars, pnl-amplification}; margin-buffer {margin-used-up, isolated-vs-cross, maintenance-gauge, tier-comparison}; price-path {plain, horizon-compare}; volume-bars {plain, retest}; position-sizing {risk-budget, builder}; trade-lifecycle {full, decision-gate, journal}. A listed type with an unlisted variant is an **error**. A variant on an unlisted type is a **warning** (ask to register it). | Lets one scene type cover several views without adding scene types. Includes every variant used by EDGE-03/04, plus EDGE-06's needs mapped onto existing types (D-18). |
| D-09 | **`Exercise.choices?: Choice[]`** (top level). Required for `choice-feedback`. `exact-choice`/`choice-set` answers must reference a choice. `parameters.choices` is still read (deprecation warning). Defining both is an error. | Gives choice exercises a typed, validated answer link (EDGE-04 request 3). |
| D-10 | **Canonical import specifier `@futures-edge/contracts`** → `features/futures-edge/contracts/index.ts` (a new package-root barrel that re-exports `src/index.ts`). Scheme for every module: `@futures-edge/<module>` → `features/futures-edge/<module>/index.ts` (simulation, motion, assessment, platform). EDGE-01 wires tsconfig `paths` plus the bundler alias (Vite `resolve.alias`, or babel `module-resolver` if D-01 = Expo). | Stack-agnostic, works in Vite, Metro and webpack. EDGE-03's `'features/futures-edge/contracts'` (baseUrl) depends on a root-relative baseUrl and must switch. |
| D-11 | **One course-wide glossary.** `contracts/src/glossary-owners.ts` holds `GLOSSARY_TERM_OWNERS` (term id → exactly one owning lesson; 165 terms, 10 aliases) and `GLOSSARY_ALIASES`. The owning lesson authors the entry. Every other lesson only references the id. `buildCourseGlossary(lessons)` builds the merged index for EDGE-01's glossary UI. Validator: defining a term owned by another lesson → **error** `GLOSSARY_OWNER_MISMATCH`; using an alias → **error**; an unregistered new term → **warning** (ask EDGE-00); an unknown reference → warning. Ownership rule: the earliest lesson where the syllabus defines the term; otherwise the first lesson that needs it. | Avoids shared simultaneous writes (entries stay in owners' folders) while giving one glossary and one owner per term (EDGE-04 request 5, EDGE-06 Q2). |
| D-11a | **funding-rate → T11 (EDGE-04).** T09 mentions funding only as "a separate futures cost, explained in T11/T13" and may link `[[funding-rate]]`. | Funding needs the perpetual-futures concept (T11). T11's entry is already authored. |
| D-11b | **mark-price → T10 (EDGE-04).** T13 deepens it (liquidation is checked on mark price) in notes and slides, with no second entry. | Earliest lesson that shows and uses it. The master prompt's T13 "define" list is satisfied by reference plus deeper explanation. |
| D-11c | The 7 EDGE-02 terms EDGE-04 references (account-security, exchange, liquidity, notional-value, order-book, symbol, trading-pair: 9 refs) stay **owned by T01–T04 (EDGE-02)**. EDGE-04 keeps the refs. Staging validation uses `validateCourse(..., { partial: true })`, which reports them as `GLOSSARY_PENDING_OWNER` warnings. Integration (`partial: false`) needs EDGE-02's entries. | Earlier lesson owns the term. No duplicates. |
| D-11d | EDGE-06 terms that clash with earlier owners are **removed from Phase 5 and referenced instead**: notional→`notional-value` (T03), taker-fee→`taker` (T09), slippage (T07), round-trip (T09), gross-pnl / net-pnl (T06), breakeven-move→`break-even-price` (T09), reward-to-risk→`risk-reward-ratio` (T08), confirmation / retest / fakeout (T17), candle-close→`close-price` (T14), margin / leverage (T12), funding-rate (T11), approx-liquidation→`liquidation-price` (T13). EDGE-06 keeps (with the `gl-` prefix dropped): scalping, time-horizon, swing-trading, overtrading, setup, trade-checklist, market-context, key-level, entry-trigger, invalidation-point, wait-decision, false-signal, relative-volume, chasing, choppy-range, no-trade, account-balance, risk-budget, risk-amount, stop-distance, position-size, size-step, stop-slippage, max-daily-loss, **drawdown (new, master prompt T22)**, trading-plan, trade-lifecycle, trade-management, exit, trading-journal, r-multiple, consecutive-loss-rule, process-review, skipped-trade. EDGE-06's existing definitions for T14/T17 terms may be handed to EDGE-05 as suggestions. | Master prompt §5 assigns those definitions to earlier lessons. |
| D-11e | T09 ids come from EDGE-03's draft: trading-fee, fee-rate, maker, taker, round-trip, mid-price, break-even-price. Aliases maker-fee→maker and taker-fee→taker. | The owner's authored ids win over EDGE-00's planned names. |
| D-12 | **Shared ILLUSTRATIVE constants, owned by EDGE-08** in `features/futures-edge/simulation/constants.ts`, export `EDUCATIONAL_CONSTANTS: EducationalConstants` (shape frozen in contracts `simulators.ts`). **Baseline values v1** (all drafts already agree): taker 0.05%/side, maker 0.02%/side, slippage estimate 0.02%/side, funding +0.01% per interval, interval 8 h (3/day, "varies"), positive rate → longs pay shorts, maintenance margin rate 0.5% single flat tier, illustrative tiers 0.5% / 1% / 2.5%, liquidation fee model "consumes remaining maintenance margin", currency USDT, demo symbol `DEMOUSDT` (display `DEMO/USDT`). **Teaching examples, not recommendations:** risk/trade 1%, daily loss limit 3%, max 5 trades/session, stop after 2 consecutive losses. Changes go through this log. Content text must quote the same numbers. | One source of truth, so no drift between T09/T12/T13/T19/T22 (EDGE-06 Q3). Content must import contracts only, so content `__tests__` may import `@futures-edge/simulation` (test-only, D-26). |
| D-13 | **EDGE-08 owns the canonical approximate liquidation formula** (`liquidation.approx`, always `approximate: true`), the same model EDGE-04 used: isolated long ≈ entry × (1 − 1/L + MMR), short ≈ entry × (1 + 1/L − MMR). Cross/"collateral" variant (single position): replace 1/L with collateral ÷ entry notional. MMR = 0 gives the "margin-used-up price" (T12), labelled "liquidation happens before this". Guards: L ≥ 1, 0 ≤ MMR < 1/L (else `OUT_OF_RANGE`), positive finite inputs. The assumptions list must name: fees, funding, tiers, other positions and mark-vs-last are ignored. **T13 and T22/T23 must cite it** (`simulatorId: 'liquidation.approx'`, values recomputed from it). EDGE-06's current `entry × (1 − 1/L)` must become MMR-inclusive at the shared 0.5%. EDGE-06's "≥ 5× stop distance = OK" check stays as a labelled teaching rule (risk-check verdicts, D-16). | Removes the T13 vs T22 mismatch (EDGE-06 Q4). Verified against EDGE-04 goldens: 10x long from 2,000 → 1,810; 20x → 1,910; cross 1,000 wallet / 5,000 notional → 1,610. |
| D-14 | **`SIMULATOR_IDS` registry** (EDGE-08 implements all): pair.convert, price.percent-change, ohlc.validate, ohlc.aggregate, orders.fill, pnl.linear, fees.net, fees.estimate-round-trip, risk.reward, leverage.exposure, liquidation.approx, **funding.payment**, risk.position-size, range.lookback. Unknown `simulatorId` is now an **error** on exercises, constraint evaluations and formulas. | Typed links between content and EDGE-08. Includes all of EDGE-04's requested simulators. |
| D-15 | **`Lesson.formulas?: Formula[]`** (optional, ids `Tnn-Fnn`) with `simulatorId`, `approximate`, `variables`, `workedExamples {label, side?, inputs, outputs, tolerance, assumptions}`. A `formula` content block may cite `formulaId` (must exist). Liquidation formulas must be `approximate: true`. EDGE-08/EDGE-10 recompute the worked examples in CI. | Accepts EDGE-06 Q1 (`formulas[]`) and covers EDGE-04's machine-checked worked examples, without free-form `computeKey`s. |
| D-16 | **Decision words in contracts (`decisions.ts`):** trade `BUY \| SELL \| WAIT \| NO_TRADE` (same as v1.0 `DEMO_DECISIONS`); session `CONTINUE_SIM_PRACTICE \| STOP_TRADING`; risk-check `OK_FOR_SIM \| WARNING \| NO_TRADE`. `ExpectedEvaluation.decision.decisionSet` (default `trade`) must contain every acceptable word. `ABSTAIN_DECISIONS = WAIT, NO_TRADE, STOP_TRADING`. **`SIM_ENTRY_ALLOWED` is retired (error)**: use `BUY`/`SELL`, because a direction is required and the UI shows "DEMO BUY/SELL". `Choice.decision?` tags quiz choices that are decision words, so EDGE-09 can track abstentions. New safety topic `loss-limits`. | EDGE-06 Q5. Gives EDGE-09 a closed set. |
| D-17 | **Short-side examples: YES.** T22 gets at least one short worked example (stop above entry, liquidation above entry) and T23 at least one short branch, both labelled fictional DEMOUSDT. Formulas tagged `side: 'short'` where directional. | The master prompt teaches LONG/SHORT symmetry (T05/T06/T12). Long-only practice hides short-side risk. |
| D-18 | **REJECTED: `proposedType` / `blueprintPrimitive` fields** on scenes and exercises. Content uses only registered types. EDGE-06's proposals map onto existing types: animated-candlesticks→`candle-formation`/`price-path`; profit-loss→`pnl-meter`; sl-tp→`sl-tp-lines`; liquidation-distance→`margin-buffer` (maintenance-gauge); support-resistance→`support-resistance-zone`; timeline-compare→`price-path` variant horizon-compare; decision-gate→`trade-lifecycle` variant decision-gate; checklist-reveal→`text-card` variant checklist; volume-retest→`volume-bars` variant retest; risk-budget-meter→`position-sizing` variant risk-budget; position-size-builder→`position-sizing` variant builder; journal-review (scene)→`trade-lifecycle` variant journal. **Exercises:** cost-buildup-calculator / reward-risk-calculator→`numeric-calculator` (with `numeric-set`); scenario-decision / checklist-decision / leverage-liquidation-check→`decision-with-rationale` (risk-check set + `liquidation.approx`); breakout-classifier→`classify`; position-size-calculator→`position-size`; lifecycle-ordering→`sequence-order`; journal-review→`capstone-lifecycle`. Controls `calculator-pad` and `submit` are rejected (submit is implicit; use `numeric-input`); `reveal-hint`→`hint`. | Keeps the registries small. Variants (D-08) carry the differences. New types still possible via request. |
| D-19 | **EDGE-06 must migrate its JSON drafts to the v1.1 contract shape** (`Lesson` TS objects in `content/phase-05/Tnn/lesson.ts`): ids `T19-S01/N01/A01/X01/Q01/F01` (two digits; `EX`→`X`), glossary ids without `gl-`, fixture ids `FX-T22-SIZING-01` style (uppercase, lesson-prefixed); question type `single-choice`→`single` with `answer: {kind:'choice', choiceId}`; blocks use `kind` (not `type`), `definition.termId` (not `glossaryId`), disclaimer→`callout` `not-advice`, formulaRef→`formula` block with `formulaId`; `visualRef` → `{kind:'scene', sceneId}`; `pauseForInteraction: false` → omit; the seven required notes headings; plus the `schemaVersion`, `difficulty`, `reviewCard`, `completionRequirements`, `fictionalDataNotice`, `notesComplexity`, `cognitiveTag`, `learningOutcome`, `linkedLessonId`, `safetyTopic` fields. Probe today: 201–286 errors per lesson, almost all shape and naming (see §D). EDGE-06's own math and fixture self-checks (88 formula values, 65 fixture checks) remain valuable: port them into `__tests__/`. | Single contract for all authors. |
| D-20 | **Fixtures:** lesson-local fixtures stay with the lesson (`content/phase-0N/Tnn/fixtures.ts`, `FX-Tnn-…`, contract `Fixture` type). Shared and reusable ones go to EDGE-08 `simulation/fixtures/`. ~~Candles keep minute index `t`, no timestamps~~ **Amended by D-43 (v1.3.0):** standard `ohlc-series` / `price-path` data use `t` = integer **ms offset** from series start (sub-minute offsets such as 5,000 ms allowed; recommended) or an ISO-8601 string for synthetic series only. Data stays fictional (`label: 'fictional'`), and UIs show relative time, never 'real history'. The legacy `Candle.t` minute index remains valid in non-standard data. | Ownership without blocking authors. |
| D-21 | **A11y:** `reducedMotionDescription` (required) + captions + optional `narration` are enough. EDGE-01 generates the "Read as text" transcript from captions + narration, and figures use `textAlternative`. No new transcript or alt fields (EDGE-06 Q9). | The data already exists. Avoids duplicate text drifting apart. |
| D-22 | **Localization and markup unchanged:** plain text + `[[term-id]]` / `[[term-id\|label]]` + `**bold**` only. Keys are derived (`l10nKey`), and authors write no keys (EDGE-06 Q7). | — |
| D-23 | **`ExpectedEvaluation` `numeric-set`** (several named numeric answers with key, label, value, tolerance, unit). | EDGE-06 T22 asks for 8 values in one exercise. |
| D-24 | **`validateCourse(..., { partial: true })`** for staging subsets: missing lessons → `LESSON_NOT_PRESENT` warnings; refs to registered terms whose owner is absent → `GLOSSARY_PENDING_OWNER` warnings. Default (`partial` unset) behaves exactly as in v1.0 (errors). | Lets authors validate a phase without fake entries. |
| D-25 | **Fees model:** canonical `fees.net` charges each side on **that side's notional** (EDGE-03 T06/T09 already do this). `fees.estimate-round-trip` (entry notional × 2 × (fee + slippage)) is allowed **only as a labelled pre-trade estimate** (EDGE-04 T12, EDGE-06 T19–T22). | Both models are already in drafts. The label keeps them honest. |
| D-26 | Content `__tests__/` may import `@futures-edge/simulation` (test-only) to recompute goldens and check constants. Content runtime files still import contracts only. | Needed for D-12/D-13 cross-checks. |
| D-27 | **`risk.position-size`** supports the master-prompt simple model (allowed notional ≈ risk ÷ (\|entry − stop\| ÷ entry)) and an option `includeCosts` + `sizeStep` (EDGE-06's risk ÷ (stop distance + cost per unit), rounded **down**). Errors: wrong-side stop, zero/negative inputs, size below one step. | Covers both T22 views. |
| D-28 | EDGE-03's and EDGE-04's tests that require **0 warnings** fail on v1.1 deprecation warnings (mode→variant, parameters.choices). That is expected. Authors fix their data (rename `mode` to `variant`, move choices to the top level). Their "untraceable number" scans must exclude `schemaVersion`/`version` fields (they flagged "1.1.0"). | Honest compatibility note: data validates; strict 0-warning test policies need the small migration. |

## C. Per-request verdicts

### EDGE-04 (T10–T13, `drafts/edge-04/`)
| # | Request | Verdict |
|---|---|---|
| 1 | Fix `on[a-z]+\s*=` false positives; suggested `\bon[a-z]+\s*=` | **ADJUSTED → D-07** (word boundary + explicit handler-name list, because `\bon[a-z]+` would still flag "one =" / "only =") |
| 2 | `mode`/`variant` scene params for EDGE-07 | **ACCEPTED with adjustment → D-08**: `variant` is canonical, `mode` is a deprecated alias; all EDGE-04 values registered |
| 3 | Type `choice-feedback` choices (were `parameters.choices`) | **ACCEPTED → D-09** |
| 4 | `@futures-edge/contracts` alias | **ACCEPTED → D-10** (plus the module scheme and a package-root `index.ts`) |
| 5a | funding-rate T11 vs T09 | **T11 → D-11a** |
| 5b | mark-price T10 vs master prompt T13 | **T10 → D-11b** |
| 5c | 9 unresolved refs to 7 EDGE-02 terms | **Keep the refs; EDGE-02 owns them → D-11c**; use `partial: true` in staging (D-24) |
| S1 | `leverage.exposure` | **ACCEPTED** (D-14) |
| S2 | `liquidation.approx` (approximate:true, collateral variant) | **ACCEPTED, canonical, EDGE-08 owns → D-13**; EDGE-04's formula *is* the canonical one |
| S3 | `pnl.linear` | **ACCEPTED** |
| S4 | optional `funding.payment` | **ACCEPTED (not optional; T13 and T22 need it)** |

### EDGE-06 (T19–T23, `drafts/phase-05/`, 10 open questions)
| Q | Ask | Verdict |
|---|---|---|
| 1 | Extra fields `exercises[]`, `formulas[]`, `proposedType`, `blueprintPrimitive` | `exercises[]` **already in contract**; `formulas[]` **ACCEPTED → D-15**; `proposedType` / `blueprintPrimitive` **REJECTED → D-18** |
| 2 | Shared course glossary | **ACCEPTED → D-11, D-11d** |
| 3 | Shared fee/slippage/funding constants | **ACCEPTED → D-12** (EDGE-08 owns; your values are the baseline) |
| 4 | Liquidation model + owner | **EDGE-08 owns; T13 model is canonical; T22/T23 must switch → D-13** |
| 5 | Decision-word enums + safety gating | **ACCEPTED → D-16** (STOP_TRADING kept; SIM_ENTRY_ALLOWED retired); gating per D-06 (safety-critical must be correct or remediated in CPB) |
| 6 | Short-side example? | **YES → D-17** |
| 7 | Localization keys / markdown | **Unchanged → D-22** |
| 8 | Fixture location / timestamps | **Lesson-local, index `t`, no timestamps → D-20** |
| 9 | Transcript / alt-text fields | **Not needed → D-21** |
| 10 | Master prompt unavailable | Available on the box: `/workspace/futures-edge/specs/XORA_Futures_Edge_Zero_Beginner_Grok_Build_Master_Prompt.md`, together with the contracts at `/workspace/futures-edge/docs/contracts/` and `bot-briefs.md`. You must re-check against it during migration (D-19). |
| — | Proposed scene and exercise types | **Mapped → D-18** |
| — | Proposed decision words OK_FOR_SIM / WARNING / CONTINUE_SIM_PRACTICE | **ACCEPTED** (risk-check and session sets, D-16) |

### EDGE-03 (T05–T09, `drafts/edge-03/`; no README or requests, probed only)
- **Update:** while this log was being written, EDGE-03 picked up v1.1 from the box and migrated (alias D-10, variants, top-level choices). Re-probe: T05–T09 0 errors / 0 warnings. Its new `tools/validate-phase02.ts` reports ALL PHASE 2 GATES PASS. The items below are kept for the record.
- Uses `'features/futures-edge/contracts'` → **switch to `@futures-edge/contracts`** (D-10).
- T05/T06/T09 use `mode` → rename to `variant`. T07 uses `parameters.choices` → top-level `choices` (D-08/D-09).
- T09 glossary ids registered as authored (D-11e). The fee model already matches D-25.

### Superseded
- `drafts/phase-03/` (EDGE-04's earlier Python/JSON draft) is superseded by `drafts/edge-04/`. EDGE-04 keeps it only as a cross-check source (`tools/crosscheck_calc.py`).

## D. Evidence (commands run on the box, 19 Oct 2026 IST)

| Command (cwd) | Result |
|---|---|
| `npx -y -p typescript@5.9.3 tsc -p tsconfig.json` (docs/contracts) | exit 0 |
| `npx -y -p typescript@5.9.3 tsc --noEmit --strict --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022 index.ts src/*.ts` (docs/contracts) | exit 0 |
| `npx -y tsx selftest/run.ts` (docs/contracts) | 52 passed, 0 failed (23 v1.0 + 29 v1.1) |
| `npx -y -p typescript@5.9.3 tsc -p tsconfig.json --noEmit` (drafts/edge-04, paths → docs contracts) | exit 0 |
| `npx -y tsx tools/validate-phase03.ts` (drafts/edge-04) | exit 0. T10–T13 PASS, 0 errors, 10 warnings (DEPRECATED_MODE ×9, DEPRECATED_PARAM_CHOICES ×1); 19 LESSON_MISSING + 9 GLOSSARY_UNRESOLVED (as their tool expects) |
| `npx -y tsx --test …/__tests__/*.golden.test.ts` (drafts/edge-04) | 54 tests: **47 pass, 7 fail**. Golden answer suites all pass. Failures: 3× "0 warnings" assertions (deprecations) + 4× number-trace flagging `schemaVersion` "1.1.0" (D-28). Before v1.1: 54/54. |
| `python3 tools/crosscheck_calc.py` vs `tools/calc-golden.json` (drafts/edge-04) | identical |
| `npx -y -p typescript@5.9.3 tsc -p tsconfig.json --noEmit` (drafts/edge-03) | exit 0 |
| `npx -y tsx tools/validate-phase02.ts` (drafts/edge-03, imports `@futures-edge/contracts` → docs) | exit 0, ALL PHASE 2 GATES PASS (partial course 0 errors; 18 LESSON_NOT_PRESENT, 17 GLOSSARY_PENDING_OWNER warnings) |
| `node validate.mjs` / `node validate.selftest.mjs` (drafts/phase-05; standalone, does not use the docs contracts) | PASS / 18/18 mutations caught (unchanged) |
| `npx -y tsx probe-drafts.ts` (docs/tools, read-only probe) | EDGE-03 T05–T09 and EDGE-04 T10–T13 all **PASS, 0 errors**; EDGE-03 0 warnings (final run), EDGE-04 10 deprecation warnings. Partial course T05–T13 OK, 0 errors; pending owners: T02 (liquidity, volatility), T03 (notional-value, quantity, symbol, trading-pair, usdt), T04 (account-security, ask, bid, exchange, order, order-book, spread). EDGE-06 JSON: 220 / 201 / 205 / 286 / 227 errors (T19–T23), shape migration per D-19 |

## E. Still open for the user
D-01 stack, D-02 commit approval, D-03 hosting, D-04 brand. Also: SME/legal review of the illustrative rates and India-facing disclaimers (master prompt §0) before any public release.

## Defaults set by EDGE-00 after audit v2 (2026-10-19)
- D-29 Course lives in xora_website at /learn/futures-edge under src/features/futures-edge (user pushed the Vite site; D-01 resolved).
- D-30 Router: no new dependency; small History-API router inside the module.
- D-31 Test tooling: Vitest + Testing Library + Playwright with axe, added by EDGE-01 in the scaffold PR; compatibility with TS 7 / Vite 8 must be verified there.
- D-32 Preview card in FuturesEdgeSection: EDGE-01 aligns it to 5 phases / 23 lessons and removes fake progress, behind the flag.
- D-33 Risk colours: module defines scoped up/down/warning tokens under .fe-root; src/styles.css stays untouched.
- D-34 No deploy of a flag-ON build without explicit user authorization.

## E. v1.2.0 (EDGE-03 requests) — Mon 19 Oct 2026, ~08:02 IST

- **D-35 `mark-price` owner moves T10 → T06** (define before use). T06 values open positions and already forward-links the term, so T06 (EDGE-03) defines it; T10/T11/T13 (EDGE-04) reference it and deepen it on the mock terminal. `last-price` stays with T10; T06's entry may keep `notSameAs: last-price` as an allowed forward reference, and should explain "last traded price" in plain words. Expected transition state: until both bots change their drafts, EDGE-04 T10 fails with GLOSSARY_OWNER_MISMATCH and the course fails with GLOSSARY_UNRESOLVED for mark-price. I kept this an **error**, not a transition warning, so the course never ships with two definitions or none.
  - EDGE-03 must: add a `mark-price` GlossaryEntry to T06 `glossaryEntries` (`introducedIn: 'T06'`, generic wording such as "Mark price 2,001.50 while the last trade printed 2,004.00", with exact methods exchange-specific); change "Exchanges use a mark price for this (T10)" to point at the term without the T10 attribution (for example "…a mark price; T10 shows it on a mock screen"). Keep `relatedTermIds` and the T06-N08 paragraph.
  - EDGE-04 must: (1) delete the `mark-price` object from T10 `glossaryEntries` (currently index 6, ~line 71; T10 goes from 12 to 11 entries); (2) move its useful content into T10 prose and/or the `last-price` entry (`notSameAs: [{ termId: 'mark-price', … }]` is already allowed); (3) keep every `[[mark-price]]` link, glossaryRef, `relatedTermIds` and `reviewCard.keyTermIds` entry, since references to an earlier owner are valid; (4) in `tools/validate-phase03.ts`, accept a pending owner in Phase 2 (T05–T09) as well as EDGE-02 (T01–T04), or read the owner from `glossaryOwnerOf()`, because mark-price is now an "external" ref owned by T06; (5) update any test or count that asserts T10 glossary = 12 or that T10 defines mark-price (T10 Q04 "mark price is the correct choice" is unaffected).
- **D-36 Variants registered** from what the EDGE-03 drafts actually draw:
  - `sl-tp-lines`: `setup`, `target-hit`, `stop-filled`, `gap-fill`, `stop-limit-unfilled`, `near-miss`.
    T08 currently uses `parameters.branch`, so mapping: A02 → `setup`; `target-hit` → `target-hit`; `calm-drop` → `stop-filled`; `gap-down` → `gap-fill`; `gap-down-stop-limit` → `stop-limit-unfilled`; `near-miss` → `near-miss`. EDGE-03 renames `branch` → `variant`. `branch` is not a recognised alias; it is ignored by the validator and must not be read by EDGE-07.
  - `order-book-matching`: `match` (plain crossing, reserved for EDGE-02 T04), `market-sweep` (T07-A02), `limit-partial-fill` (T07-A03), `bid-ask-spread` (T09-A03). EDGE-03 should add `variant` to those three scenes. It is optional today, so there is no error if absent, but EDGE-07 dispatches on it.
  - The names are generic so T13/T22/T23 can reuse them. Generic names (`stop-filled`, `gap-fill`) were preferred over narrative ones (`calm-drop`, `gap-down`).
- **D-37 Tolerance vs rounding rule** (`checkTolerance`, applied to exercise `numeric`, each `numeric-set` field, and numeric question answers; optional `rounding?: { decimals }` added to the latter two):
  - `decimals` must be an integer 0–8 (ERROR `ROUNDING`).
  - tolerance < 0.5·10^-d: **ERROR** `TOLERANCE_BELOW_ROUNDING` if the value has more precision than d decimals (a correctly rounded answer would be marked wrong). Otherwise **WARNING** `TOLERANCE_BELOW_HALF_STEP` (harmless; normalise to the half step).
  - tolerance > 10^-d: **WARNING** `TOLERANCE_LOOSE` (accepts a neighbouring wrong rounding; justify in the explanation or tighten).
  - value ≠ 0 and tolerance ≥ |value|: **ERROR** `TOLERANCE_ACCEPTS_SIGN_FLIP` (zero or the opposite sign would pass; this matters for net-loser answers like −0.40).
  - no rounding, tolerance 0 and a non-integer value: **WARNING** `TOLERANCE_ZERO_FLOAT`.
  - So at 2 dp the accepted band is 0.005–0.01.
  - Current hits: EDGE-03 T08-X01 (97, tol 0.001 → warning; set 0.005); EDGE-04 T13 exercises[0] (1610, tol 0.5 → loose warning; tighten to 0.01, or justify and drop `rounding` to 0 dp with tol 0.5); T13 exercises[2] (−0.2, tol 0.001 → warning; set 0.005). No errors in any staged draft.
- **D-38 Version 1.2.0** (MINOR, additive: one owner-map move, new variant lists, optional `rounding` fields, new checks; lessons declaring 1.0.0/1.1.0 still validate). The 1.1.1 PATCH (the parent removed the unused `type Slide` import in validation.ts for the repo's `noUnusedLocals`) is recorded retroactively in CHANGELOG. `version.ts` had not been bumped for 1.1.1 and goes straight to 1.2.0.
- **D-39 EDGE-06 owner-map check (verified with the contracts, not by reading alone):** `gl-gross-pnl` → `gross-pnl` (owner T06, defined in EDGE-03 T06 line 61); `gl-net-pnl` → `net-pnl` (T06, line 69); `gl-taker-fee` → `taker-fee` is an **alias** of `taker` (T09, defined in T09 line 48). So EDGE-06 must write `[[taker]]` or `[[taker|taker fee]]`, never `taker-fee`, which errors as GLOSSARY_ALIAS. EDGE-06 must not define any of the three. Occurrences in drafts/phase-05: gross-pnl ×5, net-pnl ×5, taker-fee ×2 (T19.json).
- **D-40 Task board:** T05–T09 marked **COMPLETE (staged), pending branch**. Two small v1.2 follow-ups for EDGE-03 (D-35 T06 mark-price entry, D-37 T08-X01 tolerance) plus the optional D-36 renames. The status records staged authoring as complete; it does not mean the contract run is green until those land.

## F. v1.3.0 (EDGE-05 T14 handoff + EDGE-02 T01–T04 handoff), Mon 19 Oct 2026, ~08:10 IST
Rulings by the user (D-41…D-44, D-49) and the parent (D-45…D-48, D-50), implemented by EDGE-00.

- **D-41 `ohlc.anatomy`** (EDGE-08 implements). Input `{o,h,l,c,dojiThreshold:{bodyToRangeMax}}` → `{direction: bullish|bearish|doji, body, upperWick, lowerWick, range, dojiThreshold}`.
  - doji ⇔ body ≤ bodyToRangeMax × range (range 0 → doji).
  - The threshold is always **declared by the caller**; there is no hidden default. `bodyToRangeMax: 0` = "open equals close", which is what T14 teaches.
  - Optional `EducationalConstants.dojiBodyToRangeMax` for EDGE-08's offered default.
  - `validateOhlcAnatomyResult()` checks results (invariant body + wicks = range).
  - `ohlc.validate` unchanged.
- **D-42 `candle-formation` variants:** forming, measure, compare, groups (shapes from the T14 draft; EDGE-07 to confirm).
- **D-43 Standard fixture shapes** (`fixture-shapes.ts`, `validateFixture()`):
  - `ohlc-series`: `{interval, label:'fictional', candles:{t,o,h,l,c,v?}[], labels?}`.
  - `price-path`: `{interval?, label:'fictional', ticks:{t,p}[], finalCandle?}`.
  - `t` is an int ms offset or ISO-8601; forms must not be mixed; `t` strictly increases.
  - OHLC must be consistent, prices > 0, `finalCandle` = first/max/min/last tick.
  - Warnings: legacy `timeframe` key; candle gap < one interval (`FIXTURE_TIME_GAP`, catches minute-index `t` read as ms).
  - Extra data keys are allowed.
  - `Fixture.units.time` also accepts `'seconds' | 'ms'`.
  - **Sub-minute second offsets are allowed** (D-20 amended).
  - `validateFixture` is opt-in: `validateLesson` does not call it. EDGE-10 wires it into QA at integration.
- **D-44 `candle-range`** owned by T14 (high − low of one candle), `notSameAs: price-range` (T18, range over a period). T14 defines it and keeps linking `[[price-range]]` only as the forward contrast.
- **D-45 New terms:** `blockchain` → T01, `peg` → T03 (EDGE-02 must add both entries).
- **D-46 Phase 1 variants** from the EDGE-02 drafts (EDGE-07 to confirm):
  - `value-exchange`: ledger-record (T01-A02), balance-quantity (A03), value-from-price (A05), swap (EDGE-03 T05-A02 pay/receive/thenSell).
  - `supply-demand`: balanced, demand-up, supply-up, thin-market (= T02 `phase` values).
  - `trading-pair`: price-tag, split, size-compare, convert-quote-to-base, reprice (= T03 `stage` values).
  - `order-book-matching` + `empty-book` (T04-A01).
  - EDGE-02 renames `phase`/`stage` → `variant` (optional now; EDGE-07 dispatches on `variant`).
- **D-47 Simulator keys** (`SIMULATOR_KEYS`):
  - `pair.convert` {quantity, price} → {quoteValue} and {quoteAmount, price} → {quantity}.
  - `price.percent-change` {oldPrice, newPrice} → {percentChange}.
  - New `price.linear-toy` {buyers, sellers, basePrice, stepPerLevel} → {price}: an ILLUSTRATIVE toy model, never presented as how markets work.
  - `MODEL_KIND_SIMULATORS['linear-toy'] = 'price.linear-toy'`: a widget receiving `parameters.model.kind` evaluates the model with that simulator, while the exercise keeps its grading `simulatorId` (T02-X01 stays `price.percent-change`).
  - EDGE-03's pnl/fees/orders/risk keys remain provisional until EDGE-08 confirms them.
- **D-48 Spread formula stays content-only** (best ask − best bid; T04). No simulator id; T04 tests recompute it.
- **D-49 T14 accepted as the Phase 4 template** for T15–T18: 7 slides, 7 notes headings, 8 scenes ≈ 320 s, 3 exercises, 5 questions (one safety-critical `not-advice`), goldens recomputed from fixture data in tests, colour never the only cue, lesson-local fixtures in the D-43 shapes.
- **D-50 Status:** T01–T04 COMPLETE (staged), pending branch. T14 COMPLETE (staged), pending branch. T15–T18 IN PROGRESS. EDGE-04 content versions 1.0.1 for T10 and T13 accepted (T12 is also 1.0.1).
- **D-51 CP1:** EDGE-02's 8 proposed CP1 items are forwarded to EDGE-09 as proposals. EDGE-09 owns the checkpoint and may reference the lesson items instead. CP1 is non-gating; the safety items need `safetyCritical` + `safetyTopic` (stablecoin-risk, account-security).
- **D-52 Omitted variant** (EDGE-03 request 5): `pnl-meter` gains `single-position` (T06-A02 unrealized at marks, T06-A03 realized at exit). New `SCENE_DEFAULT_VARIANTS`:
  - text-card → plain, pnl-meter → single-position, price-path → plain, volume-bars → plain, sl-tp-lines → setup, order-book-matching → match, trade-lifecycle → full.
  - An omitted variant means that default. Every default is a registered variant (self-test).
  - Types with a variant list but no default (candle-formation, value-exchange, supply-demand, trading-pair, fee-buildup, margin-buffer, …) **should** set `variant`. Omission there means EDGE-07's documented base rendering.
- **D-53 `parameters.branchId` allowed** (EDGE-03 request 6), as a reserved parameter key on scenes **and** exercises: the id of one path inside the item's `branching-paths` fixture.
  - Kebab-case, so narrative ids like `gap-down` are fine. It requires `fixtureId` on the same item (ERROR `BRANCH_ID` / `BRANCH_ID_NO_FIXTURE`).
  - `variant` = how to draw; `branchId` = which data. EDGE-07/EDGE-08 read both.
  - `parameters.branch` stays unrecognised; do not use it.
  - Kept inside `parameters`, so `AnimationScene` gets no new top-level field.
- **D-54 Fixture additions for the migration:** kind `toy-model` (free-form parameters of an illustrative model, e.g. T02's `price.linear-toy` config); optional `PricePathTick.mark` (> 0) for last-vs-mark paths (T13).
- **D-55 Fixture migration list** (per bot; see CHANGELOG 1.3.0 "Migration"). `validateFixture` stays opt-in until EDGE-10 wires it at integration. Each bot fixes its fixtures in the same edit that moves its lessons to `schemaVersion: '1.3.0'`.
- **D-56 Schema-version policy** (EDGE-03 request 7):
  - `schemaVersion` records the contract minor the lesson was last validated against. Pin a **literal** (`'1.3.0'`), not `SCHEMA_VERSION`, so a later bump cannot silently re-label a lesson.
  - All staged lessons move to `'1.3.0'` **before their per-bot branch is created**, together with the D-55 fixture fixes.
  - At integration, EDGE-10's runner warns on any lesson below the integration contract minor; EDGE-11 blocks merge on it.
  - 1.0.0–1.2.0 lessons keep validating (same major).

