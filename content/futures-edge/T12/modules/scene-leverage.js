const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const LV_STEPS = [[6.0, 1], [8.0, 3], [9.8, 10]];
const LV_K = 0.6; // px per USDT for the bars
kit.scene('leverage', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let pills = '';
    LV_STEPS.forEach((s) => { pills += '<span class="chip mono lv-pill" style="font-size:32px;padding:12px 30px">' + s[1] + 'x</span>'; });
    const r = kit.rng(12); let wig = 'M20 70'; for (let i = 1; i <= 24; i++) wig += ' L' + (20 + i * 9) + ' ' + (70 + (r() - 0.5) * 34 - Math.sin(i / 3) * 10).toFixed(1);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1040px"><p class="kick lv-k">New word · leverage</p>' +
      '<h2 class="line lv-t">Leverage multiplies size</h2>' +
      '<p class="def lv-d"><b>Leverage</b> is how many times bigger the position is than your margin.</p></div>' +
      '<div style="position:absolute;left:140px;top:480px">' +
      '<div style="display:flex;align-items:center;gap:24px;height:64px"><span style="width:200px;flex:none;font-size:26px;font-weight:600">Margin</span><div class="lv-m" style="flex:none;height:46px;width:' + (100 * LV_K) + 'px;border-radius:10px;background:var(--main)"></div><span class="mono lv-mv" style="font-size:30px">100 USDT</span></div>' +
      '<div style="display:flex;align-items:center;gap:24px;height:64px;margin-top:14px"><span style="width:200px;flex:none;font-size:26px;font-weight:600">Notional</span><div class="lv-n" style="flex:none;height:46px;width:0;border-radius:10px;background:linear-gradient(90deg, var(--main), var(--accent))"></div><span class="mono lv-nv" style="font-size:30px;white-space:nowrap"></span></div></div>' +
      '<div class="chip lv-f" style="position:absolute;left:140px;top:680px;font-size:30px;padding:14px 30px">notional ≈ margin × leverage<span style="width:2px;height:30px;background:color-mix(in srgb, var(--second) 25%, transparent)"></span><span class="mono lv-fx" style="color:var(--main)"></span></div>' +
      '<div class="glass lv-sel" style="left:1240px;top:170px;width:540px;height:280px;padding:24px 32px"><p class="fict" style="margin:0 0 16px">Leverage · educational mock</p>' +
      '<div style="display:flex;gap:16px">' + pills + '</div>' +
      '<p style="margin:22px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Position size = <span class="mono lv-x" style="font-size:40px;color:var(--second)">1</span> × your margin</p></div>' +
      '<div class="glass lv-mag" style="left:1240px;top:476px;width:540px;height:196px;padding:20px 28px">' +
      '<svg width="200" height="150" viewBox="0 0 250 150" style="position:absolute;left:18px;top:24px;overflow:visible"><path d="' + wig + '" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--second) 45%, transparent)"/>' +
      '<g class="lv-lens"><circle cx="0" cy="0" r="46" stroke-width="5" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main)"/><line x1="33" y1="33" x2="62" y2="62" stroke-width="9" stroke-linecap="round" style="stroke:var(--main)"/>' +
      '<path class="lv-zoom" fill="none" stroke-width="4" style="stroke:var(--second)"/></g></svg>' +
      '<p style="position:absolute;left:250px;right:24px;top:30px;margin:0;font-size:28px;line-height:1.35;font-weight:600">Like a magnifying glass: every move looks bigger, good and bad.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.lv-k').style; this.t = q('.lv-t'); this.d = q('.lv-d');
    this.m = q('.lv-m').style; this.mv = q('.lv-mv').style; this.n = q('.lv-n').style; this.nv = q('.lv-nv');
    this.f = q('.lv-f').style; this.fx = q('.lv-fx'); this.sel = q('.lv-sel').style; this.pills = all('.lv-pill').map((e) => e.style); this.x = q('.lv-x');
    this.mag = q('.lv-mag').style; this.lens = q('.lv-lens'); this.zoom = q('.lv-zoom');
    this.wr = kit.rng(5); this.zr = []; for (let i = 0; i < 9; i++) this.zr.push(this.wr());
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 6.0, pose: 'point', flip: true }, { t: 11.5, pose: 'writing' }, { t: 17.4, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.05 });
    UI.rise(kit, this.sel, t, 3.4, 0.7);
    const mp = seg(t, 4.2, 4.8);
    this.m.transformOrigin = '0 50%'; this.m.transform = 'scaleX(' + eo(mp) + ')'; this.mv.opacity = eo(mp);
    // Step through 1x, 3x, 10x: the notional bar grows, the margin bar never changes.
    let lev = 0, prev = 0, at = 0;
    LV_STEPS.forEach((s) => { if (t >= s[0]) { prev = lev; lev = s[1]; at = s[0]; } });
    const g = eio(seg(t, at, at + 0.9));
    const cur = lev ? lerp(prev, lev, g) : 0;
    this.n.width = (100 * cur * LV_K).toFixed(1) + 'px';
    UI.set(this.nv, lev ? UI.fmt(Math.round(100 * cur)) + ' USDT' : '');
    UI.set(this.x, lev || 1);
    this.pills.forEach((s, i) => {
      const on = lev === LV_STEPS[i][1] ? eo(seg(t, LV_STEPS[i][0], LV_STEPS[i][0] + 0.3)) : 0;
      s.background = on ? 'color-mix(in srgb, var(--ground) ' + lerp(88, 0, on).toFixed(0) + '%, var(--main))' : 'color-mix(in srgb, var(--ground) 88%, var(--main))';
      s.color = on > 0.5 ? 'var(--ground)' : 'var(--second)';
      s.transform = 'scale(' + (1 + 0.08 * Math.sin(Math.PI * seg(t, LV_STEPS[i][0], LV_STEPS[i][0] + 0.5))).toFixed(3) + ')';
    });
    UI.set(this.fx, '100 × ' + (lev || 10) + ' = ' + UI.fmt(100 * (lev || 10)) + ' USDT');
    const fp = UI.rise(kit, this.f, t, 11.5, 0.7, 20);
    this.f.borderColor = 'color-mix(in srgb, var(--main) ' + (30 + 60 * Math.sin(Math.PI * seg(t, 12.0, 13.4))).toFixed(0) + '%, transparent)';
    UI.rise(kit, this.mag, t, 17.4, 0.7);
    // The lens glides along the wiggle; inside it the same wiggle is drawn twice as tall.
    const lx = lerp(40, 210, (Math.sin((t - 17.4) * 0.9 - Math.PI / 2) + 1) / 2), ly = 70;
    this.lens.setAttribute('transform', 'translate(' + lx.toFixed(1) + ' ' + ly + ')');
    let z = '';
    for (let i = 0; i < 9; i++) z += (i ? 'L' : 'M') + (-36 + i * 9) + ' ' + ((this.zr[(i + Math.floor(lx / 9)) % 9] - 0.5) * 60).toFixed(1);
    this.zoom.setAttribute('d', z);
    this.tutor.render(t);
  },
});
