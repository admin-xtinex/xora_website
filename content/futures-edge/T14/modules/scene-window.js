const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
const WN_DEFS = [['Open', 'the first price in the window', 6.0], ['High', 'the highest price in the window', 9.0], ['Low', 'the lowest price in the window', 9.9], ['Close', 'the last price in the window', 7.6]];
// A fictional day of temperature, hour 6 to 18.
const WN_TK = [[6, 24], [7.5, 22], [10, 26], [14, 33], [16, 31], [18, 29]];
const wnTemp = (hr) => { let j = 1; while (j < WN_TK.length - 1 && WN_TK[j][0] < hr) j++; const a = WN_TK[j - 1], b = WN_TK[j], f = clamp01((hr - a[0]) / (b[0] - a[0])); return a[1] + (b[1] - a[1]) * (0.5 - 0.5 * Math.cos(Math.PI * f)); };
const wnTY = (c) => 650 - (c - 20) / 15 * 330, wnPY = (p) => 640 - (p - 59920) / 220 * 300;
const WN_A = 12.4, WN_B = 17.2;
kit.scene('window', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'wn-c', 2);
    let rows = '';
    WN_DEFS.forEach((d) => {
      rows += '<div class="wn-r" style="display:flex;align-items:center;gap:22px"><span class="chip" style="width:130px;justify-content:center;font-size:30px;padding:12px 0">' + d[0] + '</span><span style="font-size:32px;font-weight:600">' + d[1] + '</span></div>';
    });
    let ticks = '';
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r2 = i % 5 ? 132 : 122; ticks += '<line x1="' + (Math.sin(a) * 140).toFixed(1) + '" y1="' + (-Math.cos(a) * 140).toFixed(1) + '" x2="' + (Math.sin(a) * r2).toFixed(1) + '" y2="' + (-Math.cos(a) * r2).toFixed(1) + '"/>'; }
    const chip = (cls, label, y) => '<div class="' + cls + '" style="position:absolute;left:1150px;top:' + y + 'px;width:250px;display:flex;justify-content:space-between;align-items:baseline;padding:10px 18px;border-radius:14px;background:color-mix(in srgb, var(--ground) 84%, var(--main))"><span style="font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + label + '</span><span class="mono ' + cls + '-v" style="font-size:34px"></span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass wn-card" style="left:980px;top:220px;width:660px;height:560px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<g class="wn-clock"><g transform="translate(1170 480)"><circle r="150" stroke-width="3" style="fill:color-mix(in srgb, var(--main) 6%, transparent);stroke:color-mix(in srgb, var(--main) 40%, transparent)"/>' +
      '<path class="wn-sweep" style="fill:color-mix(in srgb, var(--main) 22%, transparent)"/>' +
      '<g stroke-width="3" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)">' + ticks + '</g>' +
      '<line class="wn-hand" x1="0" y1="0" x2="0" y2="-118" stroke-width="6" stroke-linecap="round" style="stroke:var(--main)"/><circle r="10" style="fill:var(--main)"/></g>' +
      '<text x="1170" y="690" text-anchor="middle" style="fill:var(--second);font-size:30px;font-weight:700">One window: 1 minute</text>' +
      '<text class="wn-sec mono" x="1170" y="300" text-anchor="middle" style="fill:var(--main);font-size:30px"></text></g>' +
      '<g class="wn-therm"><rect x="1036" y="300" width="44" height="370" rx="22" stroke-width="3" style="fill:color-mix(in srgb, var(--ground) 70%, var(--second));stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
      '<rect class="wn-merc" x="1048" width="20" rx="10" style="fill:var(--accent)"/>' +
      '<text x="1058" y="712" text-anchor="middle" class="mono wn-hr" style="fill:var(--second);font-size:26px"></text>' +
      '<text x="1518" y="292" text-anchor="middle" class="kick" style="fill:var(--main);font-size:20px">Day candle</text></g>' +
      this.cd.html + '</svg>' +
      chip('wn-o', 'First', 300) + chip('wn-h', 'Hottest', 374) + chip('wn-l', 'Coldest', 448) + chip('wn-cl', 'Last', 522) +
      '<p class="fict wn-tf" style="position:absolute;left:1150px;top:610px;width:300px;margin:0;line-height:1.5">One day · 6 am to 6 pm · example</p>' +
      '<div class="words" style="left:140px;top:170px;width:800px"><p class="kick wn-k">Four prices</p>' +
      '<h2 class="line wn-t">A candle sums up a time window</h2>' +
      '<div style="display:flex;flex-direction:column;gap:18px;margin-top:22px">' + rows + '</div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.wn-k').style; this.t = q('.wn-t'); this.card = q('.wn-card').style;
    this.rows = all('.wn-r').map((e) => e.style);
    this.clock = q('.wn-clock').style; this.hand = q('.wn-hand'); this.sweep = q('.wn-sweep'); this.sec = q('.wn-sec');
    this.therm = q('.wn-therm').style; this.merc = q('.wn-merc'); this.hr = q('.wn-hr'); this.tf = q('.wn-tf').style;
    this.chips = ['.wn-o', '.wn-h', '.wn-l', '.wn-cl'].map((s) => ({ st: q(s).style, v: q(s + '-v') }));
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 6.0, pose: 'checklist' }, { t: 11.8, pose: 'think' }, { t: 17.4, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.card, t, 0.6);
    this.rows.forEach((s, i) => {
      const a = WN_DEFS[i][2], p = seg(t, a, a + 0.5);
      s.opacity = eo(p); s.transform = 'translateX(' + lerp(26, 0, eo(p)).toFixed(1) + 'px)';
    });
    // Part 1: a 1-minute clock sweeps while the fictional minute builds a candle beside it.
    const out1 = 1 - ei(seg(t, 11.0, 11.6));
    this.clock.opacity = eo(seg(t, 0.8, 1.4)) * out1;
    const f = seg(t, 1.4, 5.6), a = f * Math.PI * 2;
    this.hand.setAttribute('transform', 'rotate(' + (f * 360).toFixed(1) + ')');
    const large = f > 0.5 ? 1 : 0;
    this.sweep.setAttribute('d', f <= 0 ? 'M0 0' : f >= 1 ? 'M0 -150 A150 150 0 1 1 -0.01 -150 Z' : 'M0 0 L0 -150 A150 150 0 ' + large + ' 1 ' + (Math.sin(a) * 150).toFixed(1) + ' ' + (-Math.cos(a) * 150).toFixed(1) + ' Z');
    UI.txt(this.sec, Math.round(f * 60) + ' s');
    const M = UI.MIN, i = M.at(f * 60);
    this.cd.set(0, { x: 1450, w: 64, o: 60000, h: M.hi[i], l: M.lo[i], c: M.px[i], y: wnPY, live: f < 1, op: eo(seg(t, 1.2, 1.6)) * out1 });
    // Part 2: a fictional day of temperature makes the same four numbers.
    const on2 = eo(seg(t, 11.6, 12.2));
    this.therm.opacity = on2; this.tf.opacity = 0.9 * on2;
    const d = seg(t, WN_A, WN_B), hr = 6 + 12 * d;
    let hi = 24, lo = 24;
    for (let h = 6; h <= hr + 1e-6; h += 0.05) { const v = wnTemp(h); hi = Math.max(hi, v); lo = Math.min(lo, v); }
    const cur = wnTemp(hr);
    const my = wnTY(cur);
    this.merc.setAttribute('y', my.toFixed(1)); this.merc.setAttribute('height', (658 - my).toFixed(1));
    const hh = Math.floor(hr), mm = Math.floor((hr - hh) * 60 / 15) * 15;
    UI.txt(this.hr, (hh > 12 ? hh - 12 : hh) + ':' + String(mm).padStart(2, '0') + (hh >= 12 ? ' pm' : ' am'));
    const vals = [24, Math.round(hi), Math.round(lo), Math.round(cur)];
    this.chips.forEach((c, k) => {
      c.st.opacity = on2 * (k === 0 ? 1 : eo(seg(t, WN_A + 0.2, WN_A + 0.6)));
      UI.txt(c.v, vals[k] + '°C');
      c.v.style.color = k === 3 && d >= 1 ? 'var(--up)' : 'var(--second)';
    });
    this.cd.set(1, { x: 1518, w: 64, o: 24, h: hi, l: lo, c: cur, y: wnTY, live: d < 1, op: on2 * eo(seg(t, WN_A, WN_A + 0.4)) });
    this.tutor.render(t);
  },
});
