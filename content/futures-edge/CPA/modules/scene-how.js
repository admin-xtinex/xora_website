const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const HOW = [
  ['Read the question', '<rect x="14" y="18" width="60" height="8" rx="4"/><rect x="14" y="38" width="48" height="8" rx="4"/><rect x="14" y="58" width="54" height="8" rx="4"/>'],
  ['Pause and pick A, B, C or D', '<rect x="22" y="16" width="14" height="56" rx="4"/><rect x="52" y="16" width="14" height="56" rx="4"/>'],
  ['Watch the 5-second countdown', '<circle cx="44" cy="44" r="30" fill="none" stroke-width="8" style="stroke:color-mix(in srgb, var(--second) 14%, transparent)"/><circle class="hw-arc" cx="44" cy="44" r="30" fill="none" stroke-width="8" stroke-linecap="round" transform="rotate(-90 44 44)" stroke-dasharray="188.5" style="stroke:var(--main)"/><text class="hw-n mono" x="44" y="54" text-anchor="middle" style="fill:var(--second);font-size:30px">5</text>'],
  ['See the answer and why', '<path class="hw-tick" d="M18 46 L36 64 L70 26" pathLength="1" fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>'],
];
const HOW_AT = [6.9, 8.3, 9.7, 12.5];
kit.scene('how', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    HOW.forEach((s, i) => {
      cards += '<div class="glass hw-c" style="left:' + (140 + i * 400) + 'px;top:400px;width:370px;height:240px;padding:26px 30px;display:flex;flex-direction:column;gap:18px">' +
        '<div style="display:flex;align-items:center;gap:18px"><span class="mono" style="font-size:56px;color:var(--main)">' + (i + 1) + '</span>' +
        '<svg width="104" height="104" viewBox="0 0 88 88" style="fill:var(--second)">' + s[1] + '</svg></div>' +
        '<p style="margin:0;font-size:30px;line-height:1.3;font-weight:600">' + s[0] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick hw-k">Before we start</p>' +
      '<h2 class="line hw-t">How this checkpoint works</h2>' +
      '<p class="sub hw-s">8 questions from T01 to T13 · most are about risk</p></div>' + cards +
      '<div class="hw-chips" style="position:absolute;left:140px;top:700px;display:flex;gap:20px"><span class="chip hw-ch"><span class="dot"></span>Not graded</span><span class="chip hw-ch"><span class="dot"></span>No penalty</span><span class="chip hw-ch"><span class="dot"></span>Retry any time</span></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.hw-k').style; this.t = q('.hw-t'); this.s = q('.hw-s');
    this.cards = all('.hw-c').map((e) => e.style); this.chips = all('.hw-ch').map((e) => e.style);
    this.arc = q('.hw-arc'); this.n = q('.hw-n'); this.tick = q('.hw-tick');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 6.6, pose: 'checklist' }, { t: 13.2, pose: 'calm' }],
      says: [{ t0: 13.6, t1: 18.6, text: 'No pressure!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 1.4, { stagger: 0.07 });
    let lit = -1;
    HOW_AT.forEach((a, i) => { if (t >= a) lit = i; });
    this.cards.forEach((c, i) => {
      const a = 2.6 + i * 0.35, p = seg(t, a, a + 0.6);
      c.opacity = eo(seg(t, a, a + 0.3));
      const on = seg(t, HOW_AT[i], HOW_AT[i] + 0.5);
      c.transform = 'translateY(' + lerp(36, 0, eo(p)).toFixed(1) + 'px) scale(' + (1 + 0.04 * Math.sin(Math.PI * on)).toFixed(4) + ')';
      const hot = i === lit && t < 13.2;
      c.borderColor = hot ? 'var(--main)' : 'color-mix(in srgb, var(--main) 22%, transparent)';
      c.background = hot ? 'color-mix(in srgb, var(--ground) 76%, var(--main))' : '';
    });
    const cd = seg(t, 9.8, 12.3);
    this.arc.setAttribute('stroke-dashoffset', (188.5 * cd).toFixed(1));
    const n = String(Math.max(1, Math.min(5, Math.ceil(5 - cd * 5))));
    if (this.n.textContent !== n) this.n.textContent = n;
    const k = seg(t, 12.5, 13.0);
    this.tick.setAttribute('stroke-dasharray', eo(k).toFixed(3) + ' 1'); this.tick.style.opacity = k > 0 ? 1 : 0;
    this.chips.forEach((c, i) => {
      const a = 13.5 + i * 0.4, p = seg(t, a, a + 0.5);
      c.opacity = eo(seg(t, a, a + 0.3));
      c.transform = 'translateY(' + lerp(24, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.6)).toFixed(4) + ')';
    });
    this.tutor.render(t);
  },
});
