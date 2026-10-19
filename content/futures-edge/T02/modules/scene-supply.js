const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
kit.scene('supply', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick x-k">Supply</p>' +
      '<h2 class="line x-t">More sellers push the price down</h2>' +
      '<p class="def x-d"><b>Supply</b> is how much people want to sell, and at what price.</p></div>' +
      '<div class="glass x-an" style="left:140px;top:570px;width:800px;padding:24px 34px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Everyday example</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">A fish seller near closing time, with lots left: to sell it all, she cuts her price.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.x-k').style; this.t = q('.x-t'); this.d = q('.x-d'); this.an = q('.x-an').style;
    const price = UI.steps([[0, 60600], [3.0, 60650], [5.0, 60600], [7.4, 60550], [9.6, 60600], [14.2, 60500], [15.4, 60400], [16.6, 60300], [17.8, 60200], [19.0, 60100], [20.2, 59900], [21.2, 59800]]);
    this.m = UI.mkt(kit, { x: 1000, y: 180, w: 760, lo: 59600, hi: 60800, t0: 1, t1: 22.4, price, buyers: () => 4, sellers: (t) => 4 + 8 * eio(seg(t, 12.4, 15.2)) });
    this.ms = this.m.el.style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'candles', flip: true }, { t: 0.6, pose: 'explain' }, { t: 5.4, pose: 'read' }, { t: 12.4, pose: 'point', flip: true }, { t: 18.8, pose: 'think' }],
      says: [{ t0: 19.8, t1: 22.6, text: 'Selling pressure pulls it down.' }],
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
