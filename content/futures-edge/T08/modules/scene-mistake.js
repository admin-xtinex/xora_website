const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Ten fictional trades with a 1 : 3 plan (risk 5, reward 15 USDT): only 2 wins.
const MS_SEQ = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0], MS_T0 = 6.8, MS_DT = 0.55;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let tiles = '';
    MS_SEQ.forEach((w, i) => {
      tiles += '<div class="glass ms-tl" style="left:' + (140 + i * 142) + 'px;top:560px;width:128px;height:104px;padding:12px 0;text-align:center;border-radius:18px;border-color:' + (w ? 'var(--main)' : 'color-mix(in srgb, var(--accent) 60%, transparent)') + '">' +
        '<p style="margin:0;font-size:28px;font-weight:700;color:' + (w ? 'var(--main)' : 'var(--accent)') + '">' + (w ? 'Win' : 'Loss') + '</p><p class="mono" style="margin:4px 0 0;font-size:28px">' + (w ? '+15' : '−5') + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1500px"><p class="kick ms-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line ms-t">"1 to 2 means I will probably win"</h2></div>' +
      '<div class="glass ms-m" style="left:140px;top:340px;width:760px;padding:26px 36px;border-color:color-mix(in srgb, var(--accent) 50%, transparent)"><p class="kick" style="margin:0 0 10px;color:var(--accent)">The belief</p>' +
      '<p style="position:relative;margin:0;font-size:32px;line-height:1.4;font-weight:600">A good ratio makes a win likely.<span class="ms-x" style="position:absolute;left:-6px;right:-6px;top:50%;height:5px;border-radius:4px;background:var(--accent)"></span></p></div>' +
      '<div class="glass ms-c" style="left:960px;top:340px;width:780px;padding:26px 36px;border-color:var(--main)"><p class="kick" style="margin:0 0 10px">The correction</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">Risk/reward is about <span style="color:var(--main)">size</span>. How often you win is a separate question.</p></div>' +
      tiles +
      '<div class="ms-sum" style="position:absolute;left:140px;top:694px;display:flex;align-items:baseline;gap:26px"><span style="font-size:28px">Plan 1 : 3 · <b class="ms-wl"></b></span><span style="font-size:28px">Total</span><span class="mono ms-tot" style="font-size:44px"></span></div>' +
      '<p class="fict ms-f" style="position:absolute;left:1240px;top:712px;margin:0">Ten fictional trades</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ms-k').style; this.t = q('.ms-t'); this.m = q('.ms-m').style; this.x = q('.ms-x').style; this.c = q('.ms-c').style;
    this.tl = all('.ms-tl').map((e) => e.style); this.sum = q('.ms-sum').style; this.wl = q('.ms-wl'); this.tot = q('.ms-tot'); this.f = q('.ms-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'confused' }, { t: 6.2, pose: 'checklist' }, { t: 13.6, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.m, t, 1.0);
    this.x.transformOrigin = '0 50%'; this.x.transform = 'scaleX(' + eio(seg(t, 6.2, 6.8)) + ')';
    let total = 0, w = 0, n = 0;
    this.tl.forEach((s, i) => {
      const a = MS_T0 + i * MS_DT;
      UI.rise(s, t, a, { dy: 24, s: 0.8 });
      if (t >= a + 0.2) { n++; if (MS_SEQ[i]) { w++; total += 15; } else total -= 5; }
    });
    this.sum.opacity = eo(seg(t, MS_T0, MS_T0 + 0.4));
    this.f.opacity = 0.9 * eo(seg(t, MS_T0, MS_T0 + 0.4));
    UI.txt(this.wl, w + (w === 1 ? ' win, ' : ' wins, ') + (n - w) + (n - w === 1 ? ' loss' : ' losses'));
    UI.txt(this.tot, (total > 0 ? '+' : total < 0 ? '−' : '') + Math.abs(total).toFixed(2) + ' USDT');
    this.tot.style.color = total < 0 ? 'var(--accent)' : total > 0 ? 'var(--main)' : 'var(--second)';
    UI.rise(this.c, t, 13.7);
    this.tutor.render(t);
  },
});
