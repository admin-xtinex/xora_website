const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// Weak vs conflicting evidence on a balance scale: four weights land, the beam tilts, then settles level -> NO_TRADE.
const WK_PX = 1340, WK_PY = 400, WK_ARM = 270;
// [label, side (-1 = for BUY, +1 = against), weight, time it lands, strength label]
const WK_W = [['One wick above', -1, 0.5, 4.0, 'Weak'], ['Trend leans up', -1, 1, 14.0, ''], ['Under resistance', 1, 1, 15.6, ''], ['Volume fading', 1, 0.5, 17.2, '']];
kit.scene('weak', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let ws = '';
    WK_W.forEach((w) => {
      ws += '<div class="wk-w" style="position:absolute;left:0;top:0;width:250px;height:' + (w[2] > 0.6 ? 58 : 46) + 'px;box-sizing:border-box;border-radius:12px;display:grid;place-items:center;font-size:' + (w[2] > 0.6 ? 26 : 23) + 'px;font-weight:700;white-space:nowrap;' +
        'background:color-mix(in srgb, var(--ground) 70%, ' + (w[1] < 0 ? 'var(--up)' : 'var(--accent)') + ');border:2px solid ' + (w[1] < 0 ? 'var(--up)' : 'var(--accent)') + '">' + w[0] + '</div>';
    });
    this.h = UI.head(kit, 'Weak or conflicting', 'Weighing the evidence',
      '<div class="glass wk-d1" style="left:140px;top:300px;width:700px;padding:22px 32px"><p class="kick" style="margin:0 0 8px">Weak evidence</p><p style="margin:0;font-size:30px;line-height:1.35;font-weight:600">Small, or easy to fake. One wick above a level.</p></div>' +
      '<div class="glass wk-d2" style="left:140px;top:480px;width:700px;padding:22px 32px"><p class="kick" style="margin:0 0 8px;color:var(--accent)">Conflicting evidence</p><p style="margin:0;font-size:30px;line-height:1.35;font-weight:600">Points different ways at the same time.</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><path d="M' + (WK_PX - 60) + ' 640 L' + WK_PX + ' ' + (WK_PY + 10) + ' L' + (WK_PX + 60) + ' 640 Z" style="fill:color-mix(in srgb, var(--second) 14%, transparent);stroke:color-mix(in srgb, var(--second) 40%, transparent);stroke-width:2"/>' +
      '<g class="wk-beam"><line x1="' + (WK_PX - WK_ARM) + '" x2="' + (WK_PX + WK_ARM) + '" y1="' + WK_PY + '" y2="' + WK_PY + '" stroke-width="10" stroke-linecap="round" style="stroke:var(--second)"/></g>' +
      '<circle cx="' + WK_PX + '" cy="' + WK_PY + '" r="14" style="fill:var(--main)"/>' +
      '<g class="wk-pan"><line class="wk-s1" stroke-width="2.5" style="stroke:color-mix(in srgb, var(--second) 50%, transparent)"/><line class="wk-s2" stroke-width="2.5" style="stroke:color-mix(in srgb, var(--second) 50%, transparent)"/><path class="wk-dish" fill="none" stroke-width="6" stroke-linecap="round" style="stroke:var(--up)"/></g>' +
      '<g class="wk-pan"><line class="wk-s1" stroke-width="2.5" style="stroke:color-mix(in srgb, var(--second) 50%, transparent)"/><line class="wk-s2" stroke-width="2.5" style="stroke:color-mix(in srgb, var(--second) 50%, transparent)"/><path class="wk-dish" fill="none" stroke-width="6" stroke-linecap="round" style="stroke:var(--accent)"/></g></svg>' +
      '<p class="kick wk-l0" style="position:absolute;margin:0;left:' + (WK_PX - WK_ARM - 110) + 'px;top:676px;width:220px;text-align:center;color:var(--up)">For BUY</p>' +
      '<p class="kick wk-l1" style="position:absolute;margin:0;left:' + (WK_PX + WK_ARM - 110) + 'px;top:676px;width:220px;text-align:center;color:var(--accent)">Against</p>' + ws +
      '<p class="tag wk-weak" style="left:0;top:0;font-size:22px">weak</p>' +
      '<div class="chip mono wk-no" style="position:absolute;left:' + (WK_PX - 135) + 'px;top:300px;width:270px;justify-content:center;box-sizing:border-box;font-size:30px;padding:10px 0;background:var(--main);color:var(--ground);border-color:var(--main)">NO_TRADE</div>');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.d1 = q('.wk-d1').style; this.d2 = q('.wk-d2').style; this.beam = q('.wk-beam'); this.no = q('.wk-no').style; this.weak = q('.wk-weak').style;
    this.pans = all('.wk-pan').map((g) => ({ s1: g.querySelector('.wk-s1'), s2: g.querySelector('.wk-s2'), dish: g.querySelector('.wk-dish') }));
    this.ws = all('.wk-w').map((e) => e.style); this.ls = [q('.wk-l0').style, q('.wk-l1').style];
    this.svg = kit.stage.querySelector('.art').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'think' }, { t: 7.6, pose: 'confused' }, { t: 13.2, pose: 'magnify' }, { t: 19.2, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.d1, t, 0.6, 0.7); UI.rise(kit, this.d2, t, 7.6, 0.7);
    this.svg.opacity = eo(seg(t, 1.0, 1.6)); this.ls.forEach((s) => { s.opacity = eo(seg(t, 1.2, 1.8)); });
    // Landed weight on each side (eased as it drops) sets the tilt.
    let tilt = 0; const land = WK_W.map((w) => eob(seg(t, w[3], w[3] + 0.5), 1.4));
    WK_W.forEach((w, i) => { tilt += w[1] * w[2] * clamp01(land[i]); });
    const ang = tilt * 0.11 + 0.012 * Math.sin(t * 2.4) * seg(t, 1, 2);
    this.beam.setAttribute('transform', 'rotate(' + (ang * 180 / Math.PI).toFixed(2) + ' ' + WK_PX + ' ' + WK_PY + ')');
    const ends = [-1, 1].map((d) => [WK_PX + d * WK_ARM * Math.cos(ang), WK_PY + d * WK_ARM * Math.sin(ang)]);
    const stack = [0, 0];
    ends.forEach((e, k) => {
      const P = this.pans[k], dy = e[1] + 200;
      P.s1.setAttribute('x1', e[0]); P.s1.setAttribute('y1', e[1]); P.s1.setAttribute('x2', e[0] - 130); P.s1.setAttribute('y2', dy);
      P.s2.setAttribute('x1', e[0]); P.s2.setAttribute('y1', e[1]); P.s2.setAttribute('x2', e[0] + 130); P.s2.setAttribute('y2', dy);
      P.dish.setAttribute('d', 'M' + (e[0] - 140) + ' ' + dy + ' Q' + e[0] + ' ' + (dy + 44) + ' ' + (e[0] + 140) + ' ' + dy);
      this.ls[k].transform = 'translateY(' + (e[1] - WK_PY).toFixed(1) + 'px)';
    });
    WK_W.forEach((w, i) => {
      const k = w[1] < 0 ? 0 : 1, e = ends[k], hgt = w[2] > 0.6 ? 58 : 46, base = e[1] + 200 + 6;
      const y = base - stack[k] - hgt; stack[k] += hgt + 6;
      const p = seg(t, w[3] - 0.5, w[3]), fall = lerp(-160, 0, p * p);
      const s = this.ws[i];
      s.opacity = eo(seg(t, w[3] - 0.5, w[3] - 0.3)).toFixed(3);
      s.transform = 'translate(' + (e[0] - 125).toFixed(1) + 'px,' + (y + fall).toFixed(1) + 'px)';
      if (i === 0) this.weak.transform = 'translate(' + (e[0] - 125 - 90).toFixed(1) + 'px,' + (y + fall + 6).toFixed(1) + 'px)';
    });
    this.weak.opacity = eo(seg(t, 4.4, 4.8));
    const n = seg(t, 19.6, 20.1);
    this.no.opacity = eo(n); this.no.transform = 'scale(' + lerp(0.6, 1, eob(n, 1.8)).toFixed(3) + ')';
    this.tutor.render(t);
  },
});
