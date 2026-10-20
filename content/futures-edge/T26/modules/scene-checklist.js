const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The ENTRY CHECKLIST as the app shows it (mock): BUY 72% / 60% READY, SELL 55% / 60% not ready.
const CL_BUY = [['Candle reaction', 1], ['Volume', 1], ['1m trend', 1], ['Order book', 0]];
const CL_SELL = [];
kit.scene('checklist', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const rows = (list, col, cls) => list.map((c) => '<div class="' + cls + '" style="display:flex;align-items:center;gap:12px;font-size:24px;padding:4px 0"><span class="mono" style="width:26px;font-weight:700;color:' + (c[1] ? col : 'color-mix(in srgb, var(--second) 45%, var(--ground))') + '">' + (c[1] ? '✓' : '✗') + '</span>' +
      '<span style="' + (c[1] ? '' : 'color:color-mix(in srgb, var(--second) 50%, var(--ground))') + '">' + c[0] + '</span></div>').join('');
    const side = (name, where, col, sc, cls, list) => '<div class="card ' + cls + '" style="margin-top:14px;border-color:color-mix(in srgb, ' + col + ' 40%, transparent)">' +
      '<div style="display:flex;align-items:center;gap:12px"><span class="pill" style="color:' + col + '">' + name + '</span><span class="lbl" style="flex:1">' + where + '</span>' +
      '<span class="mono ' + cls + '-s" style="font-size:28px;font-weight:600">' + sc + '<span style="color:color-mix(in srgb, var(--second) 50%, var(--ground));font-size:22px"> / 60%</span></span></div>' +
      '<div style="position:relative;height:14px;border-radius:7px;margin:12px 0 8px;background:color-mix(in srgb, var(--second) 10%, transparent)"><div class="' + cls + '-f" style="height:100%;width:0;border-radius:7px;background:' + col + '"></div>' +
      '<div style="position:absolute;left:60%;top:-6px;width:3px;height:26px;background:var(--second)"></div></div>' + rows(list, col, cls + '-r') + '</div>';
    const body = '<div class="card" style="padding:16px 18px"><div style="display:flex;justify-content:space-between;align-items:baseline"><p class="card-h" style="margin:0">ENTRY CHECKLIST</p><span class="lbl">Basic mode</span></div>' +
      side('BUY', 'at support', 'var(--up)', '72%', 'cl-b', CL_BUY) + side('SELL', 'at resistance', 'var(--down)', '55%', 'cl-s', CL_SELL) + '</div>';
    this.ph = UI.phone(kit, { left: 1140, top: 130, w: 560, h: 640, title: 'BTC/USDT', body }).style;
    this.ml = UI.mockLabel(kit, 1140, 96).style;
    // READY badge, placed over the BUY panel header
    const ready = kit.h('<span class="pill cl-ready" style="position:absolute;color:var(--ground);background:var(--up);border-color:var(--up);font-size:22px">⚡ READY</span>');
    kit.stage.querySelector('.cl-b').style.position = 'relative';
    ready.style.right = '18px'; ready.style.bottom = '16px';
    kit.stage.querySelector('.cl-b').append(ready);
    const eq = (cls, a, b, rel, res, col) => '<div class="glass ' + cls + '" style="left:140px;width:860px;padding:22px 32px;display:flex;align-items:center;gap:28px">' +
      '<div><p class="mono" style="margin:0;font-size:56px">' + a + '<span style="color:color-mix(in srgb, var(--second) 50%, var(--ground))"> / ' + b + '</span></p>' +
      '<p class="lbl" style="margin:4px 0 0">score / your minimum</p></div>' +
      '<p style="margin:0;font-size:32px;font-weight:700;color:' + col + '">' + rel + '<br>' + res + '</p></div>';
    kit.stage.append(kit.h('<div>' +
      '<div class="words" style="left:140px;top:200px;width:860px"><p class="kick cl-k">In the app</p>' +
      '<h2 class="line cl-t">The entry checklist</h2>' +
      '<p class="sub cl-x" style="font-size:32px">Each check: ✓ agrees, ✗ does not.</p></div></div>'));
    kit.stage.append(kit.h(eq('cl-e1', '72%', '60%', '72 is at or above 60', '→ READY', 'var(--up)')));
    kit.stage.append(kit.h(eq('cl-e2', '55%', '60%', '55 is below 60', '→ not ready, no sell', 'var(--down)')));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    q('.cl-e1').style.top = '460px'; q('.cl-e2').style.top = '650px';
    this.k = q('.cl-k').style; this.t = q('.cl-t'); this.x = q('.cl-x');
    this.e1 = q('.cl-e1').style; this.e2 = q('.cl-e2').style; this.ready = q('.cl-ready').style;
    this.bf = q('.cl-b-f').style; this.sf = q('.cl-s-f').style; this.bp = q('.cl-b').style; this.sp = q('.cl-s').style;
    this.br = all('.cl-b-r').map((e) => e.style); this.sr = all('.cl-s-r').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'read' }, { t: 6.2, pose: 'checklist' }, { t: 13.0, pose: 'think' }, { t: 18.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.x, t, 1.4, { stagger: 0.07 });
    const p = seg(t, 0.4, 1.3);
    this.ph.opacity = eo(p); this.ph.transform = 'translateY(' + (lerp(50, 0, eo(p)) - t * 0.8).toFixed(1) + 'px)';
    this.ml.opacity = 0.9 * eo(seg(t, 1.0, 1.6));
    this.br.forEach((s, i) => { const a = 2.0 + i * 0.7; s.opacity = eo(seg(t, a, a + 0.4)); });
    this.sr.forEach((s, i) => { const a = 13.4 + i * 0.7; s.opacity = eo(seg(t, a, a + 0.4)); });
    this.bf.width = (72 * eio(seg(t, 6.6, 8.4))).toFixed(2) + '%';
    this.sf.width = (55 * eio(seg(t, 13.2, 14.8))).toFixed(2) + '%';
    const r = seg(t, 9.0, 9.4);
    this.ready.opacity = eo(r); this.ready.transform = 'scale(' + lerp(0.5, 1, eob(r, 1.8)).toFixed(3) + ')';
    this.bp.boxShadow = '0 0 0 ' + (3 * eo(r)).toFixed(1) + 'px color-mix(in srgb, var(--up) 45%, transparent)';
    this.sp.opacity = (0.6 + 0.4 * eo(seg(t, 12.8, 13.3))).toFixed(3);
    UI.rise(kit, this.e1, t, 6.6, 0.6, 24);
    UI.rise(kit, this.e2, t, 13.2, 0.6, 24);
    this.tutor.render(t);
  },
});
