const { seg, eo, ei, eob, lerp } = kit;
const TB_ROWS = [
  ['Home', 'Your overview: account, market, your coins'],
  ['Signals', 'Study one coin: chart, setups, checklist'],
  ['XORA', 'Control room for an open trade'],
  ['Trades', 'Your trade history and insights'],
  ['Settings', 'Binance Connect and your trade rules'],
];
const TB_AT = [7.4, 9.4, 11.4, 13.6, 15.3];
const TB_TITLE = ['Home', 'Signals', 'XORA', 'My Trades', 'Settings'];
kit.scene('tabs', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    TB_ROWS.forEach((r, i) => {
      rows += '<div class="tb-r" style="display:flex;align-items:center;gap:24px;padding:14px 22px;border-radius:20px">' +
        '<span class="tb-i" style="width:64px;height:64px;flex:none;border-radius:18px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--main) 14%, var(--ground));color:var(--main)">' +
        (r[0] === 'XORA' ? '<b style="font-family:var(--display);font-size:32px">X</b>' : UI.icon(r[0]).replace('width="30" height="30"', 'width="36" height="36"')) + '</span>' +
        '<div style="display:flex;flex-direction:column;gap:2px"><span style="font-size:34px;font-weight:700">' + r[0] + '</span><span style="font-size:27px;color:color-mix(in srgb, var(--second) 66%, var(--ground))">' + r[1] + '</span></div></div>';
    });
    kit.stage.append(kit.h('<div class="ground"><div style="position:absolute;left:120px;top:262px;width:860px;display:flex;flex-direction:column;gap:2px">' + rows + '</div></div>'));
    this.head = UI.head(kit, 'Find your way around', 'Five tabs');
    let sk = '';
    for (let i = 0; i < 5; i++) sk += '<div class="pc tb-sk" style="height:' + [120, 70, 70, 96, 70][i] + 'px;display:flex;flex-direction:column;justify-content:center;gap:10px"><div style="height:12px;width:' + [70, 55, 80, 60, 45][i] + '%;border-radius:6px;background:color-mix(in srgb, var(--second) 18%, transparent)"></div><div style="height:12px;width:' + [40, 75, 35, 50, 65][i] + '%;border-radius:6px;background:color-mix(in srgb, var(--main) 22%, transparent)"></div></div>';
    const body = '<div style="display:flex;flex-direction:column;gap:12px"><p class="tb-h" style="margin:0 0 4px;font-family:var(--display);font-weight:700;font-size:40px">Home</p>' + sk + '</div>';
    this.ph = UI.phone(kit, { x: 1110, y: 150, w: 460, h: 640, body });
    this.ph.lit(-1, 0);
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.rows = all('.tb-r').map((e) => e.style); this.tabs = this.ph.all('.ph-tab').map((e) => e.style);
    this.th = this.ph.q('.tb-h'); this.sk = this.ph.all('.tb-sk').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'pointer' }, { t: 7.1, pose: 'explain' }, { t: 13.4, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ph.render(t, 0.2);
    // Tabs pop in one by one, then light in turn.
    this.tabs.forEach((s, i) => {
      const a = 1.4 + i * 0.45, p = seg(t, a, a + 0.4);
      s.opacity = eo(p).toFixed(3);
      s.transform = 'translateY(' + lerp(16, 0, eob(p, 1.6)).toFixed(1) + 'px)';
    });
    let cur = -1;
    TB_AT.forEach((a, i) => { if (t >= a) cur = i; });
    const pop = cur < 0 ? 0 : eo(seg(t, TB_AT[cur], TB_AT[cur] + 0.4));
    this.ph.lit(cur, pop);
    if (cur >= 0) {
      this.tabs[cur].transform = 'scale(' + lerp(1, 1.12, Math.sin(Math.PI * seg(t, TB_AT[cur], TB_AT[cur] + 0.5))).toFixed(3) + ')';
      UI.set(this.th, TB_TITLE[cur]);
    }
    this.th.style.opacity = cur < 0 ? 0 : (0.3 + 0.7 * pop).toFixed(3);
    this.sk.forEach((s, i) => {
      const a = cur < 0 ? 2.0 + i * 0.2 : TB_AT[cur] + i * 0.06, p = seg(t, a, a + 0.35);
      s.opacity = (cur < 0 ? 0.5 * eo(p) : 0.4 + 0.6 * eo(p)).toFixed(3);
      s.transform = 'translateX(' + lerp(14, 0, eo(p)).toFixed(1) + 'px)';
    });
    this.rows.forEach((s, i) => {
      const p = seg(t, TB_AT[i] - 0.1, TB_AT[i] + 0.4), on = cur === i ? 1 : 0;
      s.opacity = (eo(p) * (on ? 1 : 0.6)).toFixed(3);
      s.transform = 'translateX(' + lerp(30, 0, eo(p)).toFixed(1) + 'px)';
      s.background = on ? 'color-mix(in srgb, var(--main) 12%, transparent)' : 'transparent';
    });
    this.tutor.render(t);
  },
});
