const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Three possible futures, then the replay: eight 1-minute candles form live; the stop triggers and fills at 59,680.
const MN_A = 11.4, MN_D = 1.6, MN_FILL = 59680;
// Live price inside candle i at u in [0,1]: open → first extreme → other extreme → close.
const mnPts = (c) => (c[3] >= c[0] ? [c[0], c[2], c[1], c[3]] : [c[0], c[1], c[2], c[3]]);
const MN_U = [0, 0.3, 0.7, 1];
function mnAt(c, u) {
  const P = mnPts(c); let price = P[0], hi = c[0], lo = c[0];
  for (let k = 1; k < 4; k++) {
    const f = kit.clamp01((u - MN_U[k - 1]) / (MN_U[k] - MN_U[k - 1]));
    if (f <= 0) break;
    price = kit.lerp(P[k - 1], P[k], kit.eio(f));
    hi = Math.max(hi, f >= 1 ? P[k] : price, P[k - 1]); lo = Math.min(lo, f >= 1 ? P[k] : price, P[k - 1]);
  }
  return { price, hi, lo };
}
// When the live price first touches the 59,700 stop in the last candle.
let MN_TS = MN_A + 7 * MN_D + MN_D;
for (let u = 0; u <= 1; u += 0.001) { if (mnAt(UI.D.C1[22], u).price <= 59700) { MN_TS = MN_A + 7 * MN_D + u * MN_D; break; } }
kit.scene('monitor', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Step 7 of 8 · Monitor and exit', 'Follow the plan');
    this.track = UI.track(kit, 7);
    this.c1 = UI.chart1(kit, 'mn', { cap: 23 });
    const D = UI.D, Y = D.y1, x0 = D.x1(14) + 14, y0 = Y(60000);
    const br = (p, c, dash) => '<path class="mn-br" d="M' + x0 + ' ' + y0.toFixed(1) + ' C' + (x0 + 100) + ' ' + y0.toFixed(1) + ' ' + (x0 + 140) + ' ' + Y(p).toFixed(1) + ' 1000 ' + Y(p).toFixed(1) + '" pathLength="1" fill="none" stroke-width="4" stroke-linecap="round" style="stroke:' + c + '"/>';
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="mn-l">' + UI.hline(60000, 'color-mix(in srgb, var(--second) 55%, transparent)') + UI.hline(59700, 'var(--accent)', '12 8') + UI.hline(60600, 'var(--main)', '12 8') + '</g>' +
      '<g class="mn-bg">' + br(60600, 'var(--up)') + br(60050, 'var(--second)') + br(59700, 'var(--down)') + '</g>' +
      '<g class="mn-fill"><circle cx="' + D.x1(22) + '" cy="' + Y(MN_FILL).toFixed(1) + '" r="12" style="fill:var(--accent)"/><circle class="mn-fr" cx="' + D.x1(22) + '" cy="' + Y(MN_FILL).toFixed(1) + '" r="12" fill="none" stroke-width="3" style="stroke:var(--accent)"/></g></svg>');
    kit.stage.append(svg);
    const tag = (s, x, y, c) => { const e = kit.h('<p class="tag" style="left:' + x + 'px;top:' + y.toFixed(0) + 'px;border-color:' + c + '">' + s + '</p>'); kit.stage.append(e); return e.style; };
    this.tb = [tag('Target ≈ +9', 860, Y(60600) - 50, 'var(--up)'), tag('Flat: fees ≈ −1', 830, Y(60050) - 50, 'var(--second)'), tag('Stop ≈ −6', 880, Y(59700) + 8, 'var(--down)')];
    this.tq = tag('Which path? Nobody knows.', 200, 306, 'var(--main)');
    this.tSl = tag('Stop 59,700 · unchanged', 200, Y(59700) + 8, 'var(--accent)');
    this.tFill = tag('Filled 59,680', 800, Y(MN_FILL) + 4, 'var(--accent)');
    this.tPk = tag('High 60,400', 700, Y(60400) - 50, 'var(--up)');
    kit.stage.append(kit.h('<div class="glass mn-p" style="left:1180px;top:286px;width:600px;padding:20px 30px"><p class="kick" style="margin:0 0 6px">Demo BUY at 60,000</p>' +
      '<div class="row" style="padding:10px 0"><span>Minute</span><span class="mono mn-m" style="font-size:32px">0 of the trade</span></div>' +
      '<div class="row" style="padding:10px 0"><span>Price</span><span class="mono mn-pr" style="font-size:32px">60,000</span></div>' +
      '<div class="row" style="padding:10px 0;border:0"><span>Open PnL · before fees</span><span class="mono mn-v" style="font-size:40px">+0.00</span></div>' +
      '<div style="position:relative;height:18px;border-radius:9px;background:color-mix(in srgb, var(--second) 10%, transparent)"><div style="position:absolute;left:37.5%;top:-6px;width:2px;height:30px;background:var(--second)"></div><div class="mn-bar" style="position:absolute;top:0;height:100%;border-radius:9px"></div></div>' +
      '<p class="mn-s" style="margin:14px 0 0;font-size:26px;font-weight:600;color:var(--main)">Stop and target set before entry ✓</p></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.l = svg.querySelector('.mn-l').style; this.brs = [...svg.querySelectorAll('.mn-br')]; this.bg = svg.querySelector('.mn-bg').style;
    this.fill = svg.querySelector('.mn-fill').style; this.fr = svg.querySelector('.mn-fr');
    this.p = q('.mn-p').style; this.m = q('.mn-m'); this.pr = q('.mn-pr'); this.v = q('.mn-v'); this.bar = q('.mn-bar').style; this.s = q('.mn-s');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 6.6, pose: 'calm' }, { t: 11.4, pose: 'laptop' }, { t: 15.4, pose: 'calm' }, { t: 19.4, pose: 'magnify' }, { t: 26.4, pose: 'checklist' }],
      says: [{ t0: 15.6, t1: 19.2, text: 'Plan stays!' }],
    });
  },
  render(t) {
    this.chrome(t); this.head(t); this.track(t);
    const D = UI.D, Y = D.y1;
    this.c1.render(t);
    this.l.opacity = eo(seg(t, 0.4, 1.0));
    const bo = 1 - ei(seg(t, 10.6, 11.4));
    this.brs.forEach((b, i) => { const a = 1.2 + i * 0.6; b.setAttribute('stroke-dasharray', eio(seg(t, a, a + 0.9)).toFixed(3) + ' 1'); });
    this.bg.opacity = bo.toFixed(3);
    this.tb.forEach((s, i) => UI.rise(kit, s, t, 1.8 + i * 0.6, 0.5, 12, 10.6, 11.2));
    UI.rise(kit, this.tq, t, 6.8, 0.5, 12, 10.6, 11.2);
    // Replay candles.
    let price = 60000, minute = 0;
    const exited = t >= MN_TS;
    for (let j = 0; j < 8; j++) {
      const i = 15 + j, c = D.C1[i], a = MN_A + j * MN_D, u = kit.clamp01((t - a) / MN_D);
      if (t < a) { this.c1.cd.set(i, { x: D.x1(i), w: 22, o: c[0], h: c[0], l: c[0], c: c[0], y: Y, op: 0 }); continue; }
      const m = mnAt(c, u);
      this.c1.cd.set(i, { x: D.x1(i), w: 22, o: c[0], h: m.hi, l: m.lo, c: m.price, y: Y, op: 1, live: u < 1 });
      price = m.price; minute = j + 1;
    }
    const shown = exited ? MN_FILL : price;
    const pnl = (shown - 60000) / 60;
    UI.set(this.m, (exited ? 8 : minute) + ' of the trade');
    UI.set(this.pr, UI.fmt(Math.round(shown / 10) * 10));
    UI.set(this.v, UI.sgn(pnl, 2));
    this.v.style.color = pnl > 0.005 ? 'var(--up)' : pnl < -0.005 ? 'var(--down)' : 'var(--second)';
    // Meter: −6 … +10 USDT, zero at 37.5%.
    const z = 37.5, w = Math.abs(pnl) / 16 * 100;
    this.bar.left = (pnl >= 0 ? z : z - w).toFixed(2) + '%'; this.bar.width = w.toFixed(2) + '%';
    this.bar.background = pnl >= 0 ? 'var(--up)' : 'var(--down)';
    UI.rise(kit, this.p, t, 0.8, 0.6, 24);
    UI.set(this.s, t < 15.4 ? 'Stop and target set before entry ✓' : t < MN_TS ? 'Stop stays at 59,700 ✓' : t < 26.4 ? 'Stop hit: exit at 59,680 ✓' : 'Exit as planned ✓ No adding more');
    this.s.style.color = t >= MN_TS ? 'var(--accent)' : 'var(--main)';
    if (t >= 26.4) this.s.style.color = 'var(--main)';
    UI.rise(kit, this.tSl, t, 15.6, 0.5, 12);
    UI.rise(kit, this.tPk, t, MN_A + 2 * MN_D + 1.0, 0.5, 12);
    this.fill.opacity = eo(seg(t, MN_TS, MN_TS + 0.3));
    const fw = ((t - MN_TS) % 1.6 + 1.6) % 1.6 / 1.6;
    this.fr.setAttribute('r', (12 + 22 * fw).toFixed(1)); this.fr.style.opacity = t > MN_TS ? 1 - fw : 0;
    UI.rise(kit, this.tFill, t, MN_TS + 0.3, 0.5, 12);
    this.tutor.render(t);
  },
});
