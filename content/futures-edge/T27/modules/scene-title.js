const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Title card: a trade-plan readout inside the ring.
kit.scene('title', {
  init(kit) {
    let ticks = '';
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * Math.PI * 2, r1 = 236, r2 = i % 4 ? 250 : 262;
      ticks += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * r2).toFixed(1) + '" y2="' + (Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    const pill = (y, txt, col) => '<g class="ti-p" transform="translate(0 ' + y + ')"><rect x="-150" y="-34" width="300" height="68" rx="34" style="fill:color-mix(in srgb, ' + col + ' 16%, var(--ground));stroke:' + col + ';stroke-width:2.5"/>' +
      '<text y="11" text-anchor="middle" class="mono" style="fill:' + col + ';font-size:28px;font-weight:600;letter-spacing:.04em">' + txt + '</text></g>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="t27ti-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<radialGradient id="t27ti-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 26%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="ti-coin" transform="translate(1340 470)">' +
      '<circle r="300" style="fill:url(#t27ti-f);opacity:.8"/>' +
      '<g class="ti-ticks" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)">' + ticks + '</g>' +
      '<circle r="200" fill="none" stroke="url(#t27ti-g)" stroke-width="10"/>' +
      pill(-92, 'ENTRY 60,000', 'var(--second)') + pill(0, 'STOP 59,700', 'var(--down)') + pill(92, '2.0 R ROOM', 'var(--up)') + '</g></svg>' +
      '<div class="words" style="left:140px;top:250px;width:900px"><p class="kick ti-k">Phase 6 · XORA Intelligence</p>' +
      '<h1 class="line ti-t" style="font-size:104px">Reading XORA trading insights</h1>' +
      '<div class="rule ti-r" style="width:260px"></div>' +
      '<p class="sub ti-s">Lesson T27 · about 5 minutes · fictional numbers</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ti-k').style; this.t = q('.ti-t'); this.r = q('.ti-r').style; this.s = q('.ti-s').style;
    this.coin = q('.ti-coin'); this.ticks = q('.ti-ticks');
    this.pills = [...kit.stage.querySelectorAll('.ti-p')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }],
      says: [{ t0: 2.9, t1: 7.4, text: 'Let us read the screen.' }],
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
    // the three answers light up in turn
    this.pills.forEach((p, i) => {
      const a = 0.8 + i * 0.5, e = seg(t, a, a + 0.5);
      const hl = 0.55 + 0.45 * Math.max(0, Math.sin((t - 2.2 - i * 1.3) * Math.PI / 3.9));
      p.style.opacity = (eo(e) * (t < 2.2 ? 1 : hl)).toFixed(3);
      p.setAttribute('transform', 'translate(' + lerp(60, 0, eo(e)).toFixed(1) + ' ' + ((i - 1) * 92) + ')');
    });
    this.tutor.render(t);
  },
});
