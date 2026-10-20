const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Wrong way: direction first, reasons after. Right way: checklist in order, then a decision with a reason.
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const step = (n, s) => '<div class="mk-s" style="display:flex;align-items:center;gap:16px;height:46px"><span class="mono" style="flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-size:20px;background:var(--main);color:var(--ground)">' + n + '</span><span style="font-size:30px;font-weight:600">' + s + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1500px"><p class="kick mk-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line mk-t" style="font-size:64px">Direction first, reasons later</h2></div>' +
      '<div class="glass mk-a" style="left:140px;top:310px;width:760px;height:340px;padding:28px 36px"><p class="kick" style="margin:0 0 18px;color:var(--accent)">The mistake</p>' +
      '<div style="display:flex;align-items:center;gap:20px"><span class="chip mono" style="background:var(--up);color:var(--ground);border-color:var(--up);font-size:32px">BUY!</span><span style="font-size:36px">→</span><span style="font-size:30px;font-weight:600">look for reasons that agree</span></div>' +
      '<p style="margin:26px 0 0;font-size:30px;line-height:1.4;color:color-mix(in srgb, var(--second) 75%, var(--ground))">“The candles are green, so it must go up.”</p>' +
      '<svg class="mk-x" width="700" height="120" viewBox="0 0 700 120" style="position:absolute;left:30px;top:150px"><path class="mk-xp" d="M30 20 L670 100 M670 20 L30 100" pathLength="1" fill="none" stroke-width="8" stroke-linecap="round" style="stroke:var(--accent)"/></svg></div>' +
      '<div class="glass mk-b" style="left:960px;top:310px;width:820px;height:340px;padding:28px 36px;border-color:var(--main)"><p class="kick" style="margin:0 0 12px">The correction</p>' +
      step(1, 'Trend → range → zones') + step(2, 'Volume → risk budget') + step(3, 'Then decide, and write why') +
      '<div class="mk-w" style="display:flex;align-items:center;gap:18px;margin-top:18px"><span class="chip mono" style="background:var(--main);color:var(--ground);border-color:var(--main);font-size:30px;padding:10px 26px">WAIT</span><span style="font-size:30px;font-weight:600">is a result, not a failure</span></div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.a = q('.mk-a').style; this.b = q('.mk-b').style; this.xp = q('.mk-xp');
    this.ss = [...kit.stage.querySelectorAll('.mk-s')].map((e) => e.style); this.w = q('.mk-w').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 7.0, pose: 'checklist' }, { t: 14.2, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.a, t, 0.6, 0.7);
    this.xp.setAttribute('stroke-dasharray', eio(seg(t, 7.0, 7.7)).toFixed(3) + ' 1'); this.xp.style.opacity = t >= 7.0 ? 0.85 : 0;
    this.a.filter = 'saturate(' + lerp(1, 0.4, eo(seg(t, 7.2, 8.0))).toFixed(2) + ')';
    UI.rise(kit, this.b, t, 7.4, 0.7);
    this.ss.forEach((s, i) => UI.rise(kit, s, t, 8.4 + i * 1.3, 0.5, 14));
    const w = seg(t, 14.2, 14.8);
    this.w.opacity = eo(w); this.w.transform = 'scale(' + lerp(0.8, 1, eob(w, 1.7)).toFixed(3) + ')'; this.w.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
