const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('perp', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:780px"><p class="kick pp-k" style="color:var(--accent)">Perpetual futures</p>' +
      '<h2 class="line pp-t">No end date</h2>' +
      '<p class="def pp-d">A <b>perpetual</b> contract has no expiry date. It stays open until you close it, or until it is closed for you.</p></div>' +
      '<div class="glass pp-dated" style="left:1000px;top:180px;width:780px;height:200px;padding:24px 32px">' +
      '<p class="kick" style="margin:0;color:color-mix(in srgb, var(--second) 60%, var(--ground))">Dated futures</p>' +
      '<div style="position:absolute;left:32px;top:76px;width:96px;height:96px;border-radius:14px;border:3px solid var(--second);overflow:hidden;text-align:center"><div style="height:26px;background:var(--accent)"></div><span class="mono" style="font-size:38px;line-height:62px">31</span></div>' +
      '<p style="position:absolute;left:160px;top:80px;margin:0;font-size:30px;font-weight:600">Expires on 31 March</p>' +
      '<p style="position:absolute;left:160px;top:126px;margin:0;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Days left: <span class="mono pp-days"></span></p>' +
      '<span class="chip pp-exp" style="position:absolute;right:30px;top:96px;font-size:26px;padding:8px 20px;border-color:var(--accent)">Expired · settled</span></div>' +
      '<div class="glass pp-perp" style="left:1000px;top:410px;width:780px;height:200px;padding:24px 32px;border-color:color-mix(in srgb, var(--main) 50%, transparent)">' +
      '<p class="kick" style="margin:0">Perpetual</p>' +
      '<span style="position:absolute;left:30px;top:66px;font-size:96px;line-height:1;color:var(--main)">∞</span>' +
      '<p style="position:absolute;left:160px;top:80px;margin:0;font-size:30px;font-weight:600">No expiry date</p>' +
      '<p style="position:absolute;left:160px;top:126px;margin:0;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Open for: <span class="mono pp-open"></span></p>' +
      '<span class="chip pp-close" style="position:absolute;right:30px;top:96px;font-size:26px;padding:8px 20px">Close</span></div>' +
      '<div class="glass pp-set" style="left:1000px;top:640px;width:780px;padding:18px 32px;display:flex;align-items:center;justify-content:space-between;border-color:var(--main)">' +
      '<span style="font-size:28px;font-weight:600">Settled in USDT, e.g.</span><span class="mono" style="font-size:34px;color:var(--main)">+30.00 USDT</span><span style="font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">no coins</span></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.pp-k').style; this.t = q('.pp-t'); this.d = q('.pp-d');
    this.dated = q('.pp-dated').style; this.perp = q('.pp-perp').style; this.set = q('.pp-set').style;
    this.days = q('.pp-days'); this.open = q('.pp-open'); this.exp = q('.pp-exp').style; this.close = q('.pp-close').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'present' }, { t: 6.2, pose: 'think' }, { t: 12.5, pose: 'explain' }, { t: 16.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.2, { stagger: 0.05 });
    UI.show(this.perp, t, 1.6);
    UI.show(this.dated, t, 6.2);
    const dl = Math.max(0, 3 - Math.floor(Math.max(0, t - 7.0) / 0.8));
    UI.set(this.days, String(dl));
    const e = seg(t, 9.6, 10.1);
    this.exp.opacity = eo(e).toFixed(3); this.exp.transform = 'scale(' + lerp(1.3, 1, eob(e, 1.5)).toFixed(4) + ')';
    this.dated.filter = t > 10.1 ? 'saturate(' + (1 - 0.6 * eo(seg(t, 10.1, 10.8))).toFixed(3) + ')' : 'none';
    const days = Math.floor(Math.max(0, t - 1.6) / 0.7) + 1;
    UI.set(this.open, t >= 13.4 ? 'closed' : days + (days === 1 ? ' day' : ' days'));
    const c = seg(t, 12.9, 13.4);
    this.close.background = c > 0 ? 'color-mix(in srgb, var(--main) ' + (60 * Math.sin(Math.PI * c) + (t > 13.4 ? 30 : 0)).toFixed(0) + '%, var(--ground))' : '';
    this.close.transform = 'scale(' + (1 - 0.08 * Math.sin(Math.PI * c)).toFixed(4) + ')';
    UI.show(this.set, t, 13.6, null, -30);
    this.tutor.render(t);
  },
});
