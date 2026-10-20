const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The TRADE PLAN maths: size = margin × leverage, risk = size × stop distance.
const PL_ROWS = [['Direction', 'BUY', 'var(--up)'], ['Entry', '60,000'], ['Stop', '59,700', 'var(--down)'], ['Size', '30 USDT', null, 'pl-sz'], ['Risk', '0.50% · 0.15 USDT', null, 'pl-rk'], ['Next level', '2.0 R', 'var(--up)'], ['Exit', 'Fixed take profit · 2× risk']];
kit.scene('plan', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    PL_ROWS.forEach((r) => {
      rows += '<div class="pl-row ' + (r[3] || '') + '" style="display:flex;justify-content:space-between;align-items:baseline;padding:11px 12px;border-radius:12px;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)">' +
        '<span style="font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + r[0] + '</span><span class="mono" style="font-size:28px;' + (r[2] ? 'color:' + r[2] : '') + '">' + r[1] + '</span></div>';
    });
    const step = (cls, a, b) => '<div class="glass ' + cls + '" style="position:relative;width:820px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">' + a + '</p><p class="mono" style="margin:0;font-size:40px">' + b + '</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:860px"><p class="kick pl-k">Worked example</p><h2 class="line pl-t">The trade plan maths</h2></div>' +
      '<div style="position:absolute;left:140px;top:360px;display:flex;flex-direction:column;gap:18px">' +
      step('pl-s1', 'Size = margin × leverage', '3 USDT × 10 = <span class="pl-n1" style="color:var(--main)">30</span> USDT') +
      step('pl-s2', 'Risk = size × stop distance', '30 × 0.50% = <span class="pl-n2" style="color:var(--down)">0.15</span> USDT') +
      '<p class="pl-w" style="margin:0;font-size:28px;font-weight:600;color:var(--warn)">+ fees. Slippage can make the loss bigger.</p></div>' +
      '<div class="glass pl-c" style="left:1060px;top:170px;width:720px;padding:22px 26px"><p class="card-h" style="margin:0 0 8px">TRADE PLAN</p>' + rows + '</div>' +
      '</div>'));
    UI.mockLabel(kit, 1060, 132);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.pl-k').style; this.t = q('.pl-t'); this.c = q('.pl-c').style; this.ml = q('.mock').style;
    this.s1 = q('.pl-s1').style; this.s2 = q('.pl-s2').style; this.n1 = q('.pl-n1'); this.n2 = q('.pl-n2'); this.w = q('.pl-w').style;
    this.sz = q('.pl-sz').style; this.rk = q('.pl-rk').style;
    this.rows = [...kit.stage.querySelectorAll('.pl-row')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 6.4, pose: 'checklist' }, { t: 11.8, pose: 'think' }, { t: 16.3, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.c, t, 0.4, 0.7, 30);
    this.ml.opacity = 0.9 * eo(seg(t, 0.9, 1.5));
    this.rows.forEach((s, i) => { s.opacity = eo(seg(t, 0.8 + i * 0.25, 1.2 + i * 0.25)); });
    UI.rise(kit, this.s1, t, 1.4, 0.6, 20);
    UI.set(this.n1, t < 6.6 ? '?' : String(Math.round(lerp(0, 30, eo(seg(t, 6.6, 7.6))))));
    UI.rise(kit, this.s2, t, 11.8, 0.6, 20);
    UI.set(this.n2, t < 12.6 ? '?' : lerp(0, 0.15, eo(seg(t, 12.6, 13.6))).toFixed(2));
    UI.rise(kit, this.w, t, 16.4, 0.6, 14);
    const h1 = Math.max(0, Math.sin(Math.PI * seg(t, 6.6, 11.6))), h2 = Math.max(0, Math.sin(Math.PI * seg(t, 12.6, 22.6)));
    this.sz.background = 'color-mix(in srgb, var(--main) ' + (h1 * 18).toFixed(1) + '%, transparent)';
    this.rk.background = 'color-mix(in srgb, var(--down) ' + (h2 * 18).toFixed(1) + '%, transparent)';
    this.tutor.render(t);
  },
});
