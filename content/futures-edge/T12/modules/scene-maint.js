const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A conceptual gauge: the margin balance sinks toward a maintenance line whose level the exchange sets (no number shown).
const MT_TOP = 230, MT_BOT = 690, MT_LINE = 590;
kit.scene('maint', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:920px"><p class="kick mt-k">New word · maintenance margin</p>' +
      '<h2 class="line mt-t" style="font-size:72px">The minimum to stay open</h2></div>' +
      '<div class="glass mt-def" style="left:140px;top:360px;width:920px;padding:26px 34px"><p class="def mt-d" style="margin:0"><b>Maintenance margin</b> is the minimum margin the exchange needs to keep your position open. Its rules set the amount.</p></div>' +
      '<div class="glass mt-eq" style="left:140px;top:580px;width:920px;padding:22px 34px"><p class="kick" style="margin:0 0 8px">Margin balance = margin + open profit or loss</p>' +
      '<p class="mono mt-eqv" style="margin:0;font-size:40px"></p></div>' +
      '<div class="glass mt-g" style="left:1220px;top:' + (MT_TOP - 70) + 'px;width:560px;height:' + (MT_BOT - MT_TOP + 110) + 'px"></div>' +
      '<p class="kick mt-gl" style="position:absolute;left:1250px;top:' + (MT_TOP - 46) + 'px;margin:0">Margin balance · concept</p>' +
      '<div style="position:absolute;left:1260px;top:' + MT_TOP + 'px;width:150px;height:' + (MT_BOT - MT_TOP) + 'px;border-radius:16px;border:2px solid color-mix(in srgb, var(--second) 20%, transparent);overflow:hidden" class="mt-tank"><div class="mt-fill" style="position:absolute;left:0;right:0;bottom:0;background:linear-gradient(0deg, var(--main), color-mix(in srgb, var(--main) 55%, var(--accent)))"></div></div>' +
      '<div class="mt-line" style="position:absolute;left:1244px;width:182px;top:' + MT_LINE + 'px;height:0;border-top:4px dashed var(--accent)"></div>' +
      '<p class="mt-ll" style="position:absolute;left:1446px;top:' + (MT_LINE - 40) + 'px;width:310px;margin:0;font-size:24px;line-height:1.3;font-weight:600;color:var(--accent)">Maintenance level, set by the exchange</p>' +
      '<p class="mt-warn" style="position:absolute;left:1446px;top:' + (MT_LINE + 34) + 'px;width:310px;margin:0;font-size:24px;line-height:1.3;font-weight:600">Reach it, and the position can be closed</p>' +
      '<p class="mono mt-bv" style="position:absolute;left:1446px;top:' + (MT_TOP + 6) + 'px;margin:0;font-size:34px"></p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mt-k').style; this.t = q('.mt-t'); this.def = q('.mt-def').style; this.d = q('.mt-d');
    this.eq = q('.mt-eq').style; this.eqv = q('.mt-eqv'); this.g = q('.mt-g').style; this.gl = q('.mt-gl').style; this.tank = q('.mt-tank').style;
    this.fill = q('.mt-fill').style; this.line = q('.mt-line').style; this.ll = q('.mt-ll').style; this.warn = q('.mt-warn').style; this.bv = q('.mt-bv');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'read' }, { t: 6.5, pose: 'point', flip: true }, { t: 13.0, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.def, t, 0.7, 0.7);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.04 });
    const gp = eo(seg(t, 2.0, 2.7));
    for (const s of [this.g, this.gl, this.tank]) s.opacity = gp;
    const lp = eo(seg(t, 3.4, 4.0));
    this.line.opacity = lp; this.ll.opacity = lp;
    this.line.transformOrigin = '0 50%'; this.line.transform = 'scaleX(' + lp + ')';
    UI.rise(kit, this.eq, t, 6.5, 0.7);
    // 6.8–11: a 20 USDT open loss takes the balance from 100 to 80. After 13: it keeps sinking toward the line (no numbers: the level is the exchange's).
    const l1 = eio(seg(t, 7.4, 11.0)), pnl = -20 * l1;
    UI.set(this.eqv, t < 13.0 ? '100 + (' + UI.sgn(pnl, 0) + ') = ' + UI.fmt(100 + pnl, 0) + ' USDT' : 'Losses keep pushing it down');
    this.eqv.style.color = t < 13.0 ? 'var(--second)' : 'var(--accent)';
    UI.set(this.bv, t < 13.0 ? UI.fmt(100 + pnl, 0) + ' USDT' : '');
    const full = MT_BOT - MT_TOP;
    let h = full * (1 - 0.2 * l1);
    const l2 = eio(seg(t, 13.4, 17.0));
    h = lerp(h, MT_BOT - MT_LINE + 2, l2);
    this.fill.height = h.toFixed(1) + 'px';
    this.bv.style.top = (MT_BOT - h - 2).toFixed(1) + 'px';
    const near = eo(seg(t, 16.4, 17.0));
    this.fill.background = near > 0 ? 'linear-gradient(0deg, var(--accent), color-mix(in srgb, var(--accent) 55%, var(--main)))' : 'linear-gradient(0deg, var(--main), color-mix(in srgb, var(--main) 55%, var(--accent)))';
    this.line.filter = 'brightness(' + (1 + 0.6 * near * (0.5 + 0.5 * Math.sin(t * 6))).toFixed(3) + ')';
    this.warn.opacity = near; this.warn.color = 'var(--accent)';
    this.tutor.render(t);
  },
});
