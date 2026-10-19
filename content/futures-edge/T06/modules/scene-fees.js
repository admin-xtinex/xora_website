const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Waterfall: gross +60, entry fee 3.00, exit fee 3.03, net 53.97 (5 px per USDT, baseline y 650).
const FE_K = 5, FE_B = 650, FE_X = [1050, 1185, 1320, 1455], FE_W = 96;
const FE_Y = (v) => FE_B - v * FE_K;
kit.scene('fees', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const cols = [['Gross', 'var(--main)'], ['Entry fee', 'var(--accent)'], ['Exit fee', 'var(--accent)'], ['Net', 'var(--main)']];
    let svg = '<line x1="1020" x2="1580" y1="' + FE_B + '" y2="' + FE_B + '" style="stroke:color-mix(in srgb, var(--second) 30%, transparent);stroke-width:2"/>';
    cols.forEach((c, i) => {
      svg += '<rect class="fe-bar" x="' + FE_X[i] + '" width="' + FE_W + '" rx="6" style="fill:' + c[1] + '"/>' +
        '<text class="fe-val mono" x="' + (FE_X[i] + FE_W / 2) + '" text-anchor="middle" style="fill:' + c[1] + ';font-size:26px"></text>' +
        '<text class="fe-lab" x="' + (FE_X[i] + FE_W / 2) + '" y="' + (FE_B + 36) + '" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 75%, var(--ground));font-size:24px;font-weight:600">' + c[0] + '</text>';
    });
    svg += '<path class="fe-link" d="M' + (FE_X[0] + FE_W) + ' ' + FE_Y(60) + ' H' + FE_X[1] + ' M' + (FE_X[1] + FE_W) + ' ' + FE_Y(57) + ' H' + FE_X[2] + ' M' + (FE_X[2] + FE_W) + ' ' + FE_Y(53.97) + ' H' + FE_X[3] + '" stroke-dasharray="6 6" style="stroke:color-mix(in srgb, var(--second) 40%, transparent);stroke-width:2;fill:none"/>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:820px"><p class="kick fe-k">Gross and net</p>' +
      '<h2 class="line fe-t">Fees come off</h2>' +
      '<p class="sub fe-s">Long 0.1 BTC, 60,000 → 60,600. Gross: <span class="hl">+60 USDT</span>.</p></div>' +
      '<div class="glass fe-d" style="left:140px;top:450px;width:820px;padding:20px 30px"><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600"><b class="hl">Fee</b> = notional value × fee rate. Charged on entry, and again on exit.</p></div>' +
      '<div class="glass fe-c" style="left:140px;top:596px;width:820px;padding:16px 30px"><p class="kick" style="margin:0 0 6px">Example rate 0.05% per side · made up</p>' +
      '<p class="mono fe-l1" style="margin:0;font-size:28px;line-height:1.4;white-space:pre">Entry: 6,000 × 0.05% = 3.00</p>' +
      '<p class="mono fe-l2" style="margin:0;font-size:28px;line-height:1.4;white-space:pre">Exit:  6,060 × 0.05% = 3.03</p>' +
      '<p class="mono fe-l3" style="margin:0;font-size:28px;line-height:1.4;white-space:pre">Net:   60 − 3.00 − 3.03 = <span class="hl">+53.97 USDT</span></p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><text x="1020" y="250" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">USDT · fictional example</text>' + svg + '</svg>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.fe-k').style; this.t = q('.fe-t'); this.s = q('.fe-s'); this.d = q('.fe-d').style; this.c = q('.fe-c').style;
    this.l = ['.fe-l1', '.fe-l2', '.fe-l3'].map((s) => q(s).style);
    this.bars = all('.fe-bar'); this.vals = all('.fe-val'); this.labs = all('.fe-lab').map((e) => e.style); this.link = q('.fe-link').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'present' }, { t: 6.2, pose: 'explain' }, { t: 12.8, pose: 'writing' }, { t: 24.2, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 0.9, { stagger: 0.06 });
    const dp = seg(t, 6.2, 6.8);
    this.d.opacity = eo(dp); this.d.transform = 'translateY(' + lerp(24, 0, eo(dp)).toFixed(1) + 'px)';
    const cp = seg(t, 12.6, 13.2);
    this.c.opacity = eo(cp); this.c.transform = 'translateY(' + lerp(24, 0, eo(cp)).toFixed(1) + 'px)';
    [13.0, 18.4, 20.8].forEach((a, i) => { this.l[i].opacity = eo(seg(t, a, a + 0.5)); });
    // Bars: gross grows up; each fee drops down from the running total; net grows up to what is left.
    const g = 60 * eio(seg(t, 1.6, 2.6)), f1 = 3.00 * eo(seg(t, 13.6, 14.3)), f2 = 3.03 * eo(seg(t, 19.0, 19.7)), n = 53.97 * eio(seg(t, 21.2, 22.4));
    const set = (i, top, bot, txt, ty, on) => {
      const b = this.bars[i], v = this.vals[i];
      b.setAttribute('y', Math.min(top, bot).toFixed(1)); b.setAttribute('height', Math.abs(bot - top).toFixed(1)); b.style.opacity = on ? 1 : 0;
      v.setAttribute('y', ty.toFixed(1)); if (v.textContent !== txt) v.textContent = txt; v.style.opacity = on ? 1 : 0;
      this.labs[i].opacity = eo(seg(t, 1.2, 1.7));
    };
    set(0, FE_Y(g), FE_B, '+' + g.toFixed(2), FE_Y(g) - 14, t > 1.6);
    set(1, FE_Y(60), FE_Y(60 - f1), '−' + f1.toFixed(2), FE_Y(60) - 14, t > 13.6);
    set(2, FE_Y(57), FE_Y(57 - f2), '−' + f2.toFixed(2), FE_Y(57) - 14, t > 19.0);
    set(3, FE_Y(n), FE_B, '+' + n.toFixed(2), FE_Y(n) - 14, t > 21.2);
    this.link.opacity = t > 22.4 ? eo(seg(t, 22.4, 22.9)) : 0;
    this.tutor.render(t);
  },
});
