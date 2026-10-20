const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A fictional order ladder: waiting sell orders above the price, waiting buy orders below.
const TN_L = [[60550, 0.8, 1], [60500, 0.7, 1], [60450, 0.9, 1], [60400, 1.0, 1], [60300, 0.9, 0], [60250, 0.75, 0]];
const TN_EAT = { 60400: 12.4, 60450: 13.0, 60500: 13.6 };
const lY = (p) => 372 + (60550 - p) / 50 * 56;
const tnP = UI.pf([[0, 60345], [6, 60360], [11.8, 60350], [12.4, 60405], [13.0, 60455], [13.7, 60520], [14.5, 60450], [15.6, 60370], [23, 60355]], 4);
const tnX = (t) => 1080 + Math.min(t, 21) / 21 * 520, tnY = (p) => 740 - (p - 60200) / 400 * 380;
kit.scene('thin', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    TN_L.forEach((l) => {
      const col = l[2] ? 'var(--accent)' : 'var(--main)';
      rows += '<span class="mono" style="position:absolute;left:170px;top:' + (lY(l[0]) - 16) + 'px;font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + UI.fmt(l[0]) + '</span>' +
        '<i class="tn-bar" style="position:absolute;left:330px;top:' + (lY(l[0]) - 15) + 'px;height:30px;width:' + (l[1] * 520).toFixed(0) + 'px;border-radius:6px;transform-origin:0 50%;background:color-mix(in srgb, ' + col + ' 60%, transparent)"></i>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass tn-pan" style="left:140px;top:300px;width:780px;height:470px"></div>' + rows +
      '<p class="kick" style="position:absolute;left:330px;top:318px;margin:0;font-size:20px;color:var(--accent)">Waiting sell orders</p>' +
      '<p class="kick" style="position:absolute;left:330px;top:725px;margin:0;font-size:20px;color:var(--main)">Waiting buy orders</p>' +
      '<div class="tn-mk" style="position:absolute;left:160px;top:0;width:740px;height:0;border-top:3px dashed var(--second)"></div>' +
      '<p class="tag tn-mt" style="left:700px;top:0">Price 60,350</p>' +
      '<p class="chip tn-buy" style="position:absolute;left:330px;top:420px;margin:0;font-size:28px;padding:12px 24px;background:color-mix(in srgb, var(--ground) 60%, var(--up));border-color:var(--up)">One larger buy order</p>' +
      '<p class="tag tn-thin" style="left:660px;top:318px;color:var(--down);border-color:var(--down)">Thin: few orders</p>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="tn-grid">' + UI.grid(1060, 1620, tnY, 60200, 60600, 100) + '</g>' +
      '<rect x="1060" y="' + tnY(60400).toFixed(1) + '" width="560" height="' + (tnY(60300) - tnY(60400)).toFixed(1) + '" rx="8" class="tn-zone" style="fill:color-mix(in srgb, var(--accent) 20%, transparent);stroke:color-mix(in srgb, var(--accent) 75%, transparent);stroke-width:2"/>' +
      '<path class="tn-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="tn-dot" r="10" style="fill:var(--main)"/></svg>' +
      '<p class="tag tn-sp" style="left:1260px;top:' + (tnY(60520) - 62).toFixed(0) + 'px;color:var(--down);border-color:var(--down)">Spike, then back inside</p>' +
      '<p class="fict" style="position:absolute;left:1060px;top:300px;margin:0">Fictional order book and prices</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick tn-k" style="color:var(--accent)">One more warning</p>' +
      '<h2 class="line tn-t">Thin liquidity can fake a breakout</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tn-k').style; this.t = q('.tn-t'); this.bars = [...kit.stage.querySelectorAll('.tn-bar')].map((e) => e.style);
    this.mk = q('.tn-mk').style; this.mt = q('.tn-mt'); this.buy = q('.tn-buy').style; this.thin = q('.tn-thin').style; this.sp = q('.tn-sp').style;
    this.grid = q('.tn-grid').style; this.zone = q('.tn-zone').style; this.line = q('.tn-line'); this.dot = q('.tn-dot');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 6.8, pose: 'magnify' }, { t: 11.6, pose: 'confused' }, { t: 18.2, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const thin = eio(seg(t, 7.0, 8.2)), refill = eio(seg(t, 16.0, 17.2));
    this.bars.forEach((s, i) => {
      const l = TN_L[i], a = 0.8 + i * 0.25, eat = TN_EAT[l[0]];
      let k = lerp(1, 0.14, thin);
      if (eat) k *= 1 - eio(seg(t, eat, eat + 0.5)) * (1 - refill);
      s.opacity = eo(seg(t, a, a + 0.3));
      s.transform = 'scaleX(' + (k * eo(seg(t, a, a + 0.6))).toFixed(3) + ')';
    });
    this.thin.opacity = eo(seg(t, 7.6, 8.1)) * (1 - ei(seg(t, 11.2, 11.6)));
    const p = t < 11.8 ? 60350 : tnP(t);
    this.mk.top = lY(p).toFixed(1) + 'px'; this.mk.opacity = eo(seg(t, 2.0, 2.5));
    this.mt.style.top = (lY(p) - 20).toFixed(1) + 'px'; this.mt.style.opacity = this.mk.opacity;
    UI.txt(this.mt, 'Price ' + UI.fmt(Math.round(p / 5) * 5));
    const b = seg(t, 11.6, 12.3);
    this.buy.opacity = (eo(b) * (1 - ei(seg(t, 14.6, 15.2)))).toFixed(3);
    this.buy.transform = 'translateX(' + lerp(-140, 0, eo(b)).toFixed(1) + 'px) translateY(' + (lerp(0, -60, eio(seg(t, 12.3, 13.8)))).toFixed(1) + 'px)';
    this.grid.opacity = eo(seg(t, 0.6, 1.2)); this.zone.opacity = eo(seg(t, 1.0, 1.6));
    const e = Math.max(0.05, Math.min(t, 21));
    this.line.setAttribute('d', UI.line(tnP, 0, e, tnX, tnY, 0.1));
    this.dot.setAttribute('cx', tnX(e).toFixed(1)); this.dot.setAttribute('cy', tnY(tnP(e)).toFixed(1));
    UI.rise(this.sp, t, 18.4, { dy: 12 });
    this.tutor.render(t);
  },
});
