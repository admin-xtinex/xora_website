const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Fictional candles against the 60,300–60,400 zone; each one adds (or fails to add) evidence.
const CF_C = [[60310, 60460, 60290, 60350], [60350, 60500, 60340, 60480], [60480, 60550, 60460, 60530], [60530, 60580, 60500, 60560], [60560, 60570, 60390, 60500]];
const CF_AT = [6.2, 8.4, 11.4, 12.2, 15.0];
const CF_OK = [0, 1, 1, 1, 1];
const cfX = (i) => 1060 + i * 105, cfY = (p) => 740 - (p - 60200) / 400 * 340;
const CF_ITEMS = ['A close beyond the zone, not just a wick', 'The next candles stay beyond it', 'A retest of the zone holds'];
const CF_IT = [8.6, 12.4, 15.4];
const CF_FILL = [[6.0, 0], [9.0, 0.24], [12.8, 0.48], [15.8, 0.7]];
kit.scene('confirm', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'cf-c', CF_C.length);
    let marks = '';
    CF_C.forEach((c, i) => {
      const x = cfX(i), y = cfY(c[1]) - 42, ok = CF_OK[i], col = ok ? 'var(--up)' : 'var(--down)';
      marks += '<g transform="translate(' + x + ' ' + y.toFixed(1) + ')"><g class="cf-m"><circle r="20" stroke-width="3" style="fill:color-mix(in srgb, var(--ground) 70%, ' + col + ');stroke:' + col + '"/>' +
        (ok ? '<path d="M-9 1 L-3 7 L9 -6" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--second)"/>' : '<path d="M-7 -7 L7 7 M7 -7 L-7 7" fill="none" stroke-width="4" stroke-linecap="round" style="stroke:var(--second)"/>') + '</g></g>';
    });
    let items = '';
    CF_ITEMS.forEach((s, i) => {
      items += '<div class="cf-i" style="display:flex;align-items:center;gap:22px"><svg width="54" height="54" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>' +
        '<text x="26" y="34" text-anchor="middle" class="mono cf-num" style="fill:var(--main);font-size:24px">' + (i + 1) + '</text>' +
        '<path class="cf-tick" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--up)"/></svg><span style="font-size:32px;font-weight:600">' + s + '</span></div>';
    });
    const lab = (x, s, cls) => '<span class="' + (cls || '') + '" style="position:absolute;left:' + x + 'px;top:64px;font-size:22px;white-space:nowrap;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + s + '</span>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="cf-grid">' + UI.grid(1010, 1540, cfY, 60200, 60600, 100) + '</g>' +
      '<rect class="cf-zone" x="1010" y="' + cfY(60400).toFixed(1) + '" width="530" height="' + (cfY(60300) - cfY(60400)).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--accent) 20%, transparent);stroke:color-mix(in srgb, var(--accent) 75%, transparent);stroke-width:2"/>' +
      this.cd.html + marks + '</svg>' +
      '<p class="fict" style="position:absolute;left:1010px;top:300px;margin:0">Zone 60,300–60,400 · fictional</p>' +
      '<div class="words" style="left:140px;top:160px;width:840px"><p class="kick cf-k">Confirmation</p>' +
      '<h2 class="line cf-t">Evidence it is holding</h2>' +
      '<div style="display:flex;flex-direction:column;gap:20px;margin-top:4px">' + items + '</div></div>' +
      '<div class="glass cf-meter" style="left:140px;top:600px;width:840px;height:150px;padding:18px 30px">' +
      '<p class="kick" style="margin:0;font-size:20px">How believable is the breakout?</p>' +
      '<div style="position:absolute;left:30px;right:30px;top:58px;height:20px;border-radius:10px;background:color-mix(in srgb, var(--second) 10%, transparent);overflow:hidden">' +
      '<i class="cf-fill" style="display:block;height:100%;width:0;background:linear-gradient(90deg, var(--main), var(--accent))"></i>' +
      '<i style="position:absolute;right:0;top:0;bottom:0;width:15%;background:repeating-linear-gradient(135deg, color-mix(in srgb, var(--down) 45%, transparent) 0 6px, transparent 6px 12px)"></i></div>' +
      '<div style="position:absolute;left:30px;right:30px;top:42px">' + lab(0, 'Unclear') + lab(190, 'Some evidence') + lab(400, 'More believable') + '</div>' +
      '<span class="cf-never" style="position:absolute;right:30px;top:106px;font-size:22px;font-weight:700;color:var(--down)">Certain: never</span></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.cf-k').style; this.t = q('.cf-t'); this.grid = q('.cf-grid').style; this.zone = q('.cf-zone').style;
    this.items = all('.cf-i').map((e) => e.style); this.ticks = all('.cf-tick'); this.nums = all('.cf-num').map((e) => e.style);
    this.marks = all('.cf-m').map((e) => e.style); this.meter = q('.cf-meter').style; this.fill = q('.cf-fill').style; this.never = q('.cf-never').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'checklist' }, { t: 6.0, pose: 'magnify' }, { t: 11.2, pose: 'checklist' }, { t: 19.4, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.6, 1.2)); this.zone.opacity = eo(seg(t, 0.9, 1.5));
    this.items.forEach((s, i) => { const a = [6.0, 11.2, 14.8][i]; s.opacity = eo(seg(t, a, a + 0.4)); s.transform = 'translateX(' + lerp(26, 0, eo(seg(t, a, a + 0.5))).toFixed(1) + 'px)'; });
    this.ticks.forEach((p, i) => { const a = CF_IT[i]; p.setAttribute('stroke-dasharray', eo(seg(t, a, a + 0.4)) + ' 1'); this.nums[i].opacity = 1 - eo(seg(t, a - 0.1, a + 0.2)); });
    CF_C.forEach((c, i) => {
      const a = CF_AT[i], p = seg(t, a, a + 1.0);
      // Each candle forms: the close travels from the open, the wick grows to its high and low.
      const e = eio(p), hi = lerp(c[0], c[1], Math.min(1, e * 1.6)), lo = lerp(c[0], c[2], Math.min(1, e * 1.6));
      const cl = i === 0 ? (e < 0.6 ? lerp(c[0], c[1], e / 0.6) : lerp(c[1], c[3], (e - 0.6) / 0.4)) : lerp(c[0], c[3], e);
      this.cd.set(i, { x: cfX(i), w: 52, o: c[0], h: Math.max(hi, cl), l: Math.min(lo, cl), c: cl, y: cfY, live: p < 1, op: eo(seg(t, a - 0.1, a + 0.2)) });
      const m = seg(t, a + 1.1, a + 1.5);
      this.marks[i].opacity = eo(m); this.marks[i].transformBox = 'fill-box'; this.marks[i].transformOrigin = 'center'; this.marks[i].transform = 'scale(' + lerp(0.5, 1, eob(m, 1.7)).toFixed(3) + ')';
    });
    UI.rise(this.meter, t, 5.6);
    const w = CF_FILL.reduce((v, k, i) => (i && t >= k[0] ? lerp(CF_FILL[i - 1][1], k[1], eio(seg(t, k[0], k[0] + 0.8))) : v), 0);
    this.fill.width = (w * 100).toFixed(1) + '%';
    const nv = seg(t, 19.6, 20.2);
    this.never.opacity = (0.55 + 0.45 * eo(nv)).toFixed(3); this.never.transform = 'scale(' + lerp(1, 1.12, Math.sin(Math.PI * nv)).toFixed(3) + ')';
    this.tutor.render(t);
  },
});
