const { seg, eo, ei, eob, lerp } = kit;
const CN_L = [['1-minute candles', 'Newest: O 60,070 · H 60,120 · L 60,020 · C 60,110', 2.0], ['Bigger timeframes', '5m · 15m · 1h candles', 8.2], ['Order book', 'Bids and asks waiting to trade', 10.4]];
kit.scene('candles', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ch = UI.chart(kit, 'cn', { draw: 1.0, k: 0.18 });
    let rows = '';
    CN_L.forEach((r) => { rows += '<div class="cn-r" style="display:flex;gap:16px;align-items:flex-start;padding:14px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span class="dot" style="margin-top:12px"></span><div style="display:flex;flex-direction:column;gap:4px"><span style="font-size:30px;font-weight:700">' + r[0] + '</span><span style="font-size:26px;color:color-mix(in srgb, var(--second) 64%, var(--ground))">' + r[1] + '</span></div></div>'; });
    kit.stage.append(kit.h('<div class="glass cn-p" style="left:1230px;top:290px;width:460px;padding:20px 30px"><p class="kick" style="margin:0 0 4px">What XORA reads</p>' + rows + '</div>'));
    const D = UI.D, x = D.x(23);
    this.ch.ov.innerHTML = '<rect class="cn-an" x="' + (x - 24) + '" y="' + (D.y(60120) - 14).toFixed(1) + '" width="48" height="' + (D.y(60020) - D.y(60120) + 28).toFixed(1) + '" rx="8" fill="none" stroke-width="3" style="stroke:var(--second);opacity:0"/>';
    this.head = UI.head(kit, 'Step 1 · data', 'Candles in');
    this.p = kit.stage.querySelector('.cn-p').style; this.rs = [...kit.stage.querySelectorAll('.cn-r')].map((e) => e.style);
    this.an = kit.stage.querySelector('.cn-an').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'candles' }, { t: 7.8, pose: 'read' }, { t: 13.9, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ch.render(t);
    this.an.opacity = eo(seg(t, 2.2, 2.7)) * (1 - ei(seg(t, 7.6, 8.1)));
    UI.rise(kit, this.p, t, 1.6, 0.6, 24);
    this.rs.forEach((s, i) => UI.rise(kit, s, t, CN_L[i][2], 0.5, 14));
    this.tutor.render(t);
  },
});
