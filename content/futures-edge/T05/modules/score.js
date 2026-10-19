kit.score(function (S, T) {
  // A soft bed under the captions: pad and keys, a light pulse while prices move, quieter for the mistake and the risks.
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
  const pulse = (s) => inR(s, T.buysell, T.own) || inR(s, T.meters, T.mistake) || inR(s, T.choose, T.risks);
  const quiet = (s) => inR(s, T.mistake, T.choose) || inR(s, T.risks, T.recap);
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
  [[T.title, 2.9], [T.hook, 3.4], [T.hook, 8.6], [T.buysell, 6.4], [T.own, 0.6], [T.own, 6.6], [T.long, 5.5], [T.short, 5.5], [T.meters, 13.6], [T.mistake, 6.2], [T.mistake, 13.4], [T.mistake, 26.8], [T.choose, 17.5], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  S.fx('chime', T.title + 1.2, { vel: 30 });
  S.fx('whoosh', T.buysell + 12.2, { dur: 1.0, vel: 24 }); S.fx('ding', T.buysell + 13.8, { vel: 34 });
  S.fx('whoosh', T.buysell + 19.5, { dur: 1.0, vel: 24 }); S.fx('ding', T.buysell + 21.1, { vel: 38 });
  S.fx('ding', T.long + 10.4, { vel: 30 }); S.fx('whoosh', T.long + 12.8, { dur: 0.8, vel: 20 });
  S.fx('chime', T.long + 16.6, { vel: 34 }); S.fx('thud', T.long + 23.4, { vel: 30 });
  S.fx('ding', T.short + 14.6, { vel: 30 }); S.fx('thud', T.short + 18.8, { vel: 26 }); S.fx('whoosh', T.short + 20.0, { dur: 0.8, vel: 20 });
  S.fx('chime', T.short + 22.6, { vel: 34 }); S.fx('thud', T.short + 26.4, { vel: 30 });
  S.fx('chime', T.meters + 6.2, { vel: 30 }); S.fx('thud', T.meters + 16.4, { vel: 30 });
  S.fx('thud', T.mistake + 20.6, { vel: 38 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.choose + 0.8 + i * 0.3, { vel: 30, pitch: 5 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.choose + 1.8 + i, { vel: 28 });
  S.fx('ding', T.choose + 11.6, { vel: 36 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 3.0 + i, { vel: 30 });
  S.fx('chime', T.try + 8.4, { vel: 42 });
  [3.0, 8.5, 14.1, 21.6].forEach((a) => S.fx('pop', T.risks + a, { vel: 30 }));
  [1.9, 7.0, 12.0].forEach((a) => S.fx('pop', T.recap + a, { vel: 34 }));
  S.fx('ding', T.recap + 23.4, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21.5, fadeOut: 2.5 });
});
