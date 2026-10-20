window.UI = {
  LESSON: 'T27 · Reading XORA trading insights',
  TOTAL: 303,
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
  // Phone mock-up of the XORA app: returns the element (already appended). opts: left, top, w, h, cls, title, pill, body (html).
  phone(kit, o) {
    const el = kit.h('<div class="phone ' + (o.cls || '') + '" style="left:' + o.left + 'px;top:' + o.top + 'px;width:' + o.w + 'px;height:' + o.h + 'px">' +
      '<div class="phone-notch"></div><div class="phone-top"><b>' + (o.title || 'XORA') + '</b>' + (o.pill || '<span class="pill" style="color:var(--main)">DEMO</span>') + '</div>' +
      (o.body || '') + '</div>');
    kit.stage.append(el);
    return el;
  },
  // The on-screen label every app mock carries.
  mockLabel(kit, left, top, align) {
    const el = kit.h('<p class="mock" style="left:' + left + 'px;top:' + top + 'px' + (align === 'c' ? ';transform:translateX(-50%)' : '') + '">Illustrative mock of the XORA app · numbers are fictional</p>');
    kit.stage.append(el);
    return el;
  },
  // T27: the market-read carousel inside a phone mock. Returns { go(t, idx) } where idx (may be fractional) is the card shown.
  carousel(kit, pfx) {
    const W = 500;
    const c = (title, sub, inner) => '<div class="card" style="flex:none;width:' + W + 'px;height:470px;box-sizing:border-box;padding:18px 22px"><p class="card-h" style="margin:0">' + title + '</p>' +
      '<p class="lbl" style="margin:4px 0 14px">' + sub + '</p>' + inner + '</div>';
    const bar = (lab, w, col, cls) => '<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;font-size:22px"><span>' + lab + '</span><span class="mono ' + cls + '-v"></span></div>' +
      '<div style="height:16px;border-radius:8px;margin-top:6px;background:color-mix(in srgb, var(--second) 10%, transparent)"><div class="' + cls + '" style="height:100%;width:0;border-radius:8px;background:' + col + '"></div></div></div>';
    let book = '';
    const bids = [30, 46, 92, 38, 28], asks = [26, 34, 40, 30, 24];
    for (let i = 0; i < 5; i++) {
      book += '<div style="display:flex;gap:6px;align-items:center;margin:5px 0"><div style="flex:1;display:flex;justify-content:flex-end"><div class="' + pfx + '-bid" style="height:22px;width:' + bids[i] + '%;border-radius:4px;background:color-mix(in srgb, var(--up) 55%, transparent)"></div></div>' +
        '<div style="flex:1"><div class="' + pfx + '-ask" style="height:22px;width:' + asks[i] + '%;border-radius:4px;background:color-mix(in srgb, var(--down) 55%, transparent)"></div></div></div>';
    }
    const kv = (a, b, col) => '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:22px">' + a + '</span><span class="mono" style="font-size:22px;' + (col ? 'color:' + col : '') + '">' + b + '</span></div>';
    const cards = [
      c('XORA SUGGESTION', 'Xora read', '<p style="margin:0;font-size:24px;line-height:1.45;font-weight:600">Price is holding above support. Buyers are a little stronger in this range.</p>' +
        '<p class="' + pfx + '-disc" style="margin:18px 0 0;padding:12px 14px;border-radius:12px;font-size:21px;line-height:1.4;border:1.5px dashed color-mix(in srgb, var(--warn) 70%, transparent);color:var(--warn)">Computed on this phone from candles and the order book. Explanatory only — the engine\'s stop and exits do not use it.</p>'),
      c('VOLUME COMPARISON', 'Buy vs sell volume in this range', bar('Buy volume', 0, 'var(--up)', pfx + '-vb') + bar('Sell volume', 0, 'var(--down)', pfx + '-vs') +
        '<p style="margin:14px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Fictional numbers</p>'),
      c('ORDER BOOK DIFFERENCE', 'Bid walls vs ask walls', '<div style="display:flex;justify-content:space-between" class="lbl"><span style="color:var(--up)">BIDS · buy orders</span><span style="color:var(--down)">ASKS · sell orders</span></div>' + book +
        kv('Spread', '0.02%') + kv('Spoof risk', '<span class="' + pfx + '-sp">Low</span>') + '<div style="padding:8px 0;font-size:22px">Absorption: <span class="' + pfx + '-ab" style="color:var(--up)">bids absorbing sells</span></div>'),
      c('PRICE-RANGE REPLAY', 'When price was here before vs now', '<div style="display:flex;gap:10px">' +
        '<div style="flex:1;padding:12px;border-radius:14px;border:1.5px solid color-mix(in srgb, var(--second) 14%, transparent)"><p class="lbl" style="margin:0">BEFORE</p><svg width="190" height="120" viewBox="0 0 190 120"><path class="' + pfx + '-r1" d="M0 40 L40 70 L80 95 L110 90 L140 60 L190 30" pathLength="1" fill="none" stroke-width="4" style="stroke:var(--main)"/><line x1="0" x2="190" y1="95" y2="95" stroke-dasharray="6 5" stroke-width="2" style="stroke:var(--up)"/></svg><p style="margin:0;font-size:22px">Bounced here</p></div>' +
        '<div style="flex:1;padding:12px;border-radius:14px;border:1.5px solid color-mix(in srgb, var(--main) 45%, transparent)"><p class="lbl" style="margin:0">NOW</p><svg width="190" height="120" viewBox="0 0 190 120"><path class="' + pfx + '-r2" d="M0 35 L45 65 L85 92 L120 88 L150 80" pathLength="1" fill="none" stroke-width="4" style="stroke:var(--accent)"/><line x1="0" x2="190" y1="95" y2="95" stroke-dasharray="6 5" stroke-width="2" style="stroke:var(--up)"/></svg><p style="margin:0;font-size:22px">Testing it again</p></div></div>' +
        '<p style="margin:14px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Past behaviour is context, not a forecast.</p>'),
      c('TRIGGER LEVELS', 'Levels that matter for this plan', kv('Next res.', '60,600', 'var(--up)') + kv('Entry', '60,000') + kv('Stop', '59,700', 'var(--down)') +
        '<p class="' + pfx + '-stop" style="margin:16px 0 0;padding:12px 14px;border-radius:12px;font-size:23px;font-weight:600;border:1.5px solid var(--down)">The stop: where the trade closes.</p>'),
    ];
    let dots = '';
    for (let i = 0; i < 5; i++) dots += '<span class="' + pfx + '-dot" style="width:12px;height:12px;border-radius:6px;background:var(--second)"></span>';
    const body = '<div style="position:relative;height:470px;overflow:hidden;border-radius:22px"><div class="' + pfx + '-track" style="display:flex;gap:20px">' + cards.join('') + '</div></div>' +
      '<div style="display:flex;justify-content:center;gap:10px;margin-top:16px">' + dots + '</div>';
    const ph = UI.phone(kit, { left: 1120, top: 140, w: 560, h: 630, title: 'BTC/USDT', body });
    const ml = UI.mockLabel(kit, 1120, 100);
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    const track = q('.' + pfx + '-track').style, ds = all('.' + pfx + '-dot').map((e) => e.style);
    const cs = [...q('.' + pfx + '-track').children].map((e) => e.style);
    return {
      ph: ph.style, ml: ml.style, q, all,
      go(idx) {
        track.transform = 'translateX(' + (-(W + 20) * idx).toFixed(1) + 'px)';
        cs.forEach((e, i) => { e.opacity = Math.max(0, 1 - Math.abs(idx - i) * 1.2).toFixed(3); });
        ds.forEach((d, i) => { const on = Math.max(0, 1 - Math.abs(idx - i)); d.width = (12 + 22 * on).toFixed(1) + 'px'; d.opacity = (0.35 + 0.65 * on).toFixed(3); d.background = on > 0.5 ? 'var(--main)' : 'var(--second)'; });
      },
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
  // Side speech bubbles sit this far higher than in T01, so they clear the caption band.
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
