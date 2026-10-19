const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// Fictional long with a stop-loss at 59,000. Price drifts to 59,600, then at 9.6 s jumps straight to 58,300 (no trades between).
const GP_JUMP = 9.6;
const GP_X = (t) => 1000 + Math.min(t, 21) / 21 * 700, GP_Y = (p) => 300 + (60000 - p) / 2000 * 380;
kit.scene('gap', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const r = kit.rng(9); this.nz = []; for (let i = 0; i < 230; i++) this.nz.push(r() - 0.5);
    let grid = '';
    [58000, 59000, 60000].forEach((p) => { grid += '<text x="1712" y="' + (GP_Y(p) + 8) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:760px"><p class="kick gp-k" style="color:var(--accent)">Gap risk</p>' +
      '<h2 class="line gp-t" style="font-size:72px">When price jumps</h2>' +
      '<p class="def gp-d">A <b>gap</b> is a jump from one price to another, with no trades in between. It often follows big news.</p></div>' +
      '<div class="glass gp-r" style="left:140px;top:520px;width:760px;padding:22px 32px"><div style="display:flex;justify-content:space-between;font-size:28px;font-weight:600"><span>Planned exit</span><span class="mono">59,000</span></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:28px;font-weight:600;margin-top:10px"><span>Actual fill, about</span><span class="mono" style="color:var(--accent)">58,300</span></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:28px;font-weight:600;margin-top:10px"><span>Slippage</span><span class="mono" style="color:var(--accent)">700 per BTC</span></div></div>' +
      '<div class="glass gp-g" style="left:950px;top:170px;width:830px;height:560px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="gp-chart">' + grid +
      '<line x1="1000" x2="1700" y1="' + GP_Y(59000) + '" y2="' + GP_Y(59000) + '" stroke-dasharray="12 8" stroke-width="3" style="stroke:var(--accent)"/>' +
      '<text x="1010" y="' + (GP_Y(59000) - 12) + '" style="fill:var(--accent);font-size:24px;font-weight:600">Stop-loss 59,000</text>' +
      '<path class="gp-a" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<line class="gp-jump" stroke-width="3" stroke-dasharray="4 10" style="stroke:color-mix(in srgb, var(--second) 55%, transparent)"/>' +
      '<path class="gp-b" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<g class="gp-fill"><circle r="14" style="fill:var(--accent)"/><text x="24" y="-18" style="fill:var(--second);font-size:24px;font-weight:600">Filled near 58,300</text></g>' +
      '<text class="gp-none" style="fill:color-mix(in srgb, var(--second) 70%, var(--ground));font-size:22px">no trades here</text></g>' +
      '<text x="975" y="214" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC · fictional · illustrative</text></svg>' +
      '<div class="chip gp-c" style="position:absolute;left:1180px;top:228px;font-size:26px;padding:10px 22px;background:color-mix(in srgb, var(--ground) 70%, var(--accent));border-color:var(--accent)">Liquidation can come just as suddenly</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.gp-k').style; this.t = q('.gp-t'); this.d = q('.gp-d'); this.r = q('.gp-r').style; this.g = q('.gp-g').style; this.chart = q('.gp-chart').style;
    this.a = q('.gp-a'); this.b = q('.gp-b'); this.jump = q('.gp-jump'); this.fill = q('.gp-fill'); this.none = q('.gp-none'); this.c = q('.gp-c').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 6.9, pose: 'magnify' }, { t: GP_JUMP, pose: 'confused' }, { t: 13.2, pose: 'explain' }, { t: 18.8, pose: 'calm' }],
      says: [],
    });
  },
  price(s) {
    const i = Math.min(229, Math.floor(s * 10));
    if (s < GP_JUMP) return 60000 - 400 * eio(clamp01((s - 1) / 7)) + this.nz[i] * 50;
    return 58300 - 150 * clamp01((s - GP_JUMP) / 6) + Math.sin(s * 3) * 40;
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.04 });
    this.g.opacity = eo(seg(t, 2.0, 2.6)); this.chart.opacity = eo(seg(t, 2.4, 3.0));
    const end = Math.min(t, 21);
    let a = '', b = '';
    for (let s = 0; s <= Math.min(end, GP_JUMP - 0.05) + 1e-6; s += 0.1) a += (s ? 'L' : 'M') + GP_X(s).toFixed(1) + ' ' + GP_Y(this.price(s)).toFixed(1);
    if (end >= GP_JUMP) for (let s = GP_JUMP; s <= end + 1e-6; s += 0.1) b += (s > GP_JUMP ? 'L' : 'M') + GP_X(s).toFixed(1) + ' ' + GP_Y(this.price(s)).toFixed(1);
    this.a.setAttribute('d', a); this.b.setAttribute('d', b || 'M0 0');
    this.b.style.opacity = end >= GP_JUMP ? 1 : 0;
    const x = GP_X(GP_JUMP), y0 = GP_Y(this.price(GP_JUMP - 0.1)), y1 = GP_Y(58300);
    this.jump.setAttribute('x1', x); this.jump.setAttribute('x2', x); this.jump.setAttribute('y1', y0.toFixed(1)); this.jump.setAttribute('y2', y1.toFixed(1));
    this.jump.style.opacity = eo(seg(t, GP_JUMP + 0.2, GP_JUMP + 0.6));
    this.none.setAttribute('x', (x + 14).toFixed(1)); this.none.setAttribute('y', (y0 + 56).toFixed(1));
    this.none.style.opacity = eo(seg(t, GP_JUMP + 0.6, GP_JUMP + 1.0));
    const fp = seg(t, 13.2, 13.7);
    this.fill.setAttribute('transform', 'translate(' + (x + 6).toFixed(1) + ' ' + y1.toFixed(1) + ') scale(' + lerp(0.4, 1, eob(fp, 1.8)).toFixed(3) + ')');
    this.fill.style.opacity = eo(fp);
    UI.rise(kit, this.r, t, 13.6, 0.7);
    UI.rise(kit, this.c, t, 18.8, 0.6, 20);
    this.tutor.render(t);
  },
});
