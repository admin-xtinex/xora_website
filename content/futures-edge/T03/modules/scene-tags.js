const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('tags', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    // A price tag: the money half on top, the "for one unit" half below.
    const tag = (cls, x, y, w, money, unit, note) => '<div class="tg ' + cls + '" style="position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px">' +
      '<div class="glass" style="position:relative;padding:26px 30px 22px;border-radius:24px 24px 24px 24px">' +
      '<span style="position:absolute;right:26px;top:22px;width:22px;height:22px;border-radius:50%;border:3px solid color-mix(in srgb, var(--second) 35%, transparent)"></span>' +
      '<p class="fict" style="margin:0 0 10px">' + note + '</p>' +
      '<p class="mono tg-m" style="margin:0;padding:6px 10px;border-radius:12px;font-size:52px">' + money + '</p>' +
      '<p class="tg-u" style="margin:8px 0 0;padding:6px 10px;border-radius:12px;font-size:30px;font-weight:600">' + unit + '</p></div></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:780px"><p class="kick tg-k">Price tags</p>' +
      '<h2 class="line tg-t">Every price compares two things</h2>' +
      '<p class="sub tg-s">An amount of money, and one unit of the thing you get.</p></div>' +
      tag('tg-a', 1000, 250, 310, '₹60', 'for 1 kg of rice', 'Shop tag · example') +
      tag('tg-b', 1350, 250, 430, '60,000 USDT', 'for 1 BTC', 'Crypto price · fictional') +
      '<p class="tg-l1" style="position:absolute;left:1000px;top:530px;margin:0;font-size:26px;font-weight:600;color:var(--main)">▲ the money part</p>' +
      '<p class="tg-l2" style="position:absolute;left:1000px;top:576px;margin:0;font-size:26px;font-weight:600;color:var(--accent)">▲ one unit of the item</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tg-k').style; this.t = q('.tg-t'); this.s = q('.tg-s');
    this.a = q('.tg-a').style; this.b = q('.tg-b').style; this.l1 = q('.tg-l1').style; this.l2 = q('.tg-l2').style;
    this.ms = [...kit.stage.querySelectorAll('.tg-m')].map((e) => e.style); this.us = [...kit.stage.querySelectorAll('.tg-u')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'point', flip: true }, { t: 4.6, pose: 'explain' }, { t: 10.2, pose: 'idea' }],
      says: [{ t0: 10.6, t1: 15.6, text: 'Same idea, new item.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 4.8, { stagger: 0.06 });
    const a = seg(t, 0.6, 1.4);
    this.a.opacity = eo(a);
    this.a.transform = 'translateY(' + lerp(-60, 0, eob(a, 1.4)) + 'px) rotate(' + (lerp(-8, -3, eo(a)) + Math.sin(t * 1.6) * 1.2).toFixed(2) + 'deg)';
    this.a.transformOrigin = '50% 0';
    const b = seg(t, 10.2, 11.0);
    this.b.opacity = eo(b);
    this.b.transform = 'translateY(' + lerp(-60, 0, eob(b, 1.4)) + 'px) rotate(' + (lerp(8, 3, eo(b)) + Math.sin(t * 1.6 + 1) * 1.2).toFixed(2) + 'deg)';
    this.b.transformOrigin = '50% 0';
    // Highlight the two halves of each tag.
    const h1 = seg(t, 5.0, 5.5), h2 = seg(t, 7.0, 7.5), hb = seg(t, 11.6, 12.1);
    this.ms[0].background = 'color-mix(in srgb, var(--main) ' + (eo(h1) * 22).toFixed(1) + '%, transparent)';
    this.us[0].background = 'color-mix(in srgb, var(--accent) ' + (eo(h2) * 26).toFixed(1) + '%, transparent)';
    this.ms[1].background = 'color-mix(in srgb, var(--main) ' + (eo(hb) * 22).toFixed(1) + '%, transparent)';
    this.us[1].background = 'color-mix(in srgb, var(--accent) ' + (eo(hb) * 26).toFixed(1) + '%, transparent)';
    this.l1.opacity = eo(h1); this.l2.opacity = eo(h2);
    this.tutor.render(t);
  },
});
