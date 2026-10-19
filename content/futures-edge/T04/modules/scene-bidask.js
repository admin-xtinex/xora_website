const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const BA_A = [[60010, 0.20], [60020, 0.50], [60030, 0.70], [60040, 0.30]], BA_B = [[59990, 0.30], [59980, 0.20], [59970, 0.40], [59960, 0.90]];
kit.scene('bidask', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (cls, k, v, col) => '<div class="glass ' + cls + '" style="position:relative;width:330px;padding:18px 28px;border-color:' + col + '"><p class="kick" style="margin:0 0 6px;color:' + col + '">' + k + '</p><p class="mono" style="margin:0;font-size:48px">' + v + '</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick ba-k">Bid and ask</p>' +
      '<h2 class="line ba-t">The two best prices</h2>' +
      '<p class="def ba-d1">The <b>bid</b> is the highest price a buyer is waiting to pay.</p>' +
      '<p class="def ba-d2">The <b style="color:var(--accent)">ask</b> is the lowest price a seller is waiting to accept.</p></div>' +
      '<div style="position:absolute;left:140px;top:610px;display:flex;gap:30px">' + tile('ba-tb', 'Bid', '59,990', 'var(--main)') + tile('ba-ta', 'Ask', '60,010', 'var(--accent)') + '</div>' +
      '<span class="chip ba-la" style="position:absolute;left:1672px;font-size:24px;padding:8px 16px;border-color:var(--accent);color:var(--accent)">◀ Ask</span>' +
      '<span class="chip ba-lb" style="position:absolute;left:1672px;font-size:24px;padding:8px 16px;border-color:var(--main);color:var(--main)">◀ Bid</span>' +
      '<p class="fict" style="position:absolute;left:1060px;top:716px;margin:0">Educational mock · fictional prices</p>' +
      '</div>'));
    this.b = UI.book(kit, { x: 1060, y: 180, w: 600 });
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ba-k').style; this.t = q('.ba-t'); this.d1 = q('.ba-d1'); this.d2 = q('.ba-d2');
    this.tb = q('.ba-tb').style; this.ta = q('.ba-ta').style; this.la = q('.ba-la').style; this.lb = q('.ba-lb').style;
    this.la.top = (this.b.rowY('a', 0) - 2) + 'px'; this.lb.top = (this.b.rowY('b', 0) - 2) + 'px';
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.6, pose: 'point', flip: true }, { t: 6.6, pose: 'pointer', flip: true }, { t: 11.4, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d1, t, 0.9, { stagger: 0.06 });
    TextFx.fadeFromRight(this.d2, t, 6.8, { stagger: 0.06 });
    this.b.el.style.opacity = eo(seg(t, 0.2, 0.8));
    const hb = eo(seg(t, 1.6, 2.2)), ha = eo(seg(t, 7.4, 8.0));
    const pulse = (a) => 0.65 + 0.35 * Math.sin(Math.max(0, t - a) * 3);
    this.b.render(BA_A.map((a, i) => ({ p: a[0], q: a[1], pos: i, hl: i === 0 ? ha * pulse(7.4) : 0 })), BA_B.map((b, i) => ({ p: b[0], q: b[1], pos: i, hl: i === 0 ? hb * pulse(1.6) : 0 })), 'BTC/USDT');
    this.lb.opacity = hb; this.lb.transform = 'translateX(' + lerp(20, 0, hb) + 'px)';
    this.la.opacity = ha; this.la.transform = 'translateX(' + lerp(20, 0, ha) + 'px)';
    const a = seg(t, 11.4, 12.0), b = seg(t, 11.8, 12.4);
    this.tb.opacity = eo(a); this.tb.transform = 'translateY(' + lerp(30, 0, eo(a)) + 'px)';
    this.ta.opacity = eo(b); this.ta.transform = 'translateY(' + lerp(30, 0, eo(b)) + 'px)';
    this.tutor.render(t);
  },
});
