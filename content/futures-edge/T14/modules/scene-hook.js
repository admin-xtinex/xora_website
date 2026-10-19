const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const HK_X0 = 220, HK_X1 = 1100, HK_CX = 660;
const hkY = (p) => 720 - (p - 59920) / 220 * 380, hkX = (s) => HK_X0 + (HK_X1 - HK_X0) * s / 60;
const HK_MORE = [[60080, 60110, 60020, 60040], [60040, 60070, 59990, 60060], [60060, 60130, 60050, 60110], [60110, 60125, 60030, 60045]];
const HK_TAGS = [['High', 60120], ['Close', 60080], ['Open', 60000], ['Low', 59940]];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'hk-c', 5);
    let tags = '';
    HK_TAGS.forEach((g) => { tags += '<p class="tag hk-tag" style="left:' + (HK_CX + 56) + 'px;top:' + (hkY(g[1]) - 22).toFixed(1) + 'px"><span style="color:color-mix(in srgb, var(--second) 60%, var(--ground))">' + g[0] + '</span> ' + UI.fmt(g[1]) + '</p>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="hk-grid">' + UI.grid(200, 1540, hkY, 59950, 60100, 50) +
      '<text x="' + HK_X0 + '" y="762" class="axis hk-ax">0 s</text><text x="' + hkX(30) + '" y="762" text-anchor="middle" class="axis hk-ax">30 s</text><text x="' + HK_X1 + '" y="762" text-anchor="end" class="axis hk-ax">60 s</text></g>' +
      '<path class="hk-line" fill="none" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>' + this.cd.html +
      '<circle class="hk-dot" r="9" style="fill:var(--second)"/></svg>' +
      '<p class="fict hk-f" style="position:absolute;left:220px;top:318px;margin:0">BTC/USDT · one minute · fictional</p>' + tags +
      '<div class="words" style="left:140px;top:170px;width:1400px"><p class="kick hk-k">One minute of price</p>' +
      '<h2 class="line hk-t">From a line to a candle</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.grid = q('.hk-grid').style; this.f = q('.hk-f').style;
    this.line = q('.hk-line'); this.dot = q('.hk-dot'); this.tags = all('.hk-tag').map((e) => e.style); this.ax = all('.hk-ax').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'point', flip: true }, { t: 5.6, pose: 'magnify' }, { t: 10.4, pose: 'idea' }, { t: 15.6, pose: 'present' }],
      says: [{ t0: 10.8, t1: 14.6, text: 'Just four prices!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    this.f.opacity = 0.9 * eo(seg(t, 0.5, 1.0));
    const M = UI.MIN, draw = seg(t, 0.8, 5.0), sq = eio(seg(t, 6.0, 8.6));
    const end = Math.round(draw * 120);
    let d = '';
    for (let i = 0; i <= end; i++) d += (i ? 'L' : 'M') + (HK_CX + (hkX(i / 2) - HK_CX) * (1 - sq)).toFixed(1) + ' ' + hkY(M.px[i]).toFixed(1);
    this.line.setAttribute('d', d || 'M0 0');
    this.line.style.stroke = 'color-mix(in srgb, var(--up) ' + (sq * 100).toFixed(0) + '%, var(--main))';
    this.line.style.opacity = t < 0.8 ? 0 : 1 - eo(seg(t, 8.4, 9.2));
    this.dot.setAttribute('cx', (HK_CX + (hkX(end / 2) - HK_CX) * (1 - sq)).toFixed(1)); this.dot.setAttribute('cy', hkY(M.px[end]).toFixed(1));
    this.dot.style.opacity = (t > 0.8 ? 1 : 0) * (1 - eo(seg(t, 5.6, 6.2)));
    for (const a of this.ax) a.opacity = 1 - eo(seg(t, 6.0, 6.6));
    // The candle appears as the line collapses into its wick.
    const cb = eo(seg(t, 7.8, 9.2));
    this.cd.set(0, { x: HK_CX, w: lerp(8, 70, cb), o: 60000, h: 60120, l: 59940, c: lerp(60000, 60080, cb), y: hkY, op: eo(seg(t, 7.4, 8.4)) });
    this.tags.forEach((s, i) => {
      const p = seg(t, 10.6 + i * 0.5, 11.1 + i * 0.5);
      s.opacity = eo(p) * (1 - ei(seg(t, 15.0, 15.5)));
      s.transform = 'translateX(' + lerp(20, 0, eo(p)).toFixed(1) + 'px)';
    });
    HK_MORE.forEach((c, i) => {
      const p = seg(t, 15.6 + i * 0.45, 16.2 + i * 0.45);
      this.cd.set(i + 1, { x: HK_CX + 130 * (i + 1), w: 70, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: hkY, op: eo(seg(t, 15.6 + i * 0.45, 15.9 + i * 0.45)) });
    });
    this.tutor.render(t);
  },
});
