const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const BK_ASK = [[60010, 0.30], [60020, 0.55], [60030, 0.42], [60040, 0.61]];
const BK_BID = [[60000, 0.48], [59990, 0.35], [59980, 0.66], [59970, 0.52]];
kit.scene('book', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    this.spot = UI.spot(kit);
    const ex = '<div class="bk-ex" style="display:flex;flex-direction:column;gap:8px;padding:18px 24px;border-radius:16px;background:color-mix(in srgb, var(--ground) 70%, transparent);border:1.5px solid color-mix(in srgb, var(--main) 30%, transparent)">' +
      '<p class="fict" style="margin:0">Worked example · fictional prices</p>' +
      '<p class="mono" style="margin:0;font-size:30px">Spread = best ask − best bid</p>' +
      '<p class="mono" style="margin:0;font-size:30px">60,010 − 60,000 = <span style="color:var(--main)">10 USDT</span></p></div>';
    this.card = UI.tip(kit, 140, 222, 820, '4 · Order book', 'Orders waiting to trade', '<b>Asks</b> are sellers’ prices, on top. <b>Bids</b> are buyers’ prices, below. The best of each sit next to the middle.', ex);
    kit.stage.append(kit.h('<div class="chip bk-sp" style="position:absolute;left:1112px;top:417px;font-size:24px;padding:8px 18px;background:color-mix(in srgb, var(--ground) 70%, var(--main));border-color:var(--main)">Spread 10 →</div>'));
    kit.stage.append(kit.h('<div class="chip bk-mb" style="position:absolute;left:0;top:0;font-size:26px;padding:10px 22px;background:var(--main);color:var(--ground);border-color:var(--main)">Market buy 0.30 BTC</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.cs = this.card.style; this.ex = q('.bk-ex').style; this.sp = q('.bk-sp').style; this.mb = q('.bk-mb').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 6.8, pose: 'think' }, { t: 14.0, pose: 'magnify' }, { t: 17.2, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    const w = (i, k) => 0.03 * Math.sin(t * 1.3 + i * 2.1 + k);
    const hlA = eo(seg(t, 7.2, 7.6)) * (1 - eo(seg(t, 13.6, 14.0)));
    let asks, mid = 60000;
    const drain = seg(t, 15.0, 15.7), shift = eio(seg(t, 15.9, 16.5));
    if (t < 15.9) {
      asks = BK_ASK.map((a, i) => [a[0], i ? a[1] + w(i, 1) : a[1] * (1 - drain), i ? 0 : Math.max(hlA, Math.sin(Math.PI * seg(t, 14.9, 15.9))), i ? 1 : 1 - 0.7 * drain]);
    } else if (t < 16.5) {
      asks = BK_ASK.map((a, i) => i ? [a[0], a[1] + w(i, 1), 0, 1, i - shift] : [a[0], 0, 0, 0, 0]);
    } else {
      asks = [[60020, 0.55 + w(1, 1)], [60030, 0.42 + w(2, 1)], [60040, 0.61 + w(3, 1)], [60050, 0.47 + w(4, 1), 0, eo(seg(t, 16.5, 17.0))]];
    }
    if (t >= 15.6) mid = 60010;
    const bids = BK_BID.map((b, i) => [b[0], b[1] + (i ? w(i, 2) : 0), i ? 0 : hlA]);
    this.term.render(t, { sym: 'BTC', price: mid, book: { asks, bids }, mid });
    const pulse = Math.sin(Math.PI * seg(t, 15.6, 16.4));
    this.term.E.mid.style.transform = 'scale(' + (1 + 0.15 * pulse).toFixed(3) + ')';
    this.term.E.mid.style.display = 'inline-block';
    this.spot.set(UI.R.book, eo(seg(t, 0, 0.8)), eo(seg(t, 0.2, 1.0)));
    UI.show(this.cs, t, 0.8);
    this.ex.opacity = (0.25 + 0.75 * eo(seg(t, 6.8, 7.3))).toFixed(3);
    const s = seg(t, 7.6, 8.1);
    this.sp.opacity = (eo(s) * (1 - eo(seg(t, 13.6, 14.0)))).toFixed(3);
    this.sp.transform = 'translate(-100%,-50%) translateX(' + lerp(-20, 0, eo(s)).toFixed(1) + 'px)';
    // The market buy flies into the best ask, then is used up.
    const f = seg(t, 14.3, 15.1), mbIn = seg(t, 14.0, 14.4);
    const x0 = 900, y0 = 738, x1 = 1270, y1 = 199 + 185 + 16;
    this.mb.opacity = (eo(mbIn) * (1 - eo(seg(t, 14.85, 15.15)))).toFixed(3);
    this.mb.transform = 'translate(' + lerp(x0, x1, eio(f)).toFixed(1) + 'px,' + (lerp(y0, y1, eio(f)) - Math.sin(Math.PI * f) * 90).toFixed(1) + 'px) translate(-50%,-50%) scale(' + (lerp(0.7, 1, eob(mbIn, 1.6)) * lerp(1, 0.6, eio(f))).toFixed(4) + ')';
    this.tutor.render(t);
  },
});
