kit.score(function (S, T) {
  const BPM = 90, B = 60 / BPM, BAR = 4 * B;
  S.tempo(BPM, { t0: 0 });
  S.program('pad', 'pad', { rev: 0.7, gain: -4 });
  S.program('keys', 'ep', { rev: 0.4, gain: -7 });
  S.program('mal', 'pluck', { rev: 0.5, gain: -9, pan: 0.2 });
  S.program('bass', 'bass', { gain: -7 });
  const prog = [['D3', 'A3', 'E4', 'F#4'], ['B2', 'F#3', 'A3', 'D4'], ['G2', 'D3', 'F#3', 'B3'], ['A2', 'E3', 'A3', 'C#4']];
  const roots = ['D2', 'B1', 'G1', 'A1'];
  const tops = [['F#5', 'A5', 'E5'], ['D5', 'F#5', 'A5'], ['B4', 'D5', 'F#5'], ['C#5', 'E5', 'A5']];
  const bars = Math.floor(T.END / BAR);
  const groove = (s) => (s >= T.phases - 0.1 && s < T['demo-only'] - 0.1) || (s >= T.outcomes - 0.1 && s < T.start - 0.1);
  const pulse = (s) => (s >= T['for-you'] - 0.1 && s < T['demo-only'] - 0.1) || (s >= T.outcomes - 0.1 && s < T.start - 0.1);
  const quiet = (s) => s >= T['demo-only'] - 0.1 && s < T.outcomes - 0.1;
  for (let b = 0; b < bars; b++) {
    const beat = b * 4, s = beat * B, c = prog[b % 4];
    if (s >= T.start - 0.1) break;
    S.chord('pad', c, { beat, beats: 4, vel: quiet(s) ? 30 : 36 });
    if (s >= T.welcome - 0.1 && !quiet(s)) S.chord('keys', c.slice(1), { beat, beats: 3, vel: 40 });
    if (quiet(s)) S.chord('keys', c.slice(1), { beat: beat + 2, beats: 2, vel: 30 });
    if (pulse(s)) S.pattern('mal', 'x.x..x.x', { from: beat, repeat: 1, pitch: tops[b % 4], vel: 42 });
    if (groove(s)) {
      S.note('bass', roots[b % 4], { beat, beats: 3, vel: 60 });
      S.drums({ kick: 'x.......', hat: '..o...o.' }, { from: beat, repeat: 1, vel: 46 });
    }
  }
  S.note('mal', 'A5', { t: 0, dur: 2, vel: 40 });
  S.fx('sparkle', T.signal + 4.0, { vel: 40 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.welcome + 4.4 + i * 0.35, { vel: 46 });
  for (let i = 0; i < 3; i++) S.fx('pop', T['for-you'] + 1.6 + i * 0.4, { vel: 40 });
  S.fx('ding', T['for-you'] + 5.8, { vel: 40 });
  for (let i = 0; i < 5; i++) S.fx('click', T.lesson + 2.8 + i * 3, { vel: 44 });
  S.fx('ding', T.lesson + 14.8 + 1.4, { vel: 46 });
  S.fx('whoosh', T.phases + 1.2, { dur: 2.2, vel: 30 });
  for (let i = 0; i < 5; i++) S.fx('pop', T.phases + 1.4 + i * 0.4, { vel: 40 });
  for (let i = 0; i < 5; i++) S.fx('ding', T.phases + 3.6 + i * 3.5, { vel: 34 });
  S.fx('chime', T.phases + 21.1, { vel: 40 });
  S.fx('click', T['demo-only'] + 3.2, { vel: 50 });
  S.fx('ding', T['demo-only'] + 3.8, { vel: 44 });
  for (let i = 0; i < 3; i++) S.fx('pop', T['demo-only'] + 5.4 + i * 2.2, { vel: 36 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.risk + 1.5 + i * 1.6, { vel: 38 });
  for (let i = 0; i < 3; i++) S.fx('tick', T.risk + 6.8 + i * 0.3, { vel: 34 });
  S.fx('chime', T.risk + 8.6, { vel: 46 });
  for (let i = 0; i < 5; i++) S.fx('pop', T.outcomes + 1.8 + i * 1.25, { vel: 42 });
  S.fx('revswell', T.start, { dur: 1.6, vel: 50 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.start, dur: 9, vel: 44 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.start + 0.7, dur: 8, vel: 58 });
  S.note('bass', 'D2', { t: T.start + 0.7, dur: 6, vel: 64 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.start + 1.4, step: 0.12, vel: 44, cresc: 6 });
  S.fx('chime', T.start + 2.2, { vel: 44 });
  // The tutor: runs in, its speech bubbles pop, it hops back to its corner.
  // Soft footsteps while the tutor walks (two steps per walk cycle).
  const steps = (a, b) => { const ts = []; for (let s = a + 0.18; s < b; s += 0.364) ts.push(s); S.ticks(ts, { vel: 26 }); };
  steps(T.welcome, T.welcome + 1.5); steps(T.welcome + 8.7, T.welcome + 9.8); steps(T.start + 0.1, T.start + 1.1);
  S.fx('pop', T.welcome + 1.5, { vel: 28 });
  [[T.welcome, 1.5], [T.welcome, 3.9], [T.welcome, 6.4], [T['for-you'], 1.9], [T['for-you'], 7.5], [T.lesson, 0.7], [T.phases, 0.6], [T['demo-only'], 12.4], [T.risk, 10.0], [T.outcomes, 7.7], [T.start, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 30, pitch: 7 }));
  S.master({ gain: -8, fadeOut: 2.5 });
});
