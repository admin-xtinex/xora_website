import { motion } from "motion/react";
import { Activity, ArrowDownRight, ArrowUpRight, BrainCircuit, Check, NotebookPen, Radar } from "lucide-react";
import { SHOWCASE } from "@/lib/content";
import { rng, type Candle } from "@/lib/series";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./ui/SectionHeading";
import { Sparkline } from "./ui/Sparkline";
import { SpotlightCard } from "./ui/SpotlightCard";

// A hand-shaped range: support → resistance → back to support → second test.
const WAYPOINTS = [22, 48, 76, 62, 44, 24, 30, 52, 70, 77];
const SUPPORT = 20;
const RESISTANCE = 79;
const N = 46;

function buildCandles(): Candle[] {
  const r = rng(42);
  const out: Candle[] = [];
  let prev = WAYPOINTS[0];
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * (WAYPOINTS.length - 1);
    const k = Math.min(WAYPOINTS.length - 2, Math.floor(t));
    const target = WAYPOINTS[k] + (WAYPOINTS[k + 1] - WAYPOINTS[k]) * (t - k);
    const c = target + (r() - 0.5) * 7;
    const o = prev;
    out.push({ o, c, h: Math.min(RESISTANCE + 3, Math.max(o, c) + r() * 4), l: Math.max(SUPPORT - 3, Math.min(o, c) - r() * 4) });
    prev = c;
  }
  return out;
}

const CANDLES = buildCandles();
const argMaxHigh = (from: number, to: number) =>
  CANDLES.slice(from, to).reduce((best, c, i) => (c.h > CANDLES[best].h ? from + i : best), from);
const TOUCHES = [argMaxHigh(0, N / 2), argMaxHigh(N / 2, N)];
const W = 640;
const H = 300;
const PAD = 26;
const y = (v: number) => PAD + (1 - v / 100) * (H - PAD * 2);
const STEP = (W - 60) / N;

function MarketChart() {
  return (
    <svg className="mchart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Illustrative chart: price ranging between support and resistance, now testing resistance a second time">
      <defs>
        <linearGradient id="resBand" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d946ef" stopOpacity="0.22" />
          <stop offset="1" stopColor="#d946ef" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="supBand" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#3ecbff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#3ecbff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="scan" x1="0" x2="1">
          <stop offset="0" stopColor="#3ecbff" stopOpacity="0" />
          <stop offset="0.94" stopColor="#3ecbff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#3ecbff" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={W} y1={PAD + g * (H - PAD * 2)} y2={PAD + g * (H - PAD * 2)} className="mchart-grid" />
      ))}

      <rect x="0" y={y(RESISTANCE) - 2} width={W} height="26" fill="url(#resBand)" />
      <line x1="0" x2={W} y1={y(RESISTANCE)} y2={y(RESISTANCE)} className="mchart-level is-res" />
      <text x={W - 8} y={y(RESISTANCE) - 8} textAnchor="end" className="mchart-tag is-res">
        RESISTANCE
      </text>

      <rect x="0" y={y(SUPPORT) - 24} width={W} height="26" fill="url(#supBand)" />
      <line x1="0" x2={W} y1={y(SUPPORT)} y2={y(SUPPORT)} className="mchart-level is-sup" />
      <text x={W - 8} y={y(SUPPORT) + 18} textAnchor="end" className="mchart-tag is-sup">
        SUPPORT
      </text>

      <g>
        {CANDLES.map((c, i) => {
          const x = 14 + i * STEP;
          const up = c.c >= c.o;
          const top = y(Math.max(c.o, c.c));
          const bh = Math.max(1.5, Math.abs(y(c.o) - y(c.c)));
          return (
            <motion.g
              key={i}
              className={up ? "candle is-up" : "candle is-down"}
              initial={{ opacity: 0, scaleY: 0.2 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.025 }}
              style={{ transformOrigin: `${x}px ${top + bh / 2}px` }}
            >
              <line x1={x + STEP * 0.3} x2={x + STEP * 0.3} y1={y(c.h)} y2={y(c.l)} />
              <rect x={x} y={top} width={STEP * 0.6} height={bh} rx="1" />
            </motion.g>
          );
        })}
      </g>

      {/* touch markers on each resistance test */}
      {TOUCHES.map((i) => (
        <circle key={i} cx={14 + i * STEP + STEP * 0.3} cy={y(CANDLES[i].h)} r="5" className="mchart-touch" />
      ))}

      <rect className="mchart-scan" x="0" y="0" width="90" height={H} fill="url(#scan)" />
    </svg>
  );
}

export function IntelligenceShowcaseSection() {
  return (
    <section id="intelligence" className="section showcase" aria-labelledby="intel-title">
      <div className="container">
        <SectionHeading id="intel-title" kicker={SHOWCASE.kicker} title={SHOWCASE.title} intro={SHOWCASE.intro} />

        <div className="bento">
          <SpotlightCard className="bento-main">
            <header className="panel-head">
              <span className="panel-title">
                <Radar size={17} aria-hidden /> Support &amp; Resistance
              </span>
              <span className="pill-live">
                <i /> Demo · illustrative
              </span>
            </header>
            <MarketChart />
            <motion.div
              className="ai-note"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <BrainCircuit size={18} aria-hidden />
              <p>
                <strong>XORA note · </strong>
                {SHOWCASE.annotation}
              </p>
            </motion.div>
          </SpotlightCard>

          <SpotlightCard className="bento-trend">
            <header className="panel-head">
              <span className="panel-title">
                <Activity size={17} aria-hidden /> Trend Analysis
              </span>
            </header>
            <ul className="trend-list">
              {SHOWCASE.trend.map((t, i) => (
                <li key={t.tf}>
                  <span className="trend-tf">{t.tf}</span>
                  <span className={cn("trend-bias", t.bias === "Bullish" ? "is-up" : "is-flat")}>{t.bias}</span>
                  <span className="trend-bar">
                    <motion.i
                      initial={{ width: 0 }}
                      whileInView={{ width: `${t.strength}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </SpotlightCard>

          <SpotlightCard className="bento-move">
            <header className="panel-head">
              <span className="panel-title">
                <ArrowUpRight size={17} aria-hidden /> Movement Overview
              </span>
              <span className="move-sym">BTCUSDT</span>
            </header>
            <div className="move-body">
              <span className="move-pct">+2.48%</span>
              <Sparkline seed={11} width={220} height={64} className="move-spark" />
            </div>
            <dl className="move-stats">
              <div>
                <dt>Volatility</dt>
                <dd>Moderate</dd>
              </div>
              <div>
                <dt>Volume vs avg</dt>
                <dd>Lower</dd>
              </div>
              <div>
                <dt>Structure</dt>
                <dd>Range</dd>
              </div>
            </dl>
          </SpotlightCard>

          {SHOWCASE.scenarios.map((s) => (
            <SpotlightCard key={s.label} className={cn("bento-scenario", s.tone === "up" ? "is-up" : "is-down")}>
              <span className="scenario-icon">
                {s.tone === "up" ? <ArrowUpRight size={20} aria-hidden /> : <ArrowDownRight size={20} aria-hidden />}
              </span>
              <div>
                <span className="scenario-k">Scenario</span>
                <strong>{s.label}</strong>
                <p>{s.line}</p>
              </div>
            </SpotlightCard>
          ))}

          <SpotlightCard className="bento-notes">
            <header className="panel-head">
              <span className="panel-title">
                <NotebookPen size={17} aria-hidden /> Strategy Notes
              </span>
            </header>
            <ul className="notes">
              {SHOWCASE.notes.map((n) => (
                <li key={n}>
                  <Check size={15} aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
