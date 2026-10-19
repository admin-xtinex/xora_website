const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// 10x long, 100 USDT margin, 1,000 USDT notional, entry 60,000 (fictional). Falls of 1%, 3%, 5%.
const BF_STEPS = [[11.3, 1, 59400, 90], [12.9, 3, 58200, 70], [14.5, 5, 57000, 50]];
const BF_X0 = 140, BF_W = 1300, BF_ML = 0.14; // the maintenance line sits at a fixed spot on the bar; no number is shown for it
kit.scene('buffer', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (a, b) => '<div style="display:flex;justify-content:space-between;align-items:baseline;padding:8px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + a + '</span><span class="mono" style="font-size:28px">' + b + '</span></div>';
    let chips = '';
    BF_STEPS.forEach((s) => { chips += '<span class="chip mono bf-c" style="font-size:26px;padding:10px 22px">−' + s[1] + '% · ' + UI.fmt(s[2]) + ' → <span style="color:var(--main)">' + s[3] + ' left</span></span>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1000px"><p class="kick bf-k">Margin balance</p>' +
      '<h2 class="line bf-t" style="font-size:72px">Your buffer shrinks</h2></div>' +
      '<div class="glass bf-eq" style="left:140px;top:320px;width:1000px;padding:20px 32px"><p style="margin:0;font-size:32px;font-weight:700">Margin balance = margin + unrealized PnL</p>' +
      '<p style="margin:6px 0 0;font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Unrealized PnL: open profit or loss, not locked in yet</p></div>' +
      '<div class="glass bf-tk" style="left:1220px;top:170px;width:560px;padding:20px 30px"><p class="fict" style="margin:0 0 6px">Position · fictional</p>' +
      row('Side', 'Long 10x') + row('Margin', '100 USDT') + row('Notional', '1,000 USDT') + row('Entry', '60,000') +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;padding:8px 0"><span style="font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Unrealized PnL</span><span class="mono bf-pnl" style="font-size:28px">0</span></div></div>' +
      '<p class="kick" style="position:absolute;left:' + BF_X0 + 'px;top:516px;margin:0">Margin balance</p>' +
      '<p class="mono bf-v" style="position:absolute;left:' + (BF_X0 + 290) + 'px;top:504px;margin:0;font-size:34px"></p>' +
      '<div style="position:absolute;left:' + BF_X0 + 'px;top:560px;width:' + BF_W + 'px;height:64px;border-radius:14px;background:color-mix(in srgb, var(--second) 7%, transparent);border:1.5px solid color-mix(in srgb, var(--second) 16%, transparent)"><div class="bf-fill" style="position:absolute;left:0;top:0;bottom:0;border-radius:13px"></div></div>' +
      '<div style="position:absolute;left:' + (BF_X0 + BF_W * BF_ML) + 'px;top:540px;height:104px;border-left:4px dashed var(--accent)"></div>' +
      '<p style="position:absolute;left:' + BF_X0 + 'px;top:652px;width:' + (BF_W * BF_ML + 140) + 'px;margin:0;font-size:22px;line-height:1.3;font-weight:600;color:var(--accent)">Maintenance level · exchange rules</p>' +
      '<div class="bf-room" style="position:absolute;top:546px;height:0;border-top:3px solid var(--main)"></div>' +
      '<p class="bf-rl" style="position:absolute;top:574px;margin:0;font-size:26px;font-weight:700;color:var(--ground);text-align:center">room left</p>' +
      '<div class="bf-chips" style="position:absolute;left:' + (BF_X0 + BF_W * BF_ML + 200) + 'px;top:650px;display:flex;gap:14px">' + chips + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.bf-k').style; this.t = q('.bf-t'); this.eq = q('.bf-eq').style; this.tk = q('.bf-tk').style; this.pnl = q('.bf-pnl');
    this.v = q('.bf-v'); this.fill = q('.bf-fill').style; this.room = q('.bf-room').style; this.rl = q('.bf-rl').style; this.chips = all('.bf-c').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'writing' }, { t: 6.1, pose: 'present' }, { t: 11.3, pose: 'point', flip: true }, { t: 16.4, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.eq, t, 0.7, 0.7);
    UI.rise(kit, this.tk, t, 6.1, 0.7);
    // Balance steps 100 → 90 → 70 → 50 as each fall plays.
    let bal = 100;
    BF_STEPS.forEach((s, i) => { const prev = i ? BF_STEPS[i - 1][3] : 100; if (t >= s[0]) bal = lerp(prev, s[3], eio(seg(t, s[0], s[0] + 0.8))); });
    const pnl = bal - 100;
    UI.set(this.pnl, UI.sgn(Math.round(pnl), 0) + ' USDT');
    this.pnl.style.color = pnl < -0.5 ? 'var(--accent)' : 'var(--second)';
    UI.set(this.v, UI.fmt(Math.round(bal)) + ' USDT');
    const w = BF_W * bal / 100;
    this.fill.width = w.toFixed(1) + 'px';
    this.fill.background = bal > 60 ? 'linear-gradient(90deg, color-mix(in srgb, var(--main) 60%, var(--accent)), var(--main))' : 'linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 60%, var(--main)))';
    this.fill.opacity = eo(seg(t, 6.4, 7.0)); this.v.style.opacity = eo(seg(t, 6.4, 7.0));
    this.chips.forEach((s, i) => UI.rise(kit, s, t, BF_STEPS[i][0], 0.5, 16));
    // "Room left": the stretch between the maintenance line and the end of the fill.
    const rp = eo(seg(t, 16.4, 17.0)), x0 = BF_X0 + BF_W * BF_ML;
    this.room.left = x0.toFixed(1) + 'px'; this.room.width = ((BF_X0 + w - x0) * rp).toFixed(1) + 'px';
    this.rl.left = x0.toFixed(1) + 'px'; this.rl.width = (BF_X0 + w - x0).toFixed(1) + 'px'; this.rl.opacity = rp;
    this.tutor.render(t);
  },
});
