const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const NB_PV = [59900, 60100, 59980, 60200, 60080, 60300, 60160, 60290, 60150, 60240, 60060, 60160, 59980];
const NB_X0 = 250, NB_DX = 60, nbY = (p) => 740 - (p - 59860) / 520 * 400;
// [pivot a, pivot b, at]
const NB_CMP = [[7, 9, 5.4], [8, 10, 9.4]];
kit.scene('numbers', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.sw = UI.swing(kit, 'nb-s', { pv: NB_PV, x0: NB_X0, dx: NB_DX, yOf: nbY, lab: [], t0: -2, t1: -1 });
    let marks = '';
    NB_CMP.forEach((c, k) => {
      const col = 'var(--down)';
      for (const i of c.slice(0, 2)) marks += '<circle class="nb-m' + k + '" cx="' + (NB_X0 + i * NB_DX) + '" cy="' + nbY(NB_PV[i]).toFixed(1) + '" r="13" style="fill:var(--ground);stroke:' + col + ';stroke-width:4"/>';
      const ya = nbY(NB_PV[c[0]]), yb = nbY(NB_PV[c[1]]);
      marks += '<line class="nb-l' + k + '" x1="' + (NB_X0 + c[0] * NB_DX) + '" x2="' + (NB_X0 + c[1] * NB_DX + 60) + '" y1="' + ya.toFixed(1) + '" y2="' + ya.toFixed(1) + '" stroke-width="2.5" stroke-dasharray="6 6" style="stroke:var(--second)"/>' +
        '<path class="nb-a' + k + '" d="M' + (NB_X0 + c[1] * NB_DX + 50) + ' ' + ya.toFixed(1) + ' V' + yb.toFixed(1) + '" pathLength="1" stroke-width="4" style="stroke:' + col + '"/>' +
        '<text class="nb-v' + k + ' mono" x="' + (NB_X0 + c[1] * NB_DX + 70) + '" y="' + ((ya + yb) / 2 + 9).toFixed(1) + '" style="fill:' + col + ';font-size:26px">−' + Math.abs(NB_PV[c[1]] - NB_PV[c[0]]) + '</text>';
    });
    const row = (k, lab, math, res) => '<div class="nb-r' + k + '" style="margin-bottom:18px"><p class="kick" style="margin:0 0 6px">' + lab + '</p><p class="mono" style="margin:0;font-size:32px">' + math + '</p><p style="margin:4px 0 0;font-size:28px;font-weight:700;color:var(--down)">' + res + '</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="nb-grid">' + UI.gridL(250, 1000, nbY, 59900, 60350, 50) + '</g>' + this.sw.html + marks + '</svg>' +
      '<div class="glass nb-card" style="left:1080px;top:320px;width:600px;padding:26px 34px">' +
      row(0, 'Peak vs last peak', '60,240 − 60,290 = −50', 'Lower high') + row(1, 'Dip vs last dip', '60,060 − 60,150 = −90', 'Lower low') +
      '<p class="chip nb-x" style="margin:4px 0 0;font-size:26px;padding:10px 22px;border-color:var(--accent)">Uptrend pattern: broken</p></div>' +
      '<p class="fict" style="position:absolute;left:250px;top:300px;margin:0">Same fictional path · prices in USDT</p>' +
      '<div class="words" style="left:140px;top:150px;width:1500px"><p class="kick nb-k">Worked example</p>' +
      '<h2 class="line nb-t">Check it with numbers</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.nb-k').style; this.t = q('.nb-t'); this.grid = q('.nb-grid').style; this.card = q('.nb-card').style; this.x = q('.nb-x').style;
    this.parts = [0, 1].map((k) => ({ m: all('.nb-m' + k).map((e) => e.style), l: q('.nb-l' + k).style, a: q('.nb-a' + k), v: q('.nb-v' + k).style, r: q('.nb-r' + k).style }));
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'checklist' }, { t: 5.4, pose: 'magnify' }, { t: 13.3, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    this.sw.render(t, eo(seg(t, 0.4, 1.2)));
    UI.rise(this.card, t, 1.4);
    NB_CMP.forEach((c, k) => {
      const a = c[2], P = this.parts[k];
      P.m.forEach((s, j) => { s.opacity = eo(seg(t, a + j * 0.4, a + j * 0.4 + 0.3)); });
      P.l.opacity = eo(seg(t, a + 0.6, a + 1.0));
      P.a.setAttribute('stroke-dasharray', eio(seg(t, a + 1.0, a + 1.6)) + ' 1');
      P.v.opacity = eo(seg(t, a + 1.5, a + 1.9));
      UI.rise(P.r, t, a + 0.2, { dy: 14 });
    });
    UI.rise(this.x, t, 13.4, { s: 0.9 });
    this.tutor.render(t);
  },
});
