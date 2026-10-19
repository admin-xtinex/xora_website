const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const AN_X = 440, anY = (p) => 770 - (p - 59920) / 220 * 320;
// Bracket segments: [label, math, from, to, at]
const AN_SEG = [['Upper wick', '60,120 − 60,080 = 40', 60080, 60120, 12.9], ['Body', '60,080 − 60,000 = 80', 60000, 60080, 12.4], ['Lower wick', '60,000 − 59,940 = 60', 59940, 60000, 13.4]];
const AN_P = [60120, 60080, 60000, 59940], AN_PN = ['High', 'Close', 'Open', 'Low'];
kit.scene('anatomy', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'an-c', 1);
    let lv = '', br = '';
    AN_P.forEach((p, i) => {
      lv += '<g class="an-lv"><line x1="' + (AN_X - 150) + '" x2="' + (AN_X - 70) + '" y1="' + anY(p).toFixed(1) + '" y2="' + anY(p).toFixed(1) + '" stroke-width="2" stroke-dasharray="4 6" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/>' +
        '<text x="' + (AN_X - 164) + '" y="' + (anY(p) + 9).toFixed(1) + '" text-anchor="end" class="mono" style="fill:var(--second);font-size:26px">' + UI.fmt(p) + '</text>' +
        '<text x="' + (AN_X - 164) + '" y="' + (anY(p) - 18).toFixed(1) + '" text-anchor="end" class="kick" style="fill:color-mix(in srgb, var(--second) 55%, var(--ground));font-size:18px">' + AN_PN[i] + '</text></g>';
    });
    const bracket = (x, y0, y1) => 'M' + x + ' ' + (y0 + 3) + ' h14 V' + (y1 - 3) + ' h-14';
    AN_SEG.forEach((s) => {
      const y0 = anY(s[3]), y1 = anY(s[2]), ym = (y0 + y1) / 2;
      br += '<g class="an-br"><path d="' + bracket(AN_X + 80, y0, y1) + '" pathLength="1" fill="none" stroke-width="3" class="an-bp" style="stroke:var(--main)"/>' +
        '<text x="' + (AN_X + 120) + '" y="' + (ym - 2).toFixed(1) + '" class="kick" style="fill:var(--main);font-size:22px">' + s[0] + '</text>' +
        '<text x="' + (AN_X + 120) + '" y="' + (ym + 32).toFixed(1) + '" class="mono an-m" style="fill:var(--second);font-size:28px">' + s[1] + ' USDT</text></g>';
    });
    const ry0 = anY(60120), ry1 = anY(59940);
    br += '<g class="an-rg"><path d="' + bracket(1080, ry0, ry1) + '" pathLength="1" fill="none" stroke-width="3" class="an-bp" style="stroke:var(--accent)"/>' +
      '<text x="1120" y="' + ((ry0 + ry1) / 2 - 22).toFixed(1) + '" class="kick" style="fill:var(--accent);font-size:22px">Range = high − low</text>' +
      '<text x="1120" y="' + ((ry0 + ry1) / 2 + 22).toFixed(1) + '" class="mono" style="fill:var(--second);font-size:30px">60,120 − 59,940 = 180 USDT</text>' +
      '<text x="1120" y="' + ((ry0 + ry1) / 2 + 66).toFixed(1) + '" style="fill:color-mix(in srgb, var(--second) 65%, var(--ground));font-size:26px">Wicks: 40 + 60 = 100 of the 180</text></g>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + lv + this.cd.html + br + '</svg>' +
      '<div class="words" style="left:140px;top:170px;width:1500px;gap:14px"><p class="kick an-k">Parts of a candle</p>' +
      '<h2 class="line an-t">Body and wicks</h2>' +
      '<p class="def an-d1" style="margin-top:6px">The <b>body</b> is the thick part, between the open and the close.</p>' +
      '<p class="def an-d2">The <b>wicks</b>, or shadows, are thin lines up to the high and down to the low.</p></div>' +
      '<p class="fict" style="position:absolute;left:1120px;top:440px;margin:0">Fictional example · the candle from before</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.an-k').style; this.t = q('.an-t'); this.d1 = q('.an-d1'); this.d2 = q('.an-d2');
    this.lv = all('.an-lv').map((e) => e.style); this.br = all('.an-br').map((e) => e.style); this.bp = all('.an-bp'); this.rg = q('.an-rg').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'cheer' }, { t: 0.5, pose: 'explain' }, { t: 6.2, pose: 'point', flip: true }, { t: 12.4, pose: 'checklist' }, { t: 17.9, pose: 'idea' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d1, t, 0.9, { stagger: 0.05 });
    TextFx.fadeFromRight(this.d2, t, 6.4, { stagger: 0.05 });
    // Body glows while it is named, wicks while they are named.
    const bodyHL = Math.sin(Math.PI * seg(t, 1.6, 4.6)), wickHL = Math.sin(Math.PI * seg(t, 7.0, 10.6));
    this.cd.set(0, { x: AN_X, w: 130, o: 60000, h: 60120, l: 59940, c: 60080, y: anY, op: eo(seg(t, 0.4, 1.0)) });
    const g = kit.stage.querySelector('.an-c-b'), w = kit.stage.querySelector('.an-c-w');
    g.style.filter = bodyHL > 0.01 ? 'drop-shadow(0 0 ' + (bodyHL * 18).toFixed(1) + 'px var(--up))' : 'none';
    w.style.filter = wickHL > 0.01 ? 'drop-shadow(0 0 ' + (wickHL * 14).toFixed(1) + 'px var(--up))' : 'none';
    w.setAttribute('stroke-width', (9 + 5 * wickHL).toFixed(1));
    this.lv.forEach((s, i) => { s.opacity = eo(seg(t, 1.2 + i * 0.25, 1.7 + i * 0.25)); });
    AN_SEG.forEach((sg, i) => {
      const a = sg[4], p = seg(t, a, a + 0.6);
      this.br[i].opacity = eo(seg(t, a, a + 0.3));
      this.bp[i].setAttribute('stroke-dasharray', eio(p) + ' 1');
      this.br[i].transform = 'translateX(' + lerp(16, 0, eo(p)).toFixed(1) + 'px)';
    });
    const r = seg(t, 18.0, 18.7);
    this.rg.opacity = eo(seg(t, 18.0, 18.3)); this.bp[3].setAttribute('stroke-dasharray', eio(r) + ' 1');
    this.tutor.render(t);
  },
});
