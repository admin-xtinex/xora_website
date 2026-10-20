const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A lookback window over the fictional history: last 10 minutes (300 USDT, 0.5%), then 15 minutes (600 USDT, 1%).
const LB_H = UI.H, lbX = (i) => 236 + i * 66, lbY = (p) => 700 - (p - 60000) / 600 * 330;
const LB_GO = 16.4, LB_END = 18.2;
kit.scene('lookback', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'lb-c', LB_H.length);
    const row = (a, cls, last) => '<div class="row lb-r"' + (last ? ' style="border:0"' : '') + '><span>' + a + '</span><span class="mono ' + cls + '" style="font-size:32px"></span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="lb-grid">' + UI.grid(200, 1210, lbY, 60000, 60600, 100) + '</g>' +
      '<rect class="lb-win" y="330" height="410" rx="14" stroke-width="3" stroke-dasharray="12 8" style="fill:color-mix(in srgb, var(--main) 9%, transparent);stroke:var(--main)"/>' +
      this.cd.html +
      '<line class="lb-hl" stroke-width="3" stroke-dasharray="10 7" style="stroke:var(--accent)"/>' +
      '<line class="lb-ll" y1="' + lbY(60000) + '" y2="' + lbY(60000) + '" stroke-width="3" stroke-dasharray="10 7" style="stroke:var(--accent)"/>' +
      '<g class="lb-hd"><circle r="26" style="fill:var(--main)"/><path d="M-12 -7 L-18 0 L-12 7 M12 -7 L18 0 L12 7 M-16 0 L16 0" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--ground)"/></g></svg>' +
      '<p class="tag lb-wl" style="top:340px;color:var(--main);border-color:var(--main)"></p>' +
      '<p class="tag lb-ht" style="color:var(--accent);border-color:var(--accent)"></p>' +
      '<p class="tag lb-lt" style="top:' + (lbY(60000) + 12) + 'px;color:var(--accent);border-color:var(--accent)">Low 60,000</p>' +
      '<p class="fict" style="position:absolute;left:200px;top:304px;margin:0">BTC/USDT · 1-minute candles · fictional</p>' +
      '<div class="glass lb-p" style="left:1400px;top:330px;width:370px;padding:10px 26px">' +
      row('Window', 'lb-v') + row('High', 'lb-v hv') + row('Low', 'lb-v hv') + row('Range', 'lb-v') + row('Range %', 'lb-v hl', 1) + '</div>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick lb-k">Previous high and low</p>' +
      '<h2 class="line lb-t">Pick a lookback window</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.lb-k').style; this.t = q('.lb-t'); this.grid = q('.lb-grid').style;
    this.win = q('.lb-win'); this.hl = q('.lb-hl'); this.ll = q('.lb-ll'); this.hd = q('.lb-hd');
    this.wl = q('.lb-wl'); this.ht = q('.lb-ht'); this.lt = q('.lb-lt').style;
    this.p = q('.lb-p').style; this.rows = all('.lb-r').map((e) => e.style); this.vs = all('.lb-v');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'confused' }, { t: 0.6, pose: 'present' }, { t: 6.1, pose: 'point', flip: true }, { t: 11.0, pose: 'checklist' }, { t: 16.1, pose: 'magnify' }, { t: 21.0, pose: 'idea' }],
      says: [{ t0: 21.4, t1: 25.6, text: 'Window matters' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 0.9));
    LB_H.forEach((c, i) => {
      const a = 0.8 + i * 0.3, p = seg(t, a, a + 0.45);
      this.cd.set(i, { x: lbX(i), w: 40, o: c[0], h: lerp(c[0], c[1], eo(p)), l: lerp(c[0], c[2], eo(p)), c: lerp(c[0], c[3], eo(p)), y: lbY, op: eo(seg(t, a, a + 0.2)) });
    });
    // The window: candles 5–14, then its left edge is dragged back to candle 0.
    const g = eio(seg(t, LB_GO, LB_END)), first = lerp(5, 0, g);
    const x0 = lbX(first) - 30, x1 = lbX(14) + 30, w = seg(t, 6.3, 7.0);
    this.win.setAttribute('x', x0.toFixed(1)); this.win.setAttribute('width', (x1 - x0).toFixed(1));
    this.win.style.opacity = eo(w); this.win.style.strokeDashoffset = (-t * 12).toFixed(1);
    this.hd.setAttribute('transform', 'translate(' + x0.toFixed(1) + ' 535) scale(' + (eo(w) * (1 + 0.12 * Math.sin(Math.PI * seg(t, LB_GO - 0.4, LB_END + 0.2)))).toFixed(3) + ')');
    this.hd.style.opacity = eo(w) * (1 - ei(seg(t, 22.5, 23.2)));
    const long = t >= LB_GO + 1.1;
    this.wl.style.left = (x0 + 18).toFixed(1) + 'px'; this.wl.style.opacity = eo(seg(t, 6.6, 7.1));
    UI.txt(this.wl, long ? 'Last 15 minutes' : 'Last 10 minutes');
    // High line follows the window: 60,300 inside the last 10, 60,600 once candle 0 joins.
    const hp = lerp(60300, 60600, eio(seg(t, LB_GO + 1.1, LB_GO + 1.7))), hy = lbY(hp);
    this.hl.setAttribute('x1', x0.toFixed(1)); this.hl.setAttribute('x2', x1.toFixed(1)); this.hl.setAttribute('y1', hy.toFixed(1)); this.hl.setAttribute('y2', hy.toFixed(1));
    this.ll.setAttribute('x1', x0.toFixed(1)); this.ll.setAttribute('x2', x1.toFixed(1));
    this.hl.style.opacity = eo(seg(t, 11.2, 11.7)); this.ll.style.opacity = eo(seg(t, 11.8, 12.3));
    this.ht.style.left = (x1 - 230).toFixed(1) + 'px'; this.ht.style.top = lerp(hy - 54, hy + 12, eio(seg(t, LB_GO + 1.1, LB_GO + 1.7))).toFixed(1) + 'px'; this.ht.style.opacity = eo(seg(t, 11.4, 11.9));
    UI.txt(this.ht, 'High ' + UI.fmt(Math.round(hp / 10) * 10));
    this.lt.left = (x1 - 230).toFixed(1) + 'px'; this.lt.opacity = eo(seg(t, 12.0, 12.5));
    UI.rise(this.p, t, 6.6);
    const vL = ['15 min', '60,600', '60,000', '600 USDT', '1%'], vS = ['10 min', '60,300', '60,000', '300 USDT', '0.5%'];
    const at = [6.9, 11.4, 12.0, 12.8, 13.6];
    this.vs.forEach((e, i) => {
      UI.txt(e, t >= LB_GO + 1.35 + i * 0.35 ? vL[i] : vS[i]);
      const fl = (i === 0 || i === 1 || i === 3 || i === 4) ? Math.sin(Math.PI * seg(t, LB_GO + 1.1 + i * 0.35, LB_GO + 1.6 + i * 0.35)) : 0;
      e.style.opacity = eo(seg(t, at[i], at[i] + 0.4));
      e.style.transform = 'scale(' + (1 + 0.18 * fl).toFixed(3) + ')';
      e.style.display = 'inline-block';
    });
    this.rows.forEach((s, i) => { s.opacity = eo(seg(t, 6.8 + i * 0.1, 7.2 + i * 0.1)); });
    this.tutor.render(t);
  },
});
