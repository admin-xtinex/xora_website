const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RISKS = [
  ['Short means noisy', '1-minute candles jump around. Much of that is noise.', 4.0],
  ['More candles, not more chances', 'A faster chart shows more candles, not more good trades.', 6.8],
  ['Costs add up', 'Trading every small move piles up fees, spread and mistakes.', 9.8],
  ['No crystal ball', 'No timeframe predicts the future. WAIT and NO_TRADE are always allowed.', 14.1],
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
      '<h2 class="line rk-t">What timeframes cannot do</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 9.6, pose: 'magnify' }, { t: 13.9, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cards.forEach((c, i) => {
      const a = RISKS[i][2], p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.6).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
    });
    this.tutor.render(t);
  },
});
