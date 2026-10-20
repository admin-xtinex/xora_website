const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Two fictional 15-minute windows on the same scale. A: 60,000–60,150 (150 USDT, 0.25%), 80 BTC. B: 60,000–60,900 (900 USDT, 1.5%), 600 BTC.
// Example fees 0.05% per side: 0.10% round trip = 60 USDT per BTC at 60,000.
const CP_K = [
  [[0, 60060], [0.15, 60150], [0.3, 60020], [0.45, 60110], [0.6, 60000], [0.75, 60120], [0.9, 60040], [1, 60090]],
  [[0, 60200], [0.15, 60900], [0.3, 60300], [0.45, 60650], [0.6, 60000], [0.75, 60500], [0.9, 60150], [1, 60400]],
];
const CP_V = [[4, 6, 5, 5, 7, 4, 6, 5, 6, 5, 4, 6, 6, 5, 6], [30, 45, 38, 52, 40, 35, 48, 42, 36, 44, 50, 33, 39, 28, 40]];
const CP_R = [150, 900], CP_T = [4.8, 9.0];
const cpL = (k) => (k ? 960 : 140), cpX = (k) => (s) => cpL(k) + 50 + s * 640, cpY = (p) => 610 - (p - 60000) / 900 * 180, CP_B = 682;
kit.scene('compare', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (k) => {
      const L = cpL(k), col = k ? 'var(--accent)' : 'var(--main)';
      let bars = '';
      CP_V[k].forEach((v, i) => { bars += '<rect class="cp-v' + k + '" x="' + (L + 50 + i * 45.7 - 13).toFixed(1) + '" width="26" rx="3" style="fill:color-mix(in srgb, ' + col + ' 55%, transparent)"/>'; });
      return '<div class="glass cp-c" style="left:' + L + 'px;top:300px;width:760px;height:470px"></div>' +
        '<svg class="art" viewBox="0 0 1920 1080">' +
        '<line x1="' + (L + 40) + '" x2="' + (L + 700) + '" y1="' + cpY(60000) + '" y2="' + cpY(60000) + '" stroke-width="2" stroke-dasharray="8 6" class="cp-g' + k + '" style="stroke:color-mix(in srgb, var(--second) 30%, transparent)"/>' +
        '<line x1="' + (L + 40) + '" x2="' + (L + 700) + '" y1="' + cpY(60000 + CP_R[k]) + '" y2="' + cpY(60000 + CP_R[k]) + '" stroke-width="2" stroke-dasharray="8 6" class="cp-g' + k + '" style="stroke:' + col + '"/>' +
        '<path class="cp-l' + k + '" fill="none" stroke-width="4" stroke-linejoin="round" style="stroke:var(--second)"/>' + bars +
        '<rect class="cp-fr' + k + '" x="' + (L + 40) + '" y="704" width="680" height="44" rx="10" style="fill:color-mix(in srgb, ' + col + ' 22%, transparent);stroke:' + col + ';stroke-width:2"/>' +
        '<rect class="cp-ff' + k + '" x="' + (L + 40) + '" y="704" height="44" rx="10" style="fill:color-mix(in srgb, var(--down) 70%, transparent)"/></svg>' +
        '<p class="kick" style="position:absolute;left:' + (L + 34) + 'px;top:320px;margin:0;color:' + col + '">' + (k ? 'Window B · busy' : 'Window A · quiet') + '</p>' +
        '<p class="mono cp-s' + k + '" style="position:absolute;left:' + (L + 34) + 'px;top:358px;margin:0;font-size:30px">Range <span style="color:' + col + '">' + CP_R[k] + ' USDT · ' + (k ? '1.5%' : '0.25%') + '</span></p>' +
        '<p class="mono cp-s' + k + '" style="position:absolute;right:' + (1920 - L - 726) + 'px;top:358px;margin:0;font-size:30px">Volume ' + (k ? 600 : 80) + ' BTC</p>' +
        '<p class="mono cp-fl' + k + '" style="position:absolute;left:' + (L + 56) + 'px;top:710px;margin:0;font-size:24px;font-weight:600">' + (k ? 'Fees 60 ≈ 7% of the range' : 'Fees 60 = 40% of the range') + '</p>';
    };
    kit.stage.append(kit.h('<div class="ground">' + card(0) + card(1) +
      '<svg class="art" viewBox="0 0 1920 1080"><path class="cp-ar" d="M' + cpX(1)(0.17).toFixed(0) + ' ' + (cpY(60860)).toFixed(0) + ' L' + cpX(1)(0.28).toFixed(0) + ' ' + (cpY(60340)).toFixed(0) + '" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--down)"/></svg>' +
      '<p class="tag cp-at" style="left:1400px;top:398px;color:var(--down);border-color:var(--down)">−600 against a long</p>' +
      '<p class="fict" style="position:absolute;right:200px;top:262px;margin:0;text-align:right">Fictional · example fee 0.05% per side</p>' +
      '<div class="words" style="left:140px;top:160px;width:1100px"><p class="kick cp-k">Compare</p>' +
      '<h2 class="line cp-t">Two windows, same scale</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.cp-k').style; this.t = q('.cp-t'); this.cs = all('.cp-c').map((e) => e.style);
    this.K = [0, 1].map((k) => ({ l: q('.cp-l' + k), vs: all('.cp-v' + k), g: all('.cp-g' + k).map((e) => e.style), s: all('.cp-s' + k).map((e) => e.style), fr: q('.cp-fr' + k), ff: q('.cp-ff' + k), fl: q('.cp-fl' + k).style }));
    this.ar = q('.cp-ar'); this.at = q('.cp-at').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'present' }, { t: 4.6, pose: 'point', flip: true }, { t: 8.8, pose: 'magnify' }, { t: 12.9, pose: 'checklist' }, { t: 19.0, pose: 'confused' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.cs.forEach((s, k) => UI.rise(s, t, 0.8 + k * 0.3));
    this.K.forEach((o, k) => {
      const a = CP_T[k], f = (s) => UI.path(CP_K[k], s);
      const e = Math.max(0.002, eio(seg(t, a, a + 2.4)));
      o.l.setAttribute('d', UI.line(f, 0, e, cpX(k), cpY, 0.004)); o.l.style.opacity = eo(seg(t, a - 0.2, a));
      o.g.forEach((s) => { s.opacity = eo(seg(t, a + 2.2, a + 2.7)); });
      o.vs.forEach((r, i) => { const h = CP_V[k][i] * eob(seg(t, a + i * 0.12, a + i * 0.12 + 0.5), 1.4); r.setAttribute('y', (CP_B - h).toFixed(1)); r.setAttribute('height', Math.max(0, h).toFixed(1)); });
      o.s.forEach((s, i) => UI.rise(s, t, a + 0.4 + i * 1.6, { dy: 12 }));
      // Fee share of the range: 60 of 150 (40%) in A, 60 of 900 (about 7%) in B.
      const fa = 13.2 + k * 2.2, fp = seg(t, fa + 0.4, fa + 1.4);
      o.fr.style.opacity = eo(seg(t, fa, fa + 0.4));
      o.ff.setAttribute('width', (680 * 60 / CP_R[k] * eo(fp)).toFixed(1)); o.ff.style.opacity = fp > 0 ? 1 : 0;
      o.fl.opacity = eo(seg(t, fa + 1.2, fa + 1.6));
    });
    this.ar.setAttribute('stroke-dasharray', '1'); this.ar.setAttribute('pathLength', '1');
    this.ar.style.strokeDashoffset = (1 - eo(seg(t, 19.4, 20.2))).toFixed(3);
    UI.rise(this.at, t, 20.0, { dy: 10 });
    this.tutor.render(t);
  },
});
