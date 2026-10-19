const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('q-pair', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const half = (cls, txt, lab, col) => '<div style="display:flex;flex-direction:column;align-items:center;gap:10px"><span class="mono ' + cls + '" style="font-size:66px;line-height:1">' + txt + '</span>' +
      '<span class="' + cls + '-u" style="width:100%;height:5px;border-radius:3px;background:' + col + '"></span><span class="kick ' + cls + '-l" style="color:' + col + '">' + lab + '</span></div>';
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Trading pair</p>' +
      '<div style="position:absolute;left:0;right:0;top:78px;display:flex;justify-content:center;align-items:flex-start;gap:26px">' +
      half('q5-b', 'BTC', 'Base', 'var(--main)') + '<span class="mono q5-sl" style="font-size:66px;line-height:1;color:color-mix(in srgb, var(--second) 40%, var(--ground))">/</span>' + half('q5-q', 'USDT', 'Quote', 'var(--accent)') + '</div>' +
      '<p class="q5-tag" style="position:absolute;left:0;right:0;top:250px;margin:0;text-align:center;font-size:30px;font-weight:600">1 BTC = <span class="mono q5-p" style="color:var(--main)">60,000</span> USDT</p>' +
      '<p class="fict" style="position:absolute;left:0;right:0;top:304px;margin:0;text-align:center">Fictional price</p>';
    this.quiz = UI.quiz(kit, {
      n: 5, from: 'T03', q: 'In the pair BTC/USDT, which is the base asset?',
      opts: ['BTC, the asset being priced', 'USDT, the coin you pay with', 'Both. They mean the same', 'Neither. It is a company name'],
      ok: 0, bad: 1, vis,
      why: 'The price says how many USDT one BTC costs.',
      whyNot: 'USDT is the quote: the unit the price is in.',
    });
    const q = (s) => kit.stage.querySelector(s);
    this.b = q('.q5-b').style; this.qq = q('.q5-q').style; this.sl = q('.q5-sl').style;
    this.bu = q('.q5-b-u').style; this.bl = q('.q5-b-l').style; this.qu = q('.q5-q-u').style; this.ql = q('.q5-q-l').style;
    this.tag = q('.q5-tag').style; this.p = q('.q5-p');
  },
  render(t) {
    this.chrome(t);
    [this.b, this.sl, this.qq].forEach((s, i) => { const a = 1.6 + i * 0.3, p = seg(t, a, a + 0.5); s.opacity = eo(p); s.transform = 'translateY(' + lerp(20, 0, eo(p)).toFixed(1) + 'px)'; });
    const tg = seg(t, 2.8, 3.4); this.tag.opacity = eo(tg);
    const price = 60000 + Math.round((Math.sin(t * 1.9) * 40 + Math.sin(t * 4.3) * 20) / 5) * 5 * (t > 3.4 ? 1 : 0);
    const pt = UI.fmt(price);
    if (this.p.textContent !== pt) this.p.textContent = pt;
    const u1 = seg(t, 7.8, 8.3), u2 = seg(t, 14.3, 14.8);
    this.bu.transform = 'scaleX(' + eo(u1).toFixed(3) + ')'; this.bl.opacity = eo(u1);
    this.qu.transform = 'scaleX(' + eo(u2).toFixed(3) + ')'; this.ql.opacity = eo(u2);
    this.quiz(t);
  },
});
