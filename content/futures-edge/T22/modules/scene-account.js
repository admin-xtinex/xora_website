const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Account balance and risk budget: a 1,000 USDT bar fills; a 10 USDT slice is set aside as the example budget; fair-spending analogy.
kit.scene('account', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.h = UI.head(kit, 'Before any trade', 'How much could I lose?',
      '<div class="glass ac-d1" style="left:140px;top:300px;width:780px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Account balance</p>' +
      '<p class="def" style="margin:0;font-size:30px">The money in your trading account.</p></div>' +
      '<div class="glass ac-d2" style="left:140px;top:450px;width:780px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Risk budget (per trade)</p>' +
      '<p class="def" style="margin:0;font-size:30px">The most you accept to <b>lose on one trade</b>, decided <b>before</b> you enter.</p></div>' +
      '<div class="chip ac-ex" style="position:absolute;left:140px;top:676px;font-size:28px;padding:12px 26px;border-color:var(--accent)">Example only · not a recommendation</div>' +
      '<div class="glass ac-b" style="left:980px;top:300px;width:800px;height:230px;padding:20px 30px"><p class="kick" style="margin:0 0 6px">Practice account · fictional</p>' +
      '<p class="mono" style="margin:0 0 14px;font-size:48px"><span class="ac-v">0</span> <span style="font-size:26px">USDT</span></p>' +
      '<div style="position:relative;width:740px;height:40px;border-radius:20px;background:color-mix(in srgb, var(--second) 10%, transparent)">' +
      '<div class="ac-f" style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:20px;background:linear-gradient(90deg, var(--main), color-mix(in srgb, var(--main) 60%, var(--accent)))"></div>' +
      '<div class="ac-s" style="position:absolute;right:0;top:-8px;bottom:-8px;width:10px;border-radius:4px;background:var(--accent)"></div></div>' +
      '<p class="mono ac-sl" style="position:absolute;right:30px;bottom:18px;margin:0;font-size:26px;color:var(--accent)">10 USDT set aside as the budget</p></div>' +
      '<div class="glass ac-a" style="left:980px;top:560px;width:800px;height:190px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Like a spending limit at a fair</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.35;font-weight:600;width:520px">Decide the limit before you go, not halfway through.</p>' +
      '<svg width="200" height="120" viewBox="0 0 200 120" style="position:absolute;right:26px;top:40px"><rect x="20" y="30" width="160" height="70" rx="10" fill="none" stroke-width="3" style="stroke:var(--main)"/>' +
      '<circle cx="20" cy="65" r="12" style="fill:var(--ground)"/><circle cx="180" cy="65" r="12" style="fill:var(--ground)"/><text x="100" y="74" text-anchor="middle" style="fill:var(--main);font-size:26px;font-weight:700">LIMIT</text></svg></div>');
    const q = (s) => kit.stage.querySelector(s);
    this.d1 = q('.ac-d1').style; this.d2 = q('.ac-d2').style; this.ex = q('.ac-ex').style; this.b = q('.ac-b').style; this.v = q('.ac-v'); this.f = q('.ac-f').style;
    this.s = q('.ac-s').style; this.sl = q('.ac-sl').style; this.a = q('.ac-a').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'present' }, { t: 7.6, pose: 'read' }, { t: 14.4, pose: 'idea' }, { t: 20.8, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.d1, t, 0.6, 0.7); UI.rise(kit, this.b, t, 1.0, 0.7);
    const fp = eio(seg(t, 1.6, 3.6));
    this.f.width = (fp * 100).toFixed(2) + '%'; UI.set(this.v, UI.fmt(Math.round(1000 * fp)));
    UI.rise(kit, this.d2, t, 7.6, 0.7);
    // The budget slice: lights up and pulses once the budget is defined.
    const sp = seg(t, 9.6, 10.2);
    this.s.opacity = eo(sp); this.s.transform = 'scaleY(' + (lerp(0.4, 1, eob(sp, 1.8)) * (1 + 0.12 * Math.sin(Math.max(0, t - 10.2) * 4) * (1 - seg(t, 13, 14)))).toFixed(3) + ')';
    UI.rise(kit, this.sl, t, 10.0, 0.5, 10);
    UI.rise(kit, this.a, t, 14.4, 0.7);
    const e = seg(t, 20.8, 21.3); this.ex.opacity = eo(e); this.ex.transform = 'scale(' + lerp(0.85, 1, eob(e, 1.7)).toFixed(3) + ')'; this.ex.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
