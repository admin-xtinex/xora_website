const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// From 13.5 the price falls from 60,000 to the stop-loss at 59,400 (17.4), then the position is closed.
const SL_K = [[0, 60000], [13.6, 60000], [14.2, 60060], [17.4, 59400]];
const slP = (s) => UI.path(SL_K, s) + (s < 17.2 ? Math.sin(s * 6.1) * 22 * seg(s, 13.6, 14.2) : 0);
const slX = (s) => 1000 + (Math.min(s, 20.5) - 13.5) / 7 * 580;
kit.scene('sl', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.P = UI.plan('sl-c', { x0: 1000, x1: 1580, y0: 260, y1: 720, lo: 59000, hi: 60500, step: 250,
      zones: [['zr', 59400, 60000, 'var(--accent)']],
      levels: [['e', 60000, 'Entry 60,000', 'var(--second)'], ['s', 59400, 'Stop-loss 59,400', 'var(--accent)', 'right', 'below']] });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.P.svg + '<path class="sl-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="sl-dot" r="10" style="fill:var(--second)"/>' +
      '<g class="sl-x"><circle cx="' + slX(17.4).toFixed(1) + '" cy="' + this.P.Y(59400).toFixed(1) + '" r="14" style="fill:var(--accent)"/><text x="' + (slX(17.4) + 22).toFixed(1) + '" y="' + (this.P.Y(59400) - 18).toFixed(1) + '" style="fill:var(--accent);font-size:24px;font-weight:700">Closed</text></g>' +
      '<text x="1000" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional</text></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick sl-k" style="color:var(--accent)">Exit 1</p>' +
      '<h2 class="line sl-t">Stop-loss</h2></div>' +
      '<div class="glass sl-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">A <b>stop-loss</b> is an order that closes your position if price moves <b>against you</b> to a level you chose, to limit the loss.</p></div>' +
      '<div class="glass sl-an" style="left:140px;top:600px;width:820px;padding:26px 36px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Everyday version</p>' +
      '<p style="margin:0;font-size:32px;line-height:1.4;font-weight:600">A seat belt: it reduces the harm. It cannot stop the crash.</p></div>' +
      '<p class="mono sl-f" style="position:absolute;left:140px;top:752px;margin:0;font-size:30px">(59,400 − 60,000) × 0.01 = <span style="color:var(--accent)">−6.00 USDT</span></p>' +
      '</div>'));
    this.m = UI.meter(kit, 'sl-m', 140, 566, 560, 'Long 0.01 BTC · PnL before fees');
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sl-k').style; this.t = q('.sl-t'); this.def = q('.sl-def').style; this.an = q('.sl-an').style; this.f = q('.sl-f').style;
    this.line = q('.sl-line'); this.dot = q('.sl-dot'); this.x = q('.sl-x').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.5, pose: 'explain' }, { t: 7.9, pose: 'idea' }, { t: 13.5, pose: 'candles' }, { t: 17.6, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    UI.rise(this.an, t, 8.0, { out: 13.0 });
    this.P.show(kit, { _: eo(seg(t, 0.8, 1.4)), e: seg(t, 1.2, 2.0), s: seg(t, 2.2, 3.0), zr: seg(t, 3.0, 3.6) * 0.7 });
    const end = Math.max(13.5, Math.min(t, 17.4));
    this.line.setAttribute('d', t < 13.5 ? 'M0 0' : UI.line(slP, 13.5, end, slX, this.P.Y));
    this.line.style.opacity = t < 13.5 ? 0 : 1;
    this.dot.style.opacity = t < 13.5 ? 0 : 1;
    this.dot.setAttribute('cx', slX(end).toFixed(1)); this.dot.setAttribute('cy', this.P.Y(slP(end)).toFixed(1));
    this.x.opacity = eo(seg(t, 17.4, 17.8));
    UI.rise(this.m.st, t, 13.5);
    this.m.set((Math.round(slP(Math.floor(end * 6) / 6)) - 60000) * 0.01, 12);
    UI.rise(this.f, t, 17.6, { dy: 14 });
    this.tutor.render(t);
  },
});
