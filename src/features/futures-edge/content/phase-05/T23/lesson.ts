import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { BRANCHES, CLOSES, fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'Educational simulation. All coins, prices, balances and outcomes in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data, not a signal and not a recommendation. Fee, slippage and margin rates are illustrative and vary by exchange and account.';

const DROP_PATH = [100, ...(BRANCHES.find((b) => b.id === 'drop')?.points ?? [])];
const CHOP_PATH = [...CLOSES, ...(BRANCHES.find((b) => b.id === 'chop')?.points ?? [])];

const LIFECYCLE_STEPS = [
  'Choose a synthetic coin',
  'View 1m and 5m context',
  'Mark recent range, levels',
  'Write down uncertainty',
  'Calculate costs and risk',
  'DEMO BUY, SELL or NO_TRADE',
  'Simulate monitoring, exit',
  'Review and journal',
];

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can carry one fictional scalping decision through all eight lifecycle steps, from market choice to journal.',
    'Learner can compute size, round-trip cost estimate and R-multiple for a fictional plan, and check that the approximate liquidation price sits beyond the stop.',
    'Learner can justify a DEMO NO_TRADE (or WAIT) as a complete, successful outcome and judge decisions by process, not profit.',
  ],
  glossaryEntries,
  notesComplexity: 'complex-risk',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T23-S01', kind: 'cover-problem', title: 'One decision, eight steps',
      narrationText: 'Everything from this course now comes together. One fictional coin, fifteen minutes of chart, and one decision. The goal is not to make money in the simulation. The goal is to make a decision you can explain.',
      blocks: [
        { kind: 'paragraph', text: 'Everything you learned now meets in **one** fictional decision.' },
        { kind: 'paragraph', text: 'The goal is a decision you can explain, not a simulated profit. That is the [[trade-lifecycle|trade lifecycle]].' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T23-A01' },
      glossaryRefs: ['trade-lifecycle'],
      speakerNotes: 'Stress that the capstone scores process. A learner who chooses NO_TRADE with good reasons scores as well as one who trades.',
    },
    {
      id: 'T23-S02', kind: 'key-definition', title: 'The eight steps',
      narrationText: 'Choose a market. Read the one-minute and five-minute context. Mark the recent range. Write down what you do not know. Calculate costs and risk. Decide. Monitor and exit. Review and journal.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Choose a market', 'Read 1m and 5m context', 'Mark range and levels', 'Write down uncertainty', 'Costs and risk', 'DEMO BUY, SELL or NO_TRADE', 'Monitor and exit', 'Review and journal'] },
      ],
      glossaryRefs: ['trading-plan', 'trading-journal'],
    },
    {
      id: 'T23-S03', kind: 'visual-breakdown', title: 'Same past, different futures',
      narrationText: 'From the same fifteen fictional minutes, price could rally, chop sideways or drop. You decide before you know which one happens. That is why the plan matters more than the guess.',
      blocks: [
        { kind: 'paragraph', text: 'From the same past, price can rally, chop or drop.' },
        { kind: 'paragraph', text: 'You decide **before** you know which. Plan for every branch, including the one where you never enter.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T23-A05' },
      glossaryRefs: ['no-trade'],
    },
    {
      id: 'T23-S04', kind: 'worked-example', title: 'Costs and risk of the plan',
      narrationText: 'Long at 100.00, stop 99.40, risk 6 USDT. The stop distance is 0.60, so the size is 10 DEMO and the notional 1,000 USDT. The round-trip cost estimate is 1.40 USDT, almost a quarter of the risk.',
      blocks: [
        {
          kind: 'worked-example', title: 'DEMO/USDT plan (fictional)', fictional: true,
          steps: [
            { text: 'Size = 6 ÷ |100.00 − 99.40|', result: '10 DEMO' },
            { text: 'Notional = 10 × 100.00', result: '1,000 USDT' },
            { text: 'Cost ≈ 1,000 × 2 × (0.05% + 0.02%)', result: '1.40 USDT' },
          ],
          conclusion: 'Costs are about 23% of the 6 USDT risk.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T23-A04' },
      glossaryRefs: ['position-size', 'round-trip'],
    },
    {
      id: 'T23-S05', kind: 'risks-misunderstanding', title: 'Outcome is not skill',
      narrationText: 'On the same drop, a long loses about 7 USDT and a short gains 12 USDT. One trade says almost nothing about your skill. Judge the process, and remember that no trade is always allowed.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Judging by one result', text: 'On the same fictional drop, a long lost 7.00 USDT (−1.17R) and a short gained 12.00 USDT (+2R) before costs.' },
        { kind: 'callout', callout: 'safety', text: 'Judge the [[process-review|process]]. DEMO NO_TRADE is always allowed.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T23-A06' },
      glossaryRefs: ['r-multiple', 'process-review'],
    },
    {
      id: 'T23-S06', kind: 'guided-practice', title: 'Run the capstone',
      narrationText: 'Work through the eight-step capstone. Pick a market, mark the range, write your doubts, check the math, decide, watch the replay and write your journal. A well-reasoned NO_TRADE completes the capstone too.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Skip the thin market.', 'Mark the 10-candle range.', 'Size it and estimate costs.', 'Decide, justify, journal.'] },
        { kind: 'callout', callout: 'tip', text: 'A reasoned DEMO NO_TRADE is a full pass.' },
      ],
      glossaryRefs: ['skipped-trade'],
    },
    {
      id: 'T23-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Plan before you act. Size from risk and count costs. Expect any branch. Exit by the plan. Write the journal, including skipped trades, and stop when a session rule says stop.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Plan first; decide second.', 'Size from risk; count costs.', 'Any branch can happen.', 'Journal every decision, even skips.'] },
      ],
      glossaryRefs: ['trading-plan', 'consecutive-loss-rule'],
    },
  ],

  notesSections: [
    {
      id: 'T23-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'The [[trade-lifecycle|trade lifecycle]] is the full path of one decision: choose a market, read the 1m and 5m context, mark the recent range and levels, write down what is uncertain, calculate costs and risk, decide DEMO BUY, SELL or NO_TRADE, monitor and [[exit]], then review in a [[trading-journal|trading journal]]. The written version of steps 1–6 is your [[trading-plan|trading plan]].' },
        { kind: 'analogy', text: 'It is like a pilot’s checklist. The pilot runs it on every flight, even easy ones, and sometimes the checklist says “do not take off”. That is the checklist working, not failing.' },
      ],
    },
    {
      id: 'T23-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'In [[scalping]] decisions come fast, and fast decisions skip steps. A fixed lifecycle makes the skipped step visible: no stop, no size; no size, no trade. It also changes what you measure. One trade’s result is mostly luck, so the capstone scores your [[process-review|process]]: market choice, levels, uncertainty, risk math, justification and journal. A carefully reasoned NO_TRADE scores as fully as a trade.' },
      ],
    },
    {
      id: 'T23-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: steps 1–6 on fictional DEMO/USDT', fictional: true,
          steps: [
            { text: 'Step 1: skip MOCK/USDT (spread 0.40%, thin book). Choose DEMO/USDT.' },
            { text: 'Step 3: last 10 one-minute candles: highest high 100.85, lowest low 99.55', result: 'range 1.30 (about 1.31%)' },
            { text: 'Step 4: price 100.00 sits mid-range; 5m candles overlap; no clear trend.' },
            { text: 'Step 5: long plan 100.00 / stop 99.40 / target 101.20, risk 6 USDT', result: 'size 10 DEMO, notional 1,000 USDT' },
            { text: 'Round-trip cost estimate 1,000 × 2 × (0.05% + 0.02%)', result: '1.40 USDT' },
            { text: 'Approx. liquidation at 20× (maintenance 0.5%)', result: '95.50, beyond the stop' },
          ],
          conclusion: 'Step 6: the target needs a break above 100.85 from the middle of a choppy range, and costs eat about 23% of the risk. Decision: DEMO NO_TRADE, recorded as a skipped trade.',
        },
        {
          kind: 'worked-example', title: 'Example 2: steps 7–8 if someone did trade (one fictional branch)', fictional: true,
          steps: [
            { text: 'Long 10 DEMO at 100.00, stop 99.40. Price drops 99.45 → 99.30 in one jump.', result: 'stop fills at 99.30' },
            { text: 'Loss = 10 × 0.70', result: '7.00 USDT = −1.17R' },
            { text: 'Short plan, same branch: entry 100.00, stop 100.60, target 98.80', result: '+12.00 USDT = +2R before costs' },
          ],
          conclusion: 'Same path, opposite results. The journal records the plan, the slippage and whether rules were followed, not just the number.',
        },
        {
          kind: 'formula', expression: 'R-multiple = realized result ÷ planned risk amount', formulaId: 'T23-F05',
          variables: [
            { symbol: 'realized result', meaning: 'profit or loss after the exit', unit: 'USDT' },
            { symbol: 'planned risk amount', meaning: 'size × stop distance, set before entry', unit: 'USDT' },
          ],
        },
      ],
    },
    {
      id: 'T23-N04', heading: 'how-to-recognize', title: 'How to recognise a good process',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'The market was chosen for liquidity and spread, not excitement.',
          'Range and levels come from the candles, written as numbers.',
          'At least one honest doubt is written down before deciding.',
          'Size, cost estimate and the approximate liquidation check are done before any entry.',
          'The decision has a reason that mentions the evidence, and NO_TRADE or WAIT was considered.',
          'During the trade, [[trade-management|management]] follows the plan; the stop is never moved further away.',
          'The journal records the [[r-multiple|R-multiple]], rule breaks and every [[skipped-trade|skipped trade]].',
        ] },
      ],
    },
    {
      id: 'T23-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Grading by profit', text: 'A win that broke the plan is a process failure. A planned −1R loss can be a process success.' },
        { kind: 'callout', callout: 'mistake', title: 'Trading the thin market', text: 'A wide spread and thin book can cost more than the planned move. Skipping it is a valid step-1 decision.' },
        { kind: 'callout', callout: 'mistake', title: 'Ignoring session rules', text: 'After an illustrative [[consecutive-loss-rule|two losses in a row]], or the daily loss limit, the answer is DEMO STOP_TRADING, not a bigger size.' },
      ],
    },
    {
      id: 'T23-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'This capstone is an educational simulation. Finishing it is not professional certification and not permission or advice to trade real money. Real futures can lose more than planned through slippage, gaps, fees, funding and liquidation.' },
        { kind: 'callout', callout: 'not-advice', text: 'Risk amounts, limits and rates are teaching examples. Rules differ by country; check current local rules and get qualified advice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T23-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'The lifecycle at a glance (fictional numbers)', headers: ['Step', 'Question', 'Example answer'], rows: [
          ['1 Market', 'Liquid enough?', 'DEMO yes, MOCK no'],
          ['2–3 Context', 'Range and levels?', '99.55–100.85'],
          ['4 Uncertainty', 'What do I not know?', 'Mid-range, no trend'],
          ['5 Costs/risk', 'Size and cost?', '10 DEMO, 1.40 USDT'],
          ['6 Decision', 'BUY, SELL or NO_TRADE?', 'DEMO NO_TRADE'],
          ['7–8 Exit/review', 'Did I follow the plan?', 'Journal it'],
        ] },
      ],
    },
    {
      id: 'T23-N08', heading: 'learn-more', title: 'Learn more: why a sample of one says little', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Imagine a plan that wins +2R one time in three and loses −1R two times in three. Before costs, it breaks even on average, yet a short run of trades can show three wins in a row or five losses in a row. That is why the course grades the process and why journals look at many decisions together.' },
        { kind: 'paragraph', text: 'Costs shift the average. In the example plan, 1.40 USDT of estimated costs on a 6 USDT risk is about 0.23R per round trip, paid on every trade, win or lose.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T23-A01', type: 'trade-lifecycle', durationMs: 30_000,
      parameters: { variant: 'full', steps: LIFECYCLE_STEPS, path: CLOSES },
      caption: 'Educational simulation: the 15-minute fictional DEMO/USDT replay plays while the eight lifecycle steps light up one by one.',
      narration: 'Each step must be finished before the next one. The chart is fictional and ends at 100.00.',
      reducedMotionDescription: 'Eight steps highlight in order: choose a synthetic coin; view 1m and 5m context; mark recent range and levels; write down uncertainty; calculate costs and risk; DEMO BUY, SELL or NO_TRADE; simulate monitoring and exit; review and journal. Beside them a fictional 15-minute DEMO/USDT line moves from 100.30 up to 100.80, down to 99.80 and ends at 100.00.',
      glossaryRefs: ['trade-lifecycle'],
    },
    {
      id: 'T23-A02', type: 'timeframe-aggregation', durationMs: 25_000, fixtureId: 'FX-T23-SERIES-01',
      parameters: { groupSize: 5, targetLabel: '5m' },
      caption: 'Step 2: fifteen 1m candles fold into three 5m candles. The 5m view shows overlapping candles: no clear trend.',
      narration: 'Five one-minute candles become one five-minute candle: first open, highest high, lowest low, last close.',
      reducedMotionDescription: 'The fifteen fictional 1m candles are grouped in fives. 5m candle 1: open 100.20, high 101.10, low 100.05, close 100.35. 5m candle 2: open 100.35, high 100.65, low 99.55, close 100.55. 5m candle 3: open 100.55, high 100.85, low 99.80, close 100.00. They overlap, so there is no clear trend.',
      glossaryRefs: ['candle-aggregation', 'higher-timeframe-context'],
    },
    {
      id: 'T23-A03', type: 'range-overlay', durationMs: 25_000, fixtureId: 'FX-T23-SERIES-01',
      parameters: { window: 10 },
      caption: 'Step 3: the last 10 candles are shaded. Highest high 100.85, lowest low 99.55: a 1.30 range, with price at 100.00 in the middle.',
      narration: 'The lookback window marks where price has been recently. It does not predict where it goes next.',
      reducedMotionDescription: 'A 10-candle window covers candles 6 to 15. The highest high is 100.85 and the lowest low is 99.55, a range of 1.30 USDT (about 1.31%). The last close, 100.00, is in the middle of that range.',
      glossaryRefs: ['lookback-window', 'price-range'],
    },
    {
      id: 'T23-A04', type: 'trade-lifecycle', durationMs: 25_000,
      parameters: { variant: 'decision-gate', steps: LIFECYCLE_STEPS.slice(3, 6), path: CLOSES, decision: 'NO_TRADE', outcome: 'Mid-range; cost 1.40 vs risk 6 USDT' },
      caption: 'Steps 4–6: doubts written, size 10 DEMO and cost 1.40 USDT calculated. The gate closes: DEMO NO_TRADE.',
      narration: 'Price is mid-range, the 5m view is mixed, and costs are almost a quarter of the risk. Not trading is the planned answer.',
      reducedMotionDescription: 'Decision gate. Uncertainty: price 100.00 is mid-range and 5m candles overlap. Risk: long plan 100.00 / 99.40, risk 6 USDT, size 10 DEMO, notional 1,000 USDT, cost estimate 1.40 USDT. The decision card shows DEMO NO_TRADE.',
      glossaryRefs: ['no-trade', 'trading-plan'],
    },
    {
      id: 'T23-A05', type: 'branching-paths', durationMs: 35_000, fixtureId: 'FX-T23-BRANCH-01',
      caption: 'Educational simulation: from the same 15 minutes, three futures unfold: a rally to 101.30, a sideways chop, a drop to 98.80.',
      narration: 'None of these was knowable at the decision point. The plan has to make sense for all of them.',
      reducedMotionDescription: 'The fictional past line ends at 100.00 under a dashed recent-high line at 100.85. Three possible continuations are drawn: a rally to 101.30, a chop between 99.80 and 100.30 ending at 100.00, and a drop to 98.80.',
      glossaryRefs: ['false-signal'],
      parameters: {},
    },
    {
      id: 'T23-A06', type: 'sl-tp-lines', durationMs: 25_000,
      parameters: { variant: 'target-hit', side: 'short', entry: 100, stop: 100.6, target: 98.8, quantity: 10, path: DROP_PATH },
      caption: 'SHORT branch: entry 100.00, stop 100.60 above. Price drops to 98.80 and the take-profit fills: +12.00 USDT (+2R) before costs.',
      narration: 'For a short the stop sits above the entry. On this one path the target filled. Another path would have stopped it out.',
      reducedMotionDescription: 'Fictional short, 10 DEMO, entry 100.00, stop 100.60, target 98.80. Price moves 99.90, 99.70, 99.60, 99.45, 99.30, 99.10, 98.95, 98.80. The take-profit fills at 98.80: +12.00 USDT, or +2R on a 6 USDT risk, before the 1.40 USDT cost estimate. On the rally branch the same short would have hit its stop.',
      glossaryRefs: ['short-position', 'r-multiple'],
    },
    {
      id: 'T23-A07', type: 'sl-tp-lines', durationMs: 25_000,
      parameters: { variant: 'stop-filled', side: 'long', entry: 100, stop: 99.4, target: 101.2, quantity: 10, path: DROP_PATH },
      caption: 'LONG on the same drop: price jumps from 99.45 to 99.30, so the 99.40 stop fills at 99.30. Loss 7.00 USDT = −1.17R.',
      narration: 'Same path, opposite position. The stop slipped 0.10, so the loss was bigger than the planned 6 USDT.',
      reducedMotionDescription: 'Fictional long, 10 DEMO, entry 100.00, stop 99.40, target 101.20. On the drop path price goes 99.90, 99.70, 99.60, 99.45 and then 99.30. The stop fills at 99.30: loss 10 × 0.70 = 7.00 USDT, which is −1.17R against the planned 6 USDT risk.',
      glossaryRefs: ['exit', 'stop-slippage'],
    },
    {
      id: 'T23-A08', type: 'trade-lifecycle', durationMs: 25_000,
      parameters: { variant: 'journal', steps: LIFECYCLE_STEPS.slice(6), path: CHOP_PATH, decision: 'NO_TRADE', outcome: 'Skipped trade logged; no fees paid' },
      caption: 'Step 8: the replay continues sideways. The journal records DEMO NO_TRADE, the reasons and zero fees: a complete, successful lifecycle.',
      narration: 'Judge the process. The skipped trade is written down like any other decision.',
      reducedMotionDescription: 'Journal stage. The fictional chart continues sideways between 99.80 and 100.30 and ends at 100.00. The decision card reads DEMO NO_TRADE: skipped trade logged, no fees paid. The note says to judge the process, not only the result.',
      glossaryRefs: ['trading-journal', 'skipped-trade'],
    },
  ],

  exercises: [
    {
      id: 'T23-X01', type: 'capstone-lifecycle', title: 'Capstone: one full decision',
      fixtureId: 'FX-T23-SERIES-01',
      instructions: 'Work through all eight stages on fictional data. The score measures your process (market choice, levels, uncertainty, risk math, a justified decision and a journal), not whether the simulated trade makes money. A well-reasoned DEMO NO_TRADE completes the capstone fully.',
      steps: [
        { id: 'T23-X01-01', prompt: 'Stages 1–2: choose a market you could actually trade at low cost, then compare the 1m and 5m views.', hint: 'Read each coin’s note: a wide spread and a thin book make costs and slippage hard to control.' },
        { id: 'T23-X01-02', prompt: 'Stages 3–4: enter the highest high and lowest low of the last 10 candles, then write what you do not know.', hint: 'Open “Show candle values”: look only at candles 6–15. Where is the last close inside that range?' },
        { id: 'T23-X01-03', prompt: 'Stage 5: size = 6 ÷ |100.00 − 99.40|; cost ≈ notional × 2 × (0.05% + 0.02%).', hint: 'Size 10 DEMO, notional 1,000 USDT, so the cost estimate is 1,000 × 0.0014.' },
        { id: 'T23-X01-04', prompt: 'Stages 6–8: decide, justify, watch the replay (if you traded) and write your journal.', hint: 'NO_TRADE is a full answer. Mention the range position, the costs and the 5m view.' },
      ],
      allowedControls: ['choice', 'numeric-input', 'text-rationale', 'step-reveal', 'reset', 'hint'],
      choices: [
        { id: 'buy', text: 'Long at 100.00, stop 99.40, target 101.20.', decision: 'BUY' },
        { id: 'sell', text: 'Short at 100.00, stop 100.60, target 98.80.', decision: 'SELL' },
        { id: 'no-trade', text: 'No position: price is mid-range and the edge is unclear.', decision: 'NO_TRADE' },
      ],
      parameters: {
        coins: [
          { id: 'demo', label: 'DEMO/USDT', note: 'Busy fictional market: spread about 0.01%, deep order book.', suitable: true },
          { id: 'toy', label: 'TOY/USDT', note: 'Fictional market with steady trading: spread about 0.02%.', suitable: true },
          { id: 'mock', label: 'MOCK/USDT', note: 'Thin fictional market: spread about 0.40%, few orders; a 1,000 USDT order would move the price.', suitable: false },
        ],
        risk: { side: 'long', entry: 100, stop: 99.4, target: 101.2, riskAmount: 6, feeRate: 0.0005, slippageRate: 0.0002 },
        branches: BRANCHES,
        lookback: 10,
        replayBranch: 'chop',
        uncertaintyPrompt: 'What do you NOT know? For example: where price sits in the range, whether the 5m view agrees, what news or slippage could do.',
      },
      expectedEvaluation: { kind: 'rubric', criteria: [
        { id: 'market-choice', description: 'Chose a liquid fictional market and skipped the thin one.' },
        { id: 'levels', description: 'Marked the 10-candle range correctly (100.85 / 99.55).' },
        { id: 'uncertainty', description: 'Wrote down at least one honest uncertainty before deciding.' },
        { id: 'risk-math', description: 'Calculated the size (10 DEMO) and the round-trip cost estimate (1.40 USDT).' },
        { id: 'decision-justified', description: 'Chose DEMO BUY, SELL or NO_TRADE with a written reason.' },
        { id: 'journal', description: 'Wrote a journal entry about the process.' },
      ] },
      explanation: 'The strongest route here is often DEMO NO_TRADE: price 100.00 sits in the middle of the 99.55–100.85 range, the 5m candles overlap, and the 1.40 USDT cost estimate is about 23% of the 6 USDT risk. If you traded, the replay shows one fictional path; a different path was equally possible. Either way, the score reflects your process.',
      fictionalDataLabel: 'Educational simulation: fictional coins, prices and outcomes.',
    },
    {
      id: 'T23-X02', type: 'decision-with-rationale', title: 'Decide with the evidence you have',
      fixtureId: 'FX-T23-SERIES-01',
      instructions: 'Reveal the fictional candles stage by stage. Tick only what you can actually see, choose a DEMO decision and explain it. The rest of the chart appears after you submit.',
      steps: [
        { id: 'T23-X02-01', prompt: 'Reveal the candles and tick the observations you can see.', hint: 'Where is the latest close compared with the recent high (100.85) and low (99.55)?' },
        { id: 'T23-X02-02', prompt: 'Choose a DEMO decision and write your reason.', hint: 'Mid-range price, mixed 5m view and high costs point towards waiting or not trading.' },
      ],
      allowedControls: ['choice', 'text-rationale', 'step-reveal', 'reset', 'hint'],
      choices: [
        { id: 'buy', text: 'Buy now: the last candles bounced.', decision: 'BUY' },
        { id: 'sell', text: 'Sell now: the last candles fell.', decision: 'SELL' },
        { id: 'wait', text: 'Wait for price to reach an edge of the range or break it.', decision: 'WAIT' },
        { id: 'no-trade', text: 'No trade on this chart.', decision: 'NO_TRADE' },
      ],
      parameters: {
        reveal: [10, 12, 14],
        context: [
          'Fictional DEMO/USDT, 1-minute candles. Educational simulation.',
          'Plan if trading: risk 6 USDT, stop 0.60 away, size 10 DEMO, cost estimate 1.40 USDT.',
          'Illustrative fees 0.05% per side plus 0.02% slippage estimate.',
        ],
        checklist: [
          { id: 'mid', text: 'The latest close is in the middle of the recent range.' },
          { id: 'overlap', text: 'Recent candles overlap a lot (choppy).' },
          { id: 'break', text: 'Price has clearly broken above 100.85 with high volume.' },
          { id: 'costs', text: 'Costs are a large share of the planned risk.' },
        ],
        decisionFeedback: {
          buy: 'The bounce is inside a choppy range. The target needs a break of 100.85 that has not happened.',
          sell: 'The dip is inside the same range. The 99.55 low is still holding, and costs are high relative to risk.',
          wait: 'Waiting for price to reach an edge, or to break it with confirmation, keeps you out of the noisy middle.',
          'no-trade': 'A clear, reasoned skip. Log it as a skipped trade in the journal.',
        },
        minRationale: 20,
      },
      expectedEvaluation: {
        kind: 'decision', acceptable: ['NO_TRADE', 'WAIT'], decisionSet: 'trade', requiresRationale: true,
        rationaleCues: ['Price 100.00 sits mid-range between 99.55 and 100.85.', 'The candles overlap: choppy, no clear trend on 5m.', 'The 1.40 USDT cost estimate is about 23% of the 6 USDT risk.'],
      },
      explanation: 'With price in the middle of a choppy range and costs close to a quarter of the risk, DEMO WAIT or NO_TRADE is the well-supported decision. The revealed continuation is one fictional path; it does not make any choice right or wrong after the fact.',
      fictionalDataLabel: 'Educational simulation with fictional candles.',
    },
    {
      id: 'T23-X03', type: 'sequence-order', title: 'Put the lifecycle in order',
      fixtureId: 'FX-T23-SERIES-01',
      instructions: 'Arrange the eight lifecycle steps in the order you would do them.',
      steps: [
        { id: 'T23-X03-01', prompt: 'Start with what must happen before any chart reading.', hint: 'You cannot read a chart before choosing which market to look at.' },
        { id: 'T23-X03-02', prompt: 'Place the decision after all the checks, and the journal last.', hint: 'Costs and risk are calculated before the decision, not after.' },
      ],
      allowedControls: ['choice', 'keyboard-move', 'reset', 'hint'],
      parameters: { items: [
        { id: 'market', text: 'Choose a synthetic coin' },
        { id: 'context', text: 'View 1m and 5m context' },
        { id: 'levels', text: 'Mark recent range and levels' },
        { id: 'uncertainty', text: 'Write down uncertainty' },
        { id: 'risk', text: 'Calculate costs and risk' },
        { id: 'decide', text: 'Choose DEMO BUY, SELL or NO_TRADE' },
        { id: 'monitor', text: 'Simulate monitoring and exit' },
        { id: 'journal', text: 'Review the outcome and journal' },
      ] },
      expectedEvaluation: { kind: 'sequence', order: ['market', 'context', 'levels', 'uncertainty', 'risk', 'decide', 'monitor', 'journal'] },
      explanation: 'Market, context, levels and doubts come first; the math comes before the decision; monitoring only happens if you entered; the journal closes every lifecycle, including NO_TRADE.',
      fictionalDataLabel: 'Fictional lesson steps for practice.',
    },
  ],

  formulas: [
    {
      id: 'T23-F01', name: 'Position size for the capstone plan (simple model)',
      expression: 'size = risk amount ÷ |entry − stop|; notional ≈ size × entry',
      variables: [
        { symbol: 'risk amount', meaning: 'example planned loss at the stop', unit: 'USDT' },
        { symbol: 'entry, stop', meaning: 'planned prices; long stop below, short stop above', unit: 'USDT per DEMO' },
      ],
      simulatorId: 'risk.position-size', approximate: true,
      workedExamples: [
        { label: 'Long plan (slide T23-S04, capstone stage 5)', inputs: { riskAmount: 6, entry: 100, stop: 99.4 }, outputs: { stopDistance: 0.6, quantity: 10, notional: 1000 }, tolerance: 1e-6, assumptions: ['fictional data', 'before fees and slippage'] },
        { label: 'SHORT plan (scene T23-A06)', side: 'short', inputs: { riskAmount: 6, entry: 100, stop: 100.6 }, outputs: { stopDistance: 0.6, quantity: 10, notional: 1000 }, tolerance: 1e-6, assumptions: ['fictional data', 'stop above entry for a short'] },
      ],
    },
    {
      id: 'T23-F02', name: 'Round-trip cost estimate',
      expression: 'cost ≈ notional × 2 × (fee rate + slippage estimate)',
      variables: [
        { symbol: 'notional', meaning: 'entry notional', unit: 'USDT' },
        { symbol: 'fee rate, slippage estimate', meaning: 'illustrative 0.05% taker fee and 0.02% slippage per side', unit: 'fraction' },
      ],
      simulatorId: 'fees.estimate-round-trip', approximate: true,
      workedExamples: [
        { label: 'Capstone plan (quiz T23-Q02)', inputs: { notional: 1000, feeRate: 0.0005, slippageRate: 0.0002 }, outputs: { estimate: 1.4 }, tolerance: 1e-9, assumptions: ['illustrative rates', 'exit notional assumed equal to entry'] },
      ],
    },
    {
      id: 'T23-F03', name: 'Approximate liquidation price (isolated, simplified)',
      expression: 'long ≈ entry × (1 − 1 ÷ leverage + maintenance margin rate); short ≈ entry × (1 + 1 ÷ leverage − maintenance margin rate)',
      variables: [
        { symbol: 'entry', meaning: 'entry price', unit: 'USDT per DEMO' },
        { symbol: 'leverage', meaning: 'chosen leverage', unit: '×' },
        { symbol: 'maintenance margin rate', meaning: 'illustrative 0.5% flat', unit: 'fraction' },
      ],
      simulatorId: 'liquidation.approx', approximate: true,
      workedExamples: [
        { label: 'Long 20× (notes example 1, quiz T23-Q05)', inputs: { entry: 100, leverage: 20, mmr: 0.005 }, outputs: { liquidationPrice: 95.5, distancePercent: -4.5 }, tolerance: 1e-9, assumptions: ['approximate', 'fees and funding ignored'] },
        { label: 'SHORT 20×', side: 'short', inputs: { entry: 100, leverage: 20, mmr: 0.005 }, outputs: { liquidationPrice: 104.5, distancePercent: 4.5 }, tolerance: 1e-9, assumptions: ['approximate', 'fees and funding ignored'] },
      ],
    },
    {
      id: 'T23-F04', name: 'Recent range over a lookback window',
      expression: 'range = highest high − lowest low; range % = range ÷ lowest low × 100',
      variables: [
        { symbol: 'highest high, lowest low', meaning: 'extremes of the last 10 one-minute candles', unit: 'USDT per DEMO' },
      ],
      simulatorId: 'range.lookback', approximate: false,
      workedExamples: [
        {
          label: 'Last 10 candles (scene T23-A03, capstone stage 3)',
          inputs: { h1: 100.5, l1: 99.9, h2: 100.3, l2: 99.7, h3: 100.05, l3: 99.55, h4: 100.4, l4: 99.85, h5: 100.65, l5: 100.2, h6: 100.85, l6: 100.4, h7: 100.5, l7: 99.95, h8: 100.35, l8: 99.8, h9: 100.55, l9: 100.1, h10: 100.3, l10: 99.95, window: 10 },
          outputs: { max: 100.85, min: 99.55, range: 1.3, rangePercent: 1.3059 }, tolerance: 0.0001, assumptions: ['fictional data', 'range % shown rounded as about 1.31%'],
        },
      ],
    },
    {
      id: 'T23-F05', name: 'Planned risk, reward and R',
      expression: 'risk = size × |entry − stop|; reward = size × |target − entry|; R-multiple = realized result ÷ planned risk',
      variables: [
        { symbol: 'entry, stop, target', meaning: 'planned prices', unit: 'USDT per DEMO' },
        { symbol: 'size', meaning: 'position quantity', unit: 'DEMO' },
      ],
      simulatorId: 'risk.reward', approximate: false,
      workedExamples: [
        { label: 'Long plan', inputs: { entry: 100, stop: 99.4, target: 101.2, quantity: 10 }, outputs: { riskPerUnit: 0.6, rewardPerUnit: 1.2, ratio: 2, risk: 6, reward: 12 }, tolerance: 1e-6, assumptions: ['fictional data', 'before costs'] },
        { label: 'SHORT plan (scene T23-A06: +12.00 USDT = +2R)', side: 'short', inputs: { entry: 100, stop: 100.6, target: 98.8, quantity: 10 }, outputs: { risk: 6, reward: 12, ratio: 2 }, tolerance: 1e-6, assumptions: ['fictional data', 'before costs'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T23-Q01', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T23', fixtureId: 'FX-T23-SERIES-01', safetyCritical: true, safetyTopic: 'no-trade',
      prompt: 'On the fictional chart, the last 10 candles ranged from 99.55 to 100.85 and the latest close is 100.00. The 5m candles overlap. The cost estimate is 1.40 USDT against a 6 USDT risk. Which DEMO decision is best supported?',
      choices: [
        { id: 'no-trade', text: 'No trade: price is mid-range in a choppy market and costs are high relative to risk.', decision: 'NO_TRADE' },
        { id: 'buy', text: 'Buy: the last candle closed near 100.00, a round number.', decision: 'BUY' },
        { id: 'sell', text: 'Sell: the last candle was bearish.', decision: 'SELL' },
      ],
      answer: { kind: 'choice', choiceId: 'no-trade' },
      rationale: 'Nothing gives an edge here: the middle of a choppy range offers no clear level, and costs eat about 23% of the planned risk. A reasoned NO_TRADE is a complete, successful lifecycle.',
      misconceptionFeedback: {
        buy: 'A round number is not evidence. Price is mid-range, and the target would need a break of 100.85.',
        sell: 'One bearish candle inside a choppy range says little. The 99.55 low is still holding.',
      },
      learningOutcome: 'Choose NO_TRADE when the evidence is mixed and costs are high.',
      remediationRef: { lessonId: 'T23', anchorId: 'T23-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T23-Q02', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T23',
      prompt: 'A fictional plan has a notional of 1,000 USDT. Using illustrative rates of 0.05% fee and 0.02% slippage per side, what is the round-trip cost estimate in USDT?',
      answer: { kind: 'numeric', value: 1.4, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: '1,000 × 2 × (0.0005 + 0.0002) = 1.40 USDT, paid whether the trade wins or loses.',
      learningOutcome: 'Estimate round-trip costs before a decision.',
      remediationRef: { lessonId: 'T23', anchorId: 'T23-N03' },
    },
    {
      id: 'T23-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T23', safetyCritical: true, safetyTopic: 'loss-limits',
      prompt: 'Your illustrative session rule is “stop after 2 consecutive losses”. Your last two fictional trades were both stopped out, and a new setup looks very strong. What is the DEMO session decision?',
      choices: [
        { id: 'stop', text: 'Stop trading for this session and review both losses.', decision: 'STOP_TRADING' },
        { id: 'continue', text: 'Take the new setup with a bigger size to recover quickly.', decision: 'CONTINUE_SIM_PRACTICE' },
      ],
      answer: { kind: 'choice', choiceId: 'stop' },
      rationale: 'The consecutive-loss rule triggered. It was written in advance precisely so that a tempting setup after losses does not override it.',
      misconceptionFeedback: {
        continue: 'Recovering losses with a bigger size is how small drawdowns become large ones. The rule says stop.',
      },
      learningOutcome: 'Apply an illustrative consecutive-loss rule as a session stop.',
      remediationRef: { lessonId: 'T23', anchorId: 'T23-N05' },
      shuffleChoices: false,
    },
    {
      id: 'T23-Q04', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T23',
      prompt: 'In a fictional replay, a learner entered without setting a stop and the trade happened to gain 12 USDT. How should the process review grade it?',
      choices: [
        { id: 'a', text: 'As a rule break: the result was positive, but the process skipped a required step.' },
        { id: 'b', text: 'As a success, because it made money.' },
        { id: 'c', text: 'As proof that stops are unnecessary.' },
        { id: 'd', text: 'It should not be journaled because it won.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Process review judges how the decision was made. A win without a stop is luck on top of an unbounded risk.',
      misconceptionFeedback: {
        b: 'One result is mostly luck. The same entry without a stop could have lost far more on another path.',
        c: 'One lucky outcome proves nothing. Without a stop, the possible loss had no limit.',
        d: 'Every decision is journaled, wins, losses and skipped trades alike.',
      },
      learningOutcome: 'Judge a decision by process, not by a single outcome.',
      remediationRef: { lessonId: 'T23', anchorId: 'T23-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T23-Q05', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T23', safetyCritical: true, safetyTopic: 'liquidation',
      prompt: 'Fictional long plan: entry 100.00, stop 99.40, 20× leverage, illustrative 0.5% maintenance rate. The approximate liquidation price is about 95.50. Which reading is correct?',
      choices: [
        { id: 'a', text: 'Liquidation sits beyond the stop, which is required, but the stop can still slip and the estimate is only approximate.' },
        { id: 'b', text: 'The trade is now risk-free because liquidation is far away.' },
        { id: 'c', text: 'The stop is no longer needed because liquidation will close the trade anyway.' },
        { id: 'd', text: 'Liquidation at 95.50 means the most you can lose is 0.60 per DEMO.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The check passes: price reaches 99.40 long before 95.50. That only means the stop can act first. Slippage, gaps and exchange rules still apply, and nothing makes a trade risk-free.',
      misconceptionFeedback: {
        b: 'No trade is risk-free. The liquidation check only confirms the stop is reached first.',
        c: 'Without a stop the loss could run to liquidation: about 4.5% plus fees instead of 0.6%.',
        d: 'The stop plans 0.60 per DEMO; liquidation would be about 4.50 per DEMO. They are different exits.',
      },
      learningOutcome: 'Check that the approximate liquidation price sits beyond the stop and understand its limits.',
      remediationRef: { lessonId: 'T23', anchorId: 'T23-N06' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Grading a decision by its profit or loss.', correction: 'Grade the process: market, levels, uncertainty, risk math, justification and journal.' },
    { mistake: 'Treating NO_TRADE as a failed lifecycle.', correction: 'A reasoned DEMO NO_TRADE, logged as a skipped trade, is a complete success.' },
    { mistake: 'Ignoring session rules after losses.', correction: 'When an illustrative consecutive-loss or daily limit triggers, the decision is DEMO STOP_TRADING.' },
  ],
  takeaways: [
    'Run all eight steps every time; the plan comes before the decision.',
    'Size from risk, count costs, and keep the approximate liquidation price beyond the stop.',
    'Judge the process, not one result; a reasoned NO_TRADE is a full success.',
  ],
  reviewCard: {
    keyTermIds: ['trade-lifecycle', 'trading-journal', 'r-multiple'],
    safetyNote: 'This is an educational simulation, not certification or advice to trade. NO_TRADE and stopping for the session are always allowed.',
    reviewMinutes: 5,
    retrievalQuestion: 'Planned risk 6 USDT; the stop slipped and the loss was 7.00 USDT. What is the R-multiple, and what should the journal say?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T23-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
