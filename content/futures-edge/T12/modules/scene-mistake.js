const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:960px"><p class="kick ms-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line ms-t" style="font-size:72px;position:relative">“Leverage is free money”<span class="ms-strike" style="position:absolute;left:0;right:0;top:52%;height:6px;border-radius:3px;background:var(--accent)"></span></h2>' +
      '<p class="def ms-d">It is <b>extra exposure, not extra money</b>. Every loss on the full 1,000 USDT comes out of your 100 USDT margin.</p></div>' +
      '<div class="ms-chips" style="position:absolute;left:140px;top:640px;display:flex;gap:20px">' +
      '<span class="chip ms-c">Higher leverage ≠ better</span><span class="chip ms-c">Lower leverage ≠ safe</span></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<rect x="1240" y="190" width="520" height="400" rx="20" fill="none" stroke-width="3" stroke-dasharray="14 10" class="ms-big" style="stroke:color-mix(in srgb, var(--second) 45%, transparent)"/>' +
      '<text x="1270" y="240" class="ms-bigt" style="fill:var(--second);font-size:28px;font-weight:600">Exposure: 1,000 USDT</text>' +
      '<text x="1270" y="276" class="ms-bigs" style="fill:color-mix(in srgb, var(--second) 60%, var(--ground));font-size:24px">not your money</text>' +
      '<rect class="ms-small" x="1580" y="470" width="150" height="90" rx="14" stroke-width="3" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main)"/>' +
      '<text class="ms-st" x="1655" y="525" text-anchor="middle" style="fill:var(--second);font-size:28px;font-family:var(--mono)">100</text>' +
      '<text class="ms-sl" x="1655" y="455" text-anchor="middle" style="fill:var(--main);font-size:24px;font-weight:600">Your margin</text>' +
      '<g class="ms-arrows">' + [0, 1, 2].map((i) => '<path class="ms-ar" d="M' + (1330 + i * 70) + ' 330 Q ' + (1450 + i * 40) + ' 420 1570 ' + (500 + i * 12) + '" fill="none" stroke-width="4" stroke-linecap="round" pathLength="1" style="stroke:var(--accent)"/>').join('') + '</g>' +
      '<text x="1300" y="640" class="ms-lt" style="fill:var(--accent);font-size:26px;font-weight:600">Losses on all of it land here</text></svg>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ms-k').style; this.t = q('.ms-t'); this.strike = q('.ms-strike').style; this.d = q('.ms-d');
    this.chips = all('.ms-c').map((e) => e.style);
    this.big = [q('.ms-big').style, q('.ms-bigt').style, q('.ms-bigs').style]; this.small = [q('.ms-small').style, q('.ms-st').style, q('.ms-sl').style];
    this.ars = all('.ms-ar'); this.lt = q('.ms-lt').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 4.9, pose: 'explain' }, { t: 10.8, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.strike.transformOrigin = '0 50%'; this.strike.transform = 'scaleX(' + eio(seg(t, 4.9, 5.6)) + ')';
    TextFx.fadeFromRight(this.d, t, 5.4, { stagger: 0.04 });
    this.small.forEach((s) => { s.opacity = eo(seg(t, 1.2, 1.7)); });
    this.big.forEach((s) => { s.opacity = eo(seg(t, 2.2, 2.8)); });
    this.ars.forEach((a, i) => {
      const p = seg(t, 7.4 + i * 0.35, 8.4 + i * 0.35);
      a.setAttribute('stroke-dasharray', eo(p).toFixed(3) + ' 1');
      a.style.opacity = p > 0 ? 1 : 0;
    });
    this.lt.opacity = eo(seg(t, 8.4, 9.0));
    const hit = Math.sin(Math.PI * seg(t, 8.2, 9.4));
    this.small[0].fill = 'color-mix(in srgb, var(--ground) ' + (70 - 30 * hit).toFixed(0) + '%, ' + (hit > 0.05 ? 'var(--accent)' : 'var(--main)') + ')';
    this.chips.forEach((s, i) => UI.rise(kit, s, t, 10.8 + i * 1.6, 0.6, 20));
    this.tutor.render(t);
  },
});
