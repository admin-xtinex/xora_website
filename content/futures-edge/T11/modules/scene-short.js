const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SH_KEYS = [[0, 60000], [6.9, 60000], [8.4, 57000], [9.6, 57000], [11.2, 63000], [30, 63000]];
const shX = (t) => 1080 + Math.min(t, 13) / 13 * 640, shY = (p) => 330 - (p - 60000) / 4000 * 110;
kit.scene('short', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let grid = '';
    [57000, 60000, 63000].forEach((p) => { grid += '<line x1="1080" x2="1730" y1="' + shY(p) + '" y2="' + shY(p) + '" style="stroke:color-mix(in srgb, var(--second) 9%, transparent);stroke-width:1.5"/><text x="1066" y="' + (shY(p) + 8) + '" text-anchor="end" class="mono" style="fill:color-mix(in srgb, var(--second) 55%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:760px"><p class="kick sh-k" style="color:var(--accent)">Going short</p>' +
      '<h2 class="line sh-t">Gain if the price falls</h2>' +
      '<p class="def sh-d">With futures you can go <b>short</b>: you gain if the price falls, and lose if it rises.</p></div>' +
      '<svg class="art sh-ch" viewBox="0 0 1920 1080">' + grid +
      '<line x1="1080" x2="1730" y1="' + shY(60000) + '" y2="' + shY(60000) + '" stroke-dasharray="8 8" style="stroke:var(--accent);stroke-width:2"/>' +
      '<path class="sh-l" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="sh-dot" r="10" style="fill:var(--second)"/>' +
      '<text x="1080" y="190" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price · fictional · entry dashed</text></svg>' +
      '<div class="glass sh-p" style="left:960px;top:480px;width:820px;padding:22px 30px;display:flex;flex-direction:column;gap:8px">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:30px;font-weight:600">Short 0.010 BTC from 60,000</span><span class="mono sh-v" style="font-size:44px"></span></div>' +
      '<p class="mono" style="margin:0;font-size:26px">PnL = (entry − price now) × size</p>' +
      '<p class="mono sh-f" style="margin:0;font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))"></p></div>' +
      '<div class="glass sh-s" style="left:140px;top:600px;width:760px;padding:20px 30px;border-color:var(--main)"><p style="margin:0;font-size:30px;font-weight:600;line-height:1.35">On plain <span class="hl">spot</span>, you can only sell coins you already hold.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sh-k').style; this.t = q('.sh-t'); this.d = q('.sh-d'); this.ch = q('.sh-ch').style; this.l = q('.sh-l'); this.dot = q('.sh-dot');
    this.p = q('.sh-p').style; this.v = q('.sh-v'); this.f = q('.sh-f'); this.s = q('.sh-s').style;
    this.price = UI.path(SH_KEYS);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 6.6, pose: 'magnify' }, { t: 12.1, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.2, { stagger: 0.05 });
    this.ch.opacity = eo(seg(t, 2.6, 3.2));
    UI.show(this.p, t, 3.0);
    let d = ''; const end = Math.min(t, 13);
    for (let s = 0; s <= end + 1e-6; s += 0.1) d += (s ? 'L' : 'M') + shX(s).toFixed(1) + ' ' + shY(this.price(s)).toFixed(1);
    this.l.setAttribute('d', d || 'M1080 ' + shY(60000));
    this.dot.setAttribute('cx', shX(end).toFixed(1)); this.dot.setAttribute('cy', shY(this.price(end)).toFixed(1));
    const p = Math.round(this.price(t)), pnl = (60000 - p) * 0.01;
    UI.set(this.v, UI.sgn(pnl, 2) + ' USDT');
    this.v.style.color = Math.abs(pnl) < 0.005 ? 'var(--second)' : pnl > 0 ? 'var(--main)' : 'var(--accent)';
    UI.set(this.f, '(60,000 − ' + UI.fmt(p) + ') × 0.010 = ' + UI.sgn(pnl, 2));
    UI.show(this.s, t, 12.1);
    this.tutor.render(t);
  },
});
