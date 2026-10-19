const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Funding clock reaches funding time at 12.0 s. Positive rate (14.2): longs pay shorts. Negative (16.8): shorts pay longs.
const FD_C = [1500, 300], FD_R = 110;
kit.scene('funding', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let ticks = '';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ticks += '<line x1="' + (Math.cos(a) * 92).toFixed(1) + '" y1="' + (Math.sin(a) * 92).toFixed(1) + '" x2="' + (Math.cos(a) * 102).toFixed(1) + '" y2="' + (Math.sin(a) * 102).toFixed(1) + '"/>'; }
    const side = (cls, x, name) => '<div class="glass ' + cls + '" style="left:' + x + 'px;top:520px;width:220px;padding:16px 20px;text-align:center"><p style="margin:0;font-size:28px;font-weight:700">' + name + '</p><p class="mono ' + cls + '-v" style="margin:6px 0 0;font-size:26px">0.00</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1000px"><p class="kick fd-k">New word · funding</p>' +
      '<h2 class="line fd-t" style="font-size:72px">Traders pay each other</h2></div>' +
      '<div class="glass fd-def" style="left:140px;top:320px;width:1000px;padding:24px 34px"><p class="def fd-d" style="margin:0">Perpetual futures never expire. The <b>funding rate</b> sets a payment between longs and shorts at set times, to keep their price near the spot price.</p></div>' +
      '<div class="glass fd-ex" style="left:140px;top:560px;width:1000px;padding:20px 34px"><p class="kick" style="margin:0 0 8px">Example · long · fictional rate +0.01%</p>' +
      '<p class="mono" style="margin:0;font-size:38px">1,000 × 0.01% = <span style="color:var(--accent)">0.10 USDT</span> <span style="font-family:var(--sans);font-size:26px;font-weight:600">paid, each funding time</span></p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="fd-clock" transform="translate(' + FD_C[0] + ' ' + FD_C[1] + ')">' +
      '<circle r="' + FD_R + '" stroke-width="4" style="fill:color-mix(in srgb, var(--ground) 82%, var(--main));stroke:color-mix(in srgb, var(--main) 50%, transparent)"/>' +
      '<g stroke-width="4" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)">' + ticks + '</g>' +
      '<line class="fd-hand" x1="0" y1="0" x2="0" y2="-84" stroke-width="6" stroke-linecap="round" style="stroke:var(--second)"/><circle r="9" style="fill:var(--second)"/>' +
      '<circle class="fd-ping" r="' + FD_R + '" fill="none" stroke-width="6" style="stroke:var(--main)"/></g>' +
      '<text class="fd-cl" x="' + FD_C[0] + '' + '" y="' + (FD_C[1] + FD_R + 46) + '" text-anchor="middle" style="fill:var(--second);font-size:26px;font-weight:600">Next funding</text>' +
      '<circle class="fd-coin" r="22" style="fill:var(--accent)"/><text class="fd-rate mono" x="' + FD_C[0] + '" y="672" text-anchor="middle" style="font-size:30px"></text></svg>' +
      side('fd-l', 1200, 'Longs') + side('fd-s', 1580, 'Shorts') +
      '<p class="fict fd-f" style="position:absolute;left:1200px;top:700px;margin:0">Often every 8 hours · check your exchange</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.fd-k').style; this.t = q('.fd-t'); this.def = q('.fd-def').style; this.d = q('.fd-d'); this.ex = q('.fd-ex').style;
    this.clock = q('.fd-clock').style; this.hand = q('.fd-hand'); this.ping = q('.fd-ping'); this.cl = q('.fd-cl');
    this.coin = q('.fd-coin'); this.rate = q('.fd-rate'); this.f = q('.fd-f').style;
    this.sides = [q('.fd-l').style, q('.fd-s').style]; this.lv = q('.fd-l-v'); this.sv = q('.fd-s-v');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 7.3, pose: 'point', flip: true }, { t: 14.2, pose: 'magnify' }, { t: 19.3, pose: 'writing' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.def, t, 0.7, 0.7);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.04 });
    const cp = seg(t, 7.3, 7.9);
    this.clock.opacity = eo(cp); this.cl.style.opacity = eo(cp); this.f.opacity = 0.9 * eo(seg(t, 8.0, 8.5));
    this.sides.forEach((s, i) => UI.rise(kit, s, t, 8.2 + i * 0.3, 0.6));
    // The hand sweeps a full turn to the funding time at 12.0, then starts the next period.
    const turn = t < 12 ? eio(seg(t, 7.6, 12.0)) : 1 + (t - 12) / 40;
    this.hand.setAttribute('transform', 'rotate(' + (turn * 360).toFixed(1) + ')');
    UI.set(this.cl, t >= 12 && t < 13.6 ? 'Funding time!' : 'Next funding');
    const pg = seg(t, 12.0, 12.8);
    this.ping.setAttribute('r', (FD_R + 40 * eo(pg)).toFixed(1)); this.ping.style.opacity = pg > 0 && pg < 1 ? 1 - pg : 0;
    // Payment 1 (positive rate): a coin flies Longs → Shorts. Payment 2 (negative): Shorts → Longs.
    const L = [1310, 530], S = [1690, 530];
    const p1 = seg(t, 14.4, 15.6), p2 = seg(t, 16.9, 18.1);
    let cx = L[0], cy = L[1], op = 0;
    if (t >= 14.4 && t < 15.8) { cx = lerp(L[0], S[0], eio(p1)); cy = L[1] - 60 - Math.sin(Math.PI * p1) * 70; op = 1; }
    if (t >= 16.9 && t < 18.3) { cx = lerp(S[0], L[0], eio(p2)); cy = S[1] - 60 - Math.sin(Math.PI * p2) * 70; op = 1; }
    this.coin.setAttribute('cx', cx.toFixed(1)); this.coin.setAttribute('cy', cy.toFixed(1)); this.coin.style.opacity = op;
    this.coin.style.fill = t < 16.5 ? 'var(--accent)' : 'var(--main)';
    UI.set(this.rate, t < 14.2 ? '' : t < 16.5 ? 'rate +0.01% · longs pay' : 'rate −0.01% · shorts pay');
    this.rate.style.fill = t < 16.5 ? 'var(--accent)' : 'var(--main)';
    this.rate.style.opacity = eo(seg(t, 14.2, 14.6));
    const lv = t >= 18.1 ? 0.10 : t >= 15.6 ? -0.10 : 0, sv = -lv;
    UI.set(this.lv, UI.sgn(lv, 2) + ' USDT'); UI.set(this.sv, UI.sgn(sv, 2) + ' USDT');
    const col = (v) => v < 0 ? 'var(--accent)' : v > 0 ? 'var(--main)' : 'var(--second)'; this.lv.style.color = col(lv); this.sv.style.color = col(sv);
    UI.rise(kit, this.ex, t, 19.3, 0.7);
    this.tutor.render(t);
  },
});
