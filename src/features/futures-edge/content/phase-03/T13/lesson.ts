import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices, rates and balances in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data, and every liquidation price shown is an approximate teaching model, not an exchange calculation.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can explain how an adverse price move shrinks the margin buffer and why liquidation (forced closure) happens before margin reaches zero.',
    'Learner can estimate an approximate liquidation price for a long and a short, and a funding payment for one or more intervals, with the units shown.',
    'Learner can judge from a scenario when to reduce exposure or not trade, and can explain why a stop-loss is not liquidation insurance.',
  ],
  glossaryEntries,
  notesComplexity: 'complex-risk',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T13-S01', kind: 'cover-problem', title: 'The exchange can close your trade for you',
      narrationText: 'In futures, your margin is a safety buffer. Every move against you eats into it. If the buffer gets too thin, the exchange closes the position itself. That forced closure is called liquidation.',
      blocks: [
        { kind: 'paragraph', text: 'Your [[margin]] is a buffer. Every move against your [[position]] eats into it.' },
        { kind: 'paragraph', text: 'When the buffer gets too thin, the exchange closes the trade for you: **[[liquidation]]**.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T13-A02' },
      glossaryRefs: ['liquidation', 'margin'],
      speakerNotes: 'Start from the feeling of losing control: the learner did not choose to close, the exchange did. Keep it conceptual; no exchange formula is exact here.',
    },
    {
      id: 'T13-S02', kind: 'key-definition', title: 'Maintenance margin: the floor',
      narrationText: 'You open with initial margin. The exchange also sets a much smaller floor, the maintenance margin. If your equity falls to that floor, liquidation starts. In our illustration the rate is 0.5 percent of notional.',
      blocks: [
        { kind: 'definition', termId: 'maintenance-margin' },
        { kind: 'paragraph', text: 'Example: 1,000 USDT notional × 0.5% [[maintenance-margin-rate|rate]] = **5 USDT** floor (illustrative rate).' },
      ],
      glossaryRefs: ['maintenance-margin', 'maintenance-margin-rate', 'initial-margin'],
    },
    {
      id: 'T13-S03', kind: 'visual-breakdown', title: 'Mark price and margin tiers',
      narrationText: 'Many exchanges check liquidation against the mark price, a smoothed fair price, not the last trade. And bigger positions sit in higher margin tiers with a higher maintenance rate, which moves liquidation closer.',
      blocks: [
        { kind: 'paragraph', text: 'Many exchanges check liquidation against the [[mark-price|mark price]], not only the [[last-price|last price]].' },
        { kind: 'paragraph', text: 'Higher [[margin-tier|tiers]] (0.5% → 1% → 2.5%) move the [[liquidation-price|liquidation price]] closer to entry.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T13-A03' },
      glossaryRefs: ['mark-price', 'margin-tier', 'liquidation-price'],
    },
    {
      id: 'T13-S04', kind: 'worked-example', title: 'Approximate liquidation and funding',
      narrationText: 'A fictional long at 100 with ten times leverage and a 0.5 percent maintenance rate has an approximate liquidation price of 90.50. Holding 1,000 USDT notional for one 8-hour funding interval at plus 0.01 percent costs the long 0.10 USDT.',
      blocks: [
        {
          kind: 'worked-example', title: 'DEMO/USDT long, 10×, approximate', fictional: true,
          steps: [
            { text: '100.00 × (1 − 1/10 + 0.005)', result: '≈ 90.50' },
            { text: 'Distance from entry', result: '≈ −9.50%' },
            { text: 'Funding: 1,000 × 0.01%', result: '0.10 USDT paid' },
          ],
          conclusion: 'Approximate only: fees, tiers and exchange rules change it.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T13-A05' },
      glossaryRefs: ['liquidation-price', 'funding-interval', 'funding-rate'],
    },
    {
      id: 'T13-S05', kind: 'risks-misunderstanding', title: 'A stop-loss is not liquidation insurance',
      narrationText: 'A stop-loss is your own exit plan, but it can slip or be skipped over in a gap. If your stop sits beyond the liquidation price, liquidation comes first. No strategy makes futures safe.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: '“I have a stop, so I can’t be liquidated”', text: 'Stops can slip, and [[gap-risk|gaps]] can jump past both the stop and the liquidation level.' },
        { kind: 'callout', callout: 'safety', text: 'There is **no guaranteed safe** leverage or strategy. Not trading is always allowed.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T13-A07' },
      glossaryRefs: ['stop-loss', 'gap-risk', 'liquidation'],
    },
    {
      id: 'T13-S06', kind: 'guided-practice', title: 'Run a DEMO risk check',
      narrationText: 'Now you act as the risk checker. Look at a fictional plan, compare the stop with the approximate liquidation price, and choose OK for simulation, warning, or no trade. Then explain why in your own words.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Find the approximate liquidation price.', 'Is the stop-loss before it or beyond it?', 'Choose: DEMO OK FOR SIM, WARNING or NO TRADE, and write why.'] },
        { kind: 'callout', callout: 'tip', text: 'If the stop is beyond liquidation, the plan is broken: reduce exposure or skip.' },
      ],
      glossaryRefs: ['liquidation-price', 'stop-loss'],
    },
    {
      id: 'T13-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Adverse moves shrink the buffer. Liquidation comes before margin reaches zero, usually with fees. Funding is a recurring cost or credit. Stops are not insurance, and abstaining is always allowed.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Adverse moves shrink the margin buffer.', 'Liquidation starts at the maintenance floor, before zero.', 'Positive funding: longs pay shorts each interval.', 'A stop-loss is not liquidation insurance; NO TRADE is always allowed.'] },
      ],
      glossaryRefs: ['liquidation', 'maintenance-margin', 'funding-interval'],
    },
  ],

  notesSections: [
    {
      id: 'T13-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'When you open a futures [[position]] with [[leverage]], you post [[initial-margin|initial margin]]. Gains and losses are added to or taken from that margin straight away. The exchange also sets a much smaller floor called [[maintenance-margin|maintenance margin]], worked out as [[notional-value|notional]] × [[maintenance-margin-rate|maintenance margin rate]]. If your [[account-equity|equity]] for the position falls to that floor, the exchange force-closes it. This forced closure is [[liquidation]]. The rough price where that happens is the [[liquidation-price|liquidation price]].' },
        { kind: 'paragraph', text: 'Perpetual contracts also have [[funding-rate|funding]]: at every [[funding-interval|funding interval]] (for example every 8 hours) one side pays the other. With a positive rate, longs pay shorts; with a negative rate, shorts pay longs.' },
        { kind: 'analogy', text: 'Think of a deposit on a rented car. Small scratches are taken from the deposit. If the deposit is nearly used up, the company takes the car back before you can do more damage, and charges a handling fee too.' },
      ],
    },
    {
      id: 'T13-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Liquidation usually happens at the worst moment, in a fast move, and it can cost more than the price move alone because of a [[liquidation-fee|liquidation fee]]. With high leverage, the liquidation price sits very close to entry, so ordinary noise can close you out. Funding looks tiny per interval, but it repeats several times a day for as long as you hold. Understanding these mechanics is the difference between choosing your exit and having it chosen for you.' },
      ],
    },
    {
      id: 'T13-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: the shrinking buffer (fictional DEMO/USDT, approximate)', fictional: true,
          steps: [
            { text: 'Long 10 DEMO at 100.00 USDT: notional = 1,000 USDT. At 10× leverage, margin = 100 USDT.' },
            { text: 'Maintenance margin = 1,000 × 0.5% (illustrative)', result: '5 USDT' },
            { text: 'Price falls to 95.00: loss = (95.00 − 100.00) × 10', result: '−50 USDT, buffer 50 USDT' },
            { text: 'Approximate liquidation price = 100.00 × (1 − 1/10 + 0.005)', result: '≈ 90.50 USDT' },
            { text: 'Check: at 90.50 the loss is 95 USDT, leaving 5 USDT = the maintenance floor.' },
          ],
          conclusion: 'The position is force-closed with about 5 USDT of margin left, not at zero, and a liquidation fee may take part of that. A short at 100.00 with 10× would be ≈ 109.50 instead.',
        },
        {
          kind: 'worked-example', title: 'Example 2: funding over a day (illustrative rate)', fictional: true,
          steps: [
            { text: 'Long, notional 1,000 USDT, funding rate +0.01% per 8-hour interval.' },
            { text: 'Per interval: 1,000 × 0.0001', result: '0.10 USDT paid' },
            { text: 'Three intervals in 24 hours: 0.10 × 3', result: '0.30 USDT paid' },
          ],
          conclusion: 'A short of the same size would receive 0.10 USDT per interval. Real rates change every interval and can turn negative.',
        },
        {
          kind: 'formula', expression: 'long liquidation ≈ entry × (1 − 1/leverage + mmr); short ≈ entry × (1 + 1/leverage − mmr)',
          variables: [
            { symbol: 'entry', meaning: 'entry price', unit: 'USDT per DEMO' },
            { symbol: 'mmr', meaning: 'maintenance margin rate (illustrative 0.5% = 0.005)', unit: 'fraction' },
          ],
        },
      ],
    },
    {
      id: 'T13-N04', heading: 'how-to-recognize', title: 'How to recognise the danger',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Compare the distance to the approximate liquidation price with normal candle size. At 20× the distance is only about 4.5%.',
          'Check where your stop-loss sits. If it is beyond the liquidation price, liquidation would happen first.',
          'Watch the buffer, not only the PnL number. A buffer below half of the starting margin is a warning sign to reduce exposure.',
          'Note the next funding time and the sign of the rate if you plan to hold through it.',
          'Fast, gappy candles or big news mean higher [[gap-risk|gap risk]]: a reason to cut size or not trade.',
        ] },
      ],
    },
    {
      id: 'T13-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Treating a stop-loss as insurance', text: 'A stop can slip or be jumped over in a gap. It does not promise an exit price, and it cannot help if it sits beyond liquidation.' },
        { kind: 'callout', callout: 'mistake', title: 'Believing the approximate price is exact', text: 'Fees, funding, margin tiers, mark price and other positions all move the real level. Treat any calculator figure as a rough guide.' },
        { kind: 'callout', callout: 'mistake', title: 'Ignoring funding', text: 'Small per interval, but it repeats every interval for as long as you hold.' },
      ],
    },
    {
      id: 'T13-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'No leverage level, stop-loss or strategy makes futures safe or guarantees you avoid liquidation. Real rules, rates and fees vary by exchange, account and country. Reducing size, lowering leverage, or choosing NO TRADE are always valid decisions. This course never places real orders.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T13-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Futures risk mechanics (illustrative numbers)', headers: ['Idea', 'Rule of thumb', 'Fictional example'], rows: [
          ['Maintenance margin', 'notional × maintenance rate', '1,000 × 0.5% = 5 USDT'],
          ['Approx. liquidation (long)', 'entry × (1 − 1/L + mmr)', '10× at 100 → ≈ 90.50'],
          ['Approx. liquidation (short)', 'entry × (1 + 1/L − mmr)', '10× at 100 → ≈ 109.50'],
          ['Funding per interval', 'notional × rate; positive = longs pay', '1,000 × 0.01% = 0.10 USDT'],
          ['Stop-loss', 'your exit plan, can slip', 'not liquidation insurance'],
        ] },
      ],
    },
    {
      id: 'T13-N08', heading: 'learn-more', title: 'Learn more: why exchanges use a mark price', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'The last traded price can spike for a moment when one large order sweeps a thin order book. To avoid liquidating many traders on such a spike, many exchanges value positions with a mark price built from several sources, such as an index of spot prices. This only changes which price is checked; it does not protect a position from a real, lasting move. Some exchanges also reduce positions step by step instead of closing everything, and the money left after a liquidation may go to an insurance fund. Rules differ by exchange and change over time, so always read the current documentation for any platform you study.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T13-A01', type: 'margin-buffer', durationMs: 30_000,
      parameters: { variant: 'maintenance-gauge', side: 'long', entry: 100, leverage: 10, mmr: 0.005, quantity: 10, path: [100, 99, 97.5, 96, 95] },
      caption: 'Price falls from 100.00 to 95.00. The margin buffer shrinks from 100 to 50 USDT while the 5 USDT maintenance floor stays fixed.',
      narration: 'Each step down takes 10 USDT per 1 USDT of price from the buffer, because the position holds 10 DEMO.',
      reducedMotionDescription: 'Fictional long of 10 DEMO at 100.00 with 10× leverage: margin 100 USDT, maintenance requirement 5 USDT (0.5%). As price falls to 99.00, 97.50, 96.00 and 95.00, the buffer (equity) drops to 90, 75, 60 and 50 USDT. The approximate liquidation line is at 90.50.',
      glossaryRefs: ['maintenance-margin', 'margin'],
    },
    {
      id: 'T13-A02', type: 'margin-buffer', durationMs: 30_000,
      parameters: { variant: 'margin-used-up', side: 'long', entry: 100, leverage: 10, mmr: 0.005, quantity: 10, path: [100, 97, 94, 92, 91, 90.3] },
      caption: 'Price keeps falling toward 90.30. Near 90.50 the buffer reaches the 5 USDT floor and the position is force-closed: liquidation comes before margin hits zero.',
      narration: 'The exchange does not wait for your margin to reach zero. It closes the position at the maintenance floor, and may add a liquidation fee.',
      reducedMotionDescription: 'The same fictional long: price falls 100.00 → 97.00 → 94.00 → 92.00 → 91.00 → 90.30. Equity drops 100 → 70 → 40 → 20 → 10 USDT and goes below the 5 USDT maintenance floor near 90.50, where the position is force-closed (approximate model).',
      glossaryRefs: ['liquidation', 'liquidation-price'],
    },
    {
      id: 'T13-A03', type: 'margin-buffer', durationMs: 25_000,
      parameters: { variant: 'tier-comparison', side: 'long', entry: 100, leverage: 10, mmr: 0.005, tiers: [0.005, 0.01, 0.025] },
      caption: 'Same 10× long at 100.00, three illustrative tiers: maintenance 0.5%, 1% and 2.5% move the approximate liquidation price up from 90.50 to 91.00 to 92.50.',
      narration: 'Bigger positions usually land in higher tiers. A higher maintenance rate means less room before liquidation.',
      reducedMotionDescription: 'Three cards for a fictional 10× long at 100.00: maintenance rate 0.5% → approximate liquidation 90.50 (−9.50%); 1% → 91.00 (−9.00%); 2.5% → 92.50 (−7.50%).',
      glossaryRefs: ['margin-tier', 'maintenance-margin-rate'],
    },
    {
      id: 'T13-A04', type: 'price-path', durationMs: 25_000,
      parameters: { variant: 'plain', points: [100, 98.6, 96.9, 95.2, 93.8, 92.4, 90.2, 91.7, 92.3], level: { price: 90.5, label: '≈ liquidation 90.50 (approximate)' }, markers: [{ index: 6, label: 'last 90.20' }] },
      caption: 'The last traded price drops to 90.20 for one moment, then recovers to 92.30. The mark price in the same fictional data only reaches 91.60.',
      narration: 'Many exchanges check liquidation against the mark price, a smoothed fair price. A brief spike in the last price is not the whole story, and the rules differ by exchange.',
      reducedMotionDescription: 'Fictional last prices: 100.00, 98.60, 96.90, 95.20, 93.80, 92.40, 90.20, 91.70, 92.30. The approximate liquidation line sits at 90.50. At the 90.20 spike the fictional mark price is 91.60. Whether a platform liquidates depends on its own rules; nothing here is guaranteed.',
      glossaryRefs: ['mark-price', 'last-price'],
    },
    {
      id: 'T13-A05', type: 'funding-clock', durationMs: 25_000,
      parameters: { side: 'long', notional: 1000, rates: [0.0001, 0.0001, 0.0001], intervalHours: 8 },
      caption: 'The funding clock ticks three 8-hour intervals. At +0.01% each time, the long pays 0.10 USDT, then 0.20, then 0.30 USDT in total.',
      narration: 'Positive funding rate: longs pay shorts. The charge repeats every interval while the position is open.',
      reducedMotionDescription: 'Fictional long, 1,000 USDT notional, illustrative funding +0.01% per 8 hours. After interval 1 it has paid 0.10 USDT, after interval 2 0.20 USDT, after interval 3 0.30 USDT.',
      glossaryRefs: ['funding-interval', 'funding-rate'],
    },
    {
      id: 'T13-A06', type: 'funding-clock', durationMs: 25_000,
      parameters: { side: 'short', notional: 1000, rates: [0.0001, -0.00005, 0.0001], intervalHours: 8 },
      caption: 'A short of the same size: it receives 0.10 USDT, then pays 0.05 USDT when the rate turns negative, then receives 0.10 again: 0.15 USDT received in total.',
      narration: 'The rate changes every interval. A credit is not guaranteed; the sign can flip.',
      reducedMotionDescription: 'Fictional short, 1,000 USDT notional. Interval 1 rate +0.01%: receives 0.10 USDT. Interval 2 rate −0.005%: pays 0.05 USDT. Interval 3 rate +0.01%: receives 0.10 USDT. Net: received 0.15 USDT.',
      glossaryRefs: ['funding-rate', 'short-position'],
    },
    {
      id: 'T13-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'red-flags', heading: 'A stop-loss is not liquidation insurance', items: ['A stop can slip in a fast move.', 'A gap can jump past the stop and the liquidation level.', 'A stop placed beyond liquidation never gets the chance to act.', 'High leverage puts liquidation very close to entry.'] },
      caption: 'Red flags appear one by one: slippage, gaps, a stop beyond liquidation, and high leverage.',
      reducedMotionDescription: 'Red flags: a stop can slip; a gap can jump past both the stop and the liquidation level; a stop beyond the liquidation price never acts; high leverage puts liquidation close to entry.',
      glossaryRefs: ['stop-loss', 'gap-risk'],
    },
    {
      id: 'T13-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'When to reduce exposure or not trade', items: ['Stop-loss beyond the approximate liquidation price.', 'Buffer below half of the starting margin.', 'Candles larger than your distance to liquidation.', 'You are unsure: NO TRADE is always allowed.'] },
      caption: 'Warning signs build up into one rule: when the buffer is thin or the plan is broken, cut size or step aside.',
      reducedMotionDescription: 'Warning card: reduce exposure or do not trade when the stop is beyond the approximate liquidation price, the buffer is below half of the starting margin, candles are larger than the distance to liquidation, or you are unsure. Not trading is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T13-X01', type: 'decision-with-rationale', title: 'DEMO risk check: open, warn or skip?',
      fixtureId: 'FX-T13-SERIES-01',
      instructions: 'You are the risk checker for a fictional plan. Read the plan, reveal the recent candles, tick what you can actually see, then choose a verdict and explain it in one or two sentences.',
      choices: [
        { id: 'ok', text: 'The plan is fine to practise as written.', decision: 'OK_FOR_SIM' },
        { id: 'warn', text: 'Do not open as written: cut leverage or size so the stop sits well before liquidation, then re-check.', decision: 'WARNING' },
        { id: 'no-trade', text: 'Skip this setup completely.', decision: 'NO_TRADE' },
      ],
      steps: [
        { id: 'T13-X01-01', prompt: 'Read the plan and compare the stop-loss (91.00) with the approximate liquidation price (≈ 91.68).', hint: 'For a long, which price would price reach first on the way down?' },
        { id: 'T13-X01-02', prompt: 'Reveal the candles and compare their size with the distance from 95.00 to ≈ 91.68.', hint: 'Several fictional candles have a range of about 1.5 to 2.6 USDT; the distance to liquidation is only about 3.3 USDT.' },
        { id: 'T13-X01-03', prompt: 'Choose a verdict and write why.', hint: 'Mention the stop versus the liquidation price and the effect of 25× leverage.' },
      ],
      allowedControls: ['choice', 'step-reveal', 'text-rationale', 'reset', 'hint'],
      parameters: {
        reveal: [6, 8, 10],
        context: [
          'Planned DEMO long: entry 95.00 USDT per DEMO, quantity 10 DEMO, notional 950 USDT, leverage 25×, margin 38 USDT.',
          'Approximate liquidation price (0.5% maintenance rate): 95.00 × (1 − 1/25 + 0.005) ≈ 91.68.',
          'Planned stop-loss: 91.00, which is below the approximate liquidation price.',
          'Illustrative funding: +0.01% per 8 hours, next payment in 20 minutes.',
        ],
        checklist: [
          { id: 'stop-beyond', text: 'The stop-loss is beyond the approximate liquidation price.' },
          { id: 'big-candles', text: 'Recent candles are large compared with the distance to liquidation.' },
          { id: 'high-leverage', text: '25× leverage leaves only about 3.5% room.' },
          { id: 'funding', text: 'Funding would be a small extra cost for a long if held through the next interval.' },
        ],
        decisionFeedback: {
          ok: 'The stop at 91.00 sits beyond the approximate liquidation price of 91.68, so in this model liquidation would come before the stop. The plan cannot work as written.',
          warn: 'Reducing exposure fixes the broken part of the plan: with lower leverage the liquidation price moves further away, so the stop can act first. Re-check every number before practising.',
          'no-trade': 'Skipping is always allowed. With a broken stop and candles this large, stepping aside is a strong choice.',
        },
        minRationale: 30,
      },
      expectedEvaluation: {
        kind: 'decision', decisionSet: 'risk-check', acceptable: ['WARNING', 'NO_TRADE'], requiresRationale: true,
        rationaleCues: [
          'The stop-loss (91.00) is beyond the approximate liquidation price (≈ 91.68), so liquidation would come first.',
          'At 25× the room to liquidation is only about 3.5%, smaller than two normal candles here.',
          'Lowering leverage or size, or not trading, are both valid; nothing makes the trade safe.',
        ],
      },
      explanation: 'A plan whose stop sits beyond liquidation is broken: the exchange would force-close before the stop is reached. Either reduce exposure until the stop comes first, or skip. Neither choice guarantees anything; they only stop a known flaw.',
      fictionalDataLabel: 'Fictional DEMO/USDT plan and candles; approximate liquidation model for practice only.',
    },
    {
      id: 'T13-X02', type: 'choice-feedback', title: 'The gap: what did the stop-loss do?',
      fixtureId: 'FX-T13-GAP-01',
      instructions: 'A fictional DEMO long has a stop-market order at 93.00 and an approximate liquidation price of 90.50. Price jumps from 93.80 straight to 90.00. Select every statement that is true.',
      choices: [
        { id: 'slip', text: 'The stop was triggered, but the fill could be near 90.00, far below 93.00.' },
        { id: 'crossed', text: 'The jump also crossed the approximate liquidation level, so a forced closure was possible as well.' },
        { id: 'guaranteed', text: 'The stop guaranteed an exit at exactly 93.00.' },
        { id: 'immune', text: 'Because a stop existed, the position could not be liquidated.' },
      ],
      steps: [
        { id: 'T13-X02-01', prompt: 'Look at the chart: did price trade at 93.00 at all?', hint: 'The samples go 93.80, then 90.00. There is no trade in between.' },
        { id: 'T13-X02-02', prompt: 'Select all true statements, then press Check.', hint: 'Two statements are true.' },
      ],
      allowedControls: ['multi-choice', 'reset', 'hint'],
      parameters: {
        showChart: true,
        feedback: {
          guaranteed: 'A stop-market order becomes a market order when triggered. In a gap it fills at the next available price, not at the trigger.',
          immune: 'A stop is not liquidation insurance. A gap can pass both levels before any order fills.',
        },
      },
      expectedEvaluation: { kind: 'choice-set', choiceIds: ['slip', 'crossed'] },
      explanation: 'Gap risk means price skips levels. The stop triggers late and slips, and the same jump can cross the liquidation level. No order type removes this risk; smaller size and lower leverage only reduce the damage.',
      fictionalDataLabel: 'Fictional DEMO/USDT price samples for practice only.',
    },
    {
      id: 'T13-X03', type: 'slider-explore', title: 'Leverage moves the liquidation price',
      fixtureId: 'FX-T13-ACCOUNT-01', simulatorId: 'liquidation.approx',
      instructions: 'Entry is fixed at 100.00 USDT per DEMO and the illustrative maintenance rate at 0.5%. Move the leverage slider and switch between LONG and SHORT. Then type the approximate liquidation prices asked for, to 2 decimal places.',
      steps: [
        { id: 'T13-X03-01', prompt: 'Set 20× LONG. What is the approximate liquidation price?', hint: '100 × (1 − 1/20 + 0.005) = 100 × 0.955.' },
        { id: 'T13-X03-02', prompt: 'Switch to SHORT at 20×. What is the approximate liquidation price now?', hint: '100 × (1 + 1/20 − 0.005) = 100 × 1.045.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'choice', 'reset', 'hint'],
      parameters: {
        sliders: [{ key: 'leverage', label: 'Leverage', min: 2, max: 50, step: 1, value: 10, unit: '×' }],
        fixed: { entry: 100, mmr: 0.005 },
        sideToggle: true,
        side: 'long',
        outputs: [
          { key: 'liquidationPrice', label: 'Approximate liquidation price', unit: 'USDT per DEMO', decimals: 2 },
          { key: 'distancePercent', label: 'Distance from entry', unit: '%', decimals: 2 },
        ],
        note: 'Approximate teaching model. Real liquidation prices also depend on fees, funding, margin tiers, mark price and other positions.',
      },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'longLiq', label: 'Long 20× approximate liquidation price', value: 95.5, tolerance: 0.005, unit: 'USDT per DEMO', rounding: { decimals: 2 } },
        { key: 'shortLiq', label: 'Short 20× approximate liquidation price', value: 104.5, tolerance: 0.005, unit: 'USDT per DEMO', rounding: { decimals: 2 } },
      ] },
      explanation: 'At 20× the room is only about 4.5% in either direction (≈ 95.50 for the long, ≈ 104.50 for the short). Doubling leverage from 10× roughly halves the room, which is why high leverage is so easily liquidated by ordinary moves.',
      fictionalDataLabel: 'Fictional DEMO/USDT values; approximate model for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T13-F01', name: 'Approximate liquidation price (simplified linear contract)',
      expression: 'long ≈ entry × (1 − 1/leverage + mmr); short ≈ entry × (1 + 1/leverage − mmr)',
      variables: [
        { symbol: 'entry', meaning: 'entry price', unit: 'USDT per DEMO' },
        { symbol: 'leverage', meaning: 'leverage factor', unit: '×' },
        { symbol: 'mmr', meaning: 'maintenance margin rate (illustrative 0.5% = 0.005)', unit: 'fraction' },
      ],
      simulatorId: 'liquidation.approx', approximate: true,
      workedExamples: [
        { label: 'Long 10× at 100 (notes example 1, scene A02)', side: 'long', inputs: { entry: 100, leverage: 10, mmr: 0.005 }, outputs: { liquidationPrice: 90.5, distancePercent: -9.5 }, tolerance: 1e-9, assumptions: ['fictional data', 'approximate: fees, funding, tiers and mark price ignored'] },
        { label: 'Short 10× at 100 (notes example 1)', side: 'short', inputs: { entry: 100, leverage: 10, mmr: 0.005 }, outputs: { liquidationPrice: 109.5, distancePercent: 9.5 }, tolerance: 1e-9, assumptions: ['fictional data', 'approximate'] },
        { label: 'Tier 1% and 2.5% at 10× (scene A03)', side: 'long', inputs: { entry: 100, leverage: 10, mmr: 0.025 }, outputs: { liquidationPrice: 92.5, distancePercent: -7.5 }, tolerance: 1e-9, assumptions: ['fictional data', 'illustrative tier'] },
        { label: 'Long and short 20× (exercise T13-X03)', side: 'short', inputs: { entry: 100, leverage: 20, mmr: 0.005 }, outputs: { liquidationPrice: 104.5, distancePercent: 4.5 }, tolerance: 1e-9, assumptions: ['fictional data', 'approximate'] },
        { label: 'Long 20× (exercise T13-X03)', side: 'long', inputs: { entry: 100, leverage: 20, mmr: 0.005 }, outputs: { liquidationPrice: 95.5, distancePercent: -4.5 }, tolerance: 1e-9, assumptions: ['fictional data', 'approximate'] },
        { label: 'Risk-check plan 25× at 95 (exercise T13-X01)', side: 'long', inputs: { entry: 95, leverage: 25, mmr: 0.005 }, outputs: { liquidationPrice: 91.675 }, tolerance: 0.005, assumptions: ['fictional data', 'approximate; shown to learners as ≈ 91.68'] },
        { label: 'Quiz T13-Q01: long 10× at 200', side: 'long', inputs: { entry: 200, leverage: 10, mmr: 0.005 }, outputs: { liquidationPrice: 181 }, tolerance: 1e-9, assumptions: ['fictional data', 'approximate'] },
        { label: 'Quiz T13-Q05: 5× and 50× at 100', side: 'long', inputs: { entry: 100, leverage: 50, mmr: 0.005 }, outputs: { liquidationPrice: 98.5 }, tolerance: 1e-9, assumptions: ['fictional data', 'approximate'] },
        { label: 'Quiz T13-Q05: 5× at 100', side: 'long', inputs: { entry: 100, leverage: 5, mmr: 0.005 }, outputs: { liquidationPrice: 80.5 }, tolerance: 1e-9, assumptions: ['fictional data', 'approximate'] },
      ],
    },
    {
      id: 'T13-F02', name: 'Funding payment', expression: 'payment per interval = notional × funding rate (positive rate: longs pay shorts); total = payment × intervals',
      variables: [
        { symbol: 'notional', meaning: 'position value', unit: 'USDT' },
        { symbol: 'rate', meaning: 'funding rate per interval (illustrative +0.01% = 0.0001)', unit: 'fraction' },
        { symbol: 'intervals', meaning: 'number of funding intervals held', unit: 'count' },
      ],
      simulatorId: 'funding.payment', approximate: false,
      workedExamples: [
        { label: 'Long 1,000 USDT, 3 intervals (notes example 2, scene A05)', side: 'long', inputs: { notional: 1000, rate: 0.0001, intervals: 3 }, outputs: { paymentPerInterval: 0.1, total: 0.3 }, tolerance: 1e-9, assumptions: ['illustrative rate', 'rate assumed constant'] },
        { label: 'Short 1,000 USDT, positive rate (scene A06)', side: 'short', inputs: { notional: 1000, rate: 0.0001 }, outputs: { paymentPerInterval: -0.1 }, tolerance: 1e-9, assumptions: ['negative = receives'] },
        { label: 'Short 1,000 USDT, negative rate (scene A06)', side: 'short', inputs: { notional: 1000, rate: -0.00005 }, outputs: { paymentPerInterval: 0.05 }, tolerance: 1e-9, assumptions: ['positive = pays'] },
        { label: 'Quiz T13-Q03: long 2,000 USDT over 24 h', side: 'long', inputs: { notional: 2000, rate: 0.0001, intervals: 3 }, outputs: { paymentPerInterval: 0.2, total: 0.6 }, tolerance: 1e-9, assumptions: ['illustrative rate', 'rate assumed constant'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T13-Q01', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T13',
      prompt: 'A fictional DEMO long opens at 200.00 USDT with 10× leverage. Using the approximate model with a 0.5% maintenance rate, entry × (1 − 1/leverage + 0.005), what is the approximate liquidation price in USDT?',
      answer: { kind: 'numeric', value: 181, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: '200.00 × (1 − 0.1 + 0.005) = 200.00 × 0.905 = 181.00 USDT. It is approximate: fees, funding, tiers and mark price move the real level.',
      learningOutcome: 'Estimate an approximate liquidation price for a long.',
      remediationRef: { lessonId: 'T13', anchorId: 'T13-N03' },
    },
    {
      id: 'T13-Q02', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T13', safetyCritical: true, safetyTopic: 'liquidation',
      prompt: 'A learner says: “I always set a stop-loss, so I can use 50× leverage and never get liquidated.” What is the best response?',
      choices: [
        { id: 'a', text: 'A stop-loss is not liquidation insurance: it can slip or be jumped in a gap, and at 50× the liquidation price is so close that it may come first. No setting makes futures safe.' },
        { id: 'b', text: 'Correct: with a stop-loss, liquidation is impossible.' },
        { id: 'c', text: 'Correct, as long as the stop is a stop-limit order instead of a stop-market order.' },
        { id: 'd', text: 'Correct, because the exchange always fills stops exactly at the trigger price.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A stop is your own exit plan. Gaps, slippage, or a stop placed beyond the liquidation price can all lead to forced closure. At 50× the room is only about 1.5%.',
      misconceptionFeedback: {
        b: 'Liquidation depends on the margin buffer, not on whether a stop exists. A gap can pass both levels.',
        c: 'A stop-limit can stay unfilled if price jumps past its limit, which can leave the position open all the way to liquidation.',
        d: 'Stop-market orders fill at the next available price. In fast moves that can be far from the trigger.',
      },
      learningOutcome: 'Explain why a stop-loss is not liquidation insurance and no strategy is guaranteed safe.',
      remediationRef: { lessonId: 'T13', anchorId: 'T13-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T13-Q03', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T13',
      prompt: 'A fictional long has a notional value of 2,000 USDT. The illustrative funding rate is +0.01% per 8-hour interval and stays the same. How much funding, in USDT, does the long pay over 24 hours (3 intervals)?',
      answer: { kind: 'numeric', value: 0.6, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Per interval: 2,000 × 0.0001 = 0.20 USDT. Three intervals: 0.20 × 3 = 0.60 USDT paid. A positive rate means longs pay shorts.',
      learningOutcome: 'Compute funding paid over several intervals.',
      remediationRef: { lessonId: 'T13', anchorId: 'T13-N03' },
    },
    {
      id: 'T13-Q04', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T13', fixtureId: 'FX-T13-MARK-01',
      prompt: 'In the fictional data, the last traded price spikes to 90.20 for one moment while the mark price is 91.60. The approximate liquidation price is 90.50. Which statement is most accurate?',
      choices: [
        { id: 'a', text: 'Last and mark price can differ. Many exchanges check liquidation against the mark price, but the exact rule depends on the exchange, so nothing here is guaranteed.' },
        { id: 'b', text: 'The last price touched 90.20, so liquidation certainly happened.' },
        { id: 'c', text: 'The mark price is the exact price you would get if you closed now.' },
        { id: 'd', text: 'Because the mark price stayed higher, this position is now safe.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The mark price is a smoothed fair price used by many exchanges for liquidation checks, to resist brief spikes. It does not protect against a lasting move, and rules differ.',
      misconceptionFeedback: {
        b: 'Many platforms check the mark price, not only the last trade. A spike in the last price alone does not tell you the outcome.',
        c: 'Closing happens at execution prices in the order book. The mark price is a reference value, not a fill price.',
        d: 'Nothing makes a position safe. The buffer here is very thin; a further move can still trigger liquidation.',
      },
      learningOutcome: 'Distinguish last price from mark price in liquidation checks without over-trusting either.',
      remediationRef: { lessonId: 'T13', anchorId: 'T13-N08' },
      shuffleChoices: true,
    },
    {
      id: 'T13-Q05', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T13', safetyCritical: true, safetyTopic: 'leverage',
      prompt: 'Two fictional DEMO long plans, both entry 100.00 with a stop-loss at 97.00. Plan A uses 5× (approximate liquidation ≈ 80.50). Plan B uses 50× (approximate liquidation ≈ 98.50). What should the risk check say about Plan B?',
      choices: [
        { id: 'a', text: 'NO TRADE as written: its approximate liquidation (98.50) comes before the stop (97.00), so reduce leverage or skip.' },
        { id: 'b', text: 'OK: the stop at 97.00 protects it.' },
        { id: 'c', text: 'OK: higher leverage means the stop is hit faster, which is safer.' },
        { id: 'd', text: 'Plan B is better because it uses less margin for the same trade.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'For a long, price falling from 100.00 reaches 98.50 before 97.00, so liquidation would happen first. Plan A is not “safe” either; it is only not broken in this way.',
      misconceptionFeedback: {
        b: 'The stop sits beyond the liquidation price, so it would never get the chance to act.',
        c: 'Leverage does not change where your stop is; it moves the liquidation price closer, here past the stop.',
        d: 'Less margin at higher leverage means a thinner buffer. That is exactly why liquidation sits so close.',
      },
      learningOutcome: 'Identify when a plan must reduce exposure or not trade because liquidation comes before the stop.',
      remediationRef: { lessonId: 'T13', anchorId: 'T13-N04' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Treating a stop-loss as liquidation insurance.', correction: 'Stops can slip or be jumped by gaps, and a stop beyond the liquidation price never acts. Keep the stop well before liquidation, or reduce exposure.' },
    { mistake: 'Treating a calculator liquidation price as exact.', correction: 'It is approximate. Fees, funding, tiers, mark price and other positions move the real level.' },
    { mistake: 'Ignoring funding because one payment is small.', correction: 'Funding repeats every interval while you hold; multiply by the number of intervals.' },
  ],
  takeaways: [
    'Adverse moves shrink the margin buffer; liquidation starts at the maintenance floor, before margin reaches zero, and may add a fee.',
    'Funding is paid every interval: with a positive rate longs pay shorts, and the rate can change sign.',
    'A stop-loss is not liquidation insurance and no strategy is guaranteed safe; reducing exposure or NO TRADE are always valid.',
  ],
  reviewCard: {
    keyTermIds: ['liquidation-price', 'maintenance-margin', 'gap-risk'],
    safetyNote: 'No leverage, stop-loss or strategy makes futures safe. Every liquidation price here is approximate, and not trading is always allowed.',
    reviewMinutes: 4,
    retrievalQuestion: 'A fictional short opens at 100.00 with 10× leverage and a 0.5% maintenance rate. What is the approximate liquidation price, and why might a stop at 111.00 be a problem?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T13-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
