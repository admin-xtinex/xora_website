const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Twelve fictional 1-minute candles [open, high, low, close]; each open is the previous close. #8 (10:07) is the lesson's candle.
const CH = [[59900, 59960, 59870, 59940], [59940, 59980, 59890, 59910], [59910, 59950, 59860, 59880], [59880, 59930, 59850, 59920], [59920, 59990, 59910, 59975], [59975, 60010, 59940, 59980],
  [59980, 60030, 59960, 60000], [60000, 60120, 59940, 60080], [60080, 60140, 60050, 60060], [60060, 60090, 60010, 60030], [60030, 60100, 60020, 60090]];
const CH_X0 = 230, CH_DX = 100, chX = (i) => CH_X0 + i * CH_DX, chY = (p) => 700 - (p - 59840) / 320 * 350;
// The last candle is still forming: its price wanders around the open.
const chLive = (t) => 60090 + Math.round(18 * Math.sin(t * 1.7) + 11 * Math.sin(t * 4.3 + 0.7) + 6 * Math.sin(t * 9.1));
kit.scene('chart', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'ch-c', 12);
    let labels = '', links = '';
    for (let i = 0; i < 12; i += 2) labels += '<text x="' + chX(i) + '" y="742" text-anchor="middle" class="axis">10:' + String(i).padStart(2, '0') + '</text>';
    for (let i = 0; i < 11; i++) {
      const y = chY(CH[i][3]).toFixed(1);
      links += '<line class="ch-ln" x1="' + (chX(i) + 30) + '" x2="' + (chX(i + 1) - 30) + '" y1="' + y + '" y2="' + y + '" stroke-width="3" stroke-dasharray="4 5" style="stroke:var(--second)"/>';
    }
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ch-grid">' + UI.grid(190, 1360, chY, 59850, 60150, 50) + labels + '</g>' +
      '<g class="ch-ax"><path d="M190 762 H1330" stroke-width="3" style="stroke:var(--main)"/><path d="M1318 752 L1334 762 L1318 772" fill="none" stroke-width="3" style="stroke:var(--main)"/>' +
      '<path d="M1480 720 V330" stroke-width="3" style="stroke:var(--main)"/><path d="M1470 342 L1480 326 L1490 342" fill="none" stroke-width="3" style="stroke:var(--main)"/></g>' +
      '<text class="ch-axt" x="1504" y="344" style="fill:var(--main);font-size:26px;font-weight:700">Price</text>' + links + this.cd.html +
      '<rect class="ch-mine" x="' + (chX(7) - 52) + '" y="' + (chY(60120) - 22) + '" width="104" height="' + (chY(59940) - chY(60120) + 44).toFixed(1) + '" rx="14" fill="none" stroke-width="3" stroke-dasharray="8 6" style="stroke:var(--main)"/></svg>' +
      '<p class="tag ch-tm" style="left:' + (chX(7) - 70) + 'px;top:' + (chY(60120) - 76).toFixed(1) + 'px">Our candle</p>' +
      '<p class="tag ch-fm" style="left:' + (chX(11) - 64) + 'px;top:' + (chY(60150) - 60).toFixed(1) + 'px;color:var(--main);border-color:var(--main)">Forming…</p>' +
      '<p class="kick ch-time" style="position:absolute;left:1350px;top:748px;margin:0">Time</p>' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick ch-k">From candle to chart</p>' +
      '<h2 class="line ch-t">One candle per minute</h2></div>' +
      '<p class="fict" style="position:absolute;left:1120px;top:240px;margin:0">BTC/USDT · 1-minute candles · fictional</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ch-k').style; this.t = q('.ch-t'); this.grid = q('.ch-grid').style; this.ax = q('.ch-ax').style; this.axt = q('.ch-axt').style; this.time = q('.ch-time').style;
    this.mine = q('.ch-mine').style; this.tm = q('.ch-tm').style; this.fm = q('.ch-fm').style; this.lns = all('.ch-ln').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.5, pose: 'present' }, { t: 6.3, pose: 'point', flip: true }, { t: 10.5, pose: 'magnify' }, { t: 14.8, pose: 'candles', flip: true }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    // Our candle arrives big in the middle and settles into its minute; the others appear around it.
    const m = eio(seg(t, 0.8, 2.6));
    CH.forEach((c, i) => {
      if (i === 7) {
        const k = lerp(2.2, 1, m), cx = lerp(800, chX(7), m), cy = lerp(520, chY(60030), m);
        this.cd.set(i, { x: cx, w: 60 * k, o: c[0], h: c[1], l: c[2], c: c[3], y: (p) => cy + (chY(p) - chY(60030)) * k, op: eo(seg(t, 0.5, 0.9)) });
      } else {
        const a = 2.4 + (i < 7 ? i : i - 1) * 0.22, p = seg(t, a, a + 0.5);
        this.cd.set(i, { x: chX(i), w: 60, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: chY, op: eo(seg(t, a, a + 0.25)) });
      }
    });
    // The newest candle, still forming.
    let hi = 60090, lo = 60090;
    const t0 = 4.4;
    for (let s = t0; s <= t + 1e-6; s += 0.1) { const v = chLive(s); hi = Math.max(hi, v); lo = Math.min(lo, v); }
    const last = t < t0 ? 60090 : chLive(Math.floor(t * 4) / 4);
    hi = Math.max(hi, last); lo = Math.min(lo, last);
    this.cd.set(11, { x: chX(11), w: 60, o: 60090, h: hi, l: lo, c: last, y: chY, live: true, op: eo(seg(t, 4.2, 4.6)) });
    const hl = seg(t, 2.6, 3.2);
    this.mine.opacity = eo(hl) * (1 - ei(seg(t, 5.8, 6.3))); this.tm.opacity = this.mine.opacity;
    const ax = seg(t, 6.4, 7.2);
    this.ax.opacity = eo(ax); this.axt.opacity = eo(seg(t, 8.0, 8.4)); this.time.opacity = eo(seg(t, 6.8, 7.2));
    this.lns.forEach((s, i) => { s.opacity = eo(seg(t, 10.8 + i * 0.25, 11.1 + i * 0.25)) * 0.8; });
    const f = seg(t, 15.0, 15.5);
    this.fm.opacity = eo(f) * (0.75 + 0.25 * Math.sin(t * 5));
    this.tutor.render(t);
  },
});
