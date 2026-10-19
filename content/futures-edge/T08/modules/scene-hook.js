const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const HK_K = [[0, 60000], [1.0, 60050], [4.0, 59700], [7.0, 59550], [10.0, 59250], [13.0, 59050], [17, 58950]];
const hkP = (s) => UI.path(HK_K, s) + Math.sin(s * 5.3) * 30 + Math.sin(s * 11.1) * 12;
const hkX = (s) => 1000 + Math.min(s, 16) / 16 * 580;
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.P = UI.plan('hk-c', { x0: 1000, x1: 1580, y0: 260, y1: 720, lo: 58800, hi: 60200, step: 200, levels: [['e', 60000, 'Entry 60,000', 'var(--second)', 'right', 'below']] });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.P.svg + '<path class="hk-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="hk-dot" r="10" style="fill:var(--accent)"/>' +
      '<text x="1000" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional</text></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick hk-k">Picture this</p>' +
      '<h2 class="line hk-t">When do you get out?</h2></div>' +
      '<div class="glass hk-q" style="left:140px;top:620px;width:340px;padding:18px 26px;border-color:var(--accent)"><p style="margin:0;font-size:30px;font-weight:700;color:var(--accent)">Sell now? Wait?</p></div>' +
      '<div class="glass hk-plan" style="left:140px;top:620px;width:800px;padding:24px 34px;border-color:var(--main)"><p style="margin:0;font-size:34px;font-weight:700">Plan both exits <span style="color:var(--main)">before</span> you enter.</p></div>' +
      '</div>'));
    this.m = UI.meter(kit, 'hk-m', 140, 420, 600, 'Long 0.01 BTC · PnL before fees');
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.line = q('.hk-line'); this.dot = q('.hk-dot'); this.qq = q('.hk-q').style; this.plan = q('.hk-plan').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'candles' }, { t: 6.6, pose: 'confused' }, { t: 13.4, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.P.show(kit, { _: 1, e: seg(t, 0.4, 1.2) });
    const end = Math.min(t, 16);
    this.line.setAttribute('d', UI.line(hkP, 0, end, hkX, this.P.Y));
    this.dot.setAttribute('cx', hkX(end).toFixed(1)); this.dot.setAttribute('cy', this.P.Y(hkP(end)).toFixed(1));
    UI.rise(this.m.st, t, 0.8);
    this.m.set(Math.round(hkP(Math.floor(t * 4) / 4)) * 0.01 - 600, 12);
    const qp = seg(t, 6.8, 7.2);
    this.qq.opacity = eo(qp) * (1 - ei(seg(t, 13.2, 13.6)));
    this.qq.transform = 'rotate(' + (Math.sin(t * 7) * 2).toFixed(2) + 'deg) scale(' + lerp(0.7, 1, eob(qp, 1.8)) + ')';
    UI.rise(this.plan, t, 13.5);
    this.tutor.render(t);
  },
});
