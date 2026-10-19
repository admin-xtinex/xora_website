const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const PL_ROWS = [['Entry', 'where you get in', 'var(--second)', 1.4], ['Stop-loss', 'where you get out if you are wrong', 'var(--accent)', 3.2], ['Take-profit', 'where you take the gain', 'var(--main)', 5.2]];
kit.scene('plan', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.P = UI.plan('pl-c', { x0: 1000, x1: 1580, y0: 260, y1: 720, lo: 58500, hi: 61500, step: 500,
      zones: [['zr', 59400, 60000, 'var(--accent)'], ['zw', 60000, 61200, 'var(--main)'], ['zr2', 60000, 60600, 'var(--accent)'], ['zw2', 58800, 60000, 'var(--main)']],
      levels: [['e', 60000, 'Entry 60,000', 'var(--second)'], ['s', 59400, 'Stop-loss 59,400', 'var(--accent)', 'right', 'below'], ['t', 61200, 'Take-profit 61,200', 'var(--main)'],
        ['s2', 60600, 'Stop-loss 60,600', 'var(--accent)'], ['t2', 58800, 'Take-profit 58,800', 'var(--main)', 'right', 'below']] });
    let rows = '';
    PL_ROWS.forEach((r) => {
      rows += '<div class="pl-r" style="display:flex;align-items:center;gap:22px;padding:14px 0"><span style="flex:none;width:44px;height:5px;border-radius:3px;background:' + r[2] + '"></span>' +
        '<span style="font-size:32px"><b style="color:' + r[2] + '">' + r[0] + '</b>: ' + r[1] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.P.svg +
      '<text x="1000" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional</text></svg>' +
      '<span class="chip pl-side" style="position:absolute;left:1000px;top:150px;font-size:28px;padding:10px 26px"><span class="pl-sl" style="color:var(--main)">LONG</span></span>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick pl-k">The trade plan</p>' +
      '<h2 class="line pl-t">Three prices, decided first</h2></div>' +
      '<div class="glass pl-list" style="left:140px;top:420px;width:820px;padding:16px 36px">' + rows + '</div>' +
      '<div class="glass pl-sh" style="left:140px;top:680px;width:820px;padding:20px 36px;border-color:var(--accent)"><p style="margin:0;font-size:30px;font-weight:600"><b style="color:var(--accent)">Short:</b> stop-loss above, take-profit below.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.pl-k').style; this.t = q('.pl-t'); this.list = q('.pl-list').style; this.rows = all('.pl-r').map((e) => e.style);
    this.sh = q('.pl-sh').style; this.side = q('.pl-side').style; this.sl = q('.pl-sl');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.5, pose: 'checklist' }, { t: 8.2, pose: 'point', flip: true }, { t: 13.5, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.list, t, 0.8);
    this.rows.forEach((s, i) => { const a = PL_ROWS[i][3]; s.opacity = eo(seg(t, a, a + 0.4)); s.transform = 'translateX(' + lerp(24, 0, eo(seg(t, a, a + 0.5))).toFixed(1) + 'px)'; });
    const flip = seg(t, 14.0, 14.8), out = 1 - ei(flip);
    this.P.show(kit, { _: eo(seg(t, 0.3, 0.9)), e: seg(t, 8.4, 9.2), s: seg(t, 9.6, 10.4) * out, t: seg(t, 10.8, 11.6) * out, zr: seg(t, 11.6, 12.2) * out * 0.6, zw: seg(t, 11.6, 12.2) * out * 0.6,
      s2: seg(t, 14.8, 15.6), t2: seg(t, 15.4, 16.2), zr2: seg(t, 16.2, 16.8) * 0.6, zw2: seg(t, 16.2, 16.8) * 0.6 });
    this.side.opacity = eo(seg(t, 8.4, 8.9));
    UI.txt(this.sl, t < 14.4 ? 'LONG' : 'SHORT');
    this.sl.style.color = t < 14.4 ? 'var(--main)' : 'var(--accent)';
    this.side.transform = 'scale(' + (1 + 0.12 * Math.sin(Math.PI * seg(t, 14.0, 14.8))).toFixed(3) + ')';
    UI.rise(this.sh, t, 14.2);
    this.tutor.render(t);
  },
});
