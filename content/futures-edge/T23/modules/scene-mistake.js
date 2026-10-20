const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Three mistakes during the lifecycle, each with its correction; the first two show what they cost.
const MK = [
  { w: 'Moving the stop further away', n: ['Planned loss', 6, 11], r: 'Keep the stop where the plan put it.', a: 0.8, b: 6.8 },
  { w: 'Doubling the size to win it back', n: ['Risk', 6, 12], r: 'Take a break. Read your journal first.', a: 13.4, b: 17.6 },
  { w: 'Judging only by profit', n: null, r: 'Judge the process. A good process can still lose.', a: 20.3, b: 23.0 },
];
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Common mistakes', 'Where plans go wrong');
    let html = '';
    MK.forEach((m, i) => {
      const y = 290 + i * 160;
      html += '<div class="glass mk-w" style="left:140px;top:' + y + 'px;width:780px;height:140px;padding:20px 30px;display:flex;align-items:center;gap:24px">' +
        '<svg width="56" height="56" viewBox="0 0 44 44" style="flex:none"><circle cx="22" cy="22" r="20" fill="none" stroke-width="3" style="stroke:var(--accent)"/><path d="M14 14 L30 30 M30 14 L14 30" stroke-width="4" stroke-linecap="round" style="stroke:var(--accent)"/></svg>' +
        '<div style="flex:1"><p class="kick" style="margin:0 0 6px;color:var(--accent)">Mistake ' + (i + 1) + '</p><p style="margin:0;font-size:30px;font-weight:700">' + m.w + '</p></div>' +
        (m.n ? '<div style="text-align:right;flex:none"><p class="fict" style="margin:0 0 4px">' + m.n[0] + '</p><p class="mono dn" style="margin:0;font-size:34px">−<span class="mk-n">' + m.n[1] + '</span> USDT</p></div>' : '') + '</div>' +
        '<svg class="art mk-a" viewBox="0 0 1920 1080"><path d="M930 ' + (y + 70) + ' H968 M956 ' + (y + 58) + ' L970 ' + (y + 70) + ' L956 ' + (y + 82) + '" fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg>' +
        '<div class="glass mk-r" style="left:980px;top:' + y + 'px;width:800px;height:140px;padding:20px 30px;display:flex;align-items:center;gap:24px;border-color:var(--main)">' +
        '<svg width="56" height="56" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:var(--main)"/><path class="mk-k" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg>' +
        '<div><p class="kick" style="margin:0 0 6px">Instead</p><p style="margin:0;font-size:30px;font-weight:600">' + m.r + '</p></div></div>';
    });
    kit.stage.append(kit.h('<div>' + html + '</div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.ws = all('.mk-w').map((e) => e.style); this.rs = all('.mk-r').map((e) => e.style); this.as = all('.mk-a').map((e) => e.style); this.ks = all('.mk-k'); this.ns = all('.mk-n');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'confused' }, { t: 6.8, pose: 'idea' }, { t: 13.4, pose: 'think' }, { t: 17.6, pose: 'calm' }, { t: 20.3, pose: 'magnify' }, { t: 23.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    MK.forEach((m, i) => {
      UI.rise(kit, this.ws[i], t, m.a, 0.6, 24);
      this.as[i].opacity = eo(seg(t, m.b - 0.3, m.b));
      const p = seg(t, m.b, m.b + 0.6);
      this.rs[i].opacity = eo(p); this.rs[i].transform = 'translateX(' + lerp(30, 0, eo(p)).toFixed(1) + 'px)';
      this.ks[i].setAttribute('stroke-dasharray', eo(seg(t, m.b + 0.4, m.b + 0.9)).toFixed(3) + ' 1');
      if (m.n) { const c = eio(seg(t, m.a + 2.4, m.a + 4.4)); UI.set(this.ns[i], Math.round(lerp(m.n[1], m.n[2], c))); }
    });
    this.tutor.render(t);
  },
});
