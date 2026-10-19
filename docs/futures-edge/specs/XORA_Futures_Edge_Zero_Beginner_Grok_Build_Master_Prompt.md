# XORA FUTURES EDGE — ZERO-KNOWLEDGE LEARNING SYSTEM
## Extremely detailed Grok Build implementation prompt — Version 2.0
### Scope: Batch 1 (T01–T13) + Batch 2 (T14–T23), educational website content and platform

> **INSTRUCTIONS TO GROK BUILD:** You are acting as a senior instructional designer, financial-education editor, React/frontend engineer, interactive motion designer, UX writer, accessibility specialist, assessment designer and test engineer. Build a **working, visually polished, beginner-first learning experience**, not a mockup, outline, marketing page or a set of empty cards. All actual lesson text, definitions, slide contents, captions, illustrated examples, animations, quizzes, exercises and answer explanations must be implemented. Do not leave “TODO: content here.”

## 0. Product truth and scope

- Product: **XORA**, under **XTINEX**. Official website: `https://xora.xtinex.com` (do not assume a path already exists).
- Learning brand: **XORA Futures Edge**. Marketing intent: reduce *unnecessary initial complexity* and *manual analysis effort*, while retaining essential safety and risk knowledge. The informal “75% versus 25% learning” idea is a creative simplification, **not a measured claim**: do not assert verified 75% reductions.
- XORA phase-one offer: **crypto market analysis, futures-scalping education, trading decision support and simulated practice**. **NO direct Binance live execution** in public onboarding. No promise of profit, AI certainty, risk-free scalping, or guaranteed skill after certificate.
- Build **23 tutorials across five phases** with notes, definitions, slide-style presentations, native HTML/SVG/CSS animations, interactive practice and examinations. Each lesson targets absolute beginners who may not know BTC, USDT, a chart or what “buy” means.
- **Never send a real exchange order, request API keys, or couple learner actions to production trade endpoints.** Keep existing bot/AI/execution/WebSocket code untouched. Do not silently modify existing route/auth/schema infrastructure.
- Research/verify exact Binance UI labels, current product availability and regulatory constraints before making *current* claims. Use generic educational mock screens where actual UI is unverified. Do not rely on Binance logos or assets unless usage rights are clear. India-facing disclaimers and tax statements require up-to-date legal review; avoid individualized advice.

## 1. First workflow: discovery, design and implementation

1. Perform **read-only repo audit**: framework, routes, current UI components, typography, theme, auth, storage, course systems, supported languages, test setup, deployment and existing market/chart components.
2. Present a concrete file-by-file implementation plan, reuse-first component map, current state and safety boundaries. Use an evolving checklist with `Not started / In progress / Complete / Blocked` and link every milestone to actual file paths.
3. Confirm via code inspection which app resources are reusable. If repo access is absent, create a standalone integration-ready implementation with adapter interfaces; clearly mark unverified integrations. Do not invent an existing route or claim deployed success.
4. First implement **one end-to-end exemplary tutorial** (T14 Candlesticks) that includes all formats: 5-slide deck, rich notes/definitions, narrated-equivalent captions, animated scene, draggable practice, quiz, completion persistence. Then reuse the common engine for all lessons.
5. Implement all 23 **fully authored** lessons, checkpoint exams, progress tracking, mobile UX, loading and error states; test locally and provide real test results. No placeholders.
6. Keep all tutorial educational flows isolated from production trading domain. Make all simulations deterministic/offline-capable with synthetic data and clearly labeled fictional price scenarios.

## 2. Learner persona and teaching rules

Primary persona: a Malayalam/English-speaking complete beginner who knows **nothing** about cryptocurrency, finance, Binance, leverage or candlestick charts, using Android or desktop and learning in short sessions. Initial authored language can be simple **English** with structured localization keys; prepare Malayalam and Hindi translation hooks rather than unreviewed automated translations. Avoid jargon in first mention; always define *before* using it.

