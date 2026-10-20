const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Coin data flows into a list of yes / no checks; each one ticks or crosses; the techniques the filters draw on.
const CK_ROWS = [['Trend agrees?', 1], ['At support or resistance?', 1], ['Volume confirms?', 0], ['Buyers or sellers pushing?', 1], ['Higher timeframe agrees?', 1]];
const CK_TECH = ['Trend', 'Support / resistance', 'Candle reaction', 'Breakout / retest', 'Volume', 'Buyer / seller pressure', 'Order book', 'Momentum (RSI)', 'EMA', 'Higher timeframes'];
kit.scene('checks', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    CK_ROWS.forEach((r) => {
      rows += '<div class="ck-r" style="display:flex;align-items:center;gap:18px;padding:14px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)">' +
        '<span class="ck-m mono" style="width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:28px;font-weight:700;flex:none;border:2px solid color-mix(in srgb, var(--second) 30%, transparent)"></span>' +
        '<span style="font-size:28px;font-weight:600">' + r[0] + '</span></div>';
    });
    let chips = '';
    CK_TECH.forEach((c) => { chips += '<span class="chip ck-ch" style="font-size:30px;padding:14px 26px">' + c + '</span>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ck-flow"></g></svg>' +
      '<div class="words" style="left:140px;top:200px;width:740px"><p class="kick ck-k">Rules, not guesses</p>' +
      '<h2 class="line ck-t">Checks decide</h2>' +
      '<p class="def ck-d">A <b>check</b> is a yes-or-no test written as a rule in code: is this true right now?</p>' +
      '<p class="sub ck-a" style="font-size:30px">Like a pilot\'s checklist before take-off.</p></div>' +
      '<div class="glass ck-in" style="left:930px;top:300px;width:190px;padding:20px 18px;text-align:center"><p class="kick" style="margin:0 0 12px;font-size:20px">Coin data</p>' +
      '<svg width="120" height="110" viewBox="0 0 120 110"><g style="stroke:var(--up);stroke-width:3"><line x1="20" y1="20" x2="20" y2="90"/><line x1="60" y1="10" x2="60" y2="70"/><line x1="100" y1="30" x2="100" y2="100"/></g>' +
      '<rect x="10" y="35" width="20" height="40" rx="3" style="fill:var(--up)"/><rect x="50" y="20" width="20" height="35" rx="3" style="fill:var(--up)"/><rect x="90" y="45" width="20" height="40" rx="3" style="fill:var(--down)"/></svg>' +
      '<p class="lbl" style="margin:8px 0 0">candles · volume · order book</p></div>' +
      '<div class="glass ck-g" style="left:1180px;top:200px;width:600px;padding:22px 32px"><p class="kick" style="margin:0 0 6px">Checklist · this candle</p>' + rows +
      '<p class="ck-res" style="margin:16px 0 0;font-size:28px;font-weight:700;color:var(--main)">Result: a setup and its score</p></div>' +
      '<div class="ck-tech" style="position:absolute;left:1000px;top:230px;width:780px;display:flex;flex-wrap:wrap;gap:18px"><span class="kick ck-tk" style="width:100%;margin-bottom:6px">Techniques the filters draw on</span>' + chips + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ck-k').style; this.t = q('.ck-t'); this.d = q('.ck-d'); this.a = q('.ck-a');
    this.inb = q('.ck-in').style; this.g = q('.ck-g').style; this.res = q('.ck-res').style; this.tk = q('.ck-tk').style;
    this.rows = all('.ck-r').map((e) => e.style); this.ms = all('.ck-m'); this.chips = all('.ck-ch').map((e) => e.style);
    // little data dots that travel from the data box into the checklist
    const flow = q('.ck-flow'); this.dots = [];
    for (let i = 0; i < 7; i++) { const c = kit.h('<svg><circle r="7" style="fill:var(--main)"/></svg>').firstChild; flow.append(c); this.dots.push(c); }
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 1.0, pose: 'checklist' }, { t: 6.2, pose: 'idea' }, { t: 12.0, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.05 });
    TextFx.fadeFromRight(this.a, t, 6.4, { stagger: 0.07 });
    UI.rise(kit, this.inb, t, 1.4, 0.6, 24, 11.6, 12.0);
    UI.rise(kit, this.g, t, 1.8, 0.6, 24, 11.6, 12.0);
    this.dots.forEach((c, i) => {
      const ph = ((t - 2.2) * 0.9 + i / 7) % 1;
      const on = t > 2.2 && t < 11.5;
      const x = lerp(1120, 1190, ph), y = 400 + Math.sin(ph * Math.PI) * -30 + (i % 3 - 1) * 14;
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1));
      c.style.opacity = on ? Math.sin(ph * Math.PI).toFixed(3) : 0;
    });
    CK_ROWS.forEach((r, i) => {
      const a = 3.0 + i * 1.2, p = seg(t, a, a + 0.4);
      const m = this.ms[i];
      UI.set(m, p > 0 ? (r[1] ? '✓' : '✗') : '');
      const col = r[1] ? 'var(--up)' : 'var(--down)';
      m.style.borderColor = p > 0 ? col : 'color-mix(in srgb, var(--second) 30%, transparent)';
      m.style.color = col;
      m.style.background = p > 0 ? 'color-mix(in srgb, ' + col + ' 18%, transparent)' : 'transparent';
      m.style.transform = 'scale(' + lerp(0.6, 1, eob(p, 1.8)).toFixed(3) + ')';
      this.rows[i].opacity = (0.55 + 0.45 * eo(p)).toFixed(3);
    });
    UI.rise(kit, this.res, t, 9.2, 0.5, 12, 11.6, 12.0);
    this.tk.opacity = eo(seg(t, 12.0, 12.5));
    this.chips.forEach((s, i) => {
      const a = 12.4 + i * 0.32, p = seg(t, a, a + 0.5);
      s.opacity = eo(p); s.transform = 'translateY(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)';
    });
    this.tutor.render(t);
  },
});
