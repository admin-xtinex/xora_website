const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TR_OPTS = [['A', 'Market order', 'Buys now, near 60,000'], ['B', 'Limit order', 'Waits for 59,500 · may never fill'], ['C', 'Stop order', 'Fills at market after a trigger']];
const TR_CD = 7.4, TR_ANS = 12.4;
kit.scene('try', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ring = UI.ring(kit, 'tr-ring', 1500, 470);
    let opts = '';
    TR_OPTS.forEach((o, i) => {
      opts += '<div class="glass tr-o" style="left:140px;top:' + (530 + i * 84) + 'px;width:1100px;height:72px;padding:0 30px;display:flex;align-items:center;gap:22px;border-radius:20px">' +
        '<span class="mono" style="width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:24px;border:2px solid color-mix(in srgb, var(--second) 40%, transparent)">' + o[0] + '</span>' +
        '<span style="width:300px;font-size:32px;font-weight:700">' + o[1] + '</span><span class="tr-fb" style="font-size:28px;color:color-mix(in srgb, var(--second) 75%, var(--ground))">' + o[2] + '</span></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:1000px"><p class="kick tr-k">Your turn</p>' +
      '<h2 class="line tr-t">Pause and choose</h2></div>' +
      '<div class="glass tr-q" style="left:140px;top:340px;width:1100px;padding:28px 38px"><p class="fict" style="margin:0 0 10px">Scenario · fictional prices</p>' +
      '<p class="def" style="margin:0">BTC is at <b>60,000 USDT</b>. You want to buy only if it drops to <b>59,500</b>, and you are happy to wait. Which order type fits?</p></div>' +
      opts +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.ring.html +
      '<text class="tr-hint" x="1500" y="640" text-anchor="middle" style="fill:color-mix(in srgb, var(--second) 65%, var(--ground));font-size:28px">Hint: who sets the price?</text></svg>' +
      '<div class="glass tr-w" style="left:1300px;top:340px;width:440px;padding:28px 32px;border-color:var(--accent)"><p class="kick" style="margin:0 0 12px;color:var(--accent)">Also allowed</p>' +
      '<p style="margin:0;font-size:32px;line-height:1.35;font-weight:700">WAIT</p><p style="margin:6px 0 0;font-size:28px;line-height:1.4">No order at all. NO_TRADE is always a valid choice.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.tr-k').style; this.t = q('.tr-t'); this.q = q('.tr-q').style; this.hint = q('.tr-hint').style; this.w = q('.tr-w').style;
    this.os = all('.tr-o').map((e) => e.style); this.fb = all('.tr-fb').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.5, pose: 'present' }, { t: TR_CD, pose: 'think' }, { t: TR_ANS, pose: 'celebrate' }, { t: 18.6, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.q, t, 0.8);
    const ans = seg(t, TR_ANS, TR_ANS + 0.5);
    this.os.forEach((s, i) => {
      UI.rise(s, t, 3.0 + i * 0.4);
      const right = i === 1;
      s.borderColor = right ? 'color-mix(in srgb, var(--main) ' + (22 + 78 * eo(ans)).toFixed(0) + '%, transparent)' : '';
      s.background = right && ans > 0 ? 'color-mix(in srgb, var(--ground) ' + (100 - 22 * eo(ans)).toFixed(1) + '%, var(--main))' : '';
      if (!right) s.opacity = (+s.opacity * lerp(1, 0.55, eo(ans))).toFixed(3);
      this.fb[i].opacity = eo(seg(t, TR_ANS + 0.4 + i * 0.5, TR_ANS + 0.9 + i * 0.5));
      this.fb[i].color = right ? 'var(--main)' : '';
    });
    const show = eo(seg(t, TR_CD - 0.6, TR_CD)) * (1 - ei(seg(t, TR_ANS, TR_ANS + 0.4)));
    this.ring.render(t, TR_CD, 5, show);
    this.hint.opacity = eo(seg(t, 9.0, 9.5)) * (1 - ei(seg(t, TR_ANS, TR_ANS + 0.4)));
    UI.rise(this.w, t, 18.7);
    this.tutor.render(t);
  },
});
