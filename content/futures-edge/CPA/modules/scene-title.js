const { seg, eo, eob, eio, lerp, TextFx } = kit;
kit.scene('title', {
  init(kit) {
    let ticks = '';
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * Math.PI * 2, r1 = 236, r2 = i % 4 ? 250 : 262;
      ticks += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * r2).toFixed(1) + '" y2="' + (Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="cpa-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<radialGradient id="cpa-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 26%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="ti-ring" transform="translate(1340 470)">' +
      '<circle r="300" style="fill:url(#cpa-f);opacity:.8"/>' +
      '<g class="ti-ticks" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)">' + ticks + '</g>' +
      '<circle r="200" fill="none" stroke="url(#cpa-g)" stroke-width="10"/>' +
      '<circle r="168" fill="none" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 25%, transparent)"/>' +
      '<path d="M0 -100 L80 -70 L80 0 Q80 70 0 105 Q-80 70 -80 0 L-80 -70 Z" fill="none" stroke-width="8" stroke-linejoin="round" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)"/><path class="ti-tick" d="M-40 2 L-10 34 L46 -34" pathLength="1" fill="none" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<text y="160" text-anchor="middle" class="mono" style="fill:color-mix(in srgb, var(--second) 70%, var(--ground));font-size:34px;letter-spacing:.2em">T01–T13</text></g></svg>' +
      '<div class="words" style="left:140px;top:250px;width:900px"><p class="kick ti-k">Phase 3 · Checkpoint</p>' +
      '<h1 class="line ti-t" style="font-size:120px">Checkpoint A</h1>' +
      '<div class="rule ti-r" style="width:260px"></div>' +
      '<p class="sub ti-s">CPA · 8 questions · T01 to T13 · not graded</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ti-k').style; this.t = q('.ti-t'); this.r = q('.ti-r').style; this.s = q('.ti-s').style;
    this.ring = q('.ti-ring'); this.ticks = q('.ti-ticks'); this.tick = q('.ti-tick');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'hi' }, { t: 5.4, pose: 'present' }],
      says: [{ t0: 2.9, t1: 7.4, text: 'Review time. You got this.' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    const c = seg(t, -0.6, 0.6);
    this.ring.setAttribute('transform', 'translate(1340 ' + (470 - t * 2).toFixed(1) + ') scale(' + (lerp(0.9, 1, eob(c, 1.6)) * (1 + 0.012 * Math.sin(t * 2 * Math.PI / 3.2))).toFixed(4) + ')');
    this.ring.style.opacity = eo(c);
    this.ticks.setAttribute('transform', 'rotate(' + (t * 6).toFixed(2) + ')');
    const k = seg(t, 1.0, 1.8);
    this.tick.setAttribute('stroke-dasharray', eio(k).toFixed(3) + ' 1'); this.tick.style.opacity = k > 0 ? 1 : 0;
    this.tutor.render(t);
  },
});
