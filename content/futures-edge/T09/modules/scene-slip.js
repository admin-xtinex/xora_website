const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Two price rulers: entry (buy) expected 60,005, filled 60,015; exit (sell) expected 60,075, filled 60,065.
const SS_ROWS = [['Entry · buy', 59995, 60005, 60015, 330, 6.4], ['Exit · sell', 60055, 60075, 60065, 560, 8.6]];
const ssX = (lo, p) => 1090 + (p - lo) / 30 * 520;
kit.scene('slip', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let svg = '', cards = '';
    SS_ROWS.forEach((r, i) => {
      const y = r[4] + 120;
      cards += '<div class="glass ss-card" style="left:1040px;top:' + r[4] + 'px;width:640px;height:200px;padding:18px 28px"><p class="kick" style="margin:0;color:' + (i ? 'var(--accent)' : 'var(--main)') + '">' + r[0] + '</p></div>';
      let ticks = '';
      for (let p = r[1]; p <= r[1] + 30; p += 10) ticks += '<line x1="' + ssX(r[1], p).toFixed(1) + '" x2="' + ssX(r[1], p).toFixed(1) + '" y1="' + (y - 8) + '" y2="' + (y + 8) + '" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 35%, transparent)"/>';
      svg += '<g class="ss-row"><line x1="1090" x2="1610" y1="' + y + '" y2="' + y + '" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 30%, transparent)"/>' + ticks +
        '<circle cx="' + ssX(r[1], r[2]).toFixed(1) + '" cy="' + y + '" r="13" fill="none" stroke-width="3" style="stroke:var(--second)"/>' +
        '<text x="' + ssX(r[1], r[2]).toFixed(1) + '" y="' + (y - 26) + '" text-anchor="middle" style="fill:var(--second);font-size:24px;font-weight:600">Expected ' + UI.fmt(r[2]) + '</text>' +
        '<path class="ss-arr" d="M' + ssX(r[1], r[2]).toFixed(1) + ' ' + y + ' L' + ssX(r[1], r[3]).toFixed(1) + ' ' + y + '" stroke-width="5" style="stroke:var(--accent)"/>' +
        '<circle class="ss-dot" cx="0" cy="' + y + '" r="13" style="fill:var(--accent)"/>' +
        '<text class="ss-lab" x="' + ssX(r[1], r[3]).toFixed(1) + '" y="' + (y + 50) + '" text-anchor="middle" style="fill:var(--accent);font-size:24px;font-weight:700">Filled ' + UI.fmt(r[3]) + ' · 10 worse</text></g>';
    });
    kit.stage.append(kit.h('<div class="ground">' + cards +
      '<svg class="art" viewBox="0 0 1920 1080">' + svg + '</svg>' +
      '<p class="fict" style="position:absolute;left:1040px;top:290px;margin:0">Fictional prices in USDT</p>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick ss-k">Cost 3</p>' +
      '<h2 class="line ss-t">Slippage</h2></div>' +
      '<div class="glass ss-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0"><b>Slippage</b>: your fill is worse than the price you expected. Fast moves and thin books make it bigger.</p></div>' +
      '<div class="glass ss-w" style="left:140px;top:590px;width:820px;padding:24px 36px"><p class="mono" style="margin:0;font-size:32px">10 in + 10 out = 20 USDT per BTC</p>' +
      '<p class="mono ss-w2" style="margin:12px 0 0;font-size:32px">20 × 0.01 BTC = <span style="color:var(--accent)">0.20 USDT</span></p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ss-k').style; this.t = q('.ss-t'); this.def = q('.ss-def').style; this.w = q('.ss-w').style; this.w2 = q('.ss-w2').style;
    this.cards = all('.ss-card').map((e) => e.style); this.rows = all('.ss-row').map((e) => e.style);
    this.arr = all('.ss-arr'); this.dots = all('.ss-dot'); this.labs = all('.ss-lab').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.5, pose: 'explain' }, { t: 5.8, pose: 'point', flip: true }, { t: 12.1, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    SS_ROWS.forEach((r, i) => {
      const a = r[5];
      UI.rise(this.cards[i], t, a - 1.4);
      this.rows[i].opacity = eo(seg(t, a - 1.2, a - 0.7));
      const p = eio(seg(t, a, a + 1.0));
      this.arr[i].setAttribute('pathLength', '1'); this.arr[i].setAttribute('stroke-dasharray', p.toFixed(3) + ' 1');
      this.dots[i].setAttribute('cx', ssX(r[1], lerp(r[2], r[3], p)).toFixed(1));
      this.dots[i].style.opacity = t > a ? 1 : 0;
      this.labs[i].opacity = eo(seg(t, a + 0.9, a + 1.3));
    });
    UI.rise(this.w, t, 12.2); UI.rise(this.w2, t, 13.6, { dy: 14 });
    this.tutor.render(t);
  },
});
