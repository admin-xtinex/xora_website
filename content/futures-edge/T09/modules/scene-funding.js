const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const FU_L = [1170, 470], FU_S = [1570, 470], FU_FLIP = 9.0;
kit.scene('funding', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const node = (c, name, col) => '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="96" style="fill:color-mix(in srgb, ' + col + ' 18%, var(--ground));stroke:' + col + ';stroke-width:3"/>' +
      '<text x="' + c[0] + '" y="' + (c[1] + 12) + '" text-anchor="middle" style="fill:var(--second);font-size:36px;font-weight:700">' + name + '</text>';
    let coins = '';
    for (let i = 0; i < 4; i++) coins += '<circle class="fu-coin" r="14" style="fill:var(--second)"/>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + node(FU_L, 'Longs', 'var(--main)') + node(FU_S, 'Shorts', 'var(--accent)') +
      '<line x1="' + (FU_L[0] + 110) + '" x2="' + (FU_S[0] - 110) + '" y1="' + FU_L[1] + '" y2="' + FU_S[1] + '" stroke-width="3" stroke-dasharray="8 10" style="stroke:color-mix(in srgb, var(--second) 35%, transparent)"/>' + coins +
      '<text class="fu-rate mono" x="1370" y="320" text-anchor="middle" style="fill:var(--second);font-size:40px"></text>' +
      '<text class="fu-who" x="1370" y="640" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 80%, var(--ground));font-size:28px;font-weight:600"></text>' +
      '<text x="1370" y="690" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 60%, var(--ground));font-size:24px">Paid at each funding time, often every 8 hours</text></svg>' +
      '<p class="fict" style="position:absolute;left:1100px;top:232px;margin:0">Illustrative, not real market data</p>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick fu-k">Futures only</p>' +
      '<h2 class="line fu-t">Funding</h2></div>' +
      '<div class="glass fu-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0"><b>Funding</b> is a regular payment between long and short traders in many futures markets. It is <b>separate from trading fees</b>.</p></div>' +
      '<div class="glass fu-w" style="left:140px;top:610px;width:820px;padding:24px 36px"><p class="fict" style="margin:0 0 10px">Example · fictional rate</p><p class="mono" style="margin:0;font-size:32px">600 USDT × 0.01% = <span style="color:var(--main)">0.06 USDT</span></p>' +
      '<p style="margin:8px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">per funding time, paid or received. More in T13.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.fu-k').style; this.t = q('.fu-t'); this.def = q('.fu-def').style; this.w = q('.fu-w').style;
    this.art = q('.art').style; this.rate = q('.fu-rate'); this.who = q('.fu-who');
    this.coins = [...kit.stage.querySelectorAll('.fu-coin')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'checklist' }, { t: 0.5, pose: 'explain' }, { t: 7.5, pose: 'think' }, { t: 14.3, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    this.art.opacity = eo(seg(t, 1.0, 1.6));
    const pos = t < FU_FLIP;
    UI.txt(this.rate, t < 2.0 ? '' : pos ? 'Rate +0.01%' : 'Rate −0.01%');
    this.rate.style.fill = pos ? 'var(--main)' : 'var(--accent)';
    UI.txt(this.who, t < 2.0 ? '' : pos ? 'Positive rate: longs pay shorts' : 'Negative rate: shorts pay longs');
    this.coins.forEach((c, i) => {
      const ph = ((t - 2.0) / 1.6 + i / 4) % 1, on = t > 2.0 && Math.abs(t - FU_FLIP) > 0.5;
      const from = pos ? FU_L : FU_S, to = pos ? FU_S : FU_L;
      c.setAttribute('cx', lerp(from[0] + (pos ? 110 : -110), to[0] + (pos ? -110 : 110), ph).toFixed(1));
      c.setAttribute('cy', (from[1] - Math.sin(Math.PI * ph) * 60).toFixed(1));
      c.style.opacity = on ? Math.sin(Math.PI * ph).toFixed(3) : 0;
    });
    UI.rise(this.w, t, 14.4);
    this.tutor.render(t);
  },
});
