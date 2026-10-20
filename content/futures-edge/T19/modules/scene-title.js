const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Title art: the fictional 15-minute chart draws in; one short trade (entry #3, exit #7) is bracketed; a stopwatch sweeps.
const TT_H = UI.H, ttX = (i) => 1010 + i * 46, ttY = (p) => 640 - (p - 59950) / 330 * 330;
kit.scene('title', {
  init(kit) {
    this.cd = UI.cdl(kit, 'tt-c', TT_H.length);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<rect class="tt-tr" x="' + ttX(3) + '" y="' + ttY(60120) + '" width="' + (ttX(7) - ttX(3)) + '" height="' + (ttY(60000) - ttY(60120)) + '" rx="8" style="fill:color-mix(in srgb, var(--up) 16%, transparent);stroke:var(--up);stroke-width:2"/>' +
      this.cd.html +
      '<g transform="translate(1600 330)" class="tt-sw"><circle r="64" fill="none" stroke-width="6" style="stroke:color-mix(in srgb, var(--second) 25%, transparent)"/>' +
      '<rect x="-12" y="-86" width="24" height="14" rx="4" style="fill:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
      '<circle class="tt-arc" r="64" fill="none" stroke-width="6" stroke-linecap="round" transform="rotate(-90)" pathLength="1" style="stroke:var(--main)"/>' +
      '<line class="tt-hand" x1="0" y1="0" x2="0" y2="-48" stroke-width="5" stroke-linecap="round" style="stroke:var(--second)"/><circle r="7" style="fill:var(--second)"/></g></svg>' +
      '<p class="tag tt-l" style="left:' + (ttX(3) - 6) + 'px;top:' + (ttY(60120) - 52) + 'px;color:var(--up);border-color:var(--up)">4 minutes</p>' +
      '<div class="words" style="left:140px;top:220px;width:800px"><p class="kick title-k">Phase 5 · Scalping &amp; risk management</p>' +
      '<h1 class="line title-t" style="font-size:96px">What is scalping?</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T19 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice · Fictional prices</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.tr = q('.tt-tr').style; this.l = q('.tt-l').style; this.sw = q('.tt-sw').style; this.arc = q('.tt-arc'); this.hand = q('.tt-hand');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }],
      says: [{ t0: 2.9, t1: 7.6, text: 'Phase 5!' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    TT_H.forEach((c, i) => {
      const a = 0.5 + i * 0.3, p = seg(t, a, a + 0.45);
      this.cd.set(i, { x: ttX(i), w: 30, o: c[0], h: lerp(c[0], c[1], eo(p)), l: lerp(c[0], c[2], eo(p)), c: lerp(c[0], c[3], eo(p)), y: ttY, op: eo(seg(t, a, a + 0.2)) });
    });
    const b = seg(t, 5.4, 6.2);
    this.tr.opacity = eo(b); this.tr.transformBox = 'fill-box'; this.tr.transformOrigin = '0 50%'; this.tr.transform = 'scaleX(' + eo(b).toFixed(3) + ')';
    UI.rise(this.l, t, 6.0, { dy: 10 });
    const w = seg(t, 0.8, 1.4);
    this.sw.opacity = eo(w);
    const sweep = seg(t, 1.2, 9.6);
    this.arc.setAttribute('stroke-dasharray', sweep.toFixed(3) + ' 1');
    this.hand.setAttribute('transform', 'rotate(' + (sweep * 360).toFixed(1) + ')');
    this.tutor.render(t);
  },
});
