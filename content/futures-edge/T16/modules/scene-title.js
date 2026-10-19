const { seg, eo, eob, eio, lerp, TextFx } = kit;
const TT_PV = [59900, 60100, 59980, 60200, 60080, 60300, 60180, 60380];
kit.scene('title', {
  init(kit) {
    this.sw = UI.swing(kit, 'tt-s', { pv: TT_PV, x0: 1080, dx: 86, yOf: (p) => 690 - (p - 59900) / 480 * 420, lab: ['', '', 'HL', 'HH', 'HL', 'HH', 'HL', ''], t0: 0.2, t1: 5.6, wig: 0 });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="tt-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--up) 16%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<ellipse cx="1380" cy="460" rx="420" ry="320" style="fill:url(#tt-f);opacity:.7"/>' + this.sw.html + '</svg>' + this.sw.tags +
      '<div class="words" style="left:140px;top:250px;width:860px"><p class="kick tt-k">Phase 4 · Charts &amp; market analysis</p>' +
      '<h1 class="line tt-t" style="font-size:112px">Trend and Market Structure</h1>' +
      '<div class="rule tt-r" style="width:260px"></div>' +
      '<p class="sub tt-sb">Lesson T16 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice · Fictional prices</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tt-k').style; this.t = q('.tt-t'); this.r = q('.tt-r').style; this.s = q('.tt-sb').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'think' }, { t: 6.4, pose: 'present' }],
      says: [{ t0: 2.9, t1: 6.2, text: 'Peaks and dips!' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    this.sw.render(t);
    this.tutor.render(t);
  },
});
