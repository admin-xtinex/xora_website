const { seg, eo, eio, eob, lerp, TextFx } = kit;
const CX = 1450, BASE = 860;
kit.scene('start', {
  init(kit) {
    let coins = '';
    for (let i = 0; i < 14; i++) coins += '<g class="start-c"><ellipse cx="' + CX + '" cy="0" rx="150" ry="34" fill="#0c0e1f" stroke="url(#startG)" stroke-width="4"/><ellipse cx="' + CX + '" cy="-10" rx="150" ry="34" fill="#121636" stroke="url(#startG)" stroke-width="3"/></g>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="bloom start-b" style="left:1100px;top:330px;width:700px;height:700px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="startG" x1="0" x2="1"><stop offset="0" stop-color="#3ecbff"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs>' + coins + '</svg>' +
      '<div class="words" style="left:180px;top:250px;width:900px;gap:18px">' +
      '<p class="mid start-l1">He started with just</p>' +
      '<p class="hero" style="font-size:220px;line-height:1"><span class="num start-n">0</span><span class="grad" style="font-size:110px"> USDT</span></p>' +
      '<p class="mid thin start-inr" style="color:#b4bccb">≈ ₹1,400</p>' +
      '<p class="sub start-s">No big account. No trading desk. Just XORA.</p></div></div>'));
    this.cs = [...kit.stage.querySelectorAll('.start-c')];
    const q = (c) => kit.stage.querySelector('.start-' + c);
    this.l1 = q('l1'); this.n = q('n'); this.inr = q('inr').style; this.s = q('s'); this.b = q('b').style;
  },
  render(t0) {
    const t = t0 * 1.25;
    TextFx.fadeFromRight(this.l1, t, 0.05);
    const c = eio(seg(t, 0.5, 2.3));
    this.n.textContent = String(Math.round(14 * c));
    this.cs.forEach((g, i) => {
      const tl = 0.5 + i * 0.13, p = seg(t, tl, tl + 0.45);
      const y = BASE - i * 22 - lerp(420, 0, eob(p, 1.3));
      g.setAttribute('transform', 'translate(0,' + y.toFixed(1) + ')');
      g.style.opacity = p > 0 ? 1 : 0;
    });
    this.inr.opacity = eo(seg(t, 2.3, 2.7));
    TextFx.fadeFromRight(this.s, t, 2.9);
    this.b.opacity = 0.3 + 0.4 * eo(seg(t, 1.5, 2.6)); this.b.transform = 'scale(' + kit.breathe(t, 0.03, 2.4) + ')';
    kit.stage.style.opacity = 1 - eio(seg(t, 4.5, 5));
  },
});
