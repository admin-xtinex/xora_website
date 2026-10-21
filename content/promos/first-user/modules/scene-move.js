const { seg, eo, eio, eob, lerp, TextFx } = kit;
const V = [-8.88,-9.04,-9.04,-8.13,-3.43,-1.72,-2.28,-3.26,-4.54,-12.4,-13.23,-13.23,-14.13,-12.3,-12.61,-11.61,-10.23,-11.69,-12.15,-8.65,-10.26,-7.36,-8.49,-7.82,-8.61,-7.38,-10.95,-17.67,26.75,25.89,25.35,36.52,36.43];
const X0 = 160, X1 = 1460, Y = (v) => 700 - v * 9.2;
const P = V.map((v, i) => [X0 + (X1 - X0) * i / (V.length - 1), Y(v)]);
const d = P.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
let LEN = 0; for (let i = 1; i < P.length; i++) LEN += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
kit.scene('move', {
  init(kit) {
    let grid = '';
    for (let h = 0; h <= 8; h += 2) grid += '<line x1="' + (X0 + (X1 - X0) * h / 8) + '" x2="' + (X0 + (X1 - X0) * h / 8) + '" y1="300" y2="900" stroke="#eef1f7" stroke-opacity=".06" stroke-width="2"/>';
    const area = d + ' L' + X1 + ' 900 L' + X0 + ' 900 Z';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + grid +
      '<defs><linearGradient id="moveL" x1="0" x2="1"><stop offset="0" stop-color="#a855f7"/><stop offset=".8" stop-color="#3ecbff"/><stop offset="1" stop-color="#2fd897"/></linearGradient>' +
      '<linearGradient id="moveF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ecbff" stop-opacity=".26"/><stop offset="1" stop-color="#3ecbff" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="moveC"><rect class="move-clip" x="0" y="0" width="0" height="1080"/></clipPath>' +
      '<filter id="moveGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter></defs>' +
      '<path d="' + area + '" fill="url(#moveF)" clip-path="url(#moveC)"/>' +
      '<path class="move-glow" d="' + d + '" fill="none" stroke="url(#moveL)" stroke-width="16" opacity=".55" filter="url(#moveGlow)"/>' +
      '<path class="move-line" d="' + d + '" fill="none" stroke="url(#moveL)" stroke-width="6" stroke-linejoin="round"/>' +
      '<circle class="move-dot" r="14" fill="#eef1f7" stroke="#02030a" stroke-width="5"/>' +
      '<circle class="move-ring" cx="' + P[32][0] + '" cy="' + P[32][1] + '" r="20" fill="none" stroke="#2fd897" stroke-width="4"/></svg>' +
      '<div class="words" style="left:160px;top:100px;width:1100px;gap:10px"><p class="tag">His live account</p><h2 class="mid move-head">Then the winners ran.</h2></div>' +
      '<div class="words move-end" style="left:1510px;top:250px;width:380px;gap:6px"><p class="num up" style="font-size:84px;line-height:1">+36.43</p><p class="tag" style="color:#b4bccb;font-size:20px">USDT profit for the day</p><p class="mid thin" style="font-size:44px;color:#eef1f7;margin-top:6px">≈ ₹3,643</p></div></div>'));
    const q = (c) => kit.stage.querySelector('.move-' + c);
    this.line = q('line'); this.glow = q('glow'); this.line.style.strokeDasharray = LEN; this.glow.style.strokeDasharray = LEN;
    this.clip = q('clip'); this.dot = q('dot'); this.ring = q('ring'); this.head = q('head'); this.end = q('end').style;
  },
  render(t) {
    TextFx.fadeFromRight(this.head, t, 0.05);
    const p = eio(seg(t, 0.4, 4.0));
    this.line.style.strokeDashoffset = LEN * (1 - p); this.glow.style.strokeDashoffset = LEN * (1 - p);
    this.clip.setAttribute('width', X0 + (X1 - X0) * p);
    const f = p * (V.length - 1), i = Math.min(V.length - 2, Math.floor(f)), k = f - i;
    this.dot.setAttribute('cx', lerp(P[i][0], P[i + 1][0], k)); this.dot.setAttribute('cy', lerp(P[i][1], P[i + 1][1], k));
    this.dot.style.opacity = eo(seg(t, 0.3, 0.6));
    const e = eob(seg(t, 4.0, 4.5), 1.8);
    this.end.opacity = eo(seg(t, 4.0, 4.3)); this.end.transform = 'scale(' + lerp(1.3, 1, e) + ')'; this.end.transformOrigin = '0 50%';
    const pr = (t - 4.0) % 1.2 / 1.2; this.ring.setAttribute('r', (20 + pr * 60).toFixed(1)); this.ring.style.opacity = t > 4.0 ? (1 - pr) * 0.8 : 0;
    kit.stage.style.opacity = 1 - eio(seg(t, 5.5, 6));
  },
});
