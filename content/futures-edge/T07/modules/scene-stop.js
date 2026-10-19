const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Chart part starts at 18.6: price falls from 60,000 to the 59,500 trigger at 21.6, fills at 59,480 at 22.3.
const SP_K = [[18.6, 60000], [19.2, 59980], [21.6, 59500], [22.3, 59480], [26, 59440]];
const spP = (s) => UI.path(SP_K, s) + (s < 21.4 ? Math.sin(s * 6.3) * 14 * seg(s, 18.6, 19.4) : 0);
const spX = (s) => 1040 + (Math.min(s, 25.4) - 18.6) / 6.8 * 560, spY = (p) => 700 - (p - 59400) / 700 * 440;
const SP_STEPS = [['Waiting', 'Your stop sits at its trigger: 59,500.', 0.6], ['Triggered', 'The market price touches 59,500.', 5.9], ['Order sent', 'The stop sends a market order.', 7.4], ['Filled', 'At the best price available then.', 9.0]];
kit.scene('stop', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let steps = '';
    SP_STEPS.forEach((s, i) => {
      steps += '<div class="sp-step" style="display:flex;gap:22px;align-items:center;padding:14px 0">' +
        '<span class="mono sp-num" style="flex:none;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;font-size:28px;border:2px solid var(--main)">' + (i + 1) + '</span>' +
        '<span><b style="display:block;font-size:30px">' + s[0] + '</b><span style="font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + s[1] + '</span></span></div>';
    });
    const yt = spY(59500).toFixed(1);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass sp-flow" style="left:1060px;top:210px;width:640px;padding:22px 34px"><p class="fict" style="margin:0 0 4px">How a stop works</p>' + steps + '</div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="sp-chart">' + UI.grid(1040, 1600, spY, 59400, 60000, 100) +
      '<line class="sp-trg" x1="1040" x2="1600" y1="' + yt + '" y2="' + yt + '" stroke-width="4" stroke-dasharray="14 10" style="stroke:var(--accent)"/>' +
      '<text x="1600" y="' + (yt - 16) + '" text-anchor="end" style="fill:var(--accent);font-size:24px;font-weight:700">Stop trigger · 59,500</text>' +
      '<path class="sp-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="sp-dot" r="10" style="fill:var(--second)"/>' +
      '<g class="sp-fill"><circle cx="' + spX(22.3).toFixed(1) + '" cy="' + spY(59480).toFixed(1) + '" r="14" style="fill:var(--main)"/>' +
      '<text x="' + (spX(22.3) + 24).toFixed(1) + '" y="' + (spY(59480) + 44).toFixed(1) + '" style="fill:var(--main);font-size:24px;font-weight:700">Sold at 59,480</text></g>' +
      '<text x="1040" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional</text></g></svg>' +
      '<span class="chip sp-tr" style="position:absolute;left:1100px;top:140px;font-size:26px;padding:12px 24px;background:var(--accent);border-color:var(--accent)">Triggered → market sell sent</span>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick sp-k">Order type 3</p>' +
      '<h2 class="line sp-t">Stop order</h2></div>' +
      '<div class="glass sp-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">A <b>stop order</b> waits for a <b>trigger price</b>. When the market reaches it, the stop sends an order, often a market order.</p></div>' +
      '<div class="glass sp-an" style="left:140px;top:610px;width:820px;padding:26px 36px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Everyday version</p>' +
      '<p style="margin:0;font-size:32px;line-height:1.4;font-weight:600">A tripwire: nothing happens until the price touches it. Then the order goes out.</p></div>' +
      '<div class="glass sp-w" style="left:140px;top:610px;width:820px;padding:24px 36px"><p class="fict" style="margin:0 0 10px">Worked example · fictional prices</p>' +
      '<p class="mono" style="margin:0;font-size:32px">You hold 0.01 BTC · stop at 59,500</p>' +
      '<p class="mono sp-w2" style="margin:12px 0 0;font-size:32px">0.01 × 59,480 = <span style="color:var(--main)">594.80 USDT</span></p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.sp-k').style; this.t = q('.sp-t'); this.def = q('.sp-def').style; this.an = q('.sp-an').style; this.w = q('.sp-w').style; this.w2 = q('.sp-w2').style;
    this.flow = q('.sp-flow').style; this.steps = all('.sp-step').map((e) => e.style); this.nums = all('.sp-num').map((e) => e.style);
    this.chart = q('.sp-chart').style; this.line = q('.sp-line'); this.dot = q('.sp-dot'); this.trg = q('.sp-trg').style; this.fill = q('.sp-fill').style; this.tr = q('.sp-tr').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.5, pose: 'explain' }, { t: 5.9, pose: 'point', flip: true }, { t: 12.2, pose: 'idea' }, { t: 18.8, pose: 'candles' }, { t: 22.4, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    UI.rise(this.flow, t, 1.0, { out: 18.0 });
    this.steps.forEach((s, i) => {
      const a = SP_STEPS[i][2];
      s.opacity = (0.3 + 0.7 * eo(seg(t, a, a + 0.5))).toFixed(3);
      this.nums[i].background = t > a ? 'color-mix(in srgb, var(--main) ' + (eo(seg(t, a, a + 0.5)) * 35).toFixed(0) + '%, transparent)' : 'transparent';
    });
    UI.rise(this.an, t, 12.3, { out: 18.2 });
    this.chart.opacity = eo(seg(t, 18.4, 19.0));
    const end = Math.max(18.6, Math.min(t, 25.4));
    this.line.setAttribute('d', UI.line(spP, 18.6, end, spX, spY));
    this.dot.setAttribute('cx', spX(end).toFixed(1)); this.dot.setAttribute('cy', spY(spP(end)).toFixed(1));
    const hit = seg(t, 21.6, 22.6);
    this.trg.opacity = t < 21.6 ? 1 : 0.4 + 0.6 * Math.abs(Math.cos(hit * Math.PI * 3));
    UI.rise(this.tr, t, 21.7);
    const fp = seg(t, 22.3, 22.8);
    this.fill.opacity = eo(fp);
    UI.rise(this.w, t, 18.9);
    UI.rise(this.w2, t, 22.6, { dy: 14 });
    this.tutor.render(t);
  },
});
