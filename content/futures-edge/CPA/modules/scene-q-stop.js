const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Concept mini chart: price falls into the liquidation zone before reaching a stop placed further away.
kit.scene('q-stop', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">High-leverage long · concept</p>' +
      '<svg width="560" height="340" viewBox="0 0 560 340" style="position:absolute;left:0;top:0">' +
      '<rect class="qa7-z" x="28" y="170" width="504" height="40" style="fill:color-mix(in srgb, var(--accent) 24%, transparent)"/>' +
      '<text class="qa7-zl" x="36" y="232" style="fill:var(--accent);font-size:20px;font-weight:600">liquidation zone</text>' +
      '<line x1="28" x2="532" y1="268" y2="268" stroke-dasharray="10 8" stroke-width="3" style="stroke:var(--main)"/>' +
      '<text class="qa7-sl" x="36" y="296" style="fill:var(--main);font-size:20px;font-weight:600">stop-loss</text>' +
      '<path class="qa7-p" d="M28 80 L90 86 L150 78 L210 100 L260 130 L300 150 L340 186" pathLength="1" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/>' +
      '<g class="qa7-x"><circle cx="340" cy="186" r="14" style="fill:var(--accent)"/></g></svg>' +
      '<p class="fict" style="position:absolute;right:24px;top:296px;margin:0">No real levels</p>';
    this.quiz = UI.quiz(kit, {
      n: 7, from: 'T13', q: 'Can a stop-loss guarantee you won’t be liquidated?',
      opts: ['Yes. The stop always closes first', 'No. Stops can slip, and liquidation can come first', 'Yes, if the stop is far away', 'Only in cross margin'],
      ok: 1, bad: 0, vis,
      why: 'With high leverage, the liquidation zone can sit closer than your stop.',
      whyNot: 'A stop-loss is not liquidation insurance.',
    });
    const q = (s) => kit.stage.querySelector(s);
    this.p = q('.qa7-p'); this.x = q('.qa7-x').style; this.sl = q('.qa7-sl');
  },
  render(t) {
    this.chrome(t);
    this.p.setAttribute('stroke-dasharray', eio(seg(t, 1.6, 3.6)).toFixed(3) + ' 1');
    const xp = seg(t, 7.8, 8.3);
    this.x.opacity = eo(xp);
    UI.set(this.sl, t >= 8.0 ? 'stop-loss · never reached' : 'stop-loss');
    this.quiz(t);
  },
});
