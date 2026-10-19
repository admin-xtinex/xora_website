const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Minute-by-minute board: [time, price, appears at t].
const HK_ROWS = [['10:00', 60000, 1.0], ['10:01', 60450, 5.2], ['10:02', 59820, 7.2], ['10:03', 60210, 9.0]];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    HK_ROWS.forEach((r, i) => {
      const d = i ? r[1] - HK_ROWS[i - 1][1] : 0;
      rows += '<div class="hk-row" style="display:flex;align-items:center;gap:26px;padding:16px 24px;border-radius:18px">' +
        '<span class="mono" style="width:110px;font-size:28px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">' + r[0] + '</span>' +
        '<span class="mono" style="flex:1;font-size:40px">' + UI.fmt(r[1]) + '</span>' +
        '<span class="mono" style="width:150px;text-align:right;font-size:28px;color:' + (d >= 0 ? 'var(--main)' : 'var(--accent)') + '">' + (i ? (d > 0 ? '▲ +' : '▼ −') + UI.fmt(Math.abs(d)) : '') + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:800px"><p class="kick hk-k">A puzzle</p>' +
      '<h2 class="line hk-t">Same coin, a different price</h2>' +
      '<p class="sub hk-s">A minute later, BTC costs something else. Who decided that?</p></div>' +
      '<div class="chip hk-c" style="position:absolute;left:140px;top:660px;background:var(--main);color:var(--ground);border-color:var(--main)">Buyers and sellers</div>' +
      '<div class="glass hk-board" style="left:1000px;top:180px;width:640px;padding:30px 26px">' +
      '<p style="margin:0 24px 4px;font-size:30px;font-weight:700">BTC / USDT</p><p class="fict" style="margin:0 24px 18px">Fictional prices · minute by minute</p>' +
      '<div style="display:flex;flex-direction:column;gap:4px">' + rows + '</div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.s = q('.hk-s'); this.c = q('.hk-c').style; this.board = q('.hk-board').style;
    this.rows = [...kit.stage.querySelectorAll('.hk-row')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'candles', flip: true }, { t: 0.6, pose: 'point', flip: true }, { t: 5.2, pose: 'think' }, { t: 10.6, pose: 'idea' }],
      says: [{ t0: 10.8, t1: 13.7, text: 'Let us meet them.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 5.6, { stagger: 0.07 });
    const b = seg(t, 0.4, 1.2);
    this.board.opacity = eo(b);
    this.board.transform = 'translateY(' + (lerp(50, 0, eo(b)) - t * 1.2).toFixed(2) + 'px)';
    let cur = 0;
    HK_ROWS.forEach((r, i) => { if (t >= r[2]) cur = i; });
    this.rows.forEach((s, i) => {
      const a = HK_ROWS[i][2], p = seg(t, a, a + 0.5);
      s.opacity = eo(p) * (i === cur ? 1 : 0.55);
      s.transform = 'translateX(' + lerp(30, 0, eo(p)) + 'px)';
      s.background = i === cur ? 'color-mix(in srgb, var(--main) 12%, transparent)' : 'transparent';
    });
    const c = seg(t, 10.6, 11.2);
    this.c.opacity = eo(seg(t, 10.6, 10.9));
    this.c.transform = 'scale(' + lerp(0.8, 1, eob(c, 1.7)) + ')';
    this.c.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
