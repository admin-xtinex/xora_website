const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Waterfall in USDT: start +0.80, then −0.10, −0.20, −0.60, net −0.10.
const AD_Z = 600, AD_K = 380;
const AD_STEPS = [['Chart gain', 0, 0.80, 'var(--main)', 4.3], ['Spread', 0.80, 0.70, 'var(--accent)', 6.0], ['Slippage', 0.70, 0.50, 'var(--accent)', 7.7], ['Fees', 0.50, -0.10, 'var(--accent)', 9.6], ['Net', 0, -0.10, 'var(--accent)', 13.2]];
const adY = (v) => AD_Z - v * AD_K;
const adS = (v) => (v > 0 ? '+' : '−') + Math.abs(v).toFixed(2);
kit.scene('add', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let bars = '', rows = '';
    AD_STEPS.forEach((s, i) => {
      const x = 1000 + i * 150, top = adY(Math.max(s[1], s[2])), h = Math.abs(s[2] - s[1]) * AD_K;
      bars += '<g class="ad-bar"><rect class="ad-rect" x="' + x + '" y="' + top.toFixed(1) + '" width="100" height="' + h.toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, ' + s[3] + ' 45%, var(--ground));stroke:' + s[3] + ';stroke-width:2"/>' +
        '<text x="' + (x + 50) + '" y="' + (s[2] >= s[1] && s[2] > 0 ? top - 14 : top + h + 32).toFixed(1) + '" text-anchor="middle" class="mono" style="fill:' + s[3] + ';font-size:26px">' + adS(s[2] - s[1] || s[2]) + '</text>' +
        '<text x="' + (x + 50) + '" y="' + (i === 4 ? 740 : 740) + '" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 75%, var(--ground));font-size:24px;font-weight:600">' + s[0] + '</text>' +
        (i > 0 && i < 4 ? '<line x1="' + (x - 50) + '" x2="' + x + '" y1="' + adY(s[1]).toFixed(1) + '" y2="' + adY(s[1]).toFixed(1) + '" stroke-width="2" stroke-dasharray="5 6" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>' : '') + '</g>';
      rows += '<div class="ad-r" style="display:flex;justify-content:space-between;padding:8px 0;' + (i === 4 ? 'border-top:2px solid color-mix(in srgb, var(--second) 25%, transparent);margin-top:6px;padding-top:12px' : '') + '"><span style="font-size:30px;' + (i === 4 ? 'font-weight:700' : '') + '">' + s[0] + '</span><span class="mono" style="font-size:32px;color:' + s[3] + '">' + adS(i === 4 ? s[2] : s[2] - s[1]) + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><line class="ad-zero" x1="980" x2="1720" y1="' + AD_Z + '" y2="' + AD_Z + '" stroke-width="3" style="stroke:color-mix(in srgb, var(--second) 45%, transparent)"/>' +
      '<text class="ad-zl mono" x="970" y="' + (AD_Z + 8) + '" text-anchor="end" style="fill:color-mix(in srgb, var(--second) 55%, var(--ground));font-size:22px">0</text>' + bars +
      '<text x="1000" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">USDT · 0.01 BTC · fictional example</text></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick ad-k">All together</p>' +
      '<h2 class="line ad-t">Add it all up</h2></div>' +
      '<div class="glass ad-list" style="left:140px;top:330px;width:740px;padding:18px 36px">' + rows + '</div>' +
      '<div class="glass ad-fill" style="left:140px;top:686px;width:740px;padding:16px 36px;border-color:var(--accent)"><p style="margin:0;font-size:28px;font-weight:600">Fills 60,015 → 60,065: gross <span class="mono" style="color:var(--main)">+0.50</span>, net <span class="mono" style="color:var(--accent)">−0.10</span></p></div>' +
      '<span class="chip ad-fu" style="position:absolute;left:1000px;top:150px;font-size:24px;padding:10px 20px">Funding not included: closed within minutes</span>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ad-k').style; this.t = q('.ad-t'); this.list = q('.ad-list').style; this.fill = q('.ad-fill').style; this.fu = q('.ad-fu').style;
    this.zero = q('.ad-zero').style; this.zl = q('.ad-zl').style;
    this.bars = all('.ad-bar').map((e) => e.style); this.rects = all('.ad-rect'); this.rows = all('.ad-r').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.5, pose: 'checklist' }, { t: 13.1, pose: 'confused' }, { t: 18.3, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.list, t, 0.8);
    this.zero.opacity = this.zl.opacity = eo(seg(t, 1.0, 1.5));
    AD_STEPS.forEach((s, i) => {
      const a = s[4], p = seg(t, a, a + 0.7);
      this.bars[i].opacity = eo(seg(t, a, a + 0.3));
      const r = this.rects[i];
      r.style.transformBox = 'fill-box';
      r.style.transformOrigin = s[2] >= s[1] && s[2] > 0 ? '50% 100%' : '50% 0%';
      r.style.transform = 'scaleY(' + eio(p).toFixed(3) + ')';
      this.rows[i].opacity = eo(seg(t, a, a + 0.4));
      this.rows[i].transform = 'translateX(' + lerp(20, 0, eo(seg(t, a, a + 0.5))).toFixed(1) + 'px)';
    });
    UI.rise(this.fill, t, 14.4);
    UI.rise(this.fu, t, 18.4);
    this.tutor.render(t);
  },
});
