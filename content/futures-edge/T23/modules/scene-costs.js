const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The plan in numbers: stop distance, budget, fees, notional, and the two planned outcomes.
const CS = [['Demo account', '1,000 USDT', 1.0, 'var(--second)'], ['Stop distance', '300 = 0.5%', 8.6, 'var(--accent)'], ['Risk budget (example)', '6 USDT', 14.0, 'var(--second)'],
  ['Fees, 0.05% each way', '≈ 1 USDT', 15.8, 'var(--second)'], ['Left for the price move', '5 USDT', 17.8, 'var(--second)'], ['Notional ≈ 5 ÷ 0.5%', '', 20.8, 'var(--main)'],
  ['If the stop is hit', '≈ −6 USDT', 26.6, 'var(--down)'], ['If the target is hit', '≈ +9 USDT', 29.4, 'var(--up)']];
kit.scene('costs', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Step 5 of 8 · Costs and risk', 'Do the maths first');
    this.track = UI.track(kit, 5);
    this.c1 = UI.chart1(kit, 'cs');
    const D = UI.D, Y = D.y1, xb = 1000;
    const br = (a, b, c) => '<path d="M' + xb + ' ' + (Y(a)).toFixed(1) + ' V' + Y(b).toFixed(1) + ' M' + (xb - 12) + ' ' + Y(a).toFixed(1) + ' H' + (xb + 12) + ' M' + (xb - 12) + ' ' + Y(b).toFixed(1) + ' H' + (xb + 12) + '" fill="none" stroke-width="3" style="stroke:' + c + '"/>';
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<g class="cs-en">' + UI.hline(60000, 'var(--second)') + '</g><g class="cs-sl">' + UI.hline(59700, 'var(--accent)', '12 8') + '</g><g class="cs-tg">' + UI.hline(60600, 'var(--main)', '12 8') + '</g>' +
      '<g class="cs-b1">' + br(60000, 59700, 'var(--accent)') + '</g><g class="cs-b2">' + br(60600, 60000, 'var(--main)') + '</g></svg>');
    kit.stage.append(svg);
    const tag = (s, x, y, c) => { const e = kit.h('<p class="tag" style="left:' + x + 'px;top:' + y.toFixed(0) + 'px;border-color:' + c + '">' + s + '</p>'); kit.stage.append(e); return e.style; };
    this.tEn = tag('Entry ≈ 60,000', 750, Y(60000) - 52, 'var(--second)');
    this.tSl = tag('Stop 59,700 · −0.5%', 690, Y(59700) + 8, 'var(--accent)');
    this.tTg = tag('Target 60,600 · +1%', 690, Y(60600) - 52, 'var(--main)');
    this.tLv = tag('1x exposure · no leverage', 200, 306, 'var(--main)');
    let rows = '';
    CS.forEach((r, i) => {
      rows += '<div class="cs-r" style="display:flex;align-items:baseline;justify-content:space-between;padding:6px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)' + (i === 5 ? ';border-bottom-color:var(--main)' : '') + '">' +
        '<span style="font-size:27px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">' + r[0] + '</span><span class="mono cs-v" style="font-size:30px;color:' + r[3] + '">' + r[1] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="glass cs-p" style="left:1180px;top:286px;width:600px;padding:18px 30px"><p class="kick" style="margin:0 0 2px">Example only · not advice</p>' + rows + '</div>'));
    const q = (s) => svg.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.en = q('.cs-en line'); this.sl = q('.cs-sl line'); this.tg = q('.cs-tg line'); this.b1 = q('.cs-b1').style; this.b2 = q('.cs-b2').style;
    this.p = kit.stage.querySelector('.cs-p').style; this.rows = all('.cs-r').map((e) => e.style); this.vs = all('.cs-v');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'laptop' }, { t: 7.4, pose: 'point' }, { t: 13.8, pose: 'typing' }, { t: 20.6, pose: 'idea' }, { t: 26.4, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t); this.track(t);
    this.c1.render(t, lerp(1, 0.6, eo(seg(t, 7.4, 8.0))));
    this.en.parentNode.style.opacity = eo(seg(t, 7.6, 8.2));
    this.sl.parentNode.style.opacity = eo(seg(t, 8.6, 9.2));
    this.tg.parentNode.style.opacity = eo(seg(t, 27.0, 27.6));
    this.b1.opacity = eo(seg(t, 9.4, 9.9)); this.b2.opacity = eo(seg(t, 27.8, 28.3));
    UI.rise(kit, this.tEn, t, 7.8, 0.5, 12); UI.rise(kit, this.tSl, t, 8.8, 0.5, 12); UI.rise(kit, this.tTg, t, 27.2, 0.5, 12); UI.rise(kit, this.tLv, t, 23.6, 0.5, 12);
    UI.rise(kit, this.p, t, 0.8, 0.6, 24);
    CS.forEach((r, i) => { const p = seg(t, r[2], r[2] + 0.4); this.rows[i].opacity = lerp(0, 1, eo(p)).toFixed(3); this.rows[i].transform = 'translateX(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)'; });
    UI.set(this.vs[0], UI.fmt(Math.round(1000 * eo(seg(t, 1.2, 2.0)))) + ' USDT');
    UI.set(this.vs[5], UI.fmt(Math.round(1000 * eo(seg(t, 21.2, 22.6)) / 10) * 10) + ' USDT');
    this.tutor.render(t);
  },
});
