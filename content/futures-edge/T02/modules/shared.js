window.UI = {
  LESSON: 'T02 · Why do crypto prices move?',
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
  // Set text only when it changes.
  set(el, v) { v = String(v); if (el.textContent !== v) el.textContent = v; },
  fmt(n, dp) { return n.toLocaleString('en-US', { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 }); },
  // A small illustrative market: price readout, a chart that draws over time, and buy / sell queues of dots.
  // o: {x, y, w, lo, hi, t0, t1, price(t), buyers(t), sellers(t), max}
  mkt(kit, o) {
    const W = o.w - 56, CH = 210, max = o.max || 12;
    let grid = '';
    for (let i = 0; i <= 4; i++) { const y = 10 + (CH - 20) * i / 4; grid += '<line x1="0" x2="' + (W - 110) + '" y1="' + y + '" y2="' + y + '" style="stroke:color-mix(in srgb, var(--second) 8%, transparent);stroke-width:1.5"/><text x="' + (W - 96) + '" y="' + (y + 7) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 50%, var(--ground));font-size:22px">' + UI.fmt(o.hi - (o.hi - o.lo) * i / 4) + '</text>'; }
    const dots = (cls, col) => { let d = ''; for (let i = 0; i < max; i++) d += '<span class="' + cls + '" style="width:24px;height:24px;border-radius:50%;flex:none;background:' + col + '"></span>'; return d; };
    const row = (label, cls, col) => '<div style="display:flex;align-items:center;gap:16px;height:52px"><span style="width:190px;font-size:24px;font-weight:600;color:' + col + '">' + label + '</span><span style="display:flex;gap:8px;flex:1">' + dots(cls, col) + '</span><span class="mono ' + cls + '-n" style="width:44px;text-align:right;font-size:28px"></span></div>';
    const el = kit.h('<div class="glass" style="left:' + o.x + 'px;top:' + o.y + 'px;width:' + o.w + 'px;padding:24px 28px">' +
      '<div style="display:flex;align-items:baseline;justify-content:space-between"><p class="fict" style="margin:0">BTC/USDT · illustrative, not real data</p><span class="mono mk-ch" style="font-size:26px"></span></div>' +
      '<p class="mono mk-p" style="margin:6px 0 10px;font-size:60px"></p>' +
      '<svg width="' + W + '" height="' + CH + '" style="display:block;overflow:visible">' + grid + '<path class="mk-l" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="mk-d" r="9" style="fill:var(--second)"/></svg>' +
      '<div style="margin-top:12px;display:flex;flex-direction:column;gap:6px">' + row('Buyers', 'mk-b', 'var(--main)') + row('Sellers', 'mk-s', 'var(--accent)') + '</div></div>');
    kit.stage.append(el);
    const q = (s) => el.querySelector(s), all = (s) => [...el.querySelectorAll(s)].map((e) => e.style);
    const P = q('.mk-p'), CHG = q('.mk-ch'), L = q('.mk-l'), D = q('.mk-d'), bd = all('.mk-b'), sd = all('.mk-s'), bn = q('.mk-b-n'), sn = q('.mk-s-n');
    const X = (t) => (Math.min(Math.max(t, o.t0), o.t1) - o.t0) / (o.t1 - o.t0) * (W - 130), Y = (p) => 10 + (CH - 20) * (o.hi - p) / (o.hi - o.lo);
    return {
      el,
      render(t) {
        let d = '';
        const end = Math.min(Math.max(t, o.t0), o.t1);
        for (let s = o.t0; s <= end + 1e-6; s += 0.1) d += (s > o.t0 ? 'L' : 'M') + X(s).toFixed(1) + ' ' + Y(o.price(s)).toFixed(1);
        L.setAttribute('d', d || 'M0 ' + Y(o.price(o.t0)));
        D.setAttribute('cx', X(end).toFixed(1)); D.setAttribute('cy', Y(o.price(end)).toFixed(1));
        const p = o.price(t), p0 = o.price(o.t0), c = p - p0;
        UI.set(P, UI.fmt(p) + ' USDT');
        UI.set(CHG, Math.abs(c) < 1 ? '' : (c > 0 ? '▲ +' : '▼ −') + UI.fmt(Math.abs(c)));
        CHG.style.color = c >= 0 ? 'var(--main)' : 'var(--accent)';
        const nb = o.buyers(t), ns = o.sellers(t);
        bd.forEach((s, i) => { const v = kit.clamp01(nb - i); s.opacity = 0.12 + 0.88 * kit.eo(v); s.transform = 'scale(' + kit.lerp(0.4, 1, kit.eob(v, 1.8)).toFixed(3) + ')'; });
        sd.forEach((s, i) => { const v = kit.clamp01(ns - i); s.opacity = 0.12 + 0.88 * kit.eo(v); s.transform = 'scale(' + kit.lerp(0.4, 1, kit.eob(v, 1.8)).toFixed(3) + ')'; });
        UI.set(bn, Math.round(nb)); UI.set(sn, Math.round(ns));
      },
    };
  },
  // Stepped price: keys [[t, price], ...]; the price jumps to each value at its time (a trade), with a short ease.
  steps(keys) {
    return (t) => { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) { if (t >= keys[i][0]) v = keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * Math.min(1, (t - keys[i][0]) / 0.25); } return Math.round(v); };
  },
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
};
