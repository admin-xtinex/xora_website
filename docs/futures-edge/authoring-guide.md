# XORA Futures Edge — lesson authoring guide (engine v1, contracts v1.3.0)

The reference lesson is **T14** (`src/features/futures-edge/content/phase-04/T14/`). Read all four of its files before writing anything; copy its structure and quality bar exactly.

Product spec (source of every lesson's required content): `docs/futures-edge/specs/XORA_Futures_Edge_Zero_Beginner_Grok_Build_Master_Prompt.md` §2, §3 and §5 (your lessons' bullet lists are mandatory).

## 1. Files per lesson

```
src/features/futures-edge/content/phase-0N/Tnn/
  meta.ts       export const meta: LessonMeta = { id, phaseId, title, summary, durationMinutes, difficulty, prerequisites, version: '1.0.0' }
  glossary.ts   export const glossaryEntries: GlossaryEntry[]   (terms this lesson OWNS)
  fixtures.ts   export const fixtures: Fixture[]                (ids FX-Tnn-...)
  lesson.ts     default export Lesson; `export { fixtures };` ; `...meta`, `glossaryEntries` imported
```
Imports allowed in content: `@futures-edge/contracts`, `../../types` (LessonMeta), and the lesson's own files. Nothing else.
Phase folders: P1 → phase-01, P2 → phase-02, P3 → phase-03, P4 → phase-04, P5 → phase-05.

## 2. The gate (must pass with zero errors and zero warnings)

```
npx vitest run src/features/futures-edge/__tests__/content.test.ts -t T05
npx tsc --noEmit
```
(`-t` filters by lesson id.) It runs `validateLesson` (contracts), fixture validation, scene/exercise parameter specs, renders every scene at p = 0, 0.5, 1 and every exercise widget, and recomputes every `formulas[].workedExamples` with the simulators.

## 3. Contract rules that bite

- **Text is plain RichText.** Only `[[term-id]]`, `[[term-id|label]]` and `**bold**`. **Never write `<` directly followed by a letter or `/`** (e.g. `close < open` is rejected as markup). Write "below", "less than", "≤". `>` is fine but prefer words.
- Banned anywhere (placeholder detector): `TODO`, `TBD`, `FIXME`, `lorem ipsum`, `placeholder`, `content here`, `coming soon` (whole words, any case).
- IDs: slides `Tnn-S01…`, notes `Tnn-N01…`, scenes `Tnn-A01…`, exercises `Tnn-X01…`, steps `Tnn-X01-01…`, questions `Tnn-Q01…`, formulas `Tnn-F01…`. Choice ids: lowercase slug (`a`, `b`, `wait`, `no-trade`).
- 5–7 slides. Kinds: cover-problem, key-definition, visual-breakdown, worked-example, risks-misunderstanding, guided-practice, recap. **≤ 60 counted words per slide** (target ≤ 35) — counted = paragraphs, list items, callouts, worked-example title+steps+conclusion, table cells, formula expression+variable meanings. Put longer talk in `narrationText`/`speakerNotes` (not counted).
- Notes: sections with headings `meaning`, `why-it-matters`, `example`, `how-to-recognize`, `common-mistakes`, `safety-note`, `quick-revision` (all required, this order), plus one `learn-more` section (`collapsedByDefault: true`, not counted). Word count (excluding learn-more) must be within **simple 300–650** or **complex-risk 450–900** (`notesComplexity`). Risk topics (T08, T09, T12, T13, T19–T23 and similar) use `complex-risk`. Include ≥ 2 numeric worked examples (`worked-example` blocks need `fictional: true`).
- Animation: **4–8 scenes**, total `durationMs` **90 000–360 000** (aim 150–240 s), each ≤ 120 000. Every scene needs `caption` and `reducedMotionDescription` (full text equivalent with the numbers). Captions must describe a *changing state*.
- Exercises: ≥ 1 (aim 2), each 2–4 steps with `hint`, `allowedControls` must include `'reset'`; if it includes `'drag'` it must also include `keyboard-move`, `numeric-input`, `choice` or `tap-select`. `fixtureId` is **required** on every exercise (point at one of your fixtures, even if the widget does not draw it). `fictionalDataLabel` must say fictional/illustrative.
- Quiz: 3–5 questions; at least one `cognitiveTag: 'interpretation'` and one `'mistake-risk'`. Every wrong choice needs `misconceptionFeedback[choiceId]`. `type: 'numeric'` → `answer: { kind: 'numeric', value, tolerance, unit, rounding: { decimals } }` with `tolerance = 0.5 × 10^-decimals` (e.g. decimals 2 → 0.005) and tolerance < |value|. `multi` → `{ kind: 'choices', choiceIds }`. Others → `{ kind: 'choice', choiceId }`. Safety-critical questions need `safetyCritical: true` + `safetyTopic` (leverage, liquidation, execution, account-security, fees-costs, no-trade, stablecoin-risk, not-advice, loss-limits). Each lesson should have ≥ 1 safety-critical item where the topic is a risk.
- `commonMistakes` ≥ 1 (aim 3), `takeaways` exactly 3, `reviewCard.keyTermIds` exactly 3.
- `completionRequirements`: `{ requireAllSlidesViewed: true, requireAnimationCompleted: false, requireExerciseIds: [first exercise id], minQuizScore: 0.8, requireSafetyCriticalCorrect: true }`.
- `prerequisites` must be earlier lessons only.
- Numeric exercise answers (`numeric`, `numeric-set`): same tolerance rule as quiz (`rounding.decimals` + half-step tolerance).

