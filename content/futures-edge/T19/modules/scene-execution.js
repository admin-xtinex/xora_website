const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Expected 60,000 → 60,120 (120). Filled 60,010 → 60,110 (100). Slippage 10 in, 10 out.
const exY = (p) => 700 - (p - 59980) / 160 * 340;
kit.scene('execution', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (a, v, cls, last) => '<div class="row ex-r"' + (last ? ' style="border:0"' : '') + '><span>' + a + '</span><span class="mono ' + (cls || '') + '" style="font-size:32px">' + v + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="ex-grid">' + UI.gridL(1100, 1440, exY, 60000, 60120, 20) + '</g>' +
      '<rect class="ex-ib" x="1140" width="80" rx="8" y="' + exY(60120) + '" height="' + (exY(60000) - exY(60120)) + '" style="fill:color-mix(in srgb, var(--up) 45%, transparent);stroke:var(--up);stroke-width:2"/>' +
      '<rect class="ex-s1" x="1310" width="80" rx="4" y="' + exY(60010) + '" height="' + (exY(60000) - exY(60010)) + '" style="fill:color-mix(in srgb, var(--down) 70%, transparent)"/>' +
      '<rect class="ex-s2" x="1310" width="80" rx="4" y="' + exY(60120) + '" height="' + (exY(60110) - exY(60120)) + '" style="fill:color-mix(in srgb, var(--down) 70%, transparent)"/>' +
      '<rect class="ex-rb" x="1310" width="80" rx="8" style="fill:color-mix(in srgb, var(--main) 45%, transparent);stroke:var(--main);stroke-width:2"/></svg>' +
      '<p class="kick ex-il" style="position:absolute;left:1120px;top:' + (exY(60000) + 18) + 'px;margin:0;font-size:20px;color:var(--up)">Expected</p>' +
      '<p class="kick ex-rl" style="position:absolute;left:1310px;top:' + (exY(60000) + 18) + 'px;margin:0;font-size:20px;color:var(--main)">Filled</p>' +
      '<p class="mono ex-n1" style="position:absolute;left:1140px;width:80px;text-align:center;top:' + (exY(60060) - 18) + 'px;margin:0;font-size:30px;font-weight:600">120</p>' +
      '<p class="mono ex-n2" style="position:absolute;left:1310px;width:80px;text-align:center;top:' + (exY(60060) - 18) + 'px;margin:0;font-size:30px;font-weight:600">100</p>' +
      '<p class="tag ex-t1" style="left:1400px;top:' + (exY(60005) - 20) + 'px;color:var(--down);border-color:var(--down)">−10 in</p>' +
      '<p class="tag ex-t2" style="left:1400px;top:' + (exY(60115) - 20) + 'px;color:var(--down);border-color:var(--down)">−10 out</p>' +
      '<p class="fict" style="position:absolute;left:1040px;top:320px;margin:0">Fictional · USDT per BTC</p>' +
      '<div class="glass ex-p" style="left:1540px;top:400px;width:240px;padding:10px 22px">' + row('Move', '120') + row('Slip', '−20', 'dn') + row('Left', '100', 'hl', 1) + '</div>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick ex-k">Execution quality</p>' +
      '<h2 class="line ex-t">The price you actually get</h2></div>' +
      '<p class="def ex-d" style="position:absolute;left:140px;top:320px;width:780px;margin:0"><b>Execution quality</b> is how close your fill is to the price you expected.</p>' +
      '<p class="mono ex-m" style="position:absolute;left:140px;top:500px;margin:0;font-size:30px">On 0.1 BTC: 12.00 → <span class="hl">10.00 USDT</span>, before fees</p>' +
      '<p class="chip ex-c" style="position:absolute;left:140px;top:580px;margin:0;font-size:28px;border-color:var(--accent)"><span class="dot" style="background:var(--accent)"></span>Small moves: spread and slippage take a big share</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ex-k').style; this.t = q('.ex-t'); this.d = q('.ex-d'); this.m = q('.ex-m').style; this.c = q('.ex-c').style;
    this.grid = q('.ex-grid').style; this.ib = q('.ex-ib').style; this.rb = q('.ex-rb'); this.s1 = q('.ex-s1').style; this.s2 = q('.ex-s2').style;
    this.il = q('.ex-il').style; this.rl = q('.ex-rl').style; this.n1 = q('.ex-n1').style; this.n2 = q('.ex-n2').style; this.t1 = q('.ex-t1').style; this.t2 = q('.ex-t2').style;
    this.p = q('.ex-p').style; this.rows = all('.ex-r').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 6.2, pose: 'magnify' }, { t: 10.5, pose: 'checklist' }, { t: 14.1, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.7, { stagger: 0.04 });
    this.grid.opacity = eo(seg(t, 1.6, 2.1));
    const ib = seg(t, 2.2, 3.0);
    this.ib.opacity = eo(ib); this.ib.transformBox = 'fill-box'; this.ib.transformOrigin = '50% 100%'; this.ib.transform = 'scaleY(' + eo(ib).toFixed(3) + ')';
    this.il.opacity = eo(seg(t, 2.4, 2.9));
    // The filled bar starts as the expected one, then loses 10 at the bottom and 10 at the top.
    const lo = lerp(60000, 60010, eio(seg(t, 6.6, 7.4))), hi = lerp(60120, 60110, eio(seg(t, 8.2, 9.0)));
    this.rb.setAttribute('y', exY(hi).toFixed(1)); this.rb.setAttribute('height', (exY(lo) - exY(hi)).toFixed(1));
    this.rb.style.opacity = eo(seg(t, 3.4, 3.9)); this.rl.opacity = this.rb.style.opacity;
    this.s1.opacity = eo(seg(t, 6.6, 7.0)); this.s2.opacity = eo(seg(t, 8.2, 8.6));
    UI.rise(this.t1, t, 7.0, { dy: 10 }); UI.rise(this.t2, t, 8.6, { dy: 10 });
    this.n1.opacity = eo(seg(t, 10.6, 11.0)); this.n2.opacity = eo(seg(t, 11.0, 11.4));
    UI.rise(this.p, t, 10.6);
    this.rows.forEach((s, i) => { s.opacity = eo(seg(t, 10.8 + i * 0.5, 11.2 + i * 0.5)); });
    UI.rise(this.m, t, 12.0, { dy: 10 });
    UI.rise(this.c, t, 14.2);
    this.tutor.render(t);
  },
});
