const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Fictional: price falls to the 59,800–59,900 area three times and turns up each time.
const SP_K = [[0, 60250], [0.18, 59860], [0.33, 60150], [0.52, 59830], [0.68, 60100], [0.85, 59880], [1, 60200]];
const SP_TOUCH = [0.18, 0.52, 0.85];
const spP = (s) => UI.path(SP_K, s) + Math.sin(s * 83) * 10 * Math.sin(Math.PI * s * 6) ** 2;
const spX = (s) => 1000 + s * 620, spY = (p) => 740 - (p - 59700) / 700 * 400;
const SP_T0 = 1.0, SP_T1 = 11.0;
kit.scene('support', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let tags = '', rings = '';
    SP_TOUCH.forEach((s, i) => {
      tags += '<p class="tag sp-tag" style="left:' + (spX(s) - 52).toFixed(0) + 'px;top:' + (spY(59800) + 14).toFixed(0) + 'px">Test ' + (i + 1) + '</p>';
      rings += '<circle class="sp-ring" cx="' + spX(s).toFixed(1) + '" cy="' + spY(spP(s)).toFixed(1) + '" r="20" fill="none" stroke-width="4" style="stroke:var(--main)"/>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><g class="sp-grid">' + UI.grid(1000, 1620, spY, 59800, 60300, 100) + '</g>' +
      '<rect class="sp-zone" x="1000" y="' + spY(59900).toFixed(1) + '" width="620" height="' + (spY(59800) - spY(59900)).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--main) 20%, transparent);stroke:color-mix(in srgb, var(--main) 70%, transparent);stroke-width:2"/>' +
      '<path class="sp-line" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/><circle class="sp-dot" r="10" style="fill:var(--main)"/>' + rings + '</svg>' + tags +
      '<p class="fict" style="position:absolute;left:1000px;top:300px;margin:0">BTC/USDT · fictional prices</p>' +
      '<p class="tag sp-zl" style="left:1146px;top:' + (spY(59850) - 20).toFixed(0) + 'px;color:var(--main);border-color:var(--main)">Support zone</p>' +
      '<div class="words" style="left:140px;top:160px;width:780px"><p class="kick sp-k">Support</p>' +
      '<h2 class="line sp-t">A floor under price</h2>' +
      '<p class="def sp-d"><b>Support</b> is a price area where falling price has stopped and turned up before.</p>' +
      '<div class="chip sp-c" style="align-self:flex-start"><span class="dot"></span>Like a floor: drop, land, bounce</div></div>' +
      '<div class="glass sp-n" style="left:140px;top:630px;width:780px;padding:22px 32px"><p style="margin:0;font-size:30px;font-weight:600;line-height:1.4">It shows what <span class="hl">happened before</span>. Not what will happen next.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.sp-k').style; this.t = q('.sp-t'); this.d = q('.sp-d'); this.c = q('.sp-c').style; this.n = q('.sp-n').style;
    this.grid = q('.sp-grid').style; this.zone = q('.sp-zone').style; this.zl = q('.sp-zl').style; this.line = q('.sp-line'); this.dot = q('.sp-dot');
    this.tags = all('.sp-tag').map((e) => e.style); this.rings = all('.sp-ring').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 0.5, pose: 'explain' }, { t: 6.6, pose: 'point', flip: true }, { t: 11.2, pose: 'magnify' }, { t: 16.9, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.8, { stagger: 0.05 });
    this.grid.opacity = eo(seg(t, 0.4, 1.0));
    const end = Math.max(0.002, seg(t, SP_T0, SP_T1));
    this.line.setAttribute('d', UI.line(spP, 0, end, spX, spY, 0.004));
    this.dot.setAttribute('cx', spX(end).toFixed(1)); this.dot.setAttribute('cy', spY(spP(end)).toFixed(1));
    // A ring pulses at each touch as the line arrives there.
    SP_TOUCH.forEach((s, i) => {
      const at = SP_T0 + s * (SP_T1 - SP_T0), p = seg(t, at, at + 0.6), stay = seg(t, 11.2 + i * 0.6, 11.7 + i * 0.6);
      this.rings[i].opacity = Math.max(Math.sin(Math.PI * p), eo(stay)).toFixed(3);
      this.rings[i].transformBox = 'fill-box'; this.rings[i].transformOrigin = 'center';
      this.rings[i].transform = 'scale(' + (stay > 0 ? lerp(1.6, 1, eob(stay, 1.5)) : lerp(0.6, 1.6, p)).toFixed(3) + ')';
      UI.rise(this.tags[i], t, 11.2 + i * 0.6, { dy: 14 });
    });
    const z = seg(t, 6.6, 7.4);
    this.zone.opacity = eo(z); this.zone.transformBox = 'fill-box'; this.zone.transformOrigin = 'center'; this.zone.transform = 'scaleY(' + lerp(0.2, 1, eob(z, 1.5)).toFixed(3) + ')';
    this.zl.opacity = eo(seg(t, 7.2, 7.7));
    UI.rise(this.c, t, 6.8);
    UI.rise(this.n, t, 17.0);
    this.tutor.render(t);
  },
});
