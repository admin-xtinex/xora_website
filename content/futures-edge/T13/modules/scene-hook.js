const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Educational mock: a 10x long whose margin balance sinks until the exchange closes it. Concept only: no levels shown.
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const r = kit.rng(31); this.pts = []; let v = 0;
    for (let i = 0; i <= 60; i++) { v += (r() - 0.5) * 10; v *= 0.8; this.pts.push(v - (i > 8 ? Math.pow((i - 8) / 52, 1.3) * 150 : 0)); }
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:900px"><p class="kick hk-k">It can happen without a click</p>' +
      '<h2 class="line hk-t">Closed, but not by you</h2>' +
      '<p class="sub hk-s">What happened here, and how could you see it coming?</p></div>' +
      '<div class="glass hk-ph" style="left:1140px;top:150px;width:640px;padding:28px 34px">' +
      '<p class="fict" style="margin:0 0 14px">Educational mock · not a real exchange</p>' +
      '<div style="display:flex;align-items:center;gap:16px"><b style="font-size:28px;white-space:nowrap">BTCUSDT perpetual</b><span class="chip mono" style="font-size:24px;padding:6px 16px">Long 10x</span>' +
      '<span class="chip hk-st" style="margin-left:auto;font-size:24px;padding:6px 18px"><span class="dot hk-sd"></span><span class="hk-stt">Open</span></span></div>' +
      '<svg width="572" height="200" viewBox="0 0 572 200" style="display:block;margin-top:18px"><line x1="0" x2="572" y1="40" y2="40" stroke-dasharray="6 8" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 30%, transparent)"/>' +
      '<text x="4" y="30" style="fill:color-mix(in srgb, var(--second) 55%, var(--ground));font-size:22px">entry</text><path class="hk-line" fill="none" stroke-width="4" stroke-linejoin="round" style="stroke:var(--main)"/></svg>' +
      '<p style="margin:16px 0 8px;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Margin balance</p>' +
      '<div style="position:relative;height:30px;border-radius:10px;background:color-mix(in srgb, var(--second) 8%, transparent);overflow:hidden"><div class="hk-bal" style="position:absolute;left:0;top:0;bottom:0;border-radius:10px"></div></div></div>' +
      '<div class="glass hk-toast" style="left:1180px;top:330px;width:560px;padding:20px 28px;border-color:var(--accent);background:color-mix(in srgb, var(--ground) 72%, var(--accent));display:flex;gap:18px;align-items:center">' +
      '<span style="width:46px;height:46px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:30px;font-weight:700;background:var(--accent);color:var(--ground)">!</span>' +
      '<p style="margin:0;font-size:26px;line-height:1.3;font-weight:600">Position closed by the exchange: liquidation</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.s = q('.hk-s'); this.ph = q('.hk-ph').style;
    this.line = q('.hk-line'); this.bal = q('.hk-bal').style; this.st = q('.hk-st').style; this.sd = q('.hk-sd').style; this.stt = q('.hk-stt'); this.toast = q('.hk-toast').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'magnify' }, { t: 5.4, pose: 'confused' }, { t: 10.7, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 10.9, { stagger: 0.06 });
    UI.rise(kit, this.ph, t, 0.4, 0.8);
    // The price line draws as BTC falls; the balance bar shrinks with it, until the close at 5.0.
    const p = Math.min(1, seg(t, 0.8, 5.0)), n = Math.max(1, Math.round(p * 60));
    let d = '';
    for (let i = 0; i <= n; i++) d += (i ? 'L' : 'M') + (i / 60 * 572).toFixed(1) + ' ' + (40 - this.pts[i]).toFixed(1);
    this.line.setAttribute('d', d);
    const shut = t >= 5.0;
    const b = lerp(100, 9, eio(p));
    this.bal.width = b.toFixed(1) + '%';
    this.bal.background = b > 45 ? 'var(--main)' : 'var(--accent)';
    this.line.style.stroke = shut ? 'color-mix(in srgb, var(--second) 35%, transparent)' : 'var(--main)';
    UI.set(this.stt, shut ? 'Closed' : 'Open');
    this.st.borderColor = shut ? 'var(--accent)' : 'color-mix(in srgb, var(--main) 30%, transparent)';
    this.sd.background = shut ? 'var(--accent)' : 'var(--main)';
    this.st.transform = 'scale(' + (1 + 0.12 * Math.sin(Math.PI * seg(t, 5.0, 5.6))).toFixed(3) + ')';
    const tp = seg(t, 5.4, 6.0);
    this.toast.opacity = eo(seg(t, 5.4, 5.7)); this.toast.transform = 'translateY(' + lerp(40, 0, eob(tp, 1.4)).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
