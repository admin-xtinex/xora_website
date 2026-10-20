const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Course end card: congratulations, what finishing does not mean, and practising in demo mode.
kit.scene('next', {
  init(kit) {
    const pts = UI.walk(kit, 31, 96, 140, 1780, 930, 840, 18);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="nextB-g" x1="0" x2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient></defs>' +
      '<path class="next-path" d="' + UI.d(pts) + '" pathLength="1" fill="none" stroke="url(#nextB-g)" stroke-width="4" stroke-linecap="round" style="opacity:.5"/></svg>' +
      '<div class="next-lock" style="position:absolute;left:0;right:0;top:130px;display:flex;justify-content:center"></div>' +
      '<div class="words" style="left:210px;top:270px;width:1500px;align-items:center;text-align:center;gap:24px">' +
      '<p class="kick next-k">Checkpoint B complete · Course complete</p>' +
      '<h2 class="line next-t" style="font-size:100px">Congratulations!</h2>' +
      '<p class="sub next-s" style="margin:0">You finished every lesson of XORA Futures Edge.</p>' +
      '<div class="rule next-r" style="width:240px"></div>' +
      '<div style="display:flex;gap:20px;justify-content:center">' +
      '<span class="chip next-c" style="font-size:28px"><span class="dot" style="background:var(--accent)"></span>Not a certification</span>' +
      '<span class="chip next-c" style="font-size:28px"><span class="dot" style="background:var(--accent)"></span>Not permission to trade</span>' +
      '<span class="chip next-c" style="font-size:28px;background:var(--main);color:var(--ground);border-color:var(--main)"><svg width="24" height="24" viewBox="0 0 28 28"><path d="M7 4 L24 14 L7 24 Z" style="fill:var(--ground)"/></svg>Keep practising in demo mode</span></div></div>' +
      '<p class="fict next-f" style="position:absolute;left:0;right:0;bottom:70px;margin:0;text-align:center">Educational content only · Not financial advice · Crypto and futures involve risk</p>' +
      '</div>'));
    kit.stage.querySelector('.next-lock').append(UI.lockup(kit));
    const q = (s) => kit.stage.querySelector(s);
    this.path = q('.next-path'); this.lock = q('.next-lock').style; this.k = q('.next-k').style; this.s = q('.next-s').style;
    this.t = q('.next-t'); this.r = q('.next-r').style; this.cs = [...kit.stage.querySelectorAll('.next-c')].map((e) => e.style); this.f = q('.next-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }, { t: 1.1, x: 1620, y: 965, s: 230, d: 1.0 }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.1, pose: 'walk', flip: true }, { t: 1.1, pose: 'celebrate' }, { t: 4.6, pose: 'wave' }, { t: 6.0, pose: 'calm' }, { t: 10.4, pose: 'wave' }],
      says: [{ t0: 1.3, t1: 5.4, text: 'You did it!', side: 'top' }],
    });
  },
  render(t) {
    this.path.setAttribute('stroke-dasharray', eio(seg(t, 0, 2.6)) + ' 1');
    const l = seg(t, 0.1, 0.8);
    this.lock.opacity = eo(l);
    this.lock.transform = 'scale(' + lerp(0.85, 1, eob(l, 1.6)) + ')';
    this.k.opacity = eo(seg(t, 0.5, 1.0));
    TextFx.fadeFromRight(this.t, t, 0.7);
    this.s.opacity = eo(seg(t, 1.4, 1.9));
    this.r.transform = 'scaleX(' + eo(seg(t, 1.8, 2.5)) + ')';
    this.cs.forEach((s, i) => {
      const a = 6.2 + i * 0.6, c = seg(t, a, a + 0.6);
      s.opacity = eo(seg(t, a, a + 0.3));
      s.transform = 'scale(' + (lerp(0.8, 1, eob(c, 1.7)) * (i === 2 ? kit.breathe(Math.max(0, t - a - 0.6), 0.015, 2.4) : 1)).toFixed(4) + ')';
    });
    this.f.opacity = 0.9 * eo(seg(t, 2.8, 3.4));
    this.tutor.render(t);
  },
});
