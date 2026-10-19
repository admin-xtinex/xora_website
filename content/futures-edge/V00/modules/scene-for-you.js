const { seg, eo, eob, eio, lerp, TextFx } = kit;
const FORYOU_CHIPS = ['You are not sure what BTC or USDT means', 'You have never read a price chart', 'You have never heard of leverage'];
kit.scene('for-you', {
  init(kit) {
    let chips = '';
    FORYOU_CHIPS.forEach((c) => { chips += '<div class="chip foryou-chip" style="align-self:flex-start"><span class="dot"></span><span>' + c + '</span></div>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:920px"><p class="kick foryou-k">Who this course is for</p>' +
      '<h2 class="line foryou-t">Never traded before? You are in the right place.</h2>' +
      '<div class="foryou-chips" style="display:flex;flex-direction:column;gap:22px;margin-top:22px">' + chips + '</div></div>' +
      '<div class="foryou-demo" style="position:absolute;left:1180px;top:230px;width:600px">' +
      '<div class="glass" style="position:relative;padding:34px 40px"><p class="fict" style="margin:0 0 14px">Lesson text</p>' +
      '<p style="margin:0;font-size:38px;line-height:1.45">The price is shown in <span class="foryou-term" style="color:var(--main);font-weight:700;padding-bottom:6px;background:linear-gradient(var(--main), var(--main)) no-repeat 0 100%;background-size:0% 4px">USDT</span>.</p></div>' +
      '<div class="glass foryou-tip" style="position:relative;margin-top:26px;padding:30px 36px;border-color:color-mix(in srgb, var(--accent) 45%, transparent)">' +
      '<p class="kick" style="color:var(--accent);margin:0 0 10px">Definition</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.45">USDT is a stablecoin: a crypto token designed to track the US dollar. That link is not guaranteed.</p></div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.foryou-k').style; this.title = q('.foryou-t');
    this.chips = [...kit.stage.querySelectorAll('.foryou-chip')].map((c) => c.style);
    this.demo = q('.foryou-demo').style; this.ul = q('.foryou-term').style; this.tip = q('.foryou-tip').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idle' }, { t: 1.7, pose: 'confused' }, { t: 4.5, pose: 'read' }, { t: 6.0, pose: 'point', flip: true }, { t: 7.4, pose: 'explain' }],
      says: [
        { t0: 1.9, t1: 4.4, text: 'Feeling lost at first is normal.' },
        { t0: 7.5, t1: 9.8, text: 'Every new word gets explained before we use it.' },
      ],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, 0.0, 0.5));
    TextFx.fadeFromRight(this.title, t, 0.1);
    this.chips.forEach((c, i) => {
      const a = 1.6 + i * 0.4;
      c.opacity = eo(seg(t, a, a + 0.4));
      c.transform = 'translateX(' + lerp(30, 0, eo(seg(t, a, a + 0.6))) + 'px)';
    });
    const d = seg(t, 4.2, 4.9);
    this.demo.opacity = eo(d);
    this.demo.transform = 'translateY(' + lerp(30, 0, eo(d)) + 'px) translateY(' + (-Math.max(0, t - 4.2) * 2).toFixed(2) + 'px)';
    this.ul.backgroundSize = (eo(seg(t, 5.3, 5.7)) * 100).toFixed(1) + '% 4px';
    const p = seg(t, 5.8, 6.3);
    this.tip.transformOrigin = '25% 0';
    this.tip.opacity = eo(seg(t, 5.8, 6.0));
    this.tip.transform = 'scale(' + lerp(0.96, 1, eo(p)) + ') translateY(' + lerp(-10, 0, eo(p)) + 'px)';
    this.tutor.render(t);
  },
});
