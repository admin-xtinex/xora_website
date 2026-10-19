const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('wallet', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass wl-phone" style="left:1000px;top:190px;width:270px;height:470px;border-radius:44px"><div style="width:80px;height:7px;border-radius:7px;margin:26px auto 0;background:color-mix(in srgb, var(--second) 18%, transparent)"></div>' +
      '<p style="margin:20px 0 0;text-align:center;font-size:24px;font-weight:700">My wallet</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<line class="wl-link" x1="1180" y1="420" x2="1400" y2="420" pathLength="1" stroke-width="4" stroke-linecap="round" style="stroke:var(--main)"/>' +
      '<g class="wl-coin"><circle cx="1135" cy="420" r="70" stroke-width="6" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main)"/><text x="1135" y="432" text-anchor="middle" class="mono" style="fill:var(--second);font-size:34px">BTC</text></g>' +
      '<g class="wl-x" stroke-width="10" stroke-linecap="round" style="stroke:var(--accent)"><line x1="1075" y1="360" x2="1195" y2="480"/><line x1="1195" y1="360" x2="1075" y2="480"/></g>' +
      '<g class="wl-key" fill="none" stroke-width="10" stroke-linecap="round" style="stroke:var(--main)"><circle cx="1105" cy="420" r="30"/><line x1="1135" y1="420" x2="1185" y2="420"/><line x1="1165" y1="420" x2="1165" y2="442"/><line x1="1182" y1="420" x2="1182" y2="436"/></g></svg>' +
      '<div class="glass wl-book" style="left:1400px;top:330px;width:330px;padding:22px 26px;display:flex;flex-direction:column;gap:10px"><p class="kick" style="margin:0;font-size:18px">Blockchain record</p>' +
      '<div class="mono" style="font-size:22px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">Ben · 0.150 BTC</div><div class="mono wl-me" style="font-size:22px">You · 0.002 BTC</div><div class="mono" style="font-size:22px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">Cai · 1.300 BTC</div></div>' +
      '<div class="words" style="left:140px;top:200px;width:780px"><p class="kick wl-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line wl-t">There is no coin inside your phone</h2>' +
      '<p class="def wl-d">A <b>wallet</b> holds the keys that prove you control your crypto. The coins are entries on the blockchain.</p>' +
      '<p class="sub wl-s">On an exchange, the exchange holds the keys for you.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.wl-k').style; this.t = q('.wl-t'); this.d = q('.wl-d'); this.s = q('.wl-s');
    this.phone = q('.wl-phone').style; this.coin = q('.wl-coin').style; this.x = q('.wl-x'); this.key = q('.wl-key').style;
    this.link = q('.wl-link'); this.book = q('.wl-book').style; this.me = q('.wl-me').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 1.2, pose: 'confused' }, { t: 5.6, pose: 'explain' }, { t: 11.2, pose: 'think' }],
      says: [{ t0: 11.4, t1: 15.6, text: 'Lose the keys, and you can lose access.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const ph = seg(t, 0.6, 1.4);
    this.phone.opacity = eo(ph);
    this.phone.transform = 'translateY(' + lerp(40, 0, eo(ph)) + 'px)';
    const c = seg(t, 1.2, 1.8), cx = seg(t, 3.6, 4.2);
    this.coin.opacity = eo(c) * (1 - ei(seg(t, 4.4, 5.0)));
    this.coin.transformBox = 'fill-box'; this.coin.transformOrigin = 'center';
    this.coin.transform = 'scale(' + lerp(0.4, 1, eob(c, 1.7)) * lerp(1, 0.6, ei(seg(t, 4.4, 5.0))) + ')';
    this.x.setAttribute('stroke-dasharray', '170'); this.x.setAttribute('stroke-dashoffset', (170 * (1 - eo(cx))).toFixed(1));
    this.x.style.opacity = 1 - ei(seg(t, 4.4, 5.0));
    const k = seg(t, 5.0, 5.6);
    this.key.opacity = eo(k);
    this.key.transformBox = 'fill-box'; this.key.transformOrigin = 'center';
    this.key.transform = 'rotate(' + lerp(-30, 0, eob(k, 1.6)) + 'deg) scale(' + lerp(0.5, 1, eob(k, 1.7)) + ')';
    const b = seg(t, 5.8, 6.5);
    this.book.opacity = eo(b);
    this.book.transform = 'translateX(' + lerp(40, 0, eo(b)) + 'px)';
    this.link.setAttribute('stroke-dasharray', eio(seg(t, 6.6, 7.4)) + ' 1');
    const m = seg(t, 7.3, 7.8);
    this.me.color = m > 0 ? 'var(--main)' : 'var(--second)';
    this.me.transform = 'scale(' + (1 + 0.06 * Math.sin(Math.PI * m)) + ')';
    this.me.transformOrigin = '0 50%';
    TextFx.fadeFromRight(this.d, t, 7.6, { stagger: 0.05 });
    TextFx.fadeFromRight(this.s, t, 10.6, { stagger: 0.07 });
    this.tutor.render(t);
  },
});
