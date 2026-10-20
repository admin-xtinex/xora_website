// Layer 5: entry, stop and the risk budget; then risk vs reward vs fees as bars.
const RK_B = 21.4;
kit.scene('risk', UI.layerScene(kit, {
  layer: 4, a: 14.4, val: 7.0,
  kick: 'Step 5 · Risk budget', title: 'How much could this cost me?',
  card: '<div class="rb-a" style="position:absolute;left:28px;right:28px;top:16px"><p class="kick" style="margin:0 0 6px">Example only · practice account</p>' +
    '<p class="mono" style="margin:0;font-size:28px;line-height:1.4">Account <span style="color:var(--main)">1,000 USDT</span> · budget <span style="color:var(--accent)">10 USDT</span></p>' +
    '<p class="mono rb-a2" style="margin:0;font-size:26px;line-height:1.4;color:color-mix(in srgb, var(--second) 75%, var(--ground))">Size ≈ 1,000 USDT notional (T22)</p></div>' +
    '<div class="rb-b" style="position:absolute;left:28px;right:28px;top:14px;display:flex;flex-direction:column;gap:6px">' +
    ['If wrong|−10 USDT|var(--accent)|1', 'Right to 60,100|+1.7 USDT|var(--main)|0.167', 'Fees, both sides|≈ −1 USDT|color-mix(in srgb, var(--second) 60%, var(--ground))|0.1'].map((r) => {
      const c = r.split('|');
      return '<div style="display:flex;align-items:center;gap:14px;height:36px"><span style="width:220px;font-size:24px;white-space:nowrap">' + c[0] + '</span>' +
        '<div style="flex:1;height:22px;position:relative"><div class="rb-bar" data-w="' + c[3] + '" style="position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:' + c[2] + '"></div></div>' +
        '<span class="mono" style="width:150px;text-align:right;font-size:24px;color:' + c[2] + '">' + c[1] + '</span></div>';
    }).join('') + '</div>',
  cardInit(kit, el) {
    this.ra = el.querySelector('.rb-a').style; this.ra2 = el.querySelector('.rb-a2').style; this.rbb = el.querySelector('.rb-b').style;
    this.bars = [...el.querySelectorAll('.rb-bar')].map((e) => [e.style, +e.dataset.w]);
  },
  cardRender(t) {
    const sw = kit.seg(t, RK_B, RK_B + 0.5);
    this.ra.opacity = kit.eo(kit.seg(t, 8.6, 9.1)) * (1 - kit.ei(sw));
    this.ra2.opacity = kit.eo(kit.seg(t, 14.4, 14.9));
    this.rbb.opacity = kit.eo(kit.seg(t, RK_B + 0.3, RK_B + 0.8));
    this.bars.forEach(([s, w], i) => { s.width = (w * 100 * kit.eo(kit.seg(t, RK_B + 0.6 + i * 0.9, RK_B + 1.4 + i * 0.9))).toFixed(1) + '%'; });
  },
  cardAt: 8.6,
  poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'explain' }, { t: 8.6, pose: 'writing' }, { t: 14.4, pose: 'point', flip: true }, { t: RK_B, pose: 'magnify' }],
}));
