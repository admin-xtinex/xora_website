const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The AI Insights page (mock): verdict, PRICE MAP, then the sections further down.
const IN_MAP = [['Resistance', '60,600', '+1.00%', 'var(--down)', 40], ['Price · entry', '60,000', '', 'var(--second)', 240], ['Support', '59,760', '−0.40%', 'var(--up)', 320], ['Stop', '59,700', '−0.50%', 'var(--down)', 340]];
const IN_SEC = [[0.4, 'Verdict'], [12.6, 'PRICE MAP'], [19.6, 'ENTRY CHECKLIST · TRADE MANAGEMENT · ENGINE STATUS']];
kit.scene('insights', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let map = '';
    IN_MAP.forEach((m, i) => {
      map += '<div class="in-r" style="display:flex;align-items:baseline;gap:12px;padding:7px 0"><span style="width:14px;height:14px;border-radius:50%;flex:none;background:' + m[3] + '"></span>' +
        '<span style="font-size:24px;flex:1">' + m[0] + '</span><span class="mono" style="font-size:26px">' + m[1] + '</span><span class="mono" style="width:96px;text-align:right;font-size:22px;color:' + m[3] + '">' + m[2] + '</span></div>';
    });
    const chip = (a, b) => '<div style="min-width:0;padding:6px 10px;border-radius:12px;border:1.5px solid color-mix(in srgb, var(--second) 14%, transparent)"><p class="lbl" style="margin:0;font-size:20px">' + a + '</p><p class="mono in-cv" style="margin:2px 0 0;font-size:24px">' + b + '</p></div>';
    const col = '<div class="in-col">' +
      '<div class="card in-v" style="margin-bottom:14px"><p class="card-h">VERDICT</p>' +
      '<p style="margin:4px 0 6px;font-size:26px;font-weight:700">BUY if price trades above 60,000</p><p class="lbl" style="margin:0;line-height:1.4">Plan for this candle only; every check runs again when it triggers.</p></div>' +
      '<div class="card in-m" style="margin-bottom:14px"><p class="card-h">PRICE MAP</p>' + map + '</div>' +
      '<div class="card in-ck" style="margin-bottom:14px"><p class="card-h">ENTRY CHECKLIST</p><span class="mono" style="font-size:24px;color:var(--up)">BUY 72% / 60% · READY</span></div>' +
      '<div class="card" style="margin-bottom:14px"><p class="card-h">TRADE MANAGEMENT</p><p style="margin:0;font-size:22px;line-height:1.4">Unrealised · trailing stop · max loss if stopped</p></div>' +
      '<div class="card"><p class="card-h">ENGINE STATUS</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
      chip('Mode', 'Basic') + chip('Auto approval', 'Off') + chip('Open trades', '1 / 2') + chip('Cooldown', '—') + chip('Today\'s P&L', '−0.12 USDT') + chip('Next check', '0:34') + '</div></div></div>';
    this.ph = UI.phone(kit, { left: 1120, top: 140, w: 580, h: 630, title: 'AI Insights', pill: '<span class="lbl in-rf">↻ 20 s</span>', body: '<div style="position:relative;height:520px;overflow:hidden">' + col + '</div>' }).style;
    this.ml = UI.mockLabel(kit, 1120, 100).style;
    kit.stage.append(kit.h('<div>' +
      '<div class="words" style="left:140px;top:180px;width:880px"><p class="kick in-k">Full AI insights</p><h2 class="line in-t">The detailed page</h2>' +
      '<p class="sub in-s" style="font-size:32px">Refreshes every 20 seconds.</p></div>' +
      '<div style="position:absolute;left:140px;top:470px;width:900px;display:flex;flex-direction:column;gap:18px">' +
      IN_SEC.map((s) => '<div class="in-i" style="display:flex;align-items:center;gap:18px"><span class="dot" style="width:16px;height:16px"></span><span style="font-size:32px;font-weight:700">' + s[1] + '</span></div>').join('') + '</div></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.in-k').style; this.t = q('.in-t'); this.s = q('.in-s'); this.col = q('.in-col').style;
    this.is = all('.in-i').map((e) => e.style); this.rs = all('.in-r').map((e) => e.style); this.v = q('.in-v').style; this.m = q('.in-m').style; this.rf = q('.in-rf');
    this.next = all('.in-cv')[5]; this.ck = q('.in-ck'); this.low = [...q('.in-col').children].slice(2).map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'laptop' }, { t: 6.4, pose: 'read' }, { t: 12.6, pose: 'pointer', flip: true }, { t: 19.6, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 1.0, { stagger: 0.07 });
    const p = seg(t, 0.4, 1.3);
    this.ph.opacity = eo(p); this.ph.transform = 'translateY(' + lerp(50, 0, eo(p)).toFixed(1) + 'px)';
    this.ml.opacity = 0.9 * eo(seg(t, 1.0, 1.6));
    this.is.forEach((s, i) => {
      const a = IN_SEC[i][0], end = i + 1 < IN_SEC.length ? IN_SEC[i + 1][0] : 99;
      UI.rise(kit, s, t, a + 0.3, 0.5, 16);
      s.opacity = (+s.opacity * (t >= a && t < end ? 1 : 0.45)).toFixed(3);
      s.color = t >= a && t < end ? 'var(--main)' : '';
    });
    const gv = Math.max(0, Math.sin(Math.PI * seg(t, 6.4, 12.4)));
    this.v.borderColor = 'color-mix(in srgb, var(--main) ' + (gv * 80).toFixed(0) + '%, transparent)';
    const gm = Math.max(0, Math.sin(Math.PI * seg(t, 12.6, 19.4)));
    this.m.borderColor = 'color-mix(in srgb, var(--main) ' + (gm * 80).toFixed(0) + '%, transparent)';
    this.rs.forEach((s, i) => { s.opacity = (0.35 + 0.65 * eo(seg(t, 13.4 + i * 0.9, 13.9 + i * 0.9))).toFixed(3); });
    // scroll down to the lower sections
    this.col.transform = 'translateY(' + (-(this.off || (this.off = this.ck.offsetTop)) * eio(seg(t, 19.8, 21.4))).toFixed(1) + 'px)';
    const off = (1 - eo(seg(t, 19.9, 20.9))).toFixed(3); this.v.opacity = off; this.m.opacity = off; this.low.forEach((e) => { e.opacity = eo(seg(t, 19.6, 20.4)).toFixed(3); });
    // refresh counter and next check countdown
    UI.set(this.rf, '↻ ' + (20 - Math.floor(t % 20)) + ' s');
    const nc = Math.max(0, 34 - Math.floor(Math.max(0, t - 19.6)));
    UI.set(this.next, '0:' + String(nc).padStart(2, '0'));
    this.tutor.render(t);
  },
});
