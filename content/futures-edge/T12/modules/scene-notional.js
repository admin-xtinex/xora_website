const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('notional', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const field = (label, cls, v) => '<div style="display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)" class="' + cls + '"><span style="font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + label + '</span><span class="mono" style="font-size:28px">' + v + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:960px"><p class="kick nt-k">New word · notional</p>' +
      '<h2 class="line nt-t">Notional: the full size</h2>' +
      '<p class="def nt-d"><b>Notional exposure</b> is the total value of your position, in USDT. Notional = quantity × price.</p></div>' +
      '<div class="glass nt-tk" style="left:1220px;top:160px;width:560px;padding:22px 32px"><p class="fict" style="margin:0 0 6px">Position · educational mock</p>' +
      field('Contract', 'nt-f', 'BTCUSDT perpetual') + field('Side', 'nt-f', 'Long') + field('Margin', 'nt-f', '100 USDT') + field('Notional', 'nt-f nt-fn', '1,000 USDT') + field('Quantity', 'nt-f', '≈ 0.0167 BTC') + '</div>' +
      '<div style="position:absolute;left:140px;top:560px;width:1500px">' +
      '<div style="display:flex;align-items:center;gap:24px;height:64px"><span style="width:250px;flex:none;font-size:26px;font-weight:600">Your margin</span><div class="nt-m" style="flex:none;height:46px;width:110px;border-radius:10px;background:var(--main)"></div><span class="mono nt-mv" style="font-size:30px;white-space:nowrap">100 USDT</span></div>' +
      '<div style="display:flex;align-items:center;gap:24px;height:64px;margin-top:16px"><span style="width:250px;flex:none;font-size:26px;font-weight:600">Position (notional)</span><div class="nt-n" style="flex:none;height:46px;width:0;border-radius:10px;background:linear-gradient(90deg, var(--main), var(--accent))"></div><span class="mono nt-nv" style="font-size:30px;white-space:nowrap">0 USDT</span></div>' +
      '</div>' +
      '<div class="chip nt-c" style="position:absolute;left:414px;top:720px;font-size:28px;padding:12px 26px">A 2% move on 1,000 = <span class="mono" style="color:var(--main)">20 USDT</span>, not 2</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.nt-k').style; this.t = q('.nt-t'); this.d = q('.nt-d'); this.tk = q('.nt-tk').style;
    this.fs = all('.nt-f').map((e) => e.style); this.fn = q('.nt-fn').style;
    this.m = q('.nt-m').style; this.n = q('.nt-n').style; this.nv = q('.nt-nv'); this.mv = q('.nt-mv').style; this.c = q('.nt-c').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'read' }, { t: 6.0, pose: 'point', flip: true }, { t: 11.3, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.0, { stagger: 0.04 });
    UI.rise(kit, this.tk, t, 2.4, 0.7);
    this.fs.forEach((s, i) => { s.opacity = eo(seg(t, 2.8 + i * 0.3, 3.2 + i * 0.3)); });
    const mp = seg(t, 6.0, 6.6);
    this.m.transformOrigin = '0 50%'; this.m.transform = 'scaleX(' + eo(mp) + ')'; this.mv.opacity = eo(mp);
    // The position bar grows to ten times the margin bar: 1,000 USDT against 100.
    const g = eio(seg(t, 7.0, 9.0));
    this.n.width = (1100 * g).toFixed(1) + 'px';
    UI.set(this.nv, UI.fmt(Math.round(1000 * g / 10) * 10) + ' USDT');
    this.nv.style.opacity = eo(seg(t, 7.0, 7.4));
    const hl = Math.sin(Math.PI * seg(t, 8.8, 10.0));
    this.fn.background = 'color-mix(in srgb, var(--main) ' + (hl * 18).toFixed(1) + '%, transparent)';
    // A 2% move acts on the whole bar: it ripples, and the chip spells it out.
    const r = seg(t, 11.3, 12.5);
    this.n.filter = 'brightness(' + (1 + 0.5 * Math.sin(Math.PI * r)).toFixed(3) + ')';
    UI.rise(kit, this.c, t, 12.0, 0.6, 20);
    this.tutor.render(t);
  },
});
