const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MS_P = (t) => 60000 - 5000 * eio(seg(t, 8.0, 21.0));
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const kv = (label, cls, extra) => '<div style="display:flex;align-items:baseline;justify-content:space-between;padding:12px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + label + '</span><span class="mono ' + cls + '" style="font-size:34px;' + (extra || '') + '"></span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1150px"><p class="kick ms-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line ms-t">Spot buy vs margin long</h2></div>' +
      '<div class="glass ms-pr" style="left:1260px;top:186px;width:340px;padding:16px 26px"><p class="fict" style="margin:0">BTC price · fictional</p><p class="mono ms-p" style="margin:4px 0 0;font-size:40px;color:var(--accent)"></p></div>' +
      '<div class="glass ms-a" style="left:140px;top:320px;width:700px;height:350px;padding:24px 32px">' +
      '<p class="kick" style="margin:0 0 6px">Spot buy</p>' + kv('You paid', 'ms-a1') + kv('You own', 'ms-a2') + kv('Value now', 'ms-a3') +
      '<p class="ms-an" style="margin:16px 0 0;font-size:28px;font-weight:600;line-height:1.35">Price falls? <span class="hl">The coins are still yours.</span></p></div>' +
      '<div class="glass ms-b" style="left:880px;top:320px;width:720px;height:350px;padding:24px 32px">' +
      '<p class="kick" style="margin:0 0 6px;color:var(--accent)">Futures long with margin</p>' + kv('Margin (your deposit)', 'ms-b1') + kv('Position size', 'ms-b2') +
      '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:14px"><span style="font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Margin left</span><span class="mono ms-b3" style="font-size:34px"></span></div>' +
      '<div style="position:relative;height:22px;margin-top:10px;border-radius:11px;background:color-mix(in srgb, var(--second) 9%, transparent)"><i class="ms-bar" style="position:absolute;left:0;top:0;bottom:0;border-radius:11px"></i></div>' +
      '<p class="ms-lev" style="margin:12px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">10 × your deposit: that is leverage (Phase 3)</p></div>' +
      '<div class="ms-stamp" style="position:absolute;left:912px;top:606px;padding:6px 18px;border:3px solid var(--accent);border-radius:12px;font-family:var(--mono, monospace);font-size:24px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);background:color-mix(in srgb, var(--ground) 80%, var(--accent))">Liquidation: position closed</div>' +
      '<div class="glass ms-c" style="left:140px;top:694px;width:1460px;padding:18px 32px;display:flex;align-items:center;gap:24px"><span class="kick" style="color:var(--accent);flex:none">Also wrong</span>' +
      '<p style="margin:0;font-size:30px;font-weight:600">Selling coins you own is not shorting. A short is a <span class="hl">new position</span>.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ms-k').style; this.t = q('.ms-t'); this.pr = q('.ms-pr').style; this.p = q('.ms-p');
    this.a = q('.ms-a').style; this.b = q('.ms-b').style; this.an = q('.ms-an'); this.lev = q('.ms-lev');
    this.a1 = q('.ms-a1'); this.a2 = q('.ms-a2'); this.a3 = q('.ms-a3'); this.b1 = q('.ms-b1'); this.b2 = q('.ms-b2'); this.b3 = q('.ms-b3'); this.bar = q('.ms-bar').style;
    this.stamp = q('.ms-stamp').style; this.c = q('.ms-c').style;
    this.a1.textContent = '600 USDT'; this.a2.textContent = '0.01 BTC'; this.b1.textContent = '60 USDT'; this.b2.textContent = '0.01 BTC = 600 USDT';
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 6.4, pose: 'explain' }, { t: 13.6, pose: 'magnify' }, { t: 20.3, pose: 'think' }, { t: 26.8, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const P = MS_P(t), Pr = Math.round(P / 10) * 10;
    const pt = UI.fmt(Pr);
    if (this.p.textContent !== pt) this.p.textContent = pt;
    this.pr.opacity = eo(seg(t, 6.0, 6.5));
    const ap = seg(t, 6.2, 6.9), bp = seg(t, 13.4, 14.1);
    this.a.opacity = eo(ap); this.a.transform = 'translateY(' + lerp(30, 0, eo(ap)).toFixed(1) + 'px)';
    this.b.opacity = eo(bp); this.b.transform = 'translateY(' + lerp(30, 0, eo(bp)).toFixed(1) + 'px)';
    const v = UI.fmt(Pr * 0.01, 2) + ' USDT';
    if (this.a3.textContent !== v) this.a3.textContent = v;
    TextFx.fadeFromRight(this.an, t, 10.0, { stagger: 0.06 });
    const left = Math.max(0, 60 - (60000 - Pr) * 0.01), lt = UI.fmt(left, 2) + ' USDT';
    if (this.b3.textContent !== lt) this.b3.textContent = lt;
    const danger = left < 20;
    this.b3.style.color = danger ? 'var(--accent)' : 'var(--second)';
    this.bar.width = (left / 60 * 100).toFixed(2) + '%';
    this.bar.background = danger ? 'var(--accent)' : 'var(--main)';
    TextFx.fadeFromRight(this.lev, t, 15.4, { stagger: 0.05 });
    this.lev.style.opacity = 1 - eo(seg(t, 20.2, 20.5));
    const sp = seg(t, 20.6, 21.0);
    this.stamp.opacity = eo(sp);
    this.stamp.transformOrigin = '0 50%'; this.stamp.transform = 'rotate(-2deg) scale(' + lerp(1.4, 1, eo(sp)).toFixed(4) + ')';
    const cp = seg(t, 26.8, 27.4);
    this.c.opacity = eo(cp); this.c.transform = 'translateY(' + lerp(24, 0, eo(cp)).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
