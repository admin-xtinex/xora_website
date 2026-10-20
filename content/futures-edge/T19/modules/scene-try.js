const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Expected move 60 USDT per BTC; round-trip fees 0.10% of 60,000 = 60 USDT per BTC. Nothing left: NO_TRADE.
const TY_CD = 6.6, TY_ANS = 11.6;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ring = UI.ring(kit, 'ty-ring', 1620, 470);
    const opt = (cls, y, l, s) => '<div class="glass ' + cls + '" style="left:140px;top:' + y + 'px;width:820px;padding:14px 28px;display:flex;gap:18px;align-items:center;border-radius:20px"><span class="mono" style="font-size:30px;color:var(--main)">' + l + '</span><span style="font-size:30px;font-weight:600">' + s + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' + this.ring.html.replace(/^/, '<svg class="art" viewBox="0 0 1920 1080">') + '</svg>' +
      '<div class="glass ty-q" style="left:140px;top:300px;width:820px;padding:22px 30px"><p class="fict" style="margin:0 0 8px">Question · fictional prices</p>' +
      '<p class="def" style="margin:0;font-size:31px">Expected move: <b>60 USDT</b> per BTC at <b>60,000</b>. Round-trip fees: <b>0.10%</b>. Worth taking?</p></div>' +
      opt('ty-o1', 494, 'A', 'Take it: the move is positive') + opt('ty-o2', 572, 'B', 'NO_TRADE: fees eat the move') +
      '<div class="glass ty-a" style="left:140px;top:660px;width:820px;padding:14px 28px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 76%, var(--main))"><p class="mono" style="margin:0;font-size:30px">60,000 × 0.10% = 60 → 60 − 60 = <span class="hl">0</span></p></div>' +
      '<p class="kick ty-ml" style="position:absolute;left:1080px;top:330px;margin:0;color:var(--up)">Expected move</p>' +
      '<div class="ty-mb" style="position:absolute;left:1080px;top:370px;width:360px;height:56px;border-radius:10px;transform-origin:0 50%;background:color-mix(in srgb, var(--up) 50%, transparent);border:2px solid var(--up);display:flex;align-items:center;padding-left:18px;box-sizing:border-box"><span class="mono" style="font-size:28px;font-weight:600">+60</span></div>' +
      '<p class="kick ty-fl" style="position:absolute;left:1080px;top:460px;margin:0;color:var(--down)">Round-trip fees</p>' +
      '<div class="ty-fb" style="position:absolute;left:1080px;top:500px;width:360px;height:56px;border-radius:10px;transform-origin:0 50%;background:color-mix(in srgb, var(--down) 50%, transparent);border:2px solid var(--down);display:flex;align-items:center;padding-left:18px;box-sizing:border-box"><span class="mono" style="font-size:28px;font-weight:600">−60</span></div>' +
      '<p class="mono ty-z" style="position:absolute;left:1080px;top:584px;margin:0;font-size:30px">Left: <span class="hl">0</span>, then slippage</p>' +
      '<div class="glass ty-n" style="left:1080px;top:650px;width:600px;padding:16px 26px"><p style="margin:0;font-size:28px;font-weight:600;line-height:1.35"><span class="hl">NO_TRADE</span> is a sensible, skilled choice.</p></div>' +
      '<p class="fict" style="position:absolute;left:1080px;top:300px;margin:0">USDT per BTC · example fees</p>' +
      '<div class="words" style="left:140px;top:160px;width:1000px"><p class="kick ty-k">Your turn</p>' +
      '<h2 class="line ty-t">Pause and decide</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ty-k').style; this.t = q('.ty-t'); this.qc = q('.ty-q').style; this.o1 = q('.ty-o1').style; this.o2 = q('.ty-o2').style; this.a = q('.ty-a').style;
    ['ml', 'mb', 'fl', 'fb', 'z', 'n'].forEach((n) => { this[n] = q('.ty-' + n).style; });
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'present' }, { t: TY_CD, pose: 'think' }, { t: TY_ANS, pose: 'checklist' }, { t: 17.2, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.qc, t, 0.8); UI.rise(this.o1, t, 5.6); UI.rise(this.o2, t, 5.9);
    this.ml.opacity = eo(seg(t, 1.8, 2.2));
    const mb = seg(t, 2.0, 2.8); this.mb.opacity = mb > 0 ? 1 : 0; this.mb.transform = 'scaleX(' + eo(mb).toFixed(3) + ')';
    const show = eo(seg(t, TY_CD - 0.5, TY_CD)) * (1 - ei(seg(t, TY_ANS - 0.4, TY_ANS)));
    this.ring.render(t, TY_CD, 5, show);
    // Reveal: B lights up; the fee bar grows to exactly the move's length.
    const r = seg(t, TY_ANS, TY_ANS + 0.5);
    this.o2.borderColor = 'color-mix(in srgb, var(--main) ' + (22 + 70 * eo(r)).toFixed(0) + '%, transparent)';
    this.o2.background = r > 0 ? 'color-mix(in srgb, var(--ground) ' + (100 - 22 * eo(r)).toFixed(0) + '%, var(--main))' : '';
    if (r > 0) this.o1.opacity = (1 - 0.6 * eo(r)).toFixed(3);
    this.fl.opacity = eo(seg(t, TY_ANS + 0.2, TY_ANS + 0.6));
    const fb = seg(t, TY_ANS + 0.4, TY_ANS + 1.4); this.fb.opacity = fb > 0 ? 1 : 0; this.fb.transform = 'scaleX(' + eio(fb).toFixed(3) + ')';
    UI.rise(this.a, t, TY_ANS + 1.0);
    UI.rise(this.z, t, TY_ANS + 2.0, { dy: 10 });
    UI.rise(this.n, t, 17.4);
    this.tutor.render(t);
  },
});
