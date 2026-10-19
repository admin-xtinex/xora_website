const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const RECAP = ['A candle sums up one time window: open, high, low, close.', 'Body edges are open and close. Wick tips are high and low.', 'Up: close above open. Down: close below open. Neither predicts.'];
const RC_AT = [2.0, 6.8, 11.4];
const rcY = (p) => 760 - (p - 59960) / 190 * 170;
kit.scene('recap', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'rc-c', 1);
    let items = '';
    RECAP.forEach((s) => {
      items += '<div class="rc-i" style="display:flex;align-items:center;gap:26px"><svg width="50" height="50" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>' +
        '<path class="rc-tick" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg><span style="font-size:34px;font-weight:600">' + s + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1400px"><p class="kick rc-k">Recap</p><h2 class="line rc-t">Three things to remember</h2>' +
      '<div style="display:flex;flex-direction:column;gap:22px;margin-top:10px">' + items + '</div></div>' +
      '<div class="glass rc-q" style="left:140px;top:590px;width:1080px;padding:24px 36px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Check yourself</p>' +
      '<p style="margin:0;font-size:32px;font-weight:600;line-height:1.4">A red body runs from 60,100 down to 60,020. Where did it open?</p>' +
      '<p class="rc-a" style="margin:10px 0 0;font-size:30px;line-height:1.4;color:var(--main);font-weight:700">At 60,100, the top of the red body. It closed at 60,020.</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.cd.html + '</svg>' +
      '<p class="tag rc-o" style="left:1390px;top:' + (rcY(60100) - 22).toFixed(1) + 'px;border-color:var(--main);color:var(--main)">Open 60,100</p>' +
      '<p class="tag rc-cl" style="left:1390px;top:' + (rcY(60020) - 22).toFixed(1) + 'px">Close 60,020</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.rc-k').style; this.t = q('.rc-t'); this.qc = q('.rc-q').style; this.a = q('.rc-a').style; this.o = q('.rc-o').style; this.cl = q('.rc-cl').style;
    this.items = [...kit.stage.querySelectorAll('.rc-i')].map((e) => e.style);
    this.ticks = [...kit.stage.querySelectorAll('.rc-tick')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'checklist' }, { t: 16.9, pose: 'think' }, { t: 23.0, pose: 'thumbs' }],
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
    const qp = seg(t, 16.9, 17.6);
    this.qc.opacity = eo(qp); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qp)) + 'px)';
    this.cd.set(0, { x: 1320, w: 90, o: 60100, h: 60150, l: 59990, c: 60020, y: rcY, op: eo(seg(t, 17.4, 17.9)) });
    const ap = seg(t, 23.0, 23.5);
    this.a.opacity = eo(ap); this.a.transform = 'translateX(' + lerp(20, 0, eo(ap)) + 'px)';
    this.o.opacity = eo(ap); this.cl.opacity = eo(seg(t, 23.4, 23.9));
    this.tutor.render(t);
  },
});
