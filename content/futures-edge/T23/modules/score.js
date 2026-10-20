kit.score(function (S, T) {
  // No voice: the music is the only sound. Soft pad and keys; a light pulse while the steps run; quieter for mistakes and limits.
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
  const pulse = (s) => inR(s, T.coin, T.doubt) || inR(s, T.costs, T.journal) || inR(s, T.try, T.risks);
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
  const pops = (s, at, v, p) => at.forEach((a) => S.fx('pop', s + a, { vel: v || 28, pitch: p == null ? 5 : p }));
  // title + hook
  for (let i = 0; i < 8; i++) S.fx('pop', T.title + 0.9 + i * 0.5, { vel: 22, pitch: 2 + i });
  for (let i = 0; i < 9; i++) S.fx('tick', T.hook + 1.0 + i * 0.3, { vel: 22 });
  for (let i = 0; i < 8; i++) S.fx('pop', T.hook + 6.4 + i * 0.7, { vel: 28, pitch: 2 + i });
  S.fx('ding', T.hook + 12.6, { vel: 32 }); S.fx('chime', T.hook + 18.5, { vel: 36 });
  // steps
  pops(T.coin, [1.0, 1.4], 28); S.fx('whoosh', T.coin + 7.2, { dur: 1.0, vel: 20 }); S.fx('ding', T.coin + 19.2, { vel: 36 }); S.fx('pop', T.coin + 19.8, { vel: 26, pitch: -3 });
  for (let i = 0; i < 12; i++) S.fx('tick', T.context + 1.0 + i * 0.3, { vel: 18 });
  for (let i = 0; i < 7; i++) S.fx('pop', T.context + 7.3 + i * 0.35, { vel: 24, pitch: i });
  S.fx('whoosh', T.context + 14.9, { dur: 1.2, vel: 24 });
  pops(T.levels, [1.4, 3.0], 30); S.fx('whoosh', T.levels + 7.2, { dur: 0.9, vel: 18 }); pops(T.levels, [12.8, 14.0], 30, 9); S.fx('pop', T.levels + 18.0, { vel: 28, pitch: 2 }); S.fx('ding', T.levels + 20.6, { vel: 30 });
  pops(T.doubt, [7.0, 13.2, 19.2], 26); S.fx('whoosh', T.doubt + 7.4, { dur: 1.0, vel: 18 }); S.fx('whoosh', T.doubt + 13.6, { dur: 1.0, vel: 18 }); S.fx('ding', T.doubt + 22.0, { vel: 28 });
  pops(T.costs, [1.0, 8.6, 14.0, 15.8, 17.8], 26); S.fx('ding', T.costs + 21.2, { vel: 36 }); S.fx('thud', T.costs + 26.6, { vel: 28 }); S.fx('chime', T.costs + 29.4, { vel: 34 });
  [1.4, 2.0, 2.6].forEach((a) => S.fx('tick', T.decide + a, { vel: 26 }));
  { const ts = []; for (let s = 13.3; s < 17.8; s += 0.22) ts.push(T.decide + s); S.ticks(ts, { vel: 12 }); }
  S.fx('pop', T.decide + 20.2, { vel: 36, pitch: 0 }); S.fx('chime', T.decide + 20.8, { vel: 36 });
  S.fx('whoosh', T.monitor + 1.2, { dur: 1.8, vel: 20 });
  for (let j = 0; j < 8; j++) S.fx('tick', T.monitor + 11.4 + j * 1.6, { vel: 24 });
  S.fx('thud', T.monitor + 23.5, { vel: 36 }); S.fx('ding', T.monitor + 26.4, { vel: 26 });
  pops(T.journal, [1.2, 2.0, 2.8, 3.6], 24); for (let i = 0; i < 3; i++) S.fx('tick', T.journal + 7.6 + i * 1.4, { vel: 24 });
  for (let i = 0; i < 8; i++) S.fx('pop', T.journal + 13.6 + i * 0.4, { vel: 28, pitch: 2 + i });
  S.fx('chime', T.journal + 16.9, { vel: 38 });
  S.fx('pop', T.notrade + 11.4, { vel: 34, pitch: 0 }); pops(T.notrade, [14.0, 14.9, 15.8], 26, 7); S.fx('chime', T.notrade + 17.0, { vel: 40 }); S.fx('whoosh', T.notrade + 20.6, { dur: 1.2, vel: 18 });
  [0.8, 13.4, 20.3].forEach((a) => S.fx('thud', T.mistake + a, { vel: 24 })); [6.8, 17.6, 23.0].forEach((a) => S.fx('chime', T.mistake + a, { vel: 30 }));
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 8.0 + i, { vel: 30 });
  S.fx('chime', T.try + 13.4, { vel: 42 }); S.fx('ding', T.try + 13.7, { vel: 30 }); S.fx('thud', T.try + 19.6, { vel: 24 });
  [1.0, 8.6, 14.6, 21.4].forEach((a) => S.fx('pop', T.risks + a, { vel: 26 }));
  [1.4, 7.5, 13.7].forEach((a) => S.fx('pop', T.recap + a, { vel: 32, pitch: 7 })); S.fx('ding', T.recap + 24.0, { vel: 36 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
