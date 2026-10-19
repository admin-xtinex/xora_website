import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// The XORA hero loop: market flow through the brain, played in reverse
// (pre-rendered reversed, with a crossfaded loop point).

export function HeroScene({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;

    // Only play while visible.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => undefined);
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className={cn("scene", className)} aria-hidden>
      <div className="scene-inner">
        <video
          ref={ref}
          className="scene-layer scene-video"
          src="/brand/xora-flow.mp4"
          poster="/brand/xora-flow-poster.webp"
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
