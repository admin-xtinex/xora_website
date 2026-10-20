const { seg, eo, ei, eob, eio, lerp, clamp01 } = kit;
// Four mini charts, each a price path through keys [[s, v]] (s: 0..1 of the animation, v: 0 bottom .. 1 top) and a level line.
const SU = [
  ['Reaction at support', 'Dips into the zone, bounces', 'var(--up)', 0.3, [[0, 0.75], [0.35, 0.35], [0.5, 0.26], [0.65, 0.42], [1, 0.7]], 5.2],
  ['Rejection at resistance', 'Pokes into the zone, turns down', 'var(--down)', 0.7, [[0, 0.25], [0.35, 0.62], [0.5, 0.74], [0.65, 0.58], [1, 0.3]], 8.4],
  ['Breakout', 'Closes beyond a level', 'var(--main)', 0.55, [[0, 0.3], [0.3, 0.5], [0.45, 0.4], [0.7, 0.62], [1, 0.82]], 12.1],
  ['Retest', 'Comes back to the broken level, holds', 'var(--accent)', 0.5, [[0, 0.3], [0.3, 0.68], [0.55, 0.52], [0.7, 0.55], [1, 0.8]], 15.0],
];
const SU_W = 330, SU_H = 150;
const SU_V = (keys, s) => { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (s >= a[0]) v = lerp(a[1], b[1], eio(clamp01((s - a[0]) / (b[0] - a[0])))); } return v; };
kit.scene('setups', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let html = '';
    SU.forEach((s, i) => {
      const x = 140 + (i % 2) * 780, y = 290 + Math.floor(i / 2) * 230, ly = (SU_H - s[3] * SU_H).toFixed(1);
      html += '<div class="glass su-c" style="left:' + x + 'px;top:' + y + 'px;width:750px;height:210px;padding:20px 26px;display:flex;gap:24px;align-items:center">' +
        '<svg width="' + SU_W + '" height="' + SU_H + '" viewBox="0 0 ' + SU_W + ' ' + SU_H + '" style="flex:none;overflow:visible">' +
        (i === 0 || i === 1 ? '<rect x="0" y="' + (+ly - 14) + '" width="' + SU_W + '" height="28" rx="6" style="fill:color-mix(in srgb, ' + s[2] + ' 18%, transparent)"/>' : '') +
        '<line x1="0" x2="' + SU_W + '" y1="' + ly + '" y2="' + ly + '" stroke-width="2.5" stroke-dasharray="8 6" style="stroke:' + s[2] + '"/>' +
        '<path class="su-p" fill="none" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" style="stroke:var(--second)"/><circle class="su-d" r="8" style="fill:' + s[2] + '"/></svg>' +
        '<div style="display:flex;flex-direction:column;gap:8px"><span style="font-size:32px;font-weight:700;line-height:1.15">' + s[0] + '</span><span style="font-size:28px;line-height:1.3;color:color-mix(in srgb, var(--second) 66%, var(--ground))">' + s[1] + '</span></div></div>';
    });
    kit.stage.append(kit.h('<div>' + html + '</div>'));
    this.head = UI.head(kit, 'Step 5 · candidate setups', 'The shapes XORA looks for');
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.cs = all('.su-c').map((e) => e.style); this.ps = all('.su-p'); this.ds = all('.su-d');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 5.2, pose: 'pointer' }, { t: 12.1, pose: 'explain' }, { t: 18.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    SU.forEach((s, i) => {
      UI.rise(kit, this.cs[i], t, 1.0 + i * 0.3, 0.6, 24);
      const k = clamp01((t - s[5]) / 2.6);
      let d = '';
      for (let j = 0; j <= 60 * k; j++) { const u = j / 60; d += (j ? 'L' : 'M') + (u * SU_W).toFixed(1) + ' ' + (SU_H - SU_V(s[4], u) * SU_H).toFixed(1); }
      this.ps[i].setAttribute('d', d || 'M0 0');
      this.ds[i].setAttribute('cx', (k * SU_W).toFixed(1)); this.ds[i].setAttribute('cy', (SU_H - SU_V(s[4], k) * SU_H).toFixed(1));
      this.ds[i].style.opacity = t > s[5] ? 1 : 0;
      UI.glow(this.cs[i], eo(seg(t, s[5], s[5] + 0.3)) * (1 - ei(seg(t, s[5] + 2.6, s[5] + 3.2))));
    });
    this.tutor.render(t);
  },
});
