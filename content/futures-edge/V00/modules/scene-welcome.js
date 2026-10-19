const { seg, eo, eob, eio, lerp, TextFx } = kit;
const WELCOME_STATS = [[23, 'short lessons'], [5, 'phases'], [3, 'checkpoints']];
kit.scene('welcome', {
  init(kit) {
    let cards = '';
    WELCOME_STATS.forEach((s) => {
      cards += '<div class="glass welcome-card" style="position:relative;width:300px;height:132px;padding:0 30px;display:flex;align-items:center;gap:22px">' +
        '<span class="mono welcome-n" style="font-size:68px;font-weight:500;color:var(--main);width:86px">' + s[0] + '</span>' +
        '<span style="font-size:28px;font-weight:600;line-height:1.2">' + s[1] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words welcome-w" style="left:140px;top:200px;width:1000px"><p class="kick welcome-k">Start here</p>' +
      '<h1 class="line welcome-t" style="font-size:112px">Welcome to XORA Futures Edge</h1>' +
      '<div class="rule welcome-r" style="width:280px"></div>' +
      '<p class="sub welcome-s">A beginner course in crypto futures that starts from zero.</p></div>' +
      '<div class="welcome-stack" style="position:absolute;left:140px;top:770px;display:flex;gap:26px">' + cards + '</div>' +
      '<div class="welcome-halo" style="position:absolute;left:1270px;top:430px;width:560px;height:560px;border-radius:50%;background:radial-gradient(closest-side, color-mix(in srgb, var(--accent) 22%, transparent), transparent)"></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.welcome-k').style; this.title = q('.welcome-t'); this.r = q('.welcome-r').style;
    this.s = q('.welcome-s'); this.halo = q('.welcome-halo').style;
    this.cards = [...kit.stage.querySelectorAll('.welcome-card')].map((c) => c.style);
    this.nums = [...kit.stage.querySelectorAll('.welcome-n')];
    this.w = q('.welcome-w').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2150, y: 930, s: 300 }, { t: 1.5, x: 1550, y: 930, s: 300, d: 1.5, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }, { t: 9.8, x: C.x, y: C.y, s: C.s, d: 1.1 }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 1.5, pose: 'wave' }, { t: 3.7, pose: 'present' }, { t: 6.3, pose: 'explain' }, { t: 8.7, pose: 'walk' }, { t: 9.8, pose: 'idle' }],
      says: [
        { t0: 1.5, t1: 3.6, text: 'Hi! I am your XORA tutor.', side: 'top' },
        { t0: 3.9, t1: 6.2, text: 'We start from zero. No experience needed.', side: 'top' },
        { t0: 6.4, t1: 8.6, text: 'Pause and replay any time you like.', side: 'top' },
      ],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, 0.1, 0.6));
    TextFx.fadeFromRight(this.title, t, 0.2);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 1.1, 1.9)) + ')';
    TextFx.fadeFromRight(this.s, t, 1.6, { stagger: 0.06 });
    this.cards.forEach((c, i) => {
      const a = 4.4 + i * 0.35;
      const p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + lerp(40, 0, eo(p)) + 'px) scale(' + lerp(0.94, 1, eob(p, 1.5)) + ')';
      const v = WELCOME_STATS[i][0];
      const n = Math.round(lerp(Math.ceil(v / 2), v, eo(seg(t, a + 0.1, a + 1.3))));
      if (this.nums[i].textContent !== String(n)) this.nums[i].textContent = String(n);
    });
    this.halo.opacity = eo(seg(t, 0.6, 1.6)) * (1 - eio(seg(t, 8.7, 9.7)));
    this.halo.transform = 'scale(' + (1 + 0.03 * Math.sin(t * 2 * Math.PI / 3.4)) + ')';
    this.w.transform = 'translateY(' + (-t * 1.5).toFixed(2) + 'px)';
    this.tutor.render(t);
  },
});
