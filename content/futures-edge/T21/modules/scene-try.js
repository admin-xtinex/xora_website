const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Try it: three new candles are revealed one at a time (wick to 60,070, closes inside the zone, falling volume); BUY / SELL / WAIT; answer C.
const TY_N = [[59970, 60070, 59960, 60030], [60030, 60045, 60005, 60020], [60020, 60040, 60000, 60025]];
const TY_K = [[[6.6, 59970], [7.3, 60030], [7.9, 60070], [8.6, 60030]], [[9.6, 60030], [10.2, 60010], [10.8, 60020]], [[11.2, 60020], [11.8, 60035], [12.4, 60025]]];
const TY_V = [0.7, 0.4, 0.3];
const TY_OPTS = [['BUY', 'A breakout is starting'], ['SELL', 'It will surely drop'], ['WAIT', 'Nothing is confirmed yet']];
const TY_OK = 2, TY_R = 21.0;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.h = UI.head(kit, 'Your turn · reveal step by step', 'BUY, SELL or WAIT?');
    this.ch = UI.chart(kit, 'ty', 15, { vol: true });
    const X = this.ch.X, Y = this.ch.Y;
    kit.stage.append(kit.h('<p class="tag ty-w" style="left:' + (X(12) - 170) + 'px;top:404px">Wick 60,070</p>'));
    kit.stage.append(kit.h('<p class="tag ty-c" style="left:' + (X(12) - 170) + 'px;top:352px;color:var(--accent);border-color:var(--accent)">Closes 60,030 · inside</p>'));
    kit.stage.append(kit.h('<div class="glass ty-cnt" style="left:1110px;top:300px;width:670px;padding:22px 30px"><p class="kick" style="margin:0 0 8px">New candles revealed</p>' +
      '<p class="mono" style="margin:0;font-size:64px"><span class="ty-n">0</span><span style="font-size:36px;color:color-mix(in srgb, var(--second) 60%, var(--ground))"> of 3</span></p></div>'));
    let opts = '';
    TY_OPTS.forEach((o, i) => {
      opts += '<div class="ty-o" style="display:flex;align-items:center;gap:18px;padding:8px 20px;border-radius:20px;border:2px solid color-mix(in srgb, var(--second) 14%, transparent);background:color-mix(in srgb, var(--ground) 90%, var(--main))">' +
        '<span class="ty-l mono" style="width:46px;height:46px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:24px;border:2px solid color-mix(in srgb, var(--main) 45%, transparent)">' + 'ABC'[i] + '</span>' +
        '<span style="flex:1;font-size:28px;font-weight:600"><b class="mono" style="margin-right:12px">' + o[0] + '</b>' + o[1] + '</span>' +
        (i === TY_OK ? '<svg width="40" height="40" viewBox="0 0 44 44" style="flex:none"><path class="ty-ok" d="M10 23 L19 32 L35 13" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg>' : '') + '</div>';
    });
    const why = (k, s, c) => '<div class="ty-y" style="display:flex;align-items:baseline;gap:16px;height:44px"><span class="mono" style="flex:none;width:96px;font-size:24px;color:' + c + '">' + k + '</span><span style="font-size:28px;font-weight:600">' + s + '</span></div>';
    kit.stage.append(kit.h('<div class="ty-ops" style="position:absolute;left:1110px;top:300px;width:670px;display:flex;flex-direction:column;gap:12px">' + opts + '</div>'));
    kit.stage.append(kit.h('<div class="glass ty-why" style="left:1110px;top:560px;width:670px;padding:16px 26px"><p class="kick" style="margin:0 0 6px">Feedback on reasoning</p>' +
      why('C ✓', 'No close above the zone. Fading.', 'var(--main)') + why('Not A', 'A wick is not a breakout.', 'var(--accent)') + why('Not B', 'Nothing confirms a drop.', 'var(--accent)') + '</div>'));
    this.ring = UI.ring(kit, 1445, 660, 66, 13.8, 15.2, 5, TY_R, 'Pause to think');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.cnt = q('.ty-cnt').style; this.n = q('.ty-n');
    this.tw = q('.ty-w').style; this.tc = q('.ty-c').style; this.os = all('.ty-o').map((e) => e.style); this.ls = all('.ty-l').map((e) => e.style); this.ok = q('.ty-ok');
    this.why = q('.ty-why').style; this.ys = all('.ty-y').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 6.6, pose: 'magnify' }, { t: 15.2, pose: 'think' }, { t: TY_R, pose: 'cheer' }, { t: TY_R + 2.4, pose: 'explain' }, { t: 27.6, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    this.ch.base(t, 0.2, 1.2, 6.2);
    this.ch.past(t, 0.5, 0.1);
    UI.Q.V.forEach((v, i) => this.ch.vol(i, v, seg(t, 0.5 + i * 0.1, 0.9 + i * 0.1)));
    TY_N.forEach((c, j) => {
      const K = TY_K[j], a = K[0][0], b = K[K.length - 1][0];
      const k = t >= b ? { o: c[0], h: c[1], l: c[2], c: c[3] } : UI.forming(K, c[2], c[1], t);
      this.ch.cd.set(12 + j, { x: this.ch.X(12 + j), w: 28, o: k.o, h: k.h, l: k.l, c: k.c, y: this.ch.Y, live: !!k.live, op: eo(seg(t, a - 0.2, a + 0.1)) });
      this.ch.vol(12 + j, TY_V[j], seg(t, a, b), t > 13.8 ? 'color-mix(in srgb, var(--accent) 70%, transparent)' : '');
    });
    UI.rise(kit, this.cnt, t, 1.0, 0.6, 20, 13.2, 13.7);
    UI.set(this.n, t < 6.6 ? 0 : t < 9.6 ? 1 : t < 11.2 ? 2 : 3);
    UI.fade(this.tw, t, 8.0); UI.fade(this.tc, t, 8.8);
    const rv = eo(seg(t, TY_R, TY_R + 0.5));
    this.os.forEach((s, i) => {
      const a = 13.8 + i * 0.4, p = eo(seg(t, a, a + 0.5)), good = i === TY_OK;
      s.opacity = (eo(seg(t, a, a + 0.3)) * (good ? 1 : lerp(1, 0.45, rv))).toFixed(3);
      s.transform = 'translateX(' + lerp(30, 0, p).toFixed(1) + 'px) scale(' + (good ? 1 + 0.02 * rv : 1).toFixed(4) + ')'; s.transformOrigin = '0 50%';
      if (good) { s.borderColor = 'color-mix(in srgb, var(--main) ' + (14 + 86 * rv).toFixed(0) + '%, transparent)'; this.ls[i].background = rv > 0.5 ? 'var(--main)' : 'transparent'; this.ls[i].color = rv > 0.5 ? 'var(--ground)' : 'var(--second)'; }
    });
    const po = seg(t, TY_R + 0.2, TY_R + 0.7);
    this.ok.setAttribute('stroke-dasharray', eo(po).toFixed(3) + ' 1'); this.ok.style.opacity = po > 0 ? 1 : 0;
    UI.rise(kit, this.why, t, TY_R + 0.3, 0.6, 24);
    [TY_R + 0.6, 27.8, 29.8].forEach((a, i) => { this.ys[i].opacity = eo(seg(t, a, a + 0.4)); });
    this.ring(t);
    this.tutor.render(t);
  },
});
