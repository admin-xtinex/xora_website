const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A phone mock: one coin, the verdict cycles through the three answers XORA can give.
const HK_V = [
  ['BUY', 'var(--up)', 'BUY if price trades above 60,120'],
  ['SHORT', 'var(--down)', 'SHORT if price trades below 59,880'],
  ['NO TRADE', 'var(--main)', 'No setup right now'],
];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:220px;width:860px"><p class="kick hk-k">From analysis to decision</p>' +
      '<h2 class="line hk-t">Three possible answers</h2>' +
      '<p class="sub hk-s">For each coin, XORA\'s engine says BUY, SELL / SHORT, or NO TRADE.</p>' +
      '<div><span class="chip hk-c"><span class="dot"></span>Rule-based checks · not a prediction</span></div></div></div>'));
    let slots = '';
    HK_V.forEach((v) => {
      slots += '<div class="hk-v" style="position:absolute;left:0;top:0;right:0;display:flex;flex-direction:column;gap:12px">' +
        '<span class="pill" style="align-self:flex-start;color:' + v[1] + ';font-size:28px;padding:8px 22px">' + v[0] + '</span>' +
        '<span style="font-size:26px;font-weight:600">' + v[2] + '</span></div>';
    });
    const body = '<div class="card" style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:30px">BTC/USDT</b><span class="mono hk-p" style="font-size:30px">60,000.0</span></div>' +
      '<svg width="440" height="130" viewBox="0 20 440 130" style="display:block;margin-top:8px"><path class="hk-l" fill="none" stroke-width="4" stroke-linejoin="round" style="stroke:var(--main)"/></svg>' +
      '<span class="lbl">PRICE ACTION · 1M</span></div>' +
      '<div class="card" style="height:180px"><p class="card-h">XORA VERDICT</p><div style="position:relative;height:120px">' + slots + '</div></div>' +
      '<div style="display:flex;gap:14px;margin-top:22px"><div class="mono" style="flex:1;height:68px;border-radius:18px;display:grid;place-items:center;font-size:24px;font-weight:600;color:var(--ground);background:var(--up)">BUY / LONG</div>' +
      '<div class="mono" style="flex:1;height:68px;border-radius:18px;display:grid;place-items:center;font-size:24px;font-weight:600;color:var(--ground);background:var(--down)">SHORT / SELL</div></div>';
    this.ph = UI.phone(kit, { left: 1110, top: 140, w: 540, h: 630, title: 'Signals', body }).style;
    this.ml = UI.mockLabel(kit, 1110, 100).style;
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.s = q('.hk-s'); this.c = q('.hk-c').style;
    this.pr = q('.hk-p'); this.l = q('.hk-l');
    this.vs = [...kit.stage.querySelectorAll('.hk-v')].map((e) => e.style);
    const r = kit.rng(26); this.pts = []; let v = 0;
    for (let i = 0; i < 60; i++) { v += (r() - 0.5) * 18; v *= 0.9; this.pts.push(85 + v + Math.sin(i / 6) * 22); }
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.8, pose: 'think' }, { t: 6.4, pose: 'point', flip: true }, { t: 12.2, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 6.4, { stagger: 0.06 });
    const cp = seg(t, 12.4, 13.0);
    this.c.opacity = eo(cp); this.c.transform = 'scale(' + lerp(0.85, 1, eob(cp, 1.6)).toFixed(3) + ')'; this.c.transformOrigin = '0 50%';
    const p = seg(t, 0.4, 1.3);
    this.ph.opacity = eo(p); this.ph.transform = 'translateY(' + (lerp(50, 0, eo(p)) - t * 1.2).toFixed(1) + 'px)';
    this.ml.opacity = 0.9 * eo(seg(t, 1.0, 1.6));
    const n = Math.max(2, Math.min(60, Math.floor(10 + t * 3.4)));
    this.l.setAttribute('d', this.pts.slice(0, n).map((y, i) => (i ? 'L' : 'M') + (i * 440 / 59).toFixed(1) + ' ' + y.toFixed(1)).join(' '));
    UI.set(this.pr, UI.fmt(60000 + (85 - this.pts[n - 1]) * 6, 1));
    // verdict: BUY, then SHORT, then NO TRADE, then all three flick by again
    const at = [2.0, 7.4, 10.0];
    let cur = t < 13.2 ? (t < at[1] ? 0 : t < at[2] ? 1 : 2) : Math.floor((t - 13.2) / 0.9) % 3;
    if (t < at[0]) cur = -1;
    this.vs.forEach((s, i) => {
      const on = i === cur ? 1 : 0;
      s.opacity = on;
      s.transform = 'translateY(' + (on ? 0 : 12) + 'px)';
    });
    this.tutor.render(t);
  },
});
