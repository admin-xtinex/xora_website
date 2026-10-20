const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const REV = [
  ['T14', 'Candlesticks: OHLC', 'Q1', 3.8],
  ['T15', 'Timeframes', 'Q2', 5.4],
  ['T16 · T17', 'Trend, breakout, fakeout', 'Q3', 6.8],
  ['T18', 'Volume and range', 'Q4', 7.8],
  ['T19–T21', 'Scalping costs, NO_TRADE', 'Q5 · Q6', 8.2],
  ['T22 · T23', 'Sizing and the lifecycle', 'Q7 · Q8', 10.6],
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
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'checklist' }, { t: 8.2, pose: 'point' }, { t: 12.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 12.6, { stagger: 0.08 });
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
