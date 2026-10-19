const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const CK_ITEMS = [['Your real fee rate and account tier', 4.2], ['The spread right now', 6.3], ['How deep the book is (slippage)', 8.4], ['The funding rate and the next funding time', 10.9], ['Does the move you expect beat the break-even move?', 13.4]];
kit.scene('check', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let items = '';
    CK_ITEMS.forEach((s) => {
      items += '<div class="ck-i" style="display:flex;align-items:center;gap:24px;padding:12px 0"><svg width="48" height="48" viewBox="0 0 52 52" style="flex:none"><rect x="4" y="4" width="44" height="44" rx="10" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 50%, transparent)"/>' +
        '<path class="ck-tick" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg><span style="font-size:32px;font-weight:600">' + s[0] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1400px"><p class="kick ck-k">Before any trade</p>' +
      '<h2 class="line ck-t">Check your real costs</h2></div>' +
      '<div class="glass ck-l" style="left:140px;top:330px;width:1000px;padding:16px 36px">' + items + '</div>' +
      '<div class="glass ck-n" style="left:1210px;top:380px;width:520px;padding:30px 34px;border-color:var(--accent)"><p class="kick" style="margin:0 0 12px;color:var(--accent)">If the answer is no</p>' +
      '<p class="mono" style="margin:0;font-size:52px;color:var(--accent)">NO_TRADE</p><p style="margin:10px 0 0;font-size:28px;line-height:1.4">Waiting costs nothing. A trade that cannot beat its costs is not worth taking.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ck-k').style; this.t = q('.ck-t'); this.l = q('.ck-l').style; this.n = q('.ck-n').style;
    this.items = all('.ck-i').map((e) => e.style); this.ticks = all('.ck-tick');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.5, pose: 'checklist' }, { t: 13.4, pose: 'think' }, { t: 17.5, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.l, t, 0.8);
    this.items.forEach((s, i) => {
      const a = CK_ITEMS[i][1];
      s.opacity = (0.25 + 0.75 * eo(seg(t, a, a + 0.4))).toFixed(3);
      s.transform = 'translateX(' + lerp(16, 0, eo(seg(t, a, a + 0.5))).toFixed(1) + 'px)';
      this.ticks[i].setAttribute('stroke-dasharray', eo(seg(t, a + 0.5, a + 0.9)).toFixed(3) + ' 1');
    });
    UI.rise(this.n, t, 17.6);
    this.tutor.render(t);
  },
});
