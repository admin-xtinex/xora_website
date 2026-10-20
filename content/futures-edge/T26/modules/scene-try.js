const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Pause and answer: BUY 68% / 70%, safety checks fine. What happens?
const TR_OPT = [['A', 'XORA buys now: 68% is a high score.', 'Below your minimum of 70.'], ['B', 'No trade yet: the score is below your minimum.', ''], ['C', 'XORA buys: it has a 68% chance to win.', 'Confidence is not a chance of winning.']];
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let opts = '';
    TR_OPT.forEach((o) => {
      opts += '<div class="glass tr-o" style="position:relative;width:1060px;padding:10px 28px;display:flex;align-items:center;gap:22px">' +
        '<span class="mono tr-l" style="flex:none;width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:28px;border:2px solid var(--main);color:var(--main)">' + o[0] + '</span>' +
        '<span style="font-size:30px;font-weight:600;flex:1">' + o[1] + '</span>' +
        (o[2] ? '<span class="tr-w" style="font-size:24px;font-weight:600;color:var(--down);max-width:300px;text-align:right">✗ ' + o[2] + '</span>' : '') + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1100px"><p class="kick tr-k">Your turn</p>' +
      '<h2 class="line tr-t">What does XORA do?</h2></div>' +
      '<div class="glass tr-q" style="left:140px;top:290px;width:1060px;padding:18px 30px"><p class="fict" style="margin:0 0 12px">Entry checklist · fictional numbers</p>' +
      '<div style="display:flex;align-items:center;gap:18px"><span class="pill" style="color:var(--up)">BUY</span><span class="lbl">at support</span>' +
      '<span class="mono" style="margin-left:auto;font-size:34px">68%<span style="color:color-mix(in srgb, var(--second) 50%, var(--ground))"> / 70%</span></span></div>' +
      '<div style="position:relative;height:14px;border-radius:7px;margin:14px 0 12px;background:color-mix(in srgb, var(--second) 10%, transparent)"><div style="height:100%;width:68%;border-radius:7px;background:var(--up)"></div><div style="position:absolute;left:70%;top:-6px;width:3px;height:26px;background:var(--second)"></div></div>' +
      '<p style="margin:0;font-size:28px">Spread, liquidity and data: all fine.</p></div>' +
      '<div class="tr-os" style="position:absolute;left:140px;top:488px;display:flex;flex-direction:column;gap:10px">' + opts + '</div></div>'));
    this.ring = UI.ring(kit, 1500, 560, 110, 5.6, 6.4, 5, 11.8, 'Pause and think');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.tr-k').style; this.t = q('.tr-t'); this.qc = q('.tr-q').style;
    this.os = all('.tr-o').map((e) => e.style); this.ls = all('.tr-l').map((e) => e.style); this.ws = all('.tr-w').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: 6.4, pose: 'think' }, { t: 12.0, pose: 'cheer' }, { t: 17.2, pose: 'explain' }],
      says: [{ t0: 0.8, t1: 4.8, text: 'Pause if you need to!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.qc, t, 1.0, 0.6, 24);
    const ans = seg(t, 12.0, 12.5);
    this.os.forEach((s, i) => {
      UI.rise(kit, s, t, 2.4 + i * 0.6, 0.6, 20);
      if (i === 1) {
        s.borderColor = ans > 0 ? 'var(--up)' : '';
        s.background = 'color-mix(in srgb, var(--up) ' + (18 * eo(ans)).toFixed(1) + '%, var(--ground))';
        s.transform += ' scale(' + lerp(1, 1.02, eob(ans, 1.6)).toFixed(4) + ')';
        this.ls[i].background = ans > 0 ? 'var(--up)' : 'transparent'; this.ls[i].color = ans > 0 ? 'var(--ground)' : 'var(--main)'; this.ls[i].borderColor = ans > 0 ? 'var(--up)' : 'var(--main)';
      } else s.opacity = (+s.opacity * lerp(1, 0.6, eo(ans))).toFixed(3);
    });
    this.ws[0].opacity = eo(seg(t, 13.2, 13.7));
    this.ws[1].opacity = eo(seg(t, 17.4, 17.9));
    this.ring(t);
    this.tutor.render(t);
  },
});
