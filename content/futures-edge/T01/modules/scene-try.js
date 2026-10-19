const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TRY_R = 120, TRY_C = 2 * Math.PI * TRY_R;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:900px"><p class="kick tr-k">Your turn</p>' +
      '<h2 class="line tr-t">Pause and work it out</h2></div>' +
      '<div class="glass tr-q" style="left:140px;top:420px;width:900px;padding:32px 40px"><p class="fict" style="margin:0 0 12px">Question · fictional prices</p>' +
      '<p class="def" style="margin:0">You hold <b>0.002 BTC</b>. The price of one BTC is <b>65,000 USDT</b>. What is your BTC worth?</p></div>' +
      '<div class="glass tr-a" style="left:140px;top:660px;width:900px;padding:28px 40px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 76%, var(--main))"><p class="mono" style="margin:0;font-size:46px">0.002 × 65,000 = <span style="color:var(--main)">130 USDT</span></p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="tr-ring" transform="translate(1360 470)">' +
      '<circle r="' + TRY_R + '" fill="none" stroke-width="14" style="stroke:color-mix(in srgb, var(--second) 10%, transparent)"/>' +
      '<circle class="tr-arc" r="' + TRY_R + '" fill="none" stroke-width="14" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="' + TRY_C.toFixed(1) + '" style="stroke:var(--main)"/>' +
      '<g class="tr-pause"><rect x="-30" y="-40" width="20" height="80" rx="5" style="fill:var(--second)"/><rect x="10" y="-40" width="20" height="80" rx="5" style="fill:var(--second)"/></g>' +
      '<text class="tr-n mono" y="30" text-anchor="middle" style="fill:var(--second);font-size:88px"></text></g>' +
      '<text class="tr-hint" x="1360" y="650" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 60%, var(--ground));font-size:26px">Hint: amount × price</text></svg>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tr-k').style; this.t = q('.tr-t'); this.qc = q('.tr-q').style; this.a = q('.tr-a').style;
    this.ring = q('.tr-ring').style; this.arc = q('.tr-arc'); this.pause = q('.tr-pause').style; this.n = q('.tr-n'); this.hint = q('.tr-hint').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: 3.6, pose: 'think' }, { t: 9.0, pose: 'cheer' }, { t: 12.0, pose: 'thumbs' }],
      says: [{ t0: 0.8, t1: 3.5, text: 'Your turn! Pause if you need more time.' }, { t0: 12.2, t1: 15.7, text: 'Got 130 USDT? Well done.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const qp = seg(t, 1.0, 1.7);
    this.qc.opacity = eo(qp); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qp)) + 'px)';
    const r = seg(t, 3.0, 3.6);
    this.ring.opacity = eo(r) * (1 - ei(seg(t, 8.8, 9.3)));
    const cd = seg(t, 3.6, 8.6);
    this.arc.setAttribute('stroke-dashoffset', (TRY_C * cd).toFixed(1));
    const left = Math.max(0, Math.ceil(5 - (t - 3.6)));
    const txt = t < 3.6 ? '' : String(Math.min(5, left));
    if (this.n.textContent !== txt) this.n.textContent = txt;
    this.pause.opacity = t < 3.6 ? 1 : 0;
    this.hint.opacity = eo(seg(t, 5.2, 5.8)) * (1 - ei(seg(t, 8.8, 9.3)));
    const a = seg(t, 9.0, 9.7);
    this.a.opacity = eo(a);
    this.a.transform = 'scale(' + lerp(0.92, 1, eob(a, 1.6)) + ')';
    this.a.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
