const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:760px"><p class="kick hk-k">Two directions</p>' +
      '<h2 class="line hk-t">Prices move both ways</h2>' +
      '<p class="sub hk-s">Most people only think about the price going up.</p>' +
      '<p class="def hk-q" style="margin-top:10px">Can anyone <b>gain when the price falls?</b></p></div>' +
      '<span class="chip hk-up" style="position:absolute;left:1000px;top:690px;font-size:28px;padding:12px 24px"><span style="color:var(--main)">▲</span>Price rises</span>' +
      '<span class="chip hk-dn" style="position:absolute;left:1250px;top:690px;font-size:28px;padding:12px 24px"><span style="color:var(--accent)">▼</span>Price falls</span>' +
      '</div>'));
    this.chart = UI.chart(kit, { x0: 1000, x1: 1600, y0: 260, y1: 640, lo: 58000, hi: 62000, step: 1000, t0: 0.6, t1: 12.5,
      keys: [[0.6, 60000], [1.2, 60000], [5.2, 61800], [6.0, 61700], [10.4, 58600], [12.5, 59200]], label: 'BTC price in USDT · fictional' });
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.s = q('.hk-s'); this.q = q('.hk-q');
    this.up = q('.hk-up').style; this.dn = q('.hk-dn').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'candles' }, { t: 6.8, pose: 'think' }, { t: 10.6, pose: 'idea' }],
      says: [{ t0: 10.8, t1: 13.7, text: 'Yes, it can!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 1.4, { stagger: 0.06 });
    TextFx.fadeFromRight(this.q, t, 6.8, { stagger: 0.08 });
    this.chart.render(t, eo(seg(t, 0.3, 0.9)));
    [[this.up, 3.4], [this.dn, 8.6]].forEach(([s, a]) => { const p = seg(t, a, a + 0.5); s.opacity = eo(p); s.transform = 'translateY(' + lerp(20, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.85, 1, eob(p, 1.7)).toFixed(4) + ')'; });
    this.tutor.render(t);
  },
});
