const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const RK_W = 560, RK_H = 200, RK_LO = 0.95, RK_HI = 1.01, RK_T0 = 4.8, RK_T1 = 11.6;
// Illustrative peg: steady near 1.00, then slips to about 0.97, then partly recovers.
const rkPeg = (t) => 1 + 0.0007 * Math.sin(t * 6.1) - 0.03 * eio(seg(t, 7.2, 8.0)) + 0.018 * eio(seg(t, 8.6, 11.0));
const RK_CARDS = [['Depends on its issuer', 'A company issues USDT and holds reserves to back it. If that fails, the coin can fail too.', 12.2], ['Value is not profit', 'Notional value is what a holding is worth right now. It is not money you have made.', 18.0]];
kit.scene('risks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let grid = '';
    [0.96, 0.98, 1.00].forEach((p) => { const y = RK_H - (p - RK_LO) / (RK_HI - RK_LO) * RK_H; grid += '<line x1="0" x2="' + RK_W + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" style="stroke:color-mix(in srgb, var(--second) ' + (p === 1 ? 30 : 8) + '%, transparent);stroke-width:1.5' + (p === 1 ? ';stroke-dasharray:8 8' : '') + '"/><text x="' + (RK_W + 14) + '" y="' + (y + 8).toFixed(1) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 50%, var(--ground));font-size:22px">' + p.toFixed(2) + '</text>'; });
    let cards = '';
    RK_CARDS.forEach((r, i) => {
      cards += '<div class="glass rk-c" style="left:920px;top:' + (340 + i * 218) + 'px;width:750px;min-height:196px;padding:24px 34px">' +
        '<p class="kick" style="margin:0 0 10px;color:var(--accent)">' + r[0] + '</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">' + r[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1400px"><p class="kick rk-k" style="color:var(--accent)">Before you go further</p>' +
      '<h2 class="line rk-t">Stablecoins have risks too</h2></div>' +
      '<div class="glass rk-peg" style="left:140px;top:340px;width:750px;height:414px;padding:24px 34px">' +
      '<p class="kick" style="margin:0 0 10px;color:var(--accent)">Not guaranteed</p>' +
      '<p style="margin:0 0 18px;font-size:30px;line-height:1.4;font-weight:600">It can slip below 1 dollar. That is called losing its peg.</p>' +
      '<svg width="' + (RK_W + 90) + '" height="' + RK_H + '" style="display:block;overflow:visible">' + grid + '<path class="rk-l" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--accent)"/></svg>' +
      '<p class="fict" style="margin:10px 0 0">USDT in US dollars · illustrative, not real data</p></div>' + cards +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.rk-k').style; this.t = q('.rk-t'); this.peg = q('.rk-peg').style; this.l = q('.rk-l');
    this.cards = [...kit.stage.querySelectorAll('.rk-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'calm' }, { t: 7.2, pose: 'confused' }, { t: 12.2, pose: 'think' }, { t: 18.0, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const p = seg(t, 4.6, 5.3);
    this.peg.opacity = eo(seg(t, 4.6, 4.95)); this.peg.transform = 'translateY(' + lerp(40, 0, eo(p)) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)) + ')';
    let d = '';
    const end = Math.min(Math.max(t, RK_T0), RK_T1);
    for (let x = RK_T0; x <= end + 1e-6; x += 0.05) d += (x > RK_T0 ? 'L' : 'M') + ((x - RK_T0) / (RK_T1 - RK_T0) * RK_W).toFixed(1) + ' ' + (RK_H - (rkPeg(x) - RK_LO) / (RK_HI - RK_LO) * RK_H).toFixed(1);
    this.l.setAttribute('d', d || 'M0 0');
    this.cards.forEach((c, i) => {
      const a = RK_CARDS[i][2], q = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35));
      c.transform = 'translateY(' + lerp(40, 0, eo(q)).toFixed(2) + 'px) scale(' + lerp(0.95, 1, eob(q, 1.5)) + ')';
    });
    this.tutor.render(t);
  },
});
