const { seg, eo, eob, eio, lerp, TextFx } = kit;
const OUT_ITEMS = ['Explain what BTC/USDT means', 'Read a candlestick chart', 'Tell spot and futures apart', 'Explain why leverage is risky', 'Choose not to trade when the picture is unclear'];
const OUT_R = 150, OUT_C = 2 * Math.PI * OUT_R;
kit.scene('outcomes', {
  init(kit) {
    let items = '';
    OUT_ITEMS.forEach((s) => {
      items += '<div class="out-item" style="display:flex;align-items:center;gap:28px"><svg width="52" height="52" viewBox="0 0 52 52" style="flex:none"><circle cx="26" cy="26" r="23" fill="none" stroke-width="3" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>' +
        '<path class="out-tick" d="M15 27 L23 35 L38 18" pathLength="1" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg>' +
        '<span style="font-size:40px;font-weight:600">' + s + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1100px"><p class="kick out-k">By the end</p><h2 class="line out-t" style="font-size:80px">You should be able to</h2>' +
      '<div style="display:flex;flex-direction:column;gap:30px;margin-top:30px">' + items + '</div></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="out-g" x1="0" x2="1"><stop offset="0" style="stop-color:var(--main)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient></defs>' +
      '<circle cx="1510" cy="560" r="' + OUT_R + '" fill="none" stroke-width="16" style="stroke:color-mix(in srgb, var(--second) 10%, transparent)"/>' +
      '<circle class="out-ring" cx="1510" cy="560" r="' + OUT_R + '" fill="none" stroke="url(#out-g)" stroke-width="16" stroke-linecap="round" stroke-dasharray="' + OUT_C + '" transform="rotate(-90 1510 560)"/></svg>' +
      '<div class="words" style="left:1360px;top:500px;width:300px;align-items:center;gap:6px"><span class="mono out-n" style="font-size:64px">0 of 5</span><span class="fict">core skills</span></div>' +
      '</div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = kit.stage.querySelector('.out-k').style; this.title = kit.stage.querySelector('.out-t');
    this.items = all('.out-item').map((e) => e.style); this.ticks = all('.out-tick');
    this.ring = kit.stage.querySelector('.out-ring'); this.n = kit.stage.querySelector('.out-n');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idle' }, { t: 1.0, pose: 'checklist' }, { t: 7.5, pose: 'cheer' }],
      says: [{ t0: 7.7, t1: 9.8, text: 'One lesson at a time. You will get there.' }],
    });
  },
  render(t) {
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.title, t, 0.1);
    let done = 0, fill = 0;
    this.items.forEach((s, i) => {
      const a = 1.3 + i * 1.25;
      s.opacity = eo(seg(t, a, a + 0.4));
      s.transform = 'translateX(' + lerp(26, 0, eo(seg(t, a, a + 0.5))) + 'px)';
      const k = eo(seg(t, a + 0.5, a + 0.9));
      this.ticks[i].setAttribute('stroke-dasharray', k + ' 1');
      if (k >= 1) done++;
      fill += eio(seg(t, a + 0.5, a + 1.0)) / 5;
    });
    this.ring.setAttribute('stroke-dashoffset', (OUT_C * (1 - fill)).toFixed(1));
    const txt = done + ' of 5';
    if (this.n.textContent !== txt) this.n.textContent = txt;
    this.tutor.render(t);
  },
});
