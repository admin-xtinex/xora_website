const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// BTC falls 10% (fictional): 60,000 → 54,000. Margin 100 USDT in both cases.
kit.scene('both', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (cls, lev, notional) => '<div class="glass ' + cls + '" style="position:relative;width:960px;height:150px;padding:18px 30px">' +
      '<div style="display:flex;align-items:baseline;gap:16px"><span class="chip mono" style="font-size:28px;padding:6px 20px">' + lev + '</span><span style="font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">notional <span class="mono" style="color:var(--second)">' + notional + ' USDT</span></span>' +
      '<span style="margin-left:auto;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">loss</span><span class="mono ' + cls + '-l" style="font-size:40px;color:var(--accent)">0</span></div>' +
      '<div style="position:absolute;left:30px;right:200px;bottom:26px;height:34px;border-radius:10px;border:2px dashed color-mix(in srgb, var(--second) 25%, transparent)"><div class="' + cls + '-f" style="position:absolute;left:0;top:0;bottom:0;border-radius:8px;background:var(--main)"></div></div>' +
      '<span class="mono ' + cls + '-v" style="position:absolute;right:30px;bottom:24px;font-size:30px">100 left</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:960px"><p class="kick bo-k" style="color:var(--accent)">Both directions</p>' +
      '<h2 class="line bo-t" style="font-size:72px">A bigger fall, magnified</h2></div>' +
      '<div class="glass bo-px" style="left:1180px;top:160px;width:600px;padding:22px 30px"><p class="fict" style="margin:0 0 6px">BTC price · fictional</p>' +
      '<p style="margin:0;display:flex;align-items:baseline;gap:18px"><span class="mono bo-p" style="font-size:52px">60,000</span><span class="mono bo-c" style="font-size:30px;color:var(--accent)"></span></p></div>' +
      '<div style="position:absolute;left:140px;top:350px;display:flex;flex-direction:column;gap:20px">' + row('bo-a', '1x', '100') + row('bo-b', '10x', '1,000') + '</div>' +
      '<p class="kick bo-n" style="position:absolute;left:140px;top:700px;margin:0;font-size:20px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">Bar = margin left, on paper · before fees</p>' +
      '<div class="glass bo-liq" style="left:1180px;top:350px;width:600px;padding:24px 32px;border-color:var(--accent)"><p class="kick" style="margin:0 0 10px;color:var(--accent)">In reality · liquidation</p>' +
      '<p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">The exchange closes the position <b style="color:var(--accent)">before</b> your margin reaches zero.</p>' +
      '<p class="bo-rule" style="margin:14px 0 0;font-size:28px;line-height:1.4;font-weight:600;border-radius:10px">Exactly where depends on its rules, fees and position size. More in T13.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.bo-k').style; this.t = q('.bo-t'); this.px = q('.bo-px').style; this.p = q('.bo-p'); this.c = q('.bo-c');
    this.rows = [q('.bo-a').style, q('.bo-b').style]; this.n = q('.bo-n').style;
    this.l = [q('.bo-a-l'), q('.bo-b-l')]; this.f = [q('.bo-a-f').style, q('.bo-b-f').style]; this.v = [q('.bo-a-v'), q('.bo-b-v')];
    this.liq = q('.bo-liq').style; this.rule = q('.bo-rule').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 4.5, pose: 'magnify' }, { t: 11.6, pose: 'explain' }, { t: 17.9, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.px, t, 0.6, 0.7);
    this.rows.forEach((s, i) => UI.rise(kit, s, t, 1.2 + i * 0.4, 0.6));
    this.n.opacity = 0.9 * eo(seg(t, 2.2, 2.8));
    // The fall plays out from 4.6 to 9.6: price −10%, the 1x margin loses 10, the 10x margin loses all 100 on paper.
    const fall = eio(seg(t, 4.6, 9.6)), move = -0.10 * fall;
    UI.set(this.p, UI.fmt(Math.round((60000 * (1 + move)) / 10) * 10));
    UI.set(this.c, fall > 0.01 ? '▼ −' + Math.abs(move * 100).toFixed(1) + '%' : '');
    [100, 1000].forEach((n, i) => {
      const loss = Math.min(100, -n * move), left = 100 - loss;
      UI.set(this.l[i], loss > 0.05 ? '−' + UI.fmt(loss, 0) + ' USDT' : '0');
      this.f[i].width = left.toFixed(2) + '%';
      this.f[i].background = left > 60 ? 'var(--main)' : 'var(--accent)';
      UI.set(this.v[i], UI.fmt(left, 0) + ' left');
      this.v[i].style.color = left < 1 ? 'var(--accent)' : 'var(--second)';
    });
    UI.rise(kit, this.liq, t, 11.6, 0.7);
    const hl = eo(seg(t, 17.9, 18.5));
    this.rule.background = 'color-mix(in srgb, var(--accent) ' + (hl * 16).toFixed(1) + '%, transparent)';
    this.rule.outline = hl > 0 ? '6px solid color-mix(in srgb, var(--accent) ' + (hl * 16).toFixed(1) + '%, transparent)' : 'none';
    this.tutor.render(t);
  },
});
