const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Same 1,000 USDT position: 10x puts in 100 USDT, 4x puts in 250 USDT. A 5% fall costs 50 USDT in both.
const RM_K = 3.6; // px per USDT
kit.scene('room', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (cls, lev, m) => '<div class="glass ' + cls + '" style="position:relative;width:1300px;height:150px;padding:18px 30px">' +
      '<div style="display:flex;align-items:baseline;gap:18px"><span class="chip mono" style="font-size:28px;padding:6px 20px">' + lev + '</span><span style="font-size:26px;font-weight:600">Margin <span class="mono">' + m + ' USDT</span></span>' +
      '<span class="mono ' + cls + '-v" style="margin-left:auto;font-size:30px"></span></div>' +
      '<div style="position:absolute;left:30px;top:84px;width:' + (m * RM_K) + 'px;height:40px;border-radius:10px;border:2px dashed color-mix(in srgb, var(--second) 25%, transparent)"><div class="' + cls + '-f" style="position:absolute;left:0;top:0;bottom:0;border-radius:8px;background:var(--main)"></div>' +
      '<div class="' + cls + '-cut" style="position:absolute;top:-2px;bottom:-2px;border-radius:8px;background:color-mix(in srgb, var(--accent) 45%, transparent);border:2px solid var(--accent)"></div></div></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick rm-k">Leverage and room</p>' +
      '<h2 class="line rm-t" style="font-size:72px">Same position, different room</h2>' +
      '<p class="fict rm-f" style="margin:0">Both: 1,000 USDT notional, long · fictional · before fees and funding</p></div>' +
      '<div style="position:absolute;left:140px;top:370px;display:flex;flex-direction:column;gap:20px">' + row('rm-a', '10x', 100) + row('rm-b', '4x', 250) + '</div>' +
      '<div class="chip rm-c" style="position:absolute;left:140px;top:720px;font-size:28px;padding:12px 26px;background:color-mix(in srgb, var(--ground) 70%, var(--accent));border-color:var(--accent)">More room is not safety</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.rm-k').style; this.t = q('.rm-t'); this.f = q('.rm-f').style;
    this.rows = [q('.rm-a').style, q('.rm-b').style]; this.c = q('.rm-c').style;
    this.v = [q('.rm-a-v'), q('.rm-b-v')]; this.fl = [q('.rm-a-f').style, q('.rm-b-f').style]; this.cut = [q('.rm-a-cut').style, q('.rm-b-cut').style];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 8.7, pose: 'point', flip: true }, { t: 15.2, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.f.opacity = 0.9 * eo(seg(t, 1.0, 1.5));
    this.rows.forEach((s, i) => UI.rise(kit, s, t, 3.9 + i * 1.4, 0.7));
    // The 5% fall: the same 50 USDT chunk is cut from both bars.
    const cp = eio(seg(t, 9.2, 10.6));
    [100, 250].forEach((m, i) => {
      const lost = 50 * cp, left = m - lost;
      this.fl[i].width = (left * RM_K).toFixed(1) + 'px';
      this.fl[i].background = left / m < 0.6 ? 'var(--accent)' : 'var(--main)';
      this.cut[i].left = (left * RM_K).toFixed(1) + 'px'; this.cut[i].width = (lost * RM_K).toFixed(1) + 'px'; this.cut[i].opacity = cp > 0 ? 1 : 0;
      UI.set(this.v[i], t < 9.2 ? m + ' USDT left' : UI.fmt(Math.round(left)) + ' of ' + m + ' left · ' + Math.round(lost / m * 100) + '% gone');
      this.v[i].style.color = t < 9.2 ? 'var(--second)' : 'var(--accent)';
    });
    const c = seg(t, 15.2, 15.8);
    this.c.opacity = eo(c); this.c.transform = 'scale(' + lerp(0.7, 1, eob(c, 1.7)).toFixed(3) + ')';
    this.tutor.render(t);
  },
});
