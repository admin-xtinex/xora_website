import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can name the four prices of a candle (open, high, low, close) and point to each on a chart.',
    'Learner can tell a bullish, bearish and doji candle apart using the open and close numbers, not colour alone.',
    'Learner can calculate body, upper wick, lower wick and range from OHLC values.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T14-S01', kind: 'cover-problem', title: 'One minute, many prices',
      narrationText: 'In one minute, a market can trade at dozens of different prices. Writing them all down is hard to read. A candlestick squeezes that whole minute into one small shape.',
      blocks: [
        { kind: 'paragraph', text: 'In one minute a market can trade at dozens of prices. A list of all of them is hard to read.' },
        { kind: 'paragraph', text: 'A [[candlestick]] squeezes the whole minute into **one shape** with four numbers.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T14-A05' },
      glossaryRefs: ['candlestick'],
      speakerNotes: 'Start from the problem, not the jargon. Learners have seen charts but rarely know what one candle summarises.',
    },
    {
      id: 'T14-S02', kind: 'key-definition', title: 'The four prices: OHLC',
      narrationText: 'Every candle stores four prices. Open is the first trade. High is the highest trade. Low is the lowest trade. Close is the last trade when the time is up.',
      blocks: [
        { kind: 'list', ordered: true, items: ['**Open**: first trade of the period', '**High**: highest trade', '**Low**: lowest trade', '**Close**: last trade when time runs out'] },
        { kind: 'definition', termId: 'ohlc' },
      ],
      glossaryRefs: ['ohlc', 'open-price', 'high-price', 'low-price', 'close-price'],
    },
    {
      id: 'T14-S03', kind: 'visual-breakdown', title: 'Body and wicks',
      narrationText: 'The thick body runs between open and close. Thin wicks stretch up to the high and down to the low. Body plus both wicks always equals the full range.',
      blocks: [
        { kind: 'paragraph', text: 'The thick [[candle-body|body]] runs from open to close. Thin [[wick|wicks]] reach the high and the low.' },
        { kind: 'paragraph', text: 'Body + upper wick + lower wick = [[candle-range|range]] (high − low).' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T14-A04' },
      glossaryRefs: ['candle-body', 'wick', 'candle-range'],
    },
    {
      id: 'T14-S04', kind: 'worked-example', title: 'Reading a real-looking (fictional) candle',
      narrationText: 'Our fictional minute opened at 100.00, went as high as 101.20, as low as 99.40 and closed at 100.80. Close is above open, so it is bullish. The body is 0.80.',
      blocks: [
        {
          kind: 'worked-example', title: 'DEMO/USDT, one fictional minute', fictional: true,
          steps: [
            { text: 'O 100.00 · H 101.20 · L 99.40 · C 100.80' },
            { text: 'Close above open', result: 'bullish' },
            { text: 'Body = 100.80 − 100.00', result: '0.80' },
          ],
          conclusion: 'Range = 101.20 − 99.40 = 1.80.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T14-A03' },
      glossaryRefs: ['bullish-candle'],
    },
    {
      id: 'T14-S05', kind: 'risks-misunderstanding', title: 'What a candle cannot tell you',
      narrationText: 'Two common mistakes: reading the tip of a wick as the close, and treating one candle as a prediction. A candle describes the past interval. It does not promise the next one.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Wick ≠ close', text: 'The tip of a wick is a high or a low. The close is the end of the body.' },
        { kind: 'callout', callout: 'safety', text: 'A candle describes what **already happened**. It does not predict the next candle.' },
      ],
      glossaryRefs: ['wick', 'close-price'],
    },
    {
      id: 'T14-S06', kind: 'guided-practice', title: 'Build your own candle',
      narrationText: 'Now you try. Use the sliders or type numbers to build a bullish candle, then a bearish one, then a doji. The tool will stop you from making an impossible candle.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Make close higher than open (bullish).', 'Make close lower than open (bearish).', 'Make close equal to open (doji).'] },
        { kind: 'callout', callout: 'tip', text: 'High must stay ≥ open and close. Low must stay ≤ open and close.' },
      ],
      glossaryRefs: ['bullish-candle', 'bearish-candle', 'doji'],
    },
    {
      id: 'T14-S07', kind: 'recap', title: 'Recap',
      narrationText: 'A candle holds four prices. The body spans open to close; wicks reach the extremes. Judge direction from the numbers, and never treat one candle as a forecast.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Four prices: open, high, low, close.', 'Body = open to close; wicks = the extremes.', 'Bullish closes above open; bearish below; doji equal.', 'A candle describes the past, not the future.'] },
      ],
      glossaryRefs: ['ohlc', 'doji'],
    },
  ],

  notesSections: [
    {
      id: 'T14-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'A [[candlestick]] (or candle) is a small drawing that summarises every trade made during one block of time, such as one minute. Instead of listing dozens of prices, it keeps only four: the [[open-price|open]], the [[high-price|high]], the [[low-price|low]] and the [[close-price|close]]. Together they are called [[ohlc|OHLC]].' },
        { kind: 'analogy', text: 'Think of a day’s temperature report: it tells you the morning reading, the hottest moment, the coldest moment and the evening reading. You lose the minute-by-minute detail but keep the shape of the day.' },
      ],
    },
    {
      id: 'T14-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Almost every crypto chart you will see is built from candles. If you cannot read one candle, you cannot read the chart, and later lessons on timeframes, trends and levels will not make sense. Reading candles correctly also protects you from a common beginner error: mistaking the tip of a wick for the price where the market ended.' },
      ],
    },
    {
      id: 'T14-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: a bullish minute (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'At second 0 the first trade is at 100.00, so open = 100.00.' },
            { text: 'Around second 25 price dips to 99.40, the lowest trade of the minute, so low = 99.40.' },
            { text: 'Around second 40 price reaches 101.20, the highest trade, so high = 101.20.' },
            { text: 'The last trade before second 60 is 100.80, so close = 100.80.' },
            { text: 'Body = |100.80 − 100.00|', result: '0.80 USDT' },
            { text: 'Upper wick = 101.20 − 100.80', result: '0.40 USDT' },
            { text: 'Lower wick = 100.00 − 99.40', result: '0.60 USDT' },
          ],
          conclusion: 'Range = 101.20 − 99.40 = 1.80 USDT, and 0.80 + 0.40 + 0.60 = 1.80. Close is above open, so the candle is bullish.',
        },
        {
          kind: 'worked-example', title: 'Example 2: a bearish minute (fictional)', fictional: true,
          steps: [
            { text: 'O 101.10 · H 101.20 · L 100.20 · C 100.40.' },
            { text: 'Close is below open', result: 'bearish' },
            { text: 'Body = 101.10 − 100.40', result: '0.70 USDT' },
          ],
          conclusion: 'Most of the minute was spent falling, and the lower wick (0.20) shows price briefly went lower than where it closed.',
        },
        {
          kind: 'formula', expression: 'range = high − low = body + upper wick + lower wick',
          variables: [
            { symbol: 'high, low', meaning: 'highest and lowest traded prices in the candle', unit: 'USDT per DEMO' },
            { symbol: 'body', meaning: '|close − open|', unit: 'USDT per DEMO' },
          ],
        },
      ],
    },
    {
      id: 'T14-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Find the body: the thick part. Its two ends are the open and the close.',
          'Decide which end is which by direction: if the candle is bullish the open is at the bottom of the body; if bearish the open is at the top.',
          'Follow the upper wick to its tip: that is the high. Follow the lower wick: that is the low.',
          'Check direction with numbers, not only colour. Many apps use green for [[bullish-candle|bullish]] and red for [[bearish-candle|bearish]], but colours can be changed in settings.',
          'If the body is a flat line, the open equals the close: a [[doji]].',
        ] },
      ],
    },
    {
      id: 'T14-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Reading the wick tip as the close', text: 'The close is always an end of the body. A wick shows a price that traded and then did not hold.' },
        { kind: 'callout', callout: 'mistake', title: 'Trusting colour alone', text: 'Colour schemes differ. Compare the open and close values when you are unsure.' },
        { kind: 'callout', callout: 'mistake', title: 'Treating one candle as a forecast', text: 'A big bullish candle does not mean the next one will rise. A doji does not guarantee a reversal.' },
      ],
    },
    {
      id: 'T14-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Candles describe the past. Nothing in one candle tells you what the next minute will do, so no candle is, on its own, a reason to trade. Waiting or not trading is always a valid choice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T14-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'The parts of a candle', headers: ['Part', 'What it shows', 'How to compute'], rows: [
          ['Open', 'first trade of the period', 'read from the data'],
          ['Close', 'last trade of the period', 'read from the data'],
          ['Body', 'distance open to close', '|close − open|'],
          ['Upper wick', 'how far above the body price went', 'high − max(open, close)'],
          ['Lower wick', 'how far below the body price went', 'min(open, close) − low'],
          ['Range', 'full stretch of the candle', 'high − low'],
        ] },
      ],
    },
    {
      id: 'T14-N08', heading: 'learn-more', title: 'Learn more: where candles come from', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Candle charts were used by rice traders in Japan long before computers. Today a chart program builds each candle from the stream of trades: the first trade in the period sets the open, every new trade can push the high up or the low down, and when the clock reaches the end of the period the last trade becomes the close. Until then, the candle on the right edge of your chart is still forming and can change shape.' },
        { kind: 'paragraph', text: 'Some traders use a small threshold, such as “body less than 10% of range”, and still call the candle a doji. That is a personal definition. This course uses the strict one: close equals open.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T14-A01', type: 'candle-formation', durationMs: 20_000, fixtureId: 'FX-T14-FORMING-01',
      parameters: { variant: 'forming', range: [0, 0.1] },
      caption: 'Second 0: a new one-minute candle begins. The first trade, 100.00, becomes the **open**.',
      narration: 'The clock starts a new minute. The very first trade sets the open price, drawn as a short dashed line.',
      reducedMotionDescription: 'A new one-minute candle starts. The first fictional trade is 100.00, which is the open.',
      glossaryRefs: ['open-price'],
    },
    {
      id: 'T14-A02', type: 'candle-formation', durationMs: 30_000, fixtureId: 'FX-T14-FORMING-01',
      parameters: { variant: 'forming', range: [0.1, 0.45] },
      caption: 'Price rises to 100.90, then falls to 99.40. The candle’s **high** and **low** stretch to follow the extremes.',
      narration: 'Each new trade either stays inside the candle or pushes its high up or its low down. The body follows the last price.',
      reducedMotionDescription: 'During the first 30 seconds the fictional price climbs to 100.90 and then drops to 99.40. The high so far is 100.90 and the low so far is 99.40.',
      glossaryRefs: ['high-price', 'low-price'],
    },
    {
      id: 'T14-A03', type: 'candle-formation', durationMs: 30_000, fixtureId: 'FX-T14-FORMING-01',
      parameters: { variant: 'forming', range: [0.45, 1] },
      caption: 'A rally sets a new high of 101.20. When the minute ends, the last trade, 100.80, becomes the **close**.',
      narration: 'The candle is finished only when time runs out. Its final shape: open 100.00, high 101.20, low 99.40, close 100.80.',
      reducedMotionDescription: 'Price recovers to 101.20, the highest trade of the minute, and the minute ends at 100.80. Final candle: open 100.00, high 101.20, low 99.40, close 100.80. Close is above open, so it is bullish.',
      glossaryRefs: ['close-price', 'bullish-candle'],
    },
    {
      id: 'T14-A04', type: 'candle-formation', durationMs: 30_000,
      parameters: { variant: 'measure', o: 100, h: 101.2, l: 99.4, c: 100.8 },
      caption: 'Measure it: body 0.80, upper wick 0.40, lower wick 0.60. Together they make the range of 1.80.',
      narration: 'Body is close minus open. The upper wick is the high minus the top of the body. The lower wick is the bottom of the body minus the low.',
      reducedMotionDescription: 'The same candle measured: body 0.80, upper wick 0.40, lower wick 0.60, range 1.80 (101.20 − 99.40).',
      glossaryRefs: ['candle-body', 'wick', 'candle-range'],
    },
    {
      id: 'T14-A05', type: 'candle-formation', durationMs: 30_000,
      parameters: { variant: 'compare', candles: [
        { o: 100, h: 101.2, l: 99.4, c: 100.8, label: 'Up' },
        { o: 100.8, h: 101, l: 99.7, c: 99.9, label: 'Down' },
        { o: 99.9, h: 100.5, l: 99.3, c: 99.9, label: 'Equal' },
      ] },
      caption: 'Three shapes: close above open is **bullish**, close below open is **bearish**, close equal to open is a **doji**.',
      narration: 'Direction comes from comparing close with open. Colour is just a helper and can differ between apps.',
      reducedMotionDescription: 'Three fictional candles side by side: one closes above its open (bullish), one closes below its open (bearish), one closes exactly at its open (doji).',
      glossaryRefs: ['bullish-candle', 'bearish-candle', 'doji'],
    },
    {
      id: 'T14-A06', type: 'candle-formation', durationMs: 25_000,
      parameters: { variant: 'groups', candles: [
        { o: 100.8, h: 101.3, l: 100.5, c: 101.1, label: 'A' },
        { o: 101.1, h: 101.2, l: 100.2, c: 100.4, label: 'B' },
        { o: 100.4, h: 100.9, l: 99.6, c: 100.4, label: 'C' },
        { o: 100.4, h: 100.6, l: 99.2, c: 99.5, label: 'D' },
        { o: 99.5, h: 100.7, l: 99.4, c: 100.6, label: 'E' },
        { o: 100.6, h: 101.8, l: 100.5, c: 100.9, label: 'F' },
      ] },
      caption: 'Sorting six fictional candles: A, E and F are bullish; B and D are bearish; C is a doji.',
      narration: 'Each candle drops into a column according to its open and close.',
      reducedMotionDescription: 'Six fictional candles are sorted into columns. Bullish: A, E, F. Bearish: B, D. Doji: C.',
    },
    {
      id: 'T14-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Reading any candle', items: ['Find the body: its ends are open and close.', 'Compare close with open to get direction.', 'Top of the upper wick = high; bottom of the lower wick = low.', 'A wick tip is never the close.'] },
      caption: 'A four-step check you can use on any candle, on any platform.',
      reducedMotionDescription: 'Checklist: find the body; compare close with open; the wick tips are the high and low; a wick tip is never the close.',
    },
    {
      id: 'T14-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'A candle describes the past', items: ['It shows what traded in that interval.', 'It does not predict the next candle.', 'Waiting is always allowed.'] },
      caption: 'Safety: one candle is a summary of the past minute, not a forecast and not a reason to trade on its own.',
      reducedMotionDescription: 'Warning card: a candle shows what already traded; it does not predict the next candle; waiting is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T14-X01', type: 'candle-builder', title: 'Build three candles',
      fixtureId: 'FX-T14-BUILDER-01', simulatorId: 'ohlc.validate',
      instructions: 'Use the sliders or type values to change open, high, low and close. Complete each of the three shapes. The tool keeps the candle possible: high can never be below the body, and low can never be above it.',
      steps: [
        { id: 'T14-X01-01', prompt: 'Make a bullish candle: close higher than open.', hint: 'Raise the close above the open, or lower the open below the close.' },
        { id: 'T14-X01-02', prompt: 'Make a bearish candle: close lower than open.', hint: 'Move the close below the open. Watch the body change side.' },
        { id: 'T14-X01-03', prompt: 'Make a doji: close exactly equal to open.', hint: 'Type the same number into Open and Close.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'reset', 'hint'],
      parameters: { min: 95, max: 105, step: 0.1, tasks: [
        { id: 'bullish', direction: 'bullish' },
        { id: 'bearish', direction: 'bearish' },
        { id: 'doji', direction: 'doji' },
      ] },
      expectedEvaluation: { kind: 'constraint', simulatorId: 'ohlc.validate', description: 'Each built candle must satisfy high ≥ max(open, close) and low ≤ min(open, close), and match the requested direction.' },
      explanation: 'Direction depends only on close versus open. The high and low just have to contain the body. A doji has no body height at all.',
      fictionalDataLabel: 'Fictional DEMO/USDT values for practice only.',
    },
    {
      id: 'T14-X02', type: 'classify', title: 'Sort the candles',
      fixtureId: 'FX-T14-SERIES-01',
      instructions: 'Look at candles A to F on the fictional chart (each shows its open and close values). Put each one in the right group.',
      steps: [
        { id: 'T14-X02-01', prompt: 'For each candle, compare close with open.', hint: 'Close above open = bullish. Below = bearish. Equal = doji.' },
        { id: 'T14-X02-02', prompt: 'Choose a group for all six, then press Check.', hint: 'Candle C opens and closes at 100.40.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        showChart: true,
        items: [
          { id: 'candle-a', text: 'Candle A: open 100.80, close 101.10' },
          { id: 'candle-b', text: 'Candle B: open 101.10, close 100.40' },
          { id: 'candle-c', text: 'Candle C: open 100.40, close 100.40' },
          { id: 'candle-d', text: 'Candle D: open 100.40, close 99.50' },
          { id: 'candle-e', text: 'Candle E: open 99.50, close 100.60' },
          { id: 'candle-f', text: 'Candle F: open 100.60, close 100.90' },
        ],
        buckets: [
          { id: 'bullish', label: 'Bullish (close above open)' },
          { id: 'bearish', label: 'Bearish (close below open)' },
          { id: 'doji', label: 'Doji (close = open)' },
        ],
      },
      expectedEvaluation: { kind: 'classification', buckets: { bullish: ['candle-a', 'candle-e', 'candle-f'], bearish: ['candle-b', 'candle-d'], doji: ['candle-c'] } },
      explanation: 'A, E and F closed above their opens. B and D closed below. C closed exactly where it opened, so it is a doji.',
      fictionalDataLabel: 'Fictional DEMO/USDT candles for practice only.',
    },
    {
      id: 'T14-X03', type: 'numeric-calculator', title: 'Measure candle F',
      fixtureId: 'FX-T14-SERIES-01', simulatorId: 'ohlc.anatomy',
      instructions: 'Candle F (fictional) has open 100.60, high 101.80, low 100.50 and close 100.90. Work out each part in USDT, to 2 decimal places.',
      steps: [
        { id: 'T14-X03-01', prompt: 'Body = |close − open|.', hint: '100.90 − 100.60' },
        { id: 'T14-X03-02', prompt: 'Upper wick = high − the top of the body.', hint: 'The body top is the close here (bullish): 101.80 − 100.90.' },
        { id: 'T14-X03-03', prompt: 'Lower wick = bottom of the body − low, and range = high − low.', hint: 'Body bottom is the open: 100.60 − 100.50. Range: 101.80 − 100.50.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: { candleIndex: 5, given: [
        { label: 'Open', value: 100.6, unit: 'USDT' },
        { label: 'High', value: 101.8, unit: 'USDT' },
        { label: 'Low', value: 100.5, unit: 'USDT' },
        { label: 'Close', value: 100.9, unit: 'USDT' },
      ] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'body', label: 'Body', value: 0.3, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'upperWick', label: 'Upper wick', value: 0.9, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'lowerWick', label: 'Lower wick', value: 0.1, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'range', label: 'Range', value: 1.3, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      ] },
      explanation: 'Body 0.30 + upper wick 0.90 + lower wick 0.10 = range 1.30. The long upper wick shows price traded up to 101.80 but closed far below it, at 100.90.',
      fictionalDataLabel: 'Fictional DEMO/USDT candle for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T14-F01', name: 'Candle anatomy', expression: 'body = |close − open|; upper wick = high − max(open, close); lower wick = min(open, close) − low; range = high − low',
      variables: [
        { symbol: 'open, high, low, close', meaning: 'the four OHLC prices of one candle', unit: 'USDT per DEMO' },
      ],
      simulatorId: 'ohlc.anatomy', approximate: false,
      workedExamples: [
        { label: 'Forming minute (notes example 1)', inputs: { o: 100, h: 101.2, l: 99.4, c: 100.8, bodyToRangeMax: 0 }, outputs: { body: 0.8, upperWick: 0.4, lowerWick: 0.6, range: 1.8 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Candle F (exercise T14-X03)', inputs: { o: 100.6, h: 101.8, l: 100.5, c: 100.9, bodyToRangeMax: 0 }, outputs: { body: 0.3, upperWick: 0.9, lowerWick: 0.1, range: 1.3 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Quiz T14-Q03', inputs: { o: 250, h: 256.5, l: 247, c: 254, bodyToRangeMax: 0 }, outputs: { range: 9.5, body: 4 }, tolerance: 1e-9, assumptions: ['fictional data'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T14-Q01', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T14', fixtureId: 'FX-T14-SERIES-01',
      prompt: 'On the fictional chart, candle E opened at 99.50 and closed at 100.60. Which statement is correct?',
      choices: [
        { id: 'a', text: 'It is bullish, because the close is above the open.' },
        { id: 'b', text: 'It is bearish, because its low (99.40) is below the open.' },
        { id: 'c', text: 'It is a doji, because it has wicks on both sides.' },
        { id: 'd', text: 'You cannot tell without knowing its colour.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Direction compares close with open: 100.60 is above 99.50, so the candle is bullish.',
      misconceptionFeedback: {
        b: 'The low only shows how far price dipped during the minute. Direction compares close with open.',
        c: 'Wicks on both sides are common. A doji needs close equal to open.',
        d: 'Colour is a helper only. The open and close numbers are enough to decide.',
      },
      learningOutcome: 'Classify a candle’s direction from its open and close values.',
      remediationRef: { lessonId: 'T14', anchorId: 'T14-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T14-Q02', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T14', fixtureId: 'FX-T14-SERIES-01',
      prompt: 'Candle F is bullish. Its body top is at 100.90 and its upper wick reaches 101.80. What was its close?',
      choices: [
        { id: 'a', text: '100.90' },
        { id: 'b', text: '101.80' },
        { id: 'c', text: '100.60' },
        { id: 'd', text: '100.50' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'For a bullish candle the close is the top of the body: 100.90. The wick tip (101.80) is the high.',
      misconceptionFeedback: {
        b: '101.80 is the tip of the upper wick: the high. Price visited it but did not close there.',
        c: '100.60 is the bottom of the body of a bullish candle: that is the open.',
        d: '100.50 is the tip of the lower wick: the low.',
      },
      learningOutcome: 'Distinguish the wick tip (high or low) from the close.',
      remediationRef: { lessonId: 'T14', anchorId: 'T14-N05' },
      shuffleChoices: false,
    },
    {
      id: 'T14-Q03', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T14',
      prompt: 'A fictional candle has open 250.00, high 256.50, low 247.00 and close 254.00. What is its range (high − low) in USDT?',
      answer: { kind: 'numeric', value: 9.5, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'Range = 256.50 − 247.00 = 9.50 USDT. Open and close do not change the range.',
      learningOutcome: 'Compute a candle’s range from its high and low.',
      remediationRef: { lessonId: 'T14', anchorId: 'T14-N03' },
    },
    {
      id: 'T14-Q04', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T14', safetyCritical: true, safetyTopic: 'not-advice',
      prompt: 'A learner sees one candle with a long lower wick and says: “Buyers won this minute, so the price will definitely rise next. I should buy now.” What is the best response?',
      choices: [
        { id: 'a', text: 'The wick only describes the past minute. It does not guarantee the next one; waiting or not trading is still a valid choice.' },
        { id: 'b', text: 'Agree: a long lower wick always means the price goes up next.' },
        { id: 'c', text: 'Disagree: a long lower wick always means the price goes down next.' },
        { id: 'd', text: 'Ignore wicks completely; they are chart errors.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A candle is a summary of trades that already happened. No single candle predicts the next one, so it is never, on its own, a reason to trade.',
      misconceptionFeedback: {
        b: '“Always” and “definitely” are red flags. Markets often do the opposite of what one candle seems to suggest.',
        c: 'This makes the same mistake in the other direction: one candle cannot guarantee any move.',
        d: 'Wicks are real trades. They show prices that traded and did not hold, which is useful information about the past.',
      },
      learningOutcome: 'Recognise that a candle describes the past and is not a trade signal by itself.',
      remediationRef: { lessonId: 'T14', anchorId: 'T14-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T14-Q05', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T14', fixtureId: 'FX-T14-SERIES-01',
      prompt: 'Candle C opens at 100.40 and closes at 100.40, with wicks above and below. What is it, and what does it tell you?',
      choices: [
        { id: 'a', text: 'A doji: the minute ended where it started. On its own it does not say which way price goes next.' },
        { id: 'b', text: 'A doji, which guarantees the trend will reverse.' },
        { id: 'c', text: 'A bullish candle, because the high is above the open.' },
        { id: 'd', text: 'A bearish candle, because the low is below the close.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Close equal to open makes a doji. It records indecision in that interval; it is not a forecast.',
      misconceptionFeedback: {
        b: 'Nothing guarantees a reversal. A doji only says that interval ended at its opening price.',
        c: 'The high is above the open in almost every candle. Direction compares close with open.',
        d: 'The low is below the close in almost every candle. Direction compares close with open.',
      },
      learningOutcome: 'Identify a doji and avoid treating it as a prediction.',
      remediationRef: { lessonId: 'T14', anchorId: 'T14-N04' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Reading the tip of a wick as the close.', correction: 'The close is an end of the body. Wick tips are the high and the low.' },
    { mistake: 'Deciding direction from colour only.', correction: 'Compare the close with the open; colours depend on app settings.' },
    { mistake: 'Treating a single candle as a buy or sell signal.', correction: 'A candle summarises the past interval. It predicts nothing by itself.' },
  ],
  takeaways: [
    'A candle stores four prices: open, high, low and close.',
    'Body = open to close; wicks reach the high and low; body + wicks = range.',
    'Direction comes from close versus open, and one candle never predicts the next.',
  ],
  reviewCard: {
    keyTermIds: ['ohlc', 'wick', 'doji'],
    safetyNote: 'A candle describes what already happened. It is not a forecast and not a reason to trade by itself.',
    reviewMinutes: 3,
    retrievalQuestion: 'A bullish candle has open 50, high 53, low 49 and close 52. Which number is the close, and how big is the upper wick?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T14-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
