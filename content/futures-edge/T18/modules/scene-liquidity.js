const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A 2 BTC market buy against two fictional books. Busy: all 2 BTC at 60,000. Thin: 1 at 60,000 + 1 at 60,100, average 60,050.
const LQ_P = [60200, 60100, 60000], LQ_S = [[7, 6, 5], [1, 1.5, 1]];
const lqL = (k) => (k ? 960 : 140), lqY = (i) => 420 + i * 72, LQ_U = 62;
const LQ_GO = [6.0, 10.0];
// Size left at each level for book k at time t (the order eats from 60,000 upward).
const lqLeft = (k, t) => {
  const s = LQ_S[k].slice(), a = LQ_GO[k] + 0.9;
  if (k === 0) { s[2] = 5 - 2 * eio(seg(t, a, a + 0.8)); }
  else { s[2] = 1 - eio(seg(t, a, a + 0.6)); s[1] = 1.5 - eio(seg(t, a + 0.7, a + 1.3)); }
  return s;
};
kit.scene('liquidity', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const book = (k) => {
      const L = lqL(k), col = k ? 'var(--accent)' : 'var(--main)';
      let rows = '';
      LQ_P.forEach((p, i) => {
        rows += '<span class="mono" style="position:absolute;left:' + (L + 34) + 'px;top:' + (lqY(i) - 18) + 'px;font-size:28px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">' + UI.fmt(p) + '</span>' +
          '<i class="lq-b' + k + '" style="position:absolute;left:' + (L + 190) + 'px;top:' + (lqY(i) - 20) + 'px;height:40px;width:' + LQ_U + 'px;border-radius:8px;transform-origin:0 50%;background:color-mix(in srgb, var(--down) 55%, transparent)"></i>' +
          '<span class="mono lq-n' + k + '" style="position:absolute;top:' + (lqY(i) - 16) + 'px;font-size:26px"></span>';
      });
      return '<div class="glass lq-c" style="left:' + L + 'px;top:300px;width:760px;height:470px"></div>' +
        '<p class="kick" style="position:absolute;left:' + (L + 34) + 'px;top:322px;margin:0;color:' + col + '">' + (k ? 'Thin book · few orders' : 'Busy book · many orders') + '</p>' +
        '<p class="fict" style="position:absolute;left:' + (L + 34) + 'px;top:360px;margin:0">Waiting sell orders</p>' + rows +
        '<p class="chip lq-o' + k + '" style="position:absolute;left:0;top:0;margin:0;font-size:26px;padding:10px 22px;background:color-mix(in srgb, var(--ground) 60%, var(--up));border-color:var(--up)">Market buy 2 BTC</p>' +
        '<p class="mono lq-f' + k + '" style="position:absolute;left:' + (L + 34) + 'px;top:640px;margin:0;font-size:28px">' + (k ? '1 @ 60,000 + 1 @ 60,100' : 'Filled 2 BTC @ 60,000') + '</p>' +
        '<p class="mono lq-g' + k + '" style="position:absolute;left:' + (L + 34) + 'px;top:694px;margin:0;font-size:28px">' + (k ? 'Average <span class="dn">60,050</span> · +50 per BTC' : 'Average <span class="up">60,000</span> · no slippage') + '</p>';
    };
    kit.stage.append(kit.h('<div class="ground">' + book(0) + book(1) +
      '<p class="tag lq-q" style="left:1440px;top:586px;color:var(--accent);border-color:var(--accent)">Common in quiet times</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick lq-k">Liquidity context</p>' +
      '<h2 class="line lq-t">Busy book, thin book</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.lq-k').style; this.t = q('.lq-t'); this.cs = all('.lq-c').map((e) => e.style); this.qq = q('.lq-q').style;
    this.B = [0, 1].map((k) => ({ b: all('.lq-b' + k).map((e) => e.style), n: all('.lq-n' + k), o: q('.lq-o' + k).style, f: q('.lq-f' + k).style, g: q('.lq-g' + k).style }));
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'confused' }, { t: 0.6, pose: 'explain' }, { t: 6.0, pose: 'point', flip: true }, { t: 10.0, pose: 'magnify' }, { t: 14.4, pose: 'checklist' }, { t: 18.9, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cs.forEach((s, k) => UI.rise(s, t, 0.8 + k * 0.3));
    this.B.forEach((o, k) => {
      const left = lqLeft(k, t), L = lqL(k);
      o.b.forEach((s, i) => {
        const a = 1.4 + k * 0.6 + i * 0.2, w = left[i] * LQ_U * eo(seg(t, a, a + 0.6));
        s.opacity = eo(seg(t, a, a + 0.3)); s.width = w.toFixed(1) + 'px';
        const n = o.n[i]; n.style.left = (L + 190 + w + 16).toFixed(1) + 'px'; n.style.opacity = eo(seg(t, a + 0.4, a + 0.7));
        const v = Math.round(left[i] * 10) / 10;
        UI.txt(n, (v === 0 ? '0' : UI.fmt(v, v % 1 ? 1 : 0)) + ' BTC');
      });
      // The order chip rises from below and stops just under the 60,000 level.
      const a = LQ_GO[k], up = eio(seg(t, a, a + 0.8));
      o.o.opacity = (eo(seg(t, a - 0.3, a)) * (1 - ei(seg(t, a + 2.6, a + 3.0)))).toFixed(3);
      o.o.transform = 'translate(' + (L + 190) + 'px,' + lerp(680, 574, up).toFixed(1) + 'px)';
      UI.rise(o.f, t, a + 2.0, { dy: 12 });
      UI.rise(o.g, t, k ? 14.6 : 7.6, { dy: 12 });
    });
    UI.rise(this.qq, t, 19.1, { dy: 10 });
    this.tutor.render(t);
  },
});
