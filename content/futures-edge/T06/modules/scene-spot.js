const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SP_W = [270, 270, 210, 330], SP_L = ['Exit', 'Entry', 'Quantity', 'Gross result'], SP_O = ['−', '×', '='];
const SP_ROWS = [{ v: ['61,200', '60,000', '0.05'], r: 60, at: 6.4, top: 410 }, { v: ['59,400', '60,000', '0.05'], r: -30, at: 13.4, top: 590 }];
kit.scene('spot', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (R, i) => {
      let h = '<div class="sp-row" style="position:absolute;left:140px;top:' + R.top + 'px;display:flex;align-items:center;gap:16px">';
      SP_W.forEach((w, j) => {
        const res = j === 3;
        h += '<div class="sp-tile" style="width:' + w + 'px;height:120px;box-sizing:border-box;border-radius:22px;padding:16px 22px;display:flex;flex-direction:column;justify-content:center;border:2px solid color-mix(in srgb, var(--' + (res ? 'accent' : 'main') + ') 30%, transparent);background:color-mix(in srgb, var(--ground) 88%, var(--main))">' +
          (i === 0 ? '<span class="kick" style="font-size:22px">' + SP_L[j] + '</span>' : '<span class="kick" style="font-size:22px;color:color-mix(in srgb, var(--second) 50%, var(--ground))">' + SP_L[j] + '</span>') +
          '<span class="mono sp-v" style="font-size:44px;margin-top:4px">' + (res ? '' : R.v[j]) + '</span></div>';
        if (j < 3) h += '<span class="mono" style="font-size:48px;color:var(--main)">' + SP_O[j] + '</span>';
      });
      return h + '</div>';
    };
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick sp-k">Spot profit and loss</p>' +
      '<h2 class="line sp-t">(Exit − entry) × quantity</h2>' +
      '<p class="sub sp-s"><span class="hl">Gross</span> means before any fees. All prices in USDT, fictional.</p></div>' +
      row(SP_ROWS[0], 0) + row(SP_ROWS[1], 1) + '</div>'));
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sp-k').style; this.t = q('.sp-t'); this.s = q('.sp-s');
    this.rows = all('.sp-row').map((e) => e.style);
    this.tiles = all('.sp-tile').map((e) => e.style); this.vals = all('.sp-v');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'writing' }, { t: 6.4, pose: 'point', flip: true }, { t: 9.2, pose: 'thumbs' }, { t: 13.4, pose: 'explain' }, { t: 16.4, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1, { stagger: 0.08 });
    TextFx.fadeFromRight(this.s, t, 13.4, { stagger: 0.05 });
    SP_ROWS.forEach((R, i) => {
      const a = i === 0 ? 1.2 : R.at - 0.4, p = seg(t, a, a + 0.6);
      this.rows[i].opacity = eo(p); this.rows[i].transform = 'translateY(' + lerp(30, 0, eo(p)).toFixed(1) + 'px)';
      for (let j = 0; j < 4; j++) {
        const tile = this.tiles[i * 4 + j], v = this.vals[i * 4 + j];
        const fill = R.at + j * 0.45;
        if (j < 3) {
          v.style.opacity = i === 0 ? eo(seg(t, fill, fill + 0.3)) : 1;
          tile.borderColor = t > fill && t < fill + 0.8 ? 'var(--main)' : '';
        } else {
          const c = seg(t, R.at + 1.5, R.at + 2.5), val = lerp(0, R.r, eo(c));
          const txt = t < R.at + 1.5 ? '?' : UI.sgn(val, 2);
          if (v.textContent !== txt) v.textContent = txt;
          v.style.color = t < R.at + 1.5 ? 'color-mix(in srgb, var(--second) 40%, var(--ground))' : R.r > 0 ? 'var(--main)' : 'var(--accent)';
          tile.borderColor = t > R.at + 2.5 ? (R.r > 0 ? 'var(--main)' : 'var(--accent)') : '';
        }
      }
    });
    this.tutor.render(t);
  },
});
