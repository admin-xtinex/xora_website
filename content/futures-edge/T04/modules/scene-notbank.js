const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const NB = [['Not a bank deposit', 'Money you keep on an exchange is usually not protected the way a bank deposit is.', 3.8], ['Things can go wrong', 'Exchanges can pause withdrawals, get hacked, or even shut down.', 9.6], ['Rules differ', 'Rules depend on your country, and they can change.', 14.6]];
kit.scene('notbank', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const icons = [
      // shield, then a slash through it
      '<svg width="120" height="110" viewBox="0 0 120 110"><path d="M60 8 L100 22 L100 54 C100 78 82 96 60 104 C38 96 20 78 20 54 L20 22 Z" fill="none" stroke-width="6" style="stroke:var(--main)"/><line class="nb-x" x1="22" y1="100" x2="98" y2="12" pathLength="1" stroke-width="7" stroke-linecap="round" style="stroke:var(--accent)"/></svg>',
      // a withdraw button that switches to paused
      '<svg width="220" height="110" viewBox="0 0 220 110"><rect class="nb-btn" x="6" y="28" width="208" height="58" rx="14" stroke-width="3"/><text class="nb-bt" x="110" y="66" text-anchor="middle" style="font-size:24px;font-weight:700">Withdraw</text></svg>',
      // a rule sheet with a change arrow
      '<svg width="120" height="110" viewBox="0 0 120 110"><rect x="22" y="6" width="70" height="92" rx="8" fill="none" stroke-width="5" style="stroke:var(--main)"/><line x1="34" y1="30" x2="80" y2="30" stroke-width="5" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/><line x1="34" y1="48" x2="72" y2="48" stroke-width="5" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/><line x1="34" y1="66" x2="78" y2="66" stroke-width="5" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/><g class="nb-rot"><path d="M88 70 A 20 20 0 1 1 104 92" fill="none" stroke-width="6" stroke-linecap="round" style="stroke:var(--accent)"/><path d="M98 98 L106 92 L100 84" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--accent)"/></g></svg>',
    ];
    let cards = '';
    NB.forEach((n, i) => {
      cards += '<div class="glass nb-c" style="left:' + (140 + i * 550) + 'px;top:370px;width:520px;height:380px;padding:26px 32px;display:flex;flex-direction:column;gap:16px">' +
        '<div style="height:112px;display:flex;align-items:center">' + icons[i] + '</div>' +
        '<p class="kick" style="margin:0;color:var(--accent)">' + n[0] + '</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">' + n[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1500px"><p class="kick nb-k" style="color:var(--accent)">Important</p>' +
      '<h2 class="line nb-t">An exchange is not a bank</h2></div>' + cards +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.nb-k').style; this.t = q('.nb-t');
    this.cards = [...kit.stage.querySelectorAll('.nb-c')].map((e) => e.style);
    this.x = q('.nb-x'); this.btn = q('.nb-btn'); this.bt = q('.nb-bt'); this.rot = q('.nb-rot');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'calm' }, { t: 9.6, pose: 'think' }, { t: 14.6, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cards.forEach((c, i) => {
      const a = NB[i][2], p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + (lerp(40, 0, eo(p)) - Math.max(0, t - a) * 0.5).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
    });
    this.x.setAttribute('stroke-dasharray', eio(seg(t, 4.8, 5.5)) + ' 1');
    this.x.style.opacity = t > 4.75 ? 1 : 0;
    const paused = t > 11.0;
    this.btn.setAttribute('style', paused ? 'fill:color-mix(in srgb, var(--second) 8%, transparent);stroke:color-mix(in srgb, var(--second) 30%, transparent)' : 'fill:var(--main);stroke:var(--main)');
    UI.set(this.bt, paused ? 'Paused' : 'Withdraw');
    this.bt.setAttribute('style', 'font-size:24px;font-weight:700;fill:' + (paused ? 'var(--accent)' : 'var(--ground)'));
    this.rot.setAttribute('transform', 'rotate(' + (eio(seg(t, 15.4, 16.4)) * 360).toFixed(1) + ' 92 80)');
    this.tutor.render(t);
  },
});
