const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// Trade Settings mock: the confidence threshold slider (50 → 70 → 45 → 50) and the three entry modes.
const ST_V = [[0, 50], [8.2, 50], [9.6, 70], [13.4, 70], [14.6, 45], [19.6, 45], [20.4, 50]];
const stVal = (t) => { let v = ST_V[0][1]; for (let i = 1; i < ST_V.length; i++) { const a = ST_V[i - 1], b = ST_V[i]; if (t >= a[0]) v = lerp(a[1], b[1], eio(clamp01((t - a[0]) / (b[0] - a[0])))); } return v; };
const ST_MODES = [['Basic', 'Opportunity-focused: fewer filters, more chances.'], ['Secure', 'Confirmation-focused: more must agree.'], ['Advanced', 'Basic plus extra filters on chart patterns.']];
kit.scene('setting', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (a, b) => '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 4px;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><span style="font-size:24px">' + a + '</span><span class="mono" style="font-size:24px">' + b + '</span></div>';
    const body = '<div class="card" style="padding:12px 18px">' + row('Capital per trade', '3 USDT') + row('Leverage', '10x') + '</div>' +
      '<div class="card st-th" style="margin-top:14px"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:26px;font-weight:700">Confidence threshold</span><span class="mono st-v" style="font-size:32px;color:var(--main)">50%</span></div>' +
      '<p class="lbl" style="margin:4px 0 18px">Enter only at or above</p>' +
      '<div style="position:relative;height:10px;border-radius:5px;margin:0 14px;background:color-mix(in srgb, var(--second) 14%, transparent)"><div class="st-f" style="height:100%;border-radius:5px;background:var(--main)"></div>' +
      '<span class="st-k" style="position:absolute;top:-12px;width:34px;height:34px;margin-left:-17px;border-radius:50%;background:var(--second);box-shadow:0 0 0 6px color-mix(in srgb, var(--main) 30%, transparent)"></span></div>' +
      '<div class="mono" style="display:flex;justify-content:space-between;margin:16px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 55%, var(--ground))"><span>45</span><span>90</span></div></div>' +
      '<div class="card" style="margin-top:14px"><p class="card-h">ENTRY MODE</p><div style="display:flex;gap:8px">' +
      ST_MODES.map((m) => '<span class="st-m" style="flex:1;text-align:center;padding:12px 0;border-radius:14px;font-size:24px;font-weight:600;border:1.5px solid color-mix(in srgb, var(--second) 20%, transparent)">' + m[0] + '</span>').join('') + '</div></div>';
    this.ph = UI.phone(kit, { left: 1120, top: 140, w: 580, h: 630, title: 'Trade Settings', body }).style;
    this.ml = UI.mockLabel(kit, 1120, 100).style;
    const panel = (cls, inner) => '<div class="glass ' + cls + '" style="left:140px;top:400px;width:880px;min-height:330px;padding:28px 36px">' + inner + '</div>';
    kit.stage.append(kit.h('<div>' +
      '<div class="words" style="left:140px;top:170px;width:900px"><p class="kick st-kk">Your setting</p>' +
      '<h2 class="line st-t">Your confidence threshold</h2></div>' +
      panel('st-p1', '<p class="kick" style="margin:0 0 14px">Enter only at or above</p><p class="def" style="margin:0">XORA takes a setup only when its score reaches <b>your minimum</b>. The default is <b>50%</b>.</p>' +
        '<p class="sub st-p1s" style="margin:18px 0 0;font-size:30px">From 50% up, XORA uses several indicators for confirmation. Set it higher, and more must agree: fewer, stricter trades.</p>') +
      panel('st-p2', '<p class="kick" style="margin:0 0 14px;color:var(--warn)">45% is special</p><p class="def" style="margin:0">45% does <b>not</b> mean 45% confidence.</p>' +
        '<p class="sub" style="margin:18px 0 0;font-size:30px">At 45%, XORA looks for chart-pattern setups, passed through several filters, instead of the score route.</p>') +
      panel('st-p3', '<p class="kick" style="margin:0 0 18px">Entry modes · different filters</p>' +
        ST_MODES.map((m) => '<p class="st-md" style="margin:0 0 14px;font-size:30px;line-height:1.35"><b style="color:var(--main)">' + m[0] + '</b> · ' + m[1] + '</p>').join('') +
        '<p class="lbl" style="margin:8px 0 0;color:var(--warn)">No mode is a guarantee.</p>') + '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.st-kk').style; this.t = q('.st-t');
    this.p1 = q('.st-p1').style; this.p1s = q('.st-p1s'); this.p2 = q('.st-p2').style; this.p3 = q('.st-p3').style;
    this.v = q('.st-v'); this.f = q('.st-f').style; this.kn = q('.st-k').style; this.th = q('.st-th').style;
    this.ms = all('.st-m').map((e) => e.style); this.mds = all('.st-md').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.8, pose: 'laptop' }, { t: 7.0, pose: 'pointer', flip: true }, { t: 13.6, pose: 'idea' }, { t: 20.4, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const p = seg(t, 0.3, 1.2);
    this.ph.opacity = eo(p); this.ph.transform = 'translateY(' + (lerp(50, 0, eo(p)) - t * 0.5).toFixed(1) + 'px)';
    this.ml.opacity = 0.9 * eo(seg(t, 1.0, 1.6));
    UI.rise(kit, this.p1, t, 1.2, 0.6, 24, 13.2, 13.7);
    TextFx.fadeFromRight(this.p1s, t, 7.2, { stagger: 0.05 });
    UI.rise(kit, this.p2, t, 13.8, 0.6, 24, 20.0, 20.5);
    UI.rise(kit, this.p3, t, 20.6, 0.6, 24);
    const v = stVal(t), x = (v - 45) / 45 * 100;
    this.f.width = x.toFixed(2) + '%'; this.kn.left = x.toFixed(2) + '%';
    UI.set(this.v, Math.round(v) + '%');
    const sp = t > 13.6 && t < 20.4 ? 1 : 0;
    this.v.style.color = sp ? 'var(--warn)' : 'var(--main)';
    this.th.borderColor = t > 0.4 && t < 20.4 ? 'color-mix(in srgb, var(--main) 55%, transparent)' : '';
    // modes light up in turn while they are read out
    this.ms.forEach((s, i) => {
      const a = 21.4 + i * 1.8, h = t > a ? 1 : 0, sel = i === 0 && t < 21.4 ? 1 : 0;
      const on = Math.max(sel, h && (t < a + 1.8 || i === 2) ? 1 : 0);
      s.background = on ? 'color-mix(in srgb, var(--main) 28%, transparent)' : 'transparent';
      s.borderColor = on ? 'var(--main)' : 'color-mix(in srgb, var(--second) 20%, transparent)';
    });
    this.mds.forEach((s, i) => { const a = 21.2 + i * 1.8; s.opacity = eo(seg(t, a, a + 0.5)); });
    this.tutor.render(t);
  },
});
