import { useEffect, useRef, useState } from "react";
import type { Transition } from "motion/react";

// Scroll-reveal state for an element:
//  "idle" — not reached yet (keep hidden, ready to animate in)
//  "in"   — scrolled into view (animate in)
//  "past" — the page jumped beyond it (a nav link, a deep link, a reload half-way down):
//           show it immediately, so scrolling back up never finds blank or replaying content.
export type Seen = "idle" | "in" | "past";

export function useSeen<T extends Element>(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState<Seen>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSeen("in");
        else if (e.boundingClientRect.bottom < 0) setSeen("past");
        else return;
        io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, seen] as const;
}

/** The transition to use for a reveal: instant when the element was jumped past. */
export const revealTransition = (seen: Seen, t: Transition): Transition => (seen === "past" ? { duration: 0 } : t);
