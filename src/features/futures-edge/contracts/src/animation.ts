/**
 * Animation scene contract + scene-type registry interface.
 * Owner: EDGE-00 (types, allowed list). Implementation of renderers + registry: EDGE-07 (Motion Studio).
 *
 * A lesson's `animationScenes` array is ONE ordered timeline of 4–8 steps. Each step names a registered
 * scene `type` and passes JSON `parameters`; the renderer must not need per-lesson custom code.
 * Adding a new scene type = MINOR schema bump requested via the shared issue log, approved by EDGE-00 + EDGE-07.
 */
import type { SceneId, FixtureId, GlossaryTermId } from './ids';
import type { JsonObject } from './json';
import type { RichText } from './content';
import type { ValidationIssue } from './validation-types';

/** Initial allowed scene types (v1.0.0). Parameter shapes are specified by EDGE-07 per type. */
export const SCENE_TYPES = [
  'text-card',             // caption/heading card, e.g. risk warning step (no decorative-only use)
  'value-exchange',        // T01 digital value / balance x price
  'supply-demand',         // T02 buyer/seller queues moving an illustrative price
  'trading-pair',          // T03 base/quote calculator
  'order-book-matching',   // T04/T07 bids/asks, matching, spread, partial fills
  'order-placement',       // T07 market/limit/stop behaviour, slippage, unfilled limit
  'price-path',            // generic synthetic price line over time
  'pnl-meter',             // T05/T06 long/short PnL meters on a shared path
  'sl-tp-lines',           // T08 entry/SL/TP lines, triggered vs filled, gap scenario
  'fee-buildup',           // T09 gross -> net with fees/spread/slippage, break-even move
  'mock-terminal-tour',    // T10 fictional generic futures terminal hotspots
  'spot-vs-futures',       // T11 ownership vs derivative exposure side by side
  'leverage-exposure',     // T12 same move at 1x/3x/10x vs margin and notional
  'margin-buffer',         // T13 conceptual (not exchange-accurate) margin buffer shrink
  'funding-clock',         // T13 periodic funding charges/credits
  'candle-formation',      // T14 live-forming OHLC candle, body/wicks
  'timeframe-aggregation', // T15 1m -> 5m -> 15m aggregation
  'market-structure',      // T16 HH/HL/LH/LL highlighting
  'support-resistance-zone', // T17 zone touches/retests
  'breakout-fakeout',      // T17/T21 branching continuation vs false breakout
  'volume-bars',           // T18 volume aligned with candles
  'range-overlay',         // T18 lookback max/min/range%
  'position-sizing',       // T22 risk bar vs notional
  'branching-paths',       // T21 identical past, multiple possible futures
  'trade-lifecycle',       // T23 setup -> decision -> monitor -> exit -> review
] as const;
export type SceneType = (typeof SCENE_TYPES)[number];

/**
 * v1.1.0 (D-08): reserved parameter `variant` picks a sub-visualisation of a scene type. `mode` is a deprecated
 * alias (warning). For the types listed here, the variant must be one of the listed values. For other types,
 * any variant produces a warning until EDGE-07 registers it. EDGE-07 documents the parameters for each variant.
 */
export const SCENE_VARIANTS: Readonly<Partial<Record<SceneType, readonly string[]>>> = {
  'text-card': ['plain', 'checklist', 'recap', 'red-flags', 'risk-warning'],
  'order-placement': ['open-close-buttons', 'market-vs-limit', 'stop-trigger', 'slippage-jump'],
  'pnl-meter': ['long-short-parallel', 'timeline', 'single-position'], // single-position: v1.3.0 (D-52)
  // v1.3.0 (D-46), Phase 1 shapes from EDGE-02 T01–T04 (+ EDGE-03 T05-A02 'swap'); EDGE-07 to confirm
  'value-exchange': ['ledger-record', 'balance-quantity', 'value-from-price', 'swap'],
  'supply-demand': ['balanced', 'demand-up', 'supply-up', 'thin-market'],
  'trading-pair': ['price-tag', 'split', 'size-compare', 'convert-quote-to-base', 'reprice'],
  // v1.3.0 (D-42), T14 reference shapes (EDGE-05)
  'candle-formation': ['forming', 'measure', 'compare', 'groups'],
  // v1.2.0 (D-36)
  'sl-tp-lines': ['setup', 'target-hit', 'stop-filled', 'gap-fill', 'stop-limit-unfilled', 'near-miss'],
  'order-book-matching': ['match', 'market-sweep', 'limit-partial-fill', 'bid-ask-spread', 'empty-book'],
  'fee-buildup': ['compare-roles', 'waterfall', 'gross-to-net', 'break-even', 'accumulate'],
  'spot-vs-futures': ['ownership', 'crash-comparison'],
  'leverage-exposure': ['exposure-bars', 'pnl-amplification'],
  'margin-buffer': ['margin-used-up', 'isolated-vs-cross', 'maintenance-gauge', 'tier-comparison'],
  'price-path': ['plain', 'horizon-compare'],
  'volume-bars': ['plain', 'retest'],
  'position-sizing': ['risk-budget', 'builder'],
  'trade-lifecycle': ['full', 'decision-gate', 'journal'],
};

