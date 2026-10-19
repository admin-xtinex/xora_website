const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const REV = [
  ['T04', 'Account safety', 'Q1', 3.8],
  ['T05 · T11', 'Spot vs futures', 'Q2', 5.2],
  ['T06 · T09', 'Gross, fees and net', 'Q3', 6.4],
  ['T07 · T08', 'Stops and slippage', 'Q4', 7.6],
  ['T12', 'Margin and leverage', 'Q5 · Q6', 9.6],
  ['T13', 'Liquidation and funding', 'Q7 · Q8', 11.0],
];
kit.scene('revisit', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    REV.forEach((r, i) => {
      rows += '<div class="glass rv-r" style="left:' + (140 + (i % 2) * 830) + 'px;top:' + (390 + Math.floor(i / 2) * 106) + 'px;width:800px;height:90px;display:flex;align-items:center;gap:24px;padding:0 26px">' +
        '<span class="chip mono" style="font-size:26px;padding:8px 20px;background:var(--main);color:var(--ground);border-color:var(--main)">' + r[0] + '</span>' +
        '<span style="flex:1;font-size:30px;font-weight:600;white-space:nowrap">' + r[1] + '</span><span class="mono" style="font-size:26px;color:var(--main)">' + r[2] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick rv-k">Recap</p><h2 class="line rv-t">Where to revisit</h2><p class="sub rv-s">Missed one? Rewatch that lesson. No penalty.</p></div>' +
      rows + '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.rv-k').style; this.t = q('.rv-t'); this.s = q('.rv-s');
    this.rows = [...kit.stage.querySelectorAll('.rv-r')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'checklist' }, { t: 9.6, pose: 'point' }, { t: 13.2, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 13.2, { stagger: 0.08 });
    this.rows.forEach((s, i) => {
      const a = REV[i][3], p = seg(t, a, a + 0.6), hi = Math.sin(Math.PI * seg(t, a + 0.4, a + 1.6));
      s.opacity = eo(seg(t, a, a + 0.3));
      s.transform = 'translateX(' + lerp(36, 0, eo(p)).toFixed(1) + 'px)';
      s.borderColor = 'color-mix(in srgb, var(--main) ' + (22 + 60 * hi).toFixed(0) + '%, transparent)';
      if (i >= 4) s.background = 'color-mix(in srgb, var(--ground) 82%, var(--accent))';
    });
    this.tutor.render(t);
  },
});
