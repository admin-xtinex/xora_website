# XORA Futures Edge — Task board (EDGE-00) · updated Mon 19 Oct 2026, ~08:14 IST · contracts v1.3.0

Statuses: **NOT STARTED / IN PROGRESS / COMPLETE / BLOCKED**. Nothing is COMPLETE without paths, test output and a run command.

## Per bot

| Bot | Wave | Status | Notes / evidence |
|---|---|---|---|
| EDGE-00 Mission Control | 0 | **IN PROGRESS** | Audit done. Contracts **v1.3.0** + decisions.md (D-01…D-56) + CHANGELOG (with migration list) on the box. strict tsc exit 0; selftest 95/95; repo-tsconfig (TS 7.0.2) check exit 0; probe covers EDGE-02/03/04/05. Branches approved (D-02). **Committed to repo** (Wave 0 commit on `futures-edge/edge-00-mission-control`, merged into `feature/futures-edge`, which was fast-forwarded to `main` @ `58ca3fc6`). All 12 bot branches (edge-00…edge-11, names per ownership.md) **exist** at that `feature/futures-edge` tip. Repo paths live: `src/features/futures-edge/contracts/`, `docs/futures-edge/`. **Remaining:** D-01/D-03/D-04 open. |
| EDGE-01 Learning Platform | 1 | NOT STARTED (ready: contracts committed, branch exists) | Scaffold-only PR first. Stack depends on D1 (default Vite+React18+TS). |
| EDGE-02 Crypto Foundations | 2 | **COMPLETE (staged), branch ready** | T01–T04 at `drafts/edge-02/`; probe 0/0; partial course T01–T15 0 errors. v1.3.0 follow-ups: add `blockchain` (T01) + `peg` (T03) entries (validate-phase01 170/172 until then; verified 174/174 on a /tmp copy with both added); T02 fixtures (D-55); schemaVersion '1.3.0'; fix own `crosscheck-t01-t13.ts` TS2345 (tsc exit 2). CP1 proposals → EDGE-09. |
| EDGE-03 Trading Fundamentals | 2 | **COMPLETE (staged), branch ready** | T05–T09 at `drafts/edge-03/` (HANDOFF: 506 golden tests, own gates). v1.2.0 follow-ups (D-35/D-37): add T06 `mark-price` entry; T08-X01 tol 0.005; optional D-36 `branch`→`variant`. Until then: validate-phase02 4 gate failures, golden 505/506. |
| EDGE-04 Binance & Futures | 2 | **IN PROGRESS** | T10–T13 staged at `drafts/edge-04/`. v1.2.0: tsc 0; validator 4 errors (mark-price owner move, D-35) + 2 T13 tolerance warnings (D-37); golden 56/58 (T10, T13); crosscheck_calc.py exit 0. |
| EDGE-05 Market Analysis | 1 (T14), 2 (T15–T18) | **IN PROGRESS** — T14 COMPLETE (staged), branch ready; accepted as Phase 4 template (D-49) | T14 probe 0/0, tests 33/34 (owner test needs `candle-range`, D-44; verified 34/34 on a /tmp copy). T15 staged (probe 0/0); T16–T18 folders started. v1.3.0: fixtures (D-55), pin schemaVersion '1.3.0'. |
| EDGE-06 Scalping & Risk | 2 | **IN PROGRESS** | T19–T23 staged at `drafts/phase-05/` as pre-contract JSON (own validator PASS). Must migrate to v1.1 shape (D-19), MMR-inclusive liquidation (D-13), glossary refs (D-11d), add short examples (D-17). |
| EDGE-07 Motion Studio | 1 | NOT STARTED (unblocked) | 25 scene types + `SCENE_VARIANTS` (D-08); `candle-formation` first, then the types used by staged T05–T13. |
| EDGE-08 Simulation Lab | 1 | NOT STARTED (unblocked) | 14 `SIMULATOR_IDS` (D-14), `constants.ts` baseline (D-12), canonical `liquidation.approx` (D-13). Priority: pnl.linear, fees.net, leverage.exposure, liquidation.approx, funding.payment, risk.position-size, ohlc.*. |
| EDGE-09 Assessment & Progress | 1 | NOT STARTED (unblocked) | Local-only demo adapter; CP1/CPA/CPB; decision sets + abstention tracking (D-16); threshold 0.8 configurable (D-06). |
| EDGE-10 Accessibility & QA | 3 | NOT STARTED | Can build `qa/validate-content.ts` + boundary checks in Wave 1. |
| EDGE-11 Release Integrator | 4 | NOT STARTED | Merges only; no deploy without authorization. |

