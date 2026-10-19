const { seg, eo, eob, eio, lerp, TextFx } = kit;
const TT_TYPES = ['FEES', 'SPREAD', 'SLIPPAGE'];
kit.scene('title', {
  init(kit) {
    let ticks = '';
    for (let i = 0; i < 48; i++) {
      const a = i / 48 * Math.PI * 2, r1 = 236, r2 = i % 4 ? 250 : 262;
      ticks += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * r2).toFixed(1) + '" y2="' + (Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    let pills = '';
    TT_TYPES.forEach((s, i) => {
      pills += '<g class="tt-pill" transform="translate(0 ' + (-92 + i * 92) + ')"><rect x="-130" y="-34" width="260" height="68" rx="34" style="fill:color-mix(in srgb, var(--ground) 80%, var(--main));stroke:color-mix(in srgb, var(--main) 45%, transparent);stroke-width:2"/>' +
        '<text y="12" text-anchor="middle" class="mono" style="fill:var(--second);font-size:34px;letter-spacing:.12em">' + s + '</text></g>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="tt-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<radialGradient id="tt-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 26%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="tt-coin" transform="translate(1340 470)">' +
      '<circle r="300" style="fill:url(#tt-f);opacity:.8"/>' +
      '<g class="tt-ticks" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)">' + ticks + '</g>' +
      '<circle r="200" fill="none" stroke="url(#tt-g)" stroke-width="10"/>' + pills + '</g></svg>' +
      '<div class="words" style="left:140px;top:250px;width:900px"><p class="kick tt-k">Phase 2 · Trading fundamentals</p>' +
      '<h1 class="line tt-t" style="font-size:112px">Fees, spread and slippage</h1>' +
      '<div class="rule tt-r" style="width:260px"></div>' +
      '<p class="sub tt-s">Lesson T09 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tt-k').style; this.t = q('.tt-t'); this.r = q('.tt-r').style; this.s = q('.tt-s').style;
    this.coin = q('.tt-coin'); this.ticks = q('.tt-ticks');
    this.pills = [...kit.stage.querySelectorAll('.tt-pill')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }],
      says: [{ t0: 2.9, t1: 8.4, text: 'Small costs add up.' }],
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
    const cur = Math.floor(Math.max(0, t - 1.2) / 1.6) % 3;
    this.pills.forEach((g, i) => {
      const p = seg(t, 0.3 + i * 0.25, 0.8 + i * 0.25);
      const on = t > 1.2 && i === cur ? 1 : 0;
      g.style.opacity = eo(p) * (0.55 + 0.45 * on);
      g.querySelector('rect').style.stroke = on ? 'var(--main)' : 'color-mix(in srgb, var(--main) 45%, transparent)';
      g.setAttribute('transform', 'translate(' + lerp(40, 0, eo(p)).toFixed(1) + ' ' + (-92 + i * 92) + ') scale(' + (on ? 1.06 : 1) + ')');
    });
    this.tutor.render(t);
  },
});
