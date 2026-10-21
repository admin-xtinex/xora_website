kit.score(function (S, T) {
  S.tempo(120, { t0: 0 });
  // beats: start 8, engine 16, filter 28, move 38, top3 50, result 68, next 78
  S.program('pad', 'pad', { rev: 0.75 }); S.program('keys', 'ep', { rev: 0.35 }); S.program('bass', 'bass');
  S.program('arp', 'pluck', { pan: -0.2, rev: 0.45, gain: -3 }); S.program('mallet', 'marimba', { pan: 0.2 }); S.program('glk', 'glock', { rev: 0.55, gain: -3 });
  // the question
  S.note('pad', 'A2', { t: 0, dur: 8.2, vel: 36 }); S.note('pad', 'E3', { t: 0, dur: 8.2, vel: 30 }); S.note('pad', 'C#4', { t: 1.0, dur: 7, vel: 24 });
  S.fx('revswell', T.hook + 1.05, { dur: 1.0 }); S.note('glk', 'E6', { t: T.hook + 1.08, dur: 2, vel: 50 }); S.note('glk', 'A5', { t: T.hook + 1.3, dur: 2, vel: 40 });
  // 14 USDT: coins drop in
  const coins = []; for (let i = 0; i < 14; i++) coins.push(T.start + (0.92 + i * 0.13) / 1.25); S.ticks(coins, { vel: 34 });
  S.fx('revswell', T.engine, { dur: 1.2 });
  // engine, filter, last 8 hours: the groove
  const prog = [['A2', 'E3', 'B3', 'C#4'], ['F#2', 'C#3', 'A3', 'E4'], ['D2', 'A2', 'F#3', 'C#4'], ['E2', 'B2', 'G#3', 'B3']];
  const roots = ['A1', 'F#1', 'D1', 'E1'];
  for (let b = 16, i = 0; b < 50; b += 4, i++) {
    S.chord('keys', prog[i % 4], { beat: b, beats: 3.8, vel: 46 });
    S.note('bass', roots[i % 4], { beat: b, beats: 1.5, vel: 78 }); S.note('bass', roots[i % 4], { beat: b + 2.5, beats: 1, vel: 62 });
  }
  S.pattern('arp', 'xxxxxxxx', { from: 16, repeat: 6, step: 0.5, pitch: ['A4', 'C#5', 'E5', 'B5', 'E5', 'C#5'], vel: 40 });
  S.drums({ kick: 'x...x...', hat: 'oxoxoxox' }, { from: 16, repeat: 3 });
  S.drums({ kick: 'x...x.x.', sidestick: '..x...x.', hat: 'oxoxoxox' }, { from: 28, repeat: 5 });
  S.pattern('mallet', 'x.x.X.xx', { from: 38, repeat: 3, pitch: ['E5', 'A4', 'C#5', 'B4'], vel: 52 });
  for (let k = 0; k < 5; k++) S.fx('click', T.filter + (0.9 + k * 0.6) / 1.3, { vel: 40 });
  S.drum('crash', { t: T.move + 4.0, vel: 66 }); S.fx('ding', T.move + 4.05);
  // best 3 trades
  for (let b = 50, i = 0; b < 68; b += 4, i++) { S.chord('keys', prog[(i + 2) % 4], { beat: b, beats: 3.8, vel: 50 }); S.note('bass', roots[(i + 2) % 4], { beat: b, beats: 1.5, vel: 80 }); }
  S.drums({ kick: 'x...x.x.', snare: '....x...', hat: 'xxxxxxxx' }, { from: 50, repeat: 4, vel: 60 });
  S.drums({ kick: 'x...x...', hat: 'xxxx' }, { from: 66, repeat: 1, vel: 56 });
  S.pattern('mallet', 'x.xxx.x.', { from: 50, repeat: 4, pitch: ['A5', 'E5', 'C#5', 'E5'], vel: 50 });
  for (let j = 0; j < 3; j++) { S.fx('whoosh', T.top3 + j * 3 - 0.08, { dur: 0.35 }); S.fx('sparkle', T.top3 + j * 3 + 0.55, { dur: 1.1 }); S.fx('chime', T.top3 + j * 3 + 1.76); }
  // the result
  S.run('mallet', ['A4', 'C#5', 'E5', 'A5', 'C#6', 'E6'], { t: T.result - 0.62, step: 0.1, vel: 54, cresc: 10 });
  S.chord('keys', ['A2', 'E3', 'A3', 'C#4', 'E4'], { beat: 68, beats: 10, vel: 66 }); S.note('bass', 'A1', { beat: 68, beats: 4, vel: 88 });
  S.drum('kick', { beat: 68, vel: 104 }); S.drum('crash', { beat: 68, vel: 64 });
  S.fx('sparkle', T.result + 0.5, { dur: 1.8 }); S.fx('ding', T.result + 3.4);
  // your story could be next
  S.fx('revswell', T.next, { dur: 1.2 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { beat: 78, beats: 12, vel: 62 }); S.note('bass', 'D2', { beat: 78, beats: 8, vel: 84 });
  S.drum('kick', { beat: 78, vel: 96 }); S.note('pad', 'D3', { beat: 78, beats: 12, vel: 44 }); S.note('glk', 'A5', { beat: 80, beats: 4, vel: 42 }); S.note('glk', 'D6', { beat: 81, beats: 4, vel: 38 });
  S.fx('click', T.next + 1.55);
  S.master({ gain: -6, fadeOut: 1.5 });
});
