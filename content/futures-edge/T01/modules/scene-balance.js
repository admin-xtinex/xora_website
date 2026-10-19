const { seg, eo, eob, eio, lerp, TextFx } = kit;
kit.scene('balance', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (cls, top, big, small, w, hl) => '<div class="glass ' + cls + '" style="position:relative;width:' + w + 'px;padding:24px 30px;' + (hl ? 'border-color:var(--main);background:color-mix(in srgb, var(--ground) 75%, var(--main))' : '') + '"><p class="fict" style="margin:0 0 8px">' + top + '</p><p class="mono ' + cls + '-n" style="margin:0;font-size:56px">' + big + '</p><p style="margin:6px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + small + '</p></div>';
    const op = (cls, s) => '<span class="mono ' + cls + '" style="font-size:64px;color:var(--main)">' + s + '</span>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1500px"><p class="kick bl-k">Worked example</p>' +
      '<h2 class="line bl-t">What is my BTC worth?</h2>' +
      '<p class="sub bl-s">Value = amount of BTC × price of one BTC</p></div>' +
      '<div style="position:absolute;left:140px;top:500px;display:flex;align-items:center;gap:30px">' +
      tile('bl-a', 'Your balance', '0.002 BTC', 'the amount you hold', 330) + op('bl-x', '×') +
      tile('bl-p', 'Price of 1 BTC', '60,000', 'USDT per BTC', 360) + op('bl-e', '=') +
      tile('bl-v', 'Value', '120', 'USDT', 330, true) + '</div>' +
      '<p class="fict bl-f" style="position:absolute;left:140px;top:720px;margin:0">All amounts are fictional examples</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.bl-k').style; this.t = q('.bl-t'); this.s = q('.bl-s'); this.f = q('.bl-f').style;
    this.parts = ['.bl-a', '.bl-x', '.bl-p', '.bl-e', '.bl-v'].map((s) => q(s).style);
    this.vn = q('.bl-v-n');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 1.0, pose: 'present' }, { t: 7.9, pose: 'thumbs' }, { t: 11.2, pose: 'explain' }],
      says: [{ t0: 11.4, t1: 15.6, text: 'Amount times price. That is all it is.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 1.2, { stagger: 0.06 });
    const at = [2.6, 4.0, 4.4, 6.4, 6.8];
    this.parts.forEach((s, i) => {
      const p = seg(t, at[i], at[i] + 0.6);
      s.opacity = eo(seg(t, at[i], at[i] + 0.3));
      s.transform = 'translateY(' + lerp(36, 0, eo(p)) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.6)) + ')';
    });
    const v = Math.round(lerp(60, 120, eo(seg(t, 6.9, 7.9))));
    if (this.vn.textContent !== String(v)) this.vn.textContent = String(v);
    this.f.opacity = 0.9 * eo(seg(t, 8.4, 9.0));
    this.tutor.render(t);
  },
});
