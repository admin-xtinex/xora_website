const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TRY_R = 90, TRY_C = 2 * Math.PI * TRY_R;
// Asks: [price, amount, result text, filled?]
const TY_A = [[60010, 0.05, 'fill 0.05 = 3,000.50', 1], [60015, 0.10, 'fill 0.05 = 3,000.75', 1], [60030, 0.20, 'above the limit', 0]];
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    TY_A.forEach((a) => {
      rows += '<div class="ty-r" style="display:flex;align-items:center;gap:22px;height:66px;padding:0 18px;border-radius:12px">' +
        '<span class="mono" style="width:130px;font-size:32px;color:var(--accent)">' + UI.fmt(a[0]) + '</span><span class="mono" style="width:90px;font-size:30px">' + a[1].toFixed(2) + '</span>' +
        '<span class="ty-n" style="flex:1;text-align:right;font-size:24px;font-weight:700;color:' + (a[3] ? 'var(--main)' : 'var(--accent)') + '">' + (a[3] ? '✓ ' : '✕ ') + a[2] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:860px"><p class="kick tr-k">Your turn</p>' +
      '<h2 class="line tr-t">Match the buy order</h2></div>' +
      '<div class="glass tr-q" style="left:140px;top:380px;width:820px;padding:28px 38px"><p class="fict" style="margin:0 0 12px">Question · fictional prices</p>' +
      '<p class="def" style="margin:0">A buyer wants <b>0.10 BTC</b> and will pay up to <b>60,015 USDT</b>. Which sell orders fill it, and what is the total cost?</p></div>' +
      '<div class="glass tr-a" style="left:140px;top:640px;width:820px;padding:20px 38px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 76%, var(--main))">' +
      '<p class="mono" style="margin:0;font-size:34px">3,000.50 + 3,000.75 = <span style="color:var(--main)">6,001.25 USDT</span></p></div>' +
      '<div class="glass tr-b" style="left:1040px;top:190px;width:700px;padding:20px 22px"><p class="kick" style="margin:0 0 6px 18px;color:var(--accent)">Sell orders (asks)</p>' +
      '<div style="display:flex;gap:22px;padding:0 18px 8px;font-size:22px;font-weight:600;color:color-mix(in srgb, var(--second) 60%, var(--ground))"><span style="width:130px">Price</span><span>BTC</span></div>' + rows + '</div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="tr-ring" transform="translate(1380 600)">' +
      '<circle r="' + TRY_R + '" fill="none" stroke-width="12" style="stroke:color-mix(in srgb, var(--second) 10%, transparent)"/>' +
      '<circle class="tr-arc" r="' + TRY_R + '" fill="none" stroke-width="12" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="' + TRY_C.toFixed(1) + '" style="stroke:var(--main)"/>' +
      '<g class="tr-pause"><rect x="-24" y="-32" width="16" height="64" rx="4" style="fill:var(--second)"/><rect x="8" y="-32" width="16" height="64" rx="4" style="fill:var(--second)"/></g>' +
      '<text class="tr-n mono" y="24" text-anchor="middle" style="fill:var(--second);font-size:68px"></text></g></svg>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)].map((e) => e.style);
    this.k = q('.tr-k').style; this.t = q('.tr-t'); this.qc = q('.tr-q').style; this.a = q('.tr-a').style; this.bk = q('.tr-b').style;
    this.rows = all('.ty-r'); this.ns = all('.ty-n');
    this.ring = q('.tr-ring').style; this.arc = q('.tr-arc'); this.pause = q('.tr-pause').style; this.n = q('.tr-n');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: 3.6, pose: 'think' }, { t: 9.0, pose: 'pointer', flip: true }, { t: 15.2, pose: 'cheer' }, { t: 17.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const qp = seg(t, 0.6, 1.3), bp = seg(t, 1.0, 1.7);
    this.qc.opacity = eo(qp); this.qc.transform = 'translateY(' + lerp(30, 0, eo(qp)) + 'px)';
    this.bk.opacity = eo(bp); this.bk.transform = 'translateX(' + lerp(40, 0, eo(bp)) + 'px)';
    this.ring.opacity = eo(seg(t, 3.0, 3.6)) * (1 - ei(seg(t, 8.8, 9.3)));
    this.arc.setAttribute('stroke-dashoffset', (TRY_C * seg(t, 3.6, 8.6)).toFixed(1));
    UI.set(this.n, t < 3.6 ? '' : String(Math.min(5, Math.max(0, Math.ceil(5 - (t - 3.6))))));
    this.pause.opacity = t < 3.6 ? 1 : 0;
    TY_A.forEach((a, i) => {
      const at = 9.2 + i * 1.4, p = seg(t, at, at + 0.5);
      this.ns[i].opacity = eo(p);
      this.rows[i].background = a[3] ? 'color-mix(in srgb, var(--main) ' + (eo(p) * 14).toFixed(1) + '%, transparent)' : 'transparent';
      this.rows[i].opacity = a[3] ? 1 : lerp(1, 0.55, eo(p));
    });
    const a = seg(t, 15.2, 15.9);
    this.a.opacity = eo(a);
    this.a.transform = 'scale(' + lerp(0.92, 1, eob(a, 1.6)) + ')';
    this.a.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
