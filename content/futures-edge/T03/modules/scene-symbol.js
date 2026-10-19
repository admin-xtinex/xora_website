const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// [base, quote, row appears at, slash drops at]
const SY = [['BTC', 'USDT', 1.2, 3.4], ['ETH', 'USDT', 6.8, 8.0], ['SOL', 'USDT', 7.4, 8.4]];
kit.scene('symbol', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    SY.forEach((r, i) => {
      rows += '<div class="glass sy-r" style="position:relative;width:740px;padding:18px 30px;display:flex;align-items:center;gap:28px">' +
        '<span class="mono" style="width:300px;font-size:48px"><span style="color:var(--main)">' + r[0] + '</span><span class="sy-sl" style="display:inline-block">/</span><span style="color:var(--accent)">' + r[1] + '</span></span>' +
        '<span class="sy-ar" style="font-size:40px;color:color-mix(in srgb, var(--second) 50%, var(--ground))">→</span>' +
        '<span class="mono sy-s" style="font-size:48px">' + r[0] + r[1] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick sy-k">Symbol</p>' +
      '<h2 class="line sy-t">BTC/USDT or BTCUSDT</h2>' +
      '<p class="def sy-d">A <b>symbol</b> is the short name a platform uses for a pair. Many apps drop the slash.</p></div>' +
      '<div style="position:absolute;left:1000px;top:190px;display:flex;flex-direction:column;gap:18px">' + rows + '</div>' +
      '<div class="glass sy-read" style="left:1000px;top:540px;width:740px;padding:22px 30px;border-color:var(--main)"><p class="kick" style="margin:0 0 10px">Read it like this · fictional price</p>' +
      '<p class="mono" style="margin:0;font-size:40px">BTCUSDT  60,000</p><p style="margin:8px 0 0;font-size:30px;font-weight:600">means: <span class="hl">one BTC</span> costs <span class="hv">60,000 USDT</span></p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)].map((e) => e.style);
    this.k = q('.sy-k').style; this.t = q('.sy-t'); this.d = q('.sy-d'); this.read = q('.sy-read').style;
    this.rows = all('.sy-r'); this.sl = all('.sy-sl'); this.ar = all('.sy-ar'); this.sy = all('.sy-s');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 3.4, pose: 'point', flip: true }, { t: 12.0, pose: 'read' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    SY.forEach((r, i) => {
      const p = seg(t, r[2], r[2] + 0.6), d = seg(t, r[3], r[3] + 0.7), s = seg(t, r[3] + 0.4, r[3] + 1.0);
      this.rows[i].opacity = eo(p); this.rows[i].transform = 'translateX(' + lerp(40, 0, eo(p)) + 'px)';
      // The slash drops away.
      this.sl[i].opacity = 1 - eo(d) * 0.8;
      this.sl[i].transform = 'translateY(' + (eio(d) * 26).toFixed(1) + 'px) rotate(' + (eio(d) * 40).toFixed(1) + 'deg)';
      this.ar[i].opacity = eo(s); this.sy[i].opacity = eo(s);
      this.sy[i].transform = 'translateX(' + lerp(-20, 0, eo(s)) + 'px)';
    });
    const rd = seg(t, 12.0, 12.7);
    this.read.opacity = eo(rd); this.read.transform = 'translateY(' + lerp(30, 0, eo(rd)) + 'px)';
    this.tutor.render(t);
  },
});
