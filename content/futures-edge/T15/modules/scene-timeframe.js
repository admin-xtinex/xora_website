const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TF_X0 = 200, TF_PPM = 80, tfY = (p) => 552 - (p - 59900) / 290 * 84;
const TF_ST = [[0, 1], [6.6, 5], [8.8, 15]];
const DY_ST = [[0, 1], [12.6, 7], [14.2, 28]];
kit.scene('timeframe', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'tf-c', 19);
    let cells = '', tl = '', days = '';
    for (const n of [1, 5, 15]) for (let i = 0; i < 15; i += n) cells += '<rect class="tf-cell tf-n' + n + '" x="' + (TF_X0 + i * TF_PPM + 3) + '" y="456" width="' + (n * TF_PPM - 6) + '" height="104" rx="12" stroke-width="2" style="fill:color-mix(in srgb, var(--main) 6%, transparent);stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>';
    for (let m = 0; m <= 15; m += 5) tl += '<text x="' + (TF_X0 + m * TF_PPM) + '" y="596" text-anchor="middle" class="axis">' + UI.hm(m) + '</text>';
    const DX = 42;
    for (const n of [1, 7, 28]) for (let i = 0; i < 28; i += n) days += '<rect class="dy-cell dy-n' + n + '" x="' + (TF_X0 + i * DX + 3) + '" y="660" width="' + (n * DX - 6) + '" height="40" rx="8" style="fill:color-mix(in srgb, var(--accent) ' + (n === 1 ? 30 : n === 7 ? 40 : 50) + '%, var(--ground))"/>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + cells + tl + this.cd.html + days + '</svg>' +
      '<p class="tf-lab mono" style="position:absolute;left:1440px;top:476px;margin:0;font-size:30px;line-height:1.3;color:var(--main)"></p>' +
      '<p class="dy-lab" style="position:absolute;left:1440px;top:662px;margin:0;font-size:28px;font-weight:600;color:var(--accent)"></p>' +
      '<p class="fict dy-f" style="position:absolute;left:200px;top:718px;margin:0">A diary · 28 days · same days, summed up differently</p>' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick tf-k">Definition</p>' +
      '<h2 class="line tf-t">What is a timeframe?</h2>' +
      '<p class="def tf-d" style="margin-top:6px">A <b>timeframe</b> is how much time each candle covers.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.tf-k').style; this.t = q('.tf-t'); this.d = q('.tf-d'); this.lab = q('.tf-lab'); this.dlab = q('.dy-lab'); this.df = q('.dy-f').style;
    this.cells = { 1: all('.tf-n1'), 5: all('.tf-n5'), 15: all('.tf-n15') };
    this.days = { 1: all('.dy-n1'), 7: all('.dy-n7'), 28: all('.dy-n28') };
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.5, pose: 'explain' }, { t: 4.4, pose: 'point', flip: true }, { t: 10.2, pose: 'think' }, { t: 15.9, pose: 'present' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.8, { stagger: 0.07 });
    const st = UI.tfState(TF_ST, t), on = eo(seg(t, 4.2, 4.8));
    for (const n of [1, 5, 15]) {
      const w = n === st.n ? st.p : n === st.prev ? 1 - st.p : 0;
      this.cells[n].forEach((r, i) => { r.style.opacity = (n === 1 && st.n === 1 ? eo(seg(t, 4.4 + i * 0.08, 4.8 + i * 0.08)) : w * on).toFixed(3); });
    }
    UI.tfAll(this.cd, st, TF_X0, TF_PPM, tfY, eo(seg(t, 5.0, 5.6)));
    UI.txt(this.lab, st.n + 'm chart\n' + (15 / st.n) + (st.n === 15 ? ' candle' : ' candles'));
    this.lab.style.whiteSpace = 'pre'; this.lab.style.opacity = on;
    const ds = UI.tfState(DY_ST, t), don = eo(seg(t, 10.4, 11.0));
    for (const n of [1, 7, 28]) {
      const w = n === ds.n ? ds.p : n === ds.prev ? 1 - ds.p : 0;
      this.days[n].forEach((r, i) => { r.style.opacity = (n === 1 && ds.n === 1 ? eo(seg(t, 10.4 + i * 0.05, 10.8 + i * 0.05)) : w * don).toFixed(3); });
    }
    UI.txt(this.dlab, ds.n === 1 ? 'Daily notes' : ds.n === 7 ? 'Weekly summaries' : 'Monthly summary');
    this.dlab.style.opacity = don; this.df.opacity = 0.9 * don;
    this.tutor.render(t);
  },
});
