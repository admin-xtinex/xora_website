const { seg, eo, eob, eio, lerp, TextFx } = kit;
const RISK_CARDS = [['10×', 'Leverage makes losses bigger, not only gains.'], ['− fees', 'Fees and slippage can turn a small win into a loss.'], ['?', 'Signals can be wrong. Nothing here is guaranteed.']];
const RISK_PICKS = ['BUY', 'SELL', 'WAIT'];
kit.scene('risk', {
  init(kit) {
    let cards = '', picks = '';
    RISK_CARDS.forEach((c, i) => {
      cards += '<div class="glass risk-card" style="left:' + (140 + i * 565) + 'px;top:380px;width:510px;height:270px;padding:36px 40px;display:flex;flex-direction:column;gap:18px">' +
        '<span class="mono" style="font-size:56px;font-weight:500;color:var(--accent)">' + c[0] + '</span><p style="margin:0;font-size:32px;line-height:1.4;font-weight:600">' + c[1] + '</p></div>';
    });
    RISK_PICKS.forEach((p) => { picks += '<span class="mono risk-pick" style="padding:20px 46px;border-radius:999px;font-size:34px;font-weight:500;letter-spacing:.12em">' + p + '</span>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1500px"><p class="kick risk-k">Risk stays in view</p><h2 class="line risk-t" style="font-size:84px">Futures can lose money quickly.</h2></div>' + cards +
      '<div class="risk-row" style="position:absolute;left:140px;top:740px;display:flex;gap:22px;align-items:center">' + picks + '</div>' +
      '<div class="words" style="left:140px;top:860px;width:1000px"><p class="sub risk-s" style="color:var(--second)">Not sure? WAIT is always a valid choice.</p></div>' +
      '</div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = kit.stage.querySelector('.risk-k').style; this.title = kit.stage.querySelector('.risk-t');
    this.cards = all('.risk-card').map((e) => e.style); this.picks = all('.risk-pick').map((e) => e.style);
    this.s = kit.stage.querySelector('.risk-s');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idle' }, { t: 1.2, pose: 'think' }, { t: 8.8, pose: 'calm' }],
      says: [{ t0: 10.0, t1: 13.7, text: 'Waiting is a decision too.' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.title, t, 0.1);
    this.cards.forEach((c, i) => {
      const a = 1.5 + i * 1.6;
      const p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 1.2).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
    });
    const pick = seg(t, 8.6, 9.0);
    this.picks.forEach((p, i) => {
      const a = 6.8 + i * 0.3;
      p.opacity = eo(seg(t, a, a + 0.35)) * (i < 2 ? lerp(1, 0.45, eo(pick)) : 1);
      p.transform = 'translateY(' + lerp(20, 0, eo(seg(t, a, a + 0.5))) + 'px) scale(' + (i === 2 ? 1 + 0.1 * eob(pick, 1.8) - 0.04 * eo(seg(t, 9.0, 9.4)) : 1) + ')';
      const on = i === 2 && t >= 8.8;
      p.background = on ? 'var(--main)' : 'color-mix(in srgb, var(--second) 8%, transparent)';
      p.color = on ? 'var(--ground)' : 'var(--second)';
      p.border = '2px solid ' + (on ? 'var(--main)' : 'color-mix(in srgb, var(--second) 25%, transparent)');
    });
    TextFx.fadeFromRight(this.s, t, 9.3, { stagger: 0.08 });
    this.tutor.render(t);
  },
});
