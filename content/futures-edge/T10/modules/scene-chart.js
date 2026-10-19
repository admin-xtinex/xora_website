const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('chart', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    this.spot = UI.spot(kit);
    this.card = UI.tip(kit, 1128, 222, 690, '3 · Chart', 'Price over time', 'Each <b>candle</b> shows how the price moved during one slice of time. Cyan: it ended higher. Violet: lower.',
      '<p class="fict" style="margin:0">Illustrative, not real market data</p>');
    kit.stage.append(kit.h('<div class="chip ch-tf" style="position:absolute;left:420px;top:534px;font-size:26px;padding:8px 20px;background:color-mix(in srgb, var(--ground) 70%, var(--main));border-color:var(--main)"><span class="ch-tft">1 candle = 1 minute</span></div>'));
    kit.stage.append(kit.h('<div class="ch-ring" style="position:absolute;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;border:3px solid var(--second);box-sizing:border-box"></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.cs = this.card.style; this.tf = q('.ch-tf').style; this.tft = q('.ch-tft'); this.ring = q('.ch-ring').style;
    this.price = UI.path([[0, 60000], [7.4, 60000], [9.0, 60150], [10.4, 60070], [12.0, 60180], [14.5, 60120], [17, 60160]]);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'present' }, { t: 7.2, pose: 'magnify' }, { t: 12.8, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    const fn = (s) => this.price(s) + UI.wig(s, 14);
    const [lo, hi] = UI.hilo(fn, 7.2, Math.max(7.2, t));
    const p = fn(t);
    const tf = eio(seg(t, 13.4, 14.4));
    this.term.render(t, { sym: 'BTC', price: p, hi: t > 7.2 ? hi : null, lo: t > 7.2 ? lo : null, tf });
    this.spot.set(UI.R.chart, eo(seg(t, 0, 0.8)), eo(seg(t, 0.2, 1.0)));
    UI.show(this.cs, t, 0.8);
    this.tf.opacity = eo(seg(t, 2.6, 3.1)).toFixed(3);
    UI.set(this.tft, t < 13.9 ? '1 candle = 1 minute' : '1 candle = 5 minutes');
    this.tf.transform = 'scale(' + (1 + 0.08 * Math.sin(Math.PI * seg(t, 13.6, 14.2))).toFixed(4) + ')';
    // A ring around the newest candle while it forms.
    const x = 400 + 20 + (710 - 120) / 20 * 19.5, mid = 198 + 64 + (400 - 84) / 2;
    const y = mid - ((p - 60000) / 60000) / 0.005 * ((400 - 84) / 2);
    this.ring.left = x.toFixed(1) + 'px'; this.ring.top = y.toFixed(1) + 'px';
    this.ring.opacity = (eo(seg(t, 7.2, 7.7)) * (1 - eo(seg(t, 12.8, 13.3))) * (0.6 + 0.4 * Math.sin(t * 5))).toFixed(3);
    this.tutor.render(t);
  },
});
