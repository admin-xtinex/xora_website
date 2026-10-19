import { useId, useMemo } from "react";
import { toSmoothPath, walk } from "@/lib/series";

type Props = { seed: number; width?: number; height?: number; drift?: number; className?: string };

export function Sparkline({ seed, width = 120, height = 36, drift = 0.6, className }: Props) {
  const id = useId().replace(/:/g, "");
  const d = useMemo(() => toSmoothPath(walk(28, seed, drift), width, height, 3), [seed, width, height, drift]);
  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" x2="1">
          <stop offset="0" stopColor="#3ecbff" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3ecbff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#3ecbff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#${id}f)`} />
      <path className="spark-line" d={d} fill="none" stroke={`url(#${id}s)`} strokeWidth="1.6" pathLength={1} />
    </svg>
  );
}
