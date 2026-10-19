kit.score(function (S, T) {
  // No voice: a soft pad and keys bed, a light pulse in the hands-on parts, quieter for the mistake and risk scenes.
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
  const pulse = (s) => inR(s, T.build5, T.noise) || inR(s, T.try, T.risks);
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
  [[T.title, 2.9], [T.timeframe, 0.8], [T.build15, 0.4], [T.noise, 2.4], [T.context, 1.0], [T.mistake, 3.4], [T.try, 0.6], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  for (let i = 0; i < 3; i++) S.fx('pop', T.title + 0.4 + i * 1.1, { vel: 26 });
  for (let i = 0; i < 15; i++) S.fx('tick', T.hook + 0.8 + i * 0.18, { vel: 18 });
  S.fx('whoosh', T.hook + 6.4, { dur: 0.6, vel: 24 }); S.fx('whoosh', T.hook + 8.8, { dur: 0.6, vel: 24 }); S.fx('whoosh', T.hook + 13.2, { dur: 0.6, vel: 22 }); S.fx('whoosh', T.hook + 15.6, { dur: 0.6, vel: 22 });
  S.fx('whoosh', T.timeframe + 6.6, { dur: 0.6, vel: 22 }); S.fx('whoosh', T.timeframe + 8.8, { dur: 0.6, vel: 22 }); S.fx('chime', T.timeframe + 14.2, { vel: 28 });
  for (const a of [6.2, 11.4, 16.4, 19.8]) S.fx('ding', T.build5 + a, { vel: 32 });
  for (let i = 0; i < 5; i++) { S.fx('tick', T.build5 + 9.0 + i * 0.32, { vel: 20 }); S.fx('tick', T.build5 + 14.3 + i * 0.32, { vel: 20 }); }
  S.fx('whoosh', T.build5 + 22.4, { dur: 2.6, vel: 24 }); S.fx('chime', T.build5 + 25.0, { vel: 40 }); S.fx('pop', T.build5 + 28.6, { vel: 30 });
  for (const a of [6.0, 7.6, 9.0, 10.9]) S.fx('pop', T.build15 + a, { vel: 30 });
  S.fx('whoosh', T.build15 + 14.8, { dur: 0.6, vel: 22 }); S.fx('ding', T.build15 + 16.4, { vel: 32 });
  S.fx('whoosh', T.switch + 0.8, { dur: 3.6, vel: 18 });
  for (const a of [5.6, 10.4, 14.8]) S.fx('pop', T.switch + a, { vel: 32 });
  S.fx('chime', T.switch + 19.2, { vel: 32 });
  S.fx('thud', T.noise + 6.0, { vel: 28 }); S.fx('ding', T.noise + 11.0, { vel: 30 }); S.fx('pop', T.noise + 16.3, { vel: 30 });
  for (const a of [5.4, 7.0, 8.6]) S.fx('pop', T.context + a, { vel: 28 });
  S.fx('pop', T.context + 15.6, { vel: 28 });
  S.fx('thud', T.mistake + 6.8, { vel: 30 }); S.fx('chime', T.mistake + 11.4, { vel: 34 }); S.fx('pop', T.mistake + 16.4, { vel: 28 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 5.6 + i, { vel: 30 });
  for (const a of [11.0, 12.0, 15.7, 16.6]) S.fx('ding', T.try + a, { vel: 32 });
  S.fx('chime', T.try + 20.4, { vel: 40 });
  for (const a of [1.6, 3.6, 6.4, 8.4]) S.fx('pop', T.sort + a + 1.9, { vel: 34 });
  for (const a of [4.0, 6.8, 9.8, 14.1]) S.fx('pop', T.risks + a, { vel: 28 });
  for (const a of [2.5, 6.5, 11.9]) S.fx('pop', T.recap + a, { vel: 34 });
  S.fx('ding', T.recap + 23.0, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
