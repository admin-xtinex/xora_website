const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Small candles, then one big green candle on a tall volume bar; after the reveal, two possible next paths.
const QB4_Y = (p) => 200 - (p - 60000) * 0.5;
const QB4 = [[60000, 60060, 59960, 60030], [60030, 60070, 59990, 60010], [60010, 60050, 59970, 60040], [60040, 60080, 60000, 60020], [60020, 60240, 60010, 60220]];
const QB4_V = [0.25, 0.2, 0.3, 0.22, 1];
kit.scene('q-vol', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'qb4c', 5);
    let vol = '';
    QB4_V.forEach((v, i) => { vol += '<rect class="qb4-v" x="' + (66 + i * 60) + '" width="28" rx="3" style="fill:color-mix(in srgb, var(--main) 55%, transparent)"/>'; });
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Price and volume</p><p class="fict" style="position:absolute;right:24px;top:300px;margin:0">Fictional</p>' +
      '<svg width="560" height="340" viewBox="0 0 560 340" style="position:absolute;left:0;top:0">' + this.cd.html + vol +
      '<line x1="40" x2="380" y1="320" y2="320" stroke-width="1.5" style="stroke:color-mix(in srgb, var(--second) 20%, transparent)"/>' +
      '<path class="qb4-u" d="M330 100 C390 100 410 74 520 74" pathLength="1" fill="none" stroke-width="4" stroke-dasharray="0 1" style="stroke:var(--up)"/>' +
      '<path class="qb4-d" d="M330 100 C390 100 410 200 520 210" pathLength="1" fill="none" stroke-width="4" stroke-dasharray="0 1" style="stroke:var(--down)"/>' +
      '<text class="qb4-q mono" x="470" y="150" text-anchor="middle" style="font-size:44px;fill:var(--second)">?</text></svg>';
    this.quiz = UI.quiz(kit, {
      n: 4, from: 'T18', q: 'A big green candle has very high volume. What can you conclude?',
      opts: ['Price will keep rising', 'A lot was traded: one clue, not proof', 'It must be a fakeout', 'Volume never matters'],
      ok: 1, bad: 0, vis,
      why: 'Volume shows how much was traded, not where price goes next.',
      whyNot: 'Volume alone never tells you the direction.',
    });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.vs = all('.qb4-v'); this.u = kit.stage.querySelector('.qb4-u'); this.d = kit.stage.querySelector('.qb4-d'); this.qm = kit.stage.querySelector('.qb4-q').style;
  },
  render(t) {
    this.chrome(t);
    QB4.forEach((c, i) => {
      const s = 1.6 + i * 0.4 + (i === 4 ? 0.3 : 0), p = eo(seg(t, s, s + (i === 4 ? 0.9 : 0.4)));
      this.cd.set(i, { x: 80 + i * 60, w: 30, o: c[0], h: c[0] + (c[1] - c[0]) * p, l: c[0] + (c[2] - c[0]) * p, c: c[0] + (c[3] - c[0]) * p, y: QB4_Y, op: eo(seg(t, s, s + 0.2)), min: 3 });
      const h = QB4_V[i] * 90 * eo(seg(t, s, s + (i === 4 ? 1.2 : 0.5)));
      this.vs[i].setAttribute('y', (318 - h).toFixed(1)); this.vs[i].setAttribute('height', h.toFixed(1));
    });
    this.u.setAttribute('stroke-dasharray', eio(seg(t, 7.9, 8.9)).toFixed(3) + ' 1');
    this.d.setAttribute('stroke-dasharray', eio(seg(t, 8.2, 9.2)).toFixed(3) + ' 1');
    this.qm.opacity = eo(seg(t, 9.0, 9.4));
    this.quiz(t);
  },
});
