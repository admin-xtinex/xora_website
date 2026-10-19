import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'Every BTC/USDT price in this lesson is a fictional, illustrative number made for teaching. It is not real market data and not a forecast.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can name the base asset and the quote asset of any pair, written with or without a slash.',
    'Learner can calculate value in USDT = BTC quantity × USDT per BTC, and convert a USDT amount into a BTC quantity.',
    'Learner can explain why a stablecoin such as USDT is not guaranteed to stay at its 1-dollar peg.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T03-S01', kind: 'cover-problem', title: 'What does “BTC/USDT 60,000” mean?',
      narrationText: 'You open a crypto app and see BTC/USDT with a big number next to it. Two names, a slash and a price. In this lesson you will learn to read that line like a shop price tag.',
      blocks: [
        { kind: 'paragraph', text: 'A crypto app shows: **BTC/USDT 60,000.00** (illustrative).' },
        { kind: 'paragraph', text: 'Two names, one slash, one number. Read it like a **price tag** in a shop.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T03-A01' },
      glossaryRefs: ['trading-pair', 'bitcoin'],
      speakerNotes: 'Start from what the learner literally sees on screen. Do not explain stablecoins yet.',
    },
    {
      id: 'T03-S02', kind: 'key-definition', title: 'Two halves of a pair',
      narrationText: 'A trading pair has two halves. The first, the base asset, is the thing being priced. The second, the quote asset, is the unit of the price. The number tells you how many quote units buy one base unit.',
      blocks: [
        { kind: 'list', ordered: false, items: ['**Base** (first): the thing being priced, e.g. BTC.', '**Quote** (second): the unit of the price, e.g. USDT.'] },
        { kind: 'paragraph', text: 'Price = how many quote units buy **1** base unit.' },
        { kind: 'definition', termId: 'trading-pair' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T03-A02' },
      glossaryRefs: ['trading-pair', 'base-asset', 'quote-asset', 'symbol'],
    },
    {
      id: 'T03-S03', kind: 'visual-breakdown', title: 'Price × quantity = value',
      narrationText: 'You rarely buy a whole bitcoin. You buy a quantity, often a small fraction. Multiply the quantity by the price to get its notional value in USDT. One BTC and one-thousandth of a BTC at the same price are worth very different amounts.',
      blocks: [
        { kind: 'paragraph', text: '[[notional-value|Value]] in USDT = [[quantity]] of BTC × USDT per BTC.' },
        { kind: 'list', ordered: false, items: ['1 BTC × 60,000.00 = 60,000.00 USDT', '0.001 BTC × 60,000.00 = 60.00 USDT'] },
      ],
      visualRef: { kind: 'scene', sceneId: 'T03-A03' },
      glossaryRefs: ['quantity', 'notional-value'],
    },
    {
      id: 'T03-S04', kind: 'worked-example', title: 'When the price changes',
      narrationText: 'You hold 0.01 BTC. The illustrative price moves from 60,000 to 62,000 and then to 57,000. Your quantity never changes, but its value moves from 600 to 620 to 570 USDT.',
      blocks: [
        {
          kind: 'worked-example', title: 'Holding 0.01 BTC (illustrative prices)', fictional: true,
          steps: [
            { text: '0.01 × 60,000.00', result: '600.00 USDT' },
            { text: '0.01 × 62,000.00', result: '620.00 USDT' },
            { text: '0.01 × 57,000.00', result: '570.00 USDT' },
          ],
          conclusion: 'Quantity stays 0.01 BTC. Only the value moves.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T03-A04' },
      glossaryRefs: ['quantity', 'notional-value'],
    },
    {
      id: 'T03-S05', kind: 'risks-misunderstanding', title: 'Stable is not guaranteed',
      narrationText: 'USDT is a stablecoin. It aims to stay near one US dollar. That target is called a peg. A peg can fail, so a stablecoin is not the same as cash in a bank and is not guaranteed by anyone.',
      blocks: [
        { kind: 'paragraph', text: '[[usdt|USDT]] is a [[stablecoin]]: it **aims** to stay near 1 US dollar (its [[peg]]).' },
        { kind: 'callout', callout: 'safety', text: 'A peg is a target, not a guarantee. Stablecoins have lost their peg before.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T03-A06' },
      glossaryRefs: ['usdt', 'stablecoin', 'peg'],
    },
    {
      id: 'T03-S06', kind: 'guided-practice', title: 'Try the pair calculator',
      narrationText: 'Now you try. Move the BTC quantity slider and the illustrative price slider and watch the USDT value update. Then answer one question about what doubling the quantity does.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Move the BTC quantity slider.', 'Move the illustrative price slider.', 'Predict what doubling the quantity does to value.'] },
        { kind: 'callout', callout: 'tip', text: 'Value in USDT = BTC amount × USDT per BTC.' },
      ],
      glossaryRefs: ['quantity', 'notional-value'],
    },
    {
      id: 'T03-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Base first, quote second. The price is quote units per one base unit. Value equals quantity times price. And a stablecoin is a target, never a guarantee.',
      blocks: [
        { kind: 'list', ordered: false, items: ['BASE/QUOTE: base is priced, quote is the unit.', 'BTCUSDT is the same pair as BTC/USDT.', 'Value = quantity × price, in the quote asset.', 'A stablecoin peg is not guaranteed.'] },
      ],
      glossaryRefs: ['base-asset', 'quote-asset', 'peg'],
    },
  ],

  notesSections: [
    {
      id: 'T03-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'A [[trading-pair]] tells you which asset is being priced against another. It is written BASE/QUOTE. The first part, the [[base-asset]], is the thing being bought or sold. The second part, the [[quote-asset]], is the unit the price is written in. In BTC/USDT, [[bitcoin|BTC]] is the base and [[usdt|USDT]] is the quote. Many platforms drop the slash and show a [[symbol]] such as BTCUSDT; it means the same pair.' },
        { kind: 'analogy', text: 'Think of a vegetable shop label: “Tomatoes — 40 rupees per kg”. Tomatoes are the base (the thing), rupees are the quote (the unit of the price). BTC/USDT 60,000.00 reads the same way: 1 BTC costs 60,000.00 USDT (illustrative).' },
      ],
    },
    {
      id: 'T03-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Every price, order size, profit and loss on a crypto platform is measured through a pair. If you mix up base and quote, you can type 100 meaning “100 USDT” when the box expects “100 BTC”, or misread how much your holding is worth. Knowing that value = [[quantity]] × price also explains why your balance moves every second even when you do nothing: the quantity stays, the price changes.' },
      ],
    },
    {
      id: 'T03-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: from quantity to value (illustrative BTC/USDT)', fictional: true,
          steps: [
            { text: 'Illustrative price: 60,000.00 USDT per BTC.' },
            { text: '1 BTC × 60,000.00', result: '60,000.00 USDT' },
            { text: '0.001 BTC × 60,000.00', result: '60.00 USDT' },
            { text: '0.025 BTC at an illustrative 64,000.00: 0.025 × 64,000.00', result: '1,600.00 USDT' },
          ],
          conclusion: 'The same price can describe a tiny or a large holding. The [[notional-value|notional value]] depends on the quantity.',
        },
        {
          kind: 'worked-example', title: 'Example 2: from USDT to BTC (illustrative)', fictional: true,
          steps: [
            { text: 'You want to spend 300 USDT at an illustrative 60,000.00 USDT per BTC.' },
            { text: 'Quantity = 300 ÷ 60,000.00', result: '0.005 BTC' },
            { text: '400 USDT at an illustrative 64,000.00: 400 ÷ 64,000.00', result: '0.00625 BTC' },
          ],
          conclusion: 'Divide the USDT amount by the price to get the BTC quantity (fees ignored in this lesson).',
        },
        {
          kind: 'formula', expression: 'value in USDT = BTC amount × USDT per BTC', formulaId: 'T03-F01',
          variables: [
            { symbol: 'BTC amount', meaning: 'the quantity of the base asset', unit: 'BTC' },
            { symbol: 'USDT per BTC', meaning: 'the quoted price of the pair', unit: 'USDT per BTC' },
          ],
        },
      ],
    },
    {
      id: 'T03-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Split the name: the first asset is the base, the second is the quote. BTCUSDT splits into BTC and USDT.',
          'Read the price as “quote per 1 base”: 60,000.00 USDT per 1 BTC.',
          'Check which unit an amount box uses before typing. Quantity is usually in the base asset; cost is in the quote asset.',
          'An asset can be the base in one pair and the quote in another: in a fictional DEMO/BTC pair, BTC is the quote.',
        ] },
      ],
    },
    {
      id: 'T03-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Thinking you must buy a whole BTC', text: 'Crypto is divisible. 0.001 BTC is a normal quantity.' },
        { kind: 'callout', callout: 'mistake', title: 'Mixing base and quote units', text: '“0.01” as a quantity means 0.01 BTC, not 0.01 USDT. Read the unit next to every box.' },
        { kind: 'callout', callout: 'mistake', title: 'Treating USDT as risk-free cash', text: 'A [[stablecoin]] only aims to hold its [[peg]]. It is not a bank deposit.' },
      ],
    },
    {
      id: 'T03-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'USDT and other stablecoins are not guaranteed to stay at 1 US dollar. In stress they can trade below the peg, for example at an illustrative 0.97. Never treat a stablecoin balance as risk-free.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T03-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Reading BTC/USDT (illustrative)', headers: ['Item', 'Meaning', 'Example'], rows: [
          ['Base', 'thing being priced', 'BTC'],
          ['Quote', 'unit of the price', 'USDT'],
          ['Price', 'quote per 1 base', '60,000.00 USDT per BTC'],
          ['Value', 'quantity × price', '0.01 × 60,000.00 = 600.00 USDT'],
          ['Quantity from USDT', 'USDT ÷ price', '300 ÷ 60,000.00 = 0.005 BTC'],
        ] },
      ],
    },
    {
      id: 'T03-N08', heading: 'learn-more', title: 'Learn more: why so many pairs use USDT', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Pricing everything in one steady unit makes prices easy to compare: you can see at a glance what each asset costs in roughly dollar terms. That is why many platforms list pairs such as BTC/USDT. Some markets use other quotes, for example a fictional DEMO/BTC pair priced in BTC. When the quote itself moves (like BTC), the price can change even if nothing happened to the base.' },
        { kind: 'paragraph', text: 'Stablecoins keep their value through reserves or design rules managed by an issuer. If people doubt those reserves, the stablecoin can fall below its peg. Rules about stablecoins differ by country; check current local rules and get qualified advice.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T03-A01', type: 'trading-pair', durationMs: 20_000,
      parameters: { variant: 'price-tag', base: 'BTC', quote: 'USDT', price: 60000 },
      caption: 'A price tag appears: **1 BTC costs 60,000.00 USDT** (illustrative), just like a shop label.',
      narration: 'Read the pair like a shop label: one unit of the first asset costs this many units of the second.',
      reducedMotionDescription: 'A price tag reads: 1 BTC costs 60,000.00 USDT. The price is fictional and illustrative.',
      glossaryRefs: ['trading-pair'],
    },
    {
      id: 'T03-A02', type: 'trading-pair', durationMs: 25_000,
      parameters: { variant: 'split', base: 'BTC', quote: 'USDT', price: 60000 },
      caption: 'BTC/USDT splits in two: **BTC** is the base (being priced), **USDT** is the quote (unit of the price). Symbol: BTCUSDT.',
      narration: 'Arrows point to each half. The base is the thing; the quote is the unit. Many platforms write the same pair without a slash.',
      reducedMotionDescription: 'The text BTC/USDT splits: BTC is labelled base asset, the thing being priced; USDT is labelled quote asset, the unit of the price. The symbol BTCUSDT names the same pair.',
      glossaryRefs: ['base-asset', 'quote-asset', 'symbol'],
    },
    {
      id: 'T03-A03', type: 'trading-pair', durationMs: 30_000,
      parameters: { variant: 'size-compare', base: 'BTC', quote: 'USDT', price: 60000, quantities: [1, 0.001] },
      caption: 'Same price, different quantity: 1 BTC grows to 60,000.00 USDT, while 0.001 BTC reaches only 60.00 USDT.',
      narration: 'Two bars fill up. Both use the same illustrative price, but one thousandth of a bitcoin is worth one thousandth of the value.',
      reducedMotionDescription: 'At an illustrative 60,000.00 USDT per BTC: 1 BTC is worth 60,000.00 USDT and 0.001 BTC is worth 60.00 USDT.',
      glossaryRefs: ['quantity', 'notional-value'],
    },
    {
      id: 'T03-A04', type: 'trading-pair', durationMs: 35_000,
      parameters: { variant: 'reprice', base: 'BTC', quote: 'USDT', price: 60000, prices: [60000, 62000, 57000], quantity: 0.01 },
      caption: 'The price label changes 60,000.00 → 62,000.00 → 57,000.00. Your 0.01 BTC stays 0.01 BTC, but its value moves 600.00 → 620.00 → 570.00 USDT.',
      narration: 'Watch the label update three times. The quantity line never changes; only the value line does.',
      reducedMotionDescription: 'You hold 0.01 BTC. Illustrative price 60,000.00 gives 600.00 USDT; 62,000.00 gives 620.00 USDT; 57,000.00 gives 570.00 USDT. The quantity stays 0.01 BTC.',
      glossaryRefs: ['notional-value'],
    },
    {
      id: 'T03-A05', type: 'trading-pair', durationMs: 25_000,
      parameters: { variant: 'convert-quote-to-base', base: 'BTC', quote: 'USDT', price: 60000, quoteAmount: 300 },
      caption: 'Going the other way: 300.00 USDT ÷ 60,000.00 fills the Receive box with 0.005000 BTC.',
      narration: 'To know how much BTC a USDT amount buys, divide by the price. Fees are ignored here.',
      reducedMotionDescription: 'Spend 300.00 USDT at an illustrative 60,000.00 USDT per BTC: 300 ÷ 60,000 = 0.005 BTC received, fees ignored.',
      glossaryRefs: ['quantity'],
    },
    {
      id: 'T03-A06', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'risk-warning', heading: 'USDT is a stablecoin, not a guarantee', items: ['It aims to stay near 1 US dollar: its peg.', 'A peg can fail; the price can drop below 1.', 'It is not a bank deposit and not government money.'] },
      caption: 'Warning points appear one by one: a stablecoin’s peg is a target that can fail, not a promise.',
      reducedMotionDescription: 'Warning card: USDT aims to stay near 1 US dollar (its peg); a peg can fail and the price can drop below 1; it is not a bank deposit and not government money.',
      glossaryRefs: ['stablecoin', 'peg', 'usdt'],
    },
    {
      id: 'T03-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Reading any pair', items: ['Split it: first = base, second = quote.', 'Price = quote units per 1 base unit.', 'Value = quantity × price.', 'Check the unit of every amount box.'] },
      caption: 'A four-step check builds up that works for any pair on any platform.',
      reducedMotionDescription: 'Checklist: split the pair into base and quote; price is quote units per 1 base unit; value is quantity times price; check the unit of every amount box.',
    },
    {
      id: 'T03-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'recap', heading: 'Remember', items: ['BTC/USDT = BTC priced in USDT.', '0.001 BTC at 60,000.00 = 60.00 USDT.', 'Stablecoin peg: target, not guarantee.'] },
      caption: 'The recap fills in: pair meaning, one calculation, one safety rule.',
      reducedMotionDescription: 'Recap: BTC/USDT means BTC priced in USDT; 0.001 BTC at an illustrative 60,000.00 is worth 60.00 USDT; a stablecoin peg is a target, not a guarantee.',
    },
  ],

  exercises: [
    {
      id: 'T03-X01', type: 'slider-explore', title: 'Pair value calculator',
      fixtureId: 'FX-T03-PAIR-01', simulatorId: 'pair.convert',
      instructions: 'Set a BTC quantity and an illustrative BTC/USDT price. The calculator shows value in USDT = BTC amount × USDT per BTC. Then answer the question.',
      steps: [
        { id: 'T03-X01-01', prompt: 'Move the BTC quantity slider and watch the USDT value.', hint: 'Start at 0.010 BTC × 60,000 = 600.00 USDT, then try 0.020 BTC.' },
        { id: 'T03-X01-02', prompt: 'Move the price slider and keep the quantity fixed.', hint: 'The quantity does not change; only the value does.' },
        { id: 'T03-X01-03', prompt: 'Answer: if you double the quantity and keep the price, what happens to the value?', hint: 'Compare 0.010 BTC and 0.020 BTC at 60,000.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'choice', 'reset', 'hint'],
      parameters: {
        sliders: [
          { key: 'quantity', label: 'BTC quantity', min: 0.001, max: 0.1, step: 0.001, value: 0.01, unit: 'BTC' },
          { key: 'price', label: 'Illustrative price', min: 40000, max: 80000, step: 1000, value: 60000, unit: 'USDT per BTC' },
        ],
        outputs: [{ key: 'quoteValue', label: 'Value', unit: 'USDT', decimals: 2 }],
        note: 'Illustrative prices only. Fees are ignored. Value = quantity × price.',
        question: 'You double the BTC quantity and the price stays the same. What happens to the value in USDT?',
        feedback: {
          double: 'Correct: value = quantity × price, so twice the quantity gives twice the value.',
          same: 'The price stayed the same, but you now hold more BTC, so the value grows.',
          half: 'More BTC at the same price cannot be worth less. Value = quantity × price.',
        },
      },
      choices: [
        { id: 'double', text: 'The value doubles.' },
        { id: 'same', text: 'The value stays the same, because the price did not change.' },
        { id: 'half', text: 'The value halves.' },
      ],
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'double' },
      explanation: 'Value in USDT = BTC amount × USDT per BTC. Doubling either the quantity or the price doubles the value. For example 0.010 × 60,000 = 600.00 USDT and 0.020 × 60,000 = 1,200.00 USDT.',
      fictionalDataLabel: 'Illustrative, fictional BTC/USDT prices for practice only.',
    },
    {
      id: 'T03-X02', type: 'numeric-calculator', title: 'Convert both ways',
      fixtureId: 'FX-T03-PAIR-01', simulatorId: 'pair.convert',
      instructions: 'The illustrative BTC/USDT price is 64,000.00 USDT per BTC. Work out each answer. Fees are ignored.',
      steps: [
        { id: 'T03-X02-01', prompt: 'What is 0.025 BTC worth in USDT? (2 decimals)', hint: 'Multiply: 0.025 × 64,000.00.' },
        { id: 'T03-X02-02', prompt: 'How much BTC does 400 USDT buy? (5 decimals)', hint: 'Divide: 400 ÷ 64,000.00.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: { given: [
        { label: 'Illustrative price', value: 64000, unit: 'USDT per BTC', decimals: 2 },
        { label: 'BTC quantity', value: 0.025, unit: 'BTC', decimals: 3 },
        { label: 'USDT to spend', value: 400, unit: 'USDT', decimals: 2 },
      ] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'quoteValue', label: 'Value of 0.025 BTC', value: 1600, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'quantity', label: 'BTC bought with 400 USDT', value: 0.00625, tolerance: 0.000005, unit: 'BTC', rounding: { decimals: 5 } },
      ] },
      explanation: '0.025 × 64,000.00 = 1,600.00 USDT. 400 ÷ 64,000.00 = 0.00625 BTC. Multiply to go from BTC to USDT; divide to go from USDT to BTC.',
      fictionalDataLabel: 'Illustrative, fictional BTC/USDT price for practice only.',
    },
    {
      id: 'T03-X03', type: 'classify', title: 'Base or quote?',
      fixtureId: 'FX-T03-CLASSIFY-01',
      instructions: 'For each highlighted asset, decide whether it is the base asset or the quote asset in that pair.',
      steps: [
        { id: 'T03-X03-01', prompt: 'Split each pair at the slash (or in your head, for a symbol without one).', hint: 'First = base, second = quote.' },
        { id: 'T03-X03-02', prompt: 'Place every item, then press Check.', hint: 'In DEMO/BTC, BTC comes second.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'btc-in-btcusdt', text: 'BTC in BTC/USDT' },
          { id: 'usdt-in-btcusdt', text: 'USDT in BTC/USDT' },
          { id: 'demo-in-demousdt', text: 'DEMO in DEMO/USDT (fictional)' },
          { id: 'btc-in-demobtc', text: 'BTC in DEMO/BTC (fictional)' },
          { id: 'usdt-in-toyusdt', text: 'USDT in the symbol TOYUSDT (fictional)' },
          { id: 'toy-in-toyusdt', text: 'TOY in the symbol TOYUSDT (fictional)' },
        ],
        buckets: [
          { id: 'base', label: 'Base asset (being priced)' },
          { id: 'quote', label: 'Quote asset (unit of the price)' },
        ],
        itemFeedback: {
          'btc-in-demobtc': 'BTC is second here, so it is the quote: the fictional DEMO is priced in BTC.',
          'usdt-in-toyusdt': 'TOYUSDT splits into TOY and USDT; USDT is second, so it is the quote.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { base: ['btc-in-btcusdt', 'demo-in-demousdt', 'toy-in-toyusdt'], quote: ['usdt-in-btcusdt', 'btc-in-demobtc', 'usdt-in-toyusdt'] } },
      explanation: 'Position decides the role: the first asset is the base, the second is the quote. The same asset (BTC) can be a base in one pair and a quote in another.',
      fictionalDataLabel: 'Fictional and illustrative pair names for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T03-F01', name: 'Value of a quantity', expression: 'value in USDT = BTC amount × USDT per BTC',
      variables: [
        { symbol: 'BTC amount', meaning: 'quantity of the base asset', unit: 'BTC' },
        { symbol: 'USDT per BTC', meaning: 'the quoted price', unit: 'USDT per BTC' },
      ],
      simulatorId: 'pair.convert', approximate: false,
      workedExamples: [
        { label: '1 BTC (scene T03-A03)', inputs: { quantity: 1, price: 60000 }, outputs: { quoteValue: 60000 }, tolerance: 1e-9, assumptions: ['illustrative price', 'fees excluded'] },
        { label: '0.001 BTC (scene T03-A03)', inputs: { quantity: 0.001, price: 60000 }, outputs: { quoteValue: 60 }, tolerance: 1e-9, assumptions: ['illustrative price', 'fees excluded'] },
        { label: '0.01 BTC repriced (slide T03-S04)', inputs: { quantity: 0.01, price: 62000 }, outputs: { quoteValue: 620 }, tolerance: 1e-9, assumptions: ['illustrative price', 'fees excluded'] },
        { label: 'Exercise T03-X02 step 1', inputs: { quantity: 0.025, price: 64000 }, outputs: { quoteValue: 1600 }, tolerance: 1e-9, assumptions: ['illustrative price', 'fees excluded'] },
        { label: 'Quiz T03-Q02', inputs: { quantity: 0.002, price: 55000 }, outputs: { quoteValue: 110 }, tolerance: 1e-9, assumptions: ['illustrative price', 'fees excluded'] },
      ],
    },
    {
      id: 'T03-F02', name: 'Quantity from a USDT amount', expression: 'BTC quantity = USDT amount ÷ USDT per BTC',
      variables: [
        { symbol: 'USDT amount', meaning: 'how much quote asset you spend', unit: 'USDT' },
        { symbol: 'USDT per BTC', meaning: 'the quoted price', unit: 'USDT per BTC' },
      ],
      simulatorId: 'pair.convert', approximate: false,
      workedExamples: [
        { label: '300 USDT (scene T03-A05)', inputs: { quoteAmount: 300, price: 60000 }, outputs: { quantity: 0.005 }, tolerance: 1e-9, assumptions: ['illustrative price', 'fees excluded'] },
        { label: 'Exercise T03-X02 step 2', inputs: { quoteAmount: 400, price: 64000 }, outputs: { quantity: 0.00625 }, tolerance: 1e-9, assumptions: ['illustrative price', 'fees excluded'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T03-Q01', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T03',
      prompt: 'A screen shows BTC/USDT 60,000.00 (illustrative). What does this mean?',
      choices: [
        { id: 'a', text: '1 BTC costs 60,000.00 USDT.' },
        { id: 'b', text: '1 USDT costs 60,000.00 BTC.' },
        { id: 'c', text: 'You own 60,000.00 BTC.' },
        { id: 'd', text: 'BTC will reach 60,000.00 soon.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The price is always quote units per 1 base unit: 60,000.00 USDT for 1 BTC.',
      misconceptionFeedback: {
        b: 'This reverses the pair. BTC is the base (first), so the price is USDT per 1 BTC.',
        c: 'A pair price says nothing about what you own. Your quantity is shown separately.',
        d: 'A price shows the current quote, not a prediction.',
      },
      learningOutcome: 'Read a pair price as quote units per one base unit.',
      remediationRef: { lessonId: 'T03', anchorId: 'T03-N01' },
      shuffleChoices: true,
    },
    {
      id: 'T03-Q02', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T03',
      prompt: 'You hold 0.002 BTC. The illustrative BTC/USDT price is 55,000.00. What is your holding worth in USDT?',
      answer: { kind: 'numeric', value: 110, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Value = 0.002 × 55,000.00 = 110.00 USDT.',
      learningOutcome: 'Compute value in USDT from a BTC quantity and a price.',
      remediationRef: { lessonId: 'T03', anchorId: 'T03-N03' },
    },
    {
      id: 'T03-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T03', safetyCritical: true, safetyTopic: 'stablecoin-risk',
      prompt: 'A friend says: “USDT is a stablecoin, so 100 USDT is guaranteed to always be worth exactly 100 US dollars.” What is the best response?',
      choices: [
        { id: 'a', text: 'Not quite: USDT aims to stay near 1 US dollar, but the peg is a target, not a guarantee. It can trade below 1.' },
        { id: 'b', text: 'Correct: stablecoins are guaranteed by the government.' },
        { id: 'c', text: 'Correct: “stable” means its value can never change.' },
        { id: 'd', text: 'Stablecoins are the same as money in a bank account, so there is no risk.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A stablecoin’s peg is a design goal kept by reserves or rules. Stablecoins have lost their peg before, so the value is not guaranteed.',
      misconceptionFeedback: {
        b: 'Stablecoins such as USDT are issued by private companies, not guaranteed by a government.',
        c: '“Stable” describes the aim. In stressed markets a stablecoin can move away from 1.',
        d: 'A stablecoin is a crypto token, not a bank deposit. It carries its own risks.',
      },
      learningOutcome: 'Explain that a stablecoin is not guaranteed to keep its peg.',
      remediationRef: { lessonId: 'T03', anchorId: 'T03-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T03-Q04', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T03',
      prompt: 'You hold 0.01 BTC. The illustrative price moves from 60,000.00 to 62,000.00 USDT. What changed?',
      choices: [
        { id: 'a', text: 'Your quantity is still 0.01 BTC; its value rose from 600.00 to 620.00 USDT.' },
        { id: 'b', text: 'Your quantity rose to 0.0103 BTC.' },
        { id: 'c', text: 'Nothing changed, because you did not trade.' },
        { id: 'd', text: 'Your value fell, because BTC became more expensive.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A price change moves the value (0.01 × 62,000.00 = 620.00 USDT). The quantity only changes when you buy or sell.',
      misconceptionFeedback: {
        b: 'The quantity of BTC does not change with the price. Only buying or selling changes it.',
        c: 'Even without trading, the value of your holding follows the price.',
        d: 'You hold BTC, so a higher BTC price raises the value of what you hold.',
      },
      learningOutcome: 'Separate quantity (unchanged) from value (moves with price).',
      remediationRef: { lessonId: 'T03', anchorId: 'T03-N02' },
      shuffleChoices: true,
    },
    {
      id: 'T03-Q05', type: 'single', cognitiveTag: 'application', linkedLessonId: 'T03',
      prompt: 'A platform lists the symbol BTCUSDT. Which statement is correct?',
      choices: [
        { id: 'a', text: 'It is the same pair as BTC/USDT: BTC is the base and USDT is the quote.' },
        { id: 'b', text: 'It is a new coin called BTCUSDT.' },
        { id: 'c', text: 'USDT is the base and BTC is the quote.' },
        { id: 'd', text: 'The symbol tells you the price.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Many platforms drop the slash. BTCUSDT splits into BTC (base, first) and USDT (quote, second).',
      misconceptionFeedback: {
        b: 'A symbol is a name for a market, not a separate coin.',
        c: 'The first asset is the base. BTC comes first.',
        d: 'A symbol names the market. The price is shown separately.',
      },
      learningOutcome: 'Read a symbol without a slash as a base/quote pair.',
      remediationRef: { lessonId: 'T03', anchorId: 'T03-N04' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Thinking you can only buy a whole BTC.', correction: 'Crypto is divisible; 0.001 BTC is a normal quantity worth 60.00 USDT at an illustrative 60,000.00.' },
    { mistake: 'Reading the pair backwards (USDT priced in BTC).', correction: 'The first asset is the base. The price is quote units per 1 base unit.' },
    { mistake: 'Treating USDT as guaranteed cash.', correction: 'A stablecoin only aims to keep its peg. The peg can fail.' },
  ],
  takeaways: [
    'BASE/QUOTE: the base is being priced; the quote is the unit of the price.',
    'Value in USDT = BTC amount × USDT per BTC; quantity = USDT amount ÷ price.',
    'A stablecoin such as USDT aims for a 1-dollar peg, but the peg is not guaranteed.',
  ],
  reviewCard: {
    keyTermIds: ['trading-pair', 'notional-value', 'peg'],
    safetyNote: 'Stablecoins such as USDT are not guaranteed to stay at 1 US dollar. Never treat them as risk-free cash.',
    reviewMinutes: 3,
    retrievalQuestion: 'At an illustrative 50,000.00 USDT per BTC, what is 0.004 BTC worth, and which asset is the base in BTC/USDT?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T03-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
