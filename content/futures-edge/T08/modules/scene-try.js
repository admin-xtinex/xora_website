const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TY_TILES = [['Risk', '5 USDT', '500 × 0.01', 'var(--accent)', 13.2], ['Reward', '10 USDT', '1,000 × 0.01', 'var(--main)', 14.8], ['Ratio', '1 : 2', '10 ÷ 5, before fees', 'var(--second)', 18.3]];
const TY_CD = 7.0, TY_ANS = 13.1;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ring = UI.ring(kit, 'ty-ring', 1500, 470);
    let tiles = '';
    TY_TILES.forEach((d, i) => {
      tiles += '<div class="glass ty-tl" style="left:' + (140 + i * 380) + 'px;top:550px;width:350px;padding:22px 28px">' +
        '<p class="kick" style="margin:0 0 6px;color:' + d[3] + '">' + d[0] + '</p>' +
        '<div style="position:relative;height:64px"><p class="mono ty-q" style="position:absolute;margin:0;font-size:52px;color:color-mix(in srgb, var(--second) 40%, var(--ground))">?</p>' +
        '<p class="mono ty-a" style="position:absolute;margin:0;font-size:52px;color:' + d[3] + '">' + d[1] + '</p></div>' +
        '<p class="mono ty-s" style="margin:6px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + d[2] + '</p></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1000px"><p class="kick ty-k">Your turn</p>' +
      '<h2 class="line ty-t">Pause and work it out</h2></div>' +
      '<div class="glass ty-qc" style="left:140px;top:330px;width:1110px;padding:26px 38px"><p class="fict" style="margin:0 0 10px">Question · fictional prices</p>' +
      '<p class="def" style="margin:0">Long <b>0.01 BTC</b> at <b>60,000</b>. Stop-loss <b>59,500</b>. Take-profit <b>61,000</b>. Find the risk, the reward and the ratio.</p></div>' +
      tiles +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.ring.html +
      '<text class="ty-hint" x="1500" y="640" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 65%, var(--ground));font-size:28px">Hint: distance × 0.01</text></svg>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.ty-k').style; this.t = q('.ty-t'); this.qc = q('.ty-qc').style; this.hint = q('.ty-hint').style;
    this.tl = all('.ty-tl').map((e) => e.style); this.qs = all('.ty-q').map((e) => e.style); this.as = all('.ty-a').map((e) => e.style); this.ss = all('.ty-s').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: TY_CD, pose: 'think' }, { t: TY_ANS, pose: 'checklist' }, { t: 18.3, pose: 'celebrate' }],
      says: [{ t0: 1.0, t1: 6.2, text: 'Pause if you need more time.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.qc, t, 0.8);
    this.tl.forEach((s, i) => {
      UI.rise(s, t, 3.0 + i * 0.3);
      const a = TY_TILES[i][4], p = seg(t, a, a + 0.5);
      this.qs[i].opacity = 1 - eo(p);
      this.as[i].opacity = eo(p); this.as[i].transform = 'scale(' + lerp(0.8, 1, eob(p, 1.7)) + ')'; this.as[i].transformOrigin = '0 50%';
      this.ss[i].opacity = eo(seg(t, a + 0.4, a + 0.8));
      s.borderColor = p > 0 ? 'color-mix(in srgb, ' + TY_TILES[i][3] + ' ' + (22 + 50 * eo(p)).toFixed(0) + '%, transparent)' : '';
    });
    const show = eo(seg(t, TY_CD - 0.6, TY_CD)) * (1 - ei(seg(t, TY_ANS - 0.6, TY_ANS - 0.2)));
    this.ring.render(t, TY_CD, 5, show);
    this.hint.opacity = eo(seg(t, 8.6, 9.1)) * (1 - ei(seg(t, TY_ANS - 0.6, TY_ANS - 0.2)));
    this.tutor.render(t);
  },
});
