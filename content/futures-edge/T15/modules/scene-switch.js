const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SW_X0 = 220, SW_PPM = 80, swY = (p) => 720 - (p - 59900) / 290 * 370;
const SW_ST = [[0, 1], [10.4, 5], [14.8, 15]];
const SW_F = UI.pathFn();
kit.scene('switch', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'sw-c', 19);
    this.sw = UI.tfSwitch(kit, 'sw-sw', 1090, 196);
    let tl = '';
    for (let m = 0; m <= 15; m += 5) tl += '<text x="' + (SW_X0 + m * SW_PPM) + '" y="758" text-anchor="middle" class="axis">' + UI.hm(m) + '</text>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="sw-grid">' + UI.grid(SW_X0 - 20, SW_X0 + 15 * SW_PPM + 20, swY, 59950, 60150, 50) + tl + '</g>' + this.cd.html +
      '<path class="sw-path" fill="none" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle class="sw-dot" r="8" style="fill:var(--second)"/></svg>' +
      this.sw.html +
      '<p class="fict sw-f" style="position:absolute;left:220px;top:320px;margin:0">One fictional price path · 10:00 to 10:15</p>' +
      '<div class="words" style="left:140px;top:170px;width:940px"><p class="kick sw-k">Switch the view</p>' +
      '<h2 class="line sw-t">The path stays put</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sw-k').style; this.t = q('.sw-t'); this.grid = q('.sw-grid').style; this.f = q('.sw-f').style; this.swst = q('.sw-sw').style;
    this.path = q('.sw-path'); this.dot = q('.sw-dot');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.5, pose: 'present' }, { t: 5.5, pose: 'point', flip: true }, { t: 14.7, pose: 'candles', flip: true }, { t: 19.1, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0)); this.f.opacity = 0.9 * eo(seg(t, 0.6, 1.0));
    UI.rise(this.swst, t, 5.0, { s: 0.9 });
    // The raw path draws once and never changes.
    const end = 15 * eio(seg(t, 0.8, 4.6));
    let d = '';
    for (let m = 0; m <= end + 1e-6; m += 0.05) d += (m ? 'L' : 'M') + (SW_X0 + m * SW_PPM).toFixed(1) + ' ' + swY(SW_F(m)).toFixed(1);
    this.path.setAttribute('d', d || 'M0 0');
    const glow = Math.sin(Math.PI * seg(t, 19.2, 21.4));
    this.path.style.stroke = 'color-mix(in srgb, var(--main) ' + (40 + 60 * glow).toFixed(0) + '%, var(--second))';
    this.path.style.opacity = t < 0.8 ? 0 : (0.85 - 0.35 * eo(seg(t, 5.6, 6.4)) + 0.5 * glow).toFixed(3);
    this.path.setAttribute('stroke-width', (3 + 2 * glow).toFixed(1));
    this.dot.setAttribute('cx', (SW_X0 + end * SW_PPM).toFixed(1)); this.dot.setAttribute('cy', swY(SW_F(end)).toFixed(1));
    this.dot.style.opacity = t > 0.8 ? 1 - eo(seg(t, 4.8, 5.4)) : 0;
    const st = UI.tfState(SW_ST, t);
    UI.tfAll(this.cd, st, SW_X0, SW_PPM, swY, eo(seg(t, 5.6, 6.4)));
    this.sw.set(t < 5.6 ? 0 : st.n);
    this.tutor.render(t);
  },
});
