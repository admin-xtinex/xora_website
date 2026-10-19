const { seg, eo, eob, eio, lerp, TextFx } = kit;
kit.scene('bitcoin', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (cls, label) => '<div class="glass bt-tile" style="position:relative;width:640px;padding:26px 36px;display:flex;align-items:baseline;gap:24px"><span class="mono ' + cls + '" style="flex:none;font-size:50px;color:var(--main)"></span><span style="flex:1;min-width:0;font-size:26px;font-weight:600;line-height:1.3">' + label + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:780px"><p class="kick bt-k">The first cryptocurrency</p>' +
      '<h2 class="line bt-t">Meet Bitcoin</h2>' +
      '<p class="def bt-d"><b>Bitcoin</b> is the first and best-known cryptocurrency. Its short symbol is <b>BTC</b>.</p>' +
      '<p class="sub bt-s">One bitcoin can be split into tiny parts, so you can own a small piece of one.</p></div>' +
      '<div class="bt-tiles" style="position:absolute;left:1060px;top:180px;display:flex;flex-direction:column;gap:26px">' +
      tile('bt-year', 'launched') + tile('bt-max', 'the most that can ever exist') + tile('bt-min', 'BTC, the smallest unit') + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.bt-k').style; this.t = q('.bt-t'); this.d = q('.bt-d'); this.s = q('.bt-s');
    this.tiles = [...kit.stage.querySelectorAll('.bt-tile')].map((e) => e.style);
    this.year = q('.bt-year'); this.max = q('.bt-max'); this.min = q('.bt-min');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 2.0, pose: 'point', flip: true }, { t: 9.2, pose: 'explain' }],
      says: [{ t0: 9.4, t1: 13.6, text: 'You can own a tiny piece, like 0.002 BTC.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    this.tiles.forEach((s, i) => {
      const a = 2.0 + i * 1.6, p = seg(t, a, a + 0.6);
      s.opacity = eo(p);
      s.transform = 'translateX(' + lerp(50, 0, eo(p)) + 'px) translateY(' + (-t * 1.2).toFixed(2) + 'px)';
    });
    const set = (el, v) => { if (el.textContent !== v) el.textContent = v; };
    set(this.year, String(Math.round(lerp(2004, 2009, eo(seg(t, 2.1, 3.1))))));
    set(this.max, UI.fmt(Math.round(lerp(10500000, 21000000, eo(seg(t, 3.7, 4.9))) / 1000) * 1000));
    const z = Math.round(lerp(1, 8, eo(seg(t, 5.3, 6.5))));
    set(this.min, '0.' + '0'.repeat(z - 1) + '1');
    TextFx.fadeFromRight(this.s, t, 6.8, { stagger: 0.06 });
    this.tutor.render(t);
  },
});
