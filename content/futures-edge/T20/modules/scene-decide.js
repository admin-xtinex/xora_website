// Layer 6: a tentative decision with a written reason. Here: WAIT.
const DC_W = 15.0;
kit.scene('decide', UI.layerScene(kit, {
  layer: 5, a: DC_W, val: 0.6,
  kick: 'Step 6 · Tentative decision', title: 'Buy, sell or wait, and why?',
  card: '<div style="display:flex;gap:16px">' + ['BUY', 'SELL', 'WAIT'].map((b) => '<span class="dc-b mono" style="flex:1;text-align:center;padding:6px 0;border-radius:14px;font-size:28px;font-weight:700;border:2px solid color-mix(in srgb, var(--second) 25%, transparent)">' + b + '</span>').join('') + '</div>' +
    '<p style="margin:12px 0 0;font-size:28px;font-weight:600;white-space:nowrap"><span style="color:color-mix(in srgb, var(--second) 60%, var(--ground))">Why: </span><span class="dc-why"></span><span class="dc-cur" style="color:var(--main)">|</span></p>',
  cardInit(kit, el) { this.bs = [...el.querySelectorAll('.dc-b')].map((e) => e.style); this.why = el.querySelector('.dc-why'); this.cur = el.querySelector('.dc-cur').style; },
  cardRender(t) {
    const W = 'Resistance, weak volume, reward < risk';
    UI.set(this.why, W.slice(0, Math.floor(W.length * kit.seg(t, 7.2, 13.0))));
    this.cur.opacity = t > 7.0 && Math.floor(t * 2.2) % 2 === 0 ? 1 : 0;
    const p = kit.eo(kit.seg(t, DC_W, DC_W + 0.4));
    this.bs.forEach((s, i) => {
      if (i === 2) { s.background = 'color-mix(in srgb, var(--main) ' + (p * 100).toFixed(0) + '%, transparent)'; s.color = p > 0.5 ? 'var(--ground)' : 'var(--second)'; s.borderColor = p > 0 ? 'var(--main)' : ''; s.transform = 'scale(' + (1 + 0.1 * Math.sin(Math.PI * kit.seg(t, DC_W, DC_W + 0.5))).toFixed(3) + ')'; }
      else s.opacity = kit.lerp(1, 0.4, p);
    });
  },
  poses: [{ t: 0, pose: 'magnify' }, { t: 0.6, pose: 'explain' }, { t: 7.0, pose: 'writing' }, { t: DC_W, pose: 'thumbs' }],
}));
