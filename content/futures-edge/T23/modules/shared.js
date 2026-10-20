window.UI = {
  LESSON: 'T23 · Full scalping decision lifecycle',
  TOTAL: 402,
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
  // Set text only when it changes.
  set(el, v) { v = String(v); if (el.textContent !== v) el.textContent = v; },
  // Signed amount: +10.00 / −10.00 (true minus sign).
  sgn(n, dp) { const v = Math.abs(n) < 1e-9 ? 0 : n; return (v > 0 ? '+' : v < 0 ? '−' : '') + UI.fmt(Math.abs(v), dp); },
  // Entrance: fade in and rise from dy px, starting at a, over d seconds. Optional fade-out window [o0, o1].
  rise(kit, st, t, a, d, dy, o0, o1) {
    const p = kit.seg(t, a, a + (d || 0.6));
    const out = o0 == null ? 0 : kit.ei(kit.seg(t, o0, o1));
    st.opacity = (kit.eo(kit.seg(t, a, a + (d || 0.6) * 0.6)) * (1 - out)).toFixed(3);
    st.transform = 'translateY(' + kit.lerp(dy == null ? 30 : dy, 0, kit.eo(p)).toFixed(1) + 'px)';
    return p;
  },
  // Countdown ring centred at cx, cy: shown from tIn, a pause sign, then n seconds counting down from t0, gone by tOut.
  ring(kit, cx, cy, r, tIn, t0, n, tOut, label) {
    const C = 2 * Math.PI * r;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="ui-ring" transform="translate(' + cx + ' ' + cy + ')">' +
      '<circle r="' + r + '" fill="none" stroke-width="12" style="stroke:color-mix(in srgb, var(--second) 10%, transparent)"/>' +
      '<circle class="ui-arc" r="' + r + '" fill="none" stroke-width="12" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="' + C.toFixed(1) + '" style="stroke:var(--main)"/>' +
      '<g class="ui-pause"><rect x="-24" y="-32" width="16" height="64" rx="4" style="fill:var(--second)"/><rect x="8" y="-32" width="16" height="64" rx="4" style="fill:var(--second)"/></g>' +
      '<text class="ui-n mono" y="26" text-anchor="middle" style="fill:var(--second);font-size:72px"></text>' +
      (label ? '<text y="' + (-r - 30) + '" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 62%, var(--ground));font-size:26px">' + kit.esc(label) + '</text>' : '') + '</g></svg>');
    kit.stage.append(svg);
    const g = svg.querySelector('.ui-ring'), arc = svg.querySelector('.ui-arc'), pause = svg.querySelector('.ui-pause').style, num = svg.querySelector('.ui-n');
    return (t) => {
      const p = kit.seg(t, tIn, tIn + 0.5);
      g.style.opacity = kit.eo(p) * (1 - kit.ei(kit.seg(t, tOut - 0.4, tOut)));
      g.setAttribute('transform', 'translate(' + cx + ' ' + cy + ') scale(' + kit.lerp(0.8, 1, kit.eob(p, 1.6)).toFixed(4) + ')');
      arc.setAttribute('stroke-dashoffset', (C * kit.seg(t, t0, t0 + n)).toFixed(1));
      const txt = t < t0 ? '' : String(Math.max(0, Math.min(n, Math.ceil(n - (t - t0)))));
      if (num.textContent !== txt) num.textContent = txt;
      pause.opacity = t < t0 ? 1 : 0;
    };
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
  // Side speech bubbles sit this far higher than in T01, so they clear the two-line caption band (y ≈ 784–930).
  LIFT: 96,
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
            b.st.transform = 'translate(' + (x - s * 0.18).toFixed(1) + 'px,' + (y - s * 1.12 - UI.LIFT).toFixed(1) + 'px) translate(-100%,-100%) scale(' + g.toFixed(4) + ')';
          }
        }
      },
    };
    return api;
  },
  // ── Chart helpers (from T14) ──
  // Piecewise eased value through keys [[t, v], ...].
  path(keys, t) {
    const K = UI.K; let v = keys[0][1];
    for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (t >= a[0]) v = K.lerp(a[1], b[1], K.eio(K.clamp01((t - a[0]) / (b[0] - a[0])))); }
    return v;
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
  // ── T23: one fictional BTC/USDT replay used by every step ──
  D: {
    // 5-minute candles [open, high, low, close] for the last hour. The last three are built from the 1-minute candles below.
    K5: [[59000, 59180, 58950, 59150], [59150, 59300, 59100, 59250], [59250, 59280, 59080, 59120], [59120, 59450, 59110, 59420],
      [59420, 59640, 59400, 59560], [59560, 59610, 59350, 59400], [59400, 59780, 59380, 59750], [59750, 60050, 59720, 60000],
      [60000, 60220, 59880, 60200], [60200, 60650, 60180, 60320], [60320, 60360, 59860, 60100], [60100, 60140, 59850, 60000]],
    // 1-minute candles: 0–14 before the decision (last close 60,000), 15–22 the replay after a DEMO BUY at 60,000.
    C1: [[60200, 60380, 60180, 60350], [60350, 60520, 60330, 60500], [60500, 60650, 60480, 60600], [60600, 60640, 60450, 60480], [60480, 60520, 60300, 60320],
      [60320, 60360, 60150, 60180], [60180, 60220, 60020, 60050], [60050, 60080, 59860, 59900], [59900, 60060, 59880, 60040], [60040, 60120, 59990, 60100],
      [60100, 60140, 59960, 59980], [59980, 60000, 59850, 59880], [59880, 59960, 59860, 59940], [59940, 60020, 59920, 59990], [59990, 60040, 59970, 60000],
      [60000, 60120, 59980, 60100], [60100, 60260, 60080, 60230], [60230, 60400, 60200, 60360], [60360, 60380, 60200, 60220],
      [60220, 60250, 60050, 60080], [60080, 60110, 59900, 59930], [59930, 59980, 59820, 59840], [59840, 59870, 59660, 59700]],
    V1: [0.62, 0.74, 0.86, 0.6, 0.52, 0.48, 0.44, 0.58, 0.5, 0.42, 0.38, 0.5, 0.4, 0.36, 0.34, 0.4, 0.48, 0.56, 0.5, 0.58, 0.66, 0.8, 0.92],
    x1: (i) => 200 + i * 36,
    y1: (p) => 720 - (p - 59600) * 0.325,
    x5: (i) => 236 + i * 64,
    y5: (p) => 720 - (p - 58800) * 0.195,
  },
  STEPS: ['Coin', 'Context', 'Levels', 'Doubts', 'Costs', 'Decide', 'Monitor', 'Journal'],
  // Scene header: eyebrow + headline at top left. Returns render(t).
  head(kit, kick, title, o) {
    o = o || {};
    const el = kit.h('<div class="words" style="left:140px;top:' + (o.top || 124) + 'px;width:' + (o.w || 960) + 'px;gap:14px"><p class="kick">' + kick + '</p>' +
      '<h2 class="line" style="font-size:' + (o.fs || 68) + 'px">' + title + '</h2></div>');
    kit.stage.append(el);
    const k = el.querySelector('.kick').style, h = el.querySelector('.line');
    return (t) => { k.opacity = kit.eo(kit.seg(t, 0, 0.5)); kit.TextFx.fadeFromRight(h, t, 0.1); };
  },
  // Step tracker, top right: eight numbered dots, steps before cur done, cur lit. Returns render(t).
  track(kit, cur) {
    let g = '';
    UI.STEPS.forEach((s, i) => {
      const x = 1214 + i * 72, n = i + 1;
      g += '<g class="tk-d" transform="translate(' + x + ' 168)"><circle r="23" stroke-width="2.5" style="fill:' + (n < cur ? 'color-mix(in srgb, var(--main) 28%, var(--ground))' : 'var(--ground)') + ';stroke:color-mix(in srgb, var(--main) ' + (n <= cur ? 90 : 35) + '%, transparent)"/>' +
        '<text class="mono" y="8" text-anchor="middle" style="font-size:22px;fill:' + (n < cur ? 'var(--main)' : 'color-mix(in srgb, var(--second) 60%, var(--ground))') + '">' + n + '</text></g>';
      if (i < 7) g += '<line x1="' + (x + 25) + '" x2="' + (x + 47) + '" y1="168" y2="168" stroke-width="2.5" style="stroke:color-mix(in srgb, var(--main) ' + (n < cur ? 70 : 22) + '%, transparent)"/>';
    });
    const cx = 1214 + (cur - 1) * 72;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="tk">' + g +
      '<g class="tk-c" transform="translate(' + cx + ' 168)"><circle class="tk-h" r="23" style="fill:none;stroke:var(--main);stroke-width:3"/><circle r="23" style="fill:var(--main)"/><text class="mono" y="8" text-anchor="middle" style="font-size:22px;fill:var(--ground);font-weight:600">' + cur + '</text></g>' +
      '<text x="' + cx + '" y="226" text-anchor="middle" class="tk-l" style="font-size:22px;font-weight:600;fill:var(--main)">' + UI.STEPS[cur - 1] + '</text></g></svg>');
    kit.stage.append(svg);
    const all = svg.querySelector('.tk').style, c = svg.querySelector('.tk-c'), h = svg.querySelector('.tk-h'), l = svg.querySelector('.tk-l').style;
    return (t) => {
      all.opacity = kit.eo(kit.seg(t, 0.2, 0.7));
      const p = kit.seg(t, 0.5, 1.0);
      c.setAttribute('transform', 'translate(' + cx + ' 168) scale(' + kit.lerp(0.6, 1, kit.eob(p, 1.8)).toFixed(3) + ')');
      const w = ((t - 1) % 2.4 + 2.4) % 2.4 / 2.4;
      h.setAttribute('r', (23 + 14 * w).toFixed(1)); h.style.opacity = t > 1 ? (1 - w) * 0.6 : 0;
      l.opacity = kit.eo(kit.seg(t, 0.8, 1.2));
    };
  },
  // The 1-minute chart: grid, n candles (default the 15 before the decision), optional volume bars.
  // o.draw: candles draw in from this time (default: already there). Returns {cd, render(t)}.
  chart1(kit, cls, o) {
    o = o || {};
    const D = UI.D, n = o.n || 15, cd = UI.cdl(kit, cls + '-c', o.cap || n);
    let vol = '';
    if (o.vol) for (let i = 0; i < (o.cap || n); i++) vol += '<rect class="' + cls + '-v" x="' + (D.x1(i) - 11) + '" y="' + (768 - D.V1[i] * 36).toFixed(1) + '" width="22" height="' + (D.V1[i] * 36).toFixed(1) + '" rx="3" style="fill:color-mix(in srgb, var(--main) 45%, transparent)"/>';
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="' + cls + '-g">' + UI.grid(160, 1040, D.y1, 59600, 60800, 200) + '</g>' + vol + cd.html + '</svg>');
    kit.stage.append(svg);
    const f = kit.h('<p class="fict" style="position:absolute;left:160px;top:276px;margin:0">' + (o.label || 'BTC/USDT · 1-minute · fictional replay · educational simulation') + '</p>');
    kit.stage.append(f);
    const g = svg.querySelector('.' + cls + '-g').style, fs = f.style, vs = [...svg.querySelectorAll('.' + cls + '-v')].map((e) => e.style);
    return {
      cd, svg,
      render(t, dim) {
        const K = kit, d0 = o.draw == null ? -10 : o.draw, m = dim == null ? 1 : dim;
        const a0 = o.at || 0; g.opacity = K.eo(K.seg(t, a0, a0 + 0.6)); fs.opacity = 0.9 * K.eo(K.seg(t, a0 + 0.3, a0 + 0.9));
        for (let i = 0; i < n; i++) {
          const c = D.C1[i], s = d0 + i * (o.k || 0.1), p = K.eo(K.seg(t, s, s + 0.4));
          cd.set(i, { x: D.x1(i), w: 22, o: c[0], h: c[0] + (c[1] - c[0]) * p, l: c[0] + (c[2] - c[0]) * p, c: c[0] + (c[3] - c[0]) * p, y: D.y1, op: K.eo(K.seg(t, s, s + 0.2)) * m });
          if (vs[i]) { vs[i].opacity = K.eo(K.seg(t, s, s + 0.3)) * m; }
        }
      },
    };
  },
  // A horizontal price line across the chart with a label tag at its right end.
  hline(p, color, dash, x0, x1) {
    const y = UI.D.y1(p).toFixed(1);
    return '<line x1="' + (x0 || 160) + '" x2="' + (x1 || 1040) + '" y1="' + y + '" y2="' + y + '" pathLength="1" stroke-width="3"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' style="stroke:' + color + '"/>';
  },
  // Zone band between two prices.
  band(a, b, color, x0, x1) {
    const Y = UI.D.y1;
    return '<rect x="' + (x0 || 160) + '" width="' + ((x1 || 1040) - (x0 || 160)) + '" y="' + Y(b).toFixed(1) + '" height="' + (Y(a) - Y(b)).toFixed(1) + '" rx="6" style="fill:color-mix(in srgb, ' + color + ' 18%, transparent);stroke:color-mix(in srgb, ' + color + ' 65%, transparent);stroke-width:2"/>';
  },
  // Typewriter: show the first part of s, from time a at cps characters per second.
  type(el, s, t, a, cps) {
    const n = Math.max(0, Math.min(s.length, Math.floor((t - a) * (cps || 30))));
    UI.set(el, s.slice(0, n));
    return n >= s.length;
  },
};
UI.K = kit;
