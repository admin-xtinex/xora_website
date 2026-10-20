const { seg, eo, ei, eob, eio, lerp } = kit;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div>' +
      '<div class="glass mk-a" style="left:140px;top:300px;width:760px;height:400px;padding:28px 36px;border-color:color-mix(in srgb, var(--down) 55%, transparent)"><p class="kick" style="margin:0 0 18px;color:var(--down)">Mistake</p>' +
      '<p class="mono" style="margin:0;font-size:34px;color:var(--up)">BUY if price trades above 60,120</p><p style="margin:24px 0 0;font-size:56px;line-height:1">↓</p>' +
      '<p style="margin:18px 0 0;font-size:38px;font-weight:700">"So price will go up!"</p>' +
      '<svg class="mk-x" width="760" height="400" viewBox="0 0 760 400" style="position:absolute;left:0;top:0"><path d="M160 210 L600 340 M600 210 L160 340" pathLength="1" fill="none" stroke-width="10" stroke-linecap="round" style="stroke:color-mix(in srgb, var(--down) 70%, transparent)"/></svg></div>' +
      '<div class="glass mk-b" style="left:940px;top:300px;width:740px;height:400px;padding:28px 36px;border-color:color-mix(in srgb, var(--up) 55%, transparent)"><p class="kick" style="margin:0 0 10px;color:var(--up)">Better</p>' +
      ['A plan is an <b class="hl">if</b>, not a forecast', 'Most plans <b class="hl">expire</b> untouched', '<b class="hl">No trade</b> is a normal result', 'Triggered trades can still <b class="dn">lose</b>'].map((s) => '<div class="mk-g" style="display:flex;align-items:center;gap:18px;padding:14px 0"><b style="color:var(--up);font-size:32px">✓</b><span style="font-size:31px;font-weight:600">' + s + '</span></div>').join('') + '</div></div>'));
    this.head = UI.head(kit, 'Common mistake', 'A plan is not a prediction');
    const q = (s) => kit.stage.querySelector(s);
    this.a = q('.mk-a').style; this.b = q('.mk-b').style; this.x = q('.mk-x path');
    this.gs = [...kit.stage.querySelectorAll('.mk-g')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'confused' }, { t: 5.6, pose: 'think' }, { t: 6.0, pose: 'idea' }, { t: 12.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    UI.rise(kit, this.a, t, 0.5, 0.6, 30);
    this.x.setAttribute('stroke-dasharray', eio(seg(t, 4.6, 5.4)) + ' 1');
    this.a.opacity = (eo(seg(t, 0.5, 0.9)) * lerp(1, 0.6, eo(seg(t, 5.8, 6.4)))).toFixed(3);
    UI.rise(kit, this.b, t, 6.0, 0.6, 30);
    this.gs.forEach((s, i) => UI.rise(kit, s, t, 6.8 + i * 1.4, 0.5, 14));
    this.tutor.render(t);
  },
});
