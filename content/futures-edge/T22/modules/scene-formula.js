const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// The sizing formula, then the long and short examples worked step by step, then what the simple model leaves out.
const FM_L = [['Risk amount', '10 USDT', 10.0], ['|60,000 − 59,400| ÷ 60,000', '0.01', 11.2], ['10 ÷ 0.01', '1,000 USDT', 12.4], ['At 60,000, that is about', '0.0167 BTC', 14.0]];
const FM_X = ['Fees', 'Slippage', 'Contract rules', 'Liquidation'];
kit.scene('formula', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (a, b, i) => '<div class="row fm-r" style="padding:6px 0"><span' + (a.indexOf('÷') >= 0 ? ' class="mono" style="font-size:26px"' : '') + '>' + a + '</span><span class="mono' + (i === 2 ? ' hl fm-big' : '') + '" style="font-size:' + (i === 2 ? 40 : 32) + 'px">' + b + '</span></div>';
    this.h = UI.head(kit, 'Allowed notional', 'Size from the risk you accept',
      '<div class="glass fm-f" style="left:140px;top:300px;width:1640px;padding:22px 34px;border-color:var(--main)"><p class="kick" style="margin:0 0 8px">Simple model · before costs</p>' +
      '<p style="margin:0;font-size:44px;font-weight:700;font-family:var(--display)">Allowed notional ≈ <span class="hl">risk amount</span> ÷ ( <span class="hv">|entry − stop|</span> ÷ entry )</p></div>' +
      '<div class="glass fm-a" style="left:140px;top:470px;width:800px;padding:14px 30px"><p class="kick" style="margin:0 0 2px">Long example · fictional</p>' + FM_L.map((r, i) => row(r[0], r[1], i)).join('') + '</div>' +
      '<div class="glass fm-s" style="left:980px;top:470px;width:800px;padding:14px 30px"><p class="kick" style="margin:0 0 2px;color:var(--accent)">Short example · stop 60,300</p>' +
      '<div class="row" style="padding:10px 0"><span class="mono" style="font-size:26px">|60,000 − 60,300| ÷ 60,000</span><span class="mono" style="font-size:32px">0.005</span></div>' +
      '<div class="row" style="padding:10px 0;border:0"><span class="mono" style="font-size:26px">10 ÷ 0.005</span><span class="mono hl" style="font-size:40px">2,000 USDT</span></div></div>' +
      '<div class="fm-x" style="position:absolute;left:980px;top:672px;width:800px;display:flex;flex-wrap:wrap;gap:12px;align-items:center"><span class="kick" style="width:100%;color:var(--accent)">This model ignores</span>' +
      FM_X.map((x) => '<span class="chip fm-c" style="font-size:26px;padding:6px 20px;border-color:var(--accent)">' + x + '</span>').join('') + '</div>');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.f = q('.fm-f').style; this.a = q('.fm-a').style; this.s = q('.fm-s').style; this.rs = all('.fm-r').map((e) => e.style); this.big = q('.fm-big');
    this.x = q('.fm-x').style; this.cs = all('.fm-c').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'idea' }, { t: 4.4, pose: 'present' }, { t: 10.0, pose: 'writing' }, { t: 16.6, pose: 'explain' }, { t: 21.2, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    const fp = seg(t, 4.4, 5.1); this.f.opacity = eo(fp); this.f.transform = 'scale(' + lerp(0.94, 1, eob(fp, 1.6)).toFixed(4) + ')';
    UI.rise(kit, this.a, t, 9.6, 0.6);
    this.rs.forEach((s, i) => UI.rise(kit, s, t, FM_L[i][2], 0.5, 12));
    const n = eo(seg(t, 12.6, 13.6)); UI.set(this.big, UI.fmt(Math.round(1000 * n)) + ' USDT');
    UI.rise(kit, this.s, t, 16.6, 0.6);
    this.x.opacity = eo(seg(t, 21.2, 21.6));
    this.cs.forEach((s, i) => { const a = 21.6 + i * 0.5, p = seg(t, a, a + 0.4); s.opacity = eo(p); s.transform = 'scale(' + lerp(0.8, 1, eob(p, 1.8)).toFixed(3) + ')'; });
    this.tutor.render(t);
  },
});
