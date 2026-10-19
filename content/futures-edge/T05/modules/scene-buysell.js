const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
kit.scene('buysell', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (label, cls) => '<div style="display:flex;align-items:baseline;justify-content:space-between;padding:14px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + label + '</span><span class="mono ' + cls + '" style="font-size:46px"></span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick bs-k">Spot trading</p>' +
      '<h2 class="line bs-t">Buy and sell spot</h2>' +
      '<p class="def bs-d"><b>Buying spot:</b> you pay USDT now and receive the actual BTC. <b>Selling spot:</b> you hand the BTC back and get USDT.</p></div>' +
      '<div class="glass bs-an" style="left:140px;top:610px;width:800px;padding:24px 32px;display:flex;align-items:center;gap:28px">' +
      '<svg width="110" height="70" viewBox="0 0 110 70" style="flex:none"><path d="M18 62 L32 14 H78 L92 62 Z" style="fill:color-mix(in srgb, #f5c542 70%, var(--ground));stroke:#f5c542;stroke-width:3"/><path d="M40 24 H70" style="stroke:color-mix(in srgb, #fff 60%, transparent);stroke-width:4;stroke-linecap:round"/></svg>' +
      '<p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">Like buying gold at a shop: you pay, and the gold is <span class="hl">yours to keep</span>.</p></div>' +
      '<div class="glass bs-acc" style="left:1040px;top:190px;width:560px;padding:26px 34px">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline"><p class="kick" style="margin:0">Your spot account</p><p class="fict" style="margin:0">Fictional</p></div>' +
      row('USDT', 'bs-u') + row('BTC', 'bs-b') +
      '<div style="display:flex;align-items:baseline;justify-content:space-between;padding:14px 0 0"><span style="font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">BTC price</span><span class="mono bs-p" style="font-size:36px;color:var(--main)"></span></div></div>' +
      '<div style="position:absolute;left:1040px;top:610px;display:flex;gap:18px"><span class="chip bs-buy" style="font-size:28px;padding:14px 26px">Buy 0.01 BTC</span><span class="chip bs-sell" style="font-size:28px;padding:14px 26px">Sell 0.01 BTC</span></div>' +
      '<p class="mono bs-r1" style="position:absolute;left:1040px;top:700px;margin:0;font-size:28px">Paid 0.01 × 60,000 = 600 USDT</p>' +
      '<p class="mono bs-r2" style="position:absolute;left:1040px;top:700px;margin:0;font-size:28px">Got 0.01 × 62,000 = <span class="hl">620 USDT</span></p>' +
      '<p class="bs-r3" style="position:absolute;left:1040px;top:752px;margin:0;font-size:28px;font-weight:600;color:var(--main)">+20 USDT vs the start, before fees</p>' +
      '<div class="bs-fly" style="position:absolute;left:0;top:0;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;font-size:18px;font-weight:700;background:color-mix(in srgb, var(--main) 35%, var(--ground));border:2px solid var(--main)">USDT</div>' +
      '<div class="bs-fly2" style="position:absolute;left:0;top:0;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;font-size:20px;font-weight:700;background:color-mix(in srgb, var(--accent) 35%, var(--ground));border:2px solid var(--accent)">BTC</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.bs-k').style; this.t = q('.bs-t'); this.d = q('.bs-d'); this.an = q('.bs-an').style; this.acc = q('.bs-acc').style;
    this.u = q('.bs-u'); this.b = q('.bs-b'); this.p = q('.bs-p');
    this.buy = q('.bs-buy').style; this.sell = q('.bs-sell').style; this.r1 = q('.bs-r1').style; this.r2 = q('.bs-r2').style; this.r3 = q('.bs-r3').style;
    this.f1 = q('.bs-fly').style; this.f2 = q('.bs-fly2').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 6.4, pose: 'present' }, { t: 11.8, pose: 'point', flip: true }, { t: 21.4, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.2, { stagger: 0.05 });
    const ap = seg(t, 6.4, 7.0);
    this.an.opacity = eo(ap); this.an.transform = 'translateY(' + lerp(30, 0, eo(ap)).toFixed(1) + 'px)';
    const cp = seg(t, 0.8, 1.6);
    this.acc.opacity = eo(cp); this.acc.transform = 'translateY(' + lerp(30, 0, eo(cp)).toFixed(1) + 'px)';
    // Buy at 60,000, then the price moves to 62,000 and the BTC is sold.
    const bu = eio(seg(t, 12.4, 13.6)), bb = eio(seg(t, 13.0, 14.0));
    const su = eio(seg(t, 19.9, 21.1)), sb = eio(seg(t, 19.6, 20.6));
    const usdt = lerp(lerp(1000, 400, bu), 1020, su), btc = lerp(lerp(0, 0.01, bb), 0, sb);
    const ut = UI.fmt(usdt, 2), bt = btc.toFixed(4), price = Math.round(lerp(60000, 62000, eio(seg(t, 17.9, 19.1))) / 10) * 10, pt = UI.fmt(price);
    if (this.u.textContent !== ut) this.u.textContent = ut;
    if (this.b.textContent !== bt) this.b.textContent = bt;
    if (this.p.textContent !== pt) this.p.textContent = pt;
    this.u.style.color = (t > 12.4 && t < 13.8) || (t > 19.9 && t < 21.3) ? 'var(--main)' : 'var(--second)';
    this.b.style.color = (t > 13.0 && t < 14.2) || (t > 19.6 && t < 20.8) ? 'var(--accent)' : 'var(--second)';
    const chipIn = seg(t, 1.8, 2.3);
    const hot = (s, a, b) => { const on = t >= a && t < b; s.opacity = eo(chipIn) * (on ? 1 : 0.55); s.background = on ? 'var(--main)' : ''; s.color = on ? 'var(--ground)' : ''; s.borderColor = on ? 'var(--main)' : ''; s.transform = 'scale(' + (1 + 0.06 * Math.sin(Math.PI * seg(t, a, a + 0.4))).toFixed(4) + ')'; };
    hot(this.buy, 11.8, 17.9); hot(this.sell, 19.4, 25);
    this.r1.opacity = eo(seg(t, 13.8, 14.3)) * (1 - eo(seg(t, 19.2, 19.5)));
    this.r2.opacity = eo(seg(t, 21.0, 21.5)); this.r3.opacity = eo(seg(t, 21.6, 22.1));
    // A USDT coin leaves the account and a BTC coin arrives (buy); then the reverse (sell).
    const fly = (s, a, from, to) => { const p = seg(t, a, a + 1.0); s.opacity = p > 0 && p < 1 ? Math.sin(Math.PI * p) * 1.4 : 0; s.transform = 'translate(' + lerp(from[0], to[0], eio(p)).toFixed(1) + 'px,' + (lerp(from[1], to[1], eio(p)) - Math.sin(Math.PI * p) * 60).toFixed(1) + 'px)'; };
    const U = [1540, 300], Bt = [1540, 390], M = [1700, 230];
    if (t < 16) { fly(this.f1, 12.2, U, M); fly(this.f2, 12.9, M, Bt); } else { fly(this.f2, 19.5, Bt, M); fly(this.f1, 19.9, M, U); }
    this.tutor.render(t);
  },
});
