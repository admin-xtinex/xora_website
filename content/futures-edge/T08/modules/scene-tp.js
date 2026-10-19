const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// From 13.1 the price rises from 60,000 to the take-profit at 61,200 (17.0), then the position is closed.
const TP_K = [[0, 60000], [13.2, 60000], [13.8, 59950], [17.0, 61200]];
const tpP = (s) => UI.path(TP_K, s) + (s < 16.8 ? Math.sin(s * 6.1) * 30 * seg(s, 13.2, 13.8) : 0);
const tpX = (s) => 1000 + (Math.min(s, 19.6) - 13.1) / 6.5 * 580;
kit.scene('tp', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.P = UI.plan('tp-c', { x0: 1000, x1: 1580, y0: 260, y1: 720, lo: 59750, hi: 61500, step: 250,
      zones: [['zw', 60000, 61200, 'var(--main)']],
      levels: [['e', 60000, 'Entry 60,000', 'var(--second)', 'right', 'below'], ['s', 61200, 'Take-profit 61,200', 'var(--main)', 'left']] });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.P.svg + '<path class="tp-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="tp-dot" r="10" style="fill:var(--second)"/>' +
      '<g class="tp-x"><circle cx="' + tpX(17.0).toFixed(1) + '" cy="' + this.P.Y(61200).toFixed(1) + '" r="14" style="fill:var(--main)"/><text x="' + (tpX(17.0) + 22).toFixed(1) + '" y="' + (this.P.Y(61200) + 40).toFixed(1) + '" style="fill:var(--main);font-size:24px;font-weight:700">Closed</text></g>' +
      '<text x="1000" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional</text></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick tp-k" style="color:var(--main)">Exit 2</p>' +
      '<h2 class="line tp-t">Take-profit</h2></div>' +
      '<div class="glass tp-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">A <b>take-profit</b> is an order that closes your position when price reaches <b>your target</b>, to lock in a gain.</p></div>' +
      '<div class="glass tp-an" style="left:140px;top:600px;width:820px;padding:26px 36px"><p class="kick" style="margin:0 0 10px;color:var(--main)">Everyday version</p>' +
      '<p style="margin:0;font-size:32px;line-height:1.4;font-weight:600">Getting off the bus at the stop you planned, not riding on and hoping.</p></div>' +
      '<p class="mono tp-f" style="position:absolute;left:140px;top:752px;margin:0;font-size:30px">(61,200 − 60,000) × 0.01 = <span style="color:var(--main)">+12.00 USDT</span></p>' +
      '</div>'));
    this.m = UI.meter(kit, 'tp-m', 140, 566, 560, 'Long 0.01 BTC · PnL before fees');
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tp-k').style; this.t = q('.tp-t'); this.def = q('.tp-def').style; this.an = q('.tp-an').style; this.f = q('.tp-f').style;
    this.line = q('.tp-line'); this.dot = q('.tp-dot'); this.x = q('.tp-x').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.5, pose: 'explain' }, { t: 7.1, pose: 'idea' }, { t: 13.1, pose: 'candles' }, { t: 17.2, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    UI.rise(this.an, t, 7.2, { out: 12.6 });
    this.P.show(kit, { _: eo(seg(t, 0.8, 1.4)), e: seg(t, 1.2, 2.0), s: seg(t, 2.2, 3.0), zw: seg(t, 3.0, 3.6) * 0.7 });
    const end = Math.max(13.1, Math.min(t, 17.0));
    this.line.setAttribute('d', t < 13.1 ? 'M0 0' : UI.line(tpP, 13.1, end, tpX, this.P.Y));
    this.line.style.opacity = t < 13.1 ? 0 : 1;
    this.dot.style.opacity = t < 13.1 ? 0 : 1;
    this.dot.setAttribute('cx', tpX(end).toFixed(1)); this.dot.setAttribute('cy', this.P.Y(tpP(end)).toFixed(1));
    this.x.opacity = eo(seg(t, 17.0, 17.4));
    UI.rise(this.m.st, t, 13.1);
    this.m.set((Math.round(tpP(Math.floor(end * 6) / 6)) - 60000) * 0.01, 12);
    UI.rise(this.f, t, 17.2, { dy: 14 });
    this.tutor.render(t);
  },
});