/**
 * v1.3.0 (D-52): what an OMITTED `parameters.variant` means. If the type has an entry here, omission = that variant
 * (EDGE-07 renders it; authors may also write it explicitly). If a type with a variant list has NO entry here, omission
 * means "EDGE-07's documented base rendering" and authors SHOULD set a variant (EDGE-07 dispatches on it).
 */
export const SCENE_DEFAULT_VARIANTS: Partial<Record<SceneType, string>> = {
  'text-card': 'plain',
  'pnl-meter': 'single-position',
  'price-path': 'plain',
  'volume-bars': 'plain',
  'sl-tp-lines': 'setup',
  'order-book-matching': 'match',
  'trade-lifecycle': 'full',
};

/**
 * v1.3.0 (D-53): reserved parameter key `parameters.branchId` (scenes and exercises) = id of one path inside the
 * item's `branching-paths` fixture (narrative ids such as 'gap-down' are fine). It is independent of `variant`
 * (variant = how to draw; branchId = which data). Kebab-case; requires `fixtureId` on the same scene/exercise.
 */
export const BRANCH_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;


export const PLAYBACK_SPEEDS = [0.75, 1, 1.25] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export interface AnimationScene {
  id: SceneId;
  type: SceneType;
  /** Step duration at 1x. If omitted, the scene definition's defaultDurationMs is used. */
  durationMs?: number;
  /** Visible caption; the timeline must be fully understandable from captions alone (no audio). */
  caption: RichText;
  /** Optional longer narration script (text). Audio assets are optional and out of contract scope. */
  narration?: RichText;
  /** Type-specific, JSON-only parameters validated by the registered SceneDefinition. */
  parameters: JsonObject;
  /** Synthetic data source, when the scene draws prices/candles. */
  fixtureId?: FixtureId;
  /** Pause and wait for learner input (e.g. "drag the close price") before continuing. */
  pauseForInteraction?: { prompt: RichText };
  /** Text/static equivalent used under prefers-reduced-motion and for screen readers. REQUIRED. */
  reducedMotionDescription: RichText;
  glossaryRefs?: GlossaryTermId[];
}
export const SCENES_MIN = 4;
export const SCENES_MAX = 8;
/** Timeline length targets (ms) — master prompt says 90–240 s, blueprint says 3–6 min equivalent. Validator WARNS only. */
export const TIMELINE_TARGET_MS = { min: 90_000, max: 360_000 } as const;

/** Playback controller every rendered scene must expose (EDGE-07 implements; EDGE-01 drives it). */
export interface ScenePlaybackController {
  play(): void;
  pause(): void;
  /** Jump to an offset inside the current scene (ms at 1x). */
  seek(ms: number): void;
  setSpeed(speed: PlaybackSpeed): void;
  /** Release timers/animation frames/listeners. Must be idempotent. */
  destroy(): void;
}

export interface SceneRenderContext {
  reducedMotion: boolean;
  speed: PlaybackSpeed;
  locale: string;
  /** Resolve a synthetic fixture by id (provided by EDGE-08's FixtureProvider). */
  getFixture: (id: FixtureId) => unknown;
  /** Polite screen-reader announcement for important state changes (throttled by the shell). */
  announce: (message: string) => void;
  onComplete: () => void;
}

/**
 * A registered scene type. `TRender` is the framework-specific renderer (e.g. a React component) —
 * kept generic so the contract does not depend on any UI framework.
 */
export interface SceneDefinition<TRender = unknown> {
  type: SceneType;
  /** Semver of this scene implementation. */
  version: string;
  defaultDurationMs: number;
  /** Return [] when valid. Must never throw for any JSON input. */
  validateParameters(parameters: JsonObject): ValidationIssue[];
  /** What is shown under reduced motion: a static final frame, or text only. */
  reducedMotionMode: 'static-frame' | 'text-only';
  render: TRender;
}

export interface SceneRegistry<TRender = unknown> {
  register(def: SceneDefinition<TRender>): void; // throws on duplicate type or type not in SCENE_TYPES
  get(type: SceneType): SceneDefinition<TRender> | undefined;
  has(type: string): type is SceneType;
  list(): readonly SceneType[];
}

export function isSceneType(v: unknown): v is SceneType {
  return typeof v === 'string' && (SCENE_TYPES as readonly string[]).includes(v);
}
