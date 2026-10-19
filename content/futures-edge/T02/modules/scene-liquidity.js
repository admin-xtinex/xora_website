const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
const LQ_PRICES = [60000, 60100, 60200, 60300, 60400], LQ_PX = 200; // px per BTC
// [title, BTC at each level, panel appears at]
const LQ = [['Busy market · lots for sale', 1.5, 6.4], ['Quiet market · little for sale', 0.2, 8.6]];
const LQ_BUY0 = 13.2, LQ_BUY1 = 15.6; // the 1 BTC buy fills between these times
// What is left at each level after `got` BTC has been bought (cheapest first), and the price of the last fill.
const lqBook = (each, got) => { let need = got, last = null; const left = LQ_PRICES.map((p) => { const take = Math.min(each, need); need -= take; if (take > 1e-9) last = p; return each - take; }); return { left, last }; };
kit.scene('liquidity', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let panels = '';
    LQ.forEach((g, i) => {
      let rows = '';
      LQ_PRICES.forEach((p) => {
        rows += '<div style="display:flex;align-items:center;gap:20px;height:38px"><span class="mono" style="width:120px;font-size:26px">' + UI.fmt(p) + '</span>' +
          '<span style="position:relative;width:320px;height:30px"><span class="lq-b' + i + '" style="position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:color-mix(in srgb, var(--accent) 70%, var(--ground))"></span></span>' +
          '<span class="mono lq-a' + i + '" style="font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))"></span></div>';
      });
      panels += '<div class="glass lq-p' + i + '" style="left:' + (140 + i * 820) + 'px;top:400px;width:760px;padding:18px 30px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><p class="kick" style="margin:0;font-size:20px">' + g[0] + '</p><span class="chip lq-o' + i + '" style="font-size:22px;padding:8px 18px;border-color:var(--main)">Buy 1 BTC now</span></div>' +
        '<p class="fict" style="margin:0 0 6px">Sell orders, cheapest first · BTC for sale</p>' + rows +
        '<div style="display:flex;gap:24px;align-items:baseline;margin-top:6px"><span style="font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Last price</span><span class="mono lq-l' + i + '" style="font-size:36px"></span><span class="mono lq-m' + i + '" style="font-size:28px;font-weight:600"></span></div></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1520px"><p class="kick lq-k">Liquidity</p>' +
      '<h2 class="line lq-t">Busy market, quiet market</h2>' +
      '<p class="def lq-d"><b>Liquidity</b> is how easily you can buy or sell without moving the price much.</p></div>' +
      panels + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.lq-k').style; this.t = q('.lq-t'); this.d = q('.lq-d');
    this.g = LQ.map((g, i) => ({ p: q('.lq-p' + i).style, o: q('.lq-o' + i).style, b: all('.lq-b' + i).map((e) => e.style), a: all('.lq-a' + i), l: q('.lq-l' + i), m: q('.lq-m' + i) }));
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 6.4, pose: 'point', flip: true }, { t: 12.6, pose: 'magnify' }, { t: 16.4, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    const got = eio(seg(t, LQ_BUY0, LQ_BUY1));
    LQ.forEach((g, i) => {
      const G = this.g[i], p = seg(t, g[2], g[2] + 0.7);
      G.p.opacity = eo(p); G.p.transform = 'translateY(' + lerp(30, 0, eo(p)) + 'px)';
      const o = seg(t, 12.6, 13.1);
      G.o.opacity = eo(o) * (1 - 0.5 * seg(t, LQ_BUY1, LQ_BUY1 + 0.4));
      G.o.transform = 'scale(' + lerp(0.7, 1, eob(o, 1.8)) + ')';
      const bk = lqBook(g[1], got);
      G.b.forEach((s, j) => {
        const w = bk.left[j] * LQ_PX * eo(seg(t, g[2] + 0.3 + j * 0.12, g[2] + 0.8 + j * 0.12));
        s.width = w.toFixed(1) + 'px';
        UI.set(G.a[j], bk.left[j] < 1e-6 ? 'sold out' : bk.left[j].toFixed(1) + ' BTC');
      });
      const last = bk.last == null ? 60000 : bk.last;
      UI.set(G.l, UI.fmt(last) + ' USDT');
      const mv = last - 60000;
      UI.set(G.m, t < LQ_BUY1 + 0.6 ? '' : (mv ? '▲ +' + UI.fmt(mv) : 'no change'));
      G.m.style.color = mv ? 'var(--accent)' : 'var(--main)';
    });
    this.tutor.render(t);
  },
});
