const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// A READY setup travels through safety gates. First run: all pass. Second run: the spread gate closes: No trade.
const GT = [['Direction', 'conflicting?'], ['Fresh data', 'stale?'], ['Spread', 'too wide?'], ['Liquidity', 'too thin?'], ['Stop distance', 'too tight / wide?'], ['Room to level', 'too little?'], ['Plan valid', 'expired?']];
const GT_X = (i) => 300 + i * 210, GT_Y = 540;
const GT_HL = [[6.4, 2], [7.6, 3], [8.8, 1], [10.0, 6], [12.8, 4], [14.6, 5], [16.2, 0]]; // when each gate's question is read out
kit.scene('gates', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let g = '';
    GT.forEach((x, i) => {
      g += '<g class="gt-g" transform="translate(' + GT_X(i) + ' ' + GT_Y + ')">' +
        '<text y="-104" text-anchor="middle" style="fill:var(--second);font-size:25px;font-weight:600">' + x[0] + '</text>' +
        '<rect class="gt-post" x="-9" y="-80" width="18" height="160" rx="9" style="fill:color-mix(in srgb, var(--second) 30%, var(--ground))"/>' +
        '<circle class="gt-m" cy="-80" r="20" style="fill:var(--ground);stroke-width:3;stroke:color-mix(in srgb, var(--second) 30%, transparent)"/>' +
        '<text class="gt-mt mono" y="-71" text-anchor="middle" style="font-size:24px;font-weight:700"></text>' +
        '<text class="gt-q" y="118" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 65%, var(--ground));font-size:23px">' + x[1] + '</text></g>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1400px"><p class="kick gt-k">Safety checks</p>' +
      '<h2 class="line gt-t">READY is not enough</h2></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><line x1="150" x2="1700" y1="' + GT_Y + '" y2="' + GT_Y + '" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round" style="stroke:color-mix(in srgb, var(--second) 25%, transparent)"/>' + g +
      '<g class="gt-tok"><rect x="-92" y="-30" width="184" height="60" rx="30" style="fill:color-mix(in srgb, var(--up) 22%, var(--ground));stroke:var(--up);stroke-width:2.5"/>' +
      '<text y="9" text-anchor="middle" class="mono" style="fill:var(--up);font-size:23px;font-weight:600">BUY · READY</text></g></svg>' +
      '<div class="glass gt-ok" style="left:140px;top:720px;width:660px;padding:18px 30px;border-color:var(--up)"><p style="margin:0;font-size:30px;font-weight:700;color:var(--up)">All safety checks pass → trade allowed</p></div>' +
      '<div class="glass gt-no" style="left:140px;top:720px;width:660px;padding:18px 30px;border-color:var(--down)"><p style="margin:0;font-size:30px;font-weight:700;color:var(--down)">No trade · spread too wide</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.gt-k').style; this.t = q('.gt-t');
    this.gs = all('.gt-g').map((e) => e.style); this.posts = all('.gt-post'); this.ms = all('.gt-m'); this.mt = all('.gt-mt'); this.qs = all('.gt-q');
    this.tok = q('.gt-tok'); this.ok = q('.gt-ok').style; this.no = q('.gt-no').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'checklist' }, { t: 6.4, pose: 'magnify' }, { t: 12.8, pose: 'think' }, { t: 19.4, pose: 'confused' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.gs.forEach((s, i) => { const p = seg(t, 0.6 + i * 0.15, 1.1 + i * 0.15); s.opacity = eo(p); });
    // token position: run 1 (2.0–5.6) passes everything; run 2 (18.8–) stops at the spread gate
    let x, run;
    if (t < 19.4) { run = 1; x = lerp(150, 1720, eio(seg(t, 2.0, 5.6))); }
    else { run = 2; x = lerp(150, GT_X(2) - 95, eo(seg(t, 19.4, 20.6))); }
    const shake = run === 2 ? Math.sin((t - 20.6) * 40) * 6 * (1 - clamp01((t - 20.6) / 0.6)) * (t > 20.6 ? 1 : 0) : 0;
    this.tok.setAttribute('transform', 'translate(' + (x + shake).toFixed(1) + ' ' + GT_Y + ')');
    this.tok.style.opacity = run === 1 ? eo(seg(t, 1.8, 2.2)) * (1 - ei(seg(t, 5.6, 6.0))) : eo(seg(t, 19.4, 19.7));
    GT.forEach((g, i) => {
      let state = 0; // 0 idle, 1 pass, -1 fail
      if (run === 1 && x > GT_X(i) && t < 6.2) state = 1;
      if (run === 2) { if (i < 2 && x > GT_X(i)) state = 1; if (i === 2 && t > 20.5) state = -1; }
      const col = state === 1 ? 'var(--up)' : state === -1 ? 'var(--down)' : null;
      this.ms[i].style.stroke = col || 'color-mix(in srgb, var(--second) 30%, transparent)';
      this.ms[i].style.fill = col ? 'color-mix(in srgb, ' + col + ' 25%, var(--ground))' : 'var(--ground)';
      this.posts[i].style.fill = state === -1 ? 'var(--down)' : 'color-mix(in srgb, var(--second) 30%, var(--ground))';
      UI.set(this.mt[i], state === 1 ? '✓' : state === -1 ? '✗' : '');
      this.mt[i].style.fill = col || 'var(--second)';
      // question highlight while it is read out
      const h = GT_HL.find((z) => z[1] === i), hp = h ? Math.max(0, Math.sin(Math.PI * seg(t, h[0], h[0] + 2.4))) : 0;
      this.qs[i].style.fill = hp > 0.05 ? 'var(--warn)' : 'color-mix(in srgb, var(--second) 65%, var(--ground))';
      this.qs[i].setAttribute('transform', 'scale(' + (1 + 0.12 * hp).toFixed(3) + ')');
    });
    const o = seg(t, 5.2, 5.7);
    this.ok.opacity = eo(o) * (1 - ei(seg(t, 9.0, 9.5)));
    const n = seg(t, 20.6, 21.1);
    this.no.opacity = eo(n); this.no.transform = 'scale(' + lerp(0.9, 1, eob(n, 1.6)).toFixed(3) + ')'; this.no.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
