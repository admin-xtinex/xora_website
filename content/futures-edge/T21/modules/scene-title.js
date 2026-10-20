const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Title art: one past line, then it forks into three possible futures; a NO_TRADE chip settles under the fork.
const TT_PAST = [[40, 300], [90, 270], [130, 285], [180, 240], [230, 255], [280, 215], [320, 228]];
const TT_F = [[[320, 228], [370, 190], [420, 160], [470, 120]], [[320, 228], [370, 236], [420, 222], [470, 232]], [[320, 228], [370, 262], [420, 300], [470, 338]]];
kit.scene('title', {
  init(kit) {
    const br = TT_F.map((p, i) => '<path class="tt-b" d="' + UI.d(p) + '" pathLength="1" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 1" style="stroke:' + ['var(--up)', 'var(--second)', 'var(--down)'][i] + '"/>' +
      '<text class="tt-q" x="' + (p[3][0] + 22) + '" y="' + (p[3][1] + 12) + '" style="font-size:34px;font-weight:700;fill:' + ['var(--up)', 'var(--second)', 'var(--down)'][i] + '">?</text>').join('');
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass tt-card" style="left:1180px;top:210px;width:560px;height:470px;padding:28px 36px"><p class="kick" style="margin:0">Same past · three futures</p>' +
      '<svg width="560" height="400" viewBox="0 0 560 400" style="position:absolute;left:0;top:50px">' +
      '<line x1="320" x2="320" y1="40" y2="360" stroke-dasharray="6 8" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 30%, transparent)"/>' +
      '<path class="tt-p" d="' + UI.d(TT_PAST) + '" pathLength="1" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1" style="stroke:var(--main)"/>' +
      br + '<circle class="tt-dot" cx="320" cy="228" r="10" style="fill:var(--main)"/></svg>' +
      '<span class="chip mono tt-w" style="position:absolute;left:36px;bottom:26px;font-size:28px;padding:8px 24px;background:var(--main);color:var(--ground);border-color:var(--main)">NO_TRADE</span>' +
      '<span class="tt-wl" style="position:absolute;left:250px;bottom:36px;font-size:26px;font-weight:600">is a decision too</span></div>' +
      '<div class="words" style="left:140px;top:230px;width:960px"><p class="kick title-k">Phase 5 · Scalping &amp; Risk Management</p>' +
      '<h1 class="line title-t" style="font-size:96px">Confirmation, False Signals and NO_TRADE</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T21 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.card = q('.tt-card').style; this.p = q('.tt-p'); this.b = all('.tt-b'); this.qs = all('.tt-q').map((e) => e.style); this.dot = q('.tt-dot').style;
    this.w = q('.tt-w').style; this.wl = q('.tt-wl').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'think' }],
      says: [{ t0: 3.0, t1: 7.4, text: 'Not so sure?' }],
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
    this.p.setAttribute('stroke-dasharray', eio(seg(t, 0.4, 1.8)).toFixed(3) + ' 1');
    this.dot.opacity = eo(seg(t, 1.7, 2.0));
    this.b.forEach((b, i) => { const a = 2.0 + i * 0.35; b.setAttribute('stroke-dasharray', eo(seg(t, a, a + 0.9)).toFixed(3) + ' 1'); b.style.opacity = t > a ? 1 : 0; this.qs[i].opacity = eo(seg(t, a + 0.8, a + 1.1)); });
    const w = seg(t, 4.2, 4.7);
    this.w.opacity = eo(w); this.w.transform = 'scale(' + lerp(0.6, 1, eob(w, 1.8)).toFixed(3) + ')'; this.wl.opacity = eo(seg(t, 4.6, 5.1));
    this.tutor.render(t);
  },
});
