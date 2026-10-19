const { seg, eo, eob, eio, lerp, TextFx } = kit;
kit.scene('next', {
  init(kit) {
    const pts = UI.walk(kit, 15, 96, 140, 1780, 930, 840, 18);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="next-g" x1="0" x2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient></defs>' +
      '<path class="next-path" d="' + UI.d(pts) + '" pathLength="1" fill="none" stroke="url(#next-g)" stroke-width="4" stroke-linecap="round" style="opacity:.5"/></svg>' +
      '<div class="next-lock" style="position:absolute;left:0;right:0;top:150px;display:flex;justify-content:center"></div>' +
      '<div class="words" style="left:210px;top:320px;width:1500px;align-items:center;text-align:center;gap:28px">' +
      '<p class="kick next-k">Lesson T15 complete · Up next: T16</p>' +
      '<h2 class="line next-t" style="font-size:100px">Trend and Market Structure</h2>' +
      '<div class="rule next-r" style="width:240px"></div>' +
      '<div class="chip next-c" style="font-size:32px;padding:20px 38px;background:var(--main);color:var(--ground);border-color:var(--main)"><svg width="26" height="26" viewBox="0 0 28 28"><path d="M7 4 L24 14 L7 24 Z" style="fill:var(--ground)"/></svg><span>Continue to lesson sixteen</span></div></div>' +
      '<p class="fict next-f" style="position:absolute;left:0;right:0;bottom:70px;margin:0;text-align:center">Educational content only · Not financial advice · Crypto involves risk</p>' +
      '</div>'));
    kit.stage.querySelector('.next-lock').append(UI.lockup(kit));
    const q = (s) => kit.stage.querySelector(s);
    this.path = q('.next-path'); this.lock = q('.next-lock').style; this.k = q('.next-k').style;
    this.t = q('.next-t'); this.r = q('.next-r').style; this.c = q('.next-c').style; this.f = q('.next-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }, { t: 1.1, x: 1620, y: 965, s: 230, d: 1.0 }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.1, pose: 'walk', flip: true }, { t: 1.1, pose: 'wave' }, { t: 4.0, pose: 'present' }, { t: 6.8, pose: 'wave' }],
      says: [{ t0: 1.3, t1: 5.4, text: 'See you in T16!', side: 'top' }],
    });
  },
  render(t) {
    this.path.setAttribute('stroke-dasharray', eio(seg(t, 0, 2.6)) + ' 1');
    const l = seg(t, 0.1, 0.8);
    this.lock.opacity = eo(l);
    this.lock.transform = 'scale(' + lerp(0.85, 1, eob(l, 1.6)) + ')';
    this.k.opacity = eo(seg(t, 0.5, 1.0));
    TextFx.fadeFromRight(this.t, t, 0.7);
    this.r.transform = 'scaleX(' + eo(seg(t, 1.5, 2.2)) + ')';
    const c = seg(t, 2.1, 2.7);
    this.c.opacity = eo(seg(t, 2.1, 2.4));
    this.c.transform = 'scale(' + (lerp(0.8, 1, eob(c, 1.7)) * kit.breathe(Math.max(0, t - 2.7), 0.015, 2.4)) + ')';
    this.f.opacity = 0.9 * eo(seg(t, 2.8, 3.4));
    this.tutor.render(t);
  },
});
