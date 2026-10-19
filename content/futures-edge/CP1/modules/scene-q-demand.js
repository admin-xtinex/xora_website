const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('q-demand', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Illustrative market</p><p class="fict" style="position:absolute;right:28px;top:308px;margin:0">Not real data</p>' +
      '<p style="position:absolute;left:28px;top:66px;margin:0;font-size:24px;font-weight:700;color:var(--main)">Buyers <span class="mono q3-bn"></span></p>' +
      '<p style="position:absolute;left:310px;top:66px;margin:0;font-size:24px;font-weight:700;color:var(--accent)">Sellers <span class="mono">3</span></p>';
    for (let i = 0; i < 8; i++) vis += '<span class="q3-b" style="position:absolute;left:' + (30 + (i % 4) * 56) + 'px;top:' + (112 + Math.floor(i / 4) * 52) + 'px;width:38px;height:38px;border-radius:50%;background:color-mix(in srgb, var(--main) 35%, var(--ground));border:2px solid var(--main)"></span>';
    for (let i = 0; i < 3; i++) vis += '<span class="q3-s" style="position:absolute;left:' + (312 + i * 56) + 'px;top:112px;width:38px;height:38px;border-radius:50%;background:color-mix(in srgb, var(--accent) 35%, var(--ground));border:2px solid var(--accent)"></span>';
    vis += '<div style="position:absolute;left:28px;right:28px;top:236px;height:1.5px;background:color-mix(in srgb, var(--second) 12%, transparent)"></div>' +
      '<p style="position:absolute;left:28px;top:262px;margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Price</p>' +
      '<p class="mono q3-p" style="position:absolute;left:110px;top:250px;margin:0;font-size:40px">60,000</p>' +
      '<p class="mono q3-c" style="position:absolute;left:330px;top:262px;margin:0;font-size:24px;color:var(--main)"></p>';
    this.quiz = UI.quiz(kit, {
      n: 3, from: 'T02', q: 'Far more buyers than sellers. What tends to happen?',
      opts: ['The price tends to rise', 'The price is guaranteed to rise', 'The price tends to fall', 'Nothing. Prices are fixed'],
      ok: 0, bad: 1, vis,
      why: 'Buyers compete for fewer sellers, so they offer more.',
      whyNot: 'Nothing is guaranteed. News or thin trading can flip it fast.',
    });
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.bs = all('.q3-b').map((e) => e.style); this.ss = all('.q3-s').map((e) => e.style);
    this.bn = q('.q3-bn'); this.p = q('.q3-p'); this.c = q('.q3-c');
  },
  render(t) {
    this.chrome(t);
    let n = 0;
    this.bs.forEach((s, i) => {
      const a = i < 3 ? 1.6 + i * 0.15 : 3.0 + (i - 3) * 0.6, p = seg(t, a, a + 0.4);
      if (t >= a) n++;
      s.opacity = eo(p); s.transform = 'scale(' + lerp(0.3, 1, eob(p, 1.8)).toFixed(4) + ')';
    });
    this.ss.forEach((s, i) => { const a = 1.7 + i * 0.15, p = seg(t, a, a + 0.4); s.opacity = eo(p); s.transform = 'scale(' + lerp(0.3, 1, eob(p, 1.8)).toFixed(4) + ')'; });
    const nt = String(n);
    if (this.bn.textContent !== nt) this.bn.textContent = nt;
    const up = Math.floor(seg(t, 7.7, 10.2) * 6) * 25;
    const pt = UI.fmt(60000 + up);
    if (this.p.textContent !== pt) this.p.textContent = pt;
    this.p.style.color = up ? 'var(--main)' : 'var(--second)';
    const ct = up ? '▲ +' + up + ' USDT' : '';
    if (this.c.textContent !== ct) this.c.textContent = ct;
    this.quiz(t);
  },
});
