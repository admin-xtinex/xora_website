const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('meters', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick mt-k">One price, two results</p>' +
      '<h2 class="line mt-t">Same move, opposite results</h2></div>' +
      '<p class="kick mt-l1" style="position:absolute;left:1180px;top:330px;margin:0">Both: 0.01 BTC · entry 60,000</p>' +
      '<span class="chip mt-flip" style="position:absolute;left:470px;top:722px;font-size:28px;padding:12px 26px;background:color-mix(in srgb, var(--ground) 70%, var(--accent));border-color:var(--accent)">The market reverses: results flip</span>' +
      '</div>'));
    this.chart = UI.chart(kit, { x0: 140, x1: 1000, y0: 370, y1: 700, lo: 58000, hi: 62000, step: 1000, t0: 0.8, t1: 22.6,
      keys: [[0.8, 60000], [1.6, 60000], [6.2, 61500], [11.7, 61500], [16.4, 58500], [24, 58500]], entry: 60000, entryLabel: 'Entry 60,000', label: 'BTC price in USDT · fictional' });
    this.ml = UI.meter(kit, 1180, 380, 460, 'Long', 15);
    this.ms = UI.meter(kit, 1180, 560, 460, 'Short', 15);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mt-k').style; this.t = q('.mt-t'); this.l1 = q('.mt-l1').style; this.flip = q('.mt-flip').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'candles' }, { t: 11.7, pose: 'confused' }, { t: 16.8, pose: 'explain' }],
      says: [{ t0: 12.2, t1: 15.4, text: 'Uh-oh, a reversal!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.chart.render(t, eo(seg(t, 0.4, 1.0)));
    const P = this.chart.price(t), v = Math.round((P - 60000)) * 0.01;
    this.ml.set(v); this.ms.set(-v);
    [this.ml.style, this.ms.style].forEach((s, i) => { const p = seg(t, 0.8 + i * 0.3, 1.4 + i * 0.3); s.opacity = eo(p); s.transform = 'translateX(' + lerp(30, 0, eo(p)).toFixed(1) + 'px)'; });
    this.l1.opacity = eo(seg(t, 0.8, 1.3));
    const lead = (P > 60050 ? 1 : P < 59950 ? -1 : 0);
    this.ml.style.borderColor = lead > 0 ? 'var(--main)' : ''; this.ms.style.borderColor = lead < 0 ? 'var(--main)' : '';
    const fp = seg(t, 13.6, 14.2);
    this.flip.opacity = eo(fp); this.flip.transform = 'scale(' + lerp(0.85, 1, eob(fp, 1.7)).toFixed(4) + ')';
    this.tutor.render(t);
  },
});
