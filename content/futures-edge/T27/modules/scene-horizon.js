const { seg, eo, ei, eob, eio, lerp, clamp01, TextFx } = kit;
// One plan per 1-minute candle: a candle forms, its plan expires at the close, a new plan follows. Chart tabs add context.
const HZ_Y = (p) => 560 - (p - 60000) * 1.2, HZ_X = (i) => 230 + i * 70;
const HZ_OLD = [[59880, 59930, 59860, 59920], [59920, 59990, 59900, 59970], [59970, 60010, 59940, 59950], [59950, 60000, 59930, 59990], [59990, 60040, 59970, 60020], [60020, 60050, 59990, 60010]];
const HZ_LIVE = [[60010, 60070, 59995, 60060], [60060, 60090, 60030, 60040]]; // the two candles that form in this scene
const HZ_TABS = ['1m', '5m', '15m', '1h'];
kit.scene('horizon', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const cdl = (c, i, cls) => { const col = c[3] >= c[0] ? 'var(--up)' : 'var(--down)', x = HZ_X(i); return '<g class="' + cls + '"><line class="hz-w" x1="' + x + '" x2="' + x + '" stroke-width="3" style="stroke:' + col + '" y1="' + HZ_Y(c[1]).toFixed(1) + '" y2="' + HZ_Y(c[2]).toFixed(1) + '"/><rect class="hz-b" x="' + (x - 20) + '" width="40" rx="3" style="fill:' + col + '" y="' + HZ_Y(Math.max(c[0], c[3])).toFixed(1) + '" height="' + Math.max(4, HZ_Y(Math.min(c[0], c[3])) - HZ_Y(Math.max(c[0], c[3]))).toFixed(1) + '"/></g>'; };
    let old = '';
    HZ_OLD.forEach((c, i) => { old += cdl(c, i, 'hz-o'); });
    let live = '';
    HZ_LIVE.forEach((c, i) => { live += '<g class="hz-l"><line class="hz-lw" x1="' + HZ_X(6 + i) + '" x2="' + HZ_X(6 + i) + '" stroke-width="3"/><rect class="hz-lb" x="' + (HZ_X(6 + i) - 20) + '" width="40" rx="3"/></g>'; });
    let tabs = '';
    HZ_TABS.forEach((x) => { tabs += '<span class="hz-tab mono" style="padding:8px 20px;border-radius:12px;font-size:24px">' + x + '</span>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick hz-k">Time horizon</p><h2 class="line hz-t">One plan per 1-minute candle</h2></div>' +
      '<div class="glass hz-g" style="left:140px;top:330px;width:900px;height:430px"></div>' +
      '<div class="hz-tabs" style="position:absolute;left:170px;top:350px;display:flex;gap:8px">' + tabs + '</div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="hz-ch">' + old + live +
      '<line class="hz-tr" x1="200" x2="1000" y1="' + HZ_Y(60050) + '" y2="' + HZ_Y(60050) + '" stroke-dasharray="10 8" stroke-width="2.5" style="stroke:var(--up)"/>' +
      '<text class="hz-trl mono" x="1000" y="' + (HZ_Y(60050) - 12) + '" text-anchor="end" style="fill:var(--up);font-size:22px">trigger 60,050</text></g>' +
      '<text x="170" y="740" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">Fictional candles · time compressed</text></svg>' +
      '<div class="glass hz-p" style="left:1100px;top:330px;width:680px;padding:22px 28px"><p class="kick" style="margin:0 0 10px">Current plan</p>' +
      '<p class="hz-pt" style="margin:0;font-size:30px;font-weight:700"></p><p class="hz-pc mono" style="margin:10px 0 0;font-size:26px;color:color-mix(in srgb, var(--second) 70%, var(--ground))"></p></div>' +
      '<div class="glass hz-n" style="left:1100px;top:560px;width:680px;padding:20px 28px;border-color:var(--down)"><p style="margin:0;font-size:30px;font-weight:700;color:var(--down)">✗ No 10–15-minute price prediction</p>' +
      '<p style="margin:6px 0 0;font-size:26px">5m, 15m and 1h charts add context only.</p></div></div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.hz-k').style; this.t = q('.hz-t'); this.g = q('.hz-g').style; this.ch = q('.hz-ch').style;
    this.os = all('.hz-o').map((e) => e.style); this.lw = all('.hz-lw'); this.lb = all('.hz-lb');
    this.tr = q('.hz-tr').style; this.trl = q('.hz-trl').style; this.tabs = all('.hz-tab').map((e) => e.style);
    this.p = q('.hz-p').style; this.pt = q('.hz-pt'); this.pc = q('.hz-pc'); this.n = q('.hz-n').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'think' }, { t: 5.9, pose: 'pointer', flip: true }, { t: 12.1, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.g, t, 0.2, 0.6, 20);
    this.ch.opacity = eo(seg(t, 0.4, 1.0));
    // candle A forms 0.6–5.6, candle B 6.0–11.0 (each stands for one minute)
    const spans = [[0.6, 5.6], [6.0, 11.0]];
    HZ_LIVE.forEach((c, i) => {
      const p = clamp01((t - spans[i][0]) / (spans[i][1] - spans[i][0]));
      const show = t >= spans[i][0];
      const wig = p < 1 ? Math.sin(t * 9) * 12 * (1 - p) : 0;
      const cl = lerp(c[0], c[3], eio(p)) + wig, hi = Math.max(c[0], cl, lerp(c[0], c[1], eo(Math.min(1, p * 1.4)))), lo = Math.min(c[0], cl, lerp(c[0], c[2], eo(Math.min(1, p * 1.6))));
      const col = cl >= c[0] ? 'var(--up)' : 'var(--down)';
      const x = HZ_X(6 + i);
      this.lw[i].setAttribute('y1', HZ_Y(hi).toFixed(1)); this.lw[i].setAttribute('y2', HZ_Y(lo).toFixed(1)); this.lw[i].style.stroke = col;
      const top = HZ_Y(Math.max(c[0], cl)), bot = HZ_Y(Math.min(c[0], cl));
      this.lb[i].setAttribute('y', top.toFixed(1)); this.lb[i].setAttribute('height', Math.max(4, bot - top).toFixed(1));
      this.lb[i].style.fill = p < 1 ? 'color-mix(in srgb, ' + col + ' 40%, var(--ground))' : col; this.lb[i].style.stroke = col;
      this.lw[i].style.opacity = show ? 1 : 0; this.lb[i].style.opacity = show ? 1 : 0;
      void x;
    });
    UI.rise(kit, this.p, t, 0.8, 0.6, 20);
    let pt, pc;
    if (t < 5.6) { pt = 'BUY if price trades above 60,050'; pc = 'Valid for this candle · closes in 0:' + String(Math.max(0, Math.ceil(60 * (1 - (t - 0.6) / 5)))).padStart(2, '0'); }
    else if (t < 6.4) { pt = 'Plan expired'; pc = 'Candle closed · checks run again'; }
    else { pt = 'New plan: No setup right now'; pc = 'Fresh data · next candle'; }
    UI.set(this.pt, pt); UI.set(this.pc, pc);
    this.pt.style.color = t < 5.6 ? 'var(--up)' : t < 6.4 ? 'var(--warn)' : 'var(--main)';
    const tro = t < 5.6 ? 1 : 1 - eo(seg(t, 5.6, 6.0));
    this.tr.opacity = tro * eo(seg(t, 0.8, 1.2)); this.trl.opacity = this.tr.opacity;
    // tabs: 1m active, then cycle 5m, 15m, 1h while the context line is read out
    const act = t < 12.6 ? 0 : 1 + Math.min(2, Math.floor((t - 12.6) / 1.4));
    this.tabs.forEach((s, i) => { s.background = i === act ? 'var(--main)' : 'color-mix(in srgb, var(--second) 8%, transparent)'; s.color = i === act ? 'var(--ground)' : ''; });
    this.os.forEach((s) => { s.opacity = act === 0 ? 1 : 0.5; });
    UI.rise(kit, this.n, t, 14.4, 0.6, 20);
    this.tutor.render(t);
  },
});
