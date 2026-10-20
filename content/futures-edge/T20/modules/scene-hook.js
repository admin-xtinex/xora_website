const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The fictional chart draws in; a tempting BUY NOW button pulses, then gives way to "check first".
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"><div class="words" style="left:140px;top:150px;width:1500px"><p class="kick hk-k">A tempting moment</p>' +
      '<h2 class="line hk-t" style="font-size:64px">Green candles. Buy now?</h2></div></div>'));
    this.bd = UI.board(kit, -1, { draw: 0.4, list: false });
    kit.stage.append(kit.h('<div class="hk-side" style="position:absolute;left:1110px;top:330px;width:670px;display:flex;flex-direction:column;align-items:center;gap:30px">' +
      '<div class="hk-buy" style="position:relative;padding:28px 70px;border-radius:24px;background:var(--up);color:var(--ground);font-size:52px;font-weight:800;letter-spacing:.04em">BUY NOW?' +
      '<div class="hk-x" style="position:absolute;left:-10px;right:-10px;top:50%;height:8px;margin-top:-4px;border-radius:4px;background:var(--accent)"></div></div>' +
      '<p class="fict" style="margin:0">Educational mock · not a real exchange button</p>' +
      '<div class="glass hk-q" style="position:relative;width:670px;padding:22px 30px"><p class="kick" style="margin:0 0 8px">What do we actually know?</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">Not yet enough. Check the chart step by step first.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.buy = q('.hk-buy').style; this.x = q('.hk-x').style; this.qc = q('.hk-q').style; this.f = q('.hk-side .fict').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'magnify' }, { t: 7.0, pose: 'confused' }, { t: 12.4, pose: 'idea' }],
      says: [{ t0: 7.6, t1: 11.6, text: 'Hmm, wait.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.bd.render(t, 0);
    const b = seg(t, 7.0, 7.5), off = eio(seg(t, 12.4, 13.0));
    this.buy.opacity = (eo(b) * lerp(1, 0.45, off)).toFixed(3);
    this.buy.transform = 'scale(' + (lerp(0.7, 1, eob(b, 1.8)) * (1 + 0.035 * Math.sin(Math.max(0, t - 7.5) * 5) * (1 - off))).toFixed(4) + ')';
    this.f.opacity = 0.9 * eo(seg(t, 7.6, 8.1));
    this.x.transformOrigin = '0 50%'; this.x.transform = 'scaleX(' + eo(seg(t, 12.4, 12.9)).toFixed(3) + ')'; this.x.opacity = t >= 12.4 ? 1 : 0;
    UI.rise(kit, this.qc, t, 12.8, 0.7);
    this.tutor.render(t);
  },
});
