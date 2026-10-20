const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Leverage = notional ÷ margin. The 1,000 USDT notional stays; the margin shrinks at 2x, 5x, 10x; the loss at the stop stays about 10 USDT.
const LV = [[2, 500, 7.4], [5, 200, 9.2], [10, 100, 11.0]];
kit.scene('leverage', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const chips = LV.map((l) => '<span class="chip mono lv-c" style="font-size:30px;padding:8px 26px">' + l[0] + 'x</span>').join('');
    this.h = UI.head(kit, 'Leverage exposure', 'Smaller margin, same loss at the stop',
      '<div class="glass lv-d" style="left:140px;top:300px;width:800px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:30px"><b>Leverage</b> = notional ÷ margin. A small margin controls a bigger notional.</p></div>' +
      '<div class="glass lv-b" style="left:140px;top:480px;width:800px;height:270px;padding:18px 30px">' +
      '<div style="display:flex;justify-content:space-between;font-size:28px;margin-bottom:8px"><span>Notional</span><span class="mono">1,000 USDT</span></div>' + UI.bar('lv-n', 740, 30) +
      '<div style="display:flex;justify-content:space-between;font-size:28px;margin:22px 0 8px"><span>Margin used</span><span class="mono"><span class="lv-m">500</span> USDT</span></div>' + UI.bar('lv-g', 740, 30, 'var(--accent)') +
      '<div style="display:flex;gap:14px;margin-top:22px">' + chips + '</div></div>' +
      '<div class="glass lv-l" style="left:980px;top:300px;width:800px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Loss if the 1% stop is hit</p>' +
      '<p class="mono" style="margin:0;font-size:56px;color:var(--down)">≈ −10 USDT</p><p class="lv-s" style="margin:8px 0 0;font-size:28px;font-weight:600">Same at 2x, 5x and 10x: notional × stop distance.</p></div>' +
      '<div class="glass lv-w" style="left:980px;top:556px;width:800px;padding:20px 30px;border-color:var(--accent)"><p class="kick" style="margin:0 0 8px;color:var(--accent)">The danger</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.35;font-weight:600">Huge positions become easy to open, and liquidation comes closer.</p></div>');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.d = q('.lv-d').style; this.b = q('.lv-b').style; this.n = q('.lv-n-f').style; this.g = q('.lv-g-f').style; this.m = q('.lv-m');
    this.cs = all('.lv-c').map((e) => e.style); this.l = q('.lv-l').style; this.s = q('.lv-s').style; this.w = q('.lv-w').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 7.0, pose: 'point' }, { t: 12.8, pose: 'idea' }, { t: 19.6, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.d, t, 0.6, 0.7);
    UI.rise(kit, this.b, t, 3.0, 0.7);
    this.n.width = (eo(seg(t, 3.4, 4.4)) * 100).toFixed(1) + '%';
    // Margin steps through 500, 200, 100 as each leverage chip lights.
    let m = 500, on = -1;
    LV.forEach((l, i) => { if (t >= l[2]) on = i; });
    for (let i = 1; i < LV.length; i++) m = lerp(m, LV[i][1], eio(seg(t, LV[i][2], LV[i][2] + 0.7)));
    const gp = eo(seg(t, LV[0][2], LV[0][2] + 0.7));
    this.g.width = (gp * m / 1000 * 100).toFixed(2) + '%'; UI.set(this.m, gp > 0 ? UI.fmt(Math.round(m)) : '—');
    this.cs.forEach((s, i) => { const lit = i === on; s.background = lit ? 'var(--main)' : ''; s.color = lit ? 'var(--ground)' : ''; s.opacity = t >= 6.8 ? 1 : eo(seg(t, 3.6 + i * 0.3, 4.0 + i * 0.3)) * 0.6 + 0.0; });
    UI.rise(kit, this.l, t, 12.8, 0.6);
    UI.rise(kit, this.s, t, 14.4, 0.5, 10);
    UI.rise(kit, this.w, t, 19.6, 0.6);
    this.tutor.render(t);
  },
});
