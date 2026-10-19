import { SCHEMA_VERSION, type Lesson, type Exercise } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data.';

const TREND_CHOICES = [
  { id: 'up', text: 'Uptrend: higher highs and higher lows' },
  { id: 'down', text: 'Downtrend: lower highs and lower lows' },
  { id: 'sideways', text: 'Sideways: mixed swings inside a band' },
];

function sampleChart(n: 2 | 3 | 4, chart: 1 | 2 | 3, answer: 'up' | 'down' | 'sideways', hint: string, feedback: Record<string, string>, explanation: string): Exercise {
  return {
    id: `T16-X0${n}`, type: 'choice-feedback', title: `Sample chart ${chart}: which structure?`,
    fixtureId: `FX-T16-CHART-${chart}`,
    instructions: `Look at fictional sample chart ${chart}. Find the turning points (peaks and dips), compare each with the previous one of the same kind, then choose the structure.`,
    steps: [
      { id: `T16-X0${n}-01`, prompt: 'Find the peaks and compare them with each other. Then do the same for the dips.', hint },
      { id: `T16-X0${n}-02`, prompt: 'Choose the structure that best describes the whole chart, then press Check.', hint: 'Both peaks and dips rising = up. Both falling = down. Neither clearly = sideways.' },
    ],
    allowedControls: ['choice', 'reset', 'hint'],
    choices: TREND_CHOICES,
    parameters: { showChart: true, feedback },
    expectedEvaluation: { kind: 'exact-choice', choiceId: answer },
    explanation,
    fictionalDataLabel: 'Fictional DEMO/USDT chart for practice only.',
  };
}

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can label swing points as higher high, higher low, lower high or lower low by comparing each swing with the previous swing of the same kind.',
    'Learner can classify a chart section as uptrend, downtrend or sideways from its swing labels.',
    'Learner can explain why trend identification is subjective and why a trend is a description of the past, not a forecast.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T16-S01', kind: 'cover-problem', title: 'Up, down or nowhere?',
      narrationText: 'Look at any chart and price wiggles up and down every minute. Is it climbing, falling or going nowhere? Looking at single candles will not tell you. The turning points will.',
      blocks: [
        { kind: 'paragraph', text: 'A chart wiggles every minute. Is it climbing, falling or going nowhere?' },
        { kind: 'paragraph', text: 'Single candles cannot answer that. The **turning points** can. Their pattern is called [[market-structure|market structure]].' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T16-A01' },
      glossaryRefs: ['market-structure'],
      speakerNotes: 'Connect to T14 and T15: one candle summarises one interval; structure looks across many candles.',
    },
    {
      id: 'T16-S02', kind: 'key-definition', title: 'Four swing labels',
      narrationText: 'Compare each peak with the previous peak, and each dip with the previous dip. A peak above the last peak is a higher high. A peak below it is a lower high. The same idea works for dips.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          '[[higher-high|Higher high (HH)]]: peak above the previous peak',
          '[[lower-high|Lower high (LH)]]: peak below the previous peak',
          '[[higher-low|Higher low (HL)]]: dip above the previous dip',
          '[[lower-low|Lower low (LL)]]: dip below the previous dip',
        ] },
        { kind: 'callout', callout: 'tip', text: 'Compare peaks with peaks and dips with dips. Never a peak with a dip.' },
      ],
      glossaryRefs: ['higher-high', 'lower-high', 'higher-low', 'lower-low'],
    },
    {
      id: 'T16-S03', kind: 'visual-breakdown', title: 'Three structures',
      narrationText: 'Higher highs with higher lows describe an uptrend. Lower highs with lower lows describe a downtrend. Mixed labels inside a band describe a sideways market.',
      blocks: [
        { kind: 'table', caption: 'Swing labels and structure', headers: ['Swings', 'Structure'], rows: [
          ['HH + HL', 'Uptrend'],
          ['LH + LL', 'Downtrend'],
          ['Mixed, inside a band', 'Sideways'],
        ] },
        { kind: 'paragraph', text: 'See [[uptrend]], [[downtrend]] and [[sideways-market|sideways market]].' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T16-A05' },
      glossaryRefs: ['uptrend', 'downtrend', 'sideways-market'],
    },
    {
      id: 'T16-S04', kind: 'worked-example', title: 'Labelling fictional swings',
      narrationText: 'Our fictional chart starts with a low at 100.00 and a high at 103.00. The next low, 101.50, is above 100.00: a higher low. The next high, 104.50, is above 103.00: a higher high.',
      blocks: [
        {
          kind: 'worked-example', title: 'DEMO/USDT swings (fictional)', fictional: true,
          steps: [
            { text: 'Low 100.00, then high 103.00 (starting points)' },
            { text: 'Low 101.50 vs 100.00', result: 'HL' },
            { text: 'High 104.50 vs 103.00', result: 'HH' },
            { text: 'Low 102.80 vs 101.50', result: 'HL' },
          ],
          conclusion: 'HH + HL: an uptrend structure, so far.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T16-A02' },
      glossaryRefs: ['higher-low', 'higher-high'],
    },
    {
      id: 'T16-S05', kind: 'risks-misunderstanding', title: 'Structure changes, and readers disagree',
      narrationText: 'Structure describes the past. A trend can turn into a sideways market, and then reverse, with no warning. Two people can also mark different swings on the same chart. That is normal.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Trend ≠ promise', text: 'An uptrend so far does not mean the next swing will be higher.' },
        { kind: 'callout', callout: 'tip', title: 'Judgement call', text: 'Which wiggle counts as a swing is a **judgement**. Another timeframe or another reader can give a different answer.' },
        { kind: 'callout', callout: 'safety', text: 'Waiting or not trading is always allowed.' },
      ],
      glossaryRefs: ['market-structure', 'timeframe'],
    },
    {
      id: 'T16-S06', kind: 'guided-practice', title: 'Your turn',
      narrationText: 'First you label five swing points on a fictional chart. Then you classify three sample charts as uptrend, downtrend or sideways.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Label swings C to G as HH, HL, LH or LL.', 'Classify sample charts 1, 2 and 3.'] },
        { kind: 'callout', callout: 'tip', text: 'Use the numbers, not only the line colour or its general look.' },
      ],
      glossaryRefs: ['higher-high', 'lower-low'],
    },
    {
      id: 'T16-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Compare peaks with peaks and dips with dips. HH and HL mean uptrend, LH and LL mean downtrend, mixed means sideways. Structure describes the past, it can change, and it is partly a judgement.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          'Peaks vs peaks, dips vs dips.',
          'HH + HL = uptrend; LH + LL = downtrend; mixed = sideways.',
          'The first LH or LL is an early hint of change, not proof.',
          'Structure describes the past and is partly subjective.',
        ] },
      ],
      glossaryRefs: ['market-structure'],
    },
  ],

  notesSections: [
    {
      id: 'T16-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: '[[market-structure|Market structure]] is the pattern made by a chart’s turning points. A swing high is a peak where price stopped rising and turned down. A swing low is a dip where price stopped falling and turned up. Each new peak is compared with the previous peak, and each new dip with the previous dip, to get one of four labels: [[higher-high|higher high (HH)]], [[lower-high|lower high (LH)]], [[higher-low|higher low (HL)]] or [[lower-low|lower low (LL)]].' },
        { kind: 'paragraph', text: 'HH plus HL describes an [[uptrend]]. LH plus LL describes a [[downtrend]]. Mixed labels with price turning inside the same band describe a [[sideways-market|sideways market]].' },
        { kind: 'analogy', text: 'Think of someone climbing a staircase while sometimes stepping back. If every step back stops on a higher stair than the last one, they are still going up overall.' },
      ],
    },
    {
      id: 'T16-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Single [[candlestick|candles]] are noisy. Structure gives you a calmer, shared vocabulary to describe what a chart has been doing over many candles. Later lessons on support, resistance and breakouts build on these swing points. Knowing the structure also helps you notice when the chart has changed character, for example when an uptrend starts making lower highs.' },
      ],
    },
    {
      id: 'T16-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: an uptrend that goes sideways (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Swings: low 100.00, high 103.00, low 101.50, high 104.50, low 102.80, high 106.00.' },
            { text: 'Lows 100.00 → 101.50 → 102.80 all rise', result: 'HL, HL' },
            { text: 'Highs 103.00 → 104.50 → 106.00 all rise', result: 'HH, HH' },
            { text: 'Next swings: low 103.40 (HL), high 105.70 (LH, below 106.00), low 102.90 (LL, below 103.40)', result: 'mixed' },
          ],
          conclusion: 'First an uptrend; then price turns between about 102.90 and 106.00 USDT: sideways.',
        },
        {
          kind: 'worked-example', title: 'Example 2: the reversal (fictional)', fictional: true,
          steps: [
            { text: 'High 104.60 vs previous high 105.70', result: 'LH' },
            { text: 'Low 101.20 vs previous low 102.90', result: 'LL' },
            { text: 'High 103.50 vs 104.60, then low 99.80 vs 101.20', result: 'LH, LL' },
          ],
          conclusion: 'Repeated LH + LL: the structure is now a downtrend. Nothing in it says how long that will last.',
        },
      ],
    },
    {
      id: 'T16-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'Choose one [[timeframe]] and stay on it while you label.',
          'Mark clear turning points only: places where price moved away by a visible amount, not every tiny wiggle.',
          'Write the price of each peak and each dip.',
          'Compare each peak with the previous peak and each dip with the previous dip. Write HH, LH, HL or LL.',
          'Read the last few labels together: HH + HL = up, LH + LL = down, mixed = sideways.',
        ] },
        { kind: 'paragraph', text: '**Boundaries:** deciding which wiggles count as swings is a judgement. A 1-minute chart may show a downtrend inside what a 15-minute chart shows as an uptrend. Two careful people can label the same chart differently. Write down your own rule before you look, and expect uncertainty.' },
      ],
    },
    {
      id: 'T16-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Comparing a peak with a dip', text: 'A higher low compares a dip with the previous dip. Comparing a dip with a peak gives meaningless labels.' },
        { kind: 'callout', callout: 'mistake', title: 'Calling a trend from one swing', text: 'One higher high is not an uptrend. Look for several swings in the same direction.' },
        { kind: 'callout', callout: 'mistake', title: 'Treating the trend as a promise', text: 'A trend is a summary of the past. It can turn sideways or reverse at the next swing.' },
      ],
    },
    {
      id: 'T16-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Market structure describes what already happened and is partly subjective. It is not a signal, not advice and not a reason on its own to open a position. Waiting or not trading is always a valid choice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T16-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Swing labels', headers: ['Label', 'Compare', 'Meaning'], rows: [
          ['HH', 'peak vs previous peak', 'new peak is higher'],
          ['LH', 'peak vs previous peak', 'new peak is lower'],
          ['HL', 'dip vs previous dip', 'new dip is higher'],
          ['LL', 'dip vs previous dip', 'new dip is lower'],
        ] },
        { kind: 'paragraph', text: 'HH + HL = uptrend · LH + LL = downtrend · mixed in a band = sideways.' },
      ],
    },
    {
      id: 'T16-N08', heading: 'learn-more', title: 'Learn more: different swing rules', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Some chart tools mark a swing high only when a candle’s high is above the highs of, say, two candles on each side. Others use a minimum move, such as 0.5% away from the last swing. Each rule gives slightly different swings, and therefore slightly different labels. None is “correct”; each is a choice. If you study structure, write your rule down and use it the same way every time so your notes stay comparable.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T16-A01', type: 'price-path', durationMs: 25_000,
      parameters: { variant: 'plain', points: [100, 101.2, 102.1, 103, 102.2, 101.5, 102.6, 103.8, 104.5, 103.6, 102.8, 104, 105.2, 106], markers: [
        { index: 0, label: 'Low 100.00' },
        { index: 3, label: 'High 103.00' },
        { index: 5, label: 'Low 101.50' },
        { index: 8, label: 'High 104.50' },
        { index: 10, label: 'Low 102.80' },
        { index: 13, label: 'High 106.00' },
      ] },
      caption: 'The price line writes itself onto the chart. Each turning point is marked as it appears: lows 100.00, 101.50, 102.80 and highs 103.00, 104.50, 106.00.',
      narration: 'Price never moves in a straight line. It climbs, pulls back and climbs again. The places where it turns are the swing points.',
      reducedMotionDescription: 'A fictional price line rises from 100.00 to 106.00 in three waves. Swing lows are marked at 100.00, 101.50 and 102.80. Swing highs are marked at 103.00, 104.50 and 106.00.',
      glossaryRefs: ['market-structure'],
    },
    {
      id: 'T16-A02', type: 'market-structure', durationMs: 30_000,
      parameters: { points: [100, 103, 101.5, 104.5, 102.8, 106] },
      caption: 'Only the swings remain. Each new low (101.50, 102.80) is a **higher low**; each new high (104.50, 106.00) is a **higher high**. Verdict: uptrend structure.',
      narration: 'We keep only the turning points and compare them in pairs: dips with dips, peaks with peaks.',
      reducedMotionDescription: 'Swing points 100.00 low, 103.00 high, 101.50 low (HL), 104.50 high (HH), 102.80 low (HL), 106.00 high (HH). Higher highs plus higher lows: uptrend structure.',
      glossaryRefs: ['higher-high', 'higher-low', 'uptrend'],
    },
    {
      id: 'T16-A03', type: 'market-structure', durationMs: 30_000,
      parameters: { points: [102.8, 106, 103.4, 105.7, 102.9, 105.9] },
      caption: 'The climb stalls. Low 103.40 is still higher, but high 105.70 is a **lower high**, low 102.90 a **lower low**, then high 105.90 is higher again. Mixed labels: sideways.',
      narration: 'Now the labels disagree with each other. Price keeps turning between roughly 102.90 and 106.00 instead of climbing.',
      reducedMotionDescription: 'Continuing swings: low 102.80, high 106.00, low 103.40 (HL), high 105.70 (LH), low 102.90 (LL), high 105.90 (HH). The labels are mixed and price stays between about 102.90 and 106.00: sideways.',
      glossaryRefs: ['lower-high', 'lower-low', 'sideways-market'],
    },
    {
      id: 'T16-A04', type: 'market-structure', durationMs: 30_000,
      parameters: { points: [103.4, 105.7, 102.9, 104.6, 101.2, 103.5, 99.8] },
      caption: 'Reversal: highs fall 105.70 → 104.60 → 103.50 and lows fall 102.90 → 101.20 → 99.80. Lower highs plus lower lows: downtrend structure.',
      narration: 'Each bounce stops lower than the last one, and each dip goes deeper. The pattern has reversed.',
      reducedMotionDescription: 'Swings: low 103.40, high 105.70, low 102.90 (LL), high 104.60 (LH), low 101.20 (LL), high 103.50 (LH), low 99.80 (LL). Lower highs and lower lows: downtrend structure.',
      glossaryRefs: ['lower-high', 'lower-low', 'downtrend'],
    },
    {
      id: 'T16-A05', type: 'market-structure', durationMs: 35_000,
      parameters: { points: [100, 103, 101.5, 104.5, 102.8, 106, 103.4, 105.7, 102.9, 104.6, 101.2, 103.5, 99.8] },
      caption: 'The whole story on one chart: HL, HH, HL, HH (uptrend) → HL, LH, LL (mixed, sideways) → LH, LL, LH, LL (downtrend). The verdict changes as swings appear.',
      narration: 'Watch the verdict at the top change as each new swing is added. The structure is only ever a description of the swings so far.',
      reducedMotionDescription: 'All thirteen fictional swings from 100.00 to 99.80. Labels in order: HL, HH, HL, HH, HL, LH, LL, LH, LL, LH, LL. The structure starts as an uptrend, becomes mixed around 102.90 to 106.00, and ends as a downtrend.',
      glossaryRefs: ['market-structure', 'uptrend', 'sideways-market', 'downtrend'],
    },
    {
      id: 'T16-A06', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'checklist', heading: 'Labelling swings, step by step', items: [
        'Pick one timeframe and keep it.',
        'Mark clear peaks and dips only.',
        'Write the price of each.',
        'Peak vs previous peak: HH or LH.',
        'Dip vs previous dip: HL or LL.',
        'Read the last few labels together.',
      ] },
      caption: 'Six steps appear one by one, turning a wiggly line into labelled swings.',
      reducedMotionDescription: 'Checklist: pick one timeframe; mark clear peaks and dips only; write each price; compare each peak with the previous peak (HH or LH); compare each dip with the previous dip (HL or LL); read the last few labels together.',
    },
    {
      id: 'T16-A07', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'plain', heading: 'Where the reading becomes subjective', items: [
        'Which wiggle is big enough to count as a swing?',
        'A 1m downtrend can sit inside a 15m uptrend.',
        'Two careful readers can label the same chart differently.',
        'Decide your rule first, and expect uncertainty.',
      ] },
      caption: 'Four limits appear in turn: swing size, timeframe, reader judgement and the need for a fixed rule.',
      reducedMotionDescription: 'Card about boundaries: deciding which wiggle is a swing is a judgement; a 1-minute downtrend can sit inside a 15-minute uptrend; two careful readers can label the same chart differently; decide your rule first and expect uncertainty.',
      glossaryRefs: ['timeframe'],
    },
    {
      id: 'T16-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'A trend describes the past', items: [
        'It summarises swings that already happened.',
        'It can turn sideways or reverse at the next swing.',
        'It is not advice and not a signal by itself.',
        'Waiting is always allowed.',
      ] },
      caption: 'Safety: the warnings build up one by one: structure is a summary of the past, can change at any swing, and is not a reason to trade on its own.',
      reducedMotionDescription: 'Warning card: a trend summarises swings that already happened; it can turn sideways or reverse at the next swing; it is not advice or a signal by itself; waiting is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T16-X01', type: 'classify', title: 'Label the swings',
      fixtureId: 'FX-T16-SWINGS-01',
      instructions: 'The fictional chart marks seven turning points, A to G. A (low 100.00) and B (high 102.00) are the starting points. Label each of C to G by comparing it with the previous swing of the same kind.',
      steps: [
        { id: 'T16-X01-01', prompt: 'Find the peaks (B, D, F) and the dips (A, C, E, G) on the chart.', hint: 'A peak is a candle whose high stands above its neighbours; a dip has the lowest low around it.' },
        { id: 'T16-X01-02', prompt: 'Compare each peak with the previous peak, and each dip with the previous dip.', hint: 'D (103.00) is compared with B (102.00). E (101.60) is compared with C (101.00).' },
        { id: 'T16-X01-03', prompt: 'Choose a label for all five swings, then press Check.', hint: 'F (102.60) is below D (103.00). G (100.60) is below E (101.60).' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        showChart: true,
        items: [
          { id: 'swing-c', text: 'C: low 101.00 (previous low A 100.00)' },
          { id: 'swing-d', text: 'D: high 103.00 (previous high B 102.00)' },
          { id: 'swing-e', text: 'E: low 101.60 (previous low C 101.00)' },
          { id: 'swing-f', text: 'F: high 102.60 (previous high D 103.00)' },
          { id: 'swing-g', text: 'G: low 100.60 (previous low E 101.60)' },
        ],
        buckets: [
          { id: 'hh', label: 'HH (higher high)' },
          { id: 'hl', label: 'HL (higher low)' },
          { id: 'lh', label: 'LH (lower high)' },
          { id: 'll', label: 'LL (lower low)' },
        ],
        itemFeedback: {
          'swing-c': 'C is a dip. Compare it with dip A: 101.00 is above 100.00, so it is a higher low.',
          'swing-d': 'D is a peak. Compare it with peak B: 103.00 is above 102.00, so it is a higher high.',
          'swing-e': 'E is a dip. Compare it with dip C: 101.60 is above 101.00, so it is a higher low.',
          'swing-f': 'F is a peak. Compare it with peak D: 102.60 is below 103.00, so it is a lower high.',
          'swing-g': 'G is a dip. Compare it with dip E: 100.60 is below 101.60, so it is a lower low.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { hh: ['swing-d'], hl: ['swing-c', 'swing-e'], lh: ['swing-f'], ll: ['swing-g'] } },
      explanation: 'C, D and E continue an uptrend structure (HL, HH, HL). F is the first lower high and G a lower low: the pattern has changed. Whether that change lasts is unknown.',
      fictionalDataLabel: 'Fictional DEMO/USDT swings for practice only.',
    },
    sampleChart(2, 1, 'down',
      'Peak closes go 104.80, 104.10, 103.30, 102.30. Dip closes go 104.20, 103.50, 102.80, 101.90, 101.00.',
      {
        up: 'Check the peaks: each one is lower than the one before. That is not an uptrend.',
        sideways: 'The swings are not turning inside one band: both peaks and dips keep stepping lower.',
      },
      'Every peak is below the previous peak and every dip below the previous dip: lower highs and lower lows, a downtrend structure on this fictional chart.'),
    sampleChart(3, 2, 'up',
      'Peak closes go 101.00, 101.80, 102.60, 103.40, 104.10. Dip closes go 100.50, 101.20, 102.00, 102.90.',
      {
        down: 'Check the dips: each one stops higher than the one before. That is not a downtrend.',
        sideways: 'The swings are not turning inside one band: both peaks and dips keep stepping higher.',
      },
      'Every peak is above the previous peak and every dip above the previous dip: higher highs and higher lows, an uptrend structure on this fictional chart.'),
    sampleChart(4, 3, 'sideways',
      'Peak closes: 101.60, 101.50, 101.70, 101.50, 101.60. Dip closes: 100.20, 100.10, 100.30, 100.20. Do they keep climbing or falling?',
      {
        up: 'Some peaks are higher, but others are lower, and the dips do not keep rising. The swings are mixed.',
        down: 'Some peaks are lower, but others are higher, and the dips do not keep falling. The swings are mixed.',
      },
      'Peaks and dips go up and down by small amounts while price keeps turning between about 100.10 and 101.70: mixed labels inside a band, a sideways structure. Another reader might draw the band slightly differently, which is normal.'),
  ],

  quizQuestions: [
    {
      id: 'T16-Q01', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T16',
      prompt: 'Fictional swings: lows 50.00 → 51.20 → 52.00 and highs 53.00 → 54.10 → 55.30. Which structure is this?',
      choices: [
        { id: 'a', text: 'Uptrend: higher highs and higher lows.' },
        { id: 'b', text: 'Downtrend: lower highs and lower lows.' },
        { id: 'c', text: 'Sideways: the labels are mixed.' },
        { id: 'd', text: 'It is impossible to say anything without the candle colours.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Each low is above the previous low (HL) and each high above the previous high (HH): an uptrend structure.',
      misconceptionFeedback: {
        b: 'Both the lows and the highs are rising, not falling.',
        c: 'Every label is HH or HL, so they are not mixed.',
        d: 'Structure comes from the swing prices. Colour is not needed.',
      },
      learningOutcome: 'Classify a structure from swing prices.',
      remediationRef: { lessonId: 'T16', anchorId: 'T16-N01' },
      shuffleChoices: true,
    },
    {
      id: 'T16-Q02', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T16',
      prompt: 'In a fictional uptrend the last swing high was 110.00. Price then turns down from a new peak at 108.50. What is the label for 108.50?',
      choices: [
        { id: 'a', text: 'Lower high (LH)' },
        { id: 'b', text: 'Higher high (HH)' },
        { id: 'c', text: 'Lower low (LL)' },
        { id: 'd', text: 'Higher low (HL)' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: '108.50 is a peak and it is below the previous peak of 110.00, so it is a lower high: an early hint the uptrend may be changing, not proof.',
      misconceptionFeedback: {
        b: 'A higher high must be above the previous peak. 108.50 is below 110.00.',
        c: 'LL is for dips. 108.50 is a peak, so compare it with the previous peak.',
        d: 'HL is for dips. Compare peaks with peaks.',
      },
      learningOutcome: 'Label a swing high correctly against the previous swing high.',
      remediationRef: { lessonId: 'T16', anchorId: 'T16-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T16-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T16', safetyCritical: true, safetyTopic: 'not-advice',
      prompt: 'A learner sees three higher highs in a row and says: “The uptrend is confirmed, so price must keep rising. I will open a big leveraged long now.” What is the best response?',
      choices: [
        { id: 'a', text: 'The structure only describes past swings. It can turn sideways or reverse at the next swing; waiting or not trading is still a valid choice.' },
        { id: 'b', text: 'Agree: three higher highs guarantee a fourth one.' },
        { id: 'c', text: 'Agree, but only if the last candle is green.' },
        { id: 'd', text: 'Disagree: three higher highs always mean the trend is about to reverse, so open a short.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Market structure is a summary of what already happened and is partly a judgement. It never guarantees the next swing, so it is not, on its own, a reason to trade, and leverage would magnify any loss.',
      misconceptionFeedback: {
        b: 'Nothing guarantees the next swing. Trends often stall or reverse without warning.',
        c: 'Colour describes one candle. It adds no certainty about the future.',
        d: 'This swaps one certainty for another. No structure tells you that a reversal is coming.',
      },
      learningOutcome: 'Recognise that a trend describes the past and is not a trade signal by itself.',
      remediationRef: { lessonId: 'T16', anchorId: 'T16-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T16-Q04', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T16', fixtureId: 'FX-T16-CHART-3',
      prompt: 'On this fictional chart the peaks close at about 101.50 to 101.70 and the dips at about 100.10 to 100.30, with the labels switching between higher and lower. How is it best described?',
      choices: [
        { id: 'a', text: 'Sideways: mixed swings turning inside roughly the same band.' },
        { id: 'b', text: 'Uptrend, because one peak (101.70) is higher than the one before it.' },
        { id: 'c', text: 'Downtrend, because one dip (100.10) is lower than the one before it.' },
        { id: 'd', text: 'A safe market, because price is not going anywhere.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'One higher peak or one lower dip is not a trend. The labels keep switching inside a band, which describes a sideways market.',
      misconceptionFeedback: {
        b: 'A single higher high is not an uptrend. The dips are not rising steadily.',
        c: 'A single lower low is not a downtrend. The peaks are not falling steadily.',
        d: 'Sideways is not safe. Price still moves inside the band and the band can break at any time.',
      },
      learningOutcome: 'Recognise a sideways structure from mixed swing labels.',
      remediationRef: { lessonId: 'T16', anchorId: 'T16-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T16-Q05', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T16',
      prompt: 'Two learners label the same fictional chart. One sees an uptrend; the other, using smaller wiggles as swings, sees a downtrend. What is the most accurate comment?',
      choices: [
        { id: 'a', text: 'Swing identification is partly subjective. Different swing sizes or timeframes can give different labels, so each should state the rule they used and accept uncertainty.' },
        { id: 'b', text: 'One of them must have made an arithmetic mistake; a chart has exactly one correct structure.' },
        { id: 'c', text: 'The learner who sees the uptrend is right, because uptrends are more common.' },
        { id: 'd', text: 'Structure is useless and should never be studied.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Which wiggles count as swings is a choice. Small swings and large swings can describe different structures on the same data. Stating the rule makes notes comparable.',
      misconceptionFeedback: {
        b: 'Both can be arithmetically correct. They chose different swings to compare.',
        c: 'How common something is does not decide what this chart shows.',
        d: 'Structure is a useful description. Its limit is that it is partly a judgement, not that it is useless.',
      },
      learningOutcome: 'Explain the boundaries of subjective trend identification.',
      remediationRef: { lessonId: 'T16', anchorId: 'T16-N04' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Comparing a peak with a dip.', correction: 'Compare peaks with peaks (HH or LH) and dips with dips (HL or LL).' },
    { mistake: 'Calling a trend from one higher high or one lower low.', correction: 'Look at several swings in a row before describing the structure.' },
    { mistake: 'Treating an uptrend or downtrend as a promise about the next move.', correction: 'Structure summarises past swings; it can turn sideways or reverse at any time.' },
  ],
  takeaways: [
    'Compare each peak with the previous peak and each dip with the previous dip to get HH, LH, HL or LL.',
    'HH + HL = uptrend; LH + LL = downtrend; mixed swings inside a band = sideways.',
    'Structure describes the past, can change at any swing, and is partly a judgement.',
  ],
  reviewCard: {
    keyTermIds: ['market-structure', 'higher-high', 'lower-low'],
    safetyNote: 'A trend is a description of past swings, not a forecast and not a reason to trade by itself. Waiting is always allowed.',
    reviewMinutes: 3,
    retrievalQuestion: 'Fictional swing highs go 20.0 → 21.5 → 21.0. What label does 21.0 get, and what might it hint at?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T16-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
