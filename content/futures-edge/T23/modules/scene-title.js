const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Title art: an eight-step loop draws around a DEMO badge, one segment per step.
const TI_C = [1400, 470], TI_R = 210;
kit.scene('title', {
  init(kit) {
    let segs = '', nums = '';
    for (let i = 0; i < 8; i++) {
      const a0 = (i / 8) * Math.PI * 2 - Math.PI / 2 + 0.07, a1 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2 - 0.07;
      const p = (a) => (Math.cos(a) * TI_R).toFixed(1) + ' ' + (Math.sin(a) * TI_R).toFixed(1);
      segs += '<path class="ti-s" d="M' + p(a0) + ' A' + TI_R + ' ' + TI_R + ' 0 0 1 ' + p(a1) + '" pathLength="1" fill="none" stroke-width="14" stroke-linecap="round" style="stroke:' + (i < 5 ? 'var(--main)' : 'var(--accent)') + '"/>';
      const am = (a0 + a1) / 2;
      nums += '<g transform="translate(' + (Math.cos(am) * (TI_R + 52)).toFixed(1) + ' ' + (Math.sin(am) * (TI_R + 52)).toFixed(1) + ')"><g class="ti-n"><circle r="26" style="fill:color-mix(in srgb, var(--ground) 80%, var(--main));stroke:color-mix(in srgb, var(--main) 50%, transparent);stroke-width:2"/>' +
        '<text class="mono" y="9" text-anchor="middle" style="fill:var(--second);font-size:26px">' + (i + 1) + '</text></g></g>';
    }
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="t23-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 22%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<g class="ti-ring" transform="translate(' + TI_C[0] + ' ' + TI_C[1] + ')"><circle r="300" style="fill:url(#t23-f);opacity:.8"/>' +
      '<circle r="' + TI_R + '" fill="none" stroke-width="14" style="stroke:color-mix(in srgb, var(--second) 8%, transparent)"/>' + segs + nums +
      '<text class="mono" y="10" text-anchor="middle" style="fill:var(--second);font-size:78px;letter-spacing:.08em">DEMO</text>' +
      '<text y="60" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 62%, var(--ground));font-size:24px">chart → journal</text></g></svg>' +
      '<div class="words" style="left:140px;top:220px;width:900px"><p class="kick title-k">Phase 5 · Scalping &amp; Risk Management</p>' +
      '<h1 class="line title-t" style="font-size:104px">Full Scalping Decision Lifecycle</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T23 · about 7 minutes · educational simulation</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Demo only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.ring = q('.ti-ring'); this.segs = all('.ti-s'); this.nums = all('.ti-n').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'present' }, { t: 5.6, pose: 'laptop' }],
      says: [{ t0: 3.0, t1: 7.4, text: 'Demo only!' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    const c = seg(t, -0.6, 0.6);
    this.ring.setAttribute('transform', 'translate(' + TI_C[0] + ' ' + (TI_C[1] - t * 2).toFixed(1) + ') scale(' + (lerp(0.9, 1, eob(c, 1.6)) * (1 + 0.012 * Math.sin(t * 2 * Math.PI / 3.2))).toFixed(4) + ')');
    this.ring.style.opacity = eo(c);
    this.segs.forEach((s, i) => { const a = 0.8 + i * 0.5, p = seg(t, a, a + 0.45); s.setAttribute('stroke-dasharray', eio(p).toFixed(3) + ' 1'); s.style.opacity = p > 0 ? 1 : 0; });
    this.nums.forEach((s, i) => { const a = 0.9 + i * 0.5, p = seg(t, a, a + 0.4); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = 'center'; s.transform = 'scale(' + lerp(0.5, 1, eob(p, 1.8)).toFixed(3) + ')'; });
    this.tutor.render(t);
  },
});
