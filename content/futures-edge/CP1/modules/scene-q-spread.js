const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const Q7_ROWS = [[60030, 0.42, 1], [60020, 0.18, 1], [60010, 0.25, 1], [59990, 0.31, 0], [59980, 0.50, 0], [59970, 0.12, 0]];
kit.scene('q-spread', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    Q7_ROWS.forEach((r, i) => {
      const y = 62 + i * 40 + (r[2] ? 0 : 34), col = r[2] ? 'var(--accent)' : 'var(--main)';
      rows += '<div class="q7-r" style="position:absolute;left:20px;top:' + y + 'px;width:330px;height:36px">' +
        '<span class="q7-bar" style="position:absolute;right:0;top:3px;height:30px;border-radius:6px;background:color-mix(in srgb, ' + col + ' 18%, transparent)"></span>' +
        '<span class="mono" style="position:absolute;left:10px;top:2px;font-size:24px;color:' + col + '">' + UI.fmt(r[0]) + '</span>' +
        '<span class="mono q7-a" style="position:absolute;right:10px;top:2px;font-size:24px"></span></div>';
    });
    const vis = '<p class="kick" style="position:absolute;left:30px;top:22px;margin:0">Order book · USDT</p>' + rows +
      '<p style="position:absolute;left:376px;top:66px;margin:0;font-size:24px;font-weight:700;color:var(--accent)">Asks<br><span style="font-weight:500;font-size:22px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">sellers</span></p>' +
      '<p style="position:absolute;left:376px;top:244px;margin:0;font-size:24px;font-weight:700;color:var(--main)">Bids<br><span style="font-weight:500;font-size:22px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">buyers</span></p>' +
      '<svg width="560" height="350" viewBox="0 0 560 350" style="position:absolute;left:0;top:0;overflow:visible"><path class="q7-br" d="M360 160 H372 V228 H360" pathLength="1" fill="none" stroke-width="3" style="stroke:var(--second)"/></svg>' +
      '<p class="q7-sp" style="position:absolute;left:384px;top:176px;margin:0;font-size:24px;font-weight:700">Spread <span class="mono" style="color:var(--main)">20</span></p>';
    this.quiz = UI.quiz(kit, {
      n: 7, from: 'T04', q: 'Best bid 59,990. Best ask 60,010. What is the spread?',
      opts: ['0 USDT. They always match', '20 USDT', '59,990 USDT', '120,000 USDT'],
      ok: 1, bad: 2, vis,
      why: 'Best ask − best bid: 60,010 − 59,990 = 20 USDT.',
      whyNot: '59,990 is the bid itself: the best price a buyer offers.',
    });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.rows = all('.q7-r').map((e) => e.style); this.bars = all('.q7-bar').map((e) => e.style); this.amts = all('.q7-a');
    this.br = kit.stage.querySelector('.q7-br'); this.sp = kit.stage.querySelector('.q7-sp').style;
  },
  render(t) {
    this.chrome(t);
    const step = Math.floor(t * 1.5);
    this.rows.forEach((s, i) => {
      const a = 1.6 + (i < 3 ? 2 - i : i) * 0.2, p = seg(t, a, a + 0.4);
      s.opacity = eo(p); s.transform = 'translateX(' + lerp(20, 0, eo(p)).toFixed(1) + 'px)';
      const r = kit.rng(step * 7 + i + 1), amt = Math.max(0.05, Q7_ROWS[i][1] + (r() - 0.5) * 0.08);
      const txt = amt.toFixed(2);
      if (this.amts[i].textContent !== txt) this.amts[i].textContent = txt;
      this.bars[i].width = (amt / 0.6 * 300).toFixed(0) + 'px';
      const hot = (i === 2 || i === 3) && t > 7.7;
      s.outline = hot ? '2px solid ' + (i === 2 ? 'var(--accent)' : 'var(--main)') : 'none'; s.borderRadius = '8px';
    });
    const b = seg(t, 7.9, 8.5);
    this.br.setAttribute('stroke-dasharray', eo(b).toFixed(3) + ' 1'); this.br.style.opacity = b > 0 ? 1 : 0;
    this.sp.opacity = eo(seg(t, 8.3, 8.8));
    this.quiz(t);
  },
});
