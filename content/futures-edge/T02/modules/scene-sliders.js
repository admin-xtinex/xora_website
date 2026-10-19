const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Slider keys [t, buyers %, sellers %]: each reached over 1 s.
const SL_KEYS = [[0, 50, 50], [8.2, 80, 30], [13.0, 35, 85], [16.6, 60, 60]];
const slAt = (t) => {
  let b = SL_KEYS[0][1], s = SL_KEYS[0][2];
  for (let i = 1; i < SL_KEYS.length; i++) { const k = SL_KEYS[i], p = eio(seg(t, k[0] - 1, k[0])); if (p > 0) { b = lerp(SL_KEYS[i - 1][1], k[1], p); s = lerp(SL_KEYS[i - 1][2], k[2], p); } }
  return [b, s];
};
const SL_DT = 0.05, SL_P = (() => {
  // Illustrative model: the price drifts by 2 USDT per second for each point the buyers lead by, plus a small wobble.
  const out = [60000]; let p = 60000;
  for (let i = 1; i * SL_DT <= 24; i++) { const [b, s] = slAt(i * SL_DT); p += 2 * (b - s) * SL_DT; out.push(p); }
  return out;
})();
const slPrice = (t) => {
  const i = Math.max(0, Math.min(SL_P.length - 2, Math.floor(t / SL_DT))), f = Math.max(0, Math.min(1, t / SL_DT - i));
  return lerp(SL_P[i], SL_P[i + 1], f) + Math.sin(t * 4.1) * 22 + Math.sin(t * 9.3 + 1) * 12;
};
const SL_LO = 59700, SL_HI = 60700, SL_X0 = 1040, SL_X1 = 1600, SL_Y0 = 400, SL_Y1 = 740, SL_T0 = 0.6, SL_T1 = 22.6;
const slX = (t) => SL_X0 + (Math.min(Math.max(t, SL_T0), SL_T1) - SL_T0) / (SL_T1 - SL_T0) * (SL_X1 - SL_X0);
const slY = (p) => SL_Y1 - (p - SL_LO) / (SL_HI - SL_LO) * (SL_Y1 - SL_Y0);
kit.scene('sliders', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const slider = (cls, label, col) => '<div style="display:flex;flex-direction:column;gap:14px"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:30px;font-weight:700;color:' + col + '">' + label + '</span><span class="mono ' + cls + '-v" style="font-size:30px"></span></div>' +
      '<div style="position:relative;height:16px;border-radius:8px;background:color-mix(in srgb, var(--second) 12%, transparent)"><div class="' + cls + '-f" style="position:absolute;left:0;top:0;bottom:0;border-radius:8px;background:' + col + '"></div>' +
      '<div class="' + cls + '-k" style="position:absolute;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:var(--second);box-shadow:0 0 0 6px color-mix(in srgb, ' + col + ' 45%, transparent)"></div></div></div>';
    let grid = '';
    for (let p = 59800; p <= 60600; p += 200) grid += '<line x1="' + SL_X0 + '" x2="' + SL_X1 + '" y1="' + slY(p) + '" y2="' + slY(p) + '" style="stroke:color-mix(in srgb, var(--second) 8%, transparent);stroke-width:1.5"/><text x="' + (SL_X1 + 20) + '" y="' + (slY(p) + 8) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 50%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass sl-chart" style="left:1000px;top:180px;width:780px;height:600px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="sl-g">' + grid +
      '<path class="sl-l" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="sl-d" r="10" style="fill:var(--second)"/></g></svg>' +
      '<div class="sl-head" style="position:absolute;left:1040px;top:210px;width:700px"><p class="fict" style="margin:0">Model price · BTC/USDT</p>' +
      '<div style="display:flex;align-items:center;gap:24px;margin-top:6px"><span class="mono sl-p" style="font-size:56px"></span><span class="chip sl-dir" style="font-size:26px;padding:10px 22px"></span></div></div>' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick sl-k">Watch the model</p>' +
      '<h2 class="line sl-t">Buyer and seller strength</h2></div>' +
      '<div class="glass sl-box" style="left:140px;top:450px;width:780px;padding:30px 36px;display:flex;flex-direction:column;gap:34px">' +
      slider('sl-b', 'Buyer strength', 'var(--main)') + slider('sl-s', 'Seller strength', 'var(--accent)') + '</div>' +
      '<p class="sl-w" style="position:absolute;left:140px;top:722px;margin:0;font-size:24px;font-weight:700;color:var(--accent)">Illustrative model · not a prediction of real markets</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sl-k').style; this.t = q('.sl-t'); this.box = q('.sl-box').style; this.w = q('.sl-w').style;
    this.chart = q('.sl-chart').style; this.g = q('.sl-g').style; this.head = q('.sl-head').style;
    this.l = q('.sl-l'); this.d = q('.sl-d'); this.p = q('.sl-p'); this.dir = q('.sl-dir');
    this.bv = q('.sl-b-v'); this.bf = q('.sl-b-f').style; this.bk = q('.sl-b-k').style;
    this.sv = q('.sl-s-v'); this.sf = q('.sl-s-f').style; this.sk = q('.sl-s-k').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 7.2, pose: 'point', flip: true }, { t: 12.0, pose: 'magnify' }, { t: 15.6, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const bx = seg(t, 0.6, 1.3), cp = seg(t, 0.4, 1.1);
    this.box.opacity = eo(bx); this.box.transform = 'translateY(' + lerp(30, 0, eo(bx)) + 'px)';
    this.w.opacity = eo(seg(t, 2.0, 2.6));
    for (const s of [this.chart, this.g, this.head]) s.opacity = eo(cp);
    const [b, s] = slAt(t);
    UI.set(this.bv, Math.round(b) + '%'); UI.set(this.sv, Math.round(s) + '%');
    this.bf.width = b + '%'; this.bk.left = b + '%'; this.sf.width = s + '%'; this.sk.left = s + '%';
    let d = '';
    const end = Math.min(Math.max(t, SL_T0), SL_T1);
    for (let x = SL_T0; x <= end + 1e-6; x += 0.1) d += (x > SL_T0 ? 'L' : 'M') + slX(x).toFixed(1) + ' ' + slY(slPrice(x)).toFixed(1);
    this.l.setAttribute('d', d || 'M' + SL_X0 + ' ' + slY(60000));
    this.d.setAttribute('cx', slX(end).toFixed(1)); this.d.setAttribute('cy', slY(slPrice(end)).toFixed(1));
    UI.set(this.p, UI.fmt(Math.round(slPrice(end))));
    const lead = b - s, txt = lead > 10 ? '▲ Drifting up' : lead < -10 ? '▼ Drifting down' : '◆ Sideways';
    UI.set(this.dir, txt);
    this.dir.style.color = lead > 10 ? 'var(--main)' : lead < -10 ? 'var(--accent)' : 'var(--second)';
    this.tutor.render(t);
  },
});
