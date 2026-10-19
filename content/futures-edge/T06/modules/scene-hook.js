const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const HK_ROWS = [['Entry', '60,000 USDT', 8.0], ['Exit', '61,200 USDT', 9.2], ['Size', '0.05 BTC', 10.4], ['Fees', '0.05% each side', 11.6]];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    HK_ROWS.forEach((r) => {
      rows += '<div style="display:flex;align-items:baseline;justify-content:space-between;padding:16px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:30px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + r[0] + '</span>' +
        '<span class="mono hk-v" style="font-size:36px">?</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:780px"><p class="kick hk-k">Start and end</p>' +
      '<h2 class="line hk-t">Did this trade make money?</h2>' +
      '<p class="sub hk-s">To know, you need four things.</p></div>' +
      '<div class="glass hk-c" style="left:1040px;top:190px;width:560px;padding:28px 36px">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline"><p class="kick" style="margin:0">Trade ticket</p><p class="fict" style="margin:0">Fictional</p></div>' + rows +
      '<div style="display:flex;align-items:baseline;justify-content:space-between;padding:18px 0 0"><span style="font-size:30px;font-weight:700">Result</span><span class="mono hk-r" style="font-size:44px;color:var(--accent)">?</span></div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.s = q('.hk-s'); this.c = q('.hk-c').style; this.r = q('.hk-r').style;
    this.vs = [...kit.stage.querySelectorAll('.hk-v')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'think' }, { t: 7.3, pose: 'writing' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 7.3, { stagger: 0.07 });
    const cp = seg(t, 1.0, 1.8);
    this.c.opacity = eo(cp); this.c.transform = 'translateY(' + lerp(30, 0, eo(cp)).toFixed(1) + 'px) rotate(' + lerp(2, 0, eo(cp)).toFixed(2) + 'deg)';
    this.vs.forEach((v, i) => {
      const a = HK_ROWS[i][2], on = t >= a, txt = on ? HK_ROWS[i][1] : '?';
      if (v.textContent !== txt) v.textContent = txt;
      v.style.color = on ? 'var(--main)' : 'color-mix(in srgb, var(--second) 40%, var(--ground))';
      v.style.transform = 'scale(' + (1 + 0.12 * Math.sin(Math.PI * seg(t, a, a + 0.4))).toFixed(4) + ')'; v.style.display = 'inline-block'; v.style.transformOrigin = '100% 50%';
    });
    this.r.transform = 'scale(' + (1 + 0.08 * Math.sin(t * 3.4)).toFixed(4) + ')'; this.r.display = 'inline-block';
    this.tutor.render(t);
  },
});
