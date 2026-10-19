const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MA_A = [[60010, 0.20], [60020, 0.50], [60030, 0.70], [60040, 0.30]], MA_B = [[60000, 0.10], [59990, 0.30], [59980, 0.20], [59970, 0.40]];
const MA_F1 = 9.6, MA_F2 = 13.6, MA_TOT = 17.8;
kit.scene('match', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick ma-k">Matching</p>' +
      '<h2 class="line ma-t">When prices meet, a trade happens</h2></div>' +
      '<div class="glass ma-o" style="left:140px;top:440px;width:820px;padding:16px 28px;display:flex;align-items:center;gap:20px;border-color:var(--main)">' +
      '<span class="chip" style="font-size:26px;padding:8px 20px;background:var(--main);color:var(--ground);border-color:var(--main)">BUY</span>' +
      '<span class="mono" style="font-size:34px">0.30 BTC</span><span style="font-size:28px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">pay up to</span><span class="mono" style="font-size:34px">60,020</span></div>' +
      '<div class="glass ma-f" style="left:140px;top:560px;width:820px;padding:18px 28px;display:flex;flex-direction:column;gap:10px">' +
      '<p class="mono ma-f1" style="margin:0;font-size:30px">0.20 BTC × 60,010 = 12,002 USDT</p>' +
      '<p class="mono ma-f2" style="margin:0;font-size:30px">0.10 BTC × 60,020 =  6,002 USDT</p>' +
      '<p class="mono ma-f3" style="margin:0;font-size:30px;padding-top:10px;border-top:1.5px solid color-mix(in srgb, var(--second) 15%, transparent)">Total 0.30 BTC = <span class="hl">18,004 USDT</span></p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><circle class="ma-dot" r="14" style="fill:var(--main)"/></svg>' +
      '<p class="fict" style="position:absolute;left:1060px;top:716px;margin:0">Educational mock · fictional prices</p>' +
      '</div>'));
    this.b = UI.book(kit, { x: 1060, y: 180, w: 600 });
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ma-k').style; this.t = q('.ma-t'); this.o = q('.ma-o').style; this.f = q('.ma-f').style;
    this.f1 = q('.ma-f1').style; this.f2 = q('.ma-f2').style; this.f3 = q('.ma-f3').style; this.dot = q('.ma-dot');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'explain' }, { t: 5.0, pose: 'point', flip: true }, { t: 9.6, pose: 'magnify' }, { t: 17.8, pose: 'cheer' }, { t: 19.4, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.b.el.style.opacity = eo(seg(t, 0.3, 0.9));
    const o = seg(t, 5.0, 5.6);
    this.o.opacity = eo(o); this.o.transform = 'translateX(' + lerp(-30, 0, eo(o)) + 'px)';
    this.f.opacity = eo(seg(t, MA_F1, MA_F1 + 0.4));
    this.f1.opacity = eo(seg(t, MA_F1 + 0.6, MA_F1 + 1.0)); this.f2.opacity = eo(seg(t, MA_F2 + 0.6, MA_F2 + 1.0)); this.f3.opacity = eo(seg(t, MA_TOT, MA_TOT + 0.5));
    // Fill 1 empties the 60,010 ask, which then leaves; fill 2 takes 0.10 of the 60,020 ask.
    const e1 = eio(seg(t, MA_F1, MA_F1 + 0.8)), gone = eio(seg(t, MA_F1 + 1.0, MA_F1 + 1.6)), e2 = eio(seg(t, MA_F2, MA_F2 + 0.8));
    const hl1 = Math.sin(Math.PI * seg(t, MA_F1 - 0.2, MA_F1 + 1.2)), hl2 = Math.sin(Math.PI * seg(t, MA_F2 - 0.2, MA_F2 + 1.2));
    const asks = MA_A.map((a, i) => {
      let q = a[1], op = 1, hl = 0;
      if (i === 0) { q = lerp(0.20, 0, e1); op = 1 - gone; hl = hl1; }
      if (i === 1) { q = lerp(0.50, 0.40, e2); hl = hl2; }
      return { p: a[0], q, pos: i - gone, op, hl };
    });
    const bids = MA_B.map((b, i) => ({ p: b[0], q: b[1], pos: i }));
    const mid = t >= MA_TOT ? 'Last trade: 60,020 USDT' : t >= MA_F1 + 1.6 ? 'Spread: 20 USDT' : 'Spread: 10 USDT';
    this.b.render(asks, bids, mid, t >= MA_TOT ? 'var(--main)' : 'var(--second)');
    // The buy order travels to each ask it fills.
    const fly = (a) => seg(t, a - 0.6, a);
    let p = 0, ty = 0;
    if (t < MA_F2 - 1) { p = fly(MA_F1); ty = this.b.rowY('a', 0) + 20; } else { p = fly(MA_F2); ty = this.b.rowY('a', 0) + 20; }
    const sx = 960, sy = 476, ex = 1100;
    this.dot.setAttribute('cx', lerp(sx, ex, eio(p)).toFixed(1)); this.dot.setAttribute('cy', (lerp(sy, ty, eio(p)) - Math.sin(Math.PI * p) * 60).toFixed(1));
    this.dot.style.opacity = p > 0 && p < 1 ? 1 : 0;
    this.tutor.render(t);
  },
});