## 4. Glossary ownership (one course glossary)

`src/features/futures-edge/contracts/src/glossary-owners.ts` lists every term id and its owning lesson. **Define every term registered to your lesson** in your `glossary.ts` (`introducedIn` = your lesson). Do not define any other term (error). Reference terms owned by the same or **earlier** lessons freely with `[[id]]`, `glossaryRefs`, `relatedTermIds`, `keyTermIds`; do not reference terms owned by later lessons (define before use) except inside `notSameAs[].text` prose. Never use an alias id (`notional`, `support`, `candle`, …; see `GLOSSARY_ALIASES`). Do not invent new term ids (a warning = gate failure).
Glossary entry: `term`, `plainDefinition` (one line, no jargon), `technicalMeaning`, `example` (fictional numbers), `relatedTermIds`, optional `notSameAs` where confusion is common, optional `aliases` (display only).

## 5. Fixtures (all fictional)

```ts
{ id: 'FX-T05-PATH-01', kind: 'price-path', fictional: true, label: 'Fictional educational data — not a real market', displaySymbol: 'DEMO/USDT', units: { price: 'USDT per DEMO', time: 'ms' }, data: { label: 'fictional', ticks: [{ t: 0, p: 100 }, { t: 60000, p: 101 }] }, version: '1.0.0' }
```
- `ohlc-series`: `data: { interval: '1m', label: 'fictional', candles: [{ t, o, h, l, c, v? }], labels?: string[] }`. `t` = integer **ms offset**, strictly increasing, one interval apart (`'1m'` → 60 000). h ≥ max(o,c), l ≤ min(o,c), all > 0.
- `price-path`: `data: { label: 'fictional', ticks: [{ t, p, mark? }], interval?, finalCandle? }` (if `finalCandle` given it must equal first/max/min/last tick).
- `branching-paths`: free data `{ past: number[], branches: [{ id, label, points: number[], note? }], level?: { price, label } }` (used by `breakout-fakeout` / `branching-paths` scenes when the scene has `fixtureId`).
- Other kinds (`order-book`, `account-scenario`, `mock-terminal`, `classification-set`, `fee-schedule`, `toy-model`): free-form `data` (any JSON). Use them to give exercises a `fixtureId` that matches the activity.
- Symbols: `DEMO/USDT` and other obviously fictional names (`TOY/USDT`, `MOCK/USDT`). When teaching BTC (T01, T03) you may say BTC but every price must be labelled fictional/illustrative.

## 6. Shared illustrative constants (quote these exact numbers; D-12)

Taker fee 0.05% per side · maker fee 0.02% per side · slippage estimate 0.02% per side · funding +0.01% per 8-hour interval (positive rate: longs pay shorts) · maintenance margin rate 0.5% flat · illustrative tiers 0.5% / 1% / 2.5% · teaching examples only (never recommendations): risk per trade 1%, daily loss limit 3%, max 5 trades per session, stop after 2 consecutive losses. Always say rates are illustrative and vary by exchange/account.

