const { seg, eo, eio, eob, lerp, TextFx } = kit;
kit.scene('hook', {
  init(kit) {
    const r = kit.rng(3); this.stars = [];
    let s = '';
    for (let i = 0; i < 90; i++) { const st = { x: r() * 1920, y: r() * 1080, z: 0.3 + r() * 0.9, ph: r() * 6 }; this.stars.push(st); s += '<circle class="hook-s" r="' + (1 + st.z * 1.6).toFixed(1) + '" fill="' + (i % 4 ? '#3ecbff' : '#a855f7') + '"/>'; }
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + s +
      '<defs><linearGradient id="hookL" x1="0" x2="1"><stop offset="0" stop-color="#3ecbff" stop-opacity="0"/><stop offset=".5" stop-color="#eef1f7"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/></linearGradient></defs>' +
      '<rect class="hook-streak" x="0" y="738" width="1920" height="3" fill="url(#hookL)"/></svg>' +
      '<div class="bloom hook-bloom" style="left:560px;top:340px;width:800px;height:800px"></div>' +
      '<div class="words" style="left:200px;top:330px;width:1520px;gap:30px">' +
      '<p class="tag hook-tag">A true story</p>' +
      '<h1 class="mid hook-q" style="font-size:76px">Do you know what happened to</h1>' +
      '<p class="hero grad hook-name" style="font-size:150px">our first user?</p></div></div>'));
    this.ss = [...kit.stage.querySelectorAll('.hook-s')];
    this.streak = kit.stage.querySelector('.hook-streak').style; this.bloom = kit.stage.querySelector('.hook-bloom').style;
    this.tag = kit.stage.querySelector('.hook-tag'); this.q = kit.stage.querySelector('.hook-q'); this.name = kit.stage.querySelector('.hook-name').style;
    this.box = kit.stage.querySelector('.words').style;
  },
  render(t0) {
    const t = t0 * 1.25;
    this.stars.forEach((st, i) => { const x = (st.x - t * 22 * st.z + 1920) % 1920; this.ss[i].setAttribute('cx', x.toFixed(1)); this.ss[i].setAttribute('cy', st.y); this.ss[i].style.opacity = (0.25 + 0.5 * st.z) * (0.6 + 0.4 * Math.sin(t * 1.4 + st.ph)); });
    TextFx.fadeFromRight(this.tag, t, -0.7);
    TextFx.fadeFromRight(this.q, t, -0.55, { stagger: 0.09 });
    const n = eob(seg(t, 1.3, 2.1), 1.7);
    this.name.opacity = eo(seg(t, 1.3, 1.6));
    this.name.transform = 'scale(' + lerp(0.82, 1, n) + ')'; this.name.transformOrigin = '0 60%';
    this.name.letterSpacing = lerp(0.02, -0.035, eo(seg(t, 1.3, 2.6))) + 'em';
    this.streak.transformOrigin = '960px 740px'; this.streak.transform = 'scaleX(' + eio(seg(t, 1.3, 2.4)) + ')';
    this.streak.opacity = eo(seg(t, 1.3, 1.6)) * (1 - 0.5 * seg(t, 3, 4.5));
    this.bloom.opacity = 0.35 + 0.5 * eo(seg(t, 1.3, 2.0)) - 0.25 * seg(t, 2.5, 4.5);
    this.bloom.transform = 'scale(' + lerp(0.6, 1.15, eo(seg(t, 1.2, 3.5))) + ')';
    const out = eio(seg(t, 4.4, 5));
    this.box.opacity = 1 - out; this.box.transform = 'translateX(' + (-3 * t - 50 * out) + 'px)';
  },
});
