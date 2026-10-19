const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Title art: a funding clock face whose inner arc (the margin buffer) slowly drains.
const TT_R = 190, TT_C = 2 * Math.PI * TT_R;
kit.scene('title', {
  init(kit) {
    let ticks = '';
    for (let i = 0; i < 24; i++) {
      const a = i / 24 * Math.PI * 2, r1 = 236, r2 = i % 3 ? 252 : 268;
      ticks += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * r2).toFixed(1) + '" y2="' + (Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="t13-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<radialGradient id="t13-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--accent) 20%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="t13-art" transform="translate(1380 470)">' +
      '<circle r="300" style="fill:url(#t13-f);opacity:.8"/>' +
      '<g stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)">' + ticks + '</g>' +
      '<circle r="' + TT_R + '" fill="none" stroke-width="16" style="stroke:color-mix(in srgb, var(--second) 10%, transparent)"/>' +
      '<circle class="t13-arc" r="' + TT_R + '" fill="none" stroke="url(#t13-g)" stroke-width="16" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="' + TT_C.toFixed(1) + '"/>' +
      '<line class="t13-hand" x1="0" y1="0" x2="0" y2="-215" stroke-width="5" stroke-linecap="round" style="stroke:var(--second)"/><circle r="10" style="fill:var(--second)"/>' +
      '<text y="80" text-anchor="middle" class="mono" style="fill:color-mix(in srgb, var(--second) 70%, var(--ground));font-size:28px;letter-spacing:.12em">MARGIN</text></g></svg>' +
      '<div class="words" style="left:140px;top:230px;width:900px"><p class="kick title-k">Phase 3 · Binance &amp; Futures Essentials</p>' +
      '<h1 class="line title-t" style="font-size:104px">Liquidation, Funding and Futures Risks</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T13 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.art = q('.t13-art'); this.arc = q('.t13-arc'); this.hand = q('.t13-hand');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }],
      says: [{ t0: 2.9, t1: 7.4, text: 'Know what can close you out.' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    const c = seg(t, -0.6, 0.6);
    this.art.setAttribute('transform', 'translate(1380 470) scale(' + (lerp(0.9, 1, eob(c, 1.6)) * (1 + 0.01 * Math.sin(t * 2 * Math.PI / 3.2))).toFixed(4) + ')');
    this.art.style.opacity = eo(c);
    this.arc.setAttribute('stroke-dashoffset', (TT_C * 0.62 * eio(seg(t, 0.4, 7.5))).toFixed(1));
    this.hand.setAttribute('transform', 'rotate(' + (t * 45).toFixed(2) + ')');
    this.tutor.render(t);
  },
});
