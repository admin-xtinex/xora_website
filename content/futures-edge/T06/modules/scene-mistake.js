const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Gross +4.00, fees 3.00 and 3.002, net -2.00 (30 px per USDT, zero line at y 520).
const MK_K = 30, MK_Z = 520, MK_X = [1050, 1185, 1320, 1455], MK_W = 96;
const MK_Y = (v) => MK_Z - v * MK_K;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const cols = [['Gross', 'var(--main)'], ['Entry fee', 'var(--accent)'], ['Exit fee', 'var(--accent)'], ['Net', 'var(--accent)']];
    let svg = '<line x1="1020" x2="1580" y1="' + MK_Z + '" y2="' + MK_Z + '" style="stroke:color-mix(in srgb, var(--second) 40%, transparent);stroke-width:2"/><text x="1596" y="' + (MK_Z + 8) + '" class="mono" style="fill:color-mix(in srgb, var(--second) 55%, var(--ground));font-size:22px">0</text>';
    cols.forEach((c, i) => {
      svg += '<rect class="mk-bar" x="' + MK_X[i] + '" width="' + MK_W + '" rx="6" style="fill:' + c[1] + '"/>' +
        '<text class="mk-val mono" x="' + (MK_X[i] + MK_W / 2) + '" text-anchor="middle" style="fill:' + c[1] + ';font-size:26px"></text>' +
        '<text class="mk-lab" x="' + (MK_X[i] + MK_W / 2) + '" y="680" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 75%, var(--ground));font-size:24px;font-weight:600">' + c[0] + '</text>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:820px"><p class="kick mk-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line mk-t">Gross is not net</h2>' +
      '<p class="sub mk-s">Long 0.1 BTC, 60,000 → 60,040. Fees 0.05% per side.</p></div>' +
      '<div class="glass mk-c1" style="left:140px;top:460px;width:820px;padding:20px 30px"><p class="kick" style="margin:0 0 6px">Correction</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">Net = gross − entry fee − exit fee. <span class="hv">A gross win can be a net loss.</span></p></div>' +
      '<div class="glass mk-c2" style="left:140px;top:630px;width:820px;padding:20px 30px"><p class="kick" style="margin:0 0 6px">Also</p><p style="margin:0;font-size:30px;line-height:1.4;font-weight:600">An open, unrealized profit is not yours until you close.</p></div>' +
      '<svg class="art" viewBox="0 0 1920 1080"><text x="1020" y="250" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">USDT · fictional example</text>' + svg + '</svg>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.mk-k').style; this.t = q('.mk-t'); this.s = q('.mk-s'); this.c1 = q('.mk-c1').style; this.c2 = q('.mk-c2').style;
    this.bars = all('.mk-bar'); this.vals = all('.mk-val'); this.labs = all('.mk-lab').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'confused' }, { t: 5.5, pose: 'cheer' }, { t: 11.0, pose: 'think' }, { t: 18.2, pose: 'explain' }],
      says: [{ t0: 6.0, t1: 10.6, text: 'A win?' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 5.5, { stagger: 0.06 });
    const g = 4 * eio(seg(t, 6.6, 7.4)), f1 = 3 * eo(seg(t, 11.4, 12.0)), f2 = 3.002 * eo(seg(t, 12.6, 13.2)), n = -2.002 * eio(seg(t, 14.0, 14.8));
    const set = (i, a, b, txt, ty, on) => {
      const bar = this.bars[i], v = this.vals[i];
      bar.setAttribute('y', Math.min(MK_Y(a), MK_Y(b)).toFixed(1)); bar.setAttribute('height', Math.abs(MK_Y(a) - MK_Y(b)).toFixed(1)); bar.style.opacity = on ? 1 : 0;
      v.setAttribute('y', ty.toFixed(1)); if (v.textContent !== txt) v.textContent = txt; v.style.opacity = on ? 1 : 0;
      this.labs[i].opacity = eo(seg(t, 5.8, 6.3));
    };
    set(0, 0, g, '+' + g.toFixed(2), MK_Y(g) - 14, t > 6.6);
    set(1, 4, 4 - f1, '−' + f1.toFixed(2), MK_Y(4) - 14, t > 11.4);
    set(2, 1, 1 - f2, '−' + f2.toFixed(2), MK_Y(1) - 14, t > 12.6);
    set(3, 0, n, '−' + Math.abs(n).toFixed(2), MK_Y(n) + 34, t > 14.0);
    const a = seg(t, 15.0, 15.6), b = seg(t, 18.2, 18.8);
    this.c1.opacity = eo(a); this.c1.transform = 'translateY(' + lerp(24, 0, eo(a)).toFixed(1) + 'px)';
    this.c2.opacity = eo(b); this.c2.transform = 'translateY(' + lerp(24, 0, eo(b)).toFixed(1) + 'px)';
    this.tutor.render(t);
  },
});
