window.UI = {
  LESSON: 'T20 · Evaluating an entry opportunity',
  TOTAL: 294,
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
  // ── T20 analysis board: one fictional BTC/USDT 5-minute chart, built up one layer at a time ──
  // Candles [open, high, low, close]; each open is the previous close. Last close 60,000.
  B20: {
    C: [[59300, 59380, 59260, 59360], [59360, 59450, 59330, 59420], [59420, 59470, 59350, 59380], [59380, 59520, 59370, 59500], [59500, 59600, 59470, 59580],
      [59580, 59640, 59470, 59540], [59540, 59720, 59530, 59700], [59700, 59810, 59660, 59780], [59780, 59880, 59740, 59850], [59850, 60060, 59830, 60040],
      [60040, 60100, 59900, 59920], [59920, 59960, 59700, 59740], [59740, 59780, 59500, 59560], [59560, 59720, 59520, 59700], [59700, 59860, 59660, 59830],
      [59830, 59940, 59790, 59900], [59900, 60010, 59860, 59960], [59960, 60030, 59920, 60000]],
    V: [0.35, 0.4, 0.3, 0.45, 0.5, 0.4, 0.55, 0.5, 0.6, 0.95, 0.8, 0.7, 0.85, 0.6, 0.5, 0.42, 0.32, 0.24],
    ROWS: [['Trend', 'Up, but choppy', 'var(--main)'], ['Range', '59,500 – 60,100', 'var(--main)'], ['Zone', 'Under resistance', 'var(--accent)'],
      ['Volume', 'Fading', 'var(--accent)'], ['Risk', 'Risk 10 · reward ≈ 1.7', 'var(--accent)'], ['Decision', 'WAIT', 'var(--main)']],
    x: (i) => 190 + i * 44,
    y: (p) => 680 - (p - 59200) * 0.36,
  },
  // board(kit, layer, o): chart + checklist. Layers below `layer` are complete; `layer` reveals from time a (render(t, a)).
  // o.draw: candles draw in from this time (default: shown from 0). o.list === false hides the checklist.
  board(kit, layer, o) {
    o = o || {};
    const B = UI.B20, X = B.x, Y = B.y, cd = UI.cdl(kit, 'bd-c', B.C.length);
    const sz = 'stroke-width="3"', fc = (c, p) => 'color-mix(in srgb, ' + c + ' ' + p + '%, transparent)';
    let vol = '', dots = '';
    B.V.forEach((v, i) => { vol += '<rect class="bd-v" x="' + (X(i) - 13) + '" y="' + (752 - v * 56).toFixed(1) + '" width="26" height="' + (v * 56).toFixed(1) + '" rx="3"/>'; });
    [0, 2, 5, 12].forEach((i) => { dots += '<circle class="bd-d" cx="' + X(i) + '" cy="' + Y(B.C[i][2]).toFixed(1) + '" r="9" style="fill:var(--main)"/>'; });
    [10, 17].forEach((i) => { dots += '<circle class="bd-d" cx="' + X(i) + '" cy="' + Y(B.C[i][1]).toFixed(1) + '" r="9" style="fill:var(--accent)"/>'; });
    const zx = 600, zw = 350, band = (cls, a, b, c) => '<rect class="' + cls + '" x="' + zx + '" width="' + zw + '" y="' + Y(b).toFixed(1) + '" height="' + (Y(a) - Y(b)).toFixed(1) + '" rx="6" style="fill:' + fc(c, 20) + ';stroke:' + fc(c, 70) + ';stroke-width:2"/>';
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<g class="bd-grid">' + UI.grid(150, 950, Y, 59400, 60200, 200) + '<line x1="150" x2="950" y1="754" y2="754" style="stroke:' + fc('var(--second)', 14) + ';stroke-width:1.5"/></g>' +
      '<g class="bd-l2">' + band('bd-zr', 60050, 60150, 'var(--accent)') + band('bd-zs', 59500, 59600, 'var(--main)') + '</g>' +
      '<rect class="bd-rb" x="' + (X(10) - 24) + '" y="' + Y(60100).toFixed(1) + '" width="' + (X(17) - X(10) + 48) + '" height="' + (Y(59500) - Y(60100)).toFixed(1) + '" rx="8" fill="none" ' + sz + ' stroke-dasharray="10 8" style="stroke:var(--second)"/>' +
      cd.html +
      '<line class="bd-tl" x1="' + X(0) + '" y1="' + Y(59260).toFixed(1) + '" x2="' + X(17) + '" y2="' + Y(59600).toFixed(1) + '" pathLength="1" ' + sz + ' stroke-dasharray="1 1" style="stroke:var(--main)"/>' +
      '<g class="bd-l0">' + dots + '</g>' +
      '<g class="bd-l3" style="fill:' + fc('var(--main)', 55) + '">' + vol + '</g>' +
      '<g class="bd-l4"><line class="bd-en" x1="' + zx + '" x2="950" y1="' + Y(60000).toFixed(1) + '" y2="' + Y(60000).toFixed(1) + '" ' + sz + ' style="stroke:var(--second)"/>' +
      '<line class="bd-sl" x1="' + zx + '" x2="950" y1="' + Y(59400).toFixed(1) + '" y2="' + Y(59400).toFixed(1) + '" ' + sz + ' stroke-dasharray="12 8" style="stroke:var(--accent)"/>' +
      '<path class="bd-br" d="M930 ' + (Y(60000) + 6).toFixed(1) + ' V' + (Y(59400) - 6).toFixed(1) + ' M920 ' + (Y(60000) + 18).toFixed(1) + ' L930 ' + (Y(60000) + 6).toFixed(1) + ' L940 ' + (Y(60000) + 18).toFixed(1) + ' M920 ' + (Y(59400) - 18).toFixed(1) + ' L930 ' + (Y(59400) - 6).toFixed(1) + ' L940 ' + (Y(59400) - 18).toFixed(1) + '" fill="none" ' + sz + ' style="stroke:var(--accent)"/></g>' +
      '</svg>');
    kit.stage.append(svg);
    // One or two tags for each layer, top-left of the chart where it is empty.
    const TAGS = [['Higher lows, then a lower high'], ['Range: 59,500 – 60,100', '= 600 USDT ≈ 1% of price'], ["Resistance 60,050 – 60,150", "Support 59,500 – 59,600"],
      ['Volume fading on the last push up'], ['Entry ≈ 60,000 · stop 59,400', 'Stop distance 600 USDT = 1%'], ['Decision: WAIT']];
    const TC = [['var(--main)'], ['var(--second)', 'var(--second)'], ['var(--accent)', 'var(--main)'], ['var(--main)'], ['var(--second)', 'var(--accent)'], ['var(--main)']];
    const tags = [];
    TAGS.forEach((L, i) => L.forEach((s, j) => {
      const e = kit.h('<p class="tag" style="left:160px;top:' + (334 + j * 56) + 'px;font-size:24px;border-color:' + TC[i][j] + '">' + kit.esc(s) + '</p>');
      kit.stage.append(e); tags.push({ i, j, st: e.style });
    }));
    kit.stage.append(kit.h('<p class="fict bd-f" style="position:absolute;left:150px;top:282px;margin:0">BTC/USDT · 5-minute candles · fictional, not real market data</p>'));
    let list = null, rows = [], vals = [], nums = [];
    if (o.list !== false) {
      let r = '';
      B.ROWS.forEach((w, i) => {
        r += '<div class="bd-row" style="display:flex;align-items:center;gap:16px;height:40px">' +
          '<span class="bd-n mono" style="flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:20px;border:2px solid ' + fc('var(--main)', 45) + '">' + (i + 1) + '</span>' +
          '<span style="width:130px;font-size:28px;font-weight:600">' + w[0] + '</span>' +
          '<span class="bd-val mono" style="margin-left:auto;font-size:26px;white-space:nowrap;color:' + w[2] + '">' + kit.esc(w[1]) + '</span></div>';
      });
      list = kit.h('<div class="glass bd-list" style="left:1110px;top:300px;width:670px;padding:16px 28px"><p class="kick" style="margin:0 0 6px">Entry checklist · in order</p>' + r + '</div>');
      kit.stage.append(list);
      rows = [...list.querySelectorAll('.bd-row')].map((e) => e.style);
      vals = [...list.querySelectorAll('.bd-val')].map((e) => e.style);
      nums = [...list.querySelectorAll('.bd-n')].map((e) => e.style);
    }
    const q = (s) => svg.querySelector(s), all = (s) => [...svg.querySelectorAll(s)].map((e) => e.style);
    const L = { grid: q('.bd-grid').style, zr: q('.bd-zr').style, zs: q('.bd-zs').style, rb: q('.bd-rb').style, tl: q('.bd-tl'), d: all('.bd-d'), v: all('.bd-v'), en: q('.bd-en').style, sl: q('.bd-sl').style, br: q('.bd-br').style, f: kit.stage.querySelector('.bd-f').style };
    return {
      el: list,
      // a: when the current layer starts; tOut: when its tags fade (optional).
      render(t, a, tOut) {
        const K = kit, lp = (n, d) => (n < layer ? 1 : n > layer ? 0 : K.seg(t, a + (d || 0), a + (d || 0) + 1.2));
        L.grid.opacity = K.eo(K.seg(t, 0, 0.6)); L.f.opacity = 0.9 * K.eo(K.seg(t, 0.3, 0.9));
        const d0 = o.draw == null ? -10 : o.draw;
        B.C.forEach((c, i) => {
          const s = d0 + i * 0.12, p = K.seg(t, s, s + 0.4);
          cd.set(i, { x: X(i), w: 26, o: c[0], h: c[0] + (c[1] - c[0]) * K.eo(p), l: c[0] + (c[2] - c[0]) * K.eo(p), c: c[0] + (c[3] - c[0]) * K.eo(p), y: Y, op: K.eo(K.seg(t, s, s + 0.2)) * (layer === 5 ? K.lerp(1, 0.55, K.eo(lp(5))) : 1) });
        });
        // Layer 0: trend line and the highs and lows.
        const p0 = lp(0);
        L.tl.setAttribute('stroke-dasharray', K.eio(p0).toFixed(3) + ' 1'); L.tl.style.opacity = p0 > 0 ? 0.9 : 0;
        L.d.forEach((s, i) => { const p = layer > 0 ? 1 : K.seg(t, a + 0.3 + i * 0.35, a + 0.6 + i * 0.35); s.opacity = K.eo(p); });
        // Layer 1: the recent range box.
        const p1 = lp(1);
        L.rb.opacity = K.eo(p1); L.rb.transformOrigin = '50% 50%'; L.rb.transformBox = 'fill-box'; L.rb.transform = 'scaleY(' + K.lerp(0.2, 1, K.eo(p1)).toFixed(3) + ')';
        // Layer 2: the zones grow from the left.
        const p2a = lp(2), p2b = layer === 2 ? K.seg(t, a + 1.4, a + 2.6) : p2a;
        [[L.zr, p2a], [L.zs, p2b]].forEach(([s, p]) => { s.opacity = K.eo(p); s.transformBox = 'fill-box'; s.transformOrigin = '0 50%'; s.transform = 'scaleX(' + K.eo(p).toFixed(3) + ')'; });
        // Layer 3: volume bars rise one by one.
        L.v.forEach((s, i) => { const p = layer > 3 ? 1 : layer < 3 ? 0 : K.seg(t, a + i * 0.08, a + i * 0.08 + 0.4); s.transformBox = 'fill-box'; s.transformOrigin = '50% 100%'; s.transform = 'scaleY(' + K.eo(p).toFixed(3) + ')'; s.opacity = p > 0 ? 1 : 0; s.fill = i >= 14 && layer >= 3 && (layer > 3 || t > a + 2.4) ? 'var(--accent)' : ''; });
        // Layer 4: entry, stop and the distance between them.
        const p4 = lp(4), p4b = layer === 4 ? K.seg(t, a + 1.2, a + 2.2) : p4;
        L.en.opacity = K.eo(p4); L.sl.opacity = K.eo(p4b); L.br.opacity = K.eo(layer === 4 ? K.seg(t, a + 2.2, a + 2.8) : p4);
        // Tags of the current layer only.
        for (const g of tags) {
          if (g.i !== layer) { g.st.opacity = 0; continue; }
          UI.rise(K, g.st, t, a + 0.6 + g.j * 1.2, 0.5, 16, tOut, tOut == null ? null : tOut + 0.5);
        }
        // Checklist rows: done rows show their value; the current row lights up.
        rows.forEach((s, i) => {
          const cur = i === layer, done = i < layer, on = cur ? K.eo(K.seg(t, a, a + 0.5)) : 0;
          s.opacity = done || cur ? 1 : 0.4;
          s.background = 'color-mix(in srgb, var(--main) ' + (on * 14).toFixed(0) + '%, transparent)'; s.borderRadius = '12px';
          vals[i].opacity = done ? 1 : cur ? K.eo(K.seg(t, a + (o.val == null ? 3 : o.val), a + (o.val == null ? 3 : o.val) + 0.5)) : 0;
          const lit = done || (cur && t > a + (o.val == null ? 3 : o.val));
          nums[i].background = lit ? 'var(--main)' : 'transparent'; nums[i].color = lit ? 'var(--ground)' : 'var(--second)';
        });
      },
    };
  },
  // One analysis-layer scene: headline, the board at `layer`, and a card under the checklist (cfg.card html, cfg.cardRender(t, cardEl)).
  layerScene(kit, cfg) {
    const { seg, eo, TextFx } = kit;
    return {
      init(kit) {
        this.chrome = UI.chrome(kit);
        kit.stage.append(kit.h('<div class="ground"><div class="words" style="left:140px;top:150px;width:1500px"><p class="kick ly-k">' + cfg.kick + '</p>' +
          '<h2 class="line ly-t" style="font-size:64px">' + cfg.title + '</h2></div></div>'));
        this.k = kit.stage.querySelector('.ly-k').style; this.t = kit.stage.querySelector('.ly-t');
        this.bd = UI.board(kit, cfg.layer, { val: cfg.val });
        this.card = kit.h('<div class="glass ly-card" style="left:1110px;top:616px;width:670px;height:146px;padding:16px 28px">' + cfg.card + '</div>');
        kit.stage.append(this.card);
        this.cs = this.card.style;
        if (cfg.cardInit) cfg.cardInit.call(this, kit, this.card);
        const C = UI.CORNER;
        this.tutor = UI.tutor(kit, { keys: [{ t: 0, x: C.x, y: C.y, s: C.s }], poses: cfg.poses, says: cfg.says || [] });
      },
      render(t) {
        this.chrome(t);
        this.k.opacity = eo(seg(t, 0, 0.5));
        TextFx.fadeFromRight(this.t, t, 0.1);
        this.bd.render(t, cfg.a, cfg.tOut);
        UI.rise(kit, this.cs, t, cfg.cardAt == null ? 0.6 : cfg.cardAt, 0.6, 20);
        if (cfg.cardRender) cfg.cardRender.call(this, t, this.card);
        this.tutor.render(t);
      },
    };
  },
};
UI.K = kit;
