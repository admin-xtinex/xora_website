const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Five 1-minute candles, then the 5-minute candle built from them: first open, highest high, lowest low, last close.
const QB2_Y = (p) => 290 - (p - 59850) * 0.55;
const QB2 = [[60000, 60120, 59950, 60080], [60080, 60250, 60060, 60200], [60200, 60210, 59900, 59960], [59960, 60050, 59920, 60030], [60030, 60140, 60010, 60100]];
const QB2_5 = [60000, 60250, 59900, 60100];
kit.scene('q-agg', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'qb2c', 6);
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">5 × 1-minute → 1 × 5-minute</p>' +
      '<svg width="560" height="340" viewBox="0 0 560 340" style="position:absolute;left:0;top:0">' + this.cd.html +
      '<path class="qb2-a" d="M300 180 H360 M346 168 L362 180 L346 192" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<text class="qb2-q mono" x="440" y="196" text-anchor="middle" style="font-size:56px;fill:var(--second)">?</text></svg>' +
      '<p class="fict" style="position:absolute;left:28px;top:304px;margin:0">Fictional prices</p>';
    this.quiz = UI.quiz(kit, {
      n: 2, from: 'T15', q: 'Five 1-minute candles make one 5-minute candle. Its prices?',
      opts: ['First open, highest high, lowest low, last close', 'The average of the five candles', 'A copy of the first 1-minute candle', 'A copy of the biggest candle'],
      ok: 0, bad: 1, vis,
      why: 'O 60,000 · H 60,250 · L 59,900 · C 60,100.',
      whyNot: 'Candles never average. They keep the real prices.',
    });
    this.a = kit.stage.querySelector('.qb2-a').style; this.qm = kit.stage.querySelector('.qb2-q').style;
  },
  render(t) {
    this.chrome(t);
    QB2.forEach((c, i) => {
      const s = 1.6 + i * 0.35, p = eo(seg(t, s, s + 0.4));
      this.cd.set(i, { x: 70 + i * 50, w: 30, o: c[0], h: c[0] + (c[1] - c[0]) * p, l: c[0] + (c[2] - c[0]) * p, c: c[0] + (c[3] - c[0]) * p, y: QB2_Y, op: eo(seg(t, s, s + 0.2)), min: 3 });
    });
    this.a.opacity = eo(seg(t, 3.6, 4.0));
    const r = eio(seg(t, 7.7, 8.9)), c = QB2_5;
    this.cd.set(5, { x: 440, w: 64, o: c[0], h: c[0] + (c[1] - c[0]) * r, l: c[0] + (c[2] - c[0]) * r, c: c[0] + (c[3] - c[0]) * r, y: QB2_Y, op: r > 0 ? 1 : 0 });
    this.qm.opacity = (eo(seg(t, 3.8, 4.2)) * (1 - eo(seg(t, 7.5, 7.8)))).toFixed(3);
    this.quiz(t);
  },
});
