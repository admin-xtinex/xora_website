const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Allowed notional ≈ risk budget ÷ stop distance: 10 ÷ 2% = 500 USDT.
kit.scene('q-size', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (cls, x, w, big, small) => '<div class="' + cls + '" style="position:absolute;left:' + x + 'px;top:86px;width:' + w + 'px;height:140px;box-sizing:border-box;border-radius:20px;padding:20px 16px;border:1.5px solid color-mix(in srgb, var(--main) 30%, transparent);background:color-mix(in srgb, var(--ground) 86%, var(--main))"><p class="mono ' + cls + '-n" style="margin:0;font-size:32px">' + big + '</p><p style="margin:6px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + small + '</p></div>';
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Notional ≈ budget ÷ stop %</p>' +
      tile('qb7-a', 24, 150, '10', 'USDT budget') + '<span class="mono qb7-x" style="position:absolute;left:184px;top:126px;font-size:36px;color:var(--main)">÷</span>' +
      tile('qb7-p', 220, 140, '2%', 'stop distance') + '<span class="mono qb7-e" style="position:absolute;left:370px;top:126px;font-size:36px;color:var(--main)">=</span>' +
      tile('qb7-v', 402, 134, '?', 'USDT') +
      '<p class="qb7-s" style="position:absolute;left:28px;top:246px;margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">Demo account 1,000 USDT</p>' +
      '<p class="fict" style="position:absolute;left:28px;top:296px;margin:0">Example only · before fees</p>';
    this.quiz = UI.quiz(kit, {
      n: 7, from: 'T22', q: 'Risk budget 10 USDT. Stop 2% from entry. About what notional?',
      opts: ['About 500 USDT', 'About 1,000 USDT', 'About 200 USDT', 'About 5,000 USDT'],
      ok: 0, bad: 1, vis,
      why: '10 ÷ 2% = 500 USDT. The stop would cost about 10.',
      whyNot: '1,000 × 2% = 20 USDT: double the budget.',
    });
    const q = (s) => kit.stage.querySelector(s);
    this.parts = ['.qb7-a', '.qb7-x', '.qb7-p', '.qb7-e', '.qb7-v', '.qb7-s'].map((s) => q(s).style);
    this.v = q('.qb7-v-n'); this.vb = q('.qb7-v').style;
  },
  render(t) {
    this.chrome(t);
    const at = [1.6, 2.4, 2.7, 3.5, 3.8, 4.4];
    this.parts.forEach((s, i) => UI.rise(kit, s, t, at[i], 0.5, 24));
    const c = seg(t, 7.7, 8.7);
    UI.set(this.v, t < 7.7 ? '?' : UI.fmt(Math.round(500 * eo(c))));
    this.v.style.color = t < 7.7 ? 'var(--second)' : 'var(--main)';
    this.vb.borderColor = t > 7.7 ? 'var(--main)' : 'color-mix(in srgb, var(--main) 30%, transparent)';
    this.quiz(t);
  },
});
