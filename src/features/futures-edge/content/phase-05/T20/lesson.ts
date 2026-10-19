import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures, T20_CLOSES } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices, volumes and account numbers in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data and not a recommendation.';

const STEPS = ['1 Current trend', '2 Recent price range', '3 Level or zone', '4 Volume and liquidity', '5 Risk budget', '6 Tentative decision'];

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can apply the six-step evaluation order (trend, range, level, volume, risk budget, decision) to a fictional chart.',
    'Learner can name an invalidation point for a setup and compute the risk per unit and an example size from a risk budget.',
    'Learner can justify a DEMO WAIT or NO_TRADE decision in writing when the evidence is neutral or unclear.',
  ],
  glossaryEntries,
  notesComplexity: 'complex-risk',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T20-S01', kind: 'cover-problem', title: 'A chart full of signals',
      narrationText: 'A beginner opens a chart and sees a green candle. It feels like a signal. But one candle without context tells you very little. This lesson gives you a fixed order of questions so that every decision starts from the same careful check.',
      blocks: [
        { kind: 'paragraph', text: 'One green candle can feel like a reason to act. Without [[market-context|context]] it is not.' },
        { kind: 'paragraph', text: 'A [[trade-checklist]] asks the **same questions in the same order**, every time.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T20-A01' },
      glossaryRefs: ['market-context', 'trade-checklist'],
      speakerNotes: 'Frame the lesson as process, not prediction. The goal is a reasoned tentative decision, and WAIT or NO_TRADE are full answers.',
    },
    {
      id: 'T20-S02', kind: 'key-definition', title: 'Six questions, one order',
      narrationText: 'First the trend, then the recent range, then the nearest level or zone, then volume and liquidity, then the risk budget, and only then a tentative decision. Each step can stop the process.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Current trend', 'Recent price range', 'Level or zone', 'Volume and liquidity', 'Risk budget', 'Tentative DEMO decision'] },
        { kind: 'definition', termId: 'setup' },
      ],
      glossaryRefs: ['setup', 'trade-checklist'],
    },
    {
      id: 'T20-S03', kind: 'visual-breakdown', title: 'Adding one layer at a time',
      narrationText: 'Watch the same fictional coin. Trend: mixed swings, so unclear. Range: 99.30 to 100.80. Level: price 100.05 sits in the middle, away from both zones. Volume: below average and falling.',
      blocks: [
        { kind: 'paragraph', text: 'Trend: mixed swings. Range: 99.30–100.80. Price 100.05 is **between** zones, not at a [[key-level]].' },
        { kind: 'paragraph', text: 'Volume: last candle 580 vs average about 1,003. Quiet market.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T20-A03' },
      glossaryRefs: ['key-level', 'price-range', 'trading-volume'],
    },
    {
      id: 'T20-S04', kind: 'worked-example', title: 'Invalidation and risk budget',
      narrationText: 'Suppose a long idea near support at 99.40, proven wrong below 99.00. That is 0.40 USDT per DEMO. With an example risk budget of 10 USDT, the size is 25 DEMO. Entering now at 100.05 instead stretches the risk to 1.05 per DEMO.',
      blocks: [
        {
          kind: 'worked-example', title: 'Fictional long idea at the support zone', fictional: true,
          steps: [
            { text: 'Entry 99.40, [[invalidation-point|invalidation]] 99.00', result: '0.40 USDT per DEMO' },
            { text: 'Example risk budget 10 USDT ÷ 0.40', result: '25 DEMO' },
          ],
          conclusion: 'Entering at 100.05 instead: risk 1.05 per DEMO for 0.55 reward. Poor.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T20-A06' },
      glossaryRefs: ['invalidation-point', 'stop-loss'],
    },
    {
      id: 'T20-S05', kind: 'risks-misunderstanding', title: 'Neutral evidence means no trade',
      narrationText: 'If the trend is unclear, price is in the middle of the range and volume is quiet, there is no edge to describe. The honest decision is WAIT or NO_TRADE. A checklist is not a machine that must end in BUY or SELL.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Forcing a direction', text: 'Ticking boxes until one side “wins” is not analysis. Unclear items point to WAIT.' },
        { kind: 'callout', callout: 'safety', text: 'DEMO WAIT and DEMO NO_TRADE are always allowed and often the most skilled answer.' },
      ],
      glossaryRefs: ['wait-decision'],
    },
    {
      id: 'T20-S06', kind: 'guided-practice', title: 'Your turn: fill the checklist',
      narrationText: 'Open the fictional chart. Tick only what you can actually see, choose a DEMO decision, and write why. You are scored on your reasoning, not on what price does next.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Tick each checklist item you can see on the chart.', 'Choose DEMO BUY, SELL, WAIT or NO_TRADE.', 'Write your reason: trend, range, level, volume, risk.'] },
        { kind: 'callout', callout: 'tip', text: 'Name the [[entry-trigger]] you are missing, if any.' },
      ],
      glossaryRefs: ['entry-trigger'],
    },
    {
      id: 'T20-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Use the same six steps every time. Write the invalidation point before any entry. Size from a risk budget. When the evidence is neutral, waiting is the decision.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Trend → range → level → volume → risk → decision.', 'Every setup needs an invalidation point.', 'Size comes from the risk budget, not from hope.', 'Neutral evidence: DEMO WAIT or NO_TRADE.'] },
      ],
      glossaryRefs: ['trade-checklist', 'invalidation-point', 'wait-decision'],
    },
  ],

  notesSections: [
    {
      id: 'T20-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'Evaluating an entry opportunity means checking a chart in a **fixed order** before making any decision. This course uses six steps: the current trend, the recent [[price-range]], the nearest level or zone, the [[trading-volume|volume]] and [[liquidity]] context, the risk budget, and finally a tentative DEMO decision. Written down, these steps are a [[trade-checklist]]. A possible trade that survives the first steps is called a [[setup]]: an idea with an entry area, an [[entry-trigger]] to wait for, and an [[invalidation-point]] where the idea is proven wrong.' },
        { kind: 'analogy', text: 'A pilot runs the same pre-flight checklist before every flight, even on a sunny day. One failed item means the plane stays on the ground. Staying on the ground is not a failure of the pilot; it is the checklist doing its job.' },
      ],
    },
    {
      id: 'T20-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Charts move every second, so there is always something that looks like a signal. Without an order of questions, beginners jump to the last candle and decide on a feeling. A fixed order slows you down, makes you look at [[market-context]] first, and gives you a written reason you can review later. It also makes the [[wait-decision|WAIT decision]] normal: if any step is unclear, the process itself tells you to wait. No checklist removes uncertainty. It only helps you see how much uncertainty there is before money is at risk, even in a simulation.' },
      ],
    },
    {
      id: 'T20-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: one fictional coin, six layers', fictional: true,
          steps: [
            { text: 'Trend: swings go 101.80 high, 99.20 low, 100.80 lower high, 99.30 higher low, 100.75 lower high, 99.50 higher low.', result: 'mixed: no clear trend' },
            { text: 'Range: the last 10 one-minute candles reach a high of 100.80 and a low of 99.30.', result: '1.50 USDT ≈ 1.51%' },
            { text: 'Level: support zone 99.20–99.40, resistance zone 100.60–100.80. Price now 100.05.', result: 'middle, not at a key level' },
            { text: 'Volume: average about 1,003 per candle; the last three are 600, 620 and 580.', result: 'quiet, fading interest' },
          ],
          conclusion: 'Trend unclear, price mid-range, volume low: there is no setup at this price. Tentative decision: DEMO NO_TRADE now, or WAIT for price to reach a zone and show a trigger.',
        },
        {
          kind: 'worked-example', title: 'Example 2: the risk budget for a long idea at support', fictional: true,
          steps: [
            { text: 'Illustrative account 1,000 USDT. Some learners study a 1% risk budget as an example only.', result: '10 USDT' },
            { text: 'Planned entry 99.40, invalidation 99.00 (just below the support zone).', result: '0.40 USDT per DEMO' },
            { text: 'Size = 10 USDT ÷ 0.40 USDT per DEMO', result: '25 DEMO' },
            { text: 'Notional = 25 × 99.40', result: '2,485 USDT' },
            { text: 'Target 100.60 (resistance): reward 1.20 per DEMO, risk 0.40 per DEMO', result: 'ratio 3' },
          ],
          conclusion: 'Same idea, but entered now at 100.05 with the same invalidation 99.00 and target 100.60: risk 1.05, reward 0.55 per DEMO, a ratio of about 0.52. The location makes the difference. Fees, slippage and stop slippage are left out of this simple model.',
        },
        {
          kind: 'formula', expression: 'risk per unit = |entry − invalidation|; size = risk budget ÷ risk per unit', formulaId: 'T20-F01',
          variables: [
            { symbol: 'entry, invalidation', meaning: 'planned entry price and the price where the idea is wrong', unit: 'USDT per DEMO' },
            { symbol: 'risk budget', meaning: 'the most you plan to lose if the invalidation point is hit (example only)', unit: 'USDT' },
          ],
        },
      ],
    },
    {
      id: 'T20-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          '**Trend**: label the last swings. Higher highs and higher lows = up; lower highs and lower lows = down; a mix = unclear.',
          '**Range**: mark the highest high and lowest low of a fixed [[lookback-window]], for example the last 10 candles.',
          '**Level**: is price at a [[support-zone]] or [[resistance-zone]], or floating in the middle?',
          '**Volume and liquidity**: is volume above or below its recent average? A thin market can slip more.',
          '**Risk budget**: where is the invalidation point, and how big is the size for an example budget?',
          '**Decision**: only if every step is clear do BUY or SELL become possible. Otherwise WAIT or NO_TRADE.',
        ] },
      ],
    },
    {
      id: 'T20-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Starting from the last candle', text: 'The last candle is the least informative part of the chart on its own. Start with trend and range.' },
        { kind: 'callout', callout: 'mistake', title: 'No invalidation point', text: 'If you cannot say where the idea is wrong, you cannot size it, so there is no setup.' },
        { kind: 'callout', callout: 'mistake', title: 'Entering in the middle of the range', text: 'In Example 2 the same idea has a ratio of 3 at the zone but about 0.52 in the middle. Location matters.' },
      ],
    },
    {
      id: 'T20-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'This checklist is a learning tool, not a signal service and not advice. A complete checklist can still lose: prices move unexpectedly, stops can slip and fees reduce results. When the evidence is neutral, DEMO WAIT or DEMO NO_TRADE is the right answer. The 1% figure is an illustration only; rules differ by country, so check current local rules and get qualified advice before any real activity.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T20-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'The six evaluation steps (fictional coin)', headers: ['Step', 'Question', 'Answer here'], rows: [
          ['1 Trend', 'Up, down or mixed?', 'mixed'],
          ['2 Range', 'Last-10 high and low?', '100.80 / 99.30'],
          ['3 Level', 'At a zone or in the middle?', 'middle (100.05)'],
          ['4 Volume', 'Above or below average?', 'below (580 vs ≈1,003)'],
          ['5 Risk', 'Invalidation and size?', '0.40 → 25 DEMO at the zone'],
          ['6 Decision', 'Clear edge?', 'no: WAIT / NO_TRADE'],
        ] },
      ],
    },
    {
      id: 'T20-N08', heading: 'learn-more', title: 'Learn more: tentative means tentative', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'The word “tentative” matters. The decision at step 6 is a plan for what you would do if the entry trigger appears, not a promise. Many experienced traders write several conditional plans at once, for example “long only if price reaches 99.20–99.40 and a candle closes back above it; nothing in between”. Most of those plans are never used. Skipping them is part of the process, and reviewing why a plan was skipped is as useful as reviewing a trade.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T20-A01', type: 'trade-lifecycle', durationMs: 24_000,
      parameters: { variant: 'decision-gate', steps: STEPS, path: T20_CLOSES },
      caption: 'The six steps light up in order while the fictional DEMO/USDT price runs from 101.10 down to 99.50 and settles near 100.05.',
      narration: 'Every evaluation follows the same six steps. We will add them one layer at a time to the same fictional coin.',
      reducedMotionDescription: 'A list of six steps (current trend, recent price range, level or zone, volume and liquidity, risk budget, tentative decision) is highlighted one by one next to a fictional DEMO/USDT close-price line that moves from 101.10 to 99.50 and ends at 100.05.',
      glossaryRefs: ['trade-checklist'],
    },
    {
      id: 'T20-A02', type: 'market-structure', durationMs: 26_000,
      parameters: { points: [101.8, 99.2, 100.8, 99.3, 100.75, 99.5] },
      caption: 'Layer 1, trend: swings go 101.80 → 99.20 → 100.80 (lower high) → 99.30 (higher low) → 100.75 → 99.50. Mixed swings: no clear trend.',
      narration: 'Lower highs say down, higher lows say up. Together they say: unclear.',
      reducedMotionDescription: 'Swing points are drawn one by one: high 101.80, low 99.20, high 100.80 (lower high), low 99.30 (higher low), high 100.75 (lower high), low 99.50 (higher low). The verdict reads: mixed swings, sideways or unclear.',
      glossaryRefs: ['market-structure', 'lower-high', 'higher-low'],
    },
    {
      id: 'T20-A03', type: 'range-overlay', durationMs: 28_000, fixtureId: 'FX-T20-COIN-01',
      parameters: { window: 10, slide: true },
      caption: 'Layer 2, range: the 10-candle window slides from candles 1–10 (high 101.80, low 99.20) to candles 6–15 (high 100.80, low 99.30): range 1.50 USDT, about 1.51%.',
      narration: 'The recent range shrinks as the early fall drops out of the window. The market is now boxed between 99.30 and 100.80.',
      reducedMotionDescription: 'A shaded 10-candle window moves across 15 fictional candles. At the start it covers candles 1 to 10 with high 101.80 and low 99.20. At the end it covers candles 6 to 15 with high 100.80 and low 99.30, a range of 1.50 USDT or about 1.51%.',
      glossaryRefs: ['price-range', 'lookback-window'],
    },
    {
      id: 'T20-A04', type: 'support-resistance-zone', durationMs: 26_000,
      parameters: { points: T20_CLOSES.map((c, i) => (i === 3 ? 99.3 : i === 7 ? 99.35 : c)), zone: { low: 99.2, high: 99.4, kind: 'support' } },
      caption: 'Layer 3, level: price visits the 99.20–99.40 support zone twice, then drifts back to 100.05, 0.65 above the zone and 0.55 below the 100.60 resistance.',
      narration: 'The zone is real, but price is not at it. A level only helps when price is near it.',
      reducedMotionDescription: 'A support band from 99.20 to 99.40 is drawn. The fictional price line enters it twice (visit counter goes 0, 1, 2) and ends at 100.05, which is 0.65 above the zone and 0.55 below the resistance zone starting at 100.60.',
      glossaryRefs: ['support-zone', 'key-level'],
    },
    {
      id: 'T20-A05', type: 'volume-bars', durationMs: 26_000, fixtureId: 'FX-T20-COIN-01',
      parameters: { variant: 'plain', highlight: [12, 13, 14] },
      caption: 'Layer 4, volume: bars shrink from 1,800 to 580 while the average stays about 1,003. The last three candles (600, 620, 580) are well below average.',
      narration: 'Interest is fading. Quiet markets can move suddenly, and thin liquidity can mean more slippage.',
      reducedMotionDescription: 'Fifteen fictional candles appear with volume bars below them. Volume starts at 1,400, peaks at 1,800 on candle 3 and falls to 580 on candle 15. The dashed average line is about 1,003. Candles 13 to 15 (volumes 600, 620, 580) are highlighted as below average.',
      glossaryRefs: ['trading-volume', 'liquidity'],
    },
    {
      id: 'T20-A06', type: 'position-sizing', durationMs: 28_000,
      parameters: { variant: 'builder', entry: 99.4, riskAmount: 10, stops: [99.0], side: 'long', balance: 1000 },
      caption: 'Layer 5, risk budget: entry 99.40, invalidation 99.00, stop distance 0.40 (0.40%). Example budget 10 USDT ÷ 0.40 = 25 DEMO, notional about 2,485 USDT.',
      narration: 'The invalidation point comes first. The size follows from it and from an example risk budget. Fees and slippage are not included.',
      reducedMotionDescription: 'Builder steps appear: fictional account 1,000 USDT; example risk budget 10 USDT; stop distance from 99.40 to 99.00 is 0.40 USDT (0.40%); size 10 ÷ 0.40 = 25 DEMO; notional about 2,485 USDT; before fees and slippage, and stops can slip.',
      glossaryRefs: ['invalidation-point', 'stop-loss'],
    },
    {
      id: 'T20-A07', type: 'text-card', durationMs: 22_000,
      parameters: { variant: 'checklist', heading: 'Checklist for the fictional coin', items: ['Trend: mixed swings, unclear.', 'Range: 99.30–100.80.', 'Level: price 100.05, between zones.', 'Volume: 580, below the ≈1,003 average.', 'Risk: plan only valid at 99.20–99.40.', 'Decision: no clear edge here.'] },
      caption: 'The checklist fills in one line per layer; four of six answers are “unclear” or “not here”.',
      reducedMotionDescription: 'Checklist: trend mixed and unclear; range 99.30 to 100.80; price 100.05 between zones; volume 580, below the average of about 1,003; the risk plan is only valid at the 99.20 to 99.40 zone; no clear edge here.',
      glossaryRefs: ['trade-checklist'],
    },
    {
      id: 'T20-A08', type: 'trade-lifecycle', durationMs: 24_000,
      parameters: { variant: 'decision-gate', steps: STEPS, path: T20_CLOSES, decision: 'NO_TRADE', outcome: 'Neutral signals: no edge at 100.05' },
      caption: 'All six steps are checked again; at the gate the DEMO decision appears: NO_TRADE at 100.05, because the signals are neutral.',
      narration: 'Neutral or uncertain evidence produces a no-trade decision. You can WAIT and check again if price reaches a zone.',
      reducedMotionDescription: 'The six steps are highlighted again beside the fictional price line ending at 100.05. Halfway through, a card shows: DEMO decision NO_TRADE, neutral signals, no edge at 100.05.',
      glossaryRefs: ['wait-decision', 'setup'],
    },
  ],

  exercises: [
    {
      id: 'T20-X01', type: 'decision-with-rationale', title: 'Evaluate the fictional coin',
      fixtureId: 'FX-T20-COIN-01',
      instructions: 'Read the 15 fictional one-minute candles. Tick only the checklist items you can actually see on the chart, then choose a DEMO decision and write your reason. You are scored on your reasoning, not on what price does next.',
      steps: [
        { id: 'T20-X01-01', prompt: 'Work through the checklist in order: trend, range, level, volume.', hint: 'Swings: 100.80 lower high, 99.30 higher low. Price 100.05. Last volume 580 vs average about 1,003.' },
        { id: 'T20-X01-02', prompt: 'Decide where the idea would be wrong (invalidation) and whether price is near it now.', hint: 'A long idea at support would be invalid below 99.00. Price is 1.05 above that.' },
        { id: 'T20-X01-03', prompt: 'Choose a DEMO decision and write at least one sentence explaining it.', hint: 'Mention at least two of: trend, range position, level, volume, risk.' },
      ],
      allowedControls: ['choice', 'tap-select', 'text-rationale', 'reset', 'hint'],
      choices: [
        { id: 'buy', text: 'Open a long now at 100.05.', decision: 'BUY' },
        { id: 'sell', text: 'Open a short now at 100.05.', decision: 'SELL' },
        { id: 'wait', text: 'Wait for price to reach a zone and show a trigger.', decision: 'WAIT' },
        { id: 'no-trade', text: 'No setup at this price; skip it.', decision: 'NO_TRADE' },
      ],
      parameters: {
        checklist: [
          { id: 'trend', text: 'Trend: the swings show a clear direction (all higher, or all lower).' },
          { id: 'range', text: 'Range: I can name the last-10 high (100.80) and low (99.30).' },
          { id: 'level', text: 'Level: price is inside a support or resistance zone right now.' },
          { id: 'volume', text: 'Volume: the latest candles are above average volume.' },
          { id: 'risk', text: 'Risk: I can name an invalidation point and it is close to the current price.' },
        ],
        context: [
          'Fictional DEMO/USDT, 1-minute candles, price now 100.05.',
          'Support zone 99.20–99.40; resistance zone 100.60–100.80.',
          'Average volume about 1,003; last candle 580.',
        ],
        decisionFeedback: {
          buy: 'The trend is mixed, price is mid-range and volume is low. A long here risks 1.05 per DEMO to the 99.00 invalidation for about 0.55 of room to resistance. The reasoning does not support it.',
          sell: 'A short at 100.05 has the support zone 0.65 below it and no clear downtrend (the last low is higher). There is no edge to describe.',
          wait: 'Good reasoning: the setup could form at a zone, but the entry trigger is missing now. Say which zone and which trigger you are waiting for.',
          'no-trade': 'Good reasoning: neutral evidence on trend, level and volume means there is no setup at this price. Skipping is a skilled decision.',
        },
        minRationale: 40,
      },
      expectedEvaluation: {
        kind: 'decision', acceptable: ['WAIT', 'NO_TRADE'], decisionSet: 'trade', requiresRationale: true,
        rationaleCues: [
          'The trend is unclear: lower highs and higher lows (mixed swings).',
          'Price 100.05 is in the middle of the 99.30–100.80 range, not at a key level.',
          'Volume (580) is below the ≈1,003 average: quiet market.',
          'The invalidation point for a long (99.00) is far away, so the risk per unit would be large.',
        ],
      },
      explanation: 'Only the range item can honestly be ticked. Trend is mixed, price is between zones, volume is below average, and the invalidation point is far from the current price. With neutral evidence the checklist ends in DEMO WAIT or DEMO NO_TRADE. Whatever price does next does not change whether this reasoning was sound.',
      fictionalDataLabel: 'Fictional DEMO/USDT chart for practice only. Educational simulation: no order is sent anywhere.',
    },
    {
      id: 'T20-X02', type: 'sequence-order', title: 'Put the evaluation steps in order',
      fixtureId: 'FX-T20-STEPS-01',
      instructions: 'Arrange the six evaluation steps in the order this course uses. Use the arrow buttons or drag the cards.',
      steps: [
        { id: 'T20-X02-01', prompt: 'Start with the big picture before any detail.', hint: 'Is the market going up, down or sideways?' },
        { id: 'T20-X02-02', prompt: 'Finish with the decision, after the risk is known.', hint: 'You cannot decide until you know where the idea is wrong and how big the size would be.' },
      ],
      allowedControls: ['drag', 'keyboard-move', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'decision', text: 'Tentative DEMO decision (BUY, SELL, WAIT or NO_TRADE)' },
          { id: 'volume', text: 'Volume and liquidity context' },
          { id: 'trend', text: 'Current trend' },
          { id: 'risk', text: 'Risk budget and invalidation point' },
          { id: 'level', text: 'Nearest level or zone' },
          { id: 'range', text: 'Recent price range' },
        ],
      },
      expectedEvaluation: { kind: 'sequence', order: ['trend', 'range', 'level', 'volume', 'risk', 'decision'] },
      explanation: 'Trend and range give the context; the level shows whether price is at an interesting place; volume shows how active the market is; the risk budget turns the idea into numbers; only then do you decide.',
      fictionalDataLabel: 'Illustrative steps; no market data involved.',
    },
    {
      id: 'T20-X03', type: 'position-size', title: 'Size the idea from its invalidation point',
      fixtureId: 'FX-T20-RISK-01', simulatorId: 'risk.position-size',
      instructions: 'A fictional long idea: entry 99.40 at the support zone, invalidation 99.00, illustrative account 1,000 USDT and an example risk budget of 10 USDT. Work out the risk per unit and the size. Simple model: fees and slippage are left out.',
      steps: [
        { id: 'T20-X03-01', prompt: 'Risk per unit (stop distance) = |entry − invalidation|, in USDT to 2 decimals.', hint: '99.40 − 99.00' },
        { id: 'T20-X03-02', prompt: 'Size = risk budget ÷ risk per unit, in DEMO to 2 decimals.', hint: '10 ÷ 0.40' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: {
        playground: { balance: 1000, riskAmount: 10, entry: 99.4, stop: 99.0, side: 'long' },
        scenario: { text: 'Long idea at the fictional 99.20–99.40 support zone, invalid below 99.00.' },
      },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'stopDistance', label: 'Risk per unit', value: 0.4, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'quantity', label: 'Size', value: 25, tolerance: 0.005, unit: 'DEMO', rounding: { decimals: 2 } },
      ] },
      explanation: 'The idea is wrong below 99.00, so each DEMO risks 0.40 USDT. With an example budget of 10 USDT that allows 25 DEMO, a notional of about 2,485 USDT. A real stop can slip, so the actual loss could be larger.',
      fictionalDataLabel: 'Fictional illustrative numbers; the risk budget is an example, not a recommendation.',
    },
  ],

  formulas: [
    {
      id: 'T20-F01', name: 'Size from an invalidation point', expression: 'risk per unit = |entry − invalidation|; size = risk budget ÷ risk per unit; notional = size × entry',
      variables: [
        { symbol: 'entry, invalidation', meaning: 'planned entry and the price where the idea is wrong', unit: 'USDT per DEMO' },
        { symbol: 'risk budget', meaning: 'example amount you accept losing if the invalidation is hit', unit: 'USDT' },
      ],
      simulatorId: 'risk.position-size', approximate: false,
      workedExamples: [
        { label: 'Long idea at support (notes example 2, exercise T20-X03)', inputs: { riskAmount: 10, entry: 99.4, stop: 99.0, accountBalance: 1000 }, outputs: { stopDistance: 0.4, quantity: 25, notional: 2485 }, tolerance: 1e-6, assumptions: ['fictional data', 'fees and slippage excluded'] },
      ],
    },
    {
      id: 'T20-F02', name: 'Location changes the reward-to-risk', expression: 'ratio = |target − entry| ÷ |entry − invalidation|',
      variables: [
        { symbol: 'entry, invalidation, target', meaning: 'planned prices of the idea', unit: 'USDT per DEMO' },
      ],
      simulatorId: 'risk.reward', approximate: false,
      workedExamples: [
        { label: 'Entry at the zone (notes example 2)', inputs: { entry: 99.4, stop: 99.0, target: 100.6 }, outputs: { riskPerUnit: 0.4, rewardPerUnit: 1.2, ratio: 3 }, tolerance: 1e-6, assumptions: ['fictional data'] },
        { label: 'Entry mid-range at 100.05 (notes example 2, quiz T20-Q03)', inputs: { entry: 100.05, stop: 99.0, target: 100.6 }, outputs: { riskPerUnit: 1.05, rewardPerUnit: 0.55, ratio: 0.52 }, tolerance: 0.005, assumptions: ['fictional data'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T20-Q01', type: 'ordering', cognitiveTag: 'recall', linkedLessonId: 'T20',
      prompt: 'Put the evaluation steps in the order used in this course.',
      choices: [
        { id: 'trend', text: 'Current trend' },
        { id: 'range', text: 'Recent price range' },
        { id: 'level', text: 'Level or zone' },
        { id: 'volume', text: 'Volume and liquidity' },
        { id: 'risk', text: 'Risk budget' },
        { id: 'decision', text: 'Tentative decision' },
      ],
      answer: { kind: 'order', choiceIds: ['trend', 'range', 'level', 'volume', 'risk', 'decision'] },
      rationale: 'Context first (trend, range), then location (level), then activity (volume), then numbers (risk), and the decision last.',
      learningOutcome: 'Recall the six-step evaluation order.',
      remediationRef: { lessonId: 'T20', anchorId: 'T20-N04' },
      shuffleChoices: false,
    },
    {
      id: 'T20-Q02', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T20', fixtureId: 'FX-T20-COIN-01',
      prompt: 'On the fictional chart, price is 100.05, the last-10 range is 99.30–100.80, swings are mixed and the last volume is 580 against an average of about 1,003. What is the best tentative DEMO decision?',
      choices: [
        { id: 'a', text: 'DEMO NO_TRADE (or WAIT): the evidence is neutral and price is not at a key level.', decision: 'NO_TRADE' },
        { id: 'b', text: 'DEMO BUY: the last candle closed slightly higher.', decision: 'BUY' },
        { id: 'c', text: 'DEMO SELL: volume is falling, so price must fall.', decision: 'SELL' },
        { id: 'd', text: 'DEMO BUY: four of the six steps are done, which is enough.', decision: 'BUY' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Trend unclear, price mid-range, volume quiet: there is no setup to describe here. Abstaining is the reasoned answer.',
      misconceptionFeedback: {
        b: 'One small candle is the least informative part of the chart. The context around it is neutral.',
        c: 'Low volume shows low interest. It does not say which way price will move.',
        d: 'Completing steps is not the same as the steps being clear. Here most answers are “unclear”.',
      },
      learningOutcome: 'Turn neutral checklist answers into a WAIT or NO_TRADE decision.',
      remediationRef: { lessonId: 'T20', anchorId: 'T20-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T20-Q03', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T20',
      prompt: 'A fictional long idea: entry 99.40, invalidation 99.00, example risk budget 10 USDT. What size in DEMO does the simple model give?',
      answer: { kind: 'numeric', value: 25, tolerance: 0.005, unit: 'DEMO', rounding: { decimals: 2 } },
      rationale: 'Risk per unit = 99.40 − 99.00 = 0.40 USDT. Size = 10 ÷ 0.40 = 25 DEMO (notional about 2,485 USDT), before fees and slippage.',
      learningOutcome: 'Compute a size from an invalidation point and an example risk budget.',
      remediationRef: { lessonId: 'T20', anchorId: 'T20-N03' },
    },
    {
      id: 'T20-Q04', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T20', safetyCritical: true, safetyTopic: 'no-trade',
      prompt: 'A learner fills the checklist: trend unclear, price in the middle of the range, volume below average. They say: “I have spent ten minutes on this chart, so I should take some trade.” What is the best response?',
      choices: [
        { id: 'a', text: 'Time spent is not evidence. Neutral answers mean DEMO WAIT or NO_TRADE, which is a complete, skilled decision.', decision: 'WAIT' },
        { id: 'b', text: 'Agree: after a full checklist you should always pick BUY or SELL.' },
        { id: 'c', text: 'Pick the side of the last candle, but with a smaller size.' },
        { id: 'd', text: 'Remove the volume step so the checklist looks better.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The checklist exists to show when there is no edge. Abstaining is a valid outcome, and in a quiet mid-range market it is the reasoned one.',
      misconceptionFeedback: {
        b: 'A checklist is not a machine that must end in a trade. Unclear answers point to waiting.',
        c: 'A smaller size still means a trade without a reason. Size does not create an edge.',
        d: 'Changing the checklist to fit a wish defeats its purpose.',
      },
      learningOutcome: 'Accept WAIT or NO_TRADE as the outcome of a neutral evaluation.',
      remediationRef: { lessonId: 'T20', anchorId: 'T20-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T20-Q05', type: 'single', cognitiveTag: 'application', linkedLessonId: 'T20',
      prompt: 'Which statement best describes an invalidation point?',
      choices: [
        { id: 'a', text: 'The price, chosen before entry, where the trade idea is proven wrong; it sets the risk per unit.' },
        { id: 'b', text: 'The price where you hope the market will turn back in your favour.' },
        { id: 'c', text: 'The take-profit price.' },
        { id: 'd', text: 'A price you decide after the trade starts losing.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The invalidation point is planned in advance; the distance from entry to it is the risk per unit used for sizing.',
      misconceptionFeedback: {
        b: 'Hope is not a plan. The invalidation point says where the idea is finished.',
        c: 'The take-profit is the target. The invalidation point is on the other side of the entry.',
        d: 'Deciding after the loss starts usually means moving the line. It must be chosen before entry.',
      },
      learningOutcome: 'Define an invalidation point and its role in sizing.',
      remediationRef: { lessonId: 'T20', anchorId: 'T20-N01' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Deciding from the last candle before looking at trend and range.', correction: 'Follow the order: trend, range, level, volume, risk, decision.' },
    { mistake: 'Planning an entry without an invalidation point.', correction: 'Write where the idea is wrong first; the size is calculated from it.' },
    { mistake: 'Believing a finished checklist must end in BUY or SELL.', correction: 'Neutral or unclear answers lead to DEMO WAIT or NO_TRADE.' },
  ],
  takeaways: [
    'Evaluate in a fixed order: trend, range, level, volume, risk budget, then a tentative decision.',
    'Every setup needs an invalidation point; size comes from the risk budget and that distance.',
    'Neutral or uncertain evidence means DEMO WAIT or NO_TRADE, and that is a skilled answer.',
  ],
  reviewCard: {
    keyTermIds: ['trade-checklist', 'invalidation-point', 'wait-decision'],
    safetyNote: 'No checklist removes uncertainty. When the evidence is neutral, DEMO WAIT or NO_TRADE is the right decision.',
    reviewMinutes: 4,
    retrievalQuestion: 'Name the six evaluation steps in order, and say what you decide if price is in the middle of a quiet range.',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T20-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
