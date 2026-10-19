/**
 * Exercise, fixture and simulator contracts.
 * Owner: EDGE-00 (types). Exercises authored by content bots (EDGE-02..06); fixtures + simulators + widgets by EDGE-08.
 *
 * HARD RULES (enforced by review + QA grep gate):
 *  - Simulators are PURE and deterministic: same input -> same output. No network, no clock, no Math.random
 *    (use the fixture `seed` with a seeded PRNG if randomness is needed).
 *  - Never import an exchange/order client, never call any Binance or other exchange endpoint.
 *  - All fixture data is fictional and labelled as such.
 */
import type { ExerciseId, ExerciseStepId, FixtureId, ChoiceId } from './ids';
import type { JsonObject, JsonValue } from './json';
import type { RichText } from './content';
import type { Choice } from './question';
import type { DecisionWord, DecisionSet } from './decisions';
import { TRADE_DECISIONS } from './decisions';
import type { SimulatorId } from './simulators';

export const EXERCISE_TYPES = [
  'choice-feedback',        // multiple choice with immediate feedback
  'classify',               // sort items into buckets (crypto vs not, spot vs futures)
  'numeric-calculator',     // learner computes a value (0.002 BTC × price)
  'slider-explore',         // adjust sliders and observe an illustrative model
  'sequence-order',         // put steps in order
  'hotspot-find',           // find regions in a fictional mock UI (with keyboard list equivalent)
  'order-match',            // match a buy order against sell quotes
  'line-placement',         // entry/SL/TP lines with numeric-input equivalent
  'zone-placement',         // support/resistance zone + confirmation observations
  'candle-builder',         // OHLC sliders with constraint checking
  'timeframe-switch',       // same raw timeline, different aggregation
  'lookback-range',         // window -> max/min/range%
  'position-size',          // risk budget, entry/stop -> allowed notional (simple model)
  'decision-with-rationale',// BUY / SELL / WAIT / NO_TRADE + required rationale
  'capstone-lifecycle',     // T23 multi-step lifecycle incl. NO_TRADE-success route
] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export const EXERCISE_CONTROLS = [
  'slider', 'numeric-input', 'choice', 'multi-choice', 'drag', 'keyboard-move', 'tap-select', 'text-rationale',
  'step-reveal', 'reset', 'hint',
] as const;
export type ExerciseControl = (typeof EXERCISE_CONTROLS)[number];

/** Demo-only trade decisions (kept from v1.0.0; same as TRADE_DECISIONS in decisions.ts). UI labels them "DEMO". */
export const DEMO_DECISIONS = TRADE_DECISIONS;
export type DemoDecision = (typeof DEMO_DECISIONS)[number];

/**
 * Answer display/entry precision (v1.2.0, D-37). `decimals` = digits after the point the learner is asked to give.
 * Tolerance rules (validator): tolerance ≥ 0.5·10^-decimals when the value has more precision than `decimals`
 * (else ERROR); tolerance ≤ 10^-decimals recommended (else WARNING); tolerance < |value| for non-zero values (else ERROR:
 * the sign or zero would be accepted).
 */
export interface Rounding { decimals: number }

export interface ExerciseStep {
  id: ExerciseStepId;
  prompt: RichText;
  hint: RichText;
}

/** How the learner's answer is judged. Rubric/decision kinds score reasoning, not trade outcome. */
export type ExpectedEvaluation =
  | { kind: 'exact-choice'; choiceId: ChoiceId }
  | { kind: 'choice-set'; choiceIds: ChoiceId[] }
  | { kind: 'numeric'; value: number; tolerance: number; unit: string; rounding?: Rounding }
  /** v1.1.0: several named numeric answers in one exercise (e.g. risk amount, size, notional). */
  | { kind: 'numeric-set'; fields: Array<{ key: string; label: RichText; value: number; tolerance: number; unit: string; rounding?: Rounding }> }
  | { kind: 'sequence'; order: string[] }
  | { kind: 'classification'; buckets: Record<string, string[]> }
  | { kind: 'constraint'; description: RichText; simulatorId: SimulatorId }
  | {
      kind: 'decision';
      /** Acceptable decisions; WAIT/NO_TRADE/STOP_TRADING may be (and often should be) the best answer. */
      acceptable: DecisionWord[];
      /** v1.1.0: which decision set the learner chooses from (default "trade"). All `acceptable` words must be in it. */
      decisionSet?: DecisionSet;
      requiresRationale: boolean;
      /** Observations that a good rationale should mention (used for feedback, not keyword-only grading). */
      rationaleCues: RichText[];
    }
  | { kind: 'rubric'; criteria: Array<{ id: string; description: RichText }> };

