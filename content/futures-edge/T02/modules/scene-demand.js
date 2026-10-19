const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
kit.scene('demand', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick x-k">Demand</p>' +
      '<h2 class="line x-t">More buyers push the price up</h2>' +
      '<p class="def x-d"><b>Demand</b> is how much people want to buy, and at what price.</p></div>' +
      '<div class="glass x-an" style="left:140px;top:570px;width:800px;padding:24px 34px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Everyday example</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">The last mangoes at a busy stall: when many people want them, the seller can ask more.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.x-k').style; this.t = q('.x-t'); this.d = q('.x-d'); this.an = q('.x-an').style;
    const price = UI.steps([[0, 60000], [3.0, 60050], [5.0, 60000], [7.4, 59950], [9.6, 60000], [14.4, 60100], [15.6, 60200], [16.8, 60300], [18.0, 60400], [19.2, 60500], [20.4, 60600]]);
    this.m = UI.mkt(kit, { x: 1000, y: 180, w: 760, lo: 59600, hi: 60800, t0: 1, t1: 22.4, price, buyers: (t) => 4 + 8 * eio(seg(t, 12.6, 15.4)), sellers: () => 4 });
    this.ms = this.m.el.style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 5.4, pose: 'idea' }, { t: 12.4, pose: 'point', flip: true }, { t: 18.4, pose: 'candles', flip: true }],
      says: [{ t0: 19.6, t1: 22.6, text: 'Eager buyers lift the price.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    const a = seg(t, 5.4, 6.1);
    this.an.opacity = eo(a); this.an.transform = 'translateY(' + lerp(30, 0, eo(a)) + 'px)';
    const m = seg(t, 0.5, 1.2);
    this.ms.opacity = eo(m); this.ms.transform = 'translateX(' + lerp(50, 0, eo(m)) + 'px)';
    this.m.render(t);
    this.tutor.render(t);
  },
});
