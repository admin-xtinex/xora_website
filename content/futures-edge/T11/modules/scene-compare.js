const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// [row, spot, futures, spot at, futures at]
const CP = [
  ['What you hold', 'The coin itself', 'A contract', 4.2, 11.0],
  ['What you pay', 'The full price', 'Margin (lesson T12)', 5.0, 12.4],
  ['Go short?', 'No (plain spot)', 'Yes', 5.8, 13.6],
  ['Expiry', 'None', 'None (perpetual)', 6.8, 14.4],
  ['Funding', 'No', 'Yes, at set times', 7.8, 16.4],
  ['Liquidation', 'No', 'Yes, possible', 8.8, 17.0],
];
kit.scene('compare', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    CP.forEach((r) => {
      rows += '<div class="cp-r" style="display:grid;grid-template-columns:420px 1fr 1fr;align-items:center;height:58px;border-top:1.5px solid color-mix(in srgb, var(--second) 10%, transparent);font-size:28px">' +
        '<span style="color:color-mix(in srgb, var(--second) 70%, var(--ground));font-weight:600">' + r[0] + '</span><span class="cp-s" style="font-weight:600">' + r[1] + '</span><span class="cp-f" style="font-weight:600">' + r[2] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick cp-k">Side by side</p>' +
      '<h2 class="line cp-t">The whole picture</h2></div>' +
      '<div class="glass cp-tb" style="left:140px;top:320px;width:1480px;padding:16px 40px">' +
      '<div style="display:grid;grid-template-columns:420px 1fr 1fr;align-items:center;height:56px;font-size:30px;font-weight:700"><span></span><span class="hl">Spot</span><span class="hv">Perpetual futures</span></div>' +
      rows + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.cp-k').style; this.t = q('.cp-t'); this.tb = q('.cp-tb').style;
    this.rows = all('.cp-r').map((e) => e.style); this.s = all('.cp-s').map((e) => e.style); this.f = all('.cp-f').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'cheer' }, { t: 0.6, pose: 'present' }, { t: 3.9, pose: 'checklist' }, { t: 10.8, pose: 'explain' }, { t: 16.3, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.show(this.tb, t, 0.8);
    CP.forEach((r, i) => {
      this.rows[i].opacity = eo(seg(t, 1.2 + i * 0.25, 1.6 + i * 0.25)).toFixed(3);
      [[this.s[i], r[3]], [this.f[i], r[4]]].forEach(([st, a]) => { const p = seg(t, a, a + 0.45); st.opacity = eo(p).toFixed(3); st.transform = 'translateX(' + lerp(18, 0, eo(p)).toFixed(1) + 'px)'; st.display = 'inline-block'; });
      const hot = i >= 4 ? Math.sin(Math.PI * seg(t, r[4], r[4] + 1.2)) : 0;
      this.f[i].color = i >= 4 && t > r[4] ? 'var(--accent)' : '';
      this.rows[i].background = 'color-mix(in srgb, var(--accent) ' + (hot * 14).toFixed(1) + '%, transparent)';
    });
    this.tutor.render(t);
  },
});
