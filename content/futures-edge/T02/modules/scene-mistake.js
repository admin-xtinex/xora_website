const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MS_X0 = 1050, MS_X1 = 1560, MS_X2 = 1730;
const msSmooth = (x) => 660 - 300 * Math.pow(x, 0.85); // x: 0..1 across MS_X0..MS_X1, and beyond for the imagined path
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const r = kit.rng(29), N = 90, real = []; let v = 0;
    for (let i = 0; i <= N; i++) { v += (r() - 0.5) * 46; v *= 0.78; const x = i / N; real.push([MS_X0 + (MS_X1 - MS_X0) * x, msSmooth(x) + v]); }
    // After the "trend", the real path turns down.
    const last = real[real.length - 1], turn = []; v = 0;
    for (let i = 1; i <= 34; i++) { v += (r() - 0.5) * 40; v *= 0.78; const p = i / 34; turn.push([last[0] + (MS_X2 - MS_X1) * p, last[1] + 270 * Math.pow(p, 1.4) + v * (0.4 + p)]); }
    let imag = '';
    for (let i = 0; i <= 40; i++) { const x = i / 40 * (MS_X2 - MS_X0) / (MS_X1 - MS_X0); imag += (i ? 'L' : 'M') + (MS_X0 + (MS_X2 - MS_X0) * i / 40).toFixed(1) + ' ' + msSmooth(x).toFixed(1); }
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass ms-box" style="left:1000px;top:180px;width:780px;height:580px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="ms-s" d="' + imag + '" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:color-mix(in srgb, var(--second) 70%, transparent)"/>' +
      '<path class="ms-r" d="' + UI.d(real) + '" pathLength="1" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<path class="ms-u" d="' + UI.d([last].concat(turn)) + '" pathLength="1" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--accent)"/></svg>' +
      '<p class="kick ms-l1" style="position:absolute;left:1040px;top:220px;margin:0;color:var(--second)">What people imagine</p>' +
      '<p class="kick ms-l2" style="position:absolute;left:1040px;top:260px;margin:0">What really happens</p>' +
      '<span class="chip ms-c" style="position:absolute;left:1420px;top:676px;font-size:24px;padding:10px 20px;background:var(--accent);color:var(--ground);border-color:var(--accent)">The trend turned</span>' +
      '<p class="fict ms-f" style="position:absolute;left:1040px;top:720px;margin:0">Illustrative paths, not real data</p>' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick ms-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line ms-t">Prices do not move in smooth lines</h2>' +
      '<p class="sub ms-a">Real price paths are jagged, full of small ups and downs.</p>' +
      '<p class="def ms-b">Nobody knows the next tick. A neat trend can <b>turn at any moment</b>.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ms-k').style; this.t = q('.ms-t'); this.a = q('.ms-a'); this.b = q('.ms-b');
    this.box = q('.ms-box').style; this.s = q('.ms-s'); this.r = q('.ms-r'); this.u = q('.ms-u');
    this.l1 = q('.ms-l1').style; this.l2 = q('.ms-l2').style; this.c = q('.ms-c').style; this.f = q('.ms-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 6.2, pose: 'magnify' }, { t: 12.0, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.a, t, 6.4, { stagger: 0.06 });
    TextFx.fadeFromRight(this.b, t, 12.0, { stagger: 0.06 });
    this.box.opacity = eo(seg(t, 0.3, 0.9));
    this.s.setAttribute('stroke-dasharray', t < 6.2 ? eio(seg(t, 0.8, 4.0)) + ' 1' : '0.012 0.012');
    this.s.style.opacity = eo(seg(t, 0.7, 1.0)) * lerp(1, 0.5, eo(seg(t, 6.2, 7.0)));
    this.l1.opacity = eo(seg(t, 1.6, 2.1)) * lerp(1, 0.6, eo(seg(t, 6.2, 7.0)));
    this.r.setAttribute('stroke-dasharray', eio(seg(t, 6.4, 10.0)) + ' 1');
    this.r.style.opacity = t > 6.3 ? 1 : 0;
    this.l2.opacity = eo(seg(t, 6.6, 7.1));
    this.u.setAttribute('stroke-dasharray', eio(seg(t, 12.2, 14.2)) + ' 1');
    this.u.style.opacity = t > 12.1 ? 1 : 0;
    const c = seg(t, 14.0, 14.5);
    this.c.opacity = eo(c); this.c.transform = 'scale(' + lerp(0.7, 1, eob(c, 1.8)) + ')';
    this.f.opacity = 0.9 * eo(seg(t, 1.2, 1.8));
    this.tutor.render(t);
  },
});
