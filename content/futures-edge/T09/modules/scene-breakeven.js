const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Chart price rises from 60,000: fees covered at 60,060 (~10.2), break-even at 60,090 (~14.6), then 60,130.
const BE_K = [[0, 60000], [6.2, 60005], [10.2, 60060], [14.6, 60090], [18.6, 60130], [20, 60132]];
const beP = (s) => UI.path(BE_K, s) + Math.sin(s * 4.7) * 3;
const beX = (s) => 1000 + Math.min(s, 18.6) / 18.6 * 560, beY = (p) => 720 - (p - 59960) / 200 * 460;
kit.scene('breakeven', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const lvl = (cls, p, label, col, dash) => '<g class="' + cls + '"><line x1="1000" x2="1560" y1="' + beY(p).toFixed(1) + '" y2="' + beY(p).toFixed(1) + '" stroke-width="3"' + (dash ? ' stroke-dasharray="12 9"' : '') + ' style="stroke:' + col + '"/>' +
      '<text x="1012" y="' + (beY(p) + (cls === 'be-e' ? 34 : -12)).toFixed(1) + '" style="fill:' + col + ';font-size:24px;font-weight:700">' + label + '</text></g>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + UI.grid(1000, 1560, beY, 59960, 60160, 40) +
      '<rect class="be-zone" x="1000" y="' + beY(60090).toFixed(1) + '" width="560" height="' + (beY(60000) - beY(60090)).toFixed(1) + '" style="fill:color-mix(in srgb, var(--accent) 12%, transparent)"/>' +
      lvl('be-e', 60000, 'Start · chart price 60,000', 'var(--second)') + lvl('be-f', 60060, 'Fees alone · +60', 'color-mix(in srgb, var(--accent) 80%, var(--second))', true) + lvl('be-b', 60090, 'All costs · +90 · break-even 60,090', 'var(--main)', true) +
      '<path class="be-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="be-dot" r="10" style="fill:var(--second)"/>' +
      '<text x="1000" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC chart price in USDT · fictional</text></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick be-k">How far must it move?</p>' +
      '<h2 class="line be-t">The break-even move</h2></div>' +
      '<div class="glass be-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">The <b>break-even move</b> is how far price must move in your favour just to cover all your costs.</p></div>' +
      '<div class="glass be-w" style="left:140px;top:340px;width:820px;padding:24px 36px"><p class="mono" style="margin:0;font-size:30px">10 spread + 20 slippage + 60 fees</p>' +
      '<p class="mono" style="margin:12px 0 0;font-size:30px">= <span style="color:var(--main)">90 USDT per BTC</span> · 90 ÷ 60,000 = 0.15%</p></div>' +
      '</div>'));
    this.m = UI.meter(kit, 'be-m', 140, 560, 620, 'Net result · after all costs');
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.be-k').style; this.t = q('.be-t'); this.def = q('.be-def').style; this.w = q('.be-w').style;
    this.zone = q('.be-zone').style; this.e = q('.be-e').style; this.f = q('.be-f').style; this.b = q('.be-b').style;
    this.line = q('.be-line'); this.dot = q('.be-dot');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'confused' }, { t: 0.5, pose: 'explain' }, { t: 6.2, pose: 'candles' }, { t: 11.6, pose: 'point', flip: true }, { t: 15.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6, { out: 11.2 });
    UI.rise(this.w, t, 11.7);
    this.e.opacity = eo(seg(t, 0.8, 1.3));
    this.f.opacity = eo(seg(t, 6.4, 6.9));
    this.b.opacity = this.zone.opacity = eo(seg(t, 11.8, 12.3));
    const end = Math.min(t, 18.6);
    this.line.setAttribute('d', UI.line(beP, 0, end, beX, beY));
    this.dot.setAttribute('cx', beX(end).toFixed(1)); this.dot.setAttribute('cy', beY(beP(end)).toFixed(1));
    UI.rise(this.m.st, t, 1.2);
    const p = Math.round(beP(Math.floor(end * 6) / 6));
    this.m.set((p - 60090) * 0.01, 0.9);
    this.tutor.render(t);
  },
});
