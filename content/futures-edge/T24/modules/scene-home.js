const { seg, eo, ei, eob, eio, lerp } = kit;
const HM_P = (t) => 60000 + 140 * Math.sin(t * 0.55) + 45 * Math.sin(t * 2.1 + 1);
const HM_CALL = [
  [0.8, 'Engine check', 'A countdown to the next check, and setups waiting for you'],
  [7.4, 'Demo / Live', 'The pill shows which account you are looking at'],
  [10.6, 'Account row', 'Today · open P&L · trades in use · 30-day win rate'],
  [14.6, 'Your coins', 'In trade · Buy · Sell · Cooldown · Watching'],
];
kit.scene('home', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Tab 1', 'Home');
    HM_CALL.forEach((c, i) => { c.st = UI.card(kit, 140, 290 + i * 128, 860, c[1], c[2], { fs: 28, pad: '16px 28px' }); });
    const tile = (k, v, c) => '<div><p class="pk">' + k + '</p><p class="pv ' + (c || '') + '" style="font-size:28px">' + v + '</p></div>';
    const chip = (n, s, col) => '<span class="pill" style="color:' + col + '"><b style="color:var(--second)">' + n + '</b>' + s + '</span>';
    const body = '<div class="hm-in" style="display:flex;flex-direction:column;gap:12px">' +
      '<div class="hm-top" style="display:flex;align-items:center;gap:12px;border-radius:14px"><span style="width:40px;height:40px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--accent) 40%, var(--ground));font-weight:700;font-size:24px">A</span>' +
      '<span style="flex:1;font-size:23px;font-weight:700;white-space:nowrap">Good morning, Anu</span><span class="pill hm-env" style="color:var(--main)">DEMO</span></div>' +
      '<p class="hm-next pk" style="text-transform:none;letter-spacing:0;font-family:var(--sans);font-size:22px;line-height:1.35;border-radius:12px;padding:2px 4px;color:color-mix(in srgb, var(--second) 70%, var(--ground))"></p>' +
      '<div class="pc hm-hero" style="display:flex;flex-direction:column;gap:6px"><p class="pk">Bitcoin · BTCUSDT</p>' +
      '<div style="display:flex;align-items:baseline;justify-content:space-between"><p class="pv hm-px" style="font-size:40px"></p><span class="mono hm-ch up" style="font-size:24px"></span></div>' +
      '<svg width="360" height="54" viewBox="0 0 360 54"><path class="hm-sp" fill="none" stroke-width="3" style="stroke:var(--up)"/><circle class="hm-dot" r="5" style="fill:var(--second)"/></svg>' +
      '<div style="display:flex;justify-content:space-between" class="mono"><span style="font-size:22px">ETH 3,000</span><span style="font-size:22px">SOL 150</span><span style="font-size:22px">BNB 600</span></div></div>' +
      '<div class="pc hm-acc" style="display:grid;grid-template-columns:1fr 1fr;gap:8px 12px">' + tile('Today', '+0.42', 'up') + tile('Open P&L', '+0.15', 'up') + tile('Trades', '1/2') + tile('Win 30D', '48%') + '</div>' +
      '<div class="pc hm-coins" style="display:flex;flex-direction:column;gap:8px"><p class="pk">Your coins</p><div style="display:flex;flex-wrap:wrap;gap:8px">' +
      chip('BTC', 'IN TRADE', 'var(--main)') + chip('SOL', 'BUY', 'var(--up)') + chip('ETH', 'SELL', 'var(--down)') + chip('BNB', 'COOLDOWN', 'color-mix(in srgb, var(--second) 55%, var(--ground))') + chip('XRP', 'WATCHING', 'color-mix(in srgb, var(--second) 55%, var(--ground))') + '</div></div></div>';
    this.ph = UI.phone(kit, { x: 1110, y: 150, w: 460, h: 640, tab: 0, body });
    this.ph.q('.ph-body').style.overflow = 'hidden';
    const q = (s) => this.ph.q(s);
    this.inEl = q('.hm-in'); this.in = this.inEl.style; this.next = q('.hm-next'); this.px = q('.hm-px'); this.ch = q('.hm-ch'); this.sp = q('.hm-sp'); this.dot = q('.hm-dot');
    this.parts = [q('.hm-next').style, q('.hm-env').style, q('.hm-acc').style, q('.hm-coins').style];
    this.hero = q('.hm-hero').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'pointer' }, { t: 7.4, pose: 'read' }, { t: 14.6, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ph.render(t, 0.2);
    const left = 48 - t;
    UI.set(this.next, 'Next engine check ' + UI.mmss(left) + (t >= 4 ? ' · 1 setup waiting' : ''));
    const step = Math.floor(t * 2) / 2, p = HM_P(step);
    UI.set(this.px, UI.fmt(p, 1));
    UI.set(this.ch, '+' + ((p / 59280 - 1) * 100).toFixed(2) + '%');
    let d = '';
    const end = Math.min(1, seg(t, 1.0, 4.0));
    for (let i = 0; i <= 60 * end; i++) { const s = i / 60; const v = 59280 + 720 * s + 160 * Math.sin(s * 9) * (1 - s * 0.4) + (s > 0.97 ? HM_P(step) - 60000 : 0); d += (i ? 'L' : 'M') + (s * 350 + 4).toFixed(1) + ' ' + (48 - (v - 59100) / 1100 * 44).toFixed(1); }
    this.sp.setAttribute('d', d || 'M4 40');
    const ls = 60 * end / 60, lv = 59280 + 720 * ls + 160 * Math.sin(ls * 9) * (1 - ls * 0.4);
    this.dot.setAttribute('cx', (ls * 350 + 4).toFixed(1)); this.dot.setAttribute('cy', (48 - (lv - 59100) / 1100 * 44).toFixed(1));
    const H = this.inEl.offsetHeight, sc = 132 * eio(seg(t, 10.0, 11.0)) + Math.max(0, H - 456 - 132) * eio(seg(t, 14.2, 15.2));
    this.in.transform = 'translateY(' + (-sc).toFixed(1) + 'px)';
    UI.fit(this.inEl, sc, 456);
    // Highlights in sync with the callouts.
    const wins = [[0.8, 7.2], [7.4, 10.4], [10.6, 14.2], [14.6, 21.6]];
    this.parts.forEach((s, i) => UI.glow(s, eo(seg(t, wins[i][0], wins[i][0] + 0.4)) * (1 - ei(seg(t, wins[i][1] - 0.3, wins[i][1])))));
    UI.glow(this.hero, eo(seg(t, 8.6, 9.0)) * (1 - ei(seg(t, 10.2, 10.6))) * 0.8);
    HM_CALL.forEach((c, i) => {
      const p2 = seg(t, c[0], c[0] + 0.6);
      c.st.opacity = (eo(p2) * (t > wins[i][1] ? 0.55 : 1)).toFixed(3);
      c.st.transform = 'translateX(' + lerp(30, 0, eo(p2)).toFixed(1) + 'px)';
    });
    this.tutor.render(t);
  },
});
