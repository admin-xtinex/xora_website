kit.score(function (S, T) {
  // A soft bed under the captions: pad and keys, a light pulse in the hands-on parts, quieter for the safety parts.
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
  const pulse = (s) => inR(s, T.side, T.mistake) || inR(s, T.try, T.compare);
  const quiet = (s) => inR(s, T.extra, T.try) || inR(s, T.risks, T.recap);
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
  // Hook: two traders, then the price ticks up.
  pop(T.hook + 1.0, 26); pop(T.hook + 1.6, 26); pop(T.hook + 6.8, 30); pop(T.hook + 8.2, 30);
  for (let i = 0; i < 6; i++) tick(T.hook + 11.6 + i * 0.27, 20);
  // Spot: the coin goes home; USDT out, BTC in.
  S.fx('whoosh', T.spot + 7.6, { dur: 1.2, vel: 22 }); S.fx('chime', T.spot + 8.9, { vel: 30 });
  S.fx('whoosh', T.spot + 12.8, { dur: 1.0, vel: 20 }); S.fx('ding', T.spot + 14.4, { vel: 36 });
  // Futures: the contract fills in; no BTC arrives.
  pop(T.futures + 2.4, 26); S.fx('ding', T.futures + 7.9, { vel: 32 });
  [13.8, 14.3, 14.8].forEach((a) => tick(T.futures + a, 28));
  S.fx('thud', T.futures + 16.2, { vel: 30 });
  // Perpetual: dated contract counts down and expires; the perpetual closes and settles.
  [7.0, 7.8, 8.6].forEach((a) => tick(T.perp + a, 26)); S.fx('thud', T.perp + 9.6, { vel: 26 });
  pop(T.perp + 12.9, 30); S.fx('ding', T.perp + 13.6, { vel: 34 });
  // Exposure: the formula counts, the bars fill.
  S.fx('ding', T.exposure + 11.2, { vel: 32 }); S.fx('whoosh', T.exposure + 11.9, { dur: 1.2, vel: 20 });
  // Side by side: up, then down.
  S.fx('ding', T.side + 7.6, { vel: 34 }); S.fx('thud', T.side + 13.6, { vel: 28 }); S.fx('chime', T.side + 16.6, { vel: 30 });
  // Short: down is a gain, up is a loss.
  S.fx('ding', T.short + 8.4, { vel: 34 }); S.fx('thud', T.short + 11.2, { vel: 28 }); pop(T.short + 12.1, 28);
  // Mistake: withdraw fails.
  pop(T.mistake + 1.4, 26); pop(T.mistake + 6.5, 30); S.fx('thud', T.mistake + 7.0, { vel: 34 }); S.fx('chime', T.mistake + 12.8, { vel: 30 });
  // Extra risks: three cards; margin drains; funding clock.
  [4.5, 10.8, 17.2].forEach((a) => pop(T.extra + a, 28));
  S.fx('whoosh', T.extra + 5.6, { dur: 1.0, vel: 20 }); S.fx('thud', T.extra + 15.7, { vel: 30 });
  for (let i = 1; i <= 2; i++) tick(T.extra + 17.6 + 360 / 140 * i, 30);
  // Try it: countdown, then each card lands.
  pop(T.try + 0.8, 30);
  for (let i = 0; i < 5; i++) tick(T.try + 3.6 + i, 30);
  S.fx('chime', T.try + 9.2, { vel: 40 });
  [9.4, 10.2, 14.0, 14.6, 15.2].forEach((a) => pop(T.try + a + 0.8, 32));
  // Compare: cells appear.
  [4.2, 11.0, 16.4].forEach((a) => pop(T.compare + a, 26));
  [0.8, 6.5, 11.4, 16.7].forEach((a) => pop(T.risks + a, 28));
  [0.8, 4.5, 10.8].forEach((a) => pop(T.recap + a, 32));
  S.fx('ding', T.recap + 20.0, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 23, fadeOut: 2.5 });
});
