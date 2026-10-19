const { seg, eo, eob, eio, lerp, TextFx } = kit;
kit.scene('title', {
  init(kit) {
    let ticks = '';
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * Math.PI * 2, r1 = 236, r2 = i % 4 ? 250 : 262;
      ticks += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * r2).toFixed(1) + '" y2="' + (Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    // A tiny terminal inside the ring: top bar, chart with candles, a book column and two buttons.
    const CN = [[-1, 18, 30], [1, 4, 40], [1, -14, 26], [-1, -6, 34], [1, -26, 44], [1, -44, 30]];
    let candles = '';
    CN.forEach((c, i) => {
      const x = -120 + i * 26, col = c[0] > 0 ? 'var(--main)' : 'var(--accent)';
      candles += '<g class="title-cd"><line x1="' + x + '" x2="' + x + '" y1="' + (c[1] - c[2] / 2 - 12) + '" y2="' + (c[1] + c[2] / 2 + 12) + '" stroke-width="3" style="stroke:' + col + '"/><rect x="' + (x - 8) + '" y="' + (c[1] - c[2] / 2) + '" width="16" height="' + c[2] + '" rx="2" style="fill:' + col + '"/></g>';
    });
    let bars = '';
    for (let i = 0; i < 6; i++) bars += '<rect x="64" y="' + (-62 + i * 18) + '" width="' + [52, 40, 30, 46, 58, 36][i] + '" height="10" rx="3" style="fill:' + (i < 3 ? 'var(--accent)' : 'var(--main)') + ';opacity:.75"/>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="title-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<radialGradient id="title-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 26%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="title-coin" transform="translate(1340 470)">' +
      '<circle r="300" style="fill:url(#title-f);opacity:.8"/>' +
      '<g class="title-ticks" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)">' + ticks + '</g>' +
      '<circle r="200" fill="none" stroke="url(#title-g)" stroke-width="10"/>' +
      '<rect x="-150" y="-104" width="300" height="200" rx="18" stroke-width="3" style="fill:color-mix(in srgb, var(--ground) 80%, var(--main));stroke:color-mix(in srgb, var(--main) 60%, transparent)"/>' +
      '<rect x="-150" y="-104" width="300" height="30" rx="14" style="fill:color-mix(in srgb, var(--main) 18%, transparent)"/>' +
      '<line x1="50" x2="50" y1="-72" y2="94" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 18%, transparent)"/>' +
      candles + bars +
      '<rect x="64" y="52" width="70" height="14" rx="4" style="fill:var(--main)"/><rect x="64" y="72" width="70" height="14" rx="4" style="fill:var(--accent)"/></g></svg>' +
      '<div class="words" style="left:140px;top:250px;width:900px"><p class="kick title-k">Phase 3 · Futures essentials</p>' +
      '<h1 class="line title-t" style="font-size:120px">Exchange platform tour</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T10 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.coin = q('.title-coin'); this.ticks = q('.title-ticks');
    this.cds = [...kit.stage.querySelectorAll('.title-cd')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'laptop' }],
      says: [{ t0: 2.9, t1: 8.4, text: 'Let us learn the screen.' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    const c = seg(t, -0.6, 0.6);
    this.coin.setAttribute('transform', 'translate(1340 ' + (470 - t * 2).toFixed(1) + ') scale(' + (lerp(0.9, 1, eob(c, 1.6)) * (1 + 0.012 * Math.sin(t * 2 * Math.PI / 3.2))).toFixed(4) + ')');
    this.coin.style.opacity = eo(c);
    this.ticks.setAttribute('transform', 'rotate(' + (t * 6).toFixed(2) + ')');
    this.cds.forEach((s, i) => { const p = seg(t, 0.3 + i * 0.25, 0.7 + i * 0.25); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = '50% 100%'; s.transform = 'scaleY(' + lerp(0.2, 1, eob(p, 1.6)) + ')'; });
    this.tutor.render(t);
  },
});
