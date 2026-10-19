const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('q-lev', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (cls, x, w, big, small) => '<div class="' + cls + '" style="position:absolute;left:' + x + 'px;top:' + 86 + 'px;width:' + w + 'px;height:140px;box-sizing:border-box;border-radius:20px;padding:20px 16px;border:1.5px solid color-mix(in srgb, var(--main) 30%, transparent);background:color-mix(in srgb, var(--ground) 86%, var(--main))"><p class="mono ' + cls + '-n" style="margin:0;font-size:32px">' + big + '</p><p style="margin:6px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + small + '</p></div>';
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Gross PnL ≈ notional × move</p>' +
      tile('qa5-a', 24, 160, '1,000', 'USDT notional') + '<span class="mono qa5-x" style="position:absolute;left:192px;top:126px;font-size:36px;color:var(--main)">×</span>' +
      tile('qa5-p', 226, 140, '−2%', 'BTC move') + '<span class="mono qa5-e" style="position:absolute;left:374px;top:126px;font-size:36px;color:var(--main)">=</span>' +
      tile('qa5-v', 406, 130, '?', 'USDT') +
      '<p class="qa5-s" style="position:absolute;left:28px;top:246px;margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">100 USDT margin × 10x = 1,000 notional</p>' +
      '<p class="fict" style="position:absolute;left:28px;top:296px;margin:0">Fictional · before fees and funding</p>';
    this.quiz = UI.quiz(kit, {
      n: 5, from: 'T12', q: '100 USDT margin, 10x long. BTC falls 2%. Gross PnL?',
      opts: ['−2 USDT', '−20 USDT', '−200 USDT', '+20 USDT'],
      ok: 1, bad: 0, vis,
      why: '1,000 × −2% = −20 USDT. That is 20% of your margin.',
      whyNot: '−2 forgets the leverage: the move acts on 1,000.',
    });
    const q = (s) => kit.stage.querySelector(s);
    this.parts = ['.qa5-a', '.qa5-x', '.qa5-p', '.qa5-e', '.qa5-v', '.qa5-s'].map((s) => q(s).style);
    this.v = q('.qa5-v-n'); this.vb = q('.qa5-v').style;
  },
  render(t) {
    this.chrome(t);
    const at = [1.6, 2.4, 2.7, 3.5, 3.8, 4.4];
    this.parts.forEach((s, i) => { const p = seg(t, at[i], at[i] + 0.5); s.opacity = eo(seg(t, at[i], at[i] + 0.3)); s.transform = 'translateY(' + lerp(24, 0, eo(p)).toFixed(1) + 'px)'; });
    const c = seg(t, 7.7, 8.7);
    UI.set(this.v, t < 7.7 ? '?' : UI.sgn(-Math.round(20 * eo(c)), 0));
    this.v.style.color = t < 7.7 ? 'var(--second)' : 'var(--accent)';
    this.vb.borderColor = t > 7.7 ? 'var(--accent)' : 'color-mix(in srgb, var(--main) 30%, transparent)';
    this.quiz(t);
  },
});
