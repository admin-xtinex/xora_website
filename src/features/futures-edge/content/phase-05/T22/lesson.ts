import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices, balances and percentages in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data and not a recommendation. Fee, slippage and margin rates are illustrative and vary by exchange and account.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can turn an example risk budget and a stop distance into a position size and notional, for both a long and a short.',
    'Learner can explain why the real loss can exceed the risk budget (stop slippage, size-step rounding, costs) and why the approximate liquidation price must sit beyond the stop.',
    'Learner can apply an illustrative daily loss limit and choose DEMO STOP_TRADING when it is reached.',
  ],
  glossaryEntries,
  notesComplexity: 'complex-risk',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T22-S01', kind: 'cover-problem', title: 'How big should a position be?',
      narrationText: 'Most beginners pick a size by feel, or by how much they hope to win. Position sizing turns that around. You first decide how much you are willing to lose if you are wrong, and the size follows from that.',
      blocks: [
        { kind: 'paragraph', text: 'Beginners often pick a size by feel or by hoped-for profit.' },
        { kind: 'paragraph', text: 'Sizing starts from the other end: **how much can I lose if I am wrong?**' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T22-A02' },
      glossaryRefs: ['position-size'],
      speakerNotes: 'Open with the two stop-filled scenes: same stop distance, 5 DEMO versus 20 DEMO. The loss is 10 USDT versus 40 USDT. Size, not the chart, decided the damage.',
    },
    {
      id: 'T22-S02', kind: 'key-definition', title: 'Risk budget and stop distance',
      narrationText: 'Your account balance is the money you start from. Your risk budget is the most you plan to lose on one trade, written in USDT as the risk amount. The stop distance is how far your stop is from your entry.',
      blocks: [
        { kind: 'list', ordered: false, items: ['[[account-balance|Account balance]]: the money you start from.', '[[risk-budget|Risk budget]]: the most you plan to lose on one trade.', '[[stop-distance|Stop distance]]: |entry − stop|.'] },
        { kind: 'definition', termId: 'risk-amount' },
      ],
      glossaryRefs: ['account-balance', 'risk-budget', 'risk-amount', 'stop-distance'],
    },
    {
      id: 'T22-S03', kind: 'visual-breakdown', title: 'Same risk, different stops',
      narrationText: 'Keep the risk amount fixed at 10 USDT. A stop 0.5% away allows a 2,000 USDT notional. A stop 4% away allows only 250 USDT. A wider stop means a smaller position.',
      blocks: [
        { kind: 'formula', expression: 'size = risk amount ÷ |entry − stop|; notional ≈ risk amount ÷ (|entry − stop| ÷ entry)', formulaId: 'T22-F01',
          variables: [{ symbol: 'risk amount', meaning: 'planned loss if the stop fills exactly', unit: 'USDT' }, { symbol: 'entry, stop', meaning: 'planned prices', unit: 'USDT per DEMO' }] },
        { kind: 'paragraph', text: 'Wider stop → **smaller** position, same planned loss.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T22-A03' },
      glossaryRefs: ['position-size', 'notional-value'],
    },
    {
      id: 'T22-S04', kind: 'worked-example', title: 'A SHORT example',
      narrationText: 'For a short, the stop sits above the entry. Entry 50.00, stop 51.00, risk amount 10 USDT. Stop distance is 1.00. Size is 10 DEMO and the notional is 500 USDT.',
      blocks: [
        {
          kind: 'worked-example', title: 'SHORT DEMO/USDT (fictional)', fictional: true,
          steps: [
            { text: 'Entry 50.00, stop 51.00 (above)', result: 'distance 1.00 (2%)' },
            { text: 'Size = 10 ÷ 1.00', result: '10 DEMO' },
            { text: 'Notional = 10 × 50.00', result: '500 USDT' },
          ],
          conclusion: 'Before fees and slippage.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T22-A05' },
      glossaryRefs: ['short-position', 'stop-distance'],
    },
    {
      id: 'T22-S05', kind: 'risks-misunderstanding', title: 'Why the real loss can be bigger',
      narrationText: 'The risk budget is a plan, not a promise. Stops can slip in a fast move. And if leverage is so high that the approximate liquidation price sits before your stop, liquidation can happen first.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Stop slippage', text: 'A stop at 98.00 can fill at 97.80. On 5 DEMO the loss becomes 11.00 USDT, not 10.00.' },
        { kind: 'callout', callout: 'safety', text: 'The approximate [[liquidation-price|liquidation price]] must sit **beyond** your stop, never before it.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T22-A06' },
      glossaryRefs: ['stop-slippage', 'liquidation-price'],
    },
    {
      id: 'T22-S06', kind: 'guided-practice', title: 'Size it yourself',
      narrationText: 'Use the calculator with your own fictional numbers. Try a wrong-side stop or a zero and see the warning. Then size a short, round a size to a step, and decide what to do after an illustrative daily loss limit is reached.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Size a SHORT from an example risk budget.', 'Round a size down to the size step.', 'Decide: continue or stop for the day?'] },
        { kind: 'callout', callout: 'tip', text: 'Long: stop below entry. Short: stop above entry.' },
      ],
      glossaryRefs: ['size-step', 'max-daily-loss'],
    },
    {
      id: 'T22-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Pick the loss first, then the size. A wider stop means a smaller size. Round down, expect slippage, keep liquidation far beyond the stop, and stop for the day when the limit is reached.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Size = risk amount ÷ stop distance.', 'Round down to the size step.', 'Slippage can exceed the budget.', 'Daily limit reached → DEMO STOP_TRADING.'] },
      ],
      glossaryRefs: ['risk-budget', 'drawdown'],
    },
  ],

  notesSections: [
    {
      id: 'T22-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: '[[position-size|Position sizing]] means deciding how many units to trade. Instead of starting from hoped-for profit, you start from your [[account-balance|account balance]] and a [[risk-budget|risk budget]]: the most you plan to lose on one trade if your [[stop-loss]] fills. Written in USDT, that is the [[risk-amount|risk amount]]. Dividing it by the [[stop-distance|stop distance]] gives the size.' },
        { kind: 'analogy', text: 'Think of a monthly food budget. You decide the amount first, then choose how much to buy at today’s prices. Expensive items mean fewer of them; the budget stays the same.' },
      ],
    },
    {
      id: 'T22-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Two learners can take the same setup with the same stop and get very different results. With a 2.00 USDT stop distance, 5 DEMO loses 10 USDT; 20 DEMO loses 40 USDT. The chart was identical; the size decided the damage. With [[leverage]], a small amount of [[margin]] can control a large [[exposure]], so size is the main control you have over loss. Losses also compound: after a 50% [[drawdown]] you need +100% just to get back to the start.' },
      ],
    },
    {
      id: 'T22-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: a LONG (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Account balance 1,000 USDT. Example risk budget 1% (an illustration, not a recommendation).', result: 'risk amount 10 USDT' },
            { text: 'Entry 100.00, stop 98.00 below it. Stop distance = |100.00 − 98.00|', result: '2.00 USDT (2%)' },
            { text: 'Size = 10 ÷ 2.00', result: '5 DEMO' },
            { text: 'Notional = 5 × 100.00 (or 10 ÷ 0.02)', result: '500 USDT' },
          ],
          conclusion: 'Exposure ÷ balance = 500 ÷ 1,000 = 0.5×. If the stop fills exactly at 98.00, the loss is 10 USDT before fees.',
        },
        {
          kind: 'worked-example', title: 'Example 2: a SHORT (stop ABOVE entry)', fictional: true,
          steps: [
            { text: 'Same 10 USDT risk amount. Short entry 50.00, stop 51.00.', result: 'distance 1.00 USDT (2%)' },
            { text: 'Size = 10 ÷ 1.00', result: '10 DEMO' },
            { text: 'Notional = 10 × 50.00', result: '500 USDT' },
          ],
          conclusion: 'For a short the loss happens when price RISES. A stop below the entry would be on the wrong side and gives no answer.',
        },
        {
          kind: 'worked-example', title: 'Example 3: rounding down to the size step', fictional: true,
          steps: [
            { text: 'Risk 10 USDT, long entry 100.00, stop 97.00: size = 10 ÷ 3.00', result: '3.333 DEMO' },
            { text: 'The size step is 0.1 DEMO, so round DOWN', result: '3.3 DEMO' },
            { text: 'Notional = 3.3 × 100.00', result: '330 USDT' },
          ],
          conclusion: 'Planned loss = 3.3 × 3.00 = 9.90 USDT, just inside the budget. Rounding up to 3.4 would plan 10.20 USDT.',
        },
        {
          kind: 'formula', expression: 'allowed notional ≈ risk amount ÷ (|entry − stop| ÷ entry)', formulaId: 'T22-F01',
          variables: [
            { symbol: 'risk amount', meaning: 'the USDT you plan to lose if the stop fills exactly', unit: 'USDT' },
            { symbol: '|entry − stop| ÷ entry', meaning: 'stop distance as a fraction of the entry price', unit: 'fraction' },
          ],
          note: 'Simple model before costs, contract size steps and liquidation.',
        },
      ],
    },
    {
      id: 'T22-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Before any size, write the stop price. No stop, no size.',
          'Check the side: long → stop below entry; short → stop above entry.',
          'Compute the stop distance, then size = risk amount ÷ stop distance.',
          'Round DOWN to the size step. If the result is below one step, the trade does not fit the budget: skip it.',
          'Check the approximate liquidation price (lesson T13). With 10× leverage on the long example it is about 90.50, far beyond the 98.00 stop. With 50× it is about 98.50, BEFORE the stop: that plan is broken.',
          'Track the day: if realized losses reach your illustrative [[max-daily-loss|daily loss limit]], the session decision is DEMO STOP_TRADING.',
        ] },
      ],
    },
    {
      id: 'T22-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Sizing from leverage instead of the stop', text: 'Leverage changes the margin you lock, not the loss per price move. Size from the stop distance first; leverage only has to be low enough to keep liquidation beyond the stop.' },
        { kind: 'callout', callout: 'mistake', title: 'Treating the budget as the maximum loss', text: '[[stop-slippage|Stop slippage]] and gaps can make the real loss bigger. A 98.00 stop filled at 97.80 on 5 DEMO loses 11.00 USDT.' },
        { kind: 'callout', callout: 'mistake', title: 'Raising size to win back losses', text: 'After losses, a bigger size only makes the next loss bigger. The daily limit exists for that moment.' },
      ],
    },
    {
      id: 'T22-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'not-advice', text: 'The 1% risk and 3% daily limit here are teaching examples only, not recommendations for you. Rules differ by person, country and exchange; this course does not give personal financial advice.' },
        { kind: 'callout', callout: 'safety', text: 'A risk budget limits the PLAN, not the outcome. Futures can lose more than planned through slippage, gaps, fees and liquidation. Stopping for the day, or not trading at all, is always allowed.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T22-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Sizing in five lines (fictional numbers)', headers: ['Step', 'Rule', 'Example'], rows: [
          ['Risk amount', 'balance × example %', '1,000 × 1% = 10 USDT'],
          ['Stop distance', '|entry − stop|', '|100 − 98| = 2.00'],
          ['Size', 'risk ÷ distance, rounded down', '10 ÷ 2.00 = 5 DEMO'],
          ['Notional', 'size × entry', '5 × 100 = 500 USDT'],
          ['Liquidation check', 'approx. liquidation beyond the stop', '90.50 is below 98.00 ✓'],
        ] },
      ],
    },
    {
      id: 'T22-N08', heading: 'learn-more', title: 'Learn more: including costs in the size', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'The simple model ignores fees. A stricter version adds an estimated round-trip cost per unit to the stop distance before dividing: size = risk amount ÷ (stop distance + cost per unit). With an illustrative 0.05% taker fee and 0.02% slippage estimate on each side, the long example costs about 0.14 USDT per DEMO, so the size falls slightly below 5 DEMO.' },
        { kind: 'paragraph', text: 'Drawdown arithmetic is not symmetric. A 10% loss needs about +11.1% to recover, a 25% loss needs +33.3%, and a 50% loss needs +100%. That is why many learners study small, fixed risk amounts and a daily stop.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T22-A01', type: 'sl-tp-lines', durationMs: 25_000,
      parameters: { variant: 'stop-filled', side: 'long', entry: 100, stop: 98, target: 103, quantity: 5, path: [100, 100.6, 99.8, 99.1, 98.4, 98.0] },
      caption: 'Small size: 5 DEMO long from 100.00. Price falls to the 98.00 stop and it fills: loss 10.00 USDT, 1% of the 1,000 USDT account.',
      narration: 'The stop is 2.00 away. With 5 DEMO, every 1.00 move costs 5 USDT, so the stop costs 10 USDT.',
      reducedMotionDescription: 'Fictional long, 5 DEMO, entry 100.00, stop 98.00, target 103.00. Price moves 100.00, 100.60, 99.80, 99.10, 98.40, 98.00. The stop fills at 98.00. Loss 5 × 2.00 = 10.00 USDT, which is 1% of a 1,000 USDT balance.',
      glossaryRefs: ['stop-distance', 'risk-amount'],
    },
    {
      id: 'T22-A02', type: 'sl-tp-lines', durationMs: 25_000,
      parameters: { variant: 'stop-filled', side: 'long', entry: 100, stop: 98, target: 103, quantity: 20, path: [100, 100.6, 99.8, 99.1, 98.4, 98.0] },
      caption: 'Same chart, same 2.00 stop distance, but 20 DEMO: the stop now costs 40.00 USDT, 4% of the account.',
      narration: 'Nothing about the chart changed. Only the size changed, and the loss became four times bigger.',
      reducedMotionDescription: 'The same fictional path and stop, but the position is 20 DEMO. When the 98.00 stop fills the loss is 20 × 2.00 = 40.00 USDT, 4% of 1,000 USDT, four times the 5 DEMO loss.',
      glossaryRefs: ['position-size'],
    },
    {
      id: 'T22-A03', type: 'position-sizing', durationMs: 35_000,
      parameters: { variant: 'risk-budget', side: 'long', balance: 1000, entry: 100, riskAmount: 10, stops: [99.5, 99, 98, 96] },
      caption: 'Risk fixed at 10 USDT. Stops at 99.50, 99.00, 98.00 and 96.00 allow notionals of 2,000, 1,000, 500 and 250 USDT.',
      narration: 'Each bar is the notional you can hold so that hitting that stop costs exactly 10 USDT. Wider stop, smaller bar.',
      reducedMotionDescription: 'Example risk budget 10 USDT of a 1,000 USDT balance (1%). Entry 100.00. Stop 99.50 (0.5% away) allows 2,000 USDT notional; stop 99.00 (1%) allows 1,000 USDT; stop 98.00 (2%) allows 500 USDT; stop 96.00 (4%) allows 250 USDT.',
      glossaryRefs: ['risk-budget', 'notional-value'],
    },
    {
      id: 'T22-A04', type: 'position-sizing', durationMs: 25_000,
      parameters: { variant: 'builder', side: 'long', balance: 1000, entry: 100, riskAmount: 10, stops: [98] },
      caption: 'Building a LONG size step by step: 1,000 USDT account, 10 USDT risk, stop distance 2.00, size 5 DEMO, notional 500 USDT.',
      narration: 'Each line appears in order: account, risk amount, stop distance, size, notional, and the reminder that stops can slip.',
      reducedMotionDescription: 'Long builder: account 1,000 USDT; example risk 10 USDT; stop distance |100.00 − 98.00| = 2.00 (2.00%); size 10 ÷ 2.00 = 5 DEMO; notional about 500 USDT; before fees and slippage.',
      glossaryRefs: ['account-balance', 'position-size'],
    },
    {
      id: 'T22-A05', type: 'position-sizing', durationMs: 25_000,
      parameters: { variant: 'builder', side: 'short', balance: 1000, entry: 50, riskAmount: 10, stops: [51] },
      caption: 'Now a SHORT: entry 50.00 with the stop ABOVE at 51.00. Distance 1.00, size 10 DEMO, notional 500 USDT.',
      narration: 'The formula is the same; only the side of the stop changes. A short loses when price rises.',
      reducedMotionDescription: 'Short builder: account 1,000 USDT; example risk 10 USDT; stop distance |50.00 − 51.00| = 1.00 (2.00%); size 10 ÷ 1.00 = 10 DEMO; notional about 500 USDT; before fees and slippage.',
      glossaryRefs: ['short-position', 'stop-distance'],
    },
    {
      id: 'T22-A06', type: 'sl-tp-lines', durationMs: 25_000,
      parameters: { variant: 'gap-fill', side: 'long', entry: 100, stop: 98, target: 103, quantity: 5, path: [100, 99.4, 98.6, 97.8, 98.3] },
      caption: 'Price jumps from 98.60 straight to 97.80. The stop fills at 97.80, so the loss grows from the planned 10.00 to 11.00 USDT.',
      narration: 'This is stop slippage. The budget was a plan; the market decided the fill.',
      reducedMotionDescription: 'Fictional long, 5 DEMO, entry 100.00, stop 98.00. Price moves 100.00, 99.40, 98.60, then gaps to 97.80. The stop fills at 97.80, 0.20 beyond the stop. Loss 5 × 2.20 = 11.00 USDT instead of the planned 10.00 USDT.',
      glossaryRefs: ['stop-slippage'],
    },
    {
      id: 'T22-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'Liquidation must sit beyond the stop', items: ['Long entry 100.00, stop 98.00, maintenance rate 0.5% (illustrative).', '10× leverage: approx. liquidation 90.50, beyond the stop.', '50× leverage: approx. liquidation 98.50, BEFORE the stop.', 'If liquidation comes first, the plan is broken: lower the leverage or skip.'] },
      caption: 'Changing only leverage moves the approximate liquidation price from 90.50 (10×) to 98.50 (50×), which is before the 98.00 stop.',
      reducedMotionDescription: 'Warning card. Long entry 100.00, stop 98.00, illustrative maintenance margin rate 0.5%. At 10× leverage the approximate liquidation price is 90.50, beyond the stop. At 50× it is about 98.50, before the stop, so liquidation could happen first. Lower the leverage or skip the trade. These are approximate.',
      glossaryRefs: ['liquidation-price', 'leverage'],
    },
    {
      id: 'T22-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Daily loss limit (example only)', items: ['Start: 1,000 USDT. Illustrative limit 3% = 30 USDT.', 'Loss 1: −10 USDT. Loss 2: −10 USDT.', 'Loss 3: −10 USDT. Total −30 USDT, drawdown 3%.', 'Limit reached → DEMO STOP_TRADING for today.'] },
      caption: 'Three 10 USDT losses add up to 30 USDT, the illustrative daily limit. The session decision flips to STOP_TRADING.',
      reducedMotionDescription: 'Checklist: start 1,000 USDT; illustrative daily loss limit 3% = 30 USDT; three losses of 10 USDT each bring the balance to 970 USDT, a 3% drawdown; the limit is reached, so the session decision is DEMO STOP_TRADING.',
      glossaryRefs: ['max-daily-loss', 'drawdown'],
    },
  ],

  exercises: [
    {
      id: 'T22-X01', type: 'position-size', title: 'Size a SHORT from a risk budget',
      fixtureId: 'FX-T22-ACCOUNT-01', simulatorId: 'risk.position-size',
      instructions: 'First explore the calculator: change the direction, the stop and the risk budget. Try a stop on the wrong side or a zero to see the warnings. Then answer the scenario below (fictional numbers, simple model before costs and liquidation).',
      steps: [
        { id: 'T22-X01-01', prompt: 'Short, entry 80.00, stop 82.00: what is the stop distance in USDT?', hint: 'For a short the stop is above the entry: |80.00 − 82.00|.' },
        { id: 'T22-X01-02', prompt: 'With an example risk budget of 20 USDT, how many DEMO is the size?', hint: 'Size = risk amount ÷ stop distance = 20 ÷ 2.00.' },
        { id: 'T22-X01-03', prompt: 'What is the notional at entry?', hint: 'Notional = size × entry = 10 × 80.00.' },
      ],
      allowedControls: ['numeric-input', 'choice', 'reset', 'hint'],
      parameters: {
        playground: { balance: 1000, riskAmount: 10, entry: 100, stop: 98, side: 'long' },
        scenario: { text: 'Fictional account 2,000 USDT. Example risk budget 20 USDT (an illustration, not a recommendation). DEMO SHORT at 80.00 with the stop above at 82.00. Find the stop distance, the size and the notional.' },
      },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'stopDistance', label: 'Stop distance', value: 2, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'quantity', label: 'Size', value: 10, tolerance: 0.005, unit: 'DEMO', rounding: { decimals: 2 } },
        { key: 'notional', label: 'Notional', value: 800, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      ] },
      explanation: 'Stop distance |80.00 − 82.00| = 2.00 USDT (2.5%). Size 20 ÷ 2.00 = 10 DEMO. Notional 10 × 80.00 = 800 USDT, which is 0.4× the 2,000 USDT account. If the stop fills exactly, the loss is 20 USDT before fees; slippage can make it larger.',
      fictionalDataLabel: 'Fictional DEMO/USDT prices and an illustrative risk budget, for practice only.',
    },
    {
      id: 'T22-X02', type: 'numeric-calculator', title: 'Round down to the size step',
      fixtureId: 'FX-T22-ACCOUNT-01', simulatorId: 'risk.position-size',
      instructions: 'A fictional contract only accepts sizes in steps of 0.1 DEMO. Risk amount 10 USDT (example), long entry 100.00, stop 97.00. Work out the size after rounding, the notional and the planned loss (2 decimal places).',
      steps: [
        { id: 'T22-X02-01', prompt: 'Raw size = 10 ÷ 3.00, then round DOWN to a multiple of 0.1.', hint: '10 ÷ 3.00 = 3.333…; the multiple of 0.1 just below is 3.3.' },
        { id: 'T22-X02-02', prompt: 'Notional = rounded size × entry.', hint: '3.3 × 100.00.' },
        { id: 'T22-X02-03', prompt: 'Planned loss = rounded size × stop distance.', hint: '3.3 × 3.00. It should be a little under the 10 USDT budget.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: { given: [
        { label: 'Risk amount (example)', value: 10, unit: 'USDT' },
        { label: 'Entry (long)', value: 100, unit: 'USDT', decimals: 2 },
        { label: 'Stop', value: 97, unit: 'USDT', decimals: 2 },
        { label: 'Size step', value: 0.1, unit: 'DEMO', decimals: 1 },
      ] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'quantity', label: 'Size after rounding', value: 3.3, tolerance: 0.005, unit: 'DEMO', rounding: { decimals: 2 } },
        { key: 'notional', label: 'Notional', value: 330, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'plannedLoss', label: 'Planned loss at the stop', value: 9.9, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      ] },
      explanation: 'The raw size 3.333 DEMO rounds down to 3.3 DEMO. Notional 330 USDT. Planned loss 3.3 × 3.00 = 9.90 USDT, inside the 10 USDT budget. Rounding up to 3.4 would plan 10.20 USDT, over budget.',
      fictionalDataLabel: 'Fictional contract rules and prices, for practice only.',
    },
    {
      id: 'T22-X03', type: 'decision-with-rationale', title: 'The limit is reached. Now what?',
      fixtureId: 'FX-T22-SESSION-01',
      instructions: 'Read the session summary and the fictional chart. Choose a DEMO session decision and explain why in your own words.',
      steps: [
        { id: 'T22-X03-01', prompt: 'Add up the realized losses so far and compare them with the illustrative daily loss limit.', hint: 'Three losses of 10 USDT each = 30 USDT. The example limit is 3% of 1,000 USDT.' },
        { id: 'T22-X03-02', prompt: 'Choose a session decision and write your reason.', hint: 'A tempting chart does not change a limit that is already reached.' },
      ],
      allowedControls: ['choice', 'text-rationale', 'reset', 'hint'],
      choices: [
        { id: 'continue', text: 'Keep practising: the chart is rising and the next trade could win the 30 USDT back.', decision: 'CONTINUE_SIM_PRACTICE' },
        { id: 'stop', text: 'Stop trading for today and review the three losses in the journal.', decision: 'STOP_TRADING' },
      ],
      parameters: {
        context: [
          'Fictional practice account started the day at 1,000 USDT.',
          'Illustrative rules (examples only): risk 10 USDT per trade, daily loss limit 3% = 30 USDT.',
          'Today: three trades, three stop-losses of 10 USDT each. Balance now 970 USDT (drawdown 3%).',
          'The DEMO/USDT chart has just made four rising candles.',
        ],
        checklist: [
          { id: 'losses', text: 'Realized losses today add up to 30 USDT.' },
          { id: 'limit', text: 'That equals the illustrative daily loss limit.' },
          { id: 'chart', text: 'The chart looks tempting right now.' },
        ],
        decisionFeedback: {
          continue: 'Trying to win back losses is exactly the moment the limit was written for. A rising chart is not new information about your risk rules.',
          stop: 'The rule was set in calm conditions to protect you in moments like this. Stopping keeps the drawdown at 3%.',
        },
        minRationale: 20,
      },
      expectedEvaluation: {
        kind: 'decision', acceptable: ['STOP_TRADING'], decisionSet: 'session', requiresRationale: true,
        rationaleCues: ['The 30 USDT of losses equals the illustrative daily loss limit.', 'A tempting chart does not cancel a rule that is already reached.', 'Trying to win losses back tends to increase size and risk.'],
      },
      explanation: 'The illustrative daily limit of 30 USDT is reached, so the planned session decision is DEMO STOP_TRADING. Use the time to review the journal instead of chasing the next candle.',
      fictionalDataLabel: 'Fictional session, balances and chart, for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T22-F01', name: 'Position size from a risk budget (simple model)',
      expression: 'stop distance = |entry − stop|; size = risk amount ÷ stop distance (rounded down to the size step); notional ≈ size × entry = risk amount ÷ (|entry − stop| ÷ entry)',
      variables: [
        { symbol: 'risk amount', meaning: 'planned loss if the stop fills exactly (example budget)', unit: 'USDT' },
        { symbol: 'entry, stop', meaning: 'planned entry and stop prices; long stop below, short stop above', unit: 'USDT per DEMO' },
        { symbol: 'size step', meaning: 'smallest quantity increment the contract allows', unit: 'DEMO' },
      ],
      simulatorId: 'risk.position-size', approximate: true,
      workedExamples: [
        { label: 'Long example (notes example 1, scene T22-A04)', inputs: { riskAmount: 10, entry: 100, stop: 98, accountBalance: 1000 }, outputs: { stopDistance: 2, stopDistancePercent: 2, quantity: 5, notional: 500, impliedLeverage: 0.5 }, tolerance: 1e-9, assumptions: ['fictional data', 'before fees and slippage'] },
        { label: 'SHORT example (slide T22-S04, scene T22-A05)', side: 'short', inputs: { riskAmount: 10, entry: 50, stop: 51 }, outputs: { stopDistance: 1, stopDistancePercent: 2, quantity: 10, notional: 500 }, tolerance: 1e-9, assumptions: ['fictional data', 'stop above entry for a short'] },
        { label: 'Size-step rounding (notes example 3, exercise T22-X02)', inputs: { riskAmount: 10, entry: 100, stop: 97, sizeStep: 0.1 }, outputs: { stopDistance: 3, quantity: 3.3, notional: 330 }, tolerance: 1e-9, assumptions: ['fictional size step 0.1 DEMO, rounded down'] },
        { label: 'SHORT scenario (exercise T22-X01)', side: 'short', inputs: { riskAmount: 20, entry: 80, stop: 82, accountBalance: 2000 }, outputs: { stopDistance: 2, stopDistancePercent: 2.5, quantity: 10, notional: 800, impliedLeverage: 0.4 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Tight stop (scene T22-A03)', inputs: { riskAmount: 10, entry: 100, stop: 99.5 }, outputs: { stopDistancePercent: 0.5, notional: 2000 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Wide stop (scene T22-A03)', inputs: { riskAmount: 10, entry: 100, stop: 96 }, outputs: { stopDistancePercent: 4, notional: 250 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Quiz T22-Q01', inputs: { riskAmount: 12, entry: 200, stop: 196 }, outputs: { stopDistance: 4, quantity: 3, notional: 600 }, tolerance: 1e-9, assumptions: ['fictional data'] },
      ],
    },
    {
      id: 'T22-F02', name: 'Approximate liquidation price (isolated, simplified)',
      expression: 'long ≈ entry × (1 − 1 ÷ leverage + maintenance margin rate); short ≈ entry × (1 + 1 ÷ leverage − maintenance margin rate)',
      variables: [
        { symbol: 'entry', meaning: 'entry price', unit: 'USDT per DEMO' },
        { symbol: 'leverage', meaning: 'chosen leverage', unit: '×' },
        { symbol: 'maintenance margin rate', meaning: 'illustrative 0.5% flat', unit: 'fraction' },
      ],
      simulatorId: 'liquidation.approx', approximate: true,
      workedExamples: [
        { label: 'Long 10× (scene T22-A07)', inputs: { entry: 100, leverage: 10, mmr: 0.005 }, outputs: { liquidationPrice: 90.5, distancePercent: -9.5 }, tolerance: 1e-9, assumptions: ['approximate', 'fees and funding ignored'] },
        { label: 'Long 50× (scene T22-A07, quiz T22-Q03)', inputs: { entry: 100, leverage: 50, mmr: 0.005 }, outputs: { liquidationPrice: 98.5, distancePercent: -1.5 }, tolerance: 1e-9, assumptions: ['approximate', 'fees and funding ignored'] },
        { label: 'SHORT 10× (notes, short example)', side: 'short', inputs: { entry: 50, leverage: 10, mmr: 0.005 }, outputs: { liquidationPrice: 54.75, distancePercent: 9.5 }, tolerance: 1e-9, assumptions: ['approximate', 'fees and funding ignored'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T22-Q01', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T22',
      prompt: 'Fictional long: entry 200.00, stop 196.00, example risk amount 12 USDT. Using size = risk amount ÷ stop distance, how many DEMO is the size?',
      answer: { kind: 'numeric', value: 3, tolerance: 0.005, unit: 'DEMO', rounding: { decimals: 2 } },
      rationale: 'Stop distance = 200.00 − 196.00 = 4.00 USDT. Size = 12 ÷ 4.00 = 3 DEMO (notional 600 USDT), before fees and slippage.',
      learningOutcome: 'Compute a position size from a risk amount and a stop distance.',
      remediationRef: { lessonId: 'T22', anchorId: 'T22-N03' },
    },
    {
      id: 'T22-Q02', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T22',
      prompt: 'Two fictional plans use the same 10 USDT risk amount and entry 100.00. Plan A has its stop at 99.00; plan B at 96.00. Which statement is correct?',
      choices: [
        { id: 'a', text: 'Plan B has the smaller position (250 USDT notional versus 1,000 USDT), but both plan to lose 10 USDT at the stop.' },
        { id: 'b', text: 'Plan B is riskier because its stop is further away.' },
        { id: 'c', text: 'Both plans should use the same position size.' },
        { id: 'd', text: 'Plan A plans to lose less money because its stop is closer.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'With a fixed risk amount, a wider stop means a smaller size: 10 ÷ 4.00 = 2.5 DEMO (250 USDT) versus 10 ÷ 1.00 = 10 DEMO (1,000 USDT). The planned loss is 10 USDT either way.',
      misconceptionFeedback: {
        b: 'Distance alone does not decide the loss. Size × distance does, and the size shrinks to keep it at 10 USDT.',
        c: 'The same size with a wider stop would plan a bigger loss. Size must change with the stop.',
        d: 'Both are sized to lose 10 USDT. The closer stop simply allows a bigger position.',
      },
      learningOutcome: 'Explain the inverse link between stop distance and position size at a fixed risk amount.',
      remediationRef: { lessonId: 'T22', anchorId: 'T22-N01' },
      shuffleChoices: true,
    },
    {
      id: 'T22-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T22', safetyCritical: true, safetyTopic: 'liquidation',
      prompt: 'A learner plans a fictional long at 100.00 with a stop at 98.00 and wants 50× leverage. With an illustrative 0.5% maintenance rate the approximate liquidation price is about 98.50. What is the best reading?',
      choices: [
        { id: 'a', text: 'Liquidation would come BEFORE the stop, so the plan is broken. Lower the leverage until the approximate liquidation sits well beyond the stop, or skip the trade.' },
        { id: 'b', text: 'Fine: the stop at 98.00 protects the position whatever the leverage.' },
        { id: 'c', text: 'Fine: liquidation at 98.50 is close to the stop, so the loss is about the same.' },
        { id: 'd', text: 'The approximate number is exact, so 98.49 is a guaranteed safe price.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'For a long, price reaches 98.50 before 98.00. The position could be liquidated first, with a liquidation fee and loss of the margin, and the stop never acts. The estimate is approximate; real rules differ by exchange.',
      misconceptionFeedback: {
        b: 'A stop only works if the position still exists when price reaches it. Liquidation at 98.50 comes first.',
        c: 'Liquidation can cost the whole margin plus a fee. It is not the same as a planned stop.',
        d: 'The formula is approximate. Real liquidation depends on exchange rules, fees and funding; no price is guaranteed.',
      },
      learningOutcome: 'Check that the approximate liquidation price sits beyond the stop.',
      remediationRef: { lessonId: 'T22', anchorId: 'T22-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T22-Q04', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T22', safetyCritical: true, safetyTopic: 'loss-limits',
      prompt: 'Your fictional practice day: start 1,000 USDT, illustrative daily loss limit 30 USDT, and three stop-losses of 10 USDT each. A new setup looks good. What is the DEMO session decision?',
      choices: [
        { id: 'stop', text: 'Stop trading for today and review.', decision: 'STOP_TRADING' },
        { id: 'continue', text: 'Continue with double size to recover the 30 USDT faster.', decision: 'CONTINUE_SIM_PRACTICE' },
      ],
      answer: { kind: 'choice', choiceId: 'stop' },
      rationale: 'The realized losses equal the illustrative limit. The rule says stop for the day, whatever the next chart looks like.',
      misconceptionFeedback: {
        continue: 'Doubling size after losses is the classic way a small drawdown becomes a large one. The limit is there for this moment.',
      },
      learningOutcome: 'Apply an illustrative daily loss limit as a stop rule for the session.',
      remediationRef: { lessonId: 'T22', anchorId: 'T22-N05' },
      shuffleChoices: false,
    },
    {
      id: 'T22-Q05', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T22', safetyCritical: true, safetyTopic: 'execution',
      prompt: 'A fictional long of 5 DEMO has entry 100.00 and a stop-market at 98.00 (planned loss 10 USDT). Price gaps and the stop fills at 97.80. What happened?',
      choices: [
        { id: 'a', text: 'Stop slippage: the loss is 5 × 2.20 = 11.00 USDT, more than the 10 USDT budget.' },
        { id: 'b', text: 'The exchange made an error; a stop always fills exactly at its price.' },
        { id: 'c', text: 'The loss is still 10 USDT because the budget was 10 USDT.' },
        { id: 'd', text: 'Nothing: the stop was not triggered.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A triggered stop-market becomes a market order and fills at the next available price. The real loss can exceed the planned loss.',
      misconceptionFeedback: {
        b: 'Stop-market orders do not guarantee a price. In fast moves or gaps they fill beyond the stop.',
        c: 'The budget is a plan. The fill price decides the real loss: 5 × (100.00 − 97.80) = 11.00 USDT.',
        d: 'Price went below 98.00, so the stop triggered; it just filled lower.',
      },
      learningOutcome: 'Recognise that stop slippage can make the real loss larger than the risk budget.',
      remediationRef: { lessonId: 'T22', anchorId: 'T22-N05' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Choosing size by feel or by the profit you hope for.', correction: 'Choose the risk amount first; size = risk amount ÷ stop distance.' },
    { mistake: 'Putting a short’s stop below the entry.', correction: 'A short loses when price rises, so its stop sits above the entry.' },
    { mistake: 'Rounding the size up to the size step.', correction: 'Round down so the planned loss stays inside the budget.' },
    { mistake: 'Raising leverage until liquidation sits before the stop.', correction: 'Keep the approximate liquidation price well beyond the stop, or skip the trade.' },
  ],
  takeaways: [
    'Decide the loss first: size = risk amount ÷ stop distance, rounded down to the size step.',
    'The budget is a plan: slippage, gaps, fees and liquidation can make the real loss bigger.',
    'When an illustrative daily loss limit is reached, the session decision is DEMO STOP_TRADING.',
  ],
  reviewCard: {
    keyTermIds: ['risk-budget', 'stop-distance', 'position-size'],
    safetyNote: 'Risk percentages here are examples, not advice. A stop can slip, and stopping for the day is always allowed.',
    reviewMinutes: 4,
    retrievalQuestion: 'Short entry 40.00, stop 40.80, risk amount 8 USDT: what is the size and the notional?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T22-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
