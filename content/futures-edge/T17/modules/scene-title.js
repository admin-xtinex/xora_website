const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A fictional price line bounces between a floor zone and a ceiling zone, then pushes up through the ceiling.
const TT_K = [[0, 620], [0.12, 330], [0.24, 590], [0.38, 340], [0.52, 600], [0.66, 335], [0.76, 470], [0.9, 250], [1, 210]];
const ttY = (p) => UI.path(TT_K, p) + Math.sin(p * 61) * 6 * Math.sin(Math.PI * p);
const ttX = (p) => 1020 + p * 640;
kit.scene('title', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<rect class="tt-res" x="980" y="305" width="720" height="60" rx="10" style="fill:color-mix(in srgb, var(--accent) 22%, transparent);stroke:color-mix(in srgb, var(--accent) 70%, transparent);stroke-width:2"/>' +
      '<rect class="tt-sup" x="980" y="570" width="720" height="60" rx="10" style="fill:color-mix(in srgb, var(--main) 18%, transparent);stroke:color-mix(in srgb, var(--main) 65%, transparent);stroke-width:2"/>' +
      '<text class="tt-rl kick" x="985" y="290" style="fill:var(--accent);font-size:22px">Resistance</text>' +
      '<text class="tt-sl kick" x="985" y="666" style="fill:var(--main);font-size:22px">Support</text>' +
      '<path class="tt-line" fill="none" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" style="stroke:var(--second)"/>' +
      '<circle class="tt-dot" r="11" style="fill:var(--main)"/></svg>' +
      '<div class="words" style="left:140px;top:220px;width:800px"><p class="kick title-k">Phase 4 · Charts &amp; market analysis</p>' +
      '<h1 class="line title-t" style="font-size:96px">Support, resistance, breakout, fakeout</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T17 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice · Fictional prices</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.res = q('.tt-res').style; this.sup = q('.tt-sup').style; this.rl = q('.tt-rl').style; this.sl = q('.tt-sl').style;
    this.line = q('.tt-line'); this.dot = q('.tt-dot');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }],
      says: [{ t0: 2.9, t1: 7.6, text: 'Zones, not walls!' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    [this.sup, this.res].forEach((s, i) => { const p = seg(t, 0.3 + i * 0.4, 1.0 + i * 0.4); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = '0 50%'; s.transform = 'scaleX(' + eo(p).toFixed(3) + ')'; });
    this.sl.opacity = eo(seg(t, 1.0, 1.5)); this.rl.opacity = eo(seg(t, 1.4, 1.9));
    const end = eio(seg(t, 0.8, 7.5));
    this.line.setAttribute('d', UI.line(ttY, 0, Math.max(0.001, end), ttX, (y) => y, 0.004));
    this.dot.setAttribute('cx', ttX(end).toFixed(1)); this.dot.setAttribute('cy', ttY(end).toFixed(1));
    this.dot.style.opacity = eo(seg(t, 0.8, 1.1));
    // The ceiling glows as price breaks through it.
    const br = seg(t, 6.2, 7.2);
    this.res.fill = 'color-mix(in srgb, var(--accent) ' + (22 + 26 * Math.sin(Math.PI * br)).toFixed(0) + '%, transparent)';
    this.tutor.render(t);
  },
});
