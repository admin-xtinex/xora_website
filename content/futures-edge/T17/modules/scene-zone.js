const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Fictional lows at 59,830, 59,860 and 59,880, then a poke to 59,790 that turns back up.
const ZN_K = [[0, 60020], [0.12, 59830], [0.25, 59990], [0.38, 59860], [0.5, 60010], [0.63, 59880], [0.75, 60000], [0.88, 59790], [1, 59960]];
const ZN_LOWS = [[0.12, 59830], [0.38, 59860], [0.63, 59880]];
const znP = (s) => UI.path(ZN_K, s);
const znX = (s) => 180 + s * 980, znY = (p) => 740 - (p - 59740) / 320 * 410;
kit.scene('zone', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let tags = '';
    ZN_LOWS.forEach((l) => { tags += '<p class="tag zn-tag" style="left:' + (znX(l[0]) - 54).toFixed(0) + 'px;top:' + (znY(l[1]) + 16).toFixed(0) + 'px">' + UI.fmt(l[1]) + '</p>'; });
    const row = (a, cls, v) => '<div class="row ' + cls + '"><span>' + a + '</span><span class="mono" style="font-size:32px">' + v + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="zn-grid">' + UI.gridL(180, 1160, znY, 59800, 60000, 50) + '</g>' +
      '<rect class="zn-zone" x="180" y="' + znY(59900).toFixed(1) + '" width="980" height="' + (znY(59800) - znY(59900)).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--main) 20%, transparent);stroke:color-mix(in srgb, var(--main) 70%, transparent);stroke-width:2"/>' +
      '<line class="zn-one" x1="180" x2="1160" y1="' + znY(59850).toFixed(1) + '" y2="' + znY(59850).toFixed(1) + '" stroke-width="3" stroke-dasharray="14 10" style="stroke:var(--accent)"/>' +
      '<path class="zn-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="zn-dot" r="10" style="fill:var(--main)"/>' +
      '<circle class="zn-poke" cx="' + znX(0.88).toFixed(1) + '" cy="' + znY(59790).toFixed(1) + '" r="22" fill="none" stroke-width="4" style="stroke:var(--second)"/></svg>' + tags +
      '<p class="tag zn-ol" style="left:880px;top:' + (znY(59850) - 56).toFixed(0) + 'px;color:var(--accent);border-color:var(--accent)">One exact line?</p>' +
      '<p class="tag zn-pk" style="left:' + (znX(0.88) + 34).toFixed(0) + 'px;top:' + (znY(59790) - 4).toFixed(0) + 'px">Poke 59,790</p>' +
      '<p class="fict" style="position:absolute;left:180px;top:300px;margin:0">BTC/USDT · fictional · zoomed in</p>' +
      '<div class="glass zn-pan" style="left:1290px;top:310px;width:430px;padding:16px 30px">' +
      row('Low 1', 'zn-r', '59,830') + row('Low 2', 'zn-r', '59,860') + row('Low 3', 'zn-r', '59,880') +
      row('Zone', 'zn-r', '59,800–59,900') + '<div class="row zn-r" style="border:0"><span>Height</span><span class="mono hl" style="font-size:32px">100 USDT</span></div>' +
      '<p class="mono zn-r" style="margin:4px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">59,900 − 59,800 = 100</p></div>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick zn-k">An important detail</p>' +
      '<h2 class="line zn-t">Zones, not exact lines</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.zn-k').style; this.t = q('.zn-t'); this.grid = q('.zn-grid').style; this.line = q('.zn-line'); this.dot = q('.zn-dot');
    this.zone = q('.zn-zone').style; this.one = q('.zn-one').style; this.ol = q('.zn-ol').style; this.pk = q('.zn-pk').style; this.poke = q('.zn-poke').style;
    this.tags = all('.zn-tag').map((e) => e.style); this.rows = all('.zn-r').map((e) => e.style); this.pan = q('.zn-pan').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.6, pose: 'idea' }, { t: 6.4, pose: 'magnify' }, { t: 12.0, pose: 'checklist' }, { t: 17.6, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.3, 0.9));
    // Three lows draw first; the poke draws later.
    const end = Math.max(0.002, t < 17.8 ? lerp(0, 0.75, seg(t, 0.6, 6.0)) : lerp(0.75, 1, seg(t, 17.8, 20.6)));
    this.line.setAttribute('d', UI.line(znP, 0, end, znX, znY, 0.004));
    this.dot.setAttribute('cx', znX(end).toFixed(1)); this.dot.setAttribute('cy', znY(znP(end)).toFixed(1));
    this.one.opacity = eo(seg(t, 1.6, 2.2)) * (1 - ei(seg(t, 12.2, 12.8)));
    this.ol.opacity = this.one.opacity;
    this.tags.forEach((s, i) => UI.rise(s, t, 6.6 + i * 0.7, { dy: 14 }));
    UI.rise(this.pan, t, 6.4);
    this.rows.forEach((s, i) => { const a = i < 3 ? 6.8 + i * 0.7 : 12.8 + (i - 3) * 0.8; s.opacity = eo(seg(t, a, a + 0.4)); });
    const z = seg(t, 12.2, 13.2);
    this.zone.opacity = eo(z); this.zone.transformBox = 'fill-box'; this.zone.transformOrigin = 'center';
    this.zone.transform = 'scaleY(' + lerp(0.03, 1, eob(z, 1.4)).toFixed(3) + ')';
    const pk = seg(t, 20.0, 20.6);
    this.poke.opacity = eo(pk); this.poke.transformBox = 'fill-box'; this.poke.transformOrigin = 'center'; this.poke.transform = 'scale(' + lerp(1.8, 1, eob(pk, 1.5)).toFixed(3) + ')';
    UI.rise(this.pk, t, 20.2, { dy: 12 });
    this.tutor.render(t);
  },
});
