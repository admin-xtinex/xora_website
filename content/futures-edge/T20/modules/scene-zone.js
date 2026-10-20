// Layer 3: support and resistance zones, and how little room is left above.
kit.scene('zone', UI.layerScene(kit, {
  layer: 2, a: 8.2, val: 6.0,
  kick: 'Step 3 · Zones', title: 'Where is the floor, and the ceiling?',
  card: '<p class="def zn-1" style="margin:0;font-size:28px;line-height:1.35"><b>Support</b>: a floor where falls often paused. <b style="color:var(--accent)">Resistance</b>: a ceiling.</p>' +
    '<p class="mono zn-2" style="margin:8px 0 0;font-size:28px">Room up: 60,000 → 60,050 = <span style="color:var(--accent)">50 USDT</span></p>',
  cardInit(kit, el) { this.z2 = el.querySelector('.zn-2').style; },
  cardRender(t) { UI.rise(kit, this.z2, t, 14.2, 0.5, 12); },
  poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'explain' }, { t: 8.2, pose: 'point', flip: true }, { t: 14.2, pose: 'magnify' }],
}));
