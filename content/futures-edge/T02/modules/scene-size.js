const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// [label, people, BTC each, total line, colour, start time]
const SZ = [['3 buyers', 3, 4, '3 × 4 BTC = 12 BTC wanted', 'var(--main)', 6.2], ['10 sellers', 10, 0.2, '10 × 0.2 BTC = 2 BTC offered', 'var(--accent)', 10.8]];
kit.scene('size', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let panels = '';
    SZ.forEach((g, i) => {
      const r = g[1] > 5 ? 28 : 54;
      let dots = '';
      for (let j = 0; j < g[1]; j++) dots += '<span class="sz-d' + i + '" style="flex:none;width:' + 2 * r + 'px;height:' + 2 * r + 'px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb, ' + g[4] + ' 28%, var(--ground));border:3px solid ' + g[4] + '"><span class="mono" style="font-size:' + (r > 30 ? 26 : 22) + 'px">' + (g[2] >= 1 ? g[2] + ' BTC' : g[2]) + '</span></span>';
      panels += '<div class="glass sz-p' + i + '" style="left:' + (140 + i * 820) + 'px;top:340px;width:760px;height:290px;padding:24px 34px;display:flex;flex-direction:column;gap:20px">' +
        '<p class="kick" style="margin:0;color:' + g[4] + '">' + g[0] + (i ? ' · 0.2 BTC each' : ' · 4 BTC each') + '</p>' +
        '<div style="display:flex;gap:12px;align-items:center;height:110px">' + dots + '</div>' +
        '<p class="mono sz-tot' + i + '" style="margin:0;font-size:32px">' + g[3] + '</p>' +
        '<div style="position:relative;height:22px;width:600px;border-radius:11px;background:color-mix(in srgb, var(--second) 10%, transparent)"><div class="sz-bar' + i + '" style="position:absolute;left:0;top:0;bottom:0;width:' + (g[1] * g[2] * 50) + 'px;border-radius:11px;background:' + g[4] + '"></div></div></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1500px"><p class="kick sz-k" style="color:var(--accent)">Careful</p>' +
      '<h2 class="line sz-t">It is not just how many people</h2></div>' + panels +
      '<div class="chip sz-r" style="position:absolute;left:140px;top:664px;background:var(--main);color:var(--ground);border-color:var(--main)">▲ More BTC wanted than offered: price tends to rise</div>' +
      '<p class="fict sz-f" style="position:absolute;left:1380px;top:250px;margin:0">Illustrative amounts</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)].map((e) => e.style);
    this.k = q('.sz-k').style; this.t = q('.sz-t'); this.r = q('.sz-r').style; this.f = q('.sz-f').style;
    this.g = SZ.map((g, i) => ({ p: q('.sz-p' + i).style, d: all('.sz-d' + i), tot: q('.sz-tot' + i).style, bar: q('.sz-bar' + i).style }));
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'explain' }, { t: 6.2, pose: 'point', flip: true }, { t: 10.8, pose: 'magnify' }, { t: 15.5, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.f.opacity = 0.9 * eo(seg(t, 1.0, 1.6));
    SZ.forEach((g, i) => {
      const a = g[5], G = this.g[i], p = seg(t, a - 0.4, a + 0.3);
      G.p.opacity = eo(p); G.p.transform = 'translateY(' + lerp(30, 0, eo(p)) + 'px)';
      G.d.forEach((s, j) => { const b = seg(t, a + 0.2 + j * (i ? 0.12 : 0.3), a + 0.6 + j * (i ? 0.12 : 0.3)); s.opacity = eo(b); s.transform = 'scale(' + lerp(0.3, 1, eob(b, 1.8)).toFixed(3) + ')'; });
      G.tot.opacity = eo(seg(t, a + 1.7, a + 2.2));
      G.bar.transformOrigin = '0 50%'; G.bar.transform = 'scaleX(' + eio(seg(t, a + 2.2, a + 3.2)).toFixed(3) + ')';
    });
    const r = seg(t, 15.5, 16.1);
    this.r.opacity = eo(seg(t, 15.5, 15.8)); this.r.transform = 'scale(' + lerp(0.85, 1, eob(r, 1.7)) + ')'; this.r.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
