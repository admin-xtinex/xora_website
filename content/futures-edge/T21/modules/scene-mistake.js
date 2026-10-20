const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Mistake: judging a decision by its outcome. A story card, then a process-vs-outcome grid.
const MK_G = [['Good outcome', 'Bad outcome'], [['Earned', 'Bad luck'], ['Lucky', 'Expected']]];
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const cell = (s, i) => '<div class="mk-c" style="display:grid;place-items:center;height:96px;border-radius:16px;font-size:30px;font-weight:700;border:2px solid color-mix(in srgb, var(--second) 14%, transparent);background:color-mix(in srgb, var(--ground) 90%, var(--main))">' + s + '</div>';
    const rowL = (s) => '<div style="display:flex;align-items:center;font-size:24px;line-height:1.2;color:color-mix(in srgb, var(--second) 75%, var(--ground))">' + s + '</div>';
    this.h = UI.head(kit, 'Common mistake', 'Judging only by the result',
      '<div class="glass mk-a" style="left:140px;top:300px;width:720px;height:430px;padding:24px 34px"><p class="kick" style="margin:0 0 16px;color:var(--accent)">The mistake</p>' +
      '<div class="mk-s" style="display:flex;align-items:center;gap:18px;height:64px"><span class="chip mono" style="font-size:28px;padding:8px 22px;background:var(--main);color:var(--ground);border-color:var(--main)">WAIT</span><span style="font-size:30px;font-weight:600">Evidence was weak</span></div>' +
      '<div class="mk-s" style="display:flex;align-items:center;gap:18px;height:64px"><span style="font-size:34px;color:var(--up)">↗</span><span style="font-size:30px;font-weight:600">Then price went up</span></div>' +
      '<p class="mk-s" style="margin:14px 0 0;font-size:32px;font-weight:600;color:color-mix(in srgb, var(--second) 80%, var(--ground))">“So waiting was wrong.”</p>' +
      '<svg width="600" height="70" viewBox="0 0 600 70" style="position:absolute;left:30px;top:226px"><path class="mk-x" d="M10 40 L420 40" pathLength="1" fill="none" stroke-width="6" stroke-linecap="round" style="stroke:var(--accent)"/></svg>' +
      '<p class="mk-fix" style="margin:28px 0 0;font-size:30px;line-height:1.35;font-weight:700;color:var(--main)">Not if the evidence was weak. Review the reasons.</p></div>' +
      '<div class="glass mk-g" style="left:920px;top:300px;width:860px;height:430px;padding:24px 34px"><p class="kick" style="margin:0 0 14px">Decision vs result</p>' +
      '<div style="display:grid;grid-template-columns:150px 1fr 1fr;gap:12px">' +
      '<span></span><span class="kick" style="text-align:center;color:var(--second)">' + MK_G[0][0] + '</span><span class="kick" style="text-align:center;color:var(--second)">' + MK_G[0][1] + '</span>' +
      rowL('Good reasons') + cell(MK_G[1][0][0]) + cell(MK_G[1][0][1]) + rowL('Guessing') + cell(MK_G[1][1][0]) + cell(MK_G[1][1][1]) + '</div>' +
      '<p class="mk-n" style="margin:22px 0 0;font-size:28px;line-height:1.35;font-weight:600">Good reasons can still meet bad luck.</p></div>');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.a = q('.mk-a').style; this.g = q('.mk-g').style; this.ss = all('.mk-s').map((e) => e.style); this.x = q('.mk-x'); this.fix = q('.mk-fix').style;
    this.cs = all('.mk-c').map((e) => e.style); this.n = q('.mk-n').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 9.0, pose: 'think' }, { t: 12.2, pose: 'present' }, { t: 17.6, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.a, t, 0.5, 0.7);
    [5.8, 7.4, 9.2].forEach((a, i) => UI.rise(kit, this.ss[i], t, a, 0.5, 14));
    this.x.setAttribute('stroke-dasharray', eio(seg(t, 10.4, 11.0)).toFixed(3) + ' 1'); this.x.style.opacity = t > 10.4 ? 0.9 : 0;
    UI.rise(kit, this.fix, t, 11.0, 0.6, 14);
    UI.rise(kit, this.g, t, 12.2, 0.7);
    // Cells light one by one; "Bad luck" (good reasons, bad outcome) stays highlighted.
    this.cs.forEach((s, i) => {
      const a = 13.0 + i * 0.8, p = eo(seg(t, a, a + 0.4)), hl = i === 1 ? eo(seg(t, 16.4, 16.9)) : 0;
      s.opacity = p.toFixed(3);
      s.borderColor = 'color-mix(in srgb, ' + (i === 1 ? 'var(--main)' : 'var(--second)') + ' ' + (14 + 86 * hl).toFixed(0) + '%, transparent)';
      s.transform = 'scale(' + (1 + 0.04 * hl).toFixed(3) + ')';
    });
    UI.rise(kit, this.n, t, 16.6, 0.6, 12);
    this.tutor.render(t);
  },
});
