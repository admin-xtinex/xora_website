const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Title art: a risk meter fills toward a budget line and stops on it; the formula settles underneath.
kit.scene('title', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass tt-card" style="left:1180px;top:220px;width:560px;padding:30px 36px"><p class="kick" style="margin:0 0 18px">Risk first, then size</p>' +
      '<div style="display:flex;justify-content:space-between;font-size:26px;margin-bottom:10px"><span>Loss at stop</span><span class="mono tt-v">0.0 USDT</span></div>' +
      '<div style="position:relative">' + UI.bar('tt-b', 488, 34) + '<div style="position:absolute;left:390px;top:-12px;bottom:-12px;width:4px;border-radius:2px;background:var(--accent)"></div></div>' +
      '<p class="mono" style="margin:12px 0 0;text-align:right;padding-right:70px;font-size:22px;color:var(--accent)">budget · example</p>' +
      '<p class="mono tt-f" style="margin:22px 0 0;font-size:24px;line-height:1.5">allowed notional ≈<br>risk ÷ (|entry − stop| ÷ entry)</p></div>' +
      '<div class="words" style="left:140px;top:250px;width:960px"><p class="kick title-k">Phase 5 · Scalping &amp; Risk Management</p>' +
      '<h1 class="line title-t" style="font-size:104px">Position Sizing and Risk Budget</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T22 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice · Examples, not recommendations</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.card = q('.tt-card').style; this.b = q('.tt-b-f').style; this.v = q('.tt-v'); this.f = q('.tt-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'point' }],
      says: [{ t0: 3.0, t1: 7.4, text: 'Risk first!' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    const c = seg(t, -0.4, 0.6);
    this.card.opacity = eo(c); this.card.transform = 'translateY(' + lerp(30, 0, eo(c)).toFixed(1) + 'px) scale(' + lerp(0.95, 1, eob(c, 1.6)).toFixed(4) + ')';
    const p = eio(seg(t, 1.0, 3.6)), v = 10 * p;
    this.b.width = (p * 392 / 488 * 100).toFixed(2) + '%';
    UI.set(this.v, v.toFixed(1) + ' USDT');
    UI.rise(kit, this.f, t, 3.8, 0.6, 14);
    this.tutor.render(t);
  },
});
