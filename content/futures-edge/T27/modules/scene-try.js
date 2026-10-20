const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Pause and calculate: 3 USDT margin at 10x, entry 60,000, stop 59,400. Risk before fees?
const TY_STEPS = [[12.2, 'Size', '3 USDT × 10 = 30 USDT'], [14.2, 'Stop distance', '600 ÷ 60,000 = 1.00%'], [16.2, 'Risk', '30 USDT × 1.00% = 0.30 USDT']];
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (a, b) => '<div style="flex:1;padding:14px 18px;border-radius:16px;border:1.5px solid color-mix(in srgb, var(--second) 14%, transparent)"><p class="lbl" style="margin:0">' + a + '</p><p class="mono" style="margin:6px 0 0;font-size:34px">' + b + '</p></div>';
    let steps = '';
    TY_STEPS.forEach((s) => { steps += '<div class="ty-s" style="display:flex;align-items:baseline;gap:22px;padding:4px 0"><span class="kick" style="width:220px;flex:none">' + s[1] + '</span><span class="mono" style="font-size:32px">' + s[2] + '</span></div>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1100px"><p class="kick ty-k">Your turn</p><h2 class="line ty-t">How much is at risk?</h2></div>' +
      '<div class="glass ty-q" style="left:140px;top:300px;width:1060px;padding:20px 28px"><p class="fict" style="margin:0 0 12px">Trade plan · fictional numbers</p>' +
      '<div style="display:flex;gap:12px">' + tile('Margin', '3 USDT') + tile('Leverage', '10x') + tile('Entry', '60,000') + tile('Stop', '59,400') + '</div>' +
      '<p style="margin:14px 0 0;font-size:30px;font-weight:600">If the stop is hit, how many USDT do you lose, before fees?</p></div>' +
      '<div class="glass ty-a" style="left:140px;top:545px;width:1060px;padding:8px 28px;border-color:var(--main)">' + steps +
      '<p class="ty-f" style="margin:6px 0 0;font-size:26px;color:var(--warn)">Before fees and slippage.</p></div></div>'));
    this.ring = UI.ring(kit, 1500, 520, 110, 5.6, 6.4, 5, 11.8, 'Pause and calculate');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ty-k').style; this.t = q('.ty-t'); this.qc = q('.ty-q').style; this.a = q('.ty-a').style; this.f = q('.ty-f').style;
    this.ss = all('.ty-s').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: 6.4, pose: 'think' }, { t: 12.0, pose: 'writing' }, { t: 18.6, pose: 'cheer' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.qc, t, 0.8, 0.6, 24);
    UI.rise(kit, this.a, t, 12.0, 0.5, 20);
    this.ss.forEach((s, i) => { const a = TY_STEPS[i][0]; s.opacity = eo(seg(t, a, a + 0.5)); s.transform = 'translateX(' + lerp(20, 0, eo(seg(t, a, a + 0.6))).toFixed(1) + 'px)'; });
    this.f.opacity = eo(seg(t, 18.6, 19.1));
    this.ring(t);
    this.tutor.render(t);
  },
});
