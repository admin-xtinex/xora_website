const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick ms-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line ms-t">You do not need 60,000 USDT</h2>' +
      '<p class="def ms-d">The price is for <b>one whole BTC</b>. You choose the quantity.</p></div>' +
      '<div class="glass ms-th" style="left:1000px;top:190px;width:740px;padding:24px 32px;border-color:var(--accent)"><p class="kick" style="margin:0 0 10px;color:var(--accent)">The mistake</p>' +
      '<p style="margin:0;font-size:32px;line-height:1.4;font-weight:600">“BTC costs 60,000 USDT, so I need 60,000 USDT to trade it.”</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><line class="ms-x" x1="1020" y1="260" x2="1720" y2="300" pathLength="1" stroke-width="8" stroke-linecap="round" style="stroke:var(--accent)"/></svg>' +
      '<div class="glass ms-p" style="left:1000px;top:400px;width:740px;padding:20px 32px"><p class="fict" style="margin:0 0 6px">Price · fictional</p><p class="mono" style="margin:0;font-size:38px">60,000 USDT <span style="color:color-mix(in srgb, var(--second) 55%, var(--ground))">per</span> <span class="hl">1 BTC</span></p></div>' +
      '<div class="glass ms-o" style="left:1000px;top:560px;width:740px;padding:20px 32px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 76%, var(--main))"><p class="fict" style="margin:0 0 6px">Your order · before fees</p><p class="mono" style="margin:0;font-size:38px">0.001 BTC × 60,000 = <span class="hl ms-v">60 USDT</span></p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ms-k').style; this.t = q('.ms-t'); this.d = q('.ms-d');
    this.th = q('.ms-th').style; this.x = q('.ms-x'); this.p = q('.ms-p').style; this.o = q('.ms-o').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 6.4, pose: 'explain' }, { t: 11.8, pose: 'thumbs' }],
      says: [{ t0: 12.6, t1: 17.6, text: 'Price is per BTC, not per order.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 6.6, { stagger: 0.06 });
    const a = seg(t, 0.8, 1.5);
    this.th.opacity = eo(a) * lerp(1, 0.55, eo(seg(t, 6.4, 7.2)));
    this.th.transform = 'translateY(' + lerp(30, 0, eo(a)) + 'px)';
    this.x.setAttribute('stroke-dasharray', eio(seg(t, 6.0, 6.6)) + ' 1');
    this.x.style.opacity = t > 5.95 ? 1 : 0;
    const p = seg(t, 7.0, 7.7), o = seg(t, 11.8, 12.5);
    this.p.opacity = eo(p); this.p.transform = 'translateY(' + lerp(30, 0, eo(p)) + 'px)';
    this.o.opacity = eo(o); this.o.transform = 'scale(' + lerp(0.9, 1, eob(o, 1.6)) + ')'; this.o.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
