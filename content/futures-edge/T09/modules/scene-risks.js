const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RISKS = [
  ['A model, not a quote', 'This lesson used simple example numbers. Real trades have more moving parts.', 0.8],
  ['Check your real rates', 'Fees depend on the exchange, the product and your account tier. Check before you act.', 5.2],
  ['Full position value', 'Fees are charged on the whole position value, not just the money you put in.', 11.6],
  ['Fast markets cost more', 'Spreads widen and slippage grows when prices move fast.', 17.8],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RISKS.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (340 + Math.floor(i / 2) * 218) + 'px;width:750px;min-height:196px;padding:24px 34px">' +
        '<p class="kick" style="margin:0 0 10px;color:var(--accent)">' + r[0] + '</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you act</p>' +
      '<h2 class="line rk-t">Know the limits</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'explain' }, { t: 5.1, pose: 'magnify' }, { t: 11.5, pose: 'think' }, { t: 17.7, pose: 'explain' }],
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
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.8).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
    });
    this.tutor.render(t);
  },
});
