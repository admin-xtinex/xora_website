const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TY_X = 1180, tyY = (p) => 740 - (p - 59900) / 350 * 380;
const TY_CD = 5.0, TY_ANS = 10.4;
const TY_TAGS = [['Open', 60150, 10.6], ['Close', 60000, 11.2], ['High', 60200, 15.9], ['Low', 59950, 16.5]];
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'ty-c', 1);
    this.ring = UI.ring(kit, 'ty-ring', 1530, 480);
    let tags = '';
    TY_TAGS.forEach((g) => { tags += '<p class="tag ty-tag" style="left:' + (TY_X + 66) + 'px;top:' + (tyY(g[1]) - 22).toFixed(1) + 'px"><span style="color:color-mix(in srgb, var(--second) 60%, var(--ground))">' + g[0] + '</span> ' + UI.fmt(g[1]) + '</p>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ty-grid">' + UI.gridL(1060, 1300, tyY, 59950, 60200, 50) + '</g>' + this.cd.html + this.ring.html +
      '<text class="ty-hint" x="1530" y="650" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 65%, var(--ground));font-size:28px">Hint: where is the open?</text></svg>' + tags +
      '<div class="glass ty-q" style="left:140px;top:330px;width:780px;padding:26px 36px"><p class="fict" style="margin:0 0 10px">Question · fictional 1-minute candle</p>' +
      '<p class="def" style="margin:0">Read this candle’s <b>open</b>, <b>high</b>, <b>low</b> and <b>close</b>. Is it an up or a down candle?</p></div>' +
      '<div class="glass ty-a" style="left:140px;top:540px;width:780px;padding:24px 36px;border-color:var(--down);background:color-mix(in srgb, var(--ground) 82%, var(--down))">' +
      '<p class="kick" style="margin:0 0 8px;color:var(--down)">Down candle · bearish</p>' +
      '<p class="mono" style="margin:0;font-size:32px">Close − open = 60,000 − 60,150</p>' +
      '<p class="mono" style="margin:6px 0 0;font-size:32px">= <span class="dn">−150 USDT</span></p></div>' +
      '<div class="words" style="left:140px;top:170px;width:1000px"><p class="kick ty-k">Your turn</p>' +
      '<h2 class="line ty-t">Pause and read it</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ty-k').style; this.t = q('.ty-t'); this.qc = q('.ty-q').style; this.a = q('.ty-a').style; this.hint = q('.ty-hint').style; this.grid = q('.ty-grid').style;
    this.tags = all('.ty-tag').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: TY_CD, pose: 'think' }, { t: TY_ANS, pose: 'checklist' }, { t: 21.0, pose: 'celebrate' }],
      says: [{ t0: 21.2, t1: 23.7, text: 'Nice reading!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.qc, t, 0.6);
    this.grid.opacity = eo(seg(t, 0.8, 1.3));
    this.cd.set(0, { x: TY_X, w: 100, o: 60150, h: 60200, l: 59950, c: 60000, y: tyY, op: eo(seg(t, 1.0, 1.5)) });
    const show = eo(seg(t, TY_CD - 0.6, TY_CD)) * (1 - ei(seg(t, TY_ANS - 0.4, TY_ANS)));
    this.ring.render(t, TY_CD, 5, show);
    this.hint.opacity = eo(seg(t, 7.0, 7.5)) * (1 - ei(seg(t, TY_ANS - 0.4, TY_ANS)));
    this.tags.forEach((s, i) => {
      const p = seg(t, TY_TAGS[i][2], TY_TAGS[i][2] + 0.5);
      s.opacity = eo(p); s.transform = 'translateX(' + lerp(20, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.6)).toFixed(3) + ')';
    });
    UI.rise(this.a, t, 16.0);
    this.tutor.render(t);
  },
});
