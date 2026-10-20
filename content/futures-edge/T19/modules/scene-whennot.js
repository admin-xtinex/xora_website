const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Six situations, each stamped NO_TRADE.
const WN = [['Very thin market', 'Few orders, big slippage', 4.6], ['Wild news spike', 'Ranges jump in seconds', 5.8], ['Fees ≥ expected move', 'Nothing left after costs', 7.0],
  ['No clear reason', 'Bored, or just a hunch', 10.3], ['No stop, no risk plan', 'Can’t say where you’re wrong', 11.5], ['Tired, upset, chasing', 'Feelings drive the clicks', 12.7]];
kit.scene('whennot', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    WN.forEach((w, i) => {
      const x = 140 + (i % 3) * 530, y = 310 + Math.floor(i / 3) * 230;
      cards += '<div class="glass wn-c" style="left:' + x + 'px;top:' + y + 'px;width:500px;height:200px;padding:26px 30px"><p style="margin:0 0 10px;font-size:32px;font-weight:700">' + w[0] + '</p><p style="margin:0;font-size:28px;line-height:1.35;color:color-mix(in srgb, var(--second) 72%, var(--ground))">' + w[1] + '</p></div>' +
        '<p class="wn-s mono" style="position:absolute;left:' + (x + 250) + 'px;top:' + (y + 132) + 'px;margin:0;padding:6px 18px;border:3px solid var(--main);border-radius:10px;font-size:30px;font-weight:700;letter-spacing:.08em;color:var(--main);background:color-mix(in srgb, var(--ground) 80%, var(--main))">NO_TRADE</p>';
    });
    kit.stage.append(kit.h('<div class="ground">' + cards +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick wn-k" style="color:var(--accent)">When not to trade</p>' +
      '<h2 class="line wn-t">Some moments say WAIT</h2></div>' +
      '</div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = kit.stage.querySelector('.wn-k').style; this.t = kit.stage.querySelector('.wn-t');
    this.cs = all('.wn-c').map((e) => e.style); this.ss = all('.wn-s').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'think' }, { t: 4.5, pose: 'magnify' }, { t: 10.2, pose: 'confused' }, { t: 15.6, pose: 'checklist' }, { t: 19.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cs.forEach((s, i) => UI.rise(s, t, WN[i][2]));
    this.ss.forEach((s, i) => {
      const a = 15.8 + i * 0.4, p = seg(t, a, a + 0.35);
      s.opacity = eo(p); s.transform = 'rotate(-7deg) scale(' + lerp(1.8, 1, eob(p, 1.3)).toFixed(3) + ')';
    });
    this.tutor.render(t);
  },
});
