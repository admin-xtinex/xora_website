const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Confirmation defined; a mini chart shows a close beyond the zone and a hold; the dark-clouds meter rises but never reaches certain; can / cannot.
const CF_C = [[60, 96, 52, 88], [88, 140, 84, 132], [132, 150, 112, 128], [128, 152, 120, 146]];
const CF_CAN = ['Show what has already happened', 'Make an idea more, or less, likely'];
const CF_NOT = ['Tell you what the next candle does', 'Remove the risk of a loss'];
kit.scene('confirm', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    // Mini chart: price units 0..160 map to y 120..10; the zone is 100..115.
    const my = (v) => 122 - (v - 46);
    this.cd = UI.cdl(kit, 'cf-c', 4);
    const li = (s, ok) => '<div class="cf-i" style="display:flex;align-items:center;gap:16px;height:52px"><svg width="40" height="40" viewBox="0 0 44 44" style="flex:none">' +
      (ok ? '<path class="cf-m" d="M10 23 L19 32 L35 13" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>'
        : '<path class="cf-m" d="M13 13 L31 31 M31 13 L13 31" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--accent)"/>') +
      '</svg><span style="font-size:30px;font-weight:600">' + s + '</span></div>';
    this.h = UI.head(kit, 'Confirmation', 'Evidence, not a promise',
      '<div class="glass cf-a" style="left:140px;top:300px;width:900px;height:280px;padding:22px 32px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:32px"><b>Confirmation</b>: extra evidence, after a signal, that supports an idea.</p>' +
      '<svg class="cf-svg" width="340" height="130" viewBox="0 0 340 130" style="position:absolute;left:24px;top:150px">' +
      '<rect class="cf-z" x="10" y="' + my(115) + '" width="320" height="' + (my(100) - my(115)) + '" rx="4" style="fill:color-mix(in srgb, var(--accent) 24%, transparent);stroke:color-mix(in srgb, var(--accent) 70%, transparent);stroke-width:1.5"/>' + this.cd.html + '</svg>' +
      '<div style="position:absolute;left:390px;top:162px;display:flex;flex-direction:column;gap:6px">' +
      '<p class="tag cf-t1" style="position:relative;margin:0;align-self:flex-start">1 · Closes beyond the zone</p><p class="tag cf-t2" style="position:relative;margin:0;align-self:flex-start">2 · Next candles hold there</p></div></div>' +
      '<div class="glass cf-b" style="left:1080px;top:300px;width:700px;height:280px;padding:22px 32px"><p class="kick" style="margin:0 0 8px">Like dark clouds</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.35;font-weight:600">Rain becomes more likely. Not certain.</p>' +
      '<div style="position:absolute;left:32px;right:32px;top:170px"><div style="position:relative;height:26px;border-radius:13px;background:color-mix(in srgb, var(--second) 10%, transparent)">' +
      '<div class="cf-bar" style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:13px;background:linear-gradient(90deg, var(--main), var(--accent))"></div>' +
      '<div style="position:absolute;right:0;top:-8px;bottom:-8px;width:3px;background:var(--second)"></div></div>' +
      '<div style="display:flex;justify-content:space-between;margin-top:10px;font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))"><span>Less likely</span><span class="cf-ml" style="color:var(--main)">More likely</span><span>Certain</span></div></div></div>' +
      '<div class="glass cf-can" style="left:140px;top:600px;width:800px;height:170px;padding:14px 32px;border-color:var(--main)"><p class="kick" style="margin:0 0 4px">It can</p>' + li(CF_CAN[0], 1) + li(CF_CAN[1], 1) + '</div>' +
      '<div class="glass cf-not" style="left:980px;top:600px;width:800px;height:170px;padding:14px 32px"><p class="kick" style="margin:0 0 4px;color:var(--accent)">It cannot</p>' + li(CF_NOT[0], 0) + li(CF_NOT[1], 0) + '</div>');
    this.my = my;
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.a = q('.cf-a').style; this.b = q('.cf-b').style; this.can = q('.cf-can').style; this.not = q('.cf-not').style;
    this.t1 = q('.cf-t1').style; this.t2 = q('.cf-t2').style; this.bar = q('.cf-bar').style; this.ml = q('.cf-ml').style;
    this.items = all('.cf-i').map((e) => e.style); this.marks = all('.cf-m');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 7.4, pose: 'magnify' }, { t: 13.6, pose: 'idea' }, { t: 19.2, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.a, t, 0.5, 0.7);
    CF_C.forEach((c, i) => {
      const a = i < 1 ? 1.2 : 7.6 + (i - 1) * 1.5, p = eo(seg(t, a, a + 0.8));
      this.cd.set(i, { x: 50 + i * 78, w: 40, o: c[0], h: c[0] + (c[1] - c[0]) * p, l: c[0] + (c[2] - c[0]) * p, c: c[0] + (c[3] - c[0]) * p, y: this.my, op: eo(seg(t, a, a + 0.2)), min: 3 });
    });
    UI.rise(kit, this.t1, t, 8.6, 0.5, 12); UI.rise(kit, this.t2, t, 11.4, 0.5, 12);
    UI.rise(kit, this.b, t, 13.6, 0.7);
    // The meter climbs as evidence arrives, then stops well short of certain.
    const m = lerp(0.18, 0.5, eio(seg(t, 14.6, 16.0))) + lerp(0, 0.22, eio(seg(t, 16.6, 18.0))) + 0.012 * Math.sin(t * 2.2) * seg(t, 18, 19);
    this.bar.width = (m * 100).toFixed(1) + '%'; this.ml.opacity = eo(seg(t, 17.6, 18.2));
    UI.rise(kit, this.can, t, 19.2, 0.6); UI.rise(kit, this.not, t, 19.8, 0.6);
    this.items.forEach((s, i) => { const a = (i < 2 ? 19.8 : 22.4) + (i % 2) * 1.0; s.opacity = eo(seg(t, a, a + 0.4)); this.marks[i].setAttribute('stroke-dasharray', eo(seg(t, a + 0.2, a + 0.6)).toFixed(3) + ' 1'); });
    this.tutor.render(t);
  },
});
