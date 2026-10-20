const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// One fictional minute: four trades (2, 5, 3, 2 BTC) fill the volume bar to 12 BTC while the candle forms.
const VO_TR = [[2, 10.2], [5, 11.4], [3, 12.6], [2, 13.8]];
const VO_K = [[9.6, 60000], [10.6, 60040], [11.6, 60080], [12.6, 59990], [13.4, 59960], [14.6, 60050]];
const voY = (p) => 520 - (p - 59900) / 250 * 200, VO_X = 1270, VO_B = 760, VO_U = 13;
kit.scene('volume', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'vo-c', 1);
    let chips = '';
    VO_TR.forEach((v) => { chips += '<p class="chip vo-t mono" style="position:absolute;left:0;top:0;margin:0;font-size:28px;padding:10px 22px">' + v[0] + ' BTC</p>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="vo-grid">' + UI.gridL(1180, 1360, voY, 59950, 60100, 50) + '</g>' + this.cd.html +
      '<line class="vo-base" x1="1180" x2="1360" y1="' + VO_B + '" y2="' + VO_B + '" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 30%, transparent)"/>' +
      '<rect class="vo-bar" x="' + (VO_X - 32) + '" width="64" rx="6" style="fill:color-mix(in srgb, var(--up) 60%, transparent);stroke:var(--up);stroke-width:2"/></svg>' + chips +
      '<p class="tag vo-n" style="left:' + (VO_X + 56) + 'px;top:0;font-size:28px;color:var(--up);border-color:var(--up)">0 BTC</p>' +
      '<p class="fict vo-f" style="position:absolute;left:1060px;top:300px;margin:0">One fictional 1-minute candle</p>' +
      '<p class="kick vo-vl" style="position:absolute;left:1060px;top:' + (VO_B + 4) + 'px;margin:0;font-size:20px">Volume</p>' +
      '<div class="words" style="left:140px;top:160px;width:900px"><p class="kick vo-k">Volume</p>' +
      '<h2 class="line vo-tt">How much was traded</h2></div>' +
      '<p class="def vo-d" style="position:absolute;left:140px;top:310px;width:800px;margin:0"><b>Volume</b> is the total amount traded in a period of time, such as one minute.</p>' +
      '<p class="chip vo-a" style="position:absolute;left:140px;top:450px;margin:0;font-size:28px"><span class="dot"></span>Like a shop counting items sold each minute</p>' +
      '<div class="glass vo-p" style="left:140px;top:560px;width:800px;padding:20px 32px">' +
      '<p class="fict" style="margin:0 0 8px">Fictional trades in this minute</p>' +
      '<p class="mono" style="margin:0;font-size:40px"><span class="vo-s">2</span><span class="vo-s"> + 5</span><span class="vo-s"> + 3</span><span class="vo-s"> + 2</span><span class="vo-eq"> = <span class="up">12 BTC</span></span></p>' +
      '<p class="mono vo-u" style="margin:10px 0 0;font-size:30px;color:color-mix(in srgb, var(--second) 80%, var(--ground))">12 × 60,000 ≈ <span class="hl">720,000 USDT</span></p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.vo-k').style; this.t = q('.vo-tt'); this.d = q('.vo-d'); this.a = q('.vo-a').style; this.p = q('.vo-p').style;
    this.ss = all('.vo-s').map((e) => e.style); this.eq = q('.vo-eq').style; this.u = q('.vo-u').style;
    this.grid = q('.vo-grid').style; this.base = q('.vo-base').style; this.bar = q('.vo-bar'); this.n = q('.vo-n'); this.f = q('.vo-f').style; this.vl = q('.vo-vl').style;
    this.chips = all('.vo-t').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'explain' }, { t: 4.8, pose: 'idea' }, { t: 9.6, pose: 'magnify' }, { t: 14.8, pose: 'checklist' }, { t: 19.2, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.7, { stagger: 0.04 });
    UI.rise(this.a, t, 4.9);
    this.grid.opacity = eo(seg(t, 8.8, 9.4)); this.base.opacity = this.grid.opacity; this.f.opacity = this.grid.opacity; this.vl.opacity = this.grid.opacity;
    const k = t >= 14.6 ? { o: 60000, h: 60080, l: 59960, c: 60050 } : UI.forming(VO_K, 59960, 60080, t);
    this.cd.set(0, { x: VO_X, w: 64, o: k.o, h: k.h, l: k.l, c: k.c, y: voY, live: !!k.live, op: eo(seg(t, 9.4, 9.7)) });
    // Each trade chip flies into the bar; the bar then grows by that amount.
    let vol = 0;
    VO_TR.forEach((v, i) => {
      const a = v[1], fly = eio(seg(t, a + 0.5, a + 1.1));
      const s = this.chips[i];
      s.opacity = (eo(seg(t, a, a + 0.3)) * (1 - ei(seg(t, a + 0.9, a + 1.15)))).toFixed(3);
      s.transform = 'translate(' + lerp(1480, VO_X - 60, fly).toFixed(1) + 'px,' + lerp(360 + i * 30, VO_B - vol * VO_U - 60, fly).toFixed(1) + 'px) scale(' + lerp(1, 0.6, fly).toFixed(3) + ')';
      vol += v[0] * eo(seg(t, a + 1.0, a + 1.4));
    });
    this.bar.setAttribute('y', (VO_B - vol * VO_U).toFixed(1)); this.bar.setAttribute('height', (vol * VO_U).toFixed(1));
    this.bar.style.opacity = vol > 0.01 ? 1 : 0;
    this.n.style.top = (VO_B - vol * VO_U - 22).toFixed(1) + 'px';
    this.n.style.opacity = eo(seg(t, 10.0, 10.4));
    UI.txt(this.n, Math.round(vol) + ' BTC');
    UI.rise(this.p, t, 10.0);
    this.ss.forEach((s, i) => { s.opacity = eo(seg(t, VO_TR[i][1] + 1.0, VO_TR[i][1] + 1.4)); });
    this.eq.opacity = eo(seg(t, 15.0, 15.5));
    this.u.opacity = eo(seg(t, 19.4, 19.9));
    this.tutor.render(t);
  },
});
