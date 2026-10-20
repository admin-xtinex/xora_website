const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A small journal: planned −6.00, actual −6.30; after the reveal, the next step is a review and a break.
const QB8 = [['Planned loss', '−6.00', 'var(--second)'], ['Actual loss', '−6.30', 'var(--down)'], ['Slippage', '−0.30', 'var(--accent)'], ['Followed plan?', 'Yes ✓', 'var(--main)']];
kit.scene('q-after', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    QB8.forEach((r) => {
      rows += '<div class="qb8-r" style="display:flex;justify-content:space-between;align-items:baseline;padding:7px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:26px">' + r[0] + '</span><span class="mono" style="font-size:28px;color:' + r[2] + '">' + r[1] + '</span></div>';
    });
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Demo journal · USDT</p><p class="fict" style="position:absolute;right:24px;top:300px;margin:0">Fictional</p>' +
      '<div style="position:absolute;left:28px;right:28px;top:60px">' + rows + '</div>' +
      '<div class="qb8-n" style="position:absolute;left:28px;top:270px;display:flex;gap:12px"><span class="chip" style="font-size:24px;padding:8px 18px;background:var(--main);color:var(--ground);border-color:var(--main)">Review</span><span class="chip" style="font-size:24px;padding:8px 18px">Take a break</span></div>';
    this.quiz = UI.quiz(kit, {
      n: 8, from: 'T23', q: 'Your demo stop slipped: −6.30 instead of −6.00. What next?',
      opts: ['Double the size to win it back', 'Journal it, check the process, take a break', 'Trade without a stop next time', 'Use 20x leverage to recover faster'],
      ok: 1, bad: 0, vis,
      why: 'Small slips are normal. Review the process, then rest.',
      whyNot: 'Revenge trading: doubling the size doubles the risk.',
    });
    this.rs = [...kit.stage.querySelectorAll('.qb8-r')].map((e) => e.style); this.n = kit.stage.querySelector('.qb8-n').style;
  },
  render(t) {
    this.chrome(t);
    this.rs.forEach((s, i) => { const p = seg(t, 1.6 + i * 0.6, 2.0 + i * 0.6); s.opacity = eo(p); s.transform = 'translateX(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)'; });
    UI.rise(kit, this.n, t, 8.0, 0.5, 16);
    this.quiz(t);
  },
});
