/**
 * Canonical course map (T01–T23, five phases). Owner: EDGE-00. FROZEN.
 * Titles are the canonical English working titles from the blueprint; authors may refine the learner-facing
 * `title` inside their Lesson data, but phase membership and order here are fixed.
 */
import type { LessonId, PhaseId, CheckpointId } from './ids';

export interface Phase {
  id: PhaseId;
  order: number; // 1..5
  title: string;
  goal: string;
  tutorialIds: readonly LessonId[];
  /** Bot that authors this phase's lesson data. */
  author: 'EDGE-02' | 'EDGE-03' | 'EDGE-04' | 'EDGE-05' | 'EDGE-06';
  /** Checkpoint presented after the last lesson of this phase, if any. */
  checkpointAfter?: CheckpointId;
}

export const PHASES: readonly Phase[] = [
  {
    id: 'P1', order: 1, title: 'Crypto Foundations', author: 'EDGE-02', checkpointAfter: 'CP1',
    goal: 'Identify assets, prices, pairs, exchanges and volatility without requiring blockchain engineering.',
    tutorialIds: ['T01', 'T02', 'T03', 'T04'],
  },
  {
    id: 'P2', order: 2, title: 'Trading Fundamentals', author: 'EDGE-03',
    goal: 'Understand directional positions, orders, PnL, protective orders and trading costs.',
    tutorialIds: ['T05', 'T06', 'T07', 'T08', 'T09'],
  },
  {
    id: 'P3', order: 3, title: 'Binance & Futures Essentials', author: 'EDGE-04', checkpointAfter: 'CPA',
    goal: 'Read a generic futures terminal and understand major risks without connecting or placing live orders.',
    tutorialIds: ['T10', 'T11', 'T12', 'T13'],
  },
  {
    id: 'P4', order: 4, title: 'Chart Reading & Analysis', author: 'EDGE-05',
    goal: 'Interpret price movement without pretending any candle predicts the future.',
    tutorialIds: ['T14', 'T15', 'T16', 'T17', 'T18'],
  },
  {
    id: 'P5', order: 5, title: 'Scalping & Risk Management', author: 'EDGE-06', checkpointAfter: 'CPB',
    goal: 'Learn a disciplined evaluation workflow, not "easy money" or a guaranteed setup.',
    tutorialIds: ['T19', 'T20', 'T21', 'T22', 'T23'],
  },
] as const;

export const LESSON_WORKING_TITLES: Readonly<Record<LessonId, string>> = {
  T01: 'What Is Cryptocurrency?',
  T02: 'Why Do Crypto Prices Move?',
  T03: 'Understanding Trading Pairs: BTC/USDT',
  T04: 'Exchanges & Market Basics',
  T05: 'BUY, SELL, LONG, SHORT',
  T06: 'Entry, Exit & Profit/Loss',
  T07: 'Market, Limit and Stop Orders',
  T08: 'Stop-Loss & Take-Profit',
  T09: 'Fees, Spread and Slippage',
  T10: 'Binance Platform Orientation (Educational Mock)',
  T11: 'Spot versus Futures',
  T12: 'Margin and Leverage',
  T13: 'Liquidation, Funding and Futures Risks',
  T14: 'Candlesticks: Open, High, Low, Close',
  T15: '1m / 5m / 15m Timeframes',
  T16: 'Trend and Market Structure',
  T17: 'Support, Resistance, Breakout and Fakeout',
  T18: 'Volume, Volatility and Historical Range',
  T19: 'What Is Scalping?',
  T20: 'Evaluating an Entry Opportunity',
  T21: 'Confirmation, False Signals and NO_TRADE',
  T22: 'Position Sizing and Risk Budget',
  T23: 'Full Scalping Decision Lifecycle',
};

export function phaseOfLesson(id: LessonId): Phase {
  const p = PHASES.find((ph) => ph.tutorialIds.includes(id));
  if (!p) throw new Error(`Lesson ${id} is not mapped to a phase (contract bug)`);
  return p;
}
