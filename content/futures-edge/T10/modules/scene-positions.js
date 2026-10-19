const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('positions', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    this.spot = UI.spot(kit);
    this.card = UI.tip(kit, 140, 206, 880, '6 · Positions', 'Your open trades', '<b>PnL</b> means profit and loss. <b>Unrealized PnL</b> is your result so far, while a position is still open.',
      '<p class="mono" style="margin:0;font-size:28px">PnL = (price now − entry) × size</p>');
    const row = (cls, a, b, c) => '<div class="' + cls + '" style="display:flex;flex-direction:column;gap:4px"><div style="display:flex;justify-content:space-between;font-size:30px;font-weight:600"><span>' + a + '</span><span class="mono" style="color:' + c + '">' + b + '</span></div></div>';
    kit.stage.append(kit.h('<div class="glass ps-ex" style="left:1050px;top:206px;width:770px;padding:26px 32px;display:flex;flex-direction:column;gap:14px">' +
      '<p class="fict" style="margin:0">Worked example · fictional prices</p>' +
      '<p style="margin:0;font-size:30px;font-weight:600">Long 0.010 BTC, entry 60,000</p>' +
      row('ps-r1', 'Price 60,600', '+6.00 USDT', 'var(--main)') + '<p class="mono ps-f1" style="margin:-6px 0 0;font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">(60,600 − 60,000) × 0.010 = +6.00</p>' +
      row('ps-r2', 'Price 59,400', '−6.00 USDT', 'var(--accent)') + '<p class="mono ps-f2" style="margin:-6px 0 0;font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">(59,400 − 60,000) × 0.010 = −6.00</p>' +
      '<p class="ps-r3" style="margin:4px 0 0;font-size:28px;font-weight:600;color:var(--main)">Realized only when you close the position.</p></div>'));
    kit.stage.append(kit.h('<div class="chip ps-fill" style="position:absolute;left:1130px;top:612px;font-size:24px;padding:6px 18px;background:var(--main);color:var(--ground);border-color:var(--main)">Order filled → position opened</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.cs = this.card.style; this.exs = q('.ps-ex').style; this.fill = q('.ps-fill').style;
    this.rs = ['.ps-r1', '.ps-f1', '.ps-r2', '.ps-f2', '.ps-r3'].map((s) => q(s).style);
    this.mark = UI.path([[0, 60000], [14.0, 60000], [15.4, 60600], [16.4, 60600], [18.0, 59400], [30, 59400]]);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'present' }, { t: 6.8, pose: 'explain' }, { t: 13.6, pose: 'magnify' }, { t: 19.6, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    const m = this.mark(t) + (t < 13.8 ? UI.wig(t, 16) : UI.wig(t, 3));
    const op = eo(seg(t, 1.8, 2.4));
    this.term.render(t, { sym: 'BTC', price: m, pos: t > 1.8 ? { size: 0.01, entry: 60000, mark: m, op } : null, bal: 1000 });
    const pc = this.term.E.pc[4].style, gl = eo(seg(t, 7.2, 7.7));
    pc.textShadow = gl > 0 ? '0 0 ' + (14 * gl).toFixed(1) + 'px currentColor' : 'none';
    this.term.E.prow.background = 'color-mix(in srgb, var(--main) ' + (16 * Math.sin(Math.PI * seg(t, 1.8, 3.0))).toFixed(1) + '%, transparent)';
    this.spot.set(UI.R.pos, eo(seg(t, 0, 0.8)), eo(seg(t, 0.2, 1.0)));
    UI.show(this.cs, t, 0.8);
    UI.show(this.exs, t, 13.6);
    [[14.6, 0], [15.4, 1], [17.6, 2], [18.4, 3], [19.8, 4]].forEach(([a, i]) => { this.rs[i].opacity = eo(seg(t, a, a + 0.5)).toFixed(3); });
    const f = seg(t, 1.6, 2.1);
    this.fill.opacity = (eo(f) * (1 - eo(seg(t, 5.8, 6.4)))).toFixed(3);
    this.fill.transform = 'translate(-50%,0) translateY(' + lerp(16, 0, eo(f)).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
