const { seg, eo, eob, eio, lerp, TextFx } = kit;
const TICK_ROWS = [['BTC', 'Bitcoin', 64250.5], ['ETH', 'Ether', 3120.4], ['SOL', 'Solana', 148.62], ['XRP', 'XRP', 0.5821]];
kit.scene('ticker', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    TICK_ROWS.forEach((r, i) => {
      rows += '<div class="ticker-row" style="display:flex;align-items:center;gap:18px;padding:22px 26px;border-radius:20px">' +
        '<span style="width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:18px;font-weight:700;background:color-mix(in srgb, var(--main) ' + (i ? 14 : 30) + '%, var(--ground))">' + r[0][0] + '</span>' +
        '<span style="display:flex;flex-direction:column;flex:1"><b style="font-size:28px">' + r[0] + '<span style="color:color-mix(in srgb, var(--second) 50%, var(--ground));font-weight:500"> / USDT</span></b><span style="font-size:20px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">' + r[1] + '</span></span>' +
        '<span class="mono ticker-p" style="font-size:28px">' + UI.fmt(r[2], r[2] < 10 ? 4 : r[2] < 1000 ? 2 : 1) + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:250px;width:820px"><p class="kick tk-k">You have probably seen this</p>' +
      '<h2 class="line tk-t">A price that never sits still</h2>' +
      '<p class="sub tk-s">BTC keeps moving on the screen. But what is BTC, really?</p></div>' +
      '<div class="glass tk-phone" style="left:1000px;top:130px;width:460px;height:660px;border-radius:56px;padding:40px 22px">' +
      '<div style="width:120px;height:8px;border-radius:8px;margin:0 auto 34px;background:color-mix(in srgb, var(--second) 18%, transparent)"></div>' +
      '<p style="margin:0 16px 6px;font-size:30px;font-weight:700">Markets</p><p class="fict" style="margin:0 16px 22px">Fictional prices</p>' +
      '<div style="display:flex;flex-direction:column;gap:6px">' + rows + '</div></div></div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tk-k').style; this.t = q('.tk-t'); this.s = q('.tk-s'); this.phone = q('.tk-phone').style;
    this.rows = [...kit.stage.querySelectorAll('.ticker-row')].map((e) => e.style);
    this.ps = [...kit.stage.querySelectorAll('.ticker-p')];
    const r = kit.rng(21); this.series = TICK_ROWS.map((row) => { const out = []; let p = row[2]; for (let i = 0; i < 40; i++) { p *= 1 + (r() - 0.5) * 0.004; out.push(p); } return out; });
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'present' }, { t: 0.6, pose: 'think' }, { t: 4.2, pose: 'point', flip: true }, { t: 8.6, pose: 'explain' }],
      says: [{ t0: 8.8, t1: 13.6, text: 'By the end of this lesson, you will know.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 2.6, { stagger: 0.07 });
    const p = seg(t, 0.4, 1.3);
    this.phone.opacity = eo(p);
    this.phone.transform = 'translateY(' + (lerp(60, 0, eo(p)) - t * 1.5).toFixed(2) + 'px)';
    const i = Math.max(0, Math.min(39, Math.floor(t * 2)));
    this.ps.forEach((el, k) => {
      const v = this.series[k][i], prev = this.series[k][Math.max(0, i - 1)];
      const txt = UI.fmt(v, v < 10 ? 4 : v < 1000 ? 2 : 1);
      if (el.textContent !== txt) el.textContent = txt;
      el.style.color = v >= prev ? 'var(--main)' : 'var(--accent)';
    });
    const hl = seg(t, 4.2, 4.8);
    this.rows[0].background = 'color-mix(in srgb, var(--main) ' + (eo(hl) * 16).toFixed(1) + '%, transparent)';
    this.rows[0].outline = hl > 0 ? '2px solid color-mix(in srgb, var(--main) ' + (eo(hl) * 60).toFixed(0) + '%, transparent)' : 'none';
    this.rows[0].transform = 'scale(' + lerp(1, 1.04, eob(hl, 1.6)) + ')';
    this.tutor.render(t);
  },
});
