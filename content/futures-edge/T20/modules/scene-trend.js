// Layer 1: the trend.
kit.scene('trend', UI.layerScene(kit, {
  layer: 0, a: 6.4, val: 5.0,
  kick: 'Step 1 · Trend', title: 'Which way has price been going?',
  card: '<p class="kick" style="margin:0 0 8px">Meaning</p><p class="def" style="margin:0;font-size:30px;line-height:1.35"><b>Trend</b>: the general direction of recent price moves.</p>',
  poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'explain' }, { t: 6.4, pose: 'point', flip: true }, { t: 11.4, pose: 'think' }],
}));
