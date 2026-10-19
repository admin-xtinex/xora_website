import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices and order books in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data, and no real orders are placed.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can explain the trade-off between a market order (speed) and a limit order (price control) and say which one can stay unfilled.',
    'Learner can describe how a trigger price turns a stop-market or stop-limit order into a live order, and why triggered is not the same as filled.',
    'Learner can calculate the filled quantity, average fill price and slippage of a fictional order against a small order book.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T07-S01', kind: 'cover-problem', title: 'Same wish, different instructions',
      narrationText: 'You decide to buy some DEMO. That is your intention. But the exchange needs an instruction: buy right now at any available price, buy only at my price, or wait until a certain price trades and then act. Each choice gives up something.',
      blocks: [
        { kind: 'paragraph', text: '“I want to buy DEMO” is an intention. An [[order]] must also say **how**: now, only at my price, or after a trigger.' },
        { kind: 'paragraph', text: 'Every choice trades away something: **speed** or **price control**.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T07-A01' },
      glossaryRefs: ['order'],
      speakerNotes: 'Start from the learner’s intention, then show that the order type is the instruction attached to it. No order type is “best”; each is a trade-off.',
    },
    {
      id: 'T07-S02', kind: 'key-definition', title: 'Immediate or price-specific',
      narrationText: 'A market order trades immediately against the best prices in the order book. A limit order trades only at your price or better, and waits if it cannot.',
      blocks: [
        { kind: 'comparison',
          left: { title: '[[market-order|Market order]]', points: ['Trades now', 'Price not fixed', 'Can slip'] },
          right: { title: '[[limit-order|Limit order]]', points: ['Your price or better', 'Timing not fixed', 'Can stay unfilled'] } },
      ],
      visualRef: { kind: 'scene', sceneId: 'T07-A02' },
      glossaryRefs: ['market-order', 'limit-order', 'order-book'],
    },
    {
      id: 'T07-S03', kind: 'visual-breakdown', title: 'The trigger wakes an order up',
      narrationText: 'A stop order sleeps until its trigger price trades. Then it wakes up. A stop-market becomes a market order. A stop-limit becomes a limit order with its own worst acceptable price.',
      blocks: [
        { kind: 'paragraph', text: 'A [[trigger-price|trigger price]] keeps the order asleep until the market trades there.' },
        { kind: 'list', ordered: false, items: ['[[stop-market-order|Stop-market]]: wakes up as a market order.', '[[stop-limit-order|Stop-limit]]: wakes up as a limit order.'] },
        { kind: 'callout', callout: 'tip', text: '**Triggered** means sent. It does not mean filled.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T07-A05' },
      glossaryRefs: ['trigger-price', 'stop-market-order', 'stop-limit-order'],
    },
    {
      id: 'T07-S04', kind: 'worked-example', title: 'How a market buy fills',
      narrationText: 'A market buy of 6 DEMO meets three ask levels. It takes 2 at 100.10, 3 at 100.20 and 1 at 100.40. The average is 100.20, which is 0.10 worse than the best ask.',
      blocks: [
        {
          kind: 'worked-example', title: 'Market buy 6 DEMO (fictional book)', fictional: true,
          steps: [
            { text: '2 at 100.10 + 3 at 100.20 + 1 at 100.40' },
            { text: 'Cost = 200.20 + 300.60 + 100.40', result: '601.20 USDT' },
            { text: 'Average = 601.20 ÷ 6', result: '100.20' },
          ],
          conclusion: '[[slippage|Slippage]] = 100.20 − 100.10 = 0.10 USDT per DEMO.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T07-A03' },
      glossaryRefs: ['fill', 'slippage', 'ask'],
    },
    {
      id: 'T07-S05', kind: 'risks-misunderstanding', title: 'What no order type guarantees',
      narrationText: 'Market and stop-market orders usually fill, but not at a guaranteed price. Limit and stop-limit orders control price, but may never fill. In a sudden price gap, a stop can fill far from its trigger, or not at all.',
      blocks: [
        { kind: 'callout', callout: 'safety', title: 'Stops do not lock a price', text: 'A stop-market fills at the next available price. In a [[price-gap|gap]] that can be much worse than the trigger.' },
        { kind: 'callout', callout: 'mistake', text: 'A limit order is not a promise to trade. It can wait forever.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T07-A06' },
      glossaryRefs: ['price-gap', 'stop-market-order', 'limit-order'],
    },
    {
      id: 'T07-S06', kind: 'guided-practice', title: 'Your turn: choose and fill',
      narrationText: 'First, pick the order type that fits each fictional situation and read the trade-off. Then fill a market order and a limit order against a small fictional book.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Match six situations to an order type.', 'Fill a market buy of 10 DEMO.', 'Fill a limit buy of 10 DEMO at 100.70.'] },
        { kind: 'callout', callout: 'fictional-data', text: 'Practice book only. No real orders.' },
      ],
      glossaryRefs: ['partial-fill'],
    },
    {
      id: 'T07-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Market orders buy speed and pay with uncertain price. Limit orders buy price control and pay with uncertain filling. Stop orders wait for a trigger, and a trigger is not a fill.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Market: now, price can slip.', 'Limit: your price or better, may not fill.', 'Stop: waits for a trigger; triggered is not filled.', 'Gaps can push stop fills far from the trigger.'] },
      ],
      glossaryRefs: ['market-order', 'limit-order', 'trigger-price'],
    },
  ],

  notesSections: [
    {
      id: 'T07-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'An [[order]] is your instruction to the [[exchange]]. The order type says how it should trade. A [[market-order|market order]] trades now against the best prices in the [[order-book|order book]]. A [[limit-order|limit order]] trades only at your price or better. A stop order waits for a [[trigger-price|trigger price]]: a [[stop-market-order|stop-market order]] then becomes a market order, and a [[stop-limit-order|stop-limit order]] becomes a limit order. When an order actually trades, that is a [[fill]].' },
        { kind: 'analogy', text: 'Hailing any taxi gets you moving now, whatever the fare (market). Booking only if the fare is 200 or less may leave you waiting (limit). Telling a friend “if it starts raining, call me a taxi” is a stop: the rain is the trigger, and the fare is still unknown.' },
      ],
    },
    {
      id: 'T07-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'The same idea can end at very different prices depending on the order type. Choosing a market order in a thin, fast market can cost [[slippage]]. Choosing a limit order can mean missing the move entirely. Stop orders are often used to close a [[position]] automatically, so knowing that they can fill worse than the trigger is basic protection.' },
      ],
    },
    {
      id: 'T07-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: market buy sweeps the book (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Asks: 2 DEMO at 100.10, 3 at 100.20, 5 at 100.40. You send a market buy of 6 DEMO.' },
            { text: 'Fills: 2 × 100.10 + 3 × 100.20 + 1 × 100.40', result: '601.20 USDT' },
            { text: 'Average fill price = 601.20 ÷ 6', result: '100.20 USDT' },
            { text: 'Slippage = 100.20 − best ask 100.10', result: '0.10 USDT per DEMO' },
          ],
          conclusion: 'All 6 DEMO filled, but at an average 0.10 above the best price you saw.',
        },
        {
          kind: 'worked-example', title: 'Example 2: limit buy is only partly filled (same book)', fictional: true,
          steps: [
            { text: 'You send a buy limit of 6 DEMO at 100.20.' },
            { text: 'Levels at 100.20 or lower hold 2 + 3', result: '5 DEMO filled' },
            { text: 'Average = (2 × 100.10 + 3 × 100.20) ÷ 5', result: '100.16 USDT' },
          ],
          conclusion: 'A [[partial-fill|partial fill]]: 1 DEMO waits in the book because nobody sells at 100.20 or lower. Slippage is only 0.06, but the order is not complete.',
        },
        {
          kind: 'formula', expression: 'average fill price = Σ(price × quantity filled) ÷ total quantity filled; slippage per unit = average fill − best price (buy)',
          variables: [
            { symbol: 'price, quantity', meaning: 'each order-book level your order traded with', unit: 'USDT per DEMO, DEMO' },
            { symbol: 'best price', meaning: 'best ask when a buy was sent (best bid for a sell)', unit: 'USDT per DEMO' },
          ],
        },
      ],
    },
    {
      id: 'T07-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Ask first: is speed or price more important right now? Speed points to market; price points to limit.',
          'If the order has a price but no trigger, it is a limit order. It may sit unfilled.',
          'If it has a trigger, it is a stop order. Check whether it becomes market (stop-market) or limit (stop-limit) after triggering.',
          'After sending, check the status: waiting, triggered, partially filled or filled. Only filled quantity changes your position.',
          'For example on Binance, order forms show these types, but layouts and labels change over time; this course uses a generic mock only.',
        ] },
      ],
    },
    {
      id: 'T07-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Believing a stop guarantees the trigger price', text: 'The trigger only sends the order. In a [[price-gap|price gap]] a stop-market can fill far beyond the trigger, and a stop-limit may not fill at all.' },
        { kind: 'callout', callout: 'mistake', title: 'Thinking a limit order always trades', text: 'If price never reaches your limit, nothing happens. Check whether it is still waiting.' },
        { kind: 'callout', callout: 'mistake', title: 'Using big market orders on a thin book', text: 'Large size against little [[liquidity]] walks up the book and increases slippage.' },
      ],
    },
    {
      id: 'T07-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'No order type guarantees both a fill and a price. Market and stop-market orders can slip, especially in fast moves; limit and stop-limit orders can stay unfilled. Not placing an order, or waiting, is always allowed.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T07-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Order types and their trade-offs', headers: ['Type', 'Controls', 'Gives up'], rows: [
          ['Market', 'timing (now)', 'exact price; can slip'],
          ['Limit', 'worst price', 'certainty of filling'],
          ['Stop-market', 'when it starts (trigger)', 'exact fill price; can slip in gaps'],
          ['Stop-limit', 'trigger and worst price', 'certainty of filling after trigger'],
        ] },
      ],
    },
    {
      id: 'T07-N08', heading: 'learn-more', title: 'Learn more: which price wakes a stop?', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Futures exchanges often let you choose whether a stop watches the last traded price or the [[mark-price|mark price]]. The two can differ for a moment, so a stop may trigger slightly earlier or later than you expect. Some platforms also offer extra options such as “post-only” limit orders or time-in-force settings; names and availability vary by exchange and change over time, so always read the current help pages before relying on them.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T07-A01', type: 'order-placement', durationMs: 25_000,
      parameters: { variant: 'market-vs-limit', path: [100.0, 100.3, 100.6, 100.4, 100.7, 100.9], slippage: 0.05, orders: [
        { label: 'Market buy', type: 'market', side: 'buy' },
        { label: 'Limit buy 99.50', type: 'limit', side: 'buy', price: 99.5 },
      ] },
      caption: 'Price starts at 100.00. The market buy fills at once at 100.05; price then rises to 100.90 and the limit buy at 99.50 is still waiting, **unfilled**.',
      narration: 'The market order trades immediately, paying a little extra. The limit order refuses to pay more than 99.50, and price never comes down, so it never fills.',
      reducedMotionDescription: 'Fictional DEMO/USDT path: 100.00, 100.30, 100.60, 100.40, 100.70, 100.90. A market buy fills immediately at 100.05 (0.05 of slippage). A limit buy at 99.50 never fills because price never trades at 99.50 or lower.',
      glossaryRefs: ['market-order', 'limit-order'],
    },
    {
      id: 'T07-A02', type: 'order-placement', durationMs: 25_000,
      parameters: { variant: 'market-vs-limit', path: [100.0, 99.8, 99.6, 99.45, 99.7, 100.1], slippage: 0.05, orders: [
        { label: 'Market buy', type: 'market', side: 'buy' },
        { label: 'Limit buy 99.50', type: 'limit', side: 'buy', price: 99.5 },
      ] },
      caption: 'Another path: the market buy again fills at 100.05. This time price dips to 99.45, so the limit buy **fills at 99.50**, then price climbs back to 100.10.',
      narration: 'Same two orders, different path. When price trades down through 99.50, the limit order fills at its limit price.',
      reducedMotionDescription: 'Fictional path: 100.00, 99.80, 99.60, 99.45, 99.70, 100.10. The market buy fills at the start at 100.05. The limit buy at 99.50 fills when price dips to 99.45. Whether a limit fills depends on the path, which nobody knows in advance.',
      glossaryRefs: ['limit-order', 'fill'],
    },
    {
      id: 'T07-A03', type: 'order-book-matching', durationMs: 30_000,
      parameters: { variant: 'market-sweep',
        asks: [{ price: 100.1, quantity: 2 }, { price: 100.2, quantity: 3 }, { price: 100.4, quantity: 5 }],
        bids: [{ price: 100.0, quantity: 3 }, { price: 99.9, quantity: 4 }, { price: 99.7, quantity: 5 }],
        incoming: { side: 'buy', quantity: 6 } },
      caption: 'A market buy of 6 DEMO eats the asks: 2 at 100.10, 3 at 100.20, then 1 at 100.40. Filled 6, average price rises to 100.20.',
      narration: 'Watch the ask bars shrink level by level. Each level is a little more expensive, so the average climbs above the best ask.',
      reducedMotionDescription: 'Fictional book: asks 2 at 100.10, 3 at 100.20, 5 at 100.40; bids 3 at 100.00, 4 at 99.90, 5 at 99.70. A market buy of 6 DEMO fills 2 at 100.10, 3 at 100.20 and 1 at 100.40. Average 100.20, which is 0.10 above the best ask (slippage).',
      glossaryRefs: ['market-order', 'slippage'],
    },
    {
      id: 'T07-A04', type: 'order-book-matching', durationMs: 30_000,
      parameters: { variant: 'limit-partial-fill',
        asks: [{ price: 100.1, quantity: 2 }, { price: 100.2, quantity: 3 }, { price: 100.4, quantity: 5 }],
        bids: [{ price: 100.0, quantity: 3 }, { price: 99.9, quantity: 4 }, { price: 99.7, quantity: 5 }],
        incoming: { side: 'buy', quantity: 6, limitPrice: 100.2 } },
      caption: 'A limit buy of 6 DEMO at 100.20 takes 2 at 100.10 and 3 at 100.20, then stops: 5 filled at an average of 100.16, 1 left waiting.',
      narration: 'The limit refuses the 100.40 level. The order is partly filled; the rest rests in the book until someone sells at 100.20 or lower.',
      reducedMotionDescription: 'Same fictional book. A limit buy of 6 DEMO at 100.20 fills 5 DEMO (2 at 100.10, 3 at 100.20) at an average of 100.16. One DEMO is not filled and waits in the book. This is a partial fill.',
      glossaryRefs: ['partial-fill', 'limit-order'],
    },
    {
      id: 'T07-A05', type: 'order-placement', durationMs: 30_000,
      parameters: { variant: 'stop-trigger', path: [100.0, 99.6, 99.3, 99.05, 98.9, 98.7], orders: [
        { label: 'Sell stop-market 99.00', type: 'stop-market', side: 'sell', trigger: 99.0 },
        { label: 'Sell stop-limit 99.00 / 98.95', type: 'stop-limit', side: 'sell', trigger: 99.0, limit: 98.95 },
      ] },
      caption: 'Price slides from 100.00 to 98.90 and both stops trigger. The stop-market fills at 98.90 (0.10 below its trigger); the stop-limit, limit 98.95, stays **triggered, not filled** as price falls to 98.70.',
      narration: 'The trigger wakes both orders at the same moment. What happens next depends on the order type, not on the trigger.',
      reducedMotionDescription: 'Fictional path: 100.00, 99.60, 99.30, 99.05, 98.90, 98.70. Both sell stops have trigger 99.00 and trigger when 98.90 trades. The stop-market fills at 98.90, 0.10 worse than the trigger. The stop-limit has limit 98.95; price never trades back at 98.95 or higher, so it is triggered but not filled.',
      glossaryRefs: ['trigger-price', 'stop-market-order', 'stop-limit-order'],
    },
    {
      id: 'T07-A06', type: 'order-placement', durationMs: 30_000,
      parameters: { variant: 'slippage-jump', path: [100.0, 99.9, 99.8, 98.6, 98.4, 98.5], orders: [
        { label: 'Sell stop-market 99.50', type: 'stop-market', side: 'sell', trigger: 99.5 },
        { label: 'Sell stop-limit 99.50 / 99.40', type: 'stop-limit', side: 'sell', trigger: 99.5, limit: 99.4 },
      ] },
      caption: 'A sudden **price gap**: 99.80 jumps straight to 98.60. The stop-market fills at 98.60, 0.90 below its 99.50 trigger; the stop-limit (limit 99.40) triggers but does not fill.',
      narration: 'No trades happened between 99.80 and 98.60. The stop could not fill at 99.50 because nobody traded there.',
      reducedMotionDescription: 'Fictional path: 100.00, 99.90, 99.80, then a gap to 98.60, 98.40, 98.50. A sell stop-market with trigger 99.50 fills at 98.60: 0.90 of slippage. A sell stop-limit with trigger 99.50 and limit 99.40 triggers but never fills, because price stays below 99.40.',
      glossaryRefs: ['price-gap', 'slippage'],
    },
    {
      id: 'T07-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Choosing an order type', items: ['Is speed or price more important?', 'How thin is the book for my size?', 'Do I need a trigger?', 'Am I OK if it never fills?'] },
      caption: 'Four questions, revealed one by one, to ask before choosing market, limit or stop.',
      reducedMotionDescription: 'Checklist: is speed or price more important; how thin is the order book for my size; do I need a trigger; am I OK if the order never fills.',
    },
    {
      id: 'T07-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'No order type guarantees everything', items: ['Market and stop-market orders can slip.', 'Limit and stop-limit orders can stay unfilled.', 'A trigger is not a fill price.', 'Waiting is always allowed.'] },
      caption: 'Safety: each order type gives up either price certainty or fill certainty.',
      reducedMotionDescription: 'Warning card: market and stop-market orders can slip; limit and stop-limit orders can stay unfilled; a trigger is not a fill price; waiting is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T07-X01', type: 'classify', title: 'Pick the order type',
      fixtureId: 'FX-T07-CHOOSE-01',
      instructions: 'Read each fictional situation and choose the order type that best matches what the trader cares about. After checking, read the trade-off note for each one.',
      steps: [
        { id: 'T07-X01-01', prompt: 'For each situation, ask: does speed, a price limit, or a trigger matter most?', hint: 'Speed → market. A worst acceptable price → limit. “If price reaches X, then act” → a stop order.' },
        { id: 'T07-X01-02', prompt: 'Among the stop situations, decide whether the trader wants to get out at any price, or only at a limit.', hint: '“Even if it means not selling” points to stop-limit.' },
        { id: 'T07-X01-03', prompt: 'Place all six, then press Check and read each trade-off.', hint: 'Two situations belong to each of market and limit; one to each stop type.' },
      ],
      allowedControls: ['choice', 'tap-select', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'close-now', text: 'You must close a small fictional DEMO position right now and accept the current price.' },
          { id: 'buy-dip', text: 'You want to buy DEMO only at 98.00 or lower, and you are fine if it never happens.' },
          { id: 'exit-auto', text: 'You hold a long. If price falls to 95.00, you want a sell sent automatically, at whatever price is available.' },
          { id: 'thin-book', text: 'The book is thin and you refuse to pay more than 100.20 for your buy.' },
          { id: 'exit-floor', text: 'If price falls to 99.00 you want to sell, but never below 98.80, even if that means not selling.' },
          { id: 'speed-first', text: 'A practice sell where finishing quickly matters more than a few cents of price.' },
        ],
        buckets: [
          { id: 'market', label: 'Market order' },
          { id: 'limit', label: 'Limit order' },
          { id: 'stop-market', label: 'Stop-market order' },
          { id: 'stop-limit', label: 'Stop-limit order' },
        ],
        itemFeedback: {
          'close-now': 'Market: it fills now, but the price is whatever the book offers, so it can slip.',
          'buy-dip': 'Limit: you control the price (98.00 or better), but the order may wait forever.',
          'exit-auto': 'Stop-market: triggers at 95.00 and then takes the best available price. In a fast fall it can fill well below 95.00.',
          'thin-book': 'Limit: caps the price at 100.20, but on a thin book it may only partly fill.',
          'exit-floor': 'Stop-limit: triggers at 99.00 but will not sell below 98.80. If price gaps under 98.80, the position stays open.',
          'speed-first': 'Market: speed first. The cost is possible slippage, usually small on a liquid book and larger on a thin one.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { market: ['close-now', 'speed-first'], limit: ['buy-dip', 'thin-book'], 'stop-market': ['exit-auto'], 'stop-limit': ['exit-floor'] } },
      explanation: 'Market buys speed and pays with uncertain price. Limit buys price control and pays with uncertain filling. Stop orders add a trigger; after it, they behave like a market or limit order, with the same trade-offs.',
      fictionalDataLabel: 'Fictional DEMO/USDT situations for practice only.',
    },
    {
      id: 'T07-X02', type: 'order-match', title: 'Fill a market buy',
      fixtureId: 'FX-T07-BOOK-02', simulatorId: 'orders.fill',
      instructions: 'Your fictional order is a market buy of 10 DEMO. The asks are 4 DEMO at 100.50, 4 at 100.70 and 5 at 101.00. Tick the levels it would use, then work out the result to 2 decimal places.',
      steps: [
        { id: 'T07-X02-01', prompt: 'Tick the ask levels the order takes, best price first, until 10 DEMO are covered.', hint: '4 + 4 = 8, so you need 2 more from the 101.00 level.' },
        { id: 'T07-X02-02', prompt: 'Work out the average fill price: total cost ÷ 10.', hint: '4 × 100.50 + 4 × 100.70 + 2 × 101.00 = 1,006.80 USDT.' },
        { id: 'T07-X02-03', prompt: 'Slippage per DEMO = average fill − best ask (100.50).', hint: '100.68 − 100.50' },
      ],
      allowedControls: ['tap-select', 'numeric-input', 'reset', 'hint'],
      parameters: { side: 'buy', quantity: 10, book: [{ price: 100.5, quantity: 4 }, { price: 100.7, quantity: 4 }, { price: 101.0, quantity: 5 }] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'filledQuantity', label: 'Filled quantity', value: 10, tolerance: 0.5, unit: 'DEMO', rounding: { decimals: 0 } },
        { key: 'averagePrice', label: 'Average fill price', value: 100.68, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'slippagePerUnit', label: 'Slippage per DEMO', value: 0.18, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      ] },
      explanation: 'All 10 DEMO fill: 4 at 100.50, 4 at 100.70 and 2 at 101.00, costing 1,006.80 USDT, an average of 100.68. That is 0.18 per DEMO worse than the best ask: the price of speed on this thin fictional book.',
      fictionalDataLabel: 'Fictional DEMO/USDT order book for practice only.',
    },
    {
      id: 'T07-X03', type: 'order-match', title: 'Fill a limit buy',
      fixtureId: 'FX-T07-BOOK-02', simulatorId: 'orders.fill',
      instructions: 'Same fictional book. This time you send a limit buy of 10 DEMO at 100.70. Tick the levels it may use, then find what fills and what is left.',
      steps: [
        { id: 'T07-X03-01', prompt: 'Tick only the levels at 100.70 or lower.', hint: '101.00 is above your limit, so it cannot be used.' },
        { id: 'T07-X03-02', prompt: 'How many DEMO fill, and how many stay waiting?', hint: '4 + 4 fill; 10 − 8 wait.' },
        { id: 'T07-X03-03', prompt: 'Average fill price of the filled part.', hint: '(4 × 100.50 + 4 × 100.70) ÷ 8' },
      ],
      allowedControls: ['tap-select', 'numeric-input', 'reset', 'hint'],
      parameters: { side: 'buy', quantity: 10, limitPrice: 100.7, book: [{ price: 100.5, quantity: 4 }, { price: 100.7, quantity: 4 }, { price: 101.0, quantity: 5 }] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'filledQuantity', label: 'Filled quantity', value: 8, tolerance: 0.5, unit: 'DEMO', rounding: { decimals: 0 } },
        { key: 'remainingQuantity', label: 'Still waiting', value: 2, tolerance: 0.5, unit: 'DEMO', rounding: { decimals: 0 } },
        { key: 'averagePrice', label: 'Average fill price', value: 100.6, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      ] },
      explanation: 'The limit protects the price: 8 DEMO fill at an average of 100.60, better than the market order’s 100.68. The cost is certainty: 2 DEMO stay unfilled and may never fill.',
      fictionalDataLabel: 'Fictional DEMO/USDT order book for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T07-F01', name: 'Order fill against a book', expression: 'average fill price = Σ(level price × quantity taken) ÷ filled quantity; slippage per unit = average fill − best price (buy) or best price − average fill (sell)',
      variables: [
        { symbol: 'level price, quantity taken', meaning: 'each order-book level the order trades with, best first', unit: 'USDT per DEMO, DEMO' },
        { symbol: 'limitPrice', meaning: 'optional worst acceptable price; levels beyond it are not used', unit: 'USDT per DEMO' },
      ],
      simulatorId: 'orders.fill', approximate: false,
      workedExamples: [
        { label: 'Market sweep (scene T07-A03, notes example 1)', inputs: { quantity: 6, p1: 100.1, q1: 2, p2: 100.2, q2: 3, p3: 100.4, q3: 5 }, outputs: { filledQuantity: 6, remainingQuantity: 0, averagePrice: 100.2, slippagePerUnit: 0.1 }, tolerance: 1e-9, assumptions: ['fictional order book', 'fees excluded'] },
        { label: 'Limit partial fill (scene T07-A04, notes example 2)', inputs: { quantity: 6, p1: 100.1, q1: 2, p2: 100.2, q2: 3, p3: 100.4, q3: 5, limitPrice: 100.2 }, outputs: { filledQuantity: 5, remainingQuantity: 1, averagePrice: 100.16, slippagePerUnit: 0.06 }, tolerance: 1e-9, assumptions: ['fictional order book', 'fees excluded'] },
        { label: 'Market buy (exercise T07-X02)', inputs: { quantity: 10, p1: 100.5, q1: 4, p2: 100.7, q2: 4, p3: 101, q3: 5 }, outputs: { filledQuantity: 10, averagePrice: 100.68, slippagePerUnit: 0.18 }, tolerance: 1e-9, assumptions: ['fictional order book', 'fees excluded'] },
        { label: 'Limit buy (exercise T07-X03)', inputs: { quantity: 10, p1: 100.5, q1: 4, p2: 100.7, q2: 4, p3: 101, q3: 5, limitPrice: 100.7 }, outputs: { filledQuantity: 8, remainingQuantity: 2, averagePrice: 100.6 }, tolerance: 1e-9, assumptions: ['fictional order book', 'fees excluded'] },
        { label: 'Market sell (quiz T07-Q02)', side: 'short', inputs: { quantity: 5, p1: 200, q1: 2, p2: 199.8, q2: 2, p3: 199.4, q3: 4 }, outputs: { filledQuantity: 5, averagePrice: 199.8, slippagePerUnit: 0.2 }, tolerance: 1e-9, assumptions: ['fictional order book', 'fees excluded'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T07-Q01', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T07',
      prompt: 'Fictional DEMO trades at 100.00. You place a buy limit at 99.50. Over the next hour price rises to 101.00 and never trades at 99.50 or lower. What happened to your order?',
      choices: [
        { id: 'a', text: 'Nothing filled. The limit order is still waiting (unless you cancelled it).' },
        { id: 'b', text: 'It filled at 100.00, the price when you placed it.' },
        { id: 'c', text: 'It filled at 101.00, because limit orders follow the price.' },
        { id: 'd', text: 'It turned into a market order after one hour.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A buy limit only trades at its limit price or lower. Price never came down to 99.50, so there was no fill.',
      misconceptionFeedback: {
        b: 'A buy limit at 99.50 will not pay 100.00. That would be worse than your limit.',
        c: 'Limit orders do not follow price. They stay at their price until filled or cancelled.',
        d: 'An ordinary limit order does not convert itself into a market order.',
      },
      learningOutcome: 'Recognise that a limit order controls price and can remain unfilled.',
      remediationRef: { lessonId: 'T07', anchorId: 'T07-N01' },
      shuffleChoices: true,
    },
    {
      id: 'T07-Q02', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T07',
      prompt: 'You send a fictional market sell of 5 DEMO. The bids are 2 DEMO at 200.00, 2 at 199.80 and 4 at 199.40. What is your average fill price in USDT?',
      answer: { kind: 'numeric', value: 199.8, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: '2 × 200.00 + 2 × 199.80 + 1 × 199.40 = 999.00 USDT for 5 DEMO, an average of 199.80. That is 0.20 below the best bid of 200.00 (slippage).',
      learningOutcome: 'Compute the average fill price of a market order across several book levels.',
      remediationRef: { lessonId: 'T07', anchorId: 'T07-N03' },
    },
    {
      id: 'T07-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T07', safetyCritical: true, safetyTopic: 'execution',
      prompt: 'A learner says: “I placed a sell stop-market with trigger 99.50, so the worst price I can get is 99.50.” Which reply is correct?',
      choices: [
        { id: 'a', text: 'Not true. The trigger only sends a market order. In a fast move or price gap it can fill well below 99.50.' },
        { id: 'b', text: 'True. A stop-market always fills exactly at its trigger.' },
        { id: 'c', text: 'True, as long as the exchange is open.' },
        { id: 'd', text: 'Not true, because a stop-market never fills.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A stop order’s trigger is not a guaranteed execution price. In the lesson’s gap example the stop at 99.50 filled at 98.60, 0.90 worse.',
      misconceptionFeedback: {
        b: 'No stop order guarantees its price. If no trades happen at 99.50, it fills at the next available price.',
        c: 'Being open does not help when price jumps over your trigger; the order still fills at the next available price.',
        d: 'A stop-market usually does fill once triggered; the issue is the price, not whether it fills.',
      },
      learningOutcome: 'State that stop orders do not guarantee the execution price.',
      remediationRef: { lessonId: 'T07', anchorId: 'T07-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T07-Q04', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T07', safetyCritical: true, safetyTopic: 'execution',
      prompt: 'You hold a fictional long position. Your sell stop-limit has trigger 99.50 and limit 99.40. Price gaps from 99.80 to 98.60 and keeps falling. What is your situation?',
      choices: [
        { id: 'a', text: 'The order triggered but did not fill, so the position is still open and the loss can keep growing.' },
        { id: 'b', text: 'The position closed at 99.50.' },
        { id: 'c', text: 'The position closed at 99.40, the limit.' },
        { id: 'd', text: 'The stop never triggered because price did not touch 99.50 exactly.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Trading below 99.50 triggers the order, but as a limit sell it will not accept less than 99.40. Price is below that, so nothing fills.',
      misconceptionFeedback: {
        b: 'Nobody traded at 99.50 after the gap, and the order’s limit is 99.40 anyway.',
        c: 'A limit sell at 99.40 can only fill if a buyer pays 99.40 or more. After the gap, nobody does.',
        d: 'A sell stop triggers when price is at or below the trigger. Trading at 98.60 counts.',
      },
      learningOutcome: 'Distinguish triggered from filled for a stop-limit order.',
      remediationRef: { lessonId: 'T07', anchorId: 'T07-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T07-Q05', type: 'single', cognitiveTag: 'application', linkedLessonId: 'T07',
      prompt: 'On a thin fictional book you want to buy 50 DEMO but refuse to pay more than 100.30. Which order type matches that, and what is its trade-off?',
      choices: [
        { id: 'a', text: 'A limit buy at 100.30: price is capped, but it may fill only partly or not at all.' },
        { id: 'b', text: 'A market buy: it caps the price at 100.30.' },
        { id: 'c', text: 'A buy stop-market at 100.30: it guarantees all 50 DEMO at 100.30.' },
        { id: 'd', text: 'Any order type works the same on a thin book.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Only a limit order sets a worst acceptable price. On a thin book there may not be 50 DEMO offered at 100.30 or lower, so a partial fill is likely.',
      misconceptionFeedback: {
        b: 'A market order has no price cap; on a thin book it can walk far up the asks.',
        c: 'A buy stop-market waits for price to rise to 100.30 and then buys at market, with no price cap and no guarantee.',
        d: 'Thin books make the difference bigger: market orders slip more and limit orders fill less.',
      },
      learningOutcome: 'Choose an order type from the trader’s priority and state its trade-off.',
      remediationRef: { lessonId: 'T07', anchorId: 'T07-N07' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Believing a stop order guarantees its trigger price.', correction: 'The trigger only sends the order. Stop-market fills can be worse; stop-limit orders may not fill at all.' },
    { mistake: 'Assuming a limit order will always trade.', correction: 'A limit order waits for your price. If price never gets there, it stays unfilled.' },
    { mistake: 'Sending a large market order into a thin order book.', correction: 'Check how much quantity sits near the best price; larger size means more slippage.' },
  ],
  takeaways: [
    'Market orders choose speed: they fill now, but the price can slip.',
    'Limit orders choose price: your price or better, but they can stay unfilled or fill only partly.',
    'Stop orders wait for a trigger; triggered is not filled, and no stop guarantees its price.',
  ],
  reviewCard: {
    keyTermIds: ['market-order', 'limit-order', 'slippage'],
    safetyNote: 'No order type guarantees both a fill and a price. Stops can slip in fast moves and gaps; limits can stay unfilled.',
    reviewMinutes: 4,
    retrievalQuestion: 'A sell stop-market has trigger 50.00 and price gaps from 50.40 to 49.20. Roughly where does it fill, and why?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T07-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
