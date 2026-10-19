const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('exposure', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const bar = (cls, name, col, role) => '<div style="display:flex;flex-direction:column;gap:10px"><div style="display:flex;justify-content:space-between;font-size:28px;font-weight:600"><span>' + name + ' <span style="color:' + col + '">· ' + role + '</span></span><span class="mono ' + cls + '-n"></span></div>' +
      '<div style="height:44px;border-radius:12px;background:color-mix(in srgb, var(--second) 8%, transparent);overflow:hidden"><div class="' + cls + '" style="height:100%;width:0;border-radius:12px;background:' + col + '"></div></div></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:780px"><p class="kick ex-k">Exposure</p>' +
      '<h2 class="line ex-t">How much moves with price</h2>' +
      '<p class="def ex-d"><b>Exposure</b> is how much of your money moves with the price. <b>Notional value</b> is the full size of a position.</p></div>' +
      '<div class="glass ex-f" style="left:1000px;top:190px;width:780px;padding:26px 34px;display:flex;flex-direction:column;gap:12px">' +
      '<p class="fict" style="margin:0">Worked example · fictional price</p>' +
      '<p class="mono" style="margin:0;font-size:34px">Notional = size × price</p>' +
      '<p class="mono ex-e" style="margin:0;font-size:34px">0.010 × 60,000 = <span class="ex-v" style="color:var(--main)"></span></p></div>' +
      '<div class="glass ex-b" style="left:1000px;top:450px;width:780px;padding:26px 34px;display:flex;flex-direction:column;gap:22px">' +
      bar('ex-a', 'Asha', 'var(--main)', 'spot') + bar('ex-r', 'Rahul', 'var(--accent)', 'futures') + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ex-k').style; this.t = q('.ex-t'); this.d = q('.ex-d'); this.f = q('.ex-f').style; this.e = q('.ex-e').style; this.v = q('.ex-v');
    this.b = q('.ex-b').style; this.ba = q('.ex-a').style; this.br = q('.ex-r').style; this.na = q('.ex-a-n'); this.nr = q('.ex-r-n');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 5.1, pose: 'present' }, { t: 9.9, pose: 'checklist' }, { t: 13.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.2, { stagger: 0.05 });
    UI.show(this.f, t, 5.0);
    this.e.opacity = eo(seg(t, 9.9, 10.4)).toFixed(3);
    UI.set(this.v, UI.fmt(Math.round(lerp(0, 600, eo(seg(t, 10.2, 11.2))))) + ' USDT');
    UI.show(this.b, t, 11.4);
    const a = eio(seg(t, 11.9, 13.0)), r = eio(seg(t, 12.4, 13.5));
    this.ba.width = (a * 100).toFixed(1) + '%'; this.br.width = (r * 100).toFixed(1) + '%';
    UI.set(this.na, UI.fmt(Math.round(600 * a)) + ' USDT'); UI.set(this.nr, UI.fmt(Math.round(600 * r)) + ' USDT');
    this.tutor.render(t);
  },
});
