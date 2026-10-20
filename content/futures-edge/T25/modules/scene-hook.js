const { seg, eo, ei, eob, eio, lerp } = kit;
const HK = [['1-minute candles', 'closed ones only', 2.0], ['Volatility & swings', 'ATR, turning points', 7.2], ['Trend', 'per timeframe', 8.2], ['Zones', 'support, resistance', 9.2],
  ['Movement', 'momentum, pressure, volume', 10.4], ['Candidate setups', 'reaction, breakout, retest', 11.6], ['A plan for one candle', 'or no plan at all', 13.2]];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let html = '', lines = '';
    const P = HK.map((h, i) => [140 + (i % 4) * 390, i < 4 ? 330 : 560]);
    P[4][0] += 195; P[5][0] += 195; P[6][0] += 195;
    HK.forEach((h, i) => {
      html += '<div class="glass hk-c" style="left:' + P[i][0] + 'px;top:' + P[i][1] + 'px;width:360px;height:170px;padding:20px 24px;display:flex;flex-direction:column;gap:8px' + (i === 6 ? ';border-color:var(--main)' : '') + '">' +
        '<span class="mono" style="font-size:24px;color:var(--main)">' + String(i + 1).padStart(2, '0') + '</span><span style="font-size:31px;font-weight:700;line-height:1.15">' + h[0] + '</span><span style="font-size:24px;color:color-mix(in srgb, var(--second) 62%, var(--ground))">' + h[1] + '</span></div>';
      if (i) lines += '<line class="hk-l" x1="' + (P[i - 1][0] + 180) + '" y1="' + (P[i - 1][1] + 85) + '" x2="' + (P[i][0] + 180) + '" y2="' + (P[i][1] + 85) + '" pathLength="1" stroke-width="4" style="stroke:color-mix(in srgb, var(--main) 55%, transparent)"/>';
    });
    kit.stage.append(kit.h('<div><svg class="art" viewBox="0 0 1920 1080">' + lines + '</svg>' + html + '</div>'));
    this.head = UI.head(kit, 'Every minute, for every coin', 'Inside the routine');
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.cs = all('.hk-c').map((e) => e.style); this.ls = all('.hk-l');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'think' }, { t: 6.5, pose: 'pointer' }, { t: 12.7, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.cs.forEach((s, i) => {
      const a = HK[i][2], p = seg(t, a, a + 0.6);
      s.opacity = eo(seg(t, a, a + 0.35)).toFixed(3);
      s.transform = 'translateY(' + lerp(26, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.94, 1, eob(p, 1.6)).toFixed(4) + ')';
      UI.glow(s, eo(seg(t, a, a + 0.3)) * (1 - ei(seg(t, a + 0.9, a + 1.4))) + (i === 6 ? eo(seg(t, 13.6, 14.0)) * (0.7 + 0.3 * Math.sin(t * 3)) : 0));
    });
    this.ls.forEach((l, i) => l.setAttribute('stroke-dasharray', eio(seg(t, HK[i + 1][2] - 0.5, HK[i + 1][2])) + ' 1'));
    this.tutor.render(t);
  },
});