Each explanation follows this exact rhythm:
1. **One-line plain-English meaning** (“A trading pair tells you which asset is being priced against another.”)
2. **Everyday analogy** (optional and accurate; currency exchange, grocery price tag, safety belt, etc.).
3. **Visible motion example** (HTML/SVG animation showing a single change).
4. **Numeric worked example** (all units displayed, no unexplained shortcuts).
5. **User interaction** (drag/click/choose/pause).
6. **Common mistake + correction**.
7. **Three-point takeaway**, quick revision note, one retrieval question.

Teach realistic boundaries: price can move unexpectedly; market orders and stops can slip; leverage magnifies losses; fees can consume scalping gains; AI signals are uncertain; learners must be able to choose **WAIT / NO_TRADE**. Avoid presenting trading as an easy income source. Do not shame people for mistakes.

## 3. Tutorial content package: mandatory assets per tutorial

**Deliver all elements below for T01–T23, not only selected hero lessons:**

**A. Lesson metadata:** stable tutorial ID, phase ID, friendly learner title, one-sentence objective, prerequisite IDs, three measurable learning outcomes, estimated runtime, difficulty, new glossary terms, content version, completion requirements.

**B. A five-to-seven-slide native HTML presentation** (think PowerPoint slides but implemented as a responsive website): cover/problem; key definition; visual breakdown; worked example; risks/common misunderstanding; guided practice instruction; final recap (can merge to 5 where appropriate). Slides have a Next/Back controller, keyboard arrows, progress dots, screen-reader-compatible contents, optional speaker notes, expand-to-fullscreen where supported, and reduced-motion alternative. **No need to create .pptx as part of the website.** Provide print-friendly slide/notes view.

**C. Full written lesson/notes:** 300–650 words for simple topics; 450–900 for complex risk topics. Headings `Meaning`, `Why it matters`, `Example`, `How to recognize it`, `Common mistakes`, `Safety note`, `Quick revision`. Give at least two concrete examples with numbers where it makes sense. Include collapsed “Learn more” content without blocking beginners.

**D. Glossary cards:** every new concept has simple definition, technical meaning, example, related concepts, and “not the same as…” where confusion is common. Inline tooltips and searchable course glossary. The first mention of the term opens definition without leaving the lesson.

**E. Video-like animated scene**, authored in HTML/CSS/SVG/Canvas as appropriate, not required MP4. A timeline of **4–8 steps per lesson**, around 90–240 seconds with Play/Pause/Replay/Speed (0.75x, 1x, 1.25x), step navigation, clear captions and optional audio narration added only if assets are available. The timeline must be fully legible without audio. Animations should depict **meaningful changing state**, not just pulsing boxes or entrance fades.

**F. Hands-on exercise:** at least one learner-controlled activity (slider, drag and drop, sequence, hotspot, branching chart, or multiple-choice-with-feedback), 2–4 steps with hints and immediate feedback, keyboard equivalent and Reset. Mark all prices as fictional unless explicitly proven historical.

**G. Assessment:** 3–5 micro-check questions per tutorial: at least one interpretation question and one mistake/risk question; provide correct answer, why correct, why distractors are wrong, optional remediation link. Shuffle options only when safe and retain stable answer IDs. Progress should reflect actual understanding, not only clicking Play.

**H. Review card:** one-screen recap, 3 key terms, main safety note, estimated review time, “Practice again,” “Retake quiz,” “Continue” CTA. Optionally export notes/print from the browser; no external PDF service required.

## 4. Course navigation and UX

Home: Intro panel -> “New to crypto?” diagnostic (optional, no gate) -> 5-phase roadmap -> lesson cards -> progress -> checkpoint badges. Include global glossary, Continue Learning, Review Weak Topics, FAQ, Accessibility and Feedback.

Lesson layout desktop: collapsible phase sidebar; central animated lesson/presentation area; right-side definition/notes panel. On mobile: single column with bottom sticky `Back / Next`, swipe-safe controls, transcript/notes accordion. User can switch **Watch animation / Read notes / View slides / Try it / Take quiz** with identical conceptual content, not separate contradictory courses. Never hide risk notes behind paywalls.

