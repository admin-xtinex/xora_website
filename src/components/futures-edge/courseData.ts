// XORA Futures Edge course catalogue: the single source for the website's course
// section and for the title-card renderer (tools/futures-edge-cards).
//
// To release a lesson: save its animation page (the self-contained HTML) as
// public/futures-edge/lessons/<id>.html and set its status to "available".
// Lessons play as live web animations in the site; there are no MP4 files.

export type LessonStatus = "available" | "locked";
export type LessonKind = "intro" | "lesson" | "checkpoint";
export type TutorPose = "present" | "explain" | "think" | "point" | "hi" | "wave" | "walk" | "idle";

export type Lesson = {
  id: string;
  kind: LessonKind;
  phase: number;
  title: string;
  /** One line on what the learner gets from it. */
  line: string;
  minutes: number;
  status: LessonStatus;
  /** Tutor pose on the title card, and whether it is mirrored. */
  pose: TutorPose;
  flip?: boolean;
};

export type Phase = { id: number; name: string; goal: string };

export const PHASES: Phase[] = [
  { id: 0, name: "Start here", goal: "How the course works, and what it is not." },
  { id: 1, name: "Crypto Foundations", goal: "Assets, prices, pairs and exchanges, from zero." },
  { id: 2, name: "Trading Fundamentals", goal: "Positions, orders, profit and loss, and costs." },
  { id: 3, name: "Binance & Futures Essentials", goal: "Futures, margin and leverage, and their risks." },
  { id: 4, name: "Charts & Market Analysis", goal: "Read price movement without pretending to predict it." },
  { id: 5, name: "Scalping & Risk Management", goal: "A disciplined way to judge a trade, including no trade." },
];

export const LESSONS: Lesson[] = [
  { id: "V00", kind: "intro", phase: 0, title: "Welcome to XORA Futures Edge", line: "How the course works, the five phases, and why it is demo only.", minutes: 3, status: "available", pose: "wave" },

  { id: "T01", kind: "lesson", phase: 1, title: "What Is Cryptocurrency?", line: "Digital assets, the blockchain, Bitcoin and wallets.", minutes: 5, status: "available", pose: "present" },
  { id: "T02", kind: "lesson", phase: 1, title: "Why Do Crypto Prices Move?", line: "Buyers, sellers, demand, supply and volatility.", minutes: 5, status: "available", pose: "think" },
  { id: "T03", kind: "lesson", phase: 1, title: "Trading Pairs: BTC/USDT", line: "Base and quote assets, and what a price really means.", minutes: 4, status: "available", pose: "explain" },
  { id: "T04", kind: "lesson", phase: 1, title: "What Does an Exchange Do?", line: "Order books, bid and ask, spread and account safety.", minutes: 4, status: "available", pose: "point" },
  { id: "CP1", kind: "checkpoint", phase: 1, title: "Foundations Checkpoint", line: "A video recap of T01 to T04: 8 questions to pause and answer.", minutes: 4, status: "available", pose: "hi" },

  { id: "T05", kind: "lesson", phase: 2, title: "Buy, Sell, Long and Short", line: "Owning an asset versus holding a position.", minutes: 5, status: "available", pose: "point" },
  { id: "T06", kind: "lesson", phase: 2, title: "Entry, Exit and Profit/Loss", line: "Work out gross and net results, with fees.", minutes: 5, status: "available", pose: "explain" },
  { id: "T07", kind: "lesson", phase: 2, title: "Market, Limit and Stop Orders", line: "How orders fill, and why fills are not guaranteed.", minutes: 5, status: "available", pose: "think" },
  { id: "T08", kind: "lesson", phase: 2, title: "Stop-Loss and Take-Profit", line: "Plan an exit before you enter.", minutes: 5, status: "available", pose: "present" },
  { id: "T09", kind: "lesson", phase: 2, title: "Fees, Spread and Slippage", line: "How small costs turn small wins into losses.", minutes: 5, status: "available", pose: "explain", flip: true },

  { id: "T10", kind: "lesson", phase: 3, title: "Exchange Platform Tour", line: "A mock trading screen, piece by piece.", minutes: 5, status: "available", pose: "point" },
  { id: "T11", kind: "lesson", phase: 3, title: "Spot vs Futures", line: "Owning coins versus a contract about their price.", minutes: 5, status: "available", pose: "think" },
  { id: "T12", kind: "lesson", phase: 3, title: "Margin and Leverage", line: "Why leverage magnifies losses as well as gains.", minutes: 5, status: "available", pose: "explain" },
  { id: "T13", kind: "lesson", phase: 3, title: "Liquidation, Funding and Futures Risks", line: "What can close a position for you, and when to stay out.", minutes: 5, status: "available", pose: "think", flip: true },
  { id: "CPA", kind: "checkpoint", phase: 3, title: "Checkpoint A", line: "A video recap of T01 to T13: 8 questions, mostly on leverage and safety.", minutes: 4, status: "available", pose: "hi" },

  { id: "T14", kind: "lesson", phase: 4, title: "Candlesticks: Open, High, Low, Close", line: "Read one candle, then a whole chart.", minutes: 5, status: "available", pose: "present" },
  { id: "T15", kind: "lesson", phase: 4, title: "1m / 5m / 15m Timeframes", line: "The same market, grouped in different time windows.", minutes: 5, status: "available", pose: "point" },
  { id: "T16", kind: "lesson", phase: 4, title: "Trend and Market Structure", line: "Higher highs, lower lows, and sideways markets.", minutes: 5, status: "available", pose: "think" },
  { id: "T17", kind: "lesson", phase: 4, title: "Support, Resistance, Breakout, Fakeout", line: "Price zones, and what counts as confirmation.", minutes: 5, status: "available", pose: "explain" },
  { id: "T18", kind: "lesson", phase: 4, title: "Volume, Volatility and Range", line: "How busy and how jumpy a market is.", minutes: 5, status: "available", pose: "present", flip: true },

  { id: "T19", kind: "lesson", phase: 5, title: "What Is Scalping?", line: "Short trades, real costs, and when not to trade.", minutes: 5, status: "available", pose: "walk" },
  { id: "T20", kind: "lesson", phase: 5, title: "Evaluating an Entry Opportunity", line: "A step-by-step checklist that can end in no trade.", minutes: 5, status: "available", pose: "think" },
  { id: "T21", kind: "lesson", phase: 5, title: "Confirmation, False Signals and NO_TRADE", line: "Why waiting is a decision too.", minutes: 5, status: "available", pose: "explain" },
  { id: "T22", kind: "lesson", phase: 5, title: "Position Sizing and Risk Budget", line: "Size a position from the risk you accept.", minutes: 5, status: "available", pose: "point" },
  { id: "T23", kind: "lesson", phase: 5, title: "Full Scalping Decision Lifecycle", line: "A complete demo walkthrough, from chart to journal.", minutes: 7, status: "available", pose: "present" },
  { id: "CPB", kind: "checkpoint", phase: 5, title: "Checkpoint B", line: "A video recap of T14 to T23: chart and risk questions to pause and answer.", minutes: 4, status: "available", pose: "hi", flip: true },
];

export const cardSrc = (id: string) => `/futures-edge/cards/${id}.webp`;
export const lessonSrc = (id: string) => `/futures-edge/lessons/${id}.html`;
