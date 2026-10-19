const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const ans = (cls, label, v) => '<div class="' + cls + '" style="flex:1;padding:14px 22px;border-radius:18px;background:color-mix(in srgb, var(--ground) 76%, var(--main));border:1.5px solid var(--main)"><p class="fict" style="margin:0 0 4px">' + label + '</p><p class="mono" style="margin:0;font-size:30px;white-space:nowrap">' + v + '</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:960px"><p class="kick tr-k">Your turn</p>' +
      '<h2 class="line tr-t">Pause and work it out</h2></div>' +
      '<div class="glass tr-q" style="left:140px;top:370px;width:1040px;padding:28px 38px"><p class="fict" style="margin:0 0 12px">Question · fictional · before fees</p>' +
      '<p class="def" style="margin:0">Margin <b>50 USDT</b>, leverage <b>5x</b>, long. BTC rises <b>4%</b>. What is the notional, the gross PnL, and the PnL as a % of margin?</p></div>' +
      '<div class="tr-a" style="position:absolute;left:140px;top:600px;width:1200px;display:flex;gap:18px">' +
      ans('tr-a1', 'Notional', '50 × 5 = 250 USDT') + ans('tr-a2', 'Gross PnL', '250 × 4% = +10') + ans('tr-a3', 'Of margin', '10 ÷ 50 = +20%') + '</div>' +
      '<p class="tr-fall" style="position:absolute;left:140px;top:722px;margin:0;font-size:28px;font-weight:600">If BTC had fallen 4%: <span class="mono" style="color:var(--accent)">−10 USDT, −20% of margin</span></p>' +
      '<p class="tr-hint" style="position:absolute;left:1260px;top:640px;width:520px;margin:0;text-align:center;font-size:26px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">Hint: margin × leverage, then × the move</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tr-k').style; this.t = q('.tr-t'); this.qc = q('.tr-q').style;
    this.a = ['.tr-a1', '.tr-a2', '.tr-a3'].map((s) => q(s).style); this.fall = q('.tr-fall').style; this.hint = q('.tr-hint').style;
    this.ring = UI.ring(kit, 1520, 450, 110, 3.0, 3.6, 5, 9.0, 'Pause to think');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: 3.6, pose: 'think' }, { t: 9.0, pose: 'writing' }, { t: 14.6, pose: 'explain' }, { t: 20.2, pose: 'celebrate' }],
      says: [{ t0: 20.4, t1: 22.7, text: 'Nicely done!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.qc, t, 0.8, 0.7);
    this.hint.opacity = eo(seg(t, 5.4, 6.0)) * (1 - ei(seg(t, 8.6, 9.0)));
    const at = [9.0, 10.8, 14.6];
    this.a.forEach((s, i) => {
      const p = seg(t, at[i], at[i] + 0.6);
      s.opacity = eo(seg(t, at[i], at[i] + 0.3));
      s.transform = 'translateY(' + lerp(24, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.92, 1, eob(p, 1.6)).toFixed(4) + ')';
    });
    UI.rise(kit, this.fall, t, 16.6, 0.6, 16);
    this.ring(t);
    this.tutor.render(t);
  },
});
