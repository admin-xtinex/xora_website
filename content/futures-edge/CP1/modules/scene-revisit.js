const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const REV = [
  ['T01', 'What crypto is, keys and value', 'Q1 · Q2', 3.6],
  ['T02', 'Buyers, sellers and volatility', 'Q3 · Q4', 5.4],
  ['T03', 'Base and quote, notional value', 'Q5 · Q6', 7.6],
  ['T04', 'Order book, spread, account safety', 'Q7 · Q8', 9.4],
];
kit.scene('revisit', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    REV.forEach((r) => {
      rows += '<div class="glass rv-r" style="position:relative;display:flex;align-items:center;gap:30px;padding:14px 30px;width:1240px">' +
        '<span class="chip mono" style="font-size:30px;padding:10px 24px;background:var(--main);color:var(--ground);border-color:var(--main)">' + r[0] + '</span>' +
        '<span style="flex:1;font-size:32px;font-weight:600">' + r[1] + '</span><span class="mono rv-q" style="font-size:28px;color:var(--main)">' + r[2] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:160px;width:1400px"><p class="kick rv-k">Recap</p><h2 class="line rv-t">Where to revisit</h2><p class="sub rv-s">Missed one? Rewatch that lesson. No penalty.</p></div>' +
      '<div style="position:absolute;left:140px;top:400px;display:flex;flex-direction:column;gap:14px">' + rows + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.rv-k').style; this.t = q('.rv-t'); this.s = q('.rv-s');
    this.rows = [...kit.stage.querySelectorAll('.rv-r')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'checklist' }, { t: 11.2, pose: 'writing' }, { t: 15.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.rows.forEach((s, i) => {
      const a = REV[i][3], p = seg(t, a, a + 0.6), hi = Math.sin(Math.PI * seg(t, a + 0.4, a + 1.6));
      s.opacity = eo(seg(t, a, a + 0.3));
      s.transform = 'translateX(' + lerp(36, 0, eo(p)).toFixed(1) + 'px)';
      s.borderColor = 'color-mix(in srgb, var(--main) ' + (22 + 60 * hi).toFixed(0) + '%, transparent)';
    });
    TextFx.fadeFromRight(this.s, t, 11.2, { stagger: 0.08 });
    this.tutor.render(t);
  },
});
