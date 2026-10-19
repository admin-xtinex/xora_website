import { SCHEMA_VERSION, type Lesson } from '@futures-edge/contracts';
import { meta } from './meta';
import { glossaryEntries } from './glossary';
import { fixtures } from './fixtures';

export { fixtures };

const FICTIONAL = 'All prices and volumes in this lesson are fictional DEMO/USDT examples made for teaching. They are not real market data, and the branching futures are an educational simulation, not predictions.';

const lesson: Lesson = {
  schemaVersion: SCHEMA_VERSION,
  ...meta,
  objectives: [
    'Learner can explain what a confirmation can establish (what already happened) and what it cannot (what happens next).',
    'Learner can recognise weak and conflicting evidence, a false breakout, fading momentum, chasing and a choppy range on a fictional chart, and compute relative volume.',
    'Learner can justify a DEMO WAIT or NO_TRADE decision from limited candles without using hindsight.',
  ],
  glossaryEntries,
  notesComplexity: 'complex-risk',
  fictionalDataNotice: FICTIONAL,

  slides: [
    {
      id: 'T21-S01', kind: 'cover-problem', title: 'The same past, different futures',
      narrationText: 'Here is a fictional chart that has just closed above resistance. From this exact moment, price could continue up, fall back, or chop sideways. Nothing on the chart tells you which. This lesson is about deciding well when you cannot know.',
      blocks: [
        { kind: 'paragraph', text: 'Price just closed above a level. From **the same past**, three futures are possible.' },
        { kind: 'paragraph', text: 'A [[confirmation]] reduces doubt. It never removes it.' },
      ],
      visualRef: { kind: 'scene', sceneId: 'T21-A01' },
      glossaryRefs: ['confirmation', 'breakout'],
      speakerNotes: 'Stress that the branches are a simulation. Avoid any wording that suggests the learner should be able to know which branch happens.',
    },
    {
      id: 'T21-S02', kind: 'key-definition', title: 'Can and cannot',
      narrationText: 'A confirmation can establish facts about the past: price closed above the level, volume was higher or lower than usual. It cannot establish that the move will continue, or that this trade will win.',
      blocks: [
        { kind: 'comparison',
          left: { title: 'Confirmation can show', points: ['A candle closed beyond the level', 'Volume was above or below normal', 'The level held or failed before'] },
          right: { title: 'It cannot show', points: ['That the move will continue', 'That this trade will win', 'That it is not a fakeout'] } },
      ],
      glossaryRefs: ['confirmation', 'false-signal'],
    },
    {
      id: 'T21-S03', kind: 'visual-breakdown', title: 'Warning signs',
      narrationText: 'Four patterns weaken a signal. A false breakout: a close beyond the level that soon falls back. Momentum fade: each candle smaller than the last. Low relative volume: the breakout is quieter than usual. A choppy range: price crosses the middle again and again.',
      blocks: [
        { kind: 'list', ordered: false, items: ['False breakout: back inside the range soon after.', 'Momentum fade: candles shrink after the push.', 'Low [[relative-volume]]: below 1.', 'A [[choppy-range]]: signals keep failing.'] },
      ],
      visualRef: { kind: 'scene', sceneId: 'T21-A03' },
      glossaryRefs: ['relative-volume', 'choppy-range', 'fakeout'],
    },
    {
      id: 'T21-S04', kind: 'worked-example', title: 'Relative volume and chasing',
      narrationText: 'The breakout candle traded 900 against an average of 1,200, a relative volume of 0.75: quieter than normal. Then chasing: planned entry 100.70 had a ratio of 3. Entering late at 101.50 with the same stop and target leaves a ratio of about 0.33.',
      blocks: [
        {
          kind: 'worked-example', title: 'Fictional breakout candle', fictional: true,
          steps: [
            { text: 'Relative volume = 900 ÷ 1,200', result: '0.75' },
            { text: '[[chasing|Chased]] entry 101.50, stop 100.30, target 101.90', result: 'ratio ≈ 0.33' },
          ],
          conclusion: 'Planned entry 100.70 with the same lines: ratio 3.',
        },
      ],
      visualRef: { kind: 'scene', sceneId: 'T21-A04' },
      glossaryRefs: ['relative-volume', 'chasing', 'risk-reward-ratio'],
    },
    {
      id: 'T21-S05', kind: 'risks-misunderstanding', title: 'Hindsight is not skill',
      narrationText: 'After the fact, every false signal looks obvious. That is hindsight bias. Judge a decision by what was visible when it was made: the evidence, the invalidation point and the size, not by the result.',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Hindsight bias', text: 'Afterwards the answer looks obvious. At decision time it was not.' },
        { kind: 'callout', callout: 'safety', text: 'Weak or conflicting evidence → DEMO WAIT or [[no-trade|NO_TRADE]]. Always allowed.' },
      ],
      glossaryRefs: ['no-trade', 'false-signal'],
    },
    {
      id: 'T21-S06', kind: 'guided-practice', title: 'Decide with limited candles',
      narrationText: 'In the exercise you see eight candles, then reveal one at a time up to ten. Decide DEMO BUY, SELL, WAIT or NO_TRADE and explain why. The remaining candles appear only after you decide, and they show just one possible outcome.',
      blocks: [
        { kind: 'list', ordered: true, items: ['Reveal candles 9 and 10 one at a time.', 'Check close, wick, relative volume, follow-through.', 'Choose and explain your DEMO decision.'] },
        { kind: 'callout', callout: 'tip', text: 'You are scored on reasoning. The revealed outcome is one possibility only.' },
      ],
      glossaryRefs: ['relative-volume'],
    },
    {
      id: 'T21-S07', kind: 'recap', title: 'Recap',
      narrationText: 'Confirmations describe the past. Weak or conflicting evidence means waiting or no trade. Watch for false breakouts, fading momentum, low relative volume, chasing and chop. Judge decisions by process, not outcome.',
      blocks: [
        { kind: 'list', ordered: false, items: ['Confirmation reduces doubt; it never proves the future.', 'Weak or conflicting evidence → WAIT or NO_TRADE.', 'Chasing worsens the ratio.', 'Judge the process, not the outcome.'] },
      ],
      glossaryRefs: ['confirmation', 'no-trade', 'chasing'],
    },
  ],

  notesSections: [
    {
      id: 'T21-N01', heading: 'meaning', title: 'Meaning',
      blocks: [
        { kind: 'paragraph', text: 'A [[confirmation]] is extra evidence that supports a setup, such as a candle closing beyond a level or volume rising on a [[breakout]]. It can establish **facts about the past**: where price closed, how much traded, whether a level held before. It cannot establish what happens next. A [[false-signal]] is evidence that looked like confirmation but was followed by a move against the idea. You only know it was false afterwards.' },
        { kind: 'paragraph', text: '**Weak evidence** points one way but only a little (for example a breakout on low [[relative-volume]]). **Conflicting evidence** points both ways at once (a close above resistance, but a long upper wick and a lower high on the higher timeframe). Both are reasons for a [[wait-decision|WAIT decision]] or [[no-trade|NO_TRADE]].' },
        { kind: 'analogy', text: 'A weather forecast that says 70% chance of rain is useful, but it does not promise rain. If you carry an umbrella and it stays dry, your decision was still reasonable. Trading evidence works the same way: it changes the odds, never the certainty.' },
      ],
    },
    {
      id: 'T21-N02', heading: 'why-it-matters', title: 'Why it matters',
      blocks: [
        { kind: 'paragraph', text: 'Beginners often look for one perfect confirmation that makes a trade safe. It does not exist. When a confirmed breakout fails, they blame themselves, or they decide confirmations are useless; both reactions come from expecting certainty. A second trap is **hindsight bias**: after the outcome is known, the right answer looks obvious, so learners judge their past decisions by results instead of by the evidence they had. That leads to copying lucky decisions and abandoning good ones. Knowing the common failure patterns ([[fakeout|false breakout]], momentum fade, [[chasing]], [[choppy-range|choppy ranges]]) helps you recognise when the evidence is too weak to act on.' },
      ],
    },
    {
      id: 'T21-N03', heading: 'example', title: 'Example',
      blocks: [
        {
          kind: 'worked-example', title: 'Example 1: a breakout with weak evidence (fictional DEMO/USDT)', fictional: true,
          steps: [
            { text: 'Candles 1–8 trade between 99.40 and 100.60, average volume 1,200 per candle.' },
            { text: 'Candle 9 closes at 100.90, above the 100.60 resistance. Its high is 101.30.', result: 'upper wick 0.40' },
            { text: 'Candle 9 volume 900. Relative volume = 900 ÷ 1,200', result: '0.75 (quieter than usual)' },
            { text: 'Candle 10 closes 100.75 on volume 700. Relative volume = 700 ÷ 1,200', result: '≈ 0.58 (momentum fading)' },
          ],
          conclusion: 'A close above the level is real, but low relative volume, a long upper wick and a weaker next candle conflict with it. Reasoned decision: DEMO WAIT (for a retest that holds) or NO_TRADE.',
        },
        {
          kind: 'worked-example', title: 'Example 2: the cost of chasing (fictional)', fictional: true,
          steps: [
            { text: 'Plan: enter 100.70 on a retest, stop 100.30, target 101.90.', result: 'risk 0.40, reward 1.20, ratio 3' },
            { text: 'Price runs from 100.00 to 101.50 without a retest: a move of', result: '1.5%' },
            { text: 'Chased entry 101.50, same stop and target.', result: 'risk 1.20, reward 0.40, ratio ≈ 0.33' },
          ],
          conclusion: 'The chart did not change; only the entry did. Chasing turned a ratio of 3 into about 0.33 and tripled the risk per unit.',
        },
        {
          kind: 'formula', expression: 'relative volume = current candle volume ÷ average volume of earlier candles',
          variables: [
            { symbol: 'volume', meaning: 'amount traded in one candle', unit: 'DEMO' },
            { symbol: 'average volume', meaning: 'mean of a fixed number of earlier candles (here 8)', unit: 'DEMO' },
          ],
          note: 'A result below 1 means quieter than usual; above 1 means busier. It says nothing about direction.',
        },
      ],
    },
    {
      id: 'T21-N04', heading: 'how-to-recognize', title: 'How to recognise it',
      blocks: [
        { kind: 'list', ordered: true, items: [
          '**False breakout risk**: a close beyond the level with a long wick back towards it, or a quick return inside the range.',
          '**Momentum fade**: after a strong candle, the next candles get smaller and close lower within their range.',
          '**Low relative volume**: the breakout candle trades less than the recent average (below 1).',
          '**Chasing**: your entry is far from the planned area, so the stop is far and the target is near.',
          '**Choppy range**: price crosses the middle of a narrow range again and again; small breakouts fail both ways.',
          '**Conflicting evidence**: list what supports and what opposes the idea. If both lists are real, WAIT or NO_TRADE.',
        ] },
      ],
    },
    {
      id: 'T21-N05', heading: 'common-mistakes', title: 'Common mistakes',
      blocks: [
        { kind: 'callout', callout: 'mistake', title: 'Treating one confirmation as proof', text: 'A close above resistance is a fact about one candle. It does not guarantee follow-through.' },
        { kind: 'callout', callout: 'mistake', title: 'Judging by outcome (hindsight bias)', text: 'A WAIT that missed a rally can still be the better decision, and a lucky chase can still be a poor one.' },
        { kind: 'callout', callout: 'mistake', title: 'Chasing to avoid missing out', text: 'Late entries move the stop further away and the target closer. In Example 2 the ratio fell from 3 to about 0.33.' },
      ],
    },
    {
      id: 'T21-N06', heading: 'safety-note', title: 'Safety note',
      blocks: [
        { kind: 'callout', callout: 'safety', text: 'No confirmation makes a trade certain or safe. False signals happen to careful traders too, so a planned invalidation point and size matter more than any single signal. When evidence is weak or conflicting, DEMO WAIT or DEMO NO_TRADE is always allowed and often the most skilled answer. Missing a move costs nothing; forcing a trade can cost real money.' },
        { kind: 'callout', callout: 'fictional-data', text: FICTIONAL },
      ],
    },
    {
      id: 'T21-N07', heading: 'quick-revision', title: 'Quick revision',
      blocks: [
        { kind: 'table', caption: 'Warning signs and what to do (fictional examples)', headers: ['Sign', 'What you see', 'Reasoned response'], rows: [
          ['False breakout', 'close above 100.60, wick to 101.30', 'wait for a retest that holds'],
          ['Momentum fade', 'next candle smaller, volume 700', 'do not chase; WAIT'],
          ['Low relative volume', '900 ÷ 1,200 = 0.75', 'treat as weak evidence'],
          ['Chasing', 'entry 101.50 instead of 100.70', 'ratio 3 → ≈ 0.33; skip'],
          ['Choppy range', 'repeated failed breaks', 'NO_TRADE'],
        ] },
      ],
    },
    {
      id: 'T21-N08', heading: 'learn-more', title: 'Learn more: process versus outcome', collapsedByDefault: true,
      blocks: [
        { kind: 'paragraph', text: 'Decision researchers separate the quality of a decision from the quality of its outcome. A good decision uses the information available, plans for being wrong and sizes the risk. Because markets are uncertain, good decisions sometimes lose and poor ones sometimes win. Over many decisions, process is what you can control. That is why this course scores your reasoning and shows only one of many possible outcomes after you decide.' },
      ],
    },
  ],

  animationScenes: [
    {
      id: 'T21-A01', type: 'branching-paths', durationMs: 32_000, fixtureId: 'FX-T21-BRANCH-01',
      parameters: {},
      caption: 'The same fictional past (closes 100.30 → 100.75) reaches NOW; three futures then grow: follow-through to 101.90, false breakout to 99.70, chop around 100.60.',
      narration: 'Every branch starts from exactly the same chart. Nothing visible at NOW says which one will happen.',
      reducedMotionDescription: 'A fictional DEMO/USDT close line runs through ten points from 100.30 to 100.75, crossing a resistance line at 100.60. At the NOW marker three possible futures are drawn: one rises to 101.90, one falls back to 99.70, one chops and ends at 100.55. All start from the same past.',
      glossaryRefs: ['confirmation', 'breakout'],
    },
    {
      id: 'T21-A02', type: 'breakout-fakeout', durationMs: 26_000, fixtureId: 'FX-T21-BRANCH-01',
      parameters: { branchId: 'false-breakout' },
      caption: 'One branch only: after closing above 100.60, price slides 100.40 → 100.10 → 99.80 → 99.70, back inside the old range. A false breakout.',
      narration: 'This is what a false signal looks like after the fact. Before the fact, it looked like the other branches.',
      reducedMotionDescription: 'Only the false-breakout branch is shown. After the past ends at 100.75 above resistance 100.60, the price falls to 100.40, 100.10, 99.80 and 99.70, back inside the range.',
      glossaryRefs: ['fakeout', 'false-signal'],
    },
    {
      id: 'T21-A03', type: 'volume-bars', durationMs: 28_000, fixtureId: 'FX-T21-REVEAL-01',
      parameters: { variant: 'plain', highlight: [8, 9] },
      caption: 'Volume bars build candle by candle: the breakout candle 9 trades 900 and candle 10 only 700, both below the earlier 1,200 average (relative volume 0.75 and about 0.58).',
      narration: 'The breakout happened on quieter trading than the range before it. That is weak evidence, not strong confirmation.',
      reducedMotionDescription: 'Twelve fictional candles appear with volume bars. Candles 1 to 8 average 1,200. Candle 9 closes above 100.60 on volume 900 (relative volume 0.75); candle 10 trades 700 (about 0.58). Both are highlighted. The dashed line shows the average of all twelve candles.',
      glossaryRefs: ['relative-volume', 'trading-volume'],
    },
    {
      id: 'T21-A04', type: 'price-path', durationMs: 28_000,
      parameters: { variant: 'plain', points: [100.0, 100.3, 100.7, 101.1, 101.5, 101.6, 101.55, 101.3, 100.9], markers: [{ index: 2, label: 'Planned 100.70' }, { index: 4, label: 'Chase 101.50' }], level: { price: 100.3, label: 'Stop 100.30' } },
      caption: 'Price runs 100.00 → 101.50 (+1.5%) past the planned 100.70 entry; a chase at 101.50 is followed by fading momentum: 101.60, 101.55, 101.30, 100.90.',
      narration: 'The later you enter, the further away your stop is. Momentum fades and the chaser is already down.',
      reducedMotionDescription: 'A fictional price line rises from 100.00 through the planned entry 100.70 to 101.50, where a chase marker appears (a 1.5% move). It peaks at 101.60, then fades to 101.55, 101.30 and 100.90. A stop line sits at 100.30.',
      glossaryRefs: ['chasing'],
    },
    {
      id: 'T21-A05', type: 'price-path', durationMs: 24_000,
      parameters: { variant: 'plain', points: [100.0, 100.55, 99.7, 100.5, 99.65, 100.6, 99.75, 100.45, 99.6, 100.1], level: { price: 100.1, label: 'Range middle 100.10' } },
      caption: 'A choppy range: price swings between 99.60 and 100.60, crossing the 100.10 middle again and again; each small break fails.',
      narration: 'In chop, every signal is soon contradicted. Costs eat the small moves. NO_TRADE is the reasoned default.',
      reducedMotionDescription: 'A fictional price line zigzags from 100.00 up to 100.55, down to 99.70, up to 100.50, down to 99.65, up to 100.60, down to 99.75, up to 100.45, down to 99.60 and back to 100.10, crossing the middle line at 100.10 many times.',
      glossaryRefs: ['choppy-range', 'sideways-market'],
    },
    {
      id: 'T21-A06', type: 'text-card', durationMs: 22_000,
      parameters: { variant: 'checklist', heading: 'What a confirmation can and cannot do', items: ['Can: show that a candle closed beyond a level.', 'Can: show whether volume was above or below normal.', 'Cannot: show the move will continue.', 'Cannot: show that this trade will win.'] },
      caption: 'Two “can” lines appear, then two “cannot” lines: evidence about the past, never a promise about the future.',
      reducedMotionDescription: 'Checklist: a confirmation can show that a candle closed beyond a level and whether volume was above or below normal; it cannot show the move will continue or that this trade will win.',
      glossaryRefs: ['confirmation'],
    },
    {
      id: 'T21-A07', type: 'text-card', durationMs: 22_000,
      parameters: { variant: 'red-flags', heading: 'Red flags: weak or conflicting evidence', items: ['Long wick back towards the level.', 'Relative volume below 1 on the breakout.', 'Next candle smaller: momentum fading.', 'Entry far from the plan: chasing.', 'Hindsight: “it was obvious”.'] },
      caption: 'Five red flags appear one by one, from the wick to hindsight bias.',
      reducedMotionDescription: 'Red flags: a long wick back towards the level; relative volume below 1 on the breakout; the next candle smaller as momentum fades; an entry far from the plan (chasing); and hindsight bias, the feeling that it was obvious.',
      glossaryRefs: ['false-signal', 'relative-volume'],
    },
    {
      id: 'T21-A08', type: 'trade-lifecycle', durationMs: 24_000,
      parameters: { variant: 'decision-gate', steps: ['Close above 100.60', 'Upper wick 0.40', 'Rel. volume 0.75', 'Next candle fades', 'Evidence conflicts'], path: [100.3, 100.0, 99.6, 100.0, 100.4, 99.9, 100.2, 100.5, 100.9, 100.75], decision: 'WAIT', outcome: 'Wait for a retest that holds' },
      caption: 'Five observations are checked one by one; at the gate the DEMO decision appears: WAIT for a retest that holds, because the evidence conflicts.',
      narration: 'Conflicting evidence does not force a choice. Waiting keeps the idea alive without paying for uncertainty.',
      reducedMotionDescription: 'Five steps are highlighted next to the fictional close line ending at 100.75: close above 100.60, upper wick 0.40, relative volume 0.75, next candle fades, evidence conflicts. A card then shows DEMO decision WAIT: wait for a retest that holds.',
      glossaryRefs: ['wait-decision', 'no-trade'],
    },
  ],

  exercises: [
    {
      id: 'T21-X01', type: 'decision-with-rationale', title: 'Reveal, then decide',
      fixtureId: 'FX-T21-REVEAL-01',
      instructions: 'You first see 8 fictional one-minute candles. Reveal candles 9 and 10 one at a time. Then choose a DEMO decision and explain it. The last two candles appear only after you submit, and they show just ONE possible outcome. You are scored on reasoning, not on that outcome.',
      steps: [
        { id: 'T21-X01-01', prompt: 'Look at candles 1–8: what range and what average volume do you see?', hint: 'Range about 99.40–100.60; average volume 1,200.' },
        { id: 'T21-X01-02', prompt: 'Reveal candle 9 and then candle 10. Note the close, the upper wick and the relative volume.', hint: 'Candle 9: close 100.90, high 101.30, volume 900 (0.75). Candle 10: close 100.75, volume 700.' },
        { id: 'T21-X01-03', prompt: 'Choose a DEMO decision and write why, mentioning the evidence for and against.', hint: 'Is the evidence strong, weak or conflicting? What would you need to see before acting?' },
      ],
      allowedControls: ['step-reveal', 'choice', 'text-rationale', 'reset', 'hint'],
      choices: [
        { id: 'buy', text: 'Buy the breakout now at about 100.75.', decision: 'BUY' },
        { id: 'sell', text: 'Sell now: the breakout has already failed.', decision: 'SELL' },
        { id: 'wait', text: 'Wait for a retest of 100.60 that holds.', decision: 'WAIT' },
        { id: 'no-trade', text: 'Skip it: the evidence conflicts.', decision: 'NO_TRADE' },
      ],
      parameters: {
        reveal: [8, 9, 10],
        context: [
          'Fictional DEMO/USDT, 1-minute candles. Resistance 100.60.',
          'Average volume of candles 1–8: 1,200.',
          'Remaining candles are hidden until you decide.',
        ],
        decisionFeedback: {
          buy: 'The close above 100.60 supports the idea, but relative volume 0.75, a 0.40 upper wick and a smaller next candle conflict with it. Buying now is chasing weak evidence.',
          sell: 'Price is still above 100.60; the breakout has not failed yet. Selling assumes a future you cannot see, which is hindsight thinking in reverse.',
          wait: 'Good reasoning: the breakout is real but weakly confirmed. Waiting for a retest that holds gives a nearer invalidation point and more evidence.',
          'no-trade': 'Good reasoning: weak volume, a long wick and fading momentum conflict with the close. Dropping the idea is a valid, skilled decision.',
        },
        minRationale: 40,
      },
      expectedEvaluation: {
        kind: 'decision', acceptable: ['WAIT', 'NO_TRADE'], decisionSet: 'trade', requiresRationale: true,
        rationaleCues: [
          'Candle 9 closed above 100.60, but on relative volume 0.75 (900 vs 1,200).',
          'The 0.40 upper wick shows selling above the level.',
          'Candle 10 is smaller and lower (momentum fade), so buying now would be chasing.',
          'The evidence conflicts, so waiting or not trading is reasonable whatever happens next.',
        ],
      },
      explanation: 'With 10 candles visible, the evidence conflicts: a close above resistance, but low relative volume, a long upper wick and a fading next candle. WAIT or NO_TRADE are the reasoned answers. The revealed candles 11–12 fall back to 99.90 in this fictional chart, but another branch could have risen; your reasoning is judged on what you could see.',
      fictionalDataLabel: 'Fictional DEMO/USDT chart for practice only. Educational simulation: no order is sent anywhere.',
    },
    {
      id: 'T21-X02', type: 'classify', title: 'What can a confirmation establish?',
      fixtureId: 'FX-T21-EVIDENCE-01',
      instructions: 'Sort each statement about the fictional breakout: can a confirmation establish it, or not?',
      steps: [
        { id: 'T21-X02-01', prompt: 'Statements about what already happened go in “Can establish”.', hint: 'Closes, volumes and past visits are facts you can read.' },
        { id: 'T21-X02-02', prompt: 'Statements about the future go in “Cannot establish”, then press Check.', hint: 'Anything with “will” describes the future.' },
      ],
      allowedControls: ['choice', 'tap-select', 'reset', 'hint'],
      parameters: {
        items: [
          { id: 'closed-above', text: 'Candle 9 closed above 100.60.' },
          { id: 'volume-lower', text: 'Candle 9 traded less volume than the average of candles 1–8.' },
          { id: 'level-visits', text: 'Price touched 100.60 twice before the breakout.' },
          { id: 'will-continue', text: 'Price will keep rising to 101.90.' },
          { id: 'will-win', text: 'A DEMO BUY now will be profitable.' },
          { id: 'not-fakeout', text: 'This breakout is not a fakeout.' },
        ],
        buckets: [
          { id: 'can', label: 'Can establish (past facts)' },
          { id: 'cannot', label: 'Cannot establish (future)' },
        ],
        itemFeedback: {
          'closed-above': 'A close is a recorded fact.',
          'volume-lower': 'Volume is recorded; relative volume 0.75 is a fact about the past.',
          'level-visits': 'Past visits can be counted on the chart.',
          'will-continue': 'This is about the future; no confirmation can promise it.',
          'will-win': 'No signal guarantees a profitable trade.',
          'not-fakeout': 'Whether a breakout was false is only known afterwards.',
        },
      },
      expectedEvaluation: { kind: 'classification', buckets: { can: ['closed-above', 'volume-lower', 'level-visits'], cannot: ['will-continue', 'will-win', 'not-fakeout'] } },
      explanation: 'Confirmations describe what already traded. Continuation, profit and “not a fakeout” are all claims about the future, which no confirmation can establish.',
      fictionalDataLabel: 'Illustrative statements about fictional DEMO/USDT data.',
    },
    {
      id: 'T21-X03', type: 'numeric-calculator', title: 'Compute relative volume',
      fixtureId: 'FX-T21-REVEAL-01',
      instructions: 'The average volume of fictional candles 1–8 is 1,200 DEMO. Compute the relative volume of candle 9 (900 DEMO) and candle 10 (700 DEMO), to 2 decimal places.',
      steps: [
        { id: 'T21-X03-01', prompt: 'Relative volume of candle 9 = 900 ÷ 1,200.', hint: 'Divide the candle volume by the average.' },
        { id: 'T21-X03-02', prompt: 'Relative volume of candle 10 = 700 ÷ 1,200.', hint: '700 ÷ 1,200 ≈ 0.583, rounded to 2 decimals.' },
      ],
      allowedControls: ['numeric-input', 'reset', 'hint'],
      parameters: {
        showChart: true,
        given: [
          { label: 'Average volume, candles 1–8', value: 1200, unit: 'DEMO', decimals: 0 },
          { label: 'Candle 9 volume', value: 900, unit: 'DEMO', decimals: 0 },
          { label: 'Candle 10 volume', value: 700, unit: 'DEMO', decimals: 0 },
        ],
      },
      expectedEvaluation: { kind: 'numeric-set', fields: [
        { key: 'rv9', label: 'Relative volume, candle 9', value: 0.75, tolerance: 0.005, unit: '×', rounding: { decimals: 2 } },
        { key: 'rv10', label: 'Relative volume, candle 10', value: 0.58, tolerance: 0.005, unit: '×', rounding: { decimals: 2 } },
      ] },
      explanation: 'Both results are below 1: the breakout and the candle after it were quieter than the range before. That is weak evidence for the breakout, not proof that it will fail.',
      fictionalDataLabel: 'Fictional DEMO/USDT volumes for practice only.',
    },
  ],

  formulas: [
    {
      id: 'T21-F01', name: 'Chasing changes the ratio', expression: 'ratio = |target − entry| ÷ |entry − stop|',
      variables: [
        { symbol: 'entry, stop, target', meaning: 'planned prices of the idea', unit: 'USDT per DEMO' },
      ],
      simulatorId: 'risk.reward', approximate: false,
      workedExamples: [
        { label: 'Planned retest entry (notes example 2)', inputs: { entry: 100.7, stop: 100.3, target: 101.9 }, outputs: { riskPerUnit: 0.4, rewardPerUnit: 1.2, ratio: 3 }, tolerance: 1e-6, assumptions: ['fictional data'] },
        { label: 'Chased entry (notes example 2, quiz T21-Q05)', inputs: { entry: 101.5, stop: 100.3, target: 101.9 }, outputs: { riskPerUnit: 1.2, rewardPerUnit: 0.4, ratio: 0.33 }, tolerance: 0.005, assumptions: ['fictional data'] },
      ],
    },
    {
      id: 'T21-F02', name: 'Size of the move before the chase', expression: 'percent change = (new price − old price) ÷ old price × 100',
      variables: [
        { symbol: 'old price, new price', meaning: 'price before and after the run', unit: 'USDT per DEMO' },
      ],
      simulatorId: 'price.percent-change', approximate: false,
      workedExamples: [
        { label: 'Run from 100.00 to 101.50 (notes example 2)', inputs: { oldPrice: 100, newPrice: 101.5 }, outputs: { percentChange: 1.5 }, tolerance: 1e-6, assumptions: ['fictional data'] },
      ],
    },
  ],

  quizQuestions: [
    {
      id: 'T21-Q01', type: 'chart', cognitiveTag: 'interpretation', linkedLessonId: 'T21', fixtureId: 'FX-T21-REVEAL-01',
      prompt: 'Candle 9 closes at 100.90, above the 100.60 resistance, with a high of 101.30 and volume 900 against a 1,200 average. Which description is most accurate?',
      choices: [
        { id: 'a', text: 'A real close above the level, but weakly confirmed: low relative volume and a long upper wick conflict with it.' },
        { id: 'b', text: 'A confirmed breakout: price will now continue upward.' },
        { id: 'c', text: 'A certain fakeout: price will fall back into the range.' },
        { id: 'd', text: 'Meaningless: volume never matters.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'The close is a fact; relative volume 0.75 and a 0.40 upper wick are conflicting evidence. Neither side is certain.',
      misconceptionFeedback: {
        b: 'A close beyond a level does not guarantee continuation, especially on quieter volume.',
        c: 'Weak evidence is not certainty in the other direction. It could still continue.',
        d: 'Volume is useful context. It shows activity, though not direction.',
      },
      learningOutcome: 'Describe a breakout as weak or conflicting evidence instead of a certainty.',
      remediationRef: { lessonId: 'T21', anchorId: 'T21-N03' },
      shuffleChoices: true,
    },
    {
      id: 'T21-Q02', type: 'numeric', cognitiveTag: 'calculation', linkedLessonId: 'T21',
      prompt: 'A fictional candle trades 1,800 DEMO. The average of the 8 earlier candles is 1,200 DEMO. What is its relative volume?',
      answer: { kind: 'numeric', value: 1.5, tolerance: 0.005, unit: '×', rounding: { decimals: 2 } },
      rationale: '1,800 ÷ 1,200 = 1.50: busier than usual. It still does not say which direction comes next.',
      learningOutcome: 'Compute relative volume.',
      remediationRef: { lessonId: 'T21', anchorId: 'T21-N03' },
    },
    {
      id: 'T21-Q03', type: 'scenario', cognitiveTag: 'mistake-risk', linkedLessonId: 'T21', safetyCritical: true, safetyTopic: 'no-trade',
      prompt: 'Price closes above resistance, but relative volume is 0.75, the candle has a long upper wick and the next candle is smaller. What is the most reasoned DEMO decision?',
      choices: [
        { id: 'a', text: 'DEMO WAIT for a retest that holds, or NO_TRADE: the evidence conflicts.', decision: 'WAIT' },
        { id: 'b', text: 'DEMO BUY with a larger size, because a breakout is confirmed.', decision: 'BUY' },
        { id: 'c', text: 'DEMO SELL, because the breakout will certainly fail.', decision: 'SELL' },
        { id: 'd', text: 'DEMO BUY now so you do not miss the move.', decision: 'BUY' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Conflicting evidence is a reason to abstain. WAIT keeps the idea open for better evidence; NO_TRADE drops it. Both are skilled answers.',
      misconceptionFeedback: {
        b: 'A larger size on weak evidence increases risk without adding any edge.',
        c: 'Nobody can know the breakout will fail. That is certainty in the other direction.',
        d: 'Fear of missing out leads to chasing, which worsens the reward-to-risk ratio.',
      },
      learningOutcome: 'Choose WAIT or NO_TRADE when evidence is weak or conflicting.',
      remediationRef: { lessonId: 'T21', anchorId: 'T21-N06' },
      shuffleChoices: true,
    },
    {
      id: 'T21-Q04', type: 'scenario', cognitiveTag: 'interpretation', linkedLessonId: 'T21',
      prompt: 'A learner chose DEMO WAIT on a weak breakout. Afterwards price rallied 1.5%. They say: “It was obvious; I was wrong to wait.” What is the best response?',
      choices: [
        { id: 'a', text: 'That is hindsight bias. Judge the decision by the evidence available then; WAIT can be sound even if price rallied.' },
        { id: 'b', text: 'Agree: any decision that misses a rally is a bad decision.' },
        { id: 'c', text: 'Next time, always buy every breakout to be safe.' },
        { id: 'd', text: 'The chart must have been wrong.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: 'Outcomes are uncertain. A good process can miss a move; judging it by the result teaches the wrong lesson.',
      misconceptionFeedback: {
        b: 'Judging by outcome rewards luck. The same evidence could have led to a fall.',
        c: 'Buying every breakout means buying every false breakout too. Nothing makes that safe.',
        d: 'The chart was fine. The future was simply unknown at decision time.',
      },
      learningOutcome: 'Recognise hindsight bias and judge decisions by process.',
      remediationRef: { lessonId: 'T21', anchorId: 'T21-N02' },
      shuffleChoices: true,
    },
    {
      id: 'T21-Q05', type: 'single', cognitiveTag: 'application', linkedLessonId: 'T21',
      prompt: 'Plan: entry 100.70, stop 100.30, target 101.90 (ratio 3). Price runs to 101.50 first and you enter there with the same stop and target. What happens?',
      choices: [
        { id: 'a', text: 'Risk per unit rises to 1.20 and reward falls to 0.40: ratio about 0.33. This is chasing.' },
        { id: 'b', text: 'Nothing changes; the stop and target are the same.' },
        { id: 'c', text: 'The ratio improves because momentum is strong.' },
        { id: 'd', text: 'Risk falls because price is closer to the target.' },
      ],
      answer: { kind: 'choice', choiceId: 'a' },
      rationale: '101.50 − 100.30 = 1.20 risk; 101.90 − 101.50 = 0.40 reward; 0.40 ÷ 1.20 ≈ 0.33.',
      misconceptionFeedback: {
        b: 'The entry moved, so both distances changed even though the lines did not.',
        c: 'Momentum does not change arithmetic: the stop is further, the target nearer.',
        d: 'Being nearer the target means less reward, and being further from the stop means more risk.',
      },
      learningOutcome: 'Quantify how chasing worsens the reward-to-risk ratio.',
      remediationRef: { lessonId: 'T21', anchorId: 'T21-N03' },
      shuffleChoices: true,
    },
  ],

  commonMistakes: [
    { mistake: 'Treating a close beyond a level as proof that the move will continue.', correction: 'A confirmation describes the past; check relative volume, wicks and follow-through, and accept uncertainty.' },
    { mistake: 'Judging a decision by its outcome (hindsight bias).', correction: 'Judge by the evidence visible at decision time, the invalidation point and the size.' },
    { mistake: 'Chasing a move that already ran.', correction: 'Late entries worsen the ratio; wait for the planned area or skip the trade.' },
  ],
  takeaways: [
    'Confirmations establish facts about the past; they never prove what happens next.',
    'Weak or conflicting evidence (low relative volume, long wicks, fading momentum, chop) means DEMO WAIT or NO_TRADE.',
    'Judge decisions by process, not outcome, and never chase a move that already ran.',
  ],
  reviewCard: {
    keyTermIds: ['false-signal', 'relative-volume', 'no-trade'],
    safetyNote: 'No confirmation makes a trade certain. With weak or conflicting evidence, DEMO WAIT or NO_TRADE is always allowed.',
    reviewMinutes: 4,
    retrievalQuestion: 'A breakout candle has relative volume 0.75 and a long upper wick. Name one thing it confirms and one thing it cannot confirm.',
  },
  completionRequirements: {
    requireAllSlidesViewed: true,
    requireAnimationCompleted: false,
    requireExerciseIds: ['T21-X01'],
    minQuizScore: 0.8,
    requireSafetyCriticalCorrect: true,
  },
};

export default lesson;
