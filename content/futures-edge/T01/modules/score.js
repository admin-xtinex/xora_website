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
  const pulse = (s) => inR(s, T.balance, T.risks) || inR(s, T.ticker, T.money);
  const quiet = (s) => inR(s, T.risks, T.recap) || inR(s, T.wallet, T.token);
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
  [[T.title, 2.9], [T.ticker, 8.8], [T.money, 13.2], [T.digital, 11.4], [T.ledger, 17.4], [T.bitcoin, 9.4], [T.wallet, 11.4], [T.token, 8.4], [T.balance, 11.4], [T.moves, 14.6], [T.try, 0.8], [T.try, 12.2], [T.sort, 12.5], [T.risks, 16.8], [T.next, 1.3]]
    .forEach((b) => S.fx('pop', b[0] + b[1], { vel: 26, pitch: 7 }));
  S.fx('whoosh', T.ledger + 3.2, { dur: 1.2, vel: 24 }); S.fx('ding', T.ledger + 4.4, { vel: 34 });
  for (let i = 0; i < 6; i++) S.fx('tick', T.ledger + 9.4 + i * 0.25, { vel: 26 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.ledger + 12.8 + i * 0.45, { vel: 32 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.bitcoin + 2.0 + i * 1.6, { vel: 34 });
  S.fx('thud', T.wallet + 3.6, { vel: 30 }); S.fx('chime', T.wallet + 5.0, { vel: 34 });
  S.fx('ding', T.balance + 7.9, { vel: 40 });
  for (let i = 0; i < 5; i++) S.fx('tick', T.try + 3.6 + i, { vel: 30 });
  S.fx('chime', T.try + 9.0, { vel: 42 });
  for (let i = 0; i < 5; i++) S.fx('pop', T.sort + 1.6 + i * 2.2 + 2.0, { vel: 36 });
  for (let i = 0; i < 4; i++) S.fx('pop', T.risks + 1.2 + i * 3.4, { vel: 30 });
  for (let i = 0; i < 3; i++) S.fx('pop', T.recap + 1.9 + i * 2.4, { vel: 34 });
  S.fx('ding', T.recap + 14.2, { vel: 38 });
  S.fx('revswell', T.next, { dur: 1.6, vel: 44 });
  S.chord('pad', ['D3', 'A3', 'D4', 'F#4'], { t: T.next, dur: 9, vel: 40 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.next + 0.7, dur: 8, vel: 50 });
  S.run('mal', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'], { t: T.next + 1.4, step: 0.12, vel: 40, cresc: 6 });
  S.master({ gain: -10, fadeOut: 2.5 });
});
