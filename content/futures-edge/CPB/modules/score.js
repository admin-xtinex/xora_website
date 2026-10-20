kit.score(function (S, T) {
  // No voice: the music is the only sound. A soft bed: pad and keys, a light pulse while the questions run, quieter for safety.
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
  const pulse = (s) => inR(s, T['q-candle'], T.safety);
  const quiet = (s) => inR(s, T.safety, T.revisit);
  const bars = Math.floor(T.END / BAR);
  for (let b = 0; b < bars; b++) {
    const beat = b * 4, s = beat * B, c = prog[b % 4];
    if (s >= T.next - 0.1) break;
    S.chord('pad', c, { beat, beats: 4, vel: quiet(s) ? 26 : 32 });
    if (!quiet(s)) S.chord('keys', c.slice(1), { beat, beats: 3, vel: 34 });
    if (pulse(s)) { S.pattern('mal', 'x.x..x.x', { from: beat, repeat: 1, pitch: tops[b % 4], vel: 30 }); S.note('bass', roots[b % 4], { beat, beats: 3, vel: 46 }); }
  }
  const steps = (a, b) => { const ts = []; for (let s = a + 0.18; s < b; s += 0.364) ts.push(s); S.ticks(ts, { vel: 24 }); };
  steps(T.title, T.title + 2.6); steps(T.next + 0.1, T.next + 1.1);
  S.fx('pop', T.title + 2.9, { vel: 26, pitch: 7 }); S.fx('chime', T.title + 1.4, { vel: 30 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.how + 2.6 + i * 0.35, { vel: 26, pitch: 5 });
  [6.3, 7.7, 9.1, 11.9].forEach((a) => S.fx('tick', T.how + a, { vel: 30 }));
  for (let i = 0; i < 3; i++) S.fx('pop', T.how + 12.9 + i * 0.4, { vel: 30, pitch: 7 });
  ['q-candle', 'q-agg', 'q-fake', 'q-vol', 'q-fees', 'q-wait', 'q-size', 'q-after'].forEach((id) => {
    const s = T[id];
    S.fx('whoosh', s + 0.1, { dur: 0.8, vel: 18 });
    for (let i = 0; i < 4; i++) S.fx('pop', s + 1.2 + i * 0.25, { vel: 24, pitch: 4 + i });
    for (let i = 0; i < 5; i++) S.fx('tick', s + 2.5 + i, { vel: 28 });
    S.fx('chime', s + 7.6, { vel: 40 });
    S.fx('ding', s + 7.9, { vel: 30 });
    S.fx('thud', s + 14.3, { vel: 24 });
  });
  S.fx('whoosh', T['q-fake'] + 1.6, { dur: 2.4, vel: 18 }); S.fx('thud', T['q-fake'] + 4.9, { vel: 22 });
  for (let i = 0; i < 10; i++) S.fx('tick', T['q-fees'] + 3.6 + i * 0.3, { vel: 18 });
  S.fx('ding', T['q-size'] + 8.6, { vel: 26 }); S.fx('pop', T['q-wait'] + 7.9, { vel: 30, pitch: 7 });
  for (let i = 0; i < 5; i++) S.fx('tick', T['q-agg'] + 1.6 + i * 0.35, { vel: 16 });
  [4.1, 10.6, 15.9, 22.4].forEach((a) => S.fx('pop', T.safety + a, { vel: 30 }));
  [3.8, 5.4, 6.8, 7.8, 8.2, 10.6].forEach((a) => S.fx('pop', T.revisit + a, { vel: 32, pitch: 7 }));
  S.fx('ding', T.revisit + 12.6, { vel: 34 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 13, vel: 40 });
  [6.2, 6.8, 7.4].forEach((a, i) => S.fx('pop', T.next + a, { vel: 30, pitch: 5 + i * 2 }));
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 12, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 21.5, fadeOut: 2.5 });
});
