const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Concept: the margin-balance gauge sinks to the maintenance line, and the position is force-closed. No numbers for the line.
const LQ_TOP = 260, LQ_BOT = 660, LQ_LINE = 600;
kit.scene('liquidation', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:960px"><p class="kick lq-k">New word · liquidation</p>' +
      '<h2 class="line lq-t" style="font-size:72px">A forced closure</h2></div>' +
      '<div class="glass lq-def" style="left:140px;top:320px;width:960px;padding:26px 34px"><p class="def lq-d" style="margin:0"><b>Liquidation</b> is when the exchange force-closes your position, because your margin balance fell to the maintenance level.</p></div>' +
      '<div class="glass lq-out" style="left:140px;top:530px;width:960px;padding:22px 34px;border-color:var(--accent)"><p class="kick" style="margin:0 0 8px;color:var(--accent)">What it means for you</p>' +
      '<p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">You don’t pick the price or the moment. Most or all of the margin can be lost, and a fee may apply.</p></div>' +
      '<div class="glass lq-an" style="left:140px;top:530px;width:960px;padding:22px 34px;display:flex;align-items:center;gap:26px">' +
      '<svg width="120" height="70" viewBox="0 0 120 70" style="flex:none"><path d="M8 50 L14 30 Q18 20 30 20 L80 20 Q92 20 100 30 L112 40 L112 50 Z" fill="none" stroke-width="4" stroke-linejoin="round" style="stroke:var(--main)"/><circle cx="32" cy="54" r="10" stroke-width="4" style="fill:var(--ground);stroke:var(--main)"/><circle cx="88" cy="54" r="10" stroke-width="4" style="fill:var(--ground);stroke:var(--main)"/></svg>' +
      '<p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">Like a rental firm taking the car back early, before the damage passes the deposit.</p></div>' +
      '<div class="glass lq-g" style="left:1200px;top:170px;width:580px;height:540px;padding:22px 30px"><p class="fict" style="margin:0 0 6px">Concept picture · not an exchange formula</p>' +
      '<div style="display:flex;align-items:center;gap:14px"><b style="font-size:26px">Long 10x</b><span class="chip lq-st" style="font-size:22px;padding:6px 16px"><span class="dot lq-sd"></span><span class="lq-stt">Open</span></span></div></div>' +
      '<div style="position:absolute;left:1240px;top:' + LQ_TOP + 'px;width:130px;height:' + (LQ_BOT - LQ_TOP) + 'px;border-radius:16px;border:2px solid color-mix(in srgb, var(--second) 20%, transparent);overflow:hidden"><div class="lq-fill" style="position:absolute;left:0;right:0;bottom:0"></div></div>' +
      '<div style="position:absolute;left:1226px;width:158px;top:' + LQ_LINE + 'px;border-top:4px dashed var(--accent)"></div>' +
      '<p style="position:absolute;left:1400px;top:' + (LQ_LINE - 34) + 'px;width:360px;margin:0;font-size:24px;line-height:1.3;font-weight:600;color:var(--accent)">Maintenance level</p>' +
      '<p class="lq-bl" style="position:absolute;left:1400px;top:' + (LQ_TOP + 10) + 'px;width:360px;margin:0;font-size:24px;font-weight:600">Margin balance</p>' +
      '<div class="lq-stamp" style="position:absolute;left:1390px;top:380px;padding:14px 22px;border:4px solid var(--accent);border-radius:14px;color:var(--accent);font-family:var(--display);font-weight:700;font-size:34px;line-height:1.1;text-transform:uppercase;letter-spacing:.06em">Force-<br>closed</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.lq-k').style; this.t = q('.lq-t'); this.def = q('.lq-def').style; this.d = q('.lq-d');
    this.out = q('.lq-out').style; this.an = q('.lq-an').style; this.g = q('.lq-g').style;
    this.fill = q('.lq-fill').style; this.bl = q('.lq-bl').style; this.stamp = q('.lq-stamp').style;
    this.st = q('.lq-st').style; this.sd = q('.lq-sd').style; this.stt = q('.lq-stt');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'explain' }, { t: 6.2, pose: 'magnify' }, { t: 11.5, pose: 'calm' }, { t: 17.6, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.def, t, 0.7, 0.7);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.04 });
    UI.rise(kit, this.g, t, 2.4, 0.7);
    // 6.6–10.4: the balance sinks to the line; at 10.4 the position is closed.
    const fall = eio(seg(t, 6.6, 10.4)), full = LQ_BOT - LQ_TOP, h = lerp(full * 0.92, LQ_BOT - LQ_LINE, fall);
    this.fill.height = h.toFixed(1) + 'px';
    const shut = t >= 10.4;
    this.fill.background = shut ? 'color-mix(in srgb, var(--second) 22%, transparent)' : fall > 0.6 ? 'var(--accent)' : 'linear-gradient(0deg, var(--main), color-mix(in srgb, var(--main) 55%, var(--accent)))';
    this.bl.top = (LQ_BOT - h - 2).toFixed(1) + 'px'; this.bl.opacity = eo(seg(t, 2.8, 3.3)) * (shut ? 0 : 1);
    UI.set(this.stt, shut ? 'Closed' : 'Open');
    this.st.borderColor = shut ? 'var(--accent)' : 'color-mix(in srgb, var(--main) 30%, transparent)';
    this.sd.background = shut ? 'var(--accent)' : 'var(--main)';
    const sp = seg(t, 10.4, 10.9);
    this.stamp.opacity = eo(sp); this.stamp.transform = 'rotate(-8deg) scale(' + lerp(1.6, 1, eob(sp, 1.4)).toFixed(3) + ')';
    UI.rise(kit, this.out, t, 11.5, 0.7, 30, 17.2, 17.6);
    UI.rise(kit, this.an, t, 17.6, 0.7);
    this.tutor.render(t);
  },
});
