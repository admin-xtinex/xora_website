const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const HK_K = [[0, 60000], [0.8, 60000], [3.0, 60035], [4.4, 60025], [6.2, 60080], [17, 60080]];
const hkP = (s) => UI.path(HK_K, s) + (s > 0.8 && s < 6.0 ? Math.sin(s * 6.7) * 6 : 0);
const hkX = (s) => 1000 + Math.min(s, 6.2) / 6.2 * 560, hkY = (p) => 700 - (p - 59980) / 120 * 440;
const HK_TAGS = ['Fees', 'Spread', 'Slippage'];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let tags = '';
    HK_TAGS.forEach((s) => { tags += '<span class="chip hk-tag" style="font-size:30px;padding:14px 28px;border-color:var(--accent);color:var(--accent)">− ' + s + '</span>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="hk-ch">' + UI.grid(1000, 1560, hkY, 59980, 60100, 20) +
      '<path class="hk-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="hk-dot" r="10" style="fill:var(--second)"/>' +
      '<text x="1000" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC chart price in USDT · fictional</text></g></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick hk-k">A tiny trade · 0.01 BTC</p>' +
      '<h2 class="line hk-t">A small win?</h2></div>' +
      '<div class="glass hk-c" style="left:140px;top:350px;width:620px;padding:28px 36px"><p class="fict" style="margin:0 0 8px">On the chart · 60,000 → 60,080</p>' +
      '<p class="mono" style="margin:0;font-size:72px"><span class="hk-v" style="color:var(--main)">+0.80</span> <span style="font-size:40px">USDT</span><span class="hk-qm" style="color:var(--accent)">?</span></p>' +
      '<p class="mono" style="margin:6px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">80 × 0.01 BTC</p></div>' +
      '<div class="hk-tags" style="position:absolute;left:140px;top:640px;display:flex;gap:20px">' + tags + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.c = q('.hk-c').style; this.v = q('.hk-v').style; this.qm = q('.hk-qm').style;
    this.ch = q('.hk-ch').style; this.line = q('.hk-line'); this.dot = q('.hk-dot');
    this.tags = [...kit.stage.querySelectorAll('.hk-tag')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'candles' }, { t: 6.8, pose: 'cheer' }, { t: 11.8, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.ch.opacity = eo(seg(t, 0.3, 0.9));
    const end = Math.min(t, 6.2);
    this.line.setAttribute('d', UI.line(hkP, 0, end, hkX, hkY));
    this.dot.setAttribute('cx', hkX(end).toFixed(1)); this.dot.setAttribute('cy', hkY(hkP(end)).toFixed(1));
    UI.rise(this.c, t, 6.8);
    const hit = seg(t, 12.0, 14.0);
    this.v.opacity = lerp(1, 0.45, eo(hit));
    this.qm.opacity = eo(seg(t, 12.6, 13.0));
    this.c.transform += ' rotate(' + (Math.sin(t * 18) * 1.2 * Math.sin(Math.PI * seg(t, 12.0, 13.2))).toFixed(2) + 'deg)';
    this.tags.forEach((s, i) => {
      const a = 11.9 + i * 0.5, p = seg(t, a, a + 0.6);
      s.opacity = eo(seg(t, a, a + 0.3));
      s.transform = 'translateY(' + (lerp(-60, 0, eob(p, 1.4))).toFixed(1) + 'px)';
    });
    this.tutor.render(t);
  },
});
