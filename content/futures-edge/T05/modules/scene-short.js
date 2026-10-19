const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// One position side, taught as: meaning, everyday analogy (a deal at a fixed price), then a fictional chart with a PnL meter.
const LG = {
  id: 'short', dir: -1, kick: 'Going short', head: 'Short: gain if the price falls',
  def: '<b>Going short</b> means opening a position that gains if the price falls, and loses if it rises.',
  deal: 'Her deal: <b class="hv">sell</b> next week at 50 per kg, before she buys', thing: 'Rice', unit: 'per kg',
  mk: [[0, 50], [12.6, 50], [14.2, 45]], gain: 'Cheaper? She buys at 45, sells at 50: <span class="hl">keeps 5</span>', a1: 14.6,
  mk2: [[17.0, 50], [18.6, 55]], lose: 'Dearer? She buys at 55, sells at 50: <span class="hv">loses 5</span>', a2: 18.8,
  swap: 20.0, keys: [[20.2, 60000], [20.6, 60000], [22.6, 59000], [23.8, 59000], [26.4, 61000], [29, 61000]], t1: 28.4,
  poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 5.7, pose: 'idea' }, { t: 12.8, pose: 'explain' }, { t: 20.1, pose: 'point', flip: true }],
  says: [{ t0: 22.8, t1: 25.4, text: 'Down: short wins.' }],
};
kit.scene(LG.id, {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const crate = '<svg width="150" height="120" viewBox="0 0 150 120" style="flex:none"><rect x="10" y="44" width="130" height="66" rx="8" style="fill:color-mix(in srgb, #c98a3a 55%, var(--ground));stroke:#c98a3a;stroke-width:3"/><path d="M10 66 H140 M10 88 H140" style="stroke:#c98a3a;stroke-width:3"/>' +
      (LG.dir > 0 ? '<ellipse cx="42" cy="38" rx="22" ry="17" style="fill:#f2b33d"/><ellipse cx="78" cy="34" rx="22" ry="17" style="fill:#f6c453"/><ellipse cx="112" cy="38" rx="22" ry="17" style="fill:#eda62e"/>'
        : '<path d="M24 44 Q40 10 75 12 Q110 10 126 44 Z" style="fill:color-mix(in srgb, #fff 82%, var(--ground));stroke:#d8d2c0;stroke-width:3"/>') + '</svg>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:780px"><p class="kick lg-k">' + LG.kick + '</p>' +
      '<h2 class="line lg-t">' + LG.head + '</h2>' +
      '<p class="def lg-d">' + LG.def + '</p></div>' +
      '<div class="glass lg-f" style="left:140px;top:600px;width:800px;padding:24px 32px">' +
      '<p class="kick" style="margin:0 0 10px">' + (LG.dir > 0 ? 'Long' : 'Short') + ' profit or loss, before fees</p>' +
      '<p class="mono" style="margin:0;font-size:28px">' + (LG.dir > 0 ? '(price now − entry)' : '(entry − price now)') + ' × quantity</p>' +
      '<p class="mono lg-w" style="margin:10px 0 0;font-size:32px"></p></div>' +
      '<div class="glass lg-an" style="left:1000px;top:200px;width:600px;height:540px;padding:30px 36px">' +
      '<p class="kick" style="margin:0">Everyday example · ' + LG.thing + '</p>' +
      '<div style="display:flex;align-items:center;gap:26px;margin-top:22px">' + crate + '<p style="margin:0;font-size:30px;font-weight:600;line-height:1.35">' + LG.deal + '</p></div>' +
      '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:30px;padding-top:20px;border-top:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Market price</span><span><span class="mono lg-m" style="font-size:52px"></span> <span style="font-size:24px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">' + LG.unit + '</span></span></div>' +
      '<p class="lg-g" style="margin:24px 0 0;font-size:30px;font-weight:600;line-height:1.35">' + LG.gain + '</p>' +
      '<p class="lg-l" style="margin:10px 0 0;font-size:30px;font-weight:600;line-height:1.35">' + LG.lose + '</p></div>' +
      '</div>'));
    this.chart = UI.chart(kit, { x0: 1000, x1: 1500, y0: 250, y1: 560, lo: 58500, hi: 61500, step: 1000, t0: LG.keys[0][0], t1: LG.t1, keys: LG.keys, entry: 60000, entryBelow: LG.dir > 0, entryLabel: 'Entry 60,000', label: 'BTC price in USDT · fictional' });
    this.meter = UI.meter(kit, 1000, 610, 600, (LG.dir > 0 ? 'Long' : 'Short') + ' 0.01 BTC', 12, 'lg-mt');
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.lg-k').style; this.t = q('.lg-t'); this.d = q('.lg-d'); this.f = q('.lg-f').style; this.w = q('.lg-w');
    this.an = q('.lg-an').style; this.m = q('.lg-m'); this.g = q('.lg-g'); this.l = q('.lg-l');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, { keys: [{ t: 0, x: C.x, y: C.y, s: C.s }], poses: LG.poses, says: LG.says });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.2, { stagger: 0.05 });
    // Analogy card, then the chart and meter in its place.
    const ai = seg(t, 5.5, 6.2), ao = seg(t, LG.swap, LG.swap + 0.5);
    this.an.opacity = eo(ai) * (1 - ei(ao));
    this.an.transform = 'translateY(' + lerp(30, 0, eo(ai)).toFixed(1) + 'px) scale(' + lerp(1, 0.94, ei(ao)).toFixed(4) + ')';
    const mk = (keys) => { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) v = lerp(v, keys[i][1], eio(seg(t, keys[i - 1][0], keys[i][0]))); return v; };
    let mv = mk(LG.mk);
    if (LG.mk2) mv = lerp(mv, LG.mk2[1][1], eio(seg(t, LG.mk2[0][0], LG.mk2[1][0])));
    const mt = String(Math.round(mv));
    if (this.m.textContent !== mt) this.m.textContent = mt;
    this.m.style.color = Math.round(mv) === 100 || Math.round(mv) === 50 ? 'var(--second)' : 'var(--main)';
    TextFx.fadeFromRight(this.g, t, LG.a1, { stagger: 0.06 });
    TextFx.fadeFromRight(this.l, t, LG.a2, { stagger: 0.06 });
    const ci = eo(seg(t, LG.swap + 0.3, LG.swap + 0.9));
    this.chart.render(t, ci);
    this.meter.style.opacity = ci; this.meter.style.transform = 'translateY(' + lerp(24, 0, ci).toFixed(1) + 'px)';
    const P = this.chart.price(t), pnl = LG.dir * (P - 60000) * 0.01;
    this.meter.set(Math.round(pnl * 100) / 100);
    const fi = seg(t, LG.swap + 0.6, LG.swap + 1.2);
    this.f.opacity = eo(fi); this.f.transform = 'translateY(' + lerp(24, 0, eo(fi)).toFixed(1) + 'px)';
    const Pr = Math.round(P / 10) * 10, v = LG.dir * (Pr - 60000) * 0.01;
    const wt = (LG.dir > 0 ? '(' + UI.fmt(Pr) + ' − 60,000)' : '(60,000 − ' + UI.fmt(Pr) + ')') + ' × 0.01 = ' + UI.sgn(v, 2);
    if (this.w.textContent !== wt) this.w.textContent = wt;
    this.w.style.color = v > 0.004 ? 'var(--main)' : v < -0.004 ? 'var(--accent)' : 'var(--second)';
    this.tutor.render(t);
  },
});
