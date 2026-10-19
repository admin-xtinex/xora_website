const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const UR_OUT = 13.2;
kit.scene('unreal', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick ur-k">Open or closed</p>' +
      '<h2 class="line ur-t">Unrealized vs realized</h2></div>' +
      '<p class="kick ur-st" style="position:absolute;left:1110px;top:340px;margin:0">Long 0.05 BTC · entry 60,000</p>' +
      '<div class="ur-d1" style="position:absolute;left:1110px;top:550px;width:520px;font-size:28px;line-height:1.4;font-weight:600"><b class="hl">Unrealized:</b> still open, moves with every tick.</div>' +
      '<div class="ur-d2" style="position:absolute;left:1110px;top:550px;width:520px;font-size:28px;line-height:1.4;font-weight:600"><b class="hl">Realized:</b> closed. The result is fixed, before fees.</div>' +
      '</div>'));
    this.chart = UI.chart(kit, { x0: 140, x1: 960, y0: 360, y1: 680, lo: 59500, hi: 61500, step: 500, t0: 0.8, t1: 20.6,
      keys: [[0.8, 60000], [1.2, 60000], [3.6, 60600], [7.4, 59700], [10.6, 60900], [12.8, 61200], [16.8, 60500], [21, 60700]], entry: 60000, entryLabel: 'Entry 60,000', label: 'BTC price in USDT · fictional' });
    const c = this.chart, xx = c.x(UR_OUT), xy = c.y(61200);
    kit.stage.append(kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="ur-x"><circle class="ur-rip" cx="' + xx.toFixed(1) + '" cy="' + xy.toFixed(1) + '" r="20" fill="none" stroke-width="3" style="stroke:var(--accent)"/>' +
      '<circle cx="' + xx.toFixed(1) + '" cy="' + xy.toFixed(1) + '" r="13" style="fill:var(--accent)"/>' +
      '<rect x="' + (xx - 84).toFixed(1) + '" y="' + (xy - 72).toFixed(1) + '" width="168" height="44" rx="10" style="fill:color-mix(in srgb, var(--ground) 70%, var(--accent));stroke:var(--accent);stroke-width:2"/>' +
      '<text x="' + xx.toFixed(1) + '" y="' + (xy - 42).toFixed(1) + '" text-anchor="middle" style="fill:var(--second);font-size:24px;font-weight:700">Exit 61,200</text></g></svg>'));
    this.mu = UI.meter(kit, 1110, 380, 520, 'Unrealized', 60);
    this.mr = UI.meter(kit, 1110, 380, 520, 'Realized', 60);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ur-k').style; this.t = q('.ur-t'); this.st = q('.ur-st').style; this.d1 = q('.ur-d1').style; this.d2 = q('.ur-d2').style;
    this.x = q('.ur-x').style; this.rip = q('.ur-rip');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'laptop' }, { t: 6.8, pose: 'confused' }, { t: 13.2, pose: 'cheer' }, { t: 16.0, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.chart.render(t, eo(seg(t, 0.4, 1.0)));
    const P = this.chart.price(Math.min(t, UR_OUT)), v = Math.round(P - 60000) * 0.05;
    const sw = eo(seg(t, UR_OUT, UR_OUT + 0.5)), mi = eo(seg(t, 0.8, 1.4));
    this.mu.set(v); this.mr.set(60);
    this.mu.style.opacity = mi * (1 - sw); this.mr.style.opacity = sw;
    this.mr.style.borderColor = 'var(--main)';
    this.mr.style.transform = 'scale(' + (1 + 0.05 * Math.sin(Math.PI * seg(t, UR_OUT, UR_OUT + 0.6))).toFixed(4) + ')';
    this.st.opacity = mi;
    this.d1.opacity = eo(seg(t, 1.4, 2.0)) * (1 - sw); this.d2.opacity = sw;
    const xp = seg(t, UR_OUT, UR_OUT + 0.4), r = seg(t, UR_OUT, UR_OUT + 0.9);
    this.x.opacity = eo(xp); this.rip.setAttribute('r', lerp(14, 46, eo(r)).toFixed(1)); this.rip.style.opacity = (1 - r) * (r > 0 ? 1 : 0);
    this.tutor.render(t);
  },
});
