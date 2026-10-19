window.UI = {
  LESSON: 'T04 · What does an exchange do?',
  TOTAL: 267,
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
  // A mock order book: sell orders (asks) above the middle row, buy orders (bids) below.
  // render(asks, bids, mid): each entry {p, q, pos, op?, hl?}; pos 0 is the row next to the middle, fractions slide.
  book(kit, o) {
    const RH = 46, N = 4, K = 6, MID = 64, HEAD = 44, PAD = 20, W = o.w;
    const top = PAD + HEAD, midY = top + N * RH, botY = midY + MID;
    const mk = (side) => { let r = ''; for (let i = 0; i < K; i++) r += '<div class="bk-r bk-' + side + '" style="position:absolute;left:20px;right:20px;height:' + (RH - 6) + 'px;border-radius:10px;display:flex;align-items:center;padding:0 16px;box-sizing:border-box">' +
      '<span class="bk-bar" style="position:absolute;right:0;top:4px;bottom:4px;border-radius:8px;background:color-mix(in srgb, ' + (side === 'a' ? 'var(--accent)' : 'var(--main)') + ' 22%, transparent)"></span>' +
      '<span class="mono bk-p" style="position:relative;flex:1;font-size:30px;color:' + (side === 'a' ? 'var(--accent)' : 'var(--main)') + '"></span><span class="mono bk-q" style="position:relative;font-size:28px"></span></div>'; return r; };
    const el = kit.h('<div class="glass" style="left:' + o.x + 'px;top:' + o.y + 'px;width:' + W + 'px;height:' + (botY + N * RH + PAD) + 'px;overflow:hidden">' +
      '<div style="position:absolute;left:36px;right:36px;top:' + PAD + 'px;display:flex;justify-content:space-between;font-size:22px;font-weight:600;color:color-mix(in srgb, var(--second) 60%, var(--ground))"><span>Price (USDT)</span><span>Amount (BTC)</span></div>' +
      '<div class="bk-mid" style="position:absolute;left:20px;right:20px;top:' + midY + 'px;height:' + MID + 'px;display:flex;align-items:center;justify-content:center;gap:16px;border-top:1.5px solid color-mix(in srgb, var(--second) 12%, transparent);border-bottom:1.5px solid color-mix(in srgb, var(--second) 12%, transparent)"><span class="mono bk-m" style="font-size:28px"></span></div>' +
      mk('a') + mk('b') + '</div>');
    kit.stage.append(el);
    const rows = (side) => [...el.querySelectorAll('.bk-' + side)].map((r) => ({ s: r.style, p: r.querySelector('.bk-p'), q: r.querySelector('.bk-q'), bar: r.querySelector('.bk-bar').style }));
    const A = rows('a'), B = rows('b'), M = el.querySelector('.bk-m');
    const yOf = (side, pos) => side === 'a' ? midY - (pos + 1) * RH + 3 : botY + pos * RH + 3;
    const fill = (R, list, side) => {
      R.forEach((r, i) => {
        const e = list[i];
        if (!e) { r.s.opacity = 0; return; }
        const vis = kit.clamp01(N - 0.2 - e.pos) * kit.clamp01(e.pos + 1);
        r.s.opacity = ((e.op == null ? 1 : e.op) * vis).toFixed(3);
        r.s.top = yOf(side, e.pos).toFixed(1) + 'px';
        UI.set(r.p, UI.fmt(e.p)); UI.set(r.q, e.q.toFixed(2));
        r.bar.width = Math.min(100, e.q / (o.max || 1.2) * 60).toFixed(1) + '%';
        r.s.background = e.hl ? 'color-mix(in srgb, ' + (side === 'a' ? 'var(--accent)' : 'var(--main)') + ' ' + (e.hl * 30).toFixed(1) + '%, transparent)' : 'transparent';
        r.s.outline = e.hl ? '2px solid color-mix(in srgb, ' + (side === 'a' ? 'var(--accent)' : 'var(--main)') + ' ' + (e.hl * 90).toFixed(0) + '%, transparent)' : 'none';
      });
    };
    return {
      el, midY: o.y + midY, MID, rowY: (side, pos) => o.y + yOf(side, pos), RH,
      render(asks, bids, mid, midCol) { fill(A, asks, 'a'); fill(B, bids, 'b'); UI.set(M, mid || ''); M.style.color = midCol || 'var(--second)'; },
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
