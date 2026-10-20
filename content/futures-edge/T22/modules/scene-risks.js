const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RK = [
  ['Slippage and fees', 'Stops can fill worse than planned, and fees add to the loss.', 3.6],
  ['Liquidation', 'With high leverage, liquidation can come before your stop.', 10.0],
  ['Exchange rules', 'Minimum sizes and size steps can rule out an exact size.', 12.8],
  ['Examples only', 'No recommended percentages here. NO_TRADE is always allowed.', 17.0],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RK.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 830) + 'px;top:' + (310 + Math.floor(i / 2) * 226) + 'px;width:800px;min-height:200px;padding:24px 34px' + (i === 3 ? ';border-color:var(--main)' : '') + '">' +
        '<p class="kick" style="margin:0 0 10px;color:' + (i === 3 ? 'var(--main)' : 'var(--accent)') + '">' + r[0] + '</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Know the limits</p>' +
      '<h2 class="line rk-t" style="font-size:72px">What this maths leaves out</h2></div>' + cards + '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.8, pose: 'think' }, { t: 10.0, pose: 'explain' }, { t: 12.8, pose: 'magnify' }, { t: 17.0, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cards.forEach((c, i) => {
      const a = RK[i][2], p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.5).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
      if (i < 3) c.borderColor = 'color-mix(in srgb, var(--accent) ' + (22 + 50 * Math.sin(Math.PI * seg(t, a, a + 1.4))).toFixed(0) + '%, transparent)';
    });
    this.tutor.render(t);
  },
});
