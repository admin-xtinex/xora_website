const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('spot', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:780px"><p class="kick sp-k">Spot</p>' +
      '<h2 class="line sp-t">You buy the real thing</h2>' +
      '<p class="def sp-d"><b>Spot</b> means buying the actual asset at today’s price, paid in full. It is yours right away.</p></div>' +
      '<div class="glass sp-an" style="left:1000px;top:190px;width:780px;height:220px">' +
      '<p class="fict" style="position:absolute;left:30px;top:20px;margin:0">Everyday example</p>' +
      '<div style="position:absolute;left:40px;top:70px;width:220px;height:120px;border-radius:18px;border:2px solid color-mix(in srgb, var(--second) 25%, transparent);display:grid;place-items:end center;padding-bottom:12px;box-sizing:border-box;font-size:28px;font-weight:600">Shop</div>' +
      '<div style="position:absolute;right:40px;top:70px;width:220px;height:120px;border-radius:18px;border:2px solid color-mix(in srgb, var(--main) 45%, transparent);display:grid;place-items:end center;padding-bottom:12px;box-sizing:border-box;font-size:28px;font-weight:600">Your home</div>' +
      '<svg style="position:absolute;left:300px;top:110px" width="180" height="40" viewBox="0 0 180 40"><path d="M6 20 H164 M150 8 L166 20 L150 32" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/></svg>' +
      '<div class="sp-coin" style="position:absolute;left:0;top:0;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:radial-gradient(circle at 35% 35%, #ffe69a, #d9a520);border:3px solid #f6d36b;display:grid;place-items:center;font-size:22px;font-weight:800;color:#5a4206">Au</div>' +
      '<span class="sp-paid chip" style="position:absolute;left:300px;top:150px;font-size:22px;padding:4px 14px">Paid in full</span></div>' +
      '</div>'));
    this.w = UI.wallet(kit, 1000, 450, 780, 'Asha’s spot wallet · fictional', [['USDT', 'sp-u'], ['BTC', 'sp-b']]);
    kit.stage.append(kit.h('<div><span class="chip sp-c1 mono" style="position:absolute;left:0;top:0;font-size:26px;padding:8px 20px;border-color:var(--accent)">−600 USDT</span>' +
      '<span class="chip sp-c2 mono" style="position:absolute;left:0;top:0;font-size:26px;padding:8px 20px;background:var(--main);color:var(--ground);border-color:var(--main)">+0.010 BTC</span></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sp-k').style; this.t = q('.sp-t'); this.d = q('.sp-d');
    this.an = q('.sp-an').style; this.coin = q('.sp-coin').style; this.paid = q('.sp-paid').style;
    this.c1 = q('.sp-c1').style; this.c2 = q('.sp-c2').style;
    this.u = this.w.val('sp-u'); this.b = this.w.val('sp-b'); this.bRow = this.w.row('sp-b'); this.ws = this.w.el.style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'explain' }, { t: 6.5, pose: 'idea' }, { t: 12.0, pose: 'point', flip: true }, { t: 15.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.4, { stagger: 0.05 });
    UI.show(this.an, t, 6.4);
    const m = eio(seg(t, 7.6, 8.9));
    this.coin.left = lerp(150, 630, m).toFixed(1) + 'px'; this.coin.top = (110 - Math.sin(Math.PI * m) * 50).toFixed(1) + 'px';
    this.paid.opacity = eo(seg(t, 7.2, 7.6)).toFixed(3);
    UI.show(this.ws, t, 2.2);
    const f = eo(seg(t, 13.6, 14.4));
    UI.set(this.u, UI.fmt(lerp(1000, 400, f), 2));
    UI.set(this.b, lerp(0, 0.01, f).toFixed(3));
    const g = Math.sin(Math.PI * seg(t, 14.4, 15.4));
    this.bRow.background = 'color-mix(in srgb, var(--main) ' + (g * 20 + (t > 14.4 ? 8 : 0)).toFixed(1) + '%, transparent)';
    this.b.style.color = t > 14.4 ? 'var(--main)' : 'var(--second)';
    // Chips: USDT leaves the wallet, BTC arrives.
    const a = seg(t, 12.8, 13.8), b = seg(t, 13.4, 14.4);
    this.c1.opacity = (Math.sin(Math.PI * a)).toFixed(3);
    this.c1.transform = 'translate(' + lerp(1650, 1500, eo(a)).toFixed(1) + 'px,' + lerp(560, 440, eo(a)).toFixed(1) + 'px) translate(-50%,-50%)';
    this.c2.opacity = (Math.min(1, b * 3) * (1 - seg(t, 14.2, 14.5))).toFixed(3);
    this.c2.transform = 'translate(' + lerp(1500, 1650, eo(b)).toFixed(1) + 'px,' + lerp(440, 625, eo(b)).toFixed(1) + 'px) translate(-50%,-50%)';
    this.tutor.render(t);
  },
});
