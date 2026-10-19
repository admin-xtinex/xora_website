const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('market', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const ln = (cls, a, b) => '<div class="' + cls + '" style="display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span class="mono" style="font-size:32px">' + a + '</span><span class="mono" style="font-size:32px;color:var(--main)">' + b + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick mk-k">Order type 1</p>' +
      '<h2 class="line mk-t">Market order</h2></div>' +
      '<div class="glass mk-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">A <b>market order</b> buys or sells <b>right now</b>, at the best prices waiting in the book.</p></div>' +
      '<div class="glass mk-an" style="left:140px;top:560px;width:820px;padding:26px 36px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Everyday version</p>' +
      '<p style="margin:0;font-size:32px;line-height:1.4;font-weight:600">Buying at a market stall at today\'s asked price: quick, but you don\'t choose the price.</p></div>' +
      '<div class="glass mk-w" style="left:140px;top:540px;width:820px;padding:22px 36px"><p class="fict" style="margin:0 0 4px">Worked example · fictional prices</p>' +
      ln('mk-l1', '0.004 × 60,010', '240.04') + ln('mk-l2', '0.006 × 60,020', '360.12') +
      '<div class="mk-l3" style="display:flex;justify-content:space-between;align-items:baseline;padding:12px 0 0"><span style="font-size:28px">Total 600.16 USDT ÷ 0.01 BTC</span><span class="mono" style="font-size:38px;color:var(--main)">60,016 avg</span></div></div>' +
      '<span class="chip mk-o" style="position:absolute;left:0;top:0;font-size:26px;padding:10px 22px;background:var(--main);color:var(--ground);border-color:var(--main);z-index:3">Market buy 0.01 BTC</span>' +
      '<span class="chip mk-f" style="position:absolute;left:1060px;top:720px;font-size:26px;padding:12px 24px;border-color:var(--main)">Filled 0.01 BTC · price not fixed</span>' +
      '</div>'));
    this.book = UI.book(kit, 'mkb', 1060, 200, 600, 3);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.def = q('.mk-def').style; this.an = q('.mk-an').style; this.w = q('.mk-w').style;
    this.l = ['.mk-l1', '.mk-l2', '.mk-l3'].map((s) => q(s).style); this.o = q('.mk-o').style; this.f = q('.mk-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.5, pose: 'explain' }, { t: 6.1, pose: 'idea' }, { t: 13.2, pose: 'point', flip: true }, { t: 18.7, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    UI.rise(this.an, t, 6.2, { out: 12.4 });
    UI.rise(this.book.st, t, 1.2);
    const r = (i) => eo(seg(t, 1.6 + i * 0.2, 2.0 + i * 0.2));
    const f1 = eio(seg(t, 14.2, 15.0)), f2 = eio(seg(t, 15.6, 16.6));
    const q1 = 0.004 * (1 - f1), q2 = 0.006 * (1 - f2);
    const hl1 = Math.sin(Math.PI * seg(t, 14.0, 15.4)), hl2 = Math.sin(Math.PI * seg(t, 15.4, 17.0));
    this.book.set({
      asks: [[60050, 0.010, r(0)], [60020, q2, r(1) * lerp(1, 0.3, f2), hl2], [60010, q1, r(2) * lerp(1, 0.3, f1), hl1]],
      bids: [[60000, 0.005, r(4)], [59990, 0.008, r(5)], [59950, 0.004, r(6)]],
      spread: t < 16.6 ? 'spread 10 USDT' : 'spread now 50 USDT', max: 0.012,
    });
    const row = this.book.rows[2], y = 200 + row.offsetTop + 8;
    const go = seg(t, 12.9, 14.1);
    this.o.left = lerp(980, 1240, eio(go)).toFixed(1) + 'px'; this.o.top = (y - Math.sin(Math.PI * go) * 40 - (t > 15.2 ? 54 * eio(seg(t, 15.2, 15.6)) : 0)).toFixed(1) + 'px';
    this.o.opacity = eo(seg(t, 12.7, 13.1)) * (1 - ei(seg(t, 16.6, 17.1)));
    UI.rise(this.w, t, 13.3);
    UI.rise(this.l[0], t, 14.8, { dy: 16 }); UI.rise(this.l[1], t, 16.4, { dy: 16 }); UI.rise(this.l[2], t, 18.8, { dy: 16 });
    UI.rise(this.f, t, 17.0);
    this.tutor.render(t);
  },
});
