const { seg, eo, eob, lerp, TextFx } = kit;
kit.scene('title', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="t24-f"><stop offset="0" style="stop-color:color-mix(in srgb, var(--main) 24%, var(--ground))"/><stop offset="1" style="stop-color:var(--ground)"/></radialGradient></defs>' +
      '<circle cx="1340" cy="500" r="430" style="fill:url(#t24-f);opacity:.7"/>' +
      '<g class="t24-orb" transform="translate(1340 500)"><circle r="380" fill="none" stroke-width="2" stroke-dasharray="4 18" style="stroke:color-mix(in srgb, var(--main) 40%, transparent)"/>' +
      '<circle r="330" fill="none" stroke-width="1.5" style="stroke:color-mix(in srgb, var(--accent) 35%, transparent)"/></g></svg>' +
      '<div class="words" style="left:140px;top:250px;width:860px"><p class="kick title-k">Phase 6 · XORA Intelligence</p>' +
      '<h1 class="line title-t" style="font-size:132px">Meet XORA</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T24 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const body = '<div style="display:flex;flex-direction:column;align-items:center;gap:18px;padding-top:70px">' +
      '<div class="tt-logo" style="width:150px;height:150px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, var(--main), var(--accent));font-family:var(--display);font-weight:700;font-size:84px;color:var(--ground)">X</div>' +
      '<p style="margin:0;font-family:var(--display);font-weight:700;font-size:48px;letter-spacing:.2em;color:var(--main)">XORA</p>' +
      '<p class="pk" style="text-align:center">Trading assistant</p>' +
      '<div style="display:flex;gap:10px;margin-top:26px"><span class="pill" style="color:var(--main)">DEMO</span><span class="pill" style="color:color-mix(in srgb, var(--second) 55%, var(--ground))">LIVE</span></div></div>';
    this.ph = UI.phone(kit, { x: 1110, y: 150, w: 460, h: 640, tab: 2, body });
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.orb = q('.t24-orb'); this.logo = q('.tt-logo').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'hi' }, { t: 5.0, pose: 'laptop' }],
      says: [],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    this.orb.setAttribute('transform', 'translate(1340 500) rotate(' + (t * 4).toFixed(2) + ')');
    this.ph.render(t, 0.3);
    const p = seg(t, 1.1, 1.8);
    this.logo.transform = 'scale(' + (lerp(0.6, 1, eob(p, 1.8)) * (1 + 0.03 * Math.sin(t * 2.2))).toFixed(4) + ')';
    this.tutor.render(t);
  },
});
