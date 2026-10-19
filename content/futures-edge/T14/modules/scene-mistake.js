const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MK_X = 700, MK_X0 = 260, MK_X1 = 580, mkY = (p) => 740 - (p - 59940) / 300 * 380, mkX = (s) => MK_X0 + (MK_X1 - MK_X0) * s / 60;
const MK_K = [[0, 60000], [10, 59980], [25, 60080], [35, 60200], [48, 60090], [60, 60040]];
const MK_A = 5.4, MK_B = 9.6;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'mk-c', 1);
    const row = (cls, ok, txt) => '<div class="' + cls + '" style="display:flex;align-items:center;gap:18px"><span style="flex:none;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:28px;font-weight:700;color:var(--ground);background:' + (ok ? 'var(--up)' : 'var(--accent)') + '">' + (ok ? '✓' : '✗') + '</span><span style="font-size:30px;font-weight:600">' + txt + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="mk-grid">' + UI.gridL(240, 900, mkY, 59950, 60200, 50) + '</g>' +
      '<path class="mk-path" fill="none" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" style="stroke:var(--main)"/>' +
      '<line class="mk-guide" x1="' + MK_X0 + '" x2="' + (MK_X + 60) + '" stroke-width="2" stroke-dasharray="4 6" style="stroke:color-mix(in srgb, var(--second) 45%, transparent)"/>' +
      this.cd.html + '<circle class="mk-dot" r="9" style="fill:var(--second)"/></svg>' +
      '<p class="tag mk-w" style="left:' + (MK_X + 70) + 'px;top:' + (mkY(60200) - 24).toFixed(1) + 'px;border-color:var(--accent)">Close = 60,200?</p>' +
      '<div class="mk-x" style="position:absolute;left:' + (MK_X + 62) + 'px;top:' + (mkY(60200) - 2).toFixed(1) + 'px;height:5px;border-radius:3px;background:var(--accent);width:240px"></div>' +
      '<p class="tag mk-r" style="left:' + (MK_X + 70) + 'px;top:' + (mkY(60040) - 24).toFixed(1) + 'px;border-color:var(--up);color:var(--up)">Close = 60,040 ✓</p>' +
      '<p class="tag mk-h" style="left:' + (MK_X + 70) + 'px;top:' + (mkY(60200) - 24).toFixed(1) + 'px">High = 60,200</p>' +
      '<div class="glass mk-card" style="left:1140px;top:330px;width:520px;padding:28px 32px;display:flex;flex-direction:column;gap:22px">' +
      row('mk-r1', false, 'The wick top is the close') + row('mk-r2', true, 'The close is a body edge') +
      '<div class="rule mk-rl" style="width:100%"></div>' +
      '<p class="def mk-d" style="margin:0;font-size:30px">Wick tips: <b>high</b> and <b>low</b>.<br>Body edges: <b>open</b> and <b>close</b>.</p></div>' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick mk-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line mk-t">The wick is not the close</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.grid = q('.mk-grid').style;
    this.path = q('.mk-path'); this.dot = q('.mk-dot'); this.guide = q('.mk-guide');
    this.w = q('.mk-w').style; this.x = q('.mk-x').style; this.r = q('.mk-r').style; this.h = q('.mk-h').style;
    this.card = q('.mk-card').style; this.r1 = q('.mk-r1').style; this.r2 = q('.mk-r2').style; this.rl = q('.mk-rl').style; this.d = q('.mk-d');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'confused' }, { t: 5.2, pose: 'magnify' }, { t: 10.4, pose: 'point', flip: true }, { t: 16.4, pose: 'thumbs' }],
      says: [{ t0: 1.6, t1: 4.6, text: 'Hmm, is it?' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    this.cd.set(0, { x: MK_X, w: 100, o: 60000, h: 60200, l: 59980, c: 60040, y: mkY, op: eo(seg(t, 0.5, 1.0)) });
    const wp = seg(t, 1.4, 1.9);
    this.w.opacity = eo(wp) * (1 - ei(seg(t, 10.0, 10.5)));
    this.w.transform = 'translateX(' + lerp(20, 0, eo(wp)).toFixed(1) + 'px)';
    this.x.opacity = this.w.opacity; this.x.transformOrigin = '0 50%'; this.x.transform = 'scaleX(' + eo(seg(t, 4.6, 5.0)) + ')';
    // Replay the minute: price touches 60,200 but ends at 60,040.
    const f = seg(t, MK_A, MK_B), sec = f * 60;
    let d = '';
    for (let s = 0; s <= sec + 1e-6; s += 0.5) d += (s ? 'L' : 'M') + mkX(s).toFixed(1) + ' ' + mkY(UI.path(MK_K, s)).toFixed(1);
    this.path.setAttribute('d', d || 'M0 0');
    this.path.style.opacity = t >= MK_A ? 1 : 0;
    const py = mkY(UI.path(MK_K, sec));
    this.dot.setAttribute('cx', mkX(sec).toFixed(1)); this.dot.setAttribute('cy', py.toFixed(1));
    this.dot.style.opacity = t >= MK_A ? 1 : 0;
    this.guide.setAttribute('x1', mkX(sec).toFixed(1)); this.guide.setAttribute('y1', py.toFixed(1)); this.guide.setAttribute('y2', py.toFixed(1));
    this.guide.style.opacity = t >= MK_A ? 1 : 0;
    const rp = seg(t, 10.4, 10.9);
    this.r.opacity = eo(rp); this.r.transform = 'translateX(' + lerp(20, 0, eo(rp)).toFixed(1) + 'px) scale(' + lerp(0.9, 1, eob(rp, 1.6)).toFixed(3) + ')';
    const hp = seg(t, 11.0, 11.5);
    this.h.opacity = eo(hp); this.h.transform = 'translateX(' + lerp(20, 0, eo(hp)).toFixed(1) + 'px)';
    UI.rise(this.card, t, 4.6);
    UI.rise(this.r1, t, 4.8); UI.rise(this.r2, t, 10.6);
    this.rl.opacity = eo(seg(t, 16.2, 16.6));
    TextFx.fadeFromRight(this.d, t, 16.4, { stagger: 0.06 });
    this.tutor.render(t);
  },
});
