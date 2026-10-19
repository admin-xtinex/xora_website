const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Fictional BTC price: 60,000, up 2% to 61,200, then down to 58,800 (2% below the start).
const HK_KEYS = [[0, 60000], [5.3, 60000], [7.8, 61200], [10.2, 61200], [12.9, 58800], [20, 58800]];
const hkPrice = (t) => { let v = HK_KEYS[0][1]; for (let i = 1; i < HK_KEYS.length; i++) { const a = HK_KEYS[i - 1], b = HK_KEYS[i]; if (t >= a[0]) v = lerp(a[1], b[1], eio(kit.clamp01((t - a[0]) / (b[0] - a[0])))); } return v; };
const HK_X = (t) => 1250 + Math.min(t, 18) / 18 * 490, HK_Y = (p) => 410 - (p - 58400) / 3200 * 110;
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (cls, x, name, lev, notional) => '<div class="glass ' + cls + '" style="left:' + x + 'px;top:460px;width:780px;height:260px;padding:26px 36px">' +
      '<div style="display:flex;align-items:center;gap:18px"><span style="font-size:32px;font-weight:700">' + name + '</span><span class="chip mono ' + cls + '-lev" style="font-size:28px;padding:8px 22px">' + lev + '</span>' +
      '<span style="margin-left:auto;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Margin <b class="mono" style="color:var(--second)">100 USDT</b></span></div>' +
      '<p style="margin:8px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Position size (notional): <span class="mono" style="color:var(--second)">' + notional + ' USDT</span></p>' +
      '<div style="display:flex;align-items:baseline;gap:20px;margin-top:18px"><span style="font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Profit / loss</span><span class="mono ' + cls + '-pnl" style="font-size:60px">0.00</span><span style="font-size:26px">USDT</span></div>' +
      '<div style="position:absolute;left:36px;right:36px;bottom:26px;height:12px;border-radius:6px;background:color-mix(in srgb, var(--second) 8%, transparent)"><div class="' + cls + '-bar" style="position:absolute;left:50%;top:0;bottom:0;border-radius:6px"></div><div style="position:absolute;left:50%;top:-6px;bottom:-6px;width:2px;background:color-mix(in srgb, var(--second) 40%, transparent)"></div></div></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:960px"><p class="kick hk-k">Two traders, one trade</p>' +
      '<h2 class="line hk-t">Same move. Very different results.</h2></div>' +
      '<div class="glass hk-px" style="left:1220px;top:160px;width:560px;height:270px;padding:22px 30px"><p class="fict" style="margin:0">BTC price · fictional</p>' +
      '<p style="margin:6px 0 0;display:flex;align-items:baseline;gap:16px"><span class="mono hk-p" style="font-size:44px">60,000</span><span class="mono hk-c" style="font-size:28px"></span></p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><line x1="1250" x2="1740" y1="' + HK_Y(60000) + '" y2="' + HK_Y(60000) + '" stroke-dasharray="6 8" stroke-width="2" class="hk-base" style="stroke:color-mix(in srgb, var(--second) 30%, transparent)"/>' +
      '<path class="hk-line" fill="none" stroke-width="4" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="hk-dot" r="8" style="fill:var(--second)"/></svg>' +
      card('hk-a', 140, 'Trader A', '1x', '100') + card('hk-b', 1000, 'Trader B', '10x', '1,000') +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.px = q('.hk-px').style; this.p = q('.hk-p'); this.c = q('.hk-c');
    this.line = q('.hk-line'); this.dot = q('.hk-dot'); this.base = q('.hk-base').style;
    this.cards = [q('.hk-a').style, q('.hk-b').style];
    this.pnl = [q('.hk-a-pnl'), q('.hk-b-pnl')]; this.bar = [q('.hk-a-bar').style, q('.hk-b-bar').style];
    this.lev = [q('.hk-a-lev').style, q('.hk-b-lev').style];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'explain' }, { t: 5.3, pose: 'magnify' }, { t: 10.2, pose: 'confused' }, { t: 15.0, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.px, t, 0.4, 0.7);
    this.base.opacity = eo(seg(t, 0.8, 1.2));
    this.cards.forEach((s, i) => UI.rise(kit, s, t, 1.0 + i * 0.5, 0.7, 40));
    let d = '';
    const end = Math.min(t, 18);
    for (let s = 0; s <= end + 1e-6; s += 0.1) d += (s ? 'L' : 'M') + HK_X(s).toFixed(1) + ' ' + HK_Y(hkPrice(s)).toFixed(1);
    this.line.setAttribute('d', d);
    this.line.style.opacity = this.dot.style.opacity = eo(seg(t, 0.8, 1.2));
    this.dot.setAttribute('cx', HK_X(end).toFixed(1)); this.dot.setAttribute('cy', HK_Y(hkPrice(end)).toFixed(1));
    const price = Math.round(hkPrice(t) / 10) * 10, move = (price - 60000) / 60000;
    UI.set(this.p, UI.fmt(price));
    UI.set(this.c, Math.abs(move) < 0.0005 ? '' : (move > 0 ? '▲ +' : '▼ −') + Math.abs(move * 100).toFixed(1) + '%');
    this.c.style.color = move >= 0 ? 'var(--main)' : 'var(--accent)';
    [100, 1000].forEach((n, i) => {
      const v = n * move;
      UI.set(this.pnl[i], UI.sgn(v, 2));
      this.pnl[i].style.color = Math.abs(v) < 0.005 ? 'var(--second)' : v > 0 ? 'var(--main)' : 'var(--accent)';
      // Bar: half the track = 25% of the margin.
      const w = Math.min(50, Math.abs(v) / 25 * 50);
      this.bar[i].width = w.toFixed(2) + '%'; this.bar[i].left = (v >= 0 ? 50 : 50 - w).toFixed(2) + '%';
      this.bar[i].background = v >= 0 ? 'var(--main)' : 'var(--accent)';
    });
    const hl = eo(seg(t, 15.0, 15.6));
    this.lev.forEach((s, i) => {
      s.background = 'color-mix(in srgb, var(--ground) ' + lerp(88, i ? 30 : 70, hl).toFixed(0) + '%, var(--main))';
      s.borderColor = 'color-mix(in srgb, var(--main) ' + lerp(30, 100, hl).toFixed(0) + '%, transparent)';
      s.transform = 'scale(' + (1 + (i ? 0.12 : 0.05) * Math.sin(Math.PI * seg(t, 15.0, 15.8))).toFixed(3) + ')';
    });
    this.tutor.render(t);
  },
});
