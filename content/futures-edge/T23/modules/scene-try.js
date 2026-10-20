const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Pause and calculate: a wider stop with the same budget means a smaller position.
const TR_O = ['1,000 USDT', '500 USDT', '5,000 USDT'], TR_OK = 1, TR_BAD = 0, TR_R = 13.4, TR_N = 19.6;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Your turn', 'Pause and work it out');
    let rows = '';
    TR_O.forEach((o, i) => {
      const mark = i === TR_OK ? '<path class="tr-ok" d="M10 23 L19 32 L35 13" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>'
        : i === TR_BAD ? '<path class="tr-no" d="M13 13 L31 31 M31 13 L13 31" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--accent)"/>' : '';
      rows += '<div class="tr-o" style="display:flex;align-items:center;gap:22px;padding:12px 22px;border-radius:20px;border:2px solid color-mix(in srgb, var(--second) 14%, transparent);background:color-mix(in srgb, var(--ground) 90%, var(--main))">' +
        '<span class="tr-l mono" style="width:50px;height:50px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:26px;border:2px solid color-mix(in srgb, var(--main) 45%, transparent)">' + 'ABC'[i] + '</span>' +
        '<span class="mono" style="font-size:32px;flex:1">' + o + '</span><svg width="44" height="44" viewBox="0 0 44 44" style="flex:none">' + mark + '</svg></div>';
    });
    kit.stage.append(kit.h('<div>' +
      '<div class="glass tr-q" style="left:140px;top:280px;width:1000px;padding:24px 36px"><p class="fict" style="margin:0 0 10px">Question · fictional prices · demo</p>' +
      '<p class="def" style="margin:0;font-size:32px">Entry 60,000. The stop must go at <b>59,400</b>, which is <b>1%</b> away. You keep <b>5 USDT</b> for the price move. About what notional?</p></div>' +
      '<div class="tr-os" style="position:absolute;left:140px;top:486px;width:1000px;display:flex;flex-direction:column;gap:14px">' + rows + '</div>' +
      '<div class="glass tr-w" style="left:1220px;top:280px;width:560px;padding:20px 28px;display:flex;flex-direction:column;gap:16px">' +
      '<div><p class="kick" style="margin:0 0 6px">Why B</p><p style="margin:0;font-size:28px;line-height:1.35;font-weight:600"><span class="mono">5 ÷ 1% = 500 USDT</span>. A wider stop means a smaller position.</p></div>' +
      '<div class="tr-w2"><p class="kick" style="margin:0 0 6px;color:var(--accent)">Why not A</p><p style="margin:0;font-size:28px;line-height:1.35;font-weight:600"><span class="mono">1,000 × 1% = 10 USDT</span>: double the budget.</p></div></div></div>'));
    this.ring = UI.ring(kit, 1480, 470, 100, 6.9, 8.0, 5, TR_R + 0.2, 'Pause to think');
    this.hint = kit.h('<p class="tr-h" style="position:absolute;left:1280px;width:400px;top:620px;margin:0;text-align:center;font-size:26px;color:color-mix(in srgb, var(--second) 62%, var(--ground))">Hint: budget ÷ stop %</p>');
    kit.stage.append(this.hint);
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.qc = q('.tr-q').style; this.os = all('.tr-o').map((e) => e.style); this.ls = all('.tr-l').map((e) => e.style); this.ok = q('.tr-ok'); this.no = q('.tr-no');
    this.w = q('.tr-w').style; this.w2 = q('.tr-w2').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 7.6, pose: 'think' }, { t: TR_R, pose: 'cheer' }, { t: TR_R + 2.4, pose: 'explain' }, { t: TR_N, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    UI.rise(kit, this.qc, t, 1.0, 0.7, 30);
    const rv = eo(seg(t, TR_R, TR_R + 0.5)), nb = eo(seg(t, TR_N, TR_N + 0.5));
    this.os.forEach((s, i) => {
      const a = 3.0 + i * 0.4, p = eo(seg(t, a, a + 0.5)), good = i === TR_OK, tempt = i === TR_BAD;
      const dim = good ? 1 : tempt ? lerp(lerp(1, 0.5, rv), 1, nb) : lerp(1, 0.4, rv);
      s.opacity = (eo(seg(t, a, a + 0.3)) * dim).toFixed(3);
      s.transform = 'translateX(' + lerp(30, 0, p).toFixed(1) + 'px)';
      if (good) { s.borderColor = 'color-mix(in srgb, var(--main) ' + (14 + 86 * rv).toFixed(0) + '%, transparent)'; s.background = 'color-mix(in srgb, var(--ground) ' + lerp(90, 74, rv).toFixed(0) + '%, var(--main))'; this.ls[i].background = rv > 0.5 ? 'var(--main)' : 'transparent'; this.ls[i].color = rv > 0.5 ? 'var(--ground)' : 'var(--second)'; }
      if (tempt) s.borderColor = 'color-mix(in srgb, ' + (nb > 0 ? 'var(--accent)' : 'var(--second)') + ' ' + (14 + 86 * nb).toFixed(0) + '%, transparent)';
    });
    const po = seg(t, TR_R + 0.2, TR_R + 0.7), pn = seg(t, TR_N + 0.1, TR_N + 0.6);
    this.ok.setAttribute('stroke-dasharray', eo(po).toFixed(3) + ' 1'); this.ok.style.opacity = po > 0 ? 1 : 0;
    this.no.setAttribute('stroke-dasharray', eo(pn).toFixed(3) + ' 1'); this.no.style.opacity = pn > 0 ? 1 : 0;
    this.ring(t);
    this.hint.style.opacity = eo(seg(t, 10.0, 10.5)) * (1 - ei(seg(t, TR_R - 0.2, TR_R + 0.2)));
    const wp = seg(t, TR_R + 0.6, TR_R + 1.2);
    this.w.opacity = eo(wp); this.w.transform = 'translateY(' + lerp(24, 0, eo(wp)).toFixed(1) + 'px)';
    this.w2.opacity = nb; this.w2.transform = 'translateX(' + lerp(20, 0, nb).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
