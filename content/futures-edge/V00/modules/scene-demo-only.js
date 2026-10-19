const { seg, eo, ei, eio, eob, lerp, TextFx } = kit;
const DEMO_RULES = ['No live trading and no real money.', 'No exchange connection. We never ask for passwords, OTP codes or API keys.', 'Every price you see is fictional and labelled.'];
kit.scene('demo-only', {
  init(kit) {
    let rules = '';
    DEMO_RULES.forEach((r) => { rules += '<div class="demo-rule" style="display:flex;gap:22px;align-items:flex-start"><span class="dot" style="margin-top:16px"></span><p class="sub" style="margin:0;color:var(--second)">' + r + '</p></div>'; });
    const row = (a, b, cls) => '<div style="display:flex;justify-content:space-between;align-items:center;padding:20px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + a + '</span><span class="mono ' + cls + '" style="font-size:30px">' + b + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:860px;gap:30px"><p class="kick demo-k">Before we start</p><h2 class="line demo-t">Education and demo only.</h2>' +
      '<div style="display:flex;flex-direction:column;gap:26px;margin-top:10px">' + rules + '</div></div>' +
      '<div class="glass demo-panel" style="left:1120px;top:140px;width:640px;padding:36px 44px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:30px;font-weight:700">Order panel</span><span class="fict">Fictional prices</span></div>' +
      row('Pair', 'BTC/USDT', '') + row('Price (USDT)', '64,250.0', 'demo-price') + row('Size', '0.010 BTC', '') +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:26px 0"><span style="font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Mode</span>' +
      '<span style="display:flex;align-items:center;gap:16px"><span class="demo-ml" style="font-size:26px;font-weight:700">Live</span><span class="demo-sw" style="position:relative;width:84px;height:44px;border-radius:999px"><span class="demo-kn" style="position:absolute;top:6px;left:6px;width:32px;height:32px;border-radius:50%;background:var(--second)"></span></span><span class="demo-mr" style="font-size:26px;font-weight:700">Demo</span></span></div>' +
      '<div style="position:relative;height:92px"><div class="demo-b1" style="position:absolute;inset:0;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;border:2px solid color-mix(in srgb, var(--second) 30%, transparent)">Place live order</div>' +
      '<div class="demo-x" style="position:absolute;left:40px;right:40px;top:44px;height:4px;border-radius:4px;background:var(--accent)"></div>' +
      '<div class="demo-b2" style="position:absolute;inset:0;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;background:var(--main);color:var(--ground)">Practice order (demo)</div></div>' +
      '<p class="fict demo-note" style="margin:22px 0 0;text-align:center;color:var(--accent)">Live trading is not part of this course</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.demo-k').style; this.title = q('.demo-t');
    this.rules = [...kit.stage.querySelectorAll('.demo-rule')].map((e) => e.style);
    this.panel = q('.demo-panel').style; this.price = q('.demo-price');
    this.sw = q('.demo-sw').style; this.kn = q('.demo-kn').style; this.ml = q('.demo-ml').style; this.mr = q('.demo-mr').style;
    this.b1 = q('.demo-b1').style; this.b2 = q('.demo-b2').style; this.x = q('.demo-x').style; this.note = q('.demo-note').style;
    const r = kit.rng(5); this.prices = []; let p = 64250;
    for (let i = 0; i < 40; i++) { p += Math.round((r() - 0.5) * 60) * 0.5; this.prices.push(p); }
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idle' }, { t: 1.4, pose: 'point', flip: true }, { t: 3.9, pose: 'thumbs' }, { t: 5.4, pose: 'checklist' }, { t: 12.2, pose: 'explain' }],
      says: [{ t0: 12.4, t1: 15.8, text: 'Practise first. Real money is never needed here.' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.title, t, 0.1);
    const pp = seg(t, 0.8, 1.7);
    this.panel.opacity = eo(pp);
    this.panel.transform = 'translateX(' + lerp(60, 0, eo(pp)) + 'px) translateY(' + (-t * 1.2).toFixed(2) + 'px)';
    const i = Math.max(0, Math.min(39, Math.floor(t * 2)));
    const txt = this.prices[i].toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (this.price.textContent !== txt) this.price.textContent = txt;
    const s = eio(seg(t, 3.2, 3.7));
    this.kn.transform = 'translateX(' + lerp(0, 40, s) + 'px)';
    this.sw.background = s < 0.5 ? 'color-mix(in srgb, var(--second) 25%, transparent)' : 'var(--main)';
    this.ml.opacity = lerp(1, 0.4, s); this.mr.opacity = lerp(0.4, 1, s);
    this.x.transformOrigin = '0 50%';
    this.x.transform = 'scaleX(' + eo(seg(t, 2.4, 2.9)) + ')';
    const b = seg(t, 3.8, 4.3);
    this.b1.opacity = 1 - ei(b); this.x.opacity = 1 - ei(b);
    this.b2.opacity = eo(b);
    this.b2.transform = 'scale(' + lerp(0.94, 1, eob(b, 1.6)) + ')';
    this.note.opacity = eo(seg(t, 4.4, 4.9));
    this.rules.forEach((r, k) => {
      const a = 5.4 + k * 2.2;
      r.opacity = eo(seg(t, a, a + 0.5));
      r.transform = 'translateX(' + lerp(28, 0, eo(seg(t, a, a + 0.6))) + 'px)';
    });
    this.tutor.render(t);
  },
});
