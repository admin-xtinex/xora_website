const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Title art: the same fifteen minutes as 1m, 5m and 15m candles, one row each.
const TT_ROWS = [[1, 250, '1m'], [5, 450, '5m'], [15, 650, '15m']];
const TT_X0 = 1090, TT_PPM = 38;
kit.scene('title', {
  init(kit) {
    this.cd = UI.cdl(kit, 'tt-c', 19);
    let labels = '';
    TT_ROWS.forEach((r) => { labels += '<text class="tt-l mono" x="1050" y="' + (r[1] + 10) + '" text-anchor="end" style="fill:var(--main);font-size:34px">' + r[2] + '</text>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="tt-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 18%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<ellipse cx="1370" cy="450" rx="420" ry="330" style="fill:url(#tt-f);opacity:.7"/>' + labels + this.cd.html + '</svg>' +
      '<div class="words" style="left:140px;top:250px;width:860px"><p class="kick tt-k">Phase 4 · Charts &amp; market analysis</p>' +
      '<h1 class="line tt-t" style="font-size:112px">1m / 5m / 15m Timeframes</h1>' +
      '<div class="rule tt-r" style="width:260px"></div>' +
      '<p class="sub tt-s">Lesson T15 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice · Fictional prices</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tt-k').style; this.t = q('.tt-t'); this.r = q('.tt-r').style; this.s = q('.tt-s').style;
    this.ls = [...kit.stage.querySelectorAll('.tt-l')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'point', flip: true }, { t: 6.4, pose: 'present' }],
      says: [{ t0: 2.9, t1: 6.2, text: 'Zoom in, zoom out!' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    const bob = Math.sin(t * 2 * Math.PI / 3.4) * 3;
    let idx = 0;
    TT_ROWS.forEach((r, k) => {
      const a = 0.2 + k * 1.1, p = eo(seg(t, a, a + 0.9));
      const yOf = (v) => r[1] + 70 - (v - 59900) / 290 * 150 + bob;
      UI.tfDraw(this.cd, idx, r[0], TT_X0, TT_PPM, yOf, { op: eo(seg(t, a, a + 0.4)), grow: p });
      idx += 15 / r[0];
      this.ls[k].opacity = eo(seg(t, a, a + 0.4));
    });
    this.tutor.render(t);
  },
});
