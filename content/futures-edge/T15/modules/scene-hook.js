const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const HK_X0 = 200, HK_PPM = 80, hkY = (p) => 720 - (p - 59900) / 290 * 370;
const HK_ST = [[0, 1], [6.4, 5], [8.8, 15], [13.2, 1], [15.6, 5]];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'hk-c', 19);
    this.sw = UI.tfSwitch(kit, 'hk-sw', 1090, 196);
    let tl = '';
    for (let m = 0; m <= 15; m += 5) tl += '<text x="' + (HK_X0 + m * HK_PPM) + '" y="758" text-anchor="middle" class="axis">' + UI.hm(m) + '</text>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="hk-grid">' + UI.grid(HK_X0 - 20, HK_X0 + 15 * HK_PPM + 20, hkY, 59950, 60150, 50) + tl + '</g>' + this.cd.html + '</svg>' +
      this.sw.html +
      '<p class="fict hk-f" style="position:absolute;left:200px;top:320px;margin:0">BTC/USDT · 10:00 to 10:15 · fictional</p>' +
      '<p class="hk-n mono" style="position:absolute;left:1440px;top:204px;margin:0;font-size:30px;color:var(--main)"></p>' +
      '<div class="words" style="left:140px;top:170px;width:940px"><p class="kick hk-k">Same market, three views</p>' +
      '<h2 class="line hk-t">How many candles?</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.grid = q('.hk-grid').style; this.f = q('.hk-f').style; this.swst = q('.hk-sw').style; this.n = q('.hk-n');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'candles', flip: true }, { t: 6.1, pose: 'point', flip: true }, { t: 10.6, pose: 'think' }, { t: 15.0, pose: 'idea' }],
      says: [{ t0: 11.0, t1: 14.6, text: 'Same trades!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0)); this.f.opacity = 0.9 * eo(seg(t, 0.6, 1.0));
    UI.rise(this.swst, t, 1.6, { s: 0.9 });
    const st = UI.tfState(HK_ST, t);
    // At the start the fifteen 1-minute candles appear one by one, left to right.
    let idx = 0;
    UI.tfAll(this.cd, st, HK_X0, HK_PPM, hkY);
    if (t < 4) UI.M1.forEach((c, i) => { const p = seg(t, 0.8 + i * 0.18, 1.2 + i * 0.18); this.cd.set(i, { x: HK_X0 + (i + 0.5) * HK_PPM, w: 46, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: hkY, op: eo(p) }); });
    this.sw.set(st.n);
    UI.txt(this.n, (15 / st.n) + (st.n === 15 ? ' candle' : ' candles'));
    this.n.style.opacity = eo(seg(t, 2.0, 2.4));
    this.tutor.render(t);
  },
});
