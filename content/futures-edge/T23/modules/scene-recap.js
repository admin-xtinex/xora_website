const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const RECAP = [['Eight steps, in order: coin, context, levels, doubts, costs, decide, monitor, journal.', 1.0], ['Size comes from the risk budget and the stop distance, before you decide.', 7.1], ['Judge the process, not one outcome. NO_TRADE can be a full success.', 13.3]];
kit.scene('recap', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Recap', 'Three things to remember');
    let items = '';
    RECAP.forEach((s) => {
      items += '<div class="rc-i" style="display:flex;align-items:center;gap:26px"><svg width="50" height="50" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>' +
        '<path class="rc-tick" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg><span style="font-size:34px;font-weight:600">' + s[0] + '</span></div>';
    });
    kit.stage.append(kit.h('<div>' +
      '<div style="position:absolute;left:140px;top:290px;width:1400px;display:flex;flex-direction:column;gap:24px">' + items + '</div>' +
      '<div class="glass rc-q" style="left:140px;top:590px;width:1180px;padding:24px 36px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Check yourself</p>' +
      '<p style="margin:0;font-size:32px;font-weight:600;line-height:1.4">You followed the plan and the demo trade still lost. A bad decision?</p>' +
      '<p class="rc-a" style="margin:12px 0 0;font-size:30px;line-height:1.4;color:var(--main);font-weight:700">Not necessarily. Check the process first: one result proves very little.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.qc = q('.rc-q').style; this.a = q('.rc-a').style;
    this.items = [...kit.stage.querySelectorAll('.rc-i')].map((e) => e.style);
    this.ticks = [...kit.stage.querySelectorAll('.rc-tick')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'checklist' }, { t: 18.7, pose: 'think' }, { t: 24.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.items.forEach((s, i) => {
      const a = RECAP[i][1];
      s.opacity = eo(seg(t, a, a + 0.4));
      s.transform = 'translateX(' + lerp(26, 0, eo(seg(t, a, a + 0.5))) + 'px)';
      this.ticks[i].setAttribute('stroke-dasharray', eo(seg(t, a + 0.5, a + 0.9)) + ' 1');
    });
    const qp = seg(t, 18.7, 19.4);
    this.qc.opacity = eo(qp); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qp)) + 'px)';
    const ap = seg(t, 24.0, 24.5);
    this.a.opacity = eo(ap); this.a.transform = 'translateX(' + lerp(20, 0, eo(ap)) + 'px)';
    this.tutor.render(t);
  },
});
