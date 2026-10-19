const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SJ_PV = [60000, 60180, 60120, 60150, 60040, 60200, 60150, 60170, 60060, 60240];
const SJ = [['Person 1 · big swings only', ['', 'H', '', '', 'L', 'HH', '', '', 'HL', ''], 'Reads: uptrend', 'var(--up)', 1.0], ['Person 2 · every wiggle', ['', 'H', 'L', 'LH', 'LL', 'HH', 'HL', 'LH', 'LL', ''], 'Reads: mixed', 'var(--main)', 6.0]];
kit.scene('subjective', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let svg = '', html = '', tags = '';
    this.sws = [];
    SJ.forEach((s, k) => {
      const x = 140 + k * 780, yOf = (p) => 690 - (p - 59980) / 300 * 270;
      const w = UI.swing(kit, 'sj-s' + k, { pv: SJ_PV, x0: x + 70, dx: 68, yOf, lab: s[1], t0: s[4], t1: s[4] + 3.4, conf: false, wig: 3, fs: 20 });
      this.sws.push(w);
      html += '<div class="glass sj-p" style="left:' + x + 'px;top:330px;width:750px;height:420px"><p class="kick" style="position:absolute;left:28px;top:20px;margin:0">' + s[0] + '</p></div>' +
        '<p class="chip sj-r" style="position:absolute;left:' + (x + 28) + 'px;top:676px;margin:0;font-size:26px;padding:8px 20px;border-color:' + s[3] + ';color:' + s[3] + '">' + s[2] + '</p>';
      svg += w.html; tags += w.tags;
    });
    kit.stage.append(kit.h('<div class="ground">' + html + '<svg class="art" viewBox="0 0 1920 1080">' + svg + '</svg>' + tags +
      '<p class="chip sj-n" style="position:absolute;left:1000px;top:200px;margin:0;font-size:26px;padding:12px 24px;border-color:var(--accent)">Another timeframe can tell another story</p>' +
      '<div class="words" style="left:140px;top:170px;width:820px"><p class="kick sj-k">Be honest about limits</p>' +
      '<h2 class="line sj-t">A judgement call</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.sj-k').style; this.t = q('.sj-t'); this.ps = all('.sj-p').map((e) => e.style); this.rs = all('.sj-r').map((e) => e.style); this.n = q('.sj-n').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.5, pose: 'think' }, { t: 6.0, pose: 'point', flip: true }, { t: 11.4, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.ps.forEach((s, k) => UI.rise(s, t, 0.6 + k * 4.8));
    this.sws.forEach((w) => w.render(t));
    this.rs.forEach((s, k) => UI.rise(s, t, SJ[k][4] + 3.8, { s: 0.9 }));
    UI.rise(this.n, t, 13.0, { s: 0.9 });
    this.tutor.render(t);
  },
});
