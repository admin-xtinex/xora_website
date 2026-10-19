const C = UI.CORNER;
const BE_TXT = (x, y, s, col, anchor) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + ' style="fill:' + col + ';font-size:24px;font-weight:700">' + s + '</text>';
const BE_CFG = {
  cls: 'be', kick: 'Scenario 2', kickColor: 'var(--accent)', title: 'Price falls',
  keys: [[0.2, 60000], [1.0, 60080], [4.6, 59400], [5.0, 59390], [7, 59300], [12, 59420], [18, 59520]], s0: 0.2, s1: 17, closeAt: 5.0, wob: 20,
  pnlAt: (t, price) => t < 5.0 ? price(Math.floor(t * 6) / 6) : 59390,
  flash: { key: 's', t: 4.6 }, cancel: { key: 't', t: 7.1 },
  marks: [
    { t: 5.0, svg: (X, Y) => '<circle cx="' + X(5.0).toFixed(1) + '" cy="' + Y(59390).toFixed(1) + '" r="14" style="fill:var(--accent)"/>' + BE_TXT(X(5.0) + 20, Y(59400) - 44, 'Filled 59,390', 'var(--accent)') },
    { t: 7.2, svg: (X, Y) => BE_TXT(1012, Y(61200) - 14, 'Cancelled', 'var(--main)') },
  ],
  cards: [
    { t: 7.1, top: 520, html: '<p class="mono" style="margin:0;font-size:30px">(59,390 − 60,000) × 0.01 = <span style="color:var(--accent)">−6.10 USDT</span></p><p style="margin:8px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Closed at stop-loss, before fees.</p>' },
    { t: 12.7, top: 670, html: '<p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">Losing trades are normal. <span style="color:var(--main)">The stop kept this one small.</span></p>' },
  ],
  tutor: { keys: [{ t: 0, x: C.x, y: C.y, s: C.s }], poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'candles' }, { t: 7.0, pose: 'think' }, { t: 12.6, pose: 'calm' }], says: [] },
};
kit.scene('bear', { init(kit) { this.r = UI.scenario(kit, BE_CFG); }, render(t) { this.r(t); } });
