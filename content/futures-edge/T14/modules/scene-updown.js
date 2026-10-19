const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const UD_Y = (p) => 750 - (p - 59920) / 220 * 330;
// [card left, open, close, kind, title, result, colour word, start]
const UD = [[140, 60000, 60080, 'Up candle', 'Bullish', '+80 USDT<br>+0.13%', 'Usually drawn green', 4.2], [900, 60080, 60000, 'Down candle', 'Bearish', '−80 USDT<br>−0.13%', 'Usually drawn red', 9.9]];
kit.scene('updown', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'ud-c', 2);
    let cards = '', arrows = '';
    UD.forEach((u, i) => {
      const x = u[0], col = i ? 'var(--down)' : 'var(--up)';
      cards += '<div class="glass ud-card" style="left:' + x + 'px;top:330px;width:720px;height:450px"></div>' +
        '<div class="ud-h" style="position:absolute;left:' + (x + 440) + 'px;top:362px"><p class="kick" style="margin:0;color:' + col + '">' + u[3] + '</p><p class="line" style="margin:6px 0 0;font-size:64px">' + u[4] + '</p>' +
        '<p style="margin:10px 0 0;font-size:30px;font-weight:600;line-height:1.3">Close ' + (i ? 'below' : 'above') + '<br>open</p></div>' +
        '<p class="tag ud-tc" style="left:' + (x + 210) + 'px;top:' + (UD_Y(u[2]) - 22).toFixed(1) + 'px;border-color:' + col + '">Close ' + UI.fmt(u[2]) + '</p>' +
        '<p class="tag ud-to" style="left:' + (x + 210) + 'px;top:' + (UD_Y(u[1]) - 22).toFixed(1) + 'px">Open ' + UI.fmt(u[1]) + '</p>' +
        '<div class="ud-r" style="position:absolute;left:' + (x + 440) + 'px;top:600px"><p class="mono" style="margin:0;font-size:34px;line-height:1.3;color:' + col + '">' + u[5] + '</p><p class="fict" style="margin:8px 0 0">' + u[6] + '</p></div>';
      const y0 = UD_Y(u[1]) + (i ? 14 : -14), y1 = UD_Y(u[2]) + (i ? -26 : 26);
      arrows += '<g class="ud-ar" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" style="stroke:var(--ground)"><path class="ud-ap" pathLength="1" d="M' + (x + 140) + ' ' + y0.toFixed(1) + ' V' + y1.toFixed(1) + '"/>' +
        '<path class="ud-ah" d="M' + (x + 128) + ' ' + (y1 + (i ? -12 : 12)).toFixed(1) + ' L' + (x + 140) + ' ' + y1.toFixed(1) + ' L' + (x + 152) + ' ' + (y1 + (i ? -12 : 12)).toFixed(1) + '"/></g>';
    });
    kit.stage.append(kit.h('<div class="ground">' + cards +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.cd.html + arrows +
      '<line class="ud-hl" x1="280" x2="1040" y1="' + UD_Y(60120).toFixed(1) + '" y2="' + UD_Y(60120).toFixed(1) + '" stroke-width="2" stroke-dasharray="6 8" style="stroke:color-mix(in srgb, var(--second) 55%, transparent)"/>' +
      '<line class="ud-hl" x1="280" x2="1040" y1="' + UD_Y(59940).toFixed(1) + '" y2="' + UD_Y(59940).toFixed(1) + '" stroke-width="2" stroke-dasharray="6 8" style="stroke:color-mix(in srgb, var(--second) 55%, transparent)"/></svg>' +
      '<div class="words" style="left:140px;top:170px;width:1200px"><p class="kick ud-k">Direction</p>' +
      '<h2 class="line ud-t">Up or down?</h2></div>' +
      '<p class="chip ud-set" style="position:absolute;left:1640px;top:200px;margin:0;font-size:26px;padding:12px 24px;transform:translateX(-100%)">Colours are a setting</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ud-k').style; this.t = q('.ud-t'); this.set = q('.ud-set').style;
    this.cards = all('.ud-card').map((e) => e.style); this.hs = all('.ud-h').map((e) => e.style); this.rs = all('.ud-r').map((e) => e.style);
    this.tc = all('.ud-tc').map((e) => e.style); this.to = all('.ud-to').map((e) => e.style);
    this.ar = all('.ud-ar').map((e) => e.style); this.ap = all('.ud-ap'); this.ah = all('.ud-ah').map((e) => e.style); this.hl = all('.ud-hl');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.5, pose: 'think' }, { t: 4.2, pose: 'point', flip: true }, { t: 9.9, pose: 'explain' }, { t: 15.2, pose: 'magnify' }, { t: 20.4, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const grey = Math.sin(Math.PI * seg(t, 20.8, 24.4)) > 0 ? Math.min(1, 2.2 * Math.sin(Math.PI * seg(t, 20.8, 24.4))) : 0;
    UD.forEach((u, i) => {
      const a = u[7];
      UI.rise(this.cards[i], t, 0.6 + i * 0.3);
      UI.rise(this.hs[i], t, a + 0.2);
      const f = eio(seg(t, a + 0.4, a + 2.2));
      // The body grows from the open toward the close.
      this.cd.set(i, { x: u[0] + 140, w: 110, o: u[1], h: 60120, l: 59940, c: lerp(u[1], u[2], f), y: UD_Y, op: eo(seg(t, a, a + 0.4)), live: f < 1,
        col: grey > 0 ? 'color-mix(in srgb, ' + (i ? 'var(--down)' : 'var(--up)') + ' ' + ((1 - grey) * 100).toFixed(0) + '%, #8a90a0)' : null });
      const po = seg(t, a + 0.1, a + 0.5), pc = seg(t, a + 2.2, a + 2.7);
      this.to[i].opacity = eo(po); this.to[i].transform = 'translateX(' + lerp(16, 0, eo(po)).toFixed(1) + 'px)';
      this.tc[i].opacity = eo(pc); this.tc[i].transform = 'translateX(' + lerp(16, 0, eo(pc)).toFixed(1) + 'px)';
      const ap = seg(t, a + 2.4, a + 3.0);
      this.ap[i].setAttribute('stroke-dasharray', eio(ap) + ' 1');
      this.ar[i].opacity = ap > 0 ? 1 : 0; this.ah[i].opacity = eo(seg(t, a + 2.9, a + 3.1));
      UI.rise(this.rs[i], t, a + 3.0);
    });
    this.hl.forEach((l, i) => { l.setAttribute('stroke-dasharray', '6 8'); l.style.opacity = eo(seg(t, 15.4 + i * 0.4, 16.0 + i * 0.4)) * (1 - ei(seg(t, 20.0, 20.6))); l.setAttribute('x2', lerp(280, 1040, eio(seg(t, 15.4 + i * 0.4, 16.4 + i * 0.4))).toFixed(1)); });
    UI.rise(this.set, t, 20.6, { s: 0.9 });
    this.set.transform += ' translateX(-100%)';
    this.tutor.render(t);
  },
});
