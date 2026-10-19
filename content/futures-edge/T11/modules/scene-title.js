const { seg, eo, eob, eio, lerp, TextFx } = kit;
kit.scene('title', {
  init(kit) {
    let ticks = '';
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * Math.PI * 2, r1 = 236, r2 = i % 4 ? 250 : 262;
      ticks += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * r2).toFixed(1) + '" y2="' + (Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="title-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<radialGradient id="title-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 26%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="title-coin" transform="translate(1340 470)">' +
      '<circle r="300" style="fill:url(#title-f);opacity:.8"/>' +
      '<g class="title-ticks" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)">' + ticks + '</g>' +
      '<circle r="200" fill="none" stroke="url(#title-g)" stroke-width="10"/>' +
      '<g class="title-coinx"><circle cx="-78" cy="0" r="78" stroke-width="6" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main)"/><text x="-78" y="13" text-anchor="middle" class="mono" style="fill:var(--second);font-size:38px">BTC</text></g>' +
      '<g class="title-doc"><rect x="28" y="-96" width="128" height="170" rx="14" stroke-width="5" style="fill:color-mix(in srgb, var(--ground) 76%, var(--accent));stroke:var(--accent)"/>' +
      '<rect x="48" y="-70" width="88" height="9" rx="4" style="fill:var(--second);opacity:.7"/><rect x="48" y="-48" width="70" height="9" rx="4" style="fill:var(--second);opacity:.5"/><rect x="48" y="-26" width="80" height="9" rx="4" style="fill:var(--second);opacity:.5"/>' +
      '<path d="M52 40 C64 24 76 52 90 36 S112 30 126 40" fill="none" stroke-width="4" stroke-linecap="round" style="stroke:var(--accent)"/></g>' +
      '<text x="-8" y="128" text-anchor="middle" class="mono" style="fill:color-mix(in srgb, var(--second) 70%, var(--ground));font-size:34px">vs</text></g></svg>' +
      '<div class="words" style="left:140px;top:250px;width:900px"><p class="kick title-k">Phase 3 · Futures essentials</p>' +
      '<h1 class="line title-t" style="font-size:120px">Spot vs futures</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T11 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.coin = q('.title-coin'); this.ticks = q('.title-ticks');
    this.cx = q('.title-coinx').style; this.doc = q('.title-doc').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }],
      says: [{ t0: 2.9, t1: 8.4, text: 'Own it, or follow its price?' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    const c = seg(t, -0.6, 0.6);
    this.coin.setAttribute('transform', 'translate(1340 ' + (470 - t * 2).toFixed(1) + ') scale(' + (lerp(0.9, 1, eob(c, 1.6)) * (1 + 0.012 * Math.sin(t * 2 * Math.PI / 3.2))).toFixed(4) + ')');
    this.coin.style.opacity = eo(c);
    this.ticks.setAttribute('transform', 'rotate(' + (t * 6).toFixed(2) + ')');
    [this.cx, this.doc].forEach((s, i) => { const p = seg(t, 0.3 + i * 0.5, 0.9 + i * 0.5); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = 'center'; s.transform = 'translateX(' + lerp(i ? 40 : -40, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.6, 1, eob(p, 1.6)).toFixed(4) + ')'; });
    this.tutor.render(t);
  },
});
