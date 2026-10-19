const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('example', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (cls, top, big, small, hl) => '<div class="glass ' + cls + '" style="position:relative;width:300px;padding:18px 26px;' + (hl ? 'border-color:var(--accent);background:color-mix(in srgb, var(--ground) 80%, var(--accent))' : '') + '"><p class="fict" style="margin:0 0 6px">' + top + '</p><p class="mono ' + cls + '-n" style="margin:0;font-size:48px">' + big + '</p><p style="margin:4px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + small + '</p></div>';
    const op = (cls, s) => '<span class="mono ' + cls + '" style="font-size:56px;width:50px;text-align:center;color:var(--main)">' + s + '</span>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px;gap:18px"><p class="kick ex-k">Worked example · 10x long, 100 USDT margin</p>' +
      '<h2 class="line ex-t" style="font-size:72px">From price move to PnL</h2>' +
      '<p class="sub ex-s" style="margin:0">Gross PnL ≈ notional × signed % move</p>' +
      '<p class="fict ex-f" style="margin:0">Fictional · simplified linear contract · before fees and funding · for a short, the sign flips</p></div>' +
      '<div style="position:absolute;left:140px;top:440px;display:flex;align-items:center;gap:22px">' +
      tile('ex-a', 'Notional', '1,000', 'USDT') + op('ex-x', '×') + tile('ex-b', 'Price move', '−2%', '60,000 → 58,800') + op('ex-e', '=') + tile('ex-c', 'Gross PnL', '0', 'USDT', 1) + '</div>' +
      '<div style="position:absolute;left:140px;top:618px;display:flex;align-items:center;gap:22px">' +
      tile('ex-d', 'Gross PnL', '−20', 'USDT') + op('ex-y', '÷') + tile('ex-g', 'Margin', '100', 'USDT') + op('ex-q', '=') + tile('ex-h', 'Return on margin', '0%', 'of your money', 1) + '</div>' +
      '<div class="glass ex-sum" style="left:1380px;top:440px;width:400px;padding:24px 30px;border-color:var(--accent)"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Magnified</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.35;font-weight:600">A <span class="mono">2%</span> price move became <span class="mono" style="color:var(--accent)">20%</span> of your margin.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ex-k').style; this.t = q('.ex-t'); this.s = q('.ex-s'); this.f = q('.ex-f').style;
    this.r1 = ['.ex-a', '.ex-x', '.ex-b', '.ex-e', '.ex-c'].map((s) => q(s).style);
    this.r2 = ['.ex-d', '.ex-y', '.ex-g', '.ex-q', '.ex-h'].map((s) => q(s).style);
    this.c = q('.ex-c-n'); this.h = q('.ex-h-n'); this.sum = q('.ex-sum').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'writing' }, { t: 6.6, pose: 'present' }, { t: 11.9, pose: 'writing' }, { t: 16.3, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 1.2, { stagger: 0.06 });
    this.f.opacity = 0.9 * eo(seg(t, 3.4, 4.0));
    const a1 = [6.6, 7.4, 7.7, 8.6, 8.9], a2 = [11.9, 12.6, 12.9, 13.8, 14.1];
    const pop = (s, a) => { const p = seg(t, a, a + 0.6); s.opacity = eo(seg(t, a, a + 0.3)); s.transform = 'translateY(' + lerp(30, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.6)).toFixed(4) + ')'; };
    this.r1.forEach((s, i) => pop(s, a1[i]));
    this.r2.forEach((s, i) => pop(s, a2[i]));
    UI.set(this.c, UI.sgn(-20 * eo(seg(t, 9.0, 10.0)), 0));
    UI.set(this.h, UI.sgn(-20 * eo(seg(t, 14.2, 15.2)), 0) + '%');
    UI.rise(kit, this.sum, t, 16.3, 0.7);
    this.tutor.render(t);
  },
});
