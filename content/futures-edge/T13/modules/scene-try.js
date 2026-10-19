const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TY_OPTS = ['Add more leverage to win it back fast', 'Hold on and hope it turns around', 'Reduce exposure or close, then wait'];
const TY_OK = 2, TY_BAD = 0, TY_R = 12.2, TY_N = 17.9;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    TY_OPTS.forEach((o, i) => {
      const mark = i === TY_OK ? '<path class="ty-ok" d="M10 23 L19 32 L35 13" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>'
        : i === TY_BAD ? '<path class="ty-no" d="M13 13 L31 31 M31 13 L13 31" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--accent)"/>' : '';
      rows += '<div class="ty-o" style="display:flex;align-items:center;gap:22px;padding:12px 22px;border-radius:20px;border:2px solid color-mix(in srgb, var(--second) 14%, transparent);background:color-mix(in srgb, var(--ground) 90%, var(--main))">' +
        '<span class="ty-l mono" style="width:50px;height:50px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:26px;border:2px solid color-mix(in srgb, var(--main) 45%, transparent)">' + 'ABC'[i] + '</span>' +
        '<span style="font-size:30px;font-weight:600;flex:1">' + o + '</span><svg width="44" height="44" viewBox="0 0 44 44" style="flex:none">' + mark + '</svg></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:160px;width:1000px"><p class="kick ty-k">Your turn · scenario</p>' +
      '<h2 class="line ty-t" style="font-size:72px">What would you do?</h2></div>' +
      '<div class="glass ty-q" style="left:140px;top:300px;width:1060px;padding:22px 34px"><p class="fict" style="margin:0 0 8px">Fictional scenario · demo only</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">You hold a 10x long. BTC swings hard before big news. Your margin buffer is small, and you are unsure.</p></div>' +
      '<div style="position:absolute;left:140px;top:470px;width:1060px;display:flex;flex-direction:column;gap:12px">' + rows + '</div>' +
      '<div class="glass ty-why" style="left:1260px;top:300px;width:520px;padding:22px 30px;display:flex;flex-direction:column;gap:16px">' +
      '<div><p class="kick" style="margin:0 0 6px">Why C</p><p style="margin:0;font-size:28px;line-height:1.35;font-weight:600">Less exposure means less to lose. Waiting, or no trade, is a real decision.</p></div>' +
      '<div class="ty-w2"><p class="kick" style="margin:0 0 6px;color:var(--accent)">Why not A</p><p style="margin:0;font-size:28px;line-height:1.35;font-weight:600">More leverage makes the next move hit harder.</p></div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ty-k').style; this.t = q('.ty-t'); this.qc = q('.ty-q').style; this.why = q('.ty-why').style; this.w2 = q('.ty-w2').style;
    this.os = all('.ty-o').map((e) => e.style); this.ls = all('.ty-l').map((e) => e.style); this.ok = q('.ty-ok'); this.no = q('.ty-no');
    this.ring = UI.ring(kit, 1500, 450, 100, 6.4, 7.0, 5, TY_R, 'Pause to think');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 7.0, pose: 'think' }, { t: TY_R, pose: 'cheer' }, { t: TY_R + 2.2, pose: 'explain' }, { t: TY_N, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.qc, t, 0.6, 0.7);
    const rv = eo(seg(t, TY_R, TY_R + 0.5)), nb = eo(seg(t, TY_N, TY_N + 0.5));
    const mix = (c, p, base) => 'color-mix(in srgb, ' + c + ' ' + (base + (100 - base) * p).toFixed(0) + '%, transparent)';
    this.os.forEach((s, i) => {
      const a = 2.0 + i * 0.3, p = eo(seg(t, a, a + 0.5)), good = i === TY_OK, tempt = i === TY_BAD;
      const dim = good ? 1 : tempt ? lerp(lerp(1, 0.5, rv), 1, nb) : lerp(1, 0.4, rv);
      s.opacity = (eo(seg(t, a, a + 0.3)) * dim).toFixed(3);
      s.transform = 'translateX(' + lerp(30, 0, p).toFixed(1) + 'px) scale(' + (good ? 1 + 0.02 * rv : 1).toFixed(4) + ')';
      s.transformOrigin = '0 50%';
      if (good) { s.borderColor = mix('var(--main)', rv, 14); s.background = 'color-mix(in srgb, var(--ground) ' + lerp(90, 74, rv).toFixed(0) + '%, var(--main))'; this.ls[i].background = rv > 0.5 ? 'var(--main)' : 'transparent'; this.ls[i].color = rv > 0.5 ? 'var(--ground)' : 'var(--second)'; }
      if (tempt) s.borderColor = nb > 0 ? mix('var(--accent)', nb, 14) : mix('var(--second)', 0, 14);
    });
    const po = seg(t, TY_R + 0.2, TY_R + 0.7), pn = seg(t, TY_N + 0.1, TY_N + 0.6);
    this.ok.setAttribute('stroke-dasharray', eo(po).toFixed(3) + ' 1'); this.ok.style.opacity = po > 0 ? 1 : 0;
    this.no.setAttribute('stroke-dasharray', eo(pn).toFixed(3) + ' 1'); this.no.style.opacity = pn > 0 ? 1 : 0;
    const wp = seg(t, TY_R + 0.3, TY_R + 0.9);
    this.why.opacity = eo(wp); this.why.transform = 'translateY(' + lerp(24, 0, eo(wp)).toFixed(1) + 'px)';
    this.w2.opacity = nb;
    this.ring(t);
    this.tutor.render(t);
  },
});
