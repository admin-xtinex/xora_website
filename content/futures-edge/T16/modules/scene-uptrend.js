const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Shared by the uptrend and downtrend scenes: pivots, labels, the two steps lines and the summary card.
const UP = { pv: [59900, 60100, 59980, 60200, 60080, 60300, 60180, 60360], lab: ['', 'H 60,100', 'HL 59,980', 'HH 60,200', 'HL 60,080', 'HH 60,300', 'HL 60,180', ''],
  rows: [['Peaks', '60,100 → 60,200 → 60,300', 4.2], ['Dips', '59,980 → 60,080 → 60,180', 9.2]], legend: 'HH = higher high · HL = higher low', col: 'var(--up)' };
const UP_X0 = 260, UP_DX = 160, upY = (p) => 740 - (p - 59860) / 540 * 410;
kit.scene('uptrend', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.sw = UI.swing(kit, 'up-s', { pv: UP.pv, x0: UP_X0, dx: UP_DX, yOf: upY, lab: UP.lab, t0: 1.0, t1: 13.0 });
    const pt = (i) => (UP_X0 + i * UP_DX) + ' ' + upY(UP.pv[i]).toFixed(1);
    let rows = '';
    UP.rows.forEach((r) => { rows += '<div class="up-r" style="display:flex;gap:24px;align-items:baseline"><span style="width:90px;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + r[0] + '</span><span class="mono" style="font-size:30px">' + r[1] + '</span><span style="font-size:30px;color:' + UP.col + '">▲</span></div>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="up-grid">' + UI.grid(220, 1420, upY, 59900, 60350, 50) + '</g>' +
      '<path class="up-hi" d="M' + pt(1) + ' L' + pt(3) + ' L' + pt(5) + '" pathLength="1" fill="none" stroke-width="3" stroke-dasharray="1 1" style="stroke:' + UP.col + '"/>' +
      '<path class="up-lo" d="M' + pt(2) + ' L' + pt(4) + ' L' + pt(6) + '" pathLength="1" fill="none" stroke-width="3" style="stroke:' + UP.col + '"/>' +
      this.sw.html + '</svg>' + this.sw.tags +
      '<div class="glass up-card" style="left:760px;top:176px;width:700px;padding:16px 30px;display:flex;flex-direction:column;gap:6px">' + rows + '</div>' +
      '<p class="chip up-leg" style="position:absolute;left:1480px;top:190px;margin:0;font-size:24px;padding:10px 20px;line-height:1.3;white-space:normal;width:240px;box-sizing:border-box">' + UP.legend.replace(' · ', '<br>') + '</p>' +
      '<div class="words" style="left:140px;top:170px;width:600px"><p class="kick up-k" style="color:' + UP.col + '">Higher highs, higher lows</p>' +
      '<h2 class="line up-t">Uptrend</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.up-k').style; this.t = q('.up-t'); this.grid = q('.up-grid').style; this.card = q('.up-card').style; this.rows = all('.up-r').map((e) => e.style);
    this.hi = q('.up-hi'); this.lo = q('.up-lo'); this.leg = q('.up-leg').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: 4.2, pose: 'point', flip: true }, { t: 14.6, pose: 'idea' }, { t: 19.8, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    UI.rise(this.card, t, 4.0);
    this.rows.forEach((s, i) => UI.rise(s, t, UP.rows[i][2], { dy: 14 }));
    this.sw.render(t);
    for (const [p, a] of [[this.hi, 14.8], [this.lo, 15.8]]) { p.setAttribute('stroke-dasharray', eio(seg(t, a, a + 1.2)) + ' 1'); p.style.opacity = t > a ? 0.85 : 0; }
    UI.rise(this.leg, t, 19.9, { s: 0.9 });
    this.tutor.render(t);
  },
});
