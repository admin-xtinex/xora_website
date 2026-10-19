const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const HK_REG = ['wl', 'sym', 'chart', 'book', 'entry', 'pos', 'wallet', 'sec'];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    let outl = '';
    HK_REG.forEach((k) => { const r = UI.R[k]; outl += '<div class="hk-o" style="position:absolute;left:' + (r.x - 6) + 'px;top:' + (r.y - 6) + 'px;width:' + (r.w + 12) + 'px;height:' + (r.h + 12) + 'px;box-sizing:border-box;border-radius:20px;border:3px solid var(--main)"></div>'; });
    kit.stage.append(kit.h('<div style="position:absolute;inset:0;pointer-events:none">' + outl + '</div>'));
    kit.stage.append(kit.h('<div class="hk-dim" style="position:absolute;inset:0;background:rgba(2,3,10,.82)"></div>'));
    this.card = UI.tip(kit, 420, 250, 1080, 'Educational mock', 'Not a real exchange screen', 'Real apps look different, and their layouts change often. This mock only teaches the parts.',
      '<p class="fict" style="margin:0">All prices are fictional · Illustrative, not real market data</p>');
    const q = (s) => kit.stage.querySelector(s);
    this.dim = q('.hk-dim').style; this.cs = this.card.style;
    this.outl = [...kit.stage.querySelectorAll('.hk-o')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'laptop' }, { t: 1.4, pose: 'confused' }, { t: 6.0, pose: 'explain' }, { t: 13.4, pose: 'present' }],
      says: [{ t0: 7.0, t1: 12.6, text: 'Every app is a bit different.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.term.panels.forEach((s, i) => {
      const a = 0.3 + i * 0.45, p = seg(t, a, a + 0.7);
      s.opacity = eo(seg(t, a, a + 0.35));
      s.transform = 'translateY(' + lerp(40, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.94, 1, eob(p, 1.5)).toFixed(4) + ')';
    });
    this.term.render(t, { sym: 'BTC' });
    const d = seg(t, 5.9, 6.6), u = seg(t, 13.2, 13.9);
    this.dim.opacity = (eo(d) * (1 - eio(u))).toFixed(3);
    UI.show(this.cs, t, 6.2, 13.1);
    this.outl.forEach((s, i) => {
      const a = 13.9 + i * 0.32, p = seg(t, a, a + 0.4);
      s.opacity = (eo(p) * (1 - 0.55 * eo(seg(t, a + 0.6, a + 1.4)))).toFixed(3);
      s.transform = 'scale(' + lerp(1.04, 1, eo(p)).toFixed(4) + ')';
    });
    this.tutor.render(t);
  },
});
