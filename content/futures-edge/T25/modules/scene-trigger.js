const { seg, eo, ei, eob, eio, lerp, clamp01 } = kit;
// The trigger candle (index 24) forms from t = 0.8 and closes at 11.8; price passes 60,120 at about t = 3.6.
const TG_K = [[0.8, 60110], [2.0, 60100], [3.6, 60125], [5.0, 60160], [7.0, 60190], [9.0, 60150], [11.8, 60170]];
const TG_CK = ['Data is fresh', 'Still at support', 'Movement agrees', 'Within your settings'];
kit.scene('trigger', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ch = UI.chart(kit, 'tg', { cap: 25 });
    const D = UI.D;
    this.ch.under.innerHTML = UI.band(60000, 60060, 'var(--up)');
    this.ch.ov.innerHTML = '<g>' + UI.hline(60120, 'var(--main)', '10 7') + '</g><text x="170" y="' + (D.y(60120) - 10).toFixed(1) + '" class="mono" style="fill:var(--main);font-size:23px">TRIGGER 60,120</text>' +
      '<g>' + UI.hline(59940, 'var(--down)', '10 7') + '</g><text x="170" y="' + (D.y(59940) - 10).toFixed(1) + '" class="mono" style="fill:var(--down);font-size:23px">STOP 59,940</text>' +
      '<circle class="tg-fl" cx="' + D.x(24) + '" cy="' + D.y(60120).toFixed(1) + '" r="20" fill="none" stroke-width="4" style="stroke:var(--main)"/>';
    let ck = '';
    TG_CK.forEach((c) => { ck += '<div class="tg-k" style="display:flex;align-items:center;gap:14px;padding:6px 0"><b class="up" style="font-size:30px;width:30px">✓</b><span style="font-size:28px">' + c + '</span></div>'; });
    kit.stage.append(kit.h('<div>' +
      '<div class="glass tg-a" style="left:1230px;top:290px;width:470px;padding:18px 28px;border-color:var(--main)"><p class="kick" style="margin:0 0 6px">Triggered at 60,120</p><p style="margin:0 0 6px;font-size:27px;font-weight:600">Every check runs again:</p>' + ck +
      '<p class="tg-ok" style="margin:8px 0 0;font-size:27px;font-weight:700;color:var(--up)">Ready: you approve, or auto approval enters</p></div>' +
      '<div class="glass tg-b" style="left:1230px;top:290px;width:470px;padding:20px 28px;border-color:#ffb547"><p class="kick" style="margin:0 0 8px;color:#ffb547">No trigger by the close?</p><p style="margin:0;font-size:28px;line-height:1.4;font-weight:600">The plan expires. No trade. A fresh plan is made at the close.</p></div></div>'));
    this.head = UI.head(kit, 'Step 7 · the next candle', 'At the trigger');
    const q = (s) => kit.stage.querySelector(s);
    this.fl = q('.tg-fl').style; this.a = q('.tg-a').style; this.b = q('.tg-b').style; this.ok = q('.tg-ok').style;
    this.ks = [...kit.stage.querySelectorAll('.tg-k')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'candles' }, { t: 4.0, pose: 'cheer' }, { t: 6.4, pose: 'checklist' }, { t: 12.9, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    const tt = Math.min(t, 11.8);
    let hi = 60110, lo = 60110;
    for (let s = 0.8; s <= tt + 1e-6; s += 0.1) { const v = UI.path(TG_K, s); hi = Math.max(hi, v); lo = Math.min(lo, v); }
    const live = [60110, hi, lo, t > 0.8 ? UI.path(TG_K, tt) : 60110];
    live.live = t < 11.8;
    this.ch.render(t, 1, t > 0.8 ? live : null);
    const f = seg(t, 3.6, 4.6);
    this.fl.opacity = (f > 0 && f < 1 ? 1 - f : 0).toFixed(3);
    this.fl.transformBox = 'fill-box'; this.fl.transformOrigin = 'center'; this.fl.transform = 'scale(' + lerp(0.6, 2.4, f).toFixed(3) + ')';
    UI.rise(kit, this.a, t, 4.0, 0.6, 20, 12.6, 13.1);
    this.ks.forEach((s, i) => UI.rise(kit, s, t, 7.2 + i * 0.8, 0.4, 8));
    this.ok.opacity = eo(seg(t, 10.6, 11.1));
    UI.rise(kit, this.b, t, 13.2, 0.6, 20);
    this.tutor.render(t);
  },
});
