const { seg, eo, ei, eio, lerp, TextFx } = kit;
kit.scene('signal', {
  init(kit) {
    const N = 96;
    this.rough = UI.walk(kit, 11, N, 140, 1780, 800, 560, 120);
    this.calm = UI.walk(kit, 11, N, 140, 1780, 800, 560, 18);
    this.N = N;
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs>' +
      '<linearGradient id="signal-g" x1="0" x2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient>' +
      '<linearGradient id="signal-a" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--main);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--main);stop-opacity:0"/></linearGradient></defs>' +
      '<g class="signal-plot"><path class="signal-area" fill="url(#signal-g)" style="fill:url(#signal-a)"/>' +
      '<path class="signal-path" pathLength="1" fill="none" stroke="url(#signal-g)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<circle class="signal-head" r="11" style="fill:var(--second)"/><circle class="signal-ring" r="26" fill="none" stroke-width="2" style="stroke:var(--main)"/></g></svg>' +
      '<div class="signal-lock" style="position:absolute;left:140px;top:104px"></div>' +
      '<div class="words signal-a" style="left:140px;top:250px;width:1200px"><p class="kick">Welcome video</p><h1 class="line">Markets look like noise at first.</h1></div>' +
      '<div class="words signal-b" style="left:140px;top:250px;width:1200px"><p class="kick">XORA Futures Edge</p><h1 class="line">This course teaches you to read them, step by step.</h1></div>' +
      '<p class="fict signal-tag" style="position:absolute;right:140px;bottom:96px;margin:0">Illustrative price line, not real market data</p>' +
      '</div>'));
    kit.stage.querySelector('.signal-lock').append(UI.lockup(kit));
    const q = (s) => kit.stage.querySelector(s);
    this.path = q('.signal-path'); this.area = q('.signal-area'); this.head = q('.signal-head'); this.ring = q('.signal-ring');
    this.plot = q('.signal-plot').style; this.lock = q('.signal-lock').style; this.tag = q('.signal-tag').style;
    this.a = q('.signal-a'); this.b = q('.signal-b');
    this.aLine = q('.signal-a .line'); this.bLine = q('.signal-b .line');
    this.aKick = q('.signal-a .kick').style; this.bKick = q('.signal-b .kick').style;
  },
  render(t) {
    const m = eio(seg(t, 3.6, 5.4));
    const pts = this.rough.map((p, i) => [p[0], lerp(p[1], this.calm[i][1], m)]);
    const d = UI.d(pts);
    this.path.setAttribute('d', d);
    const draw = eio(seg(t, -1.6, 3.4));
    this.path.setAttribute('stroke-dasharray', draw + ' 1');
    const hi = Math.min(this.N - 1, Math.floor(draw * (this.N - 1)));
    const h = pts[hi];
    this.head.setAttribute('cx', h[0]); this.head.setAttribute('cy', h[1]);
    this.ring.setAttribute('cx', h[0]); this.ring.setAttribute('cy', h[1]);
    const pulse = (t % 1.6) / 1.6;
    this.ring.setAttribute('r', lerp(14, 40, pulse));
    this.ring.style.opacity = (1 - pulse) * 0.8;
    this.area.setAttribute('d', d + ' L1780 1080 L140 1080 Z');
    this.area.style.opacity = m;
    this.plot.transform = 'translateX(' + (-t * 4).toFixed(2) + 'px)';
    this.lock.opacity = eo(seg(t, -0.8, -0.1));
    this.aKick.opacity = eo(seg(t, -0.9, -0.4)) * (1 - ei(seg(t, 3.3, 3.7)));
    TextFx.fadeFromRight(this.aLine, t, -1.1);
    if (t >= 3.3) TextFx.fadeOutLeft(this.aLine, t, 3.3);
    this.a.style.opacity = t > 4.1 ? 0 : 1;
    this.b.style.opacity = t < 3.9 ? 0 : 1;
    this.bKick.opacity = eo(seg(t, 4.0, 4.5));
    TextFx.fadeFromRight(this.bLine, t, 4.1);
    this.tag.opacity = 0.9 * eo(seg(t, 0.4, 1.2));
  },
});
