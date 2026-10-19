const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Nine funding times (3 a day for 3 days) at a fictional +0.01%: 0.10 USDT each on 1,000 notional, 1.00 on 10,000.
const FA_T0 = 5.4, FA_STEP = 0.55, FA_X0 = 420, FA_DX = 140;
kit.scene('fundadd', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let dots = '', days = '';
    for (let i = 0; i < 9; i++) dots += '<span class="fa-dot" style="position:absolute;left:' + (FA_X0 + i * FA_DX - 16) + 'px;top:384px;width:32px;height:32px;border-radius:50%;border:3px solid var(--main);box-sizing:border-box"></span>';
    for (let d = 0; d < 3; d++) days += '<p class="kick" style="position:absolute;left:' + (FA_X0 + d * 3 * FA_DX - 16) + 'px;top:336px;margin:0;font-size:20px">Day ' + (d + 1) + '</p>';
    const row = (cls, top, label) => '<div class="glass ' + cls + '" style="left:140px;top:' + top + 'px;width:1500px;height:96px;padding:0 30px;display:flex;align-items:center;gap:24px">' +
      '<span style="width:330px;flex:none;white-space:nowrap;font-size:28px;font-weight:600">' + label + '</span><span style="font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">paid so far</span>' +
      '<span class="mono ' + cls + '-v" style="margin-left:auto;font-size:44px;color:var(--accent)">0.00</span><span style="font-size:26px">USDT</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick fa-k">Funding adds up</p>' +
      '<h2 class="line fa-t" style="font-size:72px">Small payments, many times</h2></div>' +
      '<div style="position:absolute;left:' + (FA_X0 - 30) + 'px;top:398px;width:' + (8 * FA_DX + 60) + 'px;height:4px;border-radius:2px;background:color-mix(in srgb, var(--second) 14%, transparent)"></div>' +
      days + dots + '<p class="fa-lab" style="position:absolute;left:140px;top:382px;margin:0;font-size:26px;font-weight:600">Funding times</p>' +
      row('fa-a', 460, '1,000 USDT notional') + row('fa-b', 574, '10,000 USDT notional') +
      '<p class="fict fa-f" style="position:absolute;left:140px;top:690px;margin:0">Fictional rate +0.01%, long · real rates change every period and can be much higher</p>' +
      '<div class="glass fa-m" style="left:1140px;top:160px;width:640px;padding:18px 28px;border-color:var(--accent)"><p style="margin:0;font-size:26px;line-height:1.35;font-weight:600">Each payment comes out of your <span style="color:var(--accent)">margin balance</span>.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.fa-k').style; this.t = q('.fa-t'); this.dots = all('.fa-dot').map((e) => e.style); this.lab = q('.fa-lab').style;
    this.rows = [q('.fa-a').style, q('.fa-b').style]; this.va = q('.fa-a-v'); this.vb = q('.fa-b-v'); this.f = q('.fa-f').style; this.m = q('.fa-m').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'writing' }, { t: 0.6, pose: 'explain' }, { t: 5.0, pose: 'checklist' }, { t: 11.1, pose: 'magnify' }, { t: 16.6, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.lab.opacity = eo(seg(t, 1.0, 1.5));
    this.dots.forEach((s, i) => {
      s.opacity = eo(seg(t, 1.2 + i * 0.08, 1.6 + i * 0.08));
      const hit = seg(t, FA_T0 + i * FA_STEP, FA_T0 + i * FA_STEP + 0.3);
      s.background = hit > 0 ? 'var(--accent)' : 'transparent';
      s.borderColor = hit > 0 ? 'var(--accent)' : 'var(--main)';
      s.transform = 'scale(' + (1 + 0.35 * Math.sin(Math.PI * hit)).toFixed(3) + ')';
    });
    UI.rise(kit, this.rows[0], t, 4.4, 0.6);
    UI.rise(kit, this.rows[1], t, 11.1, 0.6);
    let n = 0; for (let i = 0; i < 9; i++) if (t >= FA_T0 + i * FA_STEP + 0.15) n++;
    UI.set(this.va, n ? '−' + UI.fmt(n * 0.1, 2) : '0.00');
    const nb = Math.round(9 * eo(seg(t, 11.6, 13.4)));
    UI.set(this.vb, nb ? '−' + UI.fmt(nb, 2) : '0.00');
    this.f.opacity = 0.9 * eo(seg(t, 12.0, 12.6));
    UI.rise(kit, this.m, t, 16.6, 0.7);
    this.tutor.render(t);
  },
});