## 7. Scene types and parameters

Set `parameters.variant` only for types that have a variant list. Data for some scenes comes from the scene's `fixtureId`.

| type | variants | parameters |
|---|---|---|
| `text-card` | plain, checklist, recap, red-flags, risk-warning | `heading` (req), `items` string[] (revealed one by one) |
| `value-exchange` | ledger-record, balance-quantity, value-from-price, swap | `asset`, `quote`, `quantity`, `prices` number[] (value-from-price steps through them), `entries` [{from,to,amount}] (ledger-record), `give`/`get` {asset,amount} (swap) |
| `supply-demand` | balanced, demand-up, supply-up, thin-market | `basePrice`, `stepPerLevel`, `buyers` [start,end], `sellers` [start,end] (toy model price = base + step × (buyers − sellers)) |
| `trading-pair` | price-tag, split, size-compare, convert-quote-to-base, reprice | `base`, `quote`, `price` (req); `quantities` (size-compare), `quoteAmount` (convert), `prices` + `quantity` (reprice) |
| `order-book-matching` | match, market-sweep, limit-partial-fill, bid-ask-spread, empty-book | `bids`, `asks`: [{price, quantity}] (req); `incoming` {side: 'buy'/'sell', quantity, limitPrice?} fills progressively |
| `order-placement` | open-close-buttons, market-vs-limit, stop-trigger, slippage-jump | `path` number[] (price samples), `orders` [{label, type: market/limit/stop-market/stop-limit, side: buy/sell, price? (limit), trigger? (stop), limit? (stop-limit)}], `slippage` (added to market/stop-market fills). Limit buy fills when path ≤ price; sell stop triggers when path ≤ trigger and fills at that sample's price (gap = slippage) |
| `price-path` | plain, horizon-compare | `points` (req), `markers` [{index, label}], `level` {price,label}; horizon-compare also `comparePoints`, `label`, `compareLabel` |
| `pnl-meter` | long-short-parallel, timeline, single-position | `path`, `entry`, `quantity` (req), `side` long/short, `exitIndex` (closes the position there: realized), `unit` |
| `sl-tp-lines` | setup, target-hit, stop-filled, gap-fill, stop-limit-unfilled, near-miss | `side`, `entry`, `stop`, `target` (req), `path` (not used by setup), `stopLimit` (stop-limit: fills only if price comes back to it), `quantity` |
| `fee-buildup` | compare-roles, waterfall, gross-to-net, break-even, accumulate | `entry` (req), `side`, `exit`, `quantity`, `entryFeeRate`, `exitFeeRate`, `spreadCost`, `slippageCost` (USDT), `trades` (accumulate), `notional`, `makerRate`, `takerRate` (compare-roles) |
| `mock-terminal-tour` | — | `areas` string[] from: wallet, security, watchlist, symbol, chart, order-book, order-entry, positions; `symbol` |
| `spot-vs-futures` | ownership, crash-comparison | `path`, `spotQuantity` (req), `futuresQuantity`, `margin` |
| `leverage-exposure` | exposure-bars, pnl-amplification | `margin`, `leverages` number[] (req), `movePercents` number[] (pnl-amplification steps through them), `side` |
| `margin-buffer` | margin-used-up, isolated-vs-cross, maintenance-gauge, tier-comparison | `side`, `entry`, `leverage`, `mmr` (req), `path`, `quantity`, `walletBalance` (isolated-vs-cross), `tiers` number[] (tier-comparison) — conceptual, labelled approximate |
| `funding-clock` | — | `notional`, `side`, `rates` number[] (one per interval, e.g. 0.0001) (req), `intervalHours` |
| `candle-formation` | forming, measure, compare, groups | forming: needs `fixtureId` (price-path ticks) + optional `range` [from,to] (0–1 slice); measure: `o,h,l,c`; compare/groups: `candles` [{o,h,l,c,label}] |
| `timeframe-aggregation` | — | needs `fixtureId` (1m ohlc-series); `groupSize` (req), `targetLabel` (e.g. '5m') |
| `market-structure` | — | `points` number[]: alternating swing low/high prices; labels HH/HL/LH/LL computed |
| `support-resistance-zone` | — | `points`, `zone` {low, high, kind: 'support'/'resistance'} (req); counts visits |
| `breakout-fakeout` / `branching-paths` | — | `past`, `branches` [{id,label,points}], `level` {price,label} — or put the same data in a `branching-paths` fixture and set `fixtureId`; `branchId` (with fixtureId) shows one branch |
| `volume-bars` | plain, retest | needs `fixtureId` (ohlc-series with `v`); `highlight` candle indexes |
| `range-overlay` | — | needs `fixtureId` (ohlc-series); `window` (req), `slide` boolean |
| `position-sizing` | risk-budget, builder | `entry`, `riskAmount`, `stops` number[] (req), `side`, `balance` |
| `trade-lifecycle` | full, decision-gate, journal | `steps` string[] (req, ≤ 8, short), `path`, `decision` (e.g. 'NO_TRADE'), `outcome` |

