const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Scalping (many short trades) next to holding longer (one long trade): same week, different shape.
const CO_ROWS = [['Holding time', 'Seconds to minutes', 'Days to weeks'], ['Trades', 'Many', 'Few'], ['Costs vs move', 'Big share', 'Smaller share'], ['Main danger', 'Fast mistakes, noise', 'News, overnight swings']];
const CO_SC = [0.04, 0.14, 0.22, 0.35, 0.47, 0.6, 0.72, 0.85];
kit.scene('compare', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (k) => {
      const L = k ? 960 : 140, col = k ? 'var(--accent)' : 'var(--main)';
      let rows = '';
      CO_ROWS.forEach((r, i) => { rows += '<div class="row co-r' + k + '"' + (i === 3 ? ' style="border:0"' : '') + '><span>' + r[0] + '</span><span style="font-size:28px;font-weight:700;color:' + col + '">' + r[1 + k] + '</span></div>'; });
      let segs = '';
      if (k) segs = '<rect class="co-s1" x="' + (L + 70) + '" y="372" width="560" height="24" rx="12" style="fill:' + col + '"/>';
      else CO_SC.forEach((a) => { segs += '<rect class="co-s0" x="' + (L + 40 + a * 660).toFixed(0) + '" y="372" width="22" height="24" rx="6" style="fill:' + col + '"/>'; });
      return '<div class="glass co-c" style="left:' + L + 'px;top:300px;width:760px;height:400px;padding:20px 32px"><p class="kick" style="margin:0 0 70px;color:' + col + '">' + (k ? 'Holding longer' : 'Scalping') + '</p>' + rows + '</div>' +
        '<svg class="art" viewBox="0 0 1920 1080"><line x1="' + (L + 40) + '" x2="' + (L + 720) + '" y1="384" y2="384" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 25%, transparent)"/>' + segs + '</svg>';
    };
    kit.stage.append(kit.h('<div class="ground">' + card(0) + card(1) +
      '<p class="fict" style="position:absolute;right:200px;top:262px;margin:0">Each bar on the line is one trade · illustrative</p>' +
      '<div style="position:absolute;left:0;right:0;top:716px;display:flex;justify-content:center"><p class="chip co-n" style="margin:0;font-size:30px;padding:12px 32px;border-color:var(--down);background:color-mix(in srgb, var(--ground) 70%, var(--down))">Neither is safe. Both can lose money.</p></div>' +
      '<div class="words" style="left:140px;top:160px;width:1100px"><p class="kick co-k">Compare</p>' +
      '<h2 class="line co-t">Minutes or weeks?</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.co-k').style; this.t = q('.co-t'); this.cs = all('.co-c').map((e) => e.style); this.n = q('.co-n').style;
    this.r0 = all('.co-r0').map((e) => e.style); this.r1 = all('.co-r1').map((e) => e.style);
    this.s0 = all('.co-s0').map((e) => e.style); this.s1 = q('.co-s1').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'present' }, { t: 5.3, pose: 'point', flip: true }, { t: 11.1, pose: 'explain' }, { t: 17.0, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cs.forEach((s, k) => UI.rise(s, t, 0.8 + k * 0.3));
    this.s0.forEach((s, i) => { const p = seg(t, 5.4 + i * 0.25, 5.7 + i * 0.25); s.opacity = eo(p); s.transformBox = 'fill-box'; s.transformOrigin = '0 50%'; s.transform = 'scaleX(' + eo(p).toFixed(3) + ')'; });
    const l = seg(t, 11.2, 13.2);
    this.s1.opacity = l > 0 ? 1 : 0; this.s1.transformBox = 'fill-box'; this.s1.transformOrigin = '0 50%'; this.s1.transform = 'scaleX(' + Math.max(0.04, eio(l)).toFixed(3) + ')';
    this.r0.forEach((s, i) => { s.opacity = eo(seg(t, 6.0 + i * 0.9, 6.4 + i * 0.9)); });
    this.r1.forEach((s, i) => { s.opacity = eo(seg(t, 11.8 + i * 0.9, 12.2 + i * 0.9)); });
    UI.rise(this.n, t, 17.2);
    this.tutor.render(t);
  },
});
