const { seg, eo, eob, eio, lerp, clamp01, TextFx } = kit;
const MV_KEYS = [[0, 60000], [2.2, 60000], [7.0, 63000], [9.2, 63000], [14.0, 57000], [20, 57000]];
const mvPrice = (t) => {
  let v = MV_KEYS[0][1];
  for (let i = 1; i < MV_KEYS.length; i++) { const a = MV_KEYS[i - 1], b = MV_KEYS[i]; if (t >= a[0]) v = lerp(a[1], b[1], eio(clamp01((t - a[0]) / (b[0] - a[0])))); }
  return v + Math.sin(t * 5.3) * 140 + Math.sin(t * 11.7) * 70;
};
const mvX = (t) => 1020 + (Math.min(t, 18) / 18) * 660, mvY = (p) => 600 - (p - 55000) / 10000 * 380;
kit.scene('moves', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (label, cls, note) => '<div style="display:flex;align-items:baseline;gap:24px;padding:18px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="width:170px;font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + label + '</span><span class="mono ' + cls + '" style="font-size:46px;min-width:290px"></span><span class="' + cls + '-n" style="font-size:24px;font-weight:600">' + note + '</span></div>';
    let grid = '';
    for (let p = 56000; p <= 64000; p += 2000) grid += '<line x1="1020" x2="1680" y1="' + mvY(p) + '" y2="' + mvY(p) + '" style="stroke:color-mix(in srgb, var(--second) 8%, transparent);stroke-width:1.5"/><text x="1700" y="' + (mvY(p) + 8) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground));font-size:18px">' + UI.fmt(p) + '</text>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="mv-chart">' + grid +
      '<path class="mv-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="mv-dot" r="10" style="fill:var(--second)"/></g>' +
      '<text x="1020" y="200" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional</text></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick mv-k">When the price moves</p>' +
      '<h2 class="line mv-t">Same amount, new value</h2></div>' +
      '<div class="glass mv-panel" style="left:140px;top:450px;width:800px;padding:14px 36px">' +
      row('Amount', 'mv-a', 'stays the same') + row('BTC price', 'mv-p', '') + row('Value', 'mv-v', '') + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mv-k').style; this.t = q('.mv-t'); this.panel = q('.mv-panel').style;
    this.line = q('.mv-line'); this.dot = q('.mv-dot'); this.chart = q('.mv-chart').style;
    this.a = q('.mv-a'); this.p = q('.mv-p'); this.v = q('.mv-v'); this.pn = q('.mv-p-n'); this.vn = q('.mv-v-n'); this.an = q('.mv-a-n').style;
    this.a.textContent = '0.002 BTC';
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'point', flip: true }, { t: 9.4, pose: 'think' }, { t: 14.4, pose: 'explain' }],
      says: [{ t0: 14.6, t1: 19.7, text: 'Same 0.002 BTC. Only its value changed.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const pn = seg(t, 0.6, 1.3);
    this.panel.opacity = eo(pn); this.panel.transform = 'translateY(' + lerp(30, 0, eo(pn)) + 'px)';
    this.chart.opacity = eo(seg(t, 0.4, 1.0));
    let d = '';
    const end = Math.min(t, 18);
    for (let s = 0; s <= end + 1e-6; s += 0.1) d += (s ? 'L' : 'M') + mvX(s).toFixed(1) + ' ' + mvY(mvPrice(s)).toFixed(1);
    this.line.setAttribute('d', d || 'M1020 ' + mvY(60000));
    this.dot.setAttribute('cx', mvX(end).toFixed(1)); this.dot.setAttribute('cy', mvY(mvPrice(end)).toFixed(1));
    const step = Math.floor(t * 4) / 4, price = Math.round(mvPrice(step));
    const value = price * 0.002;
    const pt = UI.fmt(price) + ' USDT', vt = UI.fmt(value, 2) + ' USDT';
    if (this.p.textContent !== pt) this.p.textContent = pt;
    if (this.v.textContent !== vt) this.v.textContent = vt;
    const chg = (price - 60000) / 60000 * 100;
    const note = Math.abs(chg) < 0.5 ? '' : (chg > 0 ? '▲ ' : '▼ ') + Math.abs(chg).toFixed(1) + '%';
    for (const el of [this.pn, this.vn]) { if (el.textContent !== note) el.textContent = note; el.style.color = chg >= 0 ? 'var(--main)' : 'var(--accent)'; }
    this.an.color = 'var(--main)';
    this.an.opacity = 0.5 + 0.5 * eo(seg(t, 14.6, 15.2));
    this.tutor.render(t);
  },
});
