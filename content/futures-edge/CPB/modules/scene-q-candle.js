const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// One fictional 1-minute candle grows from its open; O/H/L/C labels name the prices after the reveal.
const QB1_Y = (p) => 312 - (p - 59700) * 0.4;
const QB1 = [['H', 60300], ['C', 60200], ['O', 60000], ['L', 59800]];
kit.scene('q-candle', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let labels = '';
    QB1.forEach((l) => { labels += '<g class="qb1-l"><line x1="250" x2="300" y1="' + QB1_Y(l[1]) + '" y2="' + QB1_Y(l[1]) + '" stroke-width="2" stroke-dasharray="4 4" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
      '<text x="314" y="' + (QB1_Y(l[1]) + 8) + '" class="mono" style="font-size:24px;fill:var(--second)"><tspan class="qb1-k" style="fill:var(--main)">' + l[0] + ' </tspan>' + UI.fmt(l[1]) + '</text></g>'; });
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">One 1-minute candle</p><p class="fict" style="position:absolute;right:24px;top:300px;margin:0">Fictional</p>' +
      '<svg width="560" height="340" viewBox="0 0 560 340" style="position:absolute;left:0;top:0"><line class="qb1-w" x1="200" x2="200" stroke-width="5" stroke-linecap="round" style="stroke:var(--up)"/>' +
      '<rect class="qb1-b" x="165" width="70" rx="6" style="fill:var(--up)"/>' + labels + '</svg>';
    this.quiz = UI.quiz(kit, {
      n: 1, from: 'T14', q: 'O 60,000 · H 60,300 · L 59,800 · C 60,200. Which is true?',
      opts: ['Green (up) candle; it closed at 60,200', 'Red candle; it closed at 60,300', 'The wick shows where it closed', 'The next candle will rise'],
      ok: 0, bad: 1, vis,
      why: 'Close above open: green. The top of the body is the close, 60,200.',
      whyNot: '60,300 is the high: the top of the wick.',
    });
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.w = q('.qb1-w'); this.b = q('.qb1-b'); this.ls = all('.qb1-l').map((e) => e.style); this.ks = all('.qb1-k').map((e) => e.style);
  },
  render(t) {
    this.chrome(t);
    // Live candle: open → low → high → close over 1.6–4.0 s.
    const u = seg(t, 1.6, 4.0), P = [60000, 59800, 60300, 60200], U = [0, 0.3, 0.7, 1];
    let price = 60000, hi = 60000, lo = 60000;
    for (let k = 1; k < 4; k++) { const f = kit.clamp01((u - U[k - 1]) / (U[k] - U[k - 1])); if (f <= 0) break; price = lerp(P[k - 1], P[k], eio(f)); hi = Math.max(hi, price); lo = Math.min(lo, price); }
    const col = price >= 60000 ? 'var(--up)' : 'var(--down)';
    this.w.setAttribute('y1', QB1_Y(hi).toFixed(1)); this.w.setAttribute('y2', QB1_Y(lo).toFixed(1)); this.w.style.stroke = col;
    const yt = QB1_Y(Math.max(price, 60000)), yb = QB1_Y(Math.min(price, 60000));
    this.b.setAttribute('y', yt.toFixed(1)); this.b.setAttribute('height', Math.max(4, yb - yt).toFixed(1)); this.b.style.fill = col;
    this.ls.forEach((s, i) => { s.opacity = eo(seg(t, 4.2 + i * 0.25, 4.6 + i * 0.25)); });
    this.ks.forEach((s, i) => { s.opacity = eo(seg(t, 7.9 + i * 0.3, 8.3 + i * 0.3)); });
    this.quiz(t);
  },
});
