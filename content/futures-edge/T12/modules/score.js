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
  const pulse = (s) => inR(s, T.path, T.both) || inR(s, T.try, T.risks) || inR(s, T.hook, T.margin);
  const quiet = (s) => inR(s, T.both, T.modes) || inR(s, T.risks, T.recap);
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
  // Hook: price up, price down, the answer.
  S.fx('whoosh', T.hook + 5.3, { dur: 1.2, vel: 22 }); S.fx('ding', T.hook + 7.8, { vel: 32 });
  S.fx('whoosh', T.hook + 10.2, { dur: 1.2, vel: 22 }); S.fx('thud', T.hook + 12.9, { vel: 30 });
  S.fx('chime', T.hook + 15.0, { vel: 36 });
  // Margin: 100 USDT moves into the margin box.
  S.fx('pop', T.margin + 8.2, { vel: 32, pitch: 7 }); S.fx('whoosh', T.margin + 8.6, { dur: 1.0, vel: 22 }); S.fx('ding', T.margin + 10.0, { vel: 34 });
  S.fx('pop', T.margin + 13.2, { vel: 28, pitch: 7 });
  // Notional: the bar grows; the 2% chip.
  for (let i = 0; i < 5; i++) S.fx('tick', T.notional + 2.8 + i * 0.3, { vel: 22 });
  S.fx('whoosh', T.notional + 7.0, { dur: 1.8, vel: 24 }); S.fx('ding', T.notional + 9.0, { vel: 32 }); S.fx('pop', T.notional + 12.0, { vel: 30, pitch: 7 });
  // Leverage steps.
  [6.0, 8.0, 9.8].forEach((a, i) => S.fx('pop', T.leverage + a, { vel: 30 + i * 4, pitch: 5 + i * 2 }));
  S.fx('chime', T.leverage + 11.5, { vel: 34 }); S.fx('pop', T.leverage + 17.4, { vel: 28, pitch: 7 });
  // Path: rise, fall.
  for (let i = 0; i < 3; i++) S.fx('pop', T.path + 1.6 + i * 0.4, { vel: 26, pitch: 7 });
  S.fx('ding', T.path + 9.4, { vel: 34 }); S.fx('thud', T.path + 15.8, { vel: 32 }); S.fx('chime', T.path + 19.6, { vel: 32 });
  // Example tiles.
  [6.6, 7.7, 8.9, 11.9, 12.9, 14.1].forEach((a) => S.fx('pop', T.example + a, { vel: 30, pitch: 7 }));
  S.fx('ding', T.example + 10.0, { vel: 34 }); S.fx('ding', T.example + 15.2, { vel: 34 }); S.fx('chime', T.example + 16.3, { vel: 32 });
  // Both directions: the fall, then the liquidation card.
  S.fx('whoosh', T.both + 4.6, { dur: 4.6, vel: 20 }); S.fx('thud', T.both + 9.6, { vel: 34 }); S.fx('pop', T.both + 11.6, { vel: 28, pitch: 5 });
  // Maintenance gauge.
  S.fx('pop', T.maint + 2.0, { vel: 26, pitch: 7 }); S.fx('tick', T.maint + 3.4, { vel: 26 }); S.fx('pop', T.maint + 6.5, { vel: 26, pitch: 7 });
  S.fx('thud', T.maint + 16.8, { vel: 30 });
  // Modes.
  S.fx('whoosh', T.modes + 5.4, { dur: 3.6, vel: 18 }); S.fx('ding', T.modes + 10.6, { vel: 30 });
  S.fx('whoosh', T.modes + 16.8, { dur: 3.8, vel: 18 }); S.fx('thud', T.modes + 21.0, { vel: 28 }); S.fx('pop', T.modes + 22.7, { vel: 30, pitch: 5 });
  // Mistake.
  S.fx('whoosh', T.mistake + 4.9, { dur: 0.7, vel: 26 }); for (let i = 0; i < 3; i++) S.fx('tick', T.mistake + 8.2 + i * 0.35, { vel: 28 });
  S.fx('pop', T.mistake + 10.8, { vel: 30, pitch: 7 }); S.fx('pop', T.mistake + 12.4, { vel: 30, pitch: 7 });
  // Try it.
  S.fx('pop', T.try + 0.8, { vel: 28, pitch: 7 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 3.6 + i, { vel: 30 });
  S.fx('chime', T.try + 9.0, { vel: 42 }); S.fx('pop', T.try + 10.8, { vel: 32, pitch: 7 }); S.fx('pop', T.try + 14.6, { vel: 32, pitch: 7 }); S.fx('ding', T.try + 20.2, { vel: 36 });
  [3.7, 7.7, 14.5, 20.2].forEach((a) => S.fx('pop', T.risks + a, { vel: 28 }));
  [2.0, 5.5, 10.5].forEach((a) => S.fx('pop', T.recap + a + 0.5, { vel: 34 }));
  S.fx('ding', T.recap + 21.1, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 24, fadeOut: 2.5 });
});
