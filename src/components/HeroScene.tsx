import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// The XORA hero artwork brought to life. Every animated layer is positioned in
// the image's own coordinates (fractions of its box), so it stays aligned with
// the red chart, the strands, the brain, the platform and the rising chart.
//
// Story: losing (red) trades flow up the strands into the brain, change colour
// inside it, and leave along the rising chart as green.

const RED = [255, 64, 88];
const VIOLET = [168, 85, 247];
const GREEN = [40, 235, 160];
const CYAN = [90, 200, 255];

const ENTRY = { x: 0.466, y: 0.395 }; // where the red strands meet the brain
const EXIT = { x: 0.738, y: 0.47 }; // where the rising chart leaves the brain
const BRAIN = { x: 0.598, y: 0.37, rx: 0.13, ry: 0.19 };
const PLATFORM = { x: 0.605, y: 0.705, rx: 0.31, ratio: 0.19 };

type Pt = { x: number; y: number };
type Trade = { stage: 0 | 1 | 2; t: number; dur: number; p0: Pt; c: Pt; p1: Pt; trail: Pt[] };
type Spark = { x: number; y: number; ph: number; sp: number; r: number; violet: boolean };
type Mote = { x: number; y: number; v: number };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const bez = (p0: Pt, c: Pt, p1: Pt, t: number): Pt => {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x, y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y };
};

function newTrade(): Trade {
  // Start somewhere on the red chart / strands on the left.
  const x0 = rand(-0.02, 0.36);
  const y0 = 0.52 + x0 * 0.35 + rand(-0.09, 0.12);
  return {
    stage: 0,
    t: 0,
    dur: rand(2.8, 4.4),
    p0: { x: x0, y: y0 },
    c: { x: rand(0.34, 0.42), y: rand(0.46, 0.6) },
    p1: { x: ENTRY.x + rand(-0.01, 0.015), y: ENTRY.y + rand(-0.03, 0.04) },
    trail: [],
  };
}

function SceneCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let W = 0;
    let H = 0;
    let raf = 0;
    let last = 0;
    let time = 0;
    let inView = true;
    let spawnIn = 0;
    let flash = 0;
    let trades: Trade[] = [];
    const motes: Mote[] = [];

    // Twinkling nodes scattered over the brain.
    const sparks: Spark[] = Array.from({ length: 54 }, () => {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      return {
        x: BRAIN.x + Math.cos(a) * BRAIN.rx * r,
        y: BRAIN.y + Math.sin(a) * BRAIN.ry * r * 0.92,
        ph: Math.random() * Math.PI * 2,
        sp: rand(0.8, 2.2),
        r: rand(1, 2.4),
        violet: Math.random() < 0.3,
      };
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const P = (p: Pt) => ({ x: p.x * W, y: p.y * H });

    const glow = (x: number, y: number, rad: number, col: number[], a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, rgba(col, a));
      g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    };

    const advance = (tr: Trade) => {
      tr.t = 0;
      tr.p0 = tr.p1;
      if (tr.stage === 0) {
        tr.stage = 1;
        tr.p1 = { x: EXIT.x + rand(-0.01, 0.01), y: EXIT.y + rand(-0.03, 0.02) };
        tr.c = { x: rand(0.56, 0.64), y: rand(0.22, 0.36) };
        tr.dur = rand(0.9, 1.3);
      } else {
        tr.stage = 2;
        flash = Math.min(1, flash + 0.2);
        // Ride the rising chart up to the top-right corner.
        tr.c = { x: rand(0.84, 0.9), y: rand(0.36, 0.46) };
        tr.p1 = { x: 1.03, y: rand(0.02, 0.26) };
        tr.dur = rand(2.2, 3.2);
      }
    };

    const colorOf = (tr: Trade) =>
      tr.stage === 0
        ? RED
        : tr.stage === 2
          ? GREEN
          : tr.t < 0.5
            ? mix(RED, VIOLET, tr.t * 2)
            : mix(VIOLET, GREEN, (tr.t - 0.5) * 2);

    const frame = (dt: number) => {
      time += dt;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      const unit = W / 1000;

      // Platform ripples.
      const pc = P(PLATFORM);
      for (let k = 0; k < 2; k++) {
        const t = ((time / 3.2 + k * 0.5) % 1 + 1) % 1;
        const rx = PLATFORM.rx * W * (0.12 + t * 0.95);
        ctx.strokeStyle = rgba(CYAN, (1 - t) * 0.45);
        ctx.lineWidth = 1.4 * unit + 0.4;
        ctx.beginPath();
        ctx.ellipse(pc.x, pc.y, rx, rx * PLATFORM.ratio, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      glow(pc.x, pc.y, 60 * unit, CYAN, 0.25 + Math.sin(time * 2.4) * 0.1);

      // Energy rising from the platform into the brain stem.
      if (Math.random() < dt * 14) motes.push({ x: PLATFORM.x + rand(-0.012, 0.012), y: PLATFORM.y - 0.01, v: rand(0.07, 0.13) });
      for (const m of motes) {
        m.y -= m.v * dt;
        const a = Math.min(1, (PLATFORM.y - m.y) / 0.04) * Math.max(0, (m.y - 0.5) / 0.08);
        const p = P(m);
        glow(p.x, p.y, 4 * unit + 2, CYAN, a * 0.8);
      }
      while (motes.length && motes[0].y < 0.5) motes.shift();

      // Brain nodes twinkle.
      for (const s of sparks) {
        const a = Math.pow(Math.max(0, Math.sin(time * s.sp + s.ph)), 6);
        if (a < 0.02) continue;
        const p = P(s);
        glow(p.x, p.y, (s.r * 4 + 4) * unit, s.violet ? VIOLET : CYAN, a * 0.8);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(p.x - s.r * 0.5 * unit, p.y - s.r * 0.5 * unit, s.r * unit, s.r * unit);
      }

      // Conversion glow when a trade leaves the brain.
      if (flash > 0.01) {
        const b = P(BRAIN);
        glow(b.x, b.y, BRAIN.rx * W * 1.25, GREEN, flash * 0.12);
        const e = P(EXIT);
        glow(e.x, e.y, 40 * unit, GREEN, flash * 0.35);
        flash *= Math.pow(0.35, dt);
      }

      // Trades: red in, through the brain, green out.
      spawnIn -= dt;
      const max = W < 900 ? 22 : 40;
      if (spawnIn <= 0 && trades.length < max) {
        trades.push(newTrade());
        spawnIn = rand(0.08, 0.24);
      }
      for (const tr of trades) {
        tr.t += dt / tr.dur;
        if (tr.t >= 1 && tr.stage < 2) advance(tr);
        const p = P(bez(tr.p0, tr.c, tr.p1, Math.min(1, tr.t)));
        tr.trail.push(p);
        if (tr.trail.length > 16) tr.trail.shift();
        const col = colorOf(tr);
        const n = tr.trail.length;
        ctx.lineWidth = 1.5 * unit + 0.5;
        for (let i = 1; i < n; i++) {
          ctx.strokeStyle = rgba(col, (i / n) * 0.6);
          ctx.beginPath();
          ctx.moveTo(tr.trail[i - 1].x, tr.trail[i - 1].y);
          ctx.lineTo(tr.trail[i].x, tr.trail[i].y);
          ctx.stroke();
        }
        glow(p.x, p.y, (tr.stage === 1 ? 11 : 7) * unit + 2, col, 0.95);
      }
      trades = trades.filter((tr) => !(tr.stage === 2 && tr.t >= 1));
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      frame(dt);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (inView && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) start();
      else cancelAnimationFrame(raf);
    });
    const ro = new ResizeObserver(resize);
    resize();
    start();
    io.observe(canvas);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return <canvas ref={ref} className="scene-layer" aria-hidden />;
}

export function HeroScene({ className, tags = true }: { className?: string; tags?: boolean }) {
  const img = {
    src: "/brand/xora-hero.webp",
    srcSet: "/brand/xora-hero-sm.webp 900w, /brand/xora-hero.webp 1672w",
    sizes: "(max-width: 900px) 200vw, 115vw",
    alt: "",
    decoding: "async" as const,
    draggable: false,
  };
  return (
    <div className={cn("scene", className)} aria-hidden>
      <div className="scene-inner">
        <img className="scene-layer scene-img" fetchPriority="high" {...img} />
        {/* The rising chart, shifted from cyan to green and breathing in. */}
        <img className="scene-layer scene-img scene-green" {...img} />
        <div className="scene-sweep" />
        <div className="scene-red" />
        <div className="scene-brain" />
        <SceneCanvas />
        {tags ? (
          <>
            <span className="flow-tag is-noise">
              <i /> Market Noise
            </span>
            <span className="flow-tag is-clear">
              <i /> Clearer Opportunity
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
