const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// A small waterfall: +4 gross, −3 entry fee, −3 exit fee → −2 net. 1 USDT = 26 px; zero line at y 200.
const QA3_Z = 200, QA3_K = 26;
const QA3_BARS = [['Gross', 0, 4, 'var(--main)'], ['Entry fee', 4, 1, 'var(--accent)'], ['Exit fee', 1, -2, 'var(--accent)'], ['Net', 0, -2, 'var(--accent)']];
kit.scene('q-net', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let bars = '';
    QA3_BARS.forEach((b, i) => {
      const x = 40 + i * 128, top = QA3_Z - Math.max(b[1], b[2]) * QA3_K, h = Math.abs(b[2] - b[1]) * QA3_K;
      bars += '<div class="qa3-b" style="position:absolute;left:' + x + 'px;top:' + top + 'px;width:84px;height:' + h + 'px;border-radius:8px;background:' + b[3] + '"></div>' +
        '<p class="qa3-l" style="position:absolute;left:' + (x - 20) + 'px;width:124px;top:' + (QA3_Z + 94) + 'px;margin:0;text-align:center;font-size:22px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + b[0] + '</p>' +
        '<p class="mono qa3-v" style="position:absolute;left:' + (x - 20) + 'px;width:124px;top:' + (top - 34) + 'px;margin:0;text-align:center;font-size:24px">' + (i === 0 ? '+4' : i === 3 ? '?' : '−3') + '</p>';
    });
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Fees in USDT</p>' +
      '<div style="position:absolute;left:24px;right:24px;top:' + QA3_Z + 'px;height:2px;background:color-mix(in srgb, var(--second) 40%, transparent)"></div>' + bars +
      '<p class="fict" style="position:absolute;right:24px;top:24px;margin:0">Fictional</p>';
    this.quiz = UI.quiz(kit, {
      n: 3, from: 'T06 · T09', q: 'Gross +4 USDT. Fees: 3 to enter, 3 to exit. Net result?',
      opts: ['+10 USDT', '+4 USDT', '−2 USDT', '+1 USDT'],
      ok: 2, bad: 1, vis,
      why: 'Net = gross − all fees: 4 − 3 − 3 = −2 USDT.',
      whyNot: '+4 is the gross result. Fees are paid win or lose.',
    });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.bars = all('.qa3-b').map((e) => e.style); this.ls = all('.qa3-l').map((e) => e.style); this.vs = all('.qa3-v');
  },
  render(t) {
    this.chrome(t);
    const at = [1.6, 2.4, 3.2, 7.7];
    this.bars.forEach((s, i) => {
      const p = seg(t, at[i], at[i] + 0.5), up = QA3_BARS[i][2] > QA3_BARS[i][1];
      s.transformOrigin = up ? '50% 100%' : '50% 0%';
      s.transform = 'scaleY(' + eo(p).toFixed(3) + ')';
      s.opacity = p > 0 ? 1 : 0;
      this.ls[i].opacity = i === 3 ? eo(seg(t, 1.6, 2.0)) : eo(p);
      this.vs[i].style.opacity = i === 3 ? eo(seg(t, 1.6, 2.0)) : eo(p);
    });
    UI.set(this.vs[3], t < 7.7 ? '?' : '−2');
    this.vs[3].style.color = t < 7.7 ? 'var(--second)' : 'var(--accent)';
    this.vs[3].style.top = (t < 7.7 ? QA3_Z - 34 : QA3_Z + 2 * QA3_K + 4) + 'px';
    
    this.quiz(t);
  },
});
