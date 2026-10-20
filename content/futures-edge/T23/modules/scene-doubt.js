const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Notes typed before deciding; two possible paths fork from the current price.
const DB = [['Leaning', 'Bounce up from support. The 5m trend is up.', 'var(--main)', 7.0], ['Against', 'Support tested twice already. It could break.', 'var(--accent)', 13.2], ['Wrong if', 'Price falls below 59,700.', 'var(--second)', 19.2]];
kit.scene('doubt', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Step 4 of 8 · Write down doubts', 'What could go wrong?');
    this.track = UI.track(kit, 4);
    this.c1 = UI.chart1(kit, 'db');
    const D = UI.D, X = D.x1, Y = D.y1, x0 = X(14) + 14, y0 = Y(60000);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' + '<g class="db-sp">' + UI.band(59850, 59950, 'var(--main)', 160, 1040) + '</g>' +
      '<path class="db-up" d="M' + x0 + ' ' + y0.toFixed(1) + ' C' + (x0 + 120) + ' ' + y0.toFixed(1) + ' ' + (x0 + 160) + ' ' + Y(60450).toFixed(1) + ' 990 ' + Y(60450).toFixed(1) + '" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--up)"/>' +
      '<path class="db-dn" d="M' + x0 + ' ' + y0.toFixed(1) + ' C' + (x0 + 120) + ' ' + y0.toFixed(1) + ' ' + (x0 + 160) + ' ' + Y(59650).toFixed(1) + ' 990 ' + Y(59650).toFixed(1) + '" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 1" style="stroke:var(--down)"/>' +
      '<line class="db-w" x1="160" x2="1040" y1="' + Y(59700).toFixed(1) + '" y2="' + Y(59700).toFixed(1) + '" stroke-width="3" stroke-dasharray="12 8" style="stroke:var(--accent)"/>' +
      '<circle cx="' + x0 + '" cy="' + y0.toFixed(1) + '" r="10" style="fill:var(--second)"/></svg>');
    kit.stage.append(svg);
    const tag = (s, x, y, c) => { const e = kit.h('<p class="tag" style="left:' + x + 'px;top:' + y.toFixed(0) + 'px;border-color:' + c + '">' + s + '</p>'); kit.stage.append(e); return e.style; };
    this.tUp = tag('Bounce?', 870, Y(60450) - 54, 'var(--up)');
    this.tDn = tag('Break?', 880, Y(59650) - 54, 'var(--down)');
    this.tW = tag('Wrong if below 59,700', 210, Y(59700) + 10, 'var(--accent)');
    let rows = '';
    DB.forEach((r) => {
      rows += '<div class="db-r" style="display:flex;gap:18px;align-items:flex-start;min-height:84px">' +
        '<span class="chip" style="flex:none;width:150px;justify-content:center;font-size:24px;padding:6px 0;border-color:' + r[2] + ';color:' + r[2] + '">' + r[0] + '</span>' +
        '<span class="db-x" style="font-size:28px;line-height:1.35;font-weight:600"></span></div>';
    });
    kit.stage.append(kit.h('<div class="glass db-p" style="left:1180px;top:290px;width:600px;padding:22px 30px;display:flex;flex-direction:column;gap:14px"><p class="kick" style="margin:0">My notes · before deciding</p>' + rows +
      '<div class="db-r" style="display:flex;gap:18px;align-items:center"><span class="chip" style="flex:none;width:150px;justify-content:center;font-size:24px;padding:6px 0">Confidence</span>' +
      '<div style="flex:1;display:flex;flex-direction:column;gap:8px"><div style="height:16px;border-radius:8px;background:color-mix(in srgb, var(--second) 10%, transparent);overflow:hidden"><div class="db-m" style="height:100%;width:0;background:linear-gradient(90deg, var(--main), var(--accent))"></div></div>' +
      '<span style="font-size:26px;font-weight:600">Medium · not certain</span></div></div></div>'));
    const q = (s) => svg.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.sp = q('.db-sp').style; this.up = q('.db-up'); this.dn = q('.db-dn'); this.w = q('.db-w').style;
    this.p = kit.stage.querySelector('.db-p').style; this.rows = all('.db-r').map((e) => e.style); this.xs = all('.db-x'); this.m = kit.stage.querySelector('.db-m').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'writing' }, { t: 13.0, pose: 'think' }, { t: 19.0, pose: 'writing' }, { t: 22.0, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t); this.track(t);
    this.c1.render(t, lerp(1, 0.75, eo(seg(t, 6.8, 7.6))));
    this.sp.opacity = eo(seg(t, 0.6, 1.2));
    this.up.setAttribute('stroke-dasharray', eio(seg(t, 7.4, 8.6)).toFixed(3) + ' 1');
    this.dn.setAttribute('stroke-dasharray', eio(seg(t, 13.6, 14.8)).toFixed(3) + ' 1');
    UI.rise(kit, this.tUp, t, 8.4, 0.5, 12); UI.rise(kit, this.tDn, t, 14.6, 0.5, 12);
    this.w.opacity = eo(seg(t, 19.6, 20.2)); UI.rise(kit, this.tW, t, 19.8, 0.5, 12);
    UI.rise(kit, this.p, t, 0.8, 0.6, 24);
    DB.forEach((r, i) => { this.rows[i].opacity = eo(seg(t, r[3] - 0.3, r[3])); UI.type(this.xs[i], r[1], t, r[3], 16); });
    this.rows[3].opacity = eo(seg(t, 21.6, 22.0));
    this.m.width = (50 * eio(seg(t, 22.0, 23.0))).toFixed(1) + '%';
    this.tutor.render(t);
  },
});
