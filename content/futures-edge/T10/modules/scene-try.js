const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TRY_R = 70, TRY_C = 2 * Math.PI * TRY_R;
const TY_K = 0.5, TY_X = 880, TY_Y = 200;
const ty = (r) => ({ x: TY_X + (r.x - 100) * TY_K, y: TY_Y + (r.y - 120) * TY_K, w: r.w * TY_K, h: r.h * TY_K });
// [letter, region]: A chart, B order book, C positions (the answer), D watchlist.
const TY_SPOTS = [['A', 'chart'], ['B', 'book'], ['C', 'pos'], ['D', 'wl']];
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    // A simplified map of the mock screen.
    let art = '';
    const rect = (r, extra) => '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="10" style="fill:color-mix(in srgb, var(--ground) 86%, var(--main));stroke:color-mix(in srgb, var(--main) 30%, transparent);stroke-width:2' + (extra || '') + '"/>';
    ['top', 'wl', 'chart', 'book', 'entry', 'pos'].forEach((k) => { art += rect(ty(UI.R[k])); });
    const c = ty(UI.R.chart), b = ty(UI.R.book), w = ty(UI.R.wl), e = ty(UI.R.entry), p = ty(UI.R.pos), tp = ty(UI.R.top);
    for (let i = 0; i < 12; i++) { const x = c.x + 30 + i * 25, h = 20 + ((i * 37) % 30), y = c.y + 90 + ((i * 53) % 40); art += '<rect x="' + x + '" y="' + y + '" width="10" height="' + h + '" rx="2" style="fill:' + (i % 3 ? 'var(--main)' : 'var(--accent)') + ';opacity:.6"/>'; }
    for (let i = 0; i < 8; i++) art += '<rect x="' + (b.x + 14) + '" y="' + (b.y + 28 + i * 20 + (i > 3 ? 12 : 0)) + '" width="' + (60 + ((i * 29) % 70)) + '" height="10" rx="3" style="fill:' + (i < 4 ? 'var(--accent)' : 'var(--main)') + ';opacity:.6"/>';
    for (let i = 0; i < 5; i++) art += '<rect x="' + (w.x + 14) + '" y="' + (w.y + 40 + i * 28) + '" width="' + (w.w - 28) + '" height="12" rx="3" style="fill:color-mix(in srgb, var(--second) 25%, transparent)"/>';
    art += '<rect x="' + (e.x + 14) + '" y="' + (e.y + 200) + '" width="' + (e.w - 28) + '" height="26" rx="6" style="fill:var(--main);opacity:.7"/><rect x="' + (e.x + 14) + '" y="' + (e.y + 234) + '" width="' + (e.w - 28) + '" height="26" rx="6" style="fill:var(--accent);opacity:.7"/>';
    for (let i = 0; i < 2; i++) art += '<rect x="' + (p.x + 14) + '" y="' + (p.y + 26 + i * 26) + '" width="' + (p.w - 28) + '" height="10" rx="3" style="fill:color-mix(in srgb, var(--second) 22%, transparent)"/>';
    art += '<rect x="' + (tp.x + 14) + '" y="' + (tp.y + 12) + '" width="110" height="12" rx="3" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/>';
    let spots = '';
    TY_SPOTS.forEach((s) => {
      const r = ty(UI.R[s[1]]);
      spots += '<div class="ty-o" style="position:absolute;left:' + (r.x - 4) + 'px;top:' + (r.y - 4) + 'px;width:' + (r.w + 8) + 'px;height:' + (r.h + 8) + 'px;box-sizing:border-box;border-radius:14px;border:3px solid var(--main)"></div>' +
        '<div class="ty-b mono" style="position:absolute;left:' + (r.x + r.w / 2) + 'px;top:' + (r.y + r.h / 2) + 'px;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;display:grid;place-items:center;font-size:34px;font-weight:600;background:var(--ground);border:3px solid var(--main)">' + s[0] + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:700px"><p class="kick tr-k">Your turn · hotspot hunt</p>' +
      '<h2 class="line tr-t">Find it on the screen</h2></div>' +
      '<div class="glass tr-q" style="left:140px;top:420px;width:680px;padding:28px 36px"><p class="fict" style="margin:0 0 12px">Question</p>' +
      '<p class="def" style="margin:0">Where would you look to see your <b>unrealized PnL</b>?</p></div>' +
      '<div class="glass tr-a" style="left:140px;top:600px;width:680px;padding:22px 32px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 76%, var(--main))"><p style="margin:0;font-size:32px;font-weight:700"><span class="hl">C · Positions panel.</span> It lists your open positions and their PnL.</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="tr-map">' + art + '</g>' +
      '<g class="tr-ring" transform="translate(1320 640)"><circle r="' + TRY_R + '" fill="none" stroke-width="12" style="stroke:color-mix(in srgb, var(--second) 10%, transparent)"/>' +
      '<circle class="tr-arc" r="' + TRY_R + '" fill="none" stroke-width="12" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="' + TRY_C.toFixed(1) + '" style="stroke:var(--main)"/>' +
      '<text class="tr-n mono" y="24" text-anchor="middle" style="fill:var(--second);font-size:64px"></text></g></svg>' +
      spots +
      '<div class="glass tr-w" style="left:880px;top:560px;width:870px;padding:20px 30px;border-color:var(--accent)"><p style="margin:0;font-size:30px;font-weight:600;line-height:1.35"><span style="color:var(--accent)">Not A, the chart:</span> it shows the market price, not your own result.</p></div>' +
      '<p class="fict tr-f" style="position:absolute;left:880px;top:160px;margin:0">Simplified map of the educational mock</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.tr-k').style; this.t = q('.tr-t'); this.qc = q('.tr-q').style; this.a = q('.tr-a').style; this.w = q('.tr-w').style;
    this.map = q('.tr-map').style; this.f = q('.tr-f').style; this.ring = q('.tr-ring').style; this.arc = q('.tr-arc'); this.n = q('.tr-n');
    this.os = all('.ty-o').map((e) => e.style); this.bs = all('.ty-b').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.5, pose: 'present' }, { t: 3.6, pose: 'think' }, { t: 9.2, pose: 'cheer' }, { t: 16.0, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const qp = seg(t, 0.8, 1.5);
    this.qc.opacity = eo(qp); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qp)) + 'px)';
    const mp = seg(t, 1.0, 1.8);
    this.map.opacity = eo(mp); this.f.opacity = 0.9 * eo(mp);
    TY_SPOTS.forEach((s, i) => {
      const a = 1.8 + i * 0.3, p = seg(t, a, a + 0.5), ans = seg(t, 9.2, 9.7), wr = seg(t, 16.0, 16.5);
      const right = i === 2, isA = i === 0;
      this.bs[i].opacity = (eo(p) * (right ? 1 : 1 - 0.65 * eo(ans) + (isA ? 0.65 * eo(wr) : 0))).toFixed(3);
      this.bs[i].transform = 'scale(' + (lerp(0.6, 1, eob(p, 1.7)) * (right ? 1 + 0.2 * Math.sin(Math.PI * ans) : 1)).toFixed(4) + ')';
      this.bs[i].background = right && ans > 0 ? 'var(--main)' : isA && wr > 0 ? 'var(--accent)' : 'var(--ground)';
      this.bs[i].color = right && ans > 0 ? 'var(--ground)' : 'var(--second)';
      this.bs[i].borderColor = isA && wr > 0 ? 'var(--accent)' : 'var(--main)';
      this.os[i].opacity = (right ? eo(ans) : isA ? eo(wr) * (1 - eo(seg(t, 20.6, 21.2))) : 0).toFixed(3);
      this.os[i].borderColor = isA ? 'var(--accent)' : 'var(--main)';
    });
    const r = seg(t, 3.0, 3.5);
    this.ring.opacity = (eo(r) * (1 - ei(seg(t, 8.8, 9.3)))).toFixed(3);
    const cd = seg(t, 3.6, 8.6);
    this.arc.setAttribute('stroke-dashoffset', (TRY_C * cd).toFixed(1));
    const left = Math.max(0, Math.ceil(5 - (t - 3.6)));
    UI.set(this.n, t < 3.6 ? '5' : String(Math.min(5, left)));
    const a = seg(t, 9.4, 10.1);
    this.a.opacity = eo(a); this.a.transform = 'scale(' + lerp(0.92, 1, eob(a, 1.6)) + ')'; this.a.transformOrigin = '0 50%';
    const w = seg(t, 16.0, 16.6);
    this.w.opacity = eo(w); this.w.transform = 'translateY(' + lerp(20, 0, eo(w)) + 'px)';
    this.tutor.render(t);
  },
});
