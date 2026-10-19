/**
 * CPB checkpoint-only items CPB-Q01..Q05 (EDGE-09). These are the applied items the master prompt asks for
 * (2 chart interpretation, 2 risk math, 1 demo scenario). They do NOT copy lesson questions (D-66): each one
 * applies a lesson rule to a different question about fictional data.
 *
 * Every number is FICTIONAL: DEMO/USDT is not a real market and these prices never happened. Prompts say so.
 * Numeric items follow D-37: `rounding.decimals` + tolerance = half a rounding step.
 *
 * Sources (read-only, not copied):
 *  - CPB-Q01: EDGE-05 T16 fixture FX-T16-CHART-C-01 (swing rule "two candles each side", 3 USDT about-equal band).
 *  - CPB-Q02, CPB-Q05: EDGE-05 T17 fixture FX-T17-BRANCHES-01 (fakeout / breakout paths, closed-candle checklist);
 *    CPB-Q05 applies EDGE-06 T23's consecutive-loss rule (remediation T23-S06).
 *  - CPB-Q03, CPB-Q04: golden answers cross-checked against EDGE-08's documented `runSimulator('liquidation.approx')`
 *    and `runSimulator('risk.position-size')` (branch futures-edge/edge-08-simulation-lab @ bb8e4f4, contracts
 *    v1.3.0). PENDING CONFIRMATION of the v1.3.1 simulator ids: see CPB_ITEM_PROVENANCE and the CPB plan slots.
 */
import type { CheckpointQuestionId, FixtureId, Question } from '../../contracts';

export type CheckpointItem = Question & { id: CheckpointQuestionId };

export interface CheckpointItemProvenance {
  id: CheckpointQuestionId;
  fixtureIds: FixtureId[];
  /** Simulator whose documented output the golden answer was cross-checked against. */
  simulator?: { id: string; input: Record<string, unknown>; output: Record<string, number | string | boolean>; checkedAgainst: string };
  /** Set while the item is waiting for an external confirmation; the CPB build stays provisional until cleared. */
  pendingConfirmation?: string;
}

const FICTIONAL = 'Fictional educational data: DEMO/USDT is not a real market and these prices never happened.';

