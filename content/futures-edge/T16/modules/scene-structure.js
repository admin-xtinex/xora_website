const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const ST_PV = [59900, 60100, 59980, 60200, 60080, 60300, 60160, 60290, 60150, 60240, 60060, 60160, 59980];
const ST_LAB = ['', 'H', 'HL', 'HH', 'HL', 'HH', 'HL', 'not higher', 'about even', 'LH', 'LL', 'LH', ''];
const ST_X0 = 240, ST_DX = 95, stY = (p) => 740 - (p - 59860) / 520 * 400, ST_T0 = 1.0, ST_T1 = 25.0;
// Phases: [from pivot, to pivot, label, colour, shown at]
const ST_PH = [[0, 6, 'Uptrend', 'var(--up)', 8.6], [6, 8, 'Sideways', 'var(--main)', 16.9], [8, 12, 'Downtrend', 'var(--down)', 22.9]];
kit.scene('structure', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.sw = UI.swing(kit, 'st-s', { pv: ST_PV, x0: ST_X0, dx: ST_DX, yOf: stY, lab: ST_LAB, t0: ST_T0, t1: ST_T1, fs: 22 });
    let bands = '';
    ST_PH.forEach((p) => {
      const x = ST_X0 + p[0] * ST_DX, w = (p[1] - p[0]) * ST_DX;
      bands += '<g class="st-b"><rect x="' + x + '" y="330" width="' + w + '" height="420" style="fill:color-mix(in srgb, ' + p[3] + ' 8%, transparent)"/><line x1="' + x + '" x2="' + (x + w) + '" y1="330" y2="330" stroke-width="5" style="stroke:' + p[3] + '"/>' +
        '<text x="' + (x + w / 2) + '" y="318" text-anchor="middle" class="kick" style="fill:' + p[3] + ';font-size:22px">' + p[2] + '</text></g>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + bands + '<g class="st-grid">' + UI.grid(220, 1400, stY, 59900, 60350, 50) + '</g>' + this.sw.html + '</svg>' + this.sw.tags +
      '<div class="words" style="left:140px;top:150px;width:1500px"><p class="kick st-k">Market structure</p>' +
      '<h2 class="line st-t">Structure can change</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.st-k').style; this.t = q('.st-t'); this.grid = q('.st-grid').style; this.bands = [...kit.stage.querySelectorAll('.st-b')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.5, pose: 'candles', flip: true }, { t: 9.0, pose: 'explain' }, { t: 15.0, pose: 'think' }, { t: 19.8, pose: 'magnify' }, { t: 24.8, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    this.sw.render(t);
    this.bands.forEach((s, i) => { s.opacity = eo(seg(t, ST_PH[i][4], ST_PH[i][4] + 0.6)); });
    this.tutor.render(t);
  },
});
