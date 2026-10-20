const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Left: a huge green volume bar read as "strong buyers". Right: the same 40 BTC was bought and sold.
const MS_C = [[60100, 60130, 60080, 60110, 6], [60110, 60140, 60090, 60100, 5], [60100, 60120, 60070, 60090, 7], [60090, 60110, 60060, 60100, 6], [60100, 60260, 60090, 60240, 40]];
const msX = (i) => 260 + i * 100, msY = (p) => 560 - (p - 60000) / 300 * 160, MS_B = 740, MS_U = 3.6;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'ms-c', MS_C.length);
    let bars = '';
    MS_C.forEach((c, i) => { bars += '<rect class="ms-v" x="' + (msX(i) - 26) + '" y="' + (MS_B - c[4] * MS_U) + '" width="52" height="' + c[4] * MS_U + '" rx="4" style="fill:color-mix(in srgb, ' + (c[3] >= c[0] ? 'var(--up)' : 'var(--down)') + ' 55%, transparent)"/>'; });
    const card = (cls, x, kick, col, head) => '<div class="glass ' + cls + '" style="left:' + x + 'px;top:300px;width:760px;height:470px;padding:22px 32px;border-color:color-mix(in srgb, ' + col + ' 55%, transparent)">' +
      '<p class="kick" style="margin:0 0 6px;color:' + col + '">' + kick + '</p><p style="margin:0;font-size:34px;font-weight:700">' + head + '</p></div>';
    const half = (cls, y, col, txt) => '<div class="' + cls + '" style="position:absolute;left:1000px;top:' + y + 'px;height:58px;width:600px;border-radius:12px;transform-origin:0 50%;background:color-mix(in srgb, ' + col + ' 50%, transparent);border:2px solid ' + col + ';display:flex;align-items:center;padding-left:22px;box-sizing:border-box"><span class="mono" style="font-size:28px;font-weight:600">' + txt + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      card('ms-a', 140, 'Common mistake', 'var(--down)', 'Huge volume = strong buyers') + card('ms-b', 960, 'Better', 'var(--main)', 'Every trade has two sides') +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ms-l">' + this.cd.html + bars + '</g>' +
      '<g transform="translate(830 330)"><g class="ms-x"><circle r="30" style="fill:var(--down)"/><path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke-width="6" stroke-linecap="round" style="stroke:var(--ground)"/></g></g></svg>' +
      '<p class="tag ms-40" style="left:' + (msX(4) + 34) + 'px;top:' + (MS_B - 40 * MS_U) + 'px;color:var(--up);border-color:var(--up)">40 BTC</p>' +
      '<p class="chip ms-go" style="position:absolute;left:700px;top:430px;margin:0;font-size:28px;padding:12px 24px;background:color-mix(in srgb, var(--ground) 60%, var(--down));border-color:var(--down)">Go long!</p>' +
      half('ms-h1', 410, 'var(--up)', 'Bought 40 BTC') + half('ms-h2', 480, 'var(--down)', 'Sold 40 BTC') +
      '<p class="ms-s" style="position:absolute;left:1000px;top:566px;width:680px;margin:0;font-size:30px;font-weight:600;line-height:1.35">Volume shows how <span class="hl">busy</span> it was, not who wins next.</p>' +
      '<p class="mono ms-r" style="position:absolute;left:1000px;top:652px;margin:0;font-size:26px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">Read with candles · zones · context</p>' +
      '<p class="chip ms-wait" style="position:absolute;left:1000px;top:700px;margin:0;font-size:26px;padding:8px 24px;background:var(--main);color:var(--ground);border-color:var(--main)">WAIT · still allowed</p>' +
      '<p class="fict" style="position:absolute;left:560px;top:745px;margin:0">Fictional candles</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick ms-k" style="color:var(--accent)">Watch out</p>' +
      '<h2 class="line ms-t">Busy is not the same as up</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ms-k').style; this.t = q('.ms-t'); this.a = q('.ms-a').style; this.b = q('.ms-b').style; this.l = q('.ms-l').style;
    this.x = q('.ms-x').style; this.n40 = q('.ms-40').style; this.go = q('.ms-go').style;
    this.h1 = q('.ms-h1').style; this.h2 = q('.ms-h2').style; this.s = q('.ms-s').style; this.r = q('.ms-r').style; this.wait = q('.ms-wait').style;
    this.vs = [...kit.stage.querySelectorAll('.ms-v')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'confused' }, { t: 5.8, pose: 'explain' }, { t: 11.5, pose: 'idea' }, { t: 15.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.a, t, 0.5);
    MS_C.forEach((c, i) => {
      const a = 1.0 + i * 0.35, p = seg(t, a, a + 0.45);
      this.cd.set(i, { x: msX(i), w: 46, o: c[0], h: lerp(c[0], c[1], eo(p)), l: lerp(c[0], c[2], eo(p)), c: lerp(c[0], c[3], eo(p)), y: msY, op: eo(seg(t, a, a + 0.2)) });
      const v = this.vs[i]; v.transformBox = 'fill-box'; v.transformOrigin = '50% 100%'; v.transform = 'scaleY(' + eob(seg(t, a + 0.1, a + 0.7), 1.4).toFixed(3) + ')';
    });
    UI.rise(this.n40, t, 3.2, { dy: 10 });
    UI.rise(this.go, t, 3.4);
    const x = seg(t, 5.4, 5.8);
    this.x.opacity = eo(x); this.x.transform = 'scale(' + lerp(0.4, 1, eob(x, 1.8)).toFixed(3) + ')';
    this.l.opacity = (1 - 0.45 * eo(seg(t, 5.6, 6.2))).toFixed(3);
    UI.rise(this.b, t, 5.9);
    // One 40 BTC bar, copied into the buy side and the sell side: the same size.
    const h1 = seg(t, 6.6, 7.4), h2 = seg(t, 8.4, 9.2);
    this.h1.opacity = eo(seg(t, 6.6, 6.9)); this.h1.transform = 'scaleX(' + eo(h1).toFixed(3) + ')';
    this.h2.opacity = eo(seg(t, 8.4, 8.7)); this.h2.transform = 'translateY(' + lerp(-70, 0, eio(h2)).toFixed(1) + 'px)';
    UI.rise(this.s, t, 11.6);
    UI.rise(this.r, t, 15.7, { dy: 12 }); UI.rise(this.wait, t, 17.2);
    this.tutor.render(t);
  },
});
