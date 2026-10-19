const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const UF_K = [[0, 60000], [4.4, 60000], [7.6, 59920], [12.6, 60060], [17, 60030]];
const ufP = (s) => UI.path(UF_K, s) + Math.sin(s * 4.1) * 6 * (1 - Math.max(0, 1 - Math.abs(s - 7.6) / 1.2));
const ufX = (s) => 1040 + Math.min(s, 16) / 16 * 560, ufY = (p) => 700 - (p - 59850) / 250 * 440;
kit.scene('unfilled', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const yl = ufY(59900).toFixed(1);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="uf-chart">' + UI.grid(1040, 1600, ufY, 59850, 60100, 50) +
      '<line class="uf-lim" x1="1040" x2="1600" y1="' + yl + '" y2="' + yl + '" stroke-width="4" stroke-dasharray="14 10" style="stroke:var(--main)"/>' +
      '<text class="uf-ll" x="1600" y="' + (+yl + 40) + '" text-anchor="end" style="fill:var(--main);font-size:24px;font-weight:700">Your limit buy · 59,900</text>' +
      '<path class="uf-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="uf-dot" r="10" style="fill:var(--second)"/>' +
      '<g class="uf-gap"><line x1="' + ufX(7.6).toFixed(1) + '" x2="' + ufX(7.6).toFixed(1) + '" y1="' + (ufY(59920) + 14).toFixed(1) + '" y2="' + (+yl - 4) + '" stroke-width="3" style="stroke:var(--accent)"/>' +
      '<text x="' + (ufX(7.6) - 18).toFixed(1) + '" y="' + (+yl + 40) + '" text-anchor="end" style="fill:var(--accent);font-size:24px;font-weight:700">Low 59,920 · 20 USDT short</text></g>' +
      '</g><text x="1040" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional</text></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick uf-k" style="color:var(--accent)">No guarantee</p>' +
      '<h2 class="line uf-t">A limit may never fill</h2>' +
      '<p class="sub uf-s">The price must reach your limit, and someone must trade with you there.</p></div>' +
      '<div class="glass uf-def" style="left:140px;top:600px;width:820px;padding:26px 36px"><p class="def" style="margin:0">An <b>open order</b> is placed but not filled yet. It may fill later, or never.</p></div>' +
      '<span class="chip uf-st" style="position:absolute;left:140px;top:470px;font-size:26px;padding:12px 24px;border-color:color-mix(in srgb, var(--accent) 60%, transparent)">Open order · 0 of 0.01 BTC filled</span>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.uf-k').style; this.t = q('.uf-t'); this.s = q('.uf-s'); this.def = q('.uf-def').style; this.st = q('.uf-st').style;
    this.chart = q('.uf-chart').style; this.line = q('.uf-line'); this.dot = q('.uf-dot');
    this.lim = q('.uf-lim').style; this.ll = q('.uf-ll').style; this.gap = q('.uf-gap').style; 
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.5, pose: 'think' }, { t: 4.3, pose: 'candles' }, { t: 10.0, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 1.0, { stagger: 0.05 });
    this.chart.opacity = eo(seg(t, 0.4, 1.0));
    const lp = seg(t, 4.3, 5.0);
    this.lim.opacity = eo(lp); this.ll.opacity = eo(lp);
    const end = Math.min(t, 16);
    this.line.setAttribute('d', UI.line(ufP, 0, end, ufX, ufY));
    this.dot.setAttribute('cx', ufX(end).toFixed(1)); this.dot.setAttribute('cy', ufY(ufP(end)).toFixed(1));
        this.gap.opacity = eo(seg(t, 8.2, 8.7));
    UI.rise(this.st, t, 5.0);
    UI.rise(this.def, t, 10.1);
    this.tutor.render(t);
  },
});
