const C = UI.CORNER;
const MI_TXT = (x, y, s, col, anchor) => '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + ' style="fill:' + col + ';font-size:24px;font-weight:700">' + s + '</text>';
const MI_CFG = {
  cls: 'mi', kick: 'Not guaranteed', kickColor: 'var(--accent)', title: 'A missed target',
  lo: 59800, hi: 61400, step: 200, hide: ['s', 'zr'],
  keys: [[0.2, 60000], [1.0, 59960], [5.0, 61150], [7.4, 61080], [13.0, 60300], [20, 60360]], s0: 0.2, s1: 17, wob: 8,
  meterLabel: 'Long 0.01 BTC · unrealized PnL',
  marks: [
    { t: 5.0, svg: (X, Y) => '<circle cx="' + X(5.0).toFixed(1) + '" cy="' + Y(61150).toFixed(1) + '" r="22" fill="none" stroke-width="3" style="stroke:var(--accent)"/>' + MI_TXT(X(5.0), Y(61200) - 40, 'Peak 61,150 · 50 short', 'var(--accent)', 'middle') },
  ],
  cards: [
    { t: 7.5, out: 13.0, top: 520, html: '<p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">The take-profit never filled. The gain on screen shrinks as price falls.</p>' },
    { t: 13.5, top: 520, border: 'var(--main)', html: '<p style="margin:0;font-size:28px;line-height:1.4;font-weight:600"><b style="color:var(--main)">Unrealized PnL</b> is profit or loss on paper while a trade is open. Not yours until you close.</p>' },
  ],
  tutor: { keys: [{ t: 0, x: C.x, y: C.y, s: C.s }], poses: [{ t: 0, pose: 'confused' }, { t: 0.5, pose: 'candles' }, { t: 7.4, pose: 'think' }, { t: 13.4, pose: 'explain' }], says: [] },
};
kit.scene('miss', { init(kit) { this.r = UI.scenario(kit, MI_CFG); }, render(t) { this.r(t); } });
