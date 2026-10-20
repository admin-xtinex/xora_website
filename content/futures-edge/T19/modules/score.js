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
  const pulse = (s) => inR(s, T.chart, T.execution) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.whennot, T.try) || inR(s, T.risks, T.recap);
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
  for (let i = 0; i < 15; i++) tick(T.title + 0.55 + i * 0.3, 14);
  S.fx('chime', T.title + 6.0, { vel: 30 });
  // Hook: the five tool cards, the stopwatch, the costs.
  for (let i = 0; i < 5; i++) pop(T.hook + 0.9 + i * 0.9, 24);
  S.fx('whoosh', T.hook + 6.5, { dur: 1.0, vel: 18 }); [9.8, 10.3, 10.8].forEach((a) => pop(T.hook + a, 28));
  // Define: short trades open and close along the line.
  [[0.08, 0.16], [0.3, 0.36], [0.47, 0.57], [0.68, 0.73], [0.84, 0.93]].forEach((r) => { tick(T.define + 4.4 + r[0] * 11.6, 22); tick(T.define + 4.4 + r[1] * 11.6, 18); });
  pop(T.define + 12.9, 28); S.fx('thud', T.define + 18.4, { vel: 24 });
  // Chart: candles, the two observations, the trade.
  for (let i = 0; i < 15; i++) tick(T.chart + 0.8 + i * 0.3, 14);
  pop(T.chart + 5.4, 26); pop(T.chart + 11.4, 30); pop(T.chart + 13.8, 30);
  S.fx('ding', T.chart + 17.4, { vel: 32 }); S.fx('ding', T.chart + 19.6, { vel: 34, pitch: 4 }); S.fx('chime', T.chart + 22.8, { vel: 32 });
  // Fees: gross bar, two fee chunks, the loss.
  S.fx('whoosh', T.fees + 6.0, { dur: 1.0, vel: 18 }); S.fx('thud', T.fees + 9.6, { vel: 30 }); S.fx('thud', T.fees + 11.2, { vel: 30 });
  S.fx('ding', T.fees + 14.5, { vel: 30 }); S.fx('thud', T.fees + 20.6, { vel: 28 }); S.fx('thud', T.fees + 21.2, { vel: 28 });
  // Frequency: twenty tiles, the tank fills.
  for (let i = 0; i < 20; i++) tick(T.frequency + 9.6 + i * 0.2, 20);
  S.fx('thud', T.frequency + 13.6, { vel: 30 }); pop(T.frequency + 14.4, 26); S.fx('chime', T.frequency + 18.4, { vel: 32 });
  // Execution: two slips.
  S.fx('whoosh', T.execution + 2.2, { dur: 0.8, vel: 16 }); S.fx('thud', T.execution + 6.6, { vel: 28 }); S.fx('thud', T.execution + 8.2, { vel: 28 }); S.fx('ding', T.execution + 10.6, { vel: 30 });
  // Compare.
  for (let i = 0; i < 8; i++) tick(T.compare + 5.4 + i * 0.25, 20);
  S.fx('whoosh', T.compare + 11.2, { dur: 2.0, vel: 18 }); S.fx('thud', T.compare + 17.2, { vel: 26 });
  // Horizon.
  S.fx('whoosh', T.horizon + 3.8, { dur: 1.0, vel: 16 }); S.fx('thud', T.horizon + 6.8, { vel: 26 }); S.fx('thud', T.horizon + 12.3, { vel: 26 }); S.fx('chime', T.horizon + 15.8, { vel: 30 });
  // When not to trade: six cards, six stamps.
  [4.6, 5.8, 7.0, 10.3, 11.5, 12.7].forEach((a) => pop(T.whennot + a, 24));
  for (let i = 0; i < 6; i++) S.fx('thud', T.whennot + 15.8 + i * 0.4, { vel: 24 });
  // Try it: countdown, then the answer.
  pop(T.try + 0.8, 30);
  for (let i = 0; i < 5; i++) tick(T.try + 6.6 + i, 30);
  S.fx('chime', T.try + 11.6, { vel: 40 }); S.fx('thud', T.try + 12.4, { vel: 26 }); S.fx('ding', T.try + 17.4, { vel: 32 });
  [5.2, 10.2, 11.8, 15.7].forEach((a) => pop(T.risks + a, 28));
  [2.4, 8.0, 13.0].forEach((a) => pop(T.recap + a, 32));
  S.fx('ding', T.recap + 24.5, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
