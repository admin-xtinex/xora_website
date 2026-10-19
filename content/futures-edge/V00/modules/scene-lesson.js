const { seg, eo, eio, lerp, clamp01, TextFx } = kit;
const LESSON_MODES = [
  ['Watch', 'An animated scene with captions you can pause and replay.'],
  ['Read', 'Plain-English notes with examples and common mistakes.'],
  ['Slides', 'Short slides, one idea on each.'],
  ['Try it', 'Hands-on practice with fictional prices.'],
  ['Quiz', 'A few questions, and every answer is explained.'],
];
const LESSON_T0 = 2.8, LESSON_STEP = 3;
kit.scene('lesson', {
  init(kit) {
    let tabs = '', caps = '';
    LESSON_MODES.forEach((m) => {
      tabs += '<span class="lesson-tab" style="padding:12px 24px;border-radius:999px;font-size:26px;font-weight:600">' + m[0] + '</span>';
      caps += '<p class="sub lesson-cap" style="position:absolute;left:0;top:0;width:640px">' + m[1] + '</p>';
    });
    const bar = (x, y, w) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="14" rx="7" style="fill:color-mix(in srgb, var(--second) 22%, transparent)"/>';
    const art = '<svg class="art" viewBox="0 0 860 340">' +
      '<g class="lesson-b"><line x1="430" y1="40" x2="430" y2="270" stroke-width="4" style="stroke:var(--second)"/><rect class="lesson-candle" x="395" width="70" rx="6" style="fill:var(--main)"/>' +
      '<rect x="60" y="300" width="740" height="8" rx="4" style="fill:color-mix(in srgb, var(--second) 18%, transparent)"/><rect class="lesson-prog" x="60" y="300" height="8" rx="4" style="fill:var(--main)"/></g>' +
      '<g class="lesson-b"><text x="60" y="70" style="fill:var(--main);font-size:30px;font-weight:700">Meaning</text>' + bar(60, 110, 700) + bar(60, 145, 640) + bar(60, 180, 720) + bar(60, 215, 420) + '</g>' +
      '<g class="lesson-b"><rect x="110" y="60" width="300" height="190" rx="14" transform="rotate(-6 260 155)" style="fill:color-mix(in srgb, var(--ground) 80%, var(--second))"/><rect x="450" y="60" width="300" height="190" rx="14" transform="rotate(6 600 155)" style="fill:color-mix(in srgb, var(--ground) 80%, var(--second))"/>' +
      '<rect class="lesson-slide" x="250" y="40" width="360" height="230" rx="16" style="fill:color-mix(in srgb, var(--ground) 70%, var(--main));stroke:var(--main);stroke-width:2"/>' + bar(290, 90, 220) + bar(290, 125, 280) + '<circle cx="400" cy="305" r="7" style="fill:var(--main)"/><circle cx="430" cy="305" r="7" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/><circle cx="460" cy="305" r="7" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/></g>' +
      '<g class="lesson-b"><line x1="640" y1="50" x2="640" y2="280" stroke-width="4" style="stroke:var(--second)"/><rect class="lesson-tc" x="605" width="70" rx="6" style="fill:var(--accent)"/>' +
      '<text x="60" y="110" style="fill:var(--second);font-size:26px">Close price</text><rect x="60" y="160" width="440" height="10" rx="5" style="fill:color-mix(in srgb, var(--second) 22%, transparent)"/><circle class="lesson-knob" cy="165" r="20" style="fill:var(--second)"/></g>' +
      '<g class="lesson-b"><text x="60" y="70" style="fill:var(--second);font-size:30px;font-weight:700">Which part shows the close?</text>' +
      '<rect class="lesson-opt" x="60" y="110" width="740" height="58" rx="14"/><text x="90" y="148" style="fill:var(--second);font-size:24px">A  The top of the wick</text>' +
      '<rect class="lesson-opt" x="60" y="184" width="740" height="58" rx="14"/><text x="90" y="222" style="fill:var(--second);font-size:24px">B  One end of the body</text>' +
      '<text class="lesson-ok" x="60" y="296" style="fill:var(--main);font-size:24px;font-weight:700">Correct: the body runs from the open to the close.</text></g></svg>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:250px;width:660px"><p class="kick lesson-k">How a lesson works</p><h2 class="line lesson-t" style="font-size:84px">Five ways into the same idea</h2></div>' +
      '<div class="lesson-caps" style="position:absolute;left:140px;top:620px;width:640px;height:200px">' + caps + '</div>' +
      '<div class="glass lesson-card" style="left:900px;top:170px;width:880px;padding:30px 10px 10px">' +
      '<p class="fict" style="margin:0 20px 8px">Example lesson</p><p style="margin:0 20px 22px;font-size:34px;font-weight:700">Candlesticks: open, high, low, close</p>' +
      '<div style="display:flex;gap:8px;margin:0 20px 10px">' + tabs + '</div>' +
      '<div style="position:relative;height:340px">' + art + '</div></div></div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.lesson-k').style; this.title = q('.lesson-t'); this.card = q('.lesson-card').style;
    this.tabs = all('.lesson-tab').map((e) => e.style); this.caps = all('.lesson-cap').map((e) => e.style);
    this.bodies = all('.lesson-b').map((e) => e.style);
    this.candle = q('.lesson-candle'); this.prog = q('.lesson-prog'); this.slide = q('.lesson-slide').style;
    this.tc = q('.lesson-tc'); this.knob = q('.lesson-knob'); this.opts = all('.lesson-opt'); this.ok = q('.lesson-ok').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idle' }, { t: 0.5, pose: 'present' }, { t: 2.8, pose: 'point', flip: true }, { t: 5.8, pose: 'read' }, { t: 8.8, pose: 'pointer', flip: true }, { t: 11.8, pose: 'laptop' }, { t: 14.8, pose: 'checklist' }, { t: 16.2, pose: 'wink' }],
      says: [{ t0: 0.7, t1: 2.7, text: 'Learn the way that suits you best.' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.title, t, 0.1);
    const c = seg(t, 1.2, 2.1);
    this.card.opacity = eo(c);
    this.card.transform = 'translateX(' + lerp(70, 0, eo(c)) + 'px) translateY(' + (-t * 1.5).toFixed(2) + 'px)';
    const fi = Math.max(0, Math.min(4, Math.floor((t - LESSON_T0) / LESSON_STEP)));
    const on = t >= LESSON_T0 - 0.2;
    LESSON_MODES.forEach((m, i) => {
      const a = LESSON_T0 + i * LESSON_STEP;
      const vis = clamp01(seg(t, a - 0.25, a + 0.15)) * (i === 4 ? 1 : 1 - clamp01(seg(t, a + LESSON_STEP - 0.25, a + LESSON_STEP + 0.15)));
      const v = i === 0 && t < LESSON_T0 ? 1 : vis;
      this.bodies[i].opacity = v;
      this.caps[i].opacity = on ? vis : 0;
      this.caps[i].transform = 'translateY(' + lerp(14, 0, eo(seg(t, a - 0.1, a + 0.4))) + 'px)';
      const act = on && i === fi;
      this.tabs[i].background = act ? 'var(--main)' : 'color-mix(in srgb, var(--second) 8%, transparent)';
      this.tabs[i].color = act ? 'var(--ground)' : 'var(--second)';
    });
    const lw = (t - LESSON_T0) / LESSON_STEP;
    const cw = eio(seg(t, 0.4, LESSON_T0 + 2.4));
    const top = lerp(160, 70, cw), bot = 210;
    this.candle.setAttribute('y', Math.min(top, bot)); this.candle.setAttribute('height', Math.abs(bot - top) + 2);
    this.prog.setAttribute('width', 740 * cw);
    const s = seg(t, LESSON_T0 + LESSON_STEP * 2, LESSON_T0 + LESSON_STEP * 2 + 0.6);
    this.slide.transformOrigin = '430px 155px'; this.slide.transform = 'scale(' + lerp(0.9, 1, eo(s)) + ')';
    const k = 0.5 + 0.5 * Math.sin((t - LESSON_T0 - 9) * 1.9);
    this.knob.setAttribute('cx', 60 + 440 * k);
    const ty = lerp(230, 80, k);
    this.tc.setAttribute('y', Math.min(ty, 150)); this.tc.setAttribute('height', Math.abs(150 - ty) + 2);
    const pick = t > LESSON_T0 + LESSON_STEP * 4 + 1.2;
    this.opts.forEach((o, i) => o.setAttribute('style', i === 1 && pick ? 'fill:color-mix(in srgb, var(--main) 22%, transparent);stroke:var(--main);stroke-width:2' : 'fill:color-mix(in srgb, var(--second) 7%, transparent);stroke:color-mix(in srgb, var(--second) 20%, transparent);stroke-width:2'));
    this.ok.opacity = eo(seg(t, LESSON_T0 + LESSON_STEP * 4 + 1.4, LESSON_T0 + LESSON_STEP * 4 + 1.8));
    this.tutor.render(t);
  },
});
