const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Twenty fictional round trips, about 6 USDT in fees each (0.10% of 6,000): the fee tank fills to about 120 USDT.
const FQ_W = 'WLWLLWWLWLLWLWWLLWLW', FQ_A = 9.6, FQ_S = 0.2, FQ_TOP = 340, FQ_H = 400;
kit.scene('frequency', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let tiles = '';
    for (let i = 0; i < 20; i++) {
      tiles += '<div class="glass fq-t" style="left:' + (140 + (i % 5) * 152) + 'px;top:' + (440 + Math.floor(i / 5) * 76) + 'px;width:140px;height:64px;border-radius:14px;display:flex;align-items:center;justify-content:space-between;padding:0 16px"><span class="mono" style="font-size:22px;color:color-mix(in srgb, var(--second) 60%, var(--ground))">#' + (i + 1) + '</span><span class="mono dn" style="font-size:24px">−6</span></div>';
    }
    kit.stage.append(kit.h('<div class="ground">' + tiles +
      '<p class="def fq-d" style="position:absolute;left:140px;top:310px;width:780px;margin:0"><b>Trade frequency</b> is how many trades you make in a period, like a day.</p>' +
      '<div class="glass" style="left:1060px;top:' + (FQ_TOP - 10) + 'px;width:180px;height:' + (FQ_H + 20) + 'px;border-radius:20px"></div>' +
      '<div class="fq-fill" style="position:absolute;left:1070px;width:160px;bottom:' + (1080 - FQ_TOP - FQ_H) + 'px;border-radius:12px;background:linear-gradient(0deg, color-mix(in srgb, var(--down) 70%, transparent), color-mix(in srgb, var(--down) 35%, transparent))"></div>' +
      '<p class="mono fq-n" style="position:absolute;left:1060px;width:180px;text-align:center;margin:0;font-size:32px;font-weight:600"></p>' +
      '<p class="kick" style="position:absolute;left:1060px;top:' + (FQ_TOP + FQ_H + 20) + 'px;margin:0;font-size:20px">Fees paid</p>' +
      '<p class="chip fq-c1" style="position:absolute;left:1290px;top:360px;margin:0;font-size:28px;padding:14px 24px"><span class="dot"></span>1 round trip ≈ 6 USDT</p>' +
      '<p class="mono fq-c1b" style="position:absolute;left:1300px;top:430px;margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">3.00 + 3.01 = 6.01, from the last scene</p>' +
      '<p class="mono fq-c2" style="position:absolute;left:1300px;top:500px;margin:0;font-size:34px">20 × 6 ≈ <span class="dn">120 USDT</span></p>' +
      '<p class="chip fq-c3" style="position:absolute;left:1290px;top:570px;margin:0;font-size:28px;padding:14px 24px;border-color:var(--down)"><span class="dot" style="background:var(--down)"></span>20 chances to be wrong</p>' +
      '<p class="chip fq-c4" style="position:absolute;left:1290px;top:660px;margin:0;font-size:28px;padding:14px 24px;background:var(--main);color:var(--ground);border-color:var(--main)">More trades ≠ more profit</p>' +
      '<p class="fict" style="position:absolute;left:140px;top:750px;margin:0">Fictional day · demo · win/loss mix is illustrative</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick fq-k">Trade frequency</p>' +
      '<h2 class="line fq-tt">Many trades, many fees</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.fq-k').style; this.t = q('.fq-tt'); this.d = q('.fq-d'); this.tiles = all('.fq-t').map((e) => e.style);
    this.fill = q('.fq-fill').style; this.n = q('.fq-n');
    ['c1', 'c1b', 'c2', 'c3', 'c4'].forEach((c) => { this[c] = q('.fq-' + c).style; });
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'explain' }, { t: 5.3, pose: 'checklist' }, { t: 9.4, pose: 'magnify' }, { t: 14.3, pose: 'confused' }, { t: 18.3, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.7, { stagger: 0.04 });
    UI.rise(this.c1, t, 5.4); UI.rise(this.c1b, t, 6.2, { dy: 10 });
    this.tiles.forEach((s, i) => {
      const a = FQ_A + i * FQ_S, p = seg(t, a, a + 0.35);
      s.opacity = eo(p); s.transform = 'scale(' + lerp(0.7, 1, eob(p, 1.6)).toFixed(3) + ')';
      // Later the outcomes show: some wins, some losses (illustrative).
      const r = seg(t, 14.4 + i * 0.05, 14.8 + i * 0.05), w = FQ_W[i] === 'W';
      s.borderColor = r > 0 ? 'color-mix(in srgb, ' + (w ? 'var(--up)' : 'var(--down)') + ' ' + (22 + 60 * eo(r)).toFixed(0) + '%, transparent)' : '';
    });
    const fees = 6 * Math.min(20, (Math.max(0, t - FQ_A) / FQ_S));
    const h = FQ_H * fees / 120;
    this.fill.height = h.toFixed(1) + 'px';
    this.n.style.top = (FQ_TOP + FQ_H - Math.max(h, 56) + 10).toFixed(1) + 'px'; this.n.style.opacity = eo(seg(t, FQ_A, FQ_A + 0.3));
    UI.txt(this.n, Math.round(fees) + '');
    UI.rise(this.c2, t, 13.6, { dy: 10 });
    UI.rise(this.c3, t, 14.4);
    UI.rise(this.c4, t, 18.4);
    this.tutor.render(t);
  },
});
