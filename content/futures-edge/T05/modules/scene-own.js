const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const OW_P = (t) => 60000 + 1500 * eio(seg(t, 2.4, 11.0)) + Math.sin(Math.PI * seg(t, 2.4, 11.0)) * Math.sin(t * 6.1) * 120;
kit.scene('own', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const line = (label, cls) => '<div style="display:flex;align-items:baseline;justify-content:space-between;margin:18px 0 0;padding-top:16px;border-top:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + label + '</span><span class="mono ' + cls + '" style="font-size:40px"></span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1000px"><p class="kick ow-k">Two different things</p>' +
      '<h2 class="line ow-t">Owning vs a position</h2></div>' +
      '<div class="glass ow-pr" style="left:1100px;top:186px;width:500px;padding:18px 28px;display:flex;align-items:baseline;justify-content:space-between"><span class="fict" style="margin:0;white-space:nowrap">BTC price · fictional</span><span class="mono ow-p" style="font-size:40px;color:var(--main)"></span></div>' +
      '<div class="glass ow-a" style="left:140px;top:340px;width:700px;height:420px;padding:28px 34px">' +
      '<p class="kick" style="margin:0">Spot · you own it</p>' +
      '<div style="display:flex;align-items:center;gap:24px;margin-top:18px"><svg width="96" height="96" viewBox="0 0 96 96" style="flex:none"><circle cx="48" cy="48" r="42" stroke-width="5" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main)"/><text x="48" y="58" text-anchor="middle" class="mono" style="fill:var(--second);font-size:26px">BTC</text></svg>' +
      '<p style="margin:0;font-size:32px;font-weight:600">0.01 BTC in your account</p></div>' +
      line('Value now', 'ow-v') +
      '<p class="ow-ad" style="margin:18px 0 0;font-size:28px;line-height:1.4;color:color-mix(in srgb, var(--second) 75%, var(--ground))">If the price drops, you still hold the coins.</p></div>' +
      '<div class="glass ow-b" style="left:880px;top:340px;width:720px;height:420px;padding:28px 34px">' +
      '<p class="kick" style="margin:0;color:var(--accent)">Futures · a position</p>' +
      '<div style="display:flex;align-items:center;gap:24px;margin-top:18px"><svg width="96" height="96" viewBox="0 0 96 96" style="flex:none"><path d="M22 8 H62 L78 24 V88 H22 Z" stroke-width="4" style="fill:color-mix(in srgb, var(--ground) 76%, var(--accent));stroke:var(--accent)"/><path d="M32 40 H68 M32 54 H68 M32 68 H54" stroke-width="5" stroke-linecap="round" style="stroke:var(--second);opacity:.7"/></svg>' +
      '<p style="margin:0;font-size:32px;font-weight:600;line-height:1.3">Contract: long 0.01 BTC<br><span style="font-size:26px;font-weight:500;color:color-mix(in srgb, var(--second) 65%, var(--ground))">entry 60,000 · coins owned: 0</span></p></div>' +
      line('Profit / loss now', 'ow-pl') +
      '<p class="ow-bd" style="margin:18px 0 0;font-size:28px;line-height:1.4">A <b class="hv">futures contract</b> is an agreement about an asset\'s price.</p>' +
      '<p class="ow-bd2" style="margin:8px 0 0;font-size:28px;line-height:1.4">Your <b class="hl">position</b> gains or loses as the price moves.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ow-k').style; this.t = q('.ow-t'); this.pr = q('.ow-pr').style; this.p = q('.ow-p');
    this.a = q('.ow-a').style; this.b = q('.ow-b').style; this.v = q('.ow-v'); this.pl = q('.ow-pl');
    this.ad = q('.ow-ad'); this.bd = q('.ow-bd'); this.bd2 = q('.ow-bd2');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'present' }, { t: 6.8, pose: 'read' }, { t: 13.1, pose: 'explain' }],
      says: [{ t0: 17.0, t1: 20.6, text: 'No coins!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.pr.opacity = eo(seg(t, 1.6, 2.1));
    const P = Math.round(OW_P(t) / 10) * 10, pt = UI.fmt(P);
    if (this.p.textContent !== pt) this.p.textContent = pt;
    const ap = seg(t, 0.6, 1.3), bp = seg(t, 6.6, 7.3);
    this.a.opacity = eo(ap); this.a.transform = 'translateY(' + lerp(30, 0, eo(ap)).toFixed(1) + 'px)';
    this.b.opacity = eo(bp); this.b.transform = 'translateY(' + lerp(30, 0, eo(bp)).toFixed(1) + 'px)';
    const vt = UI.fmt(P * 0.01, 2) + ' USDT';
    if (this.v.textContent !== vt) this.v.textContent = vt;
    const pl = (P - 60000) * 0.01, plt = UI.sgn(pl, 2) + ' USDT';
    if (this.pl.textContent !== plt) this.pl.textContent = plt;
    this.pl.style.color = pl > 0.004 ? 'var(--main)' : pl < -0.004 ? 'var(--accent)' : 'var(--second)';
    TextFx.fadeFromRight(this.ad, t, 3.0, { stagger: 0.06 });
    TextFx.fadeFromRight(this.bd, t, 7.6, { stagger: 0.06 });
    TextFx.fadeFromRight(this.bd2, t, 13.3, { stagger: 0.06 });
    this.tutor.render(t);
  },
});
