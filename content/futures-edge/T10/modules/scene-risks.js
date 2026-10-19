const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RISKS = [
  ['Check the address', 'A look-alike website can steal your login.', '<span class="hl">exchange.example</span> ✓ &nbsp; <span class="hv">exchange-login.example</span> ✗'],
  ['Spot or futures?', 'Check which market you are in before any order. Futures carry extra risks.', ''],
  ['Do not explore on a real account', 'A tap can place a real order with real money. Practise on mocks.', ''],
  ['WAIT is always a choice', 'Not sure? Do not trade. NO_TRADE is a valid decision.', ''],
];
const RK_AT = [4.2, 9.4, 14.5, 20.2];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RISKS.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (340 + Math.floor(i / 2) * 218) + 'px;width:750px;min-height:196px;padding:24px 34px">' +
        '<p class="kick" style="margin:0 0 10px;color:' + (i === 3 ? 'var(--main)' : 'var(--accent)') + '">' + r[0] + '</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">' + r[1] + '</p>' +
        (r[2] ? '<p class="mono rk-u" style="margin:10px 0 0;font-size:24px">' + r[2] + '</p>' : '') + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you open a real app</p>' +
      '<h2 class="line rk-t">Stay safe</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    this.u = kit.stage.querySelector('.rk-u').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 4.2, pose: 'magnify' }, { t: 14.3, pose: 'calm' }, { t: 20.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cards.forEach((c, i) => {
      const a = RK_AT[i], p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.5).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
    });
    this.u.opacity = eo(seg(t, 6.0, 6.5)).toFixed(3);
    this.tutor.render(t);
  },
});
