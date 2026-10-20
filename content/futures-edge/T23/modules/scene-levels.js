const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Range box, support and resistance zones on the 15 one-minute candles.
const LV_ROWS = [['High', '60,650', 1.4], ['Low', '59,850', 3.0], ['Range', '800 ≈ 1.3%', 7.4], ['Support', '59,850 – 59,950', 11.8], ['Resistance', '60,550 – 60,650', 18.0], ['Now', '60,000', 20.6]];
kit.scene('levels', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Step 3 of 8 · Range and levels', 'Where are the edges?');
    this.track = UI.track(kit, 3);
    this.c1 = UI.chart1(kit, 'lv', { vol: true, draw: 0.6, k: 0.06 });
    const D = UI.D, X = D.x1, Y = D.y1;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<g class="lv-rs">' + UI.band(60550, 60650, 'var(--accent)', 160, 1040) + '</g>' +
      '<g class="lv-sp">' + UI.band(59850, 59950, 'var(--main)', 160, 1040) + '</g>' +
      '<rect class="lv-box" x="172" y="' + Y(60650).toFixed(1) + '" width="' + (X(14) + 20 - 172) + '" height="' + (Y(59850) - Y(60650)).toFixed(1) + '" rx="8" fill="none" stroke-width="3" stroke-dasharray="10 8" style="stroke:var(--second)"/>' +
      '<path class="lv-br" d="M748 ' + (Y(60650) + 4).toFixed(1) + ' V' + (Y(59850) - 4).toFixed(1) + ' M736 ' + (Y(60650) + 16).toFixed(1) + ' L748 ' + (Y(60650) + 4).toFixed(1) + ' L760 ' + (Y(60650) + 16).toFixed(1) + ' M736 ' + (Y(59850) - 16).toFixed(1) + ' L748 ' + (Y(59850) - 4).toFixed(1) + ' L760 ' + (Y(59850) - 16).toFixed(1) + '" fill="none" stroke-width="3" style="stroke:var(--second)"/>' +
      '<circle class="lv-hi" cx="' + X(2) + '" cy="' + (Y(60650) - 14).toFixed(1) + '" r="9" style="fill:var(--accent)"/>' +
      '<circle class="lv-lo" cx="' + X(11) + '" cy="' + (Y(59850) + 14).toFixed(1) + '" r="9" style="fill:var(--main)"/>' +
      '<circle class="lv-t" cx="' + X(7) + '" cy="' + Y(59860).toFixed(1) + '" r="22" fill="none" stroke-width="3" style="stroke:var(--main)"/>' +
      '<circle class="lv-t" cx="' + X(11) + '" cy="' + Y(59850).toFixed(1) + '" r="22" fill="none" stroke-width="3" style="stroke:var(--main)"/>' +
      '<line class="lv-now" x1="' + (X(14) + 14) + '" x2="1040" y1="' + Y(60000).toFixed(1) + '" y2="' + Y(60000).toFixed(1) + '" pathLength="1" stroke-width="3" style="stroke:var(--second)"/>' +
      '</svg>');
    kit.stage.append(svg);
    const tag = (s, x, y, c) => { const e = kit.h('<p class="tag" style="left:' + x + 'px;top:' + y + 'px;border-color:' + c + '">' + s + '</p>'); kit.stage.append(e); return e.style; };
    this.tHi = tag('High 60,650', 300, 306, 'var(--accent)');
    this.tLo = tag('Low 59,850', 300, Y(59850) + 30, 'var(--main)');
    this.tRg = tag('800 USDT ≈ 1.3%', 774, Y(60250) - 22, 'var(--second)');
    this.tNow = tag('Now 60,000', 800, Y(60000) - 56, 'var(--second)');
    this.tRs = tag('Resistance zone', 790, Y(60650) - 54, 'var(--accent)');
    let rows = '';
    LV_ROWS.forEach((r, i) => {
      rows += '<div class="lv-r" style="display:flex;align-items:baseline;justify-content:space-between;padding:12px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)">' +
        '<span style="font-size:28px;color:color-mix(in srgb, var(--second) 72%, var(--ground))">' + r[0] + '</span><span class="mono" style="font-size:32px;color:' + (i === 3 ? 'var(--main)' : i === 4 ? 'var(--accent)' : 'var(--second)') + '">' + r[1] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="glass lv-p" style="left:1180px;top:290px;width:600px;padding:20px 32px"><p class="kick" style="margin:0 0 4px">Last 15 minutes · USDT</p>' + rows + '</div>'));
    const q = (s) => svg.querySelector(s), all = (s) => [...svg.querySelectorAll(s)];
    this.rs = q('.lv-rs').style; this.sp = q('.lv-sp').style; this.box = q('.lv-box').style; this.br = q('.lv-br').style;
    this.hi = q('.lv-hi').style; this.lo = q('.lv-lo').style; this.tc = all('.lv-t').map((e) => e.style); this.now = q('.lv-now');
    this.p = kit.stage.querySelector('.lv-p').style; this.rows = [...kit.stage.querySelectorAll('.lv-r')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'magnify' }, { t: 7.2, pose: 'point' }, { t: 11.6, pose: 'candles', flip: true }, { t: 17.8, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t); this.track(t);
    this.c1.render(t);
    const pop = (s, a) => { const p = seg(t, a, a + 0.45); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = 'center'; s.transform = 'scale(' + lerp(0.3, 1, eob(p, 2)).toFixed(3) + ')'; };
    pop(this.hi, 1.4); pop(this.lo, 3.0);
    UI.rise(kit, this.tHi, t, 1.6, 0.5, 12); UI.rise(kit, this.tLo, t, 3.2, 0.5, 12);
    this.box.opacity = eo(seg(t, 7.2, 7.8)); this.br.opacity = eo(seg(t, 7.6, 8.1));
    UI.rise(kit, this.tRg, t, 7.8, 0.5, 12);
    this.sp.opacity = eo(seg(t, 11.8, 12.6));
    this.tc.forEach((s, i) => pop(s, 12.8 + i * 1.2));
    this.rs.opacity = eo(seg(t, 18.0, 18.8));
    UI.rise(kit, this.tRs, t, 18.3, 0.5, 12);
    this.now.setAttribute('stroke-dasharray', eio(seg(t, 20.6, 21.4)).toFixed(3) + ' 1');
    UI.rise(kit, this.tNow, t, 21.0, 0.5, 12);
    UI.rise(kit, this.p, t, 1.0, 0.6, 24);
    this.rows.forEach((s, i) => { s.opacity = eo(seg(t, LV_ROWS[i][2], LV_ROWS[i][2] + 0.4)); });
    this.tutor.render(t);
  },
});
