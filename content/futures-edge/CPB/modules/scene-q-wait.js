const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The checklist reads neutral on every line; after the reveal NO_TRADE lights up.
const QB6 = [['Trend', 'flat'], ['Range', 'price in the middle'], ['Volume', 'low'], ['Level', 'none near']];
kit.scene('q-wait', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    QB6.forEach((r) => {
      rows += '<div class="qb6-r" style="display:flex;align-items:center;gap:14px;height:44px"><span style="width:14px;height:14px;border-radius:50%;background:color-mix(in srgb, var(--second) 45%, transparent)"></span>' +
        '<span style="width:110px;font-size:26px;font-weight:600">' + r[0] + '</span><span class="mono" style="font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + r[1] + '</span></div>';
    });
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Entry checklist</p><p class="fict" style="position:absolute;right:24px;top:300px;margin:0">Fictional · demo</p>' +
      '<div style="position:absolute;left:28px;top:66px">' + rows + '</div>' +
      '<div class="qb6-d mono" style="position:absolute;left:28px;top:264px;padding:10px 26px;border-radius:999px;font-size:28px;background:var(--main);color:var(--ground)">NO_TRADE ✓</div>';
    this.quiz = UI.quiz(kit, {
      n: 6, from: 'T20 · T21', q: 'Mid-range, flat trend, low volume, no level near. Your decision?',
      opts: ['DEMO BUY: the last candle is green', 'DEMO SELL: it might drop', 'NO_TRADE: nothing lines up', 'Double the size to be sure'],
      ok: 2, bad: 0, vis,
      why: 'Neutral signals give no reason to take a risk.',
      whyNot: 'One green candle is not a reason.',
    });
    this.rs = [...kit.stage.querySelectorAll('.qb6-r')].map((e) => e.style); this.d = kit.stage.querySelector('.qb6-d').style;
  },
  render(t) {
    this.chrome(t);
    this.rs.forEach((s, i) => { const p = seg(t, 1.6 + i * 0.6, 2.0 + i * 0.6); s.opacity = eo(p); s.transform = 'translateX(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)'; });
    const p = seg(t, 7.9, 8.4);
    this.d.opacity = eo(p); this.d.transform = 'scale(' + lerp(0.6, 1, eob(p, 1.8)).toFixed(3) + ')'; this.d.transformOrigin = '0 50%';
    this.quiz(t);
  },
});
