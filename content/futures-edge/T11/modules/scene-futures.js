const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const FU_ROWS = [['Underlying', 'BTC'], ['Side', 'Long'], ['Size', '0.010 BTC'], ['Entry price', '60,000 USDT']];
kit.scene('futures', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    FU_ROWS.forEach((r) => { rows += '<div class="fu-r" style="display:flex;justify-content:space-between;align-items:baseline;padding:8px 14px;margin:0 -14px;border-radius:12px;border-bottom:1.5px solid color-mix(in srgb, var(--second) 8%, transparent)"><span style="font-size:28px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + r[0] + '</span><span class="mono fu-v" style="font-size:32px">' + r[1] + '</span></div>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:780px"><p class="kick fu-k" style="color:var(--accent)">Futures</p>' +
      '<h2 class="line fu-t">A deal about a price</h2>' +
      '<p class="def fu-d">A <b>futures contract</b> is an agreement about the price of an asset, not the asset itself. The asset it follows is the <b>underlying</b>.</p></div>' +
      '<div class="glass fu-doc" style="left:1000px;top:180px;width:780px;padding:24px 34px;display:flex;flex-direction:column;gap:6px;border-color:color-mix(in srgb, var(--accent) 55%, transparent)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-size:32px;font-weight:700">Futures contract</span><span class="fict">Educational mock</span></div>' + rows + '</div>' +
      '</div>'));
    this.w = UI.wallet(kit, 1000, 540, 780, 'Rahul’s wallet · fictional', [['USDT', 'fu-u'], ['BTC', 'fu-b']]);
    kit.stage.append(kit.h('<span class="chip fu-no" style="position:absolute;left:1290px;top:676px;font-size:26px;padding:6px 18px;background:var(--accent);border-color:var(--accent)">No BTC arrives</span>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.fu-k').style; this.t = q('.fu-t'); this.d = q('.fu-d'); this.doc = q('.fu-doc').style; this.no = q('.fu-no').style;
    this.rows = all('.fu-r').map((e) => e.style); this.vals = all('.fu-v').map((e) => e.style);
    this.ws = this.w.el.style; this.u = this.w.val('fu-u'); this.b = this.w.val('fu-b'); this.bRow = this.w.row('fu-b');
    UI.set(this.u, '1,000.00'); UI.set(this.b, '0.000');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 7.6, pose: 'point', flip: true }, { t: 13.4, pose: 'magnify' }, { t: 17.2, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.4, { stagger: 0.04 });
    UI.show(this.doc, t, 2.4);
    // Rows: the underlying at 7.8; the rest when Rahul opens his position.
    const at = [7.9, 13.8, 14.3, 14.8];
    this.rows.forEach((s, i) => {
      this.vals[i].opacity = eo(seg(t, at[i], at[i] + 0.4)).toFixed(3);
      const h = i === 0 ? Math.max(Math.sin(Math.PI * seg(t, 7.9, 9.4)) * 0.9, t > 9.4 ? 0.35 : 0) : 0;
      s.background = 'color-mix(in srgb, var(--accent) ' + (h * 26).toFixed(1) + '%, transparent)';
    });
    UI.show(this.ws, t, 15.2);
    const n = seg(t, 16.2, 16.6);
    this.no.opacity = eo(n).toFixed(3);
    this.no.transform = 'translate(-50%,0) rotate(-3deg) scale(' + lerp(1.4, 1, eob(n, 1.5)).toFixed(4) + ')';
    this.bRow.background = 'color-mix(in srgb, var(--accent) ' + (18 * Math.sin(Math.PI * seg(t, 16.2, 17.4))).toFixed(1) + '%, transparent)';
    this.tutor.render(t);
  },
});
