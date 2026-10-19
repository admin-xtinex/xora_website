const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TY = UI.M1.slice(10, 15), TYR = UI.agg(TY);
const TY_CD = 5.6, TY_X = (i) => 250 + i * 70, TY_RX = 740, tyY = (p) => 760 - (p - 59970) / 220 * 200;
// [column, source row, reveal at]
const TY_ANS = [[1, 0, 11.0], [4, 4, 12.0], [2, 4, 15.7], [3, 0, 16.6]];
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'ty-c', 6);
    this.ring = UI.ring(kit, 'ty-ring', TY_RX, 662);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass ty-q" style="left:140px;top:300px;width:780px;padding:24px 34px"><p class="fict" style="margin:0 0 10px">Question · fictional 1-minute candles</p>' +
      '<p class="def" style="margin:0">Combine these five 1-minute candles. What are the <b>5-minute</b> open, high, low and close?</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.cd.html + this.ring.html + '</svg>' +
      '<div class="glass ty-card" style="left:1000px;top:300px;width:680px;height:450px"></div>' +
      UI.otab('ty-t', 1020, 318, 640, TY.map((c, i) => [UI.hm(i + 10)].concat(c)), '5m') +
      '<p class="tag ty-ok" style="left:' + (TY_RX - 70) + 'px;top:' + (tyY(TYR[1]) - 58).toFixed(1) + 'px;border-color:var(--up);color:var(--up)">5m · up</p>' +
      '<div class="words" style="left:140px;top:170px;width:900px"><p class="kick ty-k">Your turn</p>' +
      '<h2 class="line ty-t">Pause and combine</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ty-k').style; this.t = q('.ty-t'); this.qc = q('.ty-q').style; this.card = q('.ty-card').style; this.tab = q('.ty-t').style; this.ok = q('.ty-ok').style;
    this.cells = all('.ty-t-c');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: TY_CD, pose: 'think' }, { t: 11.0, pose: 'checklist' }, { t: 20.4, pose: 'celebrate' }],
      says: [{ t0: 20.8, t1: 24.6, text: 'Great work!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.qc, t, 0.6);
    UI.rise(this.card, t, 1.0); this.tab.opacity = eo(seg(t, 1.2, 1.6));
    TY.forEach((c, i) => {
      const p = seg(t, 1.6 + i * 0.3, 2.1 + i * 0.3);
      this.cd.set(i, { x: TY_X(i), w: 40, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: tyY, op: eo(p) });
    });
    const show = eo(seg(t, TY_CD - 0.6, TY_CD)) * (1 - ei(seg(t, 10.6, 11.0)));
    this.ring.render(t, TY_CD, 5, show);
    this.cells.forEach((e) => { e.style.background = 'transparent'; e.style.color = ''; });
    TY_ANS.forEach((a) => {
      const [col, row, at] = a, p = seg(t, at, at + 0.5);
      const src = this.cells[row * 5 + col], out = this.cells[25 + col];
      if (t >= at) { src.style.background = 'color-mix(in srgb, var(--main) 24%, transparent)'; src.style.color = 'var(--main)'; }
      UI.txt(out, t >= at ? UI.fmt(TYR[col - 1]) : '?');
      out.style.color = t >= at ? 'var(--main)' : 'color-mix(in srgb, var(--second) 40%, var(--ground))';
      out.style.transform = 'scale(' + lerp(0.85, 1, eob(p, 1.6)).toFixed(3) + ')';
    });
    const f = eob(seg(t, 20.4, 21.4), 1.3);
    this.cd.set(5, { x: TY_RX, w: lerp(20, 90, f), o: TYR[0], h: TYR[1], l: TYR[2], c: lerp(TYR[0], TYR[3], f), y: tyY, op: eo(seg(t, 20.4, 20.8)) });
    UI.rise(this.ok, t, 21.2);
    this.tutor.render(t);
  },
});
