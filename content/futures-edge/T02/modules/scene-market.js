const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MK_MID = 1390, MK_BX = 1110, MK_SX = 1670, MK_ROW = 460;
// Trades: buyer and seller agree at a price, slide to the middle and trade.
const MK_TRADES = [{ p: 60000, show: 2.4, go: 12.0 }, { p: 60050, show: 14.8, go: 17.8 }];
kit.scene('market', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const chip = (cls, x, y, txt, buy) => '<span class="chip ' + cls + '" style="position:absolute;left:' + x + 'px;top:' + y + 'px;font-size:26px;padding:12px 22px;' +
      (buy ? 'border-color:var(--main);background:color-mix(in srgb, var(--ground) 72%, var(--main))' : 'border-color:var(--accent);background:color-mix(in srgb, var(--ground) 72%, var(--accent))') + '"><span class="mono">' + txt + '</span></span>';
    let html = '';
    html += chip('mk-w', MK_BX, 580, 'Buy · 59,950', 1) + chip('mk-w', MK_BX, 660, 'Buy · 59,900', 1) + chip('mk-w', MK_SX, 580, 'Sell · 60,100', 0) + chip('mk-w', MK_SX, 660, 'Sell · 60,150', 0);
    MK_TRADES.forEach((tr, i) => {
      html += chip('mk-b' + i, MK_BX, MK_ROW, 'Buy · ' + UI.fmt(tr.p), 1) + chip('mk-s' + i, MK_SX, MK_ROW, 'Sell · ' + UI.fmt(tr.p), 0);
      html += '<span class="chip mk-f' + i + '" style="position:absolute;left:' + MK_MID + 'px;top:' + MK_ROW + 'px;font-size:28px;background:var(--main);color:var(--ground);border-color:var(--main)"><span class="mono">Trade · ' + UI.fmt(tr.p) + '</span></span>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:780px"><p class="kick mk-k">The marketplace</p>' +
      '<h2 class="line mk-t">Buyers and sellers meet</h2>' +
      '<p class="def mk-d1">A <b>buyer</b> pays to get BTC. A <b>seller</b> gives up BTC to get paid.</p>' +
      '<p class="def mk-d2">The <b>market price</b> is the price of the latest trade.</p></div>' +
      '<div class="glass mk-last" style="left:' + (MK_MID - 230) + 'px;top:180px;width:460px;padding:22px 30px;text-align:center"><p class="fict" style="margin:0 0 6px">Market price · BTC/USDT · fictional</p><p class="mono mk-lp" style="margin:0;font-size:60px"></p></div>' +
      '<p class="kick mk-h" style="position:absolute;left:' + MK_BX + 'px;top:380px;margin:0">Buyers</p>' +
      '<p class="kick mk-h" style="position:absolute;left:' + MK_SX + 'px;top:380px;margin:0;color:var(--accent)">Sellers</p>' +
      html + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)].map((e) => e.style);
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.d1 = q('.mk-d1'); this.d2 = q('.mk-d2');
    this.last = q('.mk-last').style; this.lp = q('.mk-lp'); this.hs = all('.mk-h'); this.ws = all('.mk-w');
    this.tr = MK_TRADES.map((x, i) => ({ b: q('.mk-b' + i).style, s: q('.mk-s' + i).style, f: q('.mk-f' + i).style }));
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'present' }, { t: 7.0, pose: 'explain' }, { t: 11.8, pose: 'point', flip: true }, { t: 16.8, pose: 'explain' }, { t: 19.2, pose: 'thumbs' }],
      says: [{ t0: 19.4, t1: 21.7, text: 'Every trade sets a new price.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d1, t, 7.0, { stagger: 0.06 });
    TextFx.fadeFromRight(this.d2, t, 16.8, { stagger: 0.06 });
    const lp = seg(t, 0.8, 1.5);
    this.last.opacity = eo(lp); this.last.transform = 'translateY(' + lerp(30, 0, eo(lp)) + 'px)';
    let price = 59950;
    MK_TRADES.forEach((tr, i) => { if (t >= tr.go + 1.0) price = tr.p; });
    UI.set(this.lp, UI.fmt(price));
    const flash = MK_TRADES.reduce((m, tr) => Math.max(m, Math.sin(Math.PI * seg(t, tr.go + 1.0, tr.go + 1.6))), 0);
    this.last.borderColor = 'color-mix(in srgb, var(--main) ' + (22 + flash * 70).toFixed(0) + '%, transparent)';
    this.hs.forEach((s, i) => { s.opacity = eo(seg(t, 1.2 + i * 0.3, 1.7 + i * 0.3)); s.transform = 'translate(-50%,-50%)'; });
    this.ws.forEach((s, i) => {
      const a = 1.6 + i * 0.25, p = seg(t, a, a + 0.5);
      s.opacity = eo(p) * 0.75;
      s.transform = 'translate(-50%,-50%) translateY(' + lerp(20, 0, eo(p)) + 'px)';
    });
    MK_TRADES.forEach((tr, i) => {
      const sh = seg(t, tr.show, tr.show + 0.5), mv = eio(seg(t, tr.go, tr.go + 1.0)), f = seg(t, tr.go + 0.95, tr.go + 1.4);
      const gone = 1 - seg(t, tr.go + 0.9, tr.go + 1.05);
      const fo = i === 0 ? 1 - ei(seg(t, MK_TRADES[1].show - 0.6, MK_TRADES[1].show)) : 1;
      this.tr[i].b.opacity = eo(sh) * gone;
      this.tr[i].s.opacity = eo(sh) * gone;
      this.tr[i].b.transform = 'translate(-50%,-50%) translateX(' + lerp(0, MK_MID - MK_BX - 110, mv).toFixed(1) + 'px) scale(' + lerp(0.7, 1, eob(sh, 1.7)).toFixed(3) + ')';
      this.tr[i].s.transform = 'translate(-50%,-50%) translateX(' + lerp(0, MK_MID - MK_SX + 110, mv).toFixed(1) + 'px) scale(' + lerp(0.7, 1, eob(sh, 1.7)).toFixed(3) + ')';
      this.tr[i].f.opacity = eo(f) * fo;
      this.tr[i].f.transform = 'translate(-50%,-50%) scale(' + lerp(0.6, 1, eob(f, 1.8)).toFixed(3) + ')';
    });
    this.tutor.render(t);
  },
});
