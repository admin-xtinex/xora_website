import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices, balances and moves in this lesson are fictional DEMO/USDT examples made for teaching, using a simplified linear contract. They are not real market data, and real exchange rules, fees and funding differ.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can calculate notional exposure from margin and leverage (notional ≈ margin × leverage).',
    'Learner can calculate gross PnL and return on margin for a long or short after a signed percentage move, and explain that leverage magnifies both gains and losses.',
    'Learner can explain the difference between isolated and cross margin in terms of how much of the wallet balance is at risk.',
  ],
  glossaryEntries,
  notesComplexity: 'complex-risk',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T12-S01', kind: 'cover-problem', title: 'A small deposit, a big position',
      narrationText: 'On futures you do not pay the full position size. You put down a deposit, called margin, and the exchange lets you hold a larger position. That larger size is exactly what makes both gains and losses bigger compared with your deposit.',
      blocks: [
        { kind: 'paragraph', text: 'On futures you put down a deposit called [[margin]]. It can control a position much **bigger** than itself.' },
        { kind: 'paragraph', text: 'That is why gains **and losses** grow faster than your deposit.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T12-A01' },
      glossaryRefs: ['margin', 'exposure'],
      speakerNotes: 'Connect to T11: the futures deposit there was 20 USDT for 100 USDT of exposure. This lesson names that relationship.',
    },
    {
      id: 'T12-S02', kind: 'key-definition', title: 'Margin, leverage, notional',
      narrationText: 'Initial margin is the deposit needed to open. Leverage is how many times bigger the position is than the margin. Notional exposure is roughly margin times leverage.',
      blocks: [
        { kind: 'definition', termId: 'leverage' },
        { kind: 'formula', expression: 'notional ≈ initial margin × leverage', variables: [
          { symbol: 'initial margin', meaning: 'deposit to open', unit: 'USDT' },
          { symbol: 'leverage', meaning: 'multiplier', unit: '×' },
        ] },
      ],
      glossaryRefs: ['initial-margin', 'leverage', 'notional-value'],
    },
    {
      id: 'T12-S03', kind: 'visual-breakdown', title: 'Same move, three leverages',
      narrationText: 'Take 100 USDT of margin and a 5 percent price rise. At 1x the gain is 5 USDT, 5 percent of margin. At 3x it is 15 USDT. At 10x it is 50 USDT. Reverse the move and every number becomes a loss of the same size.',
      blocks: [
        { kind: 'table', caption: '100 USDT margin, long, fictional +5% move', headers: ['Leverage', 'Notional', 'Return on margin'], rows: [
          ['1×', '100 USDT', '+5%'],
          ['3×', '300 USDT', '+15%'],
          ['10×', '1,000 USDT', '+50%'],
        ] },
        { kind: 'paragraph', text: 'A −5% move gives −5%, −15% and −50%.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T12-A02' },
      glossaryRefs: ['return-on-margin'],
    },
    {
      id: 'T12-S04', kind: 'worked-example', title: 'A short that goes wrong',
      narrationText: 'You short with 50 USDT of margin at 10x. Notional is 500 USDT. The price rises 4 percent. For a short that is a loss: 500 times 4 percent is 20 USDT, which is 40 percent of the margin.',
      blocks: [
        {
          kind: 'worked-example', title: 'Fictional DEMOUSDT short, 10×', fictional: true,
          steps: [
            { text: 'Notional = 50 × 10', result: '500.00 USDT' },
            { text: 'Gross PnL = 500 × (−4%) for a short', result: '−20.00 USDT' },
            { text: 'Return on margin = −20 ÷ 50', result: '−40%' },
          ],
          conclusion: 'A 4% move against you cost 40% of the margin.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T12-A05' },
      glossaryRefs: ['short-position', 'gross-pnl'],
    },
    {
      id: 'T12-S05', kind: 'risks-misunderstanding', title: 'There is no safe leverage',
      narrationText: 'A common mistake is to believe some leverage number is safe. None is. Leverage magnifies losses as much as gains, and the exchange can close a position before the margin reaches zero, depending on its rules and costs. Cross margin can also put your whole balance at risk.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: '“Low leverage is safe”', text: 'Any leverage magnifies losses. Risk also depends on size, price moves and exchange rules.' },
        { kind: 'callout', callout: 'safety', text: 'Forced closure can happen **before** margin hits zero. Not trading is always allowed.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T12-A08' },
      glossaryRefs: ['leverage', 'cross-margin'],
    },
    {
      id: 'T12-S06', kind: 'guided-practice', title: 'Move the sliders',
      narrationText: 'Now explore. Change margin, leverage and the price move, and switch between long and short. Watch notional, gross PnL and return on margin. Try the same move up and down.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Raise leverage: watch notional grow.', 'Set a + move, then the same − move.', 'Switch long and short and compare.'] },
        { kind: 'callout', callout: 'tip', text: 'Return on margin ≈ leverage × signed move.' },
      ],
      glossaryRefs: ['return-on-margin', 'leverage'],
    },
    {
      id: 'T12-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Notional is about margin times leverage. Gross PnL is notional times the signed move. Leverage magnifies return on margin in both directions. Isolated limits loss to one position’s margin; cross can use the whole balance.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Notional ≈ margin × leverage.', 'Gross PnL ≈ notional × signed % move.', 'Leverage magnifies gains AND losses.', 'Isolated: one position’s margin. Cross: whole balance.'] },
      ],
      glossaryRefs: ['isolated-margin', 'cross-margin'],
    },
  ],

  notesSections: [
    {
      id: 'T12-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: '[[margin|Margin]] is the deposit you lock to hold a futures position. The deposit needed to open it is the [[initial-margin|initial margin]]. [[leverage|Leverage]] is how many times larger the position’s [[notional-value|notional value]] (its [[exposure]]) is than the margin. In a simplified linear contract: notional ≈ margin × leverage, and gross PnL ≈ notional × signed percentage move. Your [[return-on-margin|return on margin]] is that PnL divided by the margin, so it is roughly leverage × the price move.' },
        { kind: 'analogy', text: 'Leverage is like a magnifying glass held over your deposit. It makes every price move look bigger on your money, the good moves and the bad moves alike. It does not change which way the price goes.' },
      ],
    },
    {
      id: 'T12-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Futures screens, for example on Binance, let you pick a leverage number with a slider. It looks like a small setting, but it decides how fast your margin can disappear. At high leverage a normal, everyday price move can wipe out a large part of the margin. Fees and [[funding-rate|funding]] are also charged on the notional, not on the margin, so higher leverage means higher costs per USDT of deposit.' },
        { kind: 'paragraph', text: 'You also choose a margin mode. With [[isolated-margin|isolated margin]], only the margin assigned to that position is at risk. With [[cross-margin|cross margin]], a losing position can use your whole available balance, so your [[account-equity|account equity]] (wallet balance plus [[unrealized-pnl|unrealized PnL]]) is what absorbs the loss.' },
      ],
    },
    {
      id: 'T12-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: 100 USDT margin, long, same move at 1×, 3× and 10× (fictional)', fictional: true,
          steps: [
            { text: '1×: notional 100.00 USDT. +5% move: 100 × 5% = +5.00 USDT', result: '+5% on margin' },
            { text: '3×: notional 300.00 USDT. +5% move: 300 × 5% = +15.00 USDT', result: '+15% on margin' },
            { text: '10×: notional 1,000.00 USDT. +5% move: 1,000 × 5% = +50.00 USDT', result: '+50% on margin' },
            { text: '10× with a −5% move: 1,000 × (−5%) = −50.00 USDT', result: '−50% on margin' },
          ],
          conclusion: 'The price moved 5% in every case. Only the effect on the margin changed, and it changed by the same factor for gains and losses.',
        },
        {
          kind: 'worked-example', title: 'Example 2: a short at 10× (fictional)', fictional: true,
          steps: [
            { text: 'Margin 50.00 USDT × 10 = notional 500.00 USDT.' },
            { text: 'Price rises 4%. For a short the signed move is −4%.' },
            { text: 'Gross PnL = 500 × (−4%)', result: '−20.00 USDT' },
            { text: 'Return on margin = −20 ÷ 50 × 100', result: '−40%' },
          ],
          conclusion: 'If the price had fallen 4% instead, the same short would show +20.00 USDT, or +40%.',
        },
        {
          kind: 'formula', expression: 'notional ≈ margin × leverage; gross PnL ≈ notional × signed move %; return on margin % = gross PnL ÷ margin × 100',
          variables: [
            { symbol: 'margin', meaning: 'deposit locked for the position', unit: 'USDT' },
            { symbol: 'leverage', meaning: 'notional ÷ margin', unit: '×' },
            { symbol: 'signed move %', meaning: 'price change in %, with the sign flipped for a short', unit: '%' },
          ],
        },
      ],
    },
    {
      id: 'T12-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Find the leverage setting (for example “3×” or “10×”) next to the order entry.',
          'Find the margin mode label: isolated or cross.',
          'Compare position size (notional) with the margin shown for the position: their ratio is the leverage.',
          'Check return on margin: if it is several times the price move, leverage is at work.',
        ] },
      ],
    },
    {
      id: 'T12-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Seeing only the upside', text: 'If 10× turns +5% into +50%, it also turns −5% into −50%.' },
        { kind: 'callout', callout: 'mistake', title: 'Thinking a certain leverage is safe', text: 'No leverage number is safe. Losses depend on size, how far price moves, costs and the exchange’s closure rules.' },
        { kind: 'callout', callout: 'mistake', title: 'Assuming cross margin limits the loss', text: 'In cross mode a losing position can use your whole available balance.' },
      ],
    },
    {
      id: 'T12-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'The exchange can close a position before its margin reaches zero. The exact point depends on that exchange’s rules, a smaller “maintenance” requirement, fees and price gaps; lesson T13 explains this. This lesson does not give a liquidation price or a recommended leverage. Waiting or not trading is always a valid choice.' },
        { kind: 'callout', callout: 'approximation', text: 'All formulas here use a simplified linear contract and ignore fees, funding and closure rules.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T12-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Margin and leverage in one table (simplified)', headers: ['Idea', 'Formula or rule'], rows: [
          ['Notional', 'margin × leverage'],
          ['Gross PnL', 'notional × signed % move'],
          ['Return on margin', 'gross PnL ÷ margin ≈ leverage × move'],
          ['Isolated', 'only that position’s margin at risk'],
          ['Cross', 'whole available balance can be used'],
          ['Equity', 'wallet balance + unrealized PnL'],
        ] },
      ],
    },
    {
      id: 'T12-N08', heading: 'learn-more', title: 'Learn more: why “linear” and why fees grow with leverage', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'A USDT-margined contract is called linear because its PnL changes in a straight line with price: each 1 USDT move in DEMO changes the PnL of a 1-DEMO position by exactly 1 USDT. Other contract types (for example coin-margined ones) behave differently and are not covered here. Because trading fees and funding are charged on notional, a 10× position pays ten times the fees of a 1× position with the same margin. With an illustrative 0.05% taker fee per side, a 1,000 USDT notional pays about 0.50 USDT to open and 0.50 USDT to close, which is 1% of a 100 USDT margin before the price even moves.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T12-A01', type: 'leverage-exposure', durationMs: 30_000,
      parameters: { variant: 'exposure-bars', margin: 100, leverages: [1, 3, 10] },
      caption: 'The same 100.00 USDT margin grows into 100.00, 300.00 and 1,000.00 USDT of notional exposure at 1×, 3× and 10×.',
      narration: 'The deposit does not change. Only the size of the position it controls changes.',
      reducedMotionDescription: 'Three bars grow one after another from the same 100.00 USDT margin: 1× leverage gives 100.00 USDT notional, 3× gives 300.00 USDT, 10× gives 1,000.00 USDT. Notional ≈ margin × leverage.',
      glossaryRefs: ['margin', 'leverage', 'notional-value'],
    },
    {
      id: 'T12-A02', type: 'leverage-exposure', durationMs: 30_000,
      parameters: { variant: 'pnl-amplification', margin: 100, leverages: [1, 3, 10], movePercents: [0, 2, 5], side: 'long' },
      caption: 'Price climbs from 0% to +2% to +5%. Return on margin climbs to +5% at 1×, +15% at 3× and +50% at 10×.',
      narration: 'Same price path, same margin. Leverage multiplies the result on the margin.',
      reducedMotionDescription: 'Long, 100.00 USDT margin. As the fictional price move goes from 0% to +2% to +5%: at +2% the results are +2.00, +6.00 and +20.00 USDT; at +5% they are 1× +5.00 USDT (+5% of margin), 3× +15.00 USDT (+15%), 10× +50.00 USDT (+50%).',
      glossaryRefs: ['return-on-margin', 'gross-pnl'],
    },
    {
      id: 'T12-A03', type: 'leverage-exposure', durationMs: 30_000,
      parameters: { variant: 'pnl-amplification', margin: 100, leverages: [1, 3, 10], movePercents: [0, -2, -5], side: 'long' },
      caption: 'Now the price falls to −5%. The bars flip: −5% at 1×, −15% at 3×, −50% of the margin at 10×.',
      narration: 'Exactly the same multiplier works against you. Half of the 10× margin is gone after a 5% fall.',
      reducedMotionDescription: 'Long, 100.00 USDT margin, fictional move from 0% to −2% to −5%. At −2%: −2.00, −6.00, −20.00 USDT. At −5%: 1× −5.00 USDT (−5% of margin), 3× −15.00 USDT (−15%), 10× −50.00 USDT (−50%).',
      glossaryRefs: ['return-on-margin'],
    },
    {
      id: 'T12-A04', type: 'leverage-exposure', durationMs: 30_000,
      parameters: { variant: 'pnl-amplification', margin: 100, leverages: [1, 3, 10], movePercents: [0, -5, -10], side: 'long' },
      caption: 'A −10% fall: 1× loses 10% of margin, 3× loses 30%, and at 10× the loss reaches the whole 100.00 USDT margin. A real exchange would have closed it earlier.',
      narration: 'At 10× the arithmetic loss equals the entire deposit. In reality the exchange closes the position before that point, at a level set by its own rules and costs.',
      reducedMotionDescription: 'Long, 100.00 USDT margin, fictional move from 0% to −5% to −10%. At −10%: 1× −10.00 USDT (−10%), 3× −30.00 USDT (−30%), 10× −100.00 USDT, shown as “margin used up (liquidated earlier)” because a real exchange closes the position before the margin reaches zero.',
      glossaryRefs: ['margin', 'leverage'],
    },
    {
      id: 'T12-A05', type: 'leverage-exposure', durationMs: 30_000,
      parameters: { variant: 'pnl-amplification', margin: 100, leverages: [1, 3, 10], movePercents: [0, -3, 3], side: 'short' },
      caption: 'A short: price first falls 3% (short gains +3%, +9%, +30% of margin), then rises to +3% (short loses −3%, −9%, −30%).',
      narration: 'For a short the signs flip, but the magnifying effect is the same in both directions.',
      reducedMotionDescription: 'Short, 100.00 USDT margin. Fictional move goes 0%, then −3%, then +3%. At −3% the short gains 1× +3.00 USDT, 3× +9.00 USDT, 10× +30.00 USDT. At +3% it loses 1× −3.00 USDT (−3%), 3× −9.00 USDT (−9%), 10× −30.00 USDT (−30%).',
      glossaryRefs: ['short-position', 'return-on-margin'],
    },
    {
      id: 'T12-A06', type: 'margin-buffer', durationMs: 30_000,
      parameters: { variant: 'isolated-vs-cross', side: 'long', entry: 100, leverage: 10, mmr: 0.005, quantity: 10, walletBalance: 500, path: [100, 99, 97, 96, 95] },
      caption: 'A 10× long of 10 DEMO falls from 100.00 to 95.00 (−50.00 USDT). Isolated: its 100.00 margin shrinks to 50.00. Cross: the whole 500.00 balance absorbs it, down to 450.00.',
      narration: 'Isolated keeps the damage inside one position’s margin. Cross lets the position lean on your whole balance, so more of your money is involved.',
      reducedMotionDescription: 'Conceptual model. Long 10 DEMO at a fictional 100.00 USDT with 10× leverage (100.00 USDT margin) and a 500.00 USDT wallet. Price falls 100.00, 99.00, 97.00, 96.00, 95.00: PnL −50.00 USDT. Isolated bar: 50.00 of 100.00 margin left. Cross bar: 450.00 of 500.00 balance left. No forced-close level is shown: real levels depend on exchange rules and costs (lesson T13).',
      glossaryRefs: ['isolated-margin', 'cross-margin', 'account-equity'],
    },
    {
      id: 'T12-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Before any leverage setting, ask', items: [
        'What notional does this margin control?',
        'How many USDT does a 1% move cost me?',
        'Isolated or cross: how much of my balance is involved?',
        'Fees and funding are charged on notional, not margin.',
      ] },
      caption: 'A four-question checklist appears line by line: notional, cost of a 1% move, margin mode, and costs on notional.',
      reducedMotionDescription: 'Checklist: what notional does this margin control; how many USDT does a 1% move cost; isolated or cross and how much balance is involved; fees and funding are charged on notional, not margin.',
    },
    {
      id: 'T12-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'No leverage is safe', items: [
        'Leverage magnifies losses exactly as much as gains.',
        'An exchange can close a position before its margin reaches zero.',
        'This course recommends no leverage setting.',
        'WAIT / NO_TRADE is always allowed.',
      ] },
      caption: 'Safety: the warnings appear one by one — losses magnified, early forced closure, no recommended leverage, and not trading is allowed.',
      reducedMotionDescription: 'Warning card: leverage magnifies losses exactly as much as gains; an exchange can close a position before its margin reaches zero; this course recommends no leverage setting; WAIT / NO_TRADE is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T12-X01', type: 'slider-explore', title: 'Leverage explorer',
      fixtureId: 'FX-T12-LEVERAGE-01', simulatorId: 'leverage.exposure',
      instructions: 'Move the margin, leverage and price-move sliders, and switch between LONG and SHORT. Watch how notional, gross PnL and return on margin change. This is a simplified linear contract with fictional numbers.',
      steps: [
        { id: 'T12-X01-01', prompt: 'Keep margin at 100 USDT and raise leverage from 1× to 10×. What happens to notional?', hint: 'Notional ≈ margin × leverage: 100 × 10 = 1,000 USDT.' },
        { id: 'T12-X01-02', prompt: 'Set a move of +3%, note the return on margin, then set −3%.', hint: 'The size stays the same; only the sign flips.' },
        { id: 'T12-X01-03', prompt: 'Switch to SHORT with the same move and compare.', hint: 'A short gains when the price falls and loses when it rises.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'choice', 'reset', 'hint'],
      parameters: {
        sliders: [
          { key: 'margin', label: 'Margin', min: 10, max: 500, step: 10, value: 100, unit: 'USDT' },
          { key: 'leverage', label: 'Leverage', min: 1, max: 25, step: 1, value: 3, unit: '×' },
          { key: 'movePercent', label: 'Price move', min: -10, max: 10, step: 0.5, value: 2, unit: '%' },
        ],
        outputs: [
          { key: 'notional', label: 'Notional exposure', unit: 'USDT', decimals: 2 },
          { key: 'grossPnl', label: 'Gross PnL', unit: 'USDT', decimals: 2 },
          { key: 'returnOnMarginPercent', label: 'Return on margin', unit: '%', decimals: 1 },
        ],
        side: 'long',
        sideToggle: true,
        note: 'Slider ranges are for illustration only, not a recommendation. Real exchanges close positions before the margin reaches zero; fees and funding are ignored here.',
      },
      expectedEvaluation: { kind: 'rubric', criteria: [
        { id: 'exposure', description: 'Notional grows with leverage while the margin stays the same.' },
        { id: 'both-directions', description: 'The same move up and down gives returns on margin of the same size with opposite signs.' },
        { id: 'side', description: 'Switching long and short flips the sign of gross PnL.' },
      ] },
      explanation: 'Return on margin ≈ leverage × signed move. At 10×, ±3% becomes ±30% of the margin. Leverage never changes the direction of the market; it only magnifies the result on your deposit, both ways.',
      fictionalDataLabel: 'Illustrative simplified model with fictional numbers.',
    },
    {
      id: 'T12-X02', type: 'numeric-calculator', title: 'Calculate a 10× short',
      fixtureId: 'FX-T12-SHORT-01', simulatorId: 'leverage.exposure',
      instructions: 'A fictional short uses 50.00 USDT of margin at 10× leverage. The price then rises 4%. Work out the notional, the gross PnL and the return on margin, to 2 decimal places. Use a minus sign for a loss.',
      steps: [
        { id: 'T12-X02-01', prompt: 'Notional = margin × leverage.', hint: '50 × 10.' },
        { id: 'T12-X02-02', prompt: 'Gross PnL = notional × signed move. For a short, a price rise is a negative signed move.', hint: '500 × (−4%) = −20.' },
        { id: 'T12-X02-03', prompt: 'Return on margin = gross PnL ÷ margin × 100.', hint: '−20 ÷ 50 × 100.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: { given: [
        { label: 'Margin', value: 50, unit: 'USDT', decimals: 2 },
        { label: 'Leverage', value: 10, unit: '×', decimals: 0 },
        { label: 'Price move (short position)', value: 4, unit: '%', decimals: 2 },
      ] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'notional', label: 'Notional', value: 500, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'grossPnl', label: 'Gross PnL', value: -20, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'returnOnMarginPercent', label: 'Return on margin', value: -40, tolerance: 0.005, unit: '%', rounding: { decimals: 2 } },
      ] },
      explanation: 'Notional 500.00 USDT; a 4% rise costs the short 20.00 USDT, which is −40% of the 50.00 USDT margin. A 4% fall would have given +40%.',
      fictionalDataLabel: 'Fictional DEMOUSDT position for practice only.',
    },
    {
      id: 'T12-X03', type: 'choice-feedback', title: 'Isolated or cross?',
      fixtureId: 'FX-T12-WALLET-01',
      instructions: 'Your fictional futures wallet holds 500.00 USDT. You open one position with 100.00 USDT of isolated margin at 10×. The price then moves strongly against you. In this simplified model (ignoring fees and price gaps), what is the most this position can take from your balance?',
      steps: [
        { id: 'T12-X03-01', prompt: 'Recall what “isolated” keeps separate.', hint: 'Only the margin assigned to this position supports it.' },
        { id: 'T12-X03-02', prompt: 'Choose the best answer, then compare with what cross margin would do.', hint: 'In cross mode the position could draw on the whole 500.00 USDT.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      choices: [
        { id: 'a', text: 'About the 100.00 USDT isolated margin; the other 400.00 USDT is not used for this position.' },
        { id: 'b', text: 'Exactly 10.00 USDT, because leverage is 10×.' },
        { id: 'c', text: 'Always the whole 500.00 USDT.' },
        { id: 'd', text: 'Nothing, because isolated margin cannot lose money.' },
      ],
      parameters: {
        feedback: {
          a: 'Correct. Isolated margin limits this position to its own margin (simplified). With cross margin, the loss could keep drawing on the rest of the balance.',
          b: 'Leverage does not shrink the loss; it makes each move bigger relative to the margin. The whole 100.00 USDT margin can be lost.',
          c: 'That describes cross margin more closely. Isolated keeps the rest of the balance out of this position in this simplified model.',
          d: 'Isolated margin can absolutely be lost. It only stops the loss from spreading to the rest of the balance.',
        },
      },
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'a' },
      explanation: 'Isolated: the position’s own margin (100.00 USDT) is at risk. Cross: the whole available balance can support, and be lost to, a losing position. Neither mode makes a position safe.',
      fictionalDataLabel: 'Fictional account balances for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T12-F01', name: 'Leverage, notional and return on margin (simplified linear contract)',
      expression: 'notional = margin × leverage; gross PnL = ± notional × move% ÷ 100 (+ long, − short); return on margin % = gross PnL ÷ margin × 100',
      variables: [
        { symbol: 'margin', meaning: 'deposit locked for the position', unit: 'USDT' },
        { symbol: 'leverage', meaning: 'notional ÷ margin', unit: '×' },
        { symbol: 'move%', meaning: 'price change from entry in percent', unit: '%' },
      ],
      simulatorId: 'leverage.exposure', approximate: true,
      workedExamples: [
        { label: '1×, +5% long (notes example 1)', inputs: { margin: 100, leverage: 1, movePercent: 5 }, outputs: { notional: 100, grossPnl: 5, returnOnMarginPercent: 5 }, tolerance: 1e-9, assumptions: ['simplified linear contract', 'fees and funding ignored'] },
        { label: '3×, +5% long', inputs: { margin: 100, leverage: 3, movePercent: 5 }, outputs: { notional: 300, grossPnl: 15, returnOnMarginPercent: 15 }, tolerance: 1e-9, assumptions: ['simplified linear contract'] },
        { label: '10×, +5% long', inputs: { margin: 100, leverage: 10, movePercent: 5 }, outputs: { notional: 1000, grossPnl: 50, returnOnMarginPercent: 50 }, tolerance: 1e-9, assumptions: ['simplified linear contract'] },
        { label: '10×, −5% long (loss magnified too)', inputs: { margin: 100, leverage: 10, movePercent: -5 }, outputs: { grossPnl: -50, returnOnMarginPercent: -50 }, tolerance: 1e-9, assumptions: ['simplified linear contract'] },
        { label: 'Short 10×, price +4% (exercise T12-X02)', side: 'short', inputs: { margin: 50, leverage: 10, movePercent: 4 }, outputs: { notional: 500, grossPnl: -20, returnOnMarginPercent: -40 }, tolerance: 1e-9, assumptions: ['simplified linear contract'] },
        { label: 'Short 10×, price −3% (scene T12-A05)', side: 'short', inputs: { margin: 100, leverage: 10, movePercent: -3 }, outputs: { grossPnl: 30, returnOnMarginPercent: 30 }, tolerance: 1e-9, assumptions: ['simplified linear contract'] },
        { label: 'Quiz T12-Q02: long 5×, −2%', inputs: { margin: 200, leverage: 5, movePercent: -2 }, outputs: { notional: 1000, grossPnl: -20, returnOnMarginPercent: -10 }, tolerance: 1e-9, assumptions: ['simplified linear contract'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T12-Q01', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T12', safetyCritical: true, safetyTopic: 'leverage',
      prompt: 'With 100.00 USDT margin, a fictional +5% move gives +5% on margin at 1× and +50% at 10×. Which statement is correct?',
      choices: [
        { id: 'a', text: 'A −5% move would give −5% at 1× and −50% at 10×: leverage magnifies both directions.' },
        { id: 'b', text: '10× is better, because it gives ten times the profit with the same risk.' },
        { id: 'c', text: 'At 10× the price itself moves ten times faster.' },
        { id: 'd', text: 'Losses at 10× are capped at 5% of the margin.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Return on margin ≈ leverage × signed move. The same factor that turned +5% into +50% turns −5% into −50%.',
      misconceptionFeedback: {
        b: 'The risk is not the same. Losses are magnified by exactly the same factor as gains.',
        c: 'Leverage does not change the market. The price moves the same; only its effect on your margin is bigger.',
        d: 'Nothing caps the loss at 5%. At 10×, a −5% move costs 50% of the margin.',
      },
      learningOutcome: 'Explain that leverage magnifies return on margin in both directions.',
      remediationRef: { lessonId: 'T12', anchorId: 'T12-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T12-Q02', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T12',
      prompt: 'A fictional long uses 200.00 USDT margin at 5× leverage. The price falls 2%. What is the gross PnL in USDT? (Use a minus sign for a loss.)',
      answer: { kind: 'numeric', value: -20, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Notional = 200 × 5 = 1,000.00 USDT. Gross PnL = 1,000 × (−2%) = −20.00 USDT, which is −10% of the margin.',
      learningOutcome: 'Calculate gross PnL from margin, leverage and a signed move.',
      remediationRef: { lessonId: 'T12', anchorId: 'T12-N03' },
    },
    {
      id: 'T12-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T12', safetyCritical: true, safetyTopic: 'leverage',
      prompt: 'A friend says: “Just use 3× leverage. That is the safe leverage for beginners.” What is the best response?',
      choices: [
        { id: 'a', text: 'No leverage is safe. 3× still triples losses on the margin, and risk also depends on position size, price moves, costs and exchange rules. Not trading is also a valid choice.' },
        { id: 'b', text: 'Agree: at 3× a position can never be closed by the exchange.' },
        { id: 'c', text: 'Agree: losses only begin above 5×.' },
        { id: 'd', text: 'Disagree: 10× is the safe level, because positions close faster.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Any leverage magnifies losses. There is no number that makes a position safe; the exchange’s rules and costs decide when a position is force-closed.',
      misconceptionFeedback: {
        b: 'Any leveraged position can be force-closed if losses grow large enough. Lower leverage only changes how large the move must be.',
        c: 'Losses start with the first adverse tick at any leverage, including 1×.',
        d: 'Higher leverage makes losses on the margin bigger, not safer.',
      },
      learningOutcome: 'Recognise that no leverage level is safe and none is recommended.',
      remediationRef: { lessonId: 'T12', anchorId: 'T12-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T12-Q04', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T12', safetyCritical: true, safetyTopic: 'leverage',
      prompt: 'Your fictional wallet holds 500.00 USDT. You open a position with 100.00 USDT margin in CROSS mode and think: “Only my 100.00 USDT is at risk.” What is correct?',
      choices: [
        { id: 'a', text: 'In cross mode a losing position can draw on the whole available balance, so more than 100.00 USDT can be lost.' },
        { id: 'b', text: 'Correct: cross mode always limits the loss to the first margin.' },
        { id: 'c', text: 'Cross mode means the exchange covers your losses.' },
        { id: 'd', text: 'Cross mode only matters for spot trading.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Cross margin shares the balance across positions. Isolated margin is the mode that keeps one position to its own margin (simplified).',
      misconceptionFeedback: {
        b: 'That describes isolated margin. Cross lets the position use the rest of the balance.',
        c: 'The exchange does not cover your losses. They come out of your balance.',
        d: 'Margin modes exist only for leveraged futures positions.',
      },
      learningOutcome: 'Distinguish isolated and cross margin by how much of the balance is at risk.',
      remediationRef: { lessonId: 'T12', anchorId: 'T12-N02' },
      shuffleChoices: true,
    },
    {
      id: 'T12-Q05', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T12',
      prompt: 'A fictional futures wallet balance is 300.00 USDT and the open position shows an unrealized PnL of −45.00 USDT. What is the account equity, approximately?',
      choices: [
        { id: 'a', text: '255.00 USDT' },
        { id: 'b', text: '300.00 USDT' },
        { id: 'c', text: '345.00 USDT' },
        { id: 'd', text: '45.00 USDT' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Equity ≈ wallet balance + unrealized PnL = 300.00 + (−45.00) = 255.00 USDT.',
      misconceptionFeedback: {
        b: '300.00 is the wallet balance only. Equity includes the open loss.',
        c: 'The PnL is a loss, so it is subtracted, not added.',
        d: '45.00 is just the size of the open loss.',
      },
      learningOutcome: 'Calculate account equity from wallet balance and unrealized PnL.',
      remediationRef: { lessonId: 'T12', anchorId: 'T12-N07' },
      shuffleChoices: false,
    },
  ],

  commonMistakes: [
    { mistake: 'Looking only at how leverage multiplies gains.', correction: 'The same factor multiplies losses: at 10×, −5% costs 50% of the margin.' },
    { mistake: 'Believing a certain leverage number is safe.', correction: 'No leverage is safe or recommended; exchanges can close positions before margin reaches zero.' },
    { mistake: 'Assuming cross margin risks only the position’s first margin.', correction: 'Cross lets a losing position draw on the whole available balance; isolated keeps it to its own margin.' },
  ],
  takeaways: [
    'Notional ≈ margin × leverage, and gross PnL ≈ notional × signed % move.',
    'Leverage magnifies return on margin in both directions; no leverage is safe.',
    'Isolated margin risks one position’s margin; cross margin can use the whole balance.',
  ],
  reviewCard: {
    keyTermIds: ['leverage', 'margin', 'return-on-margin'],
    safetyNote: 'Leverage magnifies losses exactly as much as gains, and a position can be closed before its margin reaches zero. No leverage is safe or recommended; not trading is always allowed.',
    reviewMinutes: 4,
    retrievalQuestion: 'You use 100 USDT margin at 10× and the price moves 3% against you. What is your notional, your gross PnL and your return on margin?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T12-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
