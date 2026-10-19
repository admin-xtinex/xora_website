const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Before the news: asks 60,050 / 60,020 / 60,010. After: 60,140 / 60,120 / 60,100.
const SL_A0 = [60050, 60020, 60010], SL_A1 = [60140, 60120, 60100];
const SL_B0 = [60000, 59990, 59950], SL_B1 = [60060, 60050, 60020];
kit.scene('slippage', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick sl-k" style="color:var(--accent)">Watch out</p>' +
      '<h2 class="line sl-t">Slippage</h2></div>' +
      '<div class="glass sl-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0"><b>Slippage</b> is the difference between the price you <b>expected</b> and the price you <b>actually got</b>.</p></div>' +
      '<div class="glass sl-w" style="left:140px;top:560px;width:820px;padding:24px 36px"><p class="fict" style="margin:0 0 10px">Worked example · fictional prices</p>' +
      '<p class="mono sl-w1" style="margin:0;font-size:34px">Expected 60,010 → got <span style="color:var(--accent)">60,100</span></p>' +
      '<p class="mono sl-w2" style="margin:12px 0 0;font-size:34px">60,100 − 60,010 = <span style="color:var(--accent)">90</span> USDT per BTC</p>' +
      '<p class="mono sl-w3" style="margin:12px 0 0;font-size:34px">90 × 0.01 BTC = <span style="color:var(--accent)">0.90 USDT</span> extra</p></div>' +
      '<span class="chip sl-n" style="position:absolute;left:1220px;top:120px;font-size:28px;padding:12px 26px;background:var(--accent);border-color:var(--accent);color:var(--second)">News! Sellers move up</span>' +
      '<span class="chip sl-o" style="position:absolute;left:0;top:0;font-size:26px;padding:10px 22px;background:var(--main);color:var(--ground);border-color:var(--main);z-index:3">Market buy 0.01 BTC</span>' +
      '<span class="chip sl-e" style="position:absolute;left:1060px;top:720px;font-size:26px;padding:12px 24px;border-color:var(--main)">You expected: 60,010</span>' +
      '<span class="chip sl-f" style="position:absolute;left:1060px;top:720px;font-size:26px;padding:12px 24px;border-color:var(--accent)">Filled at 60,100</span>' +
      '</div>'));
    this.book = UI.book(kit, 'slb', 1060, 200, 600, 3);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sl-k').style; this.t = q('.sl-t'); this.def = q('.sl-def').style; this.w = q('.sl-w').style;
    this.w1 = q('.sl-w1').style; this.w2 = q('.sl-w2').style; this.w3 = q('.sl-w3').style;
    this.n = q('.sl-n').style; this.o = q('.sl-o').style; this.e = q('.sl-e').style; this.f = q('.sl-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.5, pose: 'explain' }, { t: 9.0, pose: 'confused' }, { t: 13.4, pose: 'magnify' }, { t: 19.6, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    UI.rise(this.book.st, t, 1.4);
    const r = (i) => eo(seg(t, 1.8 + i * 0.2, 2.2 + i * 0.2));
    const jump = eio(seg(t, 9.2, 11.0));
    const step = (a, b) => Math.round(lerp(a, b, jump) / 10) * 10;
    const fill = eio(seg(t, 14.4, 15.4));
    const hl = Math.max(t > 7.2 && t < 9.2 ? eo(seg(t, 7.2, 7.6)) : 0, Math.sin(Math.PI * seg(t, 14.2, 15.8)));
    this.book.set({
      asks: SL_A0.map((p, i) => [step(p, SL_A1[i]), i === 2 ? lerp(0.004, 0.020, jump) - 0.010 * fill : [0.010, 0.006, 0][i] + [0, 0.004, 0][i] * jump, r(i), i === 2 ? hl : 0]),
      bids: SL_B0.map((p, i) => [step(p, SL_B1[i]), [0.005, 0.008, 0.004][i], r(4 + i)]),
      spread: t < 1.9 ? '' : 'spread ' + UI.fmt(step(10, 40)) + ' USDT', max: 0.022,
    });
    const nw = seg(t, 9.0, 9.4);
    this.n.opacity = eo(nw) * (1 - ei(seg(t, 12.6, 13.0)));
    this.n.transform = 'scale(' + lerp(0.7, 1, eob(nw, 1.8)) + ') rotate(' + (Math.sin(t * 9) * 1.2 * (t < 12.6 ? 1 : 0)).toFixed(2) + 'deg)';
    UI.rise(this.e, t, 7.4, { out: 13.0 });
    const row = this.book.rows[2], y = 200 + row.offsetTop + 8;
    const go = seg(t, 13.2, 14.4);
    this.o.left = lerp(980, 1240, eio(go)).toFixed(1) + 'px'; this.o.top = (y - Math.sin(Math.PI * go) * 40).toFixed(1) + 'px';
    this.o.opacity = eo(seg(t, 13.0, 13.4)) * (1 - ei(seg(t, 15.6, 16.1)));
    UI.rise(this.f, t, 15.4);
    UI.rise(this.w, t, 13.6);
    UI.rise(this.w1, t, 13.8, { dy: 14 }); UI.rise(this.w2, t, 16.0, { dy: 14 }); UI.rise(this.w3, t, 19.7, { dy: 14 });
    this.tutor.render(t);
  },
});
