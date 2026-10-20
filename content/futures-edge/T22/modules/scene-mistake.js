const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Mistake: leverage or size first, then hope. Fix: budget → stop → notional → margin, and NO_TRADE when the size makes no sense.
const MK_S = ['Risk budget', 'Stop distance', 'Allowed notional', 'Then check margin'];
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const step = (n, s) => '<div class="mk-s" style="display:flex;align-items:center;gap:16px;height:54px"><span class="mono" style="flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:var(--main);color:var(--ground)">' + n + '</span><span style="font-size:30px;font-weight:600">' + s + '</span></div>';
    this.h = UI.head(kit, 'Common mistake', 'Leverage first, hope later', 
      '<div class="glass mk-a" style="left:140px;top:300px;width:760px;height:440px;padding:26px 34px"><p class="kick" style="margin:0 0 20px;color:var(--accent)">The mistake</p>' +
      '<div style="display:flex;flex-direction:column;gap:18px">' +
      '<span class="chip mono mk-c" style="align-self:flex-start;font-size:32px;background:var(--accent);color:var(--ground);border-color:var(--accent)">“I\'ll use 20x!”</span>' +
      '<span class="chip mk-c" style="align-self:flex-start;font-size:30px">↓ A big position, sized by feel</span>' +
      '<span class="chip mk-c" style="align-self:flex-start;font-size:30px">↓ Hope the stop is never hit</span></div>' +
      '<svg width="700" height="220" viewBox="0 0 700 220" style="position:absolute;left:30px;top:96px"><path class="mk-x" d="M20 20 L640 200 M640 20 L20 200" pathLength="1" fill="none" stroke-width="8" stroke-linecap="round" style="stroke:var(--accent)"/></svg></div>' +
      '<div class="glass mk-b" style="left:960px;top:300px;width:820px;height:440px;padding:26px 34px;border-color:var(--main)"><p class="kick" style="margin:0 0 12px">The fix · always in this order</p>' +
      MK_S.map((s, i) => step(i + 1, s)).join('') +
      '<div class="mk-n" style="display:flex;align-items:center;gap:16px;margin-top:20px"><span class="chip mono" style="font-size:28px;padding:8px 22px;background:var(--main);color:var(--ground);border-color:var(--main)">NO_TRADE</span><span style="font-size:28px;font-weight:600">if the size makes no sense</span></div></div>');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.a = q('.mk-a').style; this.b = q('.mk-b').style; this.cs = all('.mk-c').map((e) => e.style); this.x = q('.mk-x'); this.ss = all('.mk-s').map((e) => e.style); this.n = q('.mk-n').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 7.0, pose: 'checklist' }, { t: 13.8, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    UI.rise(kit, this.a, t, 0.5, 0.7);
    this.cs.forEach((s, i) => UI.rise(kit, s, t, 1.4 + i * 1.4, 0.5, 14));
    this.x.setAttribute('stroke-dasharray', eio(seg(t, 6.4, 7.1)).toFixed(3) + ' 1'); this.x.style.opacity = t >= 6.4 ? 0.85 : 0;
    UI.rise(kit, this.b, t, 7.0, 0.7);
    this.ss.forEach((s, i) => UI.rise(kit, s, t, 7.8 + i * 1.2, 0.5, 14));
    const n = seg(t, 13.8, 14.4); this.n.opacity = eo(n); this.n.transform = 'scale(' + lerp(0.8, 1, eob(n, 1.7)).toFixed(3) + ')'; this.n.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
