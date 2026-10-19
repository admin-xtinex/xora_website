kit.score(function (S, T) {
  // A soft bed under the captions: pad and keys, a light pulse while we tour the screen, quieter for the safety parts.
  const BPM = 84, B = 60 / BPM, BAR = 4 * B;
  S.tempo(BPM, { t0: 0 });
  S.program('pad', 'pad', { rev: 0.7, gain: -6 });
  S.program('keys', 'ep', { rev: 0.45, gain: -10 });
  S.program('mal', 'pluck', { rev: 0.5, gain: -12, pan: 0.2 });
  S.program('bass', 'bass', { gain: -10 });
  const prog = [['D3', 'A3', 'E4', 'F#4'], ['B2', 'F#3', 'A3', 'D4'], ['G2', 'D3', 'F#3', 'B3'], ['A2', 'E3', 'A3', 'C#4']];
  const roots = ['D2', 'B1', 'G1', 'A1'];
  const tops = [['F#5', 'A5', 'E5'], ['D5', 'F#5', 'A5'], ['B4', 'D5', 'F#5'], ['C#5', 'E5', 'A5']];
  const inR = (s, a, b) => s >= a - 0.1 && s < b - 0.1;
  const pulse = (s) => inR(s, T.watchlist, T.security) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.security, T.try) || inR(s, T.risks, T.recap);
  const bars = Math.floor(T.END / BAR);
  for (let b = 0; b < bars; b++) {
    const beat = b * 4, s = beat * B, c = prog[b % 4];
    if (s >= T.next - 0.1) break;
    S.chord('pad', c, { beat, beats: 4, vel: quiet(s) ? 26 : 32 });
    if (!quiet(s)) S.chord('keys', c.slice(1), { beat, beats: 3, vel: 34 });
    if (pulse(s)) { S.pattern('mal', 'x.x..x.x', { from: beat, repeat: 1, pitch: tops[b % 4], vel: 34 }); S.note('bass', roots[b % 4], { beat, beats: 3, vel: 48 }); }
  }
  const steps = (a, b) => { const ts = []; for (let s = a + 0.18; s < b; s += 0.364) ts.push(s); S.ticks(ts, { vel: 24 }); };
  steps(T.title, T.title + 2.6); steps(T.next + 0.1, T.next + 1.1);
  const pop = (t, v) => S.fx('pop', t, { vel: v || 28, pitch: 7 });
  const tick = (t, v) => S.fx('tick', t, { vel: v || 26 });
  pop(T.title + 2.9);
  // Hook: panels land, the mock label, then each region lights.
  for (let i = 0; i < 6; i++) pop(T.hook + 0.4 + i * 0.45, 24);
  S.fx('whoosh', T.hook + 5.9, { dur: 1.0, vel: 22 }); S.fx('chime', T.hook + 6.3, { vel: 32 });
  for (let i = 0; i < 8; i++) tick(T.hook + 13.9 + i * 0.32, 22);
  // Layout: one pop per numbered part.
  [5.4, 6.3, 7.2, 8.1, 9.0, 10.3, 11.5, 12.7].forEach((a) => pop(T.layout + a, 30));
  // Watchlist: typing, filter, tap, switch.
  [6.9, 7.3, 7.7].forEach((a) => tick(T.watchlist + a, 30));
  S.fx('whoosh', T.watchlist + 8.2, { dur: 0.8, vel: 20 }); pop(T.watchlist + 12.1, 34); S.fx('ding', T.watchlist + 13.2, { vel: 36 });
  // Symbol bar: marks, then the example counts up.
  [1.6, 7.0, 9.2].forEach((a) => pop(T.symbol + a, 28));
  for (let i = 0; i < 8; i++) tick(T.symbol + 13.0 + i * 0.25, 20);
  S.fx('ding', T.symbol + 16.0, { vel: 36 });
  // Chart: candle grows, timeframe regroups.
  pop(T.chart + 2.6); S.fx('whoosh', T.chart + 13.4, { dur: 1.0, vel: 22 }); pop(T.chart + 14.0, 30);
  // Order book: spread, then a market buy takes the best ask.
  pop(T.book + 7.6, 30); S.fx('whoosh', T.book + 14.3, { dur: 0.8, vel: 22 }); S.fx('thud', T.book + 15.1, { vel: 28 }); S.fx('ding', T.book + 15.6, { vel: 36 });
  // Order entry: tabs, typing, value, the mock-only stamp.
  [1.8, 3.2, 4.6].forEach((a) => tick(T.entry + a, 28));
  for (let i = 0; i < 6; i++) tick(T.entry + 7.9 + i * 0.18, 22);
  for (let i = 0; i < 5; i++) tick(T.entry + 9.9 + i * 0.2, 22);
  S.fx('ding', T.entry + 14.2, { vel: 34 }); pop(T.entry + 19.9, 32); S.fx('thud', T.entry + 20.3, { vel: 32 });
  // Positions: the fill, PnL up, PnL down.
  S.fx('chime', T.positions + 1.8, { vel: 32 }); S.fx('ding', T.positions + 15.4, { vel: 34 }); S.fx('thud', T.positions + 18.0, { vel: 26 }); pop(T.positions + 19.8, 26);
  // Wallet: in-use bar fills, available is found.
  S.fx('whoosh', T.wallet + 6.8, { dur: 1.0, vel: 20 }); S.fx('ding', T.wallet + 13.4, { vel: 34 });
  // Security: drawer, switches, the warning.
  S.fx('whoosh', T.security + 1.6, { dur: 0.9, vel: 22 });
  [6.0, 12.4, 14.6].forEach((a) => pop(T.security + a, 30));
  S.fx('chime', T.security + 12.7, { vel: 28 }); S.fx('thud', T.security + 18.8, { vel: 28 });
  // Mistake: the update swaps buttons, a tap from memory.
  pop(T.mistake + 3.3, 26); S.fx('whoosh', T.mistake + 7.4, { dur: 1.0, vel: 24 }); S.fx('thud', T.mistake + 9.9, { vel: 34 }); S.fx('chime', T.mistake + 14.2, { vel: 32 });
  // Try it: countdown and answer.
  pop(T.try + 0.8, 30);
  for (let i = 0; i < 5; i++) tick(T.try + 3.6 + i, 30);
  S.fx('chime', T.try + 9.3, { vel: 42 }); pop(T.try + 16.0, 28);
  [4.2, 9.4, 14.5, 20.2].forEach((a) => pop(T.risks + a, 28));
  [0.8, 6.2, 12.1].forEach((a) => pop(T.recap + a, 32));
  S.fx('ding', T.recap + 21.2, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21.5, fadeOut: 2.5 });
});
