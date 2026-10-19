const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Title art: one big up candle; y positions of high, close, open, low.
const TT_Y = { h: 190, c: 330, o: 560, l: 690 };
const TT_TAGS = [['High', 'h'], ['Close', 'c'], ['Open', 'o'], ['Low', 'l']];
kit.scene('title', {
  init(kit) {
    let tags = '';
    TT_TAGS.forEach((g) => {
      tags += '<g class="tt-tag"><line x1="1420" x2="1470" y1="' + TT_Y[g[1]] + '" y2="' + TT_Y[g[1]] + '" stroke-width="3" style="stroke:color-mix(in srgb, var(--second) 45%, transparent)"/>' +
        '<text x="1486" y="' + (TT_Y[g[1]] + 9) + '" class="mono" style="fill:var(--second);font-size:28px;letter-spacing:.14em">' + g[0].toUpperCase() + '</text></g>';
    });
    let grid = '';
    for (let y = 160; y <= 720; y += 70) grid += '<line x1="1080" x2="1660" y1="' + y + '" y2="' + y + '" style="stroke:color-mix(in srgb, var(--second) 6%, transparent);stroke-width:1.5"/>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="tt-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--up) 22%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<circle cx="1340" cy="440" r="340" style="fill:url(#tt-f);opacity:.75"/>' + grid +
      '<g class="tt-small">' +
      '<line x1="1160" x2="1160" y1="380" y2="560" stroke-width="5" style="stroke:var(--down)"/><rect x="1135" y="420" width="50" height="90" rx="4" style="fill:var(--down)"/>' +
      '<line x1="1230" x2="1230" y1="430" y2="620" stroke-width="5" style="stroke:var(--up)"/><rect x="1205" y="470" width="50" height="110" rx="4" style="fill:var(--up)"/></g>' +
      '<line class="tt-wick" x1="1340" x2="1340" stroke-width="10" stroke-linecap="round" style="stroke:var(--up)"/>' +
      '<rect class="tt-body" x="1265" width="150" rx="8" style="fill:var(--up)"/>' + tags + '</svg>' +
      '<div class="words" style="left:140px;top:230px;width:900px"><p class="kick tt-k">Phase 4 · Charts &amp; market analysis</p>' +
      '<h1 class="line tt-t" style="font-size:112px">Candlesticks</h1>' +
      '<p class="sub tt-o" style="font-size:44px;font-weight:600;color:var(--second)">Open, High, Low, Close</p>' +
      '<div class="rule tt-r" style="width:260px"></div>' +
      '<p class="sub tt-s">Lesson T14 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice · Fictional prices</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tt-k').style; this.t = q('.tt-t'); this.o = q('.tt-o'); this.r = q('.tt-r').style; this.s = q('.tt-s').style;
    this.wick = q('.tt-wick'); this.body = q('.tt-body'); this.small = q('.tt-small').style;
    this.tags = [...kit.stage.querySelectorAll('.tt-tag')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'candles', flip: true }, { t: 6.4, pose: 'present' }],
      says: [{ t0: 2.9, t1: 6.2, text: 'Charts, here we go!' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    TextFx.fadeFromRight(this.o, t, 0.2, { stagger: 0.12 });
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.4, 1.1)) + ')';
    this.s.opacity = eo(seg(t, 0.8, 1.3));
    this.small.opacity = 0.35 * eo(seg(t, 0.2, 1.0));
    // The candle grows like it formed: wick down to the low, up to the high, then the body from open to close.
    const bob = Math.sin(t * 2 * Math.PI / 3.4) * 4;
    const w = eio(seg(t, 0.3, 1.5)), mid = (TT_Y.o + TT_Y.c) / 2;
    this.wick.setAttribute('y1', (lerp(mid, TT_Y.h, w) + bob).toFixed(1));
    this.wick.setAttribute('y2', (lerp(mid, TT_Y.l, w) + bob).toFixed(1));
    const b = eob(seg(t, 0.9, 1.9), 1.3), top = lerp(TT_Y.o, TT_Y.c, b);
    this.body.setAttribute('y', (top + bob).toFixed(1));
    this.body.setAttribute('height', Math.max(6, TT_Y.o - top).toFixed(1));
    this.tags.forEach((s, i) => {
      const p = seg(t, 1.8 + i * 0.35, 2.3 + i * 0.35);
      s.opacity = eo(p);
      s.transform = 'translate(' + lerp(24, 0, eo(p)).toFixed(1) + 'px,' + bob.toFixed(1) + 'px)';
    });
    this.tutor.render(t);
  },
});
