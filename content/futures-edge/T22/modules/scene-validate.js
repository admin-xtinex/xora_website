const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// An educational mock calculator: valid inputs first, then three changes that make the result meaningless, each with a warning.
// Cases: [time, account, risk, entry, stop, changed field, result or null, warning index]
const VA = [[0, 1000, 10, 60000, 59400, -1, 1000, -1], [5.0, 1000, 10, 60000, 60000, 4, null, 0], [10.6, 1000, 10, 60000, 60500, 4, null, 1], [15.8, 1000, 1500, 60000, 59400, 1, null, 2]];
const VA_W = ['Stop equals entry: the distance is 0, so no size makes sense.', 'Long with the stop above entry: wrong side.', 'Risk budget bigger than the account: impossible.'];
kit.scene('validate', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const F = ['Account', 'Risk budget · example', 'Direction', 'Entry', 'Stop'];
    const fields = F.map((f, i) => '<div class="row" style="padding:8px 0"><span>' + f + '</span><span class="mono va-v" style="font-size:30px;padding:2px 12px;border-radius:8px">—</span></div>').join('');
    this.h = UI.head(kit, 'Input checks', 'When the inputs make no sense',
      '<div class="glass va-c" style="left:140px;top:300px;width:820px;padding:16px 30px"><p class="fict" style="margin:0 0 4px">Position size calculator · educational mock, not a real exchange screen</p>' + fields +
      '<div class="row" style="padding:12px 0 4px;border:0"><span style="color:var(--second);font-weight:700">Allowed notional</span><span class="mono va-o" style="font-size:40px">—</span></div></div>' +
      '<div style="position:absolute;left:1010px;top:300px;width:770px;display:flex;flex-direction:column;gap:16px">' +
      VA_W.map((w) => '<div class="glass va-w" style="position:relative;padding:18px 26px;border-color:var(--accent);display:flex;gap:16px;align-items:flex-start"><span class="mono" style="flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:24px;font-weight:700;background:var(--accent);color:var(--ground)">!</span>' +
        '<span style="font-size:28px;line-height:1.35;font-weight:600">' + w + '</span></div>').join('') + '</div>');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.c = q('.va-c').style; this.vs = all('.va-v'); this.o = q('.va-o'); this.ws = all('.va-w').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 5.0, pose: 'confused' }, { t: 10.6, pose: 'magnify' }, { t: 15.8, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.c, t, 0.4, 0.7);
    let k = 0; VA.forEach((c, i) => { if (t >= c[0] + 0.4) k = i; });
    const c = VA[k], vals = [UI.fmt(c[1]) + ' USDT', UI.fmt(c[2]) + ' USDT', 'Long', UI.fmt(c[3]), UI.fmt(c[4])];
    this.vs.forEach((e, i) => {
      UI.set(e, t < 1.0 + i * 0.3 ? '—' : vals[i]);
      const hot = i === c[5] ? 1 - seg(t, c[0] + 3.4, c[0] + 4.4) * 0.6 : 0;
      e.style.background = 'color-mix(in srgb, var(--accent) ' + (hot * 40).toFixed(0) + '%, transparent)';
      e.style.color = i === c[5] ? 'var(--accent)' : '';
    });
    const ok = c[6] != null && t > 2.6;
    UI.set(this.o, ok ? UI.fmt(c[6]) + ' USDT' : t > 2.6 ? 'no result' : '—');
    this.o.style.color = ok ? 'var(--main)' : t > 2.6 ? 'var(--accent)' : '';
    this.ws.forEach((s, i) => UI.rise(kit, s, t, VA[i + 1][0] + 0.6, 0.6, 20));
    this.tutor.render(t);
  },
});
