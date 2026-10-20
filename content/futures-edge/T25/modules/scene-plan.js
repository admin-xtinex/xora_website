const { seg, eo, ei, eob, eio, lerp } = kit;
kit.scene('plan', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ch = UI.chart(kit, 'pl', {});
    const D = UI.D, x23 = D.x(23);
    this.ch.under.innerHTML = UI.band(60000, 60060, 'var(--up)') + UI.band(60480, 60530, 'var(--down)');
    const lab = (cls, p, col, txt, x) => '<g class="' + cls + '"><text x="' + (x || 220) + '" y="' + (D.y(p) - 10).toFixed(1) + '" class="mono" style="fill:' + col + ';font-size:23px">' + txt + '</text></g>';
    this.ch.ov.innerHTML = '<rect class="pl-sc" x="' + (x23 - 22) + '" y="' + (D.y(60120) - 12).toFixed(1) + '" width="44" height="' + (D.y(60020) - D.y(60120) + 24).toFixed(1) + '" rx="8" fill="none" stroke-width="3" style="stroke:var(--second)"/>' +
      '<g class="pl-tl">' + UI.hline(60120, 'var(--main)', '10 7') + '</g>' + lab('pl-tt', 60120, 'var(--main)', 'TRIGGER 60,120', 170) +
      '<g class="pl-sl">' + UI.hline(59940, 'var(--down)', '10 7') + '</g>' + lab('pl-st', 59940, 'var(--down)', 'STOP 59,940', 170) +
      '<g class="pl-nl">' + UI.hline(60480, '#ffb547', '10 7') + '</g>' + lab('pl-nt', 60480, '#ffb547', 'NEXT RES. 60,480', 820) +
      '<g class="pl-br"><line x1="1076" x2="1076" y1="' + D.y(60120).toFixed(1) + '" y2="' + D.y(59940).toFixed(1) + '" stroke-width="6" style="stroke:var(--down)"/><line x1="1076" x2="1076" y1="' + D.y(60480).toFixed(1) + '" y2="' + D.y(60120).toFixed(1) + '" stroke-width="6" style="stroke:var(--up)"/></g>';
    const row = (cls, k, v, c) => '<div class="row ' + cls + '" style="padding:9px 0"><span style="font-size:26px">' + k + '</span><span class="mono" style="font-size:30px' + (c ? ';color:' + c : '') + '">' + v + '</span></div>';
    kit.stage.append(kit.h('<div class="glass pl-p" style="left:1230px;top:290px;width:470px;padding:18px 28px"><p class="kick" style="margin:0 0 4px">Trade plan · fictional</p>' +
      '<p class="pl-v" style="margin:6px 0;font-size:28px;font-weight:700;color:var(--up)">BUY if price trades above 60,120</p>' +
      row('pl-r1', 'Entry (trigger)', '60,120') + row('pl-r2', 'Stop', '59,940', 'var(--down)') + row('pl-r3', 'Risk', '180 · 0.30%', 'var(--down)') + row('pl-r4', 'Next res.', '60,480 · 2.0 R', 'var(--up)') +
      '<p class="fict pl-f" style="margin:10px 0 0;letter-spacing:.06em;text-transform:none;font-size:20px;line-height:1.4">Plan for this candle only; every check runs again when it triggers</p></div>'));
    this.head = UI.head(kit, 'Step 6 · the plan', 'A plan for one candle');
    const q = (s) => kit.stage.querySelector(s);
    this.sc = q('.pl-sc').style;
    this.tl = q('.pl-tl line'); this.tt = q('.pl-tt').style; this.sl = q('.pl-sl line'); this.st = q('.pl-st').style; this.nl = q('.pl-nl line'); this.nt = q('.pl-nt').style; this.br = q('.pl-br').style;
    this.p = q('.pl-p').style; this.v = q('.pl-v').style; this.rs = [1, 2, 3, 4].map((i) => q('.pl-r' + i).style); this.f = q('.pl-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'magnify' }, { t: 6.7, pose: 'point', flip: true }, { t: 13.9, pose: 'think' }, { t: 20.6, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ch.render(t, (i) => (i === 23 ? 1 : lerp(1, 0.55, eo(seg(t, 1.0, 1.6)))));
    this.sc.opacity = eo(seg(t, 1.6, 2.1)) * (0.7 + 0.3 * Math.sin(t * 4));
    this.tl.style.opacity = eo(seg(t, 8.0, 8.6)); this.tt.opacity = eo(seg(t, 8.4, 8.9));
    this.sl.setAttribute('stroke-dasharray', '10 7'); this.sl.style.opacity = eo(seg(t, 14.4, 15.0)); this.st.opacity = eo(seg(t, 14.8, 15.3));
    this.nl.setAttribute('stroke-dasharray', '10 7'); this.nl.style.opacity = eo(seg(t, 21.0, 21.6)); this.nt.opacity = eo(seg(t, 21.4, 21.9));
    this.tl.setAttribute('stroke-dasharray', '10 7');
    this.br.opacity = eo(seg(t, 22.4, 23.0));
    UI.rise(kit, this.p, t, 7.0, 0.6, 20);
    this.v.opacity = eo(seg(t, 7.6, 8.1));
    const at = [9.0, 15.2, 16.6, 22.2];
    this.rs.forEach((s, i) => UI.rise(kit, s, t, at[i], 0.5, 10));
    this.f.opacity = eo(seg(t, 24.0, 24.6));
    this.tutor.render(t);
  },
});
