import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices and order books in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data, and the screens are generic educational mocks, not any real exchange.';

const ASKS = [
  { price: 100.1, quantity: 1.5 },
  { price: 100.2, quantity: 2 },
  { price: 100.3, quantity: 4 },
];
const BIDS = [
  { price: 99.9, quantity: 2 },
  { price: 99.8, quantity: 3 },
  { price: 99.7, quantity: 5 },
];

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can explain that an exchange matches compatible buy and sell orders from an order book.',
    'Learner can read the best bid and best ask and calculate spread = best ask − best bid.',
    'Learner can spot phishing red flags and knows never to share passwords, OTP codes or API secret keys.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T04-S01', kind: 'cover-problem', title: 'Who sells to you when you press Buy?',
      narrationText: 'When you press Buy in a crypto app, someone must sell to you. You never meet them. The exchange is the meeting place that pairs your order with theirs.',
      blocks: [
        { kind: 'paragraph', text: 'When you press **Buy**, someone else must **sell**. You never meet them.' },
        { kind: 'paragraph', text: 'An [[exchange]] is the meeting place that matches their [[order]] with yours.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T04-A01' },
      glossaryRefs: ['exchange', 'order', 'buyer', 'seller'],
      speakerNotes: 'Connect to T02: buyers and sellers. The exchange does not set the price; matched orders do.',
    },
    {
      id: 'T04-S02', kind: 'key-definition', title: 'Bid, ask and the order book',
      narrationText: 'Waiting orders sit in an order book. Buy orders are called bids, sorted highest first. Sell orders are called asks, sorted lowest first. The best bid and the best ask face each other in the middle.',
      blocks: [
        { kind: 'list', ordered: false, items: ['**Bids**: waiting buy orders, highest price first.', '**Asks**: waiting sell orders, lowest price first.'] },
        { kind: 'definition', termId: 'order-book' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T04-A02' },
      glossaryRefs: ['order-book', 'bid', 'ask'],
    },
    {
      id: 'T04-S03', kind: 'visual-breakdown', title: 'Matching and the spread',
      narrationText: 'A trade happens only when a buyer’s price meets a seller’s price. The gap between the best ask and the best bid is the spread. In our fictional book it is 100.10 minus 99.90, which is 0.20 USDT.',
      blocks: [
        { kind: 'paragraph', text: 'A trade happens when a buy price **meets** a sell price.' },
        { kind: 'paragraph', text: '[[spread|Spread]] = best ask − best bid = 100.10 − 99.90 = **0.20 USDT** (fictional).' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T04-A03' },
      glossaryRefs: ['spread', 'bid', 'ask'],
    },
    {
      id: 'T04-S04', kind: 'worked-example', title: 'A market buy sweeps the asks',
      narrationText: 'A buy order for 3 DEMO at market takes all 1.5 at 100.10, then 1.5 more at 100.20. The average price is 100.15, a little worse than the best ask, because the first level was too small.',
      blocks: [
        {
          kind: 'worked-example', title: 'Buy 3 DEMO at market (fictional)', fictional: true,
          steps: [
            { text: '1.5 × 100.10', result: '150.15 USDT' },
            { text: '1.5 × 100.20', result: '150.30 USDT' },
            { text: 'Average = 300.45 ÷ 3', result: '100.15 USDT' },
          ],
          conclusion: 'Thin levels mean a bigger order pays more on average.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T04-A04' },
      glossaryRefs: ['liquidity', 'ask'],
    },
    {
      id: 'T04-S05', kind: 'risks-misunderstanding', title: 'Not a bank. Guard your keys.',
      narrationText: 'An exchange, for example Binance, is a private trading platform, not a bank. Nobody genuine will ever ask for your password, your one-time code or your API secret key. Messages that do are phishing.',
      blocks: [
        { kind: 'callout', callout: 'safety', title: 'An exchange is not a bank', text: 'Balances there are not bank deposits.' },
        { kind: 'callout', callout: 'safety', title: 'Never share', text: 'Passwords, OTP codes or API secret keys, with anyone, for any reason.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T04-A07' },
      glossaryRefs: ['exchange', 'account-security'],
    },
    {
      id: 'T04-S06', kind: 'guided-practice', title: 'Match an order, then spot the fake',
      narrationText: 'First, match one fictional buy order against the sell quotes and work out its average price. Then sort mock security messages into red flags and safer signs.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Match a fictional buy of 2 DEMO against the asks.', 'Find the spread of a small book.', 'Sort mock messages: phishing red flag or safer sign.'] },
        { kind: 'callout', callout: 'tip', text: 'Buy orders take asks, cheapest first.' },
      ],
      glossaryRefs: ['ask', 'account-security'],
    },
    {
      id: 'T04-S07', kind: 'recap', title: 'Recap: end of Phase 1',
      narrationText: 'An exchange matches orders from an order book. Bids are buyers, asks are sellers, and the spread is the gap. It is not a bank, and you never share your secrets. Next comes a short, non-gating Phase 1 review.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Exchange = meeting place that matches orders.', 'Bids buy, asks sell; spread = best ask − best bid.', 'Big market orders can fill at worse prices.', 'Not a bank; never share password, OTP or API secret.'] },
      ],
      glossaryRefs: ['exchange', 'spread', 'account-security'],
    },
  ],

  notesSections: [
    {
      id: 'T04-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'An [[exchange]] is a trading platform where [[buyer|buyers]] and [[seller|sellers]] send instructions called [[order|orders]]. Orders that cannot trade straight away wait in an [[order-book]]. Waiting buy orders are [[bid|bids]]; waiting sell orders are [[ask|asks]]. When a buy price meets a sell price, the exchange matches them and a trade is recorded. The gap between the lowest ask and the highest bid is the [[spread]].' },
        { kind: 'analogy', text: 'Picture a busy vegetable market with a notice board. Buyers pin notes saying “I will pay 99.90”. Sellers pin notes saying “I will sell at 100.10”. The market manager only shakes hands on a deal when a buyer and a seller agree on a price.' },
      ],
    },
    {
      id: 'T04-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'The price you actually pay comes from the order book, not from the big number at the top of the screen. If you buy at market you pay the ask; if you sell at market you receive the bid. A wide spread or thin [[liquidity]] makes trading cost more. And because an exchange holds your balance, protecting your login is as important as reading prices.' },
      ],
    },
    {
      id: 'T04-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: reading the spread (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Asks: 100.10 (1.5 DEMO), 100.20 (2 DEMO), 100.30 (4 DEMO).' },
            { text: 'Bids: 99.90 (2 DEMO), 99.80 (3 DEMO), 99.70 (5 DEMO).' },
            { text: 'Spread = 100.10 − 99.90', result: '0.20 USDT' },
          ],
          conclusion: 'If a new seller posts 1 DEMO at 100.00, the best ask becomes 100.00 and the spread shrinks to 0.10 USDT.',
        },
        {
          kind: 'worked-example', title: 'Example 2: matching a buy of 2 DEMO at market (fictional)', fictional: true,
          steps: [
            { text: 'Take all 1.5 DEMO at 100.10', result: '150.15 USDT' },
            { text: 'Take the remaining 0.5 DEMO at 100.20', result: '50.10 USDT' },
            { text: 'Average price = 200.25 ÷ 2', result: '100.125 USDT' },
          ],
          conclusion: 'Filled 2 DEMO at an average of 100.125 USDT, slightly above the best ask of 100.10.',
        },
        {
          kind: 'formula', expression: 'spread = best ask − best bid',
          variables: [
            { symbol: 'best ask', meaning: 'lowest waiting sell price', unit: 'USDT per DEMO' },
            { symbol: 'best bid', meaning: 'highest waiting buy price', unit: 'USDT per DEMO' },
          ],
        },
      ],
    },
    {
      id: 'T04-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'In an order book, asks are usually shown above the middle and bids below. Colours and layouts vary between platforms, for example on Binance, and they change over time.',
          'The best ask is the lowest sell price; the best bid is the highest buy price. They sit next to the middle line.',
          'Spread = best ask − best bid. A small number means buyers and sellers are close together.',
          'A phishing message usually adds urgency, uses a look-alike address, or asks for a secret. A genuine exchange never needs your password, OTP or API secret key.',
        ] },
      ],
    },
    {
      id: 'T04-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Expecting to buy at the bid', text: 'A market buy takes the asks. The bid is what you can sell at.' },
        { kind: 'callout', callout: 'mistake', title: 'Thinking the whole order fills at the best price', text: 'Each level has a limited quantity. A bigger order moves to the next, worse level.' },
        { kind: 'callout', callout: 'mistake', title: 'Trusting a message because it looks official', text: 'Logos and names are easy to copy. Open the app or your own bookmark instead of clicking links.' },
      ],
    },
    {
      id: 'T04-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'An exchange is not a bank: balances held there are not bank deposits, and platforms can pause withdrawals or fail. Never share your password, OTP codes or API secret keys with anyone, including people who say they are support staff. This course never asks for them.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T04-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Exchange words (fictional DEMO/USDT)', headers: ['Word', 'Meaning', 'Example'], rows: [
          ['Bid', 'waiting buy order', '99.90 for 2 DEMO'],
          ['Ask', 'waiting sell order', '100.10 for 1.5 DEMO'],
          ['Spread', 'best ask − best bid', '0.20 USDT'],
          ['Market buy', 'takes asks, cheapest first', '3 DEMO averages 100.15'],
          ['Security', 'never share secrets', 'password, OTP, API secret'],
        ] },
      ],
    },
    {
      id: 'T04-N08', heading: 'learn-more', title: 'Learn more: who runs the matching', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'A centralised exchange runs a computer program called a matching engine. It keeps the order book in price order and, at the same price, usually serves the earliest order first. Your balance on the exchange is a record in the company’s system, which is why the company’s health and your login security both matter.' },
        { kind: 'paragraph', text: 'Rules for exchanges differ by country; check current local rules and get qualified advice. Screens and product names on real platforms change often, so this course uses generic mocks.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T04-A01', type: 'order-book-matching', durationMs: 20_000,
      parameters: { variant: 'empty-book', bids: [{ price: 99.9, quantity: 2 }], asks: [{ price: 100.1, quantity: 1.5 }] },
      caption: 'The meeting place opens: one fictional buyer waits at 99.90 and one seller at 100.10. No trade yet.',
      narration: 'Orders arrive at the exchange. A buyer offers 99.90, a seller asks 100.10. Their prices do not meet, so they wait.',
      reducedMotionDescription: 'A fictional order book with one bid (99.90 for 2 DEMO) and one ask (100.10 for 1.5 DEMO). The prices do not meet, so nothing trades; the gap is 0.20.',
      glossaryRefs: ['exchange', 'order'],
    },
    {
      id: 'T04-A02', type: 'order-book-matching', durationMs: 30_000,
      parameters: { variant: 'bid-ask-spread', bids: BIDS, asks: ASKS },
      caption: 'More orders fill the book. The best ask 100.10 and best bid 99.90 face each other: **spread 0.20**.',
      narration: 'Asks stack up from the lowest price, bids from the highest. The gap in the middle is highlighted.',
      reducedMotionDescription: 'Fictional book. Asks: 100.10 (1.5), 100.20 (2), 100.30 (4). Bids: 99.90 (2), 99.80 (3), 99.70 (5). Spread = 100.10 − 99.90 = 0.20 USDT.',
      glossaryRefs: ['order-book', 'bid', 'ask', 'spread'],
    },
    {
      id: 'T04-A03', type: 'order-book-matching', durationMs: 30_000,
      parameters: { variant: 'match', bids: BIDS, asks: ASKS, incoming: { side: 'buy', quantity: 1, limitPrice: 100.1 } },
      caption: 'A buyer arrives willing to pay 100.10 for 1 DEMO. It meets the best ask: 1 DEMO matches at 100.10, leaving 0.5 at that level.',
      narration: 'The buy price meets the sell price, so the exchange matches them. The ask level shrinks from 1.5 to 0.5.',
      reducedMotionDescription: 'A fictional buy order for 1 DEMO with a limit of 100.10 matches the best ask. Filled 1 DEMO at 100.10; the 100.10 ask level drops from 1.5 to 0.5 DEMO.',
      glossaryRefs: ['order', 'ask'],
    },
    {
      id: 'T04-A04', type: 'order-book-matching', durationMs: 30_000,
      parameters: { variant: 'market-sweep', bids: BIDS, asks: ASKS, incoming: { side: 'buy', quantity: 3 } },
      caption: 'A market buy of 3 DEMO empties the 100.10 level (1.5) and takes 1.5 at 100.20. Average price: 100.15.',
      narration: 'The first level is too small, so the order keeps climbing the asks until it is filled.',
      reducedMotionDescription: 'A fictional market buy for 3 DEMO takes 1.5 at 100.10 and 1.5 at 100.20. Total 300.45 USDT, average 100.15 USDT per DEMO.',
      glossaryRefs: ['liquidity'],
    },
    {
      id: 'T04-A05', type: 'order-book-matching', durationMs: 25_000,
      parameters: { variant: 'bid-ask-spread', bids: BIDS, asks: [{ price: 100, quantity: 1 }, ...ASKS] },
      caption: 'A new seller posts 1 DEMO at 100.00. The best ask moves down and the spread shrinks from 0.20 to **0.10**.',
      narration: 'The spread is not fixed. Each new order can widen or narrow it.',
      reducedMotionDescription: 'A new fictional ask at 100.00 for 1 DEMO joins the book. Best ask 100.00, best bid 99.90, spread 0.10 USDT.',
      glossaryRefs: ['spread'],
    },
    {
      id: 'T04-A06', type: 'mock-terminal-tour', durationMs: 25_000,
      parameters: { areas: ['security', 'wallet', 'order-book', 'order-entry'], symbol: 'DEMO/USDT' },
      caption: 'A generic mock screen highlights four areas in turn: security settings, wallet balance, order book, order entry.',
      narration: 'Real platforms, for example Binance, arrange these differently and change layouts often. This is a generic educational mock.',
      reducedMotionDescription: 'Generic educational mock trading screen, not a real exchange. Highlighted in order: security settings, wallet balance, order book, order entry.',
      glossaryRefs: ['order-book', 'account-security'],
    },
    {
      id: 'T04-A07', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'red-flags', heading: 'Phishing red flags', items: ['Asks for your password, OTP or API secret key.', 'Urgent threat: “account closed in 1 hour”.', 'Look-alike web address or unknown sender.', 'Link instead of opening the app yourself.'] },
      caption: 'Red flags appear one by one: any request for a secret is phishing.',
      reducedMotionDescription: 'Phishing red flags: asks for your password, OTP or API secret key; urgent threats; look-alike web address or unknown sender; a link instead of opening the app yourself.',
      glossaryRefs: ['account-security'],
    },
    {
      id: 'T04-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'An exchange is not a bank', items: ['Balances are not bank deposits.', 'Withdrawals can be paused; platforms can fail.', 'Never share password, OTP or API secret key.'] },
      caption: 'Safety card fills in: not a bank, platform risk, and secrets stay secret.',
      reducedMotionDescription: 'Warning card: exchange balances are not bank deposits; withdrawals can be paused and platforms can fail; never share your password, OTP or API secret key.',
      glossaryRefs: ['exchange', 'account-security'],
    },
  ],

  exercises: [
    {
      id: 'T04-X01', type: 'order-match', title: 'Match a fictional buy order',
      fixtureId: 'FX-T04-BOOK-01', simulatorId: 'orders.fill',
      instructions: 'Your fictional order: buy 2 DEMO at market. Tick the sell quotes (asks) it would trade with, cheapest first, then enter how much filled and the average price.',
      steps: [
        { id: 'T04-X01-01', prompt: 'Tick the asks the order uses, starting from the best (lowest) price.', hint: 'The 100.10 level only has 1.5 DEMO, so you need part of the next level.' },
        { id: 'T04-X01-02', prompt: 'Enter the filled quantity.', hint: 'The book has more than 2 DEMO on the ask side, so the whole order fills.' },
        { id: 'T04-X01-03', prompt: 'Enter the average price (3 decimals).', hint: '(1.5 × 100.10 + 0.5 × 100.20) ÷ 2.' },
      ],
      allowedControls: ['choice', 'numeric-input', 'reset', 'hint'],
      parameters: { book: ASKS, side: 'buy', quantity: 2 },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'filledQuantity', label: 'Filled quantity', value: 2, tolerance: 0.05, unit: 'DEMO', rounding: { decimals: 1 } },
        { key: 'averagePrice', label: 'Average price', value: 100.125, tolerance: 0.0005, unit: 'USDT', rounding: { decimals: 3 } },
      ] },
      explanation: '1.5 DEMO at 100.10 = 150.15 USDT, plus 0.5 DEMO at 100.20 = 50.10 USDT. Total 200.25 ÷ 2 = 100.125 USDT average, a little above the best ask because the first level was too small.',
      fictionalDataLabel: 'Fictional DEMO/USDT order book for practice only.',
    },
    {
      id: 'T04-X02', type: 'classify', title: 'Phishing or genuine?',
      fixtureId: 'FX-T04-SECURITY-01',
      instructions: 'These are fictional mock messages and screens. Sort each into a phishing red flag or a safer sign.',
      steps: [
        { id: 'T04-X02-01', prompt: 'Ask of each item: does it want a secret, rush me, or send me through a link?', hint: 'Any request for a password, OTP or API secret key is a red flag.' },
        { id: 'T04-X02-02', prompt: 'Place every item, then press Check.', hint: 'Things you opened yourself, that ask for nothing, are safer signs.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'otp-request', text: 'Email: “Reply with your 6-digit OTP to verify your account.”' },
          { id: 'lookalike-link', text: 'A link to a web address with one letter changed from the exchange’s real name.' },
          { id: 'urgent-threat', text: 'SMS: “Your account will be closed in 1 hour unless you log in through this link.”' },
          { id: 'api-secret', text: 'A “support agent” in a chat asks for your API secret key to fix a problem.' },
          { id: 'own-bookmark', text: 'You open the exchange from your own saved bookmark or the official app you installed.' },
          { id: 'twofa-on', text: 'In settings you opened yourself, two-factor authentication shows as switched on.' },
          { id: 'known-alert', text: 'A login alert shows your own device and city, and asks you for nothing.' },
        ],
        buckets: [
          { id: 'phishing', label: 'Phishing red flag' },
          { id: 'genuine', label: 'Safer sign' },
        ],
        itemFeedback: {
          'otp-request': 'No genuine service asks you to send an OTP. The code is only for you to type into the app yourself.',
          'api-secret': 'An API secret key lets someone act on your account. Never share it, even with “support”.',
          'known-alert': 'An alert that only informs you, and asks for nothing, is a safer sign. Still open the app yourself to check.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { phishing: ['otp-request', 'lookalike-link', 'urgent-threat', 'api-secret'], genuine: ['own-bookmark', 'twofa-on', 'known-alert'] } },
      explanation: 'Red flags: requests for secrets, urgency, look-alike addresses and links you did not choose. Safer signs: you opened the app yourself, security features are on, and nothing asks for a secret.',
      fictionalDataLabel: 'Fictional, generic mock messages for practice only; not from any real exchange.',
    },
    {
      id: 'T04-X03', type: 'numeric-calculator', title: 'Find the spread',
      fixtureId: 'FX-T04-BOOK-01',
      instructions: 'A fictional order book shows a best bid of 249.50 USDT and a best ask of 250.25 USDT. Work out the spread.',
      steps: [
        { id: 'T04-X03-01', prompt: 'Which number is the best ask and which is the best bid?', hint: 'The ask is the lowest sell price; the bid is the highest buy price.' },
        { id: 'T04-X03-02', prompt: 'Spread = best ask − best bid. Enter it to 2 decimals.', hint: '250.25 − 249.50.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: { given: [
        { label: 'Best bid', value: 249.5, unit: 'USDT', decimals: 2 },
        { label: 'Best ask', value: 250.25, unit: 'USDT', decimals: 2 },
      ] },
      expectedEvaluation: { kind: 'numeric', value: 0.75, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      explanation: 'Spread = 250.25 − 249.50 = 0.75 USDT. Buying at the ask and selling straight back at the bid would lose this gap per DEMO, before any fees.',
      fictionalDataLabel: 'Fictional order book prices for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T04-F01', name: 'Matching a buy order against the asks', expression: 'average price = total USDT paid ÷ quantity filled, taking asks cheapest first',
      variables: [
        { symbol: 'p1, q1 … pN, qN', meaning: 'ask price and quantity at each level, best first', unit: 'USDT per DEMO, DEMO' },
        { symbol: 'quantity', meaning: 'size of the buy order', unit: 'DEMO' },
      ],
      simulatorId: 'orders.fill', approximate: false,
      workedExamples: [
        { label: 'Limit buy 1 at 100.10 (scene T04-A03)', inputs: { quantity: 1, limitPrice: 100.1, p1: 100.1, q1: 1.5, p2: 100.2, q2: 2, p3: 100.3, q3: 4 }, outputs: { filledQuantity: 1, averagePrice: 100.1, remainingQuantity: 0 }, tolerance: 1e-9, assumptions: ['fictional order book', 'fees excluded'] },
        { label: 'Market buy 3 (scene T04-A04, slide T04-S04)', inputs: { quantity: 3, p1: 100.1, q1: 1.5, p2: 100.2, q2: 2, p3: 100.3, q3: 4 }, outputs: { filledQuantity: 3, averagePrice: 100.15 }, tolerance: 1e-9, assumptions: ['fictional order book', 'fees excluded'] },
        { label: 'Market buy 2 (exercise T04-X01)', inputs: { quantity: 2, p1: 100.1, q1: 1.5, p2: 100.2, q2: 2, p3: 100.3, q3: 4 }, outputs: { filledQuantity: 2, averagePrice: 100.125 }, tolerance: 1e-9, assumptions: ['fictional order book', 'fees excluded'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T04-Q01', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T04', fixtureId: 'FX-T04-BOOK-01',
      prompt: 'A fictional book shows best bid 99.90 and best ask 100.10. You buy a small amount at market. Which price do you pay first?',
      choices: [
        { id: 'a', text: '100.10, the best ask.' },
        { id: 'b', text: '99.90, the best bid.' },
        { id: 'c', text: '100.00, halfway between them.' },
        { id: 'd', text: 'Any price you choose.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A buy matches with sellers. The cheapest waiting seller is the best ask, 100.10.',
      misconceptionFeedback: {
        b: '99.90 is a buyer’s price. You would receive the bid when selling, not pay it when buying.',
        c: 'Nobody is waiting to sell at 100.00, so a market buy cannot fill there.',
        d: 'A market order takes the best available price; it does not let you pick one.',
      },
      learningOutcome: 'Identify that a market buy trades at the ask.',
      remediationRef: { lessonId: 'T04', anchorId: 'T04-N02' },
      shuffleChoices: true,
    },
    {
      id: 'T04-Q02', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T04',
      prompt: 'A fictional book shows best bid 49.80 USDT and best ask 50.05 USDT. What is the spread in USDT?',
      answer: { kind: 'numeric', value: 0.25, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Spread = best ask − best bid = 50.05 − 49.80 = 0.25 USDT.',
      learningOutcome: 'Calculate the spread from the best bid and best ask.',
      remediationRef: { lessonId: 'T04', anchorId: 'T04-N03' },
    },
    {
      id: 'T04-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T04', safetyCritical: true, safetyTopic: 'account-security',
      prompt: 'You get a message that looks like it is from your exchange: “Suspicious activity! Send us the 6-digit code we just texted you within 10 minutes or your funds will be frozen.” What should you do?',
      choices: [
        { id: 'a', text: 'Do not send the code or click any link. Open the official app yourself to check, and report the message.' },
        { id: 'b', text: 'Send the code quickly, because the deadline is short.' },
        { id: 'c', text: 'Send only half the code to be safe.' },
        { id: 'd', text: 'Reply with your password instead of the code.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A genuine exchange never asks you to send an OTP, password or API secret key. Urgency plus a request for a secret is a classic phishing pattern.',
      misconceptionFeedback: {
        b: 'Urgency is a pressure trick. Sending the code can let an attacker log in or withdraw.',
        c: 'Any part of a secret helps an attacker. Share none of it.',
        d: 'Your password must never be shared with anyone, for any reason.',
      },
      learningOutcome: 'Refuse to share OTP codes and passwords, and verify through the official app.',
      remediationRef: { lessonId: 'T04', anchorId: 'T04-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T04-Q04', type: 'single', cognitiveTag: 'mistake-risk', linkedLessonId: 'T04', safetyCritical: true, safetyTopic: 'account-security',
      prompt: 'Which statement about keeping money on a crypto exchange is correct?',
      choices: [
        { id: 'a', text: 'An exchange is not a bank; balances are not bank deposits, withdrawals can be paused, and your login must be protected.' },
        { id: 'b', text: 'An exchange is a bank, so balances are protected exactly like a savings account.' },
        { id: 'c', text: 'If the exchange is large, nothing can go wrong.' },
        { id: 'd', text: 'Sharing an API secret key with a helpful stranger is fine if they say they work there.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'An exchange is a private trading platform. It can have outages, pauses or failures, and your account is only as safe as your security habits.',
      misconceptionFeedback: {
        b: 'Exchange balances are not bank deposits and may not have the same protections. Rules differ by country.',
        c: 'Size does not remove risk. Large platforms have paused withdrawals or failed before.',
        d: 'An API secret key lets someone act on your account. Never share it with anyone.',
      },
      learningOutcome: 'Explain that an exchange is not a bank and that secrets are never shared.',
      remediationRef: { lessonId: 'T04', anchorId: 'T04-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T04-Q05', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T04', fixtureId: 'FX-T04-BOOK-01',
      prompt: 'In the fictional book, a market buy of 3 DEMO averages 100.15 while the best ask is 100.10. Why?',
      choices: [
        { id: 'a', text: 'The 100.10 level only had 1.5 DEMO, so the rest filled at the next level, 100.20.' },
        { id: 'b', text: 'The exchange added a hidden 0.05 charge.' },
        { id: 'c', text: 'The bids moved up during the trade.' },
        { id: 'd', text: 'Market orders always pay 0.05 more than the best ask.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Each level holds a limited quantity. 1.5 at 100.10 and 1.5 at 100.20 average 100.15.',
      misconceptionFeedback: {
        b: 'Fees are separate and not part of this example. The difference comes from the order book levels.',
        c: 'A buy order takes asks, not bids. The bids do not affect this fill.',
        d: 'There is no fixed extra. It depends on how much quantity waits at each level.',
      },
      learningOutcome: 'Explain why a larger order can average a worse price than the best ask.',
      remediationRef: { lessonId: 'T04', anchorId: 'T04-N03' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Expecting a market buy to fill at the bid.', correction: 'Buys take the asks; sells take the bids.' },
    { mistake: 'Assuming the whole order fills at the best price.', correction: 'Each level has limited quantity; bigger orders reach worse levels.' },
    { mistake: 'Sharing an OTP or API secret key with “support”.', correction: 'Never share passwords, OTP codes or API secret keys. Open the official app yourself.' },
  ],
  takeaways: [
    'An exchange matches compatible buy and sell orders from its order book.',
    'Bids are buyers, asks are sellers; spread = best ask − best bid.',
    'An exchange is not a bank; never share your password, OTP or API secret key.',
  ],
  reviewCard: {
    keyTermIds: ['order-book', 'spread', 'account-security'],
    safetyNote: 'An exchange is not a bank. Never share your password, OTP codes or API secret keys with anyone.',
    reviewMinutes: 3,
    retrievalQuestion: 'Best bid 99.90, best ask 100.10 (fictional): what is the spread, and which side does a market buy take?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T04-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
