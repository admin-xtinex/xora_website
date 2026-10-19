const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Title art: a lever. A small "margin" block far from the pivot balances a big "position" block near it.
kit.scene('title', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="t12-g" x1="0" x2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<radialGradient id="t12-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 22%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="t12-art">' +
      '<ellipse cx="1390" cy="520" rx="470" ry="300" style="fill:url(#t12-f);opacity:.75"/>' +
      '<path d="M1612 612 L1552 700 L1672 700 Z" stroke-width="3" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main)"/>' +
      '<line x1="1440" y1="702" x2="1790" y2="702" stroke-width="3" style="stroke:color-mix(in srgb, var(--second) 25%, transparent)"/>' +
      '<g class="t12-beam">' +
      '<rect x="1000" y="598" width="760" height="14" rx="7" fill="url(#t12-g)"/>' +
      '<g class="t12-small"><rect x="1030" y="510" width="96" height="88" rx="14" stroke-width="3" style="fill:color-mix(in srgb, var(--ground) 72%, var(--main));stroke:var(--main)"/>' +
      '<text x="1078" y="566" text-anchor="middle" class="mono" style="fill:var(--second);font-size:30px">100</text>' +
      '<text x="1078" y="490" text-anchor="middle" style="fill:var(--main);font-size:24px;font-weight:600">Margin</text></g>' +
      '<g class="t12-big"><rect x="1580" y="300" width="170" height="298" rx="18" stroke-width="3" style="fill:color-mix(in srgb, var(--ground) 78%, var(--accent));stroke:var(--accent)"/>' +
      '<text x="1665" y="460" text-anchor="middle" class="mono" style="fill:var(--second);font-size:34px">1,000</text>' +
      '<text x="1665" y="280" text-anchor="middle" style="fill:var(--accent);font-size:24px;font-weight:600">Position</text></g>' +
      '</g></g>' +
      '<text x="1000" y="780" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">USDT · fictional example</text></svg>' +
      '<div class="words" style="left:140px;top:250px;width:860px"><p class="kick title-k">Phase 3 · Binance &amp; Futures Essentials</p>' +
      '<h1 class="line title-t" style="font-size:120px">Margin and Leverage</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T12 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.art = q('.t12-art').style; this.beam = q('.t12-beam'); this.small = q('.t12-small').style; this.big = q('.t12-big').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }],
      says: [{ t0: 2.9, t1: 7.4, text: 'Small deposit, big position.' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    this.art.opacity = eo(seg(t, -0.6, 0.6));
    // The big block drops in, the beam tips, then the small block lands and the lever settles into balance.
    const b = seg(t, 0.2, 0.9), s = seg(t, 1.2, 1.8);
    this.big.opacity = eo(seg(t, 0.2, 0.5)); this.big.transform = 'translateY(' + lerp(-120, 0, eob(b, 1.3)).toFixed(1) + 'px)';
    this.small.opacity = eo(seg(t, 1.2, 1.5)); this.small.transform = 'translateY(' + lerp(-120, 0, eob(s, 1.3)).toFixed(1) + 'px)';
    const tip = 5 * eo(b) * (1 - eio(seg(t, 1.6, 2.8)));
    const ang = tip + Math.sin(t * 2 * Math.PI / 3.4) * 1.2 * eo(seg(t, 2.4, 3.4));
    this.beam.setAttribute('transform', 'rotate(' + ang.toFixed(3) + ' 1612 605)');
    this.tutor.render(t);
  },
});
