const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RISKS = [
  ['Stops can slip', 'In a fast move or a gap, a stop can fill well past its trigger.', 5.1, 'var(--accent)'],
  ['Targets can be missed', 'A take-profit may never fill. Unrealized profit can disappear.', 7.6, 'var(--accent)'],
  ['Liquidation', 'In futures with leverage (T12), the exchange can force-close a losing position, even before a far-away stop.', 10.3, 'var(--accent)'],
  ['No clear stop? Wait.', 'If you cannot say where you are wrong, choose WAIT or NO_TRADE.', 18.3, 'var(--main)'],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RISKS.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (340 + Math.floor(i / 2) * 218) + 'px;width:750px;min-height:196px;padding:24px 34px' + (i === 3 ? ';border-color:var(--main)' : '') + '">' +
        '<p class="kick" style="margin:0 0 10px;color:' + r[3] + '">' + r[0] + '</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you rely on them</p>' +
      '<h2 class="line rk-t">Know the limits</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'think' }, { t: 10.3, pose: 'magnify' }, { t: 18.3, pose: 'calm' }],
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
