const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Quiet candles (ranges 30, 50, 40, 40: average 40 USDT) next to volatile ones (200, 300, 250, 250: average 250 USDT).
const VL_Q = [[60000, 60020, 59990, 60010], [60010, 60040, 59990, 60030], [60030, 60045, 60005, 60015], [60015, 60040, 60000, 60035]];
const VL_V = [[60000, 60150, 59950, 60120], [60120, 60200, 59900, 59950], [59950, 60100, 59850, 60080], [60080, 60180, 59930, 59980]];
const vlY = (p) => 690 - (p - 59800) / 400 * 220, vlX = (k, i) => (k ? 960 : 140) + 150 + i * 120;
const VL_T = [10.2, 15.1];
kit.scene('volatility', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'vl-c', 8);
    const panel = (k) => {
      const L = k ? 960 : 140, D = k ? VL_V : VL_Q, col = k ? 'var(--accent)' : 'var(--main)';
      const sum = D.map((c) => c[1] - c[2]);
      let labs = '';
      D.forEach((c, i) => { labs += '<p class="mono vl-n" style="position:absolute;left:' + (vlX(k, i) - 50) + 'px;width:100px;text-align:center;top:' + (vlY(c[2]) + 10).toFixed(0) + 'px;margin:0;font-size:24px;color:' + col + '">' + (c[1] - c[2]) + '</p>'; });
      return '<div class="glass vl-p" style="left:' + L + 'px;top:390px;width:760px;height:390px"></div>' +
        '<p class="kick" style="position:absolute;left:' + (L + 32) + 'px;top:410px;margin:0;color:' + col + '">' + (k ? 'Volatile · choppy sea' : 'Quiet · calm lake') + '</p>' + labs +
        '<p class="mono vl-avg" style="position:absolute;left:' + (L + 32) + 'px;top:722px;margin:0;font-size:26px">(' + sum.join(' + ') + ') ÷ 4 = <span style="color:' + col + '">' + (sum.reduce((a, b) => a + b) / 4) + ' USDT</span></p>';
    };
    kit.stage.append(kit.h('<div class="ground">' + panel(0) + panel(1) +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.cd.html +
      '<path class="vl-w" fill="none" stroke-width="4" stroke-linecap="round" style="stroke:var(--main)"/><path class="vl-w" fill="none" stroke-width="4" stroke-linecap="round" style="stroke:var(--accent)"/></svg>' +
      '<p class="tag vl-sw" style="left:1520px;top:560px;color:var(--accent);border-color:var(--accent)">Up and down</p>' +
      '<p class="fict" style="position:absolute;right:200px;top:352px;margin:0;white-space:nowrap">Fictional candles · ranges in USDT</p>' +
      '<div class="words" style="left:140px;top:160px;width:1600px;gap:14px"><p class="kick vl-k">Volatility</p>' +
      '<h2 class="line vl-t">Calm lake or choppy sea</h2>' +
      '<p class="sub vl-d" style="font-size:34px"><b class="hl">Volatility</b> is how much, and how fast, price moves around.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.vl-k').style; this.t = q('.vl-t'); this.d = q('.vl-d');
    this.ps = all('.vl-p').map((e) => e.style); this.ns = all('.vl-n').map((e) => e.style); this.avg = all('.vl-avg').map((e) => e.style);
    this.ws = all('.vl-w'); this.sw = q('.vl-sw').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 5.2, pose: 'calm' }, { t: 10.0, pose: 'point', flip: true }, { t: 14.9, pose: 'magnify' }, { t: 20.2, pose: 'confused' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.8, { stagger: 0.04 });
    this.ps.forEach((s, k) => { UI.rise(s, t, 4.6 + k * 0.4); });
    this.ps[1].borderColor = 'color-mix(in srgb, var(--accent) ' + (22 + 50 * eo(seg(t, 20.4, 21.0))).toFixed(0) + '%, transparent)';
    // The waves: small ripples on the lake, big rolling waves on the sea.
    [6, 30].forEach((amp, k) => {
      const x0 = (k ? 960 : 140) + 480, on = eo(seg(t, 5.4 + k * 0.6, 6.0 + k * 0.6));
      let d = '';
      for (let x = 0; x <= 240; x += 6) d += (x ? 'L' : 'M') + (x0 + x) + ' ' + (440 + amp * on * Math.sin(x / (k ? 26 : 18) - t * (k ? 3.2 : 1.6))).toFixed(1);
      this.ws[k].setAttribute('d', d); this.ws[k].style.opacity = on;
    });
    [VL_Q, VL_V].forEach((D, k) => {
      D.forEach((c, i) => {
        const a = VL_T[k] + i * 0.55, p = seg(t, a, a + 0.5);
        this.cd.set(k * 4 + i, { x: vlX(k, i), w: 56, o: c[0], h: lerp(c[0], c[1], eo(p)), l: lerp(c[0], c[2], eo(p)), c: lerp(c[0], c[3], eo(p)), y: vlY, op: eo(seg(t, a, a + 0.2)), min: 3 });
        this.ns[k * 4 + i].opacity = eo(seg(t, a + 0.5, a + 0.9));
      });
      UI.rise(this.avg[k], t, VL_T[k] + 2.8, { dy: 12 });
    });
    UI.rise(this.sw, t, 20.6, { dy: 12 });
    this.tutor.render(t);
  },
});
