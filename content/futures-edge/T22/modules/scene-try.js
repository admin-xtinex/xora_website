const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Try it: size a long from an example budget. Options 200 / 2,000 / 20,000 USDT; answer B with the working; why not C.
const TY_IN = [['Account', '2,000 USDT'], ['Risk budget · example', '20 USDT'], ['Direction', 'Long'], ['Entry', '50,000'], ['Stop', '49,500']];
const TY_OPTS = ['200 USDT', '2,000 USDT', '20,000 USDT'];
const TY_OK = 1, TY_BAD = 2, TY_R = 20.0, TY_N = 25.2;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let opts = '';
    TY_OPTS.forEach((o, i) => {
      const mark = i === TY_OK ? '<path class="ty-ok" d="M10 23 L19 32 L35 13" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>'
        : i === TY_BAD ? '<path class="ty-no" d="M13 13 L31 31 M31 13 L13 31" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--accent)"/>' : '';
      opts += '<div class="ty-o" style="display:flex;align-items:center;gap:18px;padding:8px 20px;border-radius:20px;border:2px solid color-mix(in srgb, var(--second) 14%, transparent);background:color-mix(in srgb, var(--ground) 90%, var(--main))">' +
        '<span class="ty-l mono" style="width:46px;height:46px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:24px;border:2px solid color-mix(in srgb, var(--main) 45%, transparent)">' + 'ABC'[i] + '</span>' +
        '<span class="mono" style="flex:1;font-size:32px">' + o + '</span><svg width="44" height="44" viewBox="0 0 44 44" style="flex:none">' + mark + '</svg></div>';
    });
    this.h = UI.head(kit, 'Your turn · fictional', 'What is the allowed notional?',
      '<div class="glass ty-q" style="left:140px;top:300px;width:760px;padding:16px 30px">' + TY_IN.map((r) => '<div class="row ty-r" style="padding:10px 0"><span>' + r[0] + '</span><span class="mono" style="font-size:32px">' + r[1] + '</span></div>').join('') + '</div>' +
      '<div style="position:absolute;left:960px;top:300px;width:820px;display:flex;flex-direction:column;gap:12px">' + opts + '</div>' +
      '<div class="glass ty-why" style="left:960px;top:556px;width:820px;padding:16px 30px">' +
      '<p class="mono" style="margin:0;font-size:28px;line-height:1.5">|50,000 − 49,500| ÷ 50,000 = 0.01<br>20 ÷ 0.01 = <span class="hl">2,000 USDT</span></p>' +
      '<p class="mono ty-w2" style="margin:8px 0 0;font-size:26px;color:var(--accent)">Not C: 20,000 × 1% = 200 USDT lost</p></div>');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.qc = q('.ty-q').style; this.rs = all('.ty-r').map((e) => e.style); this.os = all('.ty-o').map((e) => e.style); this.ls = all('.ty-l').map((e) => e.style);
    this.ok = q('.ty-ok'); this.no = q('.ty-no'); this.why = q('.ty-why').style; this.w2 = q('.ty-w2').style;
    this.ring = UI.ring(kit, 1370, 666, 66, 13.6, 14.4, 5, TY_R, 'Pause and work it out');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 7.2, pose: 'present' }, { t: 14.4, pose: 'think' }, { t: TY_R, pose: 'cheer' }, { t: TY_R + 2.2, pose: 'writing' }, { t: TY_N, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.qc, t, 0.5, 0.7);
    this.rs.forEach((s, i) => { s.opacity = eo(seg(t, 1.0 + i * 0.9, 1.4 + i * 0.9)); });
    const rv = eo(seg(t, TY_R, TY_R + 0.5)), nb = eo(seg(t, TY_N, TY_N + 0.5));
    this.os.forEach((s, i) => {
      const a = 7.6 + i * 0.6, p = eo(seg(t, a, a + 0.5)), good = i === TY_OK, tempt = i === TY_BAD;
      const dim = good ? 1 : tempt ? lerp(lerp(1, 0.5, rv), 1, nb) : lerp(1, 0.4, rv);
      s.opacity = (eo(seg(t, a, a + 0.3)) * dim).toFixed(3);
      s.transform = 'translateX(' + lerp(30, 0, p).toFixed(1) + 'px) scale(' + (good ? 1 + 0.02 * rv : 1).toFixed(4) + ')'; s.transformOrigin = '0 50%';
      if (good) { s.borderColor = 'color-mix(in srgb, var(--main) ' + (14 + 86 * rv).toFixed(0) + '%, transparent)'; this.ls[i].background = rv > 0.5 ? 'var(--main)' : 'transparent'; this.ls[i].color = rv > 0.5 ? 'var(--ground)' : 'var(--second)'; }
      if (tempt) s.borderColor = 'color-mix(in srgb, ' + (nb > 0 ? 'var(--accent)' : 'var(--second)') + ' ' + (14 + 86 * nb).toFixed(0) + '%, transparent)';
    });
    const po = seg(t, TY_R + 0.2, TY_R + 0.7), pn = seg(t, TY_N + 0.1, TY_N + 0.6);
    this.ok.setAttribute('stroke-dasharray', eo(po).toFixed(3) + ' 1'); this.ok.style.opacity = po > 0 ? 1 : 0;
    this.no.setAttribute('stroke-dasharray', eo(pn).toFixed(3) + ' 1'); this.no.style.opacity = pn > 0 ? 1 : 0;
    UI.rise(kit, this.why, t, TY_R + 0.3, 0.6, 24);
    this.w2.opacity = nb;
    this.ring(t);
    this.tutor.render(t);
  },
});
