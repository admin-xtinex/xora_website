kit.score(function (S, T) {
  // No voice: the music is the only sound. Soft pad and keys, a light pulse while charts move, quieter in the risk parts.
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
  const pulse = (s) => inR(s, T.hook, T.account) || inR(s, T.formula, T.drawdown) || inR(s, T.try, T.risks);
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
  const pop = (t, v, p) => S.fx('pop', t, { vel: v || 28, pitch: p == null ? 7 : p });
  // Title: the risk meter fills to the budget line.
  S.fx('whoosh', T.title + 1.0, { dur: 2.6, vel: 16 }); S.fx('ding', T.title + 3.6, { vel: 30 }); pop(T.title + 3.8, 26);
  // Hook: cards, then the drop to the stop and the losses.
  pop(T.hook + 7.0); pop(T.hook + 9.0); S.fx('whoosh', T.hook + 12.8, { dur: 5.2, vel: 18 }); S.fx('thud', T.hook + 18.0, { vel: 34 });
  // Account: bar fills, budget slice, analogy, example tag.
  S.fx('whoosh', T.account + 1.6, { dur: 2.0, vel: 16 }); pop(T.account + 7.6); S.fx('ding', T.account + 9.6, { vel: 30 }); pop(T.account + 14.4); pop(T.account + 20.8, 26, 5);
  // Stop: lines, rulers, cards.
  [0.6, 1.6, 13.8].forEach((a) => S.fx('tick', T.stop + a, { vel: 26 })); S.fx('whoosh', T.stop + 6.6, { dur: 0.8, vel: 18 }); pop(T.stop + 7.8); S.fx('whoosh', T.stop + 14.6, { dur: 0.8, vel: 18 }); pop(T.stop + 15.8);
  // Notional: equation, the 1% fall, rice bags.
  pop(T.notional + 7.4); S.fx('whoosh', T.notional + 12.4, { dur: 2.0, vel: 16 }); S.fx('thud', T.notional + 14.6, { vel: 26 }); pop(T.notional + 18.2); [20.6, 21.0].forEach((a) => S.fx('tick', T.notional + a, { vel: 26 }));
  // Formula: the formula, each worked row, the short, the ignored costs.
  S.fx('chime', T.formula + 4.4, { vel: 32 }); [10.0, 11.2, 12.4, 14.0].forEach((a) => S.fx('tick', T.formula + a, { vel: 28 })); S.fx('ding', T.formula + 13.6, { vel: 32 });
  pop(T.formula + 16.6); for (let i = 0; i < 4; i++) pop(T.formula + 21.6 + i * 0.5, 24, 3 + i * 2);
  // Leverage: chips step, loss card, danger.
  [7.4, 9.2, 11.0].forEach((a, i) => pop(T.leverage + a, 28, 5 + i * 2)); S.fx('ding', T.leverage + 12.8, { vel: 30 }); S.fx('thud', T.leverage + 19.6, { vel: 30 });
  // Drawdown: two equity paths.
  for (let i = 0; i < 5; i++) S.fx('tick', T.drawdown + 6.6 + i * 0.6, { vel: 22 }); for (let i = 0; i < 5; i++) S.fx('thud', T.drawdown + 11.6 + i * 0.6, { vel: 22 + i * 2 }); pop(T.drawdown + 16.4);
  // Mistake.
  [1.4, 2.8, 4.2].forEach((a) => S.fx('tick', T.mistake + a, { vel: 26 })); S.fx('thud', T.mistake + 6.4, { vel: 32 }); for (let i = 0; i < 4; i++) S.fx('tick', T.mistake + 7.8 + i * 1.2, { vel: 28 }); S.fx('chime', T.mistake + 13.8, { vel: 32 });
  // Try it.
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 1.0 + i * 0.9, { vel: 22 }); [7.6, 8.2, 8.8].forEach((a) => pop(T.try + a, 26));
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 14.4 + i, { vel: 30 }); S.fx('chime', T.try + 20.0, { vel: 42 }); pop(T.try + 25.3, 28, 5);
  // Validate: each warning.
  S.fx('ding', T.validate + 2.6, { vel: 26 }); [5.6, 11.2, 16.4].forEach((a) => S.fx('thud', T.validate + a, { vel: 30 }));
  [3.6, 10.0, 12.8, 17.0].forEach((a) => pop(T.risks + a, 26));
  [2.0, 8.6, 14.8].forEach((a) => pop(T.recap + a + 0.5, 34));
  S.fx('ding', T.recap + 26.0, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
