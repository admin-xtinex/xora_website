import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures, RANGE_A_HL, RANGE_B_HL } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices and volumes in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can read a volume bar under its candle and explain that high volume shows activity, not direction or conviction.',
    'Learner can find the previous high and previous low inside a stated lookback window and compute the range and range %.',
    'Learner can compare a quiet and a volatile sample and name at least two limits of using a past range.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T18-S01', kind: 'cover-problem', title: 'Two charts, same price, different markets',
      narrationText: 'Two fictional charts both sit near 100 USDT. In one, candles are tiny and few coins trade. In the other, candles swing about two dollars each minute and ten times more coins trade. Price alone does not show this difference.',
      blocks: [
        { kind: 'paragraph', text: 'Two fictional charts both sit near **100 USDT**. One barely moves. The other swings about 2 USDT every minute.' },
        { kind: 'paragraph', text: 'Today you measure **how much traded**, **how far price swung** and **where the recent high and low are**.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T18-A02' },
      glossaryRefs: ['volatility'],
      speakerNotes: 'Start from the feeling of two very different markets at the same price. The three measurements are the lesson.',
    },
    {
      id: 'T18-S02', kind: 'key-definition', title: 'Volume and volatility',
      narrationText: 'Trading volume is how much changed hands in a candle. Every coin bought was also sold, so volume shows activity, not who won. Volatility is how far and how fast price moves.',
      blocks: [
        { kind: 'definition', termId: 'trading-volume' },
        { kind: 'paragraph', text: '[[volatility|Volatility]] = how big and fast the swings are. Big candles = high volatility.' },
        { kind: 'callout', callout: 'tip', text: 'Every coin bought was also sold. Volume measures activity, not direction.' },
      ],
      glossaryRefs: ['trading-volume', 'volatility'],
    },
    {
      id: 'T18-S03', kind: 'visual-breakdown', title: 'The recent range',
      narrationText: 'Pick a lookback window, for example the last 10 one-minute candles. The highest high inside it is the previous high. The lowest low is the previous low. The distance between them is the price range.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Choose a [[lookback-window]] (e.g. last 10 candles).', 'Highest high = [[previous-high]].', 'Lowest low = [[previous-low]].', '[[price-range|Range]] = previous high − previous low.'] },
      ],
      visualRef: { kind: 'scene', sceneId: 'T18-A04' },
      glossaryRefs: ['lookback-window', 'previous-high', 'previous-low', 'price-range'],
    },
    {
      id: 'T18-S04', kind: 'worked-example', title: 'Range % for the last 10 minutes',
      narrationText: 'In scenario A the last 10 candles have a highest high of 102.00 and a lowest low of 100.00. The range is 2.00 USDT. Divide by the low and multiply by 100: 2.00 percent.',
      blocks: [
        {
          kind: 'worked-example', title: 'Scenario A, last 10 fictional minutes', fictional: true,
          steps: [
            { text: 'Previous high', result: '102.00' },
            { text: 'Previous low', result: '100.00' },
            { text: 'Range = 102.00 − 100.00', result: '2.00 USDT' },
          ],
          conclusion: 'Range % = 2.00 ÷ 100.00 × 100 = 2.00%.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T18-A04' },
      glossaryRefs: ['price-range'],
    },
    {
      id: 'T18-S05', kind: 'risks-misunderstanding', title: 'What these numbers cannot tell you',
      narrationText: 'A huge volume bar does not prove buyers are in control. A past range does not promise the next ten minutes will stay inside it. Low volume often means thin liquidity, wider spreads and more slippage.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Volume ≠ conviction', text: 'A huge volume bar can close almost where it opened. Volume shows activity, not the winner.' },
        { kind: 'callout', callout: 'safety', text: 'A past range is history, not a forecast. Thin [[liquidity]] can mean wider [[spread|spreads]] and more [[slippage]].' },
      ],
      glossaryRefs: ['trading-volume', 'liquidity', 'slippage'],
    },
    {
      id: 'T18-S06', kind: 'guided-practice', title: 'Drag the lookback window',
      narrationText: 'Now you try. Drag the window slider to 10 candles, read the previous high and low, and compute the range percent. Then repeat on the volatile scenario and compare the two.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Set the window to 10 candles.', 'Read the highest high and lowest low.', 'Compute range % = range ÷ low × 100.', 'Compare scenario A with scenario B.'] },
        { kind: 'callout', callout: 'tip', text: 'Always say which window you used. A different window can give a different range.' },
      ],
      glossaryRefs: ['lookback-window'],
    },
    {
      id: 'T18-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Volume shows how much traded, not who won. Volatility is the size of the swings. The previous high and low come from a window you choose, and the range describes the past only.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Volume = activity, not direction.', 'Volatility = size of the swings.', 'Previous high/low depend on the window you choose.', 'Range % = (high − low) ÷ low × 100; it describes the past only.'] },
      ],
      glossaryRefs: ['trading-volume', 'price-range'],
    },
  ],

  notesSections: [
    {
      id: 'T18-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: '[[trading-volume|Trading volume]] is how much of a coin changed hands during one candle. It is usually drawn as a bar under each candle. [[volatility|Volatility]] is how big and how fast price swings are: large candles mean a volatile market, tiny candles mean a quiet one. The [[price-range|price range]] over a period is the distance from the highest high to the lowest low across several candles. You choose those candles with a [[lookback-window|lookback window]], and the two ends are the [[previous-high|previous high]] and the [[previous-low|previous low]].' },
        { kind: 'analogy', text: 'Think of a busy road. Volume is how many cars passed. Volatility is how much they swerved. The range is the width of road they actually used in the last ten minutes. Many cars does not tell you where they are going.' },
      ],
    },
    {
      id: 'T18-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'The same price can hide very different markets. In a quiet market a 0.20 USDT move is large; in a volatile one it is noise. The recent range tells you how far price has been travelling, which later helps you judge whether a target or a stop distance is realistic. Volume and [[liquidity]] also affect costs: when little trades, the [[spread]] is often wider and orders can suffer more [[slippage]].' },
      ],
    },
    {
      id: 'T18-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: scenario A, previous 10 minutes (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Window = last 10 one-minute candles.' },
            { text: 'Highest high in the window', result: '102.00 USDT' },
            { text: 'Lowest low in the window', result: '100.00 USDT' },
            { text: 'Range = 102.00 − 100.00', result: '2.00 USDT' },
            { text: 'Range % = 2.00 ÷ 100.00 × 100', result: '2.00%' },
          ],
          conclusion: 'With a 15-candle window an older candle with high 102.60 and another with low 99.70 come in: range 2.90 USDT, or 2.91%. Same chart, different window, different answer.',
        },
        {
          kind: 'worked-example', title: 'Example 2: quiet versus volatile (fictional)', fictional: true,
          steps: [
            { text: 'Quiet sample: average volume 105 DEMO per candle; 10-candle range 99.90 to 100.16', result: '0.26%' },
            { text: 'Volatile sample: average volume 1,050 DEMO per candle; 10-candle range 98.60 to 103.00', result: '4.46%' },
          ],
          conclusion: 'The volatile sample traded 10 times more and swung about 17 times wider. Neither number says which way price goes next.',
        },
        {
          kind: 'formula', expression: 'range = highest high − lowest low;  range % = range ÷ lowest low × 100',
          variables: [
            { symbol: 'highest high, lowest low', meaning: 'the extremes of all candles inside the lookback window', unit: 'USDT per DEMO' },
            { symbol: 'range %', meaning: 'the range as a percentage of the low, so different coins can be compared', unit: '%' },
          ],
        },
      ],
    },
    {
      id: 'T18-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Look under the candles for the volume bars. Compare each bar with the average line, not with your feeling.',
          'Compare candle sizes: many big candles = high volatility; many tiny candles = low volatility.',
          'State your lookback window first, for example the previous 10 minutes on a 1-minute chart.',
          'Find the highest high and lowest low in that window. Compute the range and range %.',
          'Check whether a huge volume bar actually moved price: compare its close with its open.',
        ] },
      ],
    },
    {
      id: 'T18-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Reading volume as conviction', text: 'Every coin bought was also sold. A huge volume bar with a tiny body only shows a busy, undecided minute.' },
        { kind: 'callout', callout: 'mistake', title: 'Forgetting the window', text: 'The previous high and low change when the window changes. Always say which window you used.' },
        { kind: 'callout', callout: 'mistake', title: 'Treating the range as a fence', text: 'Price can break out of a past range at any time, and can do it fast.' },
      ],
    },
    {
      id: 'T18-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Volume, volatility and range all describe the past. None of them is a signal on its own. In thin, low-volume markets spreads and slippage can be larger than you expect. Waiting or not trading is always a valid choice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T18-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Three measurements', headers: ['Measure', 'What it shows', 'What it does not show'], rows: [
          ['Volume', 'how much traded', 'who won or where price goes'],
          ['Volatility', 'how big the swings are', 'the direction of the next swing'],
          ['Range %', '(high − low) ÷ low × 100 over a window', 'that price will stay inside it'],
        ] },
      ],
    },
    {
      id: 'T18-N08', heading: 'learn-more', title: 'Learn more: volume in quote terms and other volatility measures', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Some platforms show volume in the base coin (DEMO) and others in the quote coin (USDT). 1,000 DEMO at 100 USDT is 100,000 USDT of volume. Check the label before comparing two charts.' },
        { kind: 'paragraph', text: 'Professionals also measure volatility with averages of candle ranges or with statistics of returns. They all share the same limit: they summarise the past, and markets can become quiet or wild very quickly.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T18-A01', type: 'volume-bars', durationMs: 30_000, fixtureId: 'FX-T18-QUIET-01',
      parameters: { variant: 'plain' },
      caption: 'A quiet market builds candle by candle: each candle spans only 0.11 to 0.18 USDT and the volume bars stay near an average of 105 DEMO.',
      narration: 'Candles appear one by one, each with its volume bar underneath. Small candles, small bars: a quiet minute after a quiet minute.',
      reducedMotionDescription: 'Ten fictional 1-minute candles near 100.00. Each candle range is between 0.11 and 0.18 USDT. Volumes are between 85 and 130 DEMO, average 105. The whole 10-minute range is 99.90 to 100.16 (0.26%).',
      glossaryRefs: ['trading-volume', 'volatility'],
    },
    {
      id: 'T18-A02', type: 'volume-bars', durationMs: 30_000, fixtureId: 'FX-T18-VOLATILE-01',
      parameters: { variant: 'plain' },
      caption: 'A volatile market builds: each candle now spans 1.9 to 2.5 USDT and volume averages 1,050 DEMO, ten times the quiet sample.',
      narration: 'Same starting price, very different behaviour. Big candles in both directions, and much taller volume bars.',
      reducedMotionDescription: 'Ten fictional 1-minute candles starting at 100.00. Each candle range is between 1.9 and 2.5 USDT. Volumes are between 820 and 1,350 DEMO, average 1,050. The 10-minute range is 98.60 to 103.00 (4.46%). Candles go up and down; there is no single direction.',
      glossaryRefs: ['volatility'],
    },
    {
      id: 'T18-A03', type: 'volume-bars', durationMs: 35_000, fixtureId: 'FX-T18-SPIKE-01',
      parameters: { variant: 'plain', highlight: [4] },
      caption: 'Candle E fires a volume spike of 1,500 DEMO, about 5 times the average of 309, yet it closes only 0.05 above its open and price then drifts sideways.',
      narration: 'Lots of coins changed hands, but buyers and sellers were matched one for one. The candle has long wicks on both sides and almost no body.',
      reducedMotionDescription: 'Ten fictional candles A to J. Candle E has volume 1,500 DEMO against an average of 309. It opens at 100.20, trades up to 101.40 and down to 99.10, and closes at 100.25. The candles after it stay between 100.00 and 100.50. High volume did not mean a strong move.',
      glossaryRefs: ['trading-volume'],
    },
    {
      id: 'T18-A04', type: 'range-overlay', durationMs: 40_000, fixtureId: 'FX-T18-RANGE-A-01',
      parameters: { window: 10, slide: true },
      caption: 'A 10-candle window slides right. It starts at high 102.60, low 99.70 (2.91%) and ends on the previous 10 minutes: high 102.00, low 100.00, range 2.00%.',
      narration: 'As the window moves, old candles drop out and new ones come in. The previous high and previous low update to match.',
      reducedMotionDescription: 'Scenario A, 15 fictional 1-minute candles. A shaded window of 10 candles moves from the first 10 candles to the last 10. First position: highest high 102.60, lowest low 99.70, range 2.90 USDT (2.91%). Final position: previous high 102.00, previous low 100.00, range 2.00 USDT (2.00%).',
      glossaryRefs: ['lookback-window', 'previous-high', 'previous-low', 'price-range'],
    },
    {
      id: 'T18-A05', type: 'range-overlay', durationMs: 30_000, fixtureId: 'FX-T18-RANGE-B-01',
      parameters: { window: 10, slide: true },
      caption: 'Scenario B: the same 10-candle window slides across a volatile chart. The 106.00 high and 100.00 low stay inside it, so the range holds at 6.00%.',
      narration: 'In the volatile scenario the range is three times wider than in scenario A, even though both are measured the same way.',
      reducedMotionDescription: 'Scenario B, 15 fictional volatile candles. The 10-candle window moves from the first 10 to the last 10. The whole time it contains the high of 106.00 and the low of 100.00: range 6.00 USDT, or 6.00%, three times scenario A’s 2.00%.',
      glossaryRefs: ['price-range', 'volatility'],
    },
    {
      id: 'T18-A06', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'risk-warning', heading: 'Measurements describe the past', items: ['High volume shows activity, not who won.', 'A past range can break at any moment.', 'Thin liquidity: wider spreads, more slippage.', 'Waiting is always allowed.'] },
      caption: 'Safety: the warnings appear one by one. Volume, volatility and range describe the past, never a promise about the next minute.',
      reducedMotionDescription: 'Warning card: high volume shows activity, not who won; a past range can break at any moment; thin liquidity means wider spreads and more slippage; waiting is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T18-X01', type: 'lookback-range', title: 'Measure the previous 10 minutes',
      fixtureId: 'FX-T18-RANGE-A-01', simulatorId: 'range.lookback',
      instructions: 'Scenario A shows 15 fictional 1-minute DEMO/USDT candles. Drag the window slider (or use the arrow keys) to choose how many recent candles to include. Read the highest high and lowest low, then type your answers. Give prices and percentages to 2 decimal places.',
      steps: [
        { id: 'T18-X01-01', prompt: 'Set the window to 10 candles. Type the previous high and the previous low.', hint: 'The two lines on the chart mark the highest high and the lowest low inside the shaded window.' },
        { id: 'T18-X01-02', prompt: 'Compute the range % for the 10-candle window: (high − low) ÷ low × 100.', hint: '(102.00 − 100.00) ÷ 100.00 × 100' },
        { id: 'T18-X01-03', prompt: 'Now set the window to 15 candles and compute the range % again.', hint: 'The window now includes an older high of 102.60 and an older low of 99.70: 2.90 ÷ 99.70 × 100.' },
      ],
      allowedControls: ['slider', 'drag', 'keyboard-move', 'numeric-input', 'reset', 'hint'],
      parameters: { window: { min: 3, max: 15, value: 5 } },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'max10', label: 'Previous high (window 10)', value: 102, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'min10', label: 'Previous low (window 10)', value: 100, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'rangePercent10', label: 'Range % (window 10)', value: 2, tolerance: 0.005, unit: '%', rounding: { decimals: 2 } },
        { key: 'rangePercent15', label: 'Range % (window 15)', value: 2.91, tolerance: 0.005, unit: '%', rounding: { decimals: 2 } },
      ] },
      explanation: 'Window 10: high 102.00, low 100.00, range 2.00 USDT = 2.00%. Window 15 adds older candles with a high of 102.60 and a low of 99.70, so the range grows to 2.90 USDT = 2.91%. The window you choose changes the answer, so always state it.',
      fictionalDataLabel: 'Fictional DEMO/USDT candles for practice only.',
    },
    {
      id: 'T18-X02', type: 'lookback-range', title: 'Compare a quiet and a volatile scenario',
      fixtureId: 'FX-T18-RANGE-B-01', simulatorId: 'range.lookback',
      instructions: 'Scenario B is a volatile fictional chart. Use the same 10-candle window as in scenario A, measure it, then compare. Give answers to 2 decimal places (the comparison to 1 decimal place).',
      steps: [
        { id: 'T18-X02-01', prompt: 'Set the window to 10 candles. Type the previous high and the previous low.', hint: 'Look for the tallest upper wick and the deepest lower wick inside the shaded area.' },
        { id: 'T18-X02-02', prompt: 'Compute the range % for scenario B.', hint: '(106.00 − 100.00) ÷ 100.00 × 100' },
        { id: 'T18-X02-03', prompt: 'How many times wider is scenario B’s range % than scenario A’s 2.00%? Then ask yourself: does a wider range tell you which way price goes next?', hint: '6.00 ÷ 2.00. A wider range shows bigger swings in both directions, not a direction.' },
      ],
      allowedControls: ['slider', 'drag', 'keyboard-move', 'numeric-input', 'reset', 'hint'],
      parameters: { window: { min: 3, max: 15, value: 5 } },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'max', label: 'Previous high (window 10)', value: 106, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'min', label: 'Previous low (window 10)', value: 100, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'rangePercent', label: 'Range % (window 10)', value: 6, tolerance: 0.005, unit: '%', rounding: { decimals: 2 } },
        { key: 'timesWider', label: 'B range % ÷ A range %', value: 3, tolerance: 0.05, unit: '×', rounding: { decimals: 1 } },
      ] },
      explanation: 'Scenario B: high 106.00, low 100.00, range 6.00%, three times scenario A’s 2.00%. Limits: the range describes only the window you chose; it does not say which way the next move goes; a new candle can break it at any time; and a wide, fast range means a stop at the same distance is reached more easily.',
      fictionalDataLabel: 'Fictional DEMO/USDT candles for practice only.',
    },
    {
      id: 'T18-X03', type: 'classify', title: 'What does the volume spike really show?',
      fixtureId: 'FX-T18-SPIKE-01',
      instructions: 'Look at the fictional chart with the volume spike on candle E (volume 1,500 DEMO, average 309; open 100.20, high 101.40, low 99.10, close 100.25). Sort each statement: is it supported by the data, or does it claim more than the data can show?',
      steps: [
        { id: 'T18-X03-01', prompt: 'Read each statement and check it against the numbers.', hint: 'Facts you can measure: volume, open, close, high, low. Claims about the future cannot be measured yet.' },
        { id: 'T18-X03-02', prompt: 'Put every statement in a group, then press Check.', hint: 'Every coin bought was also sold, so volume alone cannot say who is in control.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        showChart: true,
        items: [
          { id: 'vol-traded', text: 'Candle E traded about 5 times the average volume.' },
          { id: 'close-flat', text: 'Candle E closed only 0.05 above its open.' },
          { id: 'range-wide', text: 'Candle E’s range (99.10 to 101.40) was much wider than its neighbours.' },
          { id: 'buyers-control', text: 'The high volume proves buyers are in control.' },
          { id: 'must-move', text: 'Because volume spiked, price must make a strong move next.' },
          { id: 'range-holds', text: 'The previous 10-minute range will hold for the next 10 minutes.' },
        ],
        buckets: [
          { id: 'supported', label: 'Supported by the data' },
          { id: 'overclaim', label: 'Claims more than the data shows' },
        ],
        itemFeedback: {
          'vol-traded': '1,500 ÷ 309 ≈ 4.9, so about 5 times. This is a measurement.',
          'close-flat': 'Open 100.20, close 100.25: a difference of 0.05. Measured, not guessed.',
          'range-wide': '101.40 − 99.10 = 2.30 USDT, while the neighbours span about 0.30. Measured.',
          'buyers-control': 'Every coin bought was also sold. The tiny body shows neither side pushed price away.',
          'must-move': 'Nothing in past volume forces a future move. After E, price drifted sideways.',
          'range-holds': 'A past range is history. It can break at any time.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { supported: ['vol-traded', 'close-flat', 'range-wide'], overclaim: ['buyers-control', 'must-move', 'range-holds'] } },
      explanation: 'Volume, OHLC and range are measurements of the past. Statements about who is “in control” or what “must” happen next go beyond what the numbers can show.',
      fictionalDataLabel: 'Fictional DEMO/USDT candles for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T18-F01', name: 'Lookback range', expression: 'max = highest high in window; min = lowest low in window; range = max − min; range % = range ÷ min × 100',
      variables: [
        { symbol: 'h1…hN, l1…lN', meaning: 'high and low of each candle, oldest first', unit: 'USDT per DEMO' },
        { symbol: 'window', meaning: 'number of most recent candles included', unit: 'candles' },
      ],
      simulatorId: 'range.lookback', approximate: false,
      workedExamples: [
        { label: 'Scenario A, window 10 (exercise T18-X01)', inputs: { ...RANGE_A_HL, window: 10 }, outputs: { max: 102, min: 100, range: 2, rangePercent: 2 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Scenario A, window 15 (notes example 1)', inputs: { ...RANGE_A_HL, window: 15 }, outputs: { max: 102.6, min: 99.7, range: 2.9, rangePercent: 2.91 }, tolerance: 0.005, assumptions: ['fictional data', 'range % rounded to 2 decimals'] },
        { label: 'Scenario B, window 10 (exercise T18-X02)', inputs: { ...RANGE_B_HL, window: 10 }, outputs: { max: 106, min: 100, range: 6, rangePercent: 6 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: 'Quiz T18-Q02', inputs: { h1: 248, l1: 245, h2: 250, l2: 246.5, window: 2 }, outputs: { max: 250, min: 245, range: 5, rangePercent: 2.04 }, tolerance: 0.005, assumptions: ['fictional data', 'range % rounded to 2 decimals'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T18-Q01', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T18', fixtureId: 'FX-T18-SPIKE-01',
      prompt: 'Candle E traded 1,500 DEMO (average 309), opened at 100.20 and closed at 100.25, with long wicks both sides. Which reading is best?',
      choices: [
        { id: 'a', text: 'Many coins changed hands, but price ended almost where it started. Volume alone does not show who won or what comes next.' },
        { id: 'b', text: 'Buyers are clearly in control because volume was so high.' },
        { id: 'c', text: 'Sellers are clearly in control because the lower wick reached 99.10.' },
        { id: 'd', text: 'The volume bar is a chart error and should be ignored.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Every coin bought was also sold. The near-zero body (0.05) shows neither side pushed price away during that minute.',
      misconceptionFeedback: {
        b: 'High volume means high activity. Each unit bought had a seller, and the close is only 0.05 above the open.',
        c: 'The wick shows a visit to 99.10 that did not hold. Price closed at 100.25, above the open.',
        d: 'Volume spikes are real trading. They are information about activity, just not about direction.',
      },
      learningOutcome: 'Interpret a volume spike without equating volume with conviction.',
      remediationRef: { lessonId: 'T18', anchorId: 'T18-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T18-Q02', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T18',
      prompt: 'Over the previous 10 fictional minutes the highest high is 250.00 and the lowest low is 245.00. What is the range % ((high − low) ÷ low × 100), to 2 decimal places?',
      answer: { kind: 'numeric', value: 2.04, tolerance: 0.005, unit: '%', rounding: { decimals: 2 } },
      rationale: 'Range = 250.00 − 245.00 = 5.00 USDT. 5.00 ÷ 245.00 × 100 = 2.04%.',
      learningOutcome: 'Compute a range % from a previous high and previous low.',
      remediationRef: { lessonId: 'T18', anchorId: 'T18-N03' },
    },
    {
      id: 'T18-Q03', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T18',
      prompt: 'Scenario A has a 10-minute range of 2.00%. Scenario B has 6.00%. What does this tell you?',
      choices: [
        { id: 'a', text: 'B has been swinging about three times wider recently; it says nothing about which way either goes next.' },
        { id: 'b', text: 'B will rise, because its range is bigger.' },
        { id: 'c', text: 'A is the better market to trade, because its range is small.' },
        { id: 'd', text: 'Both will stay inside their ranges for the next 10 minutes.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Range % measures the size of past swings. It is about volatility, not direction, and it can change at any time.',
      misconceptionFeedback: {
        b: 'A range covers moves up and down. Its size carries no direction.',
        c: 'A small range is not a reason to trade. A quiet market can turn volatile suddenly, and small moves still cost fees.',
        d: 'A past range is history. Price can break out of it at any moment.',
      },
      learningOutcome: 'Compare two ranges as a volatility measure, not as a forecast.',
      remediationRef: { lessonId: 'T18', anchorId: 'T18-N02' },
      shuffleChoices: true,
    },
    {
      id: 'T18-Q04', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T18', safetyCritical: true, safetyTopic: 'not-advice',
      prompt: 'A learner sees a huge volume bar as price pushes above the previous high and says: “Volume confirms it. This move is certain, so I will open a big position.” What is the best response?',
      choices: [
        { id: 'a', text: 'Volume shows activity, not certainty. The move can still fail; waiting or not trading remains a valid choice.' },
        { id: 'b', text: 'Agree: high volume always means the move continues.' },
        { id: 'c', text: 'Agree, but only if the volume bar is green.' },
        { id: 'd', text: 'Volume is useless, so ignore it and trade on price alone.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Nothing on a chart makes a move certain. High volume can appear on moves that reverse straight away.',
      misconceptionFeedback: {
        b: '“Always” is a red flag. High-volume pushes above a previous high can fail and fall back.',
        c: 'Bar colour only repeats the candle direction. It does not make a move certain.',
        d: 'Volume is useful context about activity and liquidity. It simply is not a guarantee.',
      },
      learningOutcome: 'Reject the idea that volume alone makes a move certain.',
      remediationRef: { lessonId: 'T18', anchorId: 'T18-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T18-Q05', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T18', safetyCritical: true, safetyTopic: 'execution',
      prompt: 'A fictional coin shows tiny volume bars for the last hour and a wide gap between the best bid and best ask. What is the main extra risk for a market order?',
      choices: [
        { id: 'a', text: 'Thin liquidity: a wider spread and more slippage, so the fill can be worse than the price you see.' },
        { id: 'b', text: 'There is no extra risk; low volume means low risk.' },
        { id: 'c', text: 'Low volume guarantees the price will not move.' },
        { id: 'd', text: 'The exchange will refuse the order.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'When little trades and the order book is thin, a market order may have to fill at several worse prices, and the spread itself is a cost.',
      misconceptionFeedback: {
        b: 'Low volume often means thin liquidity, which can make costs and sudden jumps worse, not better.',
        c: 'Quiet markets can jump suddenly, especially when few orders are waiting in the book.',
        d: 'Orders can usually still be placed. The problem is the price you get, not whether it is accepted.',
      },
      learningOutcome: 'Link low volume and thin liquidity to wider spreads and slippage.',
      remediationRef: { lessonId: 'T18', anchorId: 'T18-N02' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Reading a big volume bar as proof that buyers (or sellers) are in control.', correction: 'Every coin bought was also sold. Check the candle body: volume shows activity, not direction.' },
    { mistake: 'Quoting a previous high or low without saying which window it came from.', correction: 'State the lookback window, for example the previous 10 one-minute candles.' },
    { mistake: 'Assuming price will stay inside the recent range.', correction: 'A past range is history. Price can break out of it at any moment.' },
  ],
  takeaways: [
    'Volume measures how much traded, not who won; volatility measures how big the swings are.',
    'Previous high and low come from a lookback window you choose; range % = (high − low) ÷ low × 100.',
    'All three describe the past; thin liquidity raises costs, and waiting is always allowed.',
  ],
  reviewCard: {
    keyTermIds: ['trading-volume', 'price-range', 'lookback-window'],
    safetyNote: 'Volume, volatility and range describe the past. None of them makes a move certain, and thin markets can cost more through spread and slippage.',
    reviewMinutes: 3,
    retrievalQuestion: 'Over the last 10 one-minute candles the highest high is 51.00 and the lowest low is 50.00. What is the range %, and does it tell you which way price goes next?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T18-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
