const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The fictional 15-minute chart: two observations, then one demo trade from 60,000 (#3) to 60,120 (#7), 4 minutes.
const CH_H = UI.H, chX = (i) => 236 + i * 70, chY = (p) => 660 - (p - 59940) / 340 * 330, CH_B = 772, CH_U = 5;
kit.scene('chart', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'ch-c', CH_H.length);
    let bars = '';
    CH_H.forEach((c, i) => { bars += '<rect class="ch-v" x="' + (chX(i) - 20) + '" y="' + (CH_B - c[4] * CH_U) + '" width="40" height="' + c[4] * CH_U + '" rx="3" style="fill:color-mix(in srgb, ' + (c[3] >= c[0] ? 'var(--up)' : 'var(--down)') + ' 50%, transparent)"/>'; });
    const ring = (cls, x, y, col) => '<circle class="' + cls + '" cx="' + x + '" cy="' + y.toFixed(1) + '" r="26" fill="none" stroke-width="4" style="stroke:' + col + '"/>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ch-grid">' + UI.grid(200, 1250, chY, 59950, 60200, 50) + '</g>' +
      '<rect class="ch-zone" x="200" y="' + chY(60020).toFixed(1) + '" width="1050" height="' + (chY(59960) - chY(60020)).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--main) 16%, transparent);stroke:color-mix(in srgb, var(--main) 60%, transparent);stroke-width:2"/>' +
      this.cd.html + bars +
      ring('ch-m1', chX(3), chY(59970) + 8, 'var(--main)') + ring('ch-m2', chX(11), chY(60260) - 6, 'var(--accent)') +
      '<rect class="ch-vh" x="' + (chX(11) - 28) + '" y="' + (CH_B - 3 * CH_U - 10) + '" width="56" height="' + (3 * CH_U + 14) + '" rx="6" fill="none" stroke-width="3" style="stroke:var(--accent)"/>' +
      '<circle class="ch-en" cx="' + chX(3) + '" cy="' + chY(60000).toFixed(1) + '" r="12" style="fill:var(--up);stroke:var(--ground);stroke-width:3"/>' +
      '<circle class="ch-ex" cx="' + chX(7) + '" cy="' + chY(60120).toFixed(1) + '" r="12" style="fill:var(--second);stroke:var(--ground);stroke-width:3"/>' +
      '<g class="ch-hb"><line x1="' + chX(3) + '" x2="' + chX(7) + '" y1="' + (chY(60230)) + '" y2="' + (chY(60230)) + '" stroke-width="4" style="stroke:var(--up)"/>' +
      '<line x1="' + chX(3) + '" x2="' + chX(3) + '" y1="' + (chY(60230) - 12) + '" y2="' + (chY(60230) + 12) + '" stroke-width="4" style="stroke:var(--up)"/><line x1="' + chX(7) + '" x2="' + chX(7) + '" y1="' + (chY(60230) - 12) + '" y2="' + (chY(60230) + 12) + '" stroke-width="4" style="stroke:var(--up)"/></g>' +
      '<g class="ch-vb"><line x1="' + (chX(7) + 40) + '" x2="' + (chX(7) + 40) + '" y1="' + chY(60120).toFixed(1) + '" y2="' + chY(60000).toFixed(1) + '" stroke-width="4" style="stroke:var(--up)"/>' +
      '<line x1="' + chX(3) + '" x2="' + (chX(7) + 52) + '" y1="' + chY(60000).toFixed(1) + '" y2="' + chY(60000).toFixed(1) + '" stroke-width="2" stroke-dasharray="6 6" style="stroke:var(--up)"/></g></svg>' +
      '<p class="tag ch-zl" style="left:880px;top:' + (chY(59960) + 8).toFixed(0) + 'px;color:var(--main);border-color:var(--main)">Support zone 59,960–60,020</p>' +
      '<p class="tag ch-t1" style="left:210px;top:' + (chY(59960) + 8).toFixed(0) + 'px;color:var(--main);border-color:var(--main)">1 · Dip holds</p>' +
      '<p class="tag ch-t2" style="left:' + (chX(11) + 36) + 'px;top:296px;color:var(--accent);border-color:var(--accent)">2 · Spike, thin volume</p>' +
      '<p class="tag ch-et" style="left:210px;top:' + (chY(59960) + 8).toFixed(0) + 'px;color:var(--up);border-color:var(--up)">Demo long 60,000</p>' +
      '<p class="tag ch-xt" style="left:' + (chX(7) - 80) + 'px;top:' + (chY(60120) - 70).toFixed(0) + 'px">Close 60,120</p>' +
      '<p class="tag ch-hl" style="left:' + (chX(7) + 22) + 'px;top:' + (chY(60230) - 22).toFixed(0) + 'px;color:var(--up);border-color:var(--up)">4 min</p>' +
      '<p class="fict" style="position:absolute;left:200px;top:306px;margin:0">Fictional 1-minute candles · demo</p>' +
      '<p class="chip ch-ns" style="position:absolute;left:1400px;top:330px;margin:0;font-size:26px;padding:12px 22px;border-color:var(--accent)"><span class="dot" style="background:var(--accent)"></span>Observations, not signals</p>' +
      '<div class="glass ch-p" style="left:1400px;top:430px;width:370px;padding:12px 26px">' +
      '<div class="row ch-r"><span>Holding period</span><span class="mono" style="font-size:32px">4 min</span></div>' +
      '<div class="row ch-r" style="border:0"><span>Price move</span><span class="mono up" style="font-size:32px">+120</span></div>' +
      '<p class="fict ch-r" style="margin:0 0 8px">USDT per BTC · could have failed</p></div>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick ch-k">A short trade</p>' +
      '<h2 class="line ch-t">Fifteen minutes, one scalp</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ch-k').style; this.t = q('.ch-t'); this.grid = q('.ch-grid').style; this.zone = q('.ch-zone').style; this.zl = q('.ch-zl').style;
    this.vs = all('.ch-v').map((e) => e.style);
    this.m1 = q('.ch-m1').style; this.m2 = q('.ch-m2').style; this.vh = q('.ch-vh').style; this.t1 = q('.ch-t1').style; this.t2 = q('.ch-t2').style;
    this.en = q('.ch-en').style; this.ex = q('.ch-ex').style; this.hb = q('.ch-hb').style; this.vb = q('.ch-vb').style;
    this.et = q('.ch-et').style; this.xt = q('.ch-xt').style; this.hl = q('.ch-hl').style; this.ns = q('.ch-ns').style; this.p = q('.ch-p').style; this.rows = all('.ch-r').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'present' }, { t: 5.2, pose: 'magnify' }, { t: 17.0, pose: 'point', flip: true }, { t: 22.6, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 0.9));
    CH_H.forEach((c, i) => {
      const a = 0.8 + i * 0.3, p = seg(t, a, a + 0.45);
      this.cd.set(i, { x: chX(i), w: 40, o: c[0], h: lerp(c[0], c[1], eo(p)), l: lerp(c[0], c[2], eo(p)), c: lerp(c[0], c[3], eo(p)), y: chY, op: eo(seg(t, a, a + 0.2)) });
      const v = this.vs[i]; v.transformBox = 'fill-box'; v.transformOrigin = '50% 100%'; v.transform = 'scaleY(' + eob(seg(t, a + 0.1, a + 0.6), 1.4).toFixed(3) + ')';
    });
    UI.rise(this.ns, t, 5.4);
    const pop = (s, a) => { const p = seg(t, a, a + 0.5); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = 'center'; s.transform = 'scale(' + lerp(1.8, 1, eob(p, 1.5)).toFixed(3) + ')'; };
    this.zone.opacity = eo(seg(t, 10.9, 11.5)); this.zl.opacity = eo(seg(t, 11.2, 11.7)) * (1 - ei(seg(t, 16.8, 17.2)));
    pop(this.m1, 11.4); UI.rise(this.t1, t, 11.7, { dy: 10, out: 16.8 });
    pop(this.m2, 13.8); pop(this.vh, 14.3); UI.rise(this.t2, t, 14.1, { dy: 10 });
    pop(this.en, 17.4); UI.rise(this.et, t, 17.6, { dy: 10 });
    pop(this.ex, 19.6); UI.rise(this.xt, t, 19.8, { dy: 10 });
    const h = seg(t, 22.6, 23.3);
    this.hb.opacity = eo(h); this.hb.transformBox = 'fill-box'; this.hb.transformOrigin = '0 50%'; this.hb.transform = 'scaleX(' + eo(h).toFixed(3) + ')';
    UI.rise(this.hl, t, 23.0, { dy: 10 });
    const v = seg(t, 23.6, 24.2);
    this.vb.opacity = eo(v);
    UI.rise(this.p, t, 22.8);
    this.rows.forEach((s, i) => { s.opacity = eo(seg(t, 23.0 + i * 1.0, 23.4 + i * 1.0)); });
    this.tutor.render(t);
  },
});
