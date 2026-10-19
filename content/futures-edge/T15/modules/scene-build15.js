const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const BF_X0 = 260, BF_PPM = 44, BF_RX = 1050, bfY = (p) => 700 - (p - 59900) / 290 * 320;
const BF = UI.agg(UI.M1), BF5 = UI.tf(5);
// [label, value, note, at, source minute, which price (0 open .. 3 close)]
const BF_ROWS = [['Open', BF[0], 'first open', 6.0, 0, 0], ['High', BF[1], 'highest high', 7.6, 14, 1], ['Low', BF[2], 'lowest low', 9.0, 7, 2], ['Close', BF[3], 'last close', 10.9, 14, 3]];
const BF_ST = [[0, 1], [14.8, 5]];
kit.scene('build15', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'bf-c', 20);
    let rows = '', guides = '', tags = '';
    BF_ROWS.forEach((r) => {
      rows += '<div class="bf-r" style="display:flex;align-items:baseline;gap:16px;padding:10px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="width:90px;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + r[0] + '</span>' +
        '<span class="mono" style="font-size:38px">' + UI.fmt(r[1]) + '</span><span style="margin-left:auto;font-size:24px;color:var(--main)">' + r[2] + '</span></div>';
      const y = bfY(r[1]).toFixed(1);
      guides += '<line class="bf-g" x1="' + (BF_X0 + (r[4] + 0.5) * BF_PPM + 14) + '" x2="' + (BF_RX - 64) + '" y1="' + y + '" y2="' + y + '" stroke-width="2.5" stroke-dasharray="6 7" style="stroke:var(--main)"/>';
    });
    BF5.forEach((c, k) => {
      const x = BF_X0 + (k * 5 + 2.5) * BF_PPM;
      tags += '<text class="bf-tg mono" x="' + x + '" y="' + (bfY(c[1]) - 16).toFixed(1) + '" text-anchor="middle" style="fill:var(--second);font-size:22px">' + UI.fmt(c[1]) + '</text>' +
        '<text class="bf-tg mono" x="' + x + '" y="' + (bfY(c[2]) + 34).toFixed(1) + '" text-anchor="middle" style="fill:var(--second);font-size:22px">' + UI.fmt(c[2]) + '</text>';
    });
    let tl = '';
    for (let m = 0; m <= 15; m += 5) tl += '<text x="' + (BF_X0 + m * BF_PPM) + '" y="736" text-anchor="middle" class="axis">' + UI.hm(m) + '</text>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="bf-grid">' + UI.gridL(250, 940, bfY, 59950, 60150, 50) + tl +
      '<text x="' + BF_RX + '" y="736" text-anchor="middle" class="axis" style="fill:var(--main)">15m</text></g>' + guides + this.cd.html + tags + '</svg>' +
      '<div class="glass bf-card" style="left:1180px;top:330px;width:520px;padding:18px 32px 22px"><p class="fict" style="margin:0 0 4px">15m candle · 10:00–10:15</p>' + rows +
      '<p class="chip bf-ok" style="margin:16px 0 0;font-size:24px;padding:10px 20px;border-color:var(--up)">Same answer from the three 5m candles</p></div>' +
      '<div class="words" style="left:140px;top:170px;width:1000px"><p class="kick bf-k">Same rule, bigger window</p>' +
      '<h2 class="line bf-t">Building a 15m candle</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.bf-k').style; this.t = q('.bf-t'); this.grid = q('.bf-grid').style; this.card = q('.bf-card').style; this.ok = q('.bf-ok').style;
    this.rows = all('.bf-r').map((e) => e.style); this.g = all('.bf-g'); this.tg = all('.bf-tg').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'cheer' }, { t: 0.5, pose: 'explain' }, { t: 5.9, pose: 'checklist' }, { t: 10.8, pose: 'thumbs' }, { t: 14.8, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    UI.rise(this.card, t, 5.6);
    const st = UI.tfState(BF_ST, t);
    UI.tfAll(this.cd, st, BF_X0, BF_PPM, bfY, eo(seg(t, 0.6, 1.4)));
    BF_ROWS.forEach((r, i) => {
      UI.rise(this.rows[i], t, r[3], { dy: 16 });
      this.g[i].setAttribute('stroke-dasharray', '6 7');
      this.g[i].style.opacity = eo(seg(t, r[3], r[3] + 0.4)) * (1 - eo(seg(t, 13.8, 14.4)));
    });
    // The 15-minute candle: built from the four values, filled once the close is known.
    const w = eio(seg(t, 7.6, 9.4)), f = eob(seg(t, 10.9, 11.8), 1.3);
    this.cd.set(19, { x: BF_RX, w: lerp(16, 120, f), o: BF[0], h: lerp(BF[0], BF[1], eio(seg(t, 7.6, 8.4))), l: lerp(BF[0], BF[2], eio(seg(t, 9.0, 9.8))), c: lerp(BF[0], BF[3], f), y: bfY, op: eo(seg(t, 6.0, 6.4)), live: f < 1 });
    this.tg.forEach((s, i) => { s.opacity = eo(seg(t, 15.4 + Math.floor(i / 2) * 0.3, 15.8 + Math.floor(i / 2) * 0.3)); });
    UI.rise(this.ok, t, 16.4, { s: 0.9 });
    this.tutor.render(t);
  },
});