Save per-user phase, lesson, scene, slides, quiz attempts, completion timestamps, last position. Support signed-out sample lessons through local state; authenticated progress via existing app patterns only after auditing. Do not expose or log sensitive trading/account information. Handle refresh/reconnect and content-version migrations safely.

## 5. Full syllabus & precise scene/storyboard requirements

### PHASE 1 — CRYPTOCURRENCY FOUNDATIONS (T01–T04)
Goal: identify assets, prices, pairs, exchanges and volatility without requiring blockchain engineering.

**T01 — What Is Cryptocurrency?**
- Define: money/value, digital asset, cryptocurrency, Bitcoin (BTC), token, wallet at a basic level.
- Slides: physical vs digital value; crypto as digital asset; BTC example; what is/isn't ownership; risks; recap.
- Animated storyboard: 1) human sees BTC ticker; 2) BTC is a digital asset, not a coin in the phone; 3) fictional BTC balance appears; 4) price changes; 5) value of balance changes; 6) risk warning.
- Interaction: choose what counts as crypto vs unrelated digital objects; compute value of `0.002 BTC × sample price`.
- Important correction: crypto is not guaranteed by a government and pricing is volatile; distinguish user holdings vs derivatives.

**T02 — Why Do Crypto Prices Move?**
- Define: buyer, seller, demand, supply, market price, liquidity, volatility.
- Slides: market of buyers and sellers; buyer demand; seller pressure; price path; surprises; recap.
- Animation: animated buy and sell queues; relative demand increases; price ticks up; selling pressure increases; price ticks down; jagged path vs smooth misconception.
- Interaction: adjust buyer/seller intensity sliders and watch an **illustrative** price model; mark “not a prediction of real markets.”
- Explain price not always follows simple headcount, and news or low liquidity can cause rapid changes.

**T03 — Understanding Trading Pairs: BTC/USDT**
- Define: base asset, quote asset, symbol, BTCUSDT, USDT stablecoin, quantity, notional value.
- Slides: price tags; two halves of pair; `BTC/USDT`; worked example; changing price; recap.
- Animated scene: price label and balance calculator update as BTC price changes; show difference between 1 BTC and 0.001 BTC.
- Interaction: user sets BTC quantity and quoted price; show `value in USDT = BTC amount × USDT per BTC`.
- Clarify stablecoins have risks and are not guaranteed to remain pegged.

**T04 — What Does an Exchange Do?**
- Define: exchange, trading platform, order, order book, bid, ask, spread, liquidity, account security.
- Slides: meeting place for orders; bid/ask; mock order matching; spread; Binance as example; safety.
- Animation: safe mock buyers/sellers enter an order book; match on compatible prices; spread adjusts.
- Interaction: match one fictional buy order against sell quotes; locate fake phishing vs genuine security cues in a mock.
- Warning: exchange is not a bank; never share passwords, OTP or API secret keys.

**Checkpoint after T04:** 8-question non-gating foundational review; offer remedial lessons.

### PHASE 2 — TRADING FUNDAMENTALS (T05–T09)
Goal: understand directional positions, orders, PnL, protective orders and trading costs.

**T05 — BUY / SELL / LONG / SHORT**
- Define spot buying/selling versus futures long/short. Buying spot is NOT automatically the same as going long with margin.
- Slides: ownership vs position; long; short; rising/falling price; risks; recap.
- Animation: one underlying price path with parallel long/short PnL meters; outcomes flip when market reverses.
- Interaction: choose position side and forecast direction, watch a predetermined price path; learner labels profit/loss without promising results.

**T06 — Entry, Exit and Profit/Loss**
- Define entry price, exit price, position quantity/notional, realized/unrealized PnL, gross/net result.
- Formula examples: spot gross PnL `(exit-entry)×asset quantity`; linear USDT-margined futures long and short simple worked examples, clearly noting approximate simplifications and fees/funding excluded where appropriate.
- Animation: click an entry marker, animate moving price, click exit; gross PnL and fee-adjusted result appear.
- Interaction: independently adjust entry, exit, size, side and fees; use explicit units.

