const { seg, eo, eob, lerp } = kit;
const RK = [
  ['A tool, not a guarantee', 'Setups can fail. Stops can slip in fast markets, so a loss can be bigger than planned.', 0.6],
  ['Real money in Live', 'In Live, losses come out of your real account, and leverage makes them bigger.', 8.0],
  ['Fees on every trade', 'Fees are paid on every trade, win or lose. Small trades feel them most.', 11.4],
  ['Demo first', 'XORA does not guarantee profits. This is not financial advice.', 15.1],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RK.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (300 + Math.floor(i / 2) * 230) + 'px;width:750px;min-height:206px;padding:24px 34px' + (i === 3 ? ';border-color:var(--main)' : '') + '">' +
        '<p class="kick" style="margin:0 0 10px;color:' + (i === 3 ? 'var(--main)' : 'var(--accent)') + '">' + r[0] + '</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div>' + cards + '</div>'));
    this.head = UI.head(kit, 'Before you switch anything on', 'Know the limits', { kc: 'var(--accent)' });
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 8.0, pose: 'magnify' }, { t: 15.1, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.cards.forEach((c, i) => {
      const a = RK[i][2], p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.5).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
    });
    this.tutor.render(t);
  },
});
