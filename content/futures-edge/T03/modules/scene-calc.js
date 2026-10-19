const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const CA_KEYS = [[0, 60000], [6.0, 60000], [7.4, 63000], [17.6, 63000], [19.0, 57000]];
const caPrice = (t) => { let v = CA_KEYS[0][1]; for (let i = 1; i < CA_KEYS.length; i++) { const a = CA_KEYS[i - 1], b = CA_KEYS[i]; if (t >= a[0]) v = lerp(a[1], b[1], eio(seg(t, a[0], b[0]))); } return Math.round(v / 10) * 10; };
const CA_Q = [[1, 0], [0.001, 2]]; // quantity, decimals for value
const CA_W = [260, 330, 330, 260, 200];
kit.scene('calc', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const cell = (i, html, cls, st) => '<span class="' + (cls || '') + '" style="width:' + CA_W[i] + 'px;' + (st || '') + '">' + html + '</span>';
    const head = ['Quantity', '× Price (USDT per BTC)', '= Value (USDT)', 'Change (USDT)', 'Change %'];
    let rows = '<div style="display:flex;gap:20px;padding:0 0 14px;border-bottom:1.5px solid color-mix(in srgb, var(--second) 12%, transparent)">' + head.map((h, i) => cell(i, h, '', 'font-size:22px;font-weight:600;color:color-mix(in srgb, var(--second) 60%, var(--ground))')).join('') + '</div>';
    CA_Q.forEach((r, j) => {
      rows += '<div class="ca-r" style="display:flex;gap:20px;align-items:baseline;padding:18px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 8%, transparent)">' +
        cell(0, (j ? '0.001' : '1') + ' BTC', 'mono', 'font-size:40px;color:var(--main)') + cell(1, '', 'mono ca-p', 'font-size:40px') + cell(2, '', 'mono ca-v', 'font-size:40px;font-weight:500') +
        cell(3, '', 'mono ca-c', 'font-size:36px') + cell(4, '', 'mono ca-q', 'font-size:36px') + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick ca-k">Watch it update</p>' +
      '<h2 class="line ca-t">Price moves, value moves</h2></div>' +
      '<div class="glass ca-pr" style="left:1040px;top:180px;width:600px;padding:20px 30px"><p class="fict" style="margin:0 0 6px">BTC/USDT · fictional price</p>' +
      '<div style="display:flex;align-items:baseline;gap:22px"><span class="mono ca-big" style="font-size:64px"></span><span class="mono ca-bc" style="font-size:30px"></span></div></div>' +
      '<div class="glass ca-tb" style="left:140px;top:440px;width:1560px;padding:24px 36px"><p class="fict" style="margin:0 0 14px">Educational calculator · not a real exchange screen</p>' + rows + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ca-k').style; this.t = q('.ca-t'); this.pr = q('.ca-pr').style; this.tb = q('.ca-tb').style;
    this.big = q('.ca-big'); this.bc = q('.ca-bc');
    this.p = all('.ca-p'); this.v = all('.ca-v'); this.c = all('.ca-c'); this.qq = all('.ca-q'); this.rows = all('.ca-r').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'present' }, { t: 6.0, pose: 'point', flip: true }, { t: 12.0, pose: 'idea' }, { t: 17.6, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const a = seg(t, 0.5, 1.2), b = seg(t, 1.0, 1.8);
    this.pr.opacity = eo(a); this.pr.transform = 'translateY(' + lerp(30, 0, eo(a)) + 'px)';
    this.tb.opacity = eo(b); this.tb.transform = 'translateY(' + lerp(30, 0, eo(b)) + 'px)';
    const price = caPrice(t), chg = price - 60000, pc = chg / 60000 * 100;
    const col = chg > 0 ? 'var(--main)' : chg < 0 ? 'var(--accent)' : 'var(--second)';
    const sign = (x, dp) => (x > 0 ? '+' : x < 0 ? '−' : '') + UI.fmt(Math.abs(x), dp);
    UI.set(this.big, UI.fmt(price));
    UI.set(this.bc, chg ? (chg > 0 ? '▲ ' : '▼ ') + sign(pc, 1) + '%' : '');
    this.bc.style.color = col;
    CA_Q.forEach((r, j) => {
      UI.set(this.p[j], UI.fmt(price));
      UI.set(this.v[j], UI.fmt(price * r[0], r[1]));
      UI.set(this.c[j], sign(chg * r[0], r[1]));
      UI.set(this.qq[j], sign(pc, 1) + '%');
      this.c[j].style.color = col; this.qq[j].style.color = col;
      const hl = Math.sin(Math.PI * seg(t, 12.0 + j * 0.6, 13.2 + j * 0.6));
      this.rows[j].background = 'color-mix(in srgb, var(--main) ' + (hl * 12).toFixed(1) + '%, transparent)';
    });
    this.tutor.render(t);
  },
});
