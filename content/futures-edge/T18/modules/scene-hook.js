const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Two fictional paths from 60,000 to 60,100 over the same time: one calm, one jumpy.
const HK_CALM = (s) => 60000 + 100 * s + 14 * Math.sin(s * 19) * Math.sin(Math.PI * s);
const HK_WILD = (s) => 60000 + 100 * s + Math.sin(Math.PI * s) * (260 * Math.sin(s * 23.5) + 90 * Math.sin(s * 57 + 1));
const hkY = (p) => 500 + (60100 - p) / 700 * 260;
const hkX = (k) => (s) => (k ? 1000 : 180) + 60 + s * 600;
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (k, name, col) => '<div class="glass" style="left:' + (k ? 1000 : 180) + 'px;top:300px;width:720px;height:440px"></div>' +
      '<p class="kick" style="position:absolute;left:' + ((k ? 1000 : 180) + 34) + 'px;top:326px;margin:0;color:' + col + '">' + name + '</p>' +
      '<p class="tag hk-ch" style="left:' + ((k ? 1000 : 180) + 500) + 'px;top:318px;color:var(--up);border-color:var(--up)">+100 USDT</p>';
    kit.stage.append(kit.h('<div class="ground">' + card(0, 'Chart A · calm', 'var(--main)') + card(1, 'Chart B · jumpy', 'var(--accent)') +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      [0, 1].map((k) => '<line x1="' + hkX(k)(0) + '" x2="' + hkX(k)(1) + '" y1="' + hkY(60000) + '" y2="' + hkY(60000) + '" stroke-width="2" stroke-dasharray="8 8" style="stroke:color-mix(in srgb, var(--second) 30%, transparent)"/>' +
        '<line x1="' + hkX(k)(0) + '" x2="' + hkX(k)(1) + '" y1="' + hkY(60100) + '" y2="' + hkY(60100) + '" stroke-width="2" stroke-dasharray="8 8" style="stroke:color-mix(in srgb, var(--up) 45%, transparent)"/>' +
        '<path class="hk-l" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:' + (k ? 'var(--accent)' : 'var(--main)') + '"/><circle class="hk-d" r="10" style="fill:var(--second)"/>').join('') + '</svg>' +
      [0, 1].map((k) => '<p class="mono hk-s" style="position:absolute;left:' + ((k ? 1000 : 180) + 34) + 'px;top:676px;margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">60,000 → 60,100</p>').join('') +
      '<p class="fict" style="position:absolute;left:180px;top:752px;margin:0">BTC/USDT · fictional · illustrative, not real market data</p>' +
      '<div class="words" style="left:140px;top:160px;width:1500px"><p class="kick hk-k">From T17: zones, breakouts, fakeouts</p>' +
      '<h2 class="line hk-t">Same change, different ride</h2></div>' +
      '</div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = kit.stage.querySelector('.hk-k').style; this.t = kit.stage.querySelector('.hk-t');
    this.ls = all('.hk-l'); this.ds = all('.hk-d'); this.chs = all('.hk-ch').map((e) => e.style); this.ss = all('.hk-s').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'explain' }, { t: 5.4, pose: 'magnify' }, { t: 11.0, pose: 'think' }],
      says: [{ t0: 11.4, t1: 15.6, text: 'Same +100?' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    [HK_CALM, HK_WILD].forEach((f, k) => {
      const e = Math.max(0.002, eio(seg(t, 5.6, 10.6)));
      this.ls[k].setAttribute('d', UI.line(f, 0, e, hkX(k), hkY, 0.004));
      this.ds[k].setAttribute('cx', hkX(k)(e).toFixed(1)); this.ds[k].setAttribute('cy', hkY(f(e)).toFixed(1));
      this.ds[k].style.opacity = eo(seg(t, 5.4, 5.8));
      this.ss[k].opacity = eo(seg(t, 5.8, 6.4));
      UI.rise(this.chs[k], t, 10.8 + k * 0.3, { dy: 12 });
    });
    this.tutor.render(t);
  },
});
