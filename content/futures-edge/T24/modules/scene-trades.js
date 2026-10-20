const { seg, eo, ei, eob, lerp } = kit;
const TR_ROWS = [['SOL', 'LONG', 0.22, 'Trailing stop'], ['BTC', 'SHORT', -0.21, 'Stop'], ['ETH', 'LONG', 0.09, 'Take profit'], ['BNB', 'LONG', -0.18, 'Stop']];
const TR_SET = [['Binance Connect', 'API key for Live'], ['Trade Settings', 'Your trade rules'], ['Notifications', 'Alerts on your phone'], ['About', 'App version and info']];
kit.scene('trades', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Tabs 4 and 5', 'Trades and Settings');
    this.c1 = UI.card(kit, 140, 300, 860, 'Trades', 'My Trades: Overview · Trades · Insights. Wins and losses are all listed.', { fs: 30, pad: '20px 30px' });
    this.c2 = UI.card(kit, 140, 480, 860, 'Settings', 'Binance Connect · Trade Settings · Notifications · About', { fs: 30, pad: '20px 30px' });
    let rows = '';
    TR_ROWS.forEach((r) => {
      rows += '<div class="tr-r" style="display:flex;align-items:center;gap:10px;padding:8px 4px;border-bottom:1.5px solid color-mix(in srgb, var(--second) 9%, transparent)">' +
        '<div style="flex:1;display:flex;flex-direction:column"><span style="font-size:24px;font-weight:700">' + r[0] + ' <span class="mono ' + (r[1] === 'LONG' ? 'up' : 'dn') + '" style="font-size:22px">' + r[1] + '</span></span><span style="font-size:22px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">' + r[3] + '</span></div>' +
        '<span class="mono ' + (r[2] >= 0 ? 'up' : 'dn') + '" style="font-size:26px">' + UI.sgn(r[2], 2) + '</span></div>';
    });
    let set = '';
    TR_SET.forEach((r) => {
      set += '<div class="tr-s pc" style="display:flex;align-items:center;gap:12px"><div style="flex:1;display:flex;flex-direction:column"><span style="font-size:25px;font-weight:700">' + r[0] + '</span><span style="font-size:22px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">' + r[1] + '</span></div><span style="font-size:30px;color:var(--main)">›</span></div>';
    });
    const body = '<div class="tr-a" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:10px"><p style="margin:0;font-family:var(--display);font-weight:700;font-size:36px">My Trades</p>' +
      '<div style="display:flex;gap:6px;padding:4px;border-radius:14px;background:color-mix(in srgb, var(--second) 7%, transparent)"><span class="btn" style="flex:1;height:40px;font-size:22px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">Overview</span><span class="btn" style="flex:1;height:40px;font-size:22px;background:color-mix(in srgb, var(--main) 30%, var(--ground))">Trades</span><span class="btn" style="flex:1;height:40px;font-size:22px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">Insights</span></div>' +
      rows + '</div>' +
      '<div class="tr-b" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:12px"><p style="margin:0;font-family:var(--display);font-weight:700;font-size:36px">Settings</p>' + set + '</div>';
    this.ph = UI.phone(kit, { x: 1110, y: 150, w: 460, h: 640, tab: 3, body });
    const all = (s) => this.ph.all(s);
    this.a = this.ph.q('.tr-a').style; this.b = this.ph.q('.tr-b').style;
    this.rows = all('.tr-r').map((e) => e.style); this.sets = all('.tr-s').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'read' }, { t: 7.6, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ph.render(t, 0.2);
    const sw = eo(seg(t, 7.4, 7.9));
    this.ph.lit(sw > 0.5 ? 4 : 3, 1);
    this.a.opacity = (1 - sw).toFixed(3); this.a.transform = 'translateX(' + (-40 * sw).toFixed(1) + 'px)';
    this.b.opacity = sw.toFixed(3); this.b.transform = 'translateX(' + (40 * (1 - sw)).toFixed(1) + 'px)';
    this.rows.forEach((s, i) => { const a = 1.0 + i * 0.35, p = seg(t, a, a + 0.4); s.opacity = eo(p); s.transform = 'translateY(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)'; });
    this.rows.forEach((s, i) => { if (TR_ROWS[i][2] < 0) s.background = 'color-mix(in srgb, var(--down) ' + Math.round(14 * eo(seg(t, 4.6, 5.0)) * (1 - sw)) + '%, transparent)'; });
    this.sets.forEach((s, i) => { const a = 8.0 + i * 0.35, p = seg(t, a, a + 0.4); s.transform = 'translateY(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)'; s.opacity = eo(p); });
    const p1 = seg(t, 0.6, 1.2), p2 = seg(t, 7.6, 8.2);
    this.c1.opacity = (eo(p1) * (t > 7.6 ? 0.55 : 1)).toFixed(3); this.c1.transform = 'translateX(' + lerp(30, 0, eo(p1)).toFixed(1) + 'px)';
    this.c2.opacity = eo(p2).toFixed(3); this.c2.transform = 'translateX(' + lerp(30, 0, eo(p2)).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
