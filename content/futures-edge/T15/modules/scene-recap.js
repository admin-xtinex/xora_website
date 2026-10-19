const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const RECAP = ['A timeframe is how much time each candle covers.', 'Combine: first open, highest high, lowest low, last close.', 'Check the bigger view first. Short timeframes are noisy.'];
const RC_AT = [2.0, 6.0, 11.4];
kit.scene('recap', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let items = '';
    RECAP.forEach((s) => {
      items += '<div class="rc-i" style="display:flex;align-items:center;gap:26px"><svg width="50" height="50" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>' +
        '<path class="rc-tick" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg><span style="font-size:34px;font-weight:600">' + s + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1400px"><p class="kick rc-k">Recap</p><h2 class="line rc-t">Three things to remember</h2>' +
      '<div style="display:flex;flex-direction:column;gap:22px;margin-top:10px">' + items + '</div></div>' +
      '<div class="glass rc-q" style="left:140px;top:590px;width:1180px;padding:24px 36px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Check yourself</p>' +
      '<p style="margin:0;font-size:32px;font-weight:600;line-height:1.4">Five 1-minute candles; the last closes at 60,090. The 5-minute close?</p>' +
      '<p class="rc-a" style="margin:10px 0 0;font-size:30px;line-height:1.4;color:var(--main);font-weight:700">60,090: the 5-minute close is the last 1-minute close.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.rc-k').style; this.t = q('.rc-t'); this.qc = q('.rc-q').style; this.a = q('.rc-a').style;
    this.items = [...kit.stage.querySelectorAll('.rc-i')].map((e) => e.style);
    this.ticks = [...kit.stage.querySelectorAll('.rc-tick')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'checklist' }, { t: 16.3, pose: 'think' }, { t: 23.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.items.forEach((s, i) => {
      const a = RC_AT[i];
      s.opacity = eo(seg(t, a, a + 0.4));
      s.transform = 'translateX(' + lerp(26, 0, eo(seg(t, a, a + 0.5))) + 'px)';
      this.ticks[i].setAttribute('stroke-dasharray', eo(seg(t, a + 0.5, a + 0.9)) + ' 1');
    });
    const qp = seg(t, 16.3, 17.0);
    this.qc.opacity = eo(qp); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qp)) + 'px)';
    const ap = seg(t, 23.0, 23.5);
    this.a.opacity = eo(ap); this.a.transform = 'translateX(' + lerp(20, 0, eo(ap)) + 'px)';
    this.tutor.render(t);
  },
});
