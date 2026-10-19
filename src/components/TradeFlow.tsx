import { useEffect, useRef, type RefObject } from "react";

// The hero story: losing (red) trades stream in from the left, pass through the
// XORA brain, and leave on the right as green. Candles ride a downtrend into the
// brain and an uptrend out of it; trade particles change colour inside the core.

const RED = [255, 59, 92];
const VIOLET = [168, 85, 247];
const GREEN = [34, 227, 160];

type Pt = { x: number; y: number };
type Candle = { x: number; off: number; body: number; wickT: number; wickB: number };
type Trade = {
  stage: 0 | 1 | 2;
  t: number;
  dur: number;
  p0: Pt;
  c: Pt;
  p1: Pt;
  trail: Pt[];
};

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const bez = (p0: Pt, c: Pt, p1: Pt, t: number): Pt => {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x, y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y };
};
const rand = (a: number, b: number) => a + Math.random() * (b - a);

// Brain centre inside the xora-core video frame (fractions of its box).
const BRAIN_X = 0.6;
const BRAIN_Y = 0.4;
const BRAIN_R = 0.12;

export function TradeFlow({ anchor, className }: { anchor: RefObject<HTMLElement | null>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    let w = 0;
    let h = 0;
    let bx = 0;
    let by = 0;
    let br = 40;
    let span = 60;
    let step = 16;
    let left: Candle[] = [];
    let right: Candle[] = [];
    let trades: Trade[] = [];
    let flash = 0;
    let spawnIn = 0;
    let raf = 0;
    let last = 0;
    let inView = true;
    let frame = 0;

    const measure = () => {
      const a = anchor.current;
      if (!a) return;
      const cr = canvas.getBoundingClientRect();
      const ar = a.getBoundingClientRect();
      bx = ar.left - cr.left + ar.width * BRAIN_X;
      by = ar.top - cr.top + ar.height * BRAIN_Y;
      br = ar.width * BRAIN_R;
      span = br * 1.6;
      step = Math.max(12, br * 0.16);
    };

    // Downtrend into the brain, uptrend out of it.
    const yLeft = (x: number) => {
      const end = bx - br;
      const t = clamp01(x / Math.max(1, end));
      return by - span * 0.95 + t * (span * 1.05);
    };
    const yRight = (x: number) => {
      const start = bx + br;
      const t = clamp01((x - start) / Math.max(1, w - start));
      return by + span * 0.1 - t * span * 1.5;
    };

    const newCandle = (x: number): Candle => ({
      x,
      off: rand(-step * 0.9, step * 0.9),
      body: rand(step * 0.5, step * 1.6),
      wickT: rand(1, step * 0.7),
      wickB: rand(1, step * 0.7),
    });

    const seed = () => {
      left = [];
      right = [];
      for (let x = -step; x < bx - br * 0.6; x += step) left.push(newCandle(x));
      for (let x = bx + br * 0.7; x < w + step; x += step) right.push(newCandle(x));
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measure();
      seed();
      trades = [];
    };

    const startTrade = (): Trade => {
      const y0 = yLeft(0) + rand(-span * 0.6, span * 0.9);
      const p1 = { x: bx - br * 0.55, y: by + rand(-br * 0.35, br * 0.35) };
      return {
        stage: 0,
        t: 0,
        dur: rand(3.6, 5.4),
        p0: { x: -12, y: y0 },
        c: { x: bx * rand(0.4, 0.7), y: y0 + rand(-span * 0.4, span * 0.5) },
        p1,
        trail: [],
      };
    };

    const nextStage = (tr: Trade) => {
      if (tr.stage === 0) {
        tr.stage = 1;
        tr.p0 = tr.p1;
        tr.p1 = { x: bx + br * 0.55, y: by + rand(-br * 0.3, br * 0.3) };
        tr.c = { x: bx, y: by + rand(-br * 0.6, br * 0.2) };
        tr.dur = rand(0.8, 1.2);
      } else {
        tr.stage = 2;
        flash = Math.min(1, flash + 0.18);
        tr.p0 = tr.p1;
        const ey = yRight(w) + rand(-span * 0.5, span * 0.7);
        tr.p1 = { x: w + 12, y: ey };
        tr.c = { x: bx + (w - bx) * rand(0.35, 0.6), y: tr.p0.y - rand(0, span * 0.6) };
        tr.dur = rand(2.8, 4);
      }
      tr.t = 0;
    };

    const colorOf = (tr: Trade) => {
      if (tr.stage === 0) return RED;
      if (tr.stage === 2) return GREEN;
      return tr.t < 0.5 ? mix(RED, VIOLET, tr.t * 2) : mix(VIOLET, GREEN, (tr.t - 0.5) * 2);
    };

    const drawCandle = (c: Candle, y: number, color: number[], alpha: number, bullish: boolean) => {
      if (alpha <= 0.01) return;
      const cw = step * 0.55;
      const top = y - c.body / 2;
      ctx.strokeStyle = rgba(color, alpha * 0.8);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(c.x + cw / 2, top - c.wickT);
      ctx.lineTo(c.x + cw / 2, top + c.body + c.wickB);
      ctx.stroke();
      ctx.fillStyle = rgba(color, alpha * (bullish ? 0.9 : 0.75));
      ctx.fillRect(c.x, top, cw, c.body);
    };

    const drawTag = (text: string, x: number, y: number, color: number[]) => {
      ctx.font = "600 10px Manrope, sans-serif";
      ctx.letterSpacing = "1.6px";
      const tw = ctx.measureText(text).width;
      const pw = tw + 30;
      const ph = 24;
      const left0 = Math.max(8, Math.min(w - pw - 8, x - pw / 2));
      ctx.fillStyle = "rgba(6,9,22,0.72)";
      ctx.strokeStyle = rgba(color, 0.8);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(left0, y - ph / 2, pw, ph, ph / 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = rgba(color, 1);
      ctx.beginPath();
      ctx.arc(left0 + 12, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.textBaseline = "middle";
      ctx.fillText(text, left0 + 21, y + 0.5);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const v = br * 0.32 * dt; // conveyor speed

      // Left: red downtrend sliding into the brain and dissolving. Candles fade in
      // a few brain-widths out so the headline area stays calm.
      const absorbAt = bx - br * 0.55;
      const fadeFrom = bx - br * 5;
      for (const c of left) {
        c.x += v;
        const a = clamp01((absorbAt - c.x) / (br * 0.9)) * clamp01((c.x - fadeFrom) / (br * 1.8));
        const pull = 1 - clamp01((absorbAt - c.x) / (br * 0.9));
        const y = yLeft(c.x) + c.off * (1 - pull) + (by - yLeft(c.x)) * pull * 0.5;
        drawCandle(c, y, RED, a * 0.7, false);
      }
      left = left.filter((c) => c.x < absorbAt);
      if (!left.length || left[0].x > -step * 0.2) left.unshift(newCandle(left.length ? left[0].x - step : -step));

      // Right: green uptrend emerging from the brain.
      const emitAt = bx + br * 0.6;
      for (const c of right) {
        c.x += v;
        const a = clamp01((c.x - emitAt) / (br * 0.8)) * clamp01((w - c.x) / (w * 0.06));
        drawCandle(c, yRight(c.x) + c.off * 0.6, GREEN, a * 0.85, true);
      }
      right = right.filter((c) => c.x < w + step);
      const first = right[0];
      if (!first || first.x > emitAt + step * 0.2) right.unshift(newCandle((first ? first.x : emitAt + step) - step));

      // Conversion glow at the core.
      if (flash > 0.01) {
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br * 1.4);
        g.addColorStop(0, rgba(GREEN, flash * 0.22));
        g.addColorStop(0.5, rgba(VIOLET, flash * 0.1));
        g.addColorStop(1, rgba(VIOLET, 0));
        ctx.fillStyle = g;
        ctx.fillRect(bx - br * 1.4, by - br * 1.4, br * 2.8, br * 2.8);
        flash *= Math.pow(0.4, dt);
      }

      if (w >= 640) {
        drawTag("MARKET NOISE", bx - br * 2.6, yLeft(bx - br * 2.6) + span * 0.95, RED);
        drawTag("CLEARER OPPORTUNITY", bx + br * 2.6, yRight(bx + br * 2.6) + span * 0.95, GREEN);
      }

      if (reduce) return;

      // Trade particles.
      spawnIn -= dt;
      const max = w < 768 ? 16 : 34;
      if (spawnIn <= 0 && trades.length < max) {
        trades.push(startTrade());
        spawnIn = rand(0.12, 0.35) * (w < 768 ? 2 : 1);
      }
      ctx.globalCompositeOperation = "lighter";
      for (const tr of trades) {
        tr.t += dt / tr.dur;
        if (tr.t >= 1 && tr.stage < 2) nextStage(tr);
        const p = bez(tr.p0, tr.c, tr.p1, Math.min(1, tr.t));
        tr.trail.push(p);
        if (tr.trail.length > 14) tr.trail.shift();
        const col = colorOf(tr);
        const n = tr.trail.length;
        ctx.lineWidth = 1.6;
        for (let i = 1; i < n; i++) {
          ctx.strokeStyle = rgba(col, (i / n) * 0.55);
          ctx.beginPath();
          ctx.moveTo(tr.trail[i - 1].x, tr.trail[i - 1].y);
          ctx.lineTo(tr.trail[i].x, tr.trail[i].y);
          ctx.stroke();
        }
        const glow = tr.stage === 1 ? 9 : 6;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
        g.addColorStop(0, rgba(col, 0.9));
        g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g;
        ctx.fillRect(p.x - glow, p.y - glow, glow * 2, glow * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(p.x - 0.8, p.y - 0.8, 1.6, 1.6);
      }
      ctx.globalCompositeOperation = "source-over";
      trades = trades.filter((tr) => !(tr.stage === 2 && tr.t >= 1));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      if (++frame % 30 === 0) measure();
      draw(dt);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) return;
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
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });

    resize();
    if (reduce) draw(0);
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
  }, [anchor]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
