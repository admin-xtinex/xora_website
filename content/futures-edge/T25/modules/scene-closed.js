const { seg, eo, ei, eob, eio, lerp, clamp01 } = kit;
// The forming candle (index 23 here) wobbles until it closes at t = 10.6.
const CL_END = 10.6;
const CL_F = (t) => {
  const k = clamp01(t / CL_END), c0 = 60070;
  const wob = 34 * Math.sin(t * 2.3) + 18 * Math.sin(t * 5.1);
  return c0 + (60110 - c0) * k + wob * (1 - k * k);
};
kit.scene('closed', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ch = UI.chart(kit, 'cl', { n: 23, cap: 24 });
    const D = UI.D, x = D.x(23);
    this.ch.ov.innerHTML = '<rect class="cl-box" x="' + (x - 26) + '" y="300" width="52" height="400" rx="10" fill="none" stroke-width="3" stroke-dasharray="8 8" style="stroke:#ffb547"/>';
    kit.stage.append(kit.h('<div>' +
      '<div class="glass cl-a" style="left:1230px;top:290px;width:460px;padding:20px 28px;border-color:#ffb547"><p class="kick" style="margin:0 0 8px;color:#ffb547">Still forming</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">Not used yet. Its high, low and close can still change.</p><p class="mono cl-v" style="margin:10px 0 0;font-size:30px"></p></div>' +
      '<div class="glass cl-b" style="left:1230px;top:290px;width:460px;padding:20px 28px;border-color:var(--up)"><p class="kick" style="margin:0 0 8px;color:var(--up)">Closed ✓</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">Locked in. Now it counts.</p></div>' +
      '<div class="glass cl-k" style="left:1230px;top:470px;width:460px;padding:20px 28px"><p class="kick" style="margin:0 0 8px">At every close</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">A fresh plan for each coin</p><p class="mono cl-clk" style="margin:10px 0 0;font-size:30px;color:var(--main)"></p></div>' +
      '</div>'));
    this.head = UI.head(kit, 'Step 1 · the golden rule', 'Closed candles only');
    const q = (s) => kit.stage.querySelector(s);
    this.box = q('.cl-box'); this.a = q('.cl-a').style; this.b = q('.cl-b').style; this.c = q('.cl-k').style; this.v = q('.cl-v'); this.clk = q('.cl-clk');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'magnify' }, { t: 7.4, pose: 'confused' }, { t: 10.8, pose: 'thumbs' }, { t: 14.4, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    const live = t < CL_END;
    let hi = 60070, lo = 60070;
    for (let s = 0; s <= Math.min(t, CL_END) + 1e-6; s += 0.1) { const v = CL_F(s); hi = Math.max(hi, v); lo = Math.min(lo, v); }
    const cl = live ? CL_F(t) : 60110;
    if (!live) { hi = 60120; lo = 60020; }
    const lc = [60070, Math.max(hi, 60070), Math.min(lo, 60070), cl];
    lc.live = live && t > 0.8;
    this.ch.render(t, 1, t > 0.8 ? lc : null);
    this.box.style.opacity = (live ? eo(seg(t, 0.8, 1.2)) * (0.6 + 0.4 * Math.sin(t * 6)) : 1 - eo(seg(t, CL_END, CL_END + 0.4))).toFixed(3);
    UI.rise(kit, this.a, t, 1.2, 0.6, 20, CL_END - 0.2, CL_END + 0.2);
    UI.set(this.v, 'close now ' + UI.fmt(Math.round(cl)));
    this.v.style.color = cl >= 60070 ? 'var(--up)' : 'var(--down)';
    UI.rise(kit, this.b, t, CL_END + 0.1, 0.5, 14);
    UI.rise(kit, this.c, t, 14.4, 0.6, 20);
    UI.set(this.clk, t < 14.4 ? '' : '10:24 → plan · 10:25 → new plan');
    this.tutor.render(t);
  },
});
