import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data.';

/** Flat ohlc.aggregate inputs for 1m candles a..b (1-based, inclusive) of FX-T15-SERIES-01. */
const RAW: Array<[number, number, number, number]> = [
  [100.0, 100.4, 99.8, 100.2], [100.2, 100.7, 100.1, 100.6], [100.6, 100.8, 100.2, 100.3], [100.3, 100.5, 99.7, 99.9], [99.9, 100.6, 99.8, 100.5],
  [100.5, 101.1, 100.4, 101.0], [101.0, 101.3, 100.6, 100.7], [100.7, 101.6, 100.6, 101.4], [101.4, 101.5, 100.9, 101.1], [101.1, 101.4, 100.8, 101.3],
  [101.3, 101.4, 100.5, 100.6], [100.6, 100.9, 100.1, 100.3], [100.3, 100.8, 100.0, 100.7], [100.7, 101.2, 100.6, 101.1], [101.1, 101.3, 100.7, 100.9],
];
const flat = (from: number, to: number, groupSize: number): Record<string, number> => {
  const out: Record<string, number> = { groupSize };
  RAW.slice(from - 1, to).forEach(([o, h, l, c], k) => { out[`o${k + 1}`] = o; out[`h${k + 1}`] = h; out[`l${k + 1}`] = l; out[`c${k + 1}`] = c; });
  return out;
};

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can explain what a 1m, 5m and 15m timeframe means and that all three are drawn from the same trades.',
    'Learner can build a 5-minute candle from five 1-minute candles (open = first open, high = highest high, low = lowest low, close = last close).',
    'Learner can tell a change of representation from a real market event, and explain why shorter timeframes look noisier without offering more guaranteed opportunities.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T15-S01', kind: 'cover-problem', title: 'Same market, different pictures',
      narrationText: 'Open a chart on 1 minute and it looks jumpy. Switch to 15 minutes and it looks calm. Nothing in the market changed. Only the way the trades are grouped changed.',
      blocks: [
        { kind: 'paragraph', text: 'On 1 minute a chart looks jumpy. On 15 minutes the same chart looks calm.' },
        { kind: 'paragraph', text: 'The trades are identical. Only the **grouping** changed.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T15-A01' },
      glossaryRefs: ['candlestick'],
      speakerNotes: 'Lead with the surprise: the learner thinks the market changed when only the drawing did.',
    },
    {
      id: 'T15-S02', kind: 'key-definition', title: 'Timeframe',
      narrationText: 'The timeframe is how much time each candle covers. On a 1m chart one candle is one minute. On a 5m chart one candle is five minutes. On a 15m chart, fifteen minutes.',
      blocks: [
        { kind: 'definition', termId: 'timeframe' },
        { kind: 'list', ordered: false, items: ['1m: one candle per minute', '5m: one candle per 5 minutes', '15m: one candle per 15 minutes'] },
      ],
      glossaryRefs: ['timeframe'],
    },
    {
      id: 'T15-S03', kind: 'visual-breakdown', title: 'Building a bigger candle',
      narrationText: 'To build a 5-minute candle, take five 1-minute candles. The open is the first open. The high is the highest high. The low is the lowest low. The close is the last close.',
      blocks: [
        { kind: 'paragraph', text: '[[candle-aggregation|Aggregation]] joins small candles into one bigger candle:' },
        { kind: 'list', ordered: true, items: ['Open = first open', 'High = highest high', 'Low = lowest low', 'Close = last close'] },
      ],
      visualRef: { kind: 'scene', sceneId: 'T15-A02' },
      glossaryRefs: ['candle-aggregation', 'ohlc'],
    },
    {
      id: 'T15-S04', kind: 'worked-example', title: 'Five minutes into one candle',
      narrationText: 'Our first five fictional minutes open at 100.00. The highest high is 100.80, the lowest low is 99.70 and the fifth minute closes at 100.50. So the 5-minute candle is open 100.00, high 100.80, low 99.70, close 100.50.',
      blocks: [
        {
          kind: 'worked-example', title: 'DEMO/USDT, minutes 1–5 (fictional)', fictional: true,
          steps: [
            { text: 'Open = minute 1 open', result: '100.00' },
            { text: 'High = max(100.40, 100.70, 100.80, 100.50, 100.60)', result: '100.80' },
            { text: 'Low = min(99.80, 100.10, 100.20, 99.70, 99.80)', result: '99.70' },
          ],
          conclusion: 'Close = minute 5 close = 100.50.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T15-A04' },
      glossaryRefs: ['candle-aggregation'],
    },
    {
      id: 'T15-S05', kind: 'risks-misunderstanding', title: 'Noise is not opportunity',
      narrationText: 'Short timeframes show every small wiggle. That is noise, and it can look like a signal when it is not. More candles do not mean more good chances, and every extra trade pays fees.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'More candles = more chances?', text: 'Shorter timeframes show more [[market-noise|noise]], not more guaranteed opportunities.' },
        { kind: 'callout', callout: 'safety', text: 'Check the [[higher-timeframe-context|bigger picture]] first. Waiting is always allowed.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T15-A05' },
      glossaryRefs: ['market-noise', 'higher-timeframe-context'],
    },
    {
      id: 'T15-S06', kind: 'guided-practice', title: 'Switch the timeframe yourself',
      narrationText: 'Now switch between 1m, 5m and 15m on the same fictional data. Then type the open, high, low and close of the second 5-minute candle and check them.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Switch between 1m, 5m and 15m.', 'Find 5-minute candle #2 (minutes 6–10).', 'Type its open, high, low and close.'] },
        { kind: 'callout', callout: 'tip', text: 'Open the number table to read the 1-minute values.' },
      ],
      glossaryRefs: ['timeframe', 'candle-aggregation'],
    },
    {
      id: 'T15-S07', kind: 'recap', title: 'Recap',
      narrationText: 'A timeframe is how long each candle covers. Bigger candles are built from smaller ones with a fixed rule. Switching timeframes changes the picture, not the market. Short timeframes are noisier, and they guarantee nothing.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Timeframe = time covered by one candle.', 'Aggregate: first open, highest high, lowest low, last close.', 'Switching timeframe changes the drawing, not the trades.', 'Short timeframes are noisy; check the bigger picture.'] },
      ],
      glossaryRefs: ['timeframe', 'market-noise'],
    },
  ],

  notesSections: [
    {
      id: 'T15-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'A [[timeframe]] is the amount of time one [[candlestick|candle]] covers. On a 1m chart each candle summarises one minute of trades. On a 5m chart each candle summarises five minutes, and on a 15m chart fifteen minutes. A bigger candle is made by [[candle-aggregation|candle aggregation]]: its open is the first open, its high is the highest high, its low is the lowest low and its close is the last close of the smaller candles inside it.' },
        { kind: 'analogy', text: 'Think of a cricket score. You can read it ball by ball, over by over, or as the score after 15 overs. The match is the same; you are just zooming in or out.' },
      ],
    },
    {
      id: 'T15-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'The same market can look exciting on 1 minute and calm on 15 minutes. If you forget that both views come from the same trades, you may think the market changed when only the drawing did. Short timeframes show a lot of [[market-noise|noise]]: small moves that change direction often and carry little meaning. Looking at [[higher-timeframe-context|higher-timeframe context]] first helps you see a small dip inside the bigger shape.' },
      ],
    },
    {
      id: 'T15-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: the first 5-minute candle (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Minutes 1–5 open at 100.00, so the 5m open is 100.00.' },
            { text: 'Highs: 100.40, 100.70, 100.80, 100.50, 100.60', result: 'high 100.80 USDT' },
            { text: 'Lows: 99.80, 100.10, 100.20, 99.70, 99.80', result: 'low 99.70 USDT' },
            { text: 'Minute 5 closes at 100.50', result: 'close 100.50 USDT' },
          ],
          conclusion: 'On 1m this was 3 bullish and 2 bearish candles. On 5m it is one bullish candle: O 100.00 · H 100.80 · L 99.70 · C 100.50.',
        },
        {
          kind: 'worked-example', title: 'Example 2: all 15 minutes as one candle (fictional)', fictional: true,
          steps: [
            { text: 'The three 5m candles: O 100.00 C 100.50 · O 100.50 C 101.30 · O 101.30 C 100.90.' },
            { text: 'Highest high of all 15 minutes', result: '101.60 USDT' },
            { text: 'Lowest low of all 15 minutes', result: '99.70 USDT' },
          ],
          conclusion: 'The 15m candle is O 100.00 · H 101.60 · L 99.70 · C 100.90: one bullish candle, although 7 of the 15 one-minute candles were bearish.',
        },
      ],
    },
    {
      id: 'T15-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Look for the timeframe label on the chart, such as 1m, 5m or 15m. Platforms place it differently and layouts change.',
          'Count the candles: a longer timeframe shows fewer candles for the same period.',
          'Representation changes when you switch: number of candles, their colours, body sizes.',
          'Market events stay the same in every view: the highest and lowest traded prices and the latest price.',
        ] },
      ],
    },
    {
      id: 'T15-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Averaging instead of aggregating', text: 'The 5m high is the single highest high, not an average.' },
        { kind: 'callout', callout: 'mistake', title: 'Thinking the market changed', text: 'A red 1m candle inside a green 5m candle is not a contradiction; it is the same trades seen closer.' },
        { kind: 'callout', callout: 'mistake', title: 'Believing short timeframes mean easy chances', text: 'More candles means more noise and more fees, not more guaranteed opportunities.' },
      ],
    },
    {
      id: 'T15-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'No timeframe predicts the future. Shorter timeframes are noisier and can tempt you to trade too often. Check the bigger picture, and remember that waiting or not trading is always a valid choice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T15-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Building a bigger candle', headers: ['Part', 'Rule', 'Fictional 5m #1'], rows: [
          ['Open', 'first open', '100.00'],
          ['High', 'highest high', '100.80'],
          ['Low', 'lowest low', '99.70'],
          ['Close', 'last close', '100.50'],
        ] },
      ],
    },
    {
      id: 'T15-N08', heading: 'learn-more', title: 'Learn more: the unfinished candle', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'The candle at the right edge of any chart is still forming. On a 15m chart it may be only 3 minutes old, and its shape can change completely before the 15 minutes end. Charts usually start each candle on a clock boundary, such as minute 0, 15, 30 and 45, so two platforms that use different clock settings or time zones can draw slightly different candles from the same trades.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T15-A01', type: 'candle-formation', durationMs: 25_000,
      parameters: { variant: 'groups', candles: [
        { o: 100, h: 100.4, l: 99.8, c: 100.2, label: '1' },
        { o: 100.2, h: 100.7, l: 100.1, c: 100.6, label: '2' },
        { o: 100.6, h: 100.8, l: 100.2, c: 100.3, label: '3' },
        { o: 100.3, h: 100.5, l: 99.7, c: 99.9, label: '4' },
        { o: 99.9, h: 100.6, l: 99.8, c: 100.5, label: '5' },
      ] },
      caption: 'Five fictional 1-minute candles sort into columns: minutes 1, 2 and 5 are bullish; minutes 3 and 4 are bearish. Direction flips every minute or two.',
      narration: 'Up, up, down, down, up. On the 1-minute view the direction keeps changing.',
      reducedMotionDescription: 'Five fictional 1m candles. Bullish: minute 1 (100.00 → 100.20), minute 2 (100.20 → 100.60), minute 5 (99.90 → 100.50). Bearish: minute 3 (100.60 → 100.30), minute 4 (100.30 → 99.90).',
      glossaryRefs: ['timeframe', 'market-noise'],
    },
    {
      id: 'T15-A02', type: 'timeframe-aggregation', durationMs: 40_000, fixtureId: 'FX-T15-SERIES-01',
      parameters: { groupSize: 5, targetLabel: '5m' },
      caption: 'Brackets group the 15 one-minute candles in fives, then each group merges into one 5m candle: 100.00→100.50, 100.50→101.30, 101.30→100.90.',
      narration: 'Each 5-minute candle takes the first open, the highest high, the lowest low and the last close of its five minutes.',
      reducedMotionDescription: 'Fifteen fictional 1m candles are grouped into three 5m candles. 5m #1: O 100.00, H 100.80, L 99.70, C 100.50. 5m #2: O 100.50, H 101.60, L 100.40, C 101.30. 5m #3: O 101.30, H 101.40, L 100.00, C 100.90.',
      glossaryRefs: ['candle-aggregation'],
    },
    {
      id: 'T15-A03', type: 'timeframe-aggregation', durationMs: 30_000, fixtureId: 'FX-T15-SERIES-01',
      parameters: { groupSize: 15, targetLabel: '15m' },
      caption: 'Now all 15 minutes merge into a single 15m candle: open 100.00, high 101.60, low 99.70, close 100.90.',
      narration: 'The same raw minutes, grouped by fifteen. One calm bullish candle replaces fifteen jumpy ones.',
      reducedMotionDescription: 'The same 15 fictional 1m candles merge into one 15m candle: O 100.00, H 101.60, L 99.70, C 100.90. It is bullish, although 7 of the 15 one-minute candles were bearish.',
      glossaryRefs: ['candle-aggregation', 'timeframe'],
    },
    {
      id: 'T15-A04', type: 'candle-formation', durationMs: 25_000,
      parameters: { variant: 'compare', candles: [
        { o: 100, h: 100.8, l: 99.7, c: 100.5, label: '5m #1' },
        { o: 100.5, h: 101.6, l: 100.4, c: 101.3, label: '5m #2' },
        { o: 101.3, h: 101.4, l: 100, c: 100.9, label: '5m #3' },
      ] },
      caption: 'The three 5m candles side by side: #1 and #2 are bullish, #3 is bearish, closing 0.40 below its open.',
      narration: 'Each 5-minute candle hides the minute-by-minute zig-zag inside it.',
      reducedMotionDescription: 'Three fictional 5m candles: #1 O 100.00 C 100.50 (bullish); #2 O 100.50 C 101.30 (bullish); #3 O 101.30 C 100.90 (bearish).',
      glossaryRefs: ['ohlc'],
    },
    {
      id: 'T15-A05', type: 'price-path', durationMs: 25_000,
      parameters: { variant: 'horizon-compare',
        points: [100.2, 100.6, 100.3, 99.9, 100.5, 101.0, 100.7, 101.4, 101.1, 101.3, 100.6, 100.3, 100.7, 101.1, 100.9],
        comparePoints: [100.0, 100.5, 101.3, 100.9],
        label: '1m closes: 15 points, direction changes again and again', compareLabel: '5m closes: start 100.00, then 100.50, 101.30, 100.90' },
      caption: 'The 1m closes zig-zag through 15 points; the 5m closes draw the same quarter-hour with only three steps.',
      narration: 'Shorter timeframes show more noise. The longer view smooths it out but also hides detail.',
      reducedMotionDescription: 'Top: fictional 1m closes 100.20, 100.60, 100.30, 99.90, 100.50, 101.00, 100.70, 101.40, 101.10, 101.30, 100.60, 100.30, 100.70, 101.10, 100.90. Bottom: the 5m view of the same data, from the open 100.00 to closes 100.50, 101.30, 100.90.',
      glossaryRefs: ['market-noise', 'higher-timeframe-context'],
    },
    {
      id: 'T15-A06', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'checklist', heading: 'Representation or market event?', items: ['Number of candles: representation.', 'Candle colours and body sizes: representation.', 'Highest and lowest traded price: market event.', 'Latest traded price: market event.'] },
      caption: 'A sorting rule appears line by line: what the drawing changes versus what the trades did.',
      reducedMotionDescription: 'Checklist: when you switch timeframe, the number of candles and their colours and body sizes change (representation). The highest traded price, lowest traded price and latest price stay the same (market events).',
    },
    {
      id: 'T15-A07', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'Shorter timeframe, more noise', items: ['1m shows every small wiggle.', 'More candles do not mean more good chances.', 'Each extra trade pays fees.', 'Check the bigger picture; waiting is allowed.'] },
      caption: 'Safety: shorter timeframes are noisier and guarantee no opportunities.',
      reducedMotionDescription: 'Warning card: 1m charts show every small wiggle; more candles do not mean more good chances; each extra trade pays fees; check the bigger picture, and waiting is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T15-X01', type: 'timeframe-switch', title: 'Switch timeframes and build 5m candle #2',
      fixtureId: 'FX-T15-SERIES-01', simulatorId: 'ohlc.aggregate',
      instructions: 'The same 15 fictional 1-minute candles are shown. Switch between 1m, 5m and 15m and watch how the picture changes. Then, using the 1m view and the number table, work out 5-minute candle #2 (minutes 6 to 10) and type its open, high, low and close to 2 decimal places.',
      steps: [
        { id: 'T15-X01-01', prompt: 'Switch between 1m, 5m and 15m. Count the candles each time.', hint: '15 candles, then 3, then 1, all from the same trades.' },
        { id: 'T15-X01-02', prompt: 'On 1m, find minutes 6 to 10. The 5m open is the open of minute 6, and the close is the close of minute 10.', hint: 'Minute 6 opens at 100.50; minute 10 closes at 101.30.' },
        { id: 'T15-X01-03', prompt: 'Find the highest high and the lowest low of minutes 6 to 10, then check on the 5m view.', hint: 'Highs: 101.10, 101.30, 101.60, 101.50, 101.40. Lows: 100.40, 100.60, 100.60, 100.90, 100.80.' },
      ],
      allowedControls: ['choice', 'numeric-input', 'reset', 'hint'],
      parameters: { groupSizes: [1, 5, 15] },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'o', label: 'Open', value: 100.5, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'h', label: 'High', value: 101.6, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'l', label: 'Low', value: 100.4, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
        { key: 'c', label: 'Close', value: 101.3, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      ] },
      explanation: '5m candle #2 is O 100.50 · H 101.60 · L 100.40 · C 101.30: the first open, the highest high (minute 8), the lowest low (minute 6) and the last close. On 1m those five minutes were 3 bullish and 2 bearish candles; on 5m they are one bullish candle.',
      fictionalDataLabel: 'Fictional DEMO/USDT candles for practice only.',
    },
    {
      id: 'T15-X02', type: 'classify', title: 'Representation or market event?',
      fixtureId: 'FX-T15-CLASSIFY-01',
      instructions: 'You switch the same fictional DEMO/USDT chart from 1m to 15m. Sort each statement: is it only a change in how the trades are drawn (representation), or something the market actually did (market event)?',
      steps: [
        { id: 'T15-X02-01', prompt: 'Ask: would this be different if I only changed the chart setting?', hint: 'If a setting can change it, it is representation.' },
        { id: 'T15-X02-02', prompt: 'Place all six statements, then press Check.', hint: 'Traded prices (highest, lowest, latest) are the same in every view.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'count', text: 'The chart now shows 1 candle instead of 15.' },
          { id: 'colour', text: 'Minute 3 was a bearish candle, but it is now inside a bullish candle.' },
          { id: 'body', text: 'The candle body looks much longer than any 1m body.' },
          { id: 'high', text: 'A trade happened at 101.60, the highest price of the quarter-hour.' },
          { id: 'low', text: 'Selling pushed price down to 99.70 in minute 4.' },
          { id: 'last', text: 'The latest traded price is 100.90.' },
        ],
        buckets: [
          { id: 'representation', label: 'Representation (the drawing changed)' },
          { id: 'market-event', label: 'Market event (trades really happened)' },
        ],
        itemFeedback: {
          count: 'The number of candles depends only on the timeframe setting.',
          colour: 'Colour depends on which open and close you group together, so it changes with the timeframe.',
          body: 'Body size depends on the grouping: a longer timeframe spans a bigger open-to-close distance.',
          high: '101.60 traded no matter how you draw it; every timeframe shows it as the high.',
          low: 'The dip to 99.70 really happened; the 15m low is the same 99.70.',
          last: 'The latest price is the same on every timeframe.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { representation: ['count', 'colour', 'body'], 'market-event': ['high', 'low', 'last'] } },
      explanation: 'Switching timeframe regroups the same trades. Candle count, colour and body size change with the grouping. The traded prices (highest, lowest, latest) are market events and look the same in every view.',
      fictionalDataLabel: 'Fictional DEMO/USDT statements for practice only.',
    },
    {
      id: 'T15-X03', type: 'choice-feedback', title: 'A red minute inside a bigger picture',
      fixtureId: 'FX-T15-SERIES-01',
      instructions: 'On the fictional 1m chart, minute 11 falls from 101.30 to 100.60 (−0.70). The 15m candle for the same quarter-hour is O 100.00, C 100.90. Which reading is the most careful?',
      choices: [
        { id: 'careful', text: 'Minute 11 is one small dip inside a quarter-hour that still closed higher. It is context, not a prediction; waiting is fine.' },
        { id: 'crash', text: 'The market is crashing; the 15m chart must be wrong.' },
        { id: 'buy', text: 'The 15m candle is bullish, so price will certainly rise next.' },
        { id: 'ignore', text: 'Only the 1m chart is real; higher timeframes are invented.' },
      ],
      steps: [
        { id: 'T15-X03-01', prompt: 'Find minute 11 on the chart and compare it with the whole quarter-hour.', hint: 'The 15m candle closed 0.90 above its open.' },
        { id: 'T15-X03-02', prompt: 'Choose the most careful reading.', hint: 'Avoid any choice that says “certainly” or calls one view wrong.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        showChart: true,
        feedback: {
          crash: 'Both views come from the same trades, so neither is wrong. A −0.70 minute is small next to the quarter-hour range of 1.90.',
          buy: 'A bullish 15m candle describes the past. It gives context but guarantees nothing about the next candle.',
          ignore: 'Higher timeframes are built from the same 1m data with a fixed rule; they are just as real.',
        },
      },
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'careful' },
      explanation: 'Higher-timeframe context shows where a small move sits in the bigger shape. It helps you avoid over-reacting to noise, but no timeframe predicts what comes next.',
      fictionalDataLabel: 'Fictional DEMO/USDT candles for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T15-F01', name: 'Candle aggregation', expression: 'open = first open; high = highest high; low = lowest low; close = last close (of the grouped candles)',
      variables: [
        { symbol: 'o1…c5', meaning: 'open, high, low and close of each 1-minute candle in the group', unit: 'USDT per DEMO' },
        { symbol: 'groupSize', meaning: 'how many small candles make one bigger candle (5 for 1m → 5m)', unit: 'candles' },
      ],
      simulatorId: 'ohlc.aggregate', approximate: false,
      workedExamples: [
        { label: '5m #1 from minutes 1–5 (notes example 1, slide S04)', inputs: flat(1, 5, 5), outputs: { o: 100, h: 100.8, l: 99.7, c: 100.5 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: '5m #2 from minutes 6–10 (exercise T15-X01)', inputs: flat(6, 10, 5), outputs: { o: 100.5, h: 101.6, l: 100.4, c: 101.3 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: '5m #3 from minutes 11–15 (scene A02)', inputs: flat(11, 15, 5), outputs: { o: 101.3, h: 101.4, l: 100, c: 100.9 }, tolerance: 1e-9, assumptions: ['fictional data'] },
        { label: '15m from all 15 minutes (notes example 2, quiz T15-Q01)', inputs: flat(1, 15, 15), outputs: { o: 100, h: 101.6, l: 99.7, c: 100.9 }, tolerance: 1e-9, assumptions: ['fictional data'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T15-Q01', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T15', fixtureId: 'FX-T15-SERIES-01',
      prompt: 'The three fictional 5m candles have highs 100.80, 101.60 and 101.40. What is the high of the single 15m candle built from them, in USDT?',
      answer: { kind: 'numeric', value: 101.6, tolerance: 0.005, unit: 'USDT', rounding: { decimals: 2 } },
      rationale: 'The aggregated high is the highest high: max(100.80, 101.60, 101.40) = 101.60 USDT. It is not an average.',
      learningOutcome: 'Aggregate the high of a longer-timeframe candle.',
      remediationRef: { lessonId: 'T15', anchorId: 'T15-N03' },
    },
    {
      id: 'T15-Q02', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T15', fixtureId: 'FX-T15-SERIES-01',
      prompt: 'You switch the fictional chart from 1m to 15m. Fifteen candles become one. What changed?',
      choices: [
        { id: 'a', text: 'Only the representation: the same trades are grouped into one 15-minute candle.' },
        { id: 'b', text: 'The market slowed down, so there were fewer trades.' },
        { id: 'c', text: 'The highest traded price changed.' },
        { id: 'd', text: 'Fourteen candles of data were deleted.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A timeframe switch regroups the same trades. The highest, lowest and latest prices are unchanged.',
      misconceptionFeedback: {
        b: 'Trading activity did not change; you only changed how much time each candle covers.',
        c: 'The 15m high (101.60) is the same highest price you can find on the 1m chart.',
        d: 'Nothing is deleted; the 15 minutes are summarised inside one candle.',
      },
      learningOutcome: 'Distinguish a representation change from a market event.',
      remediationRef: { lessonId: 'T15', anchorId: 'T15-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T15-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T15', safetyCritical: true, safetyTopic: 'no-trade',
      prompt: 'A learner says: “The 1m chart has 15 times more candles than the 15m chart, so it gives me 15 times more chances to profit. I should trade every 1m candle.” What is the best response?',
      choices: [
        { id: 'a', text: 'Shorter timeframes show more noise, not more guaranteed opportunities. Every extra trade pays fees, and waiting or not trading is always allowed.' },
        { id: 'b', text: 'Agree: more candles always means more profit.' },
        { id: 'c', text: 'Agree, as long as each trade is small.' },
        { id: 'd', text: 'Disagree: only the 15m chart ever gives real opportunities.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Many 1m candles are noise. More trades mean more fees and more chances to be wrong. No timeframe guarantees opportunities.',
      misconceptionFeedback: {
        b: 'Candle count is a drawing choice. It does not create profitable moves.',
        c: 'Small size limits damage per trade, but frequent trades on noise still add up fees and losses.',
        d: 'No timeframe is guaranteed to give good opportunities; longer views are just less noisy.',
      },
      learningOutcome: 'Recognise that short timeframes are noisy and do not guarantee opportunities.',
      remediationRef: { lessonId: 'T15', anchorId: 'T15-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T15-Q04', type: 'single', cognitiveTag: 'recall', linkedLessonId: 'T15',
      prompt: 'A 5m candle is built from five 1m candles. Which value becomes its close?',
      choices: [
        { id: 'a', text: 'The close of the fifth (last) 1m candle.' },
        { id: 'b', text: 'The average of the five closes.' },
        { id: 'c', text: 'The highest close of the five.' },
        { id: 'd', text: 'The close of the first 1m candle.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The close of the bigger candle is the last traded price in its period: the close of the last small candle.',
      misconceptionFeedback: {
        b: 'Aggregation never averages. Each value comes from one specific candle.',
        c: 'The highest value feeds the high, not the close.',
        d: 'The first candle gives the open, not the close.',
      },
      learningOutcome: 'Recall the aggregation rule for the close.',
      remediationRef: { lessonId: 'T15', anchorId: 'T15-N07' },
      shuffleChoices: true,
    },
    {
      id: 'T15-Q05', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T15', fixtureId: 'FX-T15-SERIES-01',
      prompt: 'Minutes 3 and 4 are bearish 1m candles, yet the 5m candle that contains them (O 100.00, C 100.50) is bullish. How should you read this?',
      choices: [
        { id: 'a', text: 'Both are true: two red minutes sit inside a five-minute period that closed higher overall.' },
        { id: 'b', text: 'The 5m candle is wrong, because it should be bearish.' },
        { id: 'c', text: 'The two bearish minutes prove the next 5m candle will be bearish.' },
        { id: 'd', text: 'The 1m candles are wrong, because the 5m candle is bullish.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Different timeframes describe the same trades at different zoom levels. Small opposite moves inside a bigger candle are normal noise.',
      misconceptionFeedback: {
        b: 'The 5m direction compares its first open (100.00) with its last close (100.50): bullish.',
        c: 'Candles describe the past. Two red minutes predict nothing about the next five.',
        d: 'Both views are built from the same data; neither is wrong.',
      },
      learningOutcome: 'Read a short-term move within higher-timeframe context.',
      remediationRef: { lessonId: 'T15', anchorId: 'T15-N02' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Averaging the highs or lows when building a bigger candle.', correction: 'Use the single highest high and the single lowest low.' },
    { mistake: 'Thinking the market changed when the timeframe was switched.', correction: 'Switching regroups the same trades; traded prices stay the same.' },
    { mistake: 'Believing a 1m chart offers more guaranteed chances.', correction: 'Short timeframes show more noise and cost more fees; check the bigger picture and remember waiting is allowed.' },
  ],
  takeaways: [
    'A timeframe is how much time one candle covers; 1m, 5m and 15m all come from the same trades.',
    'A bigger candle = first open, highest high, lowest low, last close of the smaller candles.',
    'Shorter timeframes are noisier and guarantee no opportunities; read them inside the bigger picture.',
  ],
  reviewCard: {
    keyTermIds: ['timeframe', 'candle-aggregation', 'market-noise'],
    safetyNote: 'No timeframe predicts the future. Short timeframes are noisy, and waiting is always allowed.',
    reviewMinutes: 3,
    retrievalQuestion: 'Five fictional 1m candles open at 50.00, have highs up to 51.20, lows down to 49.60, and the last one closes at 50.80. What is the 5m candle?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T15-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
