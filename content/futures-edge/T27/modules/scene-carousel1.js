const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Carousel cards one and two: the Xora read (explanatory only) and the volume comparison.
const C1_NAMES = ['Xora read', 'Volume', 'Order book', 'Replay', 'Levels'];
kit.scene('carousel1', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.car = UI.carousel(kit, 'c1');
    let names = '';
    C1_NAMES.forEach((n, i) => { names += '<div class="c1-n" style="display:flex;align-items:center;gap:18px"><span class="mono" style="width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:24px;border:2px solid currentColor;flex:none">' + (i + 1) + '</span><span style="font-size:32px;font-weight:700">' + n + '</span></div>'; });
    kit.stage.append(kit.h('<div>' +
      '<div class="words" style="left:140px;top:170px;width:900px"><p class="kick c1-k">Market-read carousel</p><h2 class="line c1-t" style="font-size:72px">Swipe to read the market</h2></div>' +
      '<div style="position:absolute;left:140px;top:380px;display:flex;flex-direction:column;gap:16px">' + names + '</div>' +
      '<div class="glass c1-note" style="left:520px;top:420px;width:540px;padding:20px 26px;border-color:var(--warn)"><p class="kick" style="margin:0 0 8px;color:var(--warn)">Explanatory only</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">The engine\'s stop and exits do not use it.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.c1-k').style; this.t = q('.c1-t'); this.ns = all('.c1-n').map((e) => e.style); this.note = q('.c1-note').style;
    this.disc = q('.c1-disc').style; this.vb = q('.c1-vb').style; this.vs = q('.c1-vs').style; this.vbv = q('.c1-vb-v'); this.vsv = q('.c1-vs-v');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 6.6, pose: 'magnify' }, { t: 14.1, pose: 'pointer', flip: true }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const p = seg(t, 0.4, 1.3);
    this.car.ph.opacity = eo(p); this.car.ph.transform = 'translateY(' + lerp(50, 0, eo(p)).toFixed(1) + 'px)';
    this.car.ml.opacity = 0.9 * eo(seg(t, 1.0, 1.6));
    const idx = eio(seg(t, 13.6, 14.4));
    this.car.go(idx);
    const cur = Math.round(idx);
    this.ns.forEach((s, i) => { s.opacity = (eo(seg(t, 1.0 + i * 0.2, 1.4 + i * 0.2)) * (i === cur ? 1 : 0.4)).toFixed(3); s.color = i === cur ? 'var(--main)' : ''; });
    const d = Math.max(0, Math.sin(Math.PI * seg(t, 6.6, 13.2)));
    this.disc.boxShadow = '0 0 0 ' + (4 * d).toFixed(1) + 'px color-mix(in srgb, var(--warn) 35%, transparent)';
    UI.rise(kit, this.note, t, 7.4, 0.6, 16, 13.2, 13.6);
    const vb = 62 * eio(seg(t, 15.0, 16.6)), vs = 38 * eio(seg(t, 15.4, 17.0));
    this.vb.width = vb.toFixed(1) + '%'; this.vs.width = vs.toFixed(1) + '%';
    UI.set(this.vbv, Math.round(vb) + '%'); UI.set(this.vsv, Math.round(vs) + '%');
    this.tutor.render(t);
  },
});
