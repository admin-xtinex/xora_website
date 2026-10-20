const { seg, eo, ei, eob, eio, lerp } = kit;
const XT_K = [[0, 150.30], [2, 150.36], [9, 151.10], [12.5, 151.40], [17, 151.00], [22, 151.08]];
const XT_P = (t) => UI.path(XT_K, t) + 0.025 * Math.sin(t * 3.1) * Math.min(1, t);
const XT_E = 150.30, XT_N = 30;
const XT_CALL = [
  [0.6, 'Open trade', 'Entry · leverage · margin · risk zone (the stop)'],
  [8.6, 'Live numbers', 'Unrealised P&L and the trailing stop move with price (before fees)'],
  [15.8, 'Your exit', 'CLOSE POSITION closes the trade yourself, at any time'],
];
kit.scene('xoratab', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Tab 3 · centre', 'The XORA tab');
    XT_CALL.forEach((c, i) => { c.st = UI.card(kit, 140, 290 + i * 150, 860, c[1], c[2], { fs: 28, pad: '18px 28px' }); });
    const m = (k, v, c) => '<div><p class="pk">' + k + '</p><p class="pv ' + (c || '') + '" style="font-size:28px">' + v + '</p></div>';
    const body = '<div style="display:flex;flex-direction:column;gap:10px">' +
      '<div class="pc xt-m" style="display:grid;grid-template-columns:1fr 1fr;gap:6px 12px">' + m('Entry', '150.30') + m('Leverage', '10x') + m('Margin', '3.00') + m('Risk zone', '149.40', 'dn xt-rz') + '</div>' +
      '<div class="pc xt-pl"><div style="display:flex;justify-content:space-between"><p class="pk">Unrealised PNL</p><span class="pill up" style="font-size:22px;padding:0 10px">SOL LONG</span></div><div style="display:flex;justify-content:space-between;align-items:baseline"><p class="pv xt-v" style="font-size:36px"></p><p class="mono xt-p" style="margin:0;font-size:22px;color:color-mix(in srgb, var(--second) 62%, var(--ground))"></p></div></div>' +
      '<div class="pc" style="display:flex;flex-direction:column;gap:6px"><div class="xt-lk" style="display:flex;justify-content:space-between;align-items:baseline;border-radius:10px;padding:2px 4px"><p class="pk xt-ll"></p><p class="pv xt-lv" style="font-size:28px"></p></div>' +
      '<div class="xt-tr" style="display:flex;justify-content:space-between;align-items:baseline;border-radius:10px;padding:2px 4px"><p class="pk">Trailing stop</p><p class="pv xt-tv" style="font-size:28px;color:#ffb547"></p></div></div>' +
      '<span class="btn xt-cl" style="height:54px;border:2px solid var(--down);color:var(--down)">CLOSE POSITION</span></div>';
    this.ph = UI.phone(kit, { x: 1110, y: 150, w: 460, h: 640, tab: 2, body });
    const q = (s) => this.ph.q(s);
    this.v = q('.xt-v'); this.p = q('.xt-p'); this.ll = q('.xt-ll'); this.lv = q('.xt-lv'); this.tv = q('.xt-tv'); this.rz = q('.xt-rz');
    this.mst = q('.xt-m').style; this.pl = q('.xt-pl').style; this.tr = q('.xt-tr').style; this.lk = q('.xt-lk').style; this.cl = q('.xt-cl').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'point', flip: true }, { t: 0.6, pose: 'explain' }, { t: 8.6, pose: 'candles' }, { t: 15.8, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ph.render(t, 0.2);
    const st = Math.floor(t * 4) / 4, p = XT_P(st);
    let pmax = XT_E;
    for (let s = 0; s <= st + 1e-6; s += 0.25) pmax = Math.max(pmax, XT_P(s));
    const trail = Math.max(149.40, pmax - 0.90);
    const pnl = XT_N * (p - XT_E) / XT_E;
    UI.set(this.v, UI.sgn(pnl, 2) + ' USDT');
    this.v.style.color = pnl >= 0 ? 'var(--up)' : 'var(--down)';
    UI.set(this.p, '@ ' + p.toFixed(2));
    const lock = XT_N * (trail - XT_E) / XT_E;
    UI.set(this.ll, lock > 0 ? 'Locked profit' : 'Risk at stop');
    UI.set(this.lv, UI.sgn(lock, 2));
    this.lv.style.color = lock > 0 ? 'var(--up)' : 'var(--down)';
    UI.set(this.tv, trail.toFixed(2));
    UI.set(this.rz, trail.toFixed(2));
    UI.glow(this.mst, eo(seg(t, 1.0, 1.4)) * (1 - ei(seg(t, 8.0, 8.4))));
    UI.glow(this.pl, eo(seg(t, 8.8, 9.2)) * (1 - ei(seg(t, 15.4, 15.8))));
    UI.glow(this.tr, eo(seg(t, 11.4, 11.8)) * (1 - ei(seg(t, 15.4, 15.8))), '#ffb547');
    UI.glow(this.lk, eo(seg(t, 12.6, 13.0)) * (1 - ei(seg(t, 15.4, 15.8))), lock > 0 ? 'var(--up)' : 'var(--down)');
    UI.glow(this.cl, eo(seg(t, 16.0, 16.4)) * (0.7 + 0.3 * Math.sin(t * 4)), 'var(--down)');
    XT_CALL.forEach((c, i) => {
      const p2 = seg(t, c[0], c[0] + 0.6), nxt = XT_CALL[i + 1];
      c.st.opacity = (eo(p2) * (nxt && t > nxt[0] ? 0.55 : 1)).toFixed(3);
      c.st.transform = 'translateX(' + lerp(30, 0, eo(p2)).toFixed(1) + 'px)';
    });
    this.tutor.render(t);
  },
});
