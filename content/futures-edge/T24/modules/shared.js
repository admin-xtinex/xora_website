window.UI = {
  LESSON: 'T24 · Meet XORA',
  TOTAL: 319,
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
  // Header: eyebrow + headline at top left. Returns render(t).
  head(kit, kick, title, o) {
    o = o || {};
    const el = kit.h('<div class="words" style="left:140px;top:' + (o.top || 124) + 'px;width:' + (o.w || 960) + 'px;gap:14px"><p class="kick"' + (o.kc ? ' style="color:' + o.kc + '"' : '') + '>' + kick + '</p>' +
      '<h2 class="line" style="font-size:' + (o.fs || 68) + 'px">' + title + '</h2></div>');
    kit.stage.append(el);
    const k = el.querySelector('.kick').style, h = el.querySelector('.line');
    return (t) => { k.opacity = kit.eo(kit.seg(t, 0, 0.5)); kit.TextFx.fadeFromRight(h, t, 0.1); };
  },
  // ── Phase 6: a clean, generic phone mock of the XORA app (illustrative only) ──
  TABS: ['Home', 'Signals', 'XORA', 'Trades', 'Settings'],
  icon(n) {
    const s = 'fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"';
    const p = {
      Home: '<path d="M4 13 L14 4 L24 13 M7 11 V23 H21 V11" ' + s + '/>',
      Signals: '<path d="M3 16 H8 L11 7 L16 21 L19 13 H25" ' + s + '/>',
      Trades: '<path d="M5 7 H23 M5 14 H23 M5 21 H16" ' + s + '/>',
      Settings: '<circle cx="14" cy="14" r="4.5" ' + s + '/><path d="M14 3 V7 M14 21 V25 M3 14 H7 M21 14 H25 M6.2 6.2 L9 9 M19 19 L21.8 21.8 M6.2 21.8 L9 19 M19 9 L21.8 6.2" ' + s + '/>',
    };
    return '<svg width="30" height="30" viewBox="0 0 28 28">' + (p[n] || '') + '</svg>';
  },
  // o: {x, y, w, h, tab (index lit), body (html), label (true shows the mock label above)}. Returns {el, q(sel), all(sel), lit(i, v), render(t, a, out0, out1)}.
  phone(kit, o) {
    const w = o.w || 460, h = o.h || 650;
    let tabs = '';
    UI.TABS.forEach((n, i) => {
      tabs += n === 'XORA'
        ? '<div class="ph-tab ph-tx"><span class="ph-xb">X</span><span>XORA</span></div>'
        : '<div class="ph-tab">' + UI.icon(n) + '<span>' + n + '</span></div>';
    });
    const el = kit.h('<div class="ph" style="left:' + o.x + 'px;top:' + o.y + 'px;width:' + w + 'px;height:' + h + 'px">' +
      '<div class="ph-scr"><div class="ph-sb mono"><span>9:41</span><svg width="44" height="22" viewBox="0 0 44 22"><rect x="1" y="2" width="36" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="5" y="6" width="24" height="10" rx="2" fill="currentColor"/><rect x="39" y="8" width="3" height="6" rx="1" fill="currentColor"/></svg></div>' +
      '<div class="ph-body">' + (o.body || '') + '</div><div class="ph-tabs">' + tabs + '</div></div></div>');
    kit.stage.append(el);
    let lab = null;
    if (o.label !== false) {
      lab = kit.h('<p class="fict ph-lab" style="left:' + (o.x - 40) + 'px;top:' + (o.y - 62) + 'px;width:' + (w + 80) + 'px">Illustrative mock of the XORA app<br>numbers are fictional</p>');
      kit.stage.append(lab);
    }
    const tabEls = [...el.querySelectorAll('.ph-tab')];
    const st = el.style, ls = lab && lab.style;
    const api = {
      el,
      q: (s) => el.querySelector(s),
      all: (s) => [...el.querySelectorAll(s)],
      lit(i, v) { tabEls.forEach((e, j) => { const on = j === i ? v : 0; e.style.color = 'color-mix(in srgb, var(--main) ' + Math.round(on * 100) + '%, color-mix(in srgb, var(--second) 55%, var(--ground)))'; }); },
      // a: entrance start; out0/out1: optional fade-out window.
      render(t, a, out0, out1) {
        const p = kit.seg(t, a, a + 0.8), out = out0 == null ? 0 : kit.ei(kit.seg(t, out0, out1));
        st.opacity = (kit.eo(kit.seg(t, a, a + 0.45)) * (1 - out)).toFixed(3);
        st.transform = 'translateY(' + (kit.lerp(60, 0, kit.eo(p)) + Math.sin(t * 2 * Math.PI / 5.2) * 4).toFixed(1) + 'px) scale(' + kit.lerp(0.94, 1, kit.eob(p, 1.5)).toFixed(4) + ')';
        if (ls) ls.opacity = (0.95 * kit.eo(kit.seg(t, a + 0.4, a + 1.0)) * (1 - out)).toFixed(3);
      },
    };
    api.lit(o.tab == null ? -1 : o.tab, 1);
    return api;
  },
  // Scrolled phone content: fade each child of box by how much of it sits inside the visible 0..h band (sc = scroll px).
  fit(box, sc, h) {
    for (const e of box.children) {
      const y0 = e.offsetTop - sc, y1 = y0 + e.offsetHeight;
      const v = Math.min(1, Math.max(0, y1 / 30), Math.max(0, (h - y0) / 30));
      e.style.opacity = v.toFixed(3);
      e.style.visibility = v < 0.02 ? 'hidden' : 'visible';
    }
  },
  // Soft highlight ring on an element (v 0..1).
  glow(st, v, col) { col = col || 'var(--main)'; st.boxShadow = v > 0.01 ? '0 0 0 ' + (3 * v).toFixed(1) + 'px ' + col + ', 0 0 ' + (26 * v).toFixed(0) + 'px color-mix(in srgb, ' + col + ' 45%, transparent)' : 'none'; },
  // A callout card (glass) on the left: kicker + text. Returns its style.
  card(kit, x, y, w, kick, text, o) {
    o = o || {};
    const el = kit.h('<div class="glass ' + (o.cls || '') + '" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;padding:' + (o.pad || '22px 30px') + (o.bc ? ';border-color:' + o.bc : '') + '">' +
      (kick ? '<p class="kick" style="margin:0 0 10px' + (o.kc ? ';color:' + o.kc : '') + '">' + kick + '</p>' : '') +
      '<p style="margin:0;font-size:' + (o.fs || 30) + 'px;line-height:1.4;font-weight:600">' + text + '</p></div>');
    kit.stage.append(el);
    return el.style;
  },
  // Typewriter: show the first part of s, from time a at cps characters per second.
  type(el, s, t, a, cps) {
    const n = Math.max(0, Math.min(s.length, Math.floor((t - a) * (cps || 30))));
    UI.set(el, s.slice(0, n));
    return n >= s.length;
  },
  // mm:ss countdown text.
  mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); },
};
UI.K = kit;
