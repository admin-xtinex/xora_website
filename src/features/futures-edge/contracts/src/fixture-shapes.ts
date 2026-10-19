/**
 * Standard fixture DATA shapes (v1.3.0, D-43). Owner: EDGE-00 (shape); EDGE-08 implements the provider and
 * EDGE-07/EDGE-08 render/consume. Applies to `Fixture.kind` 'ohlc-series' and 'price-path'. Other kinds stay free-form.
 *
 * Time (`t`, D-20 as amended by D-43):
 *  - number = milliseconds offset from the start of the series (≥ 0, integer). Sub-minute offsets are allowed
 *    (e.g. 5_000 = 5 s into a 1-minute candle). This is the recommended form for lesson content.
 *  - string = ISO-8601 date-time (e.g. '2000-01-01T00:05:00Z'), allowed for synthetic series only. The data stays fictional
 *    (`label: 'fictional'`); UIs must not present it as real market history (show relative time).
 *  - One series uses one form only; `t` strictly increases.
 * Extra keys are allowed in `data` (e.g. builder slider config, model answers) and are ignored by the shape check.
 */

/** Interval/timeframe label: digits + s | m | h | d, e.g. '1m', '5m', '15s'. */
export const FIXTURE_INTERVAL_PATTERN = /^[1-9][0-9]*(s|m|h|d)$/;

export type FixtureTime = number | string;

/** One candle in an `ohlc-series` fixture. All prices > 0; h ≥ max(o, c); l ≤ min(o, c); v ≥ 0. */
export type OhlcSeriesCandle = { t: FixtureTime; o: number; h: number; l: number; c: number; v?: number };

export type OhlcSeriesData = {
  interval: string;
  label: 'fictional';
  candles: OhlcSeriesCandle[];
  /** Optional display names, one per candle (e.g. 'A'..'F'). */
  labels?: string[];
};

/** One price sample in a `price-path` fixture. */
export type PricePathTick = {
  t: FixtureTime;
  /** Last traded price at t (the path value). */
  p: number;
  /** v1.3.0 (D-54): optional mark-price sample at t (T13 last vs mark). Must be > 0 when present. */
  mark?: number;
};

export type PricePathData = {
  /** Interval of the candle the path forms (optional for paths not tied to one candle). */
  interval?: string;
  label: 'fictional';
  ticks: PricePathTick[];
  /** If present it must equal first/max/min/last of `ticks` (open/high/low/close). */
  finalCandle?: OhlcSeriesCandle;
};
