const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (cls, name, col, role, act, val) => '<div class="glass ' + cls + '" style="left:1000px;width:780px;padding:26px 32px;display:flex;flex-direction:column;gap:16px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between">' + UI.person(name, col, '') + '<span class="chip ' + cls + '-r" style="font-size:26px;padding:8px 20px;border-color:' + col + ';color:' + col + '">' + role + '</span></div>' +
      '<p style="margin:0;font-size:30px;font-weight:600">' + act + '</p>' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:28px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + val + '</span><span class="mono ' + cls + '-v" style="font-size:40px"></span></div></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:780px"><p class="kick hk-k">Two traders</p>' +
      '<h2 class="line hk-t">Same idea, two ways</h2>' +
      '<p class="sub hk-s">Both gain if BTC rises. So what is the difference?</p></div>' +
      card('hk-a', 'Asha', 'var(--main)', 'Spot', 'Buys 0.010 BTC at 60,000 USDT', 'Her BTC is worth') +
      card('hk-b', 'Rahul', 'var(--accent)', 'Futures · long', 'Opens a long for 0.010 BTC at 60,000', 'His PnL') +
      '<div class="chip hk-p" style="position:absolute;left:140px;top:640px;font-size:28px;padding:10px 26px"><span class="mono">BTC <span class="hk-pv"></span> USDT</span></div>' +
      '<p class="fict hk-f" style="position:absolute;left:1000px;top:730px;margin:0">Fictional prices · before fees</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.s = q('.hk-s'); this.f = q('.hk-f').style;
    this.a = q('.hk-a').style; this.b = q('.hk-b').style; this.ar = q('.hk-a-r').style; this.br = q('.hk-b-r').style;
    this.av = q('.hk-a-v'); this.bv = q('.hk-b-v'); this.p = q('.hk-p').style; this.pv = q('.hk-pv');
    this.a.top = '190px'; this.b.top = '470px';
    this.price = UI.path([[0, 60000], [11.6, 60000], [13.2, 61000], [20, 61000]]);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'explain' }, { t: 6.6, pose: 'point', flip: true }, { t: 11.2, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 11.4, { stagger: 0.06 });
    UI.show(this.a, t, 1.0); UI.show(this.b, t, 1.6);
    [[this.ar, 6.8], [this.br, 8.2]].forEach(([s, a]) => { const p = seg(t, a, a + 0.4); s.opacity = eo(p); s.transform = 'scale(' + lerp(0.7, 1, eob(p, 1.7)).toFixed(4) + ')'; });
    const pr = this.price(t);
    UI.show(this.p, t, 2.0);
    UI.set(this.pv, UI.fmt(Math.round(pr)));
    UI.set(this.av, UI.fmt(pr * 0.01, 2) + ' USDT');
    const pnl = (pr - 60000) * 0.01;
    UI.set(this.bv, UI.sgn(pnl, 2) + ' USDT');
    this.av.style.color = this.bv.style.color = pnl > 0.004 ? 'var(--main)' : 'var(--second)';
    this.f.opacity = 0.9 * eo(seg(t, 2.4, 3.0));
    this.tutor.render(t);
  },
});
