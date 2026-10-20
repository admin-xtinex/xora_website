const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The TRADE OPPORTUNITY card, enlarged (mock), read part by part.
const OP_STEPS = [
  [0.6, 'Direction and setup', 'BUY · Support reclaim'],
  [8.0, 'ENTRY and STOP', 'Where it starts · where it closes'],
  [14.8, 'RISK and NEXT RES.', 'Stop distance in % · next resistance'],
];
kit.scene('opportunity', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const met = (cls, a, b, col) => '<div class="op-m ' + cls + '" style="flex:1;padding:12px 14px;border-radius:16px;border:2px solid transparent"><p class="lbl" style="margin:0">' + a + '</p><p class="mono" style="margin:6px 0 0;font-size:36px;' + (col ? 'color:' + col : '') + '">' + b + '</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass op-c" style="left:940px;top:170px;width:840px;padding:26px 32px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><p class="card-h" style="margin:0;font-size:24px">⚡ TRADE OPPORTUNITY</p><span class="lbl" style="color:var(--accent)">AI insights</span></div>' +
      '<div class="op-s" style="display:flex;align-items:center;gap:18px;margin:18px 0 10px;padding:10px 12px;border-radius:16px;border:2px solid transparent"><span class="pill" style="color:var(--up);font-size:28px;padding:8px 22px">BUY</span>' +
      '<div><p style="margin:0;font-size:32px;font-weight:700">Support reclaim</p><p class="lbl" style="margin:4px 0 0">Waiting for your approval</p></div></div>' +
      '<div style="display:flex;gap:8px">' + met('op-e', 'ENTRY', '60,000') + met('op-st', 'STOP', '59,700', 'var(--down)') + met('op-r', 'RISK', '0.50%') + met('op-n', 'NEXT RES.', '60,600', 'var(--up)') + '</div>' +
      '<div style="display:flex;height:16px;border-radius:8px;overflow:hidden;margin:22px 0 8px"><div style="flex:1;background:var(--down)"></div><div style="width:4px;background:var(--second)"></div><div style="flex:2;background:var(--up)"></div></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:24px"><span style="color:var(--down)">Stop</span><span class="mono">2.0 R to the next level</span><span style="color:var(--up)">Target</span></div>' +
      '<div class="op-b mono" style="margin-top:20px;height:64px;border-radius:16px;display:grid;place-items:center;font-size:26px;font-weight:600;border:2px solid var(--up);color:var(--up);background:color-mix(in srgb, var(--up) 14%, transparent)"></div></div>' +
      '<div class="words" style="left:140px;top:180px;width:740px"><p class="kick op-k">Card one</p><h2 class="line op-t">Trade opportunity</h2></div>' +
      '<div class="op-list" style="position:absolute;left:140px;top:420px;width:740px;display:flex;flex-direction:column;gap:22px">' +
      OP_STEPS.map((s, i) => '<div class="op-i" style="display:flex;gap:20px;align-items:flex-start"><span class="mono" style="flex:none;width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:28px;border:2px solid var(--main);color:var(--main)">' + (i + 1) + '</span>' +
        '<div><p style="margin:0;font-size:32px;font-weight:700">' + s[1] + '</p><p style="margin:4px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + s[2] + '</p></div></div>').join('') + '</div>' +
      '</div>'));
    UI.mockLabel(kit, 940, 132);
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.op-k').style; this.t = q('.op-t'); this.c = q('.op-c').style; this.b = q('.op-b');
    this.items = all('.op-i').map((e) => e.style);
    this.hl = [[q('.op-s').style], [q('.op-e').style, q('.op-st').style], [q('.op-r').style, q('.op-n').style]];
    this.ml = kit.stage.querySelector('.mock').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'pointer', flip: true }, { t: 8.0, pose: 'explain' }, { t: 14.8, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.c, t, 0.3, 0.7, 40);
    this.ml.opacity = 0.9 * eo(seg(t, 0.8, 1.4));
    OP_STEPS.forEach((s, i) => {
      UI.rise(kit, this.items[i], t, s[0], 0.6, 20);
      const end = i + 1 < OP_STEPS.length ? OP_STEPS[i + 1][0] : 99;
      const on = t >= s[0] && t < end;
      this.items[i].opacity = (+this.items[i].opacity * (on ? 1 : 0.5)).toFixed(3);
      const g = on ? eo(seg(t, s[0] + 0.3, s[0] + 0.8)) : 0;
      this.hl[i].forEach((h) => { h.borderColor = 'color-mix(in srgb, var(--main) ' + (g * 80).toFixed(0) + '%, transparent)'; h.background = 'color-mix(in srgb, var(--main) ' + (g * 10).toFixed(1) + '%, transparent)'; });
    });
    const left = Math.max(0, 48 - Math.floor(t));
    UI.set(this.b, 'Approve buy · expires 0:' + String(left).padStart(2, '0'));
    this.tutor.render(t);
  },
});