Unknown parameter keys are errors. Numbers in captions must match what the scene draws.

## 8. Exercise types and parameters

| type | parameters | expectedEvaluation |
|---|---|---|
| `choice-feedback` | `feedback` {choiceId: text}, `showChart` (draws the fixture) | exact-choice / choice-set; top-level `choices` required |
| `classify` | `items` [{id, text}], `buckets` [{id, label}] (req), `itemFeedback` {itemId: text}, `showChart` | classification `{ buckets: { bucketId: [itemIds] } }` covering every item once |
| `numeric-calculator` | `given` [{label, value, unit, decimals?}], `candleIndex` (draw that fixture candle), `showChart` | numeric / numeric-set |
| `slider-explore` | `sliders` [{key, label, min, max, step, value, unit}], `outputs` [{key, label, unit, decimals}] (req), `fixed` {key: number}, `side`, `sideToggle`, `note`, `question`, `feedback`, `showChart`; **needs `simulatorId`**: slider/fixed keys are the simulator's flat input keys (§9) and outputs its output keys | numeric/numeric-set (learner computes), exact-choice/choice-set (+`choices`, `question`), rubric/constraint (complete after moving every slider) |
| `sequence-order` | `items` [{id, text}] | sequence `{ order: [ids] }` |
| `hotspot-find` | `targets` [{area, prompt}] (areas as mock-terminal-tour) | sequence `{ order: [areas in the same order] }` |
| `order-match` | `book` [{price, quantity}] best first, `side` buy/sell, `quantity`, `limitPrice?` | numeric-set with keys from: filledQuantity, averagePrice, remainingQuantity, slippagePerUnit |
| `line-placement` | `side`, `entry`, `stop` {min,max,step,value}, `target` {…} (req), `quantity`, `scenarios` [{id, label, points}] (play bullish/bearish/gap), `question`, `feedback` | constraint (valid sides + every scenario played), numeric(-set), exact-choice/choice-set |
| `zone-placement` | `zone` {min,max,step,low,high} (slider bounds/initial), `reference` {low, high} (acceptable zone) (req), `question`, `feedback`; fixture = ohlc-series | choice-set / exact-choice over top-level `choices` (observations that count as confirmation; include a WAIT-style option) |
| `candle-builder` | `tasks` [{id, direction: bullish/bearish/doji}], `min`, `max`, `step`; fixture = 1-candle ohlc-series | constraint (simulatorId ohlc.validate) |
| `timeframe-switch` | `groupSizes` (default [1,5,15]), `question`, `feedback`; fixture = 1m ohlc-series | numeric-set (e.g. keys o,h,l,c of a requested aggregated candle) or exact-choice/choice-set |
| `lookback-range` | `window` {min, max, value}; fixture = ohlc-series | numeric / numeric-set (e.g. range, rangePercent for the window named in the steps) |
| `position-size` | `playground` {balance, riskAmount, entry, stop, side}, `scenario` {text} | numeric / numeric-set (e.g. stopDistance, quantity, notional) |
| `decision-with-rationale` | `reveal` number[] (cumulative candles visible per stage), `checklist` [{id,text}], `context` string[], `decisionFeedback` {choiceId: text}, `minRationale`; fixture = ohlc-series | decision `{ acceptable: [...], decisionSet?: 'trade'/'session'/'risk-check', requiresRationale: true, rationaleCues: [...] }`; top-level `choices` each with `decision` (BUY/SELL/WAIT/NO_TRADE …) |
| `capstone-lifecycle` | `coins` [{id,label,note,suitable}], `risk` {side, entry, stop, target, riskAmount, feeRate, slippageRate}, `branches` [{id,label,points}] (req), `lookback`, `replayBranch`, `uncertaintyPrompt`; fixture = 1m ohlc-series (15 candles) | rubric with criteria ids from: market-choice, levels, uncertainty, risk-math, decision-justified, journal |

