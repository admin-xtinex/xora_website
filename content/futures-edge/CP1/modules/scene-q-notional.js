const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const Q6_STEPS = [['1', '65,000'], ['0.1', '6,500'], ['0.01', '650'], ['0.001', '?']];
kit.scene('q-notional', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    Q6_STEPS.forEach((s, i) => {
      rows += '<div class="q6-r" style="display:flex;align-items:baseline;gap:14px;padding:8px 14px;border-radius:14px"><span class="mono" style="width:184px;text-align:right;font-size:30px">' + s[0] + ' BTC</span><span style="font-size:26px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">→</span><span class="mono q6-v" style="font-size:30px">' + s[1] + '</span><span style="font-size:24px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">USDT</span></div>';
    });
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Price 65,000 USDT per BTC</p>' +
      '<div style="position:absolute;left:22px;top:66px;display:flex;flex-direction:column;gap:6px">' + rows + '</div>' +
      '<p class="fict" style="position:absolute;right:28px;top:306px;margin:0">Fictional example</p>';
    this.quiz = UI.quiz(kit, {
      n: 6, from: 'T03', q: 'How many USDT is 0.001 BTC at 65,000?',
      opts: ['6.5 USDT', '65 USDT', '650 USDT', '65,000 USDT'],
      ok: 1, bad: 3, vis,
      why: '0.001 × 65,000 = 65 USDT. That is the notional value.',
      whyNot: '65,000 USDT is the price of one whole BTC.',
    });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.rows = all('.q6-r').map((e) => e.style); this.v = all('.q6-v').pop();
  },
  render(t) {
    this.chrome(t);
    this.rows.forEach((s, i) => {
      const a = 1.6 + i * 1.1, p = seg(t, a, a + 0.5), last = i === 3;
      s.opacity = eo(seg(t, a, a + 0.3));
      s.transform = 'translateY(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)';
      s.background = (last && t > 7.7) ? 'color-mix(in srgb, var(--main) 16%, transparent)' : 'transparent';
    });
    const vt = t < 7.7 ? '?' : String(Math.round(lerp(650, 65, eo(seg(t, 7.7, 8.5)))));
    if (this.v.textContent !== vt) this.v.textContent = vt;
    this.v.style.color = t < 7.7 ? 'var(--accent)' : 'var(--main)';
    this.quiz(t);
  },
});
