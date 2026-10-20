const { seg, eo, ei, eob, eio, lerp } = kit;
const VO_I = [19, 20, 21, 22, 23];
kit.scene('volatility', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ch = UI.chart(kit, 'vo', {});
    const D = UI.D;
    let ov = '';
    VO_I.forEach((i, j) => {
      const c = D.C[i], x = D.x(i) + 0, y1 = D.y(c[1]), y2 = D.y(c[2]);
      ov += '<g class="vo-b"><line x1="' + (x - 18) + '" x2="' + (x + 18) + '" y1="' + y1.toFixed(1) + '" y2="' + y1.toFixed(1) + '" stroke-width="3" style="stroke:#ffb547"/><line x1="' + (x - 18) + '" x2="' + (x + 18) + '" y1="' + y2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke-width="3" style="stroke:#ffb547"/>' +
        '<text x="' + x + '" y="' + (y2 + 34 + (j % 2) * 28).toFixed(1) + '" text-anchor="middle" class="mono" style="fill:#ffb547;font-size:23px">' + (c[1] - c[2]) + '</text></g>';
    });
    this.ch.ov.innerHTML = ov;
    kit.stage.append(kit.h('<div><div class="glass vo-p" style="left:1230px;top:290px;width:460px;padding:22px 30px"><p class="kick" style="margin:0 0 10px">Simple ATR</p>' +
      '<p class="mono vo-e" style="margin:0;font-size:27px;line-height:1.5;white-space:nowrap">(60+50+40+50+100) ÷ 5</p><p class="mono vo-r" style="margin:6px 0 0;font-size:44px;color:#ffb547">= 60 USDT</p>' +
      '<p class="vo-n" style="margin:14px 0 0;font-size:28px;line-height:1.4;font-weight:600">A typical 1-minute candle here spans about 60 USDT.</p>' +
      '<p class="vo-s" style="margin:14px 0 0;padding-top:12px;border-top:1.5px solid color-mix(in srgb, var(--down) 50%, transparent);font-size:28px;line-height:1.4;font-weight:600;color:color-mix(in srgb, var(--down) 70%, var(--second))">A stop inside normal noise gets hit for no real reason.</p></div></div>'));
    this.head = UI.head(kit, 'Step 2 · volatility', 'How much does it move?');
    const q = (s) => kit.stage.querySelector(s);
    this.bs = [...kit.stage.querySelectorAll('.vo-b')].map((e) => e.style); this.p = q('.vo-p').style; this.e = q('.vo-e').style; this.r = q('.vo-r').style; this.n = q('.vo-n').style; this.s = q('.vo-s').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'think' }, { t: 7.6, pose: 'read' }, { t: 14.8, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    const dim = (i) => (i >= 19 ? 1 : lerp(1, 0.35, eo(seg(t, 7.6, 8.2))));
    this.ch.render(t, dim);
    this.bs.forEach((s, i) => { const a = 8.2 + i * 0.6; s.opacity = eo(seg(t, a, a + 0.3)); });
    UI.rise(kit, this.p, t, 7.6, 0.6, 20);
    this.e.opacity = eo(seg(t, 11.4, 11.9)); this.r.opacity = eo(seg(t, 12.4, 12.9)); this.n.opacity = eo(seg(t, 13.0, 13.5));
    UI.rise(kit, this.s, t, 14.8, 0.6, 16);
    this.tutor.render(t);
  },
});
