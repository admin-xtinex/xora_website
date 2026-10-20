const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RK = [
  ['History, not a promise', 'Zones come from past prices. They promise nothing about what price does next.', 4.6],
  ['Fakeouts are common', 'Price often pokes through a zone and falls back. Stops just beyond obvious zones can be hit, and can slip.', 10.0],
  ['Thin markets distort', 'With few orders waiting, one trade can push price through a zone for a moment.', 12.4],
  ['WAIT is a decision', 'Losses are always possible, in demo or real trading. Choosing not to trade is allowed.', 16.0],
];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    RK.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (320 + Math.floor(i / 2) * 222) + 'px;width:750px;min-height:200px;padding:24px 34px' + (i === 3 ? ';border-color:color-mix(in srgb, var(--main) 60%, transparent)' : '') + '">' +
        '<p class="kick" style="margin:0 0 10px;color:' + (i === 3 ? 'var(--main)' : 'var(--accent)') + '">' + r[0] + '</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:160px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you use this</p>' +
      '<h2 class="line rk-t">Know the limits</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.rk-k').style; this.t = kit.stage.querySelector('.rk-t');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.8, pose: 'think' }, { t: 9.8, pose: 'magnify' }, { t: 15.8, pose: 'explain' }],
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
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.5).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
    });
    this.tutor.render(t);
  },
});
