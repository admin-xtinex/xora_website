const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('flong', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const bar = (cls, label, pct) => '<div style="margin-top:24px"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:28px;font-weight:600">' + label + '</span><span class="mono" style="font-size:34px;color:var(--accent)">' + pct + '</span></div>' +
      '<div style="height:24px;margin-top:10px;border-radius:12px;background:color-mix(in srgb, var(--second) 9%, transparent)"><i class="' + cls + '" style="display:block;height:100%;width:0;border-radius:12px;background:var(--accent)"></i></div></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:800px"><p class="kick fl-k">Futures · USDT-margined</p>' +
      '<h2 class="line fl-t">A futures long</h2>' +
      '<p class="def fl-d">Same formula as spot: <b>(exit − entry) × quantity</b>, paid in USDT.</p></div>' +
      '<div class="glass fl-w" style="left:140px;top:480px;width:800px;padding:24px 32px"><p class="kick" style="margin:0 0 10px">Long 0.1 BTC · 60,000 → 59,400</p>' +
      '<p class="mono fl-wv" style="margin:0;font-size:30px">(59,400 − 60,000) × 0.1 = <span style="color:var(--accent)">−60.00 USDT</span></p></div>' +
      '<span class="chip fl-n" style="position:absolute;left:140px;top:680px;font-size:28px;padding:12px 26px"><span class="dot" style="background:var(--accent)"></span>Simplified: fees and funding left out</span>' +
      '<div class="glass fl-m" style="left:1000px;top:230px;width:600px;padding:28px 34px"><p class="kick" style="margin:0">Same −60 USDT, compared with</p>' +
      bar('fl-b1', 'Position value: 6,000 USDT', '1%') + bar('fl-b2', 'Your margin at 10×: 600 USDT', '10%') +
      '<p style="margin:24px 0 0;font-size:26px;line-height:1.4;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Leverage makes the same loss a bigger share of your deposit. More in Phase 3.</p></div>' +
      '</div>'));
    this.chart = UI.chart(kit, { x0: 1000, x1: 1500, y0: 250, y1: 540, lo: 59000, hi: 60500, step: 500, t0: 8.0, t1: 12.6,
      keys: [[8.0, 60000], [8.4, 60000], [11.8, 59400], [26, 59400]], entry: 60000, entryLabel: 'Entry 60,000', label: 'BTC price in USDT · fictional' });
    this.meter = UI.meter(kit, 1000, 590, 600, 'Long 0.1 BTC', 60);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.fl-k').style; this.t = q('.fl-t'); this.d = q('.fl-d'); this.w = q('.fl-w').style; this.wv = q('.fl-wv').style; this.n = q('.fl-n').style;
    this.m = q('.fl-m').style; this.b1 = q('.fl-b1').style; this.b2 = q('.fl-b2').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'cheer' }, { t: 0.6, pose: 'explain' }, { t: 8.0, pose: 'candles' }, { t: 13.7, pose: 'read' }, { t: 18.4, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.2, { stagger: 0.05 });
    const out = ei(seg(t, 18.0, 18.5));
    this.chart.render(t, eo(seg(t, 7.6, 8.2)) * (1 - out));
    const mp = eo(seg(t, 7.8, 8.4));
    this.meter.style.opacity = mp * (1 - out); this.meter.style.transform = 'translateY(' + lerp(24, 0, mp).toFixed(1) + 'px)';
    this.meter.set(Math.round(this.chart.price(t) - 60000) * 0.1);
    const wp = seg(t, 8.0, 8.6);
    this.w.opacity = eo(wp); this.w.transform = 'translateY(' + lerp(24, 0, eo(wp)).toFixed(1) + 'px)';
    this.wv.opacity = eo(seg(t, 11.8, 12.3));
    const np = seg(t, 13.7, 14.2);
    this.n.opacity = eo(np); this.n.transform = 'scale(' + lerp(0.85, 1, eob(np, 1.7)).toFixed(4) + ')';
    const mm = seg(t, 18.4, 19.0);
    this.m.opacity = eo(mm); this.m.transform = 'translateY(' + lerp(30, 0, eo(mm)).toFixed(1) + 'px)';
    this.b1.width = (1 * eo(seg(t, 19.6, 20.4))).toFixed(2) + '%';
    this.b2.width = (10 * eo(seg(t, 21.0, 22.0))).toFixed(2) + '%';
    this.tutor.render(t);
  },
});
