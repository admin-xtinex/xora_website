const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:900px"><p class="kick tr-k">Your turn</p>' +
      '<h2 class="line tr-t">Work out the result</h2></div>' +
      '<div class="glass tr-q" style="left:140px;top:370px;width:960px;padding:28px 40px"><p class="fict" style="margin:0 0 12px">Question · fictional prices</p>' +
      '<p class="def" style="margin:0">You <b>short 0.02 BTC</b> at <b>60,000 USDT</b> and close at <b>61,000</b>. What is the gross result?</p></div>' +
      '<div class="glass tr-a" style="left:140px;top:580px;width:960px;padding:22px 40px;border-color:var(--accent);background:color-mix(in srgb, var(--ground) 76%, var(--accent))">' +
      '<p class="mono" style="margin:0;font-size:34px">(60,000 − 61,000) × 0.02 = <span style="color:var(--accent)">−20.00 USDT</span></p>' +
      '<p class="mono tr-n" style="margin:10px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 85%, var(--ground))">Fees 0.60 + 0.61 → net <span style="color:var(--accent)">−21.21 USDT</span></p></div>' +
      '<p class="tr-h" style="position:absolute;left:1210px;top:640px;width:360px;margin:0;text-align:center;font-size:28px;color:color-mix(in srgb, var(--second) 62%, var(--ground))">Hint: short = entry − exit</p>' +
      '</div>'));
    this.ring = UI.ring(kit, 1390, 470, 100, 2.2, 2.8, 5, 8.2);
    this.meter = UI.meter(kit, 1180, 380, 440, 'Gross', 25);
    this.mnet = UI.meter(kit, 1180, 540, 440, 'Net', 25);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tr-k').style; this.t = q('.tr-t'); this.qc = q('.tr-q').style; this.a = q('.tr-a').style; this.h = q('.tr-h').style; this.n = q('.tr-n').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'present' }, { t: 2.8, pose: 'think' }, { t: 8.2, pose: 'cheer' }, { t: 12.8, pose: 'writing' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const qp = seg(t, 0.8, 1.5);
    this.qc.opacity = eo(qp); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qp)).toFixed(1) + 'px)';
    this.ring(t);
    this.h.opacity = eo(seg(t, 5.0, 5.6)) * (1 - ei(seg(t, 7.8, 8.2)));
    const a = seg(t, 8.2, 8.9);
    this.a.opacity = eo(a); this.a.transformOrigin = '0 50%'; this.a.transform = 'scale(' + lerp(0.92, 1, eob(a, 1.6)).toFixed(4) + ')';
    this.n.opacity = eo(seg(t, 12.8, 13.3));
    const m = eo(seg(t, 8.4, 9.0)), mn = eo(seg(t, 12.8, 13.4));
    this.meter.style.opacity = m; this.meter.style.transform = 'translateY(' + lerp(24, 0, m).toFixed(1) + 'px)';
    this.meter.set(-20 * eio(seg(t, 9.0, 10.4)));
    this.mnet.style.opacity = mn; this.mnet.style.transform = 'translateY(' + lerp(24, 0, mn).toFixed(1) + 'px)';
    this.mnet.set(-21.21 * eio(seg(t, 13.4, 14.6)));
    this.tutor.render(t);
  },
});
