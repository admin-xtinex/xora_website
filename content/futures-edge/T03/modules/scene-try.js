const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Fields typed into the mock calculator: [text, start typing at]
const TR_F = [['0.02', 1.4], ['65,000', 2.4]];
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const field = (label, cls, unit) => '<div style="display:flex;flex-direction:column;gap:8px"><span style="font-size:24px;font-weight:600;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + label + '</span>' +
      '<div class="tr-box" style="display:flex;align-items:center;gap:16px;height:72px;padding:0 22px;border-radius:16px;border:2px solid color-mix(in srgb, var(--second) 18%, transparent);background:color-mix(in srgb, var(--ground) 70%, transparent)">' +
      '<span class="mono ' + cls + '" style="font-size:40px"></span><span class="tr-caret" style="width:3px;height:40px;background:var(--main)"></span><span style="flex:1"></span><span class="mono" style="font-size:26px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">' + unit + '</span></div></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:860px"><p class="kick tr-k">Your turn</p>' +
      '<h2 class="line tr-t">Pause and work it out</h2></div>' +
      '<div class="glass tr-q" style="left:140px;top:380px;width:820px;padding:30px 40px"><p class="fict" style="margin:0 0 12px">Question · fictional price</p>' +
      '<p class="def" style="margin:0">You set the quantity to <b>0.02 BTC</b>. The price is <b>65,000 USDT</b> per BTC. What is the notional value?</p></div>' +
      '<div class="glass tr-a" style="left:140px;top:664px;width:820px;padding:22px 40px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 76%, var(--main))">' +
      '<p class="mono" style="margin:0;font-size:42px">0.02 × 65,000 = <span style="color:var(--main)">1,300 USDT</span></p></div>' +
      '<div class="glass tr-calc" style="left:1060px;top:190px;width:640px;padding:28px 34px;display:flex;flex-direction:column;gap:22px"><p class="fict" style="margin:0">Value calculator · educational mock</p>' +
      field('Quantity', 'tr-f0', 'BTC') + field('Price', 'tr-f1', 'USDT per BTC') +
      '<div style="display:flex;flex-direction:column;gap:8px"><span style="font-size:24px;font-weight:600;color:var(--main)">Notional value</span>' +
      '<div class="tr-vb" style="display:flex;align-items:center;gap:16px;height:80px;padding:0 22px;border-radius:16px;border:2px solid var(--main);background:color-mix(in srgb, var(--ground) 70%, var(--main))">' +
      '<span class="mono tr-v" style="font-size:44px"></span><span style="flex:1"></span><span class="mono" style="font-size:26px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">USDT</span></div>' +
      '<div style="height:10px;border-radius:5px;background:color-mix(in srgb, var(--second) 10%, transparent);overflow:hidden"><div class="tr-bar" style="height:100%;background:var(--main)"></div></div></div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tr-k').style; this.t = q('.tr-t'); this.qc = q('.tr-q').style; this.a = q('.tr-a').style; this.calc = q('.tr-calc').style;
    this.f = [q('.tr-f0'), q('.tr-f1')]; this.carets = [...kit.stage.querySelectorAll('.tr-caret')].map((e) => e.style);
    this.v = q('.tr-v'); this.bar = q('.tr-bar').style; this.vb = q('.tr-vb').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: 3.6, pose: 'think' }, { t: 9.0, pose: 'cheer' }, { t: 12.2, pose: 'thumbs' }],
      says: [{ t0: 12.4, t1: 17.6, text: 'Amount times price. Nice!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const qp = seg(t, 0.6, 1.3), cp = seg(t, 0.4, 1.1);
    this.qc.opacity = eo(qp); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qp)) + 'px)';
    this.calc.opacity = eo(cp); this.calc.transform = 'translateX(' + lerp(40, 0, eo(cp)) + 'px)';
    TR_F.forEach((f, i) => {
      const n = Math.max(0, Math.min(f[0].length, Math.floor((t - f[1]) / 0.12) + 1));
      UI.set(this.f[i], t < f[1] ? '' : f[0].slice(0, n));
      const typing = t >= f[1] - 0.3 && t < f[1] + f[0].length * 0.12 + 0.3;
      this.carets[i].opacity = typing && Math.floor(t * 3) % 2 === 0 ? 1 : 0;
    });
    // Countdown: 5 seconds, the bar drains and the digit counts down, then the answer appears.
    const cd = seg(t, 3.6, 8.6), left = Math.max(1, Math.ceil(5 - (t - 3.6)));
    UI.set(this.v, t < 3.6 ? '?' : t < 9.0 ? String(Math.min(5, left)) : UI.fmt(Math.round(1300 * eo(seg(t, 9.0, 9.8)))));
    this.v.style.color = t < 9.0 ? 'color-mix(in srgb, var(--second) 70%, var(--ground))' : 'var(--main)';
    this.bar.width = (t < 3.6 ? 100 : (1 - cd) * 100).toFixed(1) + '%';
    const a = seg(t, 9.0, 9.7);
    this.a.opacity = eo(a);
    this.a.transform = 'scale(' + lerp(0.92, 1, eob(a, 1.6)) + ')';
    this.a.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
