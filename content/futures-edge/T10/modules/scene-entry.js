const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const type = (s, t, a, step) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - a) / step) + 1)));
kit.scene('entry', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    this.spot = UI.spot(kit);
    const ex = '<div class="en-ex" style="display:flex;flex-direction:column;gap:8px;padding:18px 24px;border-radius:16px;background:color-mix(in srgb, var(--ground) 70%, transparent);border:1.5px solid color-mix(in srgb, var(--main) 30%, transparent)">' +
      '<p class="fict" style="margin:0">Worked example · fictional prices</p>' +
      '<p class="mono en-e1" style="margin:0;font-size:30px">Order value = price × size</p>' +
      '<p class="mono en-e2" style="margin:0;font-size:30px">60,000 × 0.010 BTC = <span style="color:var(--main)">600 USDT</span></p>' +
      '<p class="mono en-e3" style="margin:0;font-size:28px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">Est. fee at an example 0.05%: 600 × 0.0005 = 0.30 USDT</p></div>';
    this.card = UI.tip(kit, 140, 214, 1150, '5 · Order entry', 'Where an order is set up', 'Pick an order <b>type</b>, then a <b>price</b> and a <b>size</b>. The leverage control is covered in T12.', ex);
    kit.stage.append(kit.h('<div class="glass en-stamp" style="left:1475px;top:560px;width:320px;padding:18px 20px;text-align:center;border:3px solid var(--accent);background:color-mix(in srgb, var(--ground) 80%, var(--accent))">' +
      '<p style="margin:0;font-size:30px;font-weight:700">Mock only</p><p style="margin:4px 0 0;font-size:24px;font-weight:600">No order was sent</p></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.cs = this.card.style; this.exb = q('.en-ex').style; this.st = q('.en-stamp').style;
    this.ex = ['.en-e1', '.en-e2', '.en-e3'].map((s) => q(s).style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 7.4, pose: 'typing' }, { t: 12.8, pose: 'present' }, { t: 19.4, pose: 'think' }, { t: 21.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    const ty = t < 1.8 ? 0 : t < 3.2 ? 1 : t < 4.6 ? 2 : 0;
    const p = type('60,000', t, 7.9, 0.18), s = type('0.010', t, 9.9, 0.2);
    const v = Math.round(lerp(0, 600, eo(seg(t, 13.0, 14.2))) * 100) / 100;
    const form = {
      ty, p, s,
      pf: eo(seg(t, 7.6, 7.9)) * (1 - eo(seg(t, 9.4, 9.7))), sf: eo(seg(t, 9.6, 9.9)) * (1 - eo(seg(t, 11.4, 11.7))),
      v: t >= 13.0 ? UI.fmt(v, 2) + ' USDT' : null, f: t >= 14.6 ? '0.30 USDT' : null,
      buy: seg(t, 19.8, 20.4),
    };
    this.term.render(t, { sym: 'BTC', form });
    // Order-type tabs pulse as they are named.
    this.term.E.ty.forEach((st, i) => { const a = [1.8, 3.2, 4.6][i]; st.transform = 'scale(' + (1 + 0.1 * Math.sin(Math.PI * seg(t, a, a + 0.5))).toFixed(3) + ')'; });
    this.spot.set(UI.R.entry, eo(seg(t, 0, 0.8)), eo(seg(t, 0.2, 1.0)));
    UI.show(this.cs, t, 0.8);
    this.exb.opacity = (0.3 + 0.7 * eo(seg(t, 12.8, 13.2))).toFixed(3);
    [13.0, 13.6, 14.6].forEach((a, i) => { this.ex[i].opacity = eo(seg(t, a, a + 0.5)).toFixed(3); });
    const sp = seg(t, 20.3, 20.8);
    this.st.opacity = eo(sp).toFixed(3);
    this.st.transform = 'rotate(' + lerp(-10, -4, eob(sp, 1.6)).toFixed(2) + 'deg) scale(' + lerp(1.4, 1, eob(sp, 1.4)).toFixed(4) + ')';
    this.tutor.render(t);
  },
});
