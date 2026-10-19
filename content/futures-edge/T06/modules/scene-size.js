const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('size', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const lab = 'font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:780px"><p class="kick sz-k">How much</p>' +
      '<h2 class="line sz-t">Quantity and notional value</h2>' +
      '<p class="def sz-d1"><b>Quantity:</b> how much of the asset you trade, like 0.05 BTC.</p>' +
      '<p class="def sz-d2"><b>Notional value:</b> quantity × price. The full value of the trade.</p></div>' +
      '<div class="glass sz-p" style="left:1000px;top:190px;width:600px;padding:28px 36px">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="' + lab + '">Quantity</span><span class="mono sz-q" style="font-size:48px;color:var(--main)"></span></div>' +
      '<div style="position:relative;height:10px;margin:22px 0 30px;border-radius:5px;background:color-mix(in srgb, var(--second) 12%, transparent)"><i class="sz-tr" style="position:absolute;left:0;top:0;bottom:0;border-radius:5px;background:var(--main)"></i><span class="sz-kn" style="position:absolute;top:-11px;width:32px;height:32px;margin-left:-16px;border-radius:50%;background:var(--second)"></span></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="' + lab + '">Price</span><span class="mono" style="font-size:36px">60,000 USDT</span></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:22px;padding-top:20px;border-top:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:28px;font-weight:700">Notional</span><span class="mono sz-n" style="font-size:44px"></span></div>' +
      '<div style="height:22px;margin-top:14px;border-radius:11px;background:color-mix(in srgb, var(--second) 8%, transparent)"><i class="sz-b" style="display:block;height:100%;border-radius:11px;background:linear-gradient(90deg, var(--main), var(--accent))"></i></div>' +
      '<p class="fict" style="margin:14px 0 0">Fictional example</p></div>' +
      '<div class="glass sz-an" style="left:1000px;top:640px;width:600px;padding:22px 30px;display:flex;align-items:center;gap:24px">' +
      '<svg width="80" height="80" viewBox="0 0 80 80" style="flex:none"><path d="M40 10 Q46 22 58 28 Q72 40 64 58 Q54 74 40 74 Q26 74 16 58 Q8 40 22 28 Q34 22 40 10 Z" style="fill:color-mix(in srgb, #c0587a 70%, var(--ground));stroke:#d77fa0;stroke-width:3"/><path d="M40 4 V16" style="stroke:#7fbf6a;stroke-width:4;stroke-linecap:round"/></svg>' +
      '<p style="margin:0;font-size:30px;line-height:1.35;font-weight:600">3 kg of onions × 40 per kg = a bill of <span class="hl">120</span></p></div>' +
      '<div class="glass sz-mv" style="left:1000px;top:640px;width:600px;padding:22px 30px"><p class="kick" style="margin:0 0 8px">Each 100 USDT price move</p>' +
      '<p class="mono" style="margin:0;font-size:32px">100 × 0.05 = <span class="hl">5 USDT</span> for you</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sz-k').style; this.t = q('.sz-t'); this.d1 = q('.sz-d1'); this.d2 = q('.sz-d2'); this.p = q('.sz-p').style;
    this.q = q('.sz-q'); this.tr = q('.sz-tr').style; this.kn = q('.sz-kn').style; this.n = q('.sz-n'); this.b = q('.sz-b').style;
    this.an = q('.sz-an').style; this.mv = q('.sz-mv').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 6.5, pose: 'writing' }, { t: 12.2, pose: 'idea' }, { t: 18.6, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d1, t, 1.0, { stagger: 0.05 });
    TextFx.fadeFromRight(this.d2, t, 6.5, { stagger: 0.05 });
    const pp = seg(t, 0.6, 1.3);
    this.p.opacity = eo(pp); this.p.transform = 'translateY(' + lerp(30, 0, eo(pp)).toFixed(1) + 'px)';
    // The quantity steps up 0.01 -> 0.05 BTC; the notional value follows.
    const steps = Math.min(4, Math.floor(seg(t, 2.2, 10.0) * 5));
    const qty = 0.01 + 0.01 * steps, kp = (qty - 0.01) / 0.04;
    const qt = qty.toFixed(2) + ' BTC';
    if (this.q.textContent !== qt) this.q.textContent = qt;
    const sm = lerp(0, 1, kp);
    this.tr.width = (sm * 100).toFixed(1) + '%'; this.kn.left = (sm * 100).toFixed(1) + '%';
    const nt = UI.fmt(qty * 60000) + ' USDT';
    if (this.n.textContent !== nt) this.n.textContent = nt;
    this.b.width = (qty / 0.05 * 100).toFixed(1) + '%';
    this.n.style.color = t > 6.5 ? 'var(--main)' : 'var(--second)';
    const ai = seg(t, 12.2, 12.8), ao = seg(t, 18.2, 18.6), mi = seg(t, 18.6, 19.2);
    this.an.opacity = eo(ai) * (1 - ei(ao)); this.an.transform = 'translateY(' + lerp(30, 0, eo(ai)).toFixed(1) + 'px)';
    this.mv.opacity = eo(mi); this.mv.transform = 'translateY(' + lerp(30, 0, eo(mi)).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
