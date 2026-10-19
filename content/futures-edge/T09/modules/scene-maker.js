const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('maker', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick mt-k">Two fee rates</p>' +
      '<h2 class="line mt-t">Maker and taker</h2></div>' +
      '<div class="glass mt-d1" style="left:140px;top:340px;width:820px;padding:24px 34px"><p class="def" style="margin:0">A <b>taker</b> order fills at once against orders already in the book, like a market order.</p></div>' +
      '<div class="glass mt-d2" style="left:140px;top:500px;width:820px;padding:24px 34px"><p class="def" style="margin:0">A <b style="color:var(--accent)">maker</b> order waits in the book, like a limit order, and adds to it.</p></div>' +
      '<div class="glass mt-r" style="left:140px;top:666px;width:820px;padding:18px 34px"><p class="mono" style="margin:0;font-size:28px">600 USDT: maker <span style="color:var(--accent)">0.12</span> · taker <span style="color:var(--main)">0.30</span> USDT</p></div>' +
      '<span class="chip mt-o" style="position:absolute;left:0;top:0;font-size:26px;padding:10px 22px;background:var(--main);color:var(--ground);border-color:var(--main);z-index:3">Market buy 0.004</span>' +
      '<span class="chip mt-tf" style="position:absolute;left:1040px;top:712px;font-size:24px;padding:10px 20px;border-color:var(--main)">Taker fee · 0.05%</span>' +
      '<span class="chip mt-mf" style="position:absolute;left:1330px;top:712px;font-size:24px;padding:10px 20px;border-color:var(--accent)">Maker fee · 0.02%</span>' +
      '<p class="fict mt-f" style="position:absolute;left:1040px;top:180px;margin:0">Example rates · real rates vary by exchange and account</p>' +
      '</div>'));
    this.book = UI.book(kit, 'mtb', 1040, 220, 620, 3);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mt-k').style; this.t = q('.mt-t'); this.d1 = q('.mt-d1').style; this.d2 = q('.mt-d2').style; this.r = q('.mt-r').style;
    this.o = q('.mt-o').style; this.tf = q('.mt-tf').style; this.mf = q('.mt-mf').style; this.f = q('.mt-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.5, pose: 'explain' }, { t: 3.0, pose: 'point', flip: true }, { t: 8.0, pose: 'present' }, { t: 15.1, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.d1, t, 0.6); UI.rise(this.d2, t, 8.1); UI.rise(this.r, t, 15.2);
    UI.rise(this.book.st, t, 1.0);
    this.f.opacity = 0.9 * eo(seg(t, 1.2, 1.7));
    const rr = (i) => eo(seg(t, 1.4 + i * 0.2, 1.8 + i * 0.2));
    const take = eio(seg(t, 4.2, 5.0)), place = eo(seg(t, 9.0, 9.6));
    this.book.set({
      asks: [[60020, 0.006, rr(0)], [60010, 0.006, rr(1)], [60005, 0.004 * (1 - take), rr(2) * lerp(1, 0.35, take), Math.sin(Math.PI * seg(t, 4.0, 5.6))]],
      bids: [[59995, 0.005, rr(4)], [59990, 0.008, rr(5)], [59980, 0.010, place, place * 0.5 * (1 - seg(t, 13.0, 14.0)), 'MAKER']],
      spread: t < 1.5 ? '' : t < 5.0 ? 'spread 10 USDT' : 'spread 15 USDT', max: 0.012,
    });
    const row = this.book.rows[2], y = 220 + row.offsetTop + 8;
    const go = seg(t, 2.9, 4.1);
    this.o.left = lerp(960, 1260, eio(go)).toFixed(1) + 'px'; this.o.top = (y - Math.sin(Math.PI * go) * 40).toFixed(1) + 'px';
    this.o.opacity = eo(seg(t, 2.7, 3.1)) * (1 - ei(seg(t, 4.8, 5.3)));
    UI.rise(this.tf, t, 5.0); UI.rise(this.mf, t, 9.6);
    this.tutor.render(t);
  },
});
