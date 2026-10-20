// Layer 4: volume bars under the candles; the last push up fades.
kit.scene('volume', UI.layerScene(kit, {
  layer: 3, a: 8.2, val: 6.6,
  kick: 'Step 4 · Volume and liquidity', title: 'How busy is the market?',
  card: '<p class="def" style="margin:0;font-size:28px;line-height:1.35"><b>Volume</b>: how much was traded in a candle. <b>Liquidity</b>: how easily you can trade.</p>',
  poses: [{ t: 0, pose: 'magnify' }, { t: 0.6, pose: 'explain' }, { t: 8.2, pose: 'point', flip: true }, { t: 14.8, pose: 'think' }],
}));
