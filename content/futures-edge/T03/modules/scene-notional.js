const { seg, eo, eob, eio, lerp, TextFx } = kit;
kit.scene('notional', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (cls, top, big, small, w, hl) => '<div class="glass ' + cls + '" style="position:relative;width:' + w + 'px;padding:22px 28px;' + (hl ? 'border-color:var(--main);background:color-mix(in srgb, var(--ground) 75%, var(--main))' : '') + '"><p class="fict" style="margin:0 0 8px">' + top + '</p><p class="mono ' + cls + '-n" style="margin:0;font-size:54px">' + big + '</p><p style="margin:6px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + small + '</p></div>';
    const op = (cls, s) => '<span class="mono ' + cls + '" style="font-size:60px;color:var(--main)">' + s + '</span>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1500px"><p class="kick nt-k">Notional value</p>' +
      '<h2 class="line nt-t">What is my order worth?</h2>' +
      '<p class="def nt-d"><b>Notional value</b> is the total worth of a quantity, counted in the quote asset.</p></div>' +
      '<div class="glass nt-f" style="left:140px;top:416px;padding:16px 30px;border-color:var(--accent)"><p class="mono" style="margin:0;font-size:34px">Value in USDT = BTC amount × USDT per BTC</p></div>' +
      '<div style="position:absolute;left:140px;top:520px;display:flex;align-items:center;gap:26px">' +
      tile('nt-a', 'Quantity', '0.05', 'BTC', 300) + op('nt-x', '×') +
      tile('nt-p', 'Price', '60,000', 'USDT per BTC', 340) + op('nt-e', '=') +
      tile('nt-v', 'Notional value', '0', 'USDT', 360, true) + '</div>' +
      '<div class="nt-u" style="position:absolute;left:140px;top:712px;display:flex;gap:30px;align-items:baseline"><p class="mono" style="margin:0;font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Units: BTC × (USDT per BTC) = USDT</p><p class="fict" style="margin:0">Fictional example</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.nt-k').style; this.t = q('.nt-t'); this.d = q('.nt-d'); this.f = q('.nt-f').style; this.u = q('.nt-u').style;
    this.parts = ['.nt-a', '.nt-x', '.nt-p', '.nt-e', '.nt-v'].map((s) => q(s).style);
    this.vn = q('.nt-v-n');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.6, pose: 'explain' }, { t: 6.4, pose: 'present' }, { t: 11.6, pose: 'checklist' }, { t: 16.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.05 });
    const f = seg(t, 6.4, 7.1);
    this.f.opacity = eo(f); this.f.transform = 'translateY(' + lerp(24, 0, eo(f)) + 'px)';
    const at = [11.8, 12.6, 13.0, 14.6, 15.0];
    this.parts.forEach((s, i) => {
      const p = seg(t, at[i], at[i] + 0.6);
      s.opacity = eo(seg(t, at[i], at[i] + 0.3));
      s.transform = 'translateY(' + lerp(36, 0, eo(p)) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.6)) + ')';
    });
    UI.set(this.vn, UI.fmt(Math.round(3000 * eo(seg(t, 15.1, 16.1)))));
    this.u.opacity = 0.9 * eo(seg(t, 16.4, 17.0));
    this.tutor.render(t);
  },
});
