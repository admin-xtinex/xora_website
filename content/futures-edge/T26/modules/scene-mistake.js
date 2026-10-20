const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// The misconception (72% = chance to win) is struck out; a READY trade then hits its stop.
const MS_X0 = 1060, MS_X1 = 1720, MS_Y = (p) => 490 - (p - 60000) * 0.5; // 60,000 at y 520; 1 USDT = 0.5 px
const MS_K = [[0, 60000], [2, 60110], [3.4, 60060], [5, 60150], [6.6, 59960], [8, 59870], [9, 59760], [9.6, 59700]];
const msPrice = (s) => { let v = MS_K[0][1]; for (let i = 1; i < MS_K.length; i++) { const a = MS_K[i - 1], b = MS_K[i]; if (s >= a[0]) v = lerp(a[1], b[1], eio(clamp01((s - a[0]) / (b[0] - a[0])))); } return v + Math.sin(s * 7.1) * 12; };
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const hl = (p, col, lab) => '<line x1="' + MS_X0 + '" x2="' + MS_X1 + '" y1="' + MS_Y(p) + '" y2="' + MS_Y(p) + '" stroke-dasharray="12 8" stroke-width="2.5" style="stroke:' + col + '"/>' +
      '<text x="' + MS_X1 + '" y="' + (MS_Y(p) - 12) + '" text-anchor="end" class="mono" style="fill:' + col + ';font-size:22px">' + lab + '</text>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:860px"><p class="kick ms-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line ms-t">72% is not a chance to win</h2></div>' +
      '<div class="glass ms-w" style="left:140px;top:420px;width:820px;padding:26px 34px;border-color:color-mix(in srgb, var(--down) 50%, transparent)"><p class="kick" style="margin:0 0 8px;color:var(--down)">Wrong</p>' +
      '<p style="margin:0;font-size:34px;font-weight:700;position:relative;display:inline-block">“72% means I win 72 times in 100.”<span class="ms-s" style="position:absolute;left:-6px;right:-6px;top:52%;height:5px;border-radius:3px;background:var(--down)"></span></p></div>' +
      '<div class="glass ms-r" style="left:140px;top:600px;width:820px;padding:26px 34px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 78%, var(--main))"><p class="kick" style="margin:0 0 8px">Right · the app says</p>' +
      '<p style="margin:0;font-size:34px;font-weight:700;line-height:1.35">Confidence is evidence strength, not a chance of winning.</p></div>' +
      '<div class="glass ms-c" style="left:1020px;top:270px;width:760px;height:470px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ms-g">' +
      '<text x="' + MS_X0 + '" y="320" class="mono" style="fill:var(--up);font-size:24px;font-weight:600">BUY · READY 72% / 60%</text>' +
      hl(60000, 'color-mix(in srgb, var(--second) 70%, transparent)', 'entry 60,000') + hl(59700, 'var(--down)', 'stop 59,700') +
      '<path class="ms-l" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="ms-d" r="10" style="fill:var(--second)"/>' +
      '<text class="ms-x mono" x="' + MS_X0 + '" y="710" style="fill:var(--down);font-size:26px;font-weight:600">Stopped out · a loss, limited by the stop</text></g></svg>' +
      '<p class="fict ms-f" style="position:absolute;left:1020px;top:752px;margin:0">Fictional prices · Illustrative, not real market data</p></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ms-k').style; this.t = q('.ms-t'); this.w = q('.ms-w').style; this.s = q('.ms-s').style; this.r = q('.ms-r').style;
    this.c = q('.ms-c').style; this.g = q('.ms-g').style; this.l = q('.ms-l'); this.d = q('.ms-d'); this.x = q('.ms-x').style; this.f = q('.ms-f').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 5.0, pose: 'idea' }, { t: 12.0, pose: 'magnify' }, { t: 16.2, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.w, t, 1.0, 0.6, 24);
    const sp = seg(t, 5.0, 5.6);
    this.s.transformOrigin = '0 50%'; this.s.transform = 'scaleX(' + eio(sp) + ')';
    this.w.opacity = (+this.w.opacity * lerp(1, 0.55, eo(seg(t, 5.6, 6.2)))).toFixed(3);
    UI.rise(kit, this.r, t, 6.0, 0.6, 24);
    UI.rise(kit, this.c, t, 11.6, 0.6, 20);
    this.g.opacity = eo(seg(t, 11.8, 12.4));
    this.f.opacity = 0.9 * eo(seg(t, 12.0, 12.6));
    const end = Math.max(0, Math.min(9.6, (t - 12.2) * 2.0));
    let d = '';
    for (let s = 0; s <= end + 1e-6; s += 0.1) d += (d ? 'L' : 'M') + lerp(MS_X0, MS_X1 - 120, s / 9.6).toFixed(1) + ' ' + MS_Y(msPrice(s)).toFixed(1);
    this.l.setAttribute('d', d || 'M0 0');
    this.d.setAttribute('cx', lerp(MS_X0, MS_X1 - 120, end / 9.6).toFixed(1)); this.d.setAttribute('cy', MS_Y(msPrice(end)).toFixed(1));
    this.d.style.fill = end >= 9.6 ? 'var(--down)' : 'var(--second)';
    this.x.opacity = eo(seg(t, 17.0, 17.4));
    this.tutor.render(t);
  },
});
