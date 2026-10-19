/**
 * Machine-checkable formulas (v1.1.0, additive). Owner: EDGE-00 (types). Decision D-15.
 * A lesson may declare `formulas`. Each one names the EDGE-08 simulator that recomputes its worked examples in CI.
 * The formula text the learner sees still lives in `formula` content blocks (which may cite `formulaId`).
 */
import type { FormulaId } from './ids';
import type { RichText } from './content';
import type { SimulatorId } from './simulators';

export interface FormulaWorkedExample {
  label: string;
  /** Which side, for directional formulas. */
  side?: 'long' | 'short';
  /** Simulator inputs. Keys and units as documented by EDGE-08 for `simulatorId`. */
  inputs: Readonly<Record<string, number>>;
  /** Expected outputs. These must also appear in the learner-visible worked example. */
  outputs: Readonly<Record<string, number>>;
  /** Absolute tolerance used when recomputing. */
  tolerance: number;
  assumptions: string[];
}

export interface Formula {
  id: FormulaId;
  name: RichText;
  /** Human-readable expression, e.g. "allowed notional ≈ risk amount ÷ (|entry − stop| ÷ entry)". */
  expression: string;
  variables: Array<{ symbol: string; meaning: RichText; unit: string }>;
  simulatorId: SimulatorId;
  /** true if the model is a simplification (it must then be labelled "approximate" wherever it is shown). */
  approximate: boolean;
  workedExamples: FormulaWorkedExample[];
}
