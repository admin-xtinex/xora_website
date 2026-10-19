const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Three leverage levels on the same ±2% move: bars grow both ways (share of a 100 USDT margin).
const QA6 = [[1, 2], [3, 6], [10, 20]];
kit.scene('q-safe', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    QA6.forEach((r, i) => {
      rows += '<div style="position:absolute;left:24px;right:24px;top:' + (80 + i * 70) + 'px;height:56px">' +
        '<span class="mono" style="position:absolute;left:0;top:12px;font-size:26px">' + r[0] + 'x</span>' +
        '<div style="position:absolute;left:280px;top:8px;width:2px;height:40px;background:color-mix(in srgb, var(--second) 40%, transparent)"></div>' +
        '<div class="qa6-up" style="position:absolute;left:282px;top:14px;height:13px;border-radius:0 6px 6px 0;background:var(--main)"></div>' +
        '<div class="qa6-dn" style="position:absolute;right:230px;top:29px;height:13px;border-radius:6px 0 0 6px;background:var(--accent)"></div>' +
        '<span class="mono qa6-v" style="position:absolute;right:0;top:12px;font-size:22px">±' + r[1] + '%</span></div>';
    });
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Same ±2% move · % of margin</p>' + rows +
      '<p class="fict" style="position:absolute;left:28px;top:296px;margin:0">Illustrative · before fees</p>';
    this.quiz = UI.quiz(kit, {
      n: 6, from: 'T12', q: 'Which statement about leverage is true?',
      opts: ['3x is always safe', 'It magnifies gains and losses alike', 'Higher leverage means higher profit', 'It changes how far the market moves'],
      ok: 1, bad: 0, vis,
      why: 'Results grow both ways, compared with your margin.',
      whyNot: 'No leverage number is safe. Lower only means smaller swings.',
    });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.up = all('.qa6-up').map((e) => e.style); this.dn = all('.qa6-dn').map((e) => e.style); this.vs = all('.qa6-v').map((e) => e.style);
  },
  render(t) {
    this.chrome(t);
    QA6.forEach((r, i) => {
      const a = 1.6 + i * 0.7, p = eio(seg(t, a, a + 0.8));
      const w = (r[1] / 20 * 150 * p).toFixed(1) + 'px';
      this.up[i].width = w; this.dn[i].width = w;
      this.dn[i].right = 'calc(100% - 280px)';
      this.vs[i].opacity = eo(seg(t, a + 0.5, a + 0.9));
    });
    this.quiz(t);
  },
});
