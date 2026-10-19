const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const DJ_X = 560, djY = (p) => 750 - (p - 59880) / 260 * 360;
kit.scene('doji', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'dj-c', 1);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="dj-grid">' + this.gridHtml() + '</g>' + this.cd.html + '</svg>' +
      '<p class="tag dj-o" style="left:' + (DJ_X - 82) + 'px;transform:translateX(-100%)">Open 60,000</p>' +
      '<p class="tag dj-cl" style="left:' + (DJ_X + 82) + 'px">Close <span class="dj-cv"></span></p>' +
      '<p class="tag dj-h" style="left:' + (DJ_X + 30) + 'px">High <span class="dj-hv"></span></p>' +
      '<p class="tag dj-l" style="left:' + (DJ_X + 30) + 'px">Low <span class="dj-lv"></span></p>' +
      '<div class="glass dj-m" style="left:960px;top:330px;width:660px;padding:26px 36px"><p class="fict" style="margin:0 0 8px">Body = close − open</p>' +
      '<p class="mono" style="margin:0;font-size:56px"><span class="dj-bv"></span> <span style="font-size:30px">USDT</span></p></div>' +
      '<div class="glass dj-d" style="left:960px;top:480px;width:660px;padding:26px 36px;border-color:var(--main)"><p class="def" style="margin:0">A <b>doji</b> has open and close almost equal. Buyers and sellers ended about even.</p></div>' +
      '<p class="chip dj-w" style="position:absolute;left:960px;top:712px;margin:0;font-size:28px;padding:14px 26px;border-color:var(--accent)">It does not predict the next candle</p>' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick dj-k">A special case</p>' +
      '<h2 class="line dj-t">The doji: almost no body</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.dj-k').style; this.t = q('.dj-t'); this.grid = q('.dj-grid').style;
    this.o = q('.dj-o').style; this.c = q('.dj-cl').style; this.h = q('.dj-h').style; this.l = q('.dj-l').style;
    this.cv = q('.dj-cv'); this.hv = q('.dj-hv'); this.lv = q('.dj-lv'); this.bv = q('.dj-bv');
    this.m = q('.dj-m').style; this.d = q('.dj-d').style; this.w = q('.dj-w').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'magnify' }, { t: 0.5, pose: 'present' }, { t: 4.8, pose: 'magnify' }, { t: 9.8, pose: 'explain' }, { t: 14.9, pose: 'calm' }],
      says: [{ t0: 15.2, t1: 18.4, text: 'Just a tie.' }],
    });
  },
  gridHtml() {
    let g = '';
    for (let p = 59900; p <= 60100; p += 50) g += '<line x1="250" x2="820" y1="' + djY(p).toFixed(1) + '" y2="' + djY(p).toFixed(1) + '" style="stroke:color-mix(in srgb, var(--second) 9%, transparent);stroke-width:1.5"/><text x="236" y="' + (djY(p) + 8).toFixed(1) + '" text-anchor="end" class="axis">' + UI.fmt(p) + '</text>';
    return g;
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    // The close slides down to 60,005 while the wicks stretch: a doji.
    const f = eio(seg(t, 1.2, 4.4));
    const c = Math.round(lerp(60080, 60005, f)), h = Math.round(lerp(60120, 60090, f)), l = Math.round(lerp(59940, 59910, f));
    this.cd.set(0, { x: DJ_X, w: 120, o: 60000, h, l, c, y: djY, op: eo(seg(t, 0.4, 0.9)) });
    const tg = eo(seg(t, 0.8, 1.3));
    for (const [st, p] of [[this.o, 60000], [this.c, c], [this.h, h], [this.l, l]]) { st.opacity = tg; st.top = (djY(p) - 22).toFixed(1) + 'px'; }
    this.h.top = (djY(h) - 66).toFixed(1) + 'px'; this.l.top = (djY(l) + 22).toFixed(1) + 'px';
    UI.txt(this.cv, UI.fmt(c)); UI.txt(this.hv, UI.fmt(h)); UI.txt(this.lv, UI.fmt(l)); UI.txt(this.bv, String(c - 60000));
    UI.rise(this.m, t, 1.0);
    UI.rise(this.d, t, 9.9);
    UI.rise(this.w, t, 15.0, { s: 0.9 });
    this.tutor.render(t);
  },
});
