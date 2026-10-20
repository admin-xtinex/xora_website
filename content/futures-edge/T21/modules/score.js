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
  const pulse = (s) => inR(s, T.hook, T.confirm) || inR(s, T.fakeout, T.hindsight) || inR(s, T.try, T.risks);
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
  // Title: the line forks, NO_TRADE settles.
  S.fx('whoosh', T.title + 0.4, { dur: 1.4, vel: 16 }); [2.0, 2.35, 2.7].forEach((a, i) => pop(T.title + a + 0.8, 24, 5 + i * 2)); pop(T.title + 4.2, 32, 9);
  // Hook: candles draw, two rejections, three futures.
  S.fx('whoosh', T.hook + 0.6, { dur: 2.6, vel: 18 }); [4.0, 4.8].forEach((a) => S.fx('thud', T.hook + a, { vel: 26 }));
  pop(T.hook + 7.2, 30, 9); [14.0, 15.6, 17.2].forEach((a, i) => S.fx('whoosh', T.hook + a, { dur: 1.2, vel: 16 + i * 2 })); S.fx('chime', T.hook + 20.8, { vel: 32 });
  // Confirm: candles, the two checks, meter, can / cannot.
  pop(T.confirm + 0.5); [7.6, 9.1, 10.6].forEach((a) => S.fx('tick', T.confirm + a, { vel: 26 })); S.fx('ding', T.confirm + 8.6, { vel: 28 }); S.fx('ding', T.confirm + 11.4, { vel: 28 });
  pop(T.confirm + 13.6); S.fx('whoosh', T.confirm + 14.6, { dur: 1.4, vel: 16 }); [19.2, 19.8].forEach((a) => pop(T.confirm + a, 26)); [20.0, 21.0, 22.6, 23.6].forEach((a) => S.fx('tick', T.confirm + a, { vel: 24 }));
  // Weak: weights land on the scale; NO_TRADE.
  pop(T.weak + 0.6); pop(T.weak + 7.6); [4.0, 14.0, 15.6, 17.2].forEach((a) => S.fx('thud', T.weak + a, { vel: 30 })); S.fx('chime', T.weak + 19.6, { vel: 38 });
  // Fakeout: the candle pokes up, then falls back.
  pop(T.fakeout + 0.6); S.fx('whoosh', T.fakeout + 7.8, { dur: 2.4, vel: 18 }); pop(T.fakeout + 9.4, 30, 9); S.fx('thud', T.fakeout + 13.4, { vel: 30 }); S.fx('ding', T.fakeout + 15.6, { vel: 26 });
  // Fade: four candles, each gain label, the warning.
  for (let i = 0; i < 4; i++) { S.fx('tick', T.fade + 1.4 + i * 1.3, { vel: 26 }); pop(T.fade + 12.8 + i, 30 - i * 3, 9 - i * 2); }
  S.fx('whoosh', T.fade + 7.4, { dur: 2.0, vel: 14 }); S.fx('thud', T.fade + 18.4, { vel: 26 });
  // Hindsight: the future draws, then the curtain.
  S.fx('whoosh', T.hindsight + 0.6, { dur: 2.6, vel: 18 }); pop(T.hindsight + 7.2, 30, 9); S.fx('whoosh', T.hindsight + 13.4, { dur: 1.0, vel: 22 }); S.fx('thud', T.hindsight + 14.4, { vel: 28 }); pop(T.hindsight + 18.8);
  // NO_TRADE: the ball goes by, the conditions fail, the stamp.
  pop(T.notrade + 0.6); S.fx('whoosh', T.notrade + 8.0, { dur: 2.2, vel: 20 }); S.fx('ding', T.notrade + 10.2, { vel: 28 }); [15.6, 17.8].forEach((a) => S.fx('tick', T.notrade + a, { vel: 30 }));
  S.fx('thud', T.notrade + 20.8, { vel: 34 }); S.fx('chime', T.notrade + 21.2, { vel: 36 }); [22.0, 22.6].forEach((a) => pop(T.notrade + a, 24));
  // Mistake.
  pop(T.mistake + 0.5, 26, 5); [5.8, 7.4, 9.2].forEach((a) => S.fx('tick', T.mistake + a, { vel: 26 })); S.fx('thud', T.mistake + 10.4, { vel: 32 }); pop(T.mistake + 12.2);
  for (let i = 0; i < 4; i++) S.fx('tick', T.mistake + 13.0 + i * 0.8, { vel: 24 }); S.fx('chime', T.mistake + 16.4, { vel: 30 });
  // Try it: candles revealed, countdown, answer.
  [6.6, 9.6, 11.2].forEach((a) => S.fx('whoosh', T.try + a, { dur: 1.0, vel: 16 })); [13.8, 14.2, 14.6].forEach((a) => pop(T.try + a, 26));
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 15.2 + i, { vel: 30 });
  S.fx('chime', T.try + 21.0, { vel: 42 }); pop(T.try + 27.8, 26, 5); pop(T.try + 29.8, 26, 5);
  [4.6, 8.2, 11.4, 18.0].forEach((a) => pop(T.risks + a, 26));
  [2.0, 8.8, 15.8].forEach((a) => pop(T.recap + a + 0.5, 34));
  S.fx('ding', T.recap + 27.6, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
