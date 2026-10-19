const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RK = [
  ['Liquidation', 'It can take most or all of your margin, at a price and moment you did not choose.', 4.5],
  ['Funding', 'Paid or charged every funding period. The rate changes and can be high.', 10.5],
  ['Gaps and slippage', 'Exits, stops and liquidations can fill worse than planned in fast markets.', 15.9],
  ['No guaranteed safety', 'No strategy is safe for sure. When unsure, reduce exposure or choose NO_TRADE.', 20.2],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RK.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 830) + 'px;top:' + (330 + Math.floor(i / 2) * 218) + 'px;width:800px;min-height:196px;padding:24px 34px">' +
        '<p class="kick" style="margin:0 0 10px;color:var(--accent)">' + r[0] + '</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you go further</p>' +
      '<h2 class="line rk-t">Futures risks</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 10.5, pose: 'magnify' }, { t: 15.9, pose: 'explain' }, { t: 20.2, pose: 'calm' }],
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
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.6).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
      c.borderColor = 'color-mix(in srgb, var(--accent) ' + (22 + 50 * Math.sin(Math.PI * seg(t, a, a + 1.4))).toFixed(0) + '%, transparent)';
    });
    this.tutor.render(t);
  },
});