export interface Exercise {
  id: ExerciseId;
  type: ExerciseType;
  title: RichText;
  fixtureId: FixtureId;
  /** Optional EDGE-08 simulator powering the widget (must be in SIMULATOR_IDS). */
  simulatorId?: SimulatorId;
  /**
   * v1.1.0 (D-09): choices for choice-based exercises (`choice-feedback`, choice steps of `decision-with-rationale`, …).
   * Required for `choice-feedback`. `parameters.choices` is still read but deprecated (warning).
   */
  choices?: Choice[];
  instructions: RichText;
  /** 2–4 steps, each with a hint. */
  steps: ExerciseStep[];
  /** Must include 'reset'; must include a non-drag equivalent whenever 'drag' is present. */
  allowedControls: ExerciseControl[];
  /** Type-specific JSON parameters (ranges, labels, choices), documented by EDGE-08 per type. */
  parameters: JsonObject;
  expectedEvaluation: ExpectedEvaluation;
  explanation: RichText;
  /** Shown on the exercise. Must state the data is fictional / illustrative. */
  fictionalDataLabel: RichText;
}
export const EXERCISE_STEPS_MIN = 2;
export const EXERCISE_STEPS_MAX = 4;

// ---------------------------------------------------------------- fixtures

export const FIXTURE_KINDS = [
  'ohlc-series', 'price-path', 'order-book', 'account-scenario', 'branching-paths', 'mock-terminal',
  'classification-set', 'fee-schedule',
  'toy-model', // v1.3.0 (D-54): parameters of an ILLUSTRATIVE model (e.g. price.linear-toy); free-form data
] as const;
export type FixtureKind = (typeof FIXTURE_KINDS)[number];

/** One synthetic candle. `t` is minutes from fixture start (no real timestamps). */
export interface Candle { t: number; o: number; h: number; l: number; c: number; v?: number }

export interface Fixture<TData extends JsonValue = JsonValue> {
  id: FixtureId;
  kind: FixtureKind;
  /** Always true. Real historical data is out of scope for v1. */
  fictional: true;
  label: string; // e.g. "Fictional educational data — not a real market"
  /** Symbol shown to learners; must be visibly fictional or explicitly labelled illustrative, e.g. "DEMO/USDT". */
  displaySymbol?: string;
  seed?: number;
  /** v1.3.0: 'ms' / 'seconds' added for standard series offsets (D-43). */
  units?: { price?: string; quantity?: string; time?: 'minutes' | 'seconds' | 'ms' };
  data: TData;
  version: string;
}

export interface FixtureProvider {
  get(id: FixtureId): Fixture | undefined;
  has(id: FixtureId): boolean;
  list(): readonly FixtureId[];
}

// ---------------------------------------------------------------- simulators

export const SIM_ERROR_CODES = [
  'NOT_A_NUMBER', 'ZERO', 'NEGATIVE', 'OUT_OF_RANGE', 'WRONG_SIDE', 'DIVIDE_BY_ZERO', 'INCONSISTENT_OHLC',
  'UNSUPPORTED', 'INVALID_INPUT',
] as const;
export type SimErrorCode = (typeof SIM_ERROR_CODES)[number];

export type SimResult<O> =
  | {
      ok: true;
      value: O;
      /** Human-readable assumptions shown next to results (e.g. "fees and funding excluded"). */
      assumptions: string[];
      /** true when the model is a simplification (e.g. approximate liquidation illustration). */
      approximate: boolean;
    }
  | { ok: false; error: { code: SimErrorCode; field?: string; message: string } };

export interface SimulatorDescriptor<I, O> {
  /** One of SIMULATOR_IDS, e.g. "pnl.linear", "ohlc.aggregate", "risk.position-size". */
  id: SimulatorId;
  version: string;
  description: string;
  /** Units for every input/output field, e.g. { entry: "USDT per BTC" }. */
  units: Readonly<Record<string, string>>;
  compute(input: I): SimResult<O>;
}
