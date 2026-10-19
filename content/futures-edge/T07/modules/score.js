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
  const pulse = (s) => inR(s, T.market, T.unfilled) || inR(s, T.stop, T.compare) || inR(s, T.try, T.risks);
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
  [[T.title, 2.9], [T.intent, 6.7], [T.book, 0.6], [T.market, 0.6], [T.slippage, 0.6], [T.limit, 0.6], [T.unfilled, 10.1], [T.partial, 0.6], [T.stop, 0.6], [T.gap, 0.6], [T.mistake, 1.2], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  for (let i = 0; i < 4; i++) S.fx('tick', T.intent + [7.6, 8.8, 10.0, 10.6][i], { vel: 26 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.intent + 13.9 + i * 0.35, { vel: 30 });
  S.fx('whoosh', T.book + 12.2, { dur: 1.2, vel: 22 }); S.fx('ding', T.book + 13.6, { vel: 34 });
  S.fx('whoosh', T.market + 12.9, { dur: 1.2, vel: 22 }); S.fx('ding', T.market + 14.4, { vel: 32 }); S.fx('ding', T.market + 15.8, { vel: 34 }); S.fx('chime', T.market + 18.8, { vel: 34 });
  S.fx('thud', T.slippage + 9.0, { vel: 34 }); S.fx('whoosh', T.slippage + 13.2, { dur: 1.2, vel: 22 }); S.fx('ding', T.slippage + 14.6, { vel: 32 });
  S.fx('pop', T.limit + 11.4, { vel: 34 }); for (let i = 0; i < 3; i++) S.fx('tick', T.limit + 16.8 + i, { vel: 28 }); S.fx('chime', T.limit + 19.6, { vel: 38 });
  S.fx('pop', T.unfilled + 4.4, { vel: 30 });
  S.fx('whoosh', T.partial + 6.0, { dur: 1.2, vel: 22 }); S.fx('ding', T.partial + 7.2, { vel: 32 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.stop + [0.6, 5.9, 7.4, 9.0][i], { vel: 30 });
  S.fx('thud', T.stop + 21.6, { vel: 32 }); S.fx('ding', T.stop + 22.3, { vel: 32 });
  S.fx('thud', T.gap + 5.6, { vel: 38 }); S.fx('ding', T.gap + 6.4, { vel: 28 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.compare + [0.4, 5.6, 11.4][i], { vel: 32 });
  S.fx('whoosh', T.mistake + 5.9, { dur: 0.6, vel: 26 }); S.fx('thud', T.mistake + 6.5, { vel: 30 }); S.fx('chime', T.mistake + 7.2, { vel: 30 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 7.4 + i, { vel: 30 });
  S.fx('chime', T.try + 12.4, { vel: 42 }); S.fx('pop', T.try + 18.7, { vel: 30 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.risks + [4.7, 10.8, 15.0, 17.6][i], { vel: 28 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.recap + [2.9, 5.9, 9.0][i], { vel: 34 });
  S.fx('ding', T.recap + 17.4, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
