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
  const pulse = (s) => inR(s, T.book, T.example);
  const quiet = (s) => inR(s, T.notbank, T.recap);
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
  [[T.title, 2.9], [T.next, 1.3]].forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  S.fx('pop', T.meeting + 0.8, { vel: 30 });
  for (let i = 0; i < 9; i++) S.fx('tick', T.meeting + 6.8 + i * 1.1 + 1.3, { vel: 26 });
  S.fx('pop', T.meeting + 13.4, { vel: 30 });
  [6.0, 6.6, 7.2, 7.8].forEach((x) => S.fx('click', T.order + x, { vel: 24 })); S.fx('ding', T.order + 9.9, { vel: 34 }); S.fx('pop', T.order + 12.8, { vel: 30 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.book + 5.6 + i * 0.45, { vel: 28 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.book + 10.8 + i * 0.45, { vel: 28 });
  [16.4, 17.4, 18.4, 19.2].forEach((x) => S.fx('tick', T.book + x, { vel: 24 }));
  S.fx('ding', T.bidask + 1.6, { vel: 30 }); S.fx('ding', T.bidask + 7.4, { vel: 30, pitch: 3 }); S.fx('pop', T.bidask + 11.4, { vel: 30 }); S.fx('pop', T.bidask + 11.8, { vel: 30 });
  S.fx('pop', T.spread + 5.2, { vel: 30 }); S.fx('whoosh', T.spread + 9.4, { dur: 0.8, vel: 22 }); S.fx('ding', T.spread + 10.0, { vel: 34 }); S.fx('pop', T.spread + 15.4, { vel: 28 });
  S.fx('pop', T.match + 5.0, { vel: 30 });
  [9.6, 13.6].forEach((x) => { S.fx('whoosh', T.match + x - 0.6, { dur: 0.6, vel: 20 }); S.fx('ding', T.match + x, { vel: 34 }); });
  S.fx('chime', T.match + 17.8, { vel: 38 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 3.6 + i, { vel: 30 });
  S.fx('chime', T.try + 9.0, { vel: 40 }); [9.2, 10.6, 12.0].forEach((x) => S.fx('pop', T.try + x, { vel: 28 })); S.fx('ding', T.try + 15.2, { vel: 38 });
  S.fx('pop', T.example + 5.4, { vel: 28 }); S.fx('thud', T.example + 7.6, { vel: 26 });
  [3.8, 9.6, 14.6].forEach((x) => S.fx('pop', T.notbank + x, { vel: 26 })); S.fx('click', T.notbank + 11.0, { vel: 30 });
  S.fx('pop', T.phishing + 2.6, { vel: 28 }); [6.2, 12.4, 15.0].forEach((x) => S.fx('thud', T.phishing + x, { vel: 24 })); S.fx('chime', T.phishing + 18.4, { vel: 34 });
  for (let i = 0; i < 3; i++) S.fx('click', T.security + 5.6 + i * 0.9 + 0.6, { vel: 34 });
  S.fx('click', T.security + 12.8, { vel: 30 }); S.fx('ding', T.security + 13.3, { vel: 34 });
  [1.6, 7.4, 13.6].forEach((x) => S.fx('pop', T.recap + x + 0.5, { vel: 34 }));
  S.fx('ding', T.recap + 24.4, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 11, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 10, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21, fadeOut: 2.5 });
});
