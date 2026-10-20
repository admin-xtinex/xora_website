const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A false breakout: a new candle wicks to 60,090 above the zone, then closes at 59,960. A 0.01 BTC buy at 60,060 shows its live PnL.
const FO_K = [[7.8, 59970], [8.6, 60010], [9.4, 60060], [10.4, 60090], [11.6, 60040], [12.8, 59990], [14.0, 59960]];
const FO_C = [59970, 60090, 59950, 59960], FO_BUY = 60060, FO_Q = 0.01, FO_T = 9.4;
kit.scene('fakeout', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.h = UI.head(kit, 'False signals', 'It looked like a breakout');
    const Y = UI.Q.y, X = UI.Q.x;
    this.ch = UI.chart(kit, 'fo', 13, { over: '<line class="fo-buy" x1="' + (X(12) - 60) + '" x2="' + (X(12) + 40) + '" y1="' + Y(FO_BUY) + '" y2="' + Y(FO_BUY) + '" stroke-width="3" stroke-dasharray="8 6" style="stroke:var(--main)"/>' +
      '<circle class="fo-dot" cx="' + X(12) + '" cy="' + Y(FO_BUY) + '" r="9" style="fill:var(--main)"/>' });
    kit.stage.append(kit.h('<p class="tag fo-wk" style="left:' + (X(12) + 34) + 'px;top:' + (Y(60090) - 40) + 'px">Wick 60,090</p>'));
    kit.stage.append(kit.h('<p class="tag fo-cl" style="left:' + (X(12) + 34) + 'px;top:' + (Y(59960) + 10) + 'px;color:var(--down);border-color:var(--down)">Close 59,960</p>'));
    const row = (a, v, cls) => '<div class="row fo-r" style="padding:10px 0"><span>' + a + '</span><span class="mono ' + (cls || '') + '" style="font-size:32px">' + v + '</span></div>';
    kit.stage.append(kit.h('<div class="glass fo-d" style="left:1180px;top:300px;width:600px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:30px"><b>False signal</b>: looks real, but does not follow through.</p></div>'));
    kit.stage.append(kit.h('<div class="glass fo-p" style="left:1180px;top:476px;width:600px;padding:14px 30px"><p class="kick" style="margin:0 0 2px">Example · fictional</p>' +
      row('Bought 0.01 BTC at', '60,060') + row('Price now', '<span class="fo-px">60,060</span>') +
      '<div class="row" style="padding:10px 0;border:0"><span>PnL, before fees</span><span class="mono fo-pnl" style="font-size:40px">0.00</span></div></div>'));
    kit.stage.append(kit.h('<p class="mono fo-m" style="position:absolute;left:1180px;top:742px;width:600px;margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">(59,960 − 60,060) × 0.01 = −1.00 USDT</p>'));
    const q = (s) => kit.stage.querySelector(s);
    this.d = q('.fo-d').style; this.p = q('.fo-p').style; this.px = q('.fo-px'); this.pnl = q('.fo-pnl'); this.m = q('.fo-m').style;
    this.wk = q('.fo-wk').style; this.cl = q('.fo-cl').style; this.buy = q('.fo-buy').style; this.dot = q('.fo-dot').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 7.6, pose: 'magnify' }, { t: 10.6, pose: 'cheer' }, { t: 13.0, pose: 'confused' }, { t: 21.8, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    this.ch.base(t, 0.2, 1.4, 7.6);
    this.ch.past(t, 0.5, 0.18);
    const k = t >= 14.0 ? { o: FO_C[0], h: FO_C[1], l: FO_C[2], c: FO_C[3] } : UI.forming(FO_K, FO_C[2], FO_C[1], t);
    this.ch.cd.set(12, { x: this.ch.X(12), w: 28, o: k.o, h: k.h, l: k.l, c: k.c, y: this.ch.Y, live: !!k.live, op: eo(seg(t, 7.6, 7.9)) });
    UI.rise(kit, this.d, t, 0.6, 0.7);
    this.buy.opacity = eo(seg(t, FO_T, FO_T + 0.3)); this.dot.opacity = this.buy.opacity;
    UI.rise(kit, this.p, t, FO_T, 0.6);
    const price = t < FO_T ? FO_BUY : k.c, v = (price - FO_BUY) * FO_Q;
    UI.set(this.px, UI.fmt(Math.round(price)));
    UI.set(this.pnl, UI.sgn(Math.round(v * 100) / 100, 2) + ' USDT');
    this.pnl.style.color = v > 0.004 ? 'var(--up)' : v < -0.004 ? 'var(--down)' : 'var(--second)';
    UI.fade(this.wk, t, 10.6); UI.fade(this.cl, t, 14.0);
    UI.rise(kit, this.m, t, 15.6, 0.6, 12);
    this.tutor.render(t);
  },
});
