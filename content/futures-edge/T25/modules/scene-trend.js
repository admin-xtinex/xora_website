const { seg, eo, ei, eob, eio, lerp } = kit;
const TR_SW = [[8, 'L', 59900, 1.6], [11, 'H', 60100, 2.4], [13, 'L', 60040, 3.2], [17, 'H', 60250, 4.0]];
kit.scene('trend', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ch = UI.chart(kit, 'tr', {});
    const D = UI.D;
    let ov = '';
    TR_SW.forEach((s) => {
      const x = D.x(s[0]), y = s[1] === 'H' ? D.y(s[2]) - 22 : D.y(s[2]) + 22, ty = s[1] === 'H' ? y - 18 : y + 38;
      ov += '<g class="tr-m"><circle cx="' + x + '" cy="' + y.toFixed(1) + '" r="10" style="fill:' + (s[1] === 'H' ? 'var(--accent)' : 'var(--main)') + '"/><text x="' + x + '" y="' + ty.toFixed(1) + '" text-anchor="middle" class="mono" style="fill:var(--second);font-size:22px">' + UI.fmt(s[2]) + '</text></g>';
    });
    const ar = (a, b, col, lab) => {
      const x1 = D.x(a[0]), x2 = D.x(b[0]), y1 = a[1] === 'H' ? D.y(a[2]) - 22 : D.y(a[2]) + 22, y2 = b[1] === 'H' ? D.y(b[2]) - 22 : D.y(b[2]) + 22;
      return '<g class="tr-a"><line x1="' + x1 + '" y1="' + y1.toFixed(1) + '" x2="' + x2 + '" y2="' + y2.toFixed(1) + '" pathLength="1" stroke-width="4" stroke-dasharray="1 1" style="stroke:' + col + '"/></g>';
    };
    ov += ar(TR_SW[1], TR_SW[3], 'var(--accent)') + ar(TR_SW[0], TR_SW[2], 'var(--main)');
    this.ch.ov.innerHTML = ov;
    const tf = (k, v, c) => '<div class="tr-t" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span class="mono" style="font-size:28px">' + k + '</span><span style="font-size:30px;font-weight:700;color:' + c + '">' + v + '</span></div>';
    kit.stage.append(kit.h('<div>' +
      '<div class="glass tr-r" style="left:1230px;top:290px;width:460px;padding:20px 30px"><p class="kick" style="margin:0 0 6px">The rule</p>' +
      '<p style="margin:0;font-size:28px;line-height:1.45;font-weight:600"><b class="up">UP</b>: higher high + higher low<br><b class="dn">DOWN</b>: lower high + lower low<br><b style="color:#ffb547">RANGE</b>: anything else</p></div>' +
      '<div class="glass tr-f" style="left:1230px;top:530px;width:460px;padding:14px 30px"><p class="kick" style="margin:0 0 2px">Trend · fictional</p>' + tf('1m', '▲ Up', 'var(--up)') + tf('5m', '▲ Up', 'var(--up)') + tf('15m', 'Range', '#ffb547') + '</div></div>'));
    this.head = UI.head(kit, 'Step 2 · swings and trend', 'Which way is it going?');
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.ms = all('.tr-m').map((e) => e.style); this.as = all('.tr-a line');
    this.r = kit.stage.querySelector('.tr-r').style; this.f = kit.stage.querySelector('.tr-f').style; this.ts = all('.tr-t').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'pointer' }, { t: 7.8, pose: 'magnify' }, { t: 15.4, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ch.render(t);
    this.ms.forEach((s, i) => { const a = TR_SW[i][3], p = seg(t, a, a + 0.4); s.opacity = eo(p); });
    this.as.forEach((l, i) => l.setAttribute('stroke-dasharray', eio(seg(t, 9.6 + i * 2.2, 10.6 + i * 2.2)) + ' 1'));
    UI.rise(kit, this.r, t, 12.6, 0.6, 20);
    UI.rise(kit, this.f, t, 16.2, 0.6, 20);
    this.ts.forEach((s, i) => UI.rise(kit, s, t, 18.6 + i * 0.8, 0.4, 10));
    this.tutor.render(t);
  },
});
