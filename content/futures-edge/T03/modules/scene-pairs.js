const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// [base, quote, price, reading, appears at, note]
const PA = [['BTC', 'USDT', '60,000', '1 BTC = 60,000 USDT', 0.8, ''], ['ETH', 'USDT', '3,000', '1 ETH = 3,000 USDT', 1.8, ''], ['ETH', 'BTC', '0.05', '1 ETH = 0.05 BTC', 6.2, 'Check: 3,000 ÷ 60,000 = 0.05']];
kit.scene('pairs', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    PA.forEach((p, i) => {
      cards += '<div class="glass pa-c" style="left:' + (140 + i * 520) + 'px;top:400px;width:490px;padding:26px 32px;display:flex;flex-direction:column;gap:12px">' +
        '<p class="mono" style="margin:0;font-size:52px"><span style="color:var(--main)">' + p[0] + '</span>/<span class="pa-q" style="color:var(--accent);padding:0 6px;border-radius:10px">' + p[1] + '</span></p>' +
        '<p class="mono" style="margin:0;font-size:40px">' + p[2] + ' <span style="font-size:26px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">' + p[1] + '</span></p>' +
        '<p class="pa-r" style="margin:0;font-size:28px;font-weight:600">' + p[3] + '</p>' +
        '<p style="margin:0;font-size:22px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">Base ' + p[0] + ' · quote ' + p[1] + '</p>' +
        (p[5] ? '<p class="mono pa-n" style="margin:0;font-size:22px;color:var(--main)">' + p[5] + '</p>' : '') + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1500px"><p class="kick pa-k">Other pairs</p>' +
      '<h2 class="line pa-t">Same idea, different assets</h2>' +
      '<p class="sub pa-s">The quote asset is not always USDT.</p></div>' + cards +
      '<p class="fict pa-f" style="position:absolute;left:1240px;top:250px;margin:0">Fictional prices</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.pa-k').style; this.t = q('.pa-t'); this.s = q('.pa-s'); this.f = q('.pa-f').style;
    this.cards = all('.pa-c').map((e) => e.style); this.qs = all('.pa-q').map((e) => e.style); this.rs = all('.pa-r').map((e) => e.style); this.n = q('.pa-n').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'present' }, { t: 5.8, pose: 'point', flip: true }, { t: 11.8, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 5.8, { stagger: 0.07 });
    this.f.opacity = 0.9 * eo(seg(t, 1.0, 1.6));
    PA.forEach((p, i) => {
      const a = seg(t, p[4], p[4] + 0.7);
      this.cards[i].opacity = eo(a) * (i === 0 ? lerp(1, 0.6, eo(seg(t, 5.8, 6.4))) : 1);
      this.cards[i].transform = 'translateY(' + lerp(40, 0, eo(a)) + 'px) scale(' + lerp(0.92, 1, eob(a, 1.6)) + ')';
    });
    const h = seg(t, 6.8, 7.4), r = seg(t, 11.8, 12.4);
    this.qs[2].background = 'color-mix(in srgb, var(--accent) ' + (eo(h) * 28).toFixed(1) + '%, transparent)';
    this.rs[2].color = r > 0 ? 'var(--main)' : 'var(--second)';
    this.rs[2].transform = 'scale(' + (1 + 0.06 * Math.sin(Math.PI * r)).toFixed(3) + ')'; this.rs[2].transformOrigin = '0 50%';
    this.n.opacity = eo(seg(t, 12.6, 13.2));
    this.tutor.render(t);
  },
});
