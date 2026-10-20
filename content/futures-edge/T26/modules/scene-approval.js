const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// Three ways a trade can start: you tap Approve (or it expires), auto approval, or your own manual BUY / SHORT.
const AP_MSG = [
  ['✓', 'var(--up)', 'The engine agrees — a setup in this direction is live now.'],
  ['⇅', 'var(--warn)', 'The engine sees a sell setup here, not a buy.'],
  ['i', 'var(--main)', 'The engine has no setup on this coin right now — this one is your call.'],
];
kit.scene('approval', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const met = (a, b, col) => '<div style="flex:1"><p class="lbl" style="margin:0">' + a + '</p><p class="mono" style="margin:4px 0 0;font-size:28px;' + (col ? 'color:' + col : '') + '">' + b + '</p></div>';
    const opp = '<div class="card ap-o" style="position:absolute;left:26px;right:26px;top:110px"><p class="card-h">TRADE OPPORTUNITY</p>' +
      '<div style="display:flex;align-items:center;gap:14px"><span class="pill" style="color:var(--up)">BUY</span><div><p style="margin:0;font-size:26px;font-weight:700">Support reclaim</p><p class="lbl" style="margin:2px 0 0">Waiting for your approval</p></div></div>' +
      '<div style="display:flex;gap:10px;margin:16px 0">' + met('ENTRY', '60,000') + met('STOP', '59,700', 'var(--down)') + '</div>' +
      '<div class="ap-b mono" style="height:66px;border-radius:16px;display:grid;place-items:center;font-size:25px;font-weight:600;border:2px solid var(--up);color:var(--up);background:color-mix(in srgb, var(--up) 14%, transparent)"></div></div>';
    const auto = '<div class="card ap-a" style="position:absolute;left:26px;right:26px;top:110px"><p class="card-h">TRADE SETTINGS</p>' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:26px;font-weight:600">Auto trade approval</span>' +
      '<span class="ap-tg" style="position:relative;width:84px;height:46px;border-radius:23px;flex:none"><span class="ap-tk" style="position:absolute;top:5px;width:36px;height:36px;border-radius:50%;background:var(--second)"></span></span></div>' +
      '<p class="ap-at" style="margin:16px 0 0;font-size:24px;line-height:1.4"></p></div>';
    let msgs = '';
    AP_MSG.forEach((m) => {
      msgs += '<div class="ap-m" style="display:flex;gap:14px;align-items:flex-start;margin-top:14px;padding:12px 14px;border-radius:16px;border:1.5px solid color-mix(in srgb, ' + m[1] + ' 45%, transparent)">' +
        '<span class="mono" style="flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:22px;font-weight:700;color:var(--ground);background:' + m[1] + '">' + m[0] + '</span>' +
        '<span style="font-size:23px;line-height:1.35">' + m[2] + '</span></div>';
    });
    const sheet = '<div class="card ap-s" style="position:absolute;left:26px;right:26px;top:110px"><p class="card-h">BUY / LONG · YOUR ORDER</p>' +
      '<p style="margin:0;font-size:24px;line-height:1.35">Market order with an automatic stop.</p>' + msgs + '</div>';
    this.ph = UI.phone(kit, { left: 1120, top: 140, w: 580, h: 630, title: 'BTC/USDT', body: opp + auto + sheet }).style;
    this.ml = UI.mockLabel(kit, 1120, 100).style;
    const step = (cls, n, a, b) => '<div class="ap-st ' + cls + '" style="display:flex;gap:22px;align-items:flex-start"><span class="mono" style="flex:none;width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font-size:28px;border:2px solid var(--main);color:var(--main)">' + n + '</span>' +
      '<div><p style="margin:0;font-size:32px;font-weight:700">' + a + '</p><p style="margin:4px 0 0;font-size:28px;line-height:1.4;color:color-mix(in srgb, var(--second) 72%, var(--ground))">' + b + '</p></div></div>';
    kit.stage.append(kit.h('<div>' +
      '<div class="words" style="left:140px;top:170px;width:900px"><p class="kick ap-k">Who presses the button?</p>' +
      '<h2 class="line ap-t" style="font-size:72px">Approve, auto, or manual</h2>' +
      '<div style="display:flex;flex-direction:column;gap:30px;margin-top:20px">' +
      step('', '1', 'Approval (default)', 'Tap Approve before the 1-minute candle ends, or the setup expires.') +
      step('', '2', 'Auto approval on', 'The engine enters by itself, within your settings.') +
      step('', '3', 'Your own BUY / SHORT', 'Always your call. The sheet says if the engine agrees.') + '</div></div>' +
      '<div class="ap-tap" style="position:absolute;width:70px;height:70px;border-radius:50%;border:4px solid var(--second);box-sizing:border-box"></div></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ap-k').style; this.t = q('.ap-t'); this.steps = all('.ap-st').map((e) => e.style);
    this.o = q('.ap-o').style; this.a = q('.ap-a').style; this.s = q('.ap-s').style; this.b = q('.ap-b');
    this.tg = q('.ap-tg').style; this.tk = q('.ap-tk').style; this.at = q('.ap-at'); this.ms = all('.ap-m').map((e) => e.style); this.tap = q('.ap-tap').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'laptop' }, { t: 6.8, pose: 'think' }, { t: 11.2, pose: 'idea' }, { t: 16.8, pose: 'pointer', flip: true }, { t: 23.2, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.steps.forEach((s, i) => {
      const a = [0.8, 11.2, 16.8][i];
      UI.rise(kit, s, t, a, 0.6, 20);
      const act = (i === 0 && t < 11.2) || (i === 1 && t >= 11.2 && t < 16.8) || (i === 2 && t >= 16.8);
      s.opacity = (+s.opacity * (act ? 1 : 0.45)).toFixed(3);
    });
    const p = seg(t, 0.3, 1.2);
    this.ph.opacity = eo(p); this.ph.transform = 'translateY(' + (lerp(50, 0, eo(p)) - t * 0.4).toFixed(1) + 'px)';
    this.ml.opacity = 0.9 * eo(seg(t, 1.0, 1.6));
    // card switching inside the phone
    const sw = (a, b) => eo(seg(t, a, a + 0.4)) * (1 - ei(seg(t, b, b + 0.4)));
    this.o.opacity = sw(0.6, 10.8); this.a.opacity = sw(11.2, 16.4); this.s.opacity = sw(16.8, 99);
    // approve countdown: 0:10 → 0:00, then Expired
    const left = Math.max(0, Math.ceil(10 - Math.max(0, t - 0.8)));
    const exp = t >= 10.8;
    UI.set(this.b, exp ? 'Expired · candle closed' : 'Approve buy · expires 0:' + String(left).padStart(2, '0'));
    this.b.style.opacity = exp ? 0.45 : 1;
    this.b.style.transform = 'scale(' + (1 + 0.03 * Math.sin(t * 6) * (exp ? 0 : 1)).toFixed(4) + ')';
    // toggle Off → On at 13.0
    const on = eio(seg(t, 13.0, 13.4));
    this.tg.background = 'color-mix(in srgb, var(--main) ' + (15 + 70 * on).toFixed(0) + '%, var(--ground))';
    this.tk.left = lerp(5, 43, on).toFixed(1) + 'px';
    UI.set(this.at, t < 13.0 ? 'Off: a triggered setup waits for your Approve.' : 'On: the engine enters by itself, within your settings.');
    const tp = seg(t, 12.5, 13.2);
    this.tap.left = '1572px'; this.tap.top = '288px';
    this.tap.opacity = (Math.sin(Math.PI * tp) * 0.9).toFixed(3); this.tap.transform = 'scale(' + lerp(1.5, 0.8, tp).toFixed(3) + ')';
    this.ms.forEach((s, i) => { const a = 18.6 + i * 1.6; UI.rise(kit, s, t, a, 0.5, 16); });
    this.tutor.render(t);
  },
});
