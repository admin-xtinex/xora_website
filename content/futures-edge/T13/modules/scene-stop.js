const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// Concept chart, no price levels: a high-leverage long whose liquidation zone sits above a far-away stop-loss.
const SP_ENTRY = 280, SP_Z0 = 470, SP_Z1 = 530, SP_STOP = 630, SP_HIT = 12.0;
const SP_X = (t) => 1010 + Math.min(t, 21) / 21 * 720;
kit.scene('stop', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const r = kit.rng(4); this.nz = []; for (let i = 0; i < 230; i++) this.nz.push(r() - 0.5);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:760px"><p class="kick sp-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line sp-t" style="font-size:64px;position:relative">“My stop-loss protects me from liquidation”</h2></div>' +
      '<div class="glass sp-fix" style="left:140px;top:500px;width:760px;padding:24px 32px;border-color:var(--main)"><p class="kick" style="margin:0 0 8px">Correction</p>' +
      '<p class="def sp-d" style="margin:0">A stop-loss is <b>not liquidation insurance</b>. It can come too late, or fill late in a gap.</p></div>' +
      '<div class="glass sp-g" style="left:960px;top:170px;width:820px;height:560px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="sp-chart">' +
      '<line x1="1010" x2="1730" y1="' + SP_ENTRY + '" y2="' + SP_ENTRY + '" stroke-dasharray="6 8" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
      '<text x="1020" y="' + (SP_ENTRY - 12) + '" style="fill:color-mix(in srgb, var(--second) 65%, var(--ground));font-size:22px">entry · long, high leverage</text>' +
      '<rect class="sp-zone" x="1010" y="' + SP_Z0 + '" width="720" height="' + (SP_Z1 - SP_Z0) + '" style="fill:color-mix(in srgb, var(--accent) 22%, transparent)"/>' +
      '<text class="sp-zl" x="1020" y="' + (SP_Z1 + 32) + '" style="fill:var(--accent);font-size:22px;font-weight:600">Liquidation zone · leverage and exchange rules</text>' +
      '<line class="sp-stop" x1="1010" x2="1730" y1="' + SP_STOP + '" y2="' + SP_STOP + '" stroke-dasharray="12 8" stroke-width="3" style="stroke:var(--main)"/>' +
      '<text class="sp-sl" x="1020" y="' + (SP_STOP + 34) + '" style="fill:var(--main);font-size:22px;font-weight:600">Your stop-loss</text>' +
      '<path class="sp-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/>' +
      '<g class="sp-stamp"><rect x="-110" y="-30" width="220" height="60" rx="12" stroke-width="4" style="fill:color-mix(in srgb, var(--ground) 60%, var(--accent));stroke:var(--accent)"/><text y="11" text-anchor="middle" style="fill:var(--second);font-size:28px;font-weight:700;letter-spacing:.06em">LIQUIDATED</text></g></g>' +
      '<text x="985" y="214" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">Concept picture · no real levels</text></svg>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sp-k').style; this.t = q('.sp-t'); this.fix = q('.sp-fix').style; this.d = q('.sp-d');
    this.g = q('.sp-g').style; this.chart = q('.sp-chart').style; this.zone = q('.sp-zone').style; this.zl = q('.sp-zl').style;
    this.stop = q('.sp-stop').style; this.sl = q('.sp-sl'); this.line = q('.sp-line'); this.stamp = q('.sp-stamp');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 5.8, pose: 'point', flip: true }, { t: 11.3, pose: 'magnify' }, { t: 16.4, pose: 'explain' }],
      says: [],
    });
  },
  y(s) { const i = Math.min(229, Math.floor(s * 10)); const fall = eio(clamp01((s - 6.5) / (SP_HIT - 6.5))); return SP_ENTRY + 10 + this.nz[i] * 16 + fall * (SP_Z0 + 20 - SP_ENTRY - 10); },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1, { stagger: 0.06 });
    this.g.opacity = eo(seg(t, 1.4, 2.0)); this.chart.opacity = eo(seg(t, 1.8, 2.4));
    this.stop.opacity = eo(seg(t, 2.6, 3.0)); this.sl.style.opacity = eo(seg(t, 2.6, 3.0));
    this.zone.opacity = this.zl.opacity = eo(seg(t, 5.8, 6.4));
    // Price falls into the liquidation zone and the line stops there: the stop below is never reached.
    const end = Math.min(t, SP_HIT);
    let d = '';
    for (let s = 0; s <= end + 1e-6; s += 0.1) d += (s ? 'L' : 'M') + SP_X(s).toFixed(1) + ' ' + this.y(s).toFixed(1);
    this.line.setAttribute('d', d);
    this.line.style.opacity = eo(seg(t, 2.0, 2.4));
    const sp = seg(t, SP_HIT, SP_HIT + 0.5);
    this.stamp.setAttribute('transform', 'translate(' + (SP_X(SP_HIT) + 190).toFixed(1) + ' ' + (SP_Z0 - 60) + ') rotate(-6) scale(' + lerp(1.6, 1, eob(sp, 1.4)).toFixed(3) + ')');
    this.stamp.style.opacity = eo(sp);
    UI.set(this.sl, t >= SP_HIT + 0.6 ? 'Your stop-loss · never reached' : 'Your stop-loss');
    this.stop.opacity = t >= SP_HIT + 0.6 ? 0.45 : this.stop.opacity;
    this.t.style.opacity = (1 - 0.55 * eo(seg(t, 16.4, 17.0))).toFixed(3); const strike = t > 16.6 ? 'line-through' : 'none'; for (const w of this.t.querySelectorAll('span')) { w.style.textDecoration = strike; w.style.textDecorationColor = 'var(--accent)'; w.style.textDecorationThickness = '5px'; }
    UI.rise(kit, this.fix, t, 16.4, 0.7);
    TextFx.fadeFromRight(this.d, t, 16.6, { stagger: 0.04 });
    this.tutor.render(t);
  },
});
