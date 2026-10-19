const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const QT_COLS = 40, QT_ROWS = 25, QT_CELL = 12, QT_GAP = 2, QT_X = 1040, QT_Y = 300, QT_PICK = 0; // the highlighted piece
kit.scene('quantity', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cells = '';
    for (let r = 0; r < QT_ROWS; r++) for (let c = 0; c < QT_COLS; c++) cells += '<rect x="' + (QT_X + c * (QT_CELL + QT_GAP)) + '" y="' + (QT_Y + r * (QT_CELL + QT_GAP)) + '" width="' + QT_CELL + '" height="' + QT_CELL + '" rx="2"/>';
    const gw = QT_COLS * (QT_CELL + QT_GAP) - QT_GAP, gh = QT_ROWS * (QT_CELL + QT_GAP) - QT_GAP;
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<rect class="qt-whole" x="' + (QT_X - 14) + '" y="' + (QT_Y - 14) + '" width="' + (gw + 28) + '" height="' + (gh + 28) + '" rx="18" style="fill:color-mix(in srgb, var(--main) 18%, var(--ground));stroke:var(--main);stroke-width:3"/>' +
      '<g class="qt-cells" style="fill:color-mix(in srgb, var(--main) 55%, var(--ground))">' + cells + '</g>' +
      '<rect class="qt-pick" x="' + QT_X + '" y="' + QT_Y + '" width="' + QT_CELL + '" height="' + QT_CELL + '" rx="2" style="fill:var(--second);stroke:var(--accent);stroke-width:3"/>' +
      '<path class="qt-lead" d="M' + (QT_X + 7) + ' ' + (QT_Y + 7) + ' C ' + (QT_X - 60) + ' ' + (QT_Y + 60) + ', ' + (QT_X - 40) + ' ' + (QT_Y + 340) + ', ' + (QT_X + 30) + ' ' + (QT_Y + 404) + '" pathLength="1" fill="none" stroke-width="3" style="stroke:var(--accent)"/></svg>' +
      '<p class="mono qt-top" style="position:absolute;left:' + QT_X + 'px;top:200px;margin:0;font-size:40px">1 BTC <span style="color:color-mix(in srgb, var(--second) 55%, var(--ground))">=</span> <span class="hl">60,000 USDT</span></p>' +
      '<p class="qt-n" style="position:absolute;left:' + (QT_X + gw - 300) + 'px;top:252px;width:300px;margin:0;text-align:right;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">1,000 pieces</p>' +
      '<div class="glass qt-call" style="left:' + (QT_X + 40) + 'px;top:' + (QT_Y + 372) + 'px;width:520px;padding:16px 26px;border-color:var(--accent)"><p class="mono" style="margin:0;font-size:36px">0.001 BTC <span style="color:color-mix(in srgb, var(--second) 55%, var(--ground))">=</span> <span class="hv">60 USDT</span></p></div>' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick qt-k">Quantity</p>' +
      '<h2 class="line qt-t">1 BTC or a tiny piece</h2>' +
      '<p class="def qt-d"><b>Quantity</b> is how much of the base asset you buy or sell.</p>' +
      '<p class="sub qt-s">The price is always for one whole BTC. Your quantity can be much smaller.</p></div>' +
      '<p class="fict qt-f" style="position:absolute;left:140px;top:720px;margin:0">Fictional price</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.qt-k').style; this.t = q('.qt-t'); this.d = q('.qt-d'); this.s = q('.qt-s'); this.f = q('.qt-f').style;
    this.whole = q('.qt-whole').style; this.cells = [...q('.qt-cells').children].map((e) => e.style); this.pick = q('.qt-pick').style;
    this.lead = q('.qt-lead'); this.top = q('.qt-top').style; this.n = q('.qt-n').style; this.call = q('.qt-call').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 5.0, pose: 'present' }, { t: 10.0, pose: 'magnify' }, { t: 15.8, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    TextFx.fadeFromRight(this.s, t, 15.8, { stagger: 0.05 });
    this.f.opacity = 0.9 * eo(seg(t, 2.0, 2.6));
    const w = seg(t, 1.2, 1.9);
    this.top.opacity = eo(w);
    // One solid block, then it is cut into 1,000 pieces (a ripple from the top-left corner).
    this.whole.opacity = eo(w) * (1 - 0.75 * eo(seg(t, 5.2, 6.4)));
    this.cells.forEach((s, i) => {
      const r = Math.floor(i / QT_COLS), c = i % QT_COLS, a = 5.0 + (r + c) / (QT_ROWS + QT_COLS) * 1.8;
      s.opacity = (eo(seg(t, a, a + 0.3)) * (t > 10.2 ? lerp(1, 0.45, eo(seg(t, 10.2, 10.8))) : 1)).toFixed(3);
    });
    this.n.opacity = eo(seg(t, 6.6, 7.1));
    const p = seg(t, 10.0, 10.6);
    this.pick.opacity = eo(p);
    this.pick.transformBox = 'fill-box'; this.pick.transformOrigin = 'center';
    this.pick.transform = 'scale(' + lerp(1, 2.2, eob(p, 1.8)) + ')';
    this.lead.setAttribute('stroke-dasharray', eio(seg(t, 10.6, 11.4)) + ' 1');
    const c = seg(t, 11.2, 11.8);
    this.call.opacity = eo(c); this.call.transform = 'translateY(' + lerp(20, 0, eo(c)) + 'px)';
    this.tutor.render(t);
  },
});
