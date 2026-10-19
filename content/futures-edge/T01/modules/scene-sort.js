const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SORT_ITEMS = [['Bitcoin (BTC)', 0, 270, 695], ['Game points', 1, 945, 695], ['Ether (ETH)', 0, 480, 695], ['Bank balance', 1, 1155, 695], ['USDT', 0, 650, 695]];
const SORT_T0 = 1.6, SORT_STEP = 2.2;
kit.scene('sort', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const bin = (cls, x, label, col) => '<div class="glass ' + cls + '" style="left:' + x + 'px;top:600px;width:620px;height:180px;padding:18px 26px"><p class="kick" style="margin:0;color:' + col + '">' + label + '</p></div>';
    let chips = '';
    SORT_ITEMS.forEach((s) => { chips += '<span class="chip so-c" style="position:absolute;left:' + s[2] + 'px;top:' + s[3] + 'px;font-size:26px;padding:12px 22px;' + (s[1] ? '' : 'background:color-mix(in srgb, var(--ground) 70%, var(--main));border-color:var(--main)') + '">' + s[0] + '</span>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1300px"><p class="kick so-k">Quick check</p>' +
      '<h2 class="line so-t">Crypto, or not crypto?</h2></div>' +
      bin('so-b0', 140, 'Crypto', 'var(--main)') + bin('so-b1', 820, 'Not crypto', 'var(--accent)') + chips +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.so-k').style; this.t = q('.so-t');
    this.bins = [q('.so-b0').style, q('.so-b1').style];
    this.chips = [...kit.stage.querySelectorAll('.so-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'think' }, { t: 12.3, pose: 'explain' }],
      says: [{ t0: 12.5, t1: 15.8, text: 'USDT counts too. It is a crypto token.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const bp = seg(t, 0.6, 1.3);
    this.bins.forEach((b) => { b.opacity = eo(bp); b.transform = 'translateY(' + lerp(30, 0, eo(bp)) + 'px)'; });
    const glow = [0, 0];
    this.chips.forEach((c, i) => {
      const s = SORT_ITEMS[i], a = SORT_T0 + i * SORT_STEP;
      const show = seg(t, a, a + 0.4), move = seg(t, a + 1.3, a + 2.0);
      const sx = 790 - s[2], sy = 420 - s[3];
      const e = eio(move);
      c.opacity = eo(show);
      c.transformOrigin = '50% 50%';
      c.transform = 'translate(-50%,-50%) translate(' + (lerp(sx, 0, e) + (1 - e) * 0).toFixed(1) + 'px,' + (lerp(sy, 0, e) - Math.sin(Math.PI * move) * 60).toFixed(1) + 'px) scale(' + (lerp(1.3, 1, e) * lerp(0.7, 1, eob(show, 1.7))).toFixed(4) + ')';
      c.left = c.left; c.marginLeft = '0';
      const land = seg(t, a + 2.0, a + 2.6);
      if (land > 0 && land < 1) glow[s[1]] = Math.max(glow[s[1]], Math.sin(Math.PI * land));
    });
    this.bins.forEach((b, i) => { b.borderColor = 'color-mix(in srgb, ' + (i ? 'var(--accent)' : 'var(--main)') + ' ' + (22 + glow[i] * 60).toFixed(0) + '%, transparent)'; });
    this.tutor.render(t);
  },
});
