const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const fld = (y, label, val) => '<div style="position:absolute;left:36px;right:36px;top:' + y + 'px"><p style="margin:0 0 6px;font-size:24px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">' + label + '</p><div class="mono" style="height:54px;border-radius:12px;display:flex;align-items:center;padding:0 18px;font-size:28px;border:1.5px solid color-mix(in srgb, var(--second) 16%, transparent)">' + val + '</div></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:800px"><p class="kick mk-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line mk-t">No coin to withdraw</h2>' +
      '<p class="def mk-d">Correction: futures give <b>price exposure</b>. Spot gives <b>ownership</b>.</p></div>' +
      '<div class="chip mk-th" style="position:absolute;left:1380px;top:150px;font-size:26px;padding:8px 22px">Rahul thinks: “I own 0.010 BTC”</div>' +
      '<div class="glass mk-f" style="left:1040px;top:210px;width:680px;height:520px">' +
      '<p style="position:absolute;left:36px;top:28px;margin:0;font-size:32px;font-weight:700">Withdraw BTC</p><span class="fict" style="position:absolute;right:36px;top:40px">Educational mock</span>' +
      fld(96, 'From', 'Futures account') + fld(196, 'Amount', '0.010 BTC') +
      '<div class="mk-btn" style="position:absolute;left:36px;right:36px;top:304px;height:60px;border-radius:14px;display:grid;place-items:center;font-size:28px;font-weight:700;background:var(--main);color:var(--ground)">Withdraw</div>' +
      '<div class="mk-err" style="position:absolute;left:36px;right:36px;top:384px;padding:16px 20px;border-radius:14px;border:2px solid var(--accent);background:color-mix(in srgb, var(--ground) 80%, var(--accent))"><p style="margin:0;font-size:28px;font-weight:700">0 BTC available</p><p style="margin:4px 0 0;font-size:24px">A futures position holds no coins.</p></div></div>' +
      '<div class="mk-x" style="position:absolute;left:1380px;top:176px;width:420px;height:5px;margin-left:-210px;border-radius:4px;background:var(--accent)"></div>' +
      '<div class="mk-tap" style="position:absolute;left:1380px;top:544px;width:80px;height:80px;margin:-40px 0 0 -40px;border-radius:50%;border:5px solid var(--second);box-sizing:border-box"></div>' +
      '<div class="mk-cs" style="position:absolute;left:140px;top:600px;display:flex;flex-direction:column;gap:14px">' +
      '<span class="chip mk-c1" style="font-size:28px;padding:10px 24px;border-color:var(--accent)"><span class="hv">Futures</span> → price exposure</span>' +
      '<span class="chip mk-c2" style="font-size:28px;padding:10px 24px;border-color:var(--main)"><span class="hl">Spot</span> → ownership</span></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.d = q('.mk-d'); this.th = q('.mk-th').style; this.f = q('.mk-f').style;
    this.btn = q('.mk-btn').style; this.err = q('.mk-err').style; this.x = q('.mk-x').style; this.tap = q('.mk-tap').style;
    this.c1 = q('.mk-c1').style; this.c2 = q('.mk-c2').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'think' }, { t: 6.6, pose: 'confused' }, { t: 11.7, pose: 'explain' }, { t: 14.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.show(this.f, t, 0.8);
    const th = seg(t, 1.4, 1.9);
    this.th.opacity = (eo(th) * (1 - 0.5 * eo(seg(t, 8.4, 9.0)))).toFixed(3);
    this.th.transform = 'translate(-50%,0) scale(' + lerp(0.8, 1, eob(th, 1.6)).toFixed(4) + ')';
    this.x.transformOrigin = '0 50%'; this.x.transform = 'scaleX(' + eo(seg(t, 8.4, 9.0)).toFixed(3) + ')';
    const tp = seg(t, 6.4, 7.1);
    this.tap.opacity = (Math.sin(Math.PI * tp)).toFixed(3);
    this.tap.transform = 'scale(' + lerp(0.5, 1.3, eo(tp)).toFixed(3) + ')';
    this.btn.transform = 'scale(' + (1 - 0.05 * Math.sin(Math.PI * tp)).toFixed(4) + ')';
    const e = seg(t, 7.0, 7.5);
    this.err.opacity = eo(e).toFixed(3);
    this.err.transform = 'translateX(' + (Math.sin(seg(t, 7.0, 7.8) * Math.PI * 6) * 10 * (1 - seg(t, 7.0, 7.8))).toFixed(1) + 'px)';
    TextFx.fadeFromRight(this.d, t, 11.9, { stagger: 0.06 });
    [[this.c1, 12.8], [this.c2, 13.6]].forEach(([s, a]) => { const p = seg(t, a, a + 0.5); s.opacity = eo(p); s.transform = 'translateX(' + lerp(24, 0, eo(p)).toFixed(1) + 'px)'; });
    this.tutor.render(t);
  },
});
