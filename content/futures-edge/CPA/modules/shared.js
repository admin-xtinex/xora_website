window.UI = {
  LESSON: 'CPA · Checkpoint A',
  TOTAL: 255,
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
  // Checkpoint question. cfg: n, from, q (headline), opts[4], ok (right index), bad (tempting wrong index), why, whyNot,
  // vis (HTML inside the visual panel), R (answer revealed), N (why-not shown). Returns render(t) for the shared parts.
  quiz(kit, cfg) {
    const L = 'ABCD', R = cfg.R || 7.6, N = cfg.N || 14.2;
    let rows = '';
    cfg.opts.forEach((o, i) => {
      const mark = i === cfg.ok ? '<path class="qz-ok" d="M10 23 L19 32 L35 13" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>'
        : i === cfg.bad ? '<path class="qz-no" d="M13 13 L31 31 M31 13 L13 31" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--accent)"/>' : '';
      rows += '<div class="qz-o" style="display:flex;align-items:center;gap:22px;padding:13px 22px;border-radius:20px;border:2px solid color-mix(in srgb, var(--second) 14%, transparent);background:color-mix(in srgb, var(--ground) 90%, var(--main))">' +
        '<span class="qz-l mono" style="width:50px;height:50px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:26px;border:2px solid color-mix(in srgb, var(--main) 45%, transparent)">' + L[i] + '</span>' +
        '<span style="font-size:30px;font-weight:600;line-height:1.3;flex:1">' + o + '</span>' +
        '<svg width="44" height="44" viewBox="0 0 44 44" style="flex:none">' + mark + '</svg></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1010px;gap:20px"><p class="kick qz-k">Question ' + cfg.n + ' of 8 · from ' + cfg.from + '</p>' +
      '<h2 class="line qz-t" style="font-size:64px">' + cfg.q + '</h2>' +
      '<div style="margin-top:14px;display:flex;flex-direction:column;gap:14px">' + rows + '</div></div>' +
      '<div class="glass qz-vis" style="left:1220px;top:150px;width:560px;height:340px">' + cfg.vis + '</div>' +
      '<div class="glass qz-why" style="left:1220px;top:508px;width:560px;padding:18px 28px;display:flex;flex-direction:column;gap:14px">' +
      '<div><p class="kick" style="margin:0 0 4px">Why ' + L[cfg.ok] + '</p><p style="margin:0;font-size:28px;line-height:1.32;font-weight:600">' + cfg.why + '</p></div>' +
      '<div class="qz-w2"><p class="kick" style="margin:0 0 4px;color:var(--accent)">Why not ' + L[cfg.bad] + '</p><p style="margin:0;font-size:28px;line-height:1.32;font-weight:600">' + cfg.whyNot + '</p></div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    const k = q('.qz-k').style, head = q('.qz-t'), vis = q('.qz-vis').style, why = q('.qz-why').style, w2 = q('.qz-w2').style;
    const os = all('.qz-o').map((e) => e.style), ls = all('.qz-l').map((e) => e.style), ok = q('.qz-ok'), no = q('.qz-no');
    const ring = UI.ring(kit, 1500, 650, 80, 2.1, 2.5, 5, R + 0.3, 'Pause to think');
    const C = UI.CORNER;
    const tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: cfg.poses || [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'read' }, { t: 2.5, pose: 'think' }, { t: R, pose: 'cheer' }, { t: R + 2.2, pose: 'explain' }, { t: N, pose: 'magnify' }],
      says: cfg.says || [],
    });
    const { seg, eo, ei, eob, lerp, TextFx } = kit;
    const mix = (c, p, base) => 'color-mix(in srgb, ' + c + ' ' + (base + (100 - base) * p).toFixed(0) + '%, transparent)';
    return (t) => {
      k.opacity = eo(seg(t, 0, 0.5));
      TextFx.fadeFromRight(head, t, 0.1, { stagger: 0.06 });
      const vp = seg(t, 0.7, 1.4);
      vis.opacity = eo(vp); vis.transform = 'translateY(' + lerp(30, 0, eo(vp)).toFixed(1) + 'px)';
      const rv = eo(seg(t, R, R + 0.5)), nb = eo(seg(t, N, N + 0.5));
      os.forEach((s, i) => {
        const a = 1.2 + i * 0.25, p = eo(seg(t, a, a + 0.5)), good = i === cfg.ok, tempt = i === cfg.bad;
        const dim = good ? 1 : tempt ? lerp(lerp(1, 0.5, rv), 1, nb) : lerp(1, 0.4, rv);
        s.opacity = (eo(seg(t, a, a + 0.3)) * dim).toFixed(3);
        s.transform = 'translateX(' + lerp(30, 0, p).toFixed(1) + 'px) scale(' + (good ? lerp(1, 1.025, Math.sin(Math.PI * seg(t, R, R + 0.7)) * 0.6 + rv * 0.4) : 1).toFixed(4) + ')';
        s.transformOrigin = '0 50%';
        if (good) { s.borderColor = mix('var(--main)', rv, 14); s.background = 'color-mix(in srgb, var(--ground) ' + lerp(90, 74, rv).toFixed(0) + '%, var(--main))'; ls[i].background = rv > 0.5 ? 'var(--main)' : 'transparent'; ls[i].color = rv > 0.5 ? 'var(--ground)' : 'var(--second)'; }
        if (tempt) s.borderColor = nb > 0 ? mix('var(--accent)', nb, 14) : mix('var(--second)', 0, 14);
      });
      const po = seg(t, R + 0.2, R + 0.7), pn = seg(t, N + 0.1, N + 0.6);
      ok.setAttribute('stroke-dasharray', eo(po).toFixed(3) + ' 1'); ok.style.opacity = po > 0 ? 1 : 0;
      no.setAttribute('stroke-dasharray', eo(pn).toFixed(3) + ' 1'); no.style.opacity = pn > 0 ? 1 : 0;
      const wp = seg(t, R + 0.3, R + 0.9);
      why.opacity = eo(wp); why.transform = 'translateY(' + lerp(24, 0, eo(wp)).toFixed(1) + 'px)';
      w2.opacity = nb; w2.transform = 'translateX(' + lerp(20, 0, nb).toFixed(1) + 'px)';
      ring(t);
      tutor.render(t);
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
};
