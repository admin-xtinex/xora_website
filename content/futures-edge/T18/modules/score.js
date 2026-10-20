kit.score(function (S, T) {
  // No voice: a soft pad and keys bed, a light pulse in the hands-on parts, quieter for the warnings.
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
  const pulse = (s) => inR(s, T.volume, T.range) || inR(s, T.lookback, T.liquidity) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.mistake, T.try) || inR(s, T.risks, T.recap);
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
  for (let i = 0; i < 15; i++) tick(T.title + 0.75 + i * 0.32, 14);
  // Hook: two paths draw, the +100 tags.
  S.fx('whoosh', T.hook + 5.6, { dur: 1.4, vel: 18 }); pop(T.hook + 10.8, 28); pop(T.hook + 11.1, 28);
  // Volume: four trades land in the bar, the sum.
  [10.2, 11.4, 12.6, 13.8].forEach((a) => { pop(T.volume + a, 22); S.fx('tick', T.volume + a + 1.05, { vel: 32 }); });
  S.fx('ding', T.volume + 15.0, { vel: 34 }); S.fx('chime', T.volume + 19.4, { vel: 30 });
  // Bars: candles and bars grow; quiet vs busy; the big moves.
  for (let i = 0; i < 15; i++) tick(T.bars + 1.0 + i * 0.3, 16);
  S.fx('whoosh', T.bars + 5.2, { dur: 0.8, vel: 16 }); pop(T.bars + 10.8, 28); pop(T.bars + 12.0, 30);
  [15.6, 15.9, 16.2].forEach((a) => pop(T.bars + a, 26));
  // Range: the candle forms, the bracket, the percent.
  S.fx('ding', T.range + 8.6, { vel: 30 }); S.fx('whoosh', T.range + 11.4, { dur: 0.8, vel: 18 }); S.fx('chime', T.range + 15.0, { vel: 32 });
  // Volatility: quiet candles, volatile candles, averages.
  for (let i = 0; i < 4; i++) { tick(T.volatility + 10.2 + i * 0.55, 18); pop(T.volatility + 15.1 + i * 0.55, 24); }
  S.fx('ding', T.volatility + 13.0, { vel: 28 }); S.fx('ding', T.volatility + 17.9, { vel: 32 }); S.fx('thud', T.volatility + 20.6, { vel: 26 });
  // Lookback: window appears, lines, the drag back, numbers change.
  for (let i = 0; i < 15; i++) tick(T.lookback + 0.8 + i * 0.3, 14);
  pop(T.lookback + 6.4, 28); [11.4, 12.0, 12.8, 13.6].forEach((a) => pop(T.lookback + a, 24));
  S.fx('whoosh', T.lookback + 16.4, { dur: 1.8, vel: 20 }); S.fx('ding', T.lookback + 17.5, { vel: 36 });
  // Compare: two windows, fee bars, a swing against you.
  S.fx('whoosh', T.compare + 4.8, { dur: 1.6, vel: 16 }); S.fx('whoosh', T.compare + 9.0, { dur: 1.6, vel: 18 });
  S.fx('thud', T.compare + 13.6, { vel: 28 }); pop(T.compare + 15.8, 26); S.fx('thud', T.compare + 19.4, { vel: 26 });
  // Liquidity: the order eats the book.
  pop(T.liquidity + 6.0, 28); tick(T.liquidity + 6.9, 30); S.fx('ding', T.liquidity + 8.0, { vel: 30 });
  pop(T.liquidity + 10.0, 28); tick(T.liquidity + 10.9, 30); tick(T.liquidity + 11.6, 30); S.fx('thud', T.liquidity + 14.6, { vel: 30 });
  // Mistake: the claim, the cross, the two equal sides.
  pop(T.mistake + 3.4, 28); S.fx('thud', T.mistake + 5.4, { vel: 32 }); pop(T.mistake + 6.6, 28); pop(T.mistake + 8.4, 28); S.fx('chime', T.mistake + 17.2, { vel: 32 });
  // Try it: countdown, then the answer.
  pop(T.try + 0.8, 30);
  for (let i = 0; i < 5; i++) tick(T.try + 6.4 + i, 30);
  S.fx('chime', T.try + 11.8, { vel: 40 }); S.fx('ding', T.try + 14.0, { vel: 32 }); pop(T.try + 17.1, 26);
  [4.8, 10.4, 16.5, 18.2].forEach((a) => pop(T.risks + a, 28));
  [2.4, 8.0, 13.6].forEach((a) => pop(T.recap + a, 32));
  S.fx('ding', T.recap + 25.8, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
