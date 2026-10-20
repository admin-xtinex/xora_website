const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Size × price = notional; a 1% fall shrinks the 600 USDT notional by 6 USDT; rice bags: same price drop, ten times the loss.
kit.scene('notional', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const bag = (x, w, h, lbl, cls) => '<g class="' + cls + '"><rect x="' + (x - w / 2) + '" y="' + (150 - h) + '" width="' + w + '" height="' + h + '" rx="16" style="fill:color-mix(in srgb, var(--second) 16%, transparent);stroke:var(--second);stroke-width:3"/>' +
      '<text x="' + x + '" y="' + (150 - h / 2 + 10) + '" text-anchor="middle" style="fill:var(--second);font-size:26px;font-weight:700">' + lbl + '</text></g>';
    this.h = UI.head(kit, 'Size and notional', 'What is the position worth?',
      '<div class="glass nt-d" style="left:140px;top:300px;width:800px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:30px"><b>Position size</b>: how much of the coin you hold.<br><b>Notional</b>: what it is worth = size × price.</p></div>' +
      '<div class="glass nt-e" style="left:140px;top:500px;width:800px;height:250px;padding:20px 30px"><p class="kick" style="margin:0 0 10px">Worked example · fictional</p>' +
      '<p class="mono" style="margin:0;font-size:34px">0.01 BTC × <span class="nt-px">60,000</span> = <span class="nt-v hl">600.00</span> USDT</p>' +
      '<div style="margin-top:20px">' + UI.bar('nt-b', 740, 30) + '</div>' +
      '<p class="mono nt-l" style="margin:16px 0 0;font-size:30px">600 × 1% = <span style="color:var(--down)">−6.00 USDT</span> at the stop</p></div>' +
      '<div class="glass nt-r" style="left:980px;top:300px;width:800px;height:450px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Like buying rice</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.35;font-weight:600">Same price drop per kilo. Ten kilos lose ten times more.</p>' +
      '<svg width="740" height="250" viewBox="0 0 740 250" style="position:absolute;left:30px;top:170px">' + bag(160, 90, 80, '1 kg', 'nt-g1') + bag(500, 220, 140, '10 kg', 'nt-g2') +
      '<rect class="nt-a1" x="150" y="170" width="20" height="0" rx="4" style="fill:var(--down)"/><rect class="nt-a2" x="400" y="170" width="200" height="0" rx="4" style="fill:var(--down)"/>' +
      '<text class="nt-t1" x="160" y="236" text-anchor="middle" style="fill:var(--down);font-size:26px;font-weight:700">loses 1 part</text><text class="nt-t2" x="500" y="236" text-anchor="middle" style="fill:var(--down);font-size:26px;font-weight:700">loses 10 parts</text></svg></div>');
    const q = (s) => kit.stage.querySelector(s);
    this.d = q('.nt-d').style; this.e = q('.nt-e').style; this.px = q('.nt-px'); this.v = q('.nt-v'); this.b = q('.nt-b-f').style; this.l = q('.nt-l').style;
    this.r = q('.nt-r').style; this.a1 = q('.nt-a1'); this.a2 = q('.nt-a2'); this.t1 = q('.nt-t1').style; this.t2 = q('.nt-t2').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 7.4, pose: 'writing' }, { t: 11.8, pose: 'magnify' }, { t: 18.2, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.d, t, 0.6, 0.7);
    UI.rise(kit, this.e, t, 7.4, 0.7);
    // Price falls 1% (60,000 to 59,400) during 12.4..14.4; the notional shrinks with it.
    const f = eio(seg(t, 12.4, 14.4)), price = 60000 - 600 * f, val = 0.01 * price;
    UI.set(this.px, UI.fmt(Math.round(price))); UI.set(this.v, UI.fmt(val, 2));
    this.v.style.color = f > 0 ? 'var(--down)' : '';
    this.b.width = (eo(seg(t, 7.8, 9.0)) * (val / 600) * 100).toFixed(2) + '%';
    UI.rise(kit, this.l, t, 14.6, 0.6, 12);
    UI.rise(kit, this.r, t, 18.2, 0.7);
    const a = eo(seg(t, 19.6, 20.6));
    this.a1.setAttribute('height', (a * 10).toFixed(1)); this.a2.setAttribute('height', (a * 10).toFixed(1));
    this.a1.setAttribute('width', 20); this.a2.setAttribute('width', (200 * a).toFixed(1)); this.a2.setAttribute('x', (500 - 100 * a).toFixed(1));
    this.t1.opacity = eo(seg(t, 20.6, 21.0)); this.t2.opacity = eo(seg(t, 21.0, 21.4));
    this.tutor.render(t);
  },
});
