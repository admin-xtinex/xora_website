kit.score(function (S, T) {
  // A quiet bed for a lesson that will carry a voiceover: pad and soft keys, a light pulse in the hands-on parts.
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
  const pulse = (s) => inR(s, T.flow, T.mistake);
  const quiet = (s) => inR(s, T.risks, T.recap);
  const bars = Math.floor(T.END / BAR);
  for (let b = 0; b < bars; b++) {
    const beat = b * 4, s = beat * B, c = prog[b % 4];
    if (s >= T.next - 0.1) break;
    S.chord('pad', c, { beat, beats: 4, vel: quiet(s) ? 26 : 32 });
    if (!quiet(s)) S.chord('keys', c.slice(1), { beat, beats: 3, vel: 34 });
    if (pulse(s)) { S.pattern('mal', 'x.x..x.x', { from: beat, repeat: 1, pitch: tops[b % 4], vel: 28 }); S.note('bass', roots[b % 4], { beat, beats: 3, vel: 42 }); }
  }
  const steps = (a, b) => { const ts = []; for (let s = a + 0.18; s < b; s += 0.364) ts.push(s); S.ticks(ts, { vel: 24 }); };
  steps(T.title, T.title + 2.6); steps(T.next + 0.1, T.next + 1.1);
  [[T.title, 1.1], [T.what, 9.4], [T.what, 9.9], [T.what, 10.4], [T.what, 23.2], [T.home, 0.8], [T.home, 7.4], [T.home, 10.6], [T.home, 14.6], [T.signals, 0.6], [T.signals, 8.2], [T.signals, 16.2],
   [T.xoratab, 0.6], [T.xoratab, 8.6], [T.xoratab, 15.8], [T.trades, 0.6], [T.trades, 7.6], [T.approve, 0.6], [T.approve, 7.4], [T.approve, 14.0], [T.settings, 7.8], [T.mistake, 7.8], [T.recap, 0.6], [T.recap, 5.5], [T.recap, 12.5], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 28, pitch: 7 }));
  S.fx('whoosh', T.what + 9.0, { dur: 1.0, vel: 22 });
  [14.6, 16.9, 19.3].forEach((a) => S.fx('chime', T.what + a, { vel: 26 }));
  [7.4, 9.4, 11.4, 13.6, 15.3].forEach((a) => S.fx('tick', T.tabs + a, { vel: 30 }));
  for (let i = 0; i < 5; i++) S.fx('pop', T.tabs + 1.4 + i * 0.45, { vel: 22, pitch: 5 });
  for (let i = 0; i < 12; i++) S.fx('tick', T.signals + 1.0 + i * 0.35, { vel: 16 });
  S.fx('ding', T.signals + 4.6, { vel: 30 });
  S.fx('whoosh', T.signals + 8.4, { dur: 0.9, vel: 20 });
  for (let i = 0; i < 4; i++) S.fx(i === 3 ? 'thud' : 'tick', T.signals + 11.8 + i * 0.7, { vel: 30 });
  S.fx('chime', T.xoratab + 12.6, { vel: 30 });
  S.fx('whoosh', T.trades + 7.4, { dur: 0.8, vel: 20 });
  for (let i = 1; i < 6; i++) S.fx('ding', T.flow + [4.4, 7.8, 10.6, 13.4, 17.6, 20.8][i], { vel: 26 });
  S.fx('ding', T.flow + 4.4, { vel: 26 });
  for (let i = 0; i < 10; i++) S.fx('tick', T.approve + 2.4 + i, { vel: 18 });
  S.fx('thud', T.approve + 12.4, { vel: 30 });
  S.fx('whoosh', T.approve + 14.0, { dur: 0.9, vel: 22 });
  [8.2, 11.6, 15.8].forEach((a) => S.fx('ding', T.settings + a, { vel: 30 }));
  [0.6, 7.8, 11.0, 16.0].forEach((a) => S.fx('pop', T.safety + a, { vel: 28 }));
  S.fx('chime', T.safety + 4.0, { vel: 24 }); S.fx('thud', T.safety + 10.0, { vel: 26 });
  S.fx('tick', T.safety + 12.2, { vel: 26 }); S.fx('tick', T.safety + 13.4, { vel: 26 }); S.fx('thud', T.safety + 14.0, { vel: 32 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.safety + 16.6 + i * 0.9, { vel: 26 });
  S.fx('tick', T.mistake + 2.0, { vel: 28 }); S.fx('thud', T.mistake + 6.4, { vel: 32 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.mistake + 8.6 + i * 1.3, { vel: 28 });
  S.fx('pop', T.try + 0.6, { vel: 28 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 4.0 + i, { vel: 30 });
  S.fx('chime', T.try + 10.0, { vel: 40 });
  [0.6, 8.0, 11.4, 15.1].forEach((a) => S.fx('pop', T.risks + a, { vel: 24 }));
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
