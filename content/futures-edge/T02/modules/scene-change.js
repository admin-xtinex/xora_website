const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Two worked moves: [old, new, appear times for old, new, change, percent].
const CH_ROWS = [[60000, 61200, [5.8, 6.4, 7.6, 10.8]], [60000, 57000, [15.8, 16.3, 17.0, 17.8]]];
kit.scene('change', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const tile = (cls, top, big, small, hl) => '<div class="glass ch-p ' + cls + '" style="position:relative;width:320px;padding:16px 26px;' + (hl ? 'border-color:var(--main);background:color-mix(in srgb, var(--ground) 75%, var(--main))' : '') + '"><p class="fict" style="margin:0 0 6px">' + top + '</p><p class="mono ' + cls + '-n" style="margin:0;font-size:48px">' + big + '</p><p style="margin:4px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + small + '</p></div>';
    const op = (s) => '<span class="mono ch-p" style="font-size:52px;color:var(--main)">' + s + '</span>';
    let rows = '';
    CH_ROWS.forEach((r, i) => {
      const c = r[1] - r[0];
      rows += '<div style="position:absolute;left:140px;top:' + (440 + i * 166) + 'px;display:flex;align-items:center;gap:22px">' +
        tile('ch-o' + i, 'Old price', UI.fmt(r[0]), 'USDT') + op('→') + tile('ch-n' + i, 'New price', UI.fmt(r[1]), 'USDT') + op('⇒') +
        tile('ch-c' + i, 'Change', '', 'USDT', true) + tile('ch-q' + i, 'Change %', '', (c > 0 ? '' : '−') + UI.fmt(Math.abs(c)) + ' ÷ ' + UI.fmt(r[0]) + ' × 100', true) + '</div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1500px"><p class="kick ch-k">Worked example</p>' +
      '<h2 class="line ch-t">How big was the move?</h2>' +
      '<p class="sub ch-s mono" style="font-size:30px">Change = new − old  ·  Change % = change ÷ old × 100</p></div>' +
      rows +
      '<p class="fict ch-f" style="position:absolute;left:1360px;top:250px;margin:0">Fictional prices</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ch-k').style; this.t = q('.ch-t'); this.s = q('.ch-s'); this.f = q('.ch-f').style;
    this.rows = CH_ROWS.map((r, i) => {
      const parts = [...q('.ch-o' + i).parentElement.children].map((e) => e.style);
      return { parts, c: q('.ch-c' + i + '-n'), q: q('.ch-q' + i + '-n') };
    });
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.6, pose: 'present' }, { t: 10.6, pose: 'checklist' }, { t: 15.8, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 1.0, { stagger: 0.08 });
    this.f.opacity = 0.9 * eo(seg(t, 1.6, 2.2));
    CH_ROWS.forEach((r, i) => {
      const at = r[2], R = this.rows[i];
      // parts: old, arrow, new, equals, change, percent
      const when = [at[0], at[1] - 0.2, at[1], at[2] - 0.2, at[2], at[3]];
      R.parts.forEach((s, j) => {
        const p = seg(t, when[j], when[j] + 0.6);
        s.opacity = eo(seg(t, when[j], when[j] + 0.3));
        s.transform = 'translateY(' + lerp(30, 0, eo(p)) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.6)) + ')';
      });
      const c = r[1] - r[0], cv = Math.round(c * eo(seg(t, at[2] + 0.1, at[2] + 1.1)));
      UI.set(R.c, (cv > 0 ? '+' : cv < 0 ? '−' : '') + UI.fmt(Math.abs(cv)));
      const pv = c / r[0] * 100 * eo(seg(t, at[3] + 0.1, at[3] + 1.1));
      UI.set(R.q, (pv > 0.005 ? '+' : pv < -0.005 ? '−' : '') + Math.abs(pv).toFixed(1) + '%');
    });
    this.tutor.render(t);
  },
});