**T07 — Market, Limit and Stop Orders**
- Define: market order, limit order, stop trigger, fill, partial fill, slippage.
- Slides: order intention; immediate vs price-specific; trigger; fill behavior; non-guarantees; recap.
- Animation: mock order book fills different orders; fast price jump produces slippage; a limit order remains unfilled.
- Interaction: user selects order type for sample scenario; receive trade-off feedback. Avoid stating stop orders guarantee execution price.

**T08 — Stop-Loss and Take-Profit**
- Define: stop-loss, take-profit, trigger, execution price, risk/reward ratio.
- Animation: drag entry/SL/TP horizontal lines on fictional chart, play bullish, bearish and gap scenarios; mark triggered vs filled.
- Interaction: drag lines with keyboard-accessible numeric inputs; calculate approximate risk and potential reward before fees.
- Cover: stops can slip, liquidation may occur, TP can remain unfilled, and risk/reward is not win probability.

**T09 — Fees, Spread and Slippage**
- Define: maker/taker where appropriate, fee rate, spread, slippage, funding as separate futures cost.
- Animation: gross tiny scalping profit gets reduced by entry and exit fees/spread/slippage; show break-even move.
- Interaction: fee sliders and spread inputs; compare gross vs net PnL with no magical assumptions. Include a scenario where a gross winner is a net loser.
- Warn to verify actual exchange rates/account tier before acting; this is a model.

### PHASE 3 — BINANCE & FUTURES ESSENTIALS (T10–T13)
Goal: read a generic futures terminal and understand major risks without connecting or placing live orders.

**T10 — Binance Platform Orientation (Educational Mock)**
- Explain: watchlist, symbol, chart, order book, order-entry panel, open positions, PnL, wallet, security/settings.
- Slides: overall layout; find pair; find chart; find positions; security; recap.
- Interaction: hotspot hunt in fictional mock terminal; keyboard equivalents and step-by-step tooltips.
- Note: Binance layout changes; do not pretend mock is a current pixel-accurate screenshot. No API keys or real orders.

**T11 — Spot versus Futures**
- Define: spot asset, perpetual futures contract, underlying, exposure, settlement concept, long/short, risk.
- Animation: side-by-side spot asset balance vs derivative position notional; follow identical price changes, distinguish actual ownership.
- Interaction: classify 5 examples as spot/futures; show futures can incur funding and liquidation risk.

**T12 — Margin and Leverage**
- Define initial margin, notional exposure, leverage factor, maintenance margin, isolated vs cross margin.
- Animation: same price path shown under 1x, 3x, 10x; compare gross PnL relative to margin and notional.
- Interaction: sliders for margin, leverage, price move; formula `notional ≈ margin×leverage`, `gross PnL ≈ notional × signed percentage move` for a simplified linear contract; distinguish wallet risk. Make clear return on margin is magnified in both directions.
- **No predetermined fake liquidation threshold** or suggestion of safe leverage; actual liquidation depends on exchange rules and costs.

**T13 — Liquidation, Funding and Futures Risks**
- Define liquidation, maintenance margin, mark price, funding rate, forced closure, gap risk.
- Animation: margin buffer shrinks as adverse price moves; separate funding clock shows periodic charges/credits; liquidation animation is conceptual, not a precise exchange model.
- Interaction: identify when to reduce exposure or abstain in scenarios; explain no guaranteed safe strategy and that a stop loss is not liquidation insurance.
- End **Batch 1 Formal Checkpoint**: 20–25 questions with 80% target plus mandatory correctness/review for leverage, liquidation and account-security critical items.

### PHASE 4 — CHARTS & MARKET ANALYSIS (T14–T18)
Goal: interpret price movement without pretending any candle predicts the future.

