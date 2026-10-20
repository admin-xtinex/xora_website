const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Definition, the pilot's-checklist analogy, then the six steps in order flowing left to right.
const ST = [['Trend', 'Which way?'], ['Range', 'How far?'], ['Zones', 'Floor, ceiling?'], ['Volume', 'How busy?'], ['Risk budget', 'Most I accept to lose'], ['Decision', 'BUY · SELL · WAIT']];
const ST_A = 15.0, ST_D = 0.75;
kit.scene('steps', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '', arrows = '';
    ST.forEach((s, i) => {
      const x = 140 + i * 278;
      cards += '<div class="glass st-c" style="left:' + x + 'px;top:530px;width:240px;height:200px;padding:20px 22px;display:flex;flex-direction:column;gap:10px' + (i === 5 ? ';border-color:var(--main)' : '') + '">' +
        '<span class="mono" style="font-size:24px;color:var(--main)">' + (i + 1) + '</span><b style="font-size:32px;line-height:1.1">' + s[0] + '</b>' +
        '<span style="font-size:24px;line-height:1.25;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + s[1] + '</span></div>';
      if (i < 5) arrows += '<path class="st-a" d="M' + (x + 246) + ' 630 L' + (x + 272) + ' 630 M' + (x + 262) + ' 620 L' + (x + 272) + ' 630 L' + (x + 262) + ' 640" fill="none" stroke-width="3" stroke-linecap="round" style="stroke:var(--main)"/>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:150px;width:1500px"><p class="kick st-k">The method</p>' +
      '<h2 class="line st-t" style="font-size:64px">Check in order, then decide</h2></div>' +
      '<div class="glass st-def" style="left:140px;top:300px;width:900px;padding:24px 34px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:32px">An <b>entry opportunity</b> is a moment when you <b>consider</b> opening a trade. Considering is not entering.</p></div>' +
      '<div class="glass st-an" style="left:1100px;top:300px;width:680px;padding:24px 34px"><p class="kick" style="margin:0 0 10px">Like a pilot</p>' +
      '<p class="st-an1" style="margin:0;font-size:30px;font-weight:600;line-height:1.45">Fuel ✓ · Weather ✓ · Instruments ✓</p>' +
      '<p class="st-an2" style="margin:6px 0 0;font-size:30px;font-weight:600;line-height:1.45;color:var(--main)">Then: take off, or wait.</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' + arrows + '</svg>' + cards +
      '<p class="st-tent" style="position:absolute;left:1530px;top:478px;margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 72%, var(--ground))">Tentative: can change</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)].map((e) => e.style);
    this.k = q('.st-k').style; this.t = q('.st-t'); this.def = q('.st-def').style; this.an = q('.st-an').style; this.an1 = q('.st-an1'); this.an2 = q('.st-an2').style;
    this.cards = all('.st-c'); this.arrows = all('.st-a'); this.tent = q('.st-tent').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.6, pose: 'explain' }, { t: 8.4, pose: 'checklist' }, { t: ST_A, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.def, t, 0.6, 0.7);
    UI.rise(kit, this.an, t, 8.4, 0.7);
    TextFx.fadeFromRight(this.an1, t, 9.0, { stagger: 0.35 });
    this.an2.opacity = eo(seg(t, 12.0, 12.5));
    this.cards.forEach((s, i) => {
      const a = ST_A + i * ST_D, p = seg(t, a, a + 0.6);
      s.opacity = eo(seg(t, a, a + 0.35)).toFixed(3);
      s.transform = 'translateY(' + lerp(36, 0, eo(p)).toFixed(1) + 'px) scale(' + lerp(0.94, 1, eob(p, 1.5)).toFixed(4) + ')';
      // a light that travels along the steps
      const lit = Math.sin(Math.PI * seg(t, a + 0.4, a + 1.4));
      s.boxShadow = '0 30px 80px rgba(0,0,0,.45), 0 0 0 ' + (lit * 3).toFixed(1) + 'px color-mix(in srgb, var(--main) 60%, transparent)';
    });
    this.arrows.forEach((s, i) => { s.opacity = eo(seg(t, ST_A + i * ST_D + 0.4, ST_A + i * ST_D + 0.7)); });
    this.tent.opacity = eo(seg(t, ST_A + 5 * ST_D + 0.6, ST_A + 5 * ST_D + 1.1));
    this.tutor.render(t);
  },
});
