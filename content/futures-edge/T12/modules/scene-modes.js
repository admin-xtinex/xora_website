const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Isolated vs cross, as concept pictures. Wallet 500 USDT, position margin 100 USDT. No liquidation numbers.
kit.scene('modes', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const label = 'font-size:22px;font-weight:600;color:color-mix(in srgb, var(--second) 70%, var(--ground))';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1400px"><p class="kick md-k">Margin modes</p>' +
      '<h2 class="line md-t" style="font-size:72px">Isolated or cross</h2></div>' +
      // Isolated panel
      '<div class="glass md-i" style="left:140px;top:330px;width:790px;height:430px;padding:24px 32px">' +
      '<p class="kick" style="margin:0 0 6px">Isolated margin</p><p style="margin:0;font-size:28px;font-weight:600">Only the margin you assign is at risk</p>' +
      '<div style="position:absolute;left:32px;top:150px;width:200px"><p style="margin:0 0 8px;' + label + '">Position margin</p>' +
      '<div style="position:relative;height:180px;border-radius:14px;border:2px solid var(--main);overflow:hidden"><div class="md-if" style="position:absolute;left:0;right:0;bottom:0;height:100%;background:var(--main)"></div></div>' +
      '<p class="mono" style="margin:8px 0 0;font-size:28px">100 USDT</p></div>' +
      '<div class="md-env" style="position:absolute;left:280px;top:150px;width:470px"><p style="margin:0 0 8px;' + label + '">Rest of futures wallet</p>' +
      '<div class="md-ir" style="position:relative;height:180px;border-radius:14px;border:2px solid color-mix(in srgb, var(--second) 30%, transparent);background:color-mix(in srgb, var(--ground) 80%, var(--main))"><span class="mono" style="position:absolute;left:24px;top:60px;font-size:48px">400</span></div>' +
      '<p class="md-ok" style="margin:8px 0 0;font-size:26px;font-weight:600;color:var(--main)">Not touched by this loss</p></div>' +
      '</div>' +
      // Cross panel
      '<div class="glass md-c" style="left:990px;top:330px;width:790px;height:430px;padding:24px 32px">' +
      '<p class="kick" style="margin:0 0 6px;color:var(--accent)">Cross margin</p><p style="margin:0;font-size:28px;font-weight:600">Your whole balance backs the position</p>' +
      '<div style="position:absolute;left:32px;right:32px;top:150px"><p style="margin:0 0 8px;' + label + '">Shared futures balance</p>' +
      '<div style="position:relative;height:180px;border-radius:14px;border:2px solid var(--accent);overflow:hidden"><div class="md-cf" style="position:absolute;left:0;top:0;bottom:0;width:100%;background:linear-gradient(90deg, color-mix(in srgb, var(--accent) 70%, var(--main)), var(--main))"></div>' +
      '<span class="mono md-cv" style="position:absolute;left:24px;top:60px;font-size:48px;color:var(--ground)">500</span></div>' +
      '<p class="md-cl" style="margin:8px 0 0;font-size:26px;font-weight:600;color:var(--accent)">The loss can reach much more of it</p></div>' +
      '</div>' +
      '<div class="chip md-safe" style="position:absolute;left:760px;top:250px;font-size:28px;padding:12px 26px;background:color-mix(in srgb, var(--ground) 70%, var(--accent));border-color:var(--accent)">Neither mode is safe</div>' +
      '<p class="fict md-f" style="position:absolute;left:1240px;top:182px;margin:0">Concept picture · fictional amounts</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.md-k').style; this.t = q('.md-t'); this.i = q('.md-i').style; this.c = q('.md-c').style; this.f = q('.md-f').style;
    this.ifl = q('.md-if').style; this.env = q('.md-env').style; this.ir = q('.md-ir').style; this.ok = q('.md-ok').style;
    this.cf = q('.md-cf').style; this.cv = q('.md-cv'); this.cl = q('.md-cl').style; this.safe = q('.md-safe').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 4.5, pose: 'point', flip: true }, { t: 10.6, pose: 'idea' }, { t: 16.3, pose: 'magnify' }, { t: 22.7, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.f.opacity = 0.9 * eo(seg(t, 1.0, 1.5));
    UI.rise(kit, this.i, t, 0.8, 0.7);
    UI.rise(kit, this.c, t, 1.3, 0.7);
    // Isolated: a loss drains only the position's own 100 USDT box.
    const il = eio(seg(t, 5.4, 9.4));
    this.ifl.height = (100 - 82 * il).toFixed(2) + '%';
    this.ifl.background = il > 0.5 ? 'var(--accent)' : 'var(--main)';
    this.ok.opacity = eo(seg(t, 10.6, 11.2));
    const hl = Math.sin(Math.PI * seg(t, 10.6, 12.2));
    this.ir.borderColor = 'color-mix(in srgb, var(--main) ' + (30 + 70 * hl).toFixed(0) + '%, transparent)';
    // Cross: the same kind of loss draws on the shared 500 USDT.
    const cl = eio(seg(t, 16.8, 21.0));
    this.cf.width = (100 - 55 * cl).toFixed(2) + '%';
    UI.set(this.cv, UI.fmt(Math.round(500 - 275 * cl)));
    this.cl.opacity = eo(seg(t, 17.6, 18.2));
    const s = seg(t, 22.7, 23.3);
    this.safe.opacity = eo(s); this.safe.transform = 'scale(' + lerp(0.7, 1, eob(s, 1.7)).toFixed(3) + ')';
    this.tutor.render(t);
  },
});
