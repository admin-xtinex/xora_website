const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:900px"><p class="kick tr-k">Your turn</p>' +
      '<h2 class="line tr-t">Profit or loss?</h2></div>' +
      '<div class="glass tr-q" style="left:140px;top:380px;width:940px;padding:30px 40px"><p class="fict" style="margin:0 0 12px">Question · fictional prices · before fees</p>' +
      '<p class="def" style="margin:0">You open a <b>short</b> of <b>0.02 BTC</b> at <b>60,000 USDT</b>. The price rises to <b>60,500</b>. Profit or loss, and how much?</p></div>' +
      '<div class="glass tr-a" style="left:140px;top:610px;width:940px;padding:24px 40px;border-color:var(--accent);background:color-mix(in srgb, var(--ground) 76%, var(--accent))">' +
      '<p class="mono" style="margin:0;font-size:36px">(60,000 − 60,500) × 0.02 = <span style="color:var(--accent)">−10 USDT</span></p>' +
      '<p style="margin:8px 0 0;font-size:28px;font-weight:600">A loss. A short loses when the price rises.</p></div>' +
      '<p class="tr-h" style="position:absolute;left:1210px;top:640px;width:360px;margin:0;text-align:center;font-size:28px;color:color-mix(in srgb, var(--second) 62%, var(--ground))">Hint: short = entry − now</p>' +
      '</div>'));
    this.ring = UI.ring(kit, 1390, 470, 100, 2.4, 3.0, 5, 8.6);
    this.meter = UI.meter(kit, 1160, 380, 460, 'Short', 15);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tr-k').style; this.t = q('.tr-t'); this.qc = q('.tr-q').style; this.a = q('.tr-a').style; this.h = q('.tr-h').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'present' }, { t: 3.0, pose: 'think' }, { t: 8.4, pose: 'cheer' }, { t: 14.0, pose: 'thumbs' }],
      says: [{ t0: 14.2, t1: 19.6, text: 'Well done!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const qp = seg(t, 0.8, 1.5);
    this.qc.opacity = eo(qp); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qp)).toFixed(1) + 'px)';
    this.ring(t);
    this.h.opacity = eo(seg(t, 5.2, 5.8)) * (1 - ei(seg(t, 8.2, 8.6)));
    const a = seg(t, 8.4, 9.1);
    this.a.opacity = eo(a); this.a.transformOrigin = '0 50%'; this.a.transform = 'scale(' + lerp(0.92, 1, eob(a, 1.6)).toFixed(4) + ')';
    const m = seg(t, 8.6, 9.2);
    this.meter.style.opacity = eo(m); this.meter.style.transform = 'translateY(' + lerp(24, 0, eo(m)).toFixed(1) + 'px)';
    this.meter.set(-10 * eio(seg(t, 9.2, 10.6)));
    this.tutor.render(t);
  },
});
