kit.score(function (S, T) {
  // No voice: a soft pad and keys bed, a light pulse in the hands-on parts, quieter for the risk scenes.
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
  const pulse = (s) => inR(s, T.maker, T.funding) || inR(s, T.add, T.mistake) || inR(s, T.try, T.check);
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
  [[T.title, 2.9], [T.hook, 6.8], [T.fee, 0.6], [T.fee, 7.5], [T.maker, 0.6], [T.maker, 8.1], [T.spread, 0.6], [T.spread, 5.4], [T.slip, 0.6], [T.funding, 0.6], [T.breakeven, 0.6], [T.mistake, 0.8], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  for (let i = 0; i < 3; i++) S.fx('thud', T.hook + 11.9 + i * 0.5, { vel: 26 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.fee + [1.4, 3.8, 14.4, 16.2][i], { vel: 28 });
  S.fx('thud', T.fee + 18.4, { vel: 26 }); S.fx('thud', T.fee + 19.8, { vel: 26 });
  S.fx('whoosh', T.maker + 2.9, { dur: 1.2, vel: 22 }); S.fx('ding', T.maker + 4.2, { vel: 32 }); S.fx('pop', T.maker + 9.0, { vel: 32 });
  S.fx('ding', T.spread + 13.0, { vel: 30 }); S.fx('ding', T.spread + 14.4, { vel: 26 }); S.fx('thud', T.spread + 15.0, { vel: 26 });
  S.fx('whoosh', T.slip + 6.4, { dur: 1.0, vel: 22 }); S.fx('whoosh', T.slip + 8.6, { dur: 1.0, vel: 22 }); S.fx('chime', T.slip + 12.2, { vel: 30 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.funding + 2.4 + i * 1.6, { vel: 22 });
  S.fx('whoosh', T.funding + 9.0, { dur: 0.8, vel: 24 }); S.fx('chime', T.funding + 14.4, { vel: 30 });
  for (let i = 0; i < 5; i++) S.fx(i ? 'thud' : 'pop', T.add + [4.3, 6.0, 7.7, 9.6, 13.2][i], { vel: i ? 28 : 34 });
  S.fx('chime', T.add + 14.4, { vel: 30 });
  S.fx('tick', T.breakeven + 10.2, { vel: 30 }); S.fx('ding', T.breakeven + 14.6, { vel: 38 });
  S.fx('whoosh', T.mistake + 5.2, { dur: 0.6, vel: 24 });
  for (let i = 0; i < 20; i++) S.fx('tick', T.mistake + 5.6 + i * 0.24, { vel: 20 });
  S.fx('chime', T.mistake + 11.3, { vel: 30 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 7.4 + i, { vel: 30 });
  S.fx('ding', T.try + 14.3, { vel: 34 }); S.fx('ding', T.try + 15.8, { vel: 30 }); S.fx('chime', T.try + 17.4, { vel: 40 });
  for (let i = 0; i < 5; i++) S.fx('pop', T.check + [4.7, 6.8, 8.9, 11.4, 13.9][i], { vel: 30 });
  S.fx('chime', T.check + 17.6, { vel: 36 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.risks + [0.8, 5.2, 11.6, 17.8][i], { vel: 28 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.recap + [2.9, 8.6, 11.9][i], { vel: 34 });
  S.fx('ding', T.recap + 21.5, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
