const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RISKS = [
  ['Simulation is not the market', 'Real fills can slip more than in a replay, and real money feels very different.', 1.0],
  ['Careful plans still lose', 'Losses are normal, even with a good process. Never trade money you can’t afford to lose.', 8.6],
  ['Leverage and liquidation', 'This plan used 1x. More leverage makes losses bigger and can lead to liquidation.', 14.6],
  ['Not advice', 'Fictional prices, for education only. NO_TRADE is always allowed.', 21.4],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RISKS.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (330 + Math.floor(i / 2) * 218) + 'px;width:750px;min-height:196px;padding:24px 34px">' +
        '<p class="kick" style="margin:0 0 10px;color:var(--accent)">' + r[0] + '</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you go further</p>' +
      '<h2 class="line rk-t">Honest limits</h2></div>' + cards + '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 8.4, pose: 'calm' }, { t: 14.4, pose: 'magnify' }, { t: 21.2, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    let cur = -1;
    RISKS.forEach((r, i) => { if (t >= r[2]) cur = i; });
    this.cards.forEach((c, i) => {
      const a = RISKS[i][2], p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.5).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)).toFixed(4) + ')';
      c.borderColor = i === cur ? 'color-mix(in srgb, var(--accent) 70%, transparent)' : 'color-mix(in srgb, var(--main) 22%, transparent)';
    });
    this.tutor.render(t);
  },
});
