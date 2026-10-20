const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// 0.1 BTC at 60,000 (6,000 USDT). Win: exit 60,120, gross 12.00, fees 3.00 + 3.01 (6,012 × 0.05% = 3.006), net 5.99.
// Loss: exit 59,940, gross −6.00, fees 3.00 + 3.00 (5,994 × 0.05% = 2.997), net about −12.00. 50 px per USDT.
const FE_X = 1060, FE_U = 50;
const FE_ROWS = [['Position', '0.1 BTC = 6,000 USDT', '', 0.8], ['Gross', '0.1 × 120 = +12.00', 'up', 5.8], ['Entry fee', '6,000 × 0.05% = −3.00', 'dn', 9.4], ['Exit fee', '6,012 × 0.05% = −3.01', 'dn', 11.0], ['Net', '≈ +5.99 USDT', 'hl', 14.4]];
kit.scene('fees', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    FE_ROWS.forEach((r, i) => { rows += '<div class="row fe-r"' + (i === 4 ? ' style="border:0"' : '') + '><span>' + r[0] + '</span><span class="mono ' + r[2] + '" style="font-size:' + (i === 4 ? 40 : 30) + 'px">' + r[1] + '</span></div>'; });
    const seg2 = (cls, x, w, y, col, txt) => '<div class="' + cls + '" style="position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:60px;border-radius:10px;transform-origin:0 50%;background:' + col + ';display:flex;align-items:center;justify-content:center;box-sizing:border-box"><span class="mono" style="font-size:24px;font-weight:600">' + txt + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass fe-p" style="left:140px;top:300px;width:820px;padding:14px 32px"><p class="fict" style="margin:6px 0 4px">Demo trade · example fee 0.05% per side</p>' + rows + '</div>' +
      '<p class="kick fe-wk" style="position:absolute;left:' + FE_X + 'px;top:330px;margin:0;color:var(--up)">Winning scalp · exit 60,120</p>' +
      seg2('fe-g', FE_X, 12 * FE_U, 370, 'color-mix(in srgb, var(--up) 55%, transparent)', '') +
      '<p class="mono fe-gl" style="position:absolute;left:' + FE_X + 'px;top:384px;width:' + 6 * FE_U + 'px;text-align:center;margin:0;font-size:26px;font-weight:600">+5.99 left</p>' +
      seg2('fe-f1', FE_X + 6 * FE_U, 3 * FE_U, 370, 'color-mix(in srgb, var(--down) 75%, transparent)', '−3.00') +
      seg2('fe-f2', FE_X + 9 * FE_U, 3 * FE_U, 370, 'color-mix(in srgb, var(--down) 60%, transparent)', '−3.01') +
      '<p class="mono fe-hf" style="position:absolute;left:' + FE_X + 'px;top:446px;margin:0;font-size:26px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">Fees took about half of the 12.00</p>' +
      '<p class="kick fe-lk" style="position:absolute;left:' + FE_X + 'px;top:530px;margin:0;color:var(--down)">Losing scalp · exit 59,940</p>' +
      seg2('fe-l', FE_X, 6 * FE_U, 570, 'color-mix(in srgb, var(--down) 45%, transparent)', '−6.00') +
      seg2('fe-l1', FE_X + 6 * FE_U, 3 * FE_U, 570, 'color-mix(in srgb, var(--down) 75%, transparent)', '−3.00') +
      seg2('fe-l2', FE_X + 9 * FE_U, 3 * FE_U, 570, 'color-mix(in srgb, var(--down) 60%, transparent)', '−3.00') +
      '<p class="mono fe-lt" style="position:absolute;left:' + FE_X + 'px;top:646px;margin:0;font-size:30px">−6.00 − 3.00 − 3.00 ≈ <span class="dn">−12.00 USDT</span></p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick fe-k">The costs</p>' +
      '<h2 class="line fe-t">Small move, real fees</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.fe-k').style; this.t = q('.fe-t'); this.p = q('.fe-p').style; this.rows = all('.fe-r').map((e) => e.style);
    ['wk', 'g', 'gl', 'f1', 'f2', 'hf', 'lk', 'l', 'l1', 'l2', 'lt'].forEach((n) => { this[n] = q('.fe-' + n).style; });
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'checklist' }, { t: 0.6, pose: 'explain' }, { t: 5.7, pose: 'thumbs' }, { t: 9.1, pose: 'magnify' }, { t: 14.3, pose: 'confused' }, { t: 19.6, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.p, t, 0.6);
    this.rows.forEach((s, i) => { const a = FE_ROWS[i][3]; s.opacity = eo(seg(t, a, a + 0.4)); s.transform = 'translateX(' + lerp(20, 0, eo(seg(t, a, a + 0.5))).toFixed(1) + 'px)'; });
    this.wk.opacity = eo(seg(t, 5.8, 6.2));
    const grow = (s, a, d) => { const p = seg(t, a, a + (d || 0.7)); s.opacity = p > 0 ? 1 : 0; s.transform = 'scaleX(' + eo(p).toFixed(3) + ')'; };
    grow(this.g, 6.0, 1.0);
    // Fee chunks drop onto the right end of the green bar.
    const drop = (s, a) => { const p = seg(t, a, a + 0.5); s.opacity = eo(p); s.transform = 'translateY(' + lerp(-40, 0, eob(p, 1.4)).toFixed(1) + 'px)'; };
    drop(this.f1, 9.6); drop(this.f2, 11.2);
    this.gl.opacity = eo(seg(t, 14.5, 15.0)); this.hf.opacity = eo(seg(t, 15.2, 15.7));
    this.lk.opacity = eo(seg(t, 19.6, 20.0));
    grow(this.l, 19.8, 0.6); drop(this.l1, 20.6); drop(this.l2, 21.2);
    UI.rise(this.lt, t, 21.8, { dy: 10 });
    this.tutor.render(t);
  },
});
