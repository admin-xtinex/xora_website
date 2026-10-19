const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const HK_PV = [60000, 60150, 60040, 60220, 60100, 60260, 60170];
const HK_X0 = 260, HK_DX = 200, hkY = (p) => 720 - (p - 59960) / 340 * 360;
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.sw = UI.swing(kit, 'hk-s', { pv: HK_PV, x0: HK_X0, dx: HK_DX, yOf: hkY, lab: ['', 'Peak', 'Dip', 'Peak', 'Dip', 'Peak', ''], t0: 11.0, t1: 14.4, conf: false, wig: 0 });
    this.cs = UI.candlesOf(this.sw.f, 6, 24);
    this.cd = UI.cdl(kit, 'hk-c', 24);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="hk-grid">' + UI.grid(220, 1500, hkY, 60000, 60250, 50) + '</g>' + this.cd.html +
      '<rect class="hk-one" x="' + (HK_X0 + 13 * 50 - 4) + '" y="380" width="58" height="360" rx="12" fill="none" stroke-width="3" stroke-dasharray="8 6" style="stroke:var(--accent)"/>' +
      this.sw.html + '</svg>' + this.sw.tags +
      '<p class="tag hk-q" style="left:' + (HK_X0 + 13 * 50 + 25) + 'px;top:318px;transform:translateX(-50%);border-color:var(--accent);color:var(--accent)">Up? Down?</p>' +
      '<p class="fict" style="position:absolute;left:1100px;top:250px;margin:0">BTC/USDT · 1-minute candles · fictional</p>' +
      '<div class="words" style="left:140px;top:170px;width:940px"><p class="kick hk-k">Market structure</p>' +
      '<h2 class="line hk-t">Where is price going?</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.grid = q('.hk-grid').style; this.one = q('.hk-one').style; this.q = q('.hk-q').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.5, pose: 'think' }, { t: 5.6, pose: 'confused' }, { t: 10.9, pose: 'point', flip: true }, { t: 15.0, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    const dim = 1 - 0.55 * eo(seg(t, 10.8, 11.4));
    this.cs.forEach((c, i) => {
      const p = seg(t, 0.6 + i * 0.16, 1.0 + i * 0.16);
      this.cd.set(i, { x: HK_X0 + i * 50 + 25, w: 30, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: hkY, op: eo(p) * (i === 13 ? 1 : dim * (t > 5.8 && t < 10.8 ? 0.5 : 1)) });
    });
    const one = eo(seg(t, 5.8, 6.3)) * (1 - eo(seg(t, 10.4, 10.9)));
    this.one.opacity = one; this.q.opacity = one;
    this.sw.render(t);
    this.tutor.render(t);
  },
});
