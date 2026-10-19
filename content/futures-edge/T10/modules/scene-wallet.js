const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('wallet', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    this.spot = UI.spot(kit);
    const bar = '<div style="display:flex;flex-direction:column;gap:12px">' +
      '<div style="position:relative;height:60px;border-radius:14px;overflow:hidden;background:color-mix(in srgb, var(--main) 26%, var(--ground));border:1.5px solid color-mix(in srgb, var(--main) 50%, transparent)">' +
      '<div class="wa-use" style="position:absolute;left:0;top:0;bottom:0;width:0;background:color-mix(in srgb, var(--accent) 60%, var(--ground))"></div>' +
      '<span class="mono wa-ul" style="position:absolute;left:20px;top:12px;font-size:28px;font-weight:600">In use 600</span><span class="mono wa-al" style="position:absolute;right:20px;top:12px;font-size:28px;font-weight:600">Available 400</span></div>' +
      '<p class="mono wa-eq" style="margin:0;font-size:30px">1,000 − 600 = <span style="color:var(--main)">400 USDT available</span></p>' +
      '<p class="fict" style="margin:0">Shown at 1x, no leverage · leverage is lesson T12</p></div>';
    kit.stage.append(kit.h('<div class="glass wa-chip" style="left:1336px;top:120px;width:316px;height:70px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;border-color:var(--main)"><span style="font-size:22px;color:color-mix(in srgb, var(--second) 58%, var(--ground))">Wallet</span><span class="mono" style="font-size:24px">1,000.00 USDT</span></div>'));
    this.card = UI.tip(kit, 300, 214, 1110, '7 · Wallet', 'What you have, and what is free', 'Your <b>balance</b> is all the money in your account. Part is <b>in use</b>, held for orders and positions. The rest is <b>available</b>.', bar);
    const q = (s) => kit.stage.querySelector(s);
    this.cs = this.card.style; this.chip = kit.stage.querySelector('.wa-chip').style; this.use = q('.wa-use').style; this.ul = q('.wa-ul').style; this.al = q('.wa-al').style; this.eq = q('.wa-eq').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'present' }, { t: 6.4, pose: 'explain' }, { t: 12.8, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    const m = 60000 + UI.wig(t, 12);
    const avail = t >= 13.4 ? '400.00 USDT' : null;
    this.term.render(t, { sym: 'BTC', price: m, pos: { size: 0.01, entry: 60000, mark: m }, bal: 1000, form: { a: avail } });
    const r = UI.spotAt([[0, UI.R.wallet], [13.4, { x: 1450, y: 120, w: 370, h: 656 }]], t, 0.8);
    this.spot.set(r, eo(seg(t, 0, 0.8)), eo(seg(t, 0.2, 1.0)));
    this.chip.opacity = eio(seg(t, 12.5, 13.0)).toFixed(3);
    UI.show(this.cs, t, 0.8);
    const u = eio(seg(t, 6.8, 7.8));
    this.use.width = (60 * u).toFixed(2) + '%';
    this.ul.opacity = eo(seg(t, 7.6, 8.0)).toFixed(3); this.al.opacity = eo(seg(t, 8.6, 9.0)).toFixed(3);
    this.eq.opacity = eo(seg(t, 13.0, 13.5)).toFixed(3);
    const fa = this.term.E.fa.style; fa.color = t >= 13.4 ? 'var(--main)' : ''; fa.textShadow = t >= 13.4 ? '0 0 ' + (12 * Math.sin(Math.PI * seg(t, 13.4, 14.6))).toFixed(1) + 'px var(--main)' : 'none';
    this.tutor.render(t);
  },
});
