const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const XR_AT = [4.5, 10.8, 17.2];
kit.scene('extra', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (i, kick, title, body, art) => '<div class="glass xr-c" style="left:' + (140 + i * 560) + 'px;top:330px;width:520px;height:446px;padding:22px 30px">' +
      '<p class="kick" style="margin:0;color:var(--accent)">' + kick + '</p><p style="margin:10px 0 0;font-size:34px;font-weight:700">' + title + '</p>' +
      '<p style="margin:8px 0 0;font-size:28px;line-height:1.35;color:color-mix(in srgb, var(--second) 78%, var(--ground))">' + body + '</p>' + art + '</div>';
    // 1. Leverage: a small deposit block and a bigger position block.
    const lev = '<div style="position:absolute;left:30px;right:30px;bottom:30px;height:150px">' +
      '<div style="position:absolute;left:0;bottom:0;width:90px;height:60px;border-radius:10px;background:var(--main)"></div><span style="position:absolute;left:0;bottom:66px;font-size:22px;font-weight:600">Deposit</span>' +
      '<div class="xr-pos" style="position:absolute;left:130px;bottom:0;width:330px;height:120px;border-radius:10px;border:3px dashed var(--accent);background:color-mix(in srgb, var(--accent) 20%, transparent)"></div><span class="xr-pl" style="position:absolute;left:142px;bottom:126px;font-size:22px;font-weight:600">Bigger position</span></div>';
    // 2. Liquidation (conceptual): the margin bar drains as price moves against the position.
    const liq = '<div style="position:absolute;left:30px;right:30px;bottom:30px">' +
      '<div style="display:flex;justify-content:space-between;font-size:22px;font-weight:600;margin-bottom:8px"><span>Margin left</span><span class="mono xr-ml"></span></div>' +
      '<div style="height:40px;border-radius:10px;background:color-mix(in srgb, var(--second) 8%, transparent);overflow:hidden"><div class="xr-mb" style="height:100%;border-radius:10px"></div></div>' +
      '<span class="chip xr-st" style="margin-top:16px;font-size:24px;padding:6px 18px;background:var(--accent);border-color:var(--accent)">Closed for you</span>' +
      '<p class="fict" style="margin:10px 0 0">Conceptual, not an exact exchange model</p></div>';
    // 3. Funding: a clock; at each mark a small payment.
    let marks = '';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; marks += '<line x1="' + (Math.sin(a) * 52).toFixed(1) + '" y1="' + (-Math.cos(a) * 52).toFixed(1) + '" x2="' + (Math.sin(a) * 60).toFixed(1) + '" y2="' + (-Math.cos(a) * 60).toFixed(1) + '" stroke-width="3" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>'; }
    const fund = '<svg style="position:absolute;left:30px;bottom:34px" width="140" height="140" viewBox="-70 -70 140 140"><circle r="64" fill="none" stroke-width="4" style="stroke:var(--second)"/>' + marks +
      '<line class="xr-hand" x1="0" y1="0" x2="0" y2="-48" stroke-width="5" stroke-linecap="round" style="stroke:var(--main)"/><circle r="6" style="fill:var(--second)"/></svg>' +
      '<div style="position:absolute;left:190px;right:24px;bottom:40px;display:flex;flex-direction:column;gap:10px"><span class="chip xr-f1" style="font-size:22px;padding:6px 14px;border-color:var(--accent)">Pay 0.06 USDT</span><span class="chip xr-f2" style="font-size:22px;padding:6px 14px;border-color:var(--main)">Receive 0.06 USDT</span>' +
      '<p class="mono" style="margin:0;font-size:22px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">e.g. 600 × 0.01%</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick xr-k" style="color:var(--accent)">Extra futures risks</p>' +
      '<h2 class="line xr-t">What spot does not have</h2></div>' +
      card(0, 'Lesson T12', 'Margin and leverage', 'A small deposit controls a bigger position.', lev) +
      card(1, 'Lesson T13', 'Liquidation', 'If losses eat your margin, the position can be closed for you.', liq) +
      card(2, 'Lesson T13', 'Funding', 'Perpetual traders pay or receive small amounts at set times.', fund) +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.xr-k').style; this.t = q('.xr-t'); this.cards = all('.xr-c').map((e) => e.style);
    this.pos = q('.xr-pos').style; this.pl = q('.xr-pl').style; this.mb = q('.xr-mb').style; this.ml = q('.xr-ml'); this.st = q('.xr-st').style;
    this.hand = q('.xr-hand'); this.f1 = q('.xr-f1').style; this.f2 = q('.xr-f2').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'think' }, { t: 4.5, pose: 'present' }, { t: 10.8, pose: 'confused' }, { t: 17.2, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cards.forEach((c, i) => {
      const a = XR_AT[i], p = seg(t, a, a + 0.7);
      c.opacity = eo(seg(t, a, a + 0.35)).toFixed(3);
      c.transform = 'translateY(' + lerp(40, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.95, 1, eob(p, 1.5)).toFixed(4) + ')';
    });
    const g = eob(seg(t, 5.6, 6.8), 1.4);
    this.pos.transformOrigin = '0 100%'; this.pos.transform = 'scale(' + lerp(0.27, 1, g).toFixed(4) + ',' + lerp(0.5, 1, g).toFixed(4) + ')';
    this.pl.opacity = eo(seg(t, 6.6, 7.0)).toFixed(3);
    const m = 1 - eio(seg(t, 12.0, 15.6));
    this.mb.width = (m * 100).toFixed(1) + '%';
    this.mb.background = m > 0.35 ? 'var(--main)' : 'var(--accent)';
    UI.set(this.ml, Math.round(m * 100) + '%');
    const s = seg(t, 15.7, 16.2);
    this.st.opacity = eo(s).toFixed(3); this.st.transform = 'scale(' + lerp(1.4, 1, eob(s, 1.5)).toFixed(4) + ')';
    this.st.display = 'inline-flex';
    const h = Math.max(0, t - 17.6) * 140;
    this.hand.setAttribute('transform', 'rotate(' + h.toFixed(1) + ')');
    // Payments happen each time the hand passes the top (every ~2.6 s).
    const f = (k) => { const at = 17.6 + 360 / 140 * k; return Math.sin(Math.PI * seg(t, at, at + 1.6)); };
    this.f1.opacity = Math.max(eo(seg(t, 17.4, 17.8)) * 0.35, f(1)).toFixed(3);
    this.f2.opacity = Math.max(eo(seg(t, 17.4, 17.8)) * 0.35, f(2)).toFixed(3);
    this.tutor.render(t);
  },
});
