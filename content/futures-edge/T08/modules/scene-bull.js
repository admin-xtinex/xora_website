const C = UI.CORNER;
const BU_TXT = (x, y, s, col, anchor) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + ' style="fill:' + col + ';font-size:24px;font-weight:700">' + s + '</text>';
const BU_CFG = {
  cls: 'bu', kick: 'Scenario 1', title: 'Price rises',
  keys: [[0.2, 60000], [1.4, 59920], [5.0, 61200], [7, 61300], [12, 61420], [19, 61330]], s0: 0.2, s1: 17, closeAt: 5.0, wob: 24, tBelow: true,
  flash: { key: 't', t: 5.0 }, cancel: { key: 's', t: 12.3 },
  marks: [
    { t: 5.0, svg: (X, Y) => '<circle cx="' + X(5.0).toFixed(1) + '" cy="' + Y(61200).toFixed(1) + '" r="14" style="fill:var(--main)"/>' + BU_TXT(X(5.0) - 22, Y(61200) - 18, 'Filled 61,200', 'var(--main)', 'end') },
    { t: 12.4, svg: (X, Y) => BU_TXT(1012, Y(59400) + 34, 'Cancelled', 'var(--accent)') },
  ],
  cards: [
    { t: 6.5, top: 520, html: '<p class="mono" style="margin:0;font-size:30px">(61,200 − 60,000) × 0.01 = <span style="color:var(--main)">+12.00 USDT</span></p><p style="margin:8px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Closed at take-profit, before fees.</p>' },
    { t: 12.3, top: 670, html: '<p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">When one exit fills, the other is often cancelled. <span style="color:var(--main)">Check your platform.</span></p>' },
  ],
  tutor: { keys: [{ t: 0, x: C.x, y: C.y, s: C.s }], poses: [{ t: 0, pose: 'think' }, { t: 0.5, pose: 'candles' }, { t: 5.2, pose: 'cheer' }, { t: 12.3, pose: 'explain' }], says: [] },
};
kit.scene('bull', { init(kit) { this.r = UI.scenario(kit, BU_CFG); }, render(t) { this.r(t); } });
