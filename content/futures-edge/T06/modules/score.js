kit.score(function (S, T) {
  // A soft bed under the captions: pad and keys, a light pulse in the worked examples, quieter for the mistake and the risks.
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
  const pulse = (s) => inR(s, T.entryexit, T.size) || inR(s, T.spot, T.fees) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.mistake, T.try) || inR(s, T.risks, T.recap);
  const bars = Math.floor(T.END / BAR);
  for (let b = 0; b < bars; b++) {
    const beat = b * 4, s = beat * B, c = prog[b % 4];
    if (s >= T.next - 0.1) break;
    S.chord('pad', c, { beat, beats: 4, vel: quiet(s) ? 26 : 32 });
    if (!quiet(s)) S.chord('keys', c.slice(1), { beat, beats: 3, vel: 34 });
    if (pulse(s)) { S.pattern('mal', 'x.x..x.x', { from: beat, repeat: 1, pitch: tops[b % 4], vel: 30 }); S.note('bass', roots[b % 4], { beat, beats: 3, vel: 46 }); }
  }
  const steps = (a, b) => { const ts = []; for (let s = a + 0.18; s < b; s += 0.364) ts.push(s); S.ticks(ts, { vel: 24 }); };
  steps(T.title, T.title + 2.6); steps(T.next + 0.1, T.next + 1.1);
  [[T.title, 2.9], [T.hook, 1.0], [T.entryexit, 7.2], [T.size, 12.2], [T.size, 18.6], [T.unreal, 0.8], [T.flong, 8.0], [T.flong, 13.7], [T.flong, 18.4], [T.fshort, 5.0], [T.fshort, 11.6], [T.fees, 6.2], [T.fees, 12.6], [T.mistake, 15.0], [T.mistake, 18.2], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  S.fx('chime', T.title + 1.2, { vel: 30 });
  [8.0, 9.2, 10.4, 11.6].forEach((a) => S.fx('tick', T.hook + a, { vel: 30 }));
  S.fx('ding', T.entryexit + 14.6, { vel: 34 }); S.fx('ding', T.entryexit + 19.4, { vel: 34, pitch: 5 }); S.fx('whoosh', T.entryexit + 19.8, { dur: 0.8, vel: 20 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.size + 2.2 + 1.56 * (i + 1), { vel: 26 });
  for (let r = 0; r < 2; r++) { const a = [6.4, 13.4][r]; for (let j = 0; j < 3; j++) S.fx('tick', T.spot + a + j * 0.45, { vel: 26 }); S.fx(r ? 'thud' : 'chime', T.spot + a + 2.5, { vel: 34 }); }
  S.fx('ding', T.unreal + 13.2, { vel: 38 }); S.fx('chime', T.unreal + 13.5, { vel: 30 });
  S.fx('thud', T.flong + 11.8, { vel: 30 });
  S.fx('chime', T.fshort + 7.6, { vel: 32 }); S.fx('thud', T.fshort + 14.4, { vel: 30 });
  S.fx('chime', T.fees + 2.6, { vel: 30 }); S.fx('thud', T.fees + 14.3, { vel: 26 }); S.fx('thud', T.fees + 19.7, { vel: 26 }); S.fx('ding', T.fees + 22.4, { vel: 36 });
  S.fx('chime', T.mistake + 7.4, { vel: 28 }); S.fx('thud', T.mistake + 12.0, { vel: 28 }); S.fx('thud', T.mistake + 13.2, { vel: 28 }); S.fx('thud', T.mistake + 14.8, { vel: 34 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 2.8 + i, { vel: 30 });
  S.fx('chime', T.try + 8.2, { vel: 42 }); S.fx('ding', T.try + 12.8, { vel: 30 });
  [3.0, 8.8, 15.2, 21.9].forEach((a) => S.fx('pop', T.risks + a, { vel: 30 }));
  [1.9, 7.5, 13.8].forEach((a) => S.fx('pop', T.recap + a, { vel: 34 }));
  S.fx('ding', T.recap + 25.4, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21.5, fadeOut: 2.5 });
});
