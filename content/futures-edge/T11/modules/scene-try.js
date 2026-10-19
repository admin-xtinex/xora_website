const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TRY_R = 60, TRY_C = 2 * Math.PI * TRY_R;
// [text, bin (0 spot, 1 futures), pool centre x, y, final centre x, y, sorted at]
const TS = [
  ['Buy BTC and hold it in your wallet', 0, 560, 350, 520, 630, 9.4],
  ['Open a long BTCUSDT perpetual', 1, 1340, 350, 1380, 620, 14.0],
  ['Pay funding at set times', 1, 560, 430, 1380, 676, 14.6],
  ['Can be liquidated', 1, 1340, 430, 1380, 732, 15.2],
  ['Withdraw the coins to your own wallet', 0, 950, 510, 520, 700, 10.2],
];
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const bin = (cls, x, label, col) => '<div class="glass ' + cls + '" style="left:' + x + 'px;top:560px;width:760px;height:216px;padding:14px 26px"><p class="kick" style="margin:0;color:' + col + '">' + label + '</p></div>';
    let chips = '';
    TS.forEach((s) => { chips += '<span class="chip ts-c" style="position:absolute;left:0;top:0;font-size:26px;padding:10px 22px">' + s[0] + '</span>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1200px"><p class="kick ts-k">Your turn</p>' +
      '<h2 class="line ts-t">Spot or futures?</h2></div>' +
      bin('ts-b0', 140, 'Spot', 'var(--main)') + bin('ts-b1', 1000, 'Futures', 'var(--accent)') + chips +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ts-ring" transform="translate(1560 230)">' +
      '<circle r="' + TRY_R + '" fill="none" stroke-width="12" style="stroke:color-mix(in srgb, var(--second) 10%, transparent)"/>' +
      '<circle class="ts-arc" r="' + TRY_R + '" fill="none" stroke-width="12" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="' + TRY_C.toFixed(1) + '" style="stroke:var(--main)"/>' +
      '<text class="ts-n mono" y="20" text-anchor="middle" style="fill:var(--second);font-size:56px"></text></g></svg>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.ts-k').style; this.t = q('.ts-t');
    this.bins = [q('.ts-b0').style, q('.ts-b1').style];
    this.chips = [...kit.stage.querySelectorAll('.ts-c')].map((e) => e.style);
    this.ring = q('.ts-ring').style; this.arc = q('.ts-arc'); this.n = q('.ts-n');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.5, pose: 'present' }, { t: 3.6, pose: 'think' }, { t: 9.2, pose: 'explain' }, { t: 18.9, pose: 'cheer' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const bp = seg(t, 0.6, 1.3);
    this.bins.forEach((b) => { b.opacity = eo(bp); b.transform = 'translateY(' + lerp(30, 0, eo(bp)) + 'px)'; });
    const glow = [0, 0];
    this.chips.forEach((c, i) => {
      const s = TS[i], show = seg(t, 1.2 + i * 0.3, 1.6 + i * 0.3), mv = eio(seg(t, s[6], s[6] + 0.8));
      c.opacity = eo(show);
      const x = lerp(s[2], s[4], mv), y = lerp(s[3], s[5], mv) - Math.sin(Math.PI * mv) * 50;
      c.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + (lerp(0.7, 1, eob(show, 1.7)) * lerp(1, 0.96, mv)).toFixed(4) + ')';
      const done = t >= s[6] + 0.8;
      c.background = done ? 'color-mix(in srgb, var(--ground) 70%, ' + (s[1] ? 'var(--accent)' : 'var(--main)') + ')' : '';
      c.borderColor = done ? (s[1] ? 'var(--accent)' : 'var(--main)') : '';
      const land = seg(t, s[6] + 0.8, s[6] + 1.4);
      if (land > 0 && land < 1) glow[s[1]] = Math.max(glow[s[1]], Math.sin(Math.PI * land));
    });
    this.bins.forEach((b, i) => { b.borderColor = 'color-mix(in srgb, ' + (i ? 'var(--accent)' : 'var(--main)') + ' ' + (22 + glow[i] * 60).toFixed(0) + '%, transparent)'; });
    this.ring.opacity = (eo(seg(t, 3.0, 3.5)) * (1 - ei(seg(t, 8.8, 9.3)))).toFixed(3);
    this.arc.setAttribute('stroke-dashoffset', (TRY_C * seg(t, 3.6, 8.6)).toFixed(1));
    UI.set(this.n, t < 3.6 ? '5' : String(Math.min(5, Math.max(0, Math.ceil(5 - (t - 3.6))))));
    this.tutor.render(t);
  },
});
