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
  const pulse = (s) => inR(s, T.sl, T.rr) || inR(s, T.bull, T.miss) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.mistake, T.try) || inR(s, T.risks, T.recap) || inR(s, T.hook, T.plan);
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
  [[T.title, 2.9], [T.hook, 0.8], [T.sl, 0.6], [T.tp, 0.6], [T.trigger, 0.8], [T.trigger, 4.2], [T.rr, 0.6], [T.miss, 13.5], [T.mistake, 1.0], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  S.fx('thud', T.hook + 6.8, { vel: 26 }); S.fx('chime', T.hook + 13.5, { vel: 32 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.plan + [1.4, 3.2, 5.2][i], { vel: 30 });
  for (let i = 0; i < 3; i++) S.fx('tick', T.plan + [8.4, 9.6, 10.8][i], { vel: 30 });
  S.fx('whoosh', T.plan + 14.0, { dur: 0.8, vel: 24 });
  S.fx('thud', T.sl + 17.4, { vel: 30 }); S.fx('ding', T.tp + 17.0, { vel: 36 });
  S.fx('thud', T.trigger + 10.4, { vel: 28 }); S.fx('ding', T.trigger + 11.0, { vel: 28 });
  S.fx('pop', T.rr + 6.6, { vel: 32 }); S.fx('pop', T.rr + 8.8, { vel: 32 }); S.fx('chime', T.rr + 11.8, { vel: 36 });
  S.fx('ding', T.bull + 5.0, { vel: 38 }); S.fx('pop', T.bull + 12.3, { vel: 28 });
  S.fx('thud', T.bear + 4.6, { vel: 30 }); S.fx('ding', T.bear + 5.0, { vel: 26 });
  S.fx('thud', T.gap + 5.6, { vel: 38 }); S.fx('ding', T.gap + 6.0, { vel: 26 });
  S.fx('pop', T.miss + 5.0, { vel: 28 });
  S.fx('whoosh', T.mistake + 6.2, { dur: 0.6, vel: 24 });
  for (let i = 0; i < 10; i++) S.fx('tick', T.mistake + 6.8 + i * 0.55, { vel: 24 });
  S.fx('chime', T.mistake + 13.7, { vel: 30 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 7.0 + i, { vel: 30 });
  S.fx('ding', T.try + 13.2, { vel: 34 }); S.fx('ding', T.try + 14.8, { vel: 34 }); S.fx('chime', T.try + 18.3, { vel: 42 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.risks + [5.1, 7.6, 10.3, 18.3][i], { vel: 28 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.recap + [2.9, 7.7, 13.4][i], { vel: 34 });
  S.fx('ding', T.recap + 21.7, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
