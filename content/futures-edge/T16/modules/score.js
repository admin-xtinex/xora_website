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
  const pulse = (s) => inR(s, T.uptrend, T.sideways) || inR(s, T.structure, T.mistake) || inR(s, T.try, T.subjective);
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
  [[T.title, 2.9], [T.hook, 5.8], [T.swings, 0.6], [T.uptrend, 4.0], [T.downtrend, 4.0], [T.sideways, 11.2], [T.numbers, 1.4], [T.mistake, 1.6], [T.try, 0.6], [T.subjective, 13.0], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  const marks = (t0, t1, n, conf) => { for (let i = 1; i < n - 1; i++) S.fx('tick', t0 + (t1 - t0) * Math.min(n - 1, i + (conf ? 0.85 : 0)) / (n - 1), { vel: 24 }); };
  marks(T.title + 0.2, T.title + 5.6, 8, true);
  S.fx('whoosh', T.hook + 11.0, { dur: 3.4, vel: 20 }); marks(T.hook + 11.0, T.hook + 14.4, 7, false);
  marks(T.swings + 0.8, T.swings + 8.0, 4, true); S.fx('chime', T.swings + 9.6, { vel: 28 }); S.fx('thud', T.swings + 15.0, { vel: 24 });
  marks(T.uptrend + 1.0, T.uptrend + 13.0, 8, true); S.fx('whoosh', T.uptrend + 14.8, { dur: 2.0, vel: 20 }); S.fx('ding', T.uptrend + 19.9, { vel: 30 });
  marks(T.downtrend + 1.0, T.downtrend + 12.6, 8, true); S.fx('whoosh', T.downtrend + 13.0, { dur: 2.0, vel: 20 });
  marks(T.sideways + 1.0, T.sideways + 10.0, 8, true); S.fx('chime', T.sideways + 10.2, { vel: 28 });
  marks(T.structure + 1.0, T.structure + 25.0, 13, true);
  S.fx('ding', T.structure + 8.6, { vel: 30 }); S.fx('pop', T.structure + 16.9, { vel: 30 }); S.fx('thud', T.structure + 22.9, { vel: 30 });
  for (const a of [5.4, 9.4]) { S.fx('pop', T.numbers + a, { vel: 30 }); S.fx('thud', T.numbers + a + 1.5, { vel: 28 }); }
  S.fx('chime', T.numbers + 13.4, { vel: 32 });
  marks(T.mistake + 5.6, T.mistake + 9.6, 8, false); S.fx('ding', T.mistake + 10.3, { vel: 30 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 5.0 + i, { vel: 30 });
  for (const a of [10.4, 14.1, 18.1]) S.fx('chime', T.try + a + 0.8, { vel: 36 });
  marks(T.subjective + 1.0, T.subjective + 4.4, 10, false); marks(T.subjective + 6.0, T.subjective + 9.4, 10, false);
  for (const a of [3.9, 8.1, 10.6, 12.9]) S.fx('pop', T.risks + a, { vel: 28 });
  for (const a of [2.5, 8.4, 12.9]) S.fx('pop', T.recap + a, { vel: 34 });
  S.fx('ding', T.recap + 24.0, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
