const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('book', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick bk-k">Quick refresher from T04</p>' +
      '<h2 class="line bk-t">The order book</h2>' +
      '<p class="sub bk-s">A live list of who wants to buy and who wants to sell, and at what price.</p></div>' +
      '<div class="glass bk-sp" style="left:140px;top:470px;width:820px;padding:26px 36px"><p class="kick" style="margin:0 0 10px">Spread</p>' +
      '<p class="mono" style="margin:0;font-size:36px">60,010 − 60,000 = <span style="color:var(--main)">10 USDT</span></p>' +
      '<p style="margin:8px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">best ask − best bid</p></div>' +
      '<div class="glass bk-def" style="left:140px;top:470px;width:820px;padding:26px 36px"><p class="def" style="margin:0">A <b>fill</b> is when your order is matched with an order on the other side, and the trade happens.</p></div>' +
      '<p class="bk-la" style="position:absolute;left:1690px;top:330px;margin:0;font-size:26px;font-weight:700;color:var(--accent)">Asks<br><span style="font-weight:500;color:color-mix(in srgb, var(--second) 65%, var(--ground))">sellers</span></p>' +
      '<p class="bk-lb" style="position:absolute;left:1690px;top:540px;margin:0;font-size:26px;font-weight:700;color:var(--main)">Bids<br><span style="font-weight:500;color:color-mix(in srgb, var(--second) 65%, var(--ground))">buyers</span></p>' +
      '<span class="chip bk-o" style="position:absolute;left:0;top:0;font-size:26px;padding:10px 22px;background:var(--main);color:var(--ground);border-color:var(--main);z-index:3">Buy 0.002 BTC</span>' +
      '<span class="chip bk-f" style="position:absolute;left:1060px;top:720px;font-size:26px;padding:12px 24px;border-color:var(--main)">Filled: 0.002 BTC at 60,010</span>' +
      '</div>'));
    this.book = UI.book(kit, 'bkb', 1060, 200, 600, 3);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.bk-k').style; this.t = q('.bk-t'); this.s = q('.bk-s'); this.sp = q('.bk-sp').style; this.def = q('.bk-def').style;
    this.la = q('.bk-la').style; this.lb = q('.bk-lb').style; this.o = q('.bk-o').style; this.f = q('.bk-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'point', flip: true }, { t: 6.6, pose: 'magnify' }, { t: 11.5, pose: 'explain' }, { t: 15.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 1.0, { stagger: 0.05 });
    UI.rise(this.book.st, t, 0.6);
    this.la.opacity = eo(seg(t, 2.0, 2.5)); this.lb.opacity = eo(seg(t, 3.4, 3.9));
    const rows = (i) => eo(seg(t, 1.0 + i * 0.25, 1.4 + i * 0.25));
    const hs = eo(seg(t, 6.8, 7.3)) * (1 - eo(seg(t, 10.6, 11.2)));
    // A small buy meets the best ask: 0.004 -> 0.002.
    const fill = eio(seg(t, 13.6, 14.6));
    const best = 0.004 - 0.002 * fill;
    this.book.set({
      asks: [[60050, 0.010, rows(0)], [60020, 0.006, rows(1)], [60010, best, rows(2), Math.max(hs, Math.sin(Math.PI * seg(t, 13.4, 15.2)))]],
      bids: [[60000, 0.005, rows(4), hs], [59990, 0.008, rows(5)], [59950, 0.004, rows(6)]],
      spread: t > 1.6 ? 'spread 10 USDT' : '', max: 0.012,
    });
    UI.rise(this.sp, t, 6.8, { out: 11.0 });
    UI.rise(this.def, t, 11.6);
    // The order chip flies in from the left to the best-ask row.
    const r = this.book.rows[2], y = 200 + r.offsetTop + 8;
    const go = seg(t, 12.2, 13.5);
    this.o.left = lerp(980, 1260, eio(go)).toFixed(1) + 'px'; this.o.top = (y - Math.sin(Math.PI * go) * 40).toFixed(1) + 'px';
    this.o.opacity = eo(seg(t, 11.9, 12.3)) * (1 - ei(seg(t, 14.4, 14.9)));
    UI.rise(this.f, t, 14.6);
    this.tutor.render(t);
  },
});
