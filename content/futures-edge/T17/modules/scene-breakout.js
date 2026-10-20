const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Breakout branch: close 60,480 above the 60,300–60,400 zone, then a retest (low 60,390) that holds.
const BO = UI.SR, BO_C = BO.PRE.concat(BO.UP);
// Forming windows [start, end, keys] for the last four candles.
const BO_F = [
  [6.4, 10.6, [[6.4, 60310], [7.3, 60290], [8.5, 60410], [9.6, 60500], [10.6, 60480]]],
  [12.6, 14.2, [[12.6, 60480], [13.1, 60460], [13.7, 60560], [14.2, 60530]]],
  [15.8, 18.6, [[15.8, 60530], [16.3, 60540], [17.4, 60390], [18.6, 60460]]],
  [19.4, 21.2, [[19.4, 60460], [19.8, 60450], [20.7, 60610], [21.2, 60590]]],
];
kit.scene('breakout', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'bo-c', BO_C.length);
    const row = (a, v, cls) => '<div class="row bo-r"><span>' + a + '</span><span class="mono ' + (cls || '') + '" style="font-size:34px">' + v + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="bo-grid">' + UI.grid(170, 1240, BO.y, 60000, 60600, 100) + '</g>' +
      '<rect class="bo-zone" x="170" y="' + BO.y(60400).toFixed(1) + '" width="1070" height="' + (BO.y(60300) - BO.y(60400)).toFixed(1) + '" rx="8" style="stroke-width:2"/>' +
      this.cd.html +
      '<circle class="bo-ring" cx="' + BO.x(11) + '" cy="' + BO.y(60390).toFixed(1) + '" r="24" fill="none" stroke-width="4" style="stroke:var(--main)"/></svg>' +
      '<p class="tag bo-zl" style="left:186px;top:' + (BO.y(60400) - 52).toFixed(0) + 'px;color:var(--accent);border-color:var(--accent)">Resistance 60,300–60,400</p>' +
      '<p class="tag bo-zl2" style="left:186px;top:' + (BO.y(60400) - 52).toFixed(0) + 'px;color:var(--main);border-color:var(--main)">Old ceiling, now a floor</p>' +
      '<p class="tag bo-cl" style="left:' + (BO.x(9) - 160) + 'px;top:' + (BO.y(60480) - 70).toFixed(0) + 'px;color:var(--up);border-color:var(--up)">Close 60,480</p>' +
      '<p class="tag bo-rt" style="left:' + (BO.x(11) - 70) + 'px;top:' + (BO.y(60390) + 34).toFixed(0) + 'px;color:var(--main);border-color:var(--main)">Retest held</p>' +
      '<p class="fict" style="position:absolute;left:170px;top:300px;margin:0">BTC/USDT · 1-minute candles · fictional</p>' +
      '<div class="glass bo-pan" style="left:1380px;top:330px;width:350px;padding:16px 28px">' +
      row('Zone top', '60,400') + row('Close', '60,480', 'up') + '<div class="row bo-r" style="border:0"><span>Beyond by</span><span class="mono up" style="font-size:34px">+80</span></div>' +
      '<p class="mono bo-r" style="margin:2px 0 4px;font-size:22px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">60,480 − 60,400 = 80 USDT</p></div>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick bo-k">Breakout</p>' +
      '<h2 class="line bo-t">Close beyond, and keep going</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.bo-k').style; this.t = q('.bo-t'); this.grid = q('.bo-grid').style; this.zone = q('.bo-zone').style;
    this.zl = q('.bo-zl').style; this.zl2 = q('.bo-zl2').style; this.cl = q('.bo-cl').style; this.rt = q('.bo-rt').style; this.ring = q('.bo-ring').style;
    this.pan = q('.bo-pan').style; this.rows = all('.bo-r').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'explain' }, { t: 5.6, pose: 'magnify' }, { t: 10.8, pose: 'thumbs' }, { t: 15.8, pose: 'point', flip: true }, { t: 21.8, pose: 'idea' }],
      says: [{ t0: 22.0, t1: 25.6, text: 'This time!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.3, 0.9));
    BO_C.forEach((c, i) => {
      if (i < 9) {
        const a = 0.8 + i * 0.4, p = seg(t, a, a + 0.5);
        this.cd.set(i, { x: BO.x(i), w: 46, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: BO.y, op: eo(seg(t, a, a + 0.25)) });
      } else {
        const f = BO_F[i - 9];
        const k = t >= f[1] ? { o: c[0], h: c[1], l: c[2], c: c[3] } : UI.forming(f[2], c[2], c[1], t);
        this.cd.set(i, { x: BO.x(i), w: 46, o: k.o, h: k.h, l: k.l, c: k.c, y: BO.y, live: !!k.live, op: eo(seg(t, f[0] - 0.2, f[0] + 0.1)) });
      }
    });
    // The zone: violet resistance, turning cyan once the retest has held.
    const z = seg(t, 5.6, 6.3), flip = eio(seg(t, 21.8, 22.8));
    this.zone.opacity = eo(z);
    this.zone.fill = 'color-mix(in srgb, ' + (flip > 0.5 ? 'var(--main)' : 'var(--accent)') + ' ' + (20 + 14 * Math.sin(Math.PI * seg(t, 10.6, 11.6))).toFixed(0) + '%, transparent)';
    this.zone.stroke = flip > 0.5 ? 'color-mix(in srgb, var(--main) 70%, transparent)' : 'color-mix(in srgb, var(--accent) 75%, transparent)';
    this.zl.opacity = eo(seg(t, 5.9, 6.4)) * (1 - flip); this.zl2.opacity = flip;
    UI.rise(this.cl, t, 10.8, { dy: 14 });
    UI.rise(this.pan, t, 10.8);
    this.rows.forEach((s, i) => { const a = 11.0 + i * 0.6; s.opacity = eo(seg(t, a, a + 0.4)); });
    const r = seg(t, 18.6, 19.2);
    this.ring.opacity = eo(r); this.ring.transformBox = 'fill-box'; this.ring.transformOrigin = 'center'; this.ring.transform = 'scale(' + lerp(1.8, 1, eob(r, 1.5)).toFixed(3) + ')';
    UI.rise(this.rt, t, 18.8, { dy: 14 });
    this.tutor.render(t);
  },
});
