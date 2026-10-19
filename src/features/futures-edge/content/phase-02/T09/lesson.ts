import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices in this lesson are fictional DEMO/USDT examples, and all fee, slippage and funding rates are illustrative course numbers. They are not real market data or any exchange’s real fee schedule.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can calculate entry fee, exit fee and net result for a simple trade from its notional value and fee rates.',
    'Learner can explain how the spread and slippage add cost on top of fees, and why funding is a separate futures cost.',
    'Learner can find the break-even price and recognise when a small gross winner becomes a net loser.',
  ],
  glossaryEntries,
  notesComplexity: 'complex-risk',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T09-S01', kind: 'cover-problem', title: 'A winning trade that loses money',
      narrationText: 'Imagine a quick trade where the price moves your way. The chart says you won 0.80 USDT. Your account says you lost 0.60 USDT. Where did the money go? This lesson follows every cent.',
      blocks: [
        { kind: 'paragraph', text: 'The chart says your quick trade won **+0.80 USDT**. Your account says **−0.60 USDT**.' },
        { kind: 'paragraph', text: 'The gap is costs: [[trading-fee|fees]], the [[spread]] and [[slippage]].' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T09-A03' },
      glossaryRefs: ['trading-fee', 'spread', 'slippage'],
      speakerNotes: 'Open with the surprise. Beginners judge trades by the chart move; this lesson moves their attention to the net result.',
    },
    {
      id: 'T09-S02', kind: 'key-definition', title: 'Three costs on every round trip',
      narrationText: 'A round trip means opening and then closing a trade. Each fill pays a fee, which is the fill value times the fee rate. Market orders also pay the spread and can slip. Futures add funding, a separate cost for holding over time.',
      blocks: [
        { kind: 'list', ordered: true, items: [
          '**Fee** = fill value × [[fee-rate]], on entry and on exit.',
          '**Spread**: buying at the ask, selling at the bid.',
          '**Slippage**: a fill worse than the price you saw.',
        ] },
        { kind: 'callout', callout: 'tip', text: 'Futures also have **funding**, a separate cost while a position stays open.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T09-A02' },
      glossaryRefs: ['round-trip', 'fee-rate', 'mid-price'],
    },
    {
      id: 'T09-S03', kind: 'visual-breakdown', title: 'Maker or taker?',
      narrationText: 'An order that waits in the book is a maker. An order that fills immediately against the book is a taker. With illustrative rates, a maker pays 0.02% and a taker pays 0.05% of the fill value.',
      blocks: [
        { kind: 'comparison',
          left: { title: '[[maker|Maker]] (waits in the book)', points: ['Illustrative rate 0.02%', '1,000 USDT fill → 0.20 USDT'] },
          right: { title: '[[taker|Taker]] (fills at once)', points: ['Illustrative rate 0.05%', '1,000 USDT fill → 0.50 USDT'] },
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T09-A01' },
      glossaryRefs: ['maker', 'taker'],
    },
    {
      id: 'T09-S04', kind: 'worked-example', title: 'Gross winner, net loser',
      narrationText: 'Long 10 DEMO. The mid-price moves from 100.00 to 100.08, a gross gain of 0.80. Taker fees cost 0.50 plus 0.5004. Spread costs 0.20 and slippage 0.20. Net result: minus 0.6004 USDT.',
      blocks: [
        {
          kind: 'worked-example', title: 'LONG 10 DEMO, mid 100.00 → 100.08 (fictional)', fictional: true,
          steps: [
            { text: 'Gross = (100.08 − 100.00) × 10', result: '+0.80 USDT' },
            { text: 'Fees 0.50 + 0.5004', result: '−1.0004 USDT' },
            { text: 'Spread 0.20 + slippage 0.20', result: '−0.40 USDT' },
          ],
          conclusion: 'Net = 0.80 − 1.4004 = −0.6004 USDT.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T09-A03' },
      glossaryRefs: ['gross-pnl', 'net-pnl'],
    },
    {
      id: 'T09-S05', kind: 'risks-misunderstanding', title: 'Costs are certain, profits are not',
      narrationText: 'With taker fees on both sides, price must move about 0.10% just to break even. Spread and slippage push that further. Many tiny trades multiply the costs. And these are illustrative rates: always check your own exchange and account tier.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Ignoring the break-even move', text: 'At 0.05% per side, a long from 100.00 needs about 100.10 before it earns anything.' },
        { kind: 'callout', callout: 'safety', text: 'Rates here are a model. **Check your real exchange rates and account tier** before acting.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T09-A04' },
      glossaryRefs: ['break-even-price'],
    },
    {
      id: 'T09-S06', kind: 'guided-practice', title: 'Move the cost sliders',
      narrationText: 'Now you try. Change the fee rates, the spread cost and the slippage cost, and watch the net result. Find the settings that turn the same gross 0.80 into a net loser, and the settings that keep it positive.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Start with taker fees, spread 0.20 and slippage 0.20.', 'Lower both fee rates to the maker rate.', 'Set spread and slippage to 0 and compare net results.'] },
        { kind: 'callout', callout: 'tip', text: 'Gross never changes. Only the costs move.' },
      ],
      glossaryRefs: ['fee-rate', 'net-pnl'],
    },
    {
      id: 'T09-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Fees are charged on both fills. The spread and slippage are hidden in your fill prices. Funding is a separate futures cost. Find the break-even price before you judge a trade, and check your real rates.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          'Fee = fill value × fee rate, charged twice per round trip.',
          'Spread and slippage hide in fill prices.',
          'Funding is a separate futures cost over time.',
          'Know the break-even move; verify real rates.',
        ] },
      ],
      glossaryRefs: ['round-trip', 'break-even-price'],
    },
  ],

  notesSections: [
    {
      id: 'T09-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'Every trade has costs. A [[trading-fee]] is charged each time one of your orders is filled: fee = fill value × [[fee-rate]]. A [[round-trip]] (open, then close) is charged twice. If your order waited in the book you are the [[maker]]; if it filled at once against the book you are the [[taker]]. This course uses illustrative rates of **0.02% (0.0002) maker** and **0.05% (0.0005) taker** per side.' },
        { kind: 'paragraph', text: 'Two more costs hide inside your fill prices. The [[spread]] is the gap between the best bid and the best ask; the [[mid-price]] sits halfway. A market buy pays the ask, above the mid, and a market sell receives the bid, below it. [[slippage|Slippage]] is any extra distance when the book is thin or price jumps (illustration: 0.02% per side). Futures add a fourth, separate cost: **funding**, a payment between longs and shorts while a position stays open (illustration: +0.01% per 8 hours, longs pay shorts). Lesson T11 explains funding in detail.' },
        { kind: 'analogy', text: 'Think of changing money at an airport counter. The counter buys at one price and sells at another (spread), and also charges a service fee each time (trading fee). Changing back and forth quickly can lose money even if the exchange rate barely moved.' },
      ],
    },
    {
      id: 'T09-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Costs are certain; profits are not. On a small, quick trade the price move is often tiny, so costs can be larger than the whole [[gross-pnl|gross result]]. Your [[net-pnl|net result]] is what reaches your account. Many small trades multiply the costs, and the [[break-even-price]] tells you how far price must move before a trade earns anything at all.' },
      ],
    },
    {
      id: 'T09-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: a gross winner that is a net loser (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'LONG 10 DEMO. Mid-price at entry 100.00, at exit 100.08.' },
            { text: 'Gross = (100.08 − 100.00) × 10', result: '+0.80 USDT' },
            { text: 'Entry fee (taker) = 1,000.00 × 0.05%', result: '0.50 USDT' },
            { text: 'Exit fee (taker) = 1,000.80 × 0.05%', result: '0.5004 USDT' },
            { text: 'Spread: half-spread 0.01 × 10 DEMO × 2 fills', result: '0.20 USDT' },
            { text: 'Slippage on the two market fills', result: '0.20 USDT' },
            { text: 'Total costs = 0.50 + 0.5004 + 0.20 + 0.20', result: '1.4004 USDT' },
          ],
          conclusion: 'Net = 0.80 − 1.4004 = −0.6004 USDT. Fees alone (1.0004) already make the trade a net loser: 0.80 − 1.0004 = −0.2004 USDT.',
        },
        {
          kind: 'worked-example', title: 'Example 2: same move, maker fills and no spread or slippage (fictional)', fictional: true,
          steps: [
            { text: 'Entry fee (maker) = 1,000.00 × 0.02%', result: '0.20 USDT' },
            { text: 'Exit fee (maker) = 1,000.80 × 0.02%', result: '0.20016 USDT' },
          ],
          conclusion: 'Net = 0.80 − 0.40016 = +0.39984 USDT (about +0.40). Maker fills are not guaranteed: a resting order may never fill.',
        },
        {
          kind: 'formula', expression: 'break-even (long) = entry × (1 + entry fee rate) ÷ (1 − exit fee rate)', formulaId: 'T09-F02',
          variables: [
            { symbol: 'entry', meaning: 'entry price', unit: 'USDT per DEMO' },
            { symbol: 'fee rates', meaning: 'fee rate per side as a decimal (0.05% = 0.0005)', unit: 'decimal' },
          ],
          note: 'Taker both sides: 100.00 → break-even ≈ 100.10 (a 0.10% move). Maker both sides: ≈ 100.04 (0.04%). A short from 100.00 with taker fees breaks even near 99.90. Spread and slippage of 0.40 USDT on 10 DEMO add 0.04 more, so ≈ 100.14.',
        },
      ],
    },
    {
      id: 'T09-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Look at the order type: a market order is almost always a taker fill; a limit order that rests in the book is usually a maker fill.',
          'Compare the best bid and best ask: the wider the spread, the more you give up on each market fill.',
          'Compare your fill price with the price you saw when you clicked: the difference is slippage.',
          'Before trading, estimate the round trip: notional × 2 × (fee rate + slippage rate). For 1,000 USDT at 0.05% + 0.02% that is about 1.40 USDT.',
          'For futures, also note the funding schedule: on 1,000 USDT notional, +0.01% per 8 hours is 0.10 USDT each interval, separate from trading fees.',
        ] },
      ],
    },
    {
      id: 'T09-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Judging a trade by the chart move only', text: 'The chart shows the gross move. Subtract both fees, the spread and slippage to get the net result.' },
        { kind: 'callout', callout: 'mistake', title: 'Counting the fee once', text: 'A round trip pays a fee on entry and again on exit.' },
        { kind: 'callout', callout: 'mistake', title: 'Treating course rates as real rates', text: 'Rates differ by exchange, product, account tier and promotions. Check your own before acting.' },
        { kind: 'callout', callout: 'mistake', title: 'Forgetting funding', text: 'Funding is not a trading fee. It is paid or received while a futures position stays open.' },
      ],
    },
    {
      id: 'T09-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'This lesson is a model with illustrative rates. Before acting, verify the actual fee rates, account tier and funding schedule on your own exchange. Many small trades can lose money through costs alone, so not trading is always a valid choice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T09-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Trading costs at a glance (illustrative rates)', headers: ['Cost', 'When it is paid', 'Example on 1,000 USDT'], rows: [
          ['Taker fee 0.05%', 'each fill that takes from the book', '0.50 USDT per side'],
          ['Maker fee 0.02%', 'each fill that rested in the book', '0.20 USDT per side'],
          ['Spread', 'market fills, vs the mid-price', 'half-spread × quantity'],
          ['Slippage 0.02%', 'fast or thin markets', 'about 0.20 USDT per side'],
          ['Funding +0.01% / 8 h', 'futures, while holding', '0.10 USDT per interval'],
        ] },
      ],
    },
    {
      id: 'T09-N08', heading: 'learn-more', title: 'Learn more: why break-even is not exactly entry + 2 × fee', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'The exit fee is charged on the exit value, which is a little higher than the entry value for a winning long. That is why the formula divides by (1 − exit fee rate) instead of simply adding 0.10%. For small rates the difference is tiny, so “about two fees” is a good mental shortcut, but the simulator uses the exact form.' },
        { kind: 'paragraph', text: 'Some exchanges lower fees for high-volume accounts or for paying fees in a particular token. These are business terms that change over time; this course does not recommend any of them.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T09-A01', type: 'fee-buildup', durationMs: 25_000,
      parameters: { variant: 'compare-roles', entry: 100, notional: 1000, makerRate: 0.0002, takerRate: 0.0005 },
      caption: 'Two bars grow on the same 1,000 USDT fill: the **maker** fee reaches 0.20 USDT, the **taker** fee reaches 0.50 USDT.',
      narration: 'The same fill value can cost different fees depending on whether your order waited in the book or took from it.',
      reducedMotionDescription: 'Fee on a 1,000 USDT fill with illustrative rates: maker 0.02% = 0.20 USDT, taker 0.05% = 0.50 USDT. Rates differ by exchange and account.',
      glossaryRefs: ['maker', 'taker', 'fee-rate'],
    },
    {
      id: 'T09-A02', type: 'order-book-matching', durationMs: 25_000,
      parameters: {
        variant: 'bid-ask-spread',
        bids: [{ price: 99.99, quantity: 12 }, { price: 99.98, quantity: 20 }, { price: 99.97, quantity: 35 }],
        asks: [{ price: 100.01, quantity: 10 }, { price: 100.02, quantity: 18 }, { price: 100.03, quantity: 30 }],
        incoming: { side: 'buy', quantity: 10 },
      },
      caption: 'The spread of 0.02 appears between bid 99.99 and ask 100.01. A market buy of 10 DEMO fills at 100.01, 0.01 above the 100.00 mid-price.',
      narration: 'The mid-price is halfway between the best bid and best ask. A market buy pays the ask, so it gives up half the spread straight away.',
      reducedMotionDescription: 'Fictional book: best bid 99.99, best ask 100.01, spread 0.02, mid-price 100.00. A market buy of 10 DEMO fills at 100.01, paying 0.01 per DEMO (0.10 USDT) above the mid.',
      glossaryRefs: ['spread', 'mid-price', 'taker'],
    },
    {
      id: 'T09-A03', type: 'fee-buildup', durationMs: 30_000,
      parameters: { variant: 'waterfall', side: 'long', entry: 100, exit: 100.08, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005, spreadCost: 0.2, slippageCost: 0.2 },
      caption: 'Costs drop in one by one: gross +0.80 shrinks by the entry fee 0.50, exit fee 0.5004, spread 0.20 and slippage 0.20 until net is −0.6004 USDT.',
      narration: 'Watch each cost bar subtract from the gross result. The trade was right about direction and still lost money.',
      reducedMotionDescription: 'Long 10 DEMO, mid 100.00 to 100.08. Gross +0.80 USDT. Entry fee −0.50, exit fee −0.5004, spread −0.20, slippage −0.20. Net −0.6004 USDT: a gross winner became a net loser.',
      glossaryRefs: ['gross-pnl', 'net-pnl', 'trading-fee'],
    },
    {
      id: 'T09-A04', type: 'fee-buildup', durationMs: 25_000,
      parameters: { variant: 'break-even', side: 'long', entry: 100, exit: 100.08, entryFeeRate: 0.0005, exitFeeRate: 0.0005 },
      caption: 'A break-even line appears at 100.10, above the entry at 100.00. Price rises to 100.08 and stops short of it.',
      narration: 'With taker fees on both sides, a long must move about 0.10% before it earns anything. Our exit at 100.08 is still below that line.',
      reducedMotionDescription: 'Entry 100.00, fees-only break-even ≈ 100.10 (a 0.10% move). The fictional price reaches 100.08, which is below break-even, so the trade loses after fees.',
      glossaryRefs: ['break-even-price'],
    },
    {
      id: 'T09-A05', type: 'funding-clock', durationMs: 25_000,
      parameters: { notional: 1000, side: 'long', rates: [0.0001, 0.0001, 0.0001], intervalHours: 8 },
      caption: 'The clock ticks through three 8-hour intervals; the long pays 0.10 USDT each time, 0.30 USDT in total, on top of trading fees.',
      narration: 'Funding is separate from trading fees. It is charged or received only while a futures position stays open across a funding time.',
      reducedMotionDescription: 'Long futures position, 1,000 USDT notional, illustrative funding +0.01% every 8 hours. Interval 1: pays 0.10. Interval 2: pays 0.10. Interval 3: pays 0.10. Total 0.30 USDT, separate from fees.',
    },
    {
      id: 'T09-A06', type: 'fee-buildup', durationMs: 30_000,
      parameters: { variant: 'accumulate', side: 'long', entry: 100, exit: 100.2, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005, spreadCost: 0.2, slippageCost: 0.2, trades: 10 },
      caption: 'Ten identical trades stack up: gross grows to +20.00 USDT while costs grow to 14.01 USDT, leaving net +5.99 USDT.',
      narration: 'Each trade here wins 2.00 gross but pays 1.401 in costs. Over ten trades, costs take about 70% of the gross result.',
      reducedMotionDescription: 'Ten fictional trades, each long 10 DEMO from 100.00 to 100.20: gross 2.00, costs 1.401 (fees 0.50 + 0.501, spread 0.20, slippage 0.20). After 10 trades: gross +20.00, costs 14.01, net +5.99 USDT.',
      glossaryRefs: ['round-trip'],
    },
    {
      id: 'T09-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Before any trade, estimate costs', items: ['Will I be maker or taker on entry and exit?', 'How wide is the spread right now?', 'Estimate: notional × 2 × (fee + slippage).', 'Is my expected move bigger than break-even?'] },
      caption: 'Four cost questions appear one by one, ending with the break-even check.',
      reducedMotionDescription: 'Checklist: maker or taker on each side; current spread; round-trip estimate notional × 2 × (fee + slippage), e.g. 1,000 × 2 × 0.07% = 1.40 USDT; is the expected move larger than break-even?',
    },
    {
      id: 'T09-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'This is a model', items: ['Rates here are illustrative.', 'Verify your real exchange rates and account tier.', 'Costs are certain; profits are not.', 'Not trading is always allowed.'] },
      caption: 'Safety: the warning card fills in, reminding you to verify real rates before acting.',
      reducedMotionDescription: 'Warning card: rates in this lesson are illustrative; verify your real exchange fee rates and account tier; costs are certain while profits are not; not trading is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T09-X01', type: 'slider-explore', title: 'Gross vs net: move the costs',
      fixtureId: 'FX-T09-SCALP-01', simulatorId: 'fees.net',
      instructions: 'A fictional long of 10 DEMO moves from 100.00 to 100.08 (gross +0.80 USDT). Move the fee-rate sliders and the spread and slippage inputs, and watch the net result change. Rates are decimals: 0.0005 = 0.05%.',
      steps: [
        { id: 'T09-X01-01', prompt: 'Look at the starting values: taker 0.0005 both sides, spread 0.20, slippage 0.20. Is the net result positive or negative?', hint: 'Total costs are about 1.40 USDT, larger than the 0.80 gross.' },
        { id: 'T09-X01-02', prompt: 'Lower both fee rates to the maker rate 0.0002, and set spread and slippage to 0.', hint: 'Fees become 0.20 + 0.20016. Net is about +0.40.' },
        { id: 'T09-X01-03', prompt: 'Answer the question below about what you saw.', hint: 'Gross stays +0.80 the whole time; only costs change.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'choice', 'reset', 'hint'],
      parameters: {
        fixed: { entry: 100, exit: 100.08, quantity: 10 },
        sliders: [
          { key: 'entryFeeRate', label: 'Entry fee rate (0.0005 = 0.05%)', min: 0, max: 0.001, step: 0.0001, value: 0.0005, unit: '' },
          { key: 'exitFeeRate', label: 'Exit fee rate (0.0005 = 0.05%)', min: 0, max: 0.001, step: 0.0001, value: 0.0005, unit: '' },
          { key: 'spreadCost', label: 'Spread cost', min: 0, max: 1, step: 0.05, value: 0.2, unit: 'USDT' },
          { key: 'slippageCost', label: 'Slippage cost', min: 0, max: 1, step: 0.05, value: 0.2, unit: 'USDT' },
        ],
        outputs: [
          { key: 'grossPnl', label: 'Gross result', unit: 'USDT', decimals: 4 },
          { key: 'entryFee', label: 'Entry fee', unit: 'USDT', decimals: 4 },
          { key: 'exitFee', label: 'Exit fee', unit: 'USDT', decimals: 4 },
          { key: 'otherCosts', label: 'Spread + slippage', unit: 'USDT', decimals: 4 },
          { key: 'totalCosts', label: 'Total costs', unit: 'USDT', decimals: 4 },
          { key: 'netPnl', label: 'Net result', unit: 'USDT', decimals: 4 },
        ],
        side: 'long',
        note: 'Illustrative model: each fee is charged on its own fill value; funding is excluded. Verify real rates and your account tier before acting.',
        question: 'Which statement matches what you saw?',
        feedback: {
          'gross-winner-net-loser': 'Right. With taker fees, spread and slippage the +0.80 gross became −0.6004 net. Lower costs kept the same move positive.',
          'always-profit': 'Not quite. The gross stayed +0.80, but with the starting costs (1.4004 USDT) the net was negative.',
          'fees-tiny': 'Look again: the two taker fees alone were 1.0004 USDT, more than the whole 0.80 gross result.',
        },
      },
      choices: [
        { id: 'gross-winner-net-loser', text: 'The same +0.80 gross was a net loser with taker fees, spread and slippage, and stayed positive with maker fees and no spread or slippage.' },
        { id: 'always-profit', text: 'If the price moves in my direction, the net result is always positive.' },
        { id: 'fees-tiny', text: 'Fees are so small that they never change whether a trade wins or loses.' },
      ],
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'gross-winner-net-loser' },
      explanation: 'Gross depends only on the price move. Costs decide whether that move is enough. With 1.4004 USDT of costs, a 0.80 gross gain is a −0.6004 net loss; with 0.40016 of maker fees only, the net is +0.39984.',
      fictionalDataLabel: 'Fictional DEMO/USDT trade with illustrative rates for practice only.',
    },
    {
      id: 'T09-X02', type: 'numeric-calculator', title: 'Work out the net result',
      fixtureId: 'FX-T09-FEES-01', simulatorId: 'fees.net',
      instructions: 'A fictional long of 5 DEMO: mid-price 200.00 at entry and 200.30 at exit. Taker fees 0.05% on both fills, spread cost 0.10 USDT and slippage cost 0.10 USDT. Answer in USDT to 2 decimal places.',
      steps: [
        { id: 'T09-X02-01', prompt: 'Gross result = (exit − entry) × quantity.', hint: '(200.30 − 200.00) × 5' },
        { id: 'T09-X02-02', prompt: 'Total costs = entry fee + exit fee + spread + slippage.', hint: 'Entry fee 1,000.00 × 0.0005 = 0.50; exit fee 1,001.50 × 0.0005 = 0.50075; plus 0.10 + 0.10.' },
        { id: 'T09-X02-03', prompt: 'Net result = gross − total costs.', hint: '1.50 − 1.20075, rounded to 2 decimals.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: { given: [
        { label: 'Entry (mid)', value: 200, unit: 'USDT', decimals: 2 },
        { label: 'Exit (mid)', value: 200.3, unit: 'USDT', decimals: 2 },
        { label: 'Quantity', value: 5, unit: 'DEMO' },
        { label: 'Taker fee rate per side', value: 0.05, unit: '%', decimals: 2 },
        { label: 'Spread cost', value: 0.1, unit: 'USDT', decimals: 2 },
        { label: 'Slippage cost', value: 0.1, unit: 'USDT', decimals: 2 },
      ] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'grossPnl', label: 'Gross result', value: 1.5, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'totalCosts', label: 'Total costs', value: 1.2, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'netPnl', label: 'Net result', value: 0.3, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      ] },
      explanation: 'Gross 1.50 − costs 1.20075 (0.50 + 0.50075 + 0.10 + 0.10) = net 0.29925 ≈ 0.30 USDT. Costs took about 80% of the gross result.',
      fictionalDataLabel: 'Fictional DEMO/USDT numbers and illustrative rates for practice only.',
    },
    {
      id: 'T09-X03', type: 'classify', title: 'Which kind of cost is it?',
      fixtureId: 'FX-T09-FEES-01',
      instructions: 'Sort each fictional situation into the kind of cost it describes.',
      steps: [
        { id: 'T09-X03-01', prompt: 'Read each situation and ask: is it charged per fill, hidden in the fill price, or paid over time while holding futures?', hint: 'Funding only happens while a futures position stays open across a funding time.' },
        { id: 'T09-X03-02', prompt: 'Place all six, then press Check.', hint: 'Buying at the ask instead of the mid is a spread cost, not a fee.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'market-entry-fee', text: 'A market buy fills at once and is charged 0.05% of its value.' },
          { id: 'resting-limit-fee', text: 'A limit sell waits in the book, later fills, and is charged 0.02%.' },
          { id: 'pay-the-ask', text: 'A market buy pays the ask 100.01 while the mid-price is 100.00.' },
          { id: 'fast-move-fill', text: 'In a fast move, a market sell fills 0.05 lower than the price on screen.' },
          { id: 'eight-hour-payment', text: 'A long futures position pays 0.10 USDT when an 8-hour interval passes.' },
          { id: 'hold-three-intervals', text: 'Holding a futures short across three intervals receives small payments each time.' },
        ],
        buckets: [
          { id: 'fee', label: 'Trading fee (per fill)' },
          { id: 'price-cost', label: 'Spread or slippage (in the fill price)' },
          { id: 'funding', label: 'Funding (futures, over time)' },
        ],
        itemFeedback: {
          'market-entry-fee': 'A percentage of the fill value charged by the exchange: a taker fee.',
          'resting-limit-fee': 'The order rested in the book, so this is a maker fee.',
          'pay-the-ask': 'Paying above the mid is the half-spread, hidden in the fill price.',
          'fast-move-fill': 'A worse fill than the screen price is slippage.',
          'eight-hour-payment': 'Payments at fixed intervals while holding futures are funding, separate from fees.',
          'hold-three-intervals': 'Funding can be paid or received depending on the rate sign and your side.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: {
        fee: ['market-entry-fee', 'resting-limit-fee'],
        'price-cost': ['pay-the-ask', 'fast-move-fill'],
        funding: ['eight-hour-payment', 'hold-three-intervals'],
      } },
      explanation: 'Fees are charged on each fill. Spread and slippage are hidden in the price you get. Funding is a separate futures cost (or payment) while a position stays open.',
      fictionalDataLabel: 'Fictional situations with illustrative rates for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T09-F01', name: 'Net result after fees, spread and slippage',
      expression: 'net = (exit − entry) × quantity − entry × quantity × entry fee rate − exit × quantity × exit fee rate − spread cost − slippage cost (long)',
      variables: [
        { symbol: 'entry, exit', meaning: 'entry and exit prices (mid-prices in this lesson)', unit: 'USDT per DEMO' },
        { symbol: 'quantity', meaning: 'position size', unit: 'DEMO' },
        { symbol: 'fee rates', meaning: 'fee rate per side as a decimal', unit: 'decimal' },
        { symbol: 'spread cost, slippage cost', meaning: 'extra cost paid versus the mid-price', unit: 'USDT' },
      ],
      simulatorId: 'fees.net', approximate: false,
      workedExamples: [
        { label: 'Gross winner, net loser (notes example 1)', inputs: { entry: 100, exit: 100.08, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005, spreadCost: 0.2, slippageCost: 0.2 }, outputs: { grossPnl: 0.8, entryFee: 0.5, exitFee: 0.5004, otherCosts: 0.4, totalCosts: 1.4004, netPnl: -0.6004 }, tolerance: 1e-9, assumptions: ['fictional data', 'illustrative taker rate 0.05% per side', 'funding excluded'] },
        { label: 'Fees only (notes example 1)', inputs: { entry: 100, exit: 100.08, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }, outputs: { totalCosts: 1.0004, netPnl: -0.2004 }, tolerance: 1e-9, assumptions: ['fictional data', 'spread and slippage excluded'] },
        { label: 'Maker fills (notes example 2)', inputs: { entry: 100, exit: 100.08, quantity: 10, entryFeeRate: 0.0002, exitFeeRate: 0.0002 }, outputs: { entryFee: 0.2, exitFee: 0.20016, netPnl: 0.39984 }, tolerance: 1e-9, assumptions: ['fictional data', 'illustrative maker rate 0.02% per side'] },
        { label: 'Exercise T09-X02', inputs: { entry: 200, exit: 200.3, quantity: 5, entryFeeRate: 0.0005, exitFeeRate: 0.0005, spreadCost: 0.1, slippageCost: 0.1 }, outputs: { grossPnl: 1.5, exitFee: 0.50075, totalCosts: 1.20075, netPnl: 0.29925 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'One accumulate trade (scene T09-A06)', inputs: { entry: 100, exit: 100.2, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005, spreadCost: 0.2, slippageCost: 0.2 }, outputs: { grossPnl: 2, totalCosts: 1.401 }, tolerance: 1e-9, assumptions: ['fictional data'] },
      ],
    },
    {
      id: 'T09-F02', name: 'Break-even price after fees',
      expression: 'long: break-even = entry × (1 + entry fee rate) ÷ (1 − exit fee rate); short: entry × (1 − entry fee rate) ÷ (1 + exit fee rate)',
      variables: [
        { symbol: 'entry', meaning: 'entry price', unit: 'USDT per DEMO' },
        { symbol: 'fee rates', meaning: 'fee rate per side as a decimal', unit: 'decimal' },
      ],
      simulatorId: 'fees.net', approximate: false,
      workedExamples: [
        { label: 'Taker both sides, long from 100.00', inputs: { entry: 100, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }, outputs: { breakEven: 100.1, movePercent: 0.1 }, tolerance: 0.005, assumptions: ['fees only; spread, slippage and funding excluded'] },
        { label: 'Maker both sides, long from 100.00', inputs: { entry: 100, entryFeeRate: 0.0002, exitFeeRate: 0.0002 }, outputs: { breakEven: 100.04, movePercent: 0.04 }, tolerance: 0.005, assumptions: ['fees only'] },
        { label: 'Taker both sides, short from 100.00', side: 'short', inputs: { entry: 100, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }, outputs: { breakEven: 99.9 }, tolerance: 0.005, assumptions: ['fees only'] },
        { label: 'Quiz T09-Q01', inputs: { entry: 250, entryFeeRate: 0.0002, exitFeeRate: 0.0002 }, outputs: { breakEven: 250.1 }, tolerance: 0.005, assumptions: ['fees only'] },
      ],
    },
    {
      id: 'T09-F03', name: 'Round-trip cost estimate',
      expression: 'estimate ≈ notional × 2 × (fee rate + slippage rate)',
      variables: [
        { symbol: 'notional', meaning: 'entry value of the position (price × quantity)', unit: 'USDT' },
        { symbol: 'fee rate, slippage rate', meaning: 'per-side rates as decimals', unit: 'decimal' },
      ],
      simulatorId: 'fees.estimate-round-trip', approximate: true,
      workedExamples: [
        { label: 'Estimate on 1,000 USDT (taker 0.05% + slippage 0.02%)', inputs: { notional: 1000, feeRate: 0.0005, slippageRate: 0.0002 }, outputs: { estimate: 1.4 }, tolerance: 1e-9, assumptions: ['pre-trade estimate', 'exit value assumed equal to entry value', 'illustrative rates'] },
        { label: 'Estimate on 1,000 USDT with maker fills (0.02% + 0.02%)', inputs: { notional: 1000, feeRate: 0.0002, slippageRate: 0.0002 }, outputs: { estimate: 0.8 }, tolerance: 1e-9, assumptions: ['pre-trade estimate', 'illustrative rates'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T09-Q01', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T09',
      prompt: 'A fictional long enters at 250.00 USDT. Maker fees of 0.02% apply on both entry and exit (illustrative). Using break-even = entry × (1 + 0.0002) ÷ (1 − 0.0002), what is the break-even price, in USDT, to 2 decimals?',
      answer: { kind: 'numeric', value: 250.1, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: '250.00 × 1.0002 ÷ 0.9998 ≈ 250.10 USDT. Price must rise about 0.04% before the trade earns anything after fees.',
      learningOutcome: 'Compute a fees-only break-even price for a long.',
      remediationRef: { lessonId: 'T09', anchorId: 'T09-N03' },
    },
    {
      id: 'T09-Q02', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T09',
      prompt: 'A fictional trade shows a gross result of +0.80 USDT. Fees, spread and slippage together cost 1.40 USDT. How should you describe the trade?',
      choices: [
        { id: 'a', text: 'A net loss of about 0.60 USDT: the price moved the right way, but not far enough to cover costs.' },
        { id: 'b', text: 'A winning trade, because the price moved in my direction.' },
        { id: 'c', text: 'A break-even trade, because costs do not count until the end of the day.' },
        { id: 'd', text: 'A net profit of 2.20 USDT, because costs are added to the result.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Net = 0.80 − 1.40 = −0.60 USDT. Only the net result reaches your account.',
      misconceptionFeedback: {
        b: 'That describes the gross result only. After costs the account is lower than before.',
        c: 'Costs are charged on every fill, immediately. They are not postponed.',
        d: 'Costs are subtracted, never added: 0.80 − 1.40 = −0.60.',
      },
      learningOutcome: 'Interpret gross versus net results.',
      remediationRef: { lessonId: 'T09', anchorId: 'T09-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T09-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T09', safetyCritical: true, safetyTopic: 'fees-costs',
      prompt: 'A learner plans many tiny trades using the course’s 0.02% maker and 0.05% taker rates. What should they do before acting?',
      choices: [
        { id: 'a', text: 'Verify the actual fee rates, account tier and funding schedule on their own exchange, and check that the expected move beats break-even.' },
        { id: 'b', text: 'Nothing: the course rates are the same on every exchange.' },
        { id: 'c', text: 'Trade more often, because more trades always cover the fees.' },
        { id: 'd', text: 'Ignore fees, because they are too small to matter on any trade.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The course uses an illustrative model. Real rates differ by exchange, product and account tier, and many small trades multiply costs.',
      misconceptionFeedback: {
        b: 'Rates are illustrative. They vary between exchanges, products and account tiers, and can change over time.',
        c: 'Each trade adds its own costs. More trades mean more fees, not fewer.',
        d: 'On small moves, fees alone can be larger than the whole gross gain (1.0004 USDT of fees vs 0.80 gross in the lesson).',
      },
      learningOutcome: 'Know to verify real costs before relying on a model.',
      remediationRef: { lessonId: 'T09', anchorId: 'T09-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T09-Q04', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T09',
      prompt: 'Which fill is most likely charged the taker fee?',
      choices: [
        { id: 'a', text: 'A market buy that fills immediately against the asks.' },
        { id: 'b', text: 'A limit buy below the current price that waits in the book and fills later.' },
        { id: 'c', text: 'An order that was cancelled before it filled.' },
        { id: 'd', text: 'A funding payment while holding a position.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A market order takes liquidity from the book at once, so it is a taker fill.',
      misconceptionFeedback: {
        b: 'An order that rests in the book and is filled later is usually a maker fill.',
        c: 'No fill, no trading fee.',
        d: 'Funding is a separate futures cost, not a maker or taker fee.',
      },
      learningOutcome: 'Tell maker fills from taker fills.',
      remediationRef: { lessonId: 'T09', anchorId: 'T09-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T09-Q05', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T09', safetyCritical: true, safetyTopic: 'fees-costs',
      prompt: 'A fictional long futures position of 1,000 USDT notional stays open across three 8-hour funding times at an illustrative +0.01% (longs pay). The learner says: “I already counted my entry and exit fees, so my costs are complete.” What is missing?',
      choices: [
        { id: 'a', text: 'Funding: about 0.10 USDT per interval, 0.30 USDT in total, separate from trading fees.' },
        { id: 'b', text: 'Nothing: funding is already included in the trading fee.' },
        { id: 'c', text: 'Funding, but it is always paid to longs, so it adds profit.' },
        { id: 'd', text: 'A second exit fee for every 8 hours held.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: '1,000 × 0.01% = 0.10 USDT per interval; three intervals = 0.30 USDT. Funding is separate from fees, and its direction depends on the rate sign.',
      misconceptionFeedback: {
        b: 'Funding is a separate payment between longs and shorts. It is not part of the maker or taker fee.',
        c: 'With a positive rate, longs pay shorts. The direction can change when the rate changes sign.',
        d: 'Trading fees are charged per fill, not per hour. The time-based cost here is funding.',
      },
      learningOutcome: 'Recognise funding as a separate futures cost.',
      remediationRef: { lessonId: 'T09', anchorId: 'T09-N01' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Judging a trade only by the chart move (gross).', correction: 'Subtract both fees, the spread and slippage; only the net result reaches the account.' },
    { mistake: 'Counting the trading fee once per trade.', correction: 'A round trip pays a fee on entry and again on exit.' },
    { mistake: 'Assuming the course’s illustrative rates are your real rates, or forgetting funding.', correction: 'Verify actual fee rates, account tier and funding on your own exchange before acting.' },
  ],
  takeaways: [
    'Fee = fill value × fee rate, charged on entry and on exit; takers usually pay more than makers.',
    'Spread and slippage hide in fill prices, and funding is a separate futures cost over time.',
    'Know the break-even move: a small gross winner can be a net loser. Verify real rates before acting.',
  ],
  reviewCard: {
    keyTermIds: ['trading-fee', 'maker', 'break-even-price'],
    safetyNote: 'All rates here are illustrative. Verify actual fee rates, account tier and funding before acting; many tiny trades can lose through costs alone.',
    reviewMinutes: 4,
    retrievalQuestion: 'A long of 10 DEMO moves from 100.00 to 100.08 with 0.05% taker fees on both sides. What are the total fees, and is the trade a net winner?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T09-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
