const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Two traders, same entry and stop, different notional. Price falls to the stop; the losses and account bars move together.
const HK_E = 60000, HK_S = 59400, HK_N = [500, 10000], HK_A = 1000;
const HK_Y = (p) => 740 - (p - 59300) * 0.5;
const HK_P = [[0, 60000], [12.8, 60000], [13.6, 60060], [14.6, 59850], [15.4, 59900], [16.6, 59600], [17.2, 59650], [18.0, 59400]];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (i, nm) => '<div class="glass hk-c" style="left:' + (1000 + i * 400) + 'px;top:300px;width:380px;height:460px;padding:22px 28px">' +
      '<p class="kick" style="margin:0 0 6px">' + nm + '</p><p style="margin:0;font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Position worth</p>' +
      '<p class="mono hk-n" style="margin:2px 0 18px;font-size:44px">' + UI.fmt(HK_N[i]) + ' <span style="font-size:24px">USDT</span></p>' +
      '<p style="margin:0;font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">PnL now</p><p class="mono hk-p" style="margin:2px 0 18px;font-size:44px">0.00</p>' +
      '<p style="margin:0 0 10px;font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Account <span class="mono hk-a" style="color:var(--second)">1,000.00</span></p>' + UI.bar('hk-b' + i, 324, 26) + '</div>';
    this.h = UI.head(kit, 'Same chart, same stop', 'Why did B lose 20 times more?',
      '<svg class="art" viewBox="0 0 1920 1080"><g class="hk-g">' + UI.grid(150, 820, HK_Y, 59400, 60000, 200) + '</g>' +
      '<line x1="150" x2="820" y1="' + HK_Y(HK_E) + '" y2="' + HK_Y(HK_E) + '" stroke-width="3" style="stroke:var(--second)"/>' +
      '<line class="hk-sl" x1="150" x2="820" y1="' + HK_Y(HK_S) + '" y2="' + HK_Y(HK_S) + '" stroke-width="3" stroke-dasharray="12 8" style="stroke:var(--accent)"/>' +
      '<path class="hk-line" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="hk-dot" r="10" style="fill:var(--main)"/></svg>' +
      '<p class="tag" style="left:166px;top:' + (HK_Y(HK_E) - 56) + 'px">Entry 60,000 · both</p>' +
      '<p class="tag hk-st" style="left:166px;top:' + (HK_Y(HK_S) + 14) + 'px;color:var(--accent);border-color:var(--accent)">Stop-loss 59,400</p>' +
      '<p class="fict" style="position:absolute;left:150px;top:282px;margin:0">BTC/USDT · fictional, not real market data</p>' + card(0, 'Trader A') + card(1, 'Trader B'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.g = q('.hk-g').style; this.line = q('.hk-line'); this.dot = q('.hk-dot'); this.st = q('.hk-st').style;
    this.cs = all('.hk-c').map((e) => e.style); this.ns = all('.hk-n').map((e) => e.style); this.ps = all('.hk-p'); this.as = all('.hk-a'); this.bs = [q('.hk-b0-f').style, q('.hk-b1-f').style];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'explain' }, { t: 7.0, pose: 'point' }, { t: 12.6, pose: 'magnify' }, { t: 18.0, pose: 'confused' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    this.g.opacity = eo(seg(t, 0.2, 0.8));
    // The price path: flat at entry, then down to the stop between 12.8 and 18.0. x advances with time.
    const x0 = 170, xs = (s) => x0 + Math.min(s, 18.6) * 32;
    let d = '', price = HK_E;
    for (let s = 0; s <= Math.min(t, 18.6); s += 0.1) { const p = UI.path(HK_P, s) + (s < 12.8 ? 18 * Math.sin(s * 1.7) * Math.sin(s * 0.6) : 0); price = Math.max(HK_S, p); d += (d ? 'L' : 'M') + xs(s).toFixed(1) + ' ' + HK_Y(price).toFixed(1); }
    this.line.setAttribute('d', d || 'M0 0'); this.dot.setAttribute('cx', xs(Math.min(t, 18.6)).toFixed(1)); this.dot.setAttribute('cy', HK_Y(price).toFixed(1));
    this.line.style.opacity = t > 0.6 ? 1 : 0; this.dot.style.opacity = eo(seg(t, 0.6, 0.9));
    // PnL tracks the price move only after 12.8 (before that, the walk is shown as noise and PnL stays near 0).
    const mv = t < 12.8 ? 0 : (Math.min(price, HK_E) - HK_E) / HK_E;
    this.cs.forEach((s, i) => {
      UI.rise(kit, s, t, i ? 9.0 : 7.0, 0.7);
      const pnl = HK_N[i] * mv, acc = HK_A + pnl;
      UI.set(this.ps[i], UI.sgn(pnl, 2) + ' USDT'); this.ps[i].style.color = pnl < -0.004 ? 'var(--down)' : 'var(--second)';
      UI.set(this.as[i], UI.fmt(acc, 2)); this.bs[i].width = (acc / HK_A * 100).toFixed(2) + '%';
      this.bs[i].background = pnl < -50 ? 'linear-gradient(90deg, var(--main), var(--down))' : 'linear-gradient(90deg, var(--main), var(--accent))';
    });
    this.tutor.render(t);
  },
});
