const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const IN_FIELDS = [['Side', 'BUY', 7.6], ['Amount', '0.01 BTC', 8.8], ['Order type', '?', 10.0], ['Price', '?', 10.6]];
const IN_TYPES = ['Market', 'Limit', 'Stop'];
kit.scene('intent', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let fields = '';
    IN_FIELDS.forEach((f, i) => {
      fields += '<div class="in-f" style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-radius:16px;background:color-mix(in srgb, var(--second) 5%, transparent)">' +
        '<span style="font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + f[0] + '</span>' +
        '<span class="mono in-v" style="font-size:32px;' + (i === 0 ? 'color:var(--main);font-weight:600' : '') + '"></span></div>';
    });
    let chips = '';
    IN_TYPES.forEach((s) => { chips += '<span class="chip in-c" style="font-size:30px;padding:14px 28px">' + s + '</span>'; });
    const pts = UI.walk(kit, 7, 40, 1110, 1590, 520, 430, 60);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick in-k">Placing an order</p>' +
      '<h2 class="line in-t">An order is an instruction</h2></div>' +
      '<div class="glass in-def" style="left:140px;top:500px;width:820px;padding:30px 38px"><p class="def" style="margin:0">An <b>order</b> is an instruction you give an exchange: <b>buy or sell</b>, <b>how much</b>, and <b>on what terms</b>.</p></div>' +
      '<div class="glass in-ch" style="left:1060px;top:210px;width:580px;height:470px;padding:26px 30px"><p class="fict" style="margin:0">Fictional BTC price</p>' +
      '<svg width="580" height="420" viewBox="1060 230 580 420" style="position:absolute;left:0;top:30px;overflow:visible"><path class="in-line" d="' + UI.d(pts) + '" pathLength="1" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<circle class="in-dot" cx="' + pts[22][0].toFixed(1) + '" cy="' + pts[22][1].toFixed(1) + '" r="14" style="fill:var(--accent)"/>' +
      '<text class="in-q" x="' + pts[22][0].toFixed(1) + '" y="' + (pts[22][1] - 44).toFixed(1) + '" text-anchor="middle" style="fill:var(--second);font-size:30px;font-weight:700">Entry: but how?</text></svg></div>' +
      '<div class="glass in-tk" style="left:1060px;top:210px;width:580px;padding:28px 30px;display:flex;flex-direction:column;gap:12px"><p class="fict" style="margin:0 0 6px">Order ticket · educational mock</p>' + fields + '</div>' +
      '<div class="in-cs" style="position:absolute;left:1060px;top:660px;width:580px;display:flex;justify-content:space-between">' + chips + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.in-k').style; this.t = q('.in-t'); this.def = q('.in-def').style;
    this.ch = q('.in-ch').style; this.line = q('.in-line'); this.dot = q('.in-dot').style; this.q = q('.in-q').style;
    this.tk = q('.in-tk').style; this.fs = all('.in-f').map((e) => e.style); this.vs = all('.in-v');
    this.cs = all('.in-c').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'think' }, { t: 6.8, pose: 'explain' }, { t: 13.9, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const out = ei(seg(t, 6.2, 6.7));
    this.ch.opacity = eo(seg(t, 0.5, 1.1)) * (1 - out);
    this.line.setAttribute('stroke-dasharray', eio(seg(t, 0.8, 3.0)) + ' 1');
    const dp = seg(t, 3.0, 3.5);
    this.dot.opacity = eo(dp); this.dot.transformBox = 'fill-box'; this.dot.transformOrigin = 'center';
    this.dot.transform = 'scale(' + (lerp(0.4, 1, eob(dp, 1.8)) * (1 + 0.15 * Math.sin(Math.max(0, t - 3.5) * 5))) + ')';
    this.q.opacity = eo(seg(t, 3.4, 3.9));
    UI.rise(this.tk, t, 6.7);
    UI.rise(this.def, t, 7.0);
    this.fs.forEach((s, i) => {
      const a = IN_FIELDS[i][2], p = seg(t, a, a + 0.4);
      const unknown = IN_FIELDS[i][1] === '?';
      let v = IN_FIELDS[i][1];
      if (!unknown) v = v.slice(0, Math.round(v.length * eo(p)));
      if (i === 2 && t > 15.0) v = IN_TYPES[Math.floor((t - 15.0) / 1.2) % 3];
      UI.txt(this.vs[i], t < a ? '' : v);
      const blink = unknown && !(i === 2 && t > 15.0) ? 0.55 + 0.45 * Math.cos((t - a) * 5) : 1;
      this.vs[i].style.color = unknown ? 'var(--accent)' : (i === 0 ? 'var(--main)' : 'var(--second)');
      this.vs[i].style.opacity = eo(p) * blink;
      s.outline = unknown && t > a ? '2px dashed color-mix(in srgb, var(--accent) 55%, transparent)' : 'none';
    });
    if (t > 15.0) this.vs[2].style.color = 'var(--main)';
    this.cs.forEach((s, i) => {
      UI.rise(s, t, 13.9 + i * 0.35);
      const on = t > 15.0 && Math.floor((t - 15.0) / 1.2) % 3 === i;
      s.borderColor = on ? 'var(--main)' : '';
      s.background = on ? 'color-mix(in srgb, var(--ground) 70%, var(--main))' : '';
    });
    this.tutor.render(t);
  },
});
