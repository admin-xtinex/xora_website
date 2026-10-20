const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Same chart, same numbers: a second learner writes their doubts and chooses NO_TRADE before knowing the outcome.
const NT_WHY = 'Support tested twice. Weak volume on the bounce. Not confident.';
const NT_B = [['DEMO BUY', 'var(--up)'], ['DEMO SELL', 'var(--down)'], ['NO_TRADE', 'var(--main)']];
kit.scene('notrade', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'The other route', 'NO_TRADE can be a success');
    this.c1 = UI.chart1(kit, 'nt', { vol: true });
    const D = UI.D, Y = D.y1, x0 = D.x1(14) + 14, y0 = Y(60000);
    const fork = (p, c) => '<path class="nt-f" d="M' + x0 + ' ' + y0.toFixed(1) + ' C' + (x0 + 110) + ' ' + y0.toFixed(1) + ' ' + (x0 + 150) + ' ' + Y(p).toFixed(1) + ' 990 ' + Y(p).toFixed(1) + '" pathLength="1" fill="none" stroke-width="4" stroke-linecap="round" style="stroke:' + c + '"/>';
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="nt-sp">' + UI.band(59850, 59950, 'var(--main)', 160, 1040) + '</g>' +
      '<rect class="nt-vb" x="' + (D.x1(12) - 18) + '" y="724" width="' + (D.x1(14) - D.x1(12) + 36) + '" height="48" rx="8" fill="none" stroke-width="3" style="stroke:var(--accent)"/>' +
      fork(60450, 'var(--up)') + fork(59650, 'var(--down)') +
      '<g class="nt-q"><circle cx="1000" cy="' + y0.toFixed(1) + '" r="30" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main);stroke-width:2"/><text x="1000" y="' + (y0 + 13).toFixed(1) + '" text-anchor="middle" class="mono" style="font-size:38px;fill:var(--second)">?</text></g>' +
      '<circle cx="' + x0 + '" cy="' + y0.toFixed(1) + '" r="10" style="fill:var(--second)"/></svg>');
    kit.stage.append(svg);
    const tag = (s, x, y, c) => { const e = kit.h('<p class="tag" style="left:' + x + 'px;top:' + y.toFixed(0) + 'px;border-color:' + c + '">' + s + '</p>'); kit.stage.append(e); return e.style; };
    this.tD = tag('Decision point · 60,000', 640, y0 - 60, 'var(--second)');
    this.tV = tag('Weak volume on the bounce', 240, 668, 'var(--accent)');
    this.tU = tag('Future unknown at decision time', 200, 306, 'var(--main)');
    let btns = '';
    NT_B.forEach((b) => { btns += '<div class="nt-b mono" style="flex:1;height:60px;border-radius:16px;display:grid;place-items:center;font-size:24px;border:2px solid ' + b[1] + ';color:' + b[1] + '">' + b[0] + '</div>'; });
    const row = (a, b) => '<div class="row nt-r" style="padding:9px 0"><span>' + a + '</span><span class="mono" style="font-size:30px">' + b + '</span></div>';
    kit.stage.append(kit.h('<div><div class="glass nt-p" style="left:1180px;top:286px;width:600px;padding:20px 30px;display:flex;flex-direction:column;gap:12px">' +
      '<p class="kick" style="margin:0">Learner 2 · notes</p><div style="min-height:114px"><span class="nt-x" style="font-size:28px;line-height:1.38;font-weight:600"></span></div>' +
      '<div style="display:flex;gap:12px">' + btns + '</div><div>' + row('Result', '0 USDT · no fees') + row('Demo balance', '1,000 USDT') +
      '<div class="row nt-r" style="padding:9px 0;border:0"><span>Process</span><span class="mono" style="font-size:30px;color:var(--main)">complete ✓</span></div></div></div>' +
      '<div class="nt-st" style="position:absolute;left:700px;top:350px;padding:12px 26px;border-radius:16px;border:3px solid var(--main);background:color-mix(in srgb, var(--ground) 70%, var(--main));font-family:var(--display, var(--sans));font-size:38px;font-weight:700;color:var(--main)">Success ✓</div></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.sp = svg.querySelector('.nt-sp').style; this.vb = svg.querySelector('.nt-vb').style; this.fs = [...svg.querySelectorAll('.nt-f')]; this.qm = svg.querySelector('.nt-q').style;
    this.p = q('.nt-p').style; this.x = q('.nt-x'); this.bs = all('.nt-b').map((e) => e.style); this.rs = all('.nt-r').map((e) => e.style); this.st = q('.nt-st').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 6.8, pose: 'writing' }, { t: 13.8, pose: 'celebrate' }, { t: 20.3, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.c1.render(t);
    this.sp.opacity = eo(seg(t, 0.6, 1.2));
    UI.rise(kit, this.tD, t, 1.4, 0.5, 12, 20.0, 20.5);
    UI.rise(kit, this.p, t, 0.8, 0.6, 24);
    UI.type(this.x, NT_WHY, t, 7.2, 16);
    this.vb.opacity = eo(seg(t, 8.6, 9.1)); UI.rise(kit, this.tV, t, 8.8, 0.5, 12);
    this.bs.forEach((s, i) => {
      const pick = i === 2 ? eo(seg(t, 11.6, 12.0)) : 0, press = i === 2 ? Math.sin(Math.PI * seg(t, 11.4, 11.8)) : 0;
      s.background = 'color-mix(in srgb, ' + NT_B[i][1] + ' ' + (10 + 85 * pick).toFixed(0) + '%, var(--ground))';
      s.color = pick > 0.5 ? 'var(--ground)' : NT_B[i][1];
      s.transform = 'scale(' + (1 - 0.06 * press).toFixed(4) + ')';
      s.opacity = i === 2 ? 1 : lerp(1, 0.45, eo(seg(t, 11.6, 12.2)));
    });
    this.rs.forEach((s, i) => { const p = seg(t, 14.0 + i * 0.9, 14.4 + i * 0.9); s.opacity = eo(p).toFixed(3); s.transform = 'translateX(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)'; });
    const sp = seg(t, 17.0, 17.5);
    this.st.opacity = eo(sp) * (1 - ei(seg(t, 20.0, 20.4))); this.st.transform = 'rotate(-4deg) scale(' + lerp(1.6, 1, eob(sp, 1.4)).toFixed(3) + ')';
    this.fs.forEach((f, i) => { const a = 20.6 + i * 0.4; f.setAttribute('stroke-dasharray', eio(seg(t, a, a + 1.0)).toFixed(3) + ' 1'); f.style.opacity = seg(t, a, a + 0.1) > 0 ? 0.8 : 0; });
    const qp = seg(t, 21.8, 22.3);
    this.qm.opacity = eo(qp);
    UI.rise(kit, this.tU, t, 21.4, 0.5, 12);
    this.tutor.render(t);
  },
});
