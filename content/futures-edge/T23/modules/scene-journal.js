const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The journal fills in; the process score ticks to 8 of 8 while the outcome stays negative.
const JR = [['Setup', 'Bounce at support, 5m uptrend', 1.2], ['Decision', 'DEMO BUY at 60,000 · reason ✓', 2.0], ['Plan', 'Stop 59,700 · target 60,600 · 1,000 USDT', 2.8], ['Exit', 'Stop hit · filled 59,680 (20 slippage)', 3.6],
  ['Result', '', 7.4], ['Followed plan?', 'Yes: size, stop and exit as written', 13.2], ['Learned', 'Support can break. Stops can slip.', 20.0]];
kit.scene('journal', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Step 8 of 8 · Journal and review', 'Write it down');
    this.track = UI.track(kit, 8);
    let rows = '';
    JR.forEach((r, i) => {
      rows += '<div class="jr-r" style="display:flex;align-items:baseline;gap:20px;padding:9px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)">' +
        '<span style="flex:none;width:210px;font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + r[0] + '</span>' +
        (i === 4 ? '<span class="mono" style="font-size:28px"><span class="jr-g dn">−0.00</span> price · <span class="jr-f dn">−0.00</span> fees · <b class="jr-n dn">−0.00</b> net</span>'
          : '<span style="font-size:28px;font-weight:600' + (i === 5 ? ';color:var(--main)' : '') + '">' + r[1] + '</span>') + '</div>';
    });
    let pills = '';
    UI.STEPS.forEach((s, i) => {
      pills += '<div class="jr-s" style="display:flex;align-items:center;gap:14px;height:50px"><svg width="40" height="40" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>' +
        '<path class="jr-k" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg><span style="font-size:27px;font-weight:600">' + (i + 1) + ' ' + s + '</span></div>';
    });
    kit.stage.append(kit.h('<div>' +
      '<div class="glass jr-c" style="left:140px;top:286px;width:980px;padding:18px 34px"><p class="kick" style="margin:0 0 4px">Trade journal · demo · fictional · USDT</p>' + rows + '</div>' +
      '<div class="glass jr-p" style="left:1180px;top:286px;width:600px;padding:18px 30px"><div style="display:flex;align-items:baseline;justify-content:space-between"><p class="kick" style="margin:0">Process score</p><span class="mono jr-sc" style="font-size:56px;color:var(--main)">0 / 8</span></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;column-gap:16px;margin-top:4px">' + pills + '</div>' +
      '<div class="jr-o" style="margin-top:12px;padding-top:12px;border-top:1.5px solid color-mix(in srgb, var(--second) 14%, transparent)"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:27px">Outcome</span><span class="mono dn" style="font-size:32px">−6.33 USDT</span></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6px"><span style="font-size:27px">Demo balance</span><span class="mono" style="font-size:32px">993.67 USDT</span></div></div></div></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.c = q('.jr-c').style; this.p = q('.jr-p').style; this.rows = all('.jr-r').map((e) => e.style);
    this.g = q('.jr-g'); this.f = q('.jr-f'); this.n = q('.jr-n'); this.sc = q('.jr-sc'); this.ks = all('.jr-k'); this.ss = all('.jr-s').map((e) => e.style); this.o = q('.jr-o').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'writing' }, { t: 7.2, pose: 'read' }, { t: 13.0, pose: 'checklist' }, { t: 19.8, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t); this.track(t);
    UI.rise(kit, this.c, t, 0.6, 0.6, 24); UI.rise(kit, this.p, t, 1.0, 0.6, 24);
    JR.forEach((r, i) => { const p = seg(t, r[2], r[2] + 0.4); this.rows[i].opacity = eo(p).toFixed(3); this.rows[i].transform = 'translateX(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)'; });
    const c1 = eo(seg(t, 7.6, 8.6)), c2 = eo(seg(t, 9.0, 9.8)), c3 = eo(seg(t, 10.4, 11.2));
    UI.set(this.g, UI.sgn(-5.33 * c1, 2)); UI.set(this.f, UI.sgn(-1.0 * c2, 2)); UI.set(this.n, UI.sgn(-6.33 * c3, 2));
    let n = 0;
    this.ks.forEach((k, i) => { const a = 13.6 + i * 0.4, p = seg(t, a, a + 0.35); k.setAttribute('stroke-dasharray', eo(p).toFixed(3) + ' 1'); if (p >= 1) n++; this.ss[i].opacity = lerp(0.5, 1, eo(p)).toFixed(3); });
    UI.set(this.sc, n + ' / 8');
    this.o.opacity = eo(seg(t, 19.8, 20.4)).toFixed(3);
    this.tutor.render(t);
  },
});
