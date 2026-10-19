const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('q-spot', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (cls, x, head, a, b, col) => '<div class="' + cls + '" style="position:absolute;left:' + x + 'px;top:70px;width:244px;height:200px;box-sizing:border-box;border-radius:20px;padding:18px 20px;border:1.5px solid ' + col + ';background:color-mix(in srgb, var(--ground) 86%, var(--main))">' +
      '<p class="kick" style="margin:0 0 10px;color:' + col + '">' + head + '</p><p style="margin:0;font-size:26px;font-weight:700">' + a + '</p><p style="margin:8px 0 0;font-size:22px;line-height:1.3;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + b + '</p></div>';
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Same coin, two products</p>' +
      card('qa2-a', 24, 'Spot', '0.01 BTC', 'In your wallet. You own it.', 'var(--main)') +
      card('qa2-b', 292, 'Futures', 'Long position', 'A contract on BTC’s price. Margin, funding, liquidation.', 'var(--accent)') +
      '<p class="fict" style="position:absolute;left:28px;top:296px;margin:0">Fictional example</p>';
    this.quiz = UI.quiz(kit, {
      n: 2, from: 'T05 · T11', q: 'What is the key difference between spot and futures?',
      opts: ['Spot: you own the coin. Futures: a contract on its price', 'Futures are just a cheaper way to buy coins', 'Only spot positions can be liquidated', 'There is no real difference'],
      ok: 0, bad: 1, vis,
      why: 'Spot is ownership. Futures are contracts about the price.',
      whyNot: 'Futures use margin, pay funding and can be liquidated.',
    });
    this.a = kit.stage.querySelector('.qa2-a').style; this.b = kit.stage.querySelector('.qa2-b').style;
  },
  render(t) {
    this.chrome(t);
    [this.a, this.b].forEach((s, i) => { const a = 1.6 + i * 0.6, p = seg(t, a, a + 0.5); s.opacity = eo(seg(t, a, a + 0.3)); s.transform = 'translateY(' + lerp(24, 0, eo(p)).toFixed(1) + 'px)'; });
    this.quiz(t);
  },
});
