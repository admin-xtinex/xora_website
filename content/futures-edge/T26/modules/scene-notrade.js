const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A choppy range, checks that disagree, and the app's No trade answer.
const NT_X0 = 180, NT_X1 = 900, NT_Y = (p) => 510 - (p - 60000) * 0.6; // 60,000 at y 560
kit.scene('notrade', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const r = kit.rng(44); this.pts = []; let v = 0;
    for (let i = 0; i <= 80; i++) { v += (r() - 0.5) * 60; v *= 0.75; this.pts.push(60010 + Math.sin(i / 4.2) * 150 + v); }
    const hl = (p, col, lab) => '<line x1="' + NT_X0 + '" x2="' + NT_X1 + '" y1="' + NT_Y(p).toFixed(1) + '" y2="' + NT_Y(p).toFixed(1) + '" stroke-dasharray="12 8" stroke-width="2.5" style="stroke:' + col + '"/>' +
      '<text x="' + NT_X1 + '" y="' + (NT_Y(p) + (p > 60000 ? -12 : 32)).toFixed(1) + '" text-anchor="end" class="mono" style="fill:' + col + ';font-size:22px">' + lab + '</text>';
    const body = '<div class="card"><p class="card-h">TRADE OPPORTUNITY</p>' +
      '<p style="margin:0;font-size:26px;font-weight:600;line-height:1.35;color:var(--main)">No setup right now — watching for a reclaim or reject.</p>' +
      '<div style="position:relative;height:10px;border-radius:5px;margin:22px 0 10px;background:linear-gradient(90deg, var(--up), color-mix(in srgb, var(--second) 20%, transparent), var(--down))"><span class="nt-dot" style="position:absolute;top:-7px;width:24px;height:24px;border-radius:50%;margin-left:-12px;background:var(--second)"></span></div>' +
      '<div style="display:flex;justify-content:space-between" class="mono"><span style="font-size:22px;color:var(--up)">Support 59,800</span><span style="font-size:22px;color:var(--down)">60,250 Resistance</span></div></div>' +
      '<div class="card nt-v" style="margin-top:16px;border-color:color-mix(in srgb, var(--main) 50%, transparent)"><p class="card-h">VERDICT</p>' +
      '<span class="pill" style="color:var(--main);font-size:28px;padding:8px 22px">No trade</span>' +
      '<p class="nt-r" style="margin:14px 0 0;font-size:24px;line-height:1.4">• Score below your minimum</p>' +
      '<p class="nt-r" style="margin:6px 0 0;font-size:24px;line-height:1.4">• Waiting for a reaction at support / resistance, a breakout or a retest</p></div>';
    this.ph = UI.phone(kit, { left: 1100, top: 140, w: 600, h: 630, title: 'BTC/USDT', body }).style;
    this.ml = UI.mockLabel(kit, 1100, 100).style;
    kit.stage.append(kit.h('<div>' +
      '<div class="words" style="left:140px;top:150px;width:880px"><p class="kick nt-k">Uncertainty</p>' +
      '<h2 class="line nt-t">When it is unclear, wait</h2></div>' +
      '<div class="glass nt-c" style="left:140px;top:340px;width:880px;height:350px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="nt-g">' + hl(60250, 'var(--down)', 'resistance 60,250') + hl(59800, 'var(--up)', 'support 59,800') +
      '<path class="nt-l" fill="none" stroke-width="4.5" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="nt-d" r="9" style="fill:var(--second)"/></g></svg>' +
      '<div class="chip nt-ch" style="position:absolute;left:140px;top:712px;font-size:28px;padding:14px 26px"><span class="dot"></span>No trade = no loss. Waiting is a decision.</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.nt-k').style; this.t = q('.nt-t'); this.c = q('.nt-c').style; this.g = q('.nt-g').style; this.l = q('.nt-l'); this.d = q('.nt-d');
    this.dot = q('.nt-dot').style; this.v = q('.nt-v').style; this.rs = [...kit.stage.querySelectorAll('.nt-r')].map((e) => e.style); this.ch = q('.nt-ch').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'think' }, { t: 6.0, pose: 'calm' }, { t: 12.4, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(kit, this.c, t, 0.4, 0.6, 20);
    this.g.opacity = eo(seg(t, 0.6, 1.2));
    const n = Math.max(1, Math.min(80, Math.floor((t - 0.6) * 9)));
    const P = this.pts.slice(0, n + 1);
    this.l.setAttribute('d', P.map((p, i) => (i ? 'L' : 'M') + lerp(NT_X0, NT_X1 - 40, i / 80).toFixed(1) + ' ' + NT_Y(p).toFixed(1)).join(' '));
    const last = P[P.length - 1];
    this.d.setAttribute('cx', lerp(NT_X0, NT_X1 - 40, (P.length - 1) / 80).toFixed(1)); this.d.setAttribute('cy', NT_Y(last).toFixed(1));
    const p = seg(t, 2.0, 2.9);
    this.ph.opacity = eo(p); this.ph.transform = 'translateY(' + (lerp(50, 0, eo(p)) - t * 0.8).toFixed(1) + 'px)';
    this.ml.opacity = 0.9 * eo(seg(t, 2.6, 3.2));
    this.dot.left = (((last - 59800) / 450) * 100).toFixed(1) + '%';
    UI.rise(kit, this.v, t, 6.2, 0.6, 20);
    this.rs.forEach((s, i) => { s.opacity = eo(seg(t, 7.4 + i * 1.2, 7.9 + i * 1.2)); });
    const c = seg(t, 12.6, 13.2);
    this.ch.opacity = eo(c); this.ch.transform = 'scale(' + lerp(0.85, 1, eob(c, 1.6)).toFixed(3) + ')'; this.ch.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
