const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// Fictional prices. The last price has one odd spike down at ~14 s; the mark price barely moves. From 20 s both fall.
const MK_X = (t) => 1010 + Math.min(t, 23) / 23 * 720, MK_Y = (p) => 420 - (p - 59500) / 1000 * 260;
kit.scene('mark', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const r = kit.rng(77); this.noise = []; for (let i = 0; i < 240; i++) this.noise.push((r() - 0.5));
    let grid = '';
    [59000, 59500, 60000].forEach((p) => { grid += '<line x1="1010" x2="1730" y1="' + MK_Y(p) + '" y2="' + MK_Y(p) + '" style="stroke:color-mix(in srgb, var(--second) 8%, transparent);stroke-width:1.5"/><text x="1740" y="' + (MK_Y(p) + 8) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:760px"><p class="kick mk-k">New word · mark price</p>' +
      '<h2 class="line mk-t" style="font-size:72px">Mark price</h2></div>' +
      '<div class="glass mk-def" style="left:140px;top:320px;width:760px;padding:26px 34px"><p class="def mk-d" style="margin:0"><b>Mark price</b> is a reference price the exchange works out, often from several markets. It is usually what liquidation checks use.</p></div>' +
      '<div class="glass mk-note" style="left:140px;top:590px;width:760px;padding:20px 34px"><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">It filters out one odd trade. It does <span style="color:var(--accent)">not</span> stop a real crash.</p></div>' +
      '<div class="glass mk-g" style="left:960px;top:170px;width:820px;height:560px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="mk-chart">' + grid +
      '<path class="mk-last" fill="none" stroke-width="2.5" stroke-linejoin="round" style="stroke:color-mix(in srgb, var(--second) 70%, transparent)"/>' +
      '<path class="mk-mark" fill="none" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" style="stroke:var(--main)"/>' +
      '<circle class="mk-spk" r="16" fill="none" stroke-width="3" style="stroke:var(--accent)"/></g>' +
      '<text x="990" y="214" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC · fictional · illustrative</text>' +
      '<g class="mk-leg"><line x1="1000" x2="1040" y1="690" y2="690" stroke-width="3" style="stroke:color-mix(in srgb, var(--second) 70%, transparent)"/><text x="1052" y="698" style="fill:var(--second);font-size:24px">Last trade price</text>' +
      '<line x1="1330" x2="1370" y1="690" y2="690" stroke-width="6" style="stroke:var(--main)"/><text x="1382" y="698" style="fill:var(--second);font-size:24px">Mark price</text></g></svg>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.def = q('.mk-def').style; this.d = q('.mk-d'); this.note = q('.mk-note').style;
    this.g = q('.mk-g').style; this.chart = q('.mk-chart').style; this.leg = q('.mk-leg').style;
    this.last = q('.mk-last'); this.mark = q('.mk-mark'); this.spk = q('.mk-spk');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 6.8, pose: 'present' }, { t: 13.4, pose: 'magnify' }, { t: 19.9, pose: 'calm' }],
      says: [],
    });
  },
  // Price model: gentle drift; spike only in the last price; crash for both after 20 s.
  base(s) { return 59850 + Math.sin(s * 0.7) * 60 + Math.sin(s * 1.9) * 25 - 650 * eio(clamp01((s - 20) / 3)); },
  lastP(s) { const i = Math.min(239, Math.floor(s * 10)); const sp = Math.max(0, 1 - Math.abs(s - 14.0) / 0.45); return this.base(s) + this.noise[i] * 70 - 950 * sp; },
  markP(s) { const sp = Math.max(0, 1 - Math.abs(s - 14.1) / 0.9); return this.base(s) - 40 * sp; },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.def, t, 0.7, 0.7);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.04 });
    this.g.opacity = eo(seg(t, 2.0, 2.6)); this.chart.opacity = eo(seg(t, 2.4, 3.0)); this.leg.opacity = eo(seg(t, 2.6, 3.2));
    let a = '', m = '';
    const end = Math.max(0.1, Math.min(t, 23));
    for (let s = 0; s <= end + 1e-6; s += 0.1) {
      a += (s ? 'L' : 'M') + MK_X(s).toFixed(1) + ' ' + MK_Y(this.lastP(s)).toFixed(1);
      m += (s ? 'L' : 'M') + MK_X(s).toFixed(1) + ' ' + MK_Y(this.markP(s)).toFixed(1);
    }
    this.last.setAttribute('d', a); this.mark.setAttribute('d', m);
    const sk = seg(t, 14.0, 14.4);
    this.spk.setAttribute('cx', MK_X(14.0).toFixed(1)); this.spk.setAttribute('cy', MK_Y(this.lastP(14.0)).toFixed(1));
    this.spk.style.opacity = (eo(sk) * (0.6 + 0.4 * Math.sin(t * 5))).toFixed(3);
    UI.rise(kit, this.note, t, 19.9, 0.7);
    this.tutor.render(t);
  },
});
