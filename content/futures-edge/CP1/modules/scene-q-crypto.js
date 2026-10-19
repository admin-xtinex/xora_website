const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('q-crypto', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const rows = [['#1', 'Ana → Ben 0.20'], ['#2', 'Ben → Cai 0.05'], ['#3', 'Friend → You 0.01']];
    let vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Shared ledger</p><p class="fict" style="position:absolute;right:28px;top:26px;margin:0">Fictional</p>';
    rows.forEach((r, i) => { vis += '<div class="mono q1-r" style="position:absolute;left:28px;top:' + (68 + i * 44) + 'px;display:flex;gap:16px;font-size:24px"><span style="color:color-mix(in srgb, var(--second) 50%, var(--ground))">' + r[0] + '</span><span>' + r[1] + '</span></div>'; });
    vis += '<p class="q1-cl" style="position:absolute;left:28px;top:212px;margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Copied on many computers</p>';
    for (let i = 0; i < 6; i++) vis += '<div class="q1-pc" style="position:absolute;left:' + (28 + i * 84) + 'px;top:258px;width:66px;height:50px;border-radius:10px;border:2px solid color-mix(in srgb, var(--main) 40%, transparent);background:color-mix(in srgb, var(--ground) 84%, var(--main))"><div style="margin:12px 10px 0;height:6px;border-radius:3px;background:var(--main)"></div><div style="margin:7px 10px 0;width:30px;height:6px;border-radius:3px;background:var(--accent)"></div></div>';
    this.quiz = UI.quiz(kit, {
      n: 1, from: 'T01', q: 'What is a cryptocurrency?',
      opts: ['A digital asset recorded on a shared public ledger', 'Coins stored inside your phone', 'Money that a government guarantees', 'A bank account kept in US dollars'],
      ok: 0, bad: 1, vis,
      why: 'Its record lives on a blockchain that many computers copy.',
      whyNot: 'A wallet holds keys. The coins are entries on the ledger.',
    });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.rows = all('.q1-r').map((e) => e.style); this.pcs = all('.q1-pc').map((e) => e.style); this.cl = kit.stage.querySelector('.q1-cl').style;
  },
  render(t) {
    this.chrome(t);
    this.rows.forEach((s, i) => {
      const a = 1.6 + i * 0.6, p = seg(t, a, a + 0.5);
      s.opacity = eo(p); s.transform = 'translateX(' + lerp(24, 0, eo(p)).toFixed(1) + 'px)';
      if (i === 2) s.color = t > 7.6 ? 'var(--main)' : 'var(--second)';
    });
    this.cl.opacity = eo(seg(t, 3.4, 3.9));
    this.pcs.forEach((s, i) => {
      const a = 3.8 + i * 0.3, p = seg(t, a, a + 0.4), pulse = Math.sin(Math.PI * seg(t, 7.8 + i * 0.08, 8.4 + i * 0.08));
      s.opacity = eo(p);
      s.transform = 'scale(' + (lerp(0.6, 1, eob(p, 1.7)) * (1 + 0.1 * pulse)).toFixed(4) + ')';
      s.borderColor = pulse > 0 ? 'var(--main)' : 'color-mix(in srgb, var(--main) 40%, transparent)';
    });
    this.quiz(t);
  },
});
