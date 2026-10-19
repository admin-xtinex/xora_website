const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MK = UI.M1.slice(5, 10), MK_X = (i) => 330 + i * 96, mkY = (p) => 720 - (p - 59900) / 260 * 350;
const MK_AVG = MK.reduce((a, c) => a + c[1], 0) / 5, MK_MAX = Math.max(...MK.map((c) => c[1]));
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'mk-c', 5);
    let hl = '';
    MK.forEach((c, i) => { hl += '<text class="mk-h mono" x="' + MK_X(i) + '" y="' + (mkY(c[1]) - 14).toFixed(1) + '" text-anchor="middle" style="fill:var(--second);font-size:22px">' + UI.fmt(c[1]) + '</text>'; });
    const line = (cls, v, col) => '<line class="' + cls + '" x1="270" x2="790" y1="' + mkY(v).toFixed(1) + '" y2="' + mkY(v).toFixed(1) + '" stroke-width="3" stroke-dasharray="8 6" style="stroke:' + col + '"/>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="mk-grid">' + UI.gridL(260, 800, mkY, 59950, 60100, 50) +
      MK.map((c, i) => '<text x="' + MK_X(i) + '" y="756" text-anchor="middle" class="axis">' + UI.hm(i + 5) + '</text>').join('') + '</g>' +
      this.cd.html + hl + line('mk-avg', MK_AVG, 'var(--accent)') + line('mk-max', MK_MAX, 'var(--up)') + '</svg>' +
      '<p class="tag mk-at" style="left:806px;top:' + (mkY(MK_AVG) - 22).toFixed(1) + 'px;border-color:var(--accent);color:var(--accent)">avg 60,060 ✗</p>' +
      '<p class="tag mk-mt" style="left:806px;top:' + (mkY(MK_MAX) - 22).toFixed(1) + 'px;border-color:var(--up);color:var(--up)">high 60,120 ✓</p>' +
      '<div class="glass mk-card" style="left:1060px;top:330px;width:620px;padding:24px 32px">' +
      '<div class="mk-w"><p class="kick" style="margin:0 0 8px;color:var(--accent)">Wrong · average of highs</p>' +
      '<p class="mono" style="margin:0;font-size:28px;line-height:1.45">(60,120 + 60,060 + 60,000<br>+ 60,050 + 60,070) ÷ 5 = 60,060</p></div>' +
      '<div class="mk-r" style="margin-top:20px"><p class="kick" style="margin:0 0 8px;color:var(--up)">Right · highest high</p>' +
      '<p class="mono" style="margin:0;font-size:28px">highest of the five = <span class="up">60,120</span></p></div></div>' +
      '<p class="chip mk-rule" style="position:absolute;left:1060px;top:640px;margin:0;font-size:26px;padding:12px 24px">First open · highest high · lowest low · last close</p>' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick mk-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line mk-t">Do not average candles</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.grid = q('.mk-grid').style; this.hs = all('.mk-h').map((e) => e.style);
    this.avg = q('.mk-avg'); this.max = q('.mk-max'); this.at = q('.mk-at').style; this.mt = q('.mk-mt').style;
    this.card = q('.mk-card').style; this.w = q('.mk-w').style; this.r = q('.mk-r').style; this.rule = q('.mk-rule').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'confused' }, { t: 10.6, pose: 'point', flip: true }, { t: 16.3, pose: 'checklist' }],
      says: [{ t0: 6.4, t1: 9.8, text: 'Not quite!' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    MK.forEach((c, i) => {
      const p = seg(t, 0.8 + i * 0.3, 1.3 + i * 0.3);
      this.cd.set(i, { x: MK_X(i), w: 54, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: mkY, op: eo(p) });
      this.hs[i].opacity = eo(seg(t, 2.6 + i * 0.3, 3.0 + i * 0.3));
    });
    UI.rise(this.card, t, 3.4);
    UI.rise(this.w, t, 3.6);
    const a = seg(t, 6.0, 7.0);
    this.avg.setAttribute('stroke-dasharray', '8 6'); this.avg.style.opacity = eo(a);
    this.avg.setAttribute('x2', lerp(270, 790, eio(a)).toFixed(1));
    UI.rise(this.at, t, 6.8);
    const m = seg(t, 10.6, 11.6);
    this.max.style.opacity = eo(m); this.max.setAttribute('x2', lerp(270, 790, eio(m)).toFixed(1));
    UI.rise(this.mt, t, 11.4); UI.rise(this.r, t, 11.0);
    // The first candle's wick pokes above the average line: price really traded higher.
    const w = kit.stage.querySelectorAll('.mk-c-w')[0];
    const g = Math.sin(Math.PI * seg(t, 11.6, 14.6));
    w.style.filter = g > 0.01 ? 'drop-shadow(0 0 ' + (g * 14).toFixed(1) + 'px var(--up))' : 'none';
    UI.rise(this.rule, t, 16.4, { s: 0.9 });
    this.tutor.render(t);
  },
});
