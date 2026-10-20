const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// R: the risk distance becomes a ruler; the room to the next level measures 2 of them.
const RM_X = (p) => 700 + (p - 60000) * (4 / 3); // 59,700 → 300, 60,000 → 700, 60,600 → 1500
const RM_Y = 540;
kit.scene('rmath', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tick = (p, lab, col) => '<line x1="' + RM_X(p) + '" x2="' + RM_X(p) + '" y1="' + (RM_Y - 40) + '" y2="' + (RM_Y + 40) + '" stroke-width="4" style="stroke:' + col + '"/>' +
      '<text x="' + RM_X(p) + '" y="' + (RM_Y + 82) + '" text-anchor="middle" class="mono" style="fill:' + col + ';font-size:26px">' + lab + '</text>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick rm-k">Reading the bar</p><h2 class="line rm-t">What is R?</h2>' +
      '<p class="def rm-d"><b>1 R</b> = your risk: the distance from entry to stop.</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<rect class="rm-red" x="' + RM_X(59700) + '" y="' + (RM_Y - 16) + '" width="' + (RM_X(60000) - RM_X(59700)) + '" height="32" rx="6" style="fill:var(--down)"/>' +
      '<rect class="rm-g1" x="' + RM_X(60000) + '" y="' + (RM_Y - 16) + '" width="400" height="32" style="fill:var(--up)"/>' +
      '<rect class="rm-g2" x="' + (RM_X(60000) + 400) + '" y="' + (RM_Y - 16) + '" width="400" height="32" rx="6" style="fill:color-mix(in srgb, var(--up) 70%, var(--ground))"/>' +
      tick(59700, 'stop 59,700', 'var(--down)') + tick(60000, 'entry 60,000', 'var(--second)') + tick(60600, 'next res. 60,600', 'var(--up)') +
      '<g class="rm-b0"><path d="M' + RM_X(59700) + ' ' + (RM_Y - 56) + ' v-14 H' + RM_X(60000) + ' v14" fill="none" stroke-width="3" style="stroke:var(--down)"/>' +
      '<text x="' + ((RM_X(59700) + RM_X(60000)) / 2) + '" y="' + (RM_Y - 86) + '" text-anchor="middle" class="mono" style="fill:var(--down);font-size:26px">300 = 1 R</text></g>' +
      '<g class="rm-b1"><path d="M' + RM_X(60000) + ' ' + (RM_Y - 56) + ' v-14 h400 v14" fill="none" stroke-width="3" style="stroke:var(--up)"/>' +
      '<text x="' + (RM_X(60000) + 200) + '" y="' + (RM_Y - 86) + '" text-anchor="middle" class="mono" style="fill:var(--up);font-size:26px">1 R</text></g>' +
      '<g class="rm-b2"><path d="M' + (RM_X(60000) + 400) + ' ' + (RM_Y - 56) + ' v-14 h400 v14" fill="none" stroke-width="3" style="stroke:var(--up)"/>' +
      '<text x="' + (RM_X(60000) + 600) + '" y="' + (RM_Y - 86) + '" text-anchor="middle" class="mono" style="fill:var(--up);font-size:26px">2 R</text></g>' +
      '<rect class="rm-ruler" y="' + (RM_Y - 22) + '" width="400" height="44" rx="8" fill="none" stroke-width="3" stroke-dasharray="8 6" style="stroke:var(--second)"/></svg>' +
      '<div class="glass rm-eq" style="left:140px;top:660px;width:1100px;padding:20px 32px"><p class="mono" style="margin:0;font-size:40px">room 600 ÷ risk 300 = <span style="color:var(--up)">2.0 R</span> <span style="font-size:26px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">· room, not a promise</span></p></div>' +
      '<p class="fict" style="position:absolute;right:140px;top:250px;margin:0">Fictional prices in USDT</p></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.rm-k').style; this.t = q('.rm-t'); this.d = q('.rm-d');
    this.red = q('.rm-red'); this.g1 = q('.rm-g1'); this.g2 = q('.rm-g2'); this.b0 = q('.rm-b0').style; this.b1 = q('.rm-b1').style; this.b2 = q('.rm-b2').style;
    this.ruler = q('.rm-ruler'); this.eq = q('.rm-eq').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'think' }, { t: 5.8, pose: 'pointer', flip: true }, { t: 12.4, pose: 'idea' }, { t: 18.4, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 5.8, { stagger: 0.06 });
    const grow = (el, a, w0) => { const p = eio(seg(t, a, a + 0.9)); el.setAttribute('width', (w0 * p).toFixed(1)); };
    grow(this.red, 1.0, 400); grow(this.g1, 1.6, 400); grow(this.g2, 2.2, 400);
    this.b0.opacity = eo(seg(t, 7.0, 7.5));
    // the ruler (1 R) lifts off the red part and steps along the room: 1 R, 2 R
    const rx = t < 12.6 ? RM_X(59700) : lerp(RM_X(59700), RM_X(60000), eio(seg(t, 12.6, 13.6))) + 400 * eio(seg(t, 14.4, 15.4));
    this.ruler.setAttribute('x', rx.toFixed(1));
    this.ruler.style.opacity = eo(seg(t, 8.0, 8.5));
    this.b1.opacity = eo(seg(t, 13.6, 14.1)); this.b2.opacity = eo(seg(t, 15.4, 15.9));
    UI.rise(kit, this.eq, t, 16.0, 0.6, 20);
    this.tutor.render(t);
  },
});
