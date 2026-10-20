const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const HK = [['Choose a coin', 'liquid market, demo account'], ['Check context', '5m picture, 1m detail'], ['Range & levels', 'high, low and zones'], ['Write down doubts', 'what could go wrong'],
  ['Costs & risk', 'fees, stop and size'], ['Decide', 'BUY, SELL or NO_TRADE'], ['Monitor & exit', 'follow the plan'], ['Journal', 'review the process']];
const HK_L = ['T14', 'T15', 'T16', 'T17', 'T18', 'T19', 'T20', 'T21', 'T22'];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'The capstone', 'Eight steps, every time');
    let cards = '', chips = '';
    HK.forEach((s, i) => {
      cards += '<div class="glass hk-c" style="left:' + (140 + (i % 4) * 410) + 'px;top:' + (330 + Math.floor(i / 4) * 200) + 'px;width:380px;height:176px;padding:22px 26px;display:flex;flex-direction:column;gap:8px">' +
        '<span class="mono" style="font-size:44px;line-height:1;color:var(--main)">' + (i + 1) + '</span>' +
        '<span style="font-size:32px;font-weight:700">' + s[0] + '</span><span style="font-size:24px;color:color-mix(in srgb, var(--second) 62%, var(--ground))">' + s[1] + '</span></div>';
    });
    HK_L.forEach((s, i) => { chips += '<span class="chip mono hk-l" style="position:absolute;left:' + (140 + i * 180) + 'px;top:430px;font-size:30px;padding:14px 26px">' + s + '</span>'; });
    kit.stage.append(kit.h('<div>' + chips + '<p class="kick hk-lk" style="position:absolute;left:140px;top:360px;margin:0">Everything from Phase 4 and Phase 5, used together</p>' + cards +
      '<div class="glass hk-b" style="left:1180px;top:118px;width:600px;padding:18px 28px;display:flex;flex-direction:column;gap:10px">' +
      '<div style="display:flex;align-items:center;gap:16px"><span class="chip mono" style="font-size:24px;padding:6px 18px;background:var(--main);color:var(--ground);border-color:var(--main)">DEMO</span><span style="font-size:26px;font-weight:600">Educational simulation</span></div>' +
      '<p class="hk-s" style="margin:0;font-size:26px;font-weight:600">Scored on: <span class="hl">process ✓</span> · not profit</p></div></div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.cards = all('.hk-c').map((e) => e.style); this.chips = all('.hk-l').map((e) => e.style);
    this.lk = kit.stage.querySelector('.hk-lk').style; this.b = kit.stage.querySelector('.hk-b').style; this.s = kit.stage.querySelector('.hk-s').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 6.1, pose: 'checklist' }, { t: 12.6, pose: 'laptop' }, { t: 18.5, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.head(t);
    const out = ei(seg(t, 5.6, 6.2));
    this.lk.opacity = eo(seg(t, 0.8, 1.3)) * (1 - out);
    this.chips.forEach((s, i) => {
      const a = 1.0 + i * 0.3, p = seg(t, a, a + 0.5);
      s.opacity = eo(p) * (1 - out);
      s.transform = 'translateY(' + (lerp(24, 0, eo(p)) - 60 * out).toFixed(1) + 'px) scale(' + lerp(0.85, 1, eob(p, 1.7)).toFixed(3) + ')';
    });
    let cur = -1;
    this.cards.forEach((s, i) => { if (t >= 6.4 + i * 0.7) cur = i; });
    this.cards.forEach((s, i) => {
      const a = 6.4 + i * 0.7, p = seg(t, a, a + 0.6);
      s.opacity = eo(seg(t, a, a + 0.3));
      s.transform = 'translateY(' + lerp(30, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.92, 1, eob(p, 1.6)).toFixed(4) + ')';
      const hot = i === cur && t < 12.6, all = t > 18.5;
      s.borderColor = hot || all ? 'var(--main)' : 'color-mix(in srgb, var(--main) 22%, transparent)';
      s.background = hot ? 'color-mix(in srgb, var(--ground) 76%, var(--main))' : '';
    });
    const b = seg(t, 12.6, 13.2);
    this.b.opacity = eo(b); this.b.transform = 'translateY(' + lerp(-20, 0, eo(b)).toFixed(1) + 'px)';
    const s2 = seg(t, 18.5, 19.0);
    this.s.opacity = eo(s2); this.s.transform = 'translateX(' + lerp(20, 0, eo(s2)).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
