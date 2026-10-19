const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('limit', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick lm-k">Order type 2</p>' +
      '<h2 class="line lm-t">Limit order</h2></div>' +
      '<div class="glass lm-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">A <b>limit order</b> buys or sells only at <b>your price or better</b>. Until then, it waits in the book.</p></div>' +
      '<div class="glass lm-an" style="left:140px;top:560px;width:820px;padding:26px 36px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Everyday version</p>' +
      '<p style="margin:0;font-size:32px;line-height:1.4;font-weight:600">Telling a shopkeeper: "Call me if the price drops to my number."</p></div>' +
      '<div class="glass lm-w" style="left:140px;top:560px;width:820px;padding:24px 36px"><p class="fict" style="margin:0 0 10px">Worked example · fictional prices</p>' +
      '<p class="mono" style="margin:0;font-size:34px">Limit buy 0.01 BTC at 59,950</p>' +
      '<p class="mono lm-w2" style="margin:12px 0 0;font-size:34px">0.01 × 59,950 = <span style="color:var(--main)">599.50 USDT</span></p>' +
      '<p class="lm-w3" style="margin:10px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">You never pay more than your limit price.</p></div>' +
      '<span class="chip lm-f" style="position:absolute;left:1060px;top:720px;font-size:26px;padding:12px 24px;border-color:var(--main)">Filled: 0.01 BTC at 59,950</span>' +
      '<span class="chip lm-wt" style="position:absolute;left:1060px;top:720px;font-size:26px;padding:12px 24px;border-color:color-mix(in srgb, var(--accent) 60%, transparent)">Status: waiting</span>' +
      '</div>'));
    this.book = UI.book(kit, 'lmb', 1060, 200, 600, 3);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.lm-k').style; this.t = q('.lm-t'); this.def = q('.lm-def').style; this.an = q('.lm-an').style; this.w = q('.lm-w').style;
    this.w2 = q('.lm-w2').style; this.w3 = q('.lm-w3').style; this.f = q('.lm-f').style; this.wt = q('.lm-wt').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.5, pose: 'explain' }, { t: 5.7, pose: 'idea' }, { t: 11.1, pose: 'point', flip: true }, { t: 16.4, pose: 'magnify' }, { t: 19.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    UI.rise(this.an, t, 5.8, { out: 11.0 });
    UI.rise(this.book.st, t, 1.2);
    const r = (i) => eo(seg(t, 1.6 + i * 0.2, 2.0 + i * 0.2));
    // Our order joins the book as a new bid row at 59,950.
    const place = eo(seg(t, 11.4, 12.0));
    // Sellers come down: they fill the 60,000 and 59,990 bids, then ours.
    const d1 = eio(seg(t, 16.6, 17.4)), d2 = eio(seg(t, 17.6, 18.4)), d3 = eio(seg(t, 18.6, 19.6));
    const drop = eio(seg(t, 16.4, 19.6));
    const ask = (p) => Math.round((p - 50 * drop) / 10) * 10;
    const mine = 0.010 * (1 - d3);
    const bestBid = d2 < 1 ? (d1 < 1 ? 60000 : 59990) : 59950;
    this.book.set({
      asks: [[ask(60050), 0.010, r(0)], [ask(60020), 0.006, r(1)], [ask(60010), 0.004, r(2)]],
      bids: [[60000, 0.005 * (1 - d1), r(4) * lerp(1, 0.3, d1), Math.sin(Math.PI * seg(t, 16.4, 17.6))], [59990, 0.008 * (1 - d2), r(5) * lerp(1, 0.3, d2), Math.sin(Math.PI * seg(t, 17.4, 18.6))],
        [59950, mine, place * lerp(1, 0.6, d3), Math.max(0.5 * place * (1 - d3), Math.sin(Math.PI * seg(t, 18.4, 20.0))), d3 < 1 ? 'YOU' : 'FILLED']],
      spread: t < 1.7 ? '' : 'spread ' + UI.fmt(ask(60010) - bestBid) + ' USDT', max: 0.012,
    });
    UI.rise(this.wt, t, 12.0, { out: 19.4 });
    UI.rise(this.f, t, 19.7);
    UI.rise(this.w, t, 11.6);
    UI.rise(this.w2, t, 19.8, { dy: 14 }); UI.rise(this.w3, t, 20.4, { dy: 14 });
    this.tutor.render(t);
  },
});
