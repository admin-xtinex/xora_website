const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const RR_BASE = 720, RR_UNIT = 190;
kit.scene('rr', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const bar = (cls, x, col, name, sub) => '<div class="' + cls + '" style="position:absolute;left:' + x + 'px;top:' + RR_BASE + 'px;width:180px;height:0;border-radius:14px 14px 4px 4px;background:color-mix(in srgb, ' + col + ' 40%, var(--ground));border:2px solid ' + col + ';box-sizing:border-box"></div>' +
      '<div class="' + cls + '-l" style="position:absolute;left:' + (x - 40) + 'px;width:260px;text-align:center;top:0"><p style="margin:0;font-size:28px;font-weight:700;color:' + col + '">' + name + '</p><p class="mono ' + cls + '-v" style="margin:2px 0 0;font-size:40px"></p><p class="mono" style="margin:0;font-size:22px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">' + sub + '</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div style="position:absolute;left:1060px;top:' + RR_BASE + 'px;width:560px;height:3px;background:color-mix(in srgb, var(--second) 30%, transparent)"></div>' +
      bar('rr-r', 1120, 'var(--accent)', 'Risk', '600 × 0.01') + bar('rr-w', 1380, 'var(--main)', 'Reward', '1,200 × 0.01') +
      '<div class="rr-half" style="position:absolute;left:1380px;top:' + (RR_BASE - RR_UNIT) + 'px;width:180px;height:0;border-top:3px dashed var(--second)"></div>' +
      '<p class="fict" style="position:absolute;left:1060px;top:760px;margin:0">Long 0.01 BTC · entry 60,000 · fictional</p>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick rr-k">Size up the plan</p>' +
      '<h2 class="line rr-t">Risk/reward ratio</h2></div>' +
      '<div class="glass rr-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">The <b>risk/reward ratio</b> compares what you could <b>lose</b> (risk) with what you could <b>gain</b> (reward).</p></div>' +
      '<div class="glass rr-f" style="left:140px;top:560px;width:820px;padding:24px 36px;display:flex;align-items:center;justify-content:space-between"><p class="mono" style="margin:0;font-size:34px">Reward ÷ Risk = 12 ÷ 6 = 2</p><p class="mono" style="margin:0;font-size:56px;color:var(--main)">1 : 2</p></div>' +
      '<div class="glass rr-n" style="left:140px;top:700px;width:820px;padding:18px 36px;border-color:var(--accent)"><p style="margin:0;font-size:30px;font-weight:600">Before fees. <span style="color:var(--accent)">Not a chance of winning.</span></p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.rr-k').style; this.t = q('.rr-t'); this.def = q('.rr-def').style; this.f = q('.rr-f').style; this.n = q('.rr-n').style; this.half = q('.rr-half').style;
    this.r = q('.rr-r').style; this.w = q('.rr-w').style; this.rl = q('.rr-r-l').style; this.wl = q('.rr-w-l').style; this.rv = q('.rr-r-v'); this.wv = q('.rr-w-v');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.5, pose: 'explain' }, { t: 6.4, pose: 'point', flip: true }, { t: 11.7, pose: 'idea' }, { t: 17.5, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    const pr = eio(seg(t, 6.6, 7.8)), pw = eio(seg(t, 8.8, 10.4));
    const set = (st, l, v, p, units, val) => {
      const h = RR_UNIT * units * p;
      st.height = h.toFixed(1) + 'px'; st.top = (RR_BASE - h).toFixed(1) + 'px'; st.opacity = p > 0 ? 1 : 0;
      l.top = (RR_BASE - h - 130).toFixed(1) + 'px'; l.opacity = eo(seg(p, 0, 0.3));
      UI.txt(v, (val * p).toFixed(2) + ' USDT');
    };
    set(this.r, this.rl, this.rv, pr, 1, 6); set(this.w, this.wl, this.wv, pw, 2, 12);
    this.half.opacity = eo(seg(t, 12.2, 12.7));
    UI.rise(this.f, t, 11.8);
    UI.rise(this.n, t, 17.6);
    this.tutor.render(t);
  },
});
