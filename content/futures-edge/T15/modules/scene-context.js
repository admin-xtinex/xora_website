const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const CX_ROWS = [[15, 330, '15m'], [5, 480, '5m'], [1, 630, '1m']];
const CX_X0 = 930, CX_PPM = 46;
// Map frames: [x, y, w, h, label] for city, area, street.
const CX_F = [[160, 380, 520, 350, 'City'], [320, 460, 260, 180, 'Area'], [420, 515, 80, 60, 'Street']];
kit.scene('context', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'cx-c', 19);
    let map = '';
    for (let x = 190; x < 690; x += 60) map += '<line x1="' + x + '" x2="' + x + '" y1="350" y2="730" stroke-width="' + (x % 180 === 10 ? 6 : 2) + '" style="stroke:color-mix(in srgb, var(--second) 16%, transparent)"/>';
    for (let y = 380; y < 740; y += 50) map += '<line x1="160" x2="680" y1="' + y + '" y2="' + y + '" stroke-width="' + (y % 150 === 80 ? 6 : 2) + '" style="stroke:color-mix(in srgb, var(--second) 16%, transparent)"/>';
    let rows = '';
    CX_ROWS.forEach((r) => {
      rows += '<rect class="cx-row" x="800" y="' + (r[1] - 8) + '" width="860" height="138" rx="18" stroke-width="2" style="fill:color-mix(in srgb, var(--ground) 86%, var(--main))"/>' +
        '<text x="830" y="' + (r[1] + 74) + '" class="mono" style="fill:var(--main);font-size:32px">' + r[2] + '</text>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass" style="left:140px;top:330px;width:560px;height:420px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + map +
      '<circle cx="460" cy="545" r="9" style="fill:var(--accent)"/>' +
      CX_F.map((f, i) => '<g class="cx-fr"><rect x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="' + f[3] + '" rx="14" fill="none" stroke-width="4" style="stroke:var(--main)"/>' +
        '<text x="' + (f[0] + 12) + '" y="' + (f[1] - 12) + '" style="fill:var(--main);font-size:24px;font-weight:700">' + f[4] + '</text></g>').join('') +
      rows + this.cd.html + '</svg>' +
      '<p class="chip cx-w" style="position:absolute;left:1010px;top:248px;margin:0;font-size:26px;padding:12px 24px;border-color:var(--accent)">Views disagree? Be careful, or WAIT.</p>' +
      '<div class="words" style="left:140px;top:170px;width:700px"><p class="kick cx-k">Higher-timeframe context</p>' +
      '<h2 class="line cx-t">Big picture first</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.cx-k').style; this.t = q('.cx-t'); this.fr = all('.cx-fr').map((e) => e.style); this.rows = all('.cx-row'); this.w = q('.cx-w').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'explain' }, { t: 5.2, pose: 'magnify' }, { t: 10.7, pose: 'point', flip: true }, { t: 15.4, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    // Map: city, then zoom in to the area and the street.
    this.fr.forEach((s, i) => {
      const a = [5.4, 7.0, 8.6][i], p = seg(t, a, a + 0.6);
      s.opacity = eo(p) * (i < 2 ? 1 - 0.6 * eo(seg(t, a + 1.6, a + 2.0)) : 1);
      s.transformBox = 'fill-box'; s.transformOrigin = 'center'; s.transform = 'scale(' + lerp(1.25, 1, eo(p)).toFixed(3) + ')';
    });
    // Panels, top to bottom: big picture, then detail.
    let idx = 0;
    CX_ROWS.forEach((r, k) => {
      const a = 1.0 + k * 0.5, yOf = (v) => r[1] + 120 - (v - 59900) / 290 * 110;
      UI.tfDraw(this.cd, idx, r[0], CX_X0, CX_PPM, yOf, { op: eo(seg(t, a, a + 0.5)), wk: r[0] === 1 ? 0.6 : 0.6 });
      idx += 15 / r[0];
      const hot = Math.max(0, Math.sin(Math.PI * seg(t, 10.8 + k * 1.3, 12.8 + k * 1.3)));
      this.rows[k].style.opacity = eo(seg(t, a, a + 0.4));
      this.rows[k].style.stroke = 'color-mix(in srgb, var(--main) ' + (20 + 70 * hot).toFixed(0) + '%, transparent)';
    });
    UI.rise(this.w, t, 15.6, { s: 0.9 });
    this.tutor.render(t);
  },
});