**T14 — Candlesticks: Open, High, Low, Close** (**REFERENCE QUALITY LESSON**)
- Teach OHLC with a full 5–7-slide presentation, 500+ word beginner notes and 5+ motion steps.
- Animation: a live-forming 1-minute fictional candle; show opening price, changing last price, evolving high and low, closing body and wicks. Transition to green/up and red/down examples.
- Interaction: sliders for open/high/low/close with constraints `high≥max(open,close)` and `low≤min(open,close)`; keyboard numeric fields; label body/wick; give doji example.
- Quiz: identify OHLC on chart, bullish vs bearish, distinguish wick from close.

**T15 — 1m / 5m / 15m Timeframes**
- Define timeframe, candle aggregation, noise, signal and higher-timeframe context.
- Animation: assemble five 1-minute fictional candles into a correct 5-minute OHLC candle; 15-minute view built similarly.
- Interaction: switch timeframe on **same underlying raw timeline**; keep aggregation numerically consistent; answer which changes are representation vs underlying market events.
- Warn shorter timeframes are noisy and do not guarantee opportunities.

**T16 — Trend and Market Structure**
- Define uptrend, downtrend, sideways, higher high, higher low, lower high, lower low.
- Animation: price path writes to chart; extrema highlighted; pattern changes from higher highs/lows to sideways and reversal.
- Interaction: tap peaks/troughs and classify three sample charts. Explain boundaries of subjective identification.

**T17 — Support, Resistance, Breakout and Fakeout**
- Define support/resistance as zones, test/retest, breakout, fake breakout, confirmation.
- Animation: repeated touches of zone, breakout continuation in one branch, false breakout/re-entry in another.
- Interaction: user places a **zone**, predicts not outcome but which observations would count as confirmation; WAIT allowed.
- Warn no certainty from historical lines and thin liquidity can distort patterns.

**T18 — Volume, Volatility and Historical Range**
- Define traded volume, range, volatility, previous high/low, liquidity context; avoid equating volume alone with conviction.
- Animation: bars aligned with corresponding candles; low/high volume samples, quiet vs volatile market; previous 10–15 minute range overlay.
- Interaction: drag lookback window to compute max, min, range %, compare two scenarios and explain limitations.

### PHASE 5 — SCALPING & RISK MANAGEMENT (T19–T23)
Goal: learn a disciplined *evaluation workflow*, not “easy money” or guaranteed setup.

**T19 — What Is Scalping?**
- Define scalping, short duration, holding period, price move, trade frequency, costs and execution quality.
- Animation: 15-minute fictional chart with 1–2 candidate short-term observations; many trades increase accumulated fees and opportunities for losses.
- Interaction: compare scalping versus a longer holding horizon; identify situations where trading is inappropriate.
- Clarify 10–15 minutes is XORA's analysis horizon proposal, **not mandatory holding time or a fixed prediction window**.

**T20 — Evaluating an Entry Opportunity**
- Teach sequence: current trend → recent price range → level/zone → volume/liquidity context → risk budget → tentative decision.
- Animation: add one analysis layer at a time to same fictional coin; neutral/uncertain signals produce a no-trade decision.
- Interaction: checklist user fills from chart; select BUY / SELL / WAIT; require rationale, not only direction.

**T21 — Confirmation, False Signals and NO_TRADE**
- Explain what confirmations can and cannot establish, weak vs conflicting evidence, hindsight bias, false breakout, momentum fade.
- Animation: branching future paths from identical past chart, illustrating no certain outcome; avoid perfect-foresight instruction.
- Interaction: reveal limited candles step by step and allow WAIT, BUY or SELL; use feedback on reasoning rather than outcome-only scoring.

**T22 — Position Sizing and Risk Budget**
- Define account balance, risk-per-trade budget, stop distance, notional, position size, leverage exposure, drawdown.
- Animation: same stop distance with small vs large notional; risk bar and loss impact.
- Interaction: set hypothetical account balance, **illustrative** risk budget, entry/stop price and direction; calculate `allowed notional ≈ risk amount ÷ |entry-stop|/entry` (simple model before costs, contract constraints and liquidation). Show safe input validation and warnings where impossible/meaningless.
- No personalized recommendation of percentages; use examples only.

