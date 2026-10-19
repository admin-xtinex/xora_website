const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const RL_T0 = 330, RL_T1 = 790, rlX = (p) => RL_T0 + (p - 59800) / 400 * (RL_T1 - RL_T0);
const RL_CX = 1180, rlY = (p) => 760 - (p - 59800) / 400 * 400;
const RL_ROWS = ['Open', 'High', 'Low', 'Close'], RL_RY = [420, 505, 590, 675];
// Dragged values: the open and the close follow these keys; high and low obey the rules.
const RL_O = [[0, 60000], [10.8, 60000], [13.0, 59900], [30, 59900]];
const RL_C = [[0, 60080], [5.6, 60080], [8.0, 60150], [15.4, 60150], [18.0, 59860], [30, 59860]];
const rlVals = (t) => {
  const o = UI.path(RL_O, t), c = UI.path(RL_C, t);
  const h = Math.max(60120, o, UI.path(RL_C, Math.min(t, 15.4)));
  const l = Math.min(59940, o, c);
  return [o, h, l, c].map(Math.round);
};
kit.scene('rules', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'rl-c', 1);
    let rows = '';
    RL_ROWS.forEach((n, i) => {
      const y = RL_RY[i];
      rows += '<line x1="' + RL_T0 + '" x2="' + RL_T1 + '" y1="' + y + '" y2="' + y + '" stroke-width="10" stroke-linecap="round" style="stroke:color-mix(in srgb, var(--second) 12%, transparent)"/>' +
        '<line class="rl-fill" x1="' + RL_T0 + '" y1="' + y + '" y2="' + y + '" stroke-width="10" stroke-linecap="round"/>' +
        '<circle class="rl-ring" cy="' + y + '" r="30" fill="none" stroke-width="4"/>' +
        '<circle class="rl-knob" cy="' + y + '" r="18" style="fill:var(--second)"/>' +
        '<text x="180" y="' + (y + 10) + '" style="fill:var(--second);font-size:30px;font-weight:600">' + n + '</text>' +
        '<rect class="rl-box" x="830" y="' + (y - 30) + '" width="140" height="60" rx="12" stroke-width="2" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main))"/>' +
        '<text class="rl-v mono" x="900" y="' + (y + 10) + '" text-anchor="middle" style="fill:var(--second);font-size:28px"></text>';
    });
    const rule = (cls, n, txt) => '<div class="' + cls + '" style="display:flex;align-items:center;gap:20px;padding:16px 20px;border-radius:18px"><svg width="44" height="44" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/><path class="' + cls + '-tk" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--up)"/></svg>' +
      '<div><p class="kick" style="margin:0;font-size:20px">' + n + '</p><p style="margin:4px 0 0;font-size:30px;font-weight:700">' + txt + '</p></div></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass rl-panel" style="left:140px;top:330px;width:880px;height:430px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + rows + this.cd.html + '</svg>' +
      '<p class="fict rl-f" style="position:absolute;left:180px;top:352px;margin:0">Drag or type a price · fictional</p>' +
      '<div class="glass rl-rules" style="left:1300px;top:330px;width:480px;padding:16px 14px;display:flex;flex-direction:column;gap:8px">' +
      rule('rl-r1', 'Rule 1', 'High ≥ open and close') + rule('rl-r2', 'Rule 2', 'Low ≤ open and close') + '</div>' +
      '<p class="chip rl-ok" style="position:absolute;left:1300px;top:690px;margin:0;font-size:26px;padding:12px 24px">Every real candle obeys both</p>' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick rl-k">Try the sliders</p>' +
      '<h2 class="line rl-t">Two rules every candle follows</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.rl-k').style; this.t = q('.rl-t'); this.panel = q('.rl-panel').style; this.f = q('.rl-f').style;
    this.fill = all('.rl-fill'); this.ring = all('.rl-ring'); this.knob = all('.rl-knob'); this.box = all('.rl-box'); this.v = all('.rl-v');
    this.svgRows = [this.fill, this.ring, this.knob, this.box, this.v];
    this.rules = q('.rl-rules').style; this.r1 = q('.rl-r1').style; this.r2 = q('.rl-r2').style; this.ok = q('.rl-ok').style;
    this.tk = [q('.rl-r1-tk'), q('.rl-r2-tk')];
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.4, pose: 'checklist' }, { t: 5.0, pose: 'point', flip: true }, { t: 14.9, pose: 'think' }, { t: 19.5, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.panel, t, 0.6); this.f.opacity = 0.9 * eo(seg(t, 1.0, 1.4));
    const rowsOn = eo(seg(t, 1.0, 1.6));
    for (const list of this.svgRows) list.forEach((e) => { e.style.opacity = rowsOn; });
    const v = rlVals(t), pv = rlVals(Math.max(0, t - 0.15));
    // Which slider is being dragged, and which one is being pushed by a rule.
    const drag = t >= 5.4 && t < 8.2 ? 3 : t >= 10.6 && t < 13.2 ? 0 : t >= 15.2 && t < 18.2 ? 3 : -1;
    const pushed = [0, 1, 2, 3].map((i) => (i === 1 || i === 2) && v[i] !== pv[i]);
    const p1 = pushed[1] || (t > 7.0 && t < 8.6 && v[1] > 60120), p2 = pushed[2] || (t > 12.0 && t < 13.6) || (t > 17.4 && t < 18.6);
    v.forEach((p, i) => {
      const x = rlX(p), hot = i === drag, push = (i === 1 && p1) || (i === 2 && p2);
      const col = push ? 'var(--accent)' : 'var(--main)';
      this.fill[i].setAttribute('x2', x.toFixed(1)); this.fill[i].style.stroke = col;
      this.knob[i].setAttribute('cx', x.toFixed(1));
      this.knob[i].setAttribute('r', hot || push ? 21 : 18);
      this.ring[i].setAttribute('cx', x.toFixed(1)); this.ring[i].style.stroke = col;
      this.ring[i].setAttribute('r', (30 + 4 * Math.sin(t * 6)).toFixed(1));
      this.ring[i].style.opacity = (hot || push ? 1 : 0) * rowsOn;
      this.box[i].style.stroke = hot || push ? col : 'color-mix(in srgb, var(--main) 30%, transparent)';
      UI.txt(this.v[i], UI.fmt(p));
      this.v[i].style.fill = push ? 'var(--accent)' : 'var(--second)';
    });
    this.cd.set(0, { x: RL_CX, w: 110, o: v[0], h: v[1], l: v[2], c: v[3], y: rlY, op: eo(seg(t, 1.2, 1.8)) });
    UI.rise(this.rules, t, 2.0);
    this.r1.background = 'color-mix(in srgb, var(--accent) ' + ((p1 ? 1 : 0) * 18 + 12 * Math.sin(Math.PI * seg(t, 5.0, 6.4))).toFixed(1) + '%, transparent)';
    this.r2.background = 'color-mix(in srgb, var(--accent) ' + ((p2 ? 1 : 0) * 18 + 12 * Math.sin(Math.PI * seg(t, 10.2, 11.6))).toFixed(1) + '%, transparent)';
    this.tk.forEach((e, i) => e.setAttribute('stroke-dasharray', eo(seg(t, 19.6 + i * 0.5, 20.1 + i * 0.5)) + ' 1'));
    UI.rise(this.ok, t, 20.8, { s: 0.9 });
    this.tutor.render(t);
  },
});
