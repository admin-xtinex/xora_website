import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures, NEWS_PATH } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices in this lesson are fictional TOY/USDT examples. The buyers-and-sellers slider is an illustrative toy model, not a prediction of real markets.';

const JAGGED = [100.0, 100.6, 99.8, 101.1, 100.4, 101.9, 101.2, 102.4, 101.6, 102.0];
const SMOOTH = [100.0, 100.22, 100.44, 100.67, 100.89, 101.11, 101.33, 101.56, 101.78, 102.0];

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can explain that a price moves when buying interest (demand) and selling interest (supply) change against each other.',
    'Learner can use an illustrative toy model to compute a price from buyers, sellers, a base price and a step size.',
    'Learner can explain why real price paths are jagged and why news and low liquidity can cause fast, large moves.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T02-S01', kind: 'cover-problem', title: 'A market is people agreeing on a price',
      narrationText: 'A market is a crowd of buyers and sellers. Every trade happens at one price that both sides accept. The latest of those prices is what you see on the screen.',
      blocks: [
        { kind: 'paragraph', text: 'A market is a crowd of [[buyer|buyers]] and [[seller|sellers]].' },
        { kind: 'paragraph', text: 'Each trade happens at one price both sides accept. The latest one is the [[market-price]].' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T02-A01' },
      glossaryRefs: ['buyer', 'seller', 'market-price'],
      speakerNotes: 'Use a vegetable market analogy: the price on the board is just the last price someone actually paid.',
    },
    {
      id: 'T02-S02', kind: 'key-definition', title: 'Demand and supply',
      narrationText: 'Demand is buying interest: how much people want to buy and what they will pay. Supply is selling interest. When one side becomes stronger, the price moves toward the other side.',
      blocks: [
        { kind: 'definition', termId: 'demand' },
        { kind: 'definition', termId: 'supply' },
        { kind: 'paragraph', text: 'Stronger buying pushes price **up**. Stronger selling pushes it **down**.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T02-A02' },
      glossaryRefs: ['demand', 'supply'],
    },
    {
      id: 'T02-S03', kind: 'visual-breakdown', title: 'Buyer demand vs seller pressure',
      narrationText: 'If buyers become more eager, they must offer more to get filled, so the price ticks up. If sellers become more eager, they accept less, so the price ticks down.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          'More eager buyers: they bid higher, price ticks **up**.',
          'More eager sellers: they accept less, price ticks **down**.',
          'Balanced interest: price wobbles around the same level.',
        ] },
      ],
      visualRef: { kind: 'scene', sceneId: 'T02-A03' },
      glossaryRefs: ['buyer', 'seller'],
    },
    {
      id: 'T02-S04', kind: 'worked-example', title: 'A toy model (not a real market)',
      narrationText: 'Our illustrative toy model says: price equals 100 plus 0.50 for every extra buyer over sellers. With 9 buyers and 5 sellers that gives 102. Real markets are far more complicated.',
      blocks: [
        {
          kind: 'worked-example', title: 'Illustrative TOY/USDT toy model', fictional: true,
          steps: [
            { text: 'Toy price = 100.00 + 0.50 × (buyers − sellers)' },
            { text: '9 buyers, 5 sellers: 100.00 + 0.50 × 4', result: '102.00 USDT' },
            { text: '5 buyers, 10 sellers: 100.00 + 0.50 × (−5)', result: '97.50 USDT' },
          ],
          conclusion: 'An illustrative model only. It is not a prediction of real markets.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T02-A02' },
      glossaryRefs: ['demand', 'supply'],
    },
    {
      id: 'T02-S05', kind: 'risks-misunderstanding', title: 'Surprises and jagged paths',
      narrationText: 'Real prices do not glide in smooth lines. They zig-zag. Headcount is not everything: size and urgency matter. And surprise news or a thin market can make the price jump in seconds.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Prices move in smooth lines', text: 'Real paths are **jagged**. Even a rising price falls back often on the way.' },
        { kind: 'callout', callout: 'safety', text: 'News or low [[liquidity]] can cause sudden, large moves: high [[volatility]]. Nobody can promise the next move.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T02-A06' },
      glossaryRefs: ['liquidity', 'volatility'],
    },
    {
      id: 'T02-S06', kind: 'guided-practice', title: 'Your turn: move the sliders',
      narrationText: 'Move the buyers and sellers sliders and watch the toy price. Then set 12 buyers and 6 sellers and work out the price yourself. Remember: this is an illustrative model, not a prediction.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Raise buyers: watch the toy price.', 'Raise sellers: watch it fall.', 'Set 12 buyers, 6 sellers and compute the price.'] },
        { kind: 'callout', callout: 'approximation', text: 'Illustrative model, not a prediction of real markets.' },
      ],
      glossaryRefs: ['buyer', 'seller'],
    },
    {
      id: 'T02-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Price moves when buying and selling interest change. Size and urgency matter, not just headcount. Paths are jagged, and news or thin liquidity can cause fast moves. No model predicts real prices.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          'Stronger demand pushes price up; stronger supply pushes it down.',
          'Size and urgency matter, not only headcount.',
          'Real paths are jagged, not smooth.',
          'News and thin liquidity can cause fast moves.',
        ] },
      ],
      glossaryRefs: ['demand', 'supply', 'volatility'],
    },
  ],

  notesSections: [
    {
      id: 'T02-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'A price moves because [[buyer|buyers]] and [[seller|sellers]] keep changing how much they want to trade and at what price. Buying interest is called [[demand]]; selling interest is called [[supply]]. The [[market-price]] is simply the price of the most recent trade, where one buyer and one seller agreed. When demand grows stronger than supply, buyers must pay more to get filled and the price rises. When supply grows stronger, sellers must accept less and the price falls.' },
        { kind: 'analogy', text: 'Think of mangoes at a busy market. If many shoppers suddenly want mangoes and few sellers have them, the price board goes up. If a truck of mangoes arrives and shoppers are few, sellers cut the price to sell.' },
      ],
    },
    {
      id: 'T02-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Every chart you will read later is the record of this tug-of-war. Knowing that price is a moving agreement, not a fixed value, helps you expect sudden moves. It also explains why the same order can move the price a little in a busy market and a lot in a quiet one: that is [[liquidity]].' },
      ],
    },
    {
      id: 'T02-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: an illustrative toy model (TOY/USDT)', fictional: true,
          steps: [
            { text: 'Toy rule: price = 100.00 + 0.50 × (buyers − sellers).' },
            { text: 'Balanced: 5 buyers, 5 sellers: 100.00 + 0.50 × 0', result: '100.00 USDT' },
            { text: 'Demand up: 9 buyers, 5 sellers: 100.00 + 0.50 × 4', result: '102.00 USDT' },
            { text: 'Supply up: 5 buyers, 10 sellers: 100.00 + 0.50 × (−5)', result: '97.50 USDT' },
          ],
          conclusion: 'This model is illustrative only. Real prices depend on order sizes, urgency, news and much more; no model predicts them.',
        },
        {
          kind: 'worked-example', title: 'Example 2: the same push in a busy and a thin market (fictional)', fictional: true,
          steps: [
            { text: 'Busy (liquid) market: 2 extra buyers move the price from 100.00 to 101.00', result: '+1.00%' },
            { text: 'Thin market: 2 extra buyers move the price from 100.00 to 104.00', result: '+4.00%' },
          ],
          conclusion: 'With few orders waiting, the same buying pushes the price four times further. That is why thin markets are more volatile.',
        },
        {
          kind: 'formula', expression: 'toy price = basePrice + stepPerLevel × (buyers − sellers)', formulaId: 'T02-F01',
          variables: [
            { symbol: 'basePrice', meaning: 'the toy price when buyers and sellers are equal (100.00 here)', unit: 'USDT per TOY' },
            { symbol: 'stepPerLevel', meaning: 'how much one extra buyer or seller moves the toy price', unit: 'USDT per TOY' },
            { symbol: 'buyers, sellers', meaning: 'how many eager buyers and sellers the toy market has', unit: 'count' },
          ],
          note: 'Illustrative model, not a prediction of real markets.',
        },
      ],
    },
    {
      id: 'T02-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Price ticking up again and again usually means buyers are accepting higher prices: demand is stronger right now.',
          'Price ticking down means sellers are accepting lower prices: selling pressure is stronger right now.',
          'A sudden jump or drop after quiet trading often follows news or a large order hitting a thin market.',
          'A zig-zag line is normal. Even a rising price pulls back many times; that back-and-forth is [[volatility]].',
        ] },
      ],
    },
    {
      id: 'T02-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Counting people only', text: 'Ten small buyers can matter less than one large, urgent seller. Size and urgency move price, not headcount alone.' },
        { kind: 'callout', callout: 'mistake', title: 'Expecting smooth lines', text: 'Real paths are jagged. A pull-back inside a rise is normal, not proof the rise is over.' },
        { kind: 'callout', callout: 'mistake', title: 'Treating a model as a forecast', text: 'The toy slider shows an idea. It does not tell you where any real price will go.' },
      ],
    },
    {
      id: 'T02-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Prices can move fast and without warning, especially after news or in thin markets. No model, chart or person can promise the next move. Waiting or not trading is always a valid choice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T02-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'What pushes price', headers: ['Situation', 'Typical effect'], rows: [
          ['Demand stronger than supply', 'price tends to rise'],
          ['Supply stronger than demand', 'price tends to fall'],
          ['Thin market (low liquidity)', 'small orders move price a lot'],
          ['Surprise news', 'fast, large moves either way'],
        ] },
      ],
    },
    {
      id: 'T02-N08', heading: 'learn-more', title: 'Learn more: why headcount is not everything', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Real markets are not counted in people. They are counted in orders: how much someone wants to buy or sell, and at which price. One fund selling a large amount quickly can push the price down even while thousands of small buyers are active. Lesson T04 shows how waiting orders line up in an order book and how a large order eats through them. For now, remember that price follows the balance of size and urgency, and that this balance can change in seconds.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T02-A01', type: 'supply-demand', durationMs: 20_000,
      parameters: { variant: 'balanced', basePrice: 100, stepPerLevel: 0.5, buyers: [5, 5], sellers: [5, 5] },
      caption: 'Buy and sell queues fill up: 5 buyers face 5 sellers, and the toy price holds at **100.00**.',
      narration: 'Buyers line up on the left, sellers on the right. With equal interest, the toy price stays at its base.',
      reducedMotionDescription: 'Illustrative toy model: 5 buyers and 5 sellers. Buying and selling interest are equal, so the toy price stays at 100.00 USDT.',
      glossaryRefs: ['buyer', 'seller'],
    },
    {
      id: 'T02-A02', type: 'supply-demand', durationMs: 30_000,
      parameters: { variant: 'demand-up', basePrice: 100, stepPerLevel: 0.5, buyers: [5, 9], sellers: [5, 5] },
      caption: 'Demand grows: buyers rise from 5 to 9 while sellers stay at 5, and the toy price ticks up from 100.00 to **102.00**.',
      narration: 'More eager buyers must offer more to get filled, so each new trade happens a little higher.',
      reducedMotionDescription: 'Illustrative toy model: buyers increase from 5 to 9, sellers stay at 5. The toy price rises step by step from 100.00 to 102.00 USDT (100 + 0.50 × 4).',
      glossaryRefs: ['demand'],
    },
    {
      id: 'T02-A03', type: 'supply-demand', durationMs: 30_000,
      parameters: { variant: 'supply-up', basePrice: 100, stepPerLevel: 0.5, buyers: [5, 5], sellers: [5, 10] },
      caption: 'Selling pressure grows: sellers rise from 5 to 10 while buyers stay at 5, and the toy price ticks down from 100.00 to **97.50**.',
      narration: 'Eager sellers accept lower prices to get out, so each new trade happens a little lower.',
      reducedMotionDescription: 'Illustrative toy model: sellers increase from 5 to 10, buyers stay at 5. The toy price falls step by step from 100.00 to 97.50 USDT (100 + 0.50 × (−5)).',
      glossaryRefs: ['supply'],
    },
    {
      id: 'T02-A04', type: 'supply-demand', durationMs: 25_000,
      parameters: { variant: 'thin-market', basePrice: 100, stepPerLevel: 2, buyers: [1, 3], sellers: [1, 1] },
      caption: 'A thin market: only 1 seller waits. Buyers go from 1 to 3 and the toy price jumps from 100.00 to **104.00**, 2.00 per buyer.',
      narration: 'With few orders waiting, each extra buyer moves the price four times further than in the busy market.',
      reducedMotionDescription: 'Illustrative thin market: 1 seller, buyers rising from 1 to 3. Each extra buyer moves the toy price by 2.00 instead of 0.50, so the price jumps from 100.00 to 104.00 USDT.',
      glossaryRefs: ['liquidity'],
    },
    {
      id: 'T02-A05', type: 'price-path', durationMs: 30_000,
      parameters: { variant: 'horizon-compare', points: JAGGED, comparePoints: SMOOTH, label: 'What prices really do: jagged', compareLabel: 'The smooth-line myth' },
      caption: 'Two paths draw from 100.00 to 102.00: the real-looking one zig-zags up and down, the myth glides in a straight line.',
      narration: 'Both end at 102.00, but the real-looking path dips back four times on the way. Smooth lines are a misconception.',
      reducedMotionDescription: 'Top: a jagged fictional path 100.00, 100.60, 99.80, 101.10, 100.40, 101.90, 101.20, 102.40, 101.60, 102.00. Bottom: a smooth line rising evenly from 100.00 to 102.00. Real prices look like the top one.',
      glossaryRefs: ['volatility'],
    },
    {
      id: 'T02-A06', type: 'price-path', durationMs: 30_000,
      parameters: { variant: 'plain', points: NEWS_PATH, markers: [{ index: 5, label: 'Surprise news' }] },
      caption: 'Quiet trading near 100.00, then surprise news: the price jumps to 104.50 in one minute and keeps swinging.',
      narration: 'A headline arrives and many people act at once. The price leaps 4.50% and then swings between 102.80 and 105.10.',
      reducedMotionDescription: 'Fictional minute prices: 100.00, 100.20, 99.90, 100.10, 100.00, then surprise news, 104.50, 103.20, 105.10, 102.80, 103.60. The jump from 100.00 to 104.50 is a 4.50% move in one minute.',
      glossaryRefs: ['volatility', 'market-price'],
    },
    {
      id: 'T02-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'Prices can surprise you', items: [
        'Headcount is not everything: size and urgency matter.',
        'News can move price in seconds.',
        'Thin markets jump further on small orders.',
        'No model predicts real prices. Waiting is always allowed.',
      ] },
      caption: 'Warning items appear one by one: size matters, news moves fast, thin markets jump, no model predicts.',
      reducedMotionDescription: 'Warning card: headcount is not everything, size and urgency matter; news can move price in seconds; thin markets jump further on small orders; no model predicts real prices and waiting is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T02-X01', type: 'slider-explore', title: 'Buyers vs sellers (illustrative model)',
      fixtureId: 'FX-T02-TOY-01', simulatorId: 'price.linear-toy',
      instructions: 'Move the buyers and sellers sliders and watch the toy price. Base price is 100.00 and each extra buyer over sellers adds 0.50. This is an illustrative model, not a prediction of real markets.',
      steps: [
        { id: 'T02-X01-01', prompt: 'Raise the buyers slider. What happens to the toy price?', hint: 'More buyers than sellers pushes the toy price above 100.00.' },
        { id: 'T02-X01-02', prompt: 'Raise the sellers slider above the buyers. What happens now?', hint: 'More sellers than buyers pushes the toy price below 100.00.' },
        { id: 'T02-X01-03', prompt: 'Set 12 buyers and 6 sellers. Work out the toy price and type it in.', hint: '100.00 + 0.50 × (12 − 6) = 100.00 + 3.00.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'reset', 'hint'],
      parameters: {
        sliders: [
          { key: 'buyers', label: 'Buyers (buying interest)', min: 0, max: 20, step: 1, value: 5, unit: 'buyers' },
          { key: 'sellers', label: 'Sellers (selling interest)', min: 0, max: 20, step: 1, value: 5, unit: 'sellers' },
        ],
        fixed: { basePrice: 100, stepPerLevel: 0.5 },
        outputs: [{ key: 'price', label: 'Toy price (illustrative)', unit: 'USDT per TOY', decimals: 2 }],
        note: '**Illustrative model, not a prediction of real markets.** Real prices also depend on order sizes, urgency, news and [[liquidity]].',
      },
      expectedEvaluation: { kind: 'numeric', value: 103, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      explanation: '100.00 + 0.50 × (12 − 6) = 103.00 USDT. In this toy model only the difference between buyers and sellers matters. Real markets are much messier.',
      fictionalDataLabel: 'Illustrative toy model with fictional TOY/USDT prices — not a prediction of real markets.',
    },
    {
      id: 'T02-X02', type: 'choice-feedback', title: 'Busy market or thin market?',
      fixtureId: 'FX-T02-NEWS-01',
      instructions: 'Two fictional markets trade at 100.00. Market A has many orders waiting at nearby prices. Market B has only a few. The same large buy order arrives in each. The chart shows how fast a thin market can move after news.',
      steps: [
        { id: 'T02-X02-01', prompt: 'Think about how many sell orders are waiting to absorb the buying in each market.', hint: 'Fewer waiting orders means the buyer has to climb to higher prices to get filled.' },
        { id: 'T02-X02-02', prompt: 'Choose which price will most likely move further, then press Check.', hint: 'This is what low liquidity means.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      choices: [
        { id: 'thin', text: 'Market B (thin): few waiting orders, so the price is pushed further.' },
        { id: 'busy', text: 'Market A (busy): more orders means bigger moves.' },
        { id: 'same', text: 'Both move the same, because the order size is the same.' },
      ],
      parameters: {
        showChart: true,
        feedback: {
          thin: 'Correct. With low liquidity the buyer runs out of nearby sellers and pays higher and higher prices.',
          busy: 'Many waiting orders absorb a large order with only a small price change. That is high liquidity.',
          same: 'The same order meets different amounts of waiting interest. In the thin market it moves price much further.',
        },
      },
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'thin' },
      explanation: 'Liquidity is how easily you can trade without moving the price. In a thin market the same order pushes the price further, which is one reason prices can jump suddenly.',
      fictionalDataLabel: 'Fictional TOY/USDT data for practice only.',
    },
    {
      id: 'T02-X03', type: 'classify', title: 'Myth or fact?',
      fixtureId: 'FX-T02-CLASSIFY-01',
      instructions: 'Sort each statement about price moves into Myth or Fact.',
      steps: [
        { id: 'T02-X03-01', prompt: 'Read each statement and ask: does it promise something, or describe how markets work?', hint: 'Words like “always” and “predicts” are warning signs.' },
        { id: 'T02-X03-02', prompt: 'Place all six statements, then press Check.', hint: 'Look back at the jagged-path and surprise-news scenes.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'smooth', text: 'Prices usually move in smooth, straight lines.' },
          { id: 'headcount', text: 'More buyers than sellers always means the price must rise.' },
          { id: 'toy-predicts', text: 'The slider toy model predicts real crypto prices.' },
          { id: 'news', text: 'A surprise headline can move the price within seconds.' },
          { id: 'thin', text: 'In a thin market, one large order can move the price a lot.' },
          { id: 'last-trade', text: 'The shown market price is where a buyer and a seller last agreed.' },
        ],
        buckets: [
          { id: 'myth', label: 'Myth' },
          { id: 'fact', label: 'Fact' },
        ],
        itemFeedback: {
          smooth: 'Myth. Real price paths are jagged, with many pull-backs.',
          headcount: 'Myth. Order size and urgency matter; one large seller can outweigh many small buyers.',
          'toy-predicts': 'Myth. It is an illustrative model, not a prediction of real markets.',
          news: 'Fact. News makes many people act at once, which can cause fast moves.',
          thin: 'Fact. Low liquidity means fewer orders to absorb a trade.',
          'last-trade': 'Fact. The market price is usually the last traded price.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { myth: ['smooth', 'headcount', 'toy-predicts'], fact: ['news', 'thin', 'last-trade'] } },
      explanation: 'Prices are jagged, depend on size and urgency rather than headcount, and no toy model predicts them. News and thin markets can cause fast moves.',
      fictionalDataLabel: 'Illustrative statements for practice — no real market data.',
    },
  ],

  formulas: [
    {
      id: 'T02-F01', name: 'Illustrative toy price', expression: 'toy price = basePrice + stepPerLevel × (buyers − sellers)',
      variables: [
        { symbol: 'basePrice', meaning: 'toy price when buyers equal sellers', unit: 'USDT per TOY' },
        { symbol: 'stepPerLevel', meaning: 'price change per extra buyer or seller', unit: 'USDT per TOY' },
        { symbol: 'buyers, sellers', meaning: 'counts in the toy market', unit: 'count' },
      ],
      simulatorId: 'price.linear-toy', approximate: true,
      workedExamples: [
        { label: 'Balanced (scene T02-A01)', inputs: { buyers: 5, sellers: 5, basePrice: 100, stepPerLevel: 0.5 }, outputs: { price: 100 }, tolerance: 1e-9, assumptions: ['illustrative toy model'] },
        { label: 'Demand up (scene T02-A02)', inputs: { buyers: 9, sellers: 5, basePrice: 100, stepPerLevel: 0.5 }, outputs: { price: 102 }, tolerance: 1e-9, assumptions: ['illustrative toy model'] },
        { label: 'Supply up (scene T02-A03)', inputs: { buyers: 5, sellers: 10, basePrice: 100, stepPerLevel: 0.5 }, outputs: { price: 97.5 }, tolerance: 1e-9, assumptions: ['illustrative toy model'] },
        { label: 'Thin market (scene T02-A04)', inputs: { buyers: 3, sellers: 1, basePrice: 100, stepPerLevel: 2 }, outputs: { price: 104 }, tolerance: 1e-9, assumptions: ['illustrative toy model'] },
        { label: 'Exercise T02-X01', inputs: { buyers: 12, sellers: 6, basePrice: 100, stepPerLevel: 0.5 }, outputs: { price: 103 }, tolerance: 1e-9, assumptions: ['illustrative toy model'] },
        { label: 'Quiz T02-Q01', inputs: { buyers: 8, sellers: 14, basePrice: 100, stepPerLevel: 0.5 }, outputs: { price: 97 }, tolerance: 1e-9, assumptions: ['illustrative toy model'] },
      ],
    },
    {
      id: 'T02-F02', name: 'Percent change of a price', expression: 'percent change = (new price − old price) ÷ old price × 100',
      variables: [
        { symbol: 'old price, new price', meaning: 'the price before and after the move', unit: 'USDT per TOY' },
      ],
      simulatorId: 'price.percent-change', approximate: false,
      workedExamples: [
        { label: 'Busy market (notes example 2)', inputs: { oldPrice: 100, newPrice: 101 }, outputs: { percentChange: 1 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Thin market (notes example 2)', inputs: { oldPrice: 100, newPrice: 104 }, outputs: { percentChange: 4 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Surprise news (scene T02-A06)', inputs: { oldPrice: 100, newPrice: 104.5 }, outputs: { percentChange: 4.5 }, tolerance: 1e-9, assumptions: ['fictional data'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T02-Q01', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T02',
      prompt: 'In the illustrative toy model (base 100.00, step 0.50), there are 8 buyers and 14 sellers. What is the toy price in USDT?',
      answer: { kind: 'numeric', value: 97, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: '100.00 + 0.50 × (8 − 14) = 100.00 − 3.00 = 97.00 USDT. More sellers than buyers pushes the toy price below the base.',
      learningOutcome: 'Compute a price in the illustrative toy model.',
      remediationRef: { lessonId: 'T02', anchorId: 'T02-N03' },
    },
    {
      id: 'T02-Q02', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T02', fixtureId: 'FX-T02-NEWS-01',
      prompt: 'On the fictional chart, the price sits near 100.00, then jumps to 104.50 in one minute after surprise news and swings between 102.80 and 105.10. What does this show?',
      choices: [
        { id: 'a', text: 'News made many people act at once, causing a fast, large move: high volatility.' },
        { id: 'b', text: 'The price will now keep rising smoothly.' },
        { id: 'c', text: 'Nothing changed, because the price is still above 100.00.' },
        { id: 'd', text: 'The chart is wrong, because real prices never move that fast.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A sudden 4.50% jump followed by wide swings is volatility caused by many traders reacting to news at the same time.',
      misconceptionFeedback: {
        b: 'Nothing says the rise continues. After the jump the price already swings back and forth.',
        c: 'A 4.50% jump in one minute is a big change, even if the price is still above where it started.',
        d: 'Real prices can and do move this fast, especially after news or in thin markets.',
      },
      learningOutcome: 'Interpret a sudden price jump as volatility caused by news.',
      remediationRef: { lessonId: 'T02', anchorId: 'T02-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T02-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T02', safetyCritical: true, safetyTopic: 'not-advice',
      prompt: 'A learner moves the toy sliders to 15 buyers and 5 sellers, sees 105.00, and says: “So the real price will go up 5%. I should buy now.” What is the best response?',
      choices: [
        { id: 'a', text: 'The toy model is illustrative, not a prediction of real markets. It cannot tell you where a real price goes, and waiting or not trading is always allowed.' },
        { id: 'b', text: 'Agree: the model shows the real price will reach 105.00.' },
        { id: 'c', text: 'Agree, but only if there are really more buyers than sellers today.' },
        { id: 'd', text: 'Disagree: the real price will fall instead.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The slider only shows the idea that buying and selling interest push price. Real prices also depend on order size, urgency, news and liquidity. No model predicts them.',
      misconceptionFeedback: {
        b: 'The toy model is made up for teaching. It does not know anything about a real market.',
        c: 'Even with more buyers, size, urgency and news can move the price the other way. Headcount is not everything.',
        d: 'Predicting a fall is the same mistake in the other direction. Nobody can promise the next move.',
      },
      learningOutcome: 'Recognise that an illustrative model is not a prediction or a reason to trade.',
      remediationRef: { lessonId: 'T02', anchorId: 'T02-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T02-Q04', type: 'single', cognitiveTag: 'mistake-risk', linkedLessonId: 'T02',
      prompt: 'There are 50 small buyers and 3 sellers in a fictional market, but the price is falling. How can that be?',
      choices: [
        { id: 'a', text: 'The sellers may be selling much larger amounts, and more urgently, than the buyers are buying.' },
        { id: 'b', text: 'It is impossible: more buyers always means a rising price.' },
        { id: 'c', text: 'The price display must be broken.' },
        { id: 'd', text: 'Falling prices only happen when there are no buyers at all.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Price follows the balance of size and urgency, not headcount. A few large, eager sellers can outweigh many small, patient buyers.',
      misconceptionFeedback: {
        b: 'Headcount is not everything. Order size and urgency decide which side pushes harder.',
        c: 'Nothing is broken. This happens often in real markets.',
        d: 'Prices often fall while many buyers are active, if selling pressure is stronger.',
      },
      learningOutcome: 'Explain that price is not decided by the number of people alone.',
      remediationRef: { lessonId: 'T02', anchorId: 'T02-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T02-Q05', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T02',
      prompt: 'Which market will most likely move further when the same large buy order arrives?',
      choices: [
        { id: 'a', text: 'A thin market with few orders waiting (low liquidity).' },
        { id: 'b', text: 'A busy market with many orders waiting (high liquidity).' },
        { id: 'c', text: 'Both move the same amount.' },
        { id: 'd', text: 'Neither: buy orders never change the price.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'With low liquidity there are few sellers near the current price, so the buyer pays higher and higher prices.',
      misconceptionFeedback: {
        b: 'Many waiting orders absorb the buying with little price change.',
        c: 'The amount of waiting interest differs, so the price impact differs.',
        d: 'Every trade sets a new market price. Large orders can move it a lot.',
      },
      learningOutcome: 'Relate liquidity to how far a price moves.',
      remediationRef: { lessonId: 'T02', anchorId: 'T02-N03' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Judging price direction by counting buyers and sellers.', correction: 'Order size and urgency matter more than headcount.' },
    { mistake: 'Expecting prices to move in smooth lines.', correction: 'Real paths are jagged; pull-backs are normal.' },
    { mistake: 'Treating a toy model or one chart as a forecast.', correction: 'Models illustrate ideas. No model predicts real prices, and waiting is always allowed.' },
  ],
  takeaways: [
    'Price moves when buying interest (demand) and selling interest (supply) change against each other.',
    'Size and urgency matter more than headcount, and real price paths are jagged.',
    'News and low liquidity can cause fast, large moves; no model predicts real prices.',
  ],
  reviewCard: {
    keyTermIds: ['demand', 'liquidity', 'volatility'],
    safetyNote: 'Prices can jump without warning after news or in thin markets. No model predicts them, and waiting or not trading is always allowed.',
    reviewMinutes: 3,
    retrievalQuestion: 'In the toy model (base 100, step 0.50), what is the price with 9 buyers and 5 sellers, and why can a real price behave differently?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T02-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
