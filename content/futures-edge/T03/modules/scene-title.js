const { seg, eo, eob, eio, lerp, TextFx } = kit;
kit.scene('title', {
  init(kit) {
    let ticks = '';
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * Math.PI * 2, r1 = 236, r2 = i % 4 ? 250 : 262;
      ticks += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * r2).toFixed(1) + '" y2="' + (Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="t3-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<radialGradient id="t3-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 26%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="ti-coin" transform="translate(1340 470)">' +
      '<circle r="300" style="fill:url(#t3-f);opacity:.8"/>' +
      '<g class="ti-ticks" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)">' + ticks + '</g>' +
      '<circle r="200" fill="none" stroke="url(#t3-g)" stroke-width="10"/>' +
      '<circle r="168" fill="none" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 25%, transparent)"/>' +
      '<text class="ti-up mono" y="-22" text-anchor="middle" style="fill:var(--main);font-size:84px;font-weight:500">BTC</text>' +
      '<line class="ti-path" x1="-120" x2="120" y1="10" y2="10" pathLength="1" stroke-width="6" stroke-linecap="round" style="stroke:var(--second)"/>' +
      '<text class="ti-dn mono" y="96" text-anchor="middle" style="fill:var(--accent);font-size:72px;font-weight:500">USDT</text></g></svg>' +
      '<div class="words" style="left:140px;top:250px;width:900px"><p class="kick ti-k">Phase 1 · Crypto foundations</p>' +
      '<h1 class="line ti-t" style="font-size:120px">Trading pairs: BTC/USDT</h1>' +
      '<div class="rule ti-r" style="width:260px"></div>' +
      '<p class="sub ti-s">Lesson T03 · about 4 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ti-k').style; this.t = q('.ti-t'); this.r = q('.ti-r').style; this.s = q('.ti-s').style;
    this.coin = q('.ti-coin'); this.ticks = q('.ti-ticks'); this.path = q('.ti-path'); this.up = q('.ti-up').style; this.dn = q('.ti-dn').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }],
      says: [{ t0: 2.9, t1: 7.4, text: 'Two names, one price.' }],
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
    this.path.setAttribute('stroke-dasharray', eio(seg(t, 0.9, 1.6)) + ' 1');
    // BTC drops in from above, USDT rises from below, the bar draws between them.
    const u = seg(t, 0.2, 0.9), d = seg(t, 0.6, 1.3);
    this.up.opacity = eo(u); this.up.transform = 'translateY(' + lerp(-40, 0, eob(u, 1.6)).toFixed(1) + 'px)';
    this.dn.opacity = eo(d); this.dn.transform = 'translateY(' + lerp(40, 0, eob(d, 1.6)).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
