const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A fictional sideways market: tops near 60,350, bottoms near 59,860 (BTC/USDT).
const HK_K = [[0, 60050], [0.1, 60340], [0.22, 59880], [0.36, 60360], [0.5, 59850], [0.64, 60330], [0.78, 59870], [0.92, 60230], [1, 60310]];
const hkP = (s) => UI.path(HK_K, s) + Math.sin(s * 97) * 14 * Math.sin(Math.PI * s * 7) ** 2;
const hkX = (s) => 200 + s * 1260, hkY = (p) => 740 - (p - 59700) / 800 * 410;
const HK_TOP = [0.1, 0.36, 0.64], HK_BOT = [0.22, 0.5, 0.78];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let marks = '';
    HK_TOP.forEach((s) => { marks += '<circle class="hk-m" cx="' + hkX(s).toFixed(1) + '" cy="' + hkY(hkP(s)).toFixed(1) + '" r="22" fill="none" stroke-width="4" style="stroke:var(--accent)"/>'; });
    HK_BOT.forEach((s) => { marks += '<circle class="hk-m" cx="' + hkX(s).toFixed(1) + '" cy="' + hkY(hkP(s)).toFixed(1) + '" r="22" fill="none" stroke-width="4" style="stroke:var(--main)"/>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="hk-grid">' + UI.grid(200, 1480, hkY, 59800, 60400, 100) + '</g>' +
      '<line class="hk-top" x1="200" x2="1480" y1="' + hkY(60350) + '" y2="' + hkY(60350) + '" stroke-width="3" stroke-dasharray="12 10" style="stroke:var(--accent)"/>' +
      '<line class="hk-bot" x1="200" x2="1480" y1="' + hkY(59865) + '" y2="' + hkY(59865) + '" stroke-width="3" stroke-dasharray="12 10" style="stroke:var(--main)"/>' +
      '<path class="hk-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="hk-dot" r="10" style="fill:var(--main)"/>' + marks + '</svg>' +
      '<p class="fict" style="position:absolute;left:200px;top:318px;margin:0">BTC/USDT · fictional · illustrative, not real market data</p>' +
      '<p class="tag hk-q" style="left:1300px;top:' + (hkY(60350) - 92).toFixed(0) + 'px;font-size:28px;color:var(--accent);border-color:var(--accent)">Push through?</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick hk-k">You marked swing points in T16</p>' +
      '<h2 class="line hk-t">Price keeps turning here</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.grid = q('.hk-grid').style; this.line = q('.hk-line'); this.dot = q('.hk-dot');
    this.top = q('.hk-top').style; this.bot = q('.hk-bot').style; this.marks = all('.hk-m').map((e) => e.style); this.q = q('.hk-q').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'explain' }, { t: 6.0, pose: 'magnify' }, { t: 11.0, pose: 'think' }],
      says: [{ t0: 11.4, t1: 15.9, text: 'Hmm, why here?' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.3, 0.9));
    const end = Math.max(0.002, lerp(0, 1, seg(t, 0.5, 6.0)));
    this.line.setAttribute('d', UI.line(hkP, 0, end, hkX, hkY, 0.004));
    this.dot.setAttribute('cx', hkX(end).toFixed(1)); this.dot.setAttribute('cy', hkY(hkP(end)).toFixed(1));
    this.marks.forEach((s, i) => { const a = 6.2 + (i % 3) * 0.35 + (i >= 3 ? 0.18 : 0), p = seg(t, a, a + 0.5); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = 'center'; s.transform = 'scale(' + lerp(1.8, 1, eob(p, 1.5)).toFixed(3) + ')'; });
    const ln = seg(t, 7.6, 8.6);
    [this.top, this.bot].forEach((s) => { s.opacity = eo(ln); s.strokeDashoffset = (-t * 18).toFixed(1); });
    const qq = seg(t, 11.2, 11.8);
    this.q.opacity = eo(qq); this.q.transform = 'translateY(' + lerp(20, 0, eo(qq)).toFixed(1) + 'px) scale(' + (1 + 0.03 * Math.sin(t * 4) * eo(qq)).toFixed(3) + ')';
    this.tutor.render(t);
  },
});
