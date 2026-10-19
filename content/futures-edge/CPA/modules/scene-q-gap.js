const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Mini chart inside the visual panel (560 × 340): stop line at 59,000; price gaps from 59,300 to 58,600.
const QA4_Y = (p) => 120 + (59400 - p) / 1000 * 180;
kit.scene('q-gap', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Long · stop-loss 59,000</p>' +
      '<svg width="560" height="340" viewBox="0 0 560 340" style="position:absolute;left:0;top:0">' +
      '<line x1="28" x2="530" y1="' + QA4_Y(59000) + '" y2="' + QA4_Y(59000) + '" stroke-dasharray="10 8" stroke-width="3" style="stroke:var(--accent)"/>' +
      '<text x="420" y="' + (QA4_Y(59000) - 10) + '" style="fill:var(--accent);font-size:22px">stop 59,000</text>' +
      '<path class="qa4-a" d="M28 ' + QA4_Y(59380) + ' L80 ' + QA4_Y(59340) + ' L130 ' + QA4_Y(59360) + ' L180 ' + QA4_Y(59320) + ' L230 ' + QA4_Y(59300) + '" pathLength="1" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<line class="qa4-j" x1="230" x2="230" y1="' + QA4_Y(59300) + '" y2="' + QA4_Y(58600) + '" stroke-width="3" stroke-dasharray="4 8" style="stroke:color-mix(in srgb, var(--second) 55%, transparent)"/>' +
      '<path class="qa4-b" d="M230 ' + QA4_Y(58600) + ' L290 ' + QA4_Y(58620) + ' L350 ' + QA4_Y(58580) + ' L410 ' + QA4_Y(58600) + '" pathLength="1" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<text class="qa4-t" x="44" y="' + (QA4_Y(58600) + 8) + '" style="fill:var(--second);font-size:22px">gap to 58,600</text>' +
      '<circle class="qa4-f" cx="230" cy="' + QA4_Y(58600) + '" r="12" style="fill:var(--accent)"/></svg>' +
      '<p class="fict" style="position:absolute;left:28px;top:304px;margin:0">Fictional prices</p>';
    this.quiz = UI.quiz(kit, {
      n: 4, from: 'T07 · T08', q: 'Stop at 59,000. Price gaps from 59,300 to 58,600. The fill?',
      opts: ['Exactly 59,000, guaranteed', 'Near 58,600, or even worse', 'Cancelled, with no loss', 'Back at 59,300'],
      ok: 1, bad: 0, vis,
      why: 'The stop triggers, then fills at the next price available.',
      whyNot: 'A stop is a trigger, not a price guarantee.',
    });
    const q = (s) => kit.stage.querySelector(s);
    this.a = q('.qa4-a'); this.b = q('.qa4-b'); this.j = q('.qa4-j').style; this.tx = q('.qa4-t').style; this.f = q('.qa4-f').style;
  },
  render(t) {
    this.chrome(t);
    this.a.setAttribute('stroke-dasharray', eio(seg(t, 1.6, 2.8)).toFixed(3) + ' 1');
    this.j.opacity = eo(seg(t, 3.0, 3.3)); this.tx.opacity = eo(seg(t, 3.2, 3.6));
    this.b.setAttribute('stroke-dasharray', eio(seg(t, 3.2, 4.2)).toFixed(3) + ' 1'); this.b.style.opacity = t > 3.2 ? 1 : 0;
    const fp = seg(t, 7.8, 8.3);
    this.f.opacity = eo(fp); this.f.transformBox = 'fill-box'; this.f.transformOrigin = 'center'; this.f.transform = 'scale(' + lerp(0.3, 1, eob(fp, 1.8)).toFixed(3) + ')';
    this.quiz(t);
  },
});
