const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('spread', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick sp-k">Cost 2</p>' +
      '<h2 class="line sp-t">Spread</h2></div>' +
      '<div class="glass sp-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">The <b>spread</b> is the gap between the best ask (lowest sell price) and the best bid (highest buy price).</p></div>' +
      '<div class="glass sp-an" style="left:140px;top:590px;width:820px;padding:26px 36px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Everyday version</p>' +
      '<p style="margin:0;font-size:32px;line-height:1.4;font-weight:600">A money changer: one price to buy from them, a lower price to sell back.</p></div>' +
      '<div class="glass sp-w" style="left:140px;top:590px;width:820px;padding:24px 36px"><p class="fict" style="margin:0 0 10px">Worked example · fictional prices</p>' +
      '<p class="mono" style="margin:0;font-size:32px">Buy at ask 60,005 → sell at bid 59,995</p>' +
      '<p class="mono sp-w2" style="margin:12px 0 0;font-size:32px">−10 × 0.01 BTC = <span style="color:var(--accent)">−0.10 USDT</span></p></div>' +
      '<span class="chip sp-b" style="position:absolute;left:0;top:0;font-size:26px;padding:10px 22px;background:var(--main);color:var(--ground);border-color:var(--main);z-index:3">Buy 0.01</span>' +
      '<span class="chip sp-s" style="position:absolute;left:0;top:0;font-size:26px;padding:10px 22px;background:var(--accent);color:var(--second);border-color:var(--accent);z-index:3">Sell 0.01</span>' +
      '<span class="chip sp-res" style="position:absolute;left:1040px;top:712px;font-size:26px;padding:12px 24px;border-color:var(--accent)">Bought 60,005 · sold 59,995 · −0.10 USDT</span>' +
      '</div>'));
    this.book = UI.book(kit, 'spb', 1040, 200, 620, 3);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sp-k').style; this.t = q('.sp-t'); this.def = q('.sp-def').style; this.an = q('.sp-an').style; this.w = q('.sp-w').style; this.w2 = q('.sp-w2').style;
    this.b = q('.sp-b').style; this.s = q('.sp-s').style; this.res = q('.sp-res').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'checklist' }, { t: 0.5, pose: 'point', flip: true }, { t: 5.3, pose: 'idea' }, { t: 11.8, pose: 'magnify' }, { t: 15.6, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    UI.rise(this.an, t, 5.4, { out: 11.4 });
    UI.rise(this.w, t, 11.9); UI.rise(this.w2, t, 14.6, { dy: 14 });
    UI.rise(this.book.st, t, 1.0);
    const rr = (i) => eo(seg(t, 1.4 + i * 0.2, 1.8 + i * 0.2));
    const hl = eo(seg(t, 2.2, 2.7)) * (1 - eo(seg(t, 10.8, 11.4)));
    const fb = eio(seg(t, 13.0, 13.6)), fs = eio(seg(t, 14.4, 15.0));
    this.book.set({
      asks: [[60020, 0.008, rr(0)], [60010, 0.010, rr(1)], [60005, 0.012 - 0.01 * fb, rr(2), Math.max(hl, Math.sin(Math.PI * seg(t, 12.8, 14.0)))]],
      bids: [[59995, 0.015 - 0.01 * fs, rr(4), Math.max(hl, Math.sin(Math.PI * seg(t, 14.2, 15.4)))], [59990, 0.008, rr(5)], [59980, 0.006, rr(6)]],
      spread: t < 1.5 ? '' : 'spread 60,005 − 59,995 = 10 USDT', max: 0.016,
    });
    const ra = this.book.rows[2], rb = this.book.rows[3];
    const gb = seg(t, 12.0, 13.0), gs = seg(t, 13.4, 14.4);
    this.b.left = lerp(960, 1260, eio(gb)).toFixed(1) + 'px'; this.b.top = (200 + ra.offsetTop + 8 - Math.sin(Math.PI * gb) * 40).toFixed(1) + 'px';
    this.b.opacity = eo(seg(t, 11.8, 12.2)) * (1 - ei(seg(t, 13.4, 13.8)));
    this.s.left = lerp(960, 1260, eio(gs)).toFixed(1) + 'px'; this.s.top = (200 + rb.offsetTop + 8 + Math.sin(Math.PI * gs) * 40).toFixed(1) + 'px';
    this.s.opacity = eo(seg(t, 13.2, 13.6)) * (1 - ei(seg(t, 14.8, 15.2)));
    UI.rise(this.res, t, 15.0);
    this.tutor.render(t);
  },
});
