const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The live-forming 1-minute candle. The minute (UI.MIN) plays from LV_A to LV_B, 2.5x faster than real time.
const LV_A = 3.0, LV_B = 27.0, LV_X0 = 280, LV_X1 = 640, LV_CX = 770;
const lvY = (p) => 720 - (p - 59900) / 260 * 390, lvX = (s) => LV_X0 + (LV_X1 - LV_X0) * s / 60;
const LV_TAGS = [['High', 60120, 33.2], ['Close', 60080, 27.6], ['Open', 60000, 33.8], ['Low', 59940, 34.4]];
kit.scene('live', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'lv-c', 1);
    let grid = '';
    for (let p = 59950; p <= 60150; p += 50) grid += '<line x1="260" x2="900" y1="' + lvY(p).toFixed(1) + '" y2="' + lvY(p).toFixed(1) + '" style="stroke:color-mix(in srgb, var(--second) 9%, transparent);stroke-width:1.5"/><text x="240" y="' + (lvY(p) + 8).toFixed(1) + '" text-anchor="end" class="axis">' + UI.fmt(p) + '</text>';
    let tags = '';
    LV_TAGS.forEach((g) => { tags += '<p class="tag lv-tag" style="left:' + (LV_CX + 74) + 'px;top:' + (lvY(g[1]) - 22).toFixed(1) + 'px"><span style="color:color-mix(in srgb, var(--second) 60%, var(--ground))">' + g[0] + '</span> ' + UI.fmt(g[1]) + '</p>'; });
    const row = (cls, label) => '<div class="row ' + cls + '" style="position:relative;padding:14px 16px;margin:0 -16px;border-radius:14px;border-bottom:0"><span class="' + cls + '-l">' + label + '</span>' +
      '<span class="' + cls + '-b" style="position:absolute;left:170px;top:22px;padding:4px 12px;border-radius:999px;font-size:20px;font-weight:700;color:var(--ground);opacity:0"></span><span class="mono ' + cls + '-v"></span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="lv-grid">' + grid +
      '<text x="' + LV_X0 + '" y="758" class="axis lv-sx">0 s</text><text x="' + LV_X1 + '" y="758" text-anchor="end" class="axis lv-sx">60 s</text></g>' +
      '<line class="lv-hi" x1="' + LV_X0 + '" stroke-width="2" stroke-dasharray="6 8" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
      '<line class="lv-lo" x1="' + LV_X0 + '" stroke-width="2" stroke-dasharray="6 8" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
      '<line class="lv-open" x1="' + LV_X0 + '" x2="' + (LV_CX + 70) + '" y1="' + lvY(60000) + '" y2="' + lvY(60000) + '" stroke-width="2" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)"/>' +
      '<path class="lv-path" fill="none" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" style="stroke:var(--main)"/>' +
      '<line class="lv-last" stroke-width="2" stroke-dasharray="3 6"/>' + this.cd.html +
      '<circle class="lv-dot" r="9" style="fill:var(--second)"/></svg>' +
      '<p class="tag lv-pt" style="left:' + (LV_CX + 74) + 'px;color:var(--ground);border:0;font-weight:500"></p>' + tags +
      '<div class="glass lv-panel" style="left:1080px;top:200px;width:540px;padding:24px 36px 14px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between"><p class="fict" style="margin:0">BTC/USDT · 1m candle</p><span class="lv-st" style="padding:6px 14px;border-radius:999px;font-size:22px;font-weight:700"></span></div>' +
      '<div style="display:flex;align-items:baseline;gap:18px;margin:16px 0 8px"><span style="font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Time</span><span class="mono lv-clk" style="font-size:40px"></span><span class="mono" style="font-size:26px;color:color-mix(in srgb, var(--second) 50%, var(--ground))">/ 1:00</span></div>' +
      '<div style="height:10px;border-radius:5px;margin-bottom:12px;background:color-mix(in srgb, var(--second) 10%, transparent)"><div class="lv-bar" style="height:100%;border-radius:5px;background:linear-gradient(90deg, var(--main), var(--accent))"></div></div>' +
      row('lv-ro', 'Open') + row('lv-rh', 'High') + row('lv-rl', 'Low') + row('lv-rc', 'Last price') +
      '<p class="fict" style="margin:10px 0 0">Fictional prices · sped up 2.5×</p></div>' +
      '<div class="words" style="left:140px;top:170px;width:900px"><p class="kick lv-k">Watch it form</p>' +
      '<h2 class="line lv-t">One minute, one candle</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.lv-k').style; this.t = q('.lv-t'); this.grid = q('.lv-grid').style; this.panel = q('.lv-panel').style;
    this.path = q('.lv-path'); this.dot = q('.lv-dot'); this.last = q('.lv-last'); this.hi = q('.lv-hi'); this.lo = q('.lv-lo'); this.open = q('.lv-open');
    this.pt = q('.lv-pt'); this.st = q('.lv-st'); this.clk = q('.lv-clk'); this.bar = q('.lv-bar').style;
    this.rows = ['.lv-ro', '.lv-rh', '.lv-rl', '.lv-rc'].map((s) => ({ st: q(s).style, v: q(s + '-v'), b: q(s + '-b'), l: q(s + '-l') }));
    this.tags = all('.lv-tag').map((e) => e.style); this.sx = all('.lv-sx').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'candles', flip: true }, { t: 8.2, pose: 'magnify' }, { t: 14.6, pose: 'point', flip: true }, { t: 20.8, pose: 'think' }, { t: 27.0, pose: 'cheer' }, { t: 32.8, pose: 'present' }],
      says: [{ t0: 21.2, t1: 25.4, text: 'Not done yet!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.5, 1.1));
    UI.rise(this.panel, t, 0.9);
    const M = UI.MIN, sec = Math.max(0, Math.min(60, (t - LV_A) * 2.5)), i = M.at(sec), started = t >= LV_A - 0.4, done = t >= LV_B;
    const px = M.px[i], hi = M.hi[i], lo = M.lo[i];
    // Tape: the minute's path so far, with a dot at the last price.
    let d = '';
    for (let k = 0; k <= i; k++) d += (k ? 'L' : 'M') + lvX(k / 2).toFixed(1) + ' ' + lvY(M.px[k]).toFixed(1);
    this.path.setAttribute('d', d);
    this.path.style.opacity = started ? 1 : 0;
    this.dot.setAttribute('cx', lvX(i / 2).toFixed(1)); this.dot.setAttribute('cy', lvY(px).toFixed(1));
    this.dot.style.opacity = started ? (done ? 1 - eo(seg(t, LV_B, LV_B + 0.6)) : 1) : 0;
    this.open.style.opacity = eo(seg(t, LV_A - 0.6, LV_A)) * 0.9;
    this.open.setAttribute('stroke-dasharray', eio(seg(t, LV_A - 0.6, LV_A)) * 600 + ' 600');
    const up = px >= 60000, col = up ? 'var(--up)' : 'var(--down)';
    for (const [ln, v] of [[this.hi, hi], [this.lo, lo]]) {
      ln.setAttribute('x2', (LV_CX - 6).toFixed(1)); ln.setAttribute('y1', lvY(v).toFixed(1)); ln.setAttribute('y2', lvY(v).toFixed(1));
      ln.style.opacity = started ? 0.9 * (1 - ei(seg(t, LV_B + 3, LV_B + 4))) : 0;
    }
    this.last.setAttribute('x1', lvX(i / 2).toFixed(1)); this.last.setAttribute('x2', (LV_CX + 74).toFixed(1));
    this.last.setAttribute('y1', lvY(px).toFixed(1)); this.last.setAttribute('y2', lvY(px).toFixed(1));
    this.last.style.stroke = col; this.last.style.opacity = started ? 1 - eo(seg(t, LV_B, LV_B + 0.5)) : 0;
    this.pt.style.top = (lvY(px) - 22).toFixed(1) + 'px'; this.pt.style.background = col;
    this.pt.style.opacity = started ? 1 - eo(seg(t, LV_B, LV_B + 0.4)) : 0;
    UI.txt(this.pt, UI.fmt(px));
    // The candle: wick from running low to running high, body from open to the last price.
    const pop = eob(seg(t, LV_A - 0.4, LV_A + 0.2), 1.6);
    const sol = seg(t, LV_B, LV_B + 0.5);
    this.cd.set(0, { x: LV_CX, w: 110 * lerp(0.6, 1, pop), o: 60000, h: hi, l: lo, c: px, y: lvY, live: sol < 0.5, op: started ? eo(seg(t, LV_A - 0.4, LV_A)) : 0 });
    // Panel: clock, status and the four numbers.
    const ss = Math.floor(sec);
    UI.txt(this.clk, done ? '1:00' : '0:' + String(Math.min(59, ss)).padStart(2, '0'));
    this.bar.width = (sec / 60 * 100).toFixed(2) + '%';
    UI.txt(this.st, done ? 'Closed' : started ? 'Forming…' : 'Waiting');
    this.st.style.background = done ? 'var(--up)' : 'color-mix(in srgb, var(--main) 20%, transparent)';
    this.st.style.color = done ? 'var(--ground)' : 'var(--main)';
    this.st.style.transform = 'scale(' + (1 + 0.12 * Math.sin(Math.PI * sol)).toFixed(3) + ')';
    const vals = [60000, hi, lo, px];
    // How long ago (in scene seconds) the high / low last changed.
    const since = (arr) => { let k = i; while (k > 0 && arr[k - 1] === arr[i]) k--; return (sec - k / 2) / 2.5; };
    const flash = [seg(t, LV_A, LV_A + 1.6) > 0 && t < LV_A + 2.2 ? 1 : 0, hi > 60002 && since(M.hi) < 0.9 && !done ? 1 : 0, lo < 60000 && since(M.lo) < 0.9 && !done ? 1 : 0, done ? 1 - seg(t, LV_B + 4, LV_B + 5) : 0];
    const badge = ['First price', 'New high', 'New low', 'Final'];
    const bcol = ['var(--main)', 'var(--up)', 'var(--down)', 'var(--up)'];
    this.rows.forEach((r, k) => {
      UI.txt(r.v, started ? UI.fmt(vals[k]) : '–');
      r.v.style.color = k === 3 && started ? col : 'var(--second)';
      r.st.background = 'color-mix(in srgb, ' + bcol[k] + ' ' + (flash[k] * 16).toFixed(1) + '%, transparent)';
      UI.txt(r.b, badge[k]); r.b.style.background = bcol[k]; r.b.style.opacity = flash[k];
    });
    UI.txt(this.rows[3].l, done ? 'Close' : 'Last price');
    this.rows[3].l.style.color = done ? 'var(--up)' : '';
    this.rows[3].l.style.fontWeight = done ? '700' : '';
    this.sx.forEach((s) => { s.opacity = started ? 1 : 0; });
    this.tags.forEach((s, k) => {
      const p = seg(t, LV_TAGS[k][2], LV_TAGS[k][2] + 0.5);
      s.opacity = eo(p); s.transform = 'translateX(' + lerp(20, 0, eo(p)).toFixed(1) + 'px)';
    });
    this.tutor.render(t);
  },
});