## Per tutorial
Columns: slides | notes | animation | exercise | quiz | reviewed (EDGE-10) | integrated (EDGE-11).
✓ = present and passes `validateLesson` v1.3.0 (0 errors) in the EDGE-00 probe; d = drafted in a non-contract format (not yet contract-valid); – = not done.
Nothing is COMPLETE until EDGE-10 has reviewed it and EDGE-11 has integrated it.

| ID | Title | Owner | Status | sl | no | an | ex | qz | rv | in |
|---|---|---|---|---|---|---|---|---|---|---|
| T01 | What Is Cryptocurrency? | EDGE-02 | **COMPLETE (staged), branch ready** | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T02 | Why Do Crypto Prices Move? | EDGE-02 | **COMPLETE (staged), branch ready** | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T03 | Understanding Trading Pairs: BTC/USDT | EDGE-02 | **COMPLETE (staged), branch ready** | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T04 | Exchanges & Market Basics | EDGE-02 | **COMPLETE (staged), branch ready** | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T05 | BUY, SELL, LONG, SHORT | EDGE-03 | **COMPLETE (staged), branch ready** | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T06 | Entry, Exit & Profit/Loss | EDGE-03 | **COMPLETE (staged), branch ready** | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T07 | Market, Limit and Stop Orders | EDGE-03 | **COMPLETE (staged), branch ready** | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T08 | Stop-Loss & Take-Profit | EDGE-03 | **COMPLETE (staged), branch ready** | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T09 | Fees, Spread and Slippage | EDGE-03 | **COMPLETE (staged), branch ready** | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T10 | Binance Platform Orientation (Educational Mock) | EDGE-04 | IN PROGRESS (staged; content v1.0.1 accepted, D-50) | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T11 | Spot versus Futures | EDGE-04 | IN PROGRESS (staged) | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T12 | Margin and Leverage | EDGE-04 | IN PROGRESS (staged) | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T13 | Liquidation, Funding and Futures Risks | EDGE-04 | IN PROGRESS (staged; content v1.0.1 accepted, D-50) | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T14 | Candlesticks: Open, High, Low, Close (REFERENCE) | EDGE-05 | **COMPLETE (staged), branch ready** (Phase 4 template, D-49) | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T15 | 1m / 5m / 15m Timeframes | EDGE-05 | IN PROGRESS (staged) | ✓ | ✓ | ✓ | ✓ | ✓ | – | – |
| T16 | Trend and Market Structure | EDGE-05 | IN PROGRESS | – | – | – | – | – | – | – |
| T17 | Support, Resistance, Breakout and Fakeout | EDGE-05 | IN PROGRESS | – | – | – | – | – | – | – |
| T18 | Volume, Volatility and Historical Range | EDGE-05 | IN PROGRESS | – | – | – | – | – | – | – |
| T19 | What Is Scalping? | EDGE-06 | IN PROGRESS (staged, pre-contract) | d | d | d | d | d | – | – |
| T20 | Evaluating an Entry Opportunity | EDGE-06 | IN PROGRESS (staged, pre-contract) | d | d | d | d | d | – | – |
| T21 | Confirmation, False Signals and NO_TRADE | EDGE-06 | IN PROGRESS (staged, pre-contract) | d | d | d | d | d | – | – |
| T22 | Position Sizing and Risk Budget | EDGE-06 | IN PROGRESS (staged, pre-contract) | d | d | d | d | d | – | – |
| T23 | Full Scalping Decision Lifecycle | EDGE-06 | IN PROGRESS (staged, pre-contract) | d | d | d | d | d | – | – |

| Checkpoint | After | Owner | Status |
|---|---|---|---|
| CP1 (8 items, non-gating) | T04 | EDGE-09 (+ EDGE-02 items) | NOT STARTED: 8 proposals from EDGE-02 forwarded (D-51) |
| CPA (20–25 items, safety-critical mandatory) | T13 | EDGE-09 | NOT STARTED |
| CPB (20–25 + 2 chart, 2 risk-math, 1 demo scenario) | T23 | EDGE-09 | NOT STARTED |

