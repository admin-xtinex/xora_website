/** Minimal Web Storage shape + in-memory implementation + safe localStorage probe (EDGE-09). */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class MemoryStorage implements StorageLike {
  private readonly m = new Map<string, string>();
  getItem(k: string): string | null { return this.m.has(k) ? (this.m.get(k) as string) : null; }
  setItem(k: string, v: string): void { this.m.set(k, String(v)); }
  removeItem(k: string): void { this.m.delete(k); }
  keys(): string[] { return [...this.m.keys()]; }
}

/**
 * Returns window.localStorage only if a real write/read/remove round trip works (Safari private mode, disabled
 * cookies, sandboxed iframes and SSR all fail here). Otherwise null → caller falls back to memory.
 */
export function probeLocalStorage(candidate?: unknown): StorageLike | null {
  try {
    const s = (candidate ?? (globalThis as { localStorage?: unknown }).localStorage) as StorageLike | undefined;
    if (!s || typeof s.getItem !== 'function' || typeof s.setItem !== 'function') return null;
    const k = 'xora.futuresEdge.v1.__probe__';
    s.setItem(k, '1');
    const ok = s.getItem(k) === '1';
    s.removeItem(k);
    return ok ? s : null;
  } catch {
    return null;
  }
}
