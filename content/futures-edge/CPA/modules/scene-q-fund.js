const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Funding: long 2,000 USDT notional, rate +0.01% → longs pay 0.20 USDT to shorts.
kit.scene('q-fund', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const side = (cls, x, name) => '<div class="' + cls + '" style="position:absolute;left:' + x + 'px;top:150px;width:170px;padding:14px 10px;box-sizing:border-box;border-radius:18px;text-align:center;border:1.5px solid color-mix(in srgb, var(--main) 30%, transparent);background:color-mix(in srgb, var(--ground) 86%, var(--main))"><p style="margin:0;font-size:26px;font-weight:700">' + name + '</p><p class="mono ' + cls + '-v" style="margin:4px 0 0;font-size:24px">?</p></div>';
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Funding time · rate +0.01%</p>' +
      '<p class="mono qa8-f" style="position:absolute;left:28px;top:66px;margin:0;font-size:26px">2,000 × 0.01% = <span style="color:var(--accent)">0.20 USDT</span></p>' +
      side('qa8-l', 40, 'You (long)') + side('qa8-s', 350, 'Shorts') +
      '<svg width="560" height="340" viewBox="0 0 560 340" style="position:absolute;left:0;top:0"><circle class="qa8-c" r="16" style="fill:var(--accent)"/></svg>' +
      '<p class="fict" style="position:absolute;left:28px;top:296px;margin:0">Fictional rate · real rates change</p>';
    this.quiz = UI.quiz(kit, {
      n: 8, from: 'T13', q: 'Long, 2,000 USDT notional. Funding rate +0.01%. Then?',
      opts: ['You pay 0.20 USDT', 'You receive 0.20 USDT', 'You pay 2 USDT', 'Nothing: funding is for shorts only'],
      ok: 0, bad: 1, vis,
      why: '2,000 × 0.01% = 0.20. Positive rate: longs pay shorts.',
      whyNot: 'Backwards: shorts pay longs only when the rate is negative.',
    });
    const q = (s) => kit.stage.querySelector(s);
    this.f = q('.qa8-f').style; this.c = q('.qa8-c'); this.lv = q('.qa8-l-v'); this.sv = q('.qa8-s-v');
    this.sides = [q('.qa8-l').style, q('.qa8-s').style];
  },
  render(t) {
    this.chrome(t);
    this.sides.forEach((s, i) => { const a = 1.6 + i * 0.4, p = seg(t, a, a + 0.5); s.opacity = eo(seg(t, a, a + 0.3)); s.transform = 'translateY(' + lerp(20, 0, eo(p)).toFixed(1) + 'px)'; });
    this.f.opacity = eo(seg(t, 7.7, 8.2));
    // The payment flies from the long to the shorts after the reveal.
    const p = seg(t, 8.0, 9.2), base = 1220;
    const cx = lerp(125, 435, eio(p)), cy = 140 - Math.sin(Math.PI * p) * 60;
    this.c.setAttribute('cx', cx.toFixed(1)); this.c.setAttribute('cy', cy.toFixed(1)); this.c.style.opacity = p > 0 && p < 1 ? 1 : 0;
    UI.set(this.lv, t < 9.2 ? '?' : '−0.20');
    UI.set(this.sv, t < 9.2 ? '?' : '+0.20');
    this.lv.style.color = t < 9.2 ? 'var(--second)' : 'var(--accent)'; this.sv.style.color = t < 9.2 ? 'var(--second)' : 'var(--main)';
    this.quiz(t);
  },
});
