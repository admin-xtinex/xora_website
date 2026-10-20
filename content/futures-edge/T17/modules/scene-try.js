const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Fictional: the last candle wicks to 60,450 but closes at 60,380, inside the 60,300–60,400 zone.
const TY_C = UI.SR.PRE.slice(6).concat([[60310, 60450, 60290, 60380]]);
const tyX = (i) => 1120 + i * 90, tyY = (p) => 620 - (p - 60100) / 400 * 260;
const TY_CD = 5.6, TY_ANS = 11.0;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'ty-c', 4);
    this.ring = UI.ring(kit, 'ty-ring', 1620, 440);
    const opt = (cls, l, s) => '<div class="glass ' + cls + '" style="left:140px;width:820px;padding:16px 28px;display:flex;gap:18px;align-items:center;border-radius:20px"><span class="mono" style="font-size:30px;color:var(--main)">' + l + '</span><span style="font-size:30px;font-weight:600">' + s + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ty-grid">' + UI.gridL(1080, 1420, tyY, 60200, 60500, 100) + '</g>' +
      '<rect class="ty-zone" x="1080" y="' + tyY(60400).toFixed(1) + '" width="340" height="' + (tyY(60300) - tyY(60400)).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--accent) 20%, transparent);stroke:color-mix(in srgb, var(--accent) 75%, transparent);stroke-width:2"/>' +
      this.cd.html + this.ring.html + '</svg>' +
      '<p class="tag ty-w" style="left:' + (tyX(3) + 36) + 'px;top:' + (tyY(60450) - 22).toFixed(0) + 'px">Wick 60,450</p>' +
      '<p class="tag ty-cl" style="left:' + (tyX(3) + 36) + 'px;top:' + (tyY(60380) - 6).toFixed(0) + 'px;color:var(--main);border-color:var(--main)">Close 60,380</p>' +
      '<p class="fict" style="position:absolute;left:1080px;top:300px;margin:0">Fictional 1-minute candles</p>' +
      '<div class="glass ty-q" style="left:140px;top:300px;width:820px;padding:22px 30px"><p class="fict" style="margin:0 0 8px">Question · zone 60,300–60,400</p>' +
      '<p class="def" style="margin:0;font-size:31px">The last candle wicked to <b>60,450</b> but closed at <b>60,380</b>. Is the breakout confirmed?</p></div>' +
      opt('ty-o1', 'A', 'Yes, the wick went above the zone').replace('style="left:140px', 'style="top:500px;left:140px') +
      opt('ty-o2', 'B', 'Not yet: it closed inside the zone').replace('style="left:140px', 'style="top:584px;left:140px') +
      '<div class="glass ty-a" style="left:140px;top:676px;width:820px;padding:18px 28px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 76%, var(--main))"><p class="mono" style="margin:0;font-size:30px">60,400 − 60,380 = <span class="hl">20 USDT inside</span></p></div>' +
      '<div class="glass ty-n" style="left:1060px;top:650px;width:660px;padding:18px 28px"><p class="kick" style="margin:0 0 6px">Next close decides more</p><p style="margin:0;font-size:28px;font-weight:600;line-height:1.35">Until then: <span class="hl">WAIT</span>. No trade is a fine choice.</p></div>' +
      '<div class="words" style="left:140px;top:160px;width:1000px"><p class="kick ty-k">Your turn</p>' +
      '<h2 class="line ty-t">Pause and decide</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ty-k').style; this.t = q('.ty-t'); this.qc = q('.ty-q').style; this.o1 = q('.ty-o1').style; this.o2 = q('.ty-o2').style;
    this.a = q('.ty-a').style; this.n = q('.ty-n').style; this.grid = q('.ty-grid').style; this.zone = q('.ty-zone').style; this.w = q('.ty-w').style; this.cl = q('.ty-cl').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'present' }, { t: TY_CD, pose: 'think' }, { t: TY_ANS, pose: 'checklist' }, { t: 16.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 0.9));
    const z = seg(t, 0.8, 1.6);
    this.zone.opacity = eo(z); this.zone.transformBox = 'fill-box'; this.zone.transformOrigin = '0 50%'; this.zone.transform = 'scaleX(' + eo(z).toFixed(3) + ')';
    TY_C.forEach((c, i) => {
      const a = 1.4 + i * 0.5;
      let k = { o: c[0], h: c[1], l: c[2], c: c[3] };
      if (i === 3 && t < 5.2) k = UI.forming([[2.9, 60310], [3.6, 60290], [4.4, 60450], [5.2, 60380]], c[2], c[1], t);
      this.cd.set(i, { x: tyX(i), w: 44, o: k.o, h: k.h, l: k.l, c: k.c, y: tyY, live: !!k.live, op: eo(seg(t, a, a + 0.3)) });
    });
    UI.rise(this.qc, t, 4.8);
    UI.rise(this.o1, t, 5.2); UI.rise(this.o2, t, 5.4);
    const show = eo(seg(t, TY_CD - 0.5, TY_CD)) * (1 - ei(seg(t, TY_ANS - 0.4, TY_ANS)));
    this.ring.render(t, TY_CD, 5, show);
    // Reveal: B lights up, A fades.
    const r = seg(t, TY_ANS, TY_ANS + 0.5);
    this.o2.borderColor = 'color-mix(in srgb, var(--main) ' + (22 + 70 * eo(r)).toFixed(0) + '%, transparent)';
    this.o2.background = r > 0 ? 'color-mix(in srgb, var(--ground) ' + (100 - 22 * eo(r)).toFixed(0) + '%, var(--main))' : '';
    if (r > 0) this.o1.opacity = (1 - 0.6 * eo(r)).toFixed(3);
    UI.rise(this.w, t, TY_ANS + 0.2, { dy: 10 }); UI.rise(this.cl, t, TY_ANS + 0.6, { dy: 10 });
    UI.rise(this.a, t, TY_ANS + 1.0);
    UI.rise(this.n, t, 16.8);
    this.tutor.render(t);
  },
});
