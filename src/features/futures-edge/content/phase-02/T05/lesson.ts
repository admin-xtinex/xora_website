import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures, T05_PATH } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data and not a forecast.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can explain the difference between owning coins (a spot buy) and holding a position (a futures long or short).',
    'Learner can say whether a long or a short gains or loses for a given price move, and calculate the gross result with quantity.',
    'Learner can explain why a forecast does not change the result: the same price path gives a long and a short opposite outcomes.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T05-S01', kind: 'cover-problem', title: 'One price, two directions',
      narrationText: 'A price can go up or down. Some traders want to gain when it rises, others when it falls. Before you choose anything, you need to know what you actually hold: a coin, or a position.',
      blocks: [
        { kind: 'paragraph', text: 'A price can rise or fall. Traders can choose a side that gains when it rises, or one that gains when it falls.' },
        { kind: 'paragraph', text: 'First question: do you **own a coin**, or do you hold a [[position]]?' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T05-A01' },
      glossaryRefs: ['position'],
      speakerNotes: 'Start from the everyday idea of buying something, then introduce the idea that a futures position is a record, not an object you own.',
    },
    {
      id: 'T05-S02', kind: 'key-definition', title: 'Ownership vs position',
      narrationText: 'If you buy 2 DEMO on a spot market, the coins are yours. A futures long of 2 DEMO is a contract record: its result follows the price, but you own no coins. Buying spot is not automatically the same as going long with borrowed money.',
      blocks: [
        { kind: 'comparison',
          left: { title: 'Spot BUY', points: ['You receive the coins.', 'Worst case: they lose value.'] },
          right: { title: 'Futures LONG', points: ['A contract record; no coins.', 'Often uses a deposit plus borrowed exposure.'] } },
        { kind: 'definition', termId: 'position' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T05-A01' },
      glossaryRefs: ['position', 'long-position'],
    },
    {
      id: 'T05-S03', kind: 'visual-breakdown', title: 'Long and short on the same path',
      narrationText: 'A long gains when price rises. A short gains when price falls. Put both on the same price path and their results are mirror images: one plus eight, the other minus eight.',
      blocks: [
        { kind: 'list', ordered: false, items: ['[[long-position|LONG]]: gains if price **rises**.', '[[short-position|SHORT]]: gains if price **falls**.', 'Same path, opposite [[profit-and-loss|PnL]].'] },
      ],
      visualRef: { kind: 'scene', sceneId: 'T05-A04' },
      glossaryRefs: ['long-position', 'short-position', 'profit-and-loss'],
    },
    {
      id: 'T05-S04', kind: 'worked-example', title: 'Both sides, 2 DEMO from 100.00',
      narrationText: 'Both traders open 2 DEMO at 100.00 USDT. At 104.00 the long is up 8 USDT and the short is down 8. At 96.00 it is the other way round.',
      blocks: [
        {
          kind: 'worked-example', title: 'Entry 100.00 USDT, quantity 2 DEMO (fictional)', fictional: true,
          steps: [
            { text: 'Long at 104.00: (104.00 − 100.00) × 2', result: '+8.00 USDT' },
            { text: 'Short at 104.00: (100.00 − 104.00) × 2', result: '−8.00 USDT' },
            { text: 'Long at 96.00: (96.00 − 100.00) × 2', result: '−8.00 USDT' },
          ],
          conclusion: 'Short at 96.00: +8.00 USDT. Before fees.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T05-A05' },
      glossaryRefs: ['profit-and-loss'],
    },
    {
      id: 'T05-S05', kind: 'risks-misunderstanding', title: 'Risks people miss',
      narrationText: 'Your forecast does not change the market. A short has no fixed loss ceiling because price can keep rising. And a futures long with borrowed exposure can lose its whole deposit, which a spot buy cannot do in the same way.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Forecast ≠ result', text: 'Choosing a side does not move the price. Only the path decides the PnL.' },
        { kind: 'callout', callout: 'safety', text: 'A short loses when price **rises**, with no fixed ceiling. Borrowed exposure makes losses arrive faster. Waiting is always allowed.' },
      ],
      glossaryRefs: ['short-position'],
    },
    {
      id: 'T05-S06', kind: 'guided-practice', title: 'Pick a side, watch, label',
      narrationText: 'Now you try. Pick long or short and make a forecast in your head. Then follow the predetermined fictional path and label each checkpoint as profit, loss or flat.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Pick LONG or SHORT and a forecast.', 'Follow the fixed fictional path.', 'Label each checkpoint: profit, loss or flat.'] },
        { kind: 'callout', callout: 'tip', text: 'The path is the same whatever you pick. Only the label changes.' },
      ],
      glossaryRefs: ['long-position', 'short-position'],
    },
    {
      id: 'T05-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Owning coins is not the same as holding a position. Long gains on a rise, short gains on a fall. The same move gives opposite results, and to end a trade you close the position.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Spot buy = you own coins. Futures long = a position.', 'Long gains on a rise; short gains on a fall.', 'Same path, opposite results.', '[[close-a-position|Closing]] fixes the result.'] },
      ],
      glossaryRefs: ['close-a-position', 'position'],
    },
  ],

  notesSections: [
    {
      id: 'T05-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'On a spot market, **buy** means you pay USDT and receive the coin; **sell** means you hand the coin back for USDT. On a futures market you hold a [[position]] instead: a contract record whose result follows the price. A [[long-position|long]] gains when the price rises. A [[short-position|short]] gains when the price falls. Buying spot is **not** automatically the same as going long with borrowed money.' },
        { kind: 'analogy', text: 'Owning coins is like owning a bag of rice: it is yours, and its value goes up and down. A position is like a written agreement about the rice price: you settle the difference in money and never hold the rice.' },
      ],
    },
    {
      id: 'T05-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Every later lesson assumes you know which way your trade gains. Beginners often feel that a short is strange or that a forecast makes them right. The market does not know your forecast. Your [[profit-and-loss|PnL]] depends only on your side, your [[quantity]] and where the price actually goes.' },
      ],
    },
    {
      id: 'T05-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: one path, two sides (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Asha opens a long and Ben opens a short, both 2 DEMO at 100.00 USDT.' },
            { text: 'Price rises to 104.00. Long: (104.00 − 100.00) × 2', result: '+8.00 USDT' },
            { text: 'Short at 104.00: (100.00 − 104.00) × 2', result: '−8.00 USDT' },
            { text: 'Price reverses to 96.00. Long: (96.00 − 100.00) × 2', result: '−8.00 USDT' },
            { text: 'Short at 96.00: (100.00 − 96.00) × 2', result: '+8.00 USDT' },
          ],
          conclusion: 'The same path flipped both results. Nobody’s forecast changed the path. Fees are ignored here.',
        },
        {
          kind: 'worked-example', title: 'Example 2: closing a short (fictional)', fictional: true,
          steps: [
            { text: 'Short 2 DEMO at 100.00 USDT.' },
            { text: 'Price falls to 97.00 and Ben closes with a buy of 2 DEMO: (100.00 − 97.00) × 2', result: '+6.00 USDT' },
          ],
          conclusion: 'After closing, the result stays +6.00 USDT even if the price later climbs back to 100.00.',
        },
        {
          kind: 'formula', expression: 'gross PnL = (exit − entry) × quantity for a long; (entry − exit) × quantity for a short', formulaId: 'T05-F01',
          variables: [
            { symbol: 'entry, exit', meaning: 'price when the position opened and closed (or the price now)', unit: 'USDT per DEMO' },
            { symbol: 'quantity', meaning: 'how many DEMO the position covers', unit: 'DEMO' },
          ],
        },
      ],
    },
    {
      id: 'T05-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Ask: do I receive coins (spot) or a position (futures)?',
          'Find the side: long gains on a rise, short gains on a fall.',
          'Compare the price now with the entry price.',
          'Multiply the gap by the quantity, and give it a plus or minus sign from the side.',
          'To end the trade, [[close-a-position|close the position]] with the opposite order: sell to close a long, buy to close a short.',
        ] },
      ],
    },
    {
      id: 'T05-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Thinking a spot buy and a margin long are the same', text: 'A spot buyer owns the coins. A futures long often uses a small deposit plus borrowed exposure and can lose that deposit quickly.' },
        { kind: 'callout', callout: 'mistake', title: 'Believing the forecast decides the result', text: 'Only the price path decides the result. A good-sounding forecast can still end in a loss.' },
        { kind: 'callout', callout: 'mistake', title: 'Thinking a short is limited because price stops at zero', text: 'A short loses when price rises, and a rise has no fixed ceiling.' },
      ],
    },
    {
      id: 'T05-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Neither side is safe or guaranteed. Every position can lose. Futures positions with borrowed exposure can lose a whole deposit fast. Choosing WAIT or not trading is always a valid decision. This lesson is education only, not advice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T05-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Who gains on which move (entry 100.00, 2 DEMO, fictional)', headers: ['Price', 'Long', 'Short'], rows: [
          ['104.00 (rise)', '+8.00 USDT', '−8.00 USDT'],
          ['100.00 (flat)', '0.00 USDT', '0.00 USDT'],
          ['96.00 (fall)', '−8.00 USDT', '+8.00 USDT'],
        ] },
      ],
    },
    {
      id: 'T05-N08', heading: 'learn-more', title: 'Learn more: how can you sell something you do not own?', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'On a futures market, the exchange matches a buyer of a contract with a seller of a contract. Nobody hands over coins; the exchange simply moves the price difference between the two accounts. That is why a short is possible without owning DEMO. Later lessons explain the deposit (margin), borrowed exposure (leverage) and what happens when the deposit runs out.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T05-A01', type: 'spot-vs-futures', durationMs: 30_000,
      parameters: { variant: 'ownership', path: [100, 102, 104, 101, 98, 96], spotQuantity: 2, futuresQuantity: 2, margin: 40 },
      caption: 'Price moves 100.00 → 104.00 → 96.00. The spot buyer still owns 2 DEMO (now worth 192.00 USDT); the futures long shows −8.00 USDT and its 40.00 USDT deposit shrinks to 32.00.',
      narration: 'Same coin, same price, two different things held. On the left you own coins. On the right you hold a position with a deposit.',
      reducedMotionDescription: 'Two cards follow one fictional price that goes from 100.00 up to 104.00 and down to 96.00. Spot card: owns 2 DEMO, worth 192.00 USDT at the end. Futures card: a long of 2 DEMO with a 40.00 USDT deposit; at 96.00 its PnL is −8.00 USDT and 32.00 USDT of the deposit is left. It owns no coins.',
      glossaryRefs: ['position', 'long-position'],
    },
    {
      id: 'T05-A02', type: 'pnl-meter', durationMs: 25_000,
      parameters: { variant: 'single-position', path: [100, 101, 102, 103, 104], entry: 100, quantity: 2, side: 'long', unit: 'USDT' },
      caption: 'A long of 2 DEMO from 100.00: as price climbs to 104.00 the PnL grows from 0.00 to +8.00 USDT.',
      narration: 'Every 1.00 USDT rise adds 2.00 USDT, because the position covers 2 DEMO.',
      reducedMotionDescription: 'Long 2 DEMO, entry 100.00. Price rises step by step 101, 102, 103, 104. PnL goes +2.00, +4.00, +6.00, +8.00 USDT. Still open, so unrealized.',
      glossaryRefs: ['long-position', 'profit-and-loss'],
    },
    {
      id: 'T05-A03', type: 'pnl-meter', durationMs: 25_000,
      parameters: { variant: 'single-position', path: [100, 99, 98, 97, 96], entry: 100, quantity: 2, side: 'short', unit: 'USDT' },
      caption: 'A short of 2 DEMO from 100.00: as price falls to 96.00 the PnL grows from 0.00 to +8.00 USDT.',
      narration: 'The short is the mirror image: a falling price is good for it.',
      reducedMotionDescription: 'Short 2 DEMO, entry 100.00. Price falls 99, 98, 97, 96. PnL goes +2.00, +4.00, +6.00, +8.00 USDT.',
      glossaryRefs: ['short-position', 'profit-and-loss'],
    },
    {
      id: 'T05-A04', type: 'pnl-meter', durationMs: 25_000,
      parameters: { variant: 'long-short-parallel', path: [100, 101, 102, 103, 104], entry: 100, quantity: 2, unit: 'USDT' },
      caption: 'One rising path, two meters: the long climbs to +8.00 USDT while the short sinks to −8.00 USDT.',
      narration: 'Same entry, same quantity, same path. The only difference is the side.',
      reducedMotionDescription: 'Both positions are 2 DEMO from 100.00. Price rises to 104.00. Long meter ends at +8.00 USDT, short meter at −8.00 USDT.',
      glossaryRefs: ['long-position', 'short-position'],
    },
    {
      id: 'T05-A05', type: 'pnl-meter', durationMs: 40_000,
      parameters: { variant: 'long-short-parallel', path: T05_PATH, entry: 100, quantity: 2, unit: 'USDT' },
      caption: 'The market reverses: from 104.00 it falls through the 100.00 entry to 96.00. The long flips from +8.00 to −8.00 USDT; the short flips from −8.00 to +8.00 USDT.',
      narration: 'Watch the moment price crosses back through 100.00. Both meters pass zero at the same moment and swap signs.',
      reducedMotionDescription: 'Predetermined fictional path: 100, 101, 102, 103, 104, then 103, 102, 101, 100, 99, 98, 97, 96. At 104.00: long +8.00, short −8.00 USDT. Back at 100.00: both 0.00. At 96.00: long −8.00, short +8.00 USDT.',
      glossaryRefs: ['profit-and-loss'],
    },
    {
      id: 'T05-A06', type: 'pnl-meter', durationMs: 25_000,
      parameters: { variant: 'single-position', path: [100, 99, 98, 97, 98, 99, 100], entry: 100, quantity: 2, side: 'short', exitIndex: 3, unit: 'USDT' },
      caption: 'The short is closed with a buy at 97.00: its result freezes at +6.00 USDT while price later drifts back to 100.00.',
      narration: 'Once a position is closed, later price moves no longer change its result.',
      reducedMotionDescription: 'Short 2 DEMO from 100.00. Price falls to 97.00 and the short is closed there: result fixed at +6.00 USDT. Afterwards price returns to 100.00, but the closed result stays +6.00 USDT.',
      glossaryRefs: ['close-a-position'],
    },
    {
      id: 'T05-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'Before choosing any side', items: ['Your forecast does not move the price.', 'A short loses on a rise, with no fixed ceiling.', 'Borrowed exposure can wipe out a deposit fast.', 'WAIT and NO TRADE are always allowed.'] },
      caption: 'Safety: four facts revealed one by one before anyone picks long or short.',
      reducedMotionDescription: 'Warning card: your forecast does not move the price; a short loses when price rises and has no fixed ceiling; borrowed exposure can wipe out a deposit fast; waiting or not trading is always allowed.',
    },
    {
      id: 'T05-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'recap', heading: 'BUY / SELL / LONG / SHORT', items: ['Spot buy = you own coins.', 'Long gains on a rise.', 'Short gains on a fall.', 'Close = opposite order; result fixed.'] },
      caption: 'Recap points appear one at a time: ownership, long, short, closing.',
      reducedMotionDescription: 'Recap: a spot buy means you own coins; a long gains when price rises; a short gains when price falls; closing uses the opposite order and fixes the result.',
    },
  ],

  exercises: [
    {
      id: 'T05-X01', type: 'classify', title: 'Pick a side, watch the path, label the result',
      fixtureId: 'FX-T05-PATH-01',
      instructions: 'Pick LONG or SHORT and make a forecast (up or down) in your head. The fictional path on the chart is fixed in advance: 100.00 up to 104.00, then down to 96.00. Both positions are 2 DEMO from an entry of 100.00 USDT. Label every checkpoint for both sides as profit, loss or flat (zero).',
      steps: [
        { id: 'T05-X01-01', prompt: 'Choose your side and forecast. Notice that the path below does not change whatever you pick.', hint: 'A long wants the price above 100.00; a short wants it below 100.00.' },
        { id: 'T05-X01-02', prompt: 'Follow the path and compare each checkpoint price with the 100.00 entry.', hint: 'Above entry: long profit, short loss. Below entry: the reverse. Equal: flat.' },
        { id: 'T05-X01-03', prompt: 'Label all six rows, then press Check.', hint: 'At 102.00 on the way down the price is still above the entry.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        showChart: true,
        items: [
          { id: 'long-104', text: 'LONG, price at the top: 104.00' },
          { id: 'short-104', text: 'SHORT, price at the top: 104.00' },
          { id: 'short-102', text: 'SHORT, price falling but at 102.00' },
          { id: 'long-100', text: 'LONG, price back at 100.00' },
          { id: 'long-96', text: 'LONG, price at the end: 96.00' },
          { id: 'short-96', text: 'SHORT, price at the end: 96.00' },
        ],
        buckets: [
          { id: 'profit', label: 'Profit (PnL above 0)' },
          { id: 'loss', label: 'Loss (PnL below 0)' },
          { id: 'flat', label: 'Flat (PnL = 0)' },
        ],
        itemFeedback: {
          'long-104': 'Price is 4.00 above entry and a long gains on a rise: +8.00 USDT for 2 DEMO.',
          'short-104': 'A short loses on a rise: (100.00 − 104.00) × 2 = −8.00 USDT, whatever the forecast was.',
          'short-102': 'The fall has started, but 102.00 is still above the 100.00 entry, so the short is at −4.00 USDT.',
          'long-100': 'Price equals the entry, so the gap is zero: 0.00 USDT.',
          'long-96': 'Price is 4.00 below entry: (96.00 − 100.00) × 2 = −8.00 USDT.',
          'short-96': 'Price is 4.00 below entry and a short gains on a fall: +8.00 USDT.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { profit: ['long-104', 'short-96'], loss: ['short-104', 'short-102', 'long-96'], flat: ['long-100'] } },
      explanation: 'The result depends only on the side and where price is compared with the entry. The same fixed path gave the long +8.00 then −8.00 USDT, and the short the exact opposite. A forecast never changes the path.',
      fictionalDataLabel: 'Fictional DEMO/USDT path for practice only. It is predetermined and is not a prediction.',
    },
    {
      id: 'T05-X02', type: 'choice-feedback', title: 'Your forecast vs the path',
      fixtureId: 'FX-T05-PATH-01',
      instructions: 'You opened a SHORT of 2 DEMO at 100.00 USDT because you forecast a fall. The fixed fictional path first rises to 104.00. Choose the true statement about that moment.',
      steps: [
        { id: 'T05-X02-01', prompt: 'Compare 104.00 with the 100.00 entry for a short.', hint: 'A short gains when price is below the entry.' },
        { id: 'T05-X02-02', prompt: 'Pick the statement that describes the position honestly.', hint: '(100.00 − 104.00) × 2 DEMO.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      choices: [
        { id: 'a', text: 'The short shows −8.00 USDT. Being sure of a fall does not change that.' },
        { id: 'b', text: 'The short shows +8.00 USDT because I forecast a fall.' },
        { id: 'c', text: 'The short shows 0.00 USDT until price starts falling.' },
        { id: 'd', text: 'The price must come back down, so this is not really a loss.' },
      ],
      parameters: {
        showChart: true,
        feedback: {
          b: 'The forecast does not set the result. At 104.00 a short from 100.00 is losing: (100.00 − 104.00) × 2 = −8.00 USDT.',
          c: 'An open short changes with every price move, both up and down. At 104.00 it is −8.00 USDT.',
          d: 'Nothing guarantees a return. In this fictional path it did fall later, but at 104.00 nobody can know that.',
        },
      },
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'a' },
      explanation: 'At 104.00 the short is down 8.00 USDT. Later in this fictional path it ends at +8.00 USDT, but only because the price happened to fall afterwards, not because of the forecast.',
      fictionalDataLabel: 'Fictional DEMO/USDT path for practice only.',
    },
    {
      id: 'T05-X03', type: 'choice-feedback', title: 'Coins or a position?',
      fixtureId: 'FX-T05-SIDES-01',
      instructions: 'Asha buys 2 DEMO on a spot market for 200.00 USDT. Ben opens a futures long of 2 DEMO with a 40.00 USDT deposit. Which statements are true? Select all that apply.',
      steps: [
        { id: 'T05-X03-01', prompt: 'Decide who owns coins.', hint: 'Only a spot buy delivers the coins to you.' },
        { id: 'T05-X03-02', prompt: 'Decide whose deposit can be used up quickly.', hint: 'A 40.00 USDT deposit backs a 200.00 USDT position: a fall of 20.00 USDT per DEMO would use it all.' },
      ],
      allowedControls: ['multi-choice', 'reset', 'hint'],
      choices: [
        { id: 'a', text: 'Asha owns 2 DEMO coins.' },
        { id: 'b', text: 'Ben holds a position whose result follows the DEMO price, but he owns no DEMO.' },
        { id: 'c', text: 'Ben’s 40.00 USDT deposit can be lost much faster than Asha’s coins lose value.' },
        { id: 'd', text: 'Asha and Ben carry exactly the same risk because both are “long”.' },
      ],
      parameters: {
        feedback: {
          d: 'Both gain on a rise, but the risks differ. Ben uses borrowed exposure on a small deposit; Asha paid in full and owns the coins.',
        },
      },
      expectedEvaluation: { kind: 'choice-set', choiceIds: ['a', 'b', 'c'] },
      explanation: 'A spot buy gives ownership. A futures long is a position. Both gain on a rise, but a long with borrowed exposure can lose its deposit quickly, which is why buying spot is not automatically the same as going long with margin.',
      fictionalDataLabel: 'Fictional DEMO/USDT amounts for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T05-F01', name: 'Gross PnL of a long or a short (before fees)',
      expression: 'long: (exit − entry) × quantity; short: (entry − exit) × quantity',
      variables: [
        { symbol: 'entry, exit', meaning: 'opening price and closing (or current) price', unit: 'USDT per DEMO' },
        { symbol: 'quantity', meaning: 'size of the position', unit: 'DEMO' },
      ],
      simulatorId: 'pnl.linear', approximate: false,
      workedExamples: [
        { label: 'Long at the top (notes example 1)', side: 'long', inputs: { entry: 100, exit: 104, quantity: 2 }, outputs: { grossPnl: 8, priceChange: 4 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees excluded'] },
        { label: 'Short at the top (notes example 1)', side: 'short', inputs: { entry: 100, exit: 104, quantity: 2 }, outputs: { grossPnl: -8 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees excluded'] },
        { label: 'Long at the end (notes example 1)', side: 'long', inputs: { entry: 100, exit: 96, quantity: 2 }, outputs: { grossPnl: -8 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees excluded'] },
        { label: 'Short at the end (notes example 1)', side: 'short', inputs: { entry: 100, exit: 96, quantity: 2 }, outputs: { grossPnl: 8 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees excluded'] },
        { label: 'Closed short (notes example 2)', side: 'short', inputs: { entry: 100, exit: 97, quantity: 2 }, outputs: { grossPnl: 6 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees excluded'] },
        { label: 'Short checkpoint at 102 (exercise T05-X01)', side: 'short', inputs: { entry: 100, exit: 102, quantity: 2 }, outputs: { grossPnl: -4 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees excluded'] },
        { label: 'Quiz T05-Q02', side: 'short', inputs: { entry: 80, exit: 82.5, quantity: 3 }, outputs: { grossPnl: -7.5 }, tolerance: 1e-9, assumptions: ['fictional data', 'fees excluded'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T05-Q01', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T05',
      prompt: 'A fictional DEMO price falls from 50.00 to 47.00 USDT. One trader is long 1 DEMO from 50.00 and another is short 1 DEMO from 50.00. Which statement is correct?',
      choices: [
        { id: 'a', text: 'The short gains 3.00 USDT and the long loses 3.00 USDT.' },
        { id: 'b', text: 'Both lose, because the price fell.' },
        { id: 'c', text: 'The long gains, because buying is always the safer side.' },
        { id: 'd', text: 'Neither changes until someone closes.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A short gains on a fall: (50.00 − 47.00) × 1 = +3.00 USDT. The long is the mirror image: −3.00 USDT.',
      misconceptionFeedback: {
        b: 'A fall is bad for a long but good for a short. The two results are opposite.',
        c: 'No side is “safer”. A long loses whenever price falls below its entry.',
        d: 'An open position’s PnL changes with every price move. Closing only fixes it.',
      },
      learningOutcome: 'Decide which side gains for a given price move.',
      remediationRef: { lessonId: 'T05', anchorId: 'T05-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T05-Q02', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T05',
      prompt: 'A fictional short of 3 DEMO opened at 80.00 USDT. Price rises to 82.50. What is the gross PnL in USDT? (Use a minus sign for a loss.)',
      answer: { kind: 'numeric', value: -7.5, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Short PnL = (entry − price) × quantity = (80.00 − 82.50) × 3 = −7.50 USDT. A rise hurts a short.',
      learningOutcome: 'Calculate a short position’s gross result, including the sign.',
      remediationRef: { lessonId: 'T05', anchorId: 'T05-N03' },
    },
    {
      id: 'T05-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T05', safetyCritical: true, safetyTopic: 'leverage',
      prompt: 'A learner says: “Buying DEMO on spot and opening a futures long with a small deposit are the same thing. Both are just long.” What is the best response?',
      choices: [
        { id: 'a', text: 'Not the same: the spot buyer owns the coins, while a futures long is a position that often uses borrowed exposure and can lose its deposit quickly.' },
        { id: 'b', text: 'Correct: both gain on a rise, so their risks are identical.' },
        { id: 'c', text: 'The futures long is safer because you never pay the full price.' },
        { id: 'd', text: 'The spot buy is riskier because you pay more money up front.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Direction is the same, but ownership and risk are not. A small deposit backing a bigger position can be used up by a modest price fall.',
      misconceptionFeedback: {
        b: 'Same direction does not mean same risk. Borrowed exposure makes the deposit shrink much faster.',
        c: 'Paying less up front is exactly what makes a futures long fragile: a smaller fall can use up the deposit.',
        d: 'Paying in full means the spot buyer owns the coins; their value can fall, but there is no deposit that can be used up in the same way.',
      },
      learningOutcome: 'Explain that buying spot is not automatically the same as going long with margin.',
      remediationRef: { lessonId: 'T05', anchorId: 'T05-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T05-Q04', type: 'single', cognitiveTag: 'mistake-risk', linkedLessonId: 'T05',
      prompt: 'Someone says: “Shorting is low risk, because price can only fall to zero.” What is wrong with this?',
      choices: [
        { id: 'a', text: 'A short loses when price rises, and a rise has no fixed ceiling, so the possible loss has no fixed ceiling either.' },
        { id: 'b', text: 'Nothing; a short can never lose more than its entry price.' },
        { id: 'c', text: 'Shorts cannot lose money at all.' },
        { id: 'd', text: 'A short loses when price falls.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Zero limits how much a short can gain, not how much it can lose. Losses come from rises.',
      misconceptionFeedback: {
        b: 'The zero floor caps the short’s gain. Its loss grows as price rises, with no fixed limit.',
        c: 'Every position can lose. A short loses whenever price is above its entry.',
        d: 'It is the other way round: a fall is good for a short; a rise hurts it.',
      },
      learningOutcome: 'Recognise that a short’s loss comes from rising prices and is not capped by zero.',
      remediationRef: { lessonId: 'T05', anchorId: 'T05-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T05-Q05', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T05', safetyCritical: true, safetyTopic: 'not-advice',
      prompt: 'You are sure the price will rise, so you open a long. A fictional path then falls below your entry. What does this tell you?',
      choices: [
        { id: 'a', text: 'Confidence does not move the price. The long is losing now, and no side or forecast guarantees a result. Waiting or not trading is always allowed.' },
        { id: 'b', text: 'The loss is not real because your forecast was strong.' },
        { id: 'c', text: 'You should switch to a short at once to get the money back.' },
        { id: 'd', text: 'The price is certain to come back above your entry.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A long below its entry shows a loss, whatever the forecast. No course, signal or person can guarantee the next move.',
      misconceptionFeedback: {
        b: 'An open loss is real money on paper. It can grow or shrink, but the forecast does not cancel it.',
        c: 'Rushing to reverse to “win it back” is a common emotional mistake. This lesson does not give trading instructions.',
        d: 'Nothing guarantees a return. Prices can keep moving away from your entry.',
      },
      learningOutcome: 'Separate a forecast from the actual result and avoid treating any side as guaranteed.',
      remediationRef: { lessonId: 'T05', anchorId: 'T05-N06' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Treating a spot buy and a futures long with a small deposit as the same thing.', correction: 'Spot gives you the coins. A futures long is a position, often with borrowed exposure that can use up its deposit quickly.' },
    { mistake: 'Believing a confident forecast makes the result positive.', correction: 'Only the price path decides PnL. The same path gives a long and a short opposite results.' },
    { mistake: 'Thinking a short has limited risk because price stops at zero.', correction: 'A short loses on a rise, and a rise has no fixed ceiling.' },
  ],
  takeaways: [
    'A spot buy means you own coins; a futures long or short is a position that tracks the price.',
    'A long gains when price rises; a short gains when price falls; the same path gives them opposite results.',
    'Your forecast does not move the price, no side is safe, and WAIT is always allowed.',
  ],
  reviewCard: {
    keyTermIds: ['position', 'long-position', 'short-position'],
    safetyNote: 'Neither side is safe. A short loses on a rise with no fixed ceiling, and borrowed exposure can use up a deposit fast. Waiting is always allowed.',
    reviewMinutes: 3,
    retrievalQuestion: 'A long and a short both open 2 DEMO at 100.00. Price ends at 96.00. What is each one’s gross PnL?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T05-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
