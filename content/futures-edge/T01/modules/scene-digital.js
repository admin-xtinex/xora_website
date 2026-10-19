const { seg, eo, eob, eio, lerp, TextFx } = kit;
const DG_OUT = [['Bank balance', 1150, 290], ['Game coins', 1090, 470], ['Airline miles', 1150, 650]];
const DG_IN = [['BTC', 1345, 470], ['ETH', 1430, 560]];
kit.scene('digital', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const chip = (txt, x, y, cls, extra) => '<span class="chip ' + cls + '" style="position:absolute;left:' + x + 'px;top:' + y + 'px;transform:translate(-50%,-50%);font-size:26px;padding:12px 22px;' + (extra || '') + '">' + txt + '</span>';
    let chips = '';
    DG_OUT.forEach((c) => { chips += chip(c[0], c[1], c[2], 'dg-o'); });
    DG_IN.forEach((c) => { chips += chip(c[0], c[1], c[2], 'dg-i mono', 'background:var(--main);color:var(--ground);border-color:var(--main)'); });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<circle class="dg-big" cx="1290" cy="450" r="300" pathLength="1" stroke-width="3" style="fill:color-mix(in srgb, var(--main) 5%, transparent);stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
      '<circle class="dg-small" cx="1385" cy="510" r="135" pathLength="1" stroke-width="4" style="fill:color-mix(in srgb, var(--main) 12%, transparent);stroke:var(--main)"/>' +
      '<text class="dg-bl" x="1290" y="200" text-anchor="middle" style="fill:var(--second);font-size:30px;font-weight:700">Digital assets</text>' +
      '<text class="dg-sl" x="1385" y="418" text-anchor="middle" style="fill:var(--main);font-size:24px;font-weight:700">Cryptocurrency</text></svg>' +
      chips +
      '<div class="words" style="left:140px;top:200px;width:740px"><p class="kick dg-k">A bigger family</p>' +
      '<h2 class="line dg-t">Digital assets</h2>' +
      '<p class="def dg-d" style="margin-top:6px">A <b>digital asset</b> is anything of value that exists only as digital records.</p>' +
      '<p class="sub dg-s">Cryptocurrency is one kind of digital asset. Not every digital asset is crypto.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.dg-k').style; this.t = q('.dg-t'); this.d = q('.dg-d'); this.s = q('.dg-s');
    this.big = q('.dg-big'); this.small = q('.dg-small'); this.bl = q('.dg-bl').style; this.sl = q('.dg-sl').style;
    this.outs = [...kit.stage.querySelectorAll('.dg-o')].map((e) => e.style);
    this.ins = [...kit.stage.querySelectorAll('.dg-i')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 1.4, pose: 'present' }, { t: 8.2, pose: 'idea' }, { t: 11.2, pose: 'explain' }],
      says: [{ t0: 11.4, t1: 15.6, text: 'Crypto lives inside this bigger family.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 1.0, { stagger: 0.06 });
    this.big.setAttribute('stroke-dasharray', eio(seg(t, 1.4, 2.6)) + ' 1');
    this.big.style.opacity = eo(seg(t, 1.3, 1.8));
    this.bl.opacity = eo(seg(t, 2.2, 2.7));
    this.outs.forEach((s, i) => {
      const a = 3.0 + i * 0.7, p = seg(t, a, a + 0.6);
      s.opacity = eo(p);
      s.transform = 'translate(-50%,-50%) translateY(' + lerp(26, 0, eo(p)) + 'px) translateY(' + (Math.sin((t + i) * 1.7) * 3).toFixed(2) + 'px)';
    });
    this.small.setAttribute('stroke-dasharray', eio(seg(t, 7.8, 8.8)) + ' 1');
    this.small.style.opacity = eo(seg(t, 7.7, 8.1));
    this.sl.opacity = eo(seg(t, 8.6, 9.1));
    this.ins.forEach((s, i) => {
      const a = 9.0 + i * 0.4, p = seg(t, a, a + 0.6);
      s.opacity = eo(seg(t, a, a + 0.3));
      s.transform = 'translate(-50%,-50%) scale(' + lerp(0.4, 1, eob(p, 1.8)) + ')';
    });
    TextFx.fadeFromRight(this.s, t, 9.8, { stagger: 0.06 });
    this.tutor.render(t);
  },
});
