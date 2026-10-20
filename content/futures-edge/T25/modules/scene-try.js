const { seg, eo, ei, eob, lerp } = kit;
const TY_OPT = ['A trade opens at 60,100', 'No trigger, no trade: a fresh plan at the close', 'The plan stays open for the rest of the day'];
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let opts = '';
    TY_OPT.forEach((o, i) => { opts += '<div class="ty-o" style="display:flex;align-items:center;gap:20px;padding:14px 22px;border-radius:18px;border:1.5px solid color-mix(in srgb, var(--second) 16%, transparent)"><span class="mono" style="font-size:28px;color:var(--main)">' + 'ABC'[i] + '</span><span style="font-size:30px;font-weight:600">' + o + '</span></div>'; });
    kit.stage.append(kit.h('<div><div class="glass ty-q" style="left:140px;top:290px;width:1000px;padding:24px 34px"><p class="fict" style="margin:0 0 10px">Question · fictional</p>' +
      '<p class="def" style="margin:0">Plan: <b>BUY if price trades above 60,120</b>. The next candle only reaches <b>60,100</b>, then closes. What happens?</p></div>' +
      '<div class="ty-os" style="position:absolute;left:140px;top:510px;width:1000px;display:flex;flex-direction:column;gap:12px">' + opts + '</div>' +
      '<div class="glass ty-a" style="left:1230px;top:380px;width:470px;padding:22px 28px;border-color:var(--up)"><p class="kick" style="margin:0 0 8px;color:var(--up)">Answer: B</p><p style="margin:0;font-size:29px;line-height:1.4;font-weight:600">60,100 never touched 60,120, so the plan expired. A plan lasts one candle.</p></div></div>'));
    this.head = UI.head(kit, 'Your turn', 'Pause and think');
    this.ring = UI.ring(kit, 1420, 470, 110, 3.0, 4.0, 5, 9.6, 'Think');
    const q = (s) => kit.stage.querySelector(s);
    this.q = q('.ty-q').style; this.os = [...kit.stage.querySelectorAll('.ty-o')].map((e) => e.style); this.a = q('.ty-a').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 3.4, pose: 'think' }, { t: 10.0, pose: 'cheer' }, { t: 13.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    UI.rise(kit, this.q, t, 0.6, 0.6, 24);
    this.os.forEach((s, i) => {
      UI.rise(kit, s, t, 1.4 + i * 0.4, 0.5, 16);
      const r = eo(seg(t, 10.0, 10.5));
      if (i === 1) { s.background = 'color-mix(in srgb, var(--up) ' + Math.round(20 * r) + '%, transparent)'; s.borderColor = r > 0.5 ? 'var(--up)' : ''; }
      else s.opacity = (eo(seg(t, 1.4 + i * 0.4, 1.8 + i * 0.4)) * lerp(1, 0.45, r)).toFixed(3);
    });
    this.ring(t);
    UI.rise(kit, this.a, t, 10.4, 0.5, 16);
    this.tutor.render(t);
  },
});
