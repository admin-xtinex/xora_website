const { seg, eo, eob, lerp, TextFx } = kit;
const TT_C = [[0, 40, -50, 20], [20, 60, 0, 50], [50, 70, 10, 30], [30, 40, -40, -30], [-30, 0, -60, -10], [-10, 50, -20, 40], [40, 90, 30, 80]];
kit.scene('title', {
  init(kit) {
    let ticks = '';
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * Math.PI * 2, r1 = 236, r2 = i % 4 ? 250 : 262;
      ticks += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * r2).toFixed(1) + '" y2="' + (Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    this.cd = UI.cdl(kit, 'tt-c', TT_C.length);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="t25-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<radialGradient id="t25-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 26%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="tt-coin" transform="translate(1340 470)"><circle r="300" style="fill:url(#t25-f);opacity:.8"/>' +
      '<g class="tt-ticks" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)">' + ticks + '</g>' +
      '<circle r="200" fill="none" stroke="url(#t25-g)" stroke-width="10"/>' + this.cd.html + '</g></svg>' +
      '<div class="words" style="left:140px;top:230px;width:900px"><p class="kick title-k">Phase 6 · XORA Intelligence</p>' +
      '<h1 class="line title-t" style="font-size:112px">How XORA analyses a coin</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T25 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;top:690px;margin:0">Education only · Not financial advice</p></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.coin = q('.tt-coin'); this.ticks = q('.tt-ticks');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }, { t: 5.2, pose: 'candles' }],
      says: [],
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
    const Y = (v) => -v * 1.3 + 30;
    TT_C.forEach((k, i) => {
      const a = 0.4 + i * 0.5, p = eo(seg(t, a, a + 0.5));
      this.cd.set(i, { x: -120 + i * 40, w: 24, o: k[0], h: k[0] + (k[1] - k[0]) * p, l: k[0] + (k[2] - k[0]) * p, c: k[0] + (k[3] - k[0]) * p, y: Y, op: eo(seg(t, a, a + 0.2)) });
    });
    this.tutor.render(t);
  },
});
