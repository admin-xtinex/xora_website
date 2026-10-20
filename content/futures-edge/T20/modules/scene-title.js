const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Title art: a checklist card whose six steps tick in order, ending on WAIT.
const TT_ROWS = ['Trend', 'Range', 'Zones', 'Volume', 'Risk budget', 'Decision'];
kit.scene('title', {
  init(kit) {
    let rows = '';
    TT_ROWS.forEach((r, i) => {
      rows += '<div class="tt-r" style="display:flex;align-items:center;gap:20px;height:62px"><svg width="44" height="44" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>' +
        '<path class="tt-tick" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg>' +
        '<span style="font-size:32px;font-weight:600">' + r + '</span>' + (i === 5 ? '<span class="chip tt-w mono" style="margin-left:auto;font-size:28px;padding:6px 22px;background:var(--main);color:var(--ground);border-color:var(--main)">WAIT</span>' : '') + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass tt-card" style="left:1180px;top:200px;width:560px;padding:30px 40px"><p class="kick" style="margin:0 0 12px">Before any entry</p>' + rows + '</div>' +
      '<div class="words" style="left:140px;top:230px;width:900px"><p class="kick title-k">Phase 5 · Scalping &amp; Risk Management</p>' +
      '<h1 class="line title-t" style="font-size:104px">Evaluating an Entry Opportunity</h1>' +
      '<div class="rule title-r" style="width:260px"></div>' +
      '<p class="sub title-s">Lesson T20 · about 5 minutes</p></div>' +
      '<p class="fict" style="position:absolute;left:140px;bottom:80px;margin:0">Education only · Not financial advice</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.title-k').style; this.t = q('.title-t'); this.r = q('.title-r').style; this.s = q('.title-s').style;
    this.card = q('.tt-card').style; this.ticks = [...kit.stage.querySelectorAll('.tt-tick')]; this.rows = [...kit.stage.querySelectorAll('.tt-r')].map((e) => e.style); this.w = q('.tt-w').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: 2080, y: C.y, s: C.s }, { t: 2.6, x: C.x, y: C.y, s: C.s, d: 1.9, ease: (p) => kit.lerp(p, kit.eo(p), 0.5) }],
      poses: [{ t: 0, pose: 'walk', flip: true }, { t: 2.6, pose: 'checklist' }],
      says: [{ t0: 3.0, t1: 7.4, text: 'Check first!' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, -0.6, -0.1));
    TextFx.fadeFromRight(this.t, t, -0.9);
    this.r.transformOrigin = '0 50%';
    this.r.transform = 'scaleX(' + eo(seg(t, 0.2, 0.9)) + ')';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    const c = seg(t, -0.4, 0.6);
    this.card.opacity = eo(c); this.card.transform = 'translateY(' + lerp(30, 0, eo(c)).toFixed(1) + 'px) scale(' + lerp(0.95, 1, eob(c, 1.6)).toFixed(4) + ')';
    this.ticks.forEach((p, i) => { const a = 1.0 + i * 0.75; p.setAttribute('stroke-dasharray', eo(seg(t, a, a + 0.4)).toFixed(3) + ' 1'); this.rows[i].opacity = lerp(0.45, 1, eo(seg(t, a, a + 0.3))); });
    const w = seg(t, 4.9, 5.4);
    this.w.opacity = eo(w); this.w.transform = 'scale(' + lerp(0.6, 1, eob(w, 1.8)).toFixed(3) + ')';
    this.tutor.render(t);
  },
});
