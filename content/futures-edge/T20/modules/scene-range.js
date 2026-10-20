// Layer 2: the recent range, with its worked numbers.
kit.scene('range', UI.layerScene(kit, {
  layer: 1, a: 7.0, val: 5.8,
  kick: 'Step 2 · Recent range', title: 'How far has price been moving?',
  card: '<p class="kick" style="margin:0 0 6px">Range = recent high − recent low</p>' +
    '<p class="mono rg-1" style="margin:0;font-size:30px">60,100 − 59,500 = <span style="color:var(--main)">600 USDT</span></p>' +
    '<p class="mono rg-2" style="margin:4px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">600 ÷ 60,000 = 0.01 ≈ <span style="color:var(--main)">1%</span></p>',
  cardInit(kit, el) { this.r1 = el.querySelector('.rg-1').style; this.r2 = el.querySelector('.rg-2').style; },
  cardRender(t) { UI.rise(kit, this.r1, t, 7.4, 0.5, 12); UI.rise(kit, this.r2, t, 12.8, 0.5, 12); },
  poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'explain' }, { t: 7.0, pose: 'writing' }, { t: 12.8, pose: 'point', flip: true }],
}));
