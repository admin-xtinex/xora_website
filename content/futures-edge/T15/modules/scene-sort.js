const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// [text, bin (0 view, 1 market), landing x, y, appears at]
const SO = [['Switch from 1m to 5m', 0, 330, 560, 1.6], ['Candles get wider', 0, 650, 650, 3.6], ['A trade at 59,920', 1, 1110, 560, 6.4], ['Price climbs to 60,170', 1, 1420, 650, 8.4]];
kit.scene('sort', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const bin = (cls, x, label, sub, col) => '<div class="glass ' + cls + '" style="left:' + x + 'px;top:400px;width:740px;height:330px;padding:18px 26px"><p class="kick" style="margin:0;color:' + col + '">' + label + '</p><p style="margin:6px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">' + sub + '</p></div>';
    let chips = '';
    SO.forEach((s) => { chips += '<span class="chip so-c" style="position:absolute;left:' + s[2] + 'px;top:' + s[3] + 'px;font-size:28px;padding:12px 24px;' + (s[1] ? 'background:color-mix(in srgb, var(--ground) 72%, var(--accent));border-color:var(--accent)' : 'background:color-mix(in srgb, var(--ground) 70%, var(--main));border-color:var(--main)') + '">' + s[0] + '</span>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick so-k">Quick check</p>' +
      '<h2 class="line so-t">The view, or the market?</h2></div>' +
      bin('so-b0', 140, 'Just the view', 'how the same trades are grouped', 'var(--main)') + bin('so-b1', 920, 'The market', 'something real happened', 'var(--accent)') + chips +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.so-k').style; this.t = q('.so-t');
    this.bins = [q('.so-b0').style, q('.so-b1').style];
    this.chips = [...kit.stage.querySelectorAll('.so-c')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'think' }, { t: 5.9, pose: 'explain' }, { t: 12.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const bp = seg(t, 0.6, 1.3);
    this.bins.forEach((b) => { b.opacity = eo(bp); b.transform = 'translateY(' + lerp(30, 0, eo(bp)) + 'px)'; });
    const glow = [0, 0];
    this.chips.forEach((c, i) => {
      const s = SO[i], a = s[4];
      const show = seg(t, a, a + 0.4), move = seg(t, a + 1.2, a + 1.9);
      const sx = 960 - s[2], sy = 330 - s[3], e = eio(move);
      c.opacity = eo(show);
      c.transform = 'translate(-50%,-50%) translate(' + lerp(sx, 0, e).toFixed(1) + 'px,' + (lerp(sy, 0, e) - Math.sin(Math.PI * move) * 60).toFixed(1) + 'px) scale(' + (lerp(1.25, 1, e) * lerp(0.7, 1, eob(show, 1.7))).toFixed(4) + ')';
      const land = seg(t, a + 1.9, a + 2.5);
      if (land > 0 && land < 1) glow[s[1]] = Math.max(glow[s[1]], Math.sin(Math.PI * land));
    });
    this.bins.forEach((b, i) => { b.borderColor = 'color-mix(in srgb, ' + (i ? 'var(--accent)' : 'var(--main)') + ' ' + (22 + glow[i] * 60).toFixed(0) + '%, transparent)'; });
    this.tutor.render(t);
  },
});
