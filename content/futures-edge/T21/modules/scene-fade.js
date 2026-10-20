const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Momentum fade: four green candles gain 80, 50, 25, then 10 USDT on falling volume; a ball rolled uphill slows down.
const FD_C = [[59700, 59800, 59690, 59780], [59780, 59845, 59770, 59830], [59830, 59872, 59815, 59855], [59855, 59880, 59845, 59865]];
const FD_G = [80, 50, 25, 10], FD_V = [0.95, 0.7, 0.45, 0.28];
const FD_X = (i) => 250 + i * 150, FD_Y = (p) => 690 - (p - 59680) * 1.5;
kit.scene('fade', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'fd-c', 4);
    let lab = '', vol = '';
    FD_C.forEach((c, i) => {
      lab += '<text class="fd-g mono" x="' + FD_X(i) + '" y="' + (FD_Y(c[1]) - 22).toFixed(1) + '" text-anchor="middle" style="fill:var(--up);font-size:30px">+' + FD_G[i] + '</text>';
      vol += '<rect class="fd-v" x="' + (FD_X(i) - 30) + '" width="60" rx="4" y="772" height="0" style="fill:color-mix(in srgb, var(--main) 55%, transparent)"/>';
    });
    this.h = UI.head(kit, 'Momentum fade', 'Each push gets smaller',
      '<svg class="art" viewBox="0 0 1920 1080"><g class="fd-grid">' + UI.grid(170, 900, FD_Y, 59700, 59850, 50) + '<line x1="170" x2="900" y1="773" y2="773" style="stroke:color-mix(in srgb, var(--second) 14%, transparent);stroke-width:1.5"/></g>' +
      vol + this.cd.html + lab + '<g class="fd-q"><rect x="' + (FD_X(4) - 34) + '" y="' + FD_Y(59895) + '" width="68" height="' + (FD_Y(59835) - FD_Y(59895)) + '" rx="6" fill="none" stroke-width="3" stroke-dasharray="8 6" style="stroke:color-mix(in srgb, var(--second) 50%, transparent)"/>' +
      '<text x="' + FD_X(4) + '" y="' + (FD_Y(59865) + 12) + '" text-anchor="middle" style="fill:var(--second);font-size:40px;font-weight:700">?</text></g></svg>' +
      '<p class="fict fd-f" style="position:absolute;left:170px;top:282px;margin:0">5-minute candles · fictional · gain = close − open, USDT</p>' +
      '<div class="glass fd-d" style="left:1080px;top:300px;width:700px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:30px"><b>Momentum</b>: how strongly price moves. A <b>fade</b>: each push is smaller.</p></div>' +
      '<div class="glass fd-a" style="left:1080px;top:490px;width:700px;height:150px;padding:18px 30px"><p class="kick" style="margin:0 0 6px">Like a ball rolled uphill</p>' +
      '<svg width="640" height="90" viewBox="0 0 640 90" style="position:absolute;left:30px;top:58px"><path d="M10 84 L620 30" stroke-width="4" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/><circle class="fd-ball" r="16" cx="30" cy="66" style="fill:var(--main)"/></svg></div>' +
      '<div class="chip fd-w" style="position:absolute;left:1080px;top:668px;font-size:30px;padding:14px 28px;border-color:var(--accent)">A warning sign, not proof</div>');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.grid = q('.fd-grid').style; this.f = q('.fd-f').style; this.d = q('.fd-d').style; this.a = q('.fd-a').style; this.ball = q('.fd-ball'); this.w = q('.fd-w').style; this.qq = q('.fd-q').style;
    this.gs = all('.fd-g').map((e) => e.style); this.vs = all('.fd-v');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 6.6, pose: 'idea' }, { t: 12.6, pose: 'magnify' }, { t: 18.2, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0)); this.f.opacity = 0.9 * eo(seg(t, 0.6, 1.2));
    FD_C.forEach((c, i) => {
      const a = 1.4 + i * 1.3, p = eo(seg(t, a, a + 1.0));
      this.cd.set(i, { x: FD_X(i), w: 60, o: c[0], h: c[0] + (c[1] - c[0]) * p, l: c[0] + (c[2] - c[0]) * p, c: c[0] + (c[3] - c[0]) * p, y: FD_Y, op: eo(seg(t, a, a + 0.2)), live: t < a + 1.0 });
      const vp = eo(seg(t, a, a + 0.6)), h = FD_V[i] * 64 * vp; this.vs[i].setAttribute('y', (772 - h).toFixed(1)); this.vs[i].setAttribute('height', h.toFixed(1));
      const g = 12.8 + i * 1.0, gp = seg(t, g, g + 0.4);
      this.gs[i].opacity = eo(gp); this.gs[i].transform = 'translateY(' + lerp(12, 0, eo(gp)).toFixed(1) + 'px)';
      this.vs[i].style.fill = t > 16.8 ? 'color-mix(in srgb, var(--accent) ' + (40 + i * 15) + '%, transparent)' : '';
    });
    UI.rise(kit, this.d, t, 0.6, 0.7);
    UI.rise(kit, this.a, t, 6.6, 0.7);
    // The ball: launched up the slope, slowing as it climbs (distance grows like 1 − e^(−k·t)).
    const bt = Math.max(0, t - 7.4), u = 1 - Math.exp(-bt * 0.55), bx = 30 + u * 470, by = 66 - u * 470 * (54 / 610);
    this.ball.setAttribute('cx', bx.toFixed(1)); this.ball.setAttribute('cy', by.toFixed(1));
    const w = seg(t, 18.4, 18.9);
    this.w.opacity = eo(w); this.w.transform = 'scale(' + lerp(0.8, 1, eob(w, 1.7)).toFixed(3) + ')'; this.w.transformOrigin = '0 50%';
    this.qq.opacity = eo(seg(t, 19.4, 20.0));
    this.tutor.render(t);
  },
});
