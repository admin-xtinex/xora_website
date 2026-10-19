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
    'Learner can mark support and resistance as price zones (bands), using several past touches rather than one exact line.',
    'Learner can describe a breakout, a retest and a fakeout, and explain why they can only be told apart after more candles.',
    'Learner can write confirmation rules in advance, recognise that WAIT is acceptable while a move is unconfirmed, and name the limits of historical levels and thin liquidity.',
  ],
  glossaryEntries,
  notesComplexity: 'simple',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T17-S01', kind: 'cover-problem', title: 'Why does price keep turning here?',
      narrationText: 'On many charts price seems to stop and turn around the same area again and again. Traders call these areas support and resistance. This lesson shows how to mark them honestly, and what they cannot promise.',
      blocks: [
        { kind: 'paragraph', text: 'Price often turns near the **same area** again and again.' },
        { kind: 'paragraph', text: 'Below price, that area is a [[support-zone|support zone]]. Above price, a [[resistance-zone|resistance zone]]. Both describe the past only.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T17-A01' },
      glossaryRefs: ['support-zone', 'resistance-zone'],
      speakerNotes: 'Link to T16: support zones are built from clustered swing lows, resistance zones from clustered swing highs.',
    },
    {
      id: 'T17-S02', kind: 'key-definition', title: 'Zones, not lines',
      narrationText: 'Past lows at 99.70, 99.60 and 99.80 are not the same number. So we mark a band from about 99.60 to 100.00, not one exact line. Each visit to the band is a test.',
      blocks: [
        { kind: 'paragraph', text: 'Fictional lows: 99.70, 99.60, 99.80. They differ, so mark a **band**: about 99.60–100.00.' },
        { kind: 'paragraph', text: 'Each visit is a test. A later return is a [[retest]].' },
        { kind: 'definition', termId: 'support-zone' },
      ],
      glossaryRefs: ['support-zone', 'retest'],
    },
    {
      id: 'T17-S03', kind: 'visual-breakdown', title: 'Breakout or fakeout?',
      narrationText: 'From the same past, price can break through resistance and stay above it, a breakout, or poke through and fall back inside, a fakeout. At the moment it pokes through, both look the same.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          '[[breakout|Breakout]]: closes beyond the zone and stays beyond it.',
          '[[fakeout|Fakeout]]: pokes through, then returns inside.',
        ] },
        { kind: 'callout', callout: 'tip', text: 'At the first poke, both look identical. Only later candles tell them apart.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T17-A05' },
      glossaryRefs: ['breakout', 'fakeout'],
    },
    {
      id: 'T17-S04', kind: 'worked-example', title: 'Writing a confirmation rule (fictional)',
      narrationText: 'Before looking at what happens next, we write a rule. Resistance zone 102.00 to 102.40. Confirmation means two 1-minute closes above 102.40, then a retest that stays above 102.40. Branch A meets it. Branch B does not.',
      blocks: [
        {
          kind: 'worked-example', title: 'Zone 102.00–102.40 USDT', fictional: true,
          steps: [
            { text: 'Rule: 2 closes above 102.40 + retest stays above 102.40' },
            { text: 'A: 102.70, 103.10, retest low 102.50', result: 'confirmed' },
            { text: 'B: 102.70, then back to 102.30', result: 'not confirmed' },
          ],
          conclusion: 'B re-entered the zone: a fakeout.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T17-A03' },
      glossaryRefs: ['confirmation', 'retest'],
    },
    {
      id: 'T17-S05', kind: 'risks-misunderstanding', title: 'What zones cannot promise',
      narrationText: 'A zone that held four times can fail on the fifth. In a thin market, one large order can push price through a zone and back, drawing a pattern that means very little.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Held before ≠ will hold', text: 'Past turns give **no certainty** about the next visit.' },
        { kind: 'callout', callout: 'safety', text: 'Thin [[liquidity]] can distort patterns: one big order can fake a break. Waiting is always allowed.' },
      ],
      glossaryRefs: ['liquidity', 'fakeout'],
    },
    {
      id: 'T17-S06', kind: 'guided-practice', title: 'Your turn',
      narrationText: 'Place a zone on the fictional chart where price turned three times. Then choose which observations would count as confirmation. You are not predicting the outcome, and waiting is an acceptable answer.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Slide the zone over the three turns.', 'Pick the observations that would count as confirmation.', 'Sort example moves into breakout, fakeout or not yet clear.'] },
        { kind: 'callout', callout: 'tip', text: 'You choose evidence, not a prediction. WAIT is acceptable.' },
      ],
      glossaryRefs: ['confirmation'],
    },
    {
      id: 'T17-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Mark zones, not lines. A breakout closes beyond the zone and stays there; a fakeout comes back inside. Decide confirmation before you look. Zones describe the past and can fail, and thin markets distort them.',
      blocks: [
        { kind: 'list', ordered: false, items: [
          'Support and resistance are zones built from past turns.',
          'Breakout stays beyond; fakeout comes back inside.',
          'Write confirmation rules first; WAIT while unconfirmed.',
          'No certainty from history; thin liquidity distorts.',
        ] },
      ],
      glossaryRefs: ['breakout', 'confirmation'],
    },
  ],

  notesSections: [
    {
      id: 'T17-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'A [[support-zone|support zone]] is a price area below current price where falling prices stopped and turned up several times. A [[resistance-zone|resistance zone]] is an area above price where rising prices stopped and turned down. They are **zones**, not exact lines, because the turns never happen at exactly the same price. Each visit to a zone is a test; a later return is a [[retest]].' },
        { kind: 'paragraph', text: 'A [[breakout]] is a move that closes beyond a zone and stays beyond it. A [[fakeout]] (false breakout) pokes through and then comes back inside. [[confirmation|Confirmation]] is the evidence you decide on in advance before treating a move as real.' },
        { kind: 'analogy', text: 'Think of a crowded doorway. People often bunch up there, but sometimes the crowd pushes through, and sometimes a few step out and come straight back in.' },
      ],
    },
    {
      id: 'T17-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Zones help you describe where a chart has reacted before, so you can plan what you would want to see instead of reacting to every candle. Many beginners lose money buying the first poke above resistance that turns out to be a fakeout. Writing confirmation rules first, and accepting WAIT when they are not met, keeps decisions calmer and honest.' },
      ],
    },
    {
      id: 'T17-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: marking a support zone (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Three swing lows: 99.70, 99.60 and 99.80 USDT.' },
            { text: 'Lowest touch 99.60; highest touch 99.80; add a little room above', result: 'zone ≈ 99.60–100.00' },
            { text: 'Zone width = 100.00 − 99.60', result: '0.40 USDT' },
          ],
          conclusion: 'A 0.40 USDT band covers all three turns. A single line at 99.70 would miss two of them.',
        },
        {
          kind: 'worked-example', title: 'Example 2: one past, two futures (fictional)', fictional: true,
          steps: [
            { text: 'Resistance zone 102.00–102.40. Rule: 2 closes above 102.40 + retest stays above 102.40.' },
            { text: 'Branch A: closes 102.70, 103.10; pulls back to 102.50; rises to 103.80', result: 'rule met: breakout so far' },
            { text: 'Branch B: 102.70, pokes to 102.90, back to 102.30, falls to 100.70', result: 'rule not met: fakeout' },
          ],
          conclusion: 'At 102.70 both branches looked the same. The difference appeared only later.',
        },
      ],
    },
    {
      id: 'T17-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          'On one [[timeframe]], find swing lows (or highs) that cluster at a similar price.',
          'Draw a band from the lowest to the highest of those turns. If it becomes very wide, it is probably not one zone.',
          'Before price reaches the zone again, write what would count as confirmation, for example a close beyond the zone (not just a [[wick]]), a second close beyond it, or a retest that holds.',
          'When price moves, check the observations. If they are not all there yet, the honest label is “not confirmed”: WAIT.',
          'Note the conditions: in a very quiet, thin market, with few orders and a wide [[spread]], pokes through a zone mean less.',
        ] },
      ],
    },
    {
      id: 'T17-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Drawing one exact line', text: 'Turns happen at slightly different prices. Use a band.' },
        { kind: 'callout', callout: 'mistake', title: 'Calling a breakout on a wick', text: 'A wick above the zone that closes back inside is not a close beyond it.' },
        { kind: 'callout', callout: 'mistake', title: 'Deciding the rule after seeing the move', text: 'Rules written afterwards always “work”. Write them first.' },
      ],
    },
    {
      id: 'T17-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'Historical zones give no certainty. A zone that held many times can fail on the next visit, and a confirmed breakout can still reverse. Thin [[liquidity]] can distort patterns: one large order can push price through a zone and back. None of this is advice. Waiting or not trading is always a valid choice.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T17-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Zones and moves', headers: ['Term', 'What you see'], rows: [
          ['Support zone', 'band of past swing lows'],
          ['Resistance zone', 'band of past swing highs'],
          ['Retest', 'price returns to a zone'],
          ['Breakout', 'closes beyond the zone and stays'],
          ['Fakeout', 'pokes through, comes back inside'],
          ['Confirmation', 'evidence you chose in advance'],
        ] },
      ],
    },
    {
      id: 'T17-N08', heading: 'learn-more', title: 'Learn more: role reversal and round numbers', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'After a breakout above resistance, some traders watch whether the old resistance zone now acts as support on the retest. This “role reversal” is a description some people find useful, not a rule. Zones also often appear near round numbers such as 100.00, simply because many people place orders there. Later lessons add volume and range as extra context; none of them turns a zone into a certainty.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T17-A01', type: 'support-resistance-zone', durationMs: 30_000,
      parameters: { points: [101.2, 100.4, 99.8, 100.6, 101.3, 100.5, 99.7, 100.4, 101.1, 100.2, 99.9, 100.8, 101.4], zone: { low: 99.6, high: 100.0, kind: 'support' } },
      caption: 'Price falls into the 99.60–100.00 support zone and turns up: 99.80, then 99.70, then 99.90. The visit counter climbs to 3.',
      narration: 'Each time price dips into the band, buyers appeared in the past and price turned up. The counter shows the number of visits.',
      reducedMotionDescription: 'A fictional price line drops into a shaded support zone from 99.60 to 100.00 three times, at 99.80, 99.70 and 99.90, and rises each time to around 101.10 to 101.40. Visits: 3.',
      glossaryRefs: ['support-zone'],
    },
    {
      id: 'T17-A02', type: 'support-resistance-zone', durationMs: 30_000,
      parameters: { points: [100.6, 101.4, 102.1, 101.5, 100.9, 101.6, 102.3, 101.7, 101.0, 101.8, 102.2, 101.6], zone: { low: 102.0, high: 102.4, kind: 'resistance' } },
      caption: 'Above price, rallies stall in the 102.00–102.40 resistance zone: 102.10, 102.30, 102.20. The visit counter reaches 3.',
      narration: 'The same idea upside down. Each rally reaches the band and turns down. Notice the turns are at different prices inside the band.',
      reducedMotionDescription: 'A fictional price line rises into a shaded resistance zone from 102.00 to 102.40 three times, at 102.10, 102.30 and 102.20, and falls back each time. Visits: 3.',
      glossaryRefs: ['resistance-zone', 'retest'],
    },
    {
      id: 'T17-A03', type: 'breakout-fakeout', durationMs: 30_000, fixtureId: 'FX-T17-BRANCH-01',
      parameters: { branchId: 'continue' },
      caption: 'Branch A: after the third test, price closes above 102.40 at 102.70 and 103.10, pulls back to 102.50 (a retest that holds), then climbs to 103.80.',
      narration: 'This is what a breakout that met our rule looks like: closes beyond the zone, and a retest that stays outside it.',
      reducedMotionDescription: 'Same fictional past under the 102.40 line. Branch A: 102.70, 103.10, 102.60, 102.50, 102.90, 103.40, 103.80. Two closes above 102.40 and a retest low of 102.50 that holds: breakout so far.',
      glossaryRefs: ['breakout', 'retest', 'confirmation'],
    },
    {
      id: 'T17-A04', type: 'breakout-fakeout', durationMs: 30_000, fixtureId: 'FX-T17-BRANCH-01',
      parameters: { branchId: 'fakeout' },
      caption: 'Branch B: from the same past, price pokes to 102.70 and 102.90, falls back to 102.30 inside the zone, then slides to 100.70: a fakeout.',
      narration: 'The start looks exactly like branch A. Then price re-enters the zone and keeps falling. The rule was never met.',
      reducedMotionDescription: 'Same fictional past. Branch B: 102.70, 102.90, 102.30, 101.80, 101.40, 101.00, 100.70. Price returns inside the zone at 102.30 and falls to 100.70: a fakeout.',
      glossaryRefs: ['fakeout'],
    },
    {
      id: 'T17-A05', type: 'breakout-fakeout', durationMs: 30_000, fixtureId: 'FX-T17-BRANCH-01',
      parameters: {},
      caption: 'Both futures drawn from the same NOW point: A ends at 103.80, B at 100.70. Both start at 102.70, so the first poke could not tell them apart.',
      narration: 'Side by side, the lesson is clear: the first move above the zone was identical. Only later candles separated them.',
      reducedMotionDescription: 'One fictional past and two branches starting at 102.70. Branch A (breakout and retest holds) ends at 103.80. Branch B (fakeout, back inside) ends at 100.70.',
      glossaryRefs: ['breakout', 'fakeout'],
    },
    {
      id: 'T17-A06', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'checklist', heading: 'What could count as confirmation', items: [
        'Written before the move, not after.',
        'A close beyond the zone, not only a wick.',
        'A second close beyond the zone.',
        'A retest that holds outside the zone.',
        'Not met yet? Label it “not confirmed” and WAIT.',
      ] },
      caption: 'Five checklist lines appear in turn, building a confirmation rule that ends with WAIT when it is not met.',
      reducedMotionDescription: 'Checklist: write the rule before the move; a close beyond the zone, not only a wick; a second close beyond it; a retest that holds outside the zone; if not met, label it not confirmed and wait.',
      glossaryRefs: ['confirmation', 'wick'],
    },
    {
      id: 'T17-A07', type: 'text-card', durationMs: 25_000,
      parameters: { variant: 'red-flags', heading: 'Thin liquidity distorts patterns', items: [
        'Few orders in the book: one large order moves price far.',
        'Wide spread: wicks jump through zones and back.',
        'Quiet hours: pokes through a zone mean less.',
      ] },
      caption: 'Three red flags appear one by one, showing how a thin market can draw fake breaks.',
      reducedMotionDescription: 'Red flags: with few orders in the book, one large order moves price far; a wide spread lets wicks jump through zones and back; in quiet hours, pokes through a zone mean less.',
      glossaryRefs: ['liquidity', 'spread', 'order-book'],
    },
    {
      id: 'T17-A08', type: 'text-card', durationMs: 20_000,
      parameters: { variant: 'risk-warning', heading: 'History gives no certainty', items: [
        'A zone that held before can fail next time.',
        'A confirmed breakout can still reverse.',
        'This is education, not advice.',
        'Waiting is always allowed.',
      ] },
      caption: 'Safety: four warnings build up: past zones can fail, confirmation can be wrong, this is not advice, and waiting is allowed.',
      reducedMotionDescription: 'Warning card: a zone that held before can fail next time; a confirmed breakout can still reverse; this is education, not advice; waiting is always allowed.',
    },
  ],

  exercises: [
    {
      id: 'T17-X01', type: 'zone-placement', title: 'Place the support zone, then choose your evidence',
      fixtureId: 'FX-T17-ZONE-01',
      instructions: 'The fictional chart dips three times (T1, T2, T3). Move the zone bottom and top so the band covers those turns. Then imagine price comes back down to your zone later. Choose every observation that would COUNT as confirmation that the zone held. You are not predicting what will happen.',
      steps: [
        { id: 'T17-X01-01', prompt: 'Move the sliders so the zone covers the lows of T1, T2 and T3, then press “Check my zone”.', hint: 'The three lows are 99.70, 99.60 and 99.80. A band of about 99.60–100.00 covers them.' },
        { id: 'T17-X01-02', prompt: 'Choose every observation that would count as confirmation, including what you do if it is missing.', hint: 'Look for closes, not touches or feelings. Waiting is acceptable.' },
        { id: 'T17-X01-03', prompt: 'Press Check and read the feedback for any option you got wrong.', hint: 'There are three acceptable options.' },
      ],
      allowedControls: ['slider', 'numeric-input', 'choice', 'reset', 'hint'],
      choices: [
        { id: 'close-above', text: 'A candle dips into the zone and then closes back above 100.00 (not inside or below it).' },
        { id: 'second-close', text: 'The next candle also closes above the zone without trading below 99.60.' },
        { id: 'wait', text: 'If those have not happened yet, I label the zone “not confirmed” and wait.', decision: 'WAIT' },
        { id: 'touch', text: 'Price touches the zone once; that alone confirms it.' },
        { id: 'feeling', text: 'It bounced three times before, so I am sure it bounces again.' },
        { id: 'thin-wick', text: 'One long wick below 99.60 during a very thin, quiet market, closing anywhere.' },
      ],
      parameters: {
        zone: { min: 98.5, max: 102.5, step: 0.1, low: 101.0, high: 101.4 },
        reference: { low: 99.6, high: 100.0 },
        question: 'Which observations would count as confirmation that the zone held? Choose all that apply.',
        feedback: {
          touch: 'A touch is a test, not a result. Price can touch and keep falling.',
          feeling: 'Three past bounces give no certainty about the fourth. A feeling is not an observation.',
          'thin-wick': 'In a thin market one order can push a wick through a zone and back. It tells you little, and it is not a close back above the zone.',
        },
      },
      expectedEvaluation: { kind: 'choice-set', choiceIds: ['close-above', 'second-close', 'wait'] },
      explanation: 'Good confirmation is an observable close (and follow-through) that you chose in advance. Until it appears, the honest label is “not confirmed”, and waiting is a valid choice. Even confirmed zones can fail later.',
      fictionalDataLabel: 'Fictional DEMO/USDT chart for practice only.',
    },
    {
      id: 'T17-X02', type: 'classify', title: 'Breakout, fakeout or not yet clear?',
      fixtureId: 'FX-T17-BRANCH-01',
      instructions: 'Resistance zone 102.00–102.40 (fictional). Your written rule: two closes above 102.40 and a retest that stays above 102.40. Sort each description using only that rule.',
      steps: [
        { id: 'T17-X02-01', prompt: 'For each description, check: did price close above 102.40 twice, and did a retest hold above 102.40?', hint: 'A wick above the zone is not a close above it.' },
        { id: 'T17-X02-02', prompt: 'Choose a group for all five, then press Check.', hint: 'If the rule is not finished yet, the honest answer is “not yet clear”.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'retest-holds', text: 'Closes at 102.70 and 103.10, then a pull-back to 102.50 turns up.' },
          { id: 'wick-back', text: 'A wick reaches 102.90 but the candle closes at 102.30, then price falls to 101.80.' },
          { id: 'one-close', text: 'One candle has just closed at 102.70. Nothing has happened after it yet.' },
          { id: 'reenter', text: 'Closes at 102.70 and 102.90, then three candles close back below 102.00.' },
          { id: 'thin-spike', text: 'In a very quiet market one large order spikes price to 103.00 for seconds; the candle closes at 102.10.' },
        ],
        buckets: [
          { id: 'breakout', label: 'Breakout (rule met so far)' },
          { id: 'fakeout', label: 'Fakeout (back inside)' },
          { id: 'unclear', label: 'Not yet clear: wait' },
        ],
        itemFeedback: {
          'retest-holds': 'Two closes above 102.40 and a retest low (102.50) that stayed above it: the rule is met, so far.',
          'wick-back': 'The close (102.30) is inside the zone. Only the wick went above. That is a fakeout.',
          'one-close': 'Only one close so far and no retest. The rule is not finished: not yet clear, wait.',
          reenter: 'Two closes above, but no retest held; price closed back below the zone. That is a fakeout.',
          'thin-spike': 'A spike from one order in a thin market that closes back inside the zone is a fakeout, and a reminder that thin liquidity distorts patterns.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { breakout: ['retest-holds'], fakeout: ['wick-back', 'reenter', 'thin-spike'], unclear: ['one-close'] } },
      explanation: 'Breakouts and fakeouts look the same at first. A rule written in advance turns the decision into observation, and “not yet clear” is a valid result. A breakout that met the rule can still reverse later.',
      fictionalDataLabel: 'Fictional DEMO/USDT descriptions for practice only.',
    },
    {
      id: 'T17-X03', type: 'choice-feedback', title: 'The first close above resistance',
      fixtureId: 'FX-T17-BREAK-01',
      instructions: 'On the fictional chart, highs R1, R2 and R3 turned inside the 102.00–102.40 resistance zone. The newest candle N has just closed at 102.70, above the zone, for the first time. Your rule needs two closes above 102.40 and a retest that holds. What goes in your DEMO practice plan right now?',
      steps: [
        { id: 'T17-X03-01', prompt: 'Count how many parts of your confirmation rule have appeared so far.', hint: 'One close above 102.40. No second close, no retest yet.' },
        { id: 'T17-X03-02', prompt: 'Choose the plan that matches what you have actually observed, then press Check.', hint: 'An unfinished rule means the move is not confirmed.' },
      ],
      allowedControls: ['choice', 'reset', 'hint'],
      choices: [
        { id: 'wait', text: 'Not confirmed yet: wait and watch for a second close and a retest.', decision: 'WAIT' },
        { id: 'buy-now', text: 'It broke out, so the rise is certain: buy now.', decision: 'BUY' },
        { id: 'sell-now', text: 'Every first break is a fakeout, so sell now.', decision: 'SELL' },
      ],
      parameters: {
        showChart: true,
        feedback: {
          'buy-now': 'Only one part of your rule has appeared. At this point a breakout and a fakeout look identical, and nothing is certain.',
          'sell-now': 'Not every first break fails. Assuming a fakeout is the same mistake as assuming a breakout.',
        },
      },
      expectedEvaluation: { kind: 'exact-choice', choiceId: 'wait' },
      explanation: 'One close above the zone meets one part of the rule. The honest label is “not confirmed”, and waiting is a complete, valid decision. Even after full confirmation, the move could still fail.',
      fictionalDataLabel: 'Fictional DEMO/USDT chart; DEMO decisions only, no real orders.',
    },
  ],

  quizQuestions: [
    {
      id: 'T17-Q01', type: 'single', cognitiveTag: 'interpretation', linkedLessonId: 'T17',
      prompt: 'Fictional swing lows were 49.70, 49.85 and 49.62 USDT. What is the best way to mark support?',
      choices: [
        { id: 'a', text: 'A zone of about 49.60–49.90 that covers all three turns.' },
        { id: 'b', text: 'One exact line at 49.70.' },
        { id: 'c', text: 'One exact line at the average, 49.72, which is where price will turn next.' },
        { id: 'd', text: 'No support at all, because the lows are not identical.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Turns happen at slightly different prices, so a band covering 49.62 to 49.85 describes them honestly.',
      misconceptionFeedback: {
        b: 'A single line at 49.70 misses the turns at 49.85 and 49.62.',
        c: 'An average is still one line, and no line predicts where price will turn next.',
        d: 'Turns rarely match exactly. That is why we use zones, not lines.',
      },
      learningOutcome: 'Mark support as a zone that covers several turns.',
      remediationRef: { lessonId: 'T17', anchorId: 'T17-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T17-Q02', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T17',
      prompt: 'Resistance zone 102.00–102.40 (fictional). A candle’s wick reaches 102.90, but it closes at 102.30, and the next candles fall to 101.50. What is this best called?',
      choices: [
        { id: 'a', text: 'A fakeout: price poked above the zone and came back inside.' },
        { id: 'b', text: 'A confirmed breakout, because the wick went above 102.40.' },
        { id: 'c', text: 'A retest that held above the zone.' },
        { id: 'd', text: 'Proof that the zone can never be broken.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Only the wick went above the zone; the close (102.30) and the following candles were back inside and below it.',
      misconceptionFeedback: {
        b: 'A wick is not a close. The candle closed inside the zone.',
        c: 'A held retest would stay above 102.40. Price fell back inside and below.',
        d: 'One failed break says nothing about the future. The zone can still break next time.',
      },
      learningOutcome: 'Recognise a fakeout from closes, not wicks.',
      remediationRef: { lessonId: 'T17', anchorId: 'T17-N05' },
      shuffleChoices: true,
    },
    {
      id: 'T17-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T17', safetyCritical: true, safetyTopic: 'not-advice',
      prompt: 'A learner says: “This support zone has held four times. It will definitely hold again, so I will open a large long right at the zone.” What is the best response?',
      choices: [
        { id: 'a', text: 'Past touches give no certainty. The zone can fail on the next visit; waiting for pre-written confirmation, or not trading, is always allowed.' },
        { id: 'b', text: 'Agree: four touches make the zone guaranteed.' },
        { id: 'c', text: 'Agree, as long as the market is very quiet and thin.' },
        { id: 'd', text: 'Disagree: zones that held four times always break on the fifth, so short instead.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'A zone is a description of past turns. It never guarantees the next one, so it is not, on its own, a reason to trade.',
      misconceptionFeedback: {
        b: '“Definitely” and “guaranteed” are red flags. Zones fail without warning.',
        c: 'A thin market makes patterns less reliable, not more: one order can push price straight through.',
        d: 'This replaces one false certainty with another. No count of touches predicts the next visit.',
      },
      learningOutcome: 'Recognise that historical zones give no certainty and are not trade signals by themselves.',
      remediationRef: { lessonId: 'T17', anchorId: 'T17-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T17-Q04', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T17',
      prompt: 'Late at night, with very few orders in the fictional book, one large buy order spikes price through resistance and back within seconds. How should you treat that spike?',
      choices: [
        { id: 'a', text: 'With caution: thin liquidity can distort patterns, so this spike is weak evidence and does not meet a confirmation rule.' },
        { id: 'b', text: 'As a strong breakout, because the price did go above resistance.' },
        { id: 'c', text: 'As proof the resistance zone is now permanent.' },
        { id: 'd', text: 'As a reason to remove the zone from the chart forever.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'In a thin market a single order can move price far and fast, drawing wicks through zones that mean little. It is not a close beyond the zone with follow-through.',
      misconceptionFeedback: {
        b: 'A spike that returns within seconds is not a close beyond the zone and is easily caused by one order in a thin market.',
        c: 'No zone is permanent. One spike proves nothing either way.',
        d: 'One distorted spike is not a reason to discard what the chart did before; it is a reason for caution.',
      },
      learningOutcome: 'Explain how thin liquidity can distort support and resistance patterns.',
      remediationRef: { lessonId: 'T17', anchorId: 'T17-N04' },
      shuffleChoices: true,
    },
    {
      id: 'T17-Q05', type: 'multi', cognitiveTag: 'application', linkedLessonId: 'T17',
      prompt: 'Before price reaches a fictional resistance zone at 102.00–102.40, which observations could you write down as breakout confirmation? Choose all that apply.',
      choices: [
        { id: 'a', text: 'A candle closes above 102.40 (not only a wick).' },
        { id: 'b', text: 'A second candle also closes above 102.40.' },
        { id: 'c', text: 'A retest pulls back toward the zone and stays above 102.40.' },
        { id: 'd', text: 'A wick touches 102.50 and the candle closes at 102.20.' },
        { id: 'e', text: 'Someone online says the breakout is guaranteed.' },
      ],
      answer: { kind: 'choices', choiceIds: ['a', 'b', 'c'] },
      rationale: 'Confirmation is made of observable closes and retest behaviour chosen in advance. Even then, the move can still fail.',
      misconceptionFeedback: {
        d: 'The close (102.20) is inside the zone. A wick above is not a close above.',
        e: 'An opinion is not an observation, and nothing in markets is guaranteed.',
      },
      learningOutcome: 'Choose observable confirmation criteria before a move happens.',
      remediationRef: { lessonId: 'T17', anchorId: 'T17-N04' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Drawing support or resistance as one exact line.', correction: 'Mark a zone (band) that covers the cluster of past turns.' },
    { mistake: 'Calling a breakout because a wick went through the zone.', correction: 'Look for closes beyond the zone and follow-through, as written in your rule.' },
    { mistake: 'Believing a zone that held before must hold again.', correction: 'Historical zones give no certainty; thin liquidity can distort them. WAIT is always allowed.' },
  ],
  takeaways: [
    'Support and resistance are zones built from clusters of past turns, not exact lines.',
    'A breakout closes beyond the zone and stays; a fakeout pokes through and comes back inside; both look the same at first.',
    'Write confirmation rules before the move and WAIT while they are unmet; history gives no certainty and thin liquidity distorts patterns.',
  ],
  reviewCard: {
    keyTermIds: ['support-zone', 'fakeout', 'confirmation'],
    safetyNote: 'Support and resistance describe the past. They can fail at any visit, thin markets distort them, and waiting is always allowed.',
    reviewMinutes: 3,
    retrievalQuestion: 'A fictional candle’s wick goes above a 102.00–102.40 resistance zone but closes at 102.30. Breakout, fakeout or not yet clear, and why?',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T17-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
