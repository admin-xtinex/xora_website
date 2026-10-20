const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Three cards: BUY (long), SELL / SHORT and NO TRADE, each with a small fictional chart that plays out.
const OC_W = 460, OC_H = 200;
const ocPts = (seed, f) => { const r = kit.rng(seed), out = []; let v = 0; for (let i = 0; i <= 46; i++) { v += (r() - 0.5) * 10; v *= 0.8; out.push([i * OC_W / 46, f(i / 46) + v]); } return out; };
const OC = [
  { name: 'BUY', also: 'also called long', col: 'var(--up)', note: 'You gain if price rises', line: 110, lab: 'trigger 60,120',
    pts: ocPts(3, (p) => p < 0.5 ? 160 - p * 90 : 115 - (p - 0.5) * 150), a: 1.2 },
  { name: 'SELL / SHORT', also: 'you sell first', col: 'var(--down)', note: 'You gain if price falls', line: 110, lab: 'trigger 59,880',
    pts: ocPts(5, (p) => p < 0.5 ? 60 + p * 90 : 105 + (p - 0.5) * 150), a: 7.2 },
  { name: 'NO TRADE', also: 'stand aside', col: 'var(--main)', note: 'Wait for a clearer setup', line: null,
    pts: ocPts(8, (p) => 110 + Math.sin(p * 19) * 34), a: 13.2 },
];
kit.scene('outcomes', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    OC.forEach((c, i) => {
      const lines = c.line != null
        ? '<line x1="0" x2="' + OC_W + '" y1="' + c.line + '" y2="' + c.line + '" stroke-dasharray="10 8" stroke-width="2.5" style="stroke:color-mix(in srgb, var(--second) 55%, transparent)"/>' +
          '<text class="oc-lab" x="6" y="' + (c.line - 12) + '" style="fill:var(--second);font-size:22px;font-family:var(--mono)">' + c.lab + '</text>'
        : '<line x1="0" x2="' + OC_W + '" y1="62" y2="62" stroke-dasharray="10 8" stroke-width="2.5" style="stroke:color-mix(in srgb, var(--down) 60%, transparent)"/>' +
          '<line x1="0" x2="' + OC_W + '" y1="158" y2="158" stroke-dasharray="10 8" stroke-width="2.5" style="stroke:color-mix(in srgb, var(--up) 60%, transparent)"/>';
      cards += '<div class="glass oc-c" style="left:' + (140 + i * 560) + 'px;top:370px;width:520px;height:390px;padding:22px 30px">' +
        '<div style="display:flex;align-items:center;gap:16px"><span class="pill" style="color:' + c.col + ';font-size:30px;padding:8px 22px">' + c.name + '</span><span class="lbl">' + c.also + '</span></div>' +
        '<svg width="' + OC_W + '" height="' + OC_H + '" viewBox="0 -10 ' + OC_W + ' ' + OC_H + '" style="display:block;margin:14px 0 6px;overflow:visible">' + lines +
        '<path class="oc-l" fill="none" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" style="stroke:' + c.col + '"/><circle class="oc-d" r="11" style="fill:var(--second)"/></svg>' +
        '<p style="margin:0;font-size:30px;font-weight:700;color:' + c.col + '">' + c.note + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1640px;gap:14px"><p class="kick oc-k">The three answers</p>' +
      '<h2 class="line oc-t">BUY, SHORT, or wait</h2>' +
      '<p class="sub oc-s" style="font-size:30px">Plan for this candle only; every check runs again when it triggers.</p></div>' + cards +
      '<p class="fict oc-f" style="position:absolute;right:140px;top:250px;margin:0">Fictional prices · Illustrative, not real market data</p></div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = kit.stage.querySelector('.oc-k').style; this.t = kit.stage.querySelector('.oc-t'); this.s = kit.stage.querySelector('.oc-s');
    this.f = kit.stage.querySelector('.oc-f').style;
    this.cs = all('.oc-c').map((e) => e.style); this.ls = all('.oc-l'); this.ds = all('.oc-d'); this.labs = all('.oc-lab');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'point', flip: true }, { t: 12.8, pose: 'calm' }, { t: 18.2, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 18.4, { stagger: 0.06 });
    this.f.opacity = 0.9 * eo(seg(t, 2.0, 2.6));
    OC.forEach((c, i) => {
      UI.rise(kit, this.cs[i], t, c.a - 0.6, 0.7, 36);
      const focus = t > 18.2 ? (i === 0 ? 1 : 0.45) : 1;
      this.cs[i].opacity = (+this.cs[i].opacity * lerp(1, focus, eo(seg(t, 18.2, 18.8)))).toFixed(3);
      const n = Math.max(1, Math.round(eio(seg(t, c.a, c.a + 4.2)) * (c.pts.length - 1)));
      const P = c.pts.slice(0, n + 1);
      this.ls[i].setAttribute('d', P.map((p, j) => (j ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' '));
      const last = P[P.length - 1];
      this.ds[i].setAttribute('cx', last[0].toFixed(1)); this.ds[i].setAttribute('cy', last[1].toFixed(1));
    });
    // BUY trigger label pulses when the plan line is read out
    const hl = Math.max(0, Math.sin(Math.PI * seg(t, 18.4, 20.4)));
    if (this.labs[0]) this.labs[0].style.fill = hl > 0.05 ? 'var(--up)' : 'var(--second)';
    this.tutor.render(t);
  },
});
