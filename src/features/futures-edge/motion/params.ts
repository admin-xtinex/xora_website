/** Safe readers for JSON scene/exercise parameters, plus a tiny declarative checker for `validateParameters`. */
import type { Fixture, JsonObject, JsonValue, ValidationIssue } from '@futures-edge/contracts';

export const isObj = (v: unknown): v is Record<string, JsonValue> => typeof v === 'object' && v !== null && !Array.isArray(v);
export const numOr = (v: unknown, d: number): number => (typeof v === 'number' && Number.isFinite(v) ? v : d);
export const strOr = (v: unknown, d: string): string => (typeof v === 'string' ? v : d);
export const nums = (v: unknown): number[] => (Array.isArray(v) ? v.filter((x): x is number => typeof x === 'number' && Number.isFinite(x)) : []);
export const strs = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
export const objs = (v: unknown): Array<Record<string, JsonValue>> => (Array.isArray(v) ? v.filter(isObj) : []);

export type Kind = 'number' | 'numbers' | 'string' | 'strings' | 'object' | 'objects' | 'boolean';
export interface ParamSpec { required?: Record<string, Kind>; optional?: Record<string, Kind> }

function kindOk(v: unknown, k: Kind): boolean {
  switch (k) {
    case 'number': return typeof v === 'number' && Number.isFinite(v);
    case 'numbers': return Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'number' && Number.isFinite(x));
    case 'string': return typeof v === 'string' && v.length > 0;
    case 'strings': return Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string');
    case 'object': return isObj(v);
    case 'objects': return Array.isArray(v) && v.length > 0 && v.every(isObj);
    case 'boolean': return typeof v === 'boolean';
  }
}

/** Parameters reserved by the contracts for every scene/exercise. */
const RESERVED = new Set(['variant', 'branchId']);

export function checkParams(params: JsonObject, spec: ParamSpec, path = 'parameters'): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  for (const [k, kind] of Object.entries(spec.required ?? {})) {
    if (!kindOk(params[k], kind)) out.push({ path: `${path}.${k}`, code: 'PARAM_REQUIRED', message: `${k} must be ${kind}`, severity: 'error' });
  }
  for (const [k, kind] of Object.entries(spec.optional ?? {})) {
    if (params[k] !== undefined && !kindOk(params[k], kind)) out.push({ path: `${path}.${k}`, code: 'PARAM_TYPE', message: `${k} must be ${kind}`, severity: 'error' });
  }
  const known = new Set([...Object.keys(spec.required ?? {}), ...Object.keys(spec.optional ?? {})]);
  for (const k of Object.keys(params)) {
    if (!known.has(k) && !RESERVED.has(k)) out.push({ path: `${path}.${k}`, code: 'PARAM_UNKNOWN', message: `unknown parameter ${k}`, severity: 'error' });
  }
  return out;
}

// ------------------------------------------------------------------ fixture data readers

export interface SeriesCandle { t: number; o: number; h: number; l: number; c: number; v?: number }

export function candlesOf(f: Fixture | undefined): SeriesCandle[] {
  if (!f || !isObj(f.data)) return [];
  return objs(f.data['candles']).map((c, i) => ({
    t: typeof c['t'] === 'number' ? c['t'] : i * 60_000,
    o: numOr(c['o'], NaN), h: numOr(c['h'], NaN), l: numOr(c['l'], NaN), c: numOr(c['c'], NaN),
    ...(typeof c['v'] === 'number' ? { v: c['v'] } : {}),
  }));
}
export function ticksOf(f: Fixture | undefined): Array<{ t: number; p: number; mark?: number }> {
  if (!f || !isObj(f.data)) return [];
  return objs(f.data['ticks']).map((k, i) => ({ t: typeof k['t'] === 'number' ? k['t'] : i, p: numOr(k['p'], NaN), ...(typeof k['mark'] === 'number' ? { mark: k['mark'] } : {}) }));
}
export function labelsOf(f: Fixture | undefined): string[] {
  return f && isObj(f.data) ? strs(f.data['labels']) : [];
}
export interface Branching { past: number[]; branches: Array<{ id: string; label: string; points: number[]; note?: string }>; level?: { price: number; label: string } }
export function branchingOf(f: Fixture | undefined, params?: JsonObject): Branching {
  const src = f && f.kind === 'branching-paths' && isObj(f.data) ? f.data : params ?? {};
  const lv = isObj(src['level']) ? src['level'] : undefined;
  return {
    past: nums(src['past']),
    branches: objs(src['branches']).map((b) => ({ id: strOr(b['id'], ''), label: strOr(b['label'], ''), points: nums(b['points']), ...(typeof b['note'] === 'string' ? { note: b['note'] } : {}) })),
    ...(lv ? { level: { price: numOr(lv['price'], NaN), label: strOr(lv['label'], '') } } : {}),
  };
}
