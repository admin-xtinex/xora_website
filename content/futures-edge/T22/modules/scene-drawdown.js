const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Drawdown: two equity paths from 1,000 over five losing trades: 10 USDT each (to 950, −5%) vs 100 USDT each (to 500, −50%).
const DD_Y = (v) => 740 - (v - 500) * 0.72, DD_X = (i) => 200 + i * 120;
kit.scene('drawdown', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const pts = (step) => [0, 1, 2, 3, 4, 5].map((i) => [DD_X(i), DD_Y(1000 - step * i)]);
    this.pa = pts(10); this.pb = pts(100);
    let ticks = '';
    for (let i = 1; i <= 5; i++) ticks += '<text x="' + DD_X(i) + '" y="764" text-anchor="middle" class="axis">' + i + '</text>';
    this.h = UI.head(kit, 'Drawdown', 'How deep is the hole?',
      '<svg class="art" viewBox="0 0 1920 1080"><g class="dd-g">' + UI.grid(170, 870, DD_Y, 500, 1000, 100) + ticks + '</g>' +
      '<line x1="170" x2="870" y1="' + DD_Y(1000) + '" y2="' + DD_Y(1000) + '" stroke-width="3" stroke-dasharray="10 8" style="stroke:var(--main)"/>' +
      '<path class="dd-a" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/>' +
      '<path class="dd-b" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--down)"/>' +
      '<path class="dd-r" d="M' + (DD_X(5) + 32) + ' ' + DD_Y(510) + ' V' + DD_Y(990) + ' M' + (DD_X(5) + 20) + ' ' + (DD_Y(990) + 16) + ' L' + (DD_X(5) + 32) + ' ' + DD_Y(990) + ' L' + (DD_X(5) + 44) + ' ' + (DD_Y(990) + 16) + '" fill="none" stroke-width="4" stroke-dasharray="8 6" style="stroke:var(--second)"/></svg>' +
      '<p class="tag" style="left:186px;top:' + (DD_Y(1000) - 52) + 'px;color:var(--main);border-color:var(--main)">Peak 1,000 USDT</p>' +
      '<p class="tag dd-ta" style="left:' + (DD_X(5) - 250) + 'px;top:' + (DD_Y(950) + 12) + 'px">950 · −5%</p>' +
      '<p class="tag dd-tb" style="left:' + (DD_X(5) - 260) + 'px;top:' + (DD_Y(500) - 22) + 'px;color:var(--down);border-color:var(--down)">500 · −50%</p>' +
      '<p class="fict" style="position:absolute;left:170px;top:282px;margin:0">Account after each losing trade · fictional</p>' +
      '<div class="glass dd-d" style="left:980px;top:300px;width:800px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:30px"><b>Drawdown</b>: how far the account falls from its highest point, in %.</p></div>' +
      '<div class="glass dd-1" style="left:980px;top:480px;width:800px;padding:14px 30px"><div class="row" style="padding:8px 0"><span>Five losses of 10</span><span class="mono" style="font-size:30px">50 ÷ 1,000 = 5%</span></div>' +
      '<div class="row dd-2" style="padding:8px 0;border:0"><span>Five losses of 100</span><span class="mono" style="font-size:30px;color:var(--down)">500 ÷ 1,000 = 50%</span></div></div>' +
      '<div class="glass dd-3" style="left:980px;top:640px;width:800px;padding:16px 30px;border-color:var(--accent)"><p class="mono" style="margin:0;font-size:28px;line-height:1.45">500 → 1,000 needs +500 = <span style="color:var(--accent)">+100%</span><br>950 → 1,000 needs about +5.3%</p></div>');
    const q = (s) => kit.stage.querySelector(s);
    this.g = q('.dd-g').style; this.a = q('.dd-a'); this.b = q('.dd-b'); this.r = q('.dd-r').style; this.ta = q('.dd-ta').style; this.tb = q('.dd-tb').style;
    this.d = q('.dd-d').style; this.c1 = q('.dd-1').style; this.c2 = q('.dd-2').style; this.c3 = q('.dd-3').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 6.4, pose: 'magnify' }, { t: 11.4, pose: 'confused' }, { t: 16.0, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    this.g.opacity = eo(seg(t, 0.4, 1.0));
    UI.rise(kit, this.d, t, 0.6, 0.7);
    const pa = eio(seg(t, 6.6, 9.6)), pb = eio(seg(t, 11.6, 14.6));
    this.a.setAttribute('d', UI.part(this.pa, Math.max(pa, 0.001))); this.a.style.opacity = pa > 0 ? 1 : 0;
    this.b.setAttribute('d', UI.part(this.pb, Math.max(pb, 0.001))); this.b.style.opacity = pb > 0 ? 1 : 0;
    UI.fade(this.ta, t, 9.6); UI.fade(this.tb, t, 14.6);
    UI.rise(kit, this.c1, t, 9.8, 0.6); this.c2.opacity = eo(seg(t, 14.6, 15.0));
    this.r.opacity = eo(seg(t, 16.4, 17.0));
    UI.rise(kit, this.c3, t, 16.4, 0.6);
    this.tutor.render(t);
  },
});
