const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const WH_MODES = [
  ['DEMO', 'Simulated fills · no real money', 'Default · start here', 'var(--main)'],
  ['LIVE', 'Real Binance USD-M Futures orders', 'Opt-in · needs an API key · asks you to confirm', 'var(--up)'],
  ['LIVE SUPPORT', 'Watches your live account and alerts you', 'Places no order on its own', 'var(--accent)'],
];
const WH_E = [330, 610];
kit.scene('what', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let ticks = '', paths = '', dots = '';
    for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; ticks += '<line x1="' + (Math.cos(a) * 118).toFixed(1) + '" y1="' + (Math.sin(a) * 118).toFixed(1) + '" x2="' + (Math.cos(a) * (i % 3 ? 128 : 138)).toFixed(1) + '" y2="' + (Math.sin(a) * (i % 3 ? 128 : 138)).toFixed(1) + '"/>'; }
    WH_MODES.forEach((m, i) => {
      const y = 445 + i * 140;
      const d = 'M' + (WH_E[0] + 140) + ' ' + WH_E[1] + ' C ' + (WH_E[0] + 230) + ' ' + WH_E[1] + ' ' + 520 + ' ' + y + ' ' + 620 + ' ' + y;
      paths += '<path class="wh-p" d="' + d + '" pathLength="1" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, ' + m[3] + ' 60%, transparent)"/>';
      dots += '<circle class="wh-d" r="9" style="fill:' + m[3] + '"/>';
    });
    let cards = '';
    WH_MODES.forEach((m, i) => {
      cards += '<div class="glass wh-c" style="left:620px;top:' + (390 + i * 140) + 'px;width:960px;height:120px;padding:12px 28px;display:flex;align-items:center;gap:26px;border-color:color-mix(in srgb, ' + m[3] + ' 45%, transparent)">' +
        '<span class="pill" style="color:' + m[3] + ';font-size:26px;min-width:150px;justify-content:center">' + m[0] + '</span>' +
        '<div style="display:flex;flex-direction:column;gap:4px"><span style="font-size:32px;font-weight:700">' + m[1] + '</span><span style="font-size:28px;color:color-mix(in srgb, var(--second) 62%, var(--ground))">' + m[2] + '</span></div></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<p class="def wh-def" style="position:absolute;left:140px;top:282px;width:1450px;margin:0">XORA watches crypto coins, finds <b>trade setups</b> and helps you manage trades.</p>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + paths + dots +
      '<g class="wh-eng" transform="translate(' + WH_E[0] + ' ' + WH_E[1] + ')"><circle r="150" style="fill:color-mix(in srgb, var(--main) 10%, var(--ground))"/>' +
      '<g class="wh-tk" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 60%, transparent)">' + ticks + '</g>' +
      '<circle r="100" fill="none" stroke-width="6" style="stroke:var(--main)"/>' +
      '<text y="-6" text-anchor="middle" style="fill:var(--second);font-family:var(--display);font-weight:700;font-size:44px;letter-spacing:.12em">XORA</text>' +
      '<text y="34" text-anchor="middle" class="mono" style="fill:var(--main);font-size:24px;letter-spacing:.12em">ENGINE</text></g></svg>' +
      cards +
      '<div class="chip wh-sim" style="position:absolute;left:150px;top:790px;font-size:26px;padding:12px 24px"><span class="dot"></span>Demo = a flight simulator</div>' +
      '</div>'));
    this.head = UI.head(kit, 'What XORA is', 'One engine, three modes');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.def = q('.wh-def'); this.eng = q('.wh-eng'); this.tk = q('.wh-tk');
    this.paths = all('.wh-p'); this.dots = all('.wh-d'); this.cards = all('.wh-c').map((e) => e.style); this.sim = q('.wh-sim').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 7.2, pose: 'present' }, { t: 14.3, pose: 'point', flip: true }, { t: 22.3, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    TextFx.fadeFromRight(this.def, t, 0.8, { stagger: 0.04 });
    const e = seg(t, 7.2, 8.0);
    this.eng.style.opacity = eo(e);
    this.eng.setAttribute('transform', 'translate(' + WH_E[0] + ' ' + WH_E[1] + ') scale(' + (lerp(0.6, 1, eob(e, 1.7)) * (1 + 0.015 * Math.sin(t * 2.4))).toFixed(4) + ')');
    this.tk.setAttribute('transform', 'rotate(' + (t * 12).toFixed(1) + ')');
    const starts = [14.6, 16.9, 19.3];
    this.paths.forEach((p, i) => {
      p.setAttribute('stroke-dasharray', eio(seg(t, 9.0 + i * 0.5, 10.0 + i * 0.5)) + ' 1');
      const a = starts[i], k = ((t - a) % 1.6 + 1.6) % 1.6 / 1.6, u = eio(Math.min(1, k * 1.25)), v = 1 - u, y = 445 + i * 140;
      const bx = v * v * v * (WH_E[0] + 140) + 3 * v * v * u * (WH_E[0] + 230) + 3 * v * u * u * 520 + u * u * u * 620;
      const by = v * v * v * WH_E[1] + 3 * v * v * u * WH_E[1] + 3 * v * u * u * y + u * u * u * y;
      this.dots[i].setAttribute('cx', bx.toFixed(1)); this.dots[i].setAttribute('cy', by.toFixed(1));
      this.dots[i].style.opacity = t > a ? (1 - ei(seg(k, 0.75, 0.95))) : 0;
    });
    this.cards.forEach((s, i) => {
      const a = 9.4 + i * 0.5, p = seg(t, a, a + 0.6);
      const on = eo(seg(t, starts[i], starts[i] + 0.5));
      s.opacity = (eo(p) * lerp(0.55, 1, on)).toFixed(3);
      s.transform = 'translateX(' + lerp(40, 0, eo(p)).toFixed(1) + 'px)';
    });
    const d = seg(t, 22.3, 23.0);
    UI.glow(this.cards[0], eo(d) * (0.75 + 0.25 * Math.sin(t * 3)));
    this.cards[0].transform = 'translateX(0) scale(' + lerp(1, 1.03, eob(d, 1.6)).toFixed(4) + ')';
    if (t < 22.3) this.cards[0].transform = 'translateX(' + lerp(40, 0, eo(seg(t, 9.4, 10.0))).toFixed(1) + 'px)';
    UI.rise(kit, this.sim, t, 23.2, 0.6, 20);
    this.tutor.render(t);
  },
});
