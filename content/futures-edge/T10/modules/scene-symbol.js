const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// [left, width, appears at] of the underline marks in the top bar.
const SY_MARK = [[390, 236, 1.6], [658, 170, 7.0], [886, 150, 9.2]];
kit.scene('symbol', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    this.spot = UI.spot(kit);
    let marks = '';
    SY_MARK.forEach((m) => { marks += '<div class="sy-m" style="position:absolute;left:' + m[0] + 'px;top:178px;width:' + m[1] + 'px;height:5px;border-radius:5px;background:var(--main);box-shadow:0 0 14px var(--main)"></div>'; });
    kit.stage.append(kit.h('<div>' + marks + '</div>'));
    const ex = '<div class="sy-ex" style="display:flex;flex-direction:column;gap:8px;padding:18px 24px;border-radius:16px;background:color-mix(in srgb, var(--ground) 70%, transparent);border:1.5px solid color-mix(in srgb, var(--main) 30%, transparent)">' +
      '<p class="fict" style="margin:0">Worked example · fictional prices</p>' +
      '<p class="mono sy-e1" style="margin:0;font-size:30px">24h ago 60,000 → now 61,200</p>' +
      '<p class="mono sy-e2" style="margin:0;font-size:30px">61,200 − 60,000 = <span style="color:var(--main)">+1,200 USDT</span></p>' +
      '<p class="mono sy-e3" style="margin:0;font-size:30px">1,200 ÷ 60,000 = <span style="color:var(--main)">+2.00%</span></p></div>';
    this.card = UI.tip(kit, 380, 222, 1000, '2 · Symbol bar', 'Which market, what price', 'A <b>symbol</b> is the short name of a market. BTCUSDT means BTC priced in USDT. “Perp” marks a futures contract: T11 explains.', ex);
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.cs = this.card.style; this.marks = all('.sy-m').map((e) => e.style);
    this.ex = ['.sy-e1', '.sy-e2', '.sy-e3'].map((s) => kit.stage.querySelector(s).style);
    this.exb = kit.stage.querySelector('.sy-ex').style;
    this.price = UI.path([[0, 60000], [13.0, 60000], [15.0, 61200], [30, 61200]]);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 6.8, pose: 'magnify' }, { t: 12.6, pose: 'present' }, { t: 16.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    const p = this.price(t) + (t < 12.6 ? UI.wig(t, 18) : 0);
    this.term.render(t, { sym: 'BTC', price: p, open24: 60000 });
    this.spot.set(UI.R.sym, eo(seg(t, 0, 0.8)), eo(seg(t, 0.2, 1.0)));
    UI.show(this.cs, t, 0.8);
    SY_MARK.forEach((m, i) => {
      const a = m[2], on = seg(t, a, a + 0.5), off = i === 0 ? seg(t, 6.6, 7.0) : seg(t, 12.0, 12.4);
      const st = this.marks[i];
      st.opacity = (eo(on) * (1 - eo(off)) + (t > 13.0 && i > 0 ? eo(seg(t, 13.0, 13.4)) : 0)).toFixed(3);
      st.transformOrigin = '0 50%'; st.transform = 'scaleX(' + eo(on).toFixed(3) + ')';
    });
    this.exb.opacity = (0.35 + 0.65 * eo(seg(t, 12.6, 13.0))).toFixed(3);
    [12.8, 14.6, 16.0].forEach((a, i) => { this.ex[i].opacity = eo(seg(t, a, a + 0.5)).toFixed(3); this.ex[i].transform = 'translateX(' + lerp(16, 0, eo(seg(t, a, a + 0.5))).toFixed(1) + 'px)'; });
    this.tutor.render(t);
  },
});
