kit.score(function (S, T) {
  // No voice: a soft pad and keys bed, a light pulse in the hands-on parts, quieter for the mistake and risk scenes.
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
  const pulse = (s) => inR(s, T.live, T.anatomy) || inR(s, T.rules, T.mistake) || inR(s, T.try, T.risks);
  const quiet = (s) => inR(s, T.mistake, T.try) || inR(s, T.risks, T.recap);
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
  [[T.title, 2.9], [T.title, 1.9], [T.window, 0.6], [T.anatomy, 0.4], [T.updown, 0.6], [T.doji, 0.4], [T.rules, 0.6], [T.chart, 0.5], [T.mistake, 1.4], [T.try, 0.6], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  // hook: the line draws, squeezes into a candle, four tags, four more candles.
  S.fx('whoosh', T.hook + 6.0, { dur: 2.4, vel: 24 }); S.fx('ding', T.hook + 8.8, { vel: 32 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.hook + 10.6 + i * 0.5, { vel: 30 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.hook + 15.6 + i * 0.45, { vel: 28 });
  // window: definitions, the clock, the temperature day.
  for (const a of [6.0, 7.6, 9.0, 9.9]) S.fx('pop', T.window + a, { vel: 30 });
  S.fx('chime', T.window + 5.6, { vel: 28 }); S.fx('whoosh', T.window + 11.6, { dur: 0.8, vel: 22 }); S.fx('chime', T.window + 17.2, { vel: 30 });
  // live: open, new lows and highs, the close.
  S.fx('ding', T.live + 3.0, { vel: 34 });
  for (let i = 0; i < 6; i++) S.fx('tick', T.live + 3.6 + i * 0.75, { vel: 22 });
  for (let i = 0; i < 8; i++) S.fx('tick', T.live + 13.4 + i * 0.6, { vel: 24 });
  S.fx('chime', T.live + 27.0, { vel: 42 });
  for (const a of [27.6, 33.2, 33.8, 34.4]) S.fx('pop', T.live + a, { vel: 30 });
  // anatomy brackets and range.
  for (const a of [12.4, 12.9, 13.4]) S.fx('tick', T.anatomy + a, { vel: 28 });
  S.fx('ding', T.anatomy + 18.0, { vel: 32 });
  // up / down candles grow.
  S.fx('whoosh', T.updown + 4.6, { dur: 1.6, vel: 22 }); S.fx('ding', T.updown + 6.6, { vel: 30 });
  S.fx('whoosh', T.updown + 10.3, { dur: 1.6, vel: 22 }); S.fx('thud', T.updown + 12.3, { vel: 28 });
  S.fx('pop', T.updown + 20.6, { vel: 28 });
  // doji: the body shrinks.
  S.fx('whoosh', T.doji + 1.2, { dur: 3.0, vel: 20 }); S.fx('ding', T.doji + 9.9, { vel: 30 }); S.fx('pop', T.doji + 15.0, { vel: 28 });
  // rules: pushes and ticks.
  S.fx('thud', T.rules + 7.0, { vel: 28 }); S.fx('thud', T.rules + 12.4, { vel: 28 }); S.fx('thud', T.rules + 17.6, { vel: 28 });
  S.fx('ding', T.rules + 19.6, { vel: 32 }); S.fx('ding', T.rules + 20.1, { vel: 32 });
  // chart: candles fill in.
  for (let i = 0; i < 10; i++) S.fx('tick', T.chart + 2.4 + i * 0.22, { vel: 20 });
  S.fx('chime', T.chart + 6.4, { vel: 28 });
  // mistake: wrong, replay, right.
  S.fx('thud', T.mistake + 4.6, { vel: 30 }); S.fx('whoosh', T.mistake + 5.4, { dur: 4.0, vel: 18 }); S.fx('chime', T.mistake + 10.4, { vel: 34 });
  // try: countdown and answer.
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 5.0 + i, { vel: 30 });
  S.fx('chime', T.try + 10.6, { vel: 40 }); S.fx('ding', T.try + 16.0, { vel: 34 });
  for (const a of [4.4, 9.9, 12.6, 16.1]) S.fx('pop', T.risks + a, { vel: 28 });
  for (const a of [2.5, 7.3, 11.9]) S.fx('pop', T.recap + a, { vel: 34 });
  S.fx('ding', T.recap + 23.0, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, music: 22, fadeOut: 2.5 });
});
