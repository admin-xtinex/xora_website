kit.score(function (S, T) {
  // Soft pad and keys bed (no voice), a light pulse in the hands-on parts, quieter in the risk scenes.
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
  const pulse = (s) => inR(s, T.hook, T.checks) || inR(s, T.checklist, T.mistake) || inR(s, T.approval, T.risks);
  const quiet = (s) => inR(s, T.mistake, T.gates) || inR(s, T.risks, T.recap) || inR(s, T.notrade, T.setting);
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
  // pops on visible arrivals
  [[T.title, 0.8], [T.title, 1.3], [T.title, 1.8], [T.hook, 0.5], [T.hook, 2.0], [T.hook, 7.4], [T.hook, 10.0], [T.hook, 12.4],
    [T.outcomes, 0.6], [T.outcomes, 6.6], [T.outcomes, 12.6], [T.checks, 1.4], [T.checks, 1.8], [T.confidence, 12.2],
    [T.checklist, 0.5], [T.checklist, 6.6], [T.checklist, 13.2], [T.mistake, 1.0], [T.mistake, 6.0], [T.mistake, 11.6],
    [T.notrade, 2.0], [T.notrade, 6.2], [T.setting, 1.2], [T.setting, 13.8], [T.setting, 20.6], [T.approval, 0.8], [T.approval, 11.2], [T.approval, 16.8],
    [T.try, 1.0], [T.try, 2.4], [T.try, 3.0], [T.try, 3.6]].forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  for (let i = 0; i < 5; i++) S.fx('tick', T.checks + 3.0 + i * 1.2, { vel: i === 2 ? 20 : 30 });
  S.fx('thud', T.checks + 5.4, { vel: 22 });
  for (let i = 0; i < 10; i++) S.fx('pop', T.checks + 12.4 + i * 0.32, { vel: 20, pitch: 9 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.confidence + 6.2 + i * 0.9, { vel: 28, pitch: 9 });
  [13.3, 14.3, 16.3, 18.3].forEach((d) => S.fx('tick', T.confidence + d, { vel: 30 }));
  S.fx('ding', T.confidence + 19.0, { vel: 34 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.checklist + 2.0 + i * 0.7, { vel: 26 });
  S.fx('chime', T.checklist + 9.0, { vel: 40 });
  S.fx('whoosh', T.mistake + 5.0, { dur: 0.6, vel: 26 }); S.fx('thud', T.mistake + 5.3, { vel: 30 }); S.fx('ding', T.mistake + 6.2, { vel: 34 });
  S.fx('thud', T.mistake + 17.0, { vel: 28 });
  S.fx('whoosh', T.gates + 2.0, { dur: 3.4, vel: 22 });
  for (let i = 0; i < 7; i++) S.fx('tick', T.gates + 2.25 + i * 0.5, { vel: 24 });
  S.fx('chime', T.gates + 5.3, { vel: 34 });
  S.fx('whoosh', T.gates + 19.4, { dur: 1.1, vel: 24 }); S.fx('thud', T.gates + 20.6, { vel: 38 });
  S.fx('chime', T.notrade + 12.6, { vel: 32 });
  S.fx('whoosh', T.setting + 8.4, { dur: 1.2, vel: 20 }); S.fx('whoosh', T.setting + 13.6, { dur: 1.0, vel: 20 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.setting + 21.4 + i * 1.8, { vel: 28 });
  for (let i = 0; i < 10; i++) S.fx('tick', T.approval + 1.8 + i, { vel: 18 });
  S.fx('thud', T.approval + 10.8, { vel: 26 }); S.fx('pop', T.approval + 13.0, { vel: 34 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.approval + 18.6 + i * 1.6, { vel: 30 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 6.4 + i, { vel: 30 });
  S.fx('chime', T.try + 12.0, { vel: 42 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.risks + [4.4, 10.4, 12.6, 16.2][i], { vel: 28 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.recap + [0.6, 7.2, 10.4][i] + 0.5, { vel: 34 });
  S.fx('ding', T.recap + 17.4, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