Exercise `choices` that are decisions carry `decision: 'BUY' | 'SELL' | 'WAIT' | 'NO_TRADE' | 'STOP_TRADING' | 'CONTINUE_SIM_PRACTICE' | 'OK_FOR_SIM' | 'WARNING'`; the UI shows them as "DEMO …".

## 9. Simulator flat keys (formulas[].workedExamples and slider-explore)

`side` goes in the worked example's `side` ('long' default / 'short'), not in `inputs`. Outputs listed are the keys you may assert.

| simulatorId | inputs | outputs |
|---|---|---|
| pair.convert | quantity, price · or · quoteAmount, price | quoteValue · or · quantity |
| price.percent-change | oldPrice, newPrice | percentChange |
| price.linear-toy | buyers, sellers, basePrice, stepPerLevel | price |
| ohlc.validate | o, h, l, c | valid (1) |
| ohlc.anatomy | o, h, l, c, bodyToRangeMax | body, upperWick, lowerWick, range |
| ohlc.aggregate | o1,h1,l1,c1 … oN,hN,lN,cN, groupSize | o, h, l, c (first group) |
| orders.fill | quantity, p1,q1 … pN,qN, limitPrice? (long = buy against asks, short = sell against bids) | filledQuantity, remainingQuantity, averagePrice, slippagePerUnit |
| pnl.linear | entry, exit, quantity | grossPnl, priceChange, percentMove, entryNotional |
| fees.net | entry, exit, quantity, entryFeeRate, exitFeeRate, spreadCost?, slippageCost? · or (break-even) entry, entryFeeRate, exitFeeRate | grossPnl, entryFee, exitFee, otherCosts, totalCosts, netPnl · or breakEven, movePercent |
| fees.estimate-round-trip | notional, feeRate, slippageRate | estimate |
| risk.reward | entry, stop, target, quantity? | riskPerUnit, rewardPerUnit, ratio, risk, reward |
| leverage.exposure | margin, leverage, movePercent | notional, grossPnl, returnOnMarginPercent |
| liquidation.approx | entry, leverage, mmr · or entry, collateral, quantity, mmr (formula must be `approximate: true`) | liquidationPrice, distancePercent |
| funding.payment | notional, rate, intervals? | paymentPerInterval (positive = this side pays), total |
| risk.position-size | riskAmount, entry, stop, costPerUnit?, sizeStep?, accountBalance? | stopDistance, stopDistancePercent, quantity, notional, impliedLeverage |
| range.lookback | h1,l1 … hN,lN, window | max, min, range, rangePercent ((max − min) ÷ min × 100) |

Use `tolerance: 1e-9` for exact arithmetic or a small value like `0.005` when you rounded the learner-visible number. Every number in a worked example must also appear in the learner-visible text.

## 10. Teaching rules (master prompt §2)

- Persona: complete beginner (Malayalam/English speaker) who knows nothing. Simple English, short sentences, define every term before using it (link its first mention with `[[id]]`).
- Rhythm per concept: plain meaning → everyday analogy → visible motion → numeric worked example (units on every number) → interaction → common mistake + correction → 3-point takeaway + quick revision + retrieval question.
- Honest boundaries: prices move unexpectedly; market and stop orders can slip; leverage magnifies losses; fees can eat scalping gains; AI signals are uncertain; **WAIT / NO_TRADE is always allowed**. Never promise profit, never call anything safe, risk-free or guaranteed. No shaming.
- Binance: say "for example on Binance", use the generic educational mock only, say layouts change, no logos, no exact current UI labels or availability claims, no API keys, no real orders. India: no tax or legal statements beyond "rules differ by country; check current local rules and get qualified advice".
- No personalised recommendations (no "use 1%" — say "for example, some learners study 1% as an illustration").