export const CPB_ITEMS: CheckpointItem[] = [
  {
    id: 'CPB-Q01',
    type: 'chart',
    fixtureId: 'FX-T16-CHART-C-01',
    prompt:
      `${FICTIONAL} Chart C (5-minute candles 1–18). Using the course rule (a swing high is above the highs of the two candles on each side; lows mirrored), the swing highs are 2,022 (candle 3), 2,021 (candle 9) and 2,022 (candle 15), and the swing lows are 2,000 (candle 6) and 2,001 (candle 12). With the 3 USDT “about equal” band, which reading is most accurate?`,
    choices: [
      { id: 'a', text: 'Uptrend: the last high and the last low are both higher, so price is likely to keep rising.' },
      { id: 'b', text: 'Sideways: each change is about 1 USDT, inside the 3 USDT band. The label describes what already happened, not what comes next.' },
      { id: 'c', text: 'Downtrend: candle 18 closed lower than candle 15, so the trend has turned down.' },
      { id: 'd', text: 'Uptrend confirmed: candle 18 is already a new higher swing low.' },
    ],
    answer: { kind: 'choice', choiceId: 'b' },
    rationale:
      'Latest high minus previous high is 2,022 − 2,021 = +1 and latest low minus previous low is 2,001 − 2,000 = +1. Both are inside the 3 USDT band, so both count as “about equal”: the structure is sideways. A structure label only describes past swing points; it is never a forecast.',
    misconceptionFeedback: {
      a: 'Without the band, a 1 USDT difference looks like a higher high and a higher low. With the course’s 3 USDT band it is “about equal”. Even a real uptrend label would not say where price goes next.',
      c: 'Structure is read from swing points, not from comparing two closes. A single lower close does not create a lower high or a lower low.',
      d: 'The newest two candles cannot be judged yet: a swing needs two later candles to compare against, and candles 17–18 have none.',
    },
    learningOutcome: 'Read market structure from swing points with an explicit “about equal” band, and treat the label as a description of the past, not a prediction.',
    linkedLessonId: 'T16',
    cognitiveTag: 'interpretation',
    remediationRef: { lessonId: 'T16', anchorId: 'T16-S03' },
    shuffleChoices: true,
  },
  {
    id: 'CPB-Q02',
    type: 'chart',
    fixtureId: 'FX-T17-BRANCHES-01',
    prompt:
      `${FICTIONAL} 15-minute chart, fakeout path. The resistance zone is 2,048–2,051. Candle 16 spiked to 2,061 but closed at 2,049; candle 17 closed at 2,038; candle 18 closed at 2,030. Your written demo plan allows a long only after a candle closes above the zone and a later retest still closes above it. A friend says the spike to 2,061 proves buyers are in control. What is your decision on this setup?`,
    choices: [
      { id: 'buy-spike', text: 'DEMO BUY now: the spike to 2,061 already broke the zone.', decision: 'BUY' },
      { id: 'buy-dip', text: 'DEMO BUY at 2,030: price was above the zone a moment ago, so this is a cheap entry.', decision: 'BUY' },
      { id: 'sell', text: 'DEMO SELL now: a fakeout means price is certain to keep falling.', decision: 'SELL' },
      { id: 'no-trade', text: 'NO_TRADE: no candle closed above 2,051 and price closed back below the zone, so the plan’s conditions were never met.', decision: 'NO_TRADE' },
    ],
    answer: { kind: 'choice', choiceId: 'no-trade' },
    rationale:
      'Only closed candles count. Candle 16 closed at 2,049, inside the zone, and candles 17–18 closed below it: step one of the checklist (a close above 2,051) never happened, so this is a fakeout. The plan has no trade for this setup. NO_TRADE is a complete, valid answer, and a new setup would need a fresh close above the zone and a retest that holds.',
    misconceptionFeedback: {
      'buy-spike': 'The 2,061 high is a wick. The candle closed back at 2,049, inside the zone, so the breakout never closed. Wicks do not count.',
      'buy-dip': 'The setup failed; a lower price does not turn a failed setup into a good one. Buying because price “was higher a moment ago” is not in the plan.',
      sell: 'Nothing on a chart is certain, and your plan does not include a short on this setup. A fakeout tells you the long idea failed, not that a fall is guaranteed.',
    },
    learningOutcome: 'Use closed candles and a written checklist to recognise a failed breakout, and choose NO_TRADE when the plan’s conditions are not met.',
    linkedLessonId: 'T17',
    cognitiveTag: 'interpretation',
    safetyCritical: true,
    safetyTopic: 'no-trade',
    remediationRef: { lessonId: 'T17', anchorId: 'T17-S03' },
    shuffleChoices: true,
  },
  {
    id: 'CPB-Q03',
    type: 'numeric',
    prompt:
      `${FICTIONAL} Demo only. A demo SHORT on DEMO/USDT is opened at 2,000 with 20× isolated leverage. The course’s approximate formula for a short is: liquidation ≈ entry × (1 + 1 ÷ leverage − maintenance margin rate). Use an assumed maintenance margin rate of 0.5% and ignore fees, funding, tiers and mark price. What is the approximate liquidation price, in USDT per DEMO, rounded to a whole number?`,
    answer: { kind: 'numeric', value: 2090, tolerance: 0.5, unit: 'USDT per DEMO', rounding: { decimals: 0 } },
    rationale:
      '2,000 × (1 + 1/20 − 0.005) = 2,000 × 1.045 = 2,090. For a short, liquidation sits ABOVE the entry, because losses grow as price rises. At 20× a rise of only about 4.5% against the short uses up the margin: leverage amplifies losses relative to the margin you put up. The figure is an approximation; real exchanges use mark price, tiers and fees, so the true level can be closer. A planned stop must sit well before it.',
    learningOutcome: 'Estimate an approximate liquidation price for a short and explain that higher leverage puts it closer to the entry, amplifying losses.',
    linkedLessonId: 'T22',
    cognitiveTag: 'calculation',
    remediationRef: { lessonId: 'T13', anchorId: 'T13-S02' },
  },
  {
    id: 'CPB-Q04',
    type: 'numeric',
    prompt:
      `${FICTIONAL} Demo only. A demo account holds 1,000 USDT and the plan risks 1% (10 USDT) per trade. A demo long is planned at 2,000 with a stop at 1,980. Size = risk budget ÷ loss per DEMO at the stop (ignore fees and slippage). What position size is that, in DEMO, rounded to 2 decimals?`,
    answer: { kind: 'numeric', value: 0.5, tolerance: 0.005, unit: 'DEMO', rounding: { decimals: 2 } },
    rationale:
      'Loss per DEMO at the stop = 2,000 − 1,980 = 20 USDT, so size = 10 ÷ 20 = 0.50 DEMO (a 1,000 USDT position). Leverage does not change this answer: the stop and the size set the planned loss. What leverage changes is how little margin backs the position. At 10× only 100 USDT is used as margin, so the 20 USDT move to the stop already costs 10% of it, and doubling the size at the same leverage doubles the loss. Leverage amplifies losses; it never makes a position safer.',
    learningOutcome: 'Size a position from a fixed risk budget and stop distance, and explain that leverage amplifies losses on margin rather than reducing risk.',
    linkedLessonId: 'T22',
    cognitiveTag: 'calculation',
    remediationRef: { lessonId: 'T22', anchorId: 'T22-S03' },
  },
  {
    id: 'CPB-Q05',
    type: 'scenario',
    fixtureId: 'FX-T17-BRANCHES-01',
    prompt:
      `${FICTIONAL} Demo practice session. Your written plan: risk 10 USDT per trade, and stop for the session after 2 losing trades in a row. Trade 1 was a demo long on the fakeout path and lost 9 USDT. Trade 2 was a demo long taken while a candle was still forming above the zone; it was stopped out for a loss of 8 USDT. Now the breakout path appears: candle 16 closed at 2,058 above the 2,048–2,051 zone and the retest held. What do you do?`,
    choices: [
      { id: 'continue', text: 'CONTINUE_SIM_PRACTICE: this setup passes the checklist, so the rule does not apply to it.', decision: 'CONTINUE_SIM_PRACTICE' },
      { id: 'double', text: 'Take the setup with double size to win back the 17 USDT lost so far.' },
      { id: 'stop', text: 'STOP_TRADING: two losses in a row means the session ends. A good-looking setup does not reset the rule.', decision: 'STOP_TRADING' },
      { id: 'one-more', text: 'CONTINUE_SIM_PRACTICE for one last trade, then stop.', decision: 'CONTINUE_SIM_PRACTICE' },
    ],
    answer: { kind: 'choice', choiceId: 'stop' },
    rationale:
      'Trades 1 and 2 are two consecutive losses, so the plan says stop. The rule exists for exactly this moment: after losses, a clean-looking setup feels like a chance to recover. A met checklist lowers the chance of a fakeout but never removes it. Stopping is a successful outcome of the process.',
    misconceptionFeedback: {
      continue: 'The consecutive-loss rule is about the session, not about one setup. It applies however good the next setup looks.',
      double: 'Raising size to win back losses is revenge trading. It increases the next loss exactly when the plan says to stop.',
      'one-more': '“One last trade” breaks the rule you wrote before the session. The rule only protects you if it is followed every time.',
    },
    learningOutcome: 'Apply a consecutive-loss rule in a demo session and treat STOP_TRADING as the correct, successful decision.',
    linkedLessonId: 'T23',
    cognitiveTag: 'application',
    safetyCritical: true,
    safetyTopic: 'loss-limits',
    remediationRef: { lessonId: 'T23', anchorId: 'T23-S06' },
    shuffleChoices: true,
  },
];

