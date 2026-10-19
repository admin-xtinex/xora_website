const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// One fictional price path: 60,000 → 61,200 (+2%) → 58,800 (−2% from the start).
const PT_KEYS = [[0, 60000], [6.6, 60000], [9.4, 61200], [12.4, 61200], [15.8, 58800], [27, 58800]];
const ptPrice = (t) => { let v = PT_KEYS[0][1]; for (let i = 1; i < PT_KEYS.length; i++) { const a = PT_KEYS[i - 1], b = PT_KEYS[i]; if (t >= a[0]) v = lerp(a[1], b[1], eio(clamp01((t - a[0]) / (b[0] - a[0])))); } return v; };
const PT_X = (t) => 170 + Math.min(t, 24) / 24 * 690, PT_Y = (p) => 470 - (p - 60000) / 2000 * 220;
const PT_LEV = [1, 3, 10];
kit.scene('path', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let grid = '';
    [59000, 60000, 61000].forEach((p) => { grid += '<line x1="170" x2="860" y1="' + PT_Y(p) + '" y2="' + PT_Y(p) + '" style="stroke:color-mix(in srgb, var(--second) ' + (p === 60000 ? 0 : 8) + '%, transparent);stroke-width:1.5"/><text x="874" y="' + (PT_Y(p) + 8) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>'; });
    let rows = '';
    PT_LEV.forEach((L) => {
      rows += '<div class="glass pt-r" style="position:relative;width:740px;height:136px;padding:16px 28px">' +
        '<div style="display:flex;align-items:baseline;gap:16px"><span class="chip mono" style="font-size:28px;padding:6px 20px">' + L + 'x</span><span style="font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">notional <span class="mono" style="color:var(--second)">' + UI.fmt(100 * L) + '</span></span>' +
        '<span class="mono pt-pnl" style="margin-left:auto;font-size:44px">0.00</span><span style="font-size:22px">USDT</span></div>' +
        '<div style="position:absolute;left:28px;right:150px;bottom:22px;height:14px;border-radius:7px;background:color-mix(in srgb, var(--second) 8%, transparent)"><div class="pt-bar" style="position:absolute;top:0;bottom:0;border-radius:7px"></div><div style="position:absolute;left:50%;top:-7px;bottom:-7px;width:2px;background:color-mix(in srgb, var(--second) 40%, transparent)"></div></div>' +
        '<span class="mono pt-pct" style="position:absolute;right:28px;bottom:12px;font-size:26px"></span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:160px;width:900px"><p class="kick pt-k">One price path, three leverages</p>' +
      '<h2 class="line pt-t" style="font-size:72px">Same move, three sizes</h2></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="pt-chart">' + grid +
      '<line x1="170" x2="860" y1="' + PT_Y(60000) + '" y2="' + PT_Y(60000) + '" stroke-dasharray="8 8" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
      '<text x="180" y="' + (PT_Y(60000) - 12) + '" style="fill:color-mix(in srgb, var(--second) 55%, var(--ground));font-size:22px">entry 60,000</text>' +
      '<path class="pt-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="pt-dot" r="10" style="fill:var(--second)"/></g>' +
      '<text x="170" y="752" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional · all long</text></svg>' +
      '<div class="chip pt-mv" style="position:absolute;left:170px;top:648px;font-size:26px;padding:10px 22px">Market move <span class="mono pt-mvv" style="font-size:28px">0.0%</span></div>' +
      '<div style="position:absolute;left:1040px;top:200px;display:flex;flex-direction:column;gap:16px">' + rows + '</div>' +
      '<p class="kick" style="position:absolute;left:1040px;top:676px;margin:0;font-size:20px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">100 USDT margin each · before fees</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.pt-k').style; this.t = q('.pt-t'); this.chart = q('.pt-chart').style; this.line = q('.pt-line'); this.dot = q('.pt-dot');
    this.mv = q('.pt-mv').style; this.mvv = q('.pt-mvv');
    this.rows = all('.pt-r').map((e) => e.style); this.pnl = all('.pt-pnl'); this.bar = all('.pt-bar').map((e) => e.style); this.pct = all('.pt-pct');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'present' }, { t: 6.3, pose: 'cheer' }, { t: 12.2, pose: 'confused' }, { t: 19.4, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.chart.opacity = eo(seg(t, 0.6, 1.2));
    UI.rise(kit, this.mv, t, 1.2, 0.6, 16);
    this.rows.forEach((s, i) => UI.rise(kit, s, t, 1.6 + i * 0.4, 0.6, 30));
    let d = '';
    const end = Math.min(t, 24);
    for (let s = 0; s <= end + 1e-6; s += 0.1) d += (s ? 'L' : 'M') + PT_X(s).toFixed(1) + ' ' + PT_Y(ptPrice(s)).toFixed(1);
    this.line.setAttribute('d', d);
    this.dot.setAttribute('cx', PT_X(end).toFixed(1)); this.dot.setAttribute('cy', PT_Y(ptPrice(end)).toFixed(1));
    const price = ptPrice(t), move = (price - 60000) / 60000;
    UI.set(this.mvv, (move > 0.0004 ? '+' : move < -0.0004 ? '−' : '') + Math.abs(move * 100).toFixed(1) + '%  ·  ' + UI.fmt(Math.round(price / 10) * 10));
    this.mvv.style.color = move > 0.0004 ? 'var(--main)' : move < -0.0004 ? 'var(--accent)' : 'var(--second)';
    PT_LEV.forEach((L, i) => {
      const v = 100 * L * move;
      UI.set(this.pnl[i], UI.sgn(v, 2));
      this.pnl[i].style.color = Math.abs(v) < 0.005 ? 'var(--second)' : v > 0 ? 'var(--main)' : 'var(--accent)';
      UI.set(this.pct[i], UI.sgn(v, 0) + '%');
      this.pct[i].style.color = this.pnl[i].style.color;
      const w = Math.min(50, Math.abs(v) / 25 * 50);
      this.bar[i].width = w.toFixed(2) + '%'; this.bar[i].left = (v >= 0 ? 50 : 50 - w).toFixed(2) + '%';
      this.bar[i].background = v >= 0 ? 'var(--main)' : 'var(--accent)';
    });
    // At the end, the market-move chip pulses: it was the same for everyone.
    const hl = Math.sin(Math.PI * seg(t, 19.6, 21.0));
    this.mv.borderColor = 'color-mix(in srgb, var(--main) ' + (30 + 70 * hl).toFixed(0) + '%, transparent)';
    this.mv.transform += ' scale(' + (1 + 0.06 * hl).toFixed(3) + ')';
    this.tutor.render(t);
  },
});
