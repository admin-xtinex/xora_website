const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Hindsight: the finished breakout looks obvious; then a curtain hides everything after the decision candle.
kit.scene('hindsight', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.h = UI.head(kit, 'Hindsight bias', '“It was so obvious!”');
    const Q = UI.Q, X = Q.x, Y = Q.y;
    this.fut = UI.fromPath(Q.F[0], 25);
    const cx = X(11) + 23;
    this.ch = UI.chart(kit, 'hs', 18, {
      over: '<line class="hs-now" x1="' + cx + '" x2="' + cx + '" y1="300" y2="772" stroke-width="3" stroke-dasharray="8 7" style="stroke:var(--main)"/>' +
        '<g class="hs-cur"><rect x="' + cx + '" y="312" width="' + (1010 - cx) + '" height="464" rx="10" style="fill:color-mix(in srgb, var(--ground) 92%, var(--main));stroke:color-mix(in srgb, var(--main) 35%, transparent);stroke-width:2"/>' +
        '<text x="' + ((cx + 1010) / 2) + '" y="520" text-anchor="middle" style="fill:var(--second);font-size:72px;font-weight:700">?</text>' +
        '<text x="' + ((cx + 1010) / 2) + '" y="580" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 70%, var(--ground));font-size:26px">hidden</text></g>',
    });
    kit.stage.append(kit.h('<p class="tag hs-tg" style="left:' + (X(11) - 30) + 'px;top:' + (Y(60400) + 14) + 'px;color:var(--up);border-color:var(--up)">Afterwards: “of course!”</p>'));
    kit.stage.append(kit.h('<p class="tag hs-dn" style="left:' + (cx - 250) + 'px;top:730px;color:var(--main);border-color:var(--main)">Decision time</p>'));
    kit.stage.append(kit.h('<div class="glass hs-d" style="left:1180px;top:300px;width:600px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:30px"><b>Hindsight bias</b>: after the result, it feels like it was obvious all along.</p></div>'));
    kit.stage.append(kit.h('<div class="glass hs-r" style="left:1180px;top:540px;width:600px;padding:20px 30px;border-color:var(--main)"><p class="kick" style="margin:0 0 8px">Fair review</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.35;font-weight:600">Judge a decision by what was known at the time.</p></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.cur = q('.hs-cur').style; this.now = q('.hs-now').style; this.tg = q('.hs-tg').style; this.dn = q('.hs-dn').style; this.d = q('.hs-d').style; this.r = q('.hs-r').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 7.0, pose: 'cheer' }, { t: 13.2, pose: 'confused' }, { t: 18.8, pose: 'checklist' }],
      says: [{ t0: 7.6, t1: 11.8, text: 'Easy, right?' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    this.ch.base(t, 0.2, 0.8, 6.4);
    this.ch.past(t, 0.6, 0.12);
    this.fut.forEach((c, i) => { const a = 2.2 + i * 0.3; this.ch.put(12 + i, c, seg(t, a, a + 0.4)); });
    UI.rise(kit, this.d, t, 0.6, 0.7);
    UI.fade(this.tg, t, 7.2, 13.0);
    // The curtain slides in from the right edge of the chart.
    const c = eio(seg(t, 13.4, 14.4));
    this.cur.opacity = c > 0 ? 1 : 0; this.cur.transformBox = 'fill-box'; this.cur.transformOrigin = '100% 50%'; this.cur.transform = 'scaleX(' + c.toFixed(3) + ')';
    UI.fade(this.now, t, 13.2); UI.fade(this.dn, t, 14.2);
    UI.rise(kit, this.r, t, 18.8, 0.7);
    this.tutor.render(t);
  },
});
