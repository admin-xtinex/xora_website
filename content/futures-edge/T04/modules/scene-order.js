const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// [label, value, fills in at]
const OR_F = [['Side', 'BUY', 6.0], ['Pair', 'BTC/USDT', 6.6], ['Quantity', '0.01 BTC', 7.2], ['Price', '60,000 USDT', 7.8], ['Total', '', 9.0]];
kit.scene('order', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    OR_F.forEach((f, i) => {
      rows += '<div style="display:flex;align-items:center;justify-content:space-between;height:60px;border-bottom:1.5px solid color-mix(in srgb, var(--second) 8%, transparent)">' +
        '<span style="font-size:28px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + f[0] + '</span>' +
        (i === 0 ? '<span class="or-v chip" style="font-size:28px;padding:8px 26px;background:var(--main);color:var(--ground);border-color:var(--main)">' + f[1] + '</span>' : '<span class="mono or-v" style="font-size:36px;' + (i === 4 ? 'color:var(--main)' : '') + '">' + f[1] + '</span>') + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick or-k">Order</p>' +
      '<h2 class="line or-t">An order is an instruction</h2>' +
      '<p class="def or-d">An <b>order</b> is an instruction to buy or sell a quantity at a price.</p></div>' +
      '<div class="glass or-c" style="left:1060px;top:180px;width:600px;padding:22px 34px"><p class="fict" style="margin:0 0 8px">Order ticket · educational mock · fictional price</p>' + rows +
      '<div class="or-st" style="display:flex;align-items:center;gap:14px;margin-top:16px"><span class="or-dot" style="width:16px;height:16px;border-radius:50%;background:var(--accent)"></span><span style="font-size:26px;font-weight:600">Waiting in the order book</span></div></div>' +
      '<div class="glass or-b" style="left:1060px;top:640px;width:600px;padding:14px 30px;display:flex;align-items:center;justify-content:space-between"><span class="kick" style="font-size:20px">Order book</span><span class="mono or-row" style="font-size:28px;color:var(--main)">BUY 0.01 · 60,000</span></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.or-k').style; this.t = q('.or-t'); this.d = q('.or-d'); this.c = q('.or-c').style;
    this.vs = all('.or-v'); this.st = q('.or-st').style; this.dot = q('.or-dot').style; this.b = q('.or-b').style; this.row = q('.or-row').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'laptop' }, { t: 0.6, pose: 'explain' }, { t: 6.0, pose: 'typing' }, { t: 11.6, pose: 'point', flip: true }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    const c = seg(t, 0.6, 1.3);
    this.c.opacity = eo(c); this.c.transform = 'translateX(' + lerp(40, 0, eo(c)) + 'px)';
    OR_F.forEach((f, i) => {
      const p = seg(t, f[2], f[2] + 0.4);
      this.vs[i].style.opacity = eo(p);
      this.vs[i].style.transform = 'translateX(' + lerp(20, 0, eo(p)) + 'px)';
    });
    UI.set(this.vs[4], UI.fmt(Math.round(600 * eo(seg(t, 9.0, 9.9)))) + ' USDT');
    this.st.opacity = eo(seg(t, 11.6, 12.1));
    this.dot.opacity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 5));
    const b = seg(t, 12.2, 12.8), r = seg(t, 12.8, 13.4);
    this.b.opacity = eo(b); this.b.transform = 'translateY(' + lerp(20, 0, eo(b)) + 'px)';
    this.row.opacity = eo(r); this.row.transform = 'translateX(' + lerp(-40, 0, eo(r)) + 'px)';
    this.tutor.render(t);
  },
});
