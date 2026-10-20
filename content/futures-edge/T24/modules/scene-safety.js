const { seg, eo, ei, eob, eio, lerp } = kit;
const SF_POS = [[140, 290], [930, 290], [140, 535], [930, 535]];
kit.scene('safety', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const card = (i, kick, inner) => '<div class="glass sf-c" style="left:' + SF_POS[i][0] + 'px;top:' + SF_POS[i][1] + 'px;width:760px;height:225px;padding:18px 28px"><p class="kick" style="margin:0 0 8px">' + kick + '</p>' + inner + '</div>';
    const c0 = '<svg width="700" height="150" viewBox="0 0 700 150"><line x1="0" x2="700" y1="112" y2="112" stroke-width="3" stroke-dasharray="10 8" style="stroke:var(--down)"/><text x="6" y="140" style="fill:var(--down);font-size:22px" class="mono">STOP</text>' +
      '<path class="sf-ln" fill="none" stroke-width="4" style="stroke:var(--main)"/><circle cx="60" cy="70" r="8" style="fill:var(--second)"/><text x="76" y="62" style="fill:var(--second);font-size:22px" class="mono">ENTRY</text></svg>' +
      '<span class="pill sf-sc" style="position:absolute;right:28px;top:84px;color:#ffb547;background:#0b0f1c">No stop placed? → Safety close</span>';
    const slot = (n, c) => '<span class="sf-sl" style="display:inline-flex;align-items:center;justify-content:center;width:150px;height:64px;border-radius:16px;font-size:28px;font-weight:700;border:2px solid ' + c + '">' + n + '</span>';
    const c1 = '<div style="display:flex;align-items:center;gap:14px;margin-top:10px">' + slot('SOL', 'var(--main)') + slot('BTC', 'var(--main)') +
      '<span class="sf-et" style="display:inline-flex;align-items:center;justify-content:center;width:150px;height:64px;border-radius:16px;font-size:28px;font-weight:700;border:2px dashed color-mix(in srgb, var(--second) 40%, transparent)">ETH</span>' +
      '<span class="mono" style="font-size:28px;margin-left:10px">2 / 2</span></div><p class="sf-w" style="margin:12px 0 0;font-size:28px;font-weight:600;color:#ffb547">ETH waits for a free slot · one trade per coin</p>';
    const c2 = '<div style="display:flex;align-items:baseline;justify-content:space-between"><span style="font-size:28px">Today\'s losses</span><span class="mono sf-dv" style="font-size:36px"></span></div>' +
      '<div style="height:22px;border-radius:11px;margin:12px 0;background:color-mix(in srgb, var(--second) 10%, transparent);overflow:hidden"><i class="sf-bar" style="display:block;height:100%;width:0;background:linear-gradient(90deg, #ffb547, var(--down))"></i></div>' +
      '<p class="sf-pz" style="margin:0;font-size:28px;font-weight:700;color:var(--down)">New entries paused until 00:00 IST</p>';
    const row = (a, b, c) => '<div class="sf-k" style="display:flex;align-items:center;gap:14px;font-size:27px"><b class="sf-t" style="width:30px;color:' + c + '">✓</b><span style="flex:1">' + a + '</span><span class="mono" style="font-size:24px;color:' + c + '">' + b + '</span></div>';
    const c3 = '<div style="display:flex;flex-direction:column;gap:6px">' + row('Futures trading', 'ENABLED', 'var(--up)') + row('Withdrawals', 'DISABLED', 'var(--up)') + row('IP whitelist', 'ON', 'var(--up)') + row('Secret ••••••••', 'ENCRYPTED', 'var(--main)') + '</div>';
    kit.stage.append(kit.h('<div>' + card(0, 'A stop on every trade', c0) + card(1, 'Concurrent trades · one per coin', c1) + card(2, 'Daily stop loss · limit 5 USDT', c2) + card(3, 'API key · for Live only', c3) + '</div>'));
    this.head = UI.head(kit, 'Safety settings', 'Guard rails, not guarantees');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.cs = all('.sf-c').map((e) => e.style); this.ln = q('.sf-ln'); this.sc = q('.sf-sc').style;
    this.et = q('.sf-et').style; this.w = q('.sf-w').style; this.sl = all('.sf-sl').map((e) => e.style);
    this.dv = q('.sf-dv'); this.bar = q('.sf-bar').style; this.pz = q('.sf-pz').style;
    this.ks = all('.sf-k').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 7.8, pose: 'checklist' }, { t: 16.0, pose: 'typing' }, { t: 22.5, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    const starts = [0.6, 7.8, 11.0, 16.0];
    this.cs.forEach((s, i) => { UI.rise(kit, s, t, starts[i], 0.6, 30); });
    // Card 1: price wiggles above the stop line.
    let d = '';
    const end = Math.min(1, seg(t, 1.0, 4.0));
    for (let i = 0; i <= 50 * end; i++) { const s = i / 50, x = 60 + s * 620, y = 70 - 30 * Math.sin(s * 5) * s - 10 * Math.sin(s * 17); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
    this.ln.setAttribute('d', d || 'M60 70');
    UI.rise(kit, this.sc, t, 4.0, 0.5, 12);
    // Card 2: two slots full, ETH bounces.
    this.sl.forEach((s, i) => { const p = seg(t, 8.4 + i * 0.4, 8.8 + i * 0.4); s.background = 'color-mix(in srgb, var(--main) ' + Math.round(26 * eo(p)) + '%, transparent)'; });
    const b = seg(t, 9.4, 10.4);
    this.et.transform = 'translateX(' + (lerp(60, 0, eo(seg(t, 9.0, 9.4))) + (b > 0 && b < 1 ? -Math.sin(b * Math.PI * 3) * 14 * (1 - b) : 0)).toFixed(1) + 'px)';
    this.et.opacity = eo(seg(t, 9.0, 9.4));
    UI.rise(kit, this.w, t, 10.0, 0.5, 10);
    // Card 3: losses 2 + 3 = 5 USDT reach the limit.
    const loss = 2 * eio(seg(t, 11.8, 12.6)) + 3 * eio(seg(t, 13.0, 13.8));
    UI.set(this.dv, '−' + loss.toFixed(2) + ' / 5.00');
    this.bar.width = (loss / 5 * 100).toFixed(1) + '%';
    const pz = seg(t, 14.0, 14.5);
    this.pz.opacity = eo(pz); this.pz.transform = 'scale(' + lerp(0.9, 1, eob(pz, 1.6)).toFixed(3) + ')'; this.pz.transformOrigin = '0 50%';
    // Card 4: checks.
    this.ks.forEach((s, i) => { const a = 16.6 + i * 0.9; s.opacity = (0.35 + 0.65 * eo(seg(t, a, a + 0.4))).toFixed(3); });
    this.tutor.render(t);
  },
});
