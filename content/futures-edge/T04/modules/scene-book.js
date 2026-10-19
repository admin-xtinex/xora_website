const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const BK_A = [[60010, 0.20], [60020, 0.50], [60030, 0.50], [60040, 0.80]], BK_B = [[59990, 0.30], [59980, 0.60], [59970, 0.40], [59960, 1.10]];
// Later changes as orders arrive and leave: [side, index, new amount, at]
const BK_CH = [['a', 2, 0.70, 16.4], ['b', 1, 0.20, 17.4], ['a', 3, 0.30, 18.4], ['b', 3, 0.90, 19.2]];
kit.scene('book', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick bk-k">Order book</p>' +
      '<h2 class="line bk-t">A live list of waiting orders</h2>' +
      '<p class="def bk-d">The <b>order book</b> lists waiting buy and sell orders, sorted by price.</p></div>' +
      '<div class="chip bk-c1" style="position:absolute;left:140px;top:600px;border-color:var(--accent);color:var(--accent)">▲ Sell orders: cheapest next to the middle</div>' +
      '<div class="chip bk-c2" style="position:absolute;left:140px;top:690px;border-color:var(--main);color:var(--main)">▼ Buy orders: highest next to the middle</div>' +
      '<p class="fict bk-f" style="position:absolute;left:1060px;top:716px;margin:0">Educational mock · not a real exchange screen · fictional prices</p>' +
      '</div>'));
    this.b = UI.book(kit, { x: 1060, y: 180, w: 600 });
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.bk-k').style; this.t = q('.bk-t'); this.d = q('.bk-d'); this.c1 = q('.bk-c1').style; this.c2 = q('.bk-c2').style; this.f = q('.bk-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'point', flip: true }, { t: 0.6, pose: 'explain' }, { t: 5.6, pose: 'point', flip: true }, { t: 10.8, pose: 'pointer', flip: true }, { t: 15.8, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    const bp = seg(t, 0.6, 1.3);
    this.b.el.style.opacity = eo(bp); this.b.el.style.transform = 'translateX(' + lerp(40, 0, eo(bp)) + 'px)';
    this.f.opacity = 0.9 * eo(seg(t, 1.2, 1.8));
    const qty = (side, i, q0) => { let q = q0; for (const c of BK_CH) if (c[0] === side && c[1] === i) q = lerp(q, c[2], eio(seg(t, c[3], c[3] + 0.5))); return q; };
    const flash = (side, i) => BK_CH.reduce((m, c) => (c[0] === side && c[1] === i ? Math.max(m, Math.sin(Math.PI * seg(t, c[3], c[3] + 0.8))) : m), 0);
    // Sell orders arrive top first (furthest from the middle), buy orders nearest first.
    const asks = BK_A.map((a, i) => { const at = 5.6 + (3 - i) * 0.45; return { p: a[0], q: qty('a', i, a[1]), pos: i - 0.6 * (1 - eo(seg(t, at, at + 0.5))), op: eo(seg(t, at, at + 0.4)), hl: Math.max(i === 0 ? Math.sin(Math.PI * seg(t, 8.4, 10.2)) : 0, flash('a', i)) }; });
    const bids = BK_B.map((b, i) => { const at = 10.8 + i * 0.45; return { p: b[0], q: qty('b', i, b[1]), pos: i + 0.6 * (1 - eo(seg(t, at, at + 0.5))), op: eo(seg(t, at, at + 0.4)), hl: Math.max(i === 0 ? Math.sin(Math.PI * seg(t, 13.2, 15.0)) : 0, flash('b', i)) }; });
    this.b.render(asks, bids, 'BTC/USDT');
    const c1 = seg(t, 5.6, 6.1), c2 = seg(t, 10.8, 11.3);
    this.c1.opacity = eo(c1); this.c1.transform = 'translateX(' + lerp(-20, 0, eo(c1)) + 'px)';
    this.c2.opacity = eo(c2); this.c2.transform = 'translateX(' + lerp(-20, 0, eo(c2)) + 'px)';
    this.tutor.render(t);
  },
});
