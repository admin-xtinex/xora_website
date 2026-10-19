const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('fshort', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (cls, top, head, sum) => '<div class="glass ' + cls + '" style="left:140px;top:' + top + 'px;width:800px;padding:20px 32px"><p class="kick" style="margin:0 0 8px">' + head + '</p><p class="mono" style="margin:0;font-size:32px">' + sum + '</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:800px"><p class="kick fs-k">Futures · short</p>' +
      '<h2 class="line fs-t">A futures short</h2>' +
      '<p class="def fs-d">Flip it: <b>(entry − exit) × quantity</b>.</p></div>' +
      card('fs-a', 420, 'Short 0.1 BTC at 60,000 · exit 59,400', '(60,000 − 59,400) × 0.1 = <span class="hl">+60.00</span>') +
      card('fs-b', 570, 'Short 0.1 BTC at 60,000 · exit 60,800', '(60,000 − 60,800) × 0.1 = <span class="hv">−80.00</span>') +
      '</div>'));
    const base = { x0: 1000, x1: 1500, y0: 250, y1: 540, lo: 59000, hi: 61000, step: 500, entry: 60000, entryLabel: 'Entry 60,000', label: 'BTC price in USDT · fictional' };
    this.ca = UI.chart(kit, Object.assign({}, base, { t0: 4.6, t1: 9.0, keys: [[4.6, 60000], [5.0, 60000], [7.6, 59400], [20, 59400]], entryBelow: false }));
    this.cb = UI.chart(kit, Object.assign({}, base, { t0: 11.3, t1: 15.7, keys: [[11.3, 60000], [11.7, 60000], [14.4, 60800], [20, 60800]] }));
    this.meter = UI.meter(kit, 1000, 590, 600, 'Short 0.1 BTC', 80);
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.fs-k').style; this.t = q('.fs-t'); this.d = q('.fs-d'); this.a = q('.fs-a').style; this.b = q('.fs-b').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.4, pose: 'explain' }, { t: 4.6, pose: 'point', flip: true }, { t: 7.8, pose: 'thumbs' }, { t: 11.3, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.0, { stagger: 0.06 });
    const sw = eo(seg(t, 11.0, 11.4));
    this.ca.render(t, eo(seg(t, 4.2, 4.8)) * (1 - sw));
    this.cb.render(t, sw);
    const P = t < 11.3 ? this.ca.price(t) : this.cb.price(t);
    const mp = eo(seg(t, 4.4, 5.0));
    this.meter.style.opacity = mp; this.meter.style.transform = 'translateY(' + lerp(24, 0, mp).toFixed(1) + 'px)';
    this.meter.set(Math.round(60000 - P) * 0.1);
    [[this.a, 5.0], [this.b, 11.6]].forEach(([s, a]) => { const p = seg(t, a, a + 0.6); s.opacity = eo(p); s.transform = 'translateY(' + lerp(24, 0, eo(p)).toFixed(1) + 'px)'; });
    this.tutor.render(t);
  },
});
