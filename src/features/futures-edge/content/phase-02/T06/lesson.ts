import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures, T06_DOWN_PATH, T06_PATH } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices in this lesson are fictional DEMO/USDT examples made for teaching. Fee rates (0.05% per side taker, 0.02% maker) are illustrative and vary by exchange and account.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can calculate gross PnL from entry price, exit price and quantity for a spot trade, a futures long and a futures short, with units and sign.',
    'Learner can tell unrealized PnL (open, uses the mark price) from realized PnL (closed, fixed), including a partial close.',
    'Learner can turn a gross result into a net result by subtracting entry and exit fees, and explain why a gross gain can be a net loss.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T06-S01', kind: 'cover-problem', title: 'How much did I actually make?',
      narrationText: 'Your screen shows a green number while a trade is open. Is that money yours? Not yet. And even when you close, fees come out. This lesson shows how to calculate the real result.',
      blocks: [
        { kind: 'paragraph', text: 'An open trade shows a number that keeps changing. Is it yours yet?' },
        { kind: 'paragraph', text: 'To know the real result you need four things: **entry**, **exit**, **quantity** and **costs**.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T06-A01' },
      glossaryRefs: ['entry-price', 'exit-price'],
      speakerNotes: 'Anchor on the feeling of seeing a green number. The lesson separates on-screen numbers from money actually kept.',
    },
    {
      id: 'T06-S02', kind: 'key-definition', title: 'Entry, exit, quantity, notional',
      narrationText: 'Entry price is where the position opened. Exit price is where it closed. Quantity is how many DEMO. Notional is entry price times quantity: the money value of the position.',
      blocks: [
        { kind: 'list', ordered: false, items: ['[[entry-price|Entry]]: price when opened.', '[[exit-price|Exit]]: price when closed.', '[[quantity|Quantity]]: how many DEMO.', '[[notional-value|Notional]] = price × quantity.'] },
        { kind: 'paragraph', text: '2 DEMO at 200.00 = 400.00 USDT notional.' },
      ],
      glossaryRefs: ['entry-price', 'exit-price', 'quantity', 'notional-value'],
    },
    {
      id: 'T06-S03', kind: 'visual-breakdown', title: 'Open vs closed, gross vs net',
      narrationText: 'While a position is open its PnL is unrealized, valued with the mark price, and it keeps moving. When you close, it becomes realized and stops changing. Gross is before costs; net is after fees.',
      blocks: [
        { kind: 'comparison',
          left: { title: 'Unrealized', points: ['Position still open.', 'Moves with the [[mark-price|mark price]].'] },
          right: { title: 'Realized', points: ['Position closed.', 'Fixed at the exit price.'] } },
        { kind: 'paragraph', text: '[[gross-pnl|Gross]] = before costs. [[net-pnl|Net]] = after fees.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T06-A03' },
      glossaryRefs: ['unrealized-pnl', 'realized-pnl', 'mark-price'],
    },
    {
      id: 'T06-S04', kind: 'worked-example', title: 'From gross to net',
      narrationText: 'Buy 2 DEMO at 200.00 and sell at 210.00. Gross is 20.00 USDT. With an illustrative 0.05 percent fee on each side, fees are 0.20 and 0.21, so net is 19.59 USDT.',
      blocks: [
        {
          kind: 'worked-example', title: '2 DEMO, 200.00 → 210.00 (fictional)', fictional: true,
          steps: [
            { text: 'Gross = (210.00 − 200.00) × 2', result: '+20.00 USDT' },
            { text: 'Entry fee = 400.00 × 0.05%', result: '0.20 USDT' },
            { text: 'Exit fee = 420.00 × 0.05%', result: '0.21 USDT' },
          ],
          conclusion: 'Net = 20.00 − 0.41 = +19.59 USDT.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T06-A04' },
      glossaryRefs: ['gross-pnl', 'net-pnl'],
    },
    {
      id: 'T06-S05', kind: 'risks-misunderstanding', title: 'Numbers that fool beginners',
      narrationText: 'An unrealized gain can vanish before you close. Fees are charged on both entry and exit, win or lose. A short loses when price rises. And a tiny gross gain can be a net loss.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Unrealized ≠ money kept', text: 'An open gain can shrink or flip to a loss before you close.' },
        { kind: 'callout', callout: 'safety', text: 'Fees are paid on **both** sides, win or lose. A small gross gain can be a **net loss**.' },
      ],
      glossaryRefs: ['unrealized-pnl', 'net-pnl'],
    },
    {
      id: 'T06-S06', kind: 'guided-practice', title: 'Move every control',
      narrationText: 'Now use the calculator. Change entry, exit, size, side and the fee rates one at a time and watch gross, fees and net respond. Find a case where gross is positive but net is negative.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Change one control at a time.', 'Switch LONG and SHORT.', 'Find a positive gross with a negative net.'] },
        { kind: 'callout', callout: 'tip', text: 'Fee rate 0.0005 means 0.05% per side (illustrative).' },
      ],
      glossaryRefs: ['gross-pnl', 'net-pnl'],
    },
    {
      id: 'T06-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Gross PnL comes from the price move times quantity, with the sign set by your side. Unrealized is open and moving; realized is closed and fixed. Net is what is left after fees.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Long: (exit − entry) × quantity.', 'Short: (entry − exit) × quantity.', 'Open = unrealized; closed = [[realized-pnl|realized]].', 'Net = gross − fees.'] },
      ],
      glossaryRefs: ['realized-pnl', 'gross-pnl'],
    },
  ],

  notesSections: [
    {
      id: 'T06-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'Every trade has an [[entry-price|entry price]] (where it opened), an [[exit-price|exit price]] (where it closed) and a [[quantity]]. The [[gross-pnl|gross PnL]] is the price move times the quantity, with a sign from your side. While the position is open its result is [[unrealized-pnl|unrealized]]; after closing it is [[realized-pnl|realized]]. Subtracting fees gives the [[net-pnl|net PnL]].' },
        { kind: 'analogy', text: 'Selling a house: the price an agent quotes today is “unrealized”. Only the sale price is real, and the agent’s fee comes out of it.' },
      ],
    },
    {
      id: 'T06-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Beginners often celebrate an open green number or forget that fees are paid twice, once to open and once to close. On small, fast trades the fees can be bigger than the price move. Knowing the exact formula lets you check any screen yourself instead of trusting a colour.' },
      ],
    },
    {
      id: 'T06-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: spot buy and sell (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Buy 2 DEMO at 200.00 USDT. Entry notional = 200.00 × 2', result: '400.00 USDT' },
            { text: 'Sell at 210.00 USDT. Gross = (210.00 − 200.00) × 2', result: '+20.00 USDT' },
            { text: 'Percent return = 20.00 ÷ 400.00 × 100', result: '+5%' },
            { text: 'Fees at an illustrative 0.05% per side: 0.20 + 0.21', result: '0.41 USDT' },
          ],
          conclusion: 'Net = 20.00 − 0.41 = +19.59 USDT.',
        },
        {
          kind: 'worked-example', title: 'Example 2: futures long and short, 3 DEMO from 150.00 to 146.00 (fictional)', fictional: true,
          steps: [
            { text: 'Long: (146.00 − 150.00) × 3', result: '−12.00 USDT gross' },
            { text: 'Fees: 450.00 × 0.05% = 0.225 and 438.00 × 0.05% = 0.219' },
            { text: 'Long net = −12.00 − 0.444', result: '−12.444 USDT' },
            { text: 'Short: (150.00 − 146.00) × 3 = +12.00 gross; net = 12.00 − 0.444', result: '+11.556 USDT' },
          ],
          conclusion: 'Fees make a loss bigger and a gain smaller. Funding (a futures cost covered later) is excluded here.',
        },
        {
          kind: 'formula', expression: 'gross PnL = (exit − entry) × quantity (long or spot); (entry − exit) × quantity (short); net PnL = gross − entry fee − exit fee', formulaId: 'T06-F02',
          variables: [
            { symbol: 'entry, exit', meaning: 'opening and closing fill prices', unit: 'USDT per DEMO' },
            { symbol: 'quantity', meaning: 'position size', unit: 'DEMO' },
            { symbol: 'fee', meaning: 'that side’s notional × fee rate', unit: 'USDT' },
          ],
          note: 'Simplified linear USDT-margined model: funding, spread and slippage excluded.',
        },
      ],
    },
    {
      id: 'T06-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Is the position still open? Then its PnL is unrealized. Futures screens usually value it with the [[mark-price|mark price]], a fair reference price that can differ slightly from the last trade.',
          'Has it been closed (fully or by a [[partial-close|partial close]])? The closed part is realized and fixed.',
          'Check whether a number is gross or net: does it include fees?',
          'Ask “percent of what?” when you see a [[percent-return|percent return]].',
        ] },
      ],
    },
    {
      id: 'T06-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Counting unrealized gains as money kept', text: 'Until you close, the number can shrink or flip sign.' },
        { kind: 'callout', callout: 'mistake', title: 'Forgetting the exit fee', text: 'Fees are charged on entry and on exit, each on that side’s notional.' },
        { kind: 'callout', callout: 'mistake', title: 'Using the long formula for a short', text: 'For a short, subtract the exit from the entry. A rise is a loss.' },
      ],
    },
    {
      id: 'T06-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Costs are certain; profits are not. A small gross gain can become a net loss after fees. Check your own exchange’s current fee rates before acting; the rates here are illustrative. Not trading is always a valid choice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T06-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'PnL words in one table', headers: ['Word', 'Meaning'], rows: [
          ['Gross', 'price move × quantity, before costs'],
          ['Net', 'gross − entry fee − exit fee'],
          ['Unrealized', 'open; moves with the mark price'],
          ['Realized', 'closed; fixed'],
        ] },
      ],
    },
    {
      id: 'T06-N08', heading: 'learn-more', title: 'Learn more: why futures use a mark price', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'On one market a single large order can briefly push the last traded price far away from the price everywhere else. If open positions were valued with that one trade, results would jump around unfairly. Exchanges therefore calculate a mark price, usually from an index of several markets, and use it for unrealized PnL. Your realized result still comes from your real fill prices. Methods differ between exchanges, so read your exchange’s own description.' },
        { kind: 'paragraph', text: 'Fees on futures are charged on notional (price × quantity), not on the deposit you put up. Later lessons add funding payments and show how a deposit with borrowed exposure changes the percentage you see.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T06-A01', type: 'price-path', durationMs: 25_000,
      parameters: { variant: 'plain', points: T06_PATH, markers: [{ index: 0, label: 'Entry 200.00' }, { index: 8, label: 'Exit 210.00' }] },
      caption: 'An entry marker is set at 200.00; the price wanders 203.00, 202.00, 205.00, 203.50 and the exit marker lands at 210.00.',
      narration: 'Entry is where the trade opens. Exit is where it closes. Everything in between changes only the unrealized number.',
      reducedMotionDescription: 'Fictional DEMO/USDT path: 200.00 (entry), 201.50, 203.00, 202.00, 204.00, 205.00, 203.50, 207.00, 210.00 (exit).',
      glossaryRefs: ['entry-price', 'exit-price'],
    },
    {
      id: 'T06-A02', type: 'pnl-meter', durationMs: 25_000,
      parameters: { variant: 'single-position', path: T06_PATH, entry: 200, quantity: 2, side: 'long', unit: 'USDT' },
      caption: 'Open long of 2 DEMO from 200.00: the unrealized PnL rises, dips and rises again, reaching +20.00 USDT at 210.00.',
      narration: 'While open, the meter follows every move. It went from +10.00 down to +7.00 and up again: none of it is locked in.',
      reducedMotionDescription: 'Long 2 DEMO from 200.00, still open. Unrealized PnL: +3.00, +6.00, +4.00, +8.00, +10.00, +7.00, +14.00, +20.00 USDT as price moves to 210.00.',
      glossaryRefs: ['unrealized-pnl'],
    },
    {
      id: 'T06-A03', type: 'pnl-meter', durationMs: 25_000,
      parameters: { variant: 'single-position', path: T06_PATH, entry: 200, quantity: 2, side: 'long', exitIndex: 4, unit: 'USDT' },
      caption: 'This time the long is closed at 204.00: the meter switches from unrealized to realized and freezes at +8.00 USDT.',
      narration: 'After the exit, the price can do anything; the closed result stays the same.',
      reducedMotionDescription: 'Long 2 DEMO from 200.00, closed at 204.00. Realized gross PnL fixed at +8.00 USDT. Later price moves no longer change it.',
      glossaryRefs: ['realized-pnl', 'exit-price'],
    },
    {
      id: 'T06-A04', type: 'fee-buildup', durationMs: 25_000,
      parameters: { variant: 'gross-to-net', entry: 200, exit: 210, quantity: 2, side: 'long', entryFeeRate: 0.0005, exitFeeRate: 0.0005 },
      caption: 'Gross +20.00 USDT, then the entry fee (0.20) and exit fee (0.21) are taken off: net +19.59 USDT.',
      narration: 'Each fee is that side’s notional times the illustrative 0.05 percent rate.',
      reducedMotionDescription: 'Bars step down from gross +20.00 USDT, minus entry fee 0.20 USDT (on 400.00 notional), minus exit fee 0.21 USDT (on 420.00 notional), to net +19.59 USDT.',
      glossaryRefs: ['gross-pnl', 'net-pnl'],
    },
    {
      id: 'T06-A05', type: 'pnl-meter', durationMs: 25_000,
      parameters: { variant: 'single-position', path: T06_DOWN_PATH, entry: 150, quantity: 3, side: 'long', exitIndex: 5, unit: 'USDT' },
      caption: 'A losing long: 3 DEMO from 150.00, closed at 146.00. Realized gross PnL −12.00 USDT.',
      narration: 'The same formula gives a negative number when the exit is below the entry for a long.',
      reducedMotionDescription: 'Long 3 DEMO from 150.00. Price goes 149, 151, 148, 147, 146 and the long is closed at 146.00: realized −12.00 USDT before fees.',
      glossaryRefs: ['realized-pnl'],
    },
    {
      id: 'T06-A06', type: 'pnl-meter', durationMs: 25_000,
      parameters: { variant: 'single-position', path: T06_DOWN_PATH, entry: 150, quantity: 3, side: 'short', exitIndex: 5, unit: 'USDT' },
      caption: 'Same path, short side: 3 DEMO from 150.00, closed at 146.00. Realized gross PnL +12.00 USDT.',
      narration: 'For a short the formula is entry minus exit, so the fall becomes a gain.',
      reducedMotionDescription: 'Short 3 DEMO from 150.00 on the same path, closed at 146.00: realized +12.00 USDT before fees.',
      glossaryRefs: ['short-position'],
    },
    {
      id: 'T06-A07', type: 'fee-buildup', durationMs: 25_000,
      parameters: { variant: 'waterfall', entry: 150, exit: 146, quantity: 3, side: 'long', entryFeeRate: 0.0005, exitFeeRate: 0.0005 },
      caption: 'Fees deepen the loss: gross −12.00 USDT, entry fee 0.225, exit fee 0.219, net −12.444 USDT.',
      narration: 'Fees are charged whether the trade wins or loses.',
      reducedMotionDescription: 'Waterfall for the losing long: gross −12.00 USDT, minus entry fee 0.225 USDT (on 450.00 notional), minus exit fee 0.219 USDT (on 438.00 notional), net −12.444 USDT.',
      glossaryRefs: ['net-pnl'],
    },
    {
      id: 'T06-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Reading any PnL number', items: ['Open or closed? Unrealized or realized.', 'Long or short? Pick the right formula.', 'Gross or net? Were both fees taken off?', 'Percent of what? Check the notional.'] },
      caption: 'A four-question check appears line by line for any PnL figure on any screen.',
      reducedMotionDescription: 'Checklist: is the position open or closed; is it long or short; is the number gross or net; a percentage of what amount.',
    },
  ],

  exercises: [
    {
      id: 'T06-X01', type: 'slider-explore', title: 'PnL and fee calculator',
      fixtureId: 'FX-T06-FEES-01', simulatorId: 'fees.net',
      instructions: 'Change entry price (USDT per DEMO), exit price (USDT per DEMO), quantity (DEMO), side and both fee rates one at a time. Watch gross PnL, each fee and net PnL (all in USDT). Then try to make gross positive but net negative.',
      steps: [
        { id: 'T06-X01-01', prompt: 'Move exit above entry, then below it. Switch LONG and SHORT and see the gross sign flip.', hint: 'Long gains when exit is above entry; short gains when exit is below entry.' },
        { id: 'T06-X01-02', prompt: 'Double the quantity and see gross and both fees double.', hint: 'Every number is multiplied by quantity.' },
        { id: 'T06-X01-03', prompt: 'Set exit only 0.10 above entry on a long and raise the fee rates: find a negative net.', hint: 'With 2 DEMO near 200.00 and 0.0005 per side, fees are about 0.40 USDT, more than a 0.20 gross gain.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'choice', 'reset', 'hint'],
      parameters: {
        sideToggle: true,
        side: 'long',
        sliders: [
          { key: 'entry', label: 'Entry price', min: 100, max: 300, step: 0.1, value: 200, unit: 'USDT per DEMO' },
          { key: 'exit', label: 'Exit price', min: 100, max: 300, step: 0.1, value: 210, unit: 'USDT per DEMO' },
          { key: 'quantity', label: 'Quantity', min: 0.5, max: 10, step: 0.5, value: 2, unit: 'DEMO' },
          { key: 'entryFeeRate', label: 'Entry fee rate (0.0005 = 0.05%)', min: 0, max: 0.001, step: 0.0001, value: 0.0005, unit: 'per side' },
          { key: 'exitFeeRate', label: 'Exit fee rate (0.0005 = 0.05%)', min: 0, max: 0.001, step: 0.0001, value: 0.0005, unit: 'per side' },
        ],
        outputs: [
          { key: 'grossPnl', label: 'Gross PnL', unit: 'USDT', decimals: 3 },
          { key: 'entryFee', label: 'Entry fee', unit: 'USDT', decimals: 4 },
          { key: 'exitFee', label: 'Exit fee', unit: 'USDT', decimals: 4 },
          { key: 'netPnl', label: 'Net PnL', unit: 'USDT', decimals: 4 },
        ],
        note: 'Illustrative fee rates (0.05% taker, 0.02% maker per side) vary by exchange and account. Funding, spread and slippage are excluded. Fictional prices.',
      },
      expectedEvaluation: { kind: 'constraint', simulatorId: 'fees.net', description: 'Learner moves every control at least once; the simulator recomputes gross = side × (exit − entry) × quantity and net = gross − entry notional × entry fee rate − exit notional × exit fee rate.' },
      explanation: 'Gross depends on side, price move and quantity. Fees depend on notional and rate, and are charged on both sides whether the trade wins or loses. That is why a very small gross gain can be a net loss.',
      fictionalDataLabel: 'Fictional DEMO/USDT prices and illustrative fee rates for practice only.',
    },
    {
      id: 'T06-X02', type: 'numeric-calculator', title: 'A losing short, gross and net',
      fixtureId: 'FX-T06-FEES-01',
      instructions: 'A fictional futures short of 4 DEMO opens at 250.00 USDT and is closed at 255.00 USDT. Fee rate 0.05% per side (illustrative). Funding excluded. Work out each value in USDT to 2 decimals, with a minus sign for a loss.',
      steps: [
        { id: 'T06-X02-01', prompt: 'Gross PnL of the short.', hint: '(entry − exit) × quantity = (250.00 − 255.00) × 4.' },
        { id: 'T06-X02-02', prompt: 'Entry fee and exit fee.', hint: 'Entry: 250.00 × 4 × 0.0005. Exit: 255.00 × 4 × 0.0005.' },
        { id: 'T06-X02-03', prompt: 'Net PnL = gross − entry fee − exit fee.', hint: '−20.00 − 0.50 − 0.51.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: { given: [
        { label: 'Side', value: -1, unit: 'short (−1)' },
        { label: 'Entry price', value: 250, unit: 'USDT per DEMO', decimals: 2 },
        { label: 'Exit price', value: 255, unit: 'USDT per DEMO', decimals: 2 },
        { label: 'Quantity', value: 4, unit: 'DEMO' },
        { label: 'Fee rate per side', value: 0.0005, unit: '(0.05%, illustrative)', decimals: 4 },
      ] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'grossPnl', label: 'Gross PnL', value: -20, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'entryFee', label: 'Entry fee', value: 0.5, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'exitFee', label: 'Exit fee', value: 0.51, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'netPnl', label: 'Net PnL', value: -21.01, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      ] },
      explanation: 'Price rose 5.00, which hurts a short: (250.00 − 255.00) × 4 = −20.00 USDT gross. Fees 0.50 + 0.51 = 1.01 USDT make it −21.01 USDT net.',
      fictionalDataLabel: 'Fictional DEMO/USDT prices and illustrative fee rate for practice only.',
    },
    {
      id: 'T06-X03', type: 'classify', title: 'Realized or unrealized?',
      fixtureId: 'FX-T06-STATES-01',
      instructions: 'Decide whether each fictional result is realized (fixed, because that quantity was closed) or unrealized (still open and still changing).',
      steps: [
        { id: 'T06-X03-01', prompt: 'For each line, ask: has this quantity been closed?', hint: 'Closed → realized. Still open → unrealized.' },
        { id: 'T06-X03-02', prompt: 'Sort all six, then press Check.', hint: 'In a partial close, the closed part and the open part go to different groups.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'open-long', text: 'Long 2 DEMO from 200.00, still open, mark price 205.00: +10.00 USDT' },
          { id: 'closed-short', text: 'Short 3 DEMO from 150.00, closed at 146.00: +12.00 USDT' },
          { id: 'partial-closed-part', text: 'Long 4 DEMO from 50.00: the 2 DEMO sold at 55.00 → +10.00 USDT' },
          { id: 'partial-open-part', text: 'Same long: the other 2 DEMO, still open, mark price 52.00 → +4.00 USDT' },
          { id: 'mark-view', text: 'Futures screen shows +6.00 USDT “PnL (mark price)” on an open short' },
          { id: 'sold-spot', text: 'Spot: bought 1 DEMO at 120.00, sold at 118.00 → −2.00 USDT' },
        ],
        buckets: [
          { id: 'realized', label: 'Realized (closed, fixed)' },
          { id: 'unrealized', label: 'Unrealized (open, changing)' },
        ],
        itemFeedback: {
          'open-long': 'The position is still open, so the +10.00 USDT can still change.',
          'closed-short': 'It was closed at 146.00, so +12.00 USDT is fixed.',
          'partial-closed-part': 'These 2 DEMO were sold, so their +10.00 USDT is realized.',
          'partial-open-part': 'These 2 DEMO are still open, valued with the mark price: unrealized.',
          'mark-view': 'A number valued with the mark price on an open position is unrealized.',
          'sold-spot': 'The coin was sold, so the −2.00 USDT loss is realized. Losses are realized too.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { realized: ['closed-short', 'partial-closed-part', 'sold-spot'], unrealized: ['open-long', 'partial-open-part', 'mark-view'] } },
      explanation: 'Closing fixes a result, whether gain or loss. Anything still open, often valued with the mark price, remains unrealized and can change.',
      fictionalDataLabel: 'Fictional DEMO/USDT results for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T06-F01', name: 'Gross PnL (linear: spot, USDT-margined futures long and short)',
      expression: 'long or spot: (exit − entry) × quantity; short: (entry − exit) × quantity; percent return = gross ÷ (entry × quantity) × 100',
      variables: [
        { symbol: 'entry, exit', meaning: 'opening and closing fill prices (or mark price for an open position)', unit: 'USDT per DEMO' },
        { symbol: 'quantity', meaning: 'position size', unit: 'DEMO' },
      ],
      simulatorId: 'pnl.linear', approximate: false,
      workedExamples: [
        { label: 'Spot buy and sell (notes example 1)', side: 'long', inputs: { entry: 200, exit: 210, quantity: 2 }, outputs: { grossPnl: 20, percentMove: 5, entryNotional: 400 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees excluded'] },
        { label: 'Losing futures long (notes example 2)', side: 'long', inputs: { entry: 150, exit: 146, quantity: 3 }, outputs: { grossPnl: -12, entryNotional: 450 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees and funding excluded'] },
        { label: 'Winning futures short (notes example 2)', side: 'short', inputs: { entry: 150, exit: 146, quantity: 3 }, outputs: { grossPnl: 12 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees and funding excluded'] },
        { label: 'Closed at 204 (scene T06-A03)', side: 'long', inputs: { entry: 200, exit: 204, quantity: 2 }, outputs: { grossPnl: 8 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Partial close, closed part (exercise T06-X03)', side: 'long', inputs: { entry: 50, exit: 55, quantity: 2 }, outputs: { grossPnl: 10 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Partial close, open part at mark 52 (exercise T06-X03)', side: 'long', inputs: { entry: 50, exit: 52, quantity: 2 }, outputs: { grossPnl: 4 }, tolerance: 1e-9, assumptions: ['fictional data', 'valued at mark price'] },
        { label: 'Quiz T06-Q01', side: 'long', inputs: { entry: 120, exit: 126, quantity: 0.5 }, outputs: { grossPnl: 3 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Quiz T06-Q04', side: 'short', inputs: { entry: 300, exit: 306, quantity: 2 }, outputs: { grossPnl: -12 }, tolerance: 1e-9, assumptions: ['fictional data'] },
      ],
    },
    {
      id: 'T06-F02', name: 'Net PnL after entry and exit fees',
      expression: 'net = gross − entry × quantity × entry fee rate − exit × quantity × exit fee rate',
      variables: [
        { symbol: 'entry, exit', meaning: 'opening and closing fill prices', unit: 'USDT per DEMO' },
        { symbol: 'quantity', meaning: 'position size', unit: 'DEMO' },
        { symbol: 'fee rate', meaning: 'illustrative 0.0005 (0.05%) per side', unit: 'fraction' },
      ],
      simulatorId: 'fees.net', approximate: false,
      workedExamples: [
        { label: 'Spot trade (notes example 1)', side: 'long', inputs: { entry: 200, exit: 210, quantity: 2, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }, outputs: { grossPnl: 20, entryFee: 0.2, exitFee: 0.21, totalCosts: 0.41, netPnl: 19.59 }, tolerance: 1e-9, assumptions: ['illustrative 0.05% fee per side', 'funding excluded'] },
        { label: 'Losing long (notes example 2)', side: 'long', inputs: { entry: 150, exit: 146, quantity: 3, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }, outputs: { entryFee: 0.225, exitFee: 0.219, totalCosts: 0.444, netPnl: -12.444 }, tolerance: 1e-9, assumptions: ['illustrative 0.05% fee per side', 'funding excluded'] },
        { label: 'Winning short (notes example 2)', side: 'short', inputs: { entry: 150, exit: 146, quantity: 3, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }, outputs: { netPnl: 11.556 }, tolerance: 1e-9, assumptions: ['illustrative 0.05% fee per side', 'funding excluded'] },
        { label: 'Losing short (exercise T06-X02)', side: 'short', inputs: { entry: 250, exit: 255, quantity: 4, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }, outputs: { grossPnl: -20, entryFee: 0.5, exitFee: 0.51, netPnl: -21.01 }, tolerance: 1e-9, assumptions: ['illustrative 0.05% fee per side', 'funding excluded'] },
        { label: 'Gross winner, net loser (quiz T06-Q03)', side: 'long', inputs: { entry: 100, exit: 100.08, quantity: 10, entryFeeRate: 0.0005, exitFeeRate: 0.0005 }, outputs: { grossPnl: 0.8, entryFee: 0.5, exitFee: 0.5004, netPnl: -0.2004 }, tolerance: 1e-9, assumptions: ['illustrative 0.05% fee per side', 'funding excluded'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T06-Q01', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T06',
      prompt: 'You buy 0.5 DEMO on spot at 120.00 USDT and sell at 126.00 USDT (fictional). What is the gross PnL in USDT, before fees?',
      answer: { kind: 'numeric', value: 3, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Gross = (exit − entry) × quantity = (126.00 − 120.00) × 0.5 = 3.00 USDT.',
      learningOutcome: 'Calculate spot gross PnL from entry, exit and quantity.',
      remediationRef: { lessonId: 'T06', anchorId: 'T06-N03' },
    },
    {
      id: 'T06-Q02', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T06',
      prompt: 'Your open futures long shows “+15.00 USDT” next to the words “mark price”. What does that number mean?',
      choices: [
        { id: 'a', text: 'It is unrealized: an estimate at the mark price that can still change until you close.' },
        { id: 'b', text: 'It is realized: 15.00 USDT is already locked in your balance.' },
        { id: 'c', text: 'It is the net result after all fees.' },
        { id: 'd', text: 'It is the price your closing order is guaranteed to fill at.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'An open position’s PnL is unrealized. Futures screens usually value it with the mark price, a fair reference price, so it keeps moving.',
      misconceptionFeedback: {
        b: 'Only closing realizes a result. While open, +15.00 can shrink or turn negative.',
        c: 'An open PnL usually does not include the exit fee you have not paid yet. Check whether a number is gross or net.',
        d: 'The mark price is a valuation reference. Your order fills against the order book, which can differ.',
      },
      learningOutcome: 'Interpret an open position’s PnL as unrealized and valued at the mark price.',
      remediationRef: { lessonId: 'T06', anchorId: 'T06-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T06-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T06', safetyCritical: true, safetyTopic: 'fees-costs',
      prompt: 'A fictional long of 10 DEMO opens at 100.00 and closes at 100.08 USDT: gross +0.80 USDT. With an illustrative 0.05% fee per side (0.50 + 0.5004 USDT), what is true?',
      choices: [
        { id: 'a', text: 'Net is −0.2004 USDT: the trade was a gross winner but a net loser.' },
        { id: 'b', text: 'Net is +0.80 USDT, because fees only apply to losing trades.' },
        { id: 'c', text: 'Net is +0.30 USDT, because only the entry fee counts.' },
        { id: 'd', text: 'Fees are too small to matter on any trade.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Net = 0.80 − 0.50 − 0.5004 = −0.2004 USDT. Both fees are charged on notional, win or lose; on a tiny move they can exceed the gross gain.',
      misconceptionFeedback: {
        b: 'Fees are charged on every trade, winning or losing.',
        c: 'Closing is a second trade with its own fee. Both sides are charged.',
        d: 'On small price moves, fees can be bigger than the gain, as this example shows.',
      },
      learningOutcome: 'Recognise that fees on both sides can turn a gross gain into a net loss.',
      remediationRef: { lessonId: 'T06', anchorId: 'T06-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T06-Q04', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T06',
      prompt: 'A fictional USDT-margined futures short of 2 DEMO opens at 300.00 and closes at 306.00 USDT. What is the gross PnL in USDT? (Minus sign for a loss; fees and funding excluded.)',
      answer: { kind: 'numeric', value: -12, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Short gross = (entry − exit) × quantity = (300.00 − 306.00) × 2 = −12.00 USDT.',
      learningOutcome: 'Apply the short formula and keep the sign.',
      remediationRef: { lessonId: 'T06', anchorId: 'T06-N03' },
    },
    {
      id: 'T06-Q05', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T06',
      prompt: 'Long 4 DEMO from 50.00 (fictional). You close 2 DEMO at 55.00. The mark price is now 52.00. Which description is correct (gross, before fees)?',
      choices: [
        { id: 'a', text: 'Realized +10.00 USDT on the closed 2 DEMO; unrealized +4.00 USDT on the 2 DEMO still open.' },
        { id: 'b', text: 'Realized +20.00 USDT on all 4 DEMO.' },
        { id: 'c', text: 'Unrealized +12.00 USDT on all 4 DEMO.' },
        { id: 'd', text: 'Nothing is realized until the whole position is closed.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Closed part: (55.00 − 50.00) × 2 = +10.00 realized. Open part at the mark price: (52.00 − 50.00) × 2 = +4.00 unrealized.',
      misconceptionFeedback: {
        b: 'Only 2 DEMO were closed, and they were closed at 55.00. The other 2 are still open.',
        c: 'The 2 DEMO sold at 55.00 are closed, so their result is realized, not unrealized.',
        d: 'A partial close realizes the result of the part you closed.',
      },
      learningOutcome: 'Split a partial close into realized and unrealized parts.',
      remediationRef: { lessonId: 'T06', anchorId: 'T06-N04' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Treating an open (unrealized) gain as money already earned.', correction: 'Only closing realizes a result; until then it can shrink or flip.' },
    { mistake: 'Subtracting only the entry fee, or none at all.', correction: 'Net = gross − entry fee − exit fee, each on that side’s notional.' },
    { mistake: 'Using (exit − entry) for a short.', correction: 'A short uses (entry − exit) × quantity, so a rise is a loss.' },
  ],
  takeaways: [
    'Gross PnL = price move × quantity, with the sign set by long or short.',
    'Open positions show unrealized PnL (usually at the mark price); closing makes it realized and fixed.',
    'Net = gross − fees on both sides; a small gross gain can be a net loss.',
  ],
  reviewCard: {
    keyTermIds: ['unrealized-pnl', 'realized-pnl', 'net-pnl'],
    safetyNote: 'Fees are paid on entry and exit, win or lose. Rates here are illustrative; check your own exchange before acting.',
    reviewMinutes: 3,
    retrievalQuestion: 'A short of 2 DEMO opens at 100.00 and closes at 97.00. What is the gross PnL, and what changes when you subtract fees?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T06-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
