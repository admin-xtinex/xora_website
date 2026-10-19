const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const CP_COLS = [
  ['Market', 'Right now', 'Not fixed', 'Usually fills, if the book has orders', 0.6],
  ['Limit', 'At your price or better', 'You set it', 'May fill late, in part, or never', 5.8],
  ['Stop', 'After the trigger', 'Not fixed once triggered', 'Can fill well past the trigger', 11.6],
];
const CP_ROWS = ['When it acts', 'Price', 'Fill'];
kit.scene('compare', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cols = '';
    CP_COLS.forEach((c, i) => {
      cols += '<div class="glass cp-c" style="left:' + (520 + i * 420) + 'px;top:300px;width:396px;height:470px;padding:26px 28px">' +
        '<p style="margin:0 0 18px;font-family:var(--display);font-size:44px;font-weight:700;color:var(--main)">' + c[0] + '</p>' +
        c.slice(1, 4).map((v, j) => '<p class="cp-v" style="margin:0;height:' + (j === 2 ? 130 : 110) + 'px;font-size:28px;line-height:1.35;font-weight:600">' + v + '</p>').join('') + '</div>';
    });
    let rows = '';
    CP_ROWS.forEach((r, j) => { rows += '<p class="kick" style="position:absolute;left:140px;top:' + (402 + j * 110) + 'px;margin:0;font-size:24px">' + r + '</p>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1500px"><p class="kick cp-k">Side by side</p>' +
      '<h2 class="line cp-t">Three orders, three trade-offs</h2></div>' +
      '<div class="cp-rows">' + rows + '</div>' + cols +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.cp-k').style; this.t = q('.cp-t'); this.rows = q('.cp-rows').style;
    this.cols = all('.cp-c').map((e) => e.style); this.vs = all('.cp-v').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.5, pose: 'checklist' }, { t: 11.6, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.rows.opacity = eo(seg(t, 0.4, 0.9));
    let cur = -1;
    CP_COLS.forEach((c, i) => { if (t >= c[4]) cur = i; });
    this.cols.forEach((s, i) => {
      const a = CP_COLS[i][4];
      UI.rise(s, t, a - 0.2);
      const on = i === cur ? eo(seg(t, a, a + 0.4)) : 0;
      s.borderColor = 'color-mix(in srgb, var(--main) ' + (22 + on * 60).toFixed(0) + '%, transparent)';
      s.background = on > 0 ? 'linear-gradient(180deg, color-mix(in srgb, var(--ground) ' + (82 - on * 8).toFixed(1) + '%, var(--main)), color-mix(in srgb, var(--ground) 94%, var(--second)))' : '';
      for (let j = 0; j < 3; j++) { const v = this.vs[i * 3 + j], b = a + 0.3 + j * 0.5; v.opacity = eo(seg(t, b, b + 0.4)); v.transform = 'translateX(' + lerp(20, 0, eo(seg(t, b, b + 0.5))).toFixed(1) + 'px)'; }
    });
    this.tutor.render(t);
  },
});
