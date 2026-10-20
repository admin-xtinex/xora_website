kit.score(function (S, T) {
  // No voice: a soft pad and keys bed, a light pulse in the hands-on parts, quieter for the warnings.
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
  const pulse = (s) => inR(s, T.breakout, T.mistake) || inR(s, T.try, T.thin);
  const quiet = (s) => inR(s, T.mistake, T.try) || inR(s, T.thin, T.recap);
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
  const pop = (t, v) => S.fx('pop', t, { vel: v || 28, pitch: 7 });
  const tick = (t, v) => S.fx('tick', t, { vel: v || 26 });
  pop(T.title + 2.9);
  // Hook: the turning points light up, the two lines appear.
  [6.2, 6.55, 6.9].forEach((a) => pop(T.hook + a, 24)); S.fx('whoosh', T.hook + 7.6, { dur: 1.0, vel: 20 }); pop(T.hook + 11.2, 30);
  // Support and resistance: a tick at each touch, the zone arrives, the tests are labelled.
  [2.8, 6.2, 9.5].forEach((a) => tick(T.support + a, 28)); S.fx('ding', T.support + 6.7, { vel: 32 });
  [11.2, 11.8, 12.4].forEach((a) => pop(T.support + a, 28));
  [4.0, 8.5].forEach((a) => tick(T.resist + a, 28)); S.fx('ding', T.resist + 7.3, { vel: 32 });
  [12.6, 13.2].forEach((a) => pop(T.resist + a, 28));
  // Zone: the lows are read, the line widens into a band, the poke.
  [6.6, 7.3, 8.0].forEach((a) => pop(T.zone + a, 26)); S.fx('whoosh', T.zone + 12.2, { dur: 1.0, vel: 22 }); S.fx('ding', T.zone + 13.0, { vel: 30 }); pop(T.zone + 20.0, 30);
  // Breakout: history, the close beyond, the retest.
  for (let i = 0; i < 9; i++) tick(T.breakout + 0.8 + i * 0.4, 18);
  S.fx('whoosh', T.breakout + 5.6, { dur: 0.8, vel: 18 }); S.fx('ding', T.breakout + 10.6, { vel: 38 });
  S.fx('chime', T.breakout + 18.6, { vel: 34 }); S.fx('ding', T.breakout + 21.8, { vel: 30 });
  // Fakeout: the close falls back inside; price drifts down; the ghost ending.
  for (let i = 0; i < 9; i++) tick(T.fakeout + 0.5 + i * 0.25, 16);
  S.fx('thud', T.fakeout + 11.4, { vel: 32 }); [18.4, 19.7, 20.9].forEach((a) => pop(T.fakeout + a, 24)); S.fx('whoosh', T.fakeout + 21.8, { dur: 1.2, vel: 20 });
  // Confirm: one cross, four ticks, then the meter stops short of certain.
  S.fx('thud', T.confirm + 7.3, { vel: 28 }); [9.5, 12.5, 13.3, 16.1].forEach((a) => pop(T.confirm + a, 30));
  S.fx('chime', T.confirm + 19.6, { vel: 32 });
  // Mistake.
  pop(T.mistake + 7.8, 28); S.fx('thud', T.mistake + 10.8, { vel: 32 }); S.fx('whoosh', T.mistake + 11.4, { dur: 0.8, vel: 18 }); S.fx('chime', T.mistake + 17.0, { vel: 34 });
  // Try it: countdown, then the answer.
  pop(T.try + 0.8, 30);
  for (let i = 0; i < 5; i++) tick(T.try + 5.6 + i, 30);
  S.fx('chime', T.try + 11.0, { vel: 40 }); S.fx('ding', T.try + 16.8, { vel: 30 });
  // Thin liquidity: the book thins, a big order eats three levels, the snap back.
  S.fx('whoosh', T.thin + 7.0, { dur: 1.2, vel: 18 }); [12.4, 13.0, 13.6].forEach((a) => pop(T.thin + a, 30)); S.fx('thud', T.thin + 14.6, { vel: 28 }); pop(T.thin + 18.4, 26);
  [4.6, 10.0, 12.4, 16.0].forEach((a) => pop(T.risks + a, 28));
  [2.6, 8.2, 13.8].forEach((a) => pop(T.recap + a, 32));
  S.fx('ding', T.recap + 25.5, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
