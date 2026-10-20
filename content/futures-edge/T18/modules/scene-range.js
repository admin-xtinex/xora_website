const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// One fictional candle: high 60,300, low 60,000, so the range is 300 USDT, 0.5% of the low.
const RG_K = [[1.4, 60050], [2.6, 60140], [3.6, 60000], [5.2, 60180], [6.4, 60300], [7.6, 60200], [8.6, 60250]];
const rgY = (p) => 700 - (p - 60000) / 300 * 360, RG_X = 1090;
kit.scene('range', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'rg-c', 1);
    const row = (a, v, cls, last) => '<div class="row rg-r"' + (last ? ' style="border:0"' : '') + '><span>' + a + '</span><span class="mono ' + (cls || '') + '" style="font-size:32px">' + v + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="rg-grid">' + UI.gridL(1000, 1180, rgY, 60000, 60300, 100) + '</g>' + this.cd.html +
      '<line class="rg-hl" x1="' + (RG_X + 40) + '" x2="1250" y1="' + rgY(60300) + '" y2="' + rgY(60300) + '" stroke-width="2" stroke-dasharray="8 6" style="stroke:var(--accent)"/>' +
      '<line class="rg-ll" x1="' + (RG_X + 40) + '" x2="1250" y1="' + rgY(60000) + '" y2="' + rgY(60000) + '" stroke-width="2" stroke-dasharray="8 6" style="stroke:var(--accent)"/>' +
      '<g class="rg-br"><line x1="1240" x2="1240" y1="' + rgY(60300) + '" y2="' + rgY(60000) + '" stroke-width="4" style="stroke:var(--accent)"/>' +
      '<path d="M1228 ' + (rgY(60300) + 16) + ' L1240 ' + rgY(60300) + ' L1252 ' + (rgY(60300) + 16) + '" fill="none" stroke-width="4" style="stroke:var(--accent)"/>' +
      '<path d="M1228 ' + (rgY(60000) - 16) + ' L1240 ' + rgY(60000) + ' L1252 ' + (rgY(60000) - 16) + '" fill="none" stroke-width="4" style="stroke:var(--accent)"/></g></svg>' +
      '<p class="tag rg-bl" style="left:1262px;top:' + (rgY(60150) - 22) + 'px;color:var(--accent);border-color:var(--accent)">300 USDT</p>' +
      '<p class="fict" style="position:absolute;left:1000px;top:300px;margin:0">One fictional candle</p>' +
      '<div class="glass rg-p" style="left:1450px;top:330px;width:330px;padding:12px 26px">' + row('High', '60,300') + row('Low', '60,000') + row('Range', '300 USDT', 'hv', 1) + '</div>' +
      '<div class="words" style="left:140px;top:160px;width:900px"><p class="kick rg-k">Range</p>' +
      '<h2 class="line rg-t">From low to high</h2></div>' +
      '<p class="def rg-d" style="position:absolute;left:140px;top:310px;width:740px;margin:0"><b>Range</b> is the distance between the high and the low: range = high − low.</p>' +
      '<p class="chip rg-a" style="position:absolute;left:140px;top:450px;margin:0;font-size:28px"><span class="dot"></span>Like the warmest and coldest hour of a day</p>' +
      '<div class="glass rg-f" style="left:140px;top:560px;width:740px;padding:20px 32px">' +
      '<p class="fict" style="margin:0 0 8px">Range as a percent · divide by the low</p>' +
      '<p class="mono" style="margin:0;font-size:38px">300 ÷ 60,000 × 100 = <span class="hl">0.5%</span></p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.rg-k').style; this.t = q('.rg-t'); this.d = q('.rg-d'); this.a = q('.rg-a').style; this.f = q('.rg-f').style;
    this.grid = q('.rg-grid').style; this.hl = q('.rg-hl').style; this.ll = q('.rg-ll').style; this.br = q('.rg-br').style; this.bl = q('.rg-bl').style;
    this.p = q('.rg-p').style; this.rows = all('.rg-r').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'explain' }, { t: 4.8, pose: 'idea' }, { t: 9.5, pose: 'point', flip: true }, { t: 14.8, pose: 'checklist' }, { t: 19.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.7, { stagger: 0.04 });
    UI.rise(this.a, t, 4.9);
    this.grid.opacity = eo(seg(t, 0.8, 1.3));
    const k = t >= 8.6 ? { o: 60050, h: 60300, l: 60000, c: 60250 } : UI.forming(RG_K, 60000, 60300, t);
    this.cd.set(0, { x: RG_X, w: 70, o: k.o, h: k.h, l: k.l, c: k.c, y: rgY, live: !!k.live, op: eo(seg(t, 1.2, 1.5)) });
    this.hl.opacity = eo(seg(t, 9.6, 10.1)); this.ll.opacity = eo(seg(t, 10.0, 10.5));
    UI.rise(this.p, t, 9.6);
    this.rows.forEach((s, i) => { s.opacity = eo(seg(t, 9.8 + i * 0.9, 10.2 + i * 0.9)); });
    const b = seg(t, 11.4, 12.2);
    this.br.opacity = eo(b); this.br.transformBox = 'fill-box'; this.br.transformOrigin = 'center'; this.br.transform = 'scaleY(' + eo(b).toFixed(3) + ')';
    UI.rise(this.bl, t, 12.0, { dy: 10 });
    UI.rise(this.f, t, 15.0);
    this.tutor.render(t);
  },
});
