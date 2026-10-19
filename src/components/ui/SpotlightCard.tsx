import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

type Props = { children: ReactNode; className?: string; tilt?: boolean };

// Glass card with a pointer-following glow and an optional soft 3D tilt.
export function SpotlightCard({ children, className, tilt = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (tilt) el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div ref={ref} className={cn("glass spotlight", className)} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
