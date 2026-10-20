const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The shared past: two rejections at the zone, price back near it at 59,970. Then three futures branch from the last close.
const HK_COL = ['var(--up)', 'var(--second)', 'var(--down)'];
const HK_OUT = [['Breaks out', '60,350', '+380'], ['Drifts sideways', '59,960', '−10'], ['Fakes out, falls', '59,650', '−320']];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.h = UI.head(kit, 'Same past, different futures', 'Will it break out this time?');
    const Q = UI.Q, X = Q.x, Y = Q.y, x0 = X(11);
    this.paths = Q.F.map((f) => f.map((p, k) => [x0 + k * 46 + (k ? 0 : 0), Y(p)]));
    let over = '';
    this.paths.forEach((p, i) => { over += '<path class="hk-f" d="" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="12 9" style="stroke:' + HK_COL[i] + '"/><circle class="hk-e" r="9" cx="' + p[6][0] + '" cy="' + p[6][1].toFixed(1) + '" style="fill:' + HK_COL[i] + '"/>'; });
    over += '<circle class="hk-r" r="22" cx="' + X(1) + '" cy="' + Y(60020) + '" fill="none" stroke-width="3" style="stroke:var(--accent)"/><circle class="hk-r" r="22" cx="' + X(7) + '" cy="' + Y(60040) + '" fill="none" stroke-width="3" style="stroke:var(--accent)"/>' +
      '<circle class="hk-now" r="12" cx="' + x0 + '" cy="' + Y(59970) + '" fill="none" stroke-width="3" style="stroke:var(--main)"/>';
    this.ch = UI.chart(kit, 'hk', 12, { over });
    let rows = '';
    HK_OUT.forEach((o, i) => {
      rows += '<div class="hk-o" style="display:flex;align-items:center;gap:16px;height:58px;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="width:16px;height:16px;border-radius:50%;flex:none;background:' + HK_COL[i] + '"></span>' +
        '<span style="font-size:28px;font-weight:600">' + o[0] + '</span><span class="mono" style="margin-left:auto;font-size:28px">' + o[1] + '</span><span class="mono" style="width:90px;text-align:right;font-size:26px;color:' + HK_COL[i] + '">' + o[2] + '</span></div>';
    });
    kit.stage.append(kit.h('<p class="tag hk-tr" style="left:664px;top:404px">Turned back twice</p>'));
    kit.stage.append(kit.h('<p class="tag hk-tn" style="left:' + (X(11) + 30) + 'px;top:' + (Y(59970) - 20) + 'px;color:var(--main);border-color:var(--main)">Now: 59,970</p>'));
    kit.stage.append(kit.h('<div class="glass hk-p" style="left:1110px;top:300px;width:670px;padding:20px 30px"><p class="kick" style="margin:0 0 4px">Three possible endings · USDT</p>' + rows +
      '<p class="hk-n" style="margin:16px 0 0;font-size:30px;font-weight:700;color:var(--main)">Which one? Nobody knows in advance.</p></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.f = all('.hk-f'); this.e = all('.hk-e').map((e) => e.style); this.r = all('.hk-r').map((e) => e.style); this.now = q('.hk-now').style;
    this.tr = q('.hk-tr').style; this.tn = q('.hk-tn').style; this.p = q('.hk-p').style; this.os = all('.hk-o').map((e) => e.style); this.n = q('.hk-n').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'magnify' }, { t: 7.2, pose: 'cheer' }, { t: 13.8, pose: 'think' }, { t: 20.8, pose: 'confused' }],
      says: [{ t0: 8.0, t1: 12.4, text: 'Breakout?' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    this.ch.base(t, 0.2, 1.0, 13.6);
    this.ch.past(t, 0.6, 0.22);
    this.r.forEach((s, i) => { s.opacity = eo(seg(t, 4.0 + i * 0.8, 4.4 + i * 0.8)) * (1 - ei(seg(t, 13.4, 13.9))); });
    UI.fade(this.tr, t, 4.6, 13.4);
    const pulse = 1 + 0.25 * Math.sin(Math.max(0, t - 7.2) * 5);
    this.now.opacity = eo(seg(t, 7.2, 7.6)); this.now.transformBox = 'fill-box'; this.now.transformOrigin = '50% 50%'; this.now.transform = 'scale(' + pulse.toFixed(3) + ')';
    UI.fade(this.tn, t, 7.4, 13.6);
    this.f.forEach((f, i) => {
      const a = 14.0 + i * 1.6, p = eio(seg(t, a, a + 1.4));
      f.setAttribute('d', p > 0 ? UI.part(this.paths[i], p) : 'M0 0'); f.style.opacity = p > 0 ? 1 : 0;
      const e = seg(t, a + 1.3, a + 1.6); this.e[i].opacity = eo(e);
    });
    UI.rise(kit, this.p, t, 13.9, 0.6);
    this.os.forEach((s, i) => { const a = 14.6 + i * 1.6; s.opacity = eo(seg(t, a, a + 0.4)); });
    UI.rise(kit, this.n, t, 20.8, 0.5, 14);
    this.tutor.render(t);
  },
});
