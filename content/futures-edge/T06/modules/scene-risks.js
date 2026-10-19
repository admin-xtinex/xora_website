const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RISKS = [
  ['Prices can jump', 'Price can jump past the exit you planned. Your real exit can be worse.', 3.0],
  ['Costs add up', 'Fees on every entry and exit, plus funding on futures. Small trades feel it most.', 8.8],
  ['Leverage magnifies', 'The same loss is a bigger share of a small margin. Liquidation can follow.', 15.2],
  ['Models, not promises', 'These sums are simple models, not predictions. NO TRADE is always allowed.', 21.9],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RISKS.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (340 + Math.floor(i / 2) * 218) + 'px;width:750px;min-height:196px;padding:24px 34px">' +
        '<p class="kick" style="margin:0 0 10px;color:var(--accent)">' + r[0] + '</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you go further</p>' +
      '<h2 class="line rk-t">Know the risks</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 8.8, pose: 'read' }, { t: 15.2, pose: 'magnify' }, { t: 21.9, pose: 'calm' }],
      says: [{ t0: 22.4, t1: 27.6, text: 'Learn first.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cards.forEach((c, i) => {
      const a = RISKS[i][2], p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.5).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)).toFixed(4) + ')';
    });
    this.tutor.render(t);
  },
});
