const { seg, eo, eob, eio, lerp, clamp01, TextFx } = kit;
const PHASES = [
  ['Crypto Foundations', 'T01 to T04', 'What crypto is, why prices move, the BTC/USDT pair, what an exchange does'],
  ['Trading Fundamentals', 'T05 to T09', 'Long and short, profit and loss, order types, stop-loss and take-profit, fees'],
  ['Binance and Futures Essentials', 'T10 to T13', 'A mock platform tour, spot versus futures, margin and leverage, liquidation and funding'],
  ['Charts and Market Analysis', 'T14 to T18', 'Candlesticks, timeframes, trend, support and resistance, volume and range'],
  ['Scalping and Risk Management', 'T19 to T23', 'What scalping is, judging an entry, choosing no trade, position sizing, a full demo walkthrough'],
];
const PH_X = [220, 545, 870, 1195, 1520], PH_Y = [470, 420, 470, 420, 470];
const PH_CP = [[382, 445, 'after T04'], [1032, 445, 'after T13'], [1690, 455, 'after T23']];
const PH_T0 = 3.6, PH_STEP = 3.5, PH_END = PH_T0 + PH_STEP * 5;
kit.scene('phases', {
  init(kit) {
    let d = 'M140 470';
    for (let i = 0; i < 5; i++) { const px = i ? PH_X[i - 1] : 140, py = i ? PH_Y[i - 1] : 470; d += ' C' + (px + 110) + ' ' + py + ' ' + (PH_X[i] - 110) + ' ' + PH_Y[i] + ' ' + PH_X[i] + ' ' + PH_Y[i]; }
    d += ' C1630 470 1700 455 1780 455';
    let nodes = '', cps = '', panels = '';
    PHASES.forEach((p, i) => {
      nodes += '<g class="phases-node"><circle cx="' + PH_X[i] + '" cy="' + PH_Y[i] + '" r="48" class="phases-c"/><text x="' + PH_X[i] + '" y="' + (PH_Y[i] + 15) + '" text-anchor="middle" class="phases-n" style="font-size:42px;font-weight:700">' + (i + 1) + '</text></g>';
      panels += '<div class="words phases-p" style="left:56px;top:40px;width:1180px;gap:14px"><p class="kick">Phase ' + (i + 1) + ' · ' + p[1] + '</p><h3 class="line" style="font-size:56px">' + p[0] + '</h3><p class="sub" style="font-size:32px">' + p[2] + '</p></div>';
    });
    panels += '<div class="words phases-p" style="left:56px;top:40px;width:1180px;gap:14px"><p class="kick" style="color:var(--accent)">Checkpoints</p><h3 class="line" style="font-size:56px">Three short reviews along the way</h3><p class="sub" style="font-size:32px">They show what to revisit. Retry as often as you like.</p></div>';
    PH_CP.forEach((c) => { cps += '<g class="phases-cp"><rect x="' + (c[0] - 20) + '" y="' + (c[1] - 20) + '" width="40" height="40" rx="6" transform="rotate(45 ' + c[0] + ' ' + c[1] + ')" style="fill:var(--ground);stroke:var(--accent);stroke-width:4"/><text x="' + c[0] + '" y="' + (c[1] + 70) + '" text-anchor="middle" class="mono" style="fill:var(--accent);font-size:20px">' + c[2] + '</text></g>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:110px;width:1500px"><p class="kick phases-k">The roadmap</p><h2 class="line phases-t" style="font-size:80px">Five phases, 23 lessons</h2></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="phases-g" x1="0" x2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient></defs>' +
      '<path class="phases-path" d="' + d + '" pathLength="1" fill="none" stroke="url(#phases-g)" stroke-width="5" stroke-linecap="round"/>' + cps + nodes + '</svg>' +
      '<div class="glass phases-panel" style="left:200px;top:640px;width:1300px;height:300px">' + panels + '</div></div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = kit.stage.querySelector('.phases-k').style; this.title = kit.stage.querySelector('.phases-t');
    this.path = kit.stage.querySelector('.phases-path'); this.panel = kit.stage.querySelector('.phases-panel').style;
    this.nodes = all('.phases-node').map((e) => e.style); this.cs = all('.phases-c'); this.ns = all('.phases-n');
    this.cps = all('.phases-cp').map((e) => e.style); this.ps = all('.phases-p').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idle' }, { t: 0.4, pose: 'present' }, { t: PH_T0, pose: 'idea' }, { t: PH_T0 + PH_STEP, pose: 'writing' }, { t: PH_T0 + PH_STEP * 2, pose: 'laptop' }, { t: PH_T0 + PH_STEP * 3, pose: 'candles', flip: true }, { t: PH_T0 + PH_STEP * 4, pose: 'magnify' }, { t: PH_END, pose: 'checklist' }],
      says: [{ t0: 0.6, t1: 2.9, text: 'Here is the path we will walk together.' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.title, t, 0.1);
    this.path.setAttribute('stroke-dasharray', eio(seg(t, 1.2, 3.4)) + ' 1');
    const cur = t < PH_T0 ? -1 : Math.min(5, Math.floor((t - PH_T0) / PH_STEP));
    PHASES.forEach((p, i) => {
      const a = 1.4 + i * 0.4;
      const g = seg(t, a, a + 0.6);
      this.nodes[i].opacity = eo(seg(t, a, a + 0.25));
      this.nodes[i].transformOrigin = PH_X[i] + 'px ' + PH_Y[i] + 'px';
      const lit = cur === i, done = cur > i;
      const pulse = lit ? 1 + 0.06 * eob(seg(t, PH_T0 + i * PH_STEP, PH_T0 + i * PH_STEP + 0.5), 1.8) - 0.06 * eo(seg(t, PH_T0 + i * PH_STEP + 0.5, PH_T0 + i * PH_STEP + 0.9)) : 1;
      this.nodes[i].transform = 'scale(' + (lerp(0.4, 1, eob(g, 1.7)) * pulse * (lit ? 1.12 : 1)) + ')';
      this.cs[i].setAttribute('style', lit ? 'fill:var(--main);stroke:var(--main);stroke-width:4' : done || cur === 5 ? 'fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main);stroke-width:4' : 'fill:var(--ground);stroke:color-mix(in srgb, var(--second) 40%, transparent);stroke-width:4');
      this.ns[i].setAttribute('style', 'font-size:42px;font-weight:700;fill:' + (lit ? 'var(--ground)' : 'var(--second)'));
    });
    this.cps.forEach((c, i) => { const a = 1.9 + i * 0.6; c.opacity = eo(seg(t, a, a + 0.4)) * (cur === 5 ? 1 : 0.75); });
    const pi = seg(t, PH_T0 - 0.6, PH_T0);
    this.panel.opacity = eo(pi);
    this.panel.transform = 'translateY(' + lerp(30, 0, eo(pi)) + 'px)';
    this.ps.forEach((s, i) => {
      const a = PH_T0 + i * PH_STEP;
      const inn = seg(t, a - 0.15, a + 0.3), out = i === 5 ? 0 : seg(t, a + PH_STEP - 0.3, a + PH_STEP);
      s.opacity = (i === 0 && t < PH_T0 ? eo(pi) : eo(inn)) * (1 - ei(out));
      s.transform = 'translateX(' + (lerp(26, 0, eo(inn)) - 20 * eo(out)) + 'px)';
    });
    this.tutor.render(t);
  },
});
const ei = kit.ei;
