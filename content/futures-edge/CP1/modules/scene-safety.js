const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SAFE = [
  ['Not a bank', 'An exchange is not a bank. Your balance there has no bank-style guarantee.', 4.6],
  ['Guard your codes', 'Never share passwords, OTPs or API secret keys. Not even with "support".', 10.4],
  ['Pegs can slip', 'USDT aims to track 1 US dollar. That peg is not guaranteed.', 17.6],
  ['Waiting is allowed', 'Prices swing fast. You can always choose WAIT and make no trade.', 22.7],
];
kit.scene('safety', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    SAFE.forEach((r, i) => {
      cards += '<div class="glass sf-c" style="left:' + (140 + (i % 2) * 780) + 'px;top:' + (340 + Math.floor(i / 2) * 218) + 'px;width:750px;min-height:196px;padding:24px 34px">' +
        '<p class="kick" style="margin:0 0 10px;color:var(--accent)">' + r[0] + '</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1400px"><p class="kick sf-k" style="color:var(--accent)">Critical safety</p>' +
      '<h2 class="line sf-t">Four things to never forget</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.sf-k').style; this.t = kit.stage.querySelector('.sf-t');
    this.cards = [...kit.stage.querySelectorAll('.sf-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 1.0, pose: 'think' }, { t: 10.4, pose: 'magnify' }, { t: 17.6, pose: 'explain' }, { t: 22.7, pose: 'calm' }],
      says: [{ t0: 23.2, t1: 28.4, text: 'Waiting is OK.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    let cur = -1;
    SAFE.forEach((r, i) => { if (t >= r[2]) cur = i; });
    this.cards.forEach((c, i) => {
      const a = SAFE[i][2], p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.5).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)).toFixed(4) + ')';
      c.borderColor = i === cur ? 'color-mix(in srgb, var(--accent) 70%, transparent)' : 'color-mix(in srgb, var(--main) 22%, transparent)';
    });
    this.tutor.render(t);
  },
});
