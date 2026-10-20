const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SAFE = [
  ['Leverage and liquidation', 'Leverage magnifies losses. No leverage is safe, and liquidation can take your margin.', 4.1],
  ['Stops have limits', 'A stop-loss is a trigger, not a promise. Gaps and slippage happen.', 10.6],
  ['Guard your account', 'Never share passwords, OTP or 2FA codes, or API secret keys. Not even with “support”.', 15.9],
  ['Size first, NO_TRADE allowed', 'Size from your risk budget first. When signals are unclear, NO_TRADE is a real decision.', 22.4],
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
      '<h2 class="line sf-t">Before you finish</h2></div>' + cards +
      '</div>'));
    this.k = kit.stage.querySelector('.sf-k').style; this.t = kit.stage.querySelector('.sf-t');
    this.cards = [...kit.stage.querySelectorAll('.sf-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 1.0, pose: 'think' }, { t: 10.6, pose: 'magnify' }, { t: 15.9, pose: 'explain' }, { t: 22.4, pose: 'calm' }],
      says: [],
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
