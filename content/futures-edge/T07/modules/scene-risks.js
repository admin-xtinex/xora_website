const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RISKS = [
  ['Slippage', 'Market orders can fill worse than expected, most of all in fast moves or a thin book.', 4.7],
  ['No fill, or part fill', 'Limit orders may fill only in part, or never. Your plan must allow for that.', 10.8],
  ['Stops can slip', 'A stop can fill well past its trigger when price gaps.', 15.0],
  ['You can wait', 'No order is also a decision. WAIT and NO_TRADE are always allowed.', 17.6],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RISKS.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (340 + Math.floor(i / 2) * 218) + 'px;width:750px;min-height:196px;padding:24px 34px' + (i === 3 ? ';border-color:var(--main)' : '') + '">' +
        '<p class="kick" style="margin:0 0 10px;color:' + (i === 3 ? 'var(--main)' : 'var(--accent)') + '">' + r[0] + '</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you place any order</p>' +
      '<h2 class="line rk-t">Know what can go wrong</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 10.8, pose: 'magnify' }, { t: 17.6, pose: 'calm' }],
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
