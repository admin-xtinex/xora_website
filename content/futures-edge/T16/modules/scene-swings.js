const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SW_PV = [60000, 60220, 60060, 60270];
const SW_X0 = 980, SW_DX = 220, swY = (p) => 700 - (p - 59960) / 360 * 320;
kit.scene('swings', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.sw = UI.swing(kit, 'sg-s', { pv: SW_PV, x0: SW_X0, dx: SW_DX, yOf: swY, lab: ['', 'Swing high', 'Swing low', ''], t0: 0.8, t1: 8.0, wig: 4 });
    let road = 'M' + SW_X0 + ' 740';
    for (let u = 0; u <= 3.001; u += 0.05) road += ' L' + (SW_X0 + u * SW_DX).toFixed(1) + ' ' + swY(this.sw.f(u)).toFixed(1);
    road += ' L' + (SW_X0 + 3 * SW_DX) + ' 740 Z';
    const end = [SW_X0 + 3 * SW_DX, swY(SW_PV[3])];
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><path class="sg-road" d="' + road + '" style="fill:color-mix(in srgb, var(--main) 10%, transparent)"/>' + this.sw.html +
      '<circle class="sg-end" cx="' + end[0] + '" cy="' + end[1].toFixed(1) + '" r="20" fill="none" stroke-width="3" stroke-dasharray="6 6" style="stroke:var(--accent)"/></svg>' + this.sw.tags +
      '<p class="kick sg-hill" style="position:absolute;left:' + (SW_X0 + SW_DX) + 'px;top:' + (swY(SW_PV[1]) - 110).toFixed(1) + 'px;margin:0;transform:translateX(-50%);color:var(--second)">Hilltop</p>' +
      '<p class="kick sg-val" style="position:absolute;left:' + (SW_X0 + 2 * SW_DX) + 'px;top:' + (swY(SW_PV[2]) + 70).toFixed(1) + 'px;margin:0;transform:translateX(-50%);color:var(--second)">Valley</p>' +
      '<p class="tag sg-q" style="left:' + (end[0] - 20) + 'px;top:' + (end[1] - 70).toFixed(1) + 'px;transform:translateX(-50%);border-style:dashed;border-color:var(--accent);color:var(--accent)">Peak? Not yet</p>' +
      '<div class="words" style="left:140px;top:170px;width:760px"><p class="kick sg-k">Swings</p>' +
      '<h2 class="line sg-t">Peaks and dips</h2>' +
      '<p class="def sg-d1" style="margin-top:10px">A <b>swing high</b> is a peak: price rose, then turned down.</p>' +
      '<p class="def sg-d2">A <b>swing low</b> is a dip: price fell, then turned up.</p></div>' +
      '<p class="fict" style="position:absolute;left:980px;top:300px;margin:0">BTC price path · fictional</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sg-k').style; this.t = q('.sg-t'); this.d1 = q('.sg-d1'); this.d2 = q('.sg-d2');
    this.road = q('.sg-road').style; this.hill = q('.sg-hill').style; this.val = q('.sg-val').style; this.end = q('.sg-end').style; this.q = q('.sg-q').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'explain' }, { t: 8.9, pose: 'idea' }, { t: 14.8, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d1, t, 0.6, { stagger: 0.06 });
    TextFx.fadeFromRight(this.d2, t, 4.9, { stagger: 0.06 });
    this.sw.render(t);
    this.road.opacity = eo(seg(t, 9.0, 9.8));
    UI.rise(this.hill, t, 9.6, { s: 1 }); this.hill.transform += ' translateX(-50%)';
    UI.rise(this.val, t, 11.4, { s: 1 }); this.val.transform += ' translateX(-50%)';
    const e = seg(t, 15.0, 15.5);
    this.end.opacity = eo(e) * (0.7 + 0.3 * Math.sin(t * 5)); this.q.opacity = eo(e);
    this.tutor.render(t);
  },
});
