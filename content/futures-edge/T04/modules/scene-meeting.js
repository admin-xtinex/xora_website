const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MT_C = [1390, 450], MT_N = 9, MT_T0 = 6.8, MT_STEP = 1.1, MT_FLY = 1.3;
kit.scene('meeting', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const r = kit.rng(44);
    this.trips = [];
    for (let i = 0; i < MT_N; i++) this.trips.push({ by: 300 + r() * 300, sy: 300 + r() * 300, t: MT_T0 + i * MT_STEP + (r() - 0.5) * 0.3 });
    let dots = '';
    this.trips.forEach(() => { dots += '<circle class="mt-b" r="16" style="fill:var(--main)"/><circle class="mt-s" r="16" style="fill:var(--accent)"/>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<circle class="mt-ring" cx="' + MT_C[0] + '" cy="' + MT_C[1] + '" r="150" pathLength="1" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 50%, transparent)"/>' +
      '<circle class="mt-hub" cx="' + MT_C[0] + '" cy="' + MT_C[1] + '" r="128" style="fill:color-mix(in srgb, var(--ground) 80%, var(--main))"/>' +
      '<path class="mt-arr" d="M1240 250 C 1300 270, 1320 300, 1330 318" pathLength="1" fill="none" stroke-width="3" stroke-linecap="round" style="stroke:var(--second)"/>' +
      dots + '</svg>' +
      '<div class="mt-lab" style="position:absolute;left:' + MT_C[0] + 'px;top:' + MT_C[1] + 'px;transform:translate(-50%,-50%);text-align:center"><p style="margin:0;font-size:36px;font-weight:700">Exchange</p><p class="fict" style="margin:6px 0 0">marketplace + record</p></div>' +
      '<p class="kick mt-h1" style="position:absolute;left:1010px;top:640px;margin:0">Buyers</p>' +
      '<p class="kick mt-h2" style="position:absolute;left:1660px;top:640px;margin:0;color:var(--accent)">Sellers</p>' +
      '<div class="glass mt-rec" style="left:' + (MT_C[0] - 200) + 'px;top:640px;width:400px;padding:16px 26px;text-align:center"><p style="margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Trades recorded</p><p class="mono mt-n" style="margin:4px 0 0;font-size:44px"></p></div>' +
      '<span class="chip mt-pf" style="position:absolute;left:1000px;top:200px;font-size:26px;padding:12px 22px">Trading platform: your app or website</span>' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick mt-k">The meeting place</p>' +
      '<h2 class="line mt-t">An exchange brings orders together</h2>' +
      '<p class="def mt-d">An <b>exchange</b> is a business that runs a marketplace where people buy and sell assets.</p>' +
      '<p class="def mt-d2">A <b>trading platform</b> is the app or website you use to reach it.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.mt-k').style; this.t = q('.mt-t'); this.d = q('.mt-d'); this.d2 = q('.mt-d2');
    this.ring = q('.mt-ring'); this.hub = q('.mt-hub').style; this.lab = q('.mt-lab').style; this.rec = q('.mt-rec').style; this.n = q('.mt-n');
    this.h1 = q('.mt-h1').style; this.h2 = q('.mt-h2').style; this.pf = q('.mt-pf').style; this.arr = q('.mt-arr');
    this.bs = all('.mt-b'); this.ss = all('.mt-s');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'laptop' }, { t: 0.6, pose: 'explain' }, { t: 6.8, pose: 'present' }, { t: 13.4, pose: 'laptop' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.05 });
    TextFx.fadeFromRight(this.d2, t, 13.6, { stagger: 0.06 });
    const h = seg(t, 0.8, 1.6);
    this.ring.setAttribute('stroke-dasharray', eio(seg(t, 0.8, 2.0)) + ' 1');
    this.hub.opacity = eo(h); this.lab.opacity = eo(seg(t, 1.2, 1.8));
    this.h1.opacity = eo(seg(t, 6.6, 7.1)); this.h2.opacity = eo(seg(t, 6.8, 7.3));
    this.rec.opacity = eo(seg(t, 2.0, 2.6));
    let done = 0, flash = 0;
    this.trips.forEach((tr, i) => {
      const p = seg(t, tr.t, tr.t + MT_FLY), e = eio(p), gone = t > tr.t + MT_FLY;
      const bx = lerp(1040, MT_C[0] - 20, e), by = lerp(tr.by, MT_C[1], e), sx = lerp(1740, MT_C[0] + 20, e), sy = lerp(tr.sy, MT_C[1], e);
      this.bs[i].setAttribute('cx', bx.toFixed(1)); this.bs[i].setAttribute('cy', by.toFixed(1));
      this.ss[i].setAttribute('cx', sx.toFixed(1)); this.ss[i].setAttribute('cy', sy.toFixed(1));
      const op = (t >= tr.t - 0.3 && !gone) ? eo(seg(t, tr.t - 0.3, tr.t)) : 0;
      this.bs[i].style.opacity = op; this.ss[i].style.opacity = op;
      if (gone) done++;
      flash = Math.max(flash, Math.sin(Math.PI * seg(t, tr.t + MT_FLY, tr.t + MT_FLY + 0.5)));
    });
    UI.set(this.n, done);
    this.hub.transformBox = 'fill-box'; this.hub.transformOrigin = 'center';
    this.hub.transform = 'scale(' + (lerp(0.7, 1, eob(h, 1.6)) * (1 + flash * 0.05)).toFixed(4) + ')';
    this.hub.fill = 'color-mix(in srgb, var(--ground) ' + (80 - flash * 20).toFixed(0) + '%, var(--main))';
    const pf = seg(t, 13.4, 14.0);
    this.pf.opacity = eo(pf); this.pf.transform = 'translateY(' + lerp(-20, 0, eo(pf)) + 'px)';
    this.arr.setAttribute('stroke-dasharray', eio(seg(t, 13.9, 14.6)) + ' 1');
    this.arr.style.opacity = t > 13.85 ? 1 : 0;
    this.tutor.render(t);
  },
});
