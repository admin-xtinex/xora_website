const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Each trade: +0.80 gross, −1.00 fees = −0.20. Ten trades step the running net down to −2.00.
const QB5_Z = 176, QB5_K = 48;
kit.scene('q-fees', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let bars = '';
    for (let i = 0; i < 10; i++) bars += '<div class="qb5-b" style="position:absolute;left:' + (36 + i * 40) + 'px;top:' + QB5_Z + 'px;width:28px;border-radius:0 0 5px 5px;background:var(--down)"></div>';
    const tile = (x, w, a, b, c) => '<div style="position:absolute;left:' + x + 'px;top:60px;width:' + w + 'px;height:70px;box-sizing:border-box;border-radius:16px;padding:8px 12px;border:1.5px solid color-mix(in srgb, var(--main) 30%, transparent);background:color-mix(in srgb, var(--ground) 86%, var(--main))" class="qb5-t"><p class="mono" style="margin:0;font-size:26px;color:' + c + '">' + a + '</p><p style="margin:0;font-size:22px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + b + '</p></div>';
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Per trade, in USDT</p>' +
      tile(24, 150, '+0.80', 'gross', 'var(--up)') + tile(190, 150, '−1.00', 'fees', 'var(--down)') + tile(356, 180, '= −0.20', 'net per trade', 'var(--down)') +
      '<div style="position:absolute;left:24px;right:24px;top:' + QB5_Z + 'px;height:2px;background:color-mix(in srgb, var(--second) 40%, transparent)"></div>' + bars +
      '<p class="mono qb5-n" style="position:absolute;left:446px;top:' + (QB5_Z + 70) + 'px;margin:0;font-size:30px">?</p>' +
      '<p class="fict" style="position:absolute;left:28px;top:150px;margin:0">Running net · 10 trades</p>';
    this.quiz = UI.quiz(kit, {
      n: 5, from: 'T19', q: '+0.80 USDT gross per scalp, 1.00 in fees. After 10 trades?',
      opts: ['+8.00 USDT', '−2.00 USDT', '+18.00 USDT', '0.00 USDT'],
      ok: 1, bad: 0, vis,
      why: '10 × (0.80 − 1.00) = −2.00 USDT net.',
      whyNot: '+8.00 forgets the fees: 10 × 1.00 = 10.00.',
    });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.ts = all('.qb5-t').map((e) => e.style); this.bs = all('.qb5-b').map((e) => e.style); this.n = kit.stage.querySelector('.qb5-n');
  },
  render(t) {
    this.chrome(t);
    this.ts.forEach((s, i) => UI.rise(kit, s, t, 1.6 + i * 0.6, 0.5, 16));
    this.bs.forEach((s, i) => {
      const a = 3.6 + i * 0.3, p = eo(seg(t, a, a + 0.3));
      s.height = (0.2 * (i + 1) * QB5_K * p).toFixed(1) + 'px'; s.opacity = p > 0 ? 1 : 0;
    });
    const c = eo(seg(t, 7.7, 8.5));
    UI.set(this.n, t < 7.7 ? '?' : UI.sgn(-2 * c, 2));
    this.n.style.color = t < 7.7 ? 'var(--second)' : 'var(--down)';
    this.quiz(t);
  },
});
