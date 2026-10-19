const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('pair', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const lab = (cls, x, col, k, txt) => '<div class="' + cls + '" style="position:absolute;left:' + x + 'px;top:470px;width:330px;transform:translateX(-50%);text-align:center">' +
      '<p class="kick" style="margin:0 0 8px;color:' + col + '">' + k + '</p><p style="margin:0;font-size:28px;line-height:1.35;font-weight:600">' + txt + '</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:780px"><p class="kick pr-k">Trading pair</p>' +
      '<h2 class="line pr-t">BTC/USDT has two halves</h2>' +
      '<p class="def pr-d">A <b>trading pair</b> tells you which asset is being priced against another.</p></div>' +
      '<div class="pr-box pr-b1" style="position:absolute;left:1180px;top:300px;width:300px;height:150px;border-radius:26px;border:3px solid var(--main);background:color-mix(in srgb, var(--ground) 80%, var(--main))"></div>' +
      '<div class="pr-box pr-b2" style="position:absolute;left:1560px;top:300px;width:360px;height:150px;border-radius:26px;border:3px solid var(--accent);background:color-mix(in srgb, var(--ground) 80%, var(--accent))"></div>' +
      '<span class="mono pr-w1" style="position:absolute;left:0;top:375px;font-size:120px;line-height:1;color:var(--main)">BTC</span>' +
      '<span class="mono pr-sl" style="position:absolute;left:0;top:375px;font-size:120px;line-height:1">/</span>' +
      '<span class="mono pr-w2" style="position:absolute;left:0;top:375px;font-size:120px;line-height:1;color:var(--accent)">USDT</span>' +
      lab('pr-l1', 1180, 'var(--main)', 'Base asset', 'the thing you buy or sell') +
      lab('pr-l2', 1560, 'var(--accent)', 'Quote asset', 'what the price is counted in') +
      '<div class="glass pr-eq" style="left:1000px;top:650px;width:740px;padding:20px 30px;text-align:center"><p class="mono" style="margin:0;font-size:40px"><span style="color:var(--main)">1 BTC</span> = 60,000 <span style="color:var(--accent)">USDT</span></p><p class="fict" style="margin:6px 0 0">Fictional price</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.pr-k').style; this.t = q('.pr-t'); this.d = q('.pr-d');
    this.w1 = q('.pr-w1').style; this.sl = q('.pr-sl').style; this.w2 = q('.pr-w2').style;
    this.b1 = q('.pr-b1').style; this.b2 = q('.pr-b2').style; this.l1 = q('.pr-l1').style; this.l2 = q('.pr-l2').style; this.eq = q('.pr-eq').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 6.0, pose: 'point', flip: true }, { t: 11.4, pose: 'pointer', flip: true }, { t: 17.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    // The label "BTC/USDT" sits together (centre 1370), then splits: BTC to 1180, USDT to 1560.
    const sp = eio(seg(t, 5.4, 6.4)), sp2 = eio(seg(t, 10.8, 11.8)), ap = seg(t, 0.6, 1.3);
    const cw = 72; // one mono character at 120 px
    const x1 = lerp(1370 - 4 * cw, 1180 - 1.5 * cw, sp), xs = lerp(1370 - cw, 1370 - 0.5 * cw, sp), x2 = lerp(1370, 1560 - 2 * cw, Math.max(sp, 0) * 0.4 + sp2 * 0.6);
    this.w1.left = x1.toFixed(1) + 'px'; this.sl.left = xs.toFixed(1) + 'px'; this.w2.left = x2.toFixed(1) + 'px';
    for (const s of [this.w1, this.sl, this.w2]) { s.opacity = eo(ap); s.transform = 'translateY(-50%) translateY(' + lerp(30, 0, eo(ap)) + 'px)'; }
    this.sl.opacity = eo(ap) * lerp(1, 0.35, sp);
    const b1 = seg(t, 6.2, 6.8), b2 = seg(t, 11.6, 12.2);
    this.b1.opacity = eo(b1); this.b1.transform = 'translateX(-50%) scale(' + lerp(0.8, 1, eob(b1, 1.6)) + ')';
    this.b2.opacity = eo(b2); this.b2.transform = 'translateX(-50%) scale(' + lerp(0.8, 1, eob(b2, 1.6)) + ')';
    this.l1.opacity = eo(seg(t, 6.8, 7.3)); this.l2.opacity = eo(seg(t, 12.2, 12.7));
    const e = seg(t, 17.0, 17.7);
    this.eq.opacity = eo(e); this.eq.transform = 'translateY(' + lerp(30, 0, eo(e)) + 'px)';
    this.tutor.render(t);
  },
});
