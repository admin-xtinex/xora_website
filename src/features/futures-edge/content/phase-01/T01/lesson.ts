import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All BTC prices and balances in this lesson are fictional, illustrative numbers made for teaching. They are not real market data and not a forecast.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can explain in one sentence what a cryptocurrency is and tell it apart from other digital objects.',
    'Learner can explain that a BTC balance is a record on a blockchain, reached through a wallet, not a coin stored in a phone.',
    'Learner can calculate the value of a crypto balance as quantity × price and explain why that value changes.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T01-S01', kind: 'cover-problem', title: 'Value you cannot touch',
      narrationText: 'A paper note is value you can hold. Money in a banking app is value you cannot touch, yet you can still spend it. Cryptocurrency is another kind of value that exists only as data.',
      blocks: [
        { kind: 'paragraph', text: 'A paper note is [[money-value|value]] you can hold. Money in a banking app is value you **cannot** touch, yet you can spend it.' },
        { kind: 'paragraph', text: 'Crypto is another kind of value that lives only as data.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T01-A01' },
      glossaryRefs: ['money-value'],
      speakerNotes: 'Start from something the learner already uses every day: UPI or a banking app. Digital value is not new; crypto is a different way of recording it.',
    },
    {
      id: 'T01-S02', kind: 'key-definition', title: 'Crypto is a digital asset',
      narrationText: 'A digital asset is something of value that exists only as data. A cryptocurrency is a digital asset recorded on a blockchain, a shared record book kept on many computers, instead of in one bank.',
      blocks: [
        { kind: 'paragraph', text: 'A [[digital-asset]] is value that exists only as data.' },
        { kind: 'definition', termId: 'cryptocurrency' },
        { kind: 'paragraph', text: 'Its records live on a [[blockchain]], not in one bank’s books.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T01-A02' },
      glossaryRefs: ['digital-asset', 'cryptocurrency', 'blockchain'],
    },
    {
      id: 'T01-S03', kind: 'visual-breakdown', title: 'What you actually own',
      narrationText: 'Your BTC is a line in a shared record. Your wallet holds the keys or login that let you move it. Nothing is stored inside the phone except the app. Tokens are units recorded the same way.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          '[[bitcoin|BTC]] balance = an entry in the record',
          '[[wallet]] = the keys or login that move it',
          '[[token]] = a unit recorded on a blockchain',
          'Your phone holds the app, **not** the coins',
        ] },
      ],
      visualRef: { kind: 'scene', sceneId: 'T01-A03' },
      glossaryRefs: ['bitcoin', 'wallet', 'token'],
    },
    {
      id: 'T01-S04', kind: 'worked-example', title: 'How much is 0.002 BTC worth?',
      narrationText: 'Value is quantity times price. With a fictional price of 50,000 USDT per BTC, 0.002 BTC is worth 100 USDT. USDT is a dollar-like digital unit that lesson T03 explains.',
      blocks: [
        {
          kind: 'worked-example', title: 'Fictional BTC balance', fictional: true,
          steps: [
            { text: 'Quantity: 0.002 BTC' },
            { text: 'Fictional price: 50,000.00 USDT per BTC' },
            { text: 'Value = 0.002 × 50,000.00', result: '100.00 USDT' },
          ],
          conclusion: 'If the price moves to 47,500.00, the same 0.002 BTC is worth 95.00 USDT.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T01-A05' },
      glossaryRefs: ['bitcoin'],
    },
    {
      id: 'T01-S05', kind: 'risks-misunderstanding', title: 'Not guaranteed, not stable',
      narrationText: 'No government guarantees crypto, and its price can swing a lot in hours. Also, holding BTC is different from holding a contract that only tracks the BTC price. Futures are such contracts, and later lessons cover their extra risks.',
      blocks: [
        { kind: 'callout', callout: 'safety', title: 'No guarantee', text: 'No government or bank guarantees crypto. Its price can fall fast, and you can lose money.' },
        { kind: 'callout', callout: 'mistake', title: 'Holding ≠ a price contract', text: 'Owning BTC is not the same as a futures contract that only tracks BTC’s price.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T01-A07' },
      glossaryRefs: ['cryptocurrency'],
    },
    {
      id: 'T01-S06', kind: 'guided-practice', title: 'Your turn',
      narrationText: 'First sort everyday digital things into crypto and not crypto. Then calculate the value of 0.002 BTC at a fictional sample price.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Sort six digital things: crypto or not crypto?', 'Work out 0.002 BTC × a fictional price.', 'Decide what the balance really is.'] },
        { kind: 'callout', callout: 'tip', text: 'Value = quantity × price. The quantity stays the same when only the price moves.' },
      ],
      glossaryRefs: ['cryptocurrency', 'digital-asset'],
    },
    {
      id: 'T01-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Crypto is a digital asset recorded on a blockchain. Your wallet gives access; it does not hold coins. Value equals quantity times price, and the price can swing. Nobody guarantees it.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          'Crypto = a digital asset recorded on a blockchain.',
          'A wallet gives access; it does not hold coins.',
          'Value = quantity × price, and the price moves.',
          'No government guarantee; prices can fall fast.',
        ] },
      ],
      glossaryRefs: ['cryptocurrency', 'wallet'],
    },
  ],

  notesSections: [
    {
      id: 'T01-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: '[[money-value|Money]] is anything people widely accept in exchange for goods and services. A [[digital-asset]] is something of value that exists only as data. A [[cryptocurrency]] is a digital asset whose records are kept on a [[blockchain]]: a shared record book copied on many computers. [[bitcoin|Bitcoin (BTC)]] was the first one. A [[token]] is a unit of a digital asset recorded on a blockchain, and a [[wallet]] is the tool that holds the keys or login you use to see and move it.' },
        { kind: 'analogy', text: 'Think of a village notebook that every family keeps an identical copy of. When Asha pays Ben, everyone writes the same line. Nobody has a coin in their pocket; the balance is what the notebook says. Your wallet is the pen and signature that only you are allowed to use for your lines.' },
      ],
    },
    {
      id: 'T01-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Everything in this course is about prices of crypto assets. If you think a BTC balance is a coin inside your phone, you may believe deleting an app loses it, or that a screenshot proves ownership. Knowing that value = quantity × price also explains why your balance can be worth less tomorrow even though nothing was taken from you.' },
      ],
    },
    {
      id: 'T01-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: value of a fictional balance', fictional: true,
          steps: [
            { text: 'You hold 0.002 BTC.' },
            { text: 'A fictional price: 1 BTC = 50,000.00 USDT (USDT is a dollar-like digital unit, explained in lesson T03).' },
            { text: 'Value = 0.002 × 50,000.00', result: '100.00 USDT' },
          ],
          conclusion: 'The balance is a quantity. Its value in USDT depends on the price at that moment.',
        },
        {
          kind: 'worked-example', title: 'Example 2: same balance, new prices (fictional)', fictional: true,
          steps: [
            { text: 'Price rises to 52,000.00: 0.002 × 52,000.00', result: '104.00 USDT' },
            { text: 'Price falls to 47,500.00: 0.002 × 47,500.00', result: '95.00 USDT' },
          ],
          conclusion: 'The quantity stayed 0.002 BTC the whole time. Only the price changed, and the value moved by 4.00 and then by 9.00 USDT.',
        },
        {
          kind: 'formula', expression: 'value in USDT = quantity of BTC × price in USDT per BTC', formulaId: 'T01-F01',
          variables: [
            { symbol: 'quantity', meaning: 'how much BTC is recorded for you', unit: 'BTC' },
            { symbol: 'price', meaning: 'what 1 BTC trades for right now (fictional here)', unit: 'USDT per BTC' },
          ],
        },
      ],
    },
    {
      id: 'T01-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Is it a unit of value that people trade? A photo, a PDF ticket or a game score is digital but is not traded as money.',
          'Is it recorded on a blockchain rather than in one company’s database? Game points and shop rewards live in one company’s system.',
          'Does a price for it move with trading? Crypto prices are quoted all day, every day, and change constantly.',
          'Is it government money in an app? A bank balance in rupees is digital, but it is national currency, not crypto.',
        ] },
      ],
    },
    {
      id: 'T01-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Thinking the coin is inside the phone', text: 'The phone runs an app. The balance is an entry on the blockchain or in an exchange’s records. Protect your login and recovery words, not the phone itself.' },
        { kind: 'callout', callout: 'mistake', title: 'Thinking someone guarantees the value', text: 'No government or bank promises that crypto keeps its value. The price can fall a lot in a short time.' },
        { kind: 'callout', callout: 'mistake', title: 'Mixing up holding and contracts', text: 'Holding BTC means a quantity is recorded for you. A futures contract only follows the BTC price; you do not hold the BTC, and losses can grow faster.' },
      ],
    },
    {
      id: 'T01-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Crypto is not guaranteed by any government, and prices are volatile: they can fall sharply and quickly. Only learn with fictional numbers here, never share your login or recovery words, and remember that rules about crypto differ by country; check current local rules and get qualified advice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T01-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'The words in this lesson', headers: ['Word', 'In one line'], rows: [
          ['Digital asset', 'value that exists only as data'],
          ['Cryptocurrency', 'a digital asset recorded on a blockchain'],
          ['Blockchain', 'a shared record book on many computers'],
          ['Wallet', 'keys or login that let you move your crypto'],
          ['Value', 'quantity × price, so it moves when price moves'],
        ] },
      ],
    },
    {
      id: 'T01-N08', heading: 'learn-more', title: 'Learn more: holdings versus derivatives', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'When you buy BTC on an exchange and keep it, the exchange or the blockchain records a quantity for you. That is a holding. A derivative, such as a futures contract, is an agreement whose result depends on the BTC price; you never receive the BTC. Futures can use borrowed exposure, so a small price move can cause a large loss. Phase 3 of this course explains this step by step. Until then, treat “I own BTC” and “I have a BTC contract” as two different things.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T01-A01', type: 'trading-pair', durationMs: 20_000,
      parameters: { variant: 'price-tag', base: 'BTC', quote: 'USDT', price: 50_000 },
      caption: 'A price label fades in on screen: 1 BTC costs **50,000.00 USDT** (fictional).',
      narration: 'Someone opens an app and sees a ticker for Bitcoin. It looks like a shop label: one BTC, priced in USDT.',
      reducedMotionDescription: 'A fictional price label reads: 1 BTC costs 50,000.00 USDT. It works like a shop label showing the price of one item.',
      glossaryRefs: ['bitcoin'],
    },
    {
      id: 'T01-A02', type: 'value-exchange', durationMs: 30_000,
      parameters: { variant: 'ledger-record', asset: 'BTC', entries: [
        { from: 'Asha', to: 'Ben', amount: 0.01 },
        { from: 'Ben', to: 'Chitra', amount: 0.004 },
        { from: 'Chitra', to: 'You', amount: 0.002 },
      ] },
      caption: 'Entries appear one by one in a shared record: 0.01 BTC, then 0.004 BTC, then 0.002 BTC to You. No coin moves into a phone.',
      narration: 'BTC is a digital asset. What changes is the shared record, the blockchain. Your balance is whatever the record says.',
      reducedMotionDescription: 'A shared ledger fills with three fictional entries: Asha to Ben 0.01 BTC, Ben to Chitra 0.004 BTC, Chitra to You 0.002 BTC. The balance is an entry in this record, not a physical coin.',
      glossaryRefs: ['blockchain', 'digital-asset'],
    },
    {
      id: 'T01-A03', type: 'value-exchange', durationMs: 20_000,
      parameters: { variant: 'balance-quantity', asset: 'BTC', quantity: 0.002 },
      caption: 'Your fictional wallet balance counts up from 0 to **0.002 BTC**: a number recorded for you.',
      narration: 'The wallet reads the record and shows your balance. It is a number, not an object you carry.',
      reducedMotionDescription: 'A fictional wallet card shows a balance growing from 0 to 0.002 BTC, with the note that it is a number recorded for you, not an object you hold.',
      glossaryRefs: ['wallet'],
    },
    {
      id: 'T01-A04', type: 'price-path', durationMs: 25_000,
      parameters: { variant: 'plain', points: [50_000, 50_400, 51_200, 50_800, 52_000, 49_800, 47_500], markers: [{ index: 4, label: '52,000' }, { index: 6, label: '47,500' }] },
      caption: 'The fictional BTC price wanders from 50,000 up to 52,000, then drops to 47,500.',
      narration: 'Prices change all day. Here the fictional price climbs, peaks at 52,000 and then falls to 47,500.',
      reducedMotionDescription: 'A fictional BTC price line: 50,000, 50,400, 51,200, 50,800, 52,000, 49,800, 47,500 USDT. It rises to 52,000 and then falls to 47,500.',
    },
    {
      id: 'T01-A05', type: 'value-exchange', durationMs: 35_000,
      parameters: { variant: 'value-from-price', asset: 'BTC', quote: 'USDT', quantity: 0.002, prices: [50_000, 52_000, 47_500] },
      caption: 'Same 0.002 BTC, changing price: the value goes from 100.00 to 104.00, then down to 95.00 USDT.',
      narration: 'Value is quantity times price. The quantity never changes, but the value follows the price up and down.',
      reducedMotionDescription: 'A card shows 0.002 BTC × price. At 50,000 the value is 100.00 USDT; at 52,000 it is 104.00 USDT; at 47,500 it is 95.00 USDT, a change of −5.00 USDT from the start. Quantity did not change, only the price.',
      glossaryRefs: ['money-value'],
    },
    {
      id: 'T01-A06', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Holding BTC vs a BTC price contract', items: [
        'Holding: 0.002 BTC is recorded for you.',
        'Contract (futures): you only follow the BTC price.',
        'A contract does not give you the BTC.',
        'Contracts can lose money faster: later lessons explain why.',
      ] },
      caption: 'Two rows build up: owning BTC on one side, a contract that only tracks the price on the other.',
      reducedMotionDescription: 'Comparison card: holding means 0.002 BTC is recorded for you; a futures contract only follows the BTC price and does not give you BTC; contracts can lose money faster, explained in later lessons.',
    },
    {
      id: 'T01-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'Before you go further', items: [
        'No government or bank guarantees crypto.',
        'Prices can fall sharply in hours.',
        'Your balance can be worth less tomorrow.',
        'Never share your login or recovery words.',
      ] },
      caption: 'Warning items appear one by one: no guarantee, fast price falls, value can shrink, protect your access.',
      reducedMotionDescription: 'Warning card: no government or bank guarantees crypto; prices can fall sharply in hours; your balance can be worth less tomorrow; never share your login or recovery words.',
      glossaryRefs: ['cryptocurrency'],
    },
  ],

  exercises: [
    {
      id: 'T01-X01', type: 'classify', title: 'Crypto or not crypto?',
      fixtureId: 'FX-T01-CLASSIFY-01',
      instructions: 'Six digital things are listed. Put each one in the right group: a cryptocurrency (or crypto token), or something digital that is not crypto.',
      steps: [
        { id: 'T01-X01-01', prompt: 'For each item, ask: is it a unit of value recorded on a blockchain?', hint: 'Being digital is not enough. A photo is digital but nobody records it on a blockchain as money.' },
        { id: 'T01-X01-02', prompt: 'Place all six items, then press Check.', hint: 'Rupees in a banking app are digital government money, not crypto.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'btc-balance', text: 'A balance of 0.002 BTC recorded on the Bitcoin blockchain' },
          { id: 'demo-token', text: 'A fictional DEMO token recorded on a blockchain' },
          { id: 'photo', text: 'A holiday photo saved on your phone' },
          { id: 'game-coins', text: 'Gold coins inside a mobile game' },
          { id: 'bank-app', text: '5,000 rupees shown in a banking app' },
          { id: 'pdf-ticket', text: 'A train ticket saved as a PDF' },
        ],
        buckets: [
          { id: 'crypto', label: 'Cryptocurrency or crypto token' },
          { id: 'not-crypto', label: 'Digital, but not crypto' },
        ],
        itemFeedback: {
          'btc-balance': 'BTC is a cryptocurrency: a digital asset recorded on its blockchain.',
          'demo-token': 'A token recorded on a blockchain counts as crypto, even a fictional one. Being crypto says nothing about whether it is valuable.',
          photo: 'A photo is a digital file, not a unit of value recorded on a blockchain.',
          'game-coins': 'Game coins live in one company’s database and are called “coins” only as a game word.',
          'bank-app': 'This is national currency shown digitally by a bank, not crypto.',
          'pdf-ticket': 'A PDF ticket is a digital document, not a traded digital asset.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { crypto: ['btc-balance', 'demo-token'], 'not-crypto': ['photo', 'game-coins', 'bank-app', 'pdf-ticket'] } },
      explanation: 'Only the BTC balance and the token are units of value recorded on a blockchain. The others are digital, but they are files, game points or government money in an app.',
      fictionalDataLabel: 'Fictional, illustrative examples for practice only.',
    },
    {
      id: 'T01-X02', type: 'numeric-calculator', title: 'What is 0.002 BTC worth?',
      fixtureId: 'FX-T01-BALANCE-01', simulatorId: 'pair.convert',
      instructions: 'You hold 0.002 BTC. A fictional sample price is 61,250.00 USDT per BTC. Calculate the value of your balance in USDT, to 2 decimal places.',
      steps: [
        { id: 'T01-X02-01', prompt: 'Write the rule: value = quantity × price.', hint: 'Quantity is in BTC; price is in USDT per BTC; so the answer is in USDT.' },
        { id: 'T01-X02-02', prompt: 'Multiply 0.002 by 61,250.00 and enter the value.', hint: '0.002 is two thousandths, so divide 61,250 by 1,000 and multiply by 2.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: { given: [
        { label: 'Quantity', value: 0.002, unit: 'BTC', decimals: 3 },
        { label: 'Fictional sample price', value: 61_250, unit: 'USDT per BTC', decimals: 2 },
      ] },
      expectedEvaluation: { kind: 'numeric', value: 122.5, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      explanation: '0.002 × 61,250.00 = 122.50 USDT. If the fictional price changed, the value would change too, while the quantity stayed 0.002 BTC.',
      fictionalDataLabel: 'Fictional, illustrative price for practice only — not a real BTC price.',
    },
    {
      id: 'T01-X03', type: 'choice-feedback', title: 'What do you really have?',
      fixtureId: 'FX-T01-BALANCE-01',
      instructions: 'Your wallet app shows “0.002 BTC (fictional)”. Choose the statement that is true.',
      steps: [
        { id: 'T01-X03-01', prompt: 'Think about where the balance is recorded.', hint: 'Remember the shared record book from the animation.' },
        { id: 'T01-X03-02', prompt: 'Pick one statement and press Check.', hint: 'Look for the statement without a promise in it.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      choices: [
        { id: 'record', text: 'A quantity of 0.002 BTC is recorded for me; its value in USDT changes with the price and nobody guarantees it.' },
        { id: 'phone', text: 'Two small BTC coins are stored inside my phone’s memory.' },
        { id: 'guaranteed', text: 'The government guarantees this balance will keep its value.' },
        { id: 'contract', text: 'This is the same as holding a BTC futures contract.' },
      ],
      parameters: { feedback: {
        record: 'Correct. It is a record of a quantity. Value = quantity × price, and the price can fall.',
        phone: 'The phone only runs the app. The balance is an entry in a record, not an object in memory.',
        guaranteed: 'No government or bank guarantees crypto. Its value can fall sharply.',
        contract: 'A futures contract only follows the BTC price and does not give you BTC. Holding and contracts are different things.',
      } },
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'record' },
      explanation: 'A crypto balance is a recorded quantity whose value moves with the price. It is not inside the phone, not government-guaranteed and not a futures contract.',
      fictionalDataLabel: 'Fictional, illustrative balance for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T01-F01', name: 'Value of a crypto balance', expression: 'value in USDT = quantity of BTC × price in USDT per BTC',
      variables: [
        { symbol: 'quantity', meaning: 'how much BTC is recorded for you', unit: 'BTC' },
        { symbol: 'price', meaning: 'fictional price of 1 BTC', unit: 'USDT per BTC' },
      ],
      simulatorId: 'pair.convert', approximate: false,
      workedExamples: [
        { label: 'Notes example 1 (price 50,000)', inputs: { quantity: 0.002, price: 50_000 }, outputs: { quoteValue: 100 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Notes example 2 (price 52,000)', inputs: { quantity: 0.002, price: 52_000 }, outputs: { quoteValue: 104 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Notes example 2 (price 47,500)', inputs: { quantity: 0.002, price: 47_500 }, outputs: { quoteValue: 95 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Exercise T01-X02', inputs: { quantity: 0.002, price: 61_250 }, outputs: { quoteValue: 122.5 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Quiz T01-Q01', inputs: { quantity: 0.005, price: 40_000 }, outputs: { quoteValue: 200 }, tolerance: 1e-9, assumptions: ['fictional data'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T01-Q01', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T01',
      prompt: 'You hold 0.005 BTC. A fictional price is 40,000.00 USDT per BTC. What is your balance worth in USDT?',
      answer: { kind: 'numeric', value: 200, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Value = 0.005 × 40,000.00 = 200.00 USDT.',
      learningOutcome: 'Compute the value of a crypto balance as quantity × price.',
      remediationRef: { lessonId: 'T01', anchorId: 'T01-N03' },
    },
    {
      id: 'T01-Q02', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T01',
      prompt: 'You hold 0.002 BTC. The fictional price falls from 50,000.00 to 47,500.00 USDT. What happened to your balance?',
      choices: [
        { id: 'a', text: 'The quantity is still 0.002 BTC, but its value fell from 100.00 to 95.00 USDT.' },
        { id: 'b', text: 'Some BTC was taken out, so the quantity fell.' },
        { id: 'c', text: 'Nothing changed, because the quantity stayed the same.' },
        { id: 'd', text: 'The value rose, because a lower price means a better deal.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Value = quantity × price. The quantity did not change, so the value fell with the price: 0.002 × 47,500.00 = 95.00 USDT.',
      misconceptionFeedback: {
        b: 'A price change does not remove anything from the record. The quantity is the same.',
        c: 'The quantity is the same, but its value in USDT depends on the price, which fell.',
        d: 'A lower price means the BTC you already hold is worth less, not more.',
      },
      learningOutcome: 'Explain that value changes with price while quantity stays fixed.',
      remediationRef: { lessonId: 'T01', anchorId: 'T01-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T01-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T01', safetyCritical: true, safetyTopic: 'not-advice',
      prompt: 'A friend says: “Crypto is backed by the government and BTC always goes back up, so you can’t really lose.” What is the best response?',
      choices: [
        { id: 'a', text: 'That is not true. No government guarantees crypto, prices can fall sharply, and you can lose money.' },
        { id: 'b', text: 'Agree: BTC has always recovered, so losses are temporary.' },
        { id: 'c', text: 'Agree, but only if you keep it in a wallet app.' },
        { id: 'd', text: 'Agree, because the blockchain record cannot be changed.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Crypto is not issued or guaranteed by a government, and its price is volatile. Nothing promises it will go back up.',
      misconceptionFeedback: {
        b: 'Past recoveries do not promise future ones. Prices can stay low for a long time or fall further.',
        c: 'A wallet only gives access. It does not protect the value from falling.',
        d: 'A record that is hard to change keeps track of who holds what. It does not make the price stable.',
      },
      learningOutcome: 'Recognise that crypto has no government guarantee and is volatile.',
      remediationRef: { lessonId: 'T01', anchorId: 'T01-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T01-Q04', type: 'single', cognitiveTag: 'mistake-risk', linkedLessonId: 'T01',
      prompt: 'Which statement about a crypto wallet is correct?',
      choices: [
        { id: 'a', text: 'It holds the keys or login that let you move a balance recorded elsewhere.' },
        { id: 'b', text: 'It stores the actual coins inside the phone, so deleting the app deletes them.' },
        { id: 'c', text: 'It guarantees that your balance cannot lose value.' },
        { id: 'd', text: 'It is the same thing as a futures contract.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A wallet gives access. The balance itself is an entry on the blockchain or in an exchange’s records.',
      misconceptionFeedback: {
        b: 'The coins are not inside the phone. What matters is the keys, login or recovery words, so protect those.',
        c: 'No tool can stop the price from falling. A wallet only gives access.',
        d: 'A wallet is an access tool. A futures contract is an agreement that follows a price.',
      },
      learningOutcome: 'Describe a wallet as access to a record, not a container of coins.',
      remediationRef: { lessonId: 'T01', anchorId: 'T01-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T01-Q05', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T01',
      prompt: 'Which of these is a cryptocurrency?',
      choices: [
        { id: 'a', text: 'A balance of BTC recorded on the Bitcoin blockchain.' },
        { id: 'b', text: 'Reward points in a shopping app.' },
        { id: 'c', text: 'Rupees shown in a banking app.' },
        { id: 'd', text: 'A screenshot of a crypto price chart.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A cryptocurrency is a digital asset recorded on a blockchain. BTC is exactly that.',
      misconceptionFeedback: {
        b: 'Reward points live in one company’s database. They are not recorded on a blockchain.',
        c: 'This is national currency shown digitally by a bank, not crypto.',
        d: 'A screenshot is just an image. It does not record or prove any balance.',
      },
      learningOutcome: 'Tell a cryptocurrency apart from other digital things.',
      remediationRef: { lessonId: 'T01', anchorId: 'T01-N04' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Believing a BTC coin is stored inside the phone.', correction: 'The balance is an entry in a record. The wallet holds the keys or login that give access.' },
    { mistake: 'Believing a government guarantees crypto.', correction: 'Nobody guarantees crypto. Its price can fall sharply, so its value can shrink.' },
    { mistake: 'Treating owning BTC and holding a BTC futures contract as the same thing.', correction: 'A holding is a recorded quantity. A futures contract only follows the price and can lose money faster.' },
  ],
  takeaways: [
    'A cryptocurrency is a digital asset recorded on a blockchain; a wallet gives access, it does not hold coins.',
    'Value = quantity × price, so the same balance is worth more or less as the price moves.',
    'No government guarantees crypto, prices are volatile, and holding BTC is different from a price contract.',
  ],
  reviewCard: {
    keyTermIds: ['cryptocurrency', 'blockchain', 'wallet'],
    safetyNote: 'Crypto is not guaranteed by any government and its price can fall sharply. Your balance can be worth less tomorrow.',
    reviewMinutes: 3,
    retrievalQuestion: 'You hold 0.002 BTC and a fictional price is 50,000 USDT per BTC. What is it worth, and what changes if the price drops?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T01-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