## Staged-draft evidence (EDGE-00 probe, `cd docs/tools && npx -y tsx probe-drafts.ts`, read-only)
- v1.3.0 run (~08:14 IST): T01–T15 (15 lessons) PASS 0 errors / 0 warnings; partial course T01–T15 0 errors (pending owners T16/T18 only). validateFixture (informational): EDGE-02 T02 2 fixtures, EDGE-04 T11 1 + T13 2, EDGE-05 T14 4 + T15 1 need D-55 fixes; EDGE-03 all clean. EDGE-02 validate-phase01 170/172 (blockchain, peg), EDGE-03 gates PASS + 523/523, EDGE-04 0 errors + 59/59, EDGE-05 T14 33/34 (candle-range).
- v1.2.0 run (~08:02 IST): T05–T09 PASS, 0 errors (T08: 1 TOLERANCE_BELOW_HALF_STEP). T10 FAIL (GLOSSARY_OWNER_MISMATCH mark-price, D-35); T11/T12 PASS 0/0; T13 PASS with 2 tolerance warnings. Partial course T05–T13: 5 errors, all mark-price (T10 duplicate definition, plus T06/T11/T13 unresolved until T06 defines it).
- v1.1.0 run: T05–T09 PASS, 0 errors, 0 warnings.
- T10–T13 (EDGE-04): PASS, 0 errors; warnings: DEPRECATED_MODE ×9, DEPRECATED_PARAM_CHOICES ×1.
- Partial course T05–T13: 0 errors; 14 pending-owner glossary refs → EDGE-02 (T02–T04).
- T19–T23 (EDGE-06): 201–286 errors each vs contracts (shape/naming; D-19). Its own `node validate.mjs` PASS.

## Dependency DAG

```
EDGE-00  audit + contracts v1.2.0  ── (commit to feature/futures-edge: needs user approval)
   │
   ├──► EDGE-01a scaffold PR (package.json, configs, src/, content/index.ts registry, flag OFF)
   │        │
   │        ├──► EDGE-01b shell/player ──────────────────────────────┐
   │        │                                                         │
   ├──► EDGE-07 motion registry + scenes ────────────────┐            │
   ├──► EDGE-08 simulators + shared fixtures ────────────┤            │
   ├──► EDGE-09 quiz/grader/progress/checkpoint configs ─┤            │
   ├──► EDGE-05 T14 reference lesson ────────────────────┼──► EDGE-01 renders T14 end-to-end (Wave 3 gate)
   │                                                     │            │
   │    (T14 accepted → template frozen)                 │            │
   ├──► EDGE-02 T01–T04 ┐                                │            │
   ├──► EDGE-03 T05–T09 ├── need: contracts; scene/exercise types; EDGE-08 for shared fixtures
   ├──► EDGE-04 T10–T13 │                                │            │
   ├──► EDGE-05 T15–T18 │                                │            │
   └──► EDGE-06 T19–T23 ┘                                │            │
                         └───────────────► EDGE-10 QA (validate-content, a11y, E2E) ──► EDGE-11 integrate ──► EDGE-00 sign-off
CP1 needs T01–T04 questions · CPA needs T01–T13 · CPB needs T14–T23 (EDGE-09 can build configs and engine earlier)
```

## Wave plan

| Wave | Who | Starts when | Exit criteria |
|---|---|---|---|
| 0 (serial) | EDGE-00 | now | Audit + contracts + ownership published **and committed** to `feature/futures-edge`; user answered D1/D2 |
| 1 (parallel) | EDGE-01 (scaffold first, then shell), EDGE-07, EDGE-08, EDGE-09, EDGE-05 (T14 only), EDGE-10 (validator runner + boundary script only) | Wave 0 exit | T14 validates; T14 scenes play; T14 sims tested; quiz + local progress work; shell renders T14 behind the flag |
| 2 (parallel) | EDGE-02, 03, 04, 05 (T15–T18), 06; EDGE-07/08 add approved types | T14 accepted as reference (content bots may draft earlier) | 23 lessons pass `validateCourse` with 0 errors |
| 3 (stabilize) | EDGE-01 wires all, EDGE-09 connects CP1/CPA/CPB, EDGE-10 audits all 23 | Wave 2 PRs open | No critical a11y/safety/function defects |
| 4 (serial) | EDGE-11, then EDGE-00 sign-off | EDGE-10 gate passed | Full gate evidence, release report, rollback plan; no deploy without authorization |