**T23 — Full Scalping Decision Lifecycle**
- Step 1 choose synthetic coin; step 2 view 1m/5m context; step 3 recent ranges and levels; step 4 document uncertainty; step 5 calculate costs/risk; step 6 choose DEMO BUY/SELL/NO_TRADE; step 7 simulate monitoring and exit; step 8 review outcome/journal.
- Animation: 10–15 minute fictional chart replay with branching outcomes, labels “educational simulation.”
- Interaction: multi-step capstone with a meaningful **NO_TRADE-success** route, justification field, journal summary and replay; score understanding and process, not profits.
- End **Batch 2 Formal Checkpoint**: 20–25 questions plus 2 chart interpretation tasks, 2 risk math tasks and 1 demo scenario; critical risks must be correctly understood or remediated. Passing is not professional certification or permission to trade.

## 6. Presentation and notes design system

Slides: use native web elements, no static rasterized text; visual density one concept per slide. Aspect ratio responsive around 16:9 desktop, vertical-friendly mobile alternative. Layout: big heading, <=35 main words per slide where possible, a meaningful illustration/animation, optional “Read explanation” notes drawer. Build glossary popovers; readable font size, contrast >= WCAG AA, visible focus outlines. Consistent cyan/violet-on-dark aesthetic only if compatible with current XORA branding; derive tokens from existing site, do not globally rewrite styles.

Notes: downloadable? At minimum **print-friendly HTML** and copyable content. Include key definitions in compact table, examples, misconception cards and recap. Optional PDF export can be added only after the core site works. All slide content, notes and scene captions must be factually consistent because they derive from one structured topic content source or shared reviewed copy.

Animations: no autoplay with sound; content respects `prefers-reduced-motion`; no flashing/strobe, avoid distracting glowing effects. Teach through movement (order matching, time aggregation, price changes), not decorative animations alone. Use explicit Replay, Pause, Skip animation, “Read as text.” No expensive perpetual animation when off-screen. Prevent unbounded timers and memory leaks.

## 7. Content data model (proposed, adapt to repo)

```ts
type Lesson = {
  id: string; phaseId: string; title: string; estimatedMinutes: number;
  prerequisites: string[]; objectives: string[];
  terms: GlossaryEntry[];
  slides: Array<{ id: string; heading: string; body: ContentBlock[]; visual: VisualSpec; speakerNotes: string }>;
  notes: ContentBlock[];
  storyboard: Array<{ id: string; durationMs: number; caption: string; visualState: object; narration?: string }>;
  exercises: InteractiveExercise[];
  checks: Question[];
  recap: { keyPoints: string[]; riskReminder: string };
  version: string;
};
type Question = { id: string; prompt: string; type: 'single'|'multi'|'numeric'|'chart'|'scenario';
  choices?: Array<{id:string;text:string}>; answer: unknown;
  correctExplanation: string; incorrectExplanations?: Record<string,string>;
  linkedLessonId: string; criticalRisk?: boolean };
```

Use stable IDs T01–T23, versionable authored data (JSON/TS/MDX as appropriate). Keep content separate from presentational components. Parameterize exercises; never eval content as executable JS, and sanitize rich text. Deterministic seed/scenario store prevents an animation replay changing the numerical answer. Add strong formulas/unit tests for OHLC aggregation, PnL, net costs, leverage exposure and position-size examples. Test input edge cases: zero price, stop on wrong side, negative quantities, absurd leverage, divide by zero, slider overflows.

## 8. Platform components and engineering details

Reusable components to implement or adapt:
`CourseHome`, `PhaseRoadmap`, `LessonCard`, `LessonPlayer`, `SlideDeck`, `StoryboardTimeline`, `AnimationControlBar`, `DefinitionTooltip`, `GlossaryDrawer`, `NotesReader`, `ExampleCalculator`, `MockOrderBook`, `CandlestickAnimator`, `TimeframeAggregator`, `TrendVisualizer`, `LevelZoneEditor`, `LeverageRiskSimulator`, `PnLCalculator`, `TradingFeeSimulator`, `ScenarioDecisionTree`, `ChartReplay`, `QuizRunner`, `CheckpointExam`, `RemediationPanel`, `ProgressTracker`, `LearningCertificatePreview`, `InstructorContentValidator`.

