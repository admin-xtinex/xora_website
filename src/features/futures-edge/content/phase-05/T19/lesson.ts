import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { CHART15_CLOSES, fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices, volumes and results in this lesson are fictional DEMO/USDT examples made for teaching. Fee and slippage rates are illustrative and vary by exchange and account. No real orders are placed.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can define scalping, holding period, trade frequency and execution quality, and contrast scalping with a longer time horizon.',
    'Learner can estimate round-trip costs and show how they turn small gross wins into net losses, and how they accumulate over many trades.',
    'Learner can identify situations where trading is inappropriate and choose WAIT or NO_TRADE with a reason.',
  ],
  glossaryEntries,
  notesComplexity: 'complex-risk',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T19-S01', kind: 'cover-problem', title: 'Small moves, many times',
      narrationText: 'Scalping sounds simple: catch a small move, repeat. But every trade pays fees and often slippage, and every trade is another chance to lose. This lesson looks at scalping honestly, not as easy money.',
      blocks: [
        { kind: 'paragraph', text: 'Catch a small move. Repeat. It sounds simple.' },
        { kind: 'paragraph', text: 'But **every trade pays costs** and **every trade can lose**. Scalping is demanding work, not easy money.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T19-A01' },
      glossaryRefs: ['scalping'],
      speakerNotes: 'Set the tone early: this is an evaluation workflow, not a promise. No easy-money framing anywhere.',
    },
    {
      id: 'T19-S02', kind: 'key-definition', title: 'What scalping means',
      narrationText: 'Scalping aims at small price moves over a short time. The holding period is short, the price move is small, the trade frequency can be high, so costs and execution quality matter a lot.',
      blocks: [
        { kind: 'definition', termId: 'scalping' },
        { kind: 'list', ordered: false, items: ['Short holding period (minutes)', 'Small price move per trade', 'Often high trade frequency', 'Costs and execution quality decide a lot'] },
      ],
      glossaryRefs: ['scalping', 'time-horizon'],
    },
    {
      id: 'T19-S03', kind: 'visual-breakdown', title: 'Short horizon versus longer horizon',
      narrationText: 'On the short view, fifteen one-minute candles span only 0.40 percent. On a four-hour view the same coin swings about 3.1 percent. Scalping lives inside the small wiggles; swing trading rides the bigger ones.',
      blocks: [
        { kind: 'paragraph', text: '15 minutes: range **0.40%**. 4 hours: range about **3.1%**.' },
        { kind: 'paragraph', text: '[[scalping|Scalping]] works inside the small wiggles. [[swing-trading|Swing trading]] holds for the bigger swings, with its own risks.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T19-A03' },
      glossaryRefs: ['swing-trading', 'time-horizon'],
    },
    {
      id: 'T19-S04', kind: 'worked-example', title: 'A gross winner, a net loser',
      narrationText: 'Buy 10 DEMO at 100.00, sell at 100.10. Gross profit is 1.00 USDT. Fees are about 0.50 on entry and 0.50 on exit, plus about 0.40 slippage. Net result: minus 0.40 USDT.',
      blocks: [
        {
          kind: 'worked-example', title: 'One fictional scalp, 10 DEMO', fictional: true,
          steps: [
            { text: 'Gross = (100.10 − 100.00) × 10', result: '+1.00 USDT' },
            { text: 'Fees 0.05% each side', result: '−1.0005 USDT' },
            { text: 'Slippage estimate', result: '−0.40 USDT' },
          ],
          conclusion: 'Net ≈ −0.40 USDT. The move was right; the trade still lost.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T19-A04' },
      glossaryRefs: ['trading-fee', 'slippage'],
    },
    {
      id: 'T19-S05', kind: 'risks-misunderstanding', title: '10–15 minutes is an analysis horizon',
      narrationText: 'XORA proposes looking about 10 to 15 minutes ahead when you analyse. That is not a rule to hold a trade for 10 to 15 minutes, and it is not a promise that price will move in that time. And more trades means more costs, not more profit.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Not a holding rule', text: '10–15 minutes is XORA’s **analysis** horizon. It is not a required holding time and not a fixed prediction window.' },
        { kind: 'callout', callout: 'safety', text: 'More trades = more certain costs and more chances to lose. [[overtrading|Overtrading]] drains accounts.' },
      ],
      glossaryRefs: ['time-horizon', 'overtrading'],
    },
    {
      id: 'T19-S06', kind: 'guided-practice', title: 'Decide, compare, sort',
      narrationText: 'You will decide on a fictional fifteen-minute chart where WAIT or NO TRADE is allowed, compare a scalp-sized move with a longer-horizon move after costs, and sort situations where trading is inappropriate.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Decide on a fictional 15-minute chart (WAIT allowed).', 'Compare a scalp move with a longer move after costs.', 'Sort situations where trading is inappropriate.'] },
        { kind: 'callout', callout: 'tip', text: 'Ask first: is the room to my target clearly bigger than my round-trip costs?' },
      ],
      glossaryRefs: ['round-trip'],
    },
    {
      id: 'T19-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Scalping aims at small, short moves. Costs are certain and take a large share of each small result. Ten to fifteen minutes is an analysis horizon, not a holding rule. Waiting or not trading is always allowed.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Scalping = small moves, short holding, often many trades.', 'Costs are certain; small targets leave little room.', '10–15 min = analysis horizon, not a holding rule.', 'WAIT and NO_TRADE are always valid.'] },
      ],
      glossaryRefs: ['scalping', 'overtrading'],
    },
  ],

  notesSections: [
    {
      id: 'T19-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: '[[scalping|Scalping]] is a trading style that tries to catch small price moves over a short time. Four ideas describe it. The **holding period** is how long a position stays open, usually minutes. The **price move** aimed for is small, often a fraction of a percent. The **trade frequency** can be high, sometimes many trades a day. And **execution quality**, meaning how close your fill is to the price you planned, matters a lot, because [[slippage]] and the [[spread]] are large next to such small targets.' },
        { kind: 'paragraph', text: 'A [[time-horizon|time horizon]] is how far ahead your analysis looks. XORA proposes a **10–15 minute analysis horizon** for scalping study. This is a suggestion for how far ahead to think. It is **not** a mandatory holding time, and it is **not** a fixed prediction window: you may exit after two minutes if your stop is hit, and you may decide not to enter at all. [[swing-trading|Swing trading]] uses a longer horizon of hours or days.' },
        { kind: 'analogy', text: 'Scalping is like running a small shop with a tiny margin on each item. Every sale pays rent and card fees. Sell too many items at too small a margin and the fees eat everything.' },
      ],
    },
    {
      id: 'T19-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Short charts move all the time, so they seem full of chances. But each [[round-trip]] pays a [[trading-fee|fee]] on entry and on exit, plus slippage and spread. Those costs are certain; profits are not. When the target is small, costs can be the biggest number in the trade. Many trades also mean many chances to be wrong, and the urge to “do something” leads to [[overtrading]].' },
      ],
    },
    {
      id: 'T19-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: one scalp, 10 DEMO at 100.00 (fictional, illustrative rates)', fictional: true,
          steps: [
            { text: 'Notional = 10 × 100.00', result: '1,000 USDT' },
            { text: 'Round-trip estimate = 1,000 × 2 × (0.05% fee + 0.02% slippage)', result: '1.40 USDT' },
            { text: 'Exit at 100.10: gross = 0.10 × 10', result: '+1.00 USDT' },
            { text: 'Fees 0.50 + 0.5005, slippage 0.40', result: '−1.4005 USDT' },
          ],
          conclusion: 'Net = 1.00 − 1.4005 = −0.4005 USDT. Price moved the right way, yet the trade lost money.',
        },
        {
          kind: 'worked-example', title: 'Example 2: many trades add up (fictional)', fictional: true,
          steps: [
            { text: '20 trades like example 1: gross = 20 × 1.00', result: '+20.00 USDT' },
            { text: 'Costs = 20 × 1.4005', result: '−28.01 USDT' },
            { text: 'Net', result: '−8.01 USDT' },
          ],
          conclusion: 'Every trade was a gross winner and the session still lost. Real sessions also contain losing trades, which make it worse.',
        },
        {
          kind: 'worked-example', title: 'Example 3: a longer-horizon move (fictional)', fictional: true,
          steps: [
            { text: 'Same 10 DEMO, exit at 101.00: gross', result: '+10.00 USDT' },
            { text: 'Fees 0.50 + 0.505, slippage 0.40', result: '−1.405 USDT' },
          ],
          conclusion: 'Net +8.595 USDT. Costs are a small share here, but a 1% move can just as easily go against you, and the position is exposed for longer.',
        },
      ],
    },
    {
      id: 'T19-N04', heading: 'how-to-recognize', title: 'How to recognise a situation',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'State your analysis horizon (for example the next 10–15 minutes) and the window you measured.',
          'Measure the recent [[price-range|range]] and the room to your target.',
          'Estimate round-trip costs: notional × 2 × (fee rate + slippage rate).',
          'If the room is not clearly bigger than the costs, the answer is WAIT or NO_TRADE.',
          'Check the spread and [[liquidity]]; a wide spread or thin book is a reason to skip.',
          'Check yourself: tired, angry, or trying to win back a loss means stop.',
        ] },
      ],
    },
    {
      id: 'T19-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Ignoring costs', text: 'A gross win smaller than the round-trip costs is a net loss. Estimate costs before you think about the target.' },
        { kind: 'callout', callout: 'mistake', title: 'Treating 10–15 minutes as a rule', text: 'It is an analysis horizon. You do not have to hold that long, and price does not have to move within it.' },
        { kind: 'callout', callout: 'mistake', title: 'More trades = more profit', text: 'More trades means more certain costs and more chances to lose. Quality first; skipping is free.' },
      ],
    },
    {
      id: 'T19-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Scalping is not easy money and nothing here is a recommendation. Market and stop orders can slip, fast markets can jump past your stop, and leverage magnifies losses. Fee and slippage rates in this lesson are illustrative only. WAIT and NO_TRADE are always allowed, and a skipped trade costs nothing.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T19-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Scalping versus a longer horizon', headers: ['', 'Scalping', 'Longer horizon (swing)'], rows: [
          ['Holding period', 'minutes', 'hours to days'],
          ['Typical move aimed for', 'a fraction of a percent', 'a few percent'],
          ['Trade frequency', 'often high', 'lower'],
          ['Costs as share of result', 'large', 'smaller'],
          ['Main extra risks', 'costs, slippage, overtrading', 'bigger adverse moves, time exposed'],
        ] },
      ],
    },
    {
      id: 'T19-N08', heading: 'learn-more', title: 'Learn more: maker fees, funding and why horizons are not ranked', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Limit orders that wait in the book may pay a lower maker fee (0.02% per side in this course’s illustration) but may not fill at all. Positions held across funding times on perpetual futures can also pay or receive funding. Neither changes the core point: costs are certain and must be smaller than the realistic room to a target.' },
        { kind: 'paragraph', text: 'No horizon is “best”. Short horizons concentrate cost and execution risk; long horizons concentrate time and gap risk. Choosing a horizon is about fitting the risk you can study and control, not about finding easier profits.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T19-A01', type: 'volume-bars', durationMs: 30_000, fixtureId: 'FX-T19-CHART15-01',
      parameters: { variant: 'plain', highlight: [4, 10] },
      caption: 'A fictional 15-minute chart builds minute by minute. Minute 5 bounces off 100.00; minute 11 touches 100.40 and slips back. The whole range is only 0.40%.',
      narration: 'Two candidate short-term observations appear: a bounce near the low and a rejection near the high. They are observations, not signals.',
      reducedMotionDescription: 'Fifteen fictional 1-minute DEMO/USDT candles. Minute 5 dips to 100.00 and closes at 100.20 (observation 1). Minute 11 reaches 100.40 and closes at 100.27 (observation 2). The 15-minute range is 100.00 to 100.40, or 0.40%. Average volume is 176 DEMO per candle.',
      glossaryRefs: ['scalping', 'price-range'],
    },
    {
      id: 'T19-A02', type: 'price-path', durationMs: 25_000,
      parameters: { variant: 'plain', points: CHART15_CLOSES, markers: [{ index: 4, label: 'Obs 1' }, { index: 10, label: 'Obs 2' }], level: { price: 100.4, label: 'Previous high 100.40' } },
      caption: 'The closing prices trace the same 15 minutes. Obs 1 lifts from 100.04 to 100.20; Obs 2 stalls below the 100.40 high and price ends near 100.30.',
      narration: 'Each observation only moves price by about 0.10 to 0.20 USDT: tiny moves to aim for once costs are counted.',
      reducedMotionDescription: 'A line of fifteen fictional closing prices from 100.18 down to 100.04, up to 100.33, then ending at 100.30. Observation 1 at minute 5 (close 100.20). Observation 2 at minute 11 (close 100.27), below the previous high of 100.40.',
      glossaryRefs: ['previous-high'],
    },
    {
      id: 'T19-A03', type: 'price-path', durationMs: 30_000,
      parameters: { variant: 'horizon-compare', points: CHART15_CLOSES, label: 'Short horizon: 15 one-minute closes (range 0.40%)', comparePoints: [99.2, 99.6, 99.4, 100.1, 100.6, 100.3, 100.9, 101.5, 101.1, 101.8, 102.3, 101.7, 101.2, 100.6, 100.2, 100.3], compareLabel: 'Longer horizon: 4 hours of 15-minute closes (range about 3.1%)' },
      caption: 'First the 15-minute path draws, spanning just 0.40%; then a 4-hour path draws below it, swinging from 99.20 to 102.30, about 3.1%.',
      narration: 'Same fictional coin, two horizons. The short view has small wiggles; the long view has bigger swings, in both directions.',
      reducedMotionDescription: 'Top: the 15-minute fictional path between 100.04 and 100.33 closes (range of highs and lows 0.40%). Bottom: a 4-hour fictional path in 15-minute steps from 99.20 up to 102.30 and back to 100.30, a range of about 3.1%.',
      glossaryRefs: ['time-horizon', 'swing-trading'],
    },
    {
      id: 'T19-A04', type: 'fee-buildup', durationMs: 30_000,
      parameters: { variant: 'waterfall', side: 'long', entry: 100, exit: 100.1, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005, slippageCost: 0.4 },
      caption: 'One scalp, bar by bar: gross +1.00 USDT, entry fee −0.50, exit fee −0.5005, slippage −0.40. The net bar lands at −0.4005 USDT.',
      narration: 'The move was right. The trade still lost, because the costs were bigger than the move.',
      reducedMotionDescription: 'Long 10 fictional DEMO from 100.00 to 100.10. Gross result +1.00 USDT. Entry fee 0.50 USDT and exit fee 0.5005 USDT (illustrative 0.05% each side), slippage 0.40 USDT. Net result −0.4005 USDT: a gross winner became a net loser.',
      glossaryRefs: ['trading-fee', 'slippage'],
    },
    {
      id: 'T19-A05', type: 'fee-buildup', durationMs: 30_000,
      parameters: { variant: 'accumulate', side: 'long', entry: 100, exit: 100.1, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005, slippageCost: 0.4, trades: 20 },
      caption: 'Trades stack up one by one. After 20 identical small winners: gross +20.00, costs 28.01, net −8.01 USDT.',
      narration: 'Each extra trade adds a certain cost and another chance to lose. Here even twenty winners in a row lose money overall.',
      reducedMotionDescription: 'Twenty identical fictional trades, each gross +1.00 USDT with 1.4005 USDT of costs. Running totals after 20 trades: gross +20.00 USDT, costs 28.01 USDT, net −8.01 USDT.',
      glossaryRefs: ['overtrading', 'round-trip'],
    },
    {
      id: 'T19-A06', type: 'trade-lifecycle', durationMs: 30_000,
      parameters: { variant: 'decision-gate', steps: ['Analysis view: 10–15 min', 'Measure recent range', 'Estimate round-trip costs', 'Room to target vs costs', 'Spread and liquidity', 'Decide (WAIT allowed)'], path: CHART15_CLOSES, decision: 'NO_TRADE', outcome: 'Room 0.19% vs costs 0.14%: skip' },
      caption: 'The checklist lights up step by step. Room to the 100.40 high is 0.19%, costs are 0.14%: the gate closes on DEMO NO_TRADE.',
      narration: 'A decision process, not a signal. When the room is barely bigger than the costs, the honest answer is not to trade.',
      reducedMotionDescription: 'Six steps: state a 10–15 minute analysis view; measure the recent range (100.00 to 100.40); estimate round-trip costs (0.14%); compare room to target (100.21 to 100.40 = 0.19%) with costs; check spread and liquidity; decide. Decision: DEMO NO_TRADE.',
      glossaryRefs: ['time-horizon'],
    },
    {
      id: 'T19-A07', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'risk-warning', heading: '10–15 minutes is an analysis horizon', items: ['It is not a required holding time.', 'It is not a promise that price moves within it.', 'Exit earlier if your stop is hit; skip if unclear.', 'More trades = more costs, not more profit.'] },
      caption: 'Safety: the four warnings appear one by one, ending with the reminder that more trades bring more costs, not more profit.',
      reducedMotionDescription: 'Warning card: 10–15 minutes is an analysis horizon; it is not a required holding time; it is not a promise that price moves within it; exit earlier if your stop is hit and skip if unclear; more trades mean more costs, not more profit.',
    },
  ],

  exercises: [
    {
      id: 'T19-X01', type: 'decision-with-rationale', title: 'Scalp or skip?',
      fixtureId: 'FX-T19-CHART15-01',
      instructions: 'You see a fictional 15-minute DEMO/USDT chart. Reveal the next candle, tick only what you can actually see, choose a DEMO decision and write a short reason. Nothing is sent anywhere.',
      steps: [
        { id: 'T19-X01-01', prompt: 'Study the first 11 minutes, then reveal minute 12.', hint: 'Minute 11 touched 100.40 and closed back at 100.27. Minute 12 closes at 100.21.' },
        { id: 'T19-X01-02', prompt: 'Compare the room to the previous high with the round-trip cost estimate.', hint: '100.40 − 100.21 = 0.19, about 0.19%. Costs are about 0.14%. What is left if everything goes perfectly?' },
        { id: 'T19-X01-03', prompt: 'Choose BUY, SELL, WAIT or NO_TRADE and explain why in one or two sentences.', hint: 'WAIT and NO_TRADE are full answers. A good reason mentions room versus costs.' },
      ],
      allowedControls: ['step-reveal', 'tap-select', 'choice', 'text-rationale', 'reset', 'hint'],
      choices: [
        { id: 'buy', text: 'Buy now, aiming for the 100.40 high.', decision: 'BUY' },
        { id: 'sell', text: 'Sell now, aiming for the 100.00 low.', decision: 'SELL' },
        { id: 'wait', text: 'Wait: no clear room after costs yet; look again later.', decision: 'WAIT' },
        { id: 'no-trade', text: 'No trade: this range is too small for the costs.', decision: 'NO_TRADE' },
      ],
      parameters: {
        reveal: [11, 12],
        context: [
          'Fictional 15-minute range so far: 100.00 to 100.40 (0.40%). Last close about 100.21.',
          'Illustrative round-trip cost estimate on 1,000 USDT: 1,000 × 2 × (0.05% + 0.02%) = 1.40 USDT, about 0.14%.',
          'Minute 11 touched 100.40 and closed back at 100.27.',
        ],
        checklist: [
          { id: 'range', text: 'The recent [[price-range|range]] is very small (0.40%).' },
          { id: 'costs', text: 'Room to the previous high (about 0.19%) is barely above the costs (about 0.14%).' },
          { id: 'rejected', text: 'The 100.40 high was touched and rejected at minute 11.' },
          { id: 'certain', text: 'Price is certain to reach 100.40 within 15 minutes.' },
        ],
        decisionFeedback: {
          buy: 'Even a perfect move to 100.40 leaves about 0.05% after costs, and the high was just rejected. The risk is large next to what is left.',
          sell: 'The low at 100.00 is about 0.21% away, again barely above costs, and nothing on the chart points down clearly.',
          wait: 'Reasonable: the room is too small for the costs right now. Waiting costs nothing.',
          'no-trade': 'Reasonable: a 0.40% range with 0.14% costs leaves almost nothing. Skipping is a valid decision.',
        },
        minRationale: 30,
      },
      expectedEvaluation: {
        kind: 'decision', decisionSet: 'trade', acceptable: ['WAIT', 'NO_TRADE'], requiresRationale: true,
        rationaleCues: [
          'The room to the target (about 0.19%) is barely bigger than the round-trip costs (about 0.14%).',
          'The 100.40 high was touched and rejected; nothing is certain.',
          '10–15 minutes is only an analysis horizon; there is no obligation to trade within it.',
        ],
      },
      explanation: 'With a 0.40% range and about 0.14% of costs, even a perfect scalp keeps very little, while a move against you costs the full stop plus fees. WAIT or NO_TRADE is the disciplined answer here. The rest of the chart shown afterwards is only one possible outcome.',
      fictionalDataLabel: 'Fictional DEMO/USDT chart and illustrative rates for practice only.',
    },
    {
      id: 'T19-X02', type: 'slider-explore', title: 'Scalp move versus longer-horizon move',
      fixtureId: 'FX-T19-COSTS-01', simulatorId: 'fees.net',
      instructions: 'A fictional long of 10 DEMO entered at 100.00 with illustrative costs: 0.05% fee each side plus 0.40 USDT slippage. Move the exit price slider and watch gross, costs and net change.',
      steps: [
        { id: 'T19-X02-01', prompt: 'Set the exit to 100.10, a scalp-sized move. Read the net result.', hint: 'Gross +1.00, costs about 1.40: net about −0.40 USDT.' },
        { id: 'T19-X02-02', prompt: 'Set the exit to 101.00, a longer-horizon move. Read the net result.', hint: 'Gross +10.00, costs about 1.41: net about +8.60 USDT. Remember a 1% move can also go against you.' },
        { id: 'T19-X02-03', prompt: 'Find the exit where net is about zero, then answer the question.', hint: 'Move the slider until net changes sign: it happens a little above 100.14.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'choice', 'reset', 'hint'],
      choices: [
        { id: 'a', text: 'About 100.14: price must rise about 0.14% just to cover costs.' },
        { id: 'b', text: '100.00: any exit above the entry is a profit.' },
        { id: 'c', text: 'About 100.05: only the entry fee matters.' },
        { id: 'd', text: '100.10: a 0.10% move always covers costs.' },
      ],
      parameters: {
        sliders: [{ key: 'exit', label: 'Exit price', min: 99.8, max: 101.2, step: 0.02, value: 100.1, unit: 'USDT' }],
        fixed: { entry: 100, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005, slippageCost: 0.4 },
        outputs: [
          { key: 'grossPnl', label: 'Gross result', unit: 'USDT', decimals: 2 },
          { key: 'totalCosts', label: 'Fees + slippage', unit: 'USDT', decimals: 4 },
          { key: 'netPnl', label: 'Net result', unit: 'USDT', decimals: 2 },
        ],
        side: 'long',
        note: 'Illustrative rates only; real fees and slippage vary by exchange, account and market conditions.',
        question: 'Roughly which exit price does this long need just to break even after all costs?',
        feedback: {
          a: 'Right: 10 × (exit − 100) must cover 0.50 + 0.005 × exit + 0.40, which gives about 100.14.',
          b: 'Above entry is only a gross profit. Fees and slippage must be covered first.',
          c: 'Both fees and the slippage count, not only the entry fee.',
          d: 'At 100.10 the net is about −0.40 USDT. The move is smaller than the costs.',
        },
      },
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'a' },
      explanation: 'With about 1.40 USDT of round-trip costs on 1,000 USDT, a scalp needs roughly a 0.14% move just to break even. A longer-horizon 1% move leaves most of the gross result, but it is also a 1% risk if price goes the other way. Neither horizon is free of risk.',
      fictionalDataLabel: 'Fictional position and illustrative rates for practice only.',
    },
    {
      id: 'T19-X03', type: 'classify', title: 'When is trading inappropriate?',
      fixtureId: 'FX-T19-SITUATIONS-01',
      instructions: 'Each card describes a fictional moment in a practice session. Decide: is trading inappropriate (WAIT or NO_TRADE), or could the idea be evaluated further in DEMO?',
      steps: [
        { id: 'T19-X03-01', prompt: 'Read each situation and ask: are costs, conditions and my own state acceptable?', hint: 'Room smaller than costs, a wide spread, no stop, chaotic news moves or chasing a loss are all reasons to skip.' },
        { id: 'T19-X03-02', prompt: 'Place every card, then press Check.', hint: '“Evaluate further” never means “sure to win”. It only means nothing obvious rules it out.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'cost-bigger', text: 'The room to the previous high is 0.10%, but the round-trip cost estimate is 0.14%.' },
          { id: 'wide-spread', text: 'The spread is unusually wide and the order book looks thin.' },
          { id: 'two-losses', text: 'You just had 2 losses in a row and want to win it back quickly.' },
          { id: 'no-stop', text: 'You cannot say where you would exit if the idea is wrong.' },
          { id: 'news-spike', text: 'A sudden 3% candle just appeared on news and price is jumping around.' },
          { id: 'plan-ready', text: 'Range, costs, stop and size are written down, and the room to the target is several times the costs.' },
          { id: 'session-start', text: 'It is your first idea of the session, spread looks normal, and your session limit is not reached.' },
        ],
        buckets: [
          { id: 'inappropriate', label: 'Inappropriate: WAIT or NO_TRADE' },
          { id: 'evaluate', label: 'Could be evaluated further in DEMO' },
        ],
        itemFeedback: {
          'cost-bigger': 'Room 0.10% is smaller than costs 0.14%: even a perfect move loses.',
          'wide-spread': 'A wide spread and thin book mean higher costs and more slippage.',
          'two-losses': 'Trying to win back losses is a classic path to overtrading. Pause instead.',
          'no-stop': 'Without a planned exit you cannot size the risk. No plan, no trade.',
          'news-spike': 'Chaotic news moves bring big slippage and gaps through stops.',
          'plan-ready': 'Nothing obvious rules it out, so it can be studied further in DEMO. It is still not a sure win.',
          'session-start': 'Conditions look normal, so it can be evaluated further. You still check room versus costs first.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { inappropriate: ['cost-bigger', 'wide-spread', 'two-losses', 'no-stop', 'news-spike'], evaluate: ['plan-ready', 'session-start'] } },
      explanation: 'Skip when costs exceed the realistic room, when conditions are chaotic or thin, when there is no planned exit, or when emotion is driving. Even in good conditions the next step is careful evaluation in DEMO, never a promise of profit.',
      fictionalDataLabel: 'Fictional situations for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T19-F01', name: 'Round-trip cost estimate', expression: 'estimate = notional × 2 × (fee rate + slippage rate)',
      variables: [
        { symbol: 'notional', meaning: 'position value at entry: quantity × entry price', unit: 'USDT' },
        { symbol: 'fee rate, slippage rate', meaning: 'illustrative per-side rates (0.05% taker fee, 0.02% slippage)', unit: 'fraction' },
      ],
      simulatorId: 'fees.estimate-round-trip', approximate: true,
      workedExamples: [
        { label: 'Notes example 1 (1,000 USDT)', inputs: { notional: 1000, feeRate: 0.0005, slippageRate: 0.0002 }, outputs: { estimate: 1.4 }, tolerance: 1e-9, assumptions: ['illustrative rates', 'exit notional assumed equal to entry'] },
        { label: 'Quiz T19-Q02 (2,000 USDT)', inputs: { notional: 2000, feeRate: 0.0005, slippageRate: 0.0002 }, outputs: { estimate: 2.8 }, tolerance: 1e-9, assumptions: ['illustrative rates', 'exit notional assumed equal to entry'] },
      ],
    },
    {
      id: 'T19-F02', name: 'Net result of one trade', expression: 'net = (exit − entry) × quantity − entry fee − exit fee − slippage',
      variables: [
        { symbol: 'entry, exit', meaning: 'fill prices', unit: 'USDT per DEMO' },
        { symbol: 'quantity', meaning: 'position size', unit: 'DEMO' },
        { symbol: 'entry fee, exit fee', meaning: 'fee rate × notional on each side', unit: 'USDT' },
      ],
      simulatorId: 'fees.net', approximate: false,
      workedExamples: [
        { label: 'Scalp exit 100.10 (scene T19-A04)', inputs: { entry: 100, exit: 100.1, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005, slippageCost: 0.4 }, outputs: { grossPnl: 1, entryFee: 0.5, exitFee: 0.5005, totalCosts: 1.4005, netPnl: -0.4005 }, tolerance: 1e-9, side: 'long', assumptions: ['fictional data', 'illustrative rates'] },
        { label: 'Longer-horizon exit 101.00 (notes example 3)', inputs: { entry: 100, exit: 101, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005, slippageCost: 0.4 }, outputs: { grossPnl: 10, exitFee: 0.505, totalCosts: 1.405, netPnl: 8.595 }, tolerance: 1e-9, side: 'long', assumptions: ['fictional data', 'illustrative rates'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T19-Q01', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T19',
      prompt: 'XORA suggests a 10–15 minute horizon for scalping analysis. What does that mean?',
      choices: [
        { id: 'a', text: 'It is how far ahead to think when analysing. You may exit earlier, and you may not trade at all.' },
        { id: 'b', text: 'You must hold every trade for at least 10 minutes.' },
        { id: 'c', text: 'Price is predicted to reach the target within 15 minutes.' },
        { id: 'd', text: 'You must open a trade every 10–15 minutes.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The 10–15 minutes is an analysis horizon proposal. It is not a mandatory holding time and not a fixed prediction window.',
      misconceptionFeedback: {
        b: 'There is no minimum holding time. If your stop is hit after 2 minutes, the trade ends after 2 minutes.',
        c: 'Nothing predicts that price will move within any fixed window. It may not move at all.',
        d: 'There is no trading quota. WAIT and NO_TRADE are always allowed.',
      },
      learningOutcome: 'Explain that the 10–15 minute horizon is for analysis, not a holding rule or prediction window.',
      remediationRef: { lessonId: 'T19', anchorId: 'T19-N01' },
      shuffleChoices: true,
    },
    {
      id: 'T19-Q02', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T19',
      prompt: 'Estimate the round-trip cost of a fictional 2,000 USDT position with an illustrative 0.05% fee and 0.02% slippage per side: notional × 2 × (fee + slippage). Answer in USDT to 2 decimal places.',
      answer: { kind: 'numeric', value: 2.8, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: '2,000 × 2 × (0.0005 + 0.0002) = 2,000 × 2 × 0.0007 = 2.80 USDT.',
      learningOutcome: 'Estimate round-trip costs before a trade.',
      remediationRef: { lessonId: 'T19', anchorId: 'T19-N03' },
    },
    {
      id: 'T19-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T19', safetyCritical: true, safetyTopic: 'fees-costs',
      prompt: 'A learner plans 40 fictional scalps a day, each aiming for +1.00 USDT gross, with about 1.40 USDT of costs per trade. They say: “More trades means more profit.” What is the best response?',
      choices: [
        { id: 'a', text: 'Each trade loses about 0.40 after costs even when it wins gross, so 40 trades lose about 16.00 USDT before any losing trades.' },
        { id: 'b', text: 'Agree: 40 × 1.00 = 40.00 USDT profit a day.' },
        { id: 'c', text: 'Costs do not matter if most trades win.' },
        { id: 'd', text: 'Use higher leverage so the costs become smaller.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: '1.00 − 1.40 = −0.40 per trade; 40 × −0.40 = −16.00 USDT. Costs are certain and grow with every trade.',
      misconceptionFeedback: {
        b: 'That ignores costs. Gross is not what you keep.',
        c: 'If each winner is smaller than its costs, winning trades still lose money.',
        d: 'Leverage makes the position bigger, so fees in USDT grow too, and losses are magnified.',
      },
      learningOutcome: 'Recognise that frequent small trades accumulate costs and can turn gross wins into net losses.',
      remediationRef: { lessonId: 'T19', anchorId: 'T19-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T19-Q04', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T19', safetyCritical: true, safetyTopic: 'no-trade',
      prompt: 'Fictional DEMO/USDT: the spread is unusually wide, the room to the nearest high is 0.10% while costs are about 0.14%, and you have just had two losses in a row. What is the best DEMO decision?',
      choices: [
        { id: 'buy', text: 'Buy now to win the losses back.', decision: 'BUY' },
        { id: 'sell', text: 'Sell now; the high will probably hold.', decision: 'SELL' },
        { id: 'no-trade', text: 'No trade: costs exceed the room, conditions are poor, and emotion is involved.', decision: 'NO_TRADE' },
        { id: 'double', text: 'Buy with double size so one win covers both losses.', decision: 'BUY' },
      ],
      answer: { kind: 'choice', choiceId: 'no-trade' },
      rationale: 'Every check fails: room is smaller than costs, the spread is wide, and the urge to recover losses drives overtrading. Not trading is the disciplined choice.',
      misconceptionFeedback: {
        buy: 'Trading to win back losses is a warning sign, and the room is smaller than the costs.',
        sell: 'The same cost problem applies to a short, and a wide spread makes it worse.',
        double: 'Doubling size after losses doubles the risk and the costs. It is how small losses become large ones.',
      },
      learningOutcome: 'Choose NO_TRADE when costs, conditions and emotional state all argue against trading.',
      remediationRef: { lessonId: 'T19', anchorId: 'T19-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T19-Q05', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T19', safetyCritical: true, safetyTopic: 'execution',
      prompt: 'Why does execution quality (slippage and spread) matter more for scalping than for a longer-horizon trade?',
      choices: [
        { id: 'a', text: 'The same 0.02% of slippage is a big share of a 0.10% target but a small share of a 2% target.' },
        { id: 'b', text: 'Scalping orders never slip, so it does not matter.' },
        { id: 'c', text: 'Longer trades pay no fees.' },
        { id: 'd', text: 'Slippage only happens on limit orders.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Costs are roughly fixed per trade. The smaller the target, the larger the share they take.',
      misconceptionFeedback: {
        b: 'Market and stop orders can slip in any trade, and fast short-term moves make it more likely.',
        c: 'Every trade pays fees on entry and exit. Longer trades may also pay funding.',
        d: 'Slippage mostly affects market and stop-market orders. A limit order may not fill at all instead.',
      },
      learningOutcome: 'Explain why costs and execution quality weigh more heavily on small scalping targets.',
      remediationRef: { lessonId: 'T19', anchorId: 'T19-N02' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Planning a scalp target without estimating costs.', correction: 'Estimate round-trip costs first. If the realistic room is not clearly bigger, WAIT or NO_TRADE.' },
    { mistake: 'Treating 10–15 minutes as a holding rule or a prediction window.', correction: 'It is only XORA’s analysis horizon. Exit when your plan says, and skip when nothing is clear.' },
    { mistake: 'Believing more trades means more profit.', correction: 'More trades means more certain costs and more chances to lose. A skipped trade costs nothing.' },
  ],
  takeaways: [
    'Scalping aims at small moves over minutes; costs and execution quality take a large share of each result.',
    'Many trades add up costs and chances of loss; a gross winner can be a net loser.',
    '10–15 minutes is an analysis horizon, not a holding rule; WAIT and NO_TRADE are always valid.',
  ],
  reviewCard: {
    keyTermIds: ['scalping', 'time-horizon', 'overtrading'],
    safetyNote: 'Scalping is not easy money. Costs are certain, profits are not, and WAIT or NO_TRADE is always allowed.',
    reviewMinutes: 4,
    retrievalQuestion: 'A fictional scalp on 1,000 USDT has about 1.40 USDT of round-trip costs and a target 0.10% away. Should you take it, and why?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T19-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
