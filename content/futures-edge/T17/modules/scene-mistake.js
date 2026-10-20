const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The same five fictional candles in two cards: an exact line (left) and a zone with patience (right).
const MS_C = UI.SR.PRE.slice(5).concat([UI.SR.FAKE[0]]);
const msY = (p) => 720 - (p - 60100) / 400 * 270, msX = (k, i) => (k ? 1050 : 230) + i * 115;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cl = UI.cdl(kit, 'ms-l', 5); this.cr = UI.cdl(kit, 'ms-r', 5);
    const card = (cls, x, kick, col, head) => '<div class="glass ' + cls + '" style="left:' + x + 'px;top:310px;width:760px;height:460px;padding:24px 32px;border-color:color-mix(in srgb, ' + col + ' 55%, transparent)">' +
      '<p class="kick" style="margin:0 0 6px;color:' + col + '">' + kick + '</p><p style="margin:0;font-size:34px;font-weight:700">' + head + '</p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      card('ms-a', 140, 'Common mistake', 'var(--down)', 'One exact line, chase the wick') + card('ms-b', 1000, 'Better', 'var(--main)', 'A zone, a close, and a maybe') +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<g class="ms-lg"><line x1="190" x2="840" y1="' + msY(60400).toFixed(1) + '" y2="' + msY(60400).toFixed(1) + '" stroke-width="3" style="stroke:var(--down)"/>' + this.cl.html + '</g>' +
      '<rect class="ms-zone" x="1030" y="' + msY(60400).toFixed(1) + '" width="660" height="' + (msY(60300) - msY(60400)).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--accent) 20%, transparent);stroke:color-mix(in srgb, var(--accent) 75%, transparent);stroke-width:2"/>' +
      '<g class="ms-rg">' + this.cr.html + '</g>' +
      '<g transform="translate(820 360)"><g class="ms-x"><circle r="30" style="fill:var(--down)"/><path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke-width="6" stroke-linecap="round" style="stroke:var(--ground)"/></g></g></svg>' +
      '<p class="tag ms-ln" style="left:190px;top:' + (msY(60400) - 50).toFixed(0) + 'px;color:var(--down);border-color:var(--down)">Exactly 60,400</p>' +
      '<p class="chip ms-go" style="position:absolute;left:200px;top:694px;margin:0;font-size:28px;padding:12px 24px;background:color-mix(in srgb, var(--ground) 60%, var(--down));border-color:var(--down)">Wick crossed! Buy now?</p>' +
      '<p class="tag ms-wt" style="left:1300px;top:' + (msY(60460) - 54).toFixed(0) + 'px;color:var(--main);border-color:var(--main)">Closed inside: not confirmed</p>' +
      '<p class="chip ms-wait" style="position:absolute;left:1040px;top:694px;margin:0;font-size:30px;padding:12px 28px;background:var(--main);color:var(--ground);border-color:var(--main)">WAIT · always allowed</p>' +
      '<p class="fict" style="position:absolute;left:1500px;top:715px;margin:0">Fictional candles</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick ms-k" style="color:var(--accent)">Watch out</p>' +
      '<h2 class="line ms-t">Levels are not walls</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ms-k').style; this.t = q('.ms-t'); this.a = q('.ms-a').style; this.b = q('.ms-b').style; this.lg = q('.ms-lg').style; this.rg = q('.ms-rg').style;
    this.zone = q('.ms-zone').style; this.x = q('.ms-x').style; this.ln = q('.ms-ln').style; this.go = q('.ms-go').style; this.wt = q('.ms-wt').style; this.wait = q('.ms-wait').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'confused' }, { t: 10.6, pose: 'explain' }, { t: 16.8, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.a, t, 0.6); UI.rise(this.b, t, 10.4);
    this.lg.opacity = eo(seg(t, 1.0, 1.6)); this.ln.opacity = eo(seg(t, 1.6, 2.1));
    this.rg.opacity = eo(seg(t, 10.6, 11.2));
    MS_C.forEach((c, i) => {
      // Left: the last candle forms at 6.4 (wick up through the line, close back below). Right: drawn complete.
      let k = { o: c[0], h: c[1], l: c[2], c: c[3] };
      if (i === 4) k = t >= 9.4 ? k : UI.forming([[6.4, 60310], [7.6, 60460], [9.4, 60350]], c[2], c[1], t);
      const a = 1.6 + i * 0.5;
      this.cl.set(i, { x: msX(0, i), w: 42, o: k.o, h: k.h, l: k.l, c: k.c, y: msY, live: !!k.live, op: i === 4 ? eo(seg(t, 6.2, 6.5)) : eo(seg(t, a, a + 0.3)) });
      this.cr.set(i, { x: msX(1, i), w: 42, o: c[0], h: c[1], l: c[2], c: c[3], y: msY, op: 1 });
    });
    const g = seg(t, 7.8, 8.3);
    this.go.opacity = eo(g) * (1 - 0.5 * eo(seg(t, 10.6, 11.0))); this.go.transform = 'scale(' + lerp(0.8, 1, eob(g, 1.7)).toFixed(3) + ')';
    const x = seg(t, 10.8, 11.3);
    this.x.opacity = eo(x); this.x.transformBox = 'fill-box'; this.x.transformOrigin = 'center'; this.x.transform = 'scale(' + lerp(0.4, 1, eob(x, 1.8)).toFixed(3) + ')';
    this.a.borderColor = 'color-mix(in srgb, var(--down) ' + (30 + 40 * eo(x)).toFixed(0) + '%, transparent)';
    const z = seg(t, 11.4, 12.2);
    this.zone.opacity = eo(z); this.zone.transformBox = 'fill-box'; this.zone.transformOrigin = 'center'; this.zone.transform = 'scaleY(' + lerp(0.1, 1, eob(z, 1.4)).toFixed(3) + ')';
    UI.rise(this.wt, t, 13.0, { dy: 12 });
    const w = seg(t, 17.0, 17.6);
    this.wait.opacity = eo(w); this.wait.transform = 'scale(' + (lerp(0.8, 1, eob(w, 1.7)) * kit.breathe(Math.max(0, t - 17.6), 0.015, 2.4)).toFixed(4) + ')';
    this.tutor.render(t);
  },
});
