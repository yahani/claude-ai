kit.score(function (S, T) {
  S.tempo(60, { t0: 0 });
  S.program('pad', 'pad', { rev: 0.8, gain: -2 });
  S.program('keys', 'ep', { rev: 0.6, pan: -0.1 });
  S.program('vib', 'vibes', { rev: 0.7, pan: 0.2 });
  S.program('glock', 'glock', { rev: 0.8, pan: 0.3, gain: -4 });
  S.program('bass', 'bass', { gain: -4 });
  // sinking: a cold minor pad, falling vibes, escaping air
  S.chord('pad', ['D3', 'F3', 'A3'], { t: T.sink, dur: 5.2, vel: 34 });
  ['A4', 'F4', 'D4', 'C4', 'A3'].forEach(function (n, i) { S.note('vib', n, { t: T.sink + 0.2 + i * 0.95, dur: 1.4, vel: 40 - i * 3 }); });
  for (var i = 0; i < 10; i++) S.fx('pop', T.sink + 0.1 + i * 0.4, { vel: 18 });
  // the crimson dive
  S.chord('pad', ['A#2', 'F3', 'D4'], { t: T.dive, dur: 5.2, vel: 40 });
  S.fx('whoosh', T.dive + 0.3, { dur: 1.4, vel: 70 });
  S.fx('sparkle', T.dive + 0.7, { vel: 40 });
  S.run('glock', ['A6', 'F6', 'D6', 'C6', 'A5', 'F5'], { t: T.dive + 0.8, step: 0.18, vel: 36 });
  S.fx('thud', T.dive + 3.2, { vel: 55 });
  S.note('bass', 'D2', { t: T.dive + 3.2, dur: 1.8, vel: 70 });
  // held close: eyes open, a heartbeat
  S.chord('pad', ['G2', 'D3', 'A#3'], { t: T.catch, dur: 5.2, vel: 44 });
  S.note('glock', 'D6', { t: T.catch + 0.75, dur: 1, vel: 52 });
  for (i = 0; i < 9; i++) S.fx('pop', T.catch + 0.75 + i * 0.05, { vel: 16 });
  [1.3, 2.6, 3.9].forEach(function (b) { S.drum('kick', { t: T.catch + b, vel: 46 }); S.drum('kick', { t: T.catch + b + 0.32, vel: 30 }); });
  S.chord('keys', ['G3', 'A#3', 'D4', 'F4'], { t: T.catch + 1.2, dur: 3.6, vel: 40 });
  // the transfer: a swell into the kiss, light blooms in D major
  S.fx('revswell', T.kiss + 1.95, { dur: 1.6, vel: 60 });
  S.chord('pad', ['A2', 'E3', 'G3'], { t: T.kiss, dur: 2.0, vel: 40 });
  S.fx('chime', T.kiss + 2.0, { vel: 60 });
  S.chord('pad', ['D3', 'F#3', 'A3', 'D4'], { t: T.kiss + 2.0, dur: 5.2, vel: 66 });
  S.chord('keys', ['D3', 'A3', 'D4', 'F#4', 'A4'], { t: T.kiss + 2.0, dur: 3.5, vel: 58, spread: 0.06 });
  S.note('bass', 'D2', { t: T.kiss + 2.0, dur: 4.5, vel: 72 });
  for (i = 0; i < 4; i++) S.note('glock', ['A5', 'D6', 'F#6', 'E6'][i], { t: T.kiss + 2.0 + i * 1.3, dur: 1.2, vel: 44 });
  S.pattern('vib', 'x.x.x.x.', { from: T.kiss + 2.5, step: 0.5, repeat: 2, pitch: ['D5', 'F#5', 'A5', 'E5'], vel: 34 });
  // rising spiral
  S.chord('pad', ['G2', 'D3', 'B3', 'D4'], { t: T.spiral, dur: 3, vel: 60 });
  S.chord('pad', ['A2', 'E3', 'C#4', 'E4'], { t: T.spiral + 3, dur: 2.2, vel: 62 });
  S.note('bass', 'G2', { t: T.spiral, dur: 3, vel: 66 }); S.note('bass', 'A2', { t: T.spiral + 3, dur: 2, vel: 66 });
  S.run('glock', ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6', 'E6', 'F#6', 'A6', 'B6', 'D7'], { t: T.spiral + 0.2, step: 0.42, vel: 34, cresc: 3 });
  S.fx('whoosh', T.spiral + 0.4, { dur: 2.5, vel: 40 });
  S.fx('sparkle', T.spiral + 2.5, { vel: 36 });
  // resolve, black, one butterfly
  S.chord('pad', ['D3', 'F#3', 'A3', 'D4'], { t: T.fade, dur: 3.2, vel: 52 });
  S.chord('keys', ['D4', 'F#4', 'A4'], { t: T.fade, dur: 2.5, vel: 40 });
  S.fx('sparkle', T.fade + 1.55, { vel: 30 });
  S.note('glock', 'A5', { t: T.fade + 1.6, dur: 1.2, vel: 38 });
  S.note('glock', 'D6', { t: T.fade + 2.3, dur: 1.4, vel: 34 });
  S.master({ gain: -6, fadeOut: 1.4 });
});
