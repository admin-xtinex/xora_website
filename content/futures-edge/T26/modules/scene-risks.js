const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RISKS = [
  ['No guaranteed profit', 'XORA does not guarantee profits. Its checks can be wrong, and losing trades happen.', 4.4],
  ['Fast markets', 'Price can jump past a stop. Orders can slip, and fees add up on every trade.', 10.4],
  ['Leverage', 'Leverage makes gains and losses bigger. A small move can cost a lot.', 12.6],
  ['Demo first', 'Practise in DEMO. Go live only with money you can afford to lose.', 16.2],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RISKS.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (340 + Math.floor(i / 2) * 212) + 'px;width:750px;min-height:196px;padding:24px 34px">' +
        '<p class="kick" style="margin:0 0 10px;color:var(--accent)">' + r[0] + '</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you rely on any decision</p>' +
      '<h2 class="line rk-t">Know the limits</h2></div>' + cards +
      '<p class="risk-line rk-l" style="position:absolute;left:140px;top:762px;margin:0">XORA does not guarantee profits · Demo first · Not financial advice</p>' +
      '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t'); this.l = kit.stage.querySelector('.rk-l').style;
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 10.4, pose: 'magnify' }, { t: 16.2, pose: 'calm' }],
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
    this.l.opacity = eo(seg(t, 17.6, 18.2));
    this.tutor.render(t);
  },
});
