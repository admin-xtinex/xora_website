const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Carousel cards three to five: order book difference (walls, spread, spoof risk, absorption), price-range replay, trigger levels.
const C2_NAMES = ['Xora read', 'Volume', 'Order book', 'Replay', 'Levels'];
const C2_DEF = [
  [0.6, 'Wall', 'A very large resting order at one price.'],
  [7.8, 'Spoof risk', 'Walls that appear and vanish may be fake.'],
  [12.6, 'Absorption', 'Big orders soak up trades; price barely moves.'],
];
kit.scene('carousel2', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.car = UI.carousel(kit, 'c2');
    let names = '';
    C2_NAMES.forEach((n, i) => { names += '<div class="c2-n" style="display:flex;align-items:center;gap:14px"><span class="mono" style="width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:22px;border:2px solid currentColor;flex:none">' + (i + 1) + '</span><span style="font-size:28px;font-weight:700">' + n + '</span></div>'; });
    let defs = '';
    C2_DEF.forEach((d) => { defs += '<div class="c2-d" style="margin-bottom:16px"><p style="margin:0;font-size:30px;font-weight:700;color:var(--main)">' + d[1] + '</p><p style="margin:2px 0 0;font-size:28px;line-height:1.35">' + d[2] + '</p></div>'; });
    kit.stage.append(kit.h('<div>' +
      '<div class="words" style="left:140px;top:170px;width:940px"><p class="kick c2-k">Market-read carousel</p><h2 class="line c2-t" style="font-size:72px">Order book, replay, levels</h2></div>' +
      '<div style="position:absolute;left:140px;top:390px;display:flex;flex-direction:column;gap:12px">' + names + '</div>' +
      '<div class="glass c2-g" style="left:430px;top:380px;width:640px;padding:22px 28px">' + defs + '</div></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.c2-k').style; this.t = q('.c2-t'); this.ns = all('.c2-n').map((e) => e.style); this.g = q('.c2-g').style; this.ds = all('.c2-d').map((e) => e.style);
    this.bids = all('.c2-bid').map((e) => e.style); this.asks = all('.c2-ask').map((e) => e.style);
    this.sp = q('.c2-sp'); this.ab = q('.c2-ab').style; this.r1 = q('.c2-r1'); this.r2 = q('.c2-r2'); this.stop = q('.c2-stop').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'pointer', flip: true }, { t: 7.8, pose: 'magnify' }, { t: 17.6, pose: 'read' }, { t: 23.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.car.ph.opacity = 1; this.car.ml.opacity = 0.9;
    // card 3 shown from the start (index 2), then replay (3) and levels (4)
    const idx = 2 + eio(seg(t, 17.4, 18.2)) + eio(seg(t, 23.4, 24.2));
    this.car.go(idx);
    const cur = Math.round(idx);
    this.ns.forEach((s, i) => { s.opacity = (i === cur ? 1 : 0.4).toFixed(3); s.color = i === cur ? 'var(--main)' : ''; });
    UI.rise(kit, this.g, t, 0.6, 0.6, 16, 17.2, 17.6);
    this.ds.forEach((s, i) => { s.opacity = (+eo(seg(t, C2_DEF[i][0], C2_DEF[i][0] + 0.5))).toFixed(3); });
    // the big bid wall pulses when walls are named; an ask wall flickers in and out for spoof risk
    const wall = Math.max(0, Math.sin(Math.PI * seg(t, 1.0, 7.0)));
    this.bids[2].boxShadow = '0 0 0 ' + (4 * wall).toFixed(1) + 'px color-mix(in srgb, var(--up) 50%, transparent)';
    const fl = t > 8.2 && t < 11.4 ? (Math.floor((t - 8.2) * 2.5) % 2 ? 1 : 0) : 0;
    this.asks[1].width = (34 + fl * 52) + '%';
    UI.set(this.sp, t > 8.2 && t < 17.2 ? 'Medium' : 'Low');
    this.sp.style.color = t > 8.2 && t < 17.2 ? 'var(--warn)' : 'var(--up)';
    // absorption: the bid wall shrinks a little as sells hit it, then holds
    const abs = seg(t, 12.8, 15.8);
    this.bids[2].width = (92 - 18 * eo(abs)).toFixed(1) + '%';
    this.ab.textDecoration = abs > 0 && abs < 1 ? 'underline' : 'none';
    this.r1.setAttribute('stroke-dasharray', eio(seg(t, 18.4, 19.6)) + ' 1');
    this.r2.setAttribute('stroke-dasharray', eio(seg(t, 20.0, 21.2)) + ' 1');
    const sp = Math.max(0, Math.sin(Math.PI * seg(t, 24.2, 29.2)));
    this.stop.background = 'color-mix(in srgb, var(--down) ' + (sp * 20).toFixed(1) + '%, transparent)';
    this.tutor.render(t);
  },
});
