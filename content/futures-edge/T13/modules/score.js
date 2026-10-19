kit.score(function (S, T) {
  // No voice: the music is the only sound. Soft pad and keys, a light pulse in the hands-on parts, quieter in the risk parts.
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
  const pulse = (s) => inR(s, T.buffer, T.liquidation) || inR(s, T.funding, T.fundadd) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.liquidation, T.room) || inR(s, T.gap, T.try) || inR(s, T.risks, T.recap);
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
  S.fx('thud', T.title + 0.6, { vel: 26 }); S.fx('pop', T.title + 1.6, { vel: 30, pitch: 7 }); S.fx('pop', T.title + 2.9, { vel: 26, pitch: 7 });
  // Hook: the line falls, the position closes, the toast.
  S.fx('whoosh', T.hook + 0.8, { dur: 4.0, vel: 18 }); S.fx('thud', T.hook + 5.0, { vel: 34 }); S.fx('pop', T.hook + 5.4, { vel: 30, pitch: 5 });
  // Buffer: three falls.
  S.fx('pop', T.buffer + 0.7, { vel: 26, pitch: 7 }); S.fx('pop', T.buffer + 6.1, { vel: 26, pitch: 7 });
  [11.3, 12.9, 14.5].forEach((a, i) => S.fx('tick', T.buffer + a, { vel: 30 + i * 3 }));
  S.fx('chime', T.buffer + 16.4, { vel: 28 });
  // Liquidation: the gauge sinks, the stamp.
  S.fx('whoosh', T.liquidation + 6.6, { dur: 3.8, vel: 18 }); S.fx('thud', T.liquidation + 10.4, { vel: 40 });
  S.fx('pop', T.liquidation + 11.5, { vel: 26, pitch: 5 }); S.fx('pop', T.liquidation + 17.6, { vel: 26, pitch: 7 });
  // Room.
  S.fx('pop', T.room + 3.9, { vel: 28, pitch: 7 }); S.fx('pop', T.room + 5.3, { vel: 28, pitch: 7 }); S.fx('thud', T.room + 10.6, { vel: 30 }); S.fx('pop', T.room + 15.2, { vel: 30, pitch: 5 });
  // Mark price: the spike.
  S.fx('pop', T.mark + 2.4, { vel: 26, pitch: 7 }); S.fx('whoosh', T.mark + 13.7, { dur: 0.6, vel: 26 }); S.fx('ding', T.mark + 14.4, { vel: 30 });
  S.fx('pop', T.mark + 19.9, { vel: 26, pitch: 5 });
  // Funding: the clock ticks to funding time; payments.
  for (let i = 0; i < 8; i++) S.fx('tick', T.funding + 7.8 + i * 0.52, { vel: 22 });
  S.fx('chime', T.funding + 12.0, { vel: 38 }); S.fx('whoosh', T.funding + 14.4, { dur: 1.2, vel: 22 }); S.fx('pop', T.funding + 15.6, { vel: 32, pitch: 7 });
  S.fx('whoosh', T.funding + 16.9, { dur: 1.2, vel: 22 }); S.fx('pop', T.funding + 18.1, { vel: 32, pitch: 9 }); S.fx('pop', T.funding + 19.3, { vel: 28, pitch: 7 });
  // Funding adds up: nine payments, then the 10,000 row.
  for (let i = 0; i < 9; i++) S.fx('tick', T.fundadd + 5.4 + i * 0.55, { vel: 28 });
  S.fx('pop', T.fundadd + 11.1, { vel: 30, pitch: 7 }); S.fx('ding', T.fundadd + 13.4, { vel: 32 }); S.fx('pop', T.fundadd + 16.6, { vel: 28, pitch: 5 });
  // Gap.
  S.fx('thud', T.gap + 9.6, { vel: 40 }); S.fx('pop', T.gap + 13.2, { vel: 30, pitch: 5 }); S.fx('pop', T.gap + 18.8, { vel: 26, pitch: 5 });
  // Stop vs liquidation.
  S.fx('pop', T.stop + 2.6, { vel: 26, pitch: 7 }); S.fx('pop', T.stop + 5.8, { vel: 26, pitch: 5 }); S.fx('thud', T.stop + 12.0, { vel: 40 });
  S.fx('whoosh', T.stop + 16.4, { dur: 0.6, vel: 24 }); S.fx('chime', T.stop + 16.8, { vel: 30 });
  // Try it.
  S.fx('pop', T.try + 0.6, { vel: 28, pitch: 7 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 7.0 + i, { vel: 30 });
  S.fx('chime', T.try + 12.2, { vel: 42 }); S.fx('pop', T.try + 17.9, { vel: 30, pitch: 5 });
  [4.5, 10.5, 15.9, 20.2].forEach((a) => S.fx('pop', T.risks + a, { vel: 28 }));
  [2.0, 8.4, 14.2].forEach((a) => S.fx('pop', T.recap + a + 0.5, { vel: 34 }));
  S.fx('ding', T.recap + 24.7, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
