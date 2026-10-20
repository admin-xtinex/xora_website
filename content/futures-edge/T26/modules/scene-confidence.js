const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Confidence: witnesses agreeing, then a score bar that grows only when a confirmation agrees.
const CF_EV = [['Trend', 1], ['Support level', 1], ['Volume', 0], ['Buyer pressure', 1], ['Order book', -1], ['Higher timeframe', 1]];
kit.scene('confidence', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let wit = '';
    for (let i = 0; i < 4; i++) {
      wit += '<g class="cf-w" transform="translate(' + (1130 + i * 150) + ' 290)"><circle cy="-46" r="28" style="fill:color-mix(in srgb, var(--main) 30%, var(--ground));stroke:var(--main);stroke-width:2.5"/>' +
        '<path d="M-44 36 Q-44 -8 0 -8 Q44 -8 44 36 Z" style="fill:color-mix(in srgb, var(--main) 20%, var(--ground));stroke:var(--main);stroke-width:2.5"/>' +
        '<g class="cf-wb"><circle cx="34" cy="-86" r="22" style="fill:var(--up)"/><path d="M24 -86 L31 -79 L45 -94" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--ground)"/></g></g>';
    }
    let ev = '';
    CF_EV.forEach((e) => {
      const mk = e[1] === 1 ? '✓' : e[1] === 0 ? '✗' : '–';
      const col = e[1] === 1 ? 'var(--up)' : e[1] === 0 ? 'var(--down)' : 'color-mix(in srgb, var(--second) 50%, var(--ground))';
      ev += '<div class="cf-e" style="display:flex;align-items:center;gap:14px;width:300px"><span class="mono" style="font-size:30px;font-weight:700;width:30px;color:' + col + '">' + mk + '</span>' +
        '<span style="font-size:26px;font-weight:600">' + e[0] + (e[1] === -1 ? ' <span class="lbl">no data</span>' : '') + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + wit + '<text class="cf-wl" x="1355" y="380" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 65%, var(--ground));font-size:26px">Independent witnesses who agree</text></svg>' +
      '<div class="words" style="left:140px;top:200px;width:800px"><p class="kick cf-k">Confidence</p>' +
      '<h2 class="line cf-t">More agreement, higher score</h2>' +
      '<p class="def cf-d"><b>Confidence</b> scores how much independent evidence agrees with a setup.</p></div>' +
      '<div class="glass cf-p" style="left:1060px;top:440px;width:720px;padding:22px 32px">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline"><span class="kick" style="font-size:20px">Score · BUY setup</span><span class="mono cf-v" style="font-size:40px;color:var(--up)"></span></div>' +
      '<div style="position:relative;height:22px;border-radius:11px;margin:14px 0 20px;background:color-mix(in srgb, var(--second) 10%, transparent);overflow:hidden"><div class="cf-f" style="height:100%;width:0;border-radius:11px;background:linear-gradient(90deg, var(--main), var(--up))"></div></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:14px 40px">' + ev + '</div></div>' +
      '<p class="fict cf-fi" style="position:absolute;left:1060px;top:410px;margin:0">Illustrative example · fictional score</p></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.cf-k').style; this.t = q('.cf-t'); this.d = q('.cf-d');
    this.ws = all('.cf-w'); this.wbs = all('.cf-wb').map((e) => e.style); this.wl = q('.cf-wl').style;
    this.p = q('.cf-p').style; this.v = q('.cf-v'); this.f = q('.cf-f').style; this.fi = q('.cf-fi').style;
    this.es = all('.cf-e').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.8, pose: 'explain' }, { t: 5.6, pose: 'idea' }, { t: 12.4, pose: 'pointer', flip: true }, { t: 19.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.0, { stagger: 0.05 });
    // witnesses appear one by one, each nodding yes
    this.ws.forEach((g, i) => {
      const a = 5.8 + i * 0.9, p = seg(t, a, a + 0.5);
      g.style.opacity = eo(p);
      g.setAttribute('transform', 'translate(' + (1130 + i * 150) + ' ' + (290 + lerp(20, 0, eo(p))).toFixed(1) + ')');
      const b = seg(t, a + 0.4, a + 0.8);
      this.wbs[i].opacity = eo(b); this.wbs[i].transformBox = 'fill-box'; this.wbs[i].transformOrigin = 'center';
      this.wbs[i].transform = 'scale(' + lerp(0.4, 1, eob(b, 1.8)).toFixed(3) + ')';
    });
    this.wl.opacity = eo(seg(t, 9.4, 10.0));
    UI.rise(kit, this.p, t, 12.2, 0.6, 24);
    let fill = 0;
    CF_EV.forEach((e, i) => {
      const a = 13.0 + i * 1.0, p = seg(t, a, a + 0.4);
      this.es[i].opacity = eo(p); this.es[i].transform = 'translateX(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)';
      if (e[1] === 1) fill += eio(seg(t, a + 0.3, a + 0.8)) * 18;
    });
    this.f.width = fill.toFixed(2) + '%';
    UI.set(this.v, t > 19.0 ? Math.round(lerp(0, 72, eo(seg(t, 19.0, 19.4)))) + '%' : '');
    this.fi.opacity = 0.9 * eo(seg(t, 19.0, 19.6));
    this.tutor.render(t);
  },
});
