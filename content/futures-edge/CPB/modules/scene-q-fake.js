const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Price tests resistance, pokes above it, then falls back inside within two candles.
const QB3 = [[30, 262], [80, 214], [120, 240], [170, 168], [210, 204], [260, 150], [300, 186], [340, 146], [385, 88], [425, 96], [465, 170], [505, 200], [535, 214]];
kit.scene('q-fake', {
  init(kit) {
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Resistance zone</p><p class="fict" style="position:absolute;left:28px;top:300px;margin:0">Illustrative</p>' +
      '<svg width="560" height="340" viewBox="0 0 560 340" style="position:absolute;left:0;top:0"><rect x="24" y="114" width="512" height="34" rx="6" style="fill:color-mix(in srgb, var(--accent) 20%, transparent);stroke:color-mix(in srgb, var(--accent) 65%, transparent);stroke-width:2"/>' +
      '<path class="qb3-p" d="' + UI.d(QB3) + '" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<g class="qb3-o"><circle cx="385" cy="88" r="20" fill="none" stroke-width="3" style="stroke:var(--up)"/><text x="385" y="58" text-anchor="middle" style="font-size:22px;fill:var(--up)">Break</text></g>' +
      '<g class="qb3-b"><circle cx="465" cy="170" r="20" fill="none" stroke-width="3" style="stroke:var(--down)"/><text x="465" y="222" text-anchor="middle" style="font-size:22px;fill:var(--down)">Back inside</text></g>' +
      '<g class="qb3-w"><rect x="196" y="268" width="168" height="48" rx="24" style="fill:var(--main)"/><text x="280" y="301" text-anchor="middle" class="mono" style="font-size:26px;fill:var(--ground)">WAIT</text></g></svg>';
    this.chrome = UI.chrome(kit);
    this.quiz = UI.quiz(kit, {
      n: 3, from: 'T16 · T17', q: 'Price breaks above resistance, then falls back inside within two candles.',
      opts: ['A confirmed breakout: buy now', 'Maybe a fakeout: wait for more evidence', 'A sure reversal: sell now', 'Proof the zone is gone'],
      ok: 1, bad: 0, vis,
      why: 'Back inside the zone can mean a fakeout. Waiting is fine.',
      whyNot: 'A break alone is not confirmation.',
    });
    const q = (s) => kit.stage.querySelector(s);
    this.p = q('.qb3-p'); this.o = q('.qb3-o').style; this.b = q('.qb3-b').style; this.w = q('.qb3-w').style;
  },
  render(t) {
    this.chrome(t);
    this.p.setAttribute('stroke-dasharray', eio(seg(t, 1.6, 5.0)).toFixed(3) + ' 1');
    this.o.opacity = eo(seg(t, 4.0, 4.4)); this.b.opacity = eo(seg(t, 4.9, 5.3));
    const w = seg(t, 8.0, 8.5);
    this.w.opacity = eo(w); this.w.transformBox = 'fill-box'; this.w.transformOrigin = 'center'; this.w.transform = 'scale(' + lerp(0.6, 1, eob(w, 1.8)).toFixed(3) + ')';
    this.quiz(t);
  },
});
