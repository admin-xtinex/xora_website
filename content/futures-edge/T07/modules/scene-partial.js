const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('partial', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick pf-k">Fill behaviour</p>' +
      '<h2 class="line pf-t">Partial fill</h2></div>' +
      '<div class="glass pf-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">A <b>partial fill</b> is when only part of your order is matched. The rest keeps waiting, or you can cancel it.</p></div>' +
      '<div class="glass pf-w" style="left:140px;top:600px;width:820px;padding:24px 36px"><p class="fict" style="margin:0 0 10px">Worked example · fictional prices</p>' +
      '<p class="mono" style="margin:0;font-size:32px">0.004 × 59,950 = <span style="color:var(--main)">239.80 USDT</span> paid</p>' +
      '<p class="mono pf-w2" style="margin:12px 0 0;font-size:32px">0.010 − 0.004 = <span style="color:var(--accent)">0.006 BTC</span> waiting</p></div>' +
      '<div class="glass pf-card" style="left:1060px;top:230px;width:620px;padding:30px 34px"><p class="fict" style="margin:0 0 12px">Your order · educational mock</p>' +
      '<p style="margin:0;font-size:30px;font-weight:700">Limit buy 0.01 BTC at 59,950</p>' +
      '<div style="position:relative;height:56px;margin:26px 0 14px;border-radius:14px;border:2px dashed color-mix(in srgb, var(--accent) 60%, transparent);overflow:hidden"><div class="pf-bar" style="position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg, var(--main), color-mix(in srgb, var(--main) 70%, var(--accent)))"></div></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:28px"><span>Filled <b class="mono pf-n" style="color:var(--main)"></b></span><span>Waiting <b class="mono pf-r" style="color:var(--accent)"></b></span></div>' +
      '<p class="pf-pc mono" style="margin:14px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 60%, var(--ground))"></p></div>' +
      '<span class="chip pf-s" style="position:absolute;left:1120px;top:600px;font-size:26px;padding:12px 24px;border-color:var(--accent)">Seller: 0.004 BTC at 59,950</span>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.pf-k').style; this.t = q('.pf-t'); this.def = q('.pf-def').style; this.w = q('.pf-w').style; this.w2 = q('.pf-w2').style;
    this.card = q('.pf-card').style; this.bar = q('.pf-bar').style; this.n = q('.pf-n'); this.r = q('.pf-r'); this.pc = q('.pf-pc'); this.s = q('.pf-s').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 5.4, pose: 'point', flip: true }, { t: 10.6, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    UI.rise(this.card, t, 1.4);
    // The seller's chip slides up into the bar, then the bar fills to 40%.
    const go = seg(t, 6.0, 7.2);
    this.s.opacity = eo(seg(t, 5.6, 6.0)) * (1 - ei(seg(t, 7.0, 7.4)));
    this.s.transform = 'translateY(' + lerp(0, -200, eio(go)).toFixed(1) + 'px) scale(' + lerp(1, 0.85, eio(go)).toFixed(3) + ')';
    const f = 0.004 * eio(seg(t, 7.1, 8.4));
    this.bar.width = (f / 0.01 * 100).toFixed(2) + '%';
    UI.txt(this.n, f.toFixed(3) + ' BTC'); UI.txt(this.r, (0.01 - f).toFixed(3) + ' BTC');
    UI.txt(this.pc, t < 8.4 ? (f / 0.01 * 100).toFixed(0) + '% filled' : '40% filled · status: partly filled');
    UI.rise(this.w, t, 10.7);
    UI.rise(this.w2, t, 12.0, { dy: 14 });
    this.tutor.render(t);
  },
});
