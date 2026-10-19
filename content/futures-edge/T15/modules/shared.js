window.UI = {
  LESSON: 'T15 · 1m / 5m / 15m timeframes',
  TOTAL: 296,
  lockup(kit) {
    return kit.h('<div class="lock"><img alt="" src="' + kit.assets.url('xtinex-x.png') + '"><span class="lock-xt">XTINEX</span><span class="lock-bar"></span><span class="lock-xo">XORA</span></div>');
  },
  // Lesson header: lesson name and a progress bar across the whole film.
  chrome(kit) {
    const el = kit.h('<div class="chrome"><span>' + kit.esc(UI.LESSON) + '</span><div><i></i></div></div>');
    kit.stage.append(el);
    const bar = el.querySelector('i').style, start = kit.start;
    return (t) => { bar.width = (Math.min(1, (start + t) / UI.TOTAL) * 100).toFixed(2) + '%'; };
  },
  fmt(n, dp) { return n.toLocaleString('en-US', { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 }); },
  // Deterministic fictional price walk: returns [[x,y],...] across x0..x1.
  walk(kit, seed, n, x0, x1, y0, y1, amp) {
    const r = kit.rng(seed); const pts = []; let v = 0;
    for (let i = 0; i < n; i++) {
      v += (r() - 0.5) * amp; v *= 0.86;
      const p = i / (n - 1);
      pts.push([x0 + (x1 - x0) * p, y0 + (y1 - y0) * p + v]);
    }
    return pts;
  },
  d(pts) { return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' '); },
  // The tutor sits in this corner between scenes: feet x, feet y, brain width (px).
  CORNER: { x: 1735, y: 1042, s: 160 },
  // The brain tutor. cfg.keys: [{t, x, y, s, d?, ease?}] feet position and brain width, each key reached at t after a d-second move.
  // cfg.poses: [{t, pose, flip?}] ('wave' and 'walk' play their frame loops). cfg.says: [{t0, t1, text, side?: 'left'|'top'}].
  tutor(kit, cfg) {
    const M = kit.json('tutor.json');
    const root = kit.h('<div class="tutor"></div>');
    const shadow = kit.h('<div class="tutor-shadow"></div>');
    root.append(shadow);
    const imgs = {};
    for (const n of Object.keys(M)) {
      const im = kit.h('<img class="tutor-img" alt="" src="' + kit.assets.url('tutor-' + n + '.webp') + '">');
      imgs[n] = im.style; root.append(im);
    }
    const says = (cfg.says || []).map((s) => {
      const b = kit.h('<div class="bubble' + (s.side === 'top' ? ' is-top' : '') + '"><p>' + kit.esc(s.text) + '</p></div>');
      root.append(b);
      return Object.assign({}, s, { st: b.style });
    });
    kit.stage.append(root);
    const keys = cfg.keys, poses = cfg.poses;
    const LOOPS = {
      wave: { f: ['wv1', 'wv2', 'wv3', 'wv4', 'wv3', 'wv2'], fps: 7 },
      walk: { f: ['wk0', 'wk1', 'wk2', 'wk3', 'wk4', 'wk5', 'wk6', 'wk7'], fps: 11 },
    };
    const name = (p, dt) => { const L = LOOPS[p.pose]; return L ? L.f[Math.floor(Math.max(0, dt) * L.fps) % L.f.length] : p.pose; };
    let shown = [];
    const place = (n, flip, x, y, s, op, sc, lift) => {
      const m = M[n], st = imgs[n], k = s / m.bw;
      st.width = (m.w * k).toFixed(1) + 'px'; st.height = (m.h * k).toFixed(1) + 'px';
      st.left = (x - m.ax * k).toFixed(1) + 'px'; st.top = (y - m.feet * k).toFixed(1) + 'px';
      st.transformOrigin = (m.ax * k).toFixed(1) + 'px ' + (m.feet * k).toFixed(1) + 'px';
      st.transform = 'translateY(' + lift.toFixed(2) + 'px) scale(' + (flip ? -sc : sc).toFixed(4) + ',' + sc.toFixed(4) + ')';
      st.opacity = op;
      shown.push(n);
    };
    const api = {
      at(t) {
        let x = keys[0].x, y = keys[0].y, s = keys[0].s;
        for (let i = 1; i < keys.length; i++) {
          const a = keys[i - 1], b = keys[i], d = b.d == null ? 0.8 : b.d;
          const p = kit.seg(t, b.t - d, b.t);
          if (p <= 0) break;
          const e = (b.ease || kit.eio)(p);
          x = kit.lerp(a.x, b.x, e); y = kit.lerp(a.y, b.y, e); s = kit.lerp(a.s, b.s, e);
        }
        return { x, y, s };
      },
      render(t) {
        for (const n of shown) imgs[n].opacity = 0;
        shown = [];
        const { x, y, s } = api.at(t);
        let i = 0;
        for (let j = 0; j < poses.length; j++) if (poses[j].t <= t) i = j;
        const cur = poses[i], dt = t - cur.t;
        const sw = i > 0 ? kit.clamp01(dt / 0.18) : 1;
        const pop = i > 0 ? kit.clamp01(dt / 0.32) : 1;
        const bob = Math.sin(t * 2 * Math.PI / 2.6) * s * 0.025;
        const hop = cur.pose === 'walk' ? 0 : Math.sin(Math.PI * pop) * s * 0.07;
        const step = cur.pose === 'walk' ? Math.abs(Math.sin(dt * Math.PI * 2.75)) * s * 0.03 : 0;
        const breathe = 1 + 0.012 * Math.sin(t * 2 * Math.PI / 3.1);
        const sc = breathe * (cur.pose === 'walk' ? 1 : kit.lerp(0.93, 1, kit.eob(pop, 1.8)));
        if (sw < 1) { const pv = poses[i - 1]; place(name(pv, t - pv.t), !!pv.flip, x, y, s, 1 - sw, breathe, bob); }
        place(name(cur, dt), !!cur.flip, x, y, s, sw, sc, bob - hop - step);
        const sh = shadow.style;
        sh.left = (x - s * 0.6).toFixed(1) + 'px'; sh.top = (y - s * 0.07).toFixed(1) + 'px';
        sh.width = (s * 1.2).toFixed(1) + 'px'; sh.height = (s * 0.16).toFixed(1) + 'px';
        sh.opacity = 0.75 - (hop + step) / s;
        for (const b of says) {
          const p = kit.seg(t, b.t0, b.t0 + 0.32), o = kit.seg(t, b.t1 - 0.25, b.t1);
          b.st.opacity = kit.eo(p) * (1 - kit.ei(o));
          if (b.st.opacity === '0') continue;
          const g = kit.lerp(0.88, 1, kit.eob(p, 1.6)) * kit.lerp(1, 0.96, kit.ei(o));
          if (b.side === 'top') {
            b.st.transformOrigin = '50% 100%';
            b.st.transform = 'translate(' + x.toFixed(1) + 'px,' + (y - s * 1.42).toFixed(1) + 'px) translate(-50%,-100%) scale(' + g.toFixed(4) + ')';
          } else {
            b.st.transformOrigin = '100% 100%';
            b.st.transform = 'translate(' + (x - s * 0.18).toFixed(1) + 'px,' + (y - s * 1.12).toFixed(1) + 'px) translate(-100%,-100%) scale(' + g.toFixed(4) + ')';
          }
        }
      },
    };
    return api;
  },
  // ── Lesson helpers (T07–T09, kept for T14) ──
  // Set text only when it changes.
  txt(el, s) { if (el.textContent !== s) el.textContent = s; },
  // Fade and rise in at a (and fade out at o.out); returns the eased progress.
  rise(st, t, a, o) {
    o = o || {}; const K = UI.K, d = o.d == null ? 0.6 : o.d, dy = o.dy == null ? 30 : o.dy;
    const p = K.seg(t, a, a + d), out = o.out == null ? 0 : K.ei(K.seg(t, o.out, o.out + 0.5));
    st.opacity = (K.eo(K.seg(t, a, a + d * 0.6)) * (1 - out)).toFixed(3);
    st.transform = 'translateY(' + K.lerp(dy, 0, K.eo(p)).toFixed(2) + 'px) scale(' + K.lerp(o.s == null ? 0.96 : o.s, 1, K.eob(p, 1.5)).toFixed(4) + ')';
    return p;
  },
  // Piecewise eased value through keys [[t, v], ...].
  path(keys, t) {
    const K = UI.K; let v = keys[0][1];
    for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (t >= a[0]) v = K.lerp(a[1], b[1], K.eio(K.clamp01((t - a[0]) / (b[0] - a[0])))); }
    return v;
  },
  // Countdown ring for "try it": returns {el (svg group html), render(t, t0, n)}.
  ring(kit, cls, cx, cy) {
    const R = 110, C = 2 * Math.PI * R;
    const html = '<g class="' + cls + '" transform="translate(' + cx + ' ' + cy + ')">' +
      '<circle r="' + R + '" fill="none" stroke-width="14" style="stroke:color-mix(in srgb, var(--second) 10%, transparent)"/>' +
      '<circle class="' + cls + '-arc" r="' + R + '" fill="none" stroke-width="14" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="' + C.toFixed(1) + '" style="stroke:var(--main)"/>' +
      '<text class="' + cls + '-n mono" y="30" text-anchor="middle" style="fill:var(--second);font-size:84px"></text></g>';
    let arc, n, g;
    return {
      html,
      render(t, t0, len, show) {
        if (!g) { g = kit.stage.querySelector('.' + cls); arc = kit.stage.querySelector('.' + cls + '-arc'); n = kit.stage.querySelector('.' + cls + '-n'); }
        g.style.opacity = show;
        arc.setAttribute('stroke-dashoffset', (C * kit.seg(t, t0, t0 + len)).toFixed(1));
        UI.txt(n, t < t0 ? String(len) : String(Math.max(0, Math.min(len, Math.ceil(len - (t - t0))))));
      },
    };
  },
  // Price grid for a chart: horizontal lines with price labels to the right of x1.
  grid(x0, x1, yOf, lo, hi, step) {
    let g = '';
    for (let p = lo; p <= hi + 1e-6; p += step) {
      const y = yOf(p).toFixed(1);
      g += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y + '" y2="' + y + '" style="stroke:color-mix(in srgb, var(--second) 9%, transparent);stroke-width:1.5"/>' +
        '<text x="' + (x1 + 16) + '" y="' + (+y + 8) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 50%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>';
    }
    return g;
  },
  // Same grid with the price labels on the left, ending at x0 - 14.
  gridL(x0, x1, yOf, lo, hi, step) {
    let g = '';
    for (let p = lo; p <= hi + 1e-6; p += step) {
      const y = yOf(p).toFixed(1);
      g += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y + '" y2="' + y + '" style="stroke:color-mix(in srgb, var(--second) 9%, transparent);stroke-width:1.5"/>' +
        '<text x="' + (x0 - 14) + '" y="' + (+y + 8) + '" text-anchor="end" class="mono" style="fill:color-mix(in srgb, var(--second) 50%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>';
    }
    return g;
  },
  // Polyline of a price function f(s) for s in [s0, s1], mapped with xOf and yOf.
  line(f, s0, s1, xOf, yOf, dt) {
    let d = '';
    for (let s = s0; s <= s1 + 1e-6; s += dt || 0.05) d += (d ? 'L' : 'M') + xOf(s).toFixed(1) + ' ' + yOf(f(s)).toFixed(1);
    return d || 'M0 0';
  },
  // ── Candle helpers (T14) ──
  // n SVG candles: html to place inside an <svg>; set(i, c) draws candle i with
  // c = {x, w, o, h, l, c, y: price → y, op?, live?, col?}. Up (close ≥ open) is --up, down is --down.
  cdl(kit, cls, n) {
    let html = '';
    for (let i = 0; i < n; i++) html += '<g class="' + cls + '"><line class="' + cls + '-w" stroke-linecap="round"/><rect class="' + cls + '-b" rx="4"/></g>';
    let G, W, B;
    return {
      html,
      set(i, c) {
        if (!G) { const all = (s) => [...kit.stage.querySelectorAll(s)]; G = all('.' + cls); W = all('.' + cls + '-w'); B = all('.' + cls + '-b'); }
        const col = c.col || (c.c >= c.o ? 'var(--up)' : 'var(--down)');
        const yt = c.y(Math.max(c.o, c.c)), yb = c.y(Math.min(c.o, c.c)), bh = Math.max(c.min == null ? 4 : c.min, yb - yt), ym = (yt + yb) / 2;
        const w = W[i], b = B[i], sw = Math.max(3, c.w * 0.07);
        w.setAttribute('x1', c.x.toFixed(1)); w.setAttribute('x2', c.x.toFixed(1));
        w.setAttribute('y1', c.y(c.h).toFixed(1)); w.setAttribute('y2', c.y(c.l).toFixed(1));
        w.setAttribute('stroke-width', sw.toFixed(1)); w.style.stroke = col;
        b.setAttribute('x', (c.x - c.w / 2).toFixed(1)); b.setAttribute('width', c.w.toFixed(1));
        b.setAttribute('y', (ym - bh / 2).toFixed(1)); b.setAttribute('height', bh.toFixed(1));
        b.setAttribute('stroke-width', (sw * 0.8).toFixed(1));
        b.style.stroke = col;
        b.style.fill = c.live ? 'color-mix(in srgb, ' + col + ' 38%, var(--ground))' : col;
        G[i].style.opacity = c.op == null ? 1 : c.op;
      },
    };
  },
  // Fifteen fictional 1-minute candles, 10:00 to 10:14, as [open, high, low, close]; each open is the previous close.
  M1: [[60000, 60040, 59980, 60030], [60030, 60060, 60010, 60020], [60020, 60090, 60010, 60080], [60080, 60110, 60050, 60060], [60060, 60100, 60040, 60090],
    [60090, 60120, 60030, 60040], [60040, 60060, 59950, 59970], [59970, 60000, 59920, 59990], [59990, 60050, 59980, 60040], [60040, 60070, 60000, 60010],
    [60010, 60060, 59990, 60050], [60050, 60130, 60040, 60120], [60120, 60150, 60080, 60100], [60100, 60140, 60070, 60130], [60130, 60170, 60110, 60150]],
  // Combine candles into one: first open, highest high, lowest low, last close.
  agg(list) { return [list[0][0], Math.max(...list.map((c) => c[1])), Math.min(...list.map((c) => c[2])), list[list.length - 1][3]]; },
  // The same fifteen minutes on an n-minute timeframe (n = 1, 5 or 15).
  tf(n) { const out = []; for (let i = 0; i < UI.M1.length; i += n) out.push(UI.agg(UI.M1.slice(i, i + n))); return out; },
  hm(i) { return '10:' + String(i).padStart(2, '0'); },
  // A price path through the minutes that touches each minute's high and low: open, then the far extreme first, then close.
  // Returns f(m) for m in minutes 0..15.
  pathFn() {
    const pts = [];
    UI.M1.forEach((c, i) => {
      const up = c[3] >= c[0];
      pts.push([i, c[0]], [i + 0.3, up ? c[2] : c[1]], [i + 0.7, up ? c[1] : c[2]]);
    });
    pts.push([15, UI.M1[14][3]]);
    return (m) => { let j = 1; while (j < pts.length - 1 && pts[j][0] < m) j++; const a = pts[j - 1], b = pts[j], f = Math.max(0, Math.min(1, (m - a[0]) / (b[0] - a[0]))); return a[1] + (b[1] - a[1]) * (0.5 - 0.5 * Math.cos(Math.PI * f)); };
  },
  // Draw the fifteen minutes on an n-minute timeframe into candles idx0.. of cd: x0 = 10:00, ppm = px per minute.
  // o: {op, live (bool per candle or undefined), grow: 0..1 from open to close, wk (width factor)}.
  tfDraw(cd, idx0, n, x0, ppm, yOf, o) {
    o = o || {};
    UI.tf(n).forEach((c, i) => {
      const g = o.grow == null ? 1 : o.grow;
      cd.set(idx0 + i, { x: x0 + (i * n + n / 2) * ppm, w: Math.max(6, n * ppm * (o.wk || (n === 1 ? 0.58 : 0.7))), o: c[0], h: c[1], l: c[2], c: c[0] + (c[3] - c[0]) * g, y: yOf, op: o.op == null ? 1 : o.op });
    });
  },
};
UI.K = kit;
// T15: the 1m / 5m / 15m switch. states = [[t, n], ...]; returns {n, prev, p} at t.
UI.tfState = (states, t) => {
  let i = 0;
  for (let j = 0; j < states.length; j++) if (states[j][0] <= t) i = j;
  return { n: states[i][1], prev: i ? states[i - 1][1] : null, p: i ? kit.eo(kit.seg(t, states[i][0], states[i][0] + 0.5)) : 1 };
};
// Draw all three timeframes (cd needs 19 candles: 15 + 3 + 1), crossfading between the previous and the current one.
UI.tfAll = (cd, st, x0, ppm, yOf, op) => {
  let idx = 0;
  for (const n of [1, 5, 15]) {
    const on = n === st.n ? st.p : n === st.prev ? 1 - st.p : 0;
    UI.tfDraw(cd, idx, n, x0, ppm, yOf, { op: on * (op == null ? 1 : op), wk: n === 1 ? 0.58 : kit.lerp(n === st.n ? 0.2 : (n === 5 ? 0.7 : 0.45), n === 5 ? 0.7 : 0.45, n === st.n ? st.p : 1) });
    idx += 15 / n;
  }
};
// Segmented 1m | 5m | 15m switch at (x, y): html, set(n, p).
UI.tfSwitch = (kit, cls, x, y) => {
  const html = '<div class="' + cls + '" style="position:absolute;left:' + x + 'px;top:' + y + 'px;display:flex;gap:6px;padding:6px;border-radius:999px;background:color-mix(in srgb, var(--ground) 80%, var(--main));border:1.5px solid color-mix(in srgb, var(--main) 30%, transparent)">' +
    ['1m', '5m', '15m'].map((s) => '<span class="mono ' + cls + '-o" style="width:96px;text-align:center;padding:10px 0;border-radius:999px;font-size:28px">' + s + '</span>').join('') + '</div>';
  let opts;
  return {
    html,
    set(n) {
      if (!opts) opts = [...kit.stage.querySelectorAll('.' + cls + '-o')].map((e) => e.style);
      [1, 5, 15].forEach((m, i) => { opts[i].background = m === n ? 'var(--main)' : 'transparent'; opts[i].color = m === n ? 'var(--ground)' : 'var(--second)'; });
    },
  };
};
// OHLC table: rows = [[time, o, h, l, c], ...] plus an optional result row label. Returns html; cells are .cls-c in row order (5 per row).
UI.otab = (cls, x, y, w, rows, resLabel) => {
  let h = '<div class="otab ' + cls + '" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px">' + ['Time', 'Open', 'High', 'Low', 'Close'].map((s, i) => '<span class="h"' + (i ? '' : ' style="text-align:left"') + '>' + s + '</span>').join('');
  rows.forEach((r) => { h += '<span class="tm ' + cls + '-c">' + r[0] + '</span>' + r.slice(1).map((v) => '<span class="' + cls + '-c">' + UI.fmt(v) + '</span>').join(''); });
  if (resLabel) h += '<span class="tm res ' + cls + '-c" style="color:var(--main);font-weight:700">' + resLabel + '</span>' + [0, 1, 2, 3].map(() => '<span class="res ' + cls + '-c"></span>').join('');
  return h + '</div>';
};
