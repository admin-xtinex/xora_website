const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('margin', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:900px"><p class="kick mg-k">New word · margin</p>' +
      '<h2 class="line mg-t">Margin is your deposit</h2></div>' +
      '<div class="glass mg-def" style="left:140px;top:380px;width:900px;padding:28px 36px"><p class="def mg-d" style="margin:0"><b>Initial margin</b> is the money you set aside to open a futures position. Losses come out of it.</p></div>' +
      '<div class="glass mg-an" style="left:140px;top:600px;width:900px;padding:22px 36px;display:flex;align-items:center;gap:28px">' +
      '<svg width="120" height="70" viewBox="0 0 120 70" style="flex:none"><path d="M8 50 L14 30 Q18 20 30 20 L80 20 Q92 20 100 30 L112 40 L112 50 Z" fill="none" stroke-width="4" stroke-linejoin="round" style="stroke:var(--main)"/><circle cx="32" cy="54" r="10" stroke-width="4" style="fill:var(--ground);stroke:var(--main)"/><circle cx="88" cy="54" r="10" stroke-width="4" style="fill:var(--ground);stroke:var(--main)"/></svg>' +
      '<p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">Like a deposit on a rented car: you drive something worth far more, and damage comes out of the deposit.</p></div>' +
      '<div class="glass mg-w" style="left:1180px;top:170px;width:600px;padding:26px 34px"><p class="fict" style="margin:0 0 8px">Futures wallet · educational mock</p>' +
      '<p style="margin:0;font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Available</p><p style="margin:4px 0 0"><span class="mono mg-wn" style="font-size:60px">500.00</span> <span style="font-size:26px">USDT</span></p></div>' +
      '<div class="glass mg-box" style="left:1180px;top:440px;width:600px;height:200px;padding:24px 34px;border-style:dashed"><p class="kick" style="margin:0 0 8px">Margin · locked</p>' +
      '<p style="margin:0"><span class="mono mg-bn" style="font-size:60px">0.00</span> <span style="font-size:26px">USDT</span></p></div>' +
      '<div class="chip mono mg-coin" style="position:absolute;left:1360px;top:300px;font-size:30px;padding:14px 26px;background:var(--main);color:var(--ground);border-color:var(--main)">100 USDT</div>' +
      '<p class="fict mg-f" style="position:absolute;left:1180px;top:664px;margin:0">Fictional amounts</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mg-k').style; this.t = q('.mg-t'); this.def = q('.mg-def').style; this.d = q('.mg-d'); this.an = q('.mg-an').style;
    this.w = q('.mg-w').style; this.wn = q('.mg-wn'); this.box = q('.mg-box').style; this.bn = q('.mg-bn'); this.coin = q('.mg-coin').style; this.f = q('.mg-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 7.1, pose: 'point', flip: true }, { t: 13.2, pose: 'present' }],
      says: [{ t0: 15.0, t1: 19.6, text: 'A deposit, not a fee.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.def, t, 0.8, 0.7);
    TextFx.fadeFromRight(this.d, t, 1.0, { stagger: 0.04 });
    UI.rise(kit, this.w, t, 6.6, 0.7);
    const bx = UI.rise(kit, this.box, t, 7.4, 0.7);
    // 100 USDT leaves the wallet and drops into the margin box.
    const mv = seg(t, 8.6, 9.8);
    this.coin.opacity = (eo(seg(t, 8.2, 8.6)) * (1 - ei(seg(t, 9.9, 10.3)))).toFixed(3);
    this.coin.transform = 'translateY(' + lerp(0, 230, eio(mv)).toFixed(1) + 'px) scale(' + lerp(0.8, 1, eob(seg(t, 8.2, 8.7), 1.6)).toFixed(3) + ')';
    const m = eo(seg(t, 8.4, 10.0));
    UI.set(this.wn, UI.fmt(500 - 100 * m, 2));
    UI.set(this.bn, UI.fmt(100 * eo(seg(t, 9.6, 10.4)), 2));
    this.box.borderStyle = t > 10.0 ? 'solid' : 'dashed';
    this.box.borderColor = t > 10.0 ? 'var(--main)' : 'color-mix(in srgb, var(--main) 22%, transparent)';
    this.f.opacity = 0.9 * eo(seg(t, 10.4, 11.0));
    UI.rise(kit, this.an, t, 13.2, 0.7);
    this.tutor.render(t);
  },
});
