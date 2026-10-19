const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const FE_ROWS = [['Fee = position value × fee rate', 1.4, ''], ['Position value = amount × price', 3.8, ''], ['0.01 × 60,000 = 600 USDT', 14.4, 'var(--second)'], ['600 × 0.05% = 0.30 USDT', 16.2, 'var(--main)']];
kit.scene('fee', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let rows = '';
    FE_ROWS.forEach((r, i) => {
      rows += (i === 2 ? '<p class="fict fe-ex" style="margin:16px 0 4px">Example · fictional numbers</p>' : '') +
        '<p class="mono fe-r" style="margin:0;padding:10px 0;font-size:' + (i < 2 ? 28 : 32) + 'px' + (r[2] ? ';color:' + r[2] : ';color:color-mix(in srgb, var(--second) 75%, var(--ground))') + '">' + r[0] + '</p>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick fe-k">Cost 1</p>' +
      '<h2 class="line fe-t">Trading fees</h2></div>' +
      '<div class="glass fe-def" style="left:140px;top:340px;width:820px;padding:28px 36px"><p class="def" style="margin:0">A <b>trading fee</b> is charged each time an order fills, as a percentage of the <b>position value</b>: amount × price.</p></div>' +
      '<div class="glass fe-an" style="left:140px;top:590px;width:820px;padding:26px 36px"><p class="kick" style="margin:0 0 10px;color:var(--accent)">Everyday version</p>' +
      '<p style="margin:0;font-size:32px;line-height:1.4;font-weight:600">A booking fee on a ticket: paid every time, whether the trip goes well or not.</p></div>' +
      '<div class="glass fe-calc" style="left:1040px;top:210px;width:640px;padding:24px 34px">' + rows + '</div>' +
      '<div class="glass fe-w" style="left:1040px;top:560px;width:640px;padding:22px 34px"><p class="fict" style="margin:0 0 6px">Example account balance</p>' +
      '<p class="mono fe-bal" style="margin:0;font-size:48px"></p>' +
      '<div style="display:flex;gap:14px;margin-top:12px"><span class="chip fe-c1" style="font-size:24px;padding:8px 18px;border-color:var(--accent)">Entry fee −0.30</span><span class="chip fe-c2" style="font-size:24px;padding:8px 18px;border-color:var(--accent)">Exit fee −0.30</span></div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.fe-k').style; this.t = q('.fe-t'); this.def = q('.fe-def').style; this.an = q('.fe-an').style; this.calc = q('.fe-calc').style;
    this.rows = all('.fe-r').map((e) => e.style); this.ex = q('.fe-ex').style; this.w = q('.fe-w').style; this.bal = q('.fe-bal'); this.c1 = q('.fe-c1').style; this.c2 = q('.fe-c2').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.5, pose: 'explain' }, { t: 7.4, pose: 'idea' }, { t: 14.1, pose: 'point', flip: true }, { t: 18.2, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.def, t, 0.6);
    UI.rise(this.an, t, 7.5);
    UI.rise(this.calc, t, 1.0);
    this.rows.forEach((s, i) => { const a = FE_ROWS[i][1]; s.opacity = eo(seg(t, a, a + 0.4)); s.transform = 'translateX(' + lerp(20, 0, eo(seg(t, a, a + 0.5))).toFixed(1) + 'px)'; });
    this.ex.opacity = eo(seg(t, 14.2, 14.6));
    UI.rise(this.w, t, 17.6);
    const f1 = eio(seg(t, 18.4, 19.0)), f2 = eio(seg(t, 19.8, 20.4));
    UI.txt(this.bal, UI.fmt(1000 - 0.3 * f1 - 0.3 * f2, 2) + ' USDT');
    this.bal.style.color = f1 > 0 ? 'color-mix(in srgb, var(--accent) ' + (60 * (Math.sin(Math.PI * seg(t, 18.4, 19.2)) + Math.sin(Math.PI * seg(t, 19.8, 20.6)))).toFixed(0) + '%, var(--second))' : 'var(--second)';
    UI.rise(this.c1, t, 18.4, { dy: 14 }); UI.rise(this.c2, t, 19.8, { dy: 14 });
    this.tutor.render(t);
  },
});
