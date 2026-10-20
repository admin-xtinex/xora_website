const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Three choices, a written reason, then DEMO BUY with stop and target set together.
const DC_B = [['DEMO BUY', 'var(--up)'], ['DEMO SELL', 'var(--down)'], ['NO_TRADE', 'var(--main)']];
const DC_WHY = '5m trend up. Bounce at support. Stop 59,700, target 60,600. Planned loss ≈ 6 USDT, inside my budget.';
kit.scene('decide', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Step 6 of 8 · Decide', 'Choose, and say why');
    this.track = UI.track(kit, 6);
    this.c1 = UI.chart1(kit, 'dc');
    const D = UI.D, Y = D.y1, x0 = D.x1(14) + 14;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="dc-l">' + UI.hline(60000, 'color-mix(in srgb, var(--second) 60%, transparent)') + UI.hline(59700, 'var(--accent)', '12 8') + UI.hline(60600, 'var(--main)', '12 8') + '</g>' +
      '<g class="dc-pin"><circle cx="' + x0 + '" cy="' + Y(60000).toFixed(1) + '" r="13" style="fill:var(--up)"/><circle class="dc-ring" cx="' + x0 + '" cy="' + Y(60000).toFixed(1) + '" r="13" fill="none" stroke-width="3" style="stroke:var(--up)"/></g></svg>');
    kit.stage.append(svg);
    let btns = '';
    DC_B.forEach((b) => { btns += '<div class="dc-b mono" style="flex:1;height:64px;border-radius:16px;display:grid;place-items:center;font-size:25px;border:2px solid ' + b[1] + ';color:' + b[1] + '">' + b[0] + '</div>'; });
    kit.stage.append(kit.h('<div><div class="glass dc-p" style="left:1180px;top:286px;width:600px;padding:20px 28px;display:flex;flex-direction:column;gap:14px">' +
      '<p class="kick" style="margin:0">Your decision · demo</p><div style="display:flex;gap:12px">' + btns + '</div>' +
      '<p class="dc-n" style="margin:0;font-size:24px;color:var(--main)">NO_TRADE is always allowed.</p>' +
      '<p class="kick dc-wl" style="margin:6px 0 0;color:var(--accent)">Why · required</p>' +
      '<div class="dc-f" style="min-height:170px;box-sizing:border-box;padding:14px 18px;border-radius:16px;border:1.5px dashed color-mix(in srgb, var(--second) 30%, transparent)"><span class="dc-x" style="font-size:28px;line-height:1.38;font-weight:600"></span><span class="dc-cur" style="display:inline-block;width:3px;height:30px;margin-left:2px;vertical-align:-4px;background:var(--main)"></span></div></div>' +
      '<div class="glass dc-t" style="left:735px;top:300px;width:292px;padding:16px 20px;border-color:var(--up)"><p class="mono" style="margin:0;font-size:28px;color:var(--up)">DEMO BUY</p>' +
      '<p class="mono" style="margin:6px 0 0;font-size:23px;line-height:1.45">1,000 USDT · 1x<br>Stop 59,700<br>Target 60,600</p><p class="fict" style="margin:8px 0 0">Simulated · no real order</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.l = svg.querySelector('.dc-l').style; this.pin = svg.querySelector('.dc-pin').style; this.ring = svg.querySelector('.dc-ring');
    this.p = q('.dc-p').style; this.bs = [...kit.stage.querySelectorAll('.dc-b')].map((e) => e.style); this.n = q('.dc-n').style;
    this.wl = q('.dc-wl').style; this.f = q('.dc-f').style; this.x = q('.dc-x'); this.cur = q('.dc-cur').style; this.tk = q('.dc-t').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'think' }, { t: 6.4, pose: 'writing' }, { t: 13.0, pose: 'typing' }, { t: 19.9, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t); this.track(t);
    this.c1.render(t);
    this.l.opacity = eo(seg(t, 0.4, 1.0)) * 0.8;
    UI.rise(kit, this.p, t, 0.8, 0.6, 24);
    this.bs.forEach((s, i) => {
      const a = 1.4 + i * 0.6, hl = Math.sin(Math.PI * seg(t, a, a + 0.8));
      const pick = i === 0 ? eo(seg(t, 20.4, 20.8)) : 0, press = i === 0 ? Math.sin(Math.PI * seg(t, 20.2, 20.6)) : 0;
      s.background = 'color-mix(in srgb, ' + DC_B[i][1] + ' ' + (10 + 25 * hl + 80 * pick).toFixed(0) + '%, var(--ground))';
      s.color = pick > 0.5 ? 'var(--ground)' : DC_B[i][1];
      s.transform = 'scale(' + (1 + 0.05 * hl - 0.06 * press).toFixed(4) + ')';
      s.opacity = i === 0 ? 1 : lerp(1, 0.5, eo(seg(t, 20.4, 21.0)));
    });
    this.n.opacity = eo(seg(t, 3.4, 3.9));
    this.wl.opacity = eo(seg(t, 6.6, 7.0)); this.f.opacity = eo(seg(t, 6.6, 7.0));
    const done = UI.type(this.x, DC_WHY, t, 13.3, 22);
    this.cur.opacity = t > 6.6 && (!done || Math.floor(t * 2) % 2 === 0) && t < 20.4 ? 1 : 0;
    this.f.borderColor = done ? 'var(--main)' : 'color-mix(in srgb, var(--second) 30%, transparent)';
    const tp = seg(t, 20.8, 21.4);
    this.tk.opacity = eo(tp); this.tk.transform = 'translateY(' + lerp(20, 0, eo(tp)).toFixed(1) + 'px) scale(' + lerp(0.9, 1, eob(tp, 1.6)).toFixed(3) + ')';
    this.pin.opacity = eo(seg(t, 20.4, 20.8));
    const w = ((t - 20.8) % 1.6 + 1.6) % 1.6 / 1.6;
    this.ring.setAttribute('r', (13 + 22 * w).toFixed(1)); this.ring.style.opacity = t > 20.8 ? 1 - w : 0;
    this.tutor.render(t);
  },
});
