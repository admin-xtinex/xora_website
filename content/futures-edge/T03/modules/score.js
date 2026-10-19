kit.score(function (S, T) {
  // No voice: a soft pad and keys bed, a light pulse in the hands-on parts, quieter for the risks.
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
  const pulse = (s) => inR(s, T.notional, T.mistake) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.risks, T.recap) || inR(s, T.mistake, T.try);
  const bars = Math.floor(T.END / BAR);
  for (let b = 0; b < bars; b++) {
    const beat = b * 4, s = beat * B, c = prog[b % 4];
    if (s >= T.next - 0.1) break;
    S.chord('pad', c, { beat, beats: 4, vel: quiet(s) ? 26 : 32 });
    if (!quiet(s)) S.chord('keys', c.slice(1), { beat, beats: 3, vel: 34 });
    if (pulse(s)) { S.pattern('mal', 'x.x..x.x', { from: beat, repeat: 1, pitch: tops[b % 4], vel: 36 }); S.note('bass', roots[b % 4], { beat, beats: 3, vel: 50 }); }
  }
  const steps = (a, b) => { const ts = []; for (let s = a + 0.18; s < b; s += 0.364) ts.push(s); S.ticks(ts, { vel: 24 }); };
  steps(T.title, T.title + 2.6); steps(T.next + 0.1, T.next + 1.1);
  // Tutor speech bubbles.
  [[T.title, 2.9], [T.tags, 10.6], [T.mistake, 12.6], [T.try, 12.4], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  S.fx('pop', T.tags + 0.6, { vel: 32 }); S.fx('ding', T.tags + 5.0, { vel: 30 }); S.fx('ding', T.tags + 7.0, { vel: 30, pitch: 3 }); S.fx('pop', T.tags + 10.2, { vel: 34 });
  S.fx('whoosh', T.pair + 5.4, { dur: 1.0, vel: 22 }); S.fx('pop', T.pair + 6.2, { vel: 34 }); S.fx('pop', T.pair + 11.6, { vel: 34 }); S.fx('ding', T.pair + 17.0, { vel: 36 });
  [3.4, 8.0, 8.4].forEach((x) => S.fx('tick', T.symbol + x, { vel: 32 })); S.fx('pop', T.symbol + 12.0, { vel: 32 });
  S.fx('pop', T.usdt + 6.0, { vel: 30 }); S.fx('ding', T.usdt + 11.4, { vel: 32 });
  S.fx('whoosh', T.quantity + 5.0, { dur: 1.8, vel: 20 }); S.fx('pop', T.quantity + 10.0, { vel: 36 }); S.fx('ding', T.quantity + 11.2, { vel: 36 });
  S.fx('pop', T.notional + 6.4, { vel: 30 }); [11.8, 13.0, 15.0].forEach((x) => S.fx('pop', T.notional + x, { vel: 32 })); S.fx('ding', T.notional + 16.1, { vel: 40 });
  S.fx('whoosh', T.calc + 6.0, { dur: 1.4, vel: 22 }); S.fx('ding', T.calc + 7.4, { vel: 34 }); S.fx('whoosh', T.calc + 17.6, { dur: 1.4, vel: 22 }); S.fx('thud', T.calc + 19.0, { vel: 26 });
  S.fx('thud', T.mistake + 6.0, { vel: 30 }); S.fx('pop', T.mistake + 7.0, { vel: 30 }); S.fx('chime', T.mistake + 11.8, { vel: 36 });
  for (let i = 0; i < 4; i++) S.fx('click', T.try + 1.4 + i * 0.12, { vel: 22 });
  for (let i = 0; i < 6; i++) S.fx('click', T.try + 2.4 + i * 0.12, { vel: 22 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 3.6 + i, { vel: 30 });
  S.fx('chime', T.try + 9.0, { vel: 42 });
  [0.8, 1.8, 6.2].forEach((x) => S.fx('pop', T.pairs + x, { vel: 32 })); S.fx('ding', T.pairs + 12.6, { vel: 34 });
  S.fx('pop', T.risks + 4.6, { vel: 28 }); S.fx('thud', T.risks + 7.2, { vel: 26 }); S.fx('pop', T.risks + 12.2, { vel: 28 }); S.fx('pop', T.risks + 18.0, { vel: 28 });
  [1.6, 6.6, 11.0].forEach((x) => S.fx('pop', T.recap + x + 0.5, { vel: 34 }));
  S.fx('ding', T.recap + 22.8, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
