const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// [region, label, chip centre x, y, appears at]
const LY = [['wl', 'Watchlist', 245, 400, 5.4], ['sym', 'Symbol bar', 705, 155, 6.3], ['chart', 'Chart', 755, 400, 7.2], ['book', 'Order book', 1280, 400, 8.1], ['entry', 'Order entry', 1635, 490, 9.0],
  ['pos', 'Positions', 770, 691, 10.3], ['wallet', 'Wallet', 1494, 155, 11.5], ['sec', 'Security', 1700, 252, 12.7]];
kit.scene('layout', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    kit.stage.append(kit.h('<div class="ly-dim" style="position:absolute;inset:0;background:rgba(2,3,10,.82)"></div>'));
    let out = '';
    LY.forEach((l, i) => {
      const r = UI.R[l[0]];
      out += '<div class="ly-o" style="position:absolute;left:' + (r.x - 5) + 'px;top:' + (r.y - 5) + 'px;width:' + (r.w + 10) + 'px;height:' + (r.h + 10) + 'px;box-sizing:border-box;border-radius:20px;border:3px solid var(--main);box-shadow:0 0 24px color-mix(in srgb, var(--main) 35%, transparent)"></div>';
    });
    LY.forEach((l, i) => {
      out += '<div class="chip ly-c" style="position:absolute;left:' + l[2] + 'px;top:' + l[3] + 'px;font-size:28px;padding:8px 22px 8px 10px;gap:12px;background:color-mix(in srgb, var(--ground) 70%, var(--main));border-color:var(--main)">' +
        '<span class="mono" style="width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--main);color:var(--ground);font-size:24px">' + (i + 1) + '</span>' + l[1] + '</div>';
    });
    kit.stage.append(kit.h('<div style="position:absolute;inset:0">' + out + '</div>'));
    // The analogy: a simple dashboard with two dials.
    const dial = (cx, label) => '<g transform="translate(' + cx + ' 0)"><circle r="78" fill="none" stroke-width="6" style="stroke:color-mix(in srgb, var(--second) 22%, transparent)"/><path d="M-62 30 A68 68 0 1 1 62 30" fill="none" stroke-width="8" stroke-linecap="round" style="stroke:var(--main)"/>' +
      '<line class="ly-needle" x1="0" y1="0" x2="0" y2="-56" stroke-width="6" stroke-linecap="round" style="stroke:var(--accent)"/><circle r="9" style="fill:var(--second)"/><text y="62" text-anchor="middle" style="fill:var(--second);font-size:24px;font-weight:600">' + label + '</text></g>';
    this.card = UI.tip(kit, 420, 230, 1080, 'The overall layout', 'Like a car dashboard', 'Each part of the screen has one job. Learn the jobs, and any trading app makes sense.',
      '<svg width="1000" height="190" viewBox="-500 -100 1000 190" style="display:block">' + dial(-150, 'Speed') + dial(150, 'Fuel') + '</svg>');
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.dim = kit.stage.querySelector('.ly-dim').style; this.cs = this.card.style;
    this.outl = all('.ly-o').map((e) => e.style); this.chips = all('.ly-c').map((e) => e.style);
    this.needles = all('.ly-needle');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'explain' }, { t: 5.0, pose: 'point', flip: true }, { t: 14.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.term.render(t, { sym: 'BTC' });
    const lift = seg(t, 4.6, 5.3);
    this.dim.opacity = lerp(1, 0.62, eio(lift)).toFixed(3);
    UI.show(this.cs, t, 0.4, 4.6);
    this.needles.forEach((n, i) => n.setAttribute('transform', 'rotate(' + (lerp(-120, i ? 60 : 30, eob(seg(t, 1.0 + i * 0.4, 2.4 + i * 0.4), 1.4)) + Math.sin(t * 3 + i) * 3).toFixed(1) + ')'));
    LY.forEach((l, i) => {
      const a = l[4], p = seg(t, a, a + 0.5), last = i === LY.length - 1 ? 99 : LY[i + 1][4];
      const now = t >= a && t < last + 0.2 ? 1 : 0.45;
      this.outl[i].opacity = (eo(p) * now).toFixed(3);
      this.chips[i].opacity = eo(seg(t, a, a + 0.3)).toFixed(3);
      this.chips[i].transform = 'translate(-50%,-50%) scale(' + lerp(0.7, 1, eob(p, 1.7)).toFixed(4) + ')';
    });
    // A final sweep: each region pulses once, in order.
    LY.forEach((l, i) => { const a = 15.2 + i * 0.35, p = seg(t, a, a + 0.6); if (p > 0 && p < 1) this.outl[i].opacity = (0.45 + 0.55 * Math.sin(Math.PI * p)).toFixed(3); });
    this.tutor.render(t);
  },
});
