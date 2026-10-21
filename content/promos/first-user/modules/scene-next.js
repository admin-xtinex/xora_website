const { seg, eo, eio, eob, lerp, TextFx } = kit;
kit.scene('next', {
  init(kit) {
    const r = kit.rng(5); this.st = []; let s = '';
    for (let i = 0; i < 70; i++) { const p = { x: r() * 1920, y: r() * 1080, z: 0.3 + r() * 0.9 }; this.st.push(p); s += '<circle class="next-s" r="' + (1 + p.z * 1.5).toFixed(1) + '" fill="' + (i % 3 ? '#3ecbff' : '#a855f7') + '"/>'; }
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + s + '</svg>' +
      '<div class="bloomv next-b" style="left:1150px;top:180px;width:760px;height:760px"></div>' +
      '<img class="next-tutor" src="' + kit.assets.url('tutor-present.webp') + '" style="position:absolute;left:1310px;top:250px;width:470px;height:auto">' +
      '<div class="words" style="left:170px;top:210px;width:1100px;gap:26px">' +
      '<h1 class="hero next-l1" style="font-size:132px">Your story</h1>' +
      '<p class="hero grad next-l2" style="font-size:132px">could be next.</p>' +
      '<div class="next-rule" style="height:6px;width:260px;border-radius:3px;background:linear-gradient(90deg,#3ecbff,#a855f7);transform-origin:0 50%"></div>' +
      '<p class="mid next-cta" style="font-size:54px">Start with XORA at <span class="hi" style="font-weight:700">xora.xtinex.com</span></p></div>' +
      '<div class="words next-note" style="left:170px;top:950px;width:1580px"><p class="note">Real results from one live account on its first day, 21 Oct 2026. Trading crypto futures carries risk; past results do not guarantee future returns. Not investment advice.</p></div></div>'));
    this.ss = [...kit.stage.querySelectorAll('.next-s')];
    const q = (c) => kit.stage.querySelector('.next-' + c);
    this.l1 = q('l1'); this.l2 = q('l2').style; this.rule = q('rule').style; this.cta = q('cta'); this.tutor = q('tutor').style; this.note = q('note').style; this.b = q('b').style;
  },
  render(t0) {
    const t = t0 * (7 / 6);
    this.st.forEach((p, i) => { this.ss[i].setAttribute('cx', ((p.x + t * 18 * p.z) % 1920).toFixed(1)); this.ss[i].setAttribute('cy', p.y); this.ss[i].style.opacity = 0.2 + 0.5 * p.z; });
    TextFx.fadeFromRight(this.l1, t, 0.05, { dur: 0.6, dx: 34 });
    const k = eob(seg(t, 0.6, 1.3), 1.6);
    this.l2.opacity = eo(seg(t, 0.6, 0.9)); this.l2.transform = 'scale(' + lerp(0.85, 1, k) + ')'; this.l2.transformOrigin = '0 60%';
    this.rule.transform = 'scaleX(' + eo(seg(t, 1.4, 2.0)) + ')';
    TextFx.fadeFromRight(this.cta, t, 1.8);
    this.tutor.opacity = eo(seg(t, 0.9, 1.2));
    this.tutor.transform = 'translate(' + lerp(160, 0, eob(seg(t, 0.9, 1.7), 1.5)) + 'px,' + (Math.sin(t * 2.2) * 7) + 'px) rotate(' + (Math.sin(t * 1.6) * 1.5) + 'deg)';
    this.note.opacity = eo(seg(t, 2.6, 3.1));
    this.b.opacity = 0.3 + 0.4 * eo(seg(t, 0.9, 1.8));
    kit.stage.style.transform = 'scale(' + (1 + 0.003 * t) + ')';
  },
});
