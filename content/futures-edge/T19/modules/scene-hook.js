const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The tools so far line up as cards; then a stopwatch (minutes) and a cost tag pose the question.
const HK_T = [['T14', 'Candles'], ['T15', 'Timeframes'], ['T16', 'Trend'], ['T17', 'Zones'], ['T18', 'Volume & range']];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    HK_T.forEach((c, i) => {
      cards += '<div class="glass hk-c" style="left:' + (140 + i * 330) + 'px;top:310px;width:300px;padding:22px 26px"><p class="kick" style="margin:0 0 8px">' + c[0] + '</p><p style="margin:0;font-size:32px;font-weight:700">' + c[1] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' + cards +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="hk-sw" transform="translate(420 620)"><circle r="100" fill="none" stroke-width="10" style="stroke:color-mix(in srgb, var(--second) 18%, transparent)"/>' +
      '<rect x="-16" y="-130" width="32" height="20" rx="5" style="fill:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
      '<circle class="hk-arc" r="100" fill="none" stroke-width="10" stroke-linecap="round" transform="rotate(-90)" pathLength="1" style="stroke:var(--main)"/>' +
      '<line class="hk-hand" x1="0" y1="0" x2="0" y2="-76" stroke-width="7" stroke-linecap="round" style="stroke:var(--second)"/><circle r="10" style="fill:var(--second)"/></g></svg>' +
      '<p class="hk-q" style="position:absolute;left:580px;top:560px;margin:0;font-size:40px;font-weight:700;line-height:1.3">Used in <span class="hl">minutes</span>.<br>At what <span class="hv">cost</span>?</p>' +
      '<div class="hk-cs" style="position:absolute;left:1080px;top:560px;display:flex;gap:16px">' +
      ['Fees', 'Spread', 'Slippage'].map((s) => '<p class="chip hk-ch" style="margin:0;font-size:28px;padding:14px 24px;border-color:var(--accent)"><span class="dot" style="background:var(--accent)"></span>' + s + '</p>').join('') + '</div>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick hk-k">What you can read now</p>' +
      '<h2 class="line hk-t">From reading to deciding</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.cs = all('.hk-c').map((e) => e.style);
    this.sw = q('.hk-sw').style; this.arc = q('.hk-arc'); this.hand = q('.hk-hand'); this.q = q('.hk-q').style; this.chs = all('.hk-ch').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'checklist' }, { t: 6.5, pose: 'think' }, { t: 12.1, pose: 'explain' }],
      says: [{ t0: 12.4, t1: 15.6, text: 'Honestly!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cs.forEach((s, i) => UI.rise(s, t, 0.9 + i * 0.9));
    const w = seg(t, 6.5, 7.1);
    this.sw.opacity = eo(w);
    const sweep = (Math.max(0, t - 6.8) / 4) % 1;
    this.arc.setAttribute('stroke-dasharray', (t > 6.8 ? sweep : 0).toFixed(3) + ' 1');
    this.hand.setAttribute('transform', 'rotate(' + (Math.max(0, t - 6.8) * 90).toFixed(1) + ')');
    UI.rise(this.q, t, 7.0);
    this.chs.forEach((s, i) => UI.rise(s, t, 9.8 + i * 0.5));
    this.tutor.render(t);
  },
});
