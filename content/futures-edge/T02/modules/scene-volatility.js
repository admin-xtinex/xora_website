const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const VO_T0 = 1.0, VO_T1 = 18.5, VO_NEWS = 12.0, VO_LO = 57000, VO_HI = 61800, VO_W = 560, VO_H = 200;
const voCalm = (t) => 60000 + 110 * Math.sin(t * 1.3) + 50 * Math.sin(t * 3.7 + 2);
const voWild = (t) => 60000 + 520 * Math.sin(t * 1.15) + 320 * Math.sin(t * 2.9 + 1) + 160 * Math.sin(t * 7.1) - 1500 * eo(seg(t, VO_NEWS, VO_NEWS + 0.5)) + 500 * eio(seg(t, VO_NEWS + 1.2, VO_NEWS + 4));
const VO = [['Calm market · small swings', voCalm, 200], ['Volatile market · big swings', voWild, 500]];
kit.scene('volatility', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let charts = '';
    VO.forEach((c, i) => {
      let grid = '';
      for (let p = 58000; p <= 61000; p += 1000) { const y = VO_H - (p - VO_LO) / (VO_HI - VO_LO) * VO_H; grid += '<line x1="0" x2="' + VO_W + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" style="stroke:color-mix(in srgb, var(--second) 8%, transparent);stroke-width:1.5"/><text x="' + (VO_W + 16) + '" y="' + (y + 8).toFixed(1) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 50%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>'; }
      charts += '<div class="glass vo-c' + i + '" style="left:1000px;top:' + (180 + i * 296) + 'px;width:780px;height:280px;padding:18px 30px">' +
        '<p class="kick" style="margin:0 0 14px;font-size:20px;' + (i ? 'color:var(--accent)' : '') + '">' + c[0] + '</p>' +
        '<svg width="' + (VO_W + 120) + '" height="' + VO_H + '" style="display:block;overflow:visible">' + grid + '<path class="vo-l' + i + '" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:' + (i ? 'var(--accent)' : 'var(--main)') + '"/></svg></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' + charts +
      '<span class="chip vo-n" style="position:absolute;left:1480px;top:484px;font-size:24px;padding:12px 22px;background:var(--accent);color:var(--ground);border-color:var(--accent)">⚡ Surprise news</span>' +
      '<div class="words" style="left:140px;top:190px;width:780px"><p class="kick vo-k">Volatility</p>' +
      '<h2 class="line vo-t">How wild are the swings?</h2>' +
      '<p class="def vo-d"><b>Volatility</b> is how much and how fast a price swings.</p>' +
      '<p class="sub vo-s">Surprise news, or a quiet market with few orders, can cause sudden jumps.</p></div>' +
      '<p class="fict vo-f" style="position:absolute;left:140px;top:720px;margin:0">BTC/USDT · illustrative paths, not real data</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.vo-k').style; this.t = q('.vo-t'); this.d = q('.vo-d'); this.s = q('.vo-s'); this.n = q('.vo-n').style; this.f = q('.vo-f').style;
    this.c = VO.map((c, i) => ({ box: q('.vo-c' + i).style, l: q('.vo-l' + i) }));
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'candles', flip: true }, { t: 5.0, pose: 'point', flip: true }, { t: 12.0, pose: 'confused' }, { t: 16.6, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    TextFx.fadeFromRight(this.s, t, 10.8, { stagger: 0.05 });
    this.f.opacity = 0.9 * eo(seg(t, 1.6, 2.2));
    VO.forEach((c, i) => {
      const C = this.c[i], p = seg(t, 0.5 + i * 0.4, 1.1 + i * 0.4);
      C.box.opacity = eo(p); C.box.transform = 'translateX(' + lerp(40, 0, eo(p)) + 'px)';
      let d = '';
      const end = Math.min(Math.max(t, VO_T0), VO_T1);
      for (let x = VO_T0; x <= end + 1e-6; x += 0.05) d += (x > VO_T0 ? 'L' : 'M') + ((x - VO_T0) / (VO_T1 - VO_T0) * VO_W).toFixed(1) + ' ' + (VO_H - (c[1](x) - VO_LO) / (VO_HI - VO_LO) * VO_H).toFixed(1);
      C.l.setAttribute('d', d || 'M0 0');
    });
    const n = seg(t, VO_NEWS - 0.3, VO_NEWS + 0.2);
    this.n.opacity = eo(n) * (1 - ei(seg(t, 17.0, 17.6)));
    this.n.transform = 'scale(' + lerp(0.6, 1, eob(n, 1.8)) + ')';
    this.tutor.render(t);
  },
});
