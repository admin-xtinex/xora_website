const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Two made-up markets: a deep book with a tiny spread, and a thin one with a 1% spread.
const CN = [
  { n: 'BTC/USDT', ba: 'Bid 59,999 · Ask 60,001', sp: 'Spread 2 USDT ≈ 0.003%', bids: [0.95, 0.8, 0.9, 0.7, 0.85], asks: [0.9, 0.85, 0.75, 0.95, 0.8], liq: 0.9, lq: 'High', res: '✓ Chosen', col: 'var(--main)' },
  { n: 'XYZ/USDT', ba: 'Bid 0.995 · Ask 1.005', sp: 'Spread 0.01 USDT = 1%', bids: [0.22, 0.1, 0.16, 0.06, 0.12], asks: [0.14, 0.2, 0.08, 0.12, 0.05], liq: 0.16, lq: 'Thin', res: 'Skip', col: 'var(--accent)' },
];
kit.scene('coin', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Step 1 of 8 · Choose a coin', 'Choose a liquid market');
    this.track = UI.track(kit, 1);
    let cards = '';
    CN.forEach((c, k) => {
      let book = '';
      for (let i = 0; i < 5; i++) {
        book += '<div style="position:absolute;right:50%;margin-right:10px;top:' + (i * 24) + 'px;height:16px;border-radius:4px 0 0 4px;background:color-mix(in srgb, var(--up) 70%, transparent)" class="cn-b" data-w="' + c.bids[i] + '"></div>' +
          '<div style="position:absolute;left:50%;margin-left:10px;top:' + (i * 24) + 'px;height:16px;border-radius:0 4px 4px 0;background:color-mix(in srgb, var(--down) 70%, transparent)" class="cn-b" data-w="' + c.asks[i] + '"></div>';
      }
      cards += '<div class="glass cn-c" style="left:' + (140 + k * 510) + 'px;top:300px;width:480px;height:420px;padding:26px 30px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between"><span class="mono" style="font-size:40px">' + c.n + '</span>' +
        '<span class="chip cn-r" style="font-size:24px;padding:6px 18px;' + (k ? 'border-color:var(--accent);color:var(--accent)' : 'background:var(--main);color:var(--ground);border-color:var(--main)') + '">' + c.res + '</span></div>' +
        '<p class="mono" style="margin:12px 0 0;font-size:26px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">' + c.ba + '</p>' +
        '<p class="fict" style="margin:22px 0 8px">Order book · buyers | sellers</p>' +
        '<div style="position:relative;height:116px">' + book + '<div style="position:absolute;left:50%;top:-4px;width:2px;height:120px;background:color-mix(in srgb, var(--second) 30%, transparent)"></div></div>' +
        '<p class="mono cn-sp" style="margin:18px 0 0;font-size:26px;color:' + c.col + '">' + c.sp + '</p>' +
        '<div class="cn-m" style="display:flex;align-items:center;gap:16px;margin-top:20px"><span style="font-size:26px;font-weight:600;width:120px">Liquidity</span>' +
        '<div style="flex:1;height:16px;border-radius:8px;background:color-mix(in srgb, var(--second) 10%, transparent);overflow:hidden"><div class="cn-f" style="height:100%;width:0;background:' + c.col + '"></div></div><span class="mono" style="font-size:24px;width:70px">' + c.lq + '</span></div>' +
        '</div>';
    });
    kit.stage.append(kit.h('<div><p class="fict" style="position:absolute;left:140px;top:262px;margin:0">Made-up coins · fictional prices · educational simulation</p>' + cards +
      '<div class="glass cn-d" style="left:1180px;top:300px;width:600px;padding:24px 32px"><p class="kick" style="margin:0 0 10px">Liquidity</p><p class="def" style="margin:0;font-size:30px">How easily you can <b>buy or sell</b> without moving the price much.</p></div>' +
      '<div class="glass cn-a" style="left:1180px;top:520px;width:600px;padding:24px 32px;border-color:var(--main)"><div style="display:flex;align-items:center;gap:16px"><p class="kick" style="margin:0">Demo account</p><span class="chip mono" style="font-size:20px;padding:4px 14px;background:var(--main);color:var(--ground);border-color:var(--main)">DEMO</span></div>' +
      '<p class="mono" style="margin:8px 0 0;font-size:64px"><span class="cn-v">0</span> <span style="font-size:32px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">USDT</span></p>' +
      '<p style="margin:4px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 62%, var(--ground))">Practice money · no real orders</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.cards = all('.cn-c').map((e) => e.style); this.bars = all('.cn-b').map((e) => ({ st: e.style, w: +e.dataset.w }));
    this.sp = all('.cn-sp').map((e) => e.style); this.m = all('.cn-m').map((e) => e.style); this.f = all('.cn-f').map((e) => e.style); this.r = all('.cn-r').map((e) => e.style);
    this.d = q('.cn-d').style; this.a = q('.cn-a').style; this.v = q('.cn-v');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 1.0, pose: 'magnify' }, { t: 6.9, pose: 'explain' }, { t: 12.8, pose: 'think' }, { t: 19.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t); this.track(t);
    this.cards.forEach((s, i) => { UI.rise(kit, s, t, 1.0 + i * 0.4, 0.7, 34); });
    this.bars.forEach((b, i) => { const a = 7.2 + (i % 10) * 0.08 + (i >= 10 ? 0.5 : 0); b.st.width = (b.w * 170 * eio(seg(t, a, a + 0.7))).toFixed(1) + 'px'; });
    this.sp.forEach((s, i) => { UI.rise(kit, s, t, 12.9 + i * 2.2, 0.5, 14); });
    this.m.forEach((s, i) => { s.opacity = eo(seg(t, 7.2, 7.6)); });
    this.f.forEach((s, i) => { s.width = (CN[i].liq * 100 * eio(seg(t, 8.0 + i * 0.5, 9.2 + i * 0.5))).toFixed(1) + '%'; });
    this.r.forEach((s, i) => { const p = seg(t, 19.2 + i * 0.6, 19.8 + i * 0.6); s.opacity = eo(p); s.transform = 'scale(' + lerp(0.7, 1, eob(p, 1.8)).toFixed(3) + ')'; });
    const dim = eo(seg(t, 19.8, 20.4));
    this.cards[1].opacity = (+this.cards[1].opacity * lerp(1, 0.55, dim)).toFixed(3);
    this.cards[0].borderColor = dim > 0 ? 'var(--main)' : '';
    UI.rise(kit, this.d, t, 6.9, 0.6, 24);
    UI.rise(kit, this.a, t, 19.4, 0.6, 24);
    UI.set(this.v, UI.fmt(Math.round(1000 * eo(seg(t, 19.8, 21.0)))));
    this.tutor.render(t);
  },
});
