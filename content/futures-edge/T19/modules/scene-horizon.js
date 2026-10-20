const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// XORA's analysis horizon: about 10–15 minutes of past candles for context. The future side stays unknown.
const HZ_H = UI.H, hzX = (i) => 200 + i * 52, hzY = (p) => 640 - (p - 59950) / 330 * 280, HZ_NOW = hzX(14) + 30;
kit.scene('horizon', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'hz-c', HZ_H.length);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<rect class="hz-w" x="170" y="330" width="' + (HZ_NOW - 170) + '" height="370" rx="14" stroke-width="3" stroke-dasharray="12 8" style="fill:color-mix(in srgb, var(--main) 9%, transparent);stroke:var(--main)"/>' +
      '<rect class="hz-f" x="' + (HZ_NOW + 10) + '" y="330" width="300" height="370" rx="14" style="fill:color-mix(in srgb, var(--second) 5%, transparent);stroke:color-mix(in srgb, var(--second) 20%, transparent);stroke-width:2"/>' +
      '<line class="hz-now" x1="' + HZ_NOW + '" x2="' + HZ_NOW + '" y1="320" y2="712" stroke-width="3" style="stroke:var(--second)"/>' +
      this.cd.html + '</svg>' +
      '<p class="tag hz-wl" style="left:186px;top:342px;color:var(--main);border-color:var(--main)">Analysis horizon ≈ 10–15 min</p>' +
      '<p class="kick hz-nl" style="position:absolute;left:' + (HZ_NOW - 30) + 'px;top:716px;margin:0;font-size:20px">Now</p>' +
      '<p class="hz-q" style="position:absolute;left:' + (HZ_NOW + 10) + 'px;width:300px;top:440px;text-align:center;margin:0;font-size:120px;font-weight:700;color:color-mix(in srgb, var(--second) 35%, var(--ground))">?</p>' +
      '<p class="kick hz-fl" style="position:absolute;left:' + (HZ_NOW + 30) + 'px;top:346px;margin:0;font-size:20px">Next · unknown</p>' +
      '<div class="hz-x1" style="position:absolute;left:1340px;top:340px;display:flex;align-items:center;gap:16px"><span class="hz-xm" style="width:44px;height:44px;border-radius:50%;background:var(--down);display:grid;place-items:center;color:var(--ground);font-size:30px;font-weight:800">✕</span><span style="font-size:30px;font-weight:600">A time you must hold</span></div>' +
      '<div class="hz-x2" style="position:absolute;left:1340px;top:430px;display:flex;align-items:center;gap:16px"><span style="width:44px;height:44px;border-radius:50%;background:var(--down);display:grid;place-items:center;color:var(--ground);font-size:30px;font-weight:800">✕</span><span style="font-size:30px;font-weight:600">A prediction window</span></div>' +
      '<div class="hz-ok" style="position:absolute;left:1340px;top:520px;display:flex;align-items:center;gap:16px"><span style="width:44px;height:44px;border-radius:50%;background:var(--main);display:grid;place-items:center;color:var(--ground);font-size:28px;font-weight:800">✓</span><span style="font-size:30px;font-weight:600">Context for a decision,<br>including NO_TRADE</span></div>' +
      '<p class="fict" style="position:absolute;left:200px;top:300px;margin:0">Fictional 1-minute candles</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick hz-k">A note on XORA</p>' +
      '<h2 class="line hz-t">10–15 minutes is context</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hz-k').style; this.t = q('.hz-t'); this.w = q('.hz-w').style; this.f = q('.hz-f').style; this.now = q('.hz-now').style;
    this.wl = q('.hz-wl').style; this.nl = q('.hz-nl').style; this.q = q('.hz-q').style; this.fl = q('.hz-fl').style;
    this.x1 = q('.hz-x1').style; this.x2 = q('.hz-x2').style; this.ok = q('.hz-ok').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'present' }, { t: 6.3, pose: 'explain' }, { t: 11.8, pose: 'think' }, { t: 15.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    HZ_H.forEach((c, i) => {
      const a = 0.6 + i * 0.2, p = seg(t, a, a + 0.4);
      this.cd.set(i, { x: hzX(i), w: 32, o: c[0], h: lerp(c[0], c[1], eo(p)), l: lerp(c[0], c[2], eo(p)), c: lerp(c[0], c[3], eo(p)), y: hzY, op: eo(seg(t, a, a + 0.2)) });
    });
    this.now.opacity = eo(seg(t, 3.4, 3.8)); this.nl.opacity = this.now.opacity;
    const w = seg(t, 3.8, 4.8);
    this.w.opacity = eo(w); this.w.strokeDashoffset = (-t * 12).toFixed(1);
    this.wl.opacity = eo(seg(t, 4.4, 4.9));
    this.f.opacity = eo(seg(t, 5.0, 5.5)); this.fl.opacity = eo(seg(t, 5.2, 5.7));
    this.q.opacity = (eo(seg(t, 5.4, 5.9)) * (0.75 + 0.25 * Math.sin(t * 2.2))).toFixed(3);
    UI.rise(this.x1, t, 6.8); UI.rise(this.x2, t, 12.3); UI.rise(this.ok, t, 15.8);
    this.tutor.render(t);
  },
});
