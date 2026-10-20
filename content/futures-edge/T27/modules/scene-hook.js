const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The Signals screen (mock) scrolls past its cards; the card names light up on the left as they pass.
const HK_CARDS = ['PRICE ACTION', 'TRADE OPPORTUNITY', 'Market-read carousel', 'ENTRY CHECKLIST', 'ENGINE STATUS', 'Full AI insights'];
kit.scene('hook', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const r = kit.rng(27); let pts = '', v = 0;
    for (let i = 0; i < 40; i++) { v += (r() - 0.5) * 16; v *= 0.85; pts += (i ? 'L' : 'M') + (i * 11.5).toFixed(1) + ' ' + (70 - i * 0.8 + v + Math.sin(i / 5) * 14).toFixed(1); }
    const cd = (h, inner, extra) => '<div class="card" style="margin-bottom:14px;' + (extra || '') + '"><p class="card-h">' + h + '</p>' + inner + '</div>';
    const bar = (w, c) => '<div style="height:12px;width:' + w + '%;border-radius:6px;margin:8px 0;background:' + (c || 'color-mix(in srgb, var(--second) 18%, transparent)') + '"></div>';
    const col = '<div class="hk-col">' +
      cd('PRICE ACTION · 1M', '<svg width="448" height="140" viewBox="0 0 448 140"><path d="' + pts + '" fill="none" stroke-width="4" style="stroke:var(--main)"/></svg>') +
      cd('TRADE OPPORTUNITY', '<span class="pill" style="color:var(--up)">BUY</span><span style="font-size:24px;font-weight:600;margin-left:12px">Support reclaim</span>' + bar(90) + bar(70)) +
      '<div style="display:flex;gap:10px;margin-bottom:14px">' + ['Xora read', 'Volume', 'Order book'].map((x) => '<div class="card" style="flex:none;width:200px;padding:14px"><p class="lbl" style="margin:0">' + x + '</p>' + bar(80) + bar(55) + '</div>').join('') + '</div>' +
      cd('ENTRY CHECKLIST', '<span class="mono" style="font-size:24px">✓ ✓ ✓ ✗</span>' + bar(72, 'var(--up)')) +
      cd('ENGINE STATUS', bar(85) + bar(60)) +
      '<div class="mono" style="height:64px;border-radius:16px;display:grid;place-items:center;font-size:24px;border:2px solid var(--accent);color:var(--accent)">Full AI insights</div></div>';
    this.ph = UI.phone(kit, { left: 1120, top: 140, w: 540, h: 630, title: 'Signals', body: '<div style="position:relative;height:520px;overflow:hidden">' + col + '</div>' }).style;
    this.ml = UI.mockLabel(kit, 1120, 100).style;
    let names = '';
    HK_CARDS.forEach((n) => { names += '<span class="chip hk-n" style="font-size:28px;padding:12px 24px">' + n + '</span>'; });
    kit.stage.append(kit.h('<div>' +
      '<div class="words" style="left:140px;top:200px;width:900px"><p class="kick hk-k">The last lesson of the course</p>' +
      '<h2 class="line hk-t">Read the screen, card by card</h2></div>' +
      '<div style="position:absolute;left:140px;top:470px;width:900px;display:flex;flex-wrap:wrap;gap:14px">' + names + '</div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.hk-k').style; this.t = q('.hk-t'); this.col = q('.hk-col').style; this.kids = [...q('.hk-col').children];
    this.ns = [...kit.stage.querySelectorAll('.hk-n')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.8, pose: 'explain' }, { t: 6.0, pose: 'pointer', flip: true }, { t: 12.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const p = seg(t, 0.4, 1.3);
    this.ph.opacity = eo(p); this.ph.transform = 'translateY(' + lerp(50, 0, eo(p)).toFixed(1) + 'px)';
    this.ml.opacity = 0.9 * eo(seg(t, 1.0, 1.6));
    // scroll through the column in steps, one card at a time
    const stops = [0, 0, 200, 340, 420, 500, 520];
    let y = 0;
    for (let i = 1; i < stops.length; i++) y = lerp(y, stops[i], eio(seg(t, 5.6 + (i - 1) * 1.2, 6.4 + (i - 1) * 1.2)));
    this.col.transform = 'translateY(' + (-y).toFixed(1) + 'px)';
    // cards wholly outside the phone window are hidden
    for (const e of this.kids) { const top = e.offsetTop - y, bot = top + e.offsetHeight; e.style.opacity = bot < 8 || top > 512 ? 0 : 1; }
    this.ns.forEach((s, i) => {
      const a = 5.6 + i * 1.2, on = seg(t, a, a + 0.4);
      s.opacity = (eo(seg(t, 1.6 + i * 0.25, 2.0 + i * 0.25)) * (0.45 + 0.55 * eo(on))).toFixed(3);
      s.borderColor = on > 0 ? 'var(--main)' : '';
      s.color = on > 0 ? 'var(--main)' : '';
    });
    this.tutor.render(t);
  },
});