Do not add libraries blindly: prefer repo libraries; for charting reuse current chart library if truly separable from trading execution, otherwise use lightweight local SVG/Canvas. Prefer TypeScript strict mode where repo allows. Use safe dynamic import for large visualization modules; avoid blocking initial page load with all 23 lesson scripts. Ensure diagrams remain accessible through text-equivalent explanations.

Content engine must allow localization, captions and screen-reader announcement of important state changes without overwhelming announcements. Mobile must work down to ~320 px and with large text. Tap targets around 44px, no hover-only instruction. Keyboard controls and the ability to complete lessons without drag-and-drop are required.

State progression: slide reading alone is not equivalent to passing quiz; track viewed, practiced, assessed separately. Allow retries with explanations. Never lock essential safety notes from a struggling user. Store last playback position, last slide, notes bookmarks and quiz answers responsibly. If authenticated persistence cannot be safely wired, ship local-only progress adapter and clearly document limitations.

## 9. Checkpoint and test cases

Checkpoint A (after T13): 20–25 items balanced across T01–T13; high weight to risk understanding. Checkpoint B (after T23): 20–25 items + 5 applied items from T14–T23. Suggest >=80% overall; insist on remedial confirmation for critical leverage, liquidation, execution and security concepts. Allow unlimited retries for education, with optionally shuffled scenario banks, not punitive gatekeeping. Document each question's learning outcome and misconception tested.

User acceptance tests:
- A zero-knowledge user can define BTC/USDT, distinguish spot vs futures, describe leverage risk and choose no trade when uncertain after the lessons.
- Every lesson has **real** slide text, actual notes, playable educational animation, at least one usable interactive exercise and 3–5 scored knowledge checks.
- Simulated prices remain deterministic and clearly fictional; timeframes aggregate correctly; negative PnL and fees display correctly.
- Mobile touch, keyboard, reduced-motion and screen readers can complete the core path.
- Refresh resumes correct lesson/progress; lesson upgrade does not corrupt progress.
- No learner control can send a live order, interact with production trade endpoint, or mutate live bot settings.

Automated checks: lint, typecheck, build, unit tests on formulas and content schemas, integration tests for slides/quiz/progress, e2e for T01/T14/T23, accessibility scan and responsive smoke tests. For tests that cannot run in the environment, report precisely why; do not claim passing without execution.

## 10. Deliverables, acceptance and report

Produce:
1. Source implementation integrated into existing repo or honest standalone integration package.
2. All 23 populated lessons, 23 note articles, 23 HTML slide decks, 23 meaningful animations, 23 exercises, 69–115 per-lesson checks, two formal checkpoints, glossary and course roadmap.
3. All formulas/constants and source assumptions documented. Clearly label synthetic data, approximate calculations and educational examples.
4. Course content inventory table with T01–T23 `slides | notes | animated scenes | exercise | quiz | reviewed` statuses.
5. Screen captures or test previews for desktop and mobile; test results and known limitations.
6. A safety/non-regression report stating exactly which existing XORA source files changed and confirming no live execution features were exposed.
7. A follow-on backlog **only** for future XORA-specific tutorials T24–T32, without pretending those nine are currently implemented.

### Definition of Done
Not done if only a landing page, video placeholders, empty slide decks, animated decorations, bare definitions, or quiz shells exist. Done only when a new learner can follow all 23 authored lessons end-to-end, read complete explanations, interact with scenarios, demonstrate understanding and resume progress safely—without any real-money trading capability.

### Important execution instruction
Do not ask broad clarifying questions already answered above. Make safe product/design defaults; preserve repo patterns, document choices and proceed iteratively. If blocked by credentials or unavailable systems, finish the independently deliverable safe learning module and report integration blockers clearly. Keep implementation checklist current and demonstrate a genuine end-to-end working lesson before cloning the structure to other topics.
