const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Five fictional 1-minute candles (10:00 to 10:04) combined into one 5-minute candle.
const B5 = UI.M1.slice(0, 5), B5R = UI.agg(B5);
const B5_X = (i) => 320 + i * 100, B5_RX = 920, b5Y = (p) => 720 - (p - 59960) / 170 * 340;
// Steps: [start, column (1 open .. 4 close), source row, rule text, result at]
const B5_STEPS = [[5.2, 1, 0, 'Open = the first open', 6.2], [8.6, 2, 3, 'High = the highest high', 11.4], [13.9, 3, 0, 'Low = the lowest low', 16.4], [18.8, 4, 4, 'Close = the last close', 19.8]];
const B5_M = 22.4, B5_ME = 25.0;
kit.scene('build5', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'b5-c', 6);
    let guides = '';
    B5_STEPS.forEach((s) => {
      const v = B5[s[2]][s[1] - 1], y = b5Y(v).toFixed(1);
      guides += '<line class="b5-g" x1="' + (B5_X(s[2]) + 34) + '" x2="' + (B5_RX - 70) + '" y1="' + y + '" y2="' + y + '" stroke-width="2.5" stroke-dasharray="6 7" style="stroke:var(--main)"/>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="b5-grid">' + UI.gridL(250, 990, b5Y, 60000, 60100, 50) +
      [0, 1, 2, 3, 4].map((i) => '<text x="' + B5_X(i) + '" y="756" text-anchor="middle" class="axis b5-tl">' + UI.hm(i) + '</text>').join('') +
      '<text x="' + B5_RX + '" y="756" text-anchor="middle" class="axis b5-rl" style="fill:var(--main)">5m</text></g>' + guides +
      '<line class="b5-ot" x1="' + (B5_RX - 64) + '" x2="' + (B5_RX + 64) + '" y1="' + b5Y(B5R[0]) + '" y2="' + b5Y(B5R[0]) + '" stroke-width="5" stroke-linecap="round" style="stroke:var(--second)"/>' +
      '<line class="b5-ct" x1="' + (B5_RX - 64) + '" x2="' + (B5_RX + 64) + '" y1="' + b5Y(B5R[3]) + '" y2="' + b5Y(B5R[3]) + '" stroke-width="5" stroke-linecap="round" style="stroke:var(--second)"/>' +
      '<line class="b5-wk" x1="' + B5_RX + '" x2="' + B5_RX + '" stroke-width="8" stroke-linecap="round" style="stroke:var(--second)"/>' +
      this.cd.html + '</svg>' +
      '<p class="chip b5-rule" style="position:absolute;left:250px;top:318px;margin:0;font-size:28px;padding:12px 26px;border-color:var(--main)"></p>' +
      '<div class="glass b5-card" style="left:1030px;top:300px;width:670px;height:450px"></div>' +
      UI.otab('b5-t', 1045, 318, 640, B5.map((c, i) => [UI.hm(i)].concat(c)), '5m') +
      '<p class="chip b5-up" style="position:absolute;left:250px;top:318px;margin:0;font-size:28px;padding:12px 26px;background:var(--up);color:var(--ground);border-color:var(--up)">60,090 &gt; 60,000 · up candle</p>' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick b5-k">Candle aggregation</p>' +
      '<h2 class="line b5-t2">Five 1m candles, one 5m candle</h2></div>' +
      '<p class="fict" style="position:absolute;left:1045px;top:762px;margin:0">BTC/USDT · fictional prices in USDT</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.b5-k').style; this.t = q('.b5-t2'); this.grid = q('.b5-grid').style; this.card = q('.b5-card').style;
    this.rule = q('.b5-rule'); this.up = q('.b5-up').style; this.g = all('.b5-g'); this.ot = q('.b5-ot'); this.ct = q('.b5-ct'); this.wk = q('.b5-wk');
    this.cells = all('.b5-t-c'); this.tab = q('.b5-t').style; this.tl = all('.b5-tl').map((e) => e.style); this.rl = q('.b5-rl').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'candles', flip: true }, { t: 5.2, pose: 'checklist' }, { t: 8.6, pose: 'magnify' }, { t: 18.8, pose: 'checklist' }, { t: 22.2, pose: 'point', flip: true }, { t: 28.6, pose: 'cheer' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    UI.rise(this.card, t, 0.6);
    this.tab.opacity = eo(seg(t, 0.8, 1.2));
    const m = eio(seg(t, B5_M, B5_ME));
    // The five 1-minute candles grow in, then slide into the 5-minute slot and fade as it fills.
    B5.forEach((c, i) => {
      const a = 0.8 + i * 0.4, p = seg(t, a, a + 0.6);
      this.cd.set(i, { x: lerp(B5_X(i), B5_RX, m), w: 56, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: b5Y, op: eo(seg(t, a, a + 0.3)) * (1 - eo(seg(t, B5_ME - 1.0, B5_ME))) });
    });
    for (const s of this.tl) s.opacity = 1 - eo(seg(t, B5_M, B5_M + 0.6));
    this.rl.opacity = eo(seg(t, 5.6, 6.0));
    const fill = eob(seg(t, B5_ME - 1.0, B5_ME + 0.2), 1.3);
    this.cd.set(5, { x: B5_RX, w: lerp(40, 128, fill), o: B5R[0], h: B5R[1], l: B5R[2], c: lerp(B5R[0], B5R[3], fill), y: b5Y, op: eo(seg(t, B5_ME - 1.0, B5_ME - 0.6)) });
    // Table rows appear with their candles.
    this.cells.forEach((e, k) => {
      const r = Math.floor(k / 5), col = k % 5;
      if (r < 5) e.style.opacity = eo(seg(t, 0.8 + r * 0.4, 1.2 + r * 0.4));
      e.style.background = 'transparent'; e.style.color = '';
    });
    // The four steps: scan the column, pick the winner, write it into the 5m row and onto the chart.
    let ruleTxt = '', ruleOn = 0;
    B5_STEPS.forEach((s, j) => {
      const [a, col, row, txt, res] = s, end = j < 3 ? B5_STEPS[j + 1][0] : B5_M;
      if (t >= a && t < end) { ruleTxt = txt; ruleOn = eo(seg(t, a, a + 0.4)); }
      const scan = col === 2 || col === 3;
      if (t >= a && t < end + 0.2) {
        for (let r = 0; r < 5; r++) {
          const cell = this.cells[r * 5 + col];
          let hl = 0;
          if (scan && t < res - 0.4) hl = Math.max(0, 1 - Math.abs(t - (a + 0.4 + r * 0.32)) / 0.3) * 0.7;
          if (r === row && t >= res - 0.4) hl = 1;
          if (!scan && r === row) hl = eo(seg(t, a + 0.2, a + 0.6));
          if (hl > 0) { cell.style.background = 'color-mix(in srgb, var(--main) ' + (hl * 28).toFixed(0) + '%, transparent)'; cell.style.color = hl > 0.9 ? 'var(--main)' : ''; }
        }
      }
      const out = this.cells[25 + col];
      UI.txt(out, t >= res ? UI.fmt(B5R[col - 1]) : '');
      const rp = seg(t, res, res + 0.5);
      out.style.background = 'color-mix(in srgb, var(--main) ' + (Math.sin(Math.PI * rp) * 30).toFixed(0) + '%, transparent)';
      this.g[j].setAttribute('stroke-dasharray', '6 7');
      this.g[j].style.opacity = (t >= res - 0.3 ? 1 : 0) * eo(seg(t, res - 0.3, res)) * (1 - eo(seg(t, B5_M - 0.6, B5_M)));
    });
    this.cells[25].style.opacity = eo(seg(t, 5.2, 5.6));
    for (let c = 1; c < 5; c++) this.cells[25 + c].style.opacity = 1;
    UI.txt(this.rule, ruleTxt); this.rule.style.opacity = ruleOn;
    // The 5-minute candle builds on the chart: open tick, wick up, wick down, close tick.
    const pre = 1 - eo(seg(t, B5_ME - 0.8, B5_ME));
    this.ot.style.opacity = eo(seg(t, 6.2, 6.6)) * pre;
    const up = eio(seg(t, 11.4, 12.2)), dn = eio(seg(t, 16.4, 17.2));
    this.wk.setAttribute('y1', lerp(b5Y(B5R[0]), b5Y(B5R[1]), up).toFixed(1)); this.wk.setAttribute('y2', lerp(b5Y(B5R[0]), b5Y(B5R[2]), dn).toFixed(1));
    this.wk.style.opacity = (up > 0 || dn > 0 ? 1 : 0) * pre;
    this.ct.style.opacity = eo(seg(t, 19.8, 20.2)) * pre;
    UI.rise(this.up, t, 28.6, { s: 0.9 });
    this.tutor.render(t);
  },
});
