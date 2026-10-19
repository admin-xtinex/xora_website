const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1400px"><p class="kick ms-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line ms-t">"My stop guarantees my price"</h2></div>' +
      '<div class="glass ms-m" style="left:140px;top:400px;width:760px;padding:30px 38px;border-color:color-mix(in srgb, var(--accent) 50%, transparent)"><p class="kick" style="margin:0 0 12px;color:var(--accent)">The belief</p>' +
      '<p style="position:relative;margin:0;font-size:34px;line-height:1.4;font-weight:600">A stop order at 59,500 means I sell at exactly 59,500.<span class="ms-x" style="position:absolute;left:-6px;right:-6px;top:50%;height:5px;border-radius:4px;background:var(--accent)"></span></p>' +
      '<span class="ms-no" style="position:absolute;right:28px;bottom:26px;padding:6px 18px;border-radius:10px;border:3px solid var(--accent);color:var(--accent);font-family:var(--mono);font-size:26px;letter-spacing:.12em">NOT TRUE</span></div>' +
      '<div class="glass ms-c" style="left:960px;top:400px;width:780px;padding:30px 38px;border-color:var(--main)"><p class="kick" style="margin:0 0 12px">The correction</p>' +
      '<p style="margin:0;font-size:34px;line-height:1.4;font-weight:600">A stop guarantees a <span style="color:var(--main)">trigger</span>, not a price. In a fast market, the fill can be much worse.</p></div>' +
      '<div class="glass ms-tip" style="left:140px;top:680px;width:1100px;padding:22px 38px;display:flex;align-items:center;gap:24px"><span class="dot" style="width:18px;height:18px"></span>' +
      '<p style="margin:0;font-size:32px;font-weight:600">Plan for slippage. A stop is protection, not perfect protection.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ms-k').style; this.t = q('.ms-t'); this.m = q('.ms-m').style; this.x = q('.ms-x').style; this.no = q('.ms-no').style;
    this.c = q('.ms-c').style; this.tip = q('.ms-tip').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.5, pose: 'confused' }, { t: 5.8, pose: 'explain' }, { t: 12.4, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.m, t, 1.2);
    const x = seg(t, 5.9, 6.5);
    this.x.transformOrigin = '0 50%'; this.x.transform = 'scaleX(' + eio(x) + ')';
    const n = seg(t, 6.5, 6.9);
    this.no.opacity = eo(n); this.no.transform = 'rotate(-6deg) scale(' + lerp(1.6, 1, eob(n, 1.4)) + ')';
    this.m.opacity = (+this.m.opacity * lerp(1, 0.75, seg(t, 7.0, 7.6))).toFixed(3);
    UI.rise(this.c, t, 7.2);
    UI.rise(this.tip, t, 12.5);
    this.tutor.render(t);
  },
});
