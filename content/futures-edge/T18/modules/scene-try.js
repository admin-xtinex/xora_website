const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Fictional last 10 minutes: high 60,240 (#1), low 60,000 (#4). Range 240 USDT, 0.4%.
const TY_C = [[60100, 60150, 60080, 60140], [60140, 60240, 60130, 60200], [60200, 60210, 60120, 60130], [60130, 60160, 60060, 60080], [60080, 60100, 60000, 60050],
  [60050, 60110, 60030, 60090], [60090, 60170, 60080, 60160], [60160, 60190, 60110, 60120], [60120, 60150, 60090, 60140], [60140, 60200, 60130, 60180]];
const tyX = (i) => 1110 + i * 34, tyY = (p) => 620 - (p - 60000) / 300 * 240;
const TY_CD = 6.4, TY_ANS = 11.6;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'ty-c', TY_C.length);
    this.ring = UI.ring(kit, 'ty-ring', 1620, 440);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ty-grid">' + UI.gridL(1080, 1440, tyY, 60000, 60300, 100) + '</g>' +
      '<rect class="ty-win" x="1084" y="' + (tyY(60300) - 6) + '" width="352" height="' + (tyY(60000) - tyY(60300) + 22) + '" rx="10" stroke-width="2.5" stroke-dasharray="10 7" style="fill:color-mix(in srgb, var(--main) 8%, transparent);stroke:var(--main)"/>' +
      '<line class="ty-hl" x1="1090" x2="1430" y1="' + tyY(60240) + '" y2="' + tyY(60240) + '" stroke-width="2.5" stroke-dasharray="8 6" style="stroke:var(--accent)"/>' +
      '<line class="ty-ll" x1="1090" x2="1430" y1="' + tyY(60000) + '" y2="' + tyY(60000) + '" stroke-width="2.5" stroke-dasharray="8 6" style="stroke:var(--accent)"/>' +
      this.cd.html + this.ring.html + '</svg>' +
      '<p class="tag ty-ht" style="left:1240px;top:' + (tyY(60240) - 50) + 'px;color:var(--accent);border-color:var(--accent)">High 60,240</p>' +
      '<p class="tag ty-lt" style="left:1240px;top:' + (tyY(60000) + 14) + 'px;color:var(--accent);border-color:var(--accent)">Low 60,000</p>' +
      '<p class="fict" style="position:absolute;left:1080px;top:300px;margin:0">Fictional · last 10 minutes</p>' +
      '<div class="glass ty-q" style="left:140px;top:300px;width:820px;padding:22px 30px"><p class="fict" style="margin:0 0 8px">Question · fictional prices</p>' +
      '<p class="def" style="margin:0;font-size:31px">High <b>60,240</b>, low <b>60,000</b>. What is the range in USDT, and as a percent?</p></div>' +
      '<p class="mono ty-h" style="position:absolute;left:150px;top:500px;margin:0;font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Hint: range ÷ low × 100</p>' +
      '<div class="glass ty-a1" style="left:140px;top:556px;width:820px;padding:16px 28px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 76%, var(--main))"><p class="mono" style="margin:0;font-size:32px">60,240 − 60,000 = <span class="hl">240 USDT</span></p></div>' +
      '<div class="glass ty-a2" style="left:140px;top:654px;width:820px;padding:16px 28px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 76%, var(--main))"><p class="mono" style="margin:0;font-size:32px">240 ÷ 60,000 × 100 = <span class="hl">0.4%</span></p></div>' +
      '<div class="glass ty-n" style="left:1480px;top:330px;width:290px;padding:18px 26px"><p class="kick" style="margin:0 0 6px">Remember</p><p style="margin:0;font-size:28px;font-weight:600;line-height:1.35">How far it went. <span class="hl">Not</span> where it goes next.</p></div>' +
      '<div class="words" style="left:140px;top:160px;width:1000px"><p class="kick ty-k">Your turn</p>' +
      '<h2 class="line ty-t">Pause and measure</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ty-k').style; this.t = q('.ty-t'); this.qc = q('.ty-q').style; this.h = q('.ty-h').style;
    this.a1 = q('.ty-a1').style; this.a2 = q('.ty-a2').style; this.n = q('.ty-n').style; this.grid = q('.ty-grid').style;
    this.win = q('.ty-win').style; this.hl = q('.ty-hl').style; this.ll = q('.ty-ll').style; this.ht = q('.ty-ht').style; this.lt = q('.ty-lt').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'present' }, { t: TY_CD, pose: 'think' }, { t: TY_ANS, pose: 'checklist' }, { t: 16.9, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 0.9));
    TY_C.forEach((c, i) => {
      const a = 1.0 + i * 0.28, p = seg(t, a, a + 0.4);
      this.cd.set(i, { x: tyX(i), w: 22, o: c[0], h: lerp(c[0], c[1], eo(p)), l: lerp(c[0], c[2], eo(p)), c: lerp(c[0], c[3], eo(p)), y: tyY, op: eo(seg(t, a, a + 0.2)) });
    });
    this.win.opacity = eo(seg(t, 3.8, 4.3)); this.win.strokeDashoffset = (-t * 12).toFixed(1);
    this.hl.opacity = eo(seg(t, 4.4, 4.9)); this.ll.opacity = eo(seg(t, 4.8, 5.3));
    UI.rise(this.ht, t, 4.5, { dy: 10 }); UI.rise(this.lt, t, 4.9, { dy: 10 });
    UI.rise(this.qc, t, 0.8);
    UI.rise(this.h, t, 8.6, { dy: 10 });
    const show = eo(seg(t, TY_CD - 0.5, TY_CD)) * (1 - ei(seg(t, TY_ANS - 0.4, TY_ANS)));
    this.ring.render(t, TY_CD, 5, show);
    UI.rise(this.a1, t, TY_ANS + 0.2); UI.rise(this.a2, t, TY_ANS + 2.4);
    UI.rise(this.n, t, 17.1);
    this.tutor.render(t);
  },
});
