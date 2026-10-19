const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('q-value', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (cls, x, w, big, small) => '<div class="' + cls + '" style="position:absolute;left:' + x + 'px;top:96px;width:' + w + 'px;height:146px;box-sizing:border-box;border-radius:20px;padding:20px 16px;border:1.5px solid color-mix(in srgb, var(--main) 30%, transparent);background:color-mix(in srgb, var(--ground) 86%, var(--main))"><p class="mono ' + cls + '-n" style="margin:0;font-size:32px">' + big + '</p><p style="margin:6px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + small + '</p></div>';
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Value = amount × price</p>' +
      tile('q2-a', 24, 140, '0.005', 'BTC held') + '<span class="mono q2-x" style="position:absolute;left:170px;top:140px;font-size:36px;color:var(--main)">×</span>' +
      tile('q2-p', 204, 170, '60,000', 'USDT per BTC') + '<span class="mono q2-e" style="position:absolute;left:382px;top:140px;font-size:36px;color:var(--main)">=</span>' +
      tile('q2-v', 414, 122, '?', 'USDT') +
      '<p class="fict" style="position:absolute;left:28px;top:290px;margin:0">Fictional example</p>';
    this.quiz = UI.quiz(kit, {
      n: 2, from: 'T01', q: '0.005 BTC at 60,000 USDT per BTC. What is it worth?',
      opts: ['30 USDT', '300 USDT', '3,000 USDT', '60,000 USDT'],
      ok: 1, bad: 2, vis,
      why: '0.005 × 60,000 = 300 USDT. Amount times price.',
      whyNot: 'A decimal slip: 3,000 USDT is what 0.05 BTC is worth.',
    });
    const q = (s) => kit.stage.querySelector(s);
    this.parts = ['.q2-a', '.q2-x', '.q2-p', '.q2-e', '.q2-v'].map((s) => q(s).style);
    this.v = q('.q2-v-n'); this.vb = q('.q2-v').style;
  },
  render(t) {
    this.chrome(t);
    const at = [1.6, 2.4, 2.7, 3.5, 3.8];
    this.parts.forEach((s, i) => {
      const p = seg(t, at[i], at[i] + 0.5);
      s.opacity = eo(seg(t, at[i], at[i] + 0.3));
      s.transform = 'translateY(' + lerp(24, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.6)).toFixed(4) + ')';
    });
    const c = seg(t, 7.7, 8.7);
    const txt = t < 7.7 ? '?' : String(Math.round(lerp(0, 300, eo(c))));
    if (this.v.textContent !== txt) this.v.textContent = txt;
    this.v.style.color = t < 7.7 ? 'color-mix(in srgb, var(--second) ' + (60 + 40 * Math.sin(t * 3)).toFixed(0) + '%, var(--ground))' : 'var(--main)';
    this.vb.borderColor = t > 7.7 ? 'var(--main)' : 'color-mix(in srgb, var(--main) 30%, transparent)';
    this.quiz(t);
  },
});
