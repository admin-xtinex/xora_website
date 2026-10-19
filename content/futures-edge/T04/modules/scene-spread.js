const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SP_A = [[60010, 0.20], [60020, 0.50], [60030, 0.70], [60040, 0.30]], SP_B = [[59990, 0.30], [59980, 0.20], [59970, 0.40], [59960, 0.90]];
const SP_NEW = 9.4; // a new buy order at 60,000 arrives
kit.scene('spread', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick sp-k">Spread</p>' +
      '<h2 class="line sp-t">The gap between them</h2>' +
      '<p class="def sp-d">The <b>spread</b> is the ask minus the bid.</p></div>' +
      '<div class="glass sp-w" style="left:140px;top:440px;width:820px;padding:22px 32px;display:flex;flex-direction:column;gap:12px"><p class="fict" style="margin:0">Worked example · fictional prices</p>' +
      '<p class="mono sp-w1" style="margin:0;font-size:38px">60,010 − 59,990 = <span class="hl">20 USDT</span></p>' +
      '<p class="mono sp-w2" style="margin:0;font-size:38px">60,010 − 60,000 = <span class="hl">10 USDT</span></p></div>' +
      '<div class="glass sp-q" style="left:140px;top:640px;width:820px;padding:18px 32px;border-color:var(--accent)"><p class="kick" style="margin:0 0 6px;color:var(--accent)">Quiet market, few orders</p>' +
      '<p class="mono" style="margin:0;font-size:32px">60,100 − 59,900 = <span class="hv">200 USDT</span></p></div>' +
      '<p class="fict" style="position:absolute;left:1060px;top:716px;margin:0">Educational mock · fictional prices</p>' +
      '</div>'));
    this.b = UI.book(kit, { x: 1060, y: 180, w: 600 });
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sp-k').style; this.t = q('.sp-t'); this.d = q('.sp-d'); this.w = q('.sp-w').style; this.w1 = q('.sp-w1').style; this.w2 = q('.sp-w2').style; this.qc = q('.sp-q').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 5.2, pose: 'checklist' }, { t: 9.0, pose: 'point', flip: true }, { t: 15.4, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    this.b.el.style.opacity = eo(seg(t, 0.2, 0.8));
    const n = eio(seg(t, SP_NEW, SP_NEW + 0.7)), hl = eo(seg(t, 1.2, 1.8));
    const bids = [{ p: 60000, q: 0.10, pos: -0.8 + 0.8 * n, op: eo(seg(t, SP_NEW, SP_NEW + 0.4)), hl: hl * Math.max(0, n) }]
      .concat(SP_B.map((b, i) => ({ p: b[0], q: b[1], pos: i + n, hl: i === 0 ? hl * (1 - n) : 0 })));
    const asks = SP_A.map((a, i) => ({ p: a[0], q: a[1], pos: i, hl: i === 0 ? hl : 0 }));
    const spread = t < SP_NEW + 0.5 ? 20 : 10;
    this.b.render(asks, bids, t < 1.2 ? 'BTC/USDT' : 'Spread: ' + spread + ' USDT', t < 1.2 ? 'var(--second)' : 'var(--main)');
    const w = seg(t, 5.2, 5.8);
    this.w.opacity = eo(w); this.w.transform = 'translateY(' + lerp(30, 0, eo(w)) + 'px)';
    this.w1.opacity = 1 - 0.5 * eo(seg(t, SP_NEW + 0.6, SP_NEW + 1.0));
    this.w2.opacity = eo(seg(t, SP_NEW + 0.6, SP_NEW + 1.1));
    const qq = seg(t, 15.4, 16.0);
    this.qc.opacity = eo(qq); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qq)) + 'px)';
    this.tutor.render(t);
  },
});
