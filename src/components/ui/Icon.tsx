import {
  BookOpen,
  BrainCircuit,
  ChartCandlestick,
  Compass,
  Gauge,
  GraduationCap,
  Layers,
  MonitorPlay,
  ShieldCheck,
  Sprout,
  type LucideProps,
} from "lucide-react";

const ICONS = {
  learn: GraduationCap,
  analysis: ChartCandlestick,
  risk: ShieldCheck,
  practice: MonitorPlay,
  complexity: Layers,
  effort: Gauge,
  discover: Compass,
  grow: Sprout,
  brain: BrainCircuit,
  book: BookOpen,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, ...rest }: { name: IconName } & LucideProps) {
  const Cmp = ICONS[name];
  return <Cmp strokeWidth={1.6} aria-hidden {...rest} />;
}
