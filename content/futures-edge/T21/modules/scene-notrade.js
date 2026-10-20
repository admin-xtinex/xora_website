const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// NO_TRADE as an active choice: a cricket ball passes outside off stump and is left alone; a written plan's conditions are not met; NO_TRADE stamp and zero costs.
const NT_COND = [['5-minute close above 60,050', 'Last close 59,970'], ['Next candle holds above 60,000', 'Not yet']];
kit.scene('notrade', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    NT_COND.forEach((c) => {
      rows += '<div class="nt-r" style="display:flex;align-items:center;gap:18px;height:66px;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><svg width="40" height="40" viewBox="0 0 44 44" style="flex:none"><circle cx="22" cy="22" r="19" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--accent) 60%, transparent)"/>' +
        '<path class="nt-x" d="M15 15 L29 29 M29 15 L15 29" pathLength="1" fill="none" stroke-width="4" stroke-linecap="round" style="stroke:var(--accent)"/></svg>' +
        '<span style="font-size:28px;font-weight:600">' + c[0] + '</span><span class="mono nt-s" style="margin-left:auto;font-size:24px;color:var(--accent)">' + c[1] + '</span></div>';
    });
    this.h = UI.head(kit, 'NO_TRADE', 'Not trading is a decision',
      '<div class="glass nt-d" style="left:140px;top:300px;width:820px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:30px"><b>NO_TRADE</b>: you looked, and chose not to open a position.</p></div>' +
      '<div class="glass nt-c" style="left:1000px;top:300px;width:780px;height:176px;padding:20px 30px"><p class="kick" style="margin:0">Like a batter leaving a ball</p>' +
      '<svg width="780" height="140" viewBox="0 0 780 140" style="position:absolute;left:0;top:40px">' +
      '<g style="stroke:var(--second);stroke-width:6;stroke-linecap:round"><line x1="560" x2="560" y1="40" y2="120"/><line x1="576" x2="576" y1="40" y2="120"/><line x1="592" x2="592" y1="40" y2="120"/></g>' +
      '<path class="nt-path" d="M60 70 Q330 40 740 30" pathLength="1" fill="none" stroke-width="3" stroke-dasharray="8 8" style="stroke:color-mix(in srgb, var(--main) 50%, transparent)"/>' +
      '<circle class="nt-ball" r="13" cx="60" cy="70" style="fill:var(--down)"/>' +
      '<text class="nt-left" x="380" y="118" style="fill:var(--main);font-size:26px;font-weight:700">Left alone ✓</text></svg></div>' +
      '<div class="glass nt-p" style="left:140px;top:500px;width:1100px;padding:16px 30px"><p class="kick" style="margin:0 0 2px">My written plan · fictional · consider BUY only if</p>' + rows + '</div>' +
      '<div class="nt-st" style="position:absolute;left:1290px;top:500px;width:490px;display:flex;flex-direction:column;align-items:flex-start;gap:16px">' +
      '<div class="chip mono nt-no" style="font-size:44px;padding:16px 40px;background:var(--main);color:var(--ground);border-color:var(--main)">NO_TRADE</div>' +
      '<p class="mono nt-z" style="margin:0;font-size:28px">Fees: <span class="nt-f">0.00</span> USDT</p><p class="mono nt-z" style="margin:0;font-size:28px">New risk: <span class="nt-k">0.00</span> USDT</p></div>');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.d = q('.nt-d').style; this.c = q('.nt-c').style; this.p = q('.nt-p').style; this.ball = q('.nt-ball'); this.path = q('.nt-path'); this.left = q('.nt-left').style;
    this.rows = all('.nt-r').map((e) => e.style); this.xs = all('.nt-x'); this.ss = all('.nt-s').map((e) => e.style);
    this.no = q('.nt-no').style; this.zs = all('.nt-z').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 7.0, pose: 'idea' }, { t: 13.6, pose: 'writing' }, { t: 20.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.d, t, 0.6, 0.7);
    UI.rise(kit, this.c, t, 7.0, 0.7);
    // The ball travels along its path, wide of the stumps; the batter leaves it.
    const bp = seg(t, 8.0, 10.2), u = bp, x = (1 - u) * (1 - u) * 60 + 2 * (1 - u) * u * 330 + u * u * 740, y = (1 - u) * (1 - u) * 70 + 2 * (1 - u) * u * 40 + u * u * 30;
    this.ball.setAttribute('cx', x.toFixed(1)); this.ball.setAttribute('cy', y.toFixed(1)); this.ball.style.opacity = eo(seg(t, 7.6, 8.0));
    this.path.setAttribute('stroke-dasharray', '8 8'); this.path.style.opacity = eo(seg(t, 8.0, 10.2)) * 0.9;
    this.left.opacity = eo(seg(t, 10.2, 10.7));
    UI.rise(kit, this.p, t, 13.6, 0.7);
    this.rows.forEach((s, i) => {
      const a = 14.6 + i * 2.2; s.opacity = eo(seg(t, a, a + 0.4));
      this.xs[i].setAttribute('stroke-dasharray', eo(seg(t, a + 1.0, a + 1.4)).toFixed(3) + ' 1'); this.ss[i].opacity = eo(seg(t, a + 1.0, a + 1.4));
    });
    const n = seg(t, 20.8, 21.4);
    this.no.opacity = eo(n); this.no.transform = 'scale(' + lerp(1.6, 1, eob(n, 1.4)).toFixed(3) + ') rotate(' + lerp(-8, -3, eo(n)).toFixed(2) + 'deg)';
    this.zs.forEach((s, i) => UI.rise(kit, s, t, 22.0 + i * 0.6, 0.5, 12));
    this.tutor.render(t);
  },
});
