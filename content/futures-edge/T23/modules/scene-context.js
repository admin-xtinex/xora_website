const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The 5-minute hour first (higher highs, higher lows), then its last three candles become fifteen 1-minute candles.
const CX_LO = [0, 2, 5, 11], CX_HI = [1, 4, 9];
kit.scene('context', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Step 2 of 8 · Context', 'Big picture first');
    this.track = UI.track(kit, 2);
    const D = UI.D, X = D.x5, Y = D.y5;
    this.c5 = UI.cdl(kit, 'cx5', 12);
    let dots = '';
    CX_LO.forEach((i) => { dots += '<circle class="cx-d" cx="' + X(i) + '" cy="' + (Y(D.K5[i][2]) + 16).toFixed(1) + '" r="9" style="fill:var(--main)"/>'; });
    CX_HI.forEach((i) => { dots += '<circle class="cx-d" cx="' + X(i) + '" cy="' + (Y(D.K5[i][1]) - 16).toFixed(1) + '" r="9" style="fill:var(--accent)"/>'; });
    const bx = X(9) - 32, bw = X(11) - X(9) + 64, by = Y(60650) - 18, bh = Y(59850) - Y(60650) + 36;
    const svg5 = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="cx-5">' + UI.grid(160, 1040, Y, 58800, 60800, 400) + this.c5.html +
      '<line class="cx-tl" x1="' + X(0) + '" y1="' + (Y(58950) + 16).toFixed(1) + '" x2="' + X(11) + '" y2="' + (Y(59850) + 16).toFixed(1) + '" pathLength="1" stroke-width="3" stroke-dasharray="1 1" style="stroke:var(--main)"/>' +
      dots + '<rect class="cx-box" x="' + bx + '" y="' + by.toFixed(1) + '" width="' + bw + '" height="' + bh.toFixed(1) + '" rx="10" fill="none" stroke-width="3" stroke-dasharray="10 8" style="stroke:var(--second)"/></g></svg>');
    kit.stage.append(svg5);
    this.f5 = kit.h('<p class="fict" style="position:absolute;left:160px;top:276px;margin:0">BTC/USDT · 5-minute · fictional replay · educational simulation</p>'); kit.stage.append(this.f5);
    this.tg = [kit.h('<p class="tag" style="left:200px;top:330px;border-color:var(--accent)">Higher highs</p>'), kit.h('<p class="tag" style="left:200px;top:386px;border-color:var(--main)">Higher lows</p>'),
      kit.h('<p class="tag" style="left:' + (bx - 230) + 'px;top:' + (by - 6).toFixed(0) + 'px">Last 15 minutes</p>')];
    this.tg.forEach((e) => kit.stage.append(e));
    this.c1 = UI.chart1(kit, 'cx1', { draw: 16.0, k: 0.1, at: 15.6 });
    this.tg1 = kit.h('<p class="tag" style="left:540px;top:330px;border-color:var(--main)">Run up, then a pull-back</p>'); kit.stage.append(this.tg1);
    const card = (cls, top, k, s) => '<div class="glass ' + cls + '" style="left:1180px;top:' + top + 'px;width:600px;padding:22px 30px"><p class="kick" style="margin:0 0 10px">' + k + '</p><p style="margin:0;font-size:30px;line-height:1.38;font-weight:600">' + s + '</p></div>';
    kit.stage.append(kit.h('<div>' + card('cx-a', 300, '5-minute · the big picture', 'Higher highs and higher lows: the trend <span class="hl">leans up</span>. Trends can still end.') +
      card('cx-b', 520, '1-minute · the detail', 'Same 15 minutes, more candles. <span class="hv">Noisier</span>: use it for detail, not direction.') + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.g5 = svg5.querySelector('.cx-5').style; this.tl = svg5.querySelector('.cx-tl'); this.dots = [...svg5.querySelectorAll('.cx-d')].map((e) => e.style); this.box = svg5.querySelector('.cx-box');
    this.a = q('.cx-a').style; this.b = q('.cx-b').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 1.0, pose: 'candles', flip: true }, { t: 7.1, pose: 'point' }, { t: 13.8, pose: 'magnify' }, { t: 20.1, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t); this.track(t);
    const D = UI.D, out = ei(seg(t, 15.0, 15.8));
    this.g5.opacity = (1 - out).toFixed(3); this.f5.style.opacity = (0.9 * eo(seg(t, 0.3, 0.9)) * (1 - out)).toFixed(3);
    D.K5.forEach((c, i) => {
      const s = 1.0 + i * 0.3, p = eo(seg(t, s, s + 0.45));
      this.c5.set(i, { x: D.x5(i), w: 34, o: c[0], h: c[0] + (c[1] - c[0]) * p, l: c[0] + (c[2] - c[0]) * p, c: c[0] + (c[3] - c[0]) * p, y: D.y5, op: eo(seg(t, s, s + 0.2)) * (i >= 9 ? 1 : lerp(1, 0.45, eo(seg(t, 13.8, 14.4)))) });
    });
    this.dots.forEach((s, i) => { const a = 7.3 + i * 0.35, p = seg(t, a, a + 0.4); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = 'center'; s.transform = 'scale(' + lerp(0.3, 1, eob(p, 2)).toFixed(3) + ')'; });
    this.tl.setAttribute('stroke-dasharray', eio(seg(t, 9.6, 11.0)).toFixed(3) + ' 1');
    UI.rise(kit, this.tg[0].style, t, 7.6, 0.5, 14, 15.0, 15.6);
    UI.rise(kit, this.tg[1].style, t, 8.6, 0.5, 14, 15.0, 15.6);
    const bp = seg(t, 13.9, 14.6);
    this.box.setAttribute('stroke-dashoffset', (-t * 20).toFixed(1)); this.box.style.opacity = eo(bp);
    UI.rise(kit, this.tg[2].style, t, 14.2, 0.5, 14, 15.0, 15.6);
    this.c1.render(t);
    UI.rise(kit, this.tg1.style, t, 20.6, 0.5, 14);
    UI.rise(kit, this.a, t, 7.1, 0.6, 24);
    UI.rise(kit, this.b, t, 20.1, 0.6, 24);
    this.tutor.render(t);
  },
});
