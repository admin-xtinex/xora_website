const { seg, eo, eio, eob, lerp, TextFx } = kit;
const CX = 1240, CY = 540, R = 330, NP = 700;
const WORDS = ['Scanning', 'Analysing', 'Calculating'];
const COINS = ['DOOD', 'IOST', 'ALT', 'XNY', 'ETH', 'BTC', 'SOL', 'CVX', 'JCT', 'BR', 'ZRO', 'PARTI'];
kit.scene('engine', {
  init(kit) {
    const r = kit.rng(9); this.pts = [];
    for (let i = 0; i < NP; i++) { const y = 1 - (i / (NP - 1)) * 2, rad = Math.sqrt(1 - y * y), th = i * 2.399963; this.pts.push([Math.cos(th) * rad, y, Math.sin(th) * rad, r()]); }
    let tags = ''; COINS.forEach((c, i) => { tags += '<p class="num engine-coin" style="position:absolute;left:0;top:0;margin:0;font-size:22px;letter-spacing:.08em;color:#eef1f7">' + c + '</p>'; });
    let cols = ''; for (let c = 0; c < 6; c++) cols += '<p class="num engine-col" style="position:absolute;left:' + (c * 58) + 'px;top:0;width:56px;margin:0;font-size:18px;line-height:28px;color:#3ecbff;white-space:pre"></p>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="bloom engine-b" style="left:' + (CX - 520) + 'px;top:' + (CY - 520) + 'px;width:1040px;height:1040px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<g class="engine-r1"><ellipse cx="' + CX + '" cy="' + CY + '" rx="470" ry="120" fill="none" stroke="#3ecbff" stroke-opacity=".45" stroke-width="2" stroke-dasharray="4 10"/></g>' +
      '<g class="engine-r2"><ellipse cx="' + CX + '" cy="' + CY + '" rx="430" ry="150" fill="none" stroke="#a855f7" stroke-opacity=".4" stroke-width="2"/></g>' +
      '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R + 40) + '" fill="none" stroke="#3ecbff" stroke-opacity=".12" stroke-width="2"/>' +
      '<circle class="engine-ping" cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="none" stroke="#3ecbff" stroke-width="3"/></svg>' +
      tags +
      '<div style="position:absolute;left:150px;top:660px;width:360px;height:300px;overflow:hidden;opacity:.35">' + cols + '</div>' +
      '<div class="words" style="left:150px;top:250px;width:700px;gap:18px">' +
      '<p class="tag">XORA engine · live</p>' +
      '<p class="hero engine-w" style="font-size:116px">Scanning</p>' +
      '<p class="sub engine-s">Every coin, every candle: price, volume, trend, volatility and order flow, read again the moment a candle closes.</p></div></div>'));
    this.coins = [...kit.stage.querySelectorAll('.engine-coin')].map((e) => e.style);
    this.cols = [...kit.stage.querySelectorAll('.engine-col')];
    const q = (c) => kit.stage.querySelector('.engine-' + c);
    this.r1 = q('r1').style; this.r2 = q('r2').style; this.ping = q('ping'); this.w = q('w'); this.s = q('s').style; this.b = q('b').style;
    // the lesson player has no shared fx canvas: the sphere gets its own, under the words
    const cv = kit.h('<canvas width="1920" height="1080" style="position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none"></canvas>');
    kit.stage.querySelector('.ground').insertBefore(cv, kit.stage.querySelector('.ground > .words'));
    this.ctx = cv.getContext('2d');
  },
  render(t0) {
    const t = t0 * 1.25;
    const ctx = this.ctx; ctx.clearRect(0, 0, 1920, 1080); const rot = t * 0.55, tilt = 0.38, scanY = Math.sin(t * 1.3) * 0.95, appear = eo(seg(t, 0, 1.2));
    const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, z, k] of this.pts) {
      const x1 = x * cr - z * sr, z1 = x * sr + z * cr; const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      const per = 1 / (1.9 - z2 * 0.7); const px = CX + x1 * R * per * 1.3 * appear, py = CY + y2 * R * per * 1.3 * appear;
      const near = Math.max(0, 1 - Math.abs(y - scanY) * 7);
      const a = (0.18 + 0.55 * (z2 + 1) / 2) * appear + near * 0.9;
      ctx.fillStyle = near > 0.05 ? 'rgba(238,241,247,' + Math.min(1, a) + ')' : (k > 0.82 ? 'rgba(168,85,247,' + a + ')' : 'rgba(62,203,255,' + a + ')');
      const sz = (1.2 + per * 1.8) * (1 + near * 1.4);
      ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
    }
    ctx.restore();
    this.r1.transformOrigin = CX + 'px ' + CY + 'px'; this.r1.transform = 'rotate(' + (t * 16) + 'deg)';
    this.r2.transformOrigin = CX + 'px ' + CY + 'px'; this.r2.transform = 'rotate(' + (-t * 11 + 20) + 'deg)';
    const pp = (t % 1.6) / 1.6; this.ping.setAttribute('r', (R * 0.4 + pp * R * 1.1).toFixed(1)); this.ping.style.opacity = (1 - pp) * 0.6 * appear;
    this.coins.forEach((s, i) => { const a = t * 0.5 + i / COINS.length * Math.PI * 2; const x = CX + Math.cos(a) * 520, y = CY + Math.sin(a) * 175; const front = Math.sin(a) > 0; s.transform = 'translate(' + (x - 30).toFixed(1) + 'px,' + (y - 14).toFixed(1) + 'px) scale(' + (front ? 1.1 : 0.8) + ')'; s.opacity = (front ? 0.95 : 0.35) * eo(seg(t, 0.6 + i * 0.05, 1.0 + i * 0.05)); });
    const f = Math.floor(t * 3); this.cols.forEach((el, c) => { const rr = kit.rng(c * 777 + f); let s = ''; for (let i = 0; i < 12; i++) s += (rr() * 99.99).toFixed(2) + '\n'; el.textContent = s; });
    const k = Math.min(2, Math.floor(t / 2.4)); const ph = (t % 2.4) / 2.4; const word = WORDS[k];
    if (this.w.textContent !== word) this.w.textContent = word;
    this.w.style.opacity = k < 2 ? Math.min(1, seg(ph, 0, 0.12) * 1.0, 1 - seg(ph, 0.86, 1)) : seg(ph, 0, 0.12);
    this.w.style.transform = 'translateX(' + lerp(26, 0, eo(seg(ph, 0, 0.2))) + 'px)';
    this.s.opacity = eo(seg(t, 0.6, 1.1));
    this.b.opacity = 0.35 + 0.15 * Math.sin(t * 2); 
    kit.stage.style.opacity = 1 - eio(seg(t, 7.0, 7.5));
    if (t > 7.0) { ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,' + eio(seg(t, 7.0, 7.5)) + ')'; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }
  },
});
