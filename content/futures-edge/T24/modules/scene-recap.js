const { seg, eo, lerp } = kit;
const RECAP = [['One engine, three modes: Demo, Live, Live Support. Start in Demo.', 0.6],
  ['Five tabs, one workflow: coins → Signals → setup → approve → XORA tab → Trades.', 5.5],
  ['Safety: a stop on every trade, a daily stop loss, withdrawals disabled on the API key.', 12.5]];
kit.scene('recap', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let items = '';
    RECAP.forEach((s) => {
      items += '<div class="rc-i" style="display:flex;align-items:center;gap:26px"><svg width="50" height="50" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>' +
        '<path class="rc-tick" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg><span style="font-size:34px;font-weight:600">' + s[0] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="words" style="left:140px;top:170px;width:1450px"><p class="kick rc-k">Recap</p><h2 class="line rc-t">Three things to remember</h2>' +
      '<div style="display:flex;flex-direction:column;gap:34px;margin-top:24px">' + items + '</div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.rc-k').style; this.t = q('.rc-t');
    this.items = [...kit.stage.querySelectorAll('.rc-i')].map((e) => e.style);
    this.ticks = [...kit.stage.querySelectorAll('.rc-tick')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'checklist' }, { t: 12.5, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    kit.TextFx.fadeFromRight(this.t, t, 0.1);
    this.items.forEach((s, i) => {
      const a = RECAP[i][1];
      s.opacity = eo(seg(t, a, a + 0.4));
      s.transform = 'translateX(' + lerp(26, 0, eo(seg(t, a, a + 0.5))) + 'px)';
      this.ticks[i].setAttribute('stroke-dasharray', eo(seg(t, a + 0.5, a + 0.9)) + ' 1');
    });
    this.tutor.render(t);
  },
});
