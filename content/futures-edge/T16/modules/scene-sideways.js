const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SD_PV = [60000, 60200, 60010, 60190, 59990, 60210, 60005, 60100];
const SD_X0 = 260, SD_DX = 160, sdY = (p) => 720 - (p - 59900) / 400 * 360;
kit.scene('sideways', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.sw = UI.swing(kit, 'sd-s', { pv: SD_PV, x0: SD_X0, dx: SD_DX, yOf: sdY, lab: ['', '60,200', '60,010', '60,190', '59,990', '60,210', '60,005', ''], t0: 1.0, t1: 10.0 });
    const yt = sdY(60215), yb = sdY(59985);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="sd-grid">' + UI.grid(220, 1420, sdY, 59950, 60250, 50) + '</g>' +
      '<rect class="sd-band" x="' + SD_X0 + '" y="' + yt.toFixed(1) + '" width="' + (7 * SD_DX) + '" height="' + (yb - yt).toFixed(1) + '" style="fill:color-mix(in srgb, var(--main) 10%, transparent)"/>' +
      '<line class="sd-l" x1="' + SD_X0 + '" x2="' + (SD_X0 + 7 * SD_DX) + '" y1="' + yt.toFixed(1) + '" y2="' + yt.toFixed(1) + '" stroke-width="2.5" stroke-dasharray="8 6" style="stroke:var(--main)"/>' +
      '<line class="sd-l" x1="' + SD_X0 + '" x2="' + (SD_X0 + 7 * SD_DX) + '" y1="' + yb.toFixed(1) + '" y2="' + yb.toFixed(1) + '" stroke-width="2.5" stroke-dasharray="8 6" style="stroke:var(--main)"/>' +
      this.sw.html + '</svg>' + this.sw.tags +
      '<p class="chip sd-r" style="position:absolute;left:260px;top:' + (yt - 64).toFixed(1) + 'px;margin:0;font-size:26px;padding:10px 22px">Range</p>' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick sd-k">Neither up nor down</p>' +
      '<h2 class="line sd-t">Sideways</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.sd-k').style; this.t = q('.sd-t'); this.grid = q('.sd-grid').style; this.band = q('.sd-band').style; this.ls = all('.sd-l'); this.r = q('.sd-r').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.5, pose: 'explain' }, { t: 5.9, pose: 'point', flip: true }, { t: 11.2, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    this.sw.render(t);
    const b = seg(t, 10.2, 11.0);
    this.band.opacity = eo(b);
    this.ls.forEach((l, i) => { l.style.opacity = eo(seg(t, 6.0 + i * 0.6, 6.6 + i * 0.6)); });
    UI.rise(this.r, t, 11.2, { s: 0.9 });
    this.tutor.render(t);
  },
});
