const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MK_PV = [60320, 60150, 60250, 60080, 60210, 59990, 60110, 59930];
const MK_X0 = 260, MK_DX = 160, mkY = (p) => 740 - (p - 59880) / 500 * 400, MK_BIG = 13;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.sw = UI.swing(kit, 'mk-s', { pv: MK_PV, x0: MK_X0, dx: MK_DX, yOf: mkY, lab: ['', 'L', 'LH', 'LL', 'LH', 'LL', 'LH', ''], t0: 5.6, t1: 9.6, conf: false, wig: 0, fs: 22 });
    const cs = UI.candlesOf(this.sw.f, 7, 28);
    // The rise from 60,080 to 60,210 happens mostly in one big green candle.
    cs[12] = [cs[12][0], Math.max(cs[12][0], 60095), Math.min(cs[12][0], 60070), 60090];
    cs[13] = [60090, 60200, 60085, 60195]; cs[14] = [60195, 60214, 60182, 60205]; cs[15] = [60205, 60216, 60190, 60200];
    cs[16] = [60200, Math.max(60200, cs[16][1]), cs[16][2], cs[16][3]];
    this.cs = cs;
    this.cd = UI.cdl(kit, 'mk-c', 28);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="mk-grid">' + UI.grid(220, 1420, mkY, 59950, 60300, 50) + '</g>' + this.cd.html + this.sw.html + '</svg>' + this.sw.tags +
      '<p class="tag mk-big" style="left:' + (MK_X0 + MK_BIG * 40 + 20) + 'px;top:' + (mkY(60200) - 120).toFixed(1) + 'px;transform:translateX(-50%);border-color:var(--up);color:var(--up)">+105 in one candle!</p>' +
      '<div class="glass mk-card" style="left:1060px;top:176px;width:620px;padding:18px 28px"><p class="def" style="margin:0;font-size:30px">Trend comes from the <b>swings</b>, on a stated <b>timeframe</b>, not one candle.</p></div>' +
      '<div class="words" style="left:140px;top:170px;width:900px"><p class="kick mk-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line mk-t">Not from one candle</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.grid = q('.mk-grid').style; this.big = q('.mk-big').style; this.card = q('.mk-card').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'confused' }, { t: 5.5, pose: 'magnify' }, { t: 10.2, pose: 'explain' }, { t: 15.1, pose: 'thumbs' }],
      says: [{ t0: 1.6, t1: 4.8, text: 'Uptrend now?' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    const dim = 1 - 0.45 * eo(seg(t, 5.4, 6.0));
    this.cs.forEach((c, i) => {
      const p = seg(t, 0.5 + i * 0.05, 0.9 + i * 0.05);
      const hot = i === MK_BIG ? 1 + 0.06 * Math.sin(Math.PI * seg(t, 1.6, 2.6)) : 1;
      this.cd.set(i, { x: MK_X0 + i * 40 + 20, w: 24 * hot, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: mkY, op: eo(p) * (i === MK_BIG ? 1 : dim) });
    });
    UI.rise(this.big, t, 1.6, { s: 0.9, out: 5.0 }); this.big.transform += ' translateX(-50%)';
    this.sw.render(t, 0.9);
    UI.rise(this.card, t, 10.3);
    this.tutor.render(t);
  },
});
