window.UI = {
  LESSON: 'T06 · Entry, Exit and Profit/Loss',
  TOTAL: 297,
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
  // Signed amount for PnL: +10.00 / −10.00 (true minus sign).
  sgn(n, dp) { const v = Math.abs(n) < 1e-9 ? 0 : n; return (v > 0 ? '+' : v < 0 ? '−' : '') + UI.fmt(Math.abs(v), dp); },
  // Countdown ring centred at cx, cy: shown from tIn, a pause sign, then n seconds counting down from t0, gone by tOut.
  ring(kit, cx, cy, r, tIn, t0, n, tOut, label) {
    const C = 2 * Math.PI * r;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="ui-ring" transform="translate(' + cx + ' ' + cy + ')">' +
      '<circle r="' + r + '" fill="none" stroke-width="12" style="stroke:color-mix(in srgb, var(--second) 10%, transparent)"/>' +
      '<circle class="ui-arc" r="' + r + '" fill="none" stroke-width="12" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="' + C.toFixed(1) + '" style="stroke:var(--main)"/>' +
      '<g class="ui-pause"><rect x="-24" y="-32" width="16" height="64" rx="4" style="fill:var(--second)"/><rect x="8" y="-32" width="16" height="64" rx="4" style="fill:var(--second)"/></g>' +
      '<text class="ui-n mono" y="26" text-anchor="middle" style="fill:var(--second);font-size:72px"></text>' +
      (label ? '<text y="' + (r + 50) + '" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 62%, var(--ground));font-size:26px">' + kit.esc(label) + '</text>' : '') + '</g></svg>');
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
  // Fictional price chart drawn as t runs. cfg: x0, x1, y0 (top), y1 (bottom), lo, hi (price range), step (grid),
  // keys [[t, price], ...] (eased between keys, a small wobble while moving), t0..t1 (time drawn across x0..x1),
  // entry (dashed line + label), tag (price tag at the dot). Returns { price(t), x(t), y(p), render(t) }.
  chart(kit, cfg) {
    const { x0, x1, y0, y1, lo, hi } = cfg, keys = cfg.keys, t0 = cfg.t0 || 0, t1 = cfg.t1;
    const y = (p) => y1 - (p - lo) / (hi - lo) * (y1 - y0);
    const x = (t) => x0 + kit.clamp01((t - t0) / (t1 - t0)) * (x1 - x0);
    const wob = cfg.wobble == null ? 0.08 : cfg.wobble;
    const price = (t) => {
      if (t <= keys[0][0]) return keys[0][1];
      for (let i = 1; i < keys.length; i++) {
        const a = keys[i - 1], b = keys[i];
        if (t < b[0]) {
          const p = (t - a[0]) / (b[0] - a[0]), d = b[1] - a[1];
          return kit.lerp(a[1], b[1], kit.eio(p)) + Math.sin(Math.PI * p) * (Math.sin(t * 7.3) * 0.6 + Math.sin(t * 13.1) * 0.4) * Math.abs(d) * wob;
        }
      }
      return keys[keys.length - 1][1];
    };
    let grid = '';
    for (let p = Math.ceil(lo / cfg.step) * cfg.step; p <= hi + 1e-6; p += cfg.step) {
      grid += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y(p).toFixed(1) + '" y2="' + y(p).toFixed(1) + '" style="stroke:color-mix(in srgb, var(--second) 9%, transparent);stroke-width:1.5"/>' +
        '<text x="' + (x1 + 16) + '" y="' + (y(p) + 8).toFixed(1) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 48%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>';
    }
    const ent = cfg.entry ? '<g class="ch-ent"><line x1="' + x0 + '" x2="' + x1 + '" y1="' + y(cfg.entry).toFixed(1) + '" y2="' + y(cfg.entry).toFixed(1) + '" stroke-dasharray="10 9" style="stroke:color-mix(in srgb, var(--second) 55%, transparent);stroke-width:2.5"/>' +
      '<text x="' + (x0 + 8) + '" y="' + (y(cfg.entry) + (cfg.entryBelow === false ? -12 : 32)).toFixed(1) + '" style="fill:color-mix(in srgb, var(--second) 75%, var(--ground));font-size:22px;font-weight:600">' + kit.esc(cfg.entryLabel || 'Entry') + '</text></g>' : '';
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="ch-g">' + grid + ent +
      '<path class="ch-line" fill="none" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" style="stroke:var(--main)"/>' +
      '<circle class="ch-dot" r="10" style="fill:var(--second)"/>' +
      (cfg.tag === false ? '' : '<g class="ch-tag"><rect x="16" y="-22" width="128" height="44" rx="10" style="fill:var(--main)"/><text class="ch-tt mono" x="80" y="9" text-anchor="middle" style="fill:var(--ground);font-size:24px;font-weight:500"></text></g>') +
      (cfg.label ? '<text x="' + x0 + '" y="' + (y0 - 26) + '" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">' + kit.esc(cfg.label) + '</text>' : '') +
      '</g></svg>');
    kit.stage.append(svg);
    const g = svg.querySelector('.ch-g'), line = svg.querySelector('.ch-line'), dot = svg.querySelector('.ch-dot'), tag = svg.querySelector('.ch-tag'), tt = svg.querySelector('.ch-tt'), en = svg.querySelector('.ch-ent');
    return {
      price, x, y, svg, g, entry: en,
      render(t, op) {
        g.style.opacity = op == null ? 1 : op;
        const end = Math.min(Math.max(t, t0), t1);
        let d = '';
        for (let s = t0; s <= end + 1e-6; s += 0.08) d += (d ? 'L' : 'M') + x(s).toFixed(1) + ' ' + y(price(s)).toFixed(1);
        d += 'L' + x(end).toFixed(1) + ' ' + y(price(end)).toFixed(1);
        line.setAttribute('d', d);
        const px = x(end), py = y(price(end));
        dot.setAttribute('cx', px.toFixed(1)); dot.setAttribute('cy', py.toFixed(1));
        if (tag) {
          tag.setAttribute('transform', 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ')');
          const v = UI.fmt(Math.round(price(end) / 10) * 10);
          if (tt.textContent !== v) tt.textContent = v;
        }
      },
    };
  },
  // PnL meter: a glass card with a label, a signed USDT value and a bar that grows right (profit) or left (loss) from zero.
  meter(kit, x, y, w, label, max, cls) {
    const el = kit.h('<div class="glass ' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;padding:20px 26px">' +
      '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px"><span style="font-size:28px;font-weight:700">' + label + '</span><span class="mono mt-v" style="font-size:40px"></span></div>' +
      '<div style="position:relative;height:18px;margin-top:14px;border-radius:9px;background:color-mix(in srgb, var(--second) 9%, transparent)"><i class="mt-f" style="position:absolute;top:0;bottom:0;border-radius:9px"></i>' +
      '<span style="position:absolute;left:50%;top:-6px;bottom:-6px;width:2px;background:color-mix(in srgb, var(--second) 45%, transparent)"></span></div>' +
      '<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:22px;color:color-mix(in srgb, var(--second) 55%, var(--ground))"><span>Loss</span><span>Profit</span></div></div>');
    kit.stage.append(el);
    const v = el.querySelector('.mt-v'), f = el.querySelector('.mt-f').style;
    return {
      el, style: el.style,
      set(n) {
        const txt = UI.sgn(n, 2) + ' USDT';
        if (v.textContent !== txt) v.textContent = txt;
        const c = Math.abs(n) < 0.005 ? 'var(--second)' : n > 0 ? 'var(--main)' : 'var(--accent)';
        v.style.color = c;
        const k = Math.min(1, Math.abs(n) / max) * 50;
        f.left = (n >= 0 ? 50 : 50 - k).toFixed(2) + '%'; f.width = k.toFixed(2) + '%';
        f.background = n >= 0 ? 'var(--main)' : 'var(--accent)';
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
};
