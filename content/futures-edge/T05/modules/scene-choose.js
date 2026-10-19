const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const CH = [['Long', 'gains if the price rises', 1], ['Short', 'gains if the price falls', -1], ['Wait', 'no position, no result', 0]];
kit.scene('choose', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    CH.forEach((c, i) => {
      cards += '<div class="glass ch-c" style="left:' + (140 + i * 330) + 'px;top:330px;width:300px;height:250px;padding:24px 28px">' +
        '<p class="mono" style="margin:0;font-size:44px;color:' + (c[2] > 0 ? 'var(--main)' : c[2] < 0 ? 'var(--accent)' : 'var(--second)') + '">' + c[0].toUpperCase() + '</p>' +
        '<p style="margin:6px 0 0;font-size:26px;line-height:1.3;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + c[1] + '</p>' +
        '<p class="mono ch-v" style="margin:22px 0 0;font-size:38px"></p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1000px"><p class="kick ch-k">Your call · 0.01 BTC at 60,000</p>' +
      '<h2 class="line ch-t">Long, short or wait?</h2></div>' + cards +
      '<div class="glass ch-n" style="left:140px;top:620px;width:960px;padding:22px 32px"><p style="margin:0;font-size:30px;font-weight:600;line-height:1.4">Nobody knows the next move for sure. <span class="hl">WAIT is always a valid choice.</span></p></div>' +
      '</div>'));
    this.ring = UI.ring(kit, 1390, 470, 84, 1.4, 1.8, 4, 6.4, 'Pick one');
    this.chart = UI.chart(kit, { x0: 1180, x1: 1530, y0: 340, y1: 600, lo: 59500, hi: 60500, step: 500, t0: 6.4, t1: 11.4,
      keys: [[6.4, 60000], [7.9, 60400], [10.0, 59600], [11.2, 59800], [24, 59800]], entry: 60000, entryLabel: 'Start', tag: true, label: 'Fictional path' });
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ch-k').style; this.t = q('.ch-t'); this.n = q('.ch-n').style;
    this.cards = all('.ch-c').map((e) => e.style); this.vs = all('.ch-v');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'think' }, { t: 6.6, pose: 'candles' }, { t: 11.6, pose: 'explain' }, { t: 17.5, pose: 'calm' }],
      says: [{ t0: 18.0, t1: 23.4, text: 'Waiting is fine.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const P = Math.round(this.chart.price(t) / 10) * 10;
    this.cards.forEach((c, i) => {
      const a = 0.8 + i * 0.3, p = seg(t, a, a + 0.6);
      c.opacity = eo(seg(t, a, a + 0.3));
      const done = eo(seg(t, 11.6, 12.1)), wait = i === 2 ? eo(seg(t, 17.5, 18.0)) : 0;
      c.transform = 'translateY(' + lerp(30, 0, eo(p)).toFixed(1) + 'px) scale(' + (1 + 0.04 * Math.sin(Math.PI * seg(t, 11.6 + i * 0.25, 12.2 + i * 0.25)) + 0.03 * wait).toFixed(4) + ')';
      const v = CH[i][2] * (P - 60000) * 0.01;
      const txt = t < 6.4 ? '' : UI.sgn(v, 2) + ' USDT';
      if (this.vs[i].textContent !== txt) this.vs[i].textContent = txt;
      this.vs[i].style.color = v > 0.004 ? 'var(--main)' : v < -0.004 ? 'var(--accent)' : 'var(--second)';
      c.borderColor = wait ? 'color-mix(in srgb, var(--main) ' + (22 + 60 * wait).toFixed(0) + '%, transparent)' : (done && i < 2 ? (v > 0 ? 'var(--main)' : 'var(--accent)') : '');
    });
    this.ring(t);
    this.chart.render(t, eo(seg(t, 6.2, 6.7)));
    const np = seg(t, 17.5, 18.1);
    this.n.opacity = eo(np); this.n.transform = 'translateY(' + lerp(24, 0, eo(np)).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
