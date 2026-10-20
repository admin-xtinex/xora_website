kit.score(function (S, T) {
  // Soft pad and keys bed (no voice), a light pulse in the hands-on parts, quieter in the risk scenes, a closing chord.
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
  const pulse = (s) => inR(s, T.hook, T.opportunity) || inR(s, T.plan, T.market) || inR(s, T.carousel1, T.horizon) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.mistake, T.try) || inR(s, T.risks, T.recap);
  const bars = Math.floor(T.END / BAR);
  for (let b = 0; b < bars; b++) {
    const beat = b * 4, s = beat * B, c = prog[b % 4];
    if (s >= T.finish - 0.1) break;
    S.chord('pad', c, { beat, beats: 4, vel: quiet(s) ? 26 : 32 });
    if (!quiet(s)) S.chord('keys', c.slice(1), { beat, beats: 3, vel: 34 });
    if (pulse(s)) { S.pattern('mal', 'x.x..x.x', { from: beat, repeat: 1, pitch: tops[b % 4], vel: 32 }); S.note('bass', roots[b % 4], { beat, beats: 3, vel: 46 }); }
  }
  const steps = (a, b) => { const ts = []; for (let s = a + 0.18; s < b; s += 0.364) ts.push(s); S.ticks(ts, { vel: 24 }); };
  steps(T.title, T.title + 2.6); steps(T.finish + 0.1, T.finish + 1.1);
  [[T.title, 0.8], [T.title, 1.3], [T.title, 1.8], [T.hook, 0.5], [T.opportunity, 0.4], [T.opportunity, 0.6], [T.opportunity, 8.0], [T.opportunity, 14.8],
    [T.rmath, 1.0], [T.rmath, 1.6], [T.rmath, 2.2], [T.insights, 0.5], [T.insights, 12.9], [T.plan, 0.4], [T.plan, 1.4], [T.plan, 11.8],
    [T.market, 7.2], [T.carousel1, 0.5], [T.carousel1, 7.4], [T.carousel2, 0.6], [T.carousel2, 7.8], [T.carousel2, 12.6], [T.horizon, 0.8], [T.horizon, 14.4],
    [T.mistake, 1.0], [T.mistake, 6.6], [T.try, 0.8]].forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  for (let i = 0; i < 6; i++) S.fx('whoosh', T.hook + 5.6 + i * 1.2, { dur: 0.6, vel: 16 });
  S.fx('whoosh', T.rmath + 12.6, { dur: 1.0, vel: 22 }); S.fx('tick', T.rmath + 13.6, { vel: 32 }); S.fx('tick', T.rmath + 15.4, { vel: 32 }); S.fx('ding', T.rmath + 16.0, { vel: 36 });
  for (let i = 0; i < 4; i++) S.fx('tick', T.insights + 13.4 + i * 0.9, { vel: 24 });
  S.fx('whoosh', T.insights + 19.8, { dur: 1.4, vel: 22 });
  S.fx('ding', T.plan + 7.6, { vel: 36 }); S.fx('ding', T.plan + 13.6, { vel: 36 }); S.fx('thud', T.plan + 16.4, { vel: 24 });
  for (let i = 0; i < 6; i++) S.fx('tick', T.market + 3.2 + i * 0.4, { vel: 24 });
  S.fx('chime', T.market + 6.0, { vel: 30 }); S.fx('pop', T.market + 13.4, { vel: 30 }); S.fx('pop', T.market + 14.4, { vel: 30 });
  S.fx('whoosh', T.carousel1 + 13.6, { dur: 0.8, vel: 24 });
  S.fx('whoosh', T.carousel2 + 17.4, { dur: 0.8, vel: 24 }); S.fx('whoosh', T.carousel2 + 23.4, { dur: 0.8, vel: 24 });
  S.fx('thud', T.horizon + 5.6, { vel: 28 }); S.fx('chime', T.horizon + 6.4, { vel: 30 });
  S.fx('whoosh', T.mistake + 3.6, { dur: 0.6, vel: 24 }); S.fx('thud', T.mistake + 3.9, { vel: 28 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 6.4 + i, { vel: 30 });
  S.fx('chime', T.try + 12.0, { vel: 40 }); S.fx('ding', T.try + 16.2, { vel: 36 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.risks + [4.9, 10.5, 12.4, 16.1][i], { vel: 28 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.recap + [0.6, 6.4, 11.8][i] + 0.5, { vel: 34 });
  S.fx('ding', T.recap + 16.5, { vel: 38 });
  S.fx('revswell', T.finish, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.finish, dur: 12, vel: 42 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.finish + 0.7, dur: 11, vel: 52 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.finish + 1.0, step: 0.12, vel: 42, cresc: 6 });
  S.run('mal', ['A5', 'B5', 'D6', 'F#6'], { t: T.finish + 6.4, step: 0.14, vel: 36, cresc: 4 });
  S.chord('keys', ['D4', 'F#4', 'A4', 'D5'], { t: T.finish + 8.0, dur: 4.5, vel: 46 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
