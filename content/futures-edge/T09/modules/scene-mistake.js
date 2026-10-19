const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MK_T0 = 5.6, MK_DT = 0.24;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let tiles = '';
    for (let i = 0; i < 20; i++) tiles += '<div class="glass mk-tl" style="left:' + (1040 + (i % 5) * 128) + 'px;top:' + (330 + Math.floor(i / 5) * 84) + 'px;width:116px;height:70px;padding:0;display:grid;place-items:center;border-radius:16px;border-color:color-mix(in srgb, var(--accent) 55%, transparent)"><span class="mono" style="font-size:26px;color:var(--accent)">−0.60</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1500px"><p class="kick mk-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line mk-t">"Fees are tiny. Ignore them."</h2></div>' + tiles +
      '<p class="fict mk-f" style="position:absolute;left:1040px;top:676px;margin:0">20 small trades · 0.60 USDT fees each · fictional</p>' +
      '<div class="glass mk-m" style="left:140px;top:340px;width:780px;padding:26px 36px;border-color:color-mix(in srgb, var(--accent) 50%, transparent)"><p class="kick" style="margin:0 0 10px;color:var(--accent)">The belief</p>' +
      '<p style="position:relative;margin:0;font-size:32px;line-height:1.4;font-weight:600">0.60 USDT is nothing to worry about.<span class="mk-x" style="position:absolute;left:-6px;right:-6px;top:50%;height:5px;border-radius:4px;background:var(--accent)"></span></p></div>' +
      '<div class="glass mk-tot" style="left:140px;top:520px;width:780px;padding:22px 36px"><p class="fict" style="margin:0 0 6px">Fees paid so far</p><p class="mono" style="margin:0;font-size:56px"><span class="mk-n" style="color:var(--accent)"></span> <span style="font-size:32px">USDT</span></p><p class="mono mk-c" style="margin:4px 0 0;font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))"></p></div>' +
      '<div class="glass mk-cr" style="left:140px;top:700px;width:780px;padding:18px 36px;border-color:var(--main)"><p style="margin:0;font-size:28px;font-weight:600">Frequent small trades <span style="color:var(--main)">feel costs most.</span></p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.m = q('.mk-m').style; this.x = q('.mk-x').style; this.tot = q('.mk-tot').style; this.n = q('.mk-n'); this.c = q('.mk-c');
    this.cr = q('.mk-cr').style; this.f = q('.mk-f').style; this.tl = [...kit.stage.querySelectorAll('.mk-tl')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.5, pose: 'confused' }, { t: 5.2, pose: 'checklist' }, { t: 11.2, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.m, t, 0.8);
    this.x.transformOrigin = '0 50%'; this.x.transform = 'scaleX(' + eio(seg(t, 5.2, 5.8)) + ')';
    let n = 0;
    this.tl.forEach((s, i) => { const a = MK_T0 + i * MK_DT; UI.rise(s, t, a, { dy: -30, s: 0.7, d: 0.4 }); if (t >= a + 0.1) n++; });
    this.f.opacity = 0.9 * eo(seg(t, MK_T0, MK_T0 + 0.4));
    UI.rise(this.tot, t, 5.4);
    UI.txt(this.n, (n * 0.6).toFixed(2)); UI.txt(this.c, n + (n === 1 ? ' trade' : ' trades') + ' × 0.60');
    UI.rise(this.cr, t, 11.3);
    this.tutor.render(t);
  },
});
