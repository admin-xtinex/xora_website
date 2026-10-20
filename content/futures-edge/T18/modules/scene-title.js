const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Title art: the fictional 15-minute history draws in, with a volume bar growing under each candle.
const TT_H = UI.H, ttX = (i) => 1010 + i * 46, ttY = (p) => 560 - (p - 60000) / 600 * 300, TT_V = 700;
kit.scene('title', {
  init(kit) {
    this.cd = UI.cdl(kit, 'tt-c', TT_H.length);
    let bars = '';
    TT_H.forEach((c, i) => { bars += '<rect class="tt-v" x="' + (ttX(i) - 15) + '" width="30" rx="4" style="fill:color-mix(in srgb, ' + (c[3] >= c[0] ? 'var(--up)' : 'var(--down)') + ' 55%, transparent)"/>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.cd.html + bars +
      '<line class="tt-base" x1="985" x2="1690" y1="' + TT_V + '" y2="' + TT_V + '" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 25%, transparent)"/>' +
      '<g class="tt-br"><line x1="1720" x2="1720" y1="' + ttY(60600).toFixed(1) + '" y2="' + ttY(60000).toFixed(1) + '" stroke-width="4" style="stroke:var(--accent)"/>' +
      '<line x1="1706" x2="1734" y1="' + ttY(60600).toFixed(1) + '" y2="' + ttY(60600).toFixed(1) + '" stroke-width="4" style="stroke:var(--accent)"/><line x1="1706" x2="1734" y1="' + ttY(60000).toFixed(1) + '" y2="' + ttY(60000).toFixed(1) + '" stroke-width="4" style="stroke:var(--accent)"/></g></svg>' +
      '<p class="kick tt-rl" style="position:absolute;left:1520px;top:' + (ttY(60300) - 14) + 'px;margin:0;color:var(--accent)">Range</p>' +
      '<p class="kick tt-vl" style="position:absolute;left:1010px;top:' + (TT_V + 18) + 'px;margin:0">Volume</p>' +
      '<div class="words" style="left:140px;top:220px;width:800px"><p class="kick title-k">Phase 4 · Charts &amp; market analysis</p>' +
      '<h1 class="line title-t" style="font-size:96px">Volume, volatility and range</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T18 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice · Fictional prices</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.vs = [...kit.stage.querySelectorAll('.tt-v')]; this.base = q('.tt-base').style; this.br = q('.tt-br').style; this.rl = q('.tt-rl').style; this.vl = q('.tt-vl').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }],
      says: [{ t0: 2.9, t1: 7.6, text: 'How busy?' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    this.base.opacity = eo(seg(t, 0.3, 0.8)); this.vl.opacity = eo(seg(t, 0.8, 1.3));
    TT_H.forEach((c, i) => {
      const a = 0.6 + i * 0.32, p = seg(t, a, a + 0.45);
      this.cd.set(i, { x: ttX(i), w: 30, o: c[0], h: lerp(c[0], c[1], eo(p)), l: lerp(c[0], c[2], eo(p)), c: lerp(c[0], c[3], eo(p)), y: ttY, op: eo(seg(t, a, a + 0.2)) });
      const h = c[4] * 5.5 * eob(seg(t, a + 0.15, a + 0.7), 1.4);
      this.vs[i].setAttribute('y', (TT_V - h).toFixed(1)); this.vs[i].setAttribute('height', Math.max(0, h).toFixed(1));
    });
    const b = seg(t, 6.0, 6.8);
    this.br.opacity = eo(b); this.br.transformBox = 'fill-box'; this.br.transformOrigin = 'center'; this.br.transform = 'scaleY(' + eo(b).toFixed(3) + ')';
    this.rl.opacity = eo(seg(t, 6.6, 7.1));
    this.tutor.render(t);
  },
});