const V131 =
  'EDGE-08 to confirm the simulator id, input/output keys and golden value on contracts v1.3.1 (box: D-76 lists the id, D-77 key alignment still proposed; repo still on v1.3.0)';

export const CPB_ITEM_PROVENANCE: Readonly<Record<string, CheckpointItemProvenance>> = {
  'CPB-Q01': { id: 'CPB-Q01', fixtureIds: ['FX-T16-CHART-C-01'] },
  'CPB-Q02': { id: 'CPB-Q02', fixtureIds: ['FX-T17-BRANCHES-01'] },
  'CPB-Q03': {
    id: 'CPB-Q03', fixtureIds: [],
    simulator: {
      id: 'liquidation.approx', input: { side: 'short', entryPrice: 2000, leverage: 20, maintenanceMarginRate: 0.005, stopPrice: 2030 },
      output: { approxLiquidationPrice: 2090, distancePercent: 4.5, approximate: true },
      checkedAgainst: 'EDGE-08 runSimulator (futures-edge/edge-08-simulation-lab @ bb8e4f4, contracts v1.3.0)',
    },
    pendingConfirmation: V131,
  },
  'CPB-Q04': {
    id: 'CPB-Q04', fixtureIds: [],
    simulator: {
      id: 'risk.position-size', input: { side: 'long', entryPrice: 2000, stopPrice: 1980, accountBalance: 1000, riskRate: 0.01, sizeStep: 0.001, leverage: 10 },
      output: { size: 0.5, notional: 1000, riskAtStop: 10, requiredMargin: 100 },
      checkedAgainst: 'EDGE-08 runSimulator (futures-edge/edge-08-simulation-lab @ bb8e4f4, contracts v1.3.0)',
    },
    pendingConfirmation: V131,
  },
  'CPB-Q05': { id: 'CPB-Q05', fixtureIds: ['FX-T17-BRANCHES-01'] },
};
