const C = UI.CORNER;
const GA_TXT = (x, y, s, col, anchor) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + ' style="fill:' + col + ';font-size:24px;font-weight:700">' + s + '</text>';
const GA_CFG = {
  cls: 'ga', kick: 'Scenario 3', kickColor: 'var(--accent)', title: 'Price gaps',
  keys: [[0.2, 60000], [1.0, 60060], [5.4, 59700], [5.6, 59700]], gapAt: 5.6, keys2: [[5.6, 59100], [9, 59060], [14, 59180], [20, 59140]],
  s0: 0.2, s1: 17, closeAt: 6.0, wob: 18, sPos: 'left',
  pnlAt: (t, price) => t < 5.6 ? price(Math.floor(t * 6) / 6) : 59100,
  flash: { key: 's', t: 5.6 }, cancel: { key: 't', t: 7.0 },
  marks: [
    { t: 6.0, svg: (X, Y) => '<circle cx="' + X(5.6).toFixed(1) + '" cy="' + Y(59100).toFixed(1) + '" r="14" style="fill:var(--accent)"/>' + GA_TXT(X(5.6) + 24, Y(59100) + 44, 'Filled 59,100', 'var(--accent)') },
    { t: 6.6, svg: (X, Y) => GA_TXT(X(5.6) - 18, Y(59420) - 8, 'no trades here', 'color-mix(in srgb, var(--second) 75%, var(--ground))', 'end') },
    { t: 11.7, svg: (X, Y) => '<path d="M' + (X(5.6) + 100).toFixed(1) + ' ' + Y(59400).toFixed(1) + ' h18 V' + Y(59100).toFixed(1) + ' h-18" fill="none" stroke-width="3" style="stroke:var(--accent)"/>' + GA_TXT(X(5.6) + 132, Y(59250) + 8, '300 worse', 'var(--accent)') },
  ],
  cards: [
    { t: 6.5, top: 520, html: '<p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">The stop triggered at 59,400, but the first price available was <span style="color:var(--accent)">59,100</span>.</p>' },
    { t: 11.7, top: 670, border: 'var(--accent)', html: '<p class="mono" style="margin:0;font-size:30px">(59,100 − 60,000) × 0.01 = <span style="color:var(--accent)">−9.00 USDT</span></p>' },
  ],
  tutor: { keys: [{ t: 0, x: C.x, y: C.y, s: C.s }], poses: [{ t: 0, pose: 'present' }, { t: 0.5, pose: 'candles' }, { t: 5.7, pose: 'confused' }, { t: 11.6, pose: 'magnify' }], says: [] },
};
kit.scene('gap', { init(kit) { this.r = UI.scenario(kit, GA_CFG); }, render(t) { this.r(t); } });
