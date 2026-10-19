const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('q-volatility', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    // Two fictional paths inside the 560 x 350 panel: a calm one and a wild one.
    const calm = [], wild = [];
    const r = kit.rng(44);
    for (let i = 0; i <= 40; i++) {
      const x = 28 + i * 12.6;
      calm.push([x, 128 + Math.sin(i * 0.5) * 6 + (r() - 0.5) * 6]);
      wild.push([x, 266 + Math.sin(i * 0.9) * 34 + Math.sin(i * 2.3) * 18 + (r() - 0.5) * 22]);
    }
    this.calm = calm; this.wild = wild;
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Two fictional prices</p>' +
      '<p class="q4-l1" style="position:absolute;left:28px;top:62px;margin:0;font-size:24px;font-weight:700;color:color-mix(in srgb, var(--second) 75%, var(--ground))">Small, slow swings</p>' +
      '<p class="q4-l2" style="position:absolute;left:28px;top:156px;margin:0;font-size:24px;font-weight:700;color:var(--accent)">Big, fast swings</p>' +
      '<svg width="560" height="350" viewBox="0 0 560 350" style="position:absolute;left:0;top:0;overflow:visible">' +
      '<path class="q4-p1" fill="none" stroke-width="4" stroke-linejoin="round" style="stroke:color-mix(in srgb, var(--second) 70%, var(--ground))"/>' +
      '<path class="q4-p2" fill="none" stroke-width="4" stroke-linejoin="round" style="stroke:var(--accent)"/></svg>';
    this.quiz = UI.quiz(kit, {
      n: 4, from: 'T02', q: 'What does high volatility mean?',
      opts: ['The price only goes up', 'The price swings a lot, and fast, both ways', 'The price never changes', 'Many people own the coin'],
      ok: 1, bad: 0, vis,
      why: 'Volatility is how big and how fast the swings are.',
      whyNot: 'A volatile price can fall just as sharply as it rises.',
    });
    const q = (s) => kit.stage.querySelector(s);
    this.p1 = q('.q4-p1'); this.p2 = q('.q4-p2'); this.l1 = q('.q4-l1').style; this.l2 = q('.q4-l2').style;
  },
  render(t) {
    this.chrome(t);
    const draw = (pts, p) => { const n = Math.max(2, Math.round(pts.length * p)); return UI.d(pts.slice(0, n)); };
    const a = seg(t, 1.6, 6.6);
    this.p1.setAttribute('d', draw(this.calm, a)); this.p2.setAttribute('d', draw(this.wild, a));
    this.p1.style.opacity = this.p2.style.opacity = a > 0 ? 1 : 0;
    this.l1.opacity = eo(seg(t, 1.8, 2.3)); this.l2.opacity = eo(seg(t, 2.0, 2.5));
    const rv = seg(t, 7.7, 8.3);
    this.p2.setAttribute('stroke-width', (4 + 2 * eo(rv)).toFixed(2));
    this.l2.transform = 'scale(' + (1 + 0.08 * Math.sin(Math.PI * rv)).toFixed(4) + ')'; this.l2.transformOrigin = '0 50%';
    this.quiz(t);
  },
});
