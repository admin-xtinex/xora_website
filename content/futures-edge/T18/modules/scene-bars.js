const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The fictional 15-minute history with a volume bar under each candle (BTC per minute).
const BR_H = UI.H, brX = (i) => 240 + i * 74, brY = (p) => 570 - (p - 60000) / 600 * 220, BR_B = 770, BR_U = 6;
const BR_BIG = [1, 2, 9];
kit.scene('bars', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'br-c', BR_H.length);
    let bars = '', nums = '';
    BR_H.forEach((c, i) => {
      bars += '<rect class="br-v" x="' + (brX(i) - 24) + '" width="48" rx="4" style="fill:color-mix(in srgb, ' + (c[3] >= c[0] ? 'var(--up)' : 'var(--down)') + ' 55%, transparent)"/>';
      nums += '<text class="br-n mono" x="' + brX(i) + '" y="' + (BR_B - c[4] * BR_U - 10) + '" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 75%, var(--ground));font-size:22px">' + c[4] + '</text>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="br-grid">' + UI.grid(200, 1310, brY, 60000, 60600, 100) + '</g>' +
      '<rect class="br-col" x="' + (brX(9) - 37) + '" y="330" width="74" height="' + (BR_B - 330 + 6) + '" rx="12" fill="none" stroke-width="3" stroke-dasharray="10 8" style="stroke:var(--main)"/>' +
      this.cd.html + bars + nums +
      '<line class="br-base" x1="200" x2="1310" y1="' + BR_B + '" y2="' + BR_B + '" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 30%, transparent)"/>' +
      BR_BIG.map((i) => '<rect class="br-hi" x="' + (brX(i) - 33) + '" y="' + (BR_B - BR_H[i][4] * BR_U - 42) + '" width="66" height="' + (BR_H[i][4] * BR_U + 48) + '" rx="10" fill="none" stroke-width="3" style="stroke:var(--accent)"/>').join('') +
      '</svg>' +
      '<p class="tag br-one" style="left:' + (brX(9) + 46) + 'px;top:332px;color:var(--main);border-color:var(--main)">Same minute</p>' +
      '<p class="kick" style="position:absolute;left:1336px;top:' + (BR_B - 30) + 'px;margin:0;font-size:20px">Volume, BTC</p>' +
      '<p class="fict" style="position:absolute;left:200px;top:306px;margin:0">BTC/USDT · 1-minute candles · fictional</p>' +
      '<div class="glass br-p" style="left:1410px;top:330px;width:370px;padding:14px 26px">' +
      '<div class="row br-r"><span>Quiet minute</span><span class="mono" style="font-size:34px">5 BTC</span></div>' +
      '<div class="row br-r" style="border:0"><span>Busy minute</span><span class="mono hv" style="font-size:34px">24 BTC</span></div></div>' +
      '<p class="chip br-of" style="position:absolute;left:1410px;top:530px;margin:0;font-size:28px;padding:14px 24px;border-color:var(--accent)"><span class="dot" style="background:var(--accent)"></span>Often, not always</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick br-k">Volume bars</p>' +
      '<h2 class="line br-t">One bar under each candle</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.br-k').style; this.t = q('.br-t'); this.grid = q('.br-grid').style; this.base = q('.br-base').style;
    this.vs = all('.br-v'); this.ns = all('.br-n').map((e) => e.style); this.col = q('.br-col').style; this.one = q('.br-one').style;
    this.p = q('.br-p').style; this.rows = all('.br-r').map((e) => e.style); this.hi = all('.br-hi').map((e) => e.style); this.of = q('.br-of').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'present' }, { t: 5.0, pose: 'point', flip: true }, { t: 10.2, pose: 'magnify' }, { t: 15.2, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 0.9)); this.base.opacity = this.grid.opacity;
    const dim = (i) => {
      const q = seg(t, 10.4, 10.9) * (1 - seg(t, 14.8, 15.2)), b = seg(t, 15.4, 15.9);
      if (b > 0) return BR_BIG.includes(i) ? 1 : 1 - 0.65 * eo(b);
      return i === 9 || i === 12 ? 1 : 1 - 0.65 * eo(q);
    };
    BR_H.forEach((c, i) => {
      const a = 0.9 + i * 0.3, p = seg(t, a, a + 0.45), d = dim(i);
      this.cd.set(i, { x: brX(i), w: 44, o: c[0], h: lerp(c[0], c[1], eo(p)), l: lerp(c[0], c[2], eo(p)), c: lerp(c[0], c[3], eo(p)), y: brY, op: eo(seg(t, a, a + 0.2)) * d });
      const h = c[4] * BR_U * eob(seg(t, a + 0.1, a + 0.6), 1.4);
      this.vs[i].setAttribute('y', (BR_B - h).toFixed(1)); this.vs[i].setAttribute('height', Math.max(0, h).toFixed(1));
      this.vs[i].style.opacity = d;
      this.ns[i].opacity = eo(seg(t, a + 0.5, a + 0.8)) * d;
    });
    const c = seg(t, 5.2, 5.8);
    this.col.opacity = eo(c) * (1 - ei(seg(t, 9.8, 10.3))); this.col.strokeDashoffset = (-t * 14).toFixed(1);
    this.one.opacity = eo(seg(t, 5.6, 6.1)) * (1 - ei(seg(t, 9.8, 10.3)));
    UI.rise(this.p, t, 10.4);
    this.rows.forEach((s, i) => { s.opacity = eo(seg(t, 10.8 + i * 1.2, 11.2 + i * 1.2)); });
    this.hi.forEach((s, i) => { const p = seg(t, 15.6 + i * 0.3, 16.0 + i * 0.3); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = 'center'; s.transform = 'scale(' + lerp(1.3, 1, eob(p, 1.5)).toFixed(3) + ')'; });
    UI.rise(this.of, t, 17.4);
    this.tutor.render(t);
  },
});
