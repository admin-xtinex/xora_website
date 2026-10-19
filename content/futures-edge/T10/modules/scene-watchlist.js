const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const WL_FULL = { x: 100, y: 120, w: 1720, h: 656 };
kit.scene('watchlist', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    this.spot = UI.spot(kit);
    this.card = UI.tip(kit, 450, 236, 860, '1 · Watchlist', 'Find the pair', 'A <b>watchlist</b> is a list of trading pairs you want to follow. Search for one, then tap it to open it.',
      '<p class="fict" style="margin:0">Educational mock · fictional prices</p>');
    kit.stage.append(kit.h('<div class="wl-tap" style="position:absolute;left:245px;top:336px;width:70px;height:70px;margin:-35px 0 0 -35px;border-radius:50%;border:4px solid var(--main);box-sizing:border-box"></div>'));
    kit.stage.append(kit.h('<div class="chip wl-sw" style="position:absolute;left:705px;top:236px;font-size:28px;padding:12px 26px;background:color-mix(in srgb, var(--ground) 70%, var(--main));border-color:var(--main)">Now showing BTCUSDT</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.cs = this.card.style; this.tap = q('.wl-tap').style; this.sw = q('.wl-sw').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'pointer', flip: true }, { t: 6.6, pose: 'typing' }, { t: 11.8, pose: 'point', flip: true }, { t: 13.8, pose: 'thumbs' }],
      says: [{ t0: 7.0, t1: 11.4, text: 'Search saves scrolling.' }],
    });
  },
  render(t) {
    this.chrome(t);
    const typed = 'BTC'.slice(0, Math.max(0, Math.min(3, Math.floor((t - 6.9) / 0.4) + 1)));
    const sw = t >= 12.9;
    this.term.render(t, { sym: sw ? 'BTC' : 'ETH', search: t >= 6.9 ? typed : '', typing: t > 6.4 && t < 12.2, filter: eio(seg(t, 8.2, 9.0)), sel: eo(seg(t, 12.1, 12.5)) * (1 - 0.6 * eo(seg(t, 14.5, 15.5))) });
    this.term.E.search.borderColor = 'color-mix(in srgb, var(--main) ' + (16 + 70 * eo(seg(t, 6.6, 7.0)) * (1 - eo(seg(t, 11.8, 12.2)))).toFixed(0) + '%, transparent)';
    const r = UI.spotAt([[0, UI.R.wl], [13.7, WL_FULL]], t, 0.9);
    this.spot.set(r, eo(seg(t, 0, 0.8)) * lerp(1, 0.25, eio(seg(t, 12.8, 13.7))), eo(seg(t, 0.2, 1.0)) * (1 - eio(seg(t, 12.8, 13.7))));
    UI.show(this.cs, t, 0.8, 12.5);
    const tp = seg(t, 12.0, 12.8);
    this.tap.opacity = (Math.sin(Math.PI * tp)).toFixed(3);
    this.tap.transform = 'scale(' + lerp(0.4, 1.4, eo(tp)).toFixed(3) + ')';
    const s = seg(t, 13.4, 14.0);
    this.sw.opacity = eo(s);
    this.sw.transform = 'translate(-50%,0) scale(' + lerp(0.8, 1, eob(s, 1.6)).toFixed(4) + ')';
    // The switch: a quick glow across the symbol bar and chart.
    const f = seg(t, 12.9, 13.9), g = Math.sin(Math.PI * f);
    this.term.panels[0].borderColor = this.term.panels[2].borderColor = 'color-mix(in srgb, var(--main) ' + (22 + 70 * g).toFixed(0) + '%, transparent)';
    this.tutor.render(t);
  },
});
