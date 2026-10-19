const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const EE_IN = 14.6, EE_OUT = 19.4;
kit.scene('entryexit', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:760px"><p class="kick ee-k">Two prices</p>' +
      '<h2 class="line ee-t">Entry and exit</h2>' +
      '<p class="def ee-d">The <b>entry price</b> is where you open a trade. The <b>exit price</b> is where you close it.</p></div>' +
      '<div class="glass ee-an" style="left:140px;top:590px;width:760px;padding:24px 32px;display:flex;align-items:center;gap:28px">' +
      '<svg width="120" height="80" viewBox="0 0 120 80" style="flex:none"><rect x="6" y="8" width="108" height="54" rx="12" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main);stroke-width:3"/><rect x="18" y="18" width="22" height="18" rx="3" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/><rect x="48" y="18" width="22" height="18" rx="3" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/><rect x="78" y="18" width="22" height="18" rx="3" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/><circle cx="30" cy="66" r="9" style="fill:var(--second)"/><circle cx="90" cy="66" r="9" style="fill:var(--second)"/></svg>' +
      '<p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">Like a bus ride: where you <span class="hl">get on</span>, and where you <span class="hv">get off</span>.</p></div>' +
      '<span class="chip mono ee-bt" style="position:absolute;left:1000px;top:676px;font-size:28px;padding:12px 24px">Move: 61,200 − 60,000 = <span class="hl">+1,200 USDT</span></span>' +
      '</div>'));
    this.chart = UI.chart(kit, { x0: 1000, x1: 1500, y0: 250, y1: 620, lo: 59400, hi: 61600, step: 500, t0: 1.0, t1: 21.4,
      keys: [[1.0, 59800], [4.5, 60300], [9.5, 59700], [EE_IN, 60000], [EE_OUT - 0.4, 61200], [22, 61200]], tag: false, label: 'BTC price in USDT · fictional' });
    const c = this.chart, ex = c.x(EE_IN), ey = c.y(60000), xx = c.x(EE_OUT), xy = c.y(61200);
    const mark = (cls, x, y, col, text, below) => '<g class="' + cls + '"><circle class="' + cls + '-rip" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="20" fill="none" stroke-width="3" style="stroke:' + col + '"/>' +
      '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="13" style="fill:' + col + '"/>' +
      (below ? '<rect x="' + (x - 94).toFixed(1) + '" y="' + (y + 26).toFixed(1) + '" width="188" height="44" rx="10" style="fill:color-mix(in srgb, var(--ground) 70%, ' + col + ');stroke:' + col + ';stroke-width:2"/>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + 56).toFixed(1) + '" text-anchor="middle" style="fill:var(--second);font-size:24px;font-weight:700">' + text + '</text></g>'
      : '<rect x="' + (x - 220).toFixed(1) + '" y="' + (y - 22).toFixed(1) + '" width="188" height="44" rx="10" style="fill:color-mix(in srgb, var(--ground) 70%, ' + col + ');stroke:' + col + ';stroke-width:2"/>' +
        '<text x="' + (x - 126).toFixed(1) + '" y="' + (y + 8).toFixed(1) + '" text-anchor="middle" style="fill:var(--second);font-size:24px;font-weight:700">' + text + '</text></g>');
    const ov = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<line class="ee-lv" x1="' + ex + '" x2="' + (xx + 24) + '" y1="' + ey + '" y2="' + ey + '" stroke-dasharray="8 8" style="stroke:color-mix(in srgb, var(--second) 40%, transparent);stroke-width:2"/>' +
      '<path class="ee-br" d="M' + (xx + 24) + ' ' + ey + ' V' + xy + '" pathLength="1" style="stroke:var(--main);stroke-width:4;fill:none"/>' +
      mark('ee-e', ex, ey, 'var(--main)', 'Entry 60,000', true) + mark('ee-x', xx, xy, 'var(--accent)', 'Exit 61,200', false) + '</svg>');
    kit.stage.append(ov);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ee-k').style; this.t = q('.ee-t'); this.d = q('.ee-d'); this.an = q('.ee-an').style;
    this.e = q('.ee-e').style; this.x = q('.ee-x').style; this.er = q('.ee-e-rip'); this.xr = q('.ee-x-rip');
    this.lv = q('.ee-lv').style; this.br = q('.ee-br'); this.bt = q('.ee-bt').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'writing' }, { t: 0.6, pose: 'explain' }, { t: 7.2, pose: 'present' }, { t: 14.4, pose: 'point', flip: true }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.0, { stagger: 0.05 });
    const ap = seg(t, 7.2, 7.8);
    this.an.opacity = eo(ap); this.an.transform = 'translateY(' + lerp(30, 0, eo(ap)).toFixed(1) + 'px)';
    this.chart.render(Math.min(t, EE_OUT), eo(seg(t, 0.6, 1.2)));
    const click = (g, rip, a) => {
      const p = seg(t, a, a + 0.4), r = seg(t, a, a + 0.9);
      g.opacity = eo(p);
      rip.setAttribute('r', lerp(14, 46, eo(r)).toFixed(1)); rip.style.opacity = (1 - r) * (r > 0 ? 1 : 0);
    };
    click(this.e, this.er, EE_IN); click(this.x, this.xr, EE_OUT);
    this.lv.opacity = eo(seg(t, EE_IN + 0.2, EE_IN + 0.6));
    const b = seg(t, EE_OUT + 0.4, EE_OUT + 1.1);
    this.br.setAttribute('stroke-dasharray', eo(b).toFixed(3) + ' 1'); this.br.style.opacity = b > 0 ? 1 : 0;
    this.bt.opacity = eo(seg(t, EE_OUT + 0.9, EE_OUT + 1.4));
    this.tutor.render(t);
  },
});
