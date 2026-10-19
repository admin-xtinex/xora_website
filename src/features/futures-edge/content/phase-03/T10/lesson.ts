import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'Everything on the trading screen in this lesson is a fictional educational mock with DEMO/USDT prices. It is not a current, pixel-accurate screenshot of Binance or any exchange, shows no logos, uses no API keys and cannot place real orders.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can find the watchlist, symbol and last price, chart, order book, order-entry panel, positions panel, wallet balance and security settings on a generic trading screen.',
    'Learner can read one row of a positions panel: side, size, entry price, mark price and unrealized PnL.',
    'Learner can name three account-security habits (2FA, spotting phishing, never sharing API keys) and explain that KYC and regional availability depend on local rules.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T10-S01', kind: 'cover-problem', title: 'A busy screen, one area at a time',
      narrationText: 'A futures trading screen can look like an aeroplane cockpit. The good news: almost every platform has the same eight areas. We will learn them on a fictional mock, not a real exchange.',
      blocks: [
        { kind: 'paragraph', text: 'A trading screen looks crowded, but most platforms share the **same eight areas**.' },
        { kind: 'paragraph', text: 'We learn them on an [[educational-mock-terminal]]: fictional, simplified, never connected.' },
        { kind: 'callout', callout: 'fictional-data', text: 'Not a real screenshot. Layouts change; no logos, no real orders.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T10-A02' },
      glossaryRefs: ['educational-mock-terminal'],
      speakerNotes: 'Say “for example on Binance” at most. Stress that the mock teaches purposes of areas, not exact positions or labels.',
    },
    {
      id: 'T10-S02', kind: 'key-definition', title: 'The overall layout',
      narrationText: 'Top bar: wallet balance and security settings. Left: the watchlist. Middle: symbol, last price and chart, with positions below. Right: order book and order-entry panel.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          'Top: [[wallet-balance]] and security / settings.',
          'Left: [[watchlist]] of pairs.',
          'Middle: [[symbol]], [[last-price]], chart; [[positions-panel|positions]] below.',
          'Right: [[order-book]] and [[order-entry-panel]].',
        ] },
      ],
      visualRef: { kind: 'scene', sceneId: 'T10-A02' },
      glossaryRefs: ['wallet-balance', 'watchlist', 'last-price', 'order-entry-panel'],
    },
    {
      id: 'T10-S03', kind: 'visual-breakdown', title: 'Find the pair and the chart',
      narrationText: 'Pick DEMO/USDT in the watchlist. The symbol bar now shows its last price, 100.25 in our mock. The chart and the order book switch to the same pair.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Select **DEMO/USDT** in the watchlist.', 'Read the symbol bar: last price **100.25** (fictional).', 'Chart and order book now show the same pair.'] },
        { kind: 'callout', callout: 'tip', text: 'Always check the symbol before reading any number.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T10-A03' },
      glossaryRefs: ['watchlist', 'symbol', 'last-price'],
    },
    {
      id: 'T10-S04', kind: 'worked-example', title: 'Find and read a position',
      narrationText: 'The positions panel shows one fictional row: long 2 DEMO, entry 100.00, mark price 100.20. Unrealized PnL is 0.20 times 2, which is plus 0.40 USDT.',
      blocks: [
        {
          kind: 'worked-example', title: 'Mock positions row (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'LONG 2 DEMO · entry 100.00 · mark 100.20' },
            { text: 'Unrealized PnL = (100.20 − 100.00) × 2', result: '+0.40 USDT' },
          ],
          conclusion: 'Unrealized: it changes until the position is closed, and fees are not yet included.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T10-A05' },
      glossaryRefs: ['positions-panel', 'unrealized-pnl', 'mark-price'],
    },
    {
      id: 'T10-S05', kind: 'risks-misunderstanding', title: 'Security comes first',
      narrationText: 'Turn on two-factor authentication. Type the exchange address yourself instead of clicking links. Never share passwords, 2FA codes or API keys with anyone, including people claiming to be support.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Turn on [[two-factor-authentication|2FA]].', 'Spot [[phishing]]: type the address yourself.', 'Never share an [[api-access-key|API key]], password or 2FA code.'] },
        { kind: 'callout', callout: 'safety', text: '[[kyc|KYC]] and [[regional-availability]] differ by country. Check current local rules.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T10-A07' },
      glossaryRefs: ['two-factor-authentication', 'phishing', 'api-access-key', 'kyc', 'regional-availability'],
    },
    {
      id: 'T10-S06', kind: 'guided-practice', title: 'Hotspot hunt',
      narrationText: 'Now you try. The tool asks you to find one area at a time. Click it on the mock, or use the list of buttons under the picture if you prefer the keyboard.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Read the prompt above the mock.', 'Click the matching area, or pick it from the button list.', 'Wrong area? The tool names it; try again.'] },
      ],
      glossaryRefs: ['educational-mock-terminal'],
    },
    {
      id: 'T10-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Eight areas: watchlist, symbol and last price, chart, order book, order entry, positions, wallet and security. Layouts change, so learn purposes, not pixels. Protect the account first.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          'Eight areas; learn their purpose, not their pixel position.',
          'Check the symbol before reading numbers.',
          'Positions show unrealized PnL; it changes until closed.',
          '2FA on; no shared codes or API keys.',
        ] },
      ],
      glossaryRefs: ['positions-panel', 'two-factor-authentication'],
    },
  ],

  notesSections: [
    {
      id: 'T10-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'An [[exchange]] screen (for example on Binance) puts many tools on one page. This lesson uses an [[educational-mock-terminal]]: a generic, fictional screen with the eight areas most platforms share. It is **not** a current or pixel-accurate screenshot of any exchange, has no logos, and cannot send real orders.' },
        { kind: 'paragraph', text: 'The areas are: the [[watchlist]] (pairs you follow), the [[symbol]] bar with the [[last-price]], the chart, the [[order-book]], the [[order-entry-panel]], the [[positions-panel]], the [[wallet-balance]] and the security / settings menu.' },
        { kind: 'analogy', text: 'Think of a car dashboard. Different car models put the speedometer and fuel gauge in different places, but once you know what each gauge does, you can find it in any car.' },
      ],
    },
    {
      id: 'T10-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Reading the wrong area, or the wrong symbol, leads to wrong decisions. Knowing where positions, PnL and balance live helps you check what is really happening. Security matters even more: a stolen login or a shared key can empty an account no matter how well you trade.' },
      ],
    },
    {
      id: 'T10-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: reading the mock symbol bar (fictional)', fictional: true,
          steps: [
            { text: 'Watchlist: DEMO/USDT 100.25, TOY/USDT 4.12, MOCK/USDT 0.87.' },
            { text: 'Select DEMO/USDT. Symbol bar shows last price', result: '100.25 USDT' },
            { text: 'The same bar shows a mark price', result: '100.20 USDT' },
          ],
          conclusion: 'Last price is the latest trade; the mark price (lesson T06) is the reference many futures platforms use for unrealized PnL.',
        },
        {
          kind: 'worked-example', title: 'Example 2: one positions row (fictional)', fictional: true,
          steps: [
            { text: 'DEMO/USDT · LONG · 2 DEMO · entry 100.00 · mark 100.20.' },
            { text: 'Unrealized PnL = (100.20 − 100.00) × 2', result: '+0.40 USDT' },
            { text: 'Wallet balance in the top bar', result: '500.00 USDT' },
          ],
          conclusion: 'The +0.40 is [[unrealized-pnl|unrealized]]: it is not in the wallet balance until the position closes, and fees still apply.',
        },
      ],
    },
    {
      id: 'T10-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'A list of pairs with small prices beside them is a watchlist.',
          'The largest price next to the pair name is usually the last price.',
          'Two columns of prices and sizes, sellers above and buyers below, form the order book.',
          'A form with order type, price, quantity and a buy/sell button is the order-entry panel.',
          'A table with side, size, entry and PnL is the positions panel.',
          'Lock or profile icons usually lead to security settings.',
        ] },
      ],
    },
    {
      id: 'T10-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Expecting the real screen to match the mock', text: 'Platforms redesign often. Look for the purpose of an area, not its exact place or label.' },
        { kind: 'callout', callout: 'mistake', title: 'Confusing open orders with positions', text: 'An order waiting in the book has not filled. Only filled orders create positions.' },
        { kind: 'callout', callout: 'mistake', title: 'Trusting links in messages', text: 'Type the address yourself or use a saved bookmark. Look-alike sites copy real designs.' },
      ],
    },
    {
      id: 'T10-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Turn on [[two-factor-authentication|2FA]]. Never share passwords, 2FA codes or [[api-access-key|API keys]]; real support never asks for them, and this course never will. Treat urgent “verify now” messages as possible [[phishing]]. [[kyc|KYC]] and [[regional-availability]] differ by country: check current local rules and get qualified advice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T10-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'The eight areas of a generic trading screen', headers: ['Area', 'What you find there'], rows: [
          ['Watchlist', 'pairs you follow'],
          ['Symbol bar', 'pair name, last price'],
          ['Chart', 'price history'],
          ['Order book', 'waiting bids and asks'],
          ['Order entry', 'type, price, size, submit'],
          ['Positions', 'side, size, entry, unrealized PnL'],
          ['Wallet', 'balance'],
          ['Security', '2FA, devices, API settings'],
        ] },
      ],
    },
    {
      id: 'T10-N08', heading: 'learn-more', title: 'Learn more: why the course never connects to an exchange', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Connecting a learning tool to a real account would need an API key. Even a read-only key reveals private data, and a key with trading permission lets software place orders. A beginner course has no reason to hold such power, so everything here is simulated with fictional prices.' },
        { kind: 'paragraph', text: 'If you ever create an API key for software you trust, platforms usually let you limit its permissions and restrict it to certain IP addresses. Never enable withdrawals for a key you did not need to.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T10-A01', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'plain', heading: 'This is an educational mock', items: ['Generic and fictional, not a screenshot.', 'Real layouts change over time.', 'No logos, no API keys, no real orders.'] },
      caption: 'Three ground rules appear one by one before the tour starts.',
      reducedMotionDescription: 'Card: the screen in this lesson is a generic fictional mock, not a screenshot; real layouts change over time; there are no logos, no API keys and no real orders.',
      glossaryRefs: ['educational-mock-terminal'],
    },
    {
      id: 'T10-A02', type: 'mock-terminal-tour', durationMs: 40_000,
      parameters: { areas: ['watchlist', 'symbol', 'chart', 'order-book', 'order-entry', 'positions', 'wallet', 'security'], symbol: 'DEMO/USDT' },
      caption: 'The highlight moves through all 8 areas in turn, from the watchlist on the left to security in the top corner.',
      narration: 'Watchlist, symbol and last price, chart, order book, order entry, positions, wallet balance, and finally security settings.',
      reducedMotionDescription: 'A tour of the fictional screen, 8 steps: 1 watchlist (left), 2 symbol and last price (top middle), 3 chart (middle), 4 order book (top right), 5 order entry (lower right), 6 open positions and PnL (bottom middle), 7 wallet balance (top left), 8 security / settings (top right).',
      glossaryRefs: ['watchlist', 'order-entry-panel', 'positions-panel', 'wallet-balance'],
    },
    {
      id: 'T10-A03', type: 'mock-terminal-tour', durationMs: 25_000,
      parameters: { areas: ['watchlist', 'symbol'], symbol: 'DEMO/USDT' },
      caption: 'Step 1 lights the watchlist; step 2 moves to the symbol bar, where DEMO/USDT shows its last price.',
      narration: 'Choosing a pair in the watchlist loads it everywhere else. Check the symbol bar to confirm which pair you are looking at.',
      reducedMotionDescription: 'Highlight on the watchlist (DEMO/USDT 100.25, TOY/USDT 4.12, MOCK/USDT 0.87, fictional), then on the symbol bar showing DEMO/USDT with a last price of 100.25.',
      glossaryRefs: ['watchlist', 'symbol', 'last-price'],
    },
    {
      id: 'T10-A04', type: 'mock-terminal-tour', durationMs: 25_000,
      parameters: { areas: ['chart', 'order-book'], symbol: 'DEMO/USDT' },
      caption: 'The highlight moves from the chart to the order book beside it.',
      narration: 'The chart shows where price has been. The order book shows the bids and asks waiting right now.',
      reducedMotionDescription: 'Highlight on the chart (price history of DEMO/USDT), then on the order book (asks above, bids below).',
      glossaryRefs: ['order-book'],
    },
    {
      id: 'T10-A05', type: 'mock-terminal-tour', durationMs: 25_000,
      parameters: { areas: ['order-entry', 'positions'], symbol: 'DEMO/USDT' },
      caption: 'The highlight moves from the order-entry panel to the positions panel below the chart.',
      narration: 'On a real platform, submitting the order-entry form creates a real order. In the mock the button is DEMO only. Filled orders appear in positions.',
      reducedMotionDescription: 'Highlight on the order-entry panel (type, price, quantity, a DEMO-only button), then on the positions panel: LONG 2 DEMO, entry 100.00, mark 100.20, unrealized PnL +0.40 USDT (fictional).',
      glossaryRefs: ['order-entry-panel', 'positions-panel', 'unrealized-pnl'],
    },
    {
      id: 'T10-A06', type: 'mock-terminal-tour', durationMs: 25_000,
      parameters: { areas: ['wallet', 'security'], symbol: 'DEMO/USDT' },
      caption: 'The highlight moves from the wallet balance to the security / settings menu in the top bar.',
      narration: 'Wallet balance shows funds held. The security menu is where 2FA, devices and API settings usually live.',
      reducedMotionDescription: 'Highlight on the wallet balance (500.00 USDT, fictional), then on the security / settings menu where 2FA and API settings are usually found.',
      glossaryRefs: ['wallet-balance', 'two-factor-authentication'],
    },
    {
      id: 'T10-A07', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'red-flags', heading: 'Phishing red flags', items: ['“Your account is locked, verify now!”', 'A link to a look-alike address.', 'Someone asks for your 2FA code.', 'An offer that needs your API key.'] },
      caption: 'Four red flags appear one by one, each a common trick to steal account access.',
      reducedMotionDescription: 'Red flags: urgent “verify now” messages; links to look-alike addresses; anyone asking for a 2FA code; any offer that needs your API key. Real support never asks for codes or keys.',
      glossaryRefs: ['phishing', 'api-access-key'],
    },
    {
      id: 'T10-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'Before any real account', items: ['Turn on 2FA.', 'Never share codes or API keys.', 'KYC and availability differ by country.', 'Check current local rules.'] },
      caption: 'Safety: the warning card fills in with account-security and local-rules reminders.',
      reducedMotionDescription: 'Warning card: turn on 2FA; never share codes or API keys; KYC and product availability differ by country; check current local rules and get qualified advice.',
      glossaryRefs: ['kyc', 'regional-availability'],
    },
  ],

  exercises: [
    {
      id: 'T10-X01', type: 'hotspot-find', title: 'Hotspot hunt on the mock screen',
      fixtureId: 'FX-T10-TERMINAL-01',
      instructions: 'Find each area on the fictional mock screen, one at a time. Click the area, or use the button list under the picture (keyboard: Tab to a button, then Enter). A wrong pick tells you which area you chose.',
      steps: [
        { id: 'T10-X01-01', prompt: 'Find where you choose a pair, then where its last price is shown.', hint: 'Pairs are listed on the left; the last price sits next to the pair name above the chart.' },
        { id: 'T10-X01-02', prompt: 'Find the price history and the waiting bids and asks.', hint: 'The chart is in the middle; the order book is on the right.' },
        { id: 'T10-X01-03', prompt: 'Find where an order would be created and where open positions appear.', hint: 'Order entry is lower right; positions sit under the chart.' },
        { id: 'T10-X01-04', prompt: 'Find the wallet balance and the security settings.', hint: 'Both are in the top bar: wallet on the left, security on the right.' },
      ],
      allowedControls: ['tap-select', 'choice', 'reset', 'hint'],
      parameters: { targets: [
        { area: 'watchlist', prompt: 'Where would you pick DEMO/USDT from a list of pairs?' },
        { area: 'symbol', prompt: 'Where is the last price of the selected pair shown?' },
        { area: 'chart', prompt: 'Where can you see how the price moved over time?' },
        { area: 'order-book', prompt: 'Where are other traders’ waiting bids and asks listed?' },
        { area: 'order-entry', prompt: 'Where would you choose order type, price and quantity (DEMO only here)?' },
        { area: 'positions', prompt: 'Where would an open position and its unrealized PnL appear?' },
        { area: 'wallet', prompt: 'Where is the wallet balance shown?' },
        { area: 'security', prompt: 'Where would you turn on 2FA?' },
      ] },
      expectedEvaluation: { kind: 'sequence', order: ['watchlist', 'symbol', 'chart', 'order-book', 'order-entry', 'positions', 'wallet', 'security'] },
      explanation: 'Each area has one job. Knowing the job lets you find the area on any platform, even after a redesign.',
      fictionalDataLabel: 'Fictional educational mock; not a real exchange screen.',
    },
    {
      id: 'T10-X02', type: 'classify', title: 'Good habit or red flag?',
      fixtureId: 'FX-T10-SECURITY-01',
      instructions: 'Sort each fictional situation: is it a good account-security habit, or a red flag?',
      steps: [
        { id: 'T10-X02-01', prompt: 'For each item ask: does it protect my login, codes and keys, or give them away?', hint: 'Anyone asking for a code or key is a red flag, whatever their title.' },
        { id: 'T10-X02-02', prompt: 'Place all six, then press Check.', hint: 'Typing the address yourself avoids look-alike links.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'enable-2fa', text: 'Turning on 2FA with an authenticator app.' },
          { id: 'type-address', text: 'Typing the exchange address yourself or using a saved bookmark.' },
          { id: 'unique-password', text: 'Using a long password you use nowhere else.' },
          { id: 'verify-link', text: 'A message: “Account locked! Verify now” with a link.' },
          { id: 'support-asks-code', text: 'A “support agent” in a chat app asks for your 2FA code.' },
          { id: 'bot-needs-key', text: 'A free signal bot asks you to paste your API key.' },
        ],
        buckets: [
          { id: 'good-habit', label: 'Good security habit' },
          { id: 'red-flag', label: 'Red flag' },
        ],
        itemFeedback: {
          'enable-2fa': '2FA means a stolen password alone is not enough.',
          'type-address': 'Going directly to the real address avoids phishing links.',
          'unique-password': 'A leak from another site cannot then unlock this account.',
          'verify-link': 'Urgency plus a link is a classic phishing pattern.',
          'support-asks-code': 'Real support never asks for 2FA codes.',
          'bot-needs-key': 'An API key lets the holder act on your account. Never share it.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: {
        'good-habit': ['enable-2fa', 'type-address', 'unique-password'],
        'red-flag': ['verify-link', 'support-asks-code', 'bot-needs-key'],
      } },
      explanation: 'Good habits keep your password, codes and keys to yourself. Red flags all try to get you to hand them over, often with urgency.',
      fictionalDataLabel: 'Fictional situations for practice only.',
    },
    {
      id: 'T10-X03', type: 'choice-feedback', title: 'Where do you check?',
      fixtureId: 'FX-T10-TERMINAL-01',
      instructions: 'In a fictional DEMO simulator you opened LONG 2 DEMO at 100.00. You want to see whether it is currently up or down. Which area do you look at?',
      steps: [
        { id: 'T10-X03-01', prompt: 'Think about which area lists filled positions.', hint: 'The order book shows other people’s waiting orders, not yours.' },
        { id: 'T10-X03-02', prompt: 'Choose an answer and read the feedback.', hint: 'Look for side, size, entry and unrealized PnL.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        feedback: {
          positions: 'Right. The positions panel shows LONG 2 DEMO, entry 100.00, mark 100.20 and unrealized PnL +0.40 USDT (fictional).',
          'order-book': 'The order book lists everyone’s waiting bids and asks. It does not show your position.',
          wallet: 'The wallet balance (500.00 USDT) does not include unrealized PnL until the position closes.',
          'order-entry': 'Order entry is where you would create a new order, not where you track an open one.',
        },
      },
      choices: [
        { id: 'positions', text: 'The positions panel' },
        { id: 'order-book', text: 'The order book' },
        { id: 'wallet', text: 'The wallet balance' },
        { id: 'order-entry', text: 'The order-entry panel' },
      ],
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'positions' },
      explanation: 'Filled orders become positions, and the positions panel shows each one with its unrealized PnL: (100.20 − 100.00) × 2 = +0.40 USDT.',
      fictionalDataLabel: 'Fictional DEMO/USDT mock values for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T10-F01', name: 'Unrealized PnL in the positions panel (long, linear, fees excluded)',
      expression: 'unrealized PnL = (mark price − entry) × quantity',
      variables: [
        { symbol: 'mark price, entry', meaning: 'current mark price and entry price', unit: 'USDT per DEMO' },
        { symbol: 'quantity', meaning: 'position size', unit: 'DEMO' },
      ],
      simulatorId: 'pnl.linear', approximate: false,
      workedExamples: [
        { label: 'Mock positions row (notes example 2)', inputs: { entry: 100, exit: 100.2, quantity: 2 }, outputs: { grossPnl: 0.4 }, tolerance: 1e-9, assumptions: ['fictional data', 'mark price used as the current price', 'fees excluded'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T10-Q01', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T10',
      prompt: 'On the fictional mock, which area shows LONG 2 DEMO, entry 100.00 and unrealized PnL +0.40 USDT?',
      choices: [
        { id: 'a', text: 'The positions panel' },
        { id: 'b', text: 'The watchlist' },
        { id: 'c', text: 'The order book' },
        { id: 'd', text: 'The security menu' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Open positions and their unrealized PnL are listed in the positions panel.',
      misconceptionFeedback: {
        b: 'The watchlist lists pairs and their last prices, not your positions.',
        c: 'The order book shows waiting bids and asks from everyone in the market.',
        d: 'The security menu holds 2FA, devices and API settings.',
      },
      learningOutcome: 'Locate open positions and PnL on a generic screen.',
      remediationRef: { lessonId: 'T10', anchorId: 'T10-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T10-Q02', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T10', safetyCritical: true, safetyTopic: 'account-security',
      prompt: 'A chat message from “Exchange Support” says your account will be frozen unless you send your 2FA code and create an API key for them to “check” it. What should you do?',
      choices: [
        { id: 'a', text: 'Do not reply with any code or key. Open the exchange yourself by typing its address, and report the message.' },
        { id: 'b', text: 'Send the 2FA code only, because it expires in 30 seconds anyway.' },
        { id: 'c', text: 'Create a read-only API key and send it; that is harmless.' },
        { id: 'd', text: 'Click their link to check whether the account is really frozen.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Real support never asks for 2FA codes or API keys. Urgency plus a request for secrets is phishing.',
      misconceptionFeedback: {
        b: 'A live code is all an attacker needs to finish logging in with a stolen password, within seconds.',
        c: 'Never share any API key. Even read-only keys expose private data, and you cannot verify who is asking.',
        d: 'The link may lead to a look-alike site that steals your login. Type the address yourself.',
      },
      learningOutcome: 'Recognise and respond safely to a phishing attempt.',
      remediationRef: { lessonId: 'T10', anchorId: 'T10-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T10-Q03', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T10',
      prompt: 'The mock symbol bar shows DEMO/USDT last price 100.25 and mark price 100.20. What does the last price tell you?',
      choices: [
        { id: 'a', text: 'The price of the most recent trade on that market.' },
        { id: 'b', text: 'The price the next trade is guaranteed to happen at.' },
        { id: 'c', text: 'The same thing as the mark price, written differently.' },
        { id: 'd', text: 'Your wallet balance in USDT.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The last price is the latest fill. The mark price is a separate reference many futures platforms use for unrealized PnL.',
      misconceptionFeedback: {
        b: 'Nothing guarantees the next trade price; it can be higher or lower.',
        c: 'They are different numbers here (100.25 vs 100.20) because they are calculated differently.',
        d: 'The wallet balance is shown separately in the top bar.',
      },
      learningOutcome: 'Distinguish last price from mark price.',
      remediationRef: { lessonId: 'T10', anchorId: 'T10-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T10-Q04', type: 'single', cognitiveTag: 'mistake-risk', linkedLessonId: 'T10',
      prompt: 'You open a real exchange app and the order-entry panel is on the left, not the right as in the mock. What is the best conclusion?',
      choices: [
        { id: 'a', text: 'Layouts differ and change over time; find the area by its purpose (type, price, quantity, submit).' },
        { id: 'b', text: 'The app must be fake, because it does not match the course mock.' },
        { id: 'c', text: 'The mock is a pixel-accurate copy, so the app is out of date.' },
        { id: 'd', text: 'Positions must also be on the left now.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The mock is generic and not a screenshot. Learn what each area does, then look for that job on any screen.',
      misconceptionFeedback: {
        b: 'A different layout alone proves nothing. Check the address you typed, not the layout.',
        c: 'The mock is deliberately generic; it is not a copy of any real screen.',
        d: 'Each area can move independently. Look for its purpose.',
      },
      learningOutcome: 'Use the mock to learn purposes, not exact positions.',
      remediationRef: { lessonId: 'T10', anchorId: 'T10-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T10-Q05', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T10', safetyCritical: true, safetyTopic: 'not-advice',
      prompt: 'A video says: “Futures are open to everyone, everywhere. Skip KYC and just start.” What is the best response?',
      choices: [
        { id: 'a', text: 'KYC and product availability differ by platform and country; check current local rules and get qualified advice.' },
        { id: 'b', text: 'Believe it: if a video shows a futures tab, it is available and allowed for me.' },
        { id: 'c', text: 'Use a tool to hide my location so the restriction does not apply.' },
        { id: 'd', text: 'KYC is optional everywhere, so it can always be skipped.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Rules differ by country and change over time. The course makes no claim about what is available or allowed where you live.',
      misconceptionFeedback: {
        b: 'A video reflects one account in one place at one time. Availability can differ for you.',
        c: 'Getting around regional rules can break a platform’s terms and local law, and can put your funds at risk.',
        d: 'Many platforms require KYC for some or all services. Requirements vary.',
      },
      learningOutcome: 'Treat KYC and regional availability as local rules to check, not assumptions.',
      remediationRef: { lessonId: 'T10', anchorId: 'T10-N06' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Expecting a real platform to look exactly like the mock.', correction: 'Layouts change. Find each area by its purpose, not its position or label.' },
    { mistake: 'Confusing open orders, positions and wallet balance.', correction: 'Orders wait in the book; filled orders become positions with unrealized PnL; the wallet balance changes when positions close.' },
    { mistake: 'Sharing a 2FA code or API key with someone claiming to be support.', correction: 'Never share codes or keys. Type the address yourself and report the message.' },
  ],
  takeaways: [
    'Most trading screens share eight areas: watchlist, symbol, chart, order book, order entry, positions, wallet and security.',
    'The mock is generic and fictional; real layouts change, so learn purposes, not pixels.',
    'Protect the account first: 2FA on, no shared codes or API keys, and check local KYC and availability rules.',
  ],
  reviewCard: {
    keyTermIds: ['positions-panel', 'two-factor-authentication', 'api-access-key'],
    safetyNote: 'Never share passwords, 2FA codes or API keys. KYC and availability differ by country; check current local rules.',
    reviewMinutes: 3,
    retrievalQuestion: 'Name the area that shows unrealized PnL, and two security habits that protect an exchange account.',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T10-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
