const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const US_T0 = 0.8, US_T1 = 19.0, US_W = 560, US_H = 170;
const usBtc = (t) => 60000 + 1500 * Math.sin(t * 0.9) + 700 * Math.sin(t * 2.3 + 1) + 300 * Math.sin(t * 5.9);
const usUsdt = (t) => 1 + 0.0006 * Math.sin(t * 1.7) + 0.0003 * Math.sin(t * 4.3 + 2);
// [title, fn, lo, hi, grid labels, colour, appears at]
const US = [['BTC price in USDT · swings a lot', usBtc, 56000, 64000, [57000, 60000, 63000], 'var(--main)', 0.6], ['USDT price in US dollars · designed to stay near 1', usUsdt, 0.97, 1.03, [0.98, 1.00, 1.02], 'var(--accent)', 6.0]];
kit.scene('usdt', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let charts = '';
    US.forEach((c, i) => {
      let grid = '';
      c[4].forEach((p) => { const y = US_H - (p - c[2]) / (c[3] - c[2]) * US_H; grid += '<line x1="0" x2="' + US_W + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" style="stroke:color-mix(in srgb, var(--second) 8%, transparent);stroke-width:1.5"/><text x="' + (US_W + 16) + '" y="' + (y + 8).toFixed(1) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 50%, var(--ground));font-size:22px">' + (p < 10 ? p.toFixed(2) : UI.fmt(p)) + '</text>'; });
      charts += '<div class="glass us-c' + i + '" style="left:1000px;top:' + (180 + i * 270) + 'px;width:780px;height:250px;padding:18px 30px">' +
        '<p class="kick" style="margin:0 0 14px;font-size:20px;color:' + c[5] + '">' + c[0] + '</p>' +
        '<svg width="' + (US_W + 120) + '" height="' + US_H + '" style="display:block;overflow:visible">' + grid + '<path class="us-l' + i + '" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:' + c[5] + '"/></svg></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' + charts +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick us-k">The quote asset</p>' +
      '<h2 class="line us-t">USDT, a stablecoin</h2>' +
      '<p class="def us-d">A <b>stablecoin</b> is a token designed to stay close to the value of a currency. USDT aims for 1 US dollar.</p></div>' +
      '<div class="chip us-ch" style="position:absolute;left:140px;top:620px">A steady measuring stick for prices</div>' +
      '<p class="us-w" style="position:absolute;left:140px;top:712px;margin:0;font-size:30px;font-weight:700;color:var(--accent)">Designed to stay is not guaranteed.</p>' +
      '<p class="fict us-f" style="position:absolute;left:1000px;top:730px;margin:0">Illustrative paths, not real data</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.us-k').style; this.t = q('.us-t'); this.d = q('.us-d'); this.ch = q('.us-ch').style; this.w = q('.us-w'); this.f = q('.us-f').style;
    this.c = US.map((c, i) => ({ box: q('.us-c' + i).style, l: q('.us-l' + i) }));
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'pointer', flip: true }, { t: 0.6, pose: 'explain' }, { t: 6.0, pose: 'point', flip: true }, { t: 11.4, pose: 'idea' }, { t: 15.0, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.05 });
    US.forEach((c, i) => {
      const C = this.c[i], a = c[6], p = seg(t, a, a + 0.6);
      C.box.opacity = eo(p); C.box.transform = 'translateX(' + lerp(40, 0, eo(p)) + 'px)';
      let d = '';
      const end = Math.min(Math.max(t, US_T0), US_T1);
      for (let x = US_T0; x <= end + 1e-6; x += 0.05) d += (x > US_T0 ? 'L' : 'M') + ((x - US_T0) / (US_T1 - US_T0) * US_W).toFixed(1) + ' ' + (US_H - (c[1](x) - c[2]) / (c[3] - c[2]) * US_H).toFixed(1);
      C.l.setAttribute('d', d || 'M0 0');
    });
    const ch = seg(t, 11.4, 11.9);
    this.ch.opacity = eo(ch); this.ch.transform = 'scale(' + lerp(0.8, 1, eob(ch, 1.7)) + ')'; this.ch.transformOrigin = '0 50%';
    TextFx.fadeFromRight(this.w, t, 14.2, { stagger: 0.05 });
    this.f.opacity = 0.9 * eo(seg(t, 1.2, 1.8));
    this.tutor.render(t);
  },
});
