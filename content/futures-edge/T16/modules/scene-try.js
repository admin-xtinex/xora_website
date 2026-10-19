const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// [letter, pivots, labels, answer, colour, answer at]
const TY = [['A', [60300, 60150, 60240, 60080, 60170, 59990, 60060], ['', 'L', 'LH', 'LL', 'LH', 'LL', ''], 'Downtrend', 'var(--down)', 10.4],
  ['B', [60100, 60200, 60010, 60190, 59995, 60205, 60100], ['', 'H', 'L', '≈H', '≈L', '≈H', ''], 'Sideways', 'var(--main)', 14.1],
  ['C', [59950, 60100, 60000, 60180, 60080, 60280, 60200], ['', 'H', 'HL', 'HH', 'HL', 'HH', ''], 'Uptrend', 'var(--up)', 18.1]];
const TY_W = 470, TY_CD = 5.0;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ring = UI.ring(kit, 'ty-ring', 1730, 500);
    let svg = '', html = '';
    this.base = []; this.over = [];
    TY.forEach((c, k) => {
      const x = 140 + k * (TY_W + 20), yOf = (p) => 650 - (p - 59950) / 370 * 250;
      const b = UI.swing(kit, 'ty-b' + k, { pv: c[1], x0: x + 50, dx: 62, yOf, lab: [], t0: 0.8 + k * 0.5, t1: 2.6 + k * 0.5, wig: 4 });
      const o = UI.swing(kit, 'ty-o' + k, { pv: c[1], x0: x + 50, dx: 62, yOf, lab: c[2], t0: c[5], t1: c[5] + 1.0, conf: false, wig: 4, fs: 20 });
      this.base.push(b); this.over.push(o);
      html += '<div class="glass ty-p" style="left:' + x + 'px;top:340px;width:' + TY_W + 'px;height:400px"><p class="line" style="position:absolute;left:24px;top:14px;margin:0;font-size:64px">' + c[0] + '</p></div>' +
        '<p class="chip ty-a" style="position:absolute;left:' + (x + TY_W / 2) + 'px;top:676px;margin:0;font-size:28px;padding:10px 24px;transform:translateX(-50%);border-color:' + c[4] + ';color:' + c[4] + '">' + c[3] + '</p>';
      svg += b.html + o.html.replace('style="stroke:var(--second)"', 'style="stroke:' + c[4] + '"');
    });
    kit.stage.append(kit.h('<div class="ground">' + html +
      '<svg class="art" viewBox="0 0 1920 1080">' + svg + this.ring.html + '</svg>' + this.over.map((o) => o.tags).join('') +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick ty-k">Your turn</p>' +
      '<h2 class="line ty-t">Up, down or sideways?</h2></div>' +
      '<p class="fict" style="position:absolute;left:140px;top:306px;margin:0">Three fictional charts · same timeframe</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ty-k').style; this.t = q('.ty-t'); this.ps = all('.ty-p').map((e) => e.style); this.as = all('.ty-a').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: TY_CD, pose: 'think' }, { t: 10.4, pose: 'checklist' }, { t: 21.9, pose: 'celebrate' }],
      says: [{ t0: 22.1, t1: 25.6, text: 'Nicely done!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.ps.forEach((s, k) => UI.rise(s, t, 0.5 + k * 0.3));
    this.base.forEach((b) => b.render(t));
    this.over.forEach((o) => o.render(t));
    this.as.forEach((s, k) => { UI.rise(s, t, TY[k][5] + 0.8, { s: 0.9 }); s.transform += ' translateX(-50%)'; });
    const show = eo(seg(t, TY_CD - 0.6, TY_CD)) * (1 - ei(seg(t, 10.0, 10.4)));
    this.ring.render(t, TY_CD, 5, show);
    this.tutor.render(t);
  },
});
