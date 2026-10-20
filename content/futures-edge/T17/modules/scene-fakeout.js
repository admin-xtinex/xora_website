const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Fakeout branch: same history; the wick reaches 60,460 but the candle closes at 60,350, then price falls toward 60,150.
const FK = UI.SR, FK_C = FK.PRE.concat(FK.FAKE);
const FK_F = [
  [5.0, 11.4, [[5.0, 60310], [5.8, 60290], [7.2, 60400], [8.4, 60460], [9.6, 60400], [11.4, 60350]]],
  [18.4, 19.6, [[18.4, 60350], [18.7, 60370], [19.6, 60240]]],
  [19.7, 20.8, [[19.7, 60240], [19.9, 60260], [20.5, 60130], [20.8, 60160]]],
  [20.9, 22.0, [[20.9, 60160], [21.2, 60200], [21.7, 60120], [22.0, 60150]]],
];
kit.scene('fakeout', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'fk-c', FK_C.length);
    this.gh = UI.cdl(kit, 'fk-g', 4);
    const row = (a, v, cls) => '<div class="row fk-r"><span>' + a + '</span><span class="mono ' + (cls || '') + '" style="font-size:34px">' + v + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="fk-grid">' + UI.grid(170, 1240, FK.y, 60000, 60600, 100) + '</g>' +
      '<rect class="fk-zone" x="170" y="' + FK.y(60400).toFixed(1) + '" width="1070" height="' + (FK.y(60300) - FK.y(60400)).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--accent) 20%, transparent);stroke:color-mix(in srgb, var(--accent) 75%, transparent);stroke-width:2"/>' +
      '<g class="fk-ghost" style="opacity:0">' + this.gh.html + '</g>' + this.cd.html + '</svg>' +
      '<p class="tag fk-zl" style="left:186px;top:' + (FK.y(60400) - 52).toFixed(0) + 'px;color:var(--accent);border-color:var(--accent)">Resistance 60,300–60,400</p>' +
      '<p class="tag fk-wk" style="left:' + (FK.x(9) - 200) + 'px;top:' + (FK.y(60460) - 22).toFixed(0) + 'px">Wick 60,460</p>' +
      '<p class="tag fk-cl" style="left:' + (FK.x(9) + 36) + 'px;top:' + (FK.y(60350) - 20).toFixed(0) + 'px;color:var(--down);border-color:var(--down)">Close 60,350 · inside</p>' +
      '<p class="tag fk-a" style="left:' + (FK.x(10) - 20) + 'px;top:' + (FK.y(60610) - 56).toFixed(0) + 'px;color:var(--up);border-color:var(--up)">Ending A: breakout</p>' +
      '<p class="tag fk-b" style="left:' + (FK.x(10) - 20) + 'px;top:' + (FK.y(60120) + 16).toFixed(0) + 'px;color:var(--down);border-color:var(--down)">Ending B: fakeout</p>' +
      '<p class="fict" style="position:absolute;left:170px;top:300px;margin:0">BTC/USDT · 1-minute candles · fictional</p>' +
      '<div class="glass fk-pan" style="left:1380px;top:330px;width:350px;padding:16px 28px">' +
      row('Zone top', '60,400') + row('Wick high', '60,460') + row('Close', '60,350', 'dn') +
      '<p class="mono fk-r" style="margin:6px 0 4px;font-size:22px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">60,350 − 60,400 = −50 USDT</p></div>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick fk-k" style="color:var(--accent)">Fakeout</p>' +
      '<h2 class="line fk-t">Poke beyond, fall back inside</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.fk-k').style; this.t = q('.fk-t'); this.grid = q('.fk-grid').style; this.zone = q('.fk-zone').style; this.zl = q('.fk-zl').style;
    this.wk = q('.fk-wk').style; this.cl = q('.fk-cl').style; this.a = q('.fk-a').style; this.b = q('.fk-b').style; this.ghost = q('.fk-ghost').style;
    this.pan = q('.fk-pan').style; this.rows = all('.fk-r').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 5.0, pose: 'magnify' }, { t: 11.6, pose: 'confused' }, { t: 18.6, pose: 'point', flip: true }, { t: 21.8, pose: 'think' }],
      says: [{ t0: 11.9, t1: 16.8, text: 'Back inside!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.2, 0.7));
    FK_C.forEach((c, i) => {
      if (i < 9) {
        const a = 0.5 + i * 0.25, p = seg(t, a, a + 0.4);
        this.cd.set(i, { x: FK.x(i), w: 46, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: FK.y, op: eo(seg(t, a, a + 0.2)) });
      } else {
        const f = FK_F[i - 9];
        const k = t >= f[1] ? { o: c[0], h: c[1], l: c[2], c: c[3] } : UI.forming(f[2], c[2], c[1], t);
        this.cd.set(i, { x: FK.x(i), w: 46, o: k.o, h: k.h, l: k.l, c: k.c, y: FK.y, live: !!k.live, op: eo(seg(t, f[0] - 0.2, f[0] + 0.1)) });
      }
    });
    // Ending A, drawn faint behind: the breakout from the last scene.
    FK.UP.forEach((c, i) => this.gh.set(i, { x: FK.x(9 + i), w: 46, o: c[0], h: c[1], l: c[2], c: c[3], y: FK.y, col: 'var(--up)', op: 1 }));
    this.ghost.opacity = (0.32 * eo(seg(t, 21.8, 22.6))).toFixed(3);
    UI.rise(this.a, t, 22.0, { dy: 12 }); UI.rise(this.b, t, 22.5, { dy: 12 });
    const z = seg(t, 0.9, 1.5);
    this.zone.opacity = eo(z); this.zl.opacity = eo(seg(t, 1.2, 1.7));
    this.zone.fill = 'color-mix(in srgb, var(--accent) ' + (20 + 18 * Math.sin(Math.PI * seg(t, 7.6, 9.2))).toFixed(0) + '%, transparent)';
    UI.rise(this.wk, t, 11.8, { dy: 12, out: 18.4 }); UI.rise(this.cl, t, 12.4, { dy: 12, out: 18.4 });
    UI.rise(this.pan, t, 11.8);
    this.rows.forEach((s, i) => { const a = 12.0 + i * 0.6; s.opacity = eo(seg(t, a, a + 0.4)); });
    this.tutor.render(t);
  },
});
