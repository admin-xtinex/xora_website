const { seg, eo, ei, eob, eio, lerp } = kit;
kit.scene('movement', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ch = UI.chart(kit, 'mv', { vol: true });
    const D = UI.D;
    this.ch.ov.innerHTML = '<line class="mv-avg" x1="' + D.X0 + '" x2="' + D.X1 + '" y1="' + (740 - 0.58 * 40).toFixed(1) + '" y2="' + (740 - 0.58 * 40).toFixed(1) + '" stroke-width="2.5" stroke-dasharray="8 6" style="stroke:#ffb547"/><text x="' + (D.X1 + 16) + '" y="' + (740 - 0.58 * 40 + 8).toFixed(1) + '" class="mv-at mono" style="fill:#ffb547;font-size:22px">avg</text>';
    const meter = (cls, k, a, b) => '<div class="glass ' + cls + '" style="left:1230px;width:460px;padding:16px 28px"><p class="kick" style="margin:0 0 10px">' + k + '</p>' +
      '<div style="height:20px;border-radius:10px;background:color-mix(in srgb, var(--second) 10%, transparent);overflow:hidden;position:relative"><i class="' + cls + '-b" style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:10px"></i></div>' +
      '<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:24px;color:color-mix(in srgb, var(--second) 64%, var(--ground))"><span>' + a + '</span><span>' + b + '</span></div></div>';
    kit.stage.append(kit.h('<div>' + meter('mv-m1', 'Momentum · e.g. RSI', 'weak', 'strong') + meter('mv-m2', 'Pressure', 'sellers', 'buyers') + meter('mv-m3', 'Volume · vs usual', 'quiet', 'busy') + '</div>'));
    this.head = UI.head(kit, 'Step 4 · movement', 'Is there push behind it?');
    const q = (s) => kit.stage.querySelector(s);
    [['m', 290, 1], ['p', 425, 2], ['v', 560, 3]].forEach((k) => { const st = q('.mv-m' + k[2]).style; st.top = k[1] + 'px'; this[k[0]] = st; this[k[0] + 'b'] = q('.mv-m' + k[2] + '-b').style; });
    this.avg = q('.mv-avg').style; this.at = q('.mv-at').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'candles' }, { t: 7.2, pose: 'magnify' }, { t: 14.2, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ch.render(t);
    UI.rise(kit, this.m, t, 1.6, 0.6, 20); UI.rise(kit, this.p, t, 7.6, 0.6, 20); UI.rise(kit, this.v, t, 10.4, 0.6, 20);
    const mm = lerp(0.3, 0.68, eio(seg(t, 2.6, 5.0))) + 0.02 * Math.sin(t * 3);
    this.mb.width = (mm * 100).toFixed(1) + '%'; this.mb.background = 'linear-gradient(90deg, var(--main), var(--accent))';
    const pp = lerp(0.5, 0.66, eio(seg(t, 8.4, 10.0))) + 0.015 * Math.sin(t * 2.4);
    this.pb.width = '100%'; this.pb.background = 'linear-gradient(90deg, var(--down) 0%, var(--down) ' + ((1 - pp) * 100).toFixed(1) + '%, var(--up) ' + ((1 - pp) * 100).toFixed(1) + '%, var(--up) 100%)';
    const vv = lerp(0.35, 0.8, eio(seg(t, 11.2, 12.6)));
    this.vb.width = (vv * 100).toFixed(1) + '%'; this.vb.background = '#ffb547';
    this.avg.opacity = eo(seg(t, 10.8, 11.4)); this.at.opacity = this.avg.opacity;
    this.tutor.render(t);
  },
});
