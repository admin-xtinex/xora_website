const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const EX_PTS = [['Binance is one large crypto exchange. There are many others.', 0.6], ['Screens in this course are generic mocks, not real exchange screens.', 5.4], ['Real apps change their labels. Check the app’s own help pages.', 11.0]];
kit.scene('example', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let items = '';
    EX_PTS.forEach((p) => { items += '<div class="ex-i" style="display:flex;gap:20px;align-items:flex-start"><span style="flex:none;width:14px;height:14px;margin-top:16px;border-radius:50%;background:var(--main)"></span><span style="font-size:32px;line-height:1.4;font-weight:600">' + p[0] + '</span></div>'; });
    const bar = (x, y, w, c) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="16" rx="5" style="fill:' + c + '"/>';
    let book = '';
    for (let i = 0; i < 4; i++) book += bar(1440, 300 + i * 26, 70 + ((i * 37) % 60), 'color-mix(in srgb, var(--accent) 60%, var(--ground))');
    for (let i = 0; i < 4; i++) book += bar(1440, 420 + i * 26, 60 + ((i * 53) % 70), 'color-mix(in srgb, var(--main) 60%, var(--ground))');
    const pts = UI.walk(kit, 3, 30, 1100, 1400, 470, 330, 40);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick ex-k">Real exchanges</p>' +
      '<h2 class="line ex-t">Binance is one example</h2>' +
      '<div style="display:flex;flex-direction:column;gap:22px;margin-top:6px">' + items + '</div></div>' +
      '<div class="glass ex-scr" style="left:1060px;top:220px;width:640px;height:420px;border-radius:22px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ex-ui">' +
      '<rect x="1060" y="220" width="640" height="44" rx="22" style="fill:color-mix(in srgb, var(--second) 6%, transparent)"/>' +
      '<circle cx="1090" cy="242" r="7" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/><circle cx="1112" cy="242" r="7" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/>' +
      '<path class="ex-ch" d="' + UI.d(pts) + '" pathLength="1" fill="none" stroke-width="4" style="stroke:var(--main)"/>' + book +
      '<rect x="1100" y="560" width="270" height="52" rx="14" style="fill:var(--main)"/><rect x="1390" y="560" width="270" height="52" rx="14" style="fill:var(--accent)"/></g>' +
      '<text x="1235" y="594" text-anchor="middle" style="fill:var(--ground);font-size:24px;font-weight:700">BUY</text><text x="1525" y="594" text-anchor="middle" style="fill:var(--ground);font-size:24px;font-weight:700">SELL</text></svg>' +
      '<p class="kick ex-l1" style="position:absolute;left:1100px;top:290px;margin:0;font-size:20px">Price chart</p>' +
      '<p class="kick ex-l2" style="position:absolute;left:1440px;top:270px;margin:0;font-size:20px">Order book</p>' +
      '<div class="ex-st" style="position:absolute;left:1380px;top:430px;padding:10px 20px;border:3px solid var(--accent);border-radius:10px;color:var(--accent);font-family:var(--mono, monospace);font-size:22px;letter-spacing:.08em;text-transform:uppercase;text-align:center;line-height:1.35;background:color-mix(in srgb, var(--ground) 85%, transparent)">Educational mock<br>not a real exchange screen</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)].map((e) => e.style);
    this.k = q('.ex-k').style; this.t = q('.ex-t'); this.items = all('.ex-i');
    this.scr = q('.ex-scr').style; this.ui = q('.ex-ui').style; this.ch = q('.ex-ch'); this.l1 = q('.ex-l1').style; this.l2 = q('.ex-l2').style; this.st = q('.ex-st').style;
    this.btn = [...kit.stage.querySelectorAll('.ex-ui ~ text')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'pointer', flip: true }, { t: 0.6, pose: 'laptop' }, { t: 5.4, pose: 'point', flip: true }, { t: 11.0, pose: 'read' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.items.forEach((s, i) => { const a = EX_PTS[i][1], p = seg(t, a, a + 0.5); s.opacity = eo(p); s.transform = 'translateX(' + lerp(24, 0, eo(p)) + 'px)'; });
    const s = seg(t, 5.4, 6.1);
    this.scr.opacity = eo(s); this.scr.transform = 'scale(' + lerp(0.92, 1, eob(s, 1.5)) + ')';
    this.ui.opacity = eo(seg(t, 5.8, 6.4));
    for (const b of this.btn) b.opacity = eo(seg(t, 5.8, 6.4));
    this.ch.setAttribute('stroke-dasharray', eio(seg(t, 6.0, 7.6)) + ' 1');
    this.l1.opacity = eo(seg(t, 6.6, 7.0)); this.l2.opacity = eo(seg(t, 6.9, 7.3));
    const st = seg(t, 7.6, 8.1);
    this.st.opacity = eo(st); this.st.transform = 'translate(-50%,-50%) rotate(-8deg) scale(' + lerp(1.4, 1, eo(st)) + ')';
    this.tutor.render(t);
  },
});
