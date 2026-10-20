const { seg, eo, ei, eob, eio, lerp } = kit;
const ST_ROWS = [['Capital per trade', '3 USDT'], ['Leverage', '10x', '1–25x'], ['Concurrent trades', '2', '1–10'], ['Coin selection', 'Manual · Xora AI'], ['Auto trade approval', 'Off'],
  ['Entry mode', 'Basic · Secure · Advanced'], ['Confidence threshold', '50%'], ['Exit', 'Fixed take profit'], ['Demo / Live', 'DEMO'], ['Daily stop loss', '5 USDT']];
const ST_EQ = [
  [8.2, '3 USDT × 10x = <span class="hl">30 USDT</span>', 'Margin × leverage = the position you control'],
  [11.6, '1% against you = <span class="dn">−0.30 USDT</span>', '30 × 1% = 0.30 · that is 10% of your 3 USDT margin'],
  [15.8, '2 trades × 30 = <span class="hl">60 USDT</span>', 'The most that can be open at once with 2 concurrent trades'],
];
kit.scene('settings', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Settings › Trade Settings', 'Your rules, in numbers');
    let eq = '';
    ST_EQ.forEach((e) => { eq += '<div class="st-e" style="display:flex;flex-direction:column;gap:4px;padding:14px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span class="mono" style="font-size:44px">' + e[1] + '</span><span style="font-size:28px;color:color-mix(in srgb, var(--second) 66%, var(--ground))">' + e[2] + '</span></div>'; });
    kit.stage.append(kit.h('<div class="glass st-p" style="left:140px;top:300px;width:900px;padding:18px 36px"><p class="fict" style="margin:0">Worked example · fictional · before fees</p>' + eq + '</div>'));
    let rows = '';
    ST_ROWS.forEach((r) => {
      rows += '<div class="st-r" style="display:flex;flex-direction:column;gap:2px;padding:9px 12px;border-radius:14px;border-bottom:1.5px solid color-mix(in srgb, var(--second) 8%, transparent)"><span style="font-size:22px;color:color-mix(in srgb, var(--second) 62%, var(--ground))">' + r[0] + (r[2] ? ' · ' + r[2] : '') + '</span><span class="mono" style="font-size:25px;color:var(--main)">' + r[1] + '</span></div>';
    });
    const body = '<p style="margin:0 0 6px;font-family:var(--display);font-weight:700;font-size:32px">‹ Trade Settings</p><div class="st-in" style="display:flex;flex-direction:column">' + rows + '</div>';
    this.ph = UI.phone(kit, { x: 1110, y: 150, w: 460, h: 640, tab: 4, body });
    this.ph.q('.ph-body').style.overflow = 'hidden';
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.inEl = this.ph.q('.st-in'); this.in = this.inEl.style; this.rows = this.ph.all('.st-r').map((e) => e.style);
    this.eqs = all('.st-e').map((e) => e.style); this.panel = kit.stage.querySelector('.st-p').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'checklist' }, { t: 8.2, pose: 'explain' }, { t: 11.6, pose: 'think' }, { t: 15.8, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ph.render(t, 0.2);
    const sc = 250 * eio(seg(t, 5.0, 7.4));
    this.in.transform = 'translateY(' + (-sc).toFixed(1) + 'px)';
    const hl = [[1.0, 7.8], [2.0, 7.8], [3.0, 7.8], [4.0, 7.8], [4.8, 7.8], [5.6, 7.8], [6.2, 7.8], [6.8, 7.8], [7.2, 7.8], [7.4, 7.8]];
    this.rows.forEach((s, i) => {
      let v = eo(seg(t, hl[i][0], hl[i][0] + 0.3)) * (1 - ei(seg(t, hl[i][0] + 0.8, hl[i][0] + 1.2)));
      if (i === 0 || i === 1) v = Math.max(v, eo(seg(t, 8.4, 8.8)) * (1 - ei(seg(t, 15.4, 15.8))));
      if (i === 2) v = Math.max(v, eo(seg(t, 16.0, 16.4)));
      s.background = 'color-mix(in srgb, var(--main) ' + Math.round(18 * v) + '%, transparent)';
    });
    // Concurrent trades and the first rows stay reachable: scroll back for the examples.
    const sc2 = t > 8.0 ? 250 * (1 - eio(seg(t, 8.0, 8.8))) : sc;
    this.in.transform = 'translateY(' + (-sc2).toFixed(1) + 'px)';
    UI.fit(this.inEl, sc2 + 46, 410);
    UI.rise(kit, this.panel, t, 7.8, 0.6, 24);
    this.eqs.forEach((s, i) => UI.rise(kit, s, t, ST_EQ[i][0], 0.6, 18));
    this.tutor.render(t);
  },
});
