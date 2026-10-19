import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data, and no real orders are placed.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can place a stop-loss and a take-profit on the correct side of the entry for both a long and a short position.',
    'Learner can calculate the approximate planned loss, potential reward and risk/reward ratio before fees, for a long and a short example.',
    'Learner can explain why stops can slip or stay unfilled, why a take-profit may never fill, why liquidation may come first, and why risk/reward is not a win probability.',
  ],
  glossaryEntries,
  notesComplexity: 'complex-risk',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T08-S01', kind: 'cover-problem', title: 'Decide the exits before you enter',
      narrationText: 'Once a position is open, prices move fast and emotions follow. Deciding in advance where you will get out, both if you are wrong and if you are right, turns a guess into a plan you can check.',
      blocks: [
        { kind: 'paragraph', text: 'After you open a [[position]], price moves and feelings follow.' },
        { kind: 'paragraph', text: 'Decide **both exits first**: where you admit you were wrong, and where you collect a target.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T08-A01' },
      glossaryRefs: ['position'],
      speakerNotes: 'Frame SL and TP as decisions made calmly before entry. Avoid any suggestion that they make trading safe.',
    },
    {
      id: 'T08-S02', kind: 'key-definition', title: 'Two waiting exits',
      narrationText: 'A stop-loss closes the position if price moves against you to your chosen level. A take-profit closes it if price reaches your target. For a long, the stop is below the entry and the target above. For a short, it is the other way round.',
      blocks: [
        { kind: 'definition', termId: 'stop-loss' },
        { kind: 'definition', termId: 'take-profit' },
        { kind: 'callout', callout: 'tip', text: 'Long: stop **below**, target **above**. Short: stop **above**, target **below**.' },
      ],
      glossaryRefs: ['stop-loss', 'take-profit', 'long-position', 'short-position'],
    },
    {
      id: 'T08-S03', kind: 'visual-breakdown', title: 'Triggered is not filled',
      narrationText: 'A stop-loss has a trigger price. When it trades, the stop sends an order. The price that order really gets is the execution price. In a gap they can be far apart.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Price reaches the [[trigger-price|trigger]].', 'The stop sends an order.', 'The order fills at the [[execution-price|execution price]].'] },
        { kind: 'callout', callout: 'safety', text: 'Trigger 98.00 can become execution 96.50 in a [[price-gap|gap]].' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T08-A04' },
      glossaryRefs: ['execution-price', 'trigger-price', 'price-gap'],
    },
    {
      id: 'T08-S04', kind: 'worked-example', title: 'Risk and reward, before fees',
      narrationText: 'Long 5 DEMO at 100.00, stop 98.00, target 104.00. Risk per DEMO is 2.00, reward per DEMO is 4.00. Planned loss 10.00 USDT, potential reward 20.00 USDT. The ratio is 2.',
      blocks: [
        {
          kind: 'worked-example', title: 'Long 5 DEMO (fictional)', fictional: true,
          steps: [
            { text: 'Entry 100.00 · stop 98.00 · target 104.00' },
            { text: 'Planned loss = 2.00 × 5', result: '10.00 USDT' },
            { text: 'Potential reward = 4.00 × 5', result: '20.00 USDT' },
          ],
          conclusion: '[[risk-reward-ratio|Risk/reward]] = 20.00 ÷ 10.00 = 2, before fees.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T08-A02' },
      glossaryRefs: ['planned-loss', 'risk-reward-ratio'],
    },
    {
      id: 'T08-S05', kind: 'risks-misunderstanding', title: 'What a plan cannot promise',
      narrationText: 'Stops can slip. A stop-limit can stay unfilled. A take-profit can be missed by a few cents. With leverage, liquidation can close the position before the stop. And a ratio of 2 says nothing about the chance of winning.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Stops can slip or stay unfilled.', 'A take-profit can remain unfilled.', 'With leverage, liquidation may happen first.', 'R:R is **not** a win probability.'] },
      ],
      visualRef: { kind: 'scene', sceneId: 'T08-A08' },
      glossaryRefs: ['stop-loss', 'take-profit', 'risk-reward-ratio'],
    },
    {
      id: 'T08-S06', kind: 'guided-practice', title: 'Place the lines yourself',
      narrationText: 'Use the sliders or type the prices to place a stop-loss and a take-profit. Then play the bullish, bearish and gap paths and watch which line is triggered and where it fills.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Place SL and TP for a long at 100.00.', 'Play bullish, bearish and gap paths.', 'Repeat the maths for a short.'] },
        { kind: 'callout', callout: 'fictional-data', text: 'Fictional paths only. No real orders.' },
      ],
      glossaryRefs: ['stop-loss', 'take-profit'],
    },
    {
      id: 'T08-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Set exits before entry. Long stop below, short stop above. Planned loss is distance times quantity, before fees. Real results can be worse, and a ratio is not a probability.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Exits are planned before entry.', 'Planned loss = |entry − stop| × quantity.', 'Execution can differ from the trigger.', 'R:R measures size, not chance.'] },
      ],
      glossaryRefs: ['planned-loss', 'execution-price'],
    },
  ],

  notesSections: [
    {
      id: 'T08-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'A [[stop-loss]] is a waiting order that closes your position if price moves against you to a level you chose. A [[take-profit]] is a waiting order that closes it if price reaches a target in your favour. For a [[long-position|long]] the stop sits below the [[entry-price|entry price]] and the target above; for a [[short-position|short]] the stop sits above and the target below.' },
        { kind: 'paragraph', text: 'A stop-loss is built from the stop orders of lesson T07: when its [[trigger-price|trigger price]] trades, it sends a [[stop-market-order|stop-market]] or [[stop-limit-order|stop-limit]] order. The price that order really trades at is the [[execution-price|execution price]]. The amount you would lose with a perfect fill at the stop is the [[planned-loss|planned loss]], and the size of the target compared with that loss is the [[risk-reward-ratio|risk/reward ratio]].' },
        { kind: 'analogy', text: 'A seat belt and a destination on a map. You buckle the belt before the drive, not during the crash, and you choose where you are going before you leave. Neither one guarantees how the trip goes.' },
      ],
    },
    {
      id: 'T08-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Without a planned exit, a small loss can quietly become a large one while you hope for a recovery. Writing the stop and target down before entry lets you calculate the approximate loss you are accepting and check whether the idea is worth it. It also makes later review honest: you can compare what you planned with what actually happened, including [[slippage]].' },
      ],
    },
    {
      id: 'T08-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: a long plan (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Long 5 DEMO at entry 100.00, stop-loss 98.00, take-profit 104.00.' },
            { text: 'Risk per DEMO = 100.00 − 98.00', result: '2.00 USDT' },
            { text: 'Reward per DEMO = 104.00 − 100.00', result: '4.00 USDT' },
            { text: 'Planned loss = 2.00 × 5', result: '10.00 USDT' },
            { text: 'Potential reward = 4.00 × 5', result: '20.00 USDT' },
            { text: 'Risk/reward = 4.00 ÷ 2.00', result: '2' },
          ],
          conclusion: 'All before fees. If the stop fills at 97.90 instead of 98.00, the loss is 2.10 × 5 = 10.50 USDT; after a gap to 96.50 it is 3.50 × 5 = 17.50 USDT.',
        },
        {
          kind: 'worked-example', title: 'Example 2: a short plan (fictional)', fictional: true,
          steps: [
            { text: 'Short 4 DEMO at entry 100.00, stop-loss 101.50 (above), take-profit 97.00 (below).' },
            { text: 'Risk per DEMO = 101.50 − 100.00', result: '1.50 USDT' },
            { text: 'Reward per DEMO = 100.00 − 97.00', result: '3.00 USDT' },
            { text: 'Planned loss = 1.50 × 4', result: '6.00 USDT' },
            { text: 'Potential reward = 3.00 × 4', result: '12.00 USDT' },
          ],
          conclusion: 'Risk/reward = 12.00 ÷ 6.00 = 2, before fees. For a short, the loss grows as price rises, so the stop is above the entry.',
        },
        {
          kind: 'formula', expression: 'planned loss ≈ |entry − stop| × quantity; potential reward ≈ |target − entry| × quantity; R:R = reward ÷ risk',
          variables: [
            { symbol: 'entry, stop, target', meaning: 'planned entry, stop-loss and take-profit prices', unit: 'USDT per DEMO' },
            { symbol: 'quantity', meaning: 'position size', unit: 'DEMO' },
          ],
        },
        { kind: 'callout', callout: 'approximation', text: 'These are planned amounts before fees, slippage and funding. Real results can be worse.' },
      ],
    },
    {
      id: 'T08-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Check the side: a long’s stop is below entry and target above; a short’s is the reverse. A stop on the wrong side would close the trade immediately or never protect it.',
          'Read each line’s status: waiting, triggered, or filled. Only a fill closes the position.',
          'After a stop fills, compare the execution price with the trigger. The difference is slippage.',
          'If a take-profit is still waiting after price came close and turned back, it was not filled; the position is still open.',
          'On a leveraged futures position, look at the estimated liquidation price too (lesson T13). If it sits between the entry and the stop, liquidation could come first.',
          'For example on Binance, stop-loss and take-profit fields appear in the order form, but layouts and names change; this course uses a generic mock only.',
        ] },
      ],
    },
    {
      id: 'T08-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Treating the stop as a guaranteed maximum loss', text: 'A stop-market can fill beyond the trigger in fast moves and gaps. A stop-limit can stay unfilled while the loss keeps growing.' },
        { kind: 'callout', callout: 'mistake', title: 'Reading R:R as a chance of winning', text: 'A 2 : 1 plan says the target is twice as far as the stop. It says nothing about which one price reaches first.' },
        { kind: 'callout', callout: 'mistake', title: 'Moving the stop further away to avoid being stopped out', text: 'That increases the planned loss after the fact. Decide the stop before entry and size the position to it.' },
      ],
    },
    {
      id: 'T08-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Stop-losses reduce risk; they do not remove it. Stops can slip, stop-limits can stay unfilled, and take-profits can remain unfilled. With leverage, a position can be liquidated before the stop is reached, losing the margin. Risk/reward describes sizes, not probabilities. If you cannot place a sensible stop, not trading is a valid choice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T08-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Stop-loss and take-profit at a glance', headers: ['Item', 'Long', 'Short'], rows: [
          ['Stop-loss side', 'below entry', 'above entry'],
          ['Take-profit side', 'above entry', 'below entry'],
          ['Planned loss', '(entry − stop) × qty', '(stop − entry) × qty'],
          ['Potential reward', '(target − entry) × qty', '(entry − target) × qty'],
          ['Can it go wrong?', 'slip, unfilled, liquidation first', 'slip, unfilled, liquidation first'],
        ] },
      ],
    },
    {
      id: 'T08-N08', heading: 'learn-more', title: 'Learn more: why gaps make stops slip', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'A stop order cannot trade at a price where nobody is trading. When news hits or the order book is thin, price can jump over your trigger. The stop then wakes up below it (for a long) and takes whatever bids are there. Some exchanges watch the mark price for stops and some the last price; each choice has trade-offs. Placing the stop in a sensible spot and keeping position size small are the main ways learners study to limit the damage; neither is a guarantee.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T08-A01', type: 'sl-tp-lines', durationMs: 25_000,
      parameters: { variant: 'setup', side: 'long', entry: 100, stop: 98, target: 104, quantity: 5 },
      caption: 'Plan first: entry 100.00 appears, then the stop-loss at 98.00, then the take-profit at 104.00. Risk 2.00 and reward 4.00 per DEMO.',
      narration: 'The three lines appear one at a time, before any price moves. The card shows risk and reward per DEMO and the ratio of 2.',
      reducedMotionDescription: 'A fictional long plan on DEMO/USDT: entry 100.00, stop-loss 98.00 below, take-profit 104.00 above, 5 DEMO. Risk 2.00 per DEMO, reward 4.00 per DEMO, ratio 2, which is not a chance of winning.',
      glossaryRefs: ['stop-loss', 'take-profit'],
    },
    {
      id: 'T08-A02', type: 'sl-tp-lines', durationMs: 30_000,
      parameters: { variant: 'target-hit', side: 'long', entry: 100, stop: 98, target: 104, quantity: 5, path: [100, 100.8, 101.5, 102.6, 103.4, 104.2, 104.5] },
      caption: 'Bullish path: price climbs from 100.00 to 104.20, the take-profit **fills at 104.00** and the result is +20.00 USDT before fees.',
      narration: 'The take-profit closes the long at its price. Price kept rising to 104.50 afterwards, but the position was already closed.',
      reducedMotionDescription: 'Fictional bullish path: 100.00, 100.80, 101.50, 102.60, 103.40, 104.20, 104.50. Price reaches the take-profit at 104.00, which fills at 104.00. Result for 5 DEMO: (104.00 − 100.00) × 5 = +20.00 USDT before fees.',
      glossaryRefs: ['take-profit'],
    },
    {
      id: 'T08-A03', type: 'sl-tp-lines', durationMs: 30_000,
      parameters: { variant: 'stop-filled', side: 'long', entry: 100, stop: 98, target: 104, quantity: 5, path: [100, 99.4, 98.9, 98.4, 97.9, 97.6] },
      caption: 'Bearish path: price slides to 97.90, the stop-loss triggers and **fills at 97.90**, 0.10 past the stop. Result −10.50 USDT instead of the planned −10.00.',
      narration: 'Even a calm fall can produce a little slippage: the first trade at or below 98.00 was 97.90.',
      reducedMotionDescription: 'Fictional bearish path: 100.00, 99.40, 98.90, 98.40, 97.90, 97.60. The stop-loss at 98.00 triggers when 97.90 trades and fills at 97.90. Result for 5 DEMO: (97.90 − 100.00) × 5 = −10.50 USDT, slightly worse than the planned −10.00.',
      glossaryRefs: ['stop-loss', 'execution-price', 'slippage'],
    },
    {
      id: 'T08-A04', type: 'sl-tp-lines', durationMs: 30_000,
      parameters: { variant: 'gap-fill', side: 'long', entry: 100, stop: 98, target: 104, quantity: 5, path: [100, 99.6, 99.1, 96.5, 96.2, 96.8] },
      caption: 'Gap path: price jumps from 99.10 straight to 96.50. The stop is **triggered** and **filled at 96.50**, 1.50 past the stop. Result −17.50 USDT.',
      narration: 'No trades happened at 98.00, so the stop could not fill there. The execution price was the first available price after the gap.',
      reducedMotionDescription: 'Fictional gap path: 100.00, 99.60, 99.10, then a jump to 96.50, 96.20, 96.80. The stop-loss at 98.00 triggers at 96.50 and fills at 96.50, 1.50 worse than planned. Result for 5 DEMO: −17.50 USDT, compared with the planned −10.00.',
      glossaryRefs: ['price-gap', 'execution-price'],
    },
    {
      id: 'T08-A05', type: 'sl-tp-lines', durationMs: 30_000,
      parameters: { variant: 'stop-limit-unfilled', side: 'long', entry: 100, stop: 98, target: 104, quantity: 5, stopLimit: 97.8, path: [100, 99.6, 99.1, 96.5, 95.8, 95.2] },
      caption: 'Same gap with a stop-limit (limit 97.80): the stop is **triggered at 96.50 but NOT filled**, and price keeps falling to 95.20 with the position still open.',
      narration: 'A stop-limit refuses to sell below its limit. After the gap nobody pays 97.80, so the protection never happens.',
      reducedMotionDescription: 'Fictional path: 100.00, 99.60, 99.10, 96.50, 95.80, 95.20. The stop-loss is a stop-limit with trigger 98.00 and limit 97.80. It triggers at 96.50, but price never trades back at 97.80 or higher, so it does not fill. The long stays open while price falls to 95.20.',
      glossaryRefs: ['stop-limit-order', 'stop-loss'],
    },
    {
      id: 'T08-A06', type: 'sl-tp-lines', durationMs: 25_000,
      parameters: { variant: 'near-miss', side: 'long', entry: 100, stop: 98, target: 104, quantity: 5, path: [100, 101.2, 102.5, 103.6, 103.9, 102.8, 101.6] },
      caption: 'Near miss: price rises to 103.90, just 0.10 short of the 104.00 take-profit, then falls back to 101.60. The take-profit **remains unfilled**.',
      narration: 'Being close is not the same as being filled. The position is still open and the unrealized gain has shrunk.',
      reducedMotionDescription: 'Fictional path: 100.00, 101.20, 102.50, 103.60, 103.90, 102.80, 101.60. Price never reaches 104.00, so the take-profit does not fill. The long position stays open at 101.60.',
      glossaryRefs: ['take-profit', 'unrealized-pnl'],
    },
    {
      id: 'T08-A07', type: 'sl-tp-lines', durationMs: 25_000,
      parameters: { variant: 'target-hit', side: 'short', entry: 100, stop: 101.5, target: 97, quantity: 4, path: [100, 99.4, 98.6, 97.8, 96.9, 97.2] },
      caption: 'Short plan: stop 101.50 above, target 97.00 below. Price falls to 96.90 and the take-profit **fills at 97.00**: +12.00 USDT before fees.',
      narration: 'For a short the lines are mirrored. Falling price is the favourable direction, so the target sits below the entry.',
      reducedMotionDescription: 'Fictional short of 4 DEMO at 100.00 with stop-loss 101.50 and take-profit 97.00. Path: 100.00, 99.40, 98.60, 97.80, 96.90, 97.20. The take-profit fills at 97.00. Result: (100.00 − 97.00) × 4 = +12.00 USDT before fees. Planned loss was 6.00 USDT; ratio 2.',
      glossaryRefs: ['short-position', 'take-profit'],
    },
    {
      id: 'T08-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'What SL and TP cannot promise', items: ['Stops can slip past the trigger.', 'A stop-limit or take-profit can stay unfilled.', 'With leverage, liquidation may happen before the stop.', 'Risk/reward is not a win probability.'] },
      caption: 'Safety: four limits of any stop-loss and take-profit plan, revealed one by one.',
      reducedMotionDescription: 'Warning card: stops can slip past the trigger; a stop-limit or take-profit can stay unfilled; with leverage, liquidation may happen before the stop; risk/reward is not a win probability.',
    },
  ],

  exercises: [
    {
      id: 'T08-X01', type: 'line-placement', title: 'Place SL and TP, then play the paths',
      fixtureId: 'FX-T08-CHART-01', simulatorId: 'risk.reward',
      instructions: 'You plan a fictional long of 5 DEMO at 100.00. Use the slider or type a price to place the stop-loss below and the take-profit above. Then play the bullish, bearish and gap paths and read whether each line was triggered and where it filled.',
      steps: [
        { id: 'T08-X01-01', prompt: 'Place the stop-loss below 100.00 and the take-profit above 100.00.', hint: 'For a long, losses happen when price falls, so the stop goes below the entry.' },
        { id: 'T08-X01-02', prompt: 'Read the planned risk, potential reward and ratio under the chart.', hint: 'Risk = (100.00 − stop) × 5. Reward = (target − 100.00) × 5. Both before fees.' },
        { id: 'T08-X01-03', prompt: 'Play all three paths. In the gap path, compare the fill price with your stop.', hint: 'In the gap path price jumps from 99.60 to 96.40, so any stop above 96.40 fills at 96.40.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'choice', 'reset', 'hint'],
      parameters: {
        side: 'long', entry: 100, quantity: 5,
        stop: { min: 95, max: 99.9, step: 0.1, value: 99 },
        target: { min: 100.1, max: 106, step: 0.1, value: 101 },
        scenarios: [
          { id: 'bullish', label: 'Bullish', points: [100, 100.8, 101.6, 102.7, 103.5, 104.3, 105.2] },
          { id: 'bearish', label: 'Bearish', points: [100, 99.5, 98.9, 98.3, 97.6, 97.0] },
          { id: 'gap', label: 'Gap down', points: [100, 99.8, 99.6, 96.4, 96.0, 96.3] },
        ],
      },
      expectedEvaluation: { kind: 'constraint', simulatorId: 'risk.reward', description: 'Stop-loss below the entry and take-profit above it for the long, and every scenario (bullish, bearish, gap) played at least once.' },
      explanation: 'With the lines on the correct sides, the bullish path fills the take-profit, the bearish path fills the stop near its price, and the gap path fills the stop at 96.40, worse than planned. The ratio stays the same in every path: it never told you which path would happen.',
      fictionalDataLabel: 'Fictional DEMO/USDT prices and paths for practice only.',
    },
    {
      id: 'T08-X02', type: 'line-placement', title: 'Calculate a short plan',
      fixtureId: 'FX-T08-CHART-01', simulatorId: 'risk.reward',
      instructions: 'Now a fictional short of 4 DEMO at 100.00. Set the stop-loss to 101.50 and the take-profit to 97.00 (slider or typed price), then enter the planned loss, potential reward and ratio, before fees.',
      steps: [
        { id: 'T08-X02-01', prompt: 'Set the stop-loss to 101.50 (above the entry) and the take-profit to 97.00 (below).', hint: 'A short loses when price rises, so the stop goes above 100.00.' },
        { id: 'T08-X02-02', prompt: 'Planned loss = (stop − entry) × 4. Potential reward = (entry − target) × 4.', hint: '1.50 × 4 and 3.00 × 4.' },
        { id: 'T08-X02-03', prompt: 'Ratio = potential reward ÷ planned loss.', hint: '12.00 ÷ 6.00' },
      ],
      allowedControls: ['slider', 'numeric-input', 'reset', 'hint'],
      parameters: {
        side: 'short', entry: 100, quantity: 4,
        stop: { min: 100.1, max: 105, step: 0.1, value: 102 },
        target: { min: 95, max: 99.9, step: 0.1, value: 98 },
      },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'risk', label: 'Planned loss', value: 6, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'reward', label: 'Potential reward', value: 12, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'ratio', label: 'Risk/reward ratio', value: 2, tolerance: 0.005, unit: 'ratio', rounding: { decimals: 2 } },
      ] },
      explanation: 'Planned loss 1.50 × 4 = 6.00 USDT, potential reward 3.00 × 4 = 12.00 USDT, ratio 2. Before fees, and only if both orders fill exactly at their prices.',
      fictionalDataLabel: 'Fictional DEMO/USDT prices for practice only.',
    },
    {
      id: 'T08-X03', type: 'choice-feedback', title: 'What really happened in the gap?',
      fixtureId: 'FX-T08-GAP-01',
      instructions: 'A fictional long of 5 DEMO at 100.00 had a stop-market stop-loss at 98.00 and a take-profit at 104.00. The chart shows the path: 100.00, 99.60, 99.10, 96.50, 96.20, 96.80. Select every statement that is true.',
      steps: [
        { id: 'T08-X03-01', prompt: 'Find the first price at or below 98.00 on the path.', hint: 'The jump from 99.10 lands at 96.50.' },
        { id: 'T08-X03-02', prompt: 'Compare the execution price with the planned stop, then tick all true statements.', hint: 'Loss = (100.00 − 96.50) × 5.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      choices: [
        { id: 'triggered', text: 'The stop-loss was triggered, because price traded at or below 98.00.' },
        { id: 'loss-1750', text: 'It filled at 96.50, so the loss was 17.50 USDT before fees, not the planned 10.00.' },
        { id: 'stop-limit', text: 'Had it been a stop-limit with limit 97.80, the position could still be open.' },
        { id: 'guaranteed', text: 'The stop-loss guaranteed an exit at 98.00.' },
        { id: 'probability', text: 'The 2 : 1 risk/reward meant the trade had about a 67% chance of winning.' },
      ],
      parameters: {
        showChart: true,
        feedback: {
          guaranteed: 'No stop guarantees its price. Nobody traded at 98.00, so the stop-market took the first price after the gap: 96.50.',
          probability: 'A risk/reward ratio compares sizes only. It does not give any probability of winning.',
        },
      },
      expectedEvaluation: { kind: 'choice-set', choiceIds: ['triggered', 'loss-1750', 'stop-limit'] },
      explanation: 'The stop triggered at 96.50 and filled there: (100.00 − 96.50) × 5 = 17.50 USDT lost before fees. A stop-limit at 97.80 would have triggered but not filled. Neither the stop price nor the ratio was a guarantee.',
      fictionalDataLabel: 'Fictional DEMO/USDT path for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T08-F01', name: 'Planned risk and potential reward (before fees)', expression: 'risk per unit = |entry − stop|; reward per unit = |target − entry|; risk = risk per unit × quantity; reward = reward per unit × quantity; ratio = reward per unit ÷ risk per unit',
      variables: [
        { symbol: 'entry, stop, target', meaning: 'planned entry, stop-loss and take-profit prices', unit: 'USDT per DEMO' },
        { symbol: 'quantity', meaning: 'position size', unit: 'DEMO' },
      ],
      simulatorId: 'risk.reward', approximate: true,
      workedExamples: [
        { label: 'Long plan (notes example 1, scene T08-A01)', inputs: { entry: 100, stop: 98, target: 104, quantity: 5 }, outputs: { riskPerUnit: 2, rewardPerUnit: 4, risk: 10, reward: 20, ratio: 2 }, tolerance: 1e-9, assumptions: ['fictional data', 'before fees, slippage and funding'] },
        { label: 'Short plan (notes example 2, exercise T08-X02)', side: 'short', inputs: { entry: 100, stop: 101.5, target: 97, quantity: 4 }, outputs: { riskPerUnit: 1.5, rewardPerUnit: 3, risk: 6, reward: 12, ratio: 2 }, tolerance: 1e-9, assumptions: ['fictional data', 'before fees, slippage and funding'] },
        { label: 'Quiz T08-Q01', inputs: { entry: 50, stop: 49, target: 53, quantity: 10 }, outputs: { risk: 10, reward: 30, ratio: 3 }, tolerance: 1e-9, assumptions: ['fictional data', 'before fees'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T08-Q01', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T08',
      prompt: 'A fictional long of 10 DEMO at 50.00 has a stop-loss at 49.00 and a take-profit at 53.00. What is the potential reward in USDT, before fees?',
      answer: { kind: 'numeric', value: 30, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Reward per DEMO = 53.00 − 50.00 = 3.00; × 10 = 30.00 USDT. The planned loss is 1.00 × 10 = 10.00 USDT, so the ratio is 3.',
      learningOutcome: 'Calculate potential reward before fees from entry, target and quantity.',
      remediationRef: { lessonId: 'T08', anchorId: 'T08-N03' },
    },
    {
      id: 'T08-Q02', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T08', safetyCritical: true, safetyTopic: 'execution',
      prompt: 'A learner says: “My long has a stop-loss at 98.00 and a planned loss of 10.00 USDT, so I can never lose more than 10.00 USDT.” What is the best reply?',
      choices: [
        { id: 'a', text: 'Not quite: stops can slip in fast moves and gaps, a stop-limit can stay unfilled, and fees add to the loss. 10.00 is a plan, not a cap.' },
        { id: 'b', text: 'Correct: a stop-loss always fills exactly at its price.' },
        { id: 'c', text: 'Correct, as long as the take-profit is also set.' },
        { id: 'd', text: 'Wrong: stop-losses never fill, so the loss is unlimited.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The planned loss assumes a perfect fill at 98.00. In the lesson’s gap the stop filled at 96.50 and the loss was 17.50 USDT.',
      misconceptionFeedback: {
        b: 'No stop guarantees its execution price. If price jumps over 98.00, the stop fills at the next available price.',
        c: 'The take-profit only acts in the favourable direction. It does not protect the stop’s price.',
        d: 'Stop-market orders usually do fill once triggered; the problem is that the price can be worse, not that they never fill.',
      },
      learningOutcome: 'Explain why the planned loss is not a guaranteed maximum loss.',
      remediationRef: { lessonId: 'T08', anchorId: 'T08-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T08-Q03', type: 'single', cognitiveTag: 'mistake-risk', linkedLessonId: 'T08', safetyCritical: true, safetyTopic: 'not-advice',
      prompt: 'A plan has a risk/reward ratio of 3 (reward 3 times the planned loss). What does that tell you about the chance of winning?',
      choices: [
        { id: 'a', text: 'Nothing. The ratio compares sizes; it does not say how likely the target or the stop is.' },
        { id: 'b', text: 'The trade wins 75% of the time.' },
        { id: 'c', text: 'The trade wins 3 times out of 4 if fees are ignored.' },
        { id: 'd', text: 'The trade is safe because the reward is bigger than the risk.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Risk/reward is the size of the planned win divided by the size of the planned loss. A far target can make the ratio large while also making it less likely to be reached.',
      misconceptionFeedback: {
        b: '3 : 1 is not 75%. The ratio contains no probability at all.',
        c: 'Ignoring fees does not turn a size comparison into a probability.',
        d: 'No trade is safe. A bigger reward on paper says nothing about whether price will get there.',
      },
      learningOutcome: 'Distinguish a risk/reward ratio from a win probability.',
      remediationRef: { lessonId: 'T08', anchorId: 'T08-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T08-Q04', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T08',
      prompt: 'A fictional long at 100.00 has a take-profit at 104.00. Price rises to 103.90, then falls back to 101.60. What is the status?',
      choices: [
        { id: 'a', text: 'The take-profit did not fill; the position is still open at 101.60.' },
        { id: 'b', text: 'The take-profit filled at 103.90, close enough to the target.' },
        { id: 'c', text: 'The take-profit filled at 104.00 because price was within 0.10.' },
        { id: 'd', text: 'The stop-loss filled because price fell.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A take-profit fills only when price actually reaches its level. 103.90 is below 104.00, so it stays unfilled and the position remains open.',
      misconceptionFeedback: {
        b: 'Orders do not fill because price came close. The target was never traded.',
        c: 'There is no “within 0.10” rule. Price must reach 104.00.',
        d: 'Price fell to 101.60, which is still above the entry and any stop below it.',
      },
      learningOutcome: 'Recognise that a take-profit can remain unfilled after a near miss.',
      remediationRef: { lessonId: 'T08', anchorId: 'T08-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T08-Q05', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T08', safetyCritical: true, safetyTopic: 'liquidation',
      prompt: 'A fictional leveraged long at 100.00 has a stop-loss at 95.00. The exchange shows an estimated liquidation price of 96.00. What can happen if price falls?',
      choices: [
        { id: 'a', text: 'The position can be liquidated near 96.00 before the stop at 95.00 is ever reached.' },
        { id: 'b', text: 'The stop-loss always acts first, so liquidation is impossible.' },
        { id: 'c', text: 'Liquidation only happens to positions without a stop-loss.' },
        { id: 'd', text: 'Nothing; liquidation prices do not apply to futures.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Price falls past 96.00 before it reaches 95.00, so liquidation can close the position first. A stop only helps if it sits before the liquidation price, and even then stops can slip. Lesson T13 covers liquidation in detail.',
      misconceptionFeedback: {
        b: 'A stop has no priority over liquidation. If the liquidation price comes first, it can close the position.',
        c: 'Having a stop does not protect you if the stop is placed beyond the liquidation price.',
        d: 'Leveraged futures positions do have liquidation prices; the course studies them in lesson T13.',
      },
      learningOutcome: 'Recognise that liquidation may occur before a stop-loss on a leveraged position.',
      remediationRef: { lessonId: 'T08', anchorId: 'T08-N06' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Treating the stop-loss price as a guaranteed maximum loss.', correction: 'Stops can slip or stay unfilled; the planned loss is an estimate before fees.' },
    { mistake: 'Reading a risk/reward ratio as a win probability.', correction: 'The ratio compares sizes only. It says nothing about which level price reaches first.' },
    { mistake: 'Placing the stop on the wrong side or beyond the liquidation price.', correction: 'Long: stop below entry; short: above. On leveraged positions, keep the stop before the estimated liquidation price.' },
  ],
  takeaways: [
    'Plan the stop-loss and take-profit before entry: long stop below, short stop above.',
    'Planned loss and potential reward are distance × quantity, before fees; their ratio is not a win probability.',
    'Stops can slip, stop-limits and take-profits can stay unfilled, and liquidation may come first.',
  ],
  reviewCard: {
    keyTermIds: ['stop-loss', 'take-profit', 'risk-reward-ratio'],
    safetyNote: 'A stop-loss reduces risk but does not cap it: stops can slip, orders can stay unfilled, and leveraged positions can be liquidated first.',
    reviewMinutes: 4,
    retrievalQuestion: 'A short of 2 DEMO at 80.00 has a stop at 82.00 and a target at 75.00. What are the planned loss, potential reward and ratio before fees?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T08-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
