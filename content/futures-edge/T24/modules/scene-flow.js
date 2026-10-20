const { seg, eo, ei, eob, eio, lerp, clamp01 } = kit;
const FL_S = [
  ['Pick coins', 'Your own list, or Xora AI coin selection', 4.4],
  ['Read a coin', 'On the Signals tab', 7.8],
  ['A setup triggers', 'Price reaches the plan', 10.6],
  ['Approve or place your own', 'Or skip it: no trade', 13.4],
  ['Manage', 'On the XORA tab', 17.6],
  ['Review', 'In Trades', 20.8],
];
const FL_POS = FL_S.map((s, i) => [140 + (i % 3) * 520, i < 3 ? 300 : 560]);
const FL_C = FL_POS.map((p) => [p[0] + 235, p[1] + 95]);
kit.scene('flow', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let segs = '';
    for (let i = 1; i < FL_C.length; i++) segs += '<line class="fl-l" x1="' + FL_C[i - 1][0] + '" y1="' + FL_C[i - 1][1] + '" x2="' + FL_C[i][0] + '" y2="' + FL_C[i][1] + '" pathLength="1" stroke-width="5" stroke-linecap="round" style="stroke:var(--main)"/>';
    kit.stage.append(kit.h('<svg class="art" viewBox="0 0 1920 1080">' + segs + '</svg>'));
    FL_S.forEach((s, i) => {
      kit.stage.append(kit.h('<div class="glass fl-c" style="left:' + FL_POS[i][0] + 'px;top:' + FL_POS[i][1] + 'px;width:470px;height:190px;padding:20px 26px;display:flex;gap:18px;align-items:flex-start">' +
        '<span class="mono fl-n" style="flex:none;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;border:2px solid var(--main);color:var(--main)">' + (i + 1) + '</span>' +
        '<div style="display:flex;flex-direction:column;gap:6px"><span style="font-size:32px;font-weight:700;line-height:1.2">' + s[0] + '</span><span style="font-size:28px;line-height:1.3;color:color-mix(in srgb, var(--second) 66%, var(--ground))">' + s[1] + '</span></div></div>'));
    });
    this.head = UI.head(kit, 'The supported workflow', 'Six steps, one loop');
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.cards = all('.fl-c').map((e) => e.style); this.ns = all('.fl-n').map((e) => e.style);
    this.ls = all('.fl-l');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 4.2, pose: 'pointer' }, { t: 13.4, pose: 'think' }, { t: 17.4, pose: 'explain' }, { t: 21.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ls.forEach((l, i) => l.setAttribute('stroke-dasharray', eio(seg(t, FL_S[i + 1][2] - 0.7, FL_S[i + 1][2])) + ' 1'));
    let cur = -1;
    FL_S.forEach((s, i) => { if (t >= s[2]) cur = i; });
    this.cards.forEach((s, i) => {
      const a = 1.0 + i * 0.25, p = seg(t, a, a + 0.5), on = i === cur ? eo(seg(t, FL_S[i][2], FL_S[i][2] + 0.4)) : 0, done = i < cur;
      s.opacity = (eo(p) * (on > 0 ? 1 : done ? 0.85 : 0.5)).toFixed(3);
      s.transform = 'translateY(' + lerp(26, 0, eo(p)).toFixed(1) + 'px) scale(' + (1 + 0.03 * on).toFixed(4) + ')';
      UI.glow(s, on);
      this.ns[i].background = (done || on > 0.5) ? 'var(--main)' : 'transparent';
      this.ns[i].color = (done || on > 0.5) ? 'var(--ground)' : 'var(--main)';
    });
    this.tutor.render(t);
  },
});
