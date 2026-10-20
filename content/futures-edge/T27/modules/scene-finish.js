const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Course complete: congratulations, practise in DEMO, the risk line and the XTINEX | XORA lockup.
kit.scene('finish', {
  init(kit) {
    const pts = UI.walk(kit, 27, 96, 140, 1780, 930, 840, 18);
    const r = kit.rng(270); let conf = '';
    this.cf = [];
    for (let i = 0; i < 46; i++) {
      const c = { x: 160 + r() * 1600, v: 60 + r() * 90, d: r() * 1.4, w: 10 + r() * 10, rot: r() * 360, col: ['var(--main)', 'var(--accent)', 'var(--up)', 'var(--warn)'][i % 4] };
      this.cf.push(c);
      conf += '<rect class="fn-cf" width="' + c.w.toFixed(1) + '" height="' + (c.w * 0.5).toFixed(1) + '" rx="2" style="fill:' + c.col + '"/>';
    }
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="t27fin-g" x1="0" x2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient></defs>' +
      '<path class="fn-path" d="' + UI.d(pts) + '" pathLength="1" fill="none" stroke="url(#t27fin-g)" stroke-width="4" stroke-linecap="round" style="opacity:.5"/>' + conf + '</svg>' +
      '<div class="fn-lock" style="position:absolute;left:0;right:0;top:140px;display:flex;justify-content:center"></div>' +
      '<div class="words" style="left:210px;top:290px;width:1500px;align-items:center;text-align:center;gap:26px">' +
      '<p class="kick fn-k">Lesson T27 complete · Phase 6 complete · Course complete</p>' +
      '<h2 class="line fn-t" style="font-size:104px">Congratulations!</h2>' +
      '<p class="sub fn-s">You finished XORA Futures Edge.</p>' +
      '<div class="rule fn-r" style="width:240px"></div>' +
      '<div class="chip fn-c" style="font-size:32px;padding:20px 38px;background:var(--main);color:var(--ground);border-color:var(--main)"><svg width="26" height="26" viewBox="0 0 28 28"><path d="M7 4 L24 14 L7 24 Z" style="fill:var(--ground)"/></svg><span>Next: practise in DEMO</span></div></div>' +
      '<p class="risk-line fn-f" style="position:absolute;left:0;right:120px;top:700px;margin:0;text-align:center">XORA does not guarantee profits · Practise in DEMO first · Not financial advice</p>' +
      '</div>'));
    kit.stage.querySelector('.fn-lock').append(UI.lockup(kit));
    const q = (s) => kit.stage.querySelector(s);
    this.path = q('.fn-path'); this.lock = q('.fn-lock').style; this.k = q('.fn-k').style; this.s = q('.fn-s');
    this.t = q('.fn-t'); this.r = q('.fn-r').style; this.c = q('.fn-c').style; this.f = q('.fn-f').style;
    this.cfs = [...kit.stage.querySelectorAll('.fn-cf')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }, { t: 1.1, x: 1620, y: 965, s: 230, d: 1.0 }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.1, pose: 'walk', flip: true }, { t: 1.1, pose: 'celebrate' }, { t: 5.0, pose: 'wave' }, { t: 8.0, pose: 'cheer' }, { t: 10.4, pose: 'wave' }],
      says: [{ t0: 1.3, t1: 5.4, text: 'You did it! Well done.', side: 'top' }],
    });
  },
  render(t) {
    this.path.setAttribute('stroke-dasharray', eio(seg(t, 0, 2.6)) + ' 1');
    const l = seg(t, 0.1, 0.8);
    this.lock.opacity = eo(l);
    this.lock.transform = 'scale(' + lerp(0.85, 1, eob(l, 1.6)) + ')';
    this.k.opacity = eo(seg(t, 0.5, 1.0));
    TextFx.fadeFromRight(this.t, t, 0.7);
    TextFx.fadeFromRight(this.s, t, 1.4, { stagger: 0.08 });
    this.r.transform = 'scaleX(' + eo(seg(t, 1.8, 2.4)) + ')';
    const c = seg(t, 6.4, 7.0);
    this.c.opacity = eo(seg(t, 6.4, 6.7));
    this.c.transform = 'scale(' + (lerp(0.8, 1, eob(c, 1.7)) * kit.breathe(Math.max(0, t - 7.0), 0.015, 2.4)) + ')';
    this.f.opacity = eo(seg(t, 6.8, 7.4));
    // confetti falls once, from t = 0.8
    this.cfs.forEach((e, i) => {
      const cf = this.cf[i], tt = t - 0.8 - cf.d;
      if (tt < 0) { e.style.opacity = 0; return; }
      const y = -20 + tt * cf.v * 2.2, x = cf.x + Math.sin(tt * 2 + i) * 30;
      e.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (cf.rot + tt * 120).toFixed(1) + ')');
      e.style.opacity = Math.max(0, Math.min(1, 1 - (y - 700) / 200)).toFixed(3);
    });
    this.tutor.render(t);
  },
});
