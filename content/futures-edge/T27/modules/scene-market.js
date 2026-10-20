const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// MARKET: candle ranges average into ATR; swing high and low marked; the MARKET card (mock).
const MK_C = [[59900, 59980, 59870, 59960], [59960, 60080, 59940, 60060], [60060, 60200, 60040, 60180], [60180, 60330, 60150, 60300], [60300, 60450, 60260, 60360], [60360, 60390, 60220, 60230],
  [60230, 60250, 60170, 60190], [60190, 60200, 60100, 60110], [60110, 60120, 60030, 60050], [60050, 60060, 59950, 60010], [60010, 60060, 59990, 60040], [60040, 60090, 60000, 60070]];
const MK_Y = (p) => 720 - (p - 59850) * (380 / 650), MK_X = (i) => 210 + i * 66;
kit.scene('market', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cs = '', br = '';
    MK_C.forEach((c, i) => {
      const col = c[3] >= c[0] ? 'var(--up)' : 'var(--down)', x = MK_X(i);
      cs += '<g class="mk-c"><line x1="' + x + '" x2="' + x + '" y1="' + MK_Y(c[1]).toFixed(1) + '" y2="' + MK_Y(c[2]).toFixed(1) + '" stroke-width="3" style="stroke:' + col + '"/>' +
        '<rect x="' + (x - 18) + '" y="' + MK_Y(Math.max(c[0], c[3])).toFixed(1) + '" width="36" height="' + Math.max(4, MK_Y(Math.min(c[0], c[3])) - MK_Y(Math.max(c[0], c[3]))).toFixed(1) + '" rx="3" style="fill:' + col + '"/></g>';
      if (i >= 6) br += '<g class="mk-b"><path d="M' + (x + 26) + ' ' + MK_Y(c[1]).toFixed(1) + ' h8 V' + MK_Y(c[2]).toFixed(1) + ' h-8" fill="none" stroke-width="2.5" style="stroke:var(--warn)"/>' +
        '<text x="' + x + '" y="' + (MK_Y(c[2]) + 34).toFixed(1) + '" text-anchor="middle" class="mono" style="fill:var(--warn);font-size:22px">' + (c[1] - c[2]) + '</text></g>';
    });
    const row = (a, b, col) => '<div style="display:flex;justify-content:space-between;align-items:baseline;padding:12px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + a + '</span><span class="mono" style="font-size:26px;' + (col ? 'color:' + col : '') + '">' + b + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:960px"><p class="kick mk-k">Market</p><h2 class="line mk-t">Volatility and swings</h2></div>' +
      '<div class="glass mk-g" style="left:140px;top:330px;width:960px;height:440px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="mk-ch">' + cs + br +
      '<g class="mk-sh"><path d="M' + MK_X(4) + ' ' + (MK_Y(60450) - 14) + ' l-12 -18 h24 z" style="fill:var(--down)"/><text x="' + (MK_X(4) + 22) + '" y="' + (MK_Y(60450) - 14) + '" class="mono" style="fill:var(--down);font-size:22px">swing high 60,450</text></g>' +
      '<g class="mk-sl"><path d="M' + MK_X(9) + ' ' + (MK_Y(59950) + 50) + ' l-12 18 h24 z" style="fill:var(--up)"/><text x="' + (MK_X(9) - 22) + '" y="' + (MK_Y(59950) + 88) + '" text-anchor="end" class="mono" style="fill:var(--up);font-size:22px">swing low 59,950</text></g></g>' +
      '<text x="170" y="752" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">5m candles · fictional</text></svg>' +
      '<div class="glass mk-a" style="left:1160px;top:650px;width:620px;padding:14px 24px"><p class="mono" style="margin:0;font-size:26px;color:var(--warn)">(80+100+90+110+70+90) ÷ 6 = 90</p><p class="lbl" style="margin:4px 0 0">average range ≈ ATR (simplified)</p></div>' +
      '<div class="glass mk-card" style="left:1160px;top:330px;width:620px;padding:22px 28px"><p class="card-h">MARKET</p>' +
      row('Volatility · ATR 5m', '90 USDT', 'var(--warn)') + row('Last candle', '▲ +0.05%', 'var(--up)') + row('Recent swing highs', '60,450', 'var(--down)') + row('Recent swing lows', '59,950', 'var(--up)') + '</div>' +
      '</div>'));
    UI.mockLabel(kit, 1160, 292);
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.g = q('.mk-g').style; this.cs = all('.mk-c').map((e) => e.style); this.bs = all('.mk-b').map((e) => e.style);
    this.sh = q('.mk-sh').style; this.sl = q('.mk-sl').style; this.a = q('.mk-a').style; this.card = q('.mk-card').style; this.ml = q('.mock').style;
    this.rows = [...q('.mk-card').querySelectorAll('div')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'magnify' }, { t: 7.2, pose: 'idea' }, { t: 13.1, pose: 'pointer', flip: true }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.g, t, 0.3, 0.6, 20);
    this.cs.forEach((s, i) => { s.opacity = eo(seg(t, 0.6 + i * 0.18, 0.9 + i * 0.18)); });
    this.bs.forEach((s, i) => { s.opacity = eo(seg(t, 3.2 + i * 0.4, 3.6 + i * 0.4)); });
    UI.rise(kit, this.a, t, 6.0, 0.6, 16);
    UI.rise(kit, this.card, t, 7.2, 0.6, 24);
    this.ml.opacity = 0.9 * eo(seg(t, 7.6, 8.2));
    this.rows.forEach((s, i) => {
      const a = [7.6, 9.6, 13.6, 14.6][i];
      s.opacity = eo(seg(t, a, a + 0.4));
    });
    this.sh.opacity = eo(seg(t, 13.4, 13.9)); this.sl.opacity = eo(seg(t, 14.4, 14.9));
    this.tutor.render(t);
  },
});
