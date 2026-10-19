import { createContext, useContext, useEffect, useState } from 'react';
import type { GlossaryEntry } from '@futures-edge/contracts';

/** true when the user asked the OS for reduced motion. Updates live. */
export function useReducedMotion(): boolean {
  const q = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const m = window.matchMedia(q);
    const on = () => setReduced(m.matches);
    m.addEventListener?.('change', on);
    return () => m.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

export interface GlossaryApi {
  byId: ReadonlyMap<string, GlossaryEntry>;
  open: (termId: string) => void;
}
export const GlossaryContext = createContext<GlossaryApi>({ byId: new Map(), open: () => {} });
export const useGlossary = () => useContext(GlossaryContext);
