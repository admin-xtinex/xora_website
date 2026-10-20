const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A fictional price line writes across; short trades open and close along it, each one small and brief.
const DF_P = (s) => 60050 + 60 * Math.sin(s * 9.1) + 35 * Math.sin(s * 23.7 + 0.6) + 20 * Math.sin(s * 51 + 2);
const dfX = (s) => 1000 + s * 720, dfY = (p) => 560 - (p - 60050) / 260 * 300;
const DF_TR = [[0.08, 0.16], [0.3, 0.36], [0.47, 0.57], [0.68, 0.73], [0.84, 0.93]];
const DF_A = 4.4, DF_B = 16.0;
kit.scene('define', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let br = '';
    DF_TR.forEach((r) => {
      br += '<rect class="df-b" x="' + dfX(r[0]).toFixed(1) + '" y="370" width="' + (dfX(r[1]) - dfX(r[0])).toFixed(1) + '" height="380" rx="8" style="fill:color-mix(in srgb, var(--main) 14%, transparent);stroke:color-mix(in srgb, var(--main) 60%, transparent);stroke-width:2"/>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + br +
      '<path class="df-l" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="df-d" r="10" style="fill:var(--main)"/>' +
      '<line x1="1000" x2="1720" y1="760" y2="760" stroke-width="2" style="stroke:color-mix(in srgb, var(--second) 25%, transparent)"/></svg>' +
      '<p class="fict" style="position:absolute;left:1000px;top:330px;margin:0">Fictional price · each box is one short trade</p>' +
      '<p class="kick df-ax" style="position:absolute;left:1600px;top:770px;margin:0;font-size:20px">time →</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick df-k">Scalping</p>' +
      '<h2 class="line df-t">Small moves, short trades</h2></div>' +
      '<p class="def df-d2" style="position:absolute;left:140px;top:330px;width:780px;margin:0"><b>Scalping</b> means trying to profit from small price moves, in trades that last seconds to minutes.</p>' +
      '<p class="chip df-a" style="position:absolute;left:140px;top:520px;margin:0;font-size:28px"><span class="dot"></span>Like a stall: many small sales, thin margins</p>' +
      '<p class="chip df-c" style="position:absolute;left:140px;top:610px;margin:0;font-size:28px;border-color:var(--accent)"><span class="dot" style="background:var(--accent)"></span>So costs matter a lot</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.df-k').style; this.t = q('.df-t'); this.d = q('.df-d2'); this.a = q('.df-a').style; this.c = q('.df-c').style;
    this.l = q('.df-l'); this.dot = q('.df-d'); this.bs = [...kit.stage.querySelectorAll('.df-b')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'explain' }, { t: 7.0, pose: 'point', flip: true }, { t: 12.8, pose: 'idea' }, { t: 18.3, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.7, { stagger: 0.035 });
    const e = Math.max(0.002, seg(t, DF_A, DF_B));
    this.l.setAttribute('d', UI.line(DF_P, 0, e, dfX, dfY, 0.004));
    this.dot.setAttribute('cx', dfX(e).toFixed(1)); this.dot.setAttribute('cy', dfY(DF_P(e)).toFixed(1)); this.dot.style.opacity = eo(seg(t, DF_A - 0.3, DF_A));
    // Each box opens when the line reaches its start and grows until its end: a short trade.
    this.bs.forEach((s, i) => {
      const r = DF_TR[i], g = Math.max(0, Math.min(1, (e - r[0]) / (r[1] - r[0])));
      s.opacity = e > r[0] ? 1 : 0; s.transformBox = 'fill-box'; s.transformOrigin = '0 50%'; s.transform = 'scaleX(' + Math.max(0.02, g).toFixed(3) + ')';
    });
    UI.rise(this.a, t, 12.9);
    UI.rise(this.c, t, 18.4);
    this.tutor.render(t);
  },
});
