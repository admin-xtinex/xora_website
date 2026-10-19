kit.score(function (S, T) {
  // No voice: a soft pad and keys bed, a light pulse in the hands-on parts, quieter for the risks.
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
  const pulse = (s) => inR(s, T.hook, T.market) || inR(s, T.change, T.liquidity) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.risks, T.recap) || inR(s, T.mistake, T.try);
  const bars = Math.floor(T.END / BAR);
  for (let b = 0; b < bars; b++) {
    const beat = b * 4, s = beat * B, c = prog[b % 4];
    if (s >= T.next - 0.1) break;
    S.chord('pad', c, { beat, beats: 4, vel: quiet(s) ? 26 : 32 });
    if (!quiet(s)) S.chord('keys', c.slice(1), { beat, beats: 3, vel: 34 });
    if (pulse(s)) { S.pattern('mal', 'x.x..x.x', { from: beat, repeat: 1, pitch: tops[b % 4], vel: 36 }); S.note('bass', roots[b % 4], { beat, beats: 3, vel: 50 }); }
  }
  const steps = (a, b) => { const ts = []; for (let s = a + 0.18; s < b; s += 0.364) ts.push(s); S.ticks(ts, { vel: 24 }); };
  steps(T.title, T.title + 2.6); steps(T.next + 0.1, T.next + 1.1);
  // Tutor speech bubbles.
  [[T.title, 2.9], [T.hook, 10.8], [T.market, 19.4], [T.demand, 19.6], [T.supply, 19.8], [T.mistake, 14.6], [T.try, 0.8], [T.try, 12.6], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  [1.0, 5.2, 7.2, 9.0].forEach((x) => S.fx('tick', T.hook + x, { vel: 34 }));
  S.fx('ding', T.hook + 10.6, { vel: 36 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.market + 1.6 + i * 0.25, { vel: 28 });
  [12.0, 17.8].forEach((x) => { S.fx('whoosh', T.market + x, { dur: 1.0, vel: 22 }); S.fx('ding', T.market + x + 1.0, { vel: 38 }); });
  [14.4, 15.6, 16.8, 18.0, 19.2, 20.4].forEach((x) => S.fx('tick', T.demand + x, { vel: 32 }));
  [14.2, 15.4, 16.6, 17.8, 19.0, 20.2, 21.2].forEach((x) => S.fx('tick', T.supply + x, { vel: 32 }));
  for (const at of [5.8, 6.4, 7.6, 10.8, 15.8, 16.3, 17.0, 17.8]) S.fx('pop', T.change + at, { vel: 30 });
  S.fx('ding', T.change + 8.7, { vel: 34 }); S.fx('ding', T.change + 11.9, { vel: 38 });
  [7.2, 12.0, 15.6].forEach((x) => S.fx('whoosh', T.sliders + x, { dur: 1.0, vel: 22 }));
  for (let i = 0; i < 3; i++) S.fx('pop', T.size + 6.4 + i * 0.3, { vel: 32 });
  for (let i = 0; i < 10; i++) S.fx('tick', T.size + 11.0 + i * 0.12, { vel: 26 });
  S.fx('ding', T.size + 15.5, { vel: 38 });
  for (let i = 0; i < 6; i++) S.fx('tick', T.liquidity + 13.2 + i * 0.45, { vel: 30 });
  S.fx('thud', T.liquidity + 16.0, { vel: 30 });
  S.fx('thud', T.volatility + 12.0, { vel: 34 });
  S.fx('whoosh', T.mistake + 6.4, { dur: 1.4, vel: 22 }); S.fx('thud', T.mistake + 14.0, { vel: 28 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 3.6 + i, { vel: 30 });
  S.fx('chime', T.try + 9.0, { vel: 42 });
  [3.8, 8.9, 13.6, 19.6].forEach((x) => S.fx('pop', T.risks + x, { vel: 28 }));
  [1.6, 7.4, 13.0].forEach((x) => S.fx('pop', T.recap + x + 0.5, { vel: 34 }));
  S.fx('ding', T.recap + 23.6, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
