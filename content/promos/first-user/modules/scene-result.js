const { seg, eo, eio, eob, lerp, TextFx } = kit;
kit.scene('result', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="bloom result-b" style="left:560px;top:120px;width:900px;height:900px"></div>' +
      '<div class="words" style="left:160px;top:120px;width:1600px;gap:10px"><p class="tag">His first live day</p><h2 class="mid result-head">The final result</h2></div>' +
      '<div class="glass result-c1" style="left:160px;top:330px;width:500px;height:300px"><div class="edge"></div><div class="words" style="left:40px;top:44px;width:430px;gap:10px"><p class="num result-n" style="font-size:130px;line-height:1">0</p><p class="tag" style="color:#b4bccb">trades executed</p></div></div>' +
      '<div class="glass result-c2" style="left:710px;top:330px;width:1050px;height:300px"><div class="edge"></div><div class="words" style="left:44px;top:44px;width:980px;gap:10px"><p class="num up result-p" style="font-size:130px;line-height:1">+0.00</p><p class="tag" style="color:#b4bccb">USDT profit after Binance fees · ≈ ₹3,643</p></div></div>' +
      '<div class="words result-grow" style="left:160px;top:690px;width:1600px;gap:16px">' +
      '<div style="display:flex;align-items:baseline;gap:26px"><p class="num" style="font-size:58px">14</p><p class="tag" style="color:#b4bccb">USDT start<br>≈ ₹1,400</p>' +
      '<div style="flex:1;height:14px;border-radius:7px;background:#eef1f714;position:relative;align-self:center;overflow:hidden"><div class="result-bar" style="position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:7px;background:linear-gradient(90deg,#3ecbff,#a855f7,#2fd897);transform-origin:0 50%"></div></div>' +
      '<p class="num up" style="font-size:58px"><span class="result-end">14.00</span></p><p class="tag" style="color:#b4bccb">USDT end<br>≈ ₹<span class="result-inr">1,400</span></p></div>' +
      '<p class="note result-note">XORA auto trades and trades placed from XORA signals, after Binance fees.</p></div></div>'));
    const q = (c) => kit.stage.querySelector('.result-' + c);
    this.head = q('head'); this.c1 = q('c1').style; this.c2 = q('c2').style; this.n = q('n'); this.p = q('p'); this.grow = q('grow').style; this.bar = q('bar').style; this.end = q('end'); this.b = q('b').style;
  },
  render(t0) {
    const t = t0 * 1.3;
    TextFx.fadeFromRight(this.head, t, 0.05);
    const a = eob(seg(t, 0.3, 0.9), 1.5), b = eob(seg(t, 0.6, 1.2), 1.5);
    this.c1.opacity = eo(seg(t, 0.3, 0.6)); this.c1.transform = 'translateY(' + lerp(40, 0, a) + 'px)';
    this.c2.opacity = eo(seg(t, 0.6, 0.9)); this.c2.transform = 'translateY(' + lerp(40, 0, b) + 'px)';
    this.n.textContent = String(Math.round(168 * eio(seg(t, 0.6, 2.4))));
    const pv = 36.43 * eio(seg(t, 1.0, 3.0)); this.p.textContent = '+' + pv.toFixed(2);
    this.grow.opacity = eo(seg(t, 2.6, 3.0));
    const g = eio(seg(t, 2.8, 4.4)); this.bar.transform = 'scaleX(' + lerp(14 / 50.43, 1, g) + ')';
    this.end.textContent = (14 + 36.43 * g).toFixed(2);
    this.inr = this.inr || this.end.closest('.words').querySelector('.result-inr');
    this.inr.textContent = Math.round((14 + 36.43 * g) * 100).toLocaleString('en-IN');
    this.b.opacity = 0.2 + 0.5 * eo(seg(t, 2.8, 3.6)); this.b.transform = 'scale(' + kit.breathe(t, 0.03, 2.4) + ')';
    kit.stage.style.opacity = 1 - eio(seg(t, 6.0, 6.5));
  },
});
