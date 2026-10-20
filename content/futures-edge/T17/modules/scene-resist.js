const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Fictional: two rallies stall in the 60,300–60,400 area and turn down.
const RS_K = [[0, 59950], [0.3, 60340], [0.5, 60010], [0.75, 60360], [1, 60040]];
const RS_TOUCH = [0.3, 0.75];
const rsP = (s) => UI.path(RS_K, s) + Math.sin(s * 79 + 1) * 10 * Math.sin(Math.PI * s * 5) ** 2;
const rsX = (s) => 1000 + s * 620, rsY = (p) => 740 - (p - 59800) / 700 * 400;
const RS_T0 = 1.0, RS_T1 = 11.0;
kit.scene('resist', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let tags = '', rings = '';
    RS_TOUCH.forEach((s, i) => {
      tags += '<p class="tag rs-tag" style="left:' + (rsX(s) - 52).toFixed(0) + 'px;top:' + (rsY(60400) - 60).toFixed(0) + 'px">Test ' + (i + 1) + '</p>';
      rings += '<circle class="rs-ring" cx="' + rsX(s).toFixed(1) + '" cy="' + rsY(rsP(s)).toFixed(1) + '" r="20" fill="none" stroke-width="4" style="stroke:var(--accent)"/>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="rs-grid">' + UI.grid(1000, 1620, rsY, 59900, 60400, 100) + '</g>' +
      '<rect class="rs-zone" x="1000" y="' + rsY(60400).toFixed(1) + '" width="620" height="' + (rsY(60300) - rsY(60400)).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--accent) 22%, transparent);stroke:color-mix(in srgb, var(--accent) 75%, transparent);stroke-width:2"/>' +
      '<path class="rs-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="rs-dot" r="10" style="fill:var(--accent)"/>' + rings + '</svg>' + tags +
      '<p class="fict" style="position:absolute;left:1000px;top:300px;margin:0">BTC/USDT · fictional prices</p>' +
      '<p class="tag rs-zl" style="left:1262px;top:' + (rsY(60400) - 52).toFixed(0) + 'px;color:var(--accent);border-color:var(--accent)">Resistance zone</p>' +
      '<div class="words" style="left:140px;top:160px;width:780px"><p class="kick rs-k" style="color:var(--accent)">Resistance</p>' +
      '<h2 class="line rs-t">A ceiling over price</h2>' +
      '<p class="def rs-d"><b style="color:var(--accent)">Resistance</b> is a price area where rising price has stopped and turned down before.</p>' +
      '<div class="chip rs-c" style="align-self:flex-start;border-color:color-mix(in srgb, var(--accent) 45%, transparent)"><span class="dot" style="background:var(--accent)"></span>Like a ceiling: climb, bump, fall back</div></div>' +
      '<div class="glass rs-n" style="left:140px;top:630px;width:780px;padding:22px 32px"><p style="margin:0;font-size:30px;font-weight:600;line-height:1.4">Two tests near <span class="mono hv">60,350</span>. Sellers showed up there before.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.rs-k').style; this.t = q('.rs-t'); this.d = q('.rs-d'); this.c = q('.rs-c').style; this.n = q('.rs-n').style;
    this.grid = q('.rs-grid').style; this.zone = q('.rs-zone').style; this.zl = q('.rs-zl').style; this.line = q('.rs-line'); this.dot = q('.rs-dot');
    this.tags = all('.rs-tag').map((e) => e.style); this.rings = all('.rs-ring').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'explain' }, { t: 7.2, pose: 'point', flip: true }, { t: 12.4, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.8, { stagger: 0.05 });
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    const end = Math.max(0.002, seg(t, RS_T0, RS_T1));
    this.line.setAttribute('d', UI.line(rsP, 0, end, rsX, rsY, 0.004));
    this.dot.setAttribute('cx', rsX(end).toFixed(1)); this.dot.setAttribute('cy', rsY(rsP(end)).toFixed(1));
    RS_TOUCH.forEach((s, i) => {
      const at = RS_T0 + s * (RS_T1 - RS_T0), p = seg(t, at, at + 0.6), stay = seg(t, 12.6 + i * 0.6, 13.1 + i * 0.6);
      this.rings[i].opacity = Math.max(Math.sin(Math.PI * p), eo(stay)).toFixed(3);
      this.rings[i].transformBox = 'fill-box'; this.rings[i].transformOrigin = 'center';
      this.rings[i].transform = 'scale(' + (stay > 0 ? lerp(1.6, 1, eob(stay, 1.5)) : lerp(0.6, 1.6, p)).toFixed(3) + ')';
      UI.rise(this.tags[i], t, 12.6 + i * 0.6, { dy: 14 });
    });
    const z = seg(t, 7.2, 8.0);
    this.zone.opacity = eo(z); this.zone.transformBox = 'fill-box'; this.zone.transformOrigin = 'center'; this.zone.transform = 'scaleY(' + lerp(0.2, 1, eob(z, 1.5)).toFixed(3) + ')';
    this.zl.opacity = eo(seg(t, 7.8, 8.3));
    UI.rise(this.c, t, 7.4);
    UI.rise(this.n, t, 12.8);
    this.tutor.render(t);
  },
});
