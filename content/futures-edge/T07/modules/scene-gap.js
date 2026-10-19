const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Price drifts down to 59,700, then jumps (no trades between) to 59,200 at 5.6.
const GP_GAP = 5.6;
const gpP = (s) => s < GP_GAP ? UI.path([[0, 59900], [GP_GAP, 59700]], s) + Math.sin(s * 5.1) * 18 : UI.path([[GP_GAP, 59200], [9, 59160], [20, 59260]], s) + Math.sin(s * 3.3) * 10 * seg(s, GP_GAP + 1, GP_GAP + 3);
const gpX = (s) => 1040 + Math.min(s, 18) / 18 * 560, gpY = (p) => 700 - (p - 59100) / 900 * 440;
kit.scene('gap', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const yt = gpY(59500).toFixed(1), xg = gpX(GP_GAP).toFixed(1);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="gp-chart">' + UI.grid(1040, 1600, gpY, 59100, 60000, 100) +
      '<line class="gp-trg" x1="1040" x2="1600" y1="' + yt + '" y2="' + yt + '" stroke-width="4" stroke-dasharray="14 10" style="stroke:var(--accent)"/>' +
      '<text x="1600" y="' + (yt - 16) + '" text-anchor="end" style="fill:var(--accent);font-size:24px;font-weight:700">Stop trigger · 59,500</text>' +
      '<path class="gp-a" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/>' +
      '<line class="gp-jump" x1="' + xg + '" x2="' + xg + '" y1="' + gpY(59700).toFixed(1) + '" y2="' + gpY(59200).toFixed(1) + '" stroke-width="3" stroke-dasharray="4 10" stroke-linecap="round" style="stroke:color-mix(in srgb, var(--second) 60%, transparent)"/>' +
      '<path class="gp-b" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="gp-dot" r="10" style="fill:var(--second)"/>' +
      '<text class="gp-nt" x="' + (+xg - 16) + '" y="' + gpY(59380).toFixed(1) + '" text-anchor="end" style="fill:color-mix(in srgb, var(--second) 75%, var(--ground));font-size:24px">no trades here</text>' +
      '<g class="gp-fill"><circle cx="' + xg + '" cy="' + gpY(59200).toFixed(1) + '" r="14" style="fill:var(--main)"/>' +
      '<text x="' + (+xg + 20) + '" y="' + (gpY(59200) + 46).toFixed(1) + '" style="fill:var(--main);font-size:24px;font-weight:700">Filled near 59,200</text></g>' +
      '<g class="gp-br"><path d="M' + (+xg + 60) + ' ' + yt + ' h18 V' + gpY(59200).toFixed(1) + ' h-18" fill="none" stroke-width="3" style="stroke:var(--accent)"/>' +
      '<text x="' + (+xg + 94) + '" y="' + gpY(59360).toFixed(1) + '" style="fill:var(--accent);font-size:24px;font-weight:700">300 USDT per BTC</text></g>' +
      '<text x="1040" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional</text></g></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick gp-k" style="color:var(--accent)">Not guaranteed</p>' +
      '<h2 class="line gp-t">Stops can slip</h2></div>' +
      '<div class="glass gp-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">A <b>gap</b> is when price jumps from one level to another, with no trades in between.</p></div>' +
      '<div class="glass gp-w" style="left:140px;top:540px;width:820px;padding:24px 36px"><p class="fict" style="margin:0 0 10px">Worked example · fictional prices</p>' +
      '<p class="mono" style="margin:0;font-size:32px">Trigger 59,500 → filled 59,200</p>' +
      '<p class="mono gp-w2" style="margin:12px 0 0;font-size:32px">300 × 0.01 BTC = <span style="color:var(--accent)">3.00 USDT</span> worse</p></div>' +
      '<div class="glass gp-m" style="left:140px;top:740px;width:820px;padding:18px 36px;border-color:var(--accent)"><p style="margin:0;font-size:32px;font-weight:700">A stop is a trigger, <span style="color:var(--accent)">not a promise of price.</span></p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.gp-k').style; this.t = q('.gp-t'); this.def = q('.gp-def').style; this.w = q('.gp-w').style; this.w2 = q('.gp-w2').style; this.m = q('.gp-m').style;
    this.chart = q('.gp-chart').style; this.a = q('.gp-a'); this.b = q('.gp-b'); this.dot = q('.gp-dot'); this.jump = q('.gp-jump').style;
    this.trg = q('.gp-trg').style; this.fill = q('.gp-fill').style; this.br = q('.gp-br').style; this.nt = q('.gp-nt').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.5, pose: 'candles' }, { t: 5.7, pose: 'confused' }, { t: 11.0, pose: 'explain' }, { t: 15.9, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    this.chart.opacity = eo(seg(t, 0.3, 0.9));
    const end = Math.min(t, 18);
    this.a.setAttribute('d', UI.line(gpP, 0, Math.min(end, GP_GAP - 0.01), gpX, gpY));
    this.b.setAttribute('d', end > GP_GAP ? UI.line(gpP, GP_GAP, end, gpX, gpY) : 'M0 0');
    this.b.style.opacity = end > GP_GAP ? 1 : 0;
    const j = seg(t, GP_GAP, GP_GAP + 0.4);
    this.jump.opacity = eo(j);
    this.nt.opacity = eo(seg(t, 6.6, 7.1));
    this.dot.setAttribute('cx', gpX(end).toFixed(1)); this.dot.setAttribute('cy', gpY(gpP(end)).toFixed(1));
    const hit = seg(t, GP_GAP, GP_GAP + 1.0);
    this.trg.opacity = t < GP_GAP ? 1 : 0.4 + 0.6 * Math.abs(Math.cos(hit * Math.PI * 3));
    this.fill.opacity = eo(seg(t, 6.4, 6.9));
    this.br.opacity = eo(seg(t, 11.0, 11.5));
    UI.rise(this.w, t, 11.1);
    UI.rise(this.w2, t, 12.2, { dy: 14 });
    UI.rise(this.m, t, 15.9);
    this.tutor.render(t);
  },
});
