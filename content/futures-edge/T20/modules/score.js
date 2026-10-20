kit.score(function (S, T) {
  // No voice: the music is the only sound. Soft pad and keys, a light pulse while the checklist is worked through, quieter in the risk parts.
  const BPM = 84, B = 60 / BPM;
  S.tempo(BPM, { t0: 0 });
  S.program('pad', 'pad', { rev: 0.7, gain: -6 });
  S.program('keys', 'ep', { rev: 0.45, gain: -10 });
  S.program('mal', 'pluck', { rev: 0.5, gain: -12, pan: 0.2 });
  S.program('bass', 'bass', { gain: -10 });
  const prog = [['D3', 'A3', 'E4', 'F#4'], ['B2', 'F#3', 'A3', 'D4'], ['G2', 'D3', 'F#3', 'B3'], ['A2', 'E3', 'A3', 'C#4']];
  const roots = ['D2', 'B1', 'G1', 'A1'];
  const tops = [['F#5', 'A5', 'E5'], ['D5', 'F#5', 'A5'], ['B4', 'D5', 'F#5'], ['C#5', 'E5', 'A5']];
  const inR = (s, a, b) => s >= a - 0.1 && s < b - 0.1;
  const pulse = (s) => inR(s, T.trend, T.mistake) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.mistake, T.try) || inR(s, T.risks, T.recap);
  const bars = Math.floor(T.END / (4 * B));
  for (let b = 0; b < bars; b++) {
    const beat = b * 4, s = beat * B, c = prog[b % 4];
    if (s >= T.next - 0.1) break;
    S.chord('pad', c, { beat, beats: 4, vel: quiet(s) ? 26 : 32 });
    if (!quiet(s)) S.chord('keys', c.slice(1), { beat, beats: 3, vel: 34 });
    if (pulse(s)) { S.pattern('mal', 'x.x..x.x', { from: beat, repeat: 1, pitch: tops[b % 4], vel: 34 }); S.note('bass', roots[b % 4], { beat, beats: 3, vel: 48 }); }
  }
  const steps = (a, b) => { const ts = []; for (let s = a + 0.18; s < b; s += 0.364) ts.push(s); S.ticks(ts, { vel: 24 }); };
  steps(T.title, T.title + 2.6); steps(T.next + 0.1, T.next + 1.1);
  // Title: the checklist ticks down to WAIT.
  for (let i = 0; i < 6; i++) S.fx('tick', T.title + 1.0 + i * 0.75, { vel: 26 });
  S.fx('pop', T.title + 4.9, { vel: 30, pitch: 7 });
  // Hook: candles draw in, the BUY button, the cross.
  S.fx('whoosh', T.hook + 0.4, { dur: 2.2, vel: 18 }); S.fx('pop', T.hook + 7.0, { vel: 30, pitch: 9 }); S.fx('thud', T.hook + 12.4, { vel: 32 }); S.fx('pop', T.hook + 12.8, { vel: 26, pitch: 5 });
  // Steps: definition, analogy, six cards.
  S.fx('pop', T.steps + 0.6, { vel: 26, pitch: 7 }); S.fx('pop', T.steps + 8.4, { vel: 26, pitch: 7 });
  for (let i = 0; i < 6; i++) S.fx('tick', T.steps + 15.0 + i * 0.75, { vel: 28 });
  // Each layer: the layer draws, the checklist row fills.
  [['trend', 6.4, 11.4], ['range', 7.0, 12.8], ['zone', 8.2, 14.2], ['volume', 8.2, 14.8], ['risk', 14.4, 21.4], ['decide', 7.0, 15.0]].forEach(([id, a, v]) => {
    S.fx('whoosh', T[id] + a, { dur: 1.0, vel: 20 }); S.fx('ding', T[id] + v, { vel: 30 });
  });
  for (let i = 0; i < 18; i++) S.fx('tick', T.volume + 8.2 + i * 0.08, { vel: 14 });
  S.fx('pop', T.risk + 8.6, { vel: 26, pitch: 7 }); S.fx('thud', T.risk + 15.6, { vel: 28 });
  [0, 1, 2].forEach((i) => S.fx('pop', T.risk + 22.0 + i * 0.9, { vel: 26, pitch: 5 + i * 2 }));
  S.fx('chime', T.decide + 15.0, { vel: 38 });
  // Mistake.
  S.fx('pop', T.mistake + 0.6, { vel: 26, pitch: 5 }); S.fx('thud', T.mistake + 7.0, { vel: 34 });
  [8.4, 9.7, 11.0].forEach((a) => S.fx('tick', T.mistake + a, { vel: 28 })); S.fx('chime', T.mistake + 14.2, { vel: 30 });
  // Try it.
  S.fx('pop', T.try + 0.6, { vel: 28, pitch: 7 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 9.0 + i, { vel: 30 });
  S.fx('chime', T.try + 14.4, { vel: 42 }); S.fx('pop', T.try + 20.2, { vel: 30, pitch: 5 });
  [4.2, 9.8, 12.6, 15.4].forEach((a) => S.fx('pop', T.risks + a, { vel: 26 }));
  [2.0, 7.6, 13.2].forEach((a) => S.fx('pop', T.recap + a + 0.5, { vel: 34 }));
  S.fx('ding', T.recap + 25.4, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
