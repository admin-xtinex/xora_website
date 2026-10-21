const { seg, eo, eio, eob, lerp, TextFx } = kit;
const X0 = 150, X1 = 1110, Y0 = 250, Y1 = 900, BEAT = 4;
kit.scene('top3', {
  init(kit) {
    const T = kit.json('top3.json');
    this.beats = [];
    T.forEach((d, j) => {
      const K = d.k; let lo = Infinity, hi = -Infinity; for (const k of K) { lo = Math.min(lo, k[2]); hi = Math.max(hi, k[1]); } lo = Math.min(lo, d.x); hi = Math.max(hi, d.e); const pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
      const px = (i) => X0 + (X1 - X0) * (i + 0.5) / K.length, py = (v) => Y1 - (v - lo) / (hi - lo) * (Y1 - Y0);
      const cw = (X1 - X0) / K.length * 0.62; let c = '';
      K.forEach((k, i) => { const col = k[3] >= k[0] ? '#2fd897' : '#ff5c7c'; c += '<g class="top3-k"><line x1="' + px(i) + '" x2="' + px(i) + '" y1="' + py(k[1]) + '" y2="' + py(k[2]) + '" stroke="' + col + '" stroke-width="2"/><rect x="' + (px(i) - cw / 2) + '" y="' + py(Math.max(k[0], k[3])) + '" width="' + cw + '" height="' + Math.max(2, Math.abs(py(k[0]) - py(k[3]))) + '" rx="1.5" fill="' + col + '"/></g>'; });
      const root = kit.h('<div class="top3-beat" style="position:absolute;inset:0">' +
        '<div class="glass" style="left:100px;top:200px;width:1060px;height:760px"><div class="edge"></div></div>' +
        '<svg class="art" viewBox="0 0 1920 1080">' +
        '<rect class="top3-zone" x="' + px(d.i0) + '" y="' + Y0 + '" width="' + (px(d.i1) - px(d.i0)) + '" height="' + (Y1 - Y0) + '" fill="#2fd897" fill-opacity="0.08"/>' +
        '<g>' + c + '</g>' +
        '<line class="top3-in" x1="' + px(d.i0) + '" x2="' + X1 + '" y1="' + py(d.e) + '" y2="' + py(d.e) + '" stroke="#a855f7" stroke-width="3" stroke-dasharray="12 9"/>' +
        '<line class="top3-out" x1="' + px(d.i0) + '" x2="' + X1 + '" y1="' + py(d.x) + '" y2="' + py(d.x) + '" stroke="#2fd897" stroke-width="3" stroke-dasharray="12 9"/>' +
        '<circle class="top3-dot" cx="' + px(d.i0) + '" cy="' + py(d.e) + '" r="13" fill="#a855f7" stroke="#02030a" stroke-width="5"/>' +
        '<path class="top3-arrow" d="M' + (X1 - 40) + ' ' + (py(d.e) + 20) + ' L' + (X1 - 40) + ' ' + (py(d.x) - 24) + '" stroke="#2fd897" stroke-width="5" stroke-linecap="round" fill="none"/>' +
        '<path class="top3-head" d="M' + (X1 - 56) + ' ' + (py(d.x) - 40) + ' L' + (X1 - 40) + ' ' + (py(d.x) - 18) + ' L' + (X1 - 24) + ' ' + (py(d.x) - 40) + '" stroke="#2fd897" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>' +
        '<div class="words" style="left:130px;top:224px;width:600px;gap:4px"><p class="tag" style="font-size:20px">' + d.s + ' / USDT · ' + d.tf + ' candles</p></div>' +
        '<div class="words top3-card" style="left:1240px;top:220px;width:600px;gap:20px">' +
        '<p class="tag">Best trade #' + (j + 1) + '</p>' +
        '<p class="hero" style="font-size:132px">' + d.s + '</p>' +
        '<div style="display:flex;gap:12px;flex-wrap:wrap"><span class="chip dn">Sell · ' + d.lev + '×</span><span class="chip ' + (d.src.indexOf('auto') >= 0 ? 'hi' : 'vi') + '">' + d.src + '</span></div>' +
        '<p class="num up top3-net" style="font-size:104px;line-height:1">+' + d.net.toFixed(2) + ' <span style="font-size:40px;color:#b4bccb">USDT</span></p>' +
        '<p class="mid thin" style="font-size:48px;margin-top:-8px">≈ ₹' + Math.round(d.net * 100).toLocaleString('en-IN') + '</p>' +
        '<p class="sub" style="font-size:30px">Sold at ' + d.o + ', closed at ' + d.c + ' IST. Price fell ' + d.move.replace('−', '') + (d.roi ? ', ' + d.roi + '% on the margin' : '') + '. After fees.</p></div></div>');
      kit.stage.append(root);
      const q = (c) => root.querySelector('.top3-' + c);
      this.beats.push({ root: root.style, ks: [...root.querySelectorAll('.top3-k')].map((g) => g.style), n: K.length, i0: d.i0, i1: d.i1, zone: q('zone').style, in_: q('in').style, out: q('out').style, dot: q('dot').style, arrow: q('arrow'), head: q('head').style, card: q('card').style, net: q('net').style, dx: px(d.i0), dy: py(d.e) });
    });
    kit.stage.prepend(kit.h('<div class="ground"></div>'));
  },
  render(t0) {
    const t = t0 * (4 / 3);
    this.beats.forEach((b, j) => {
      const lt = t - j * BEAT;
      const inn = eio(seg(lt, -0.1, 0.45)), out = j < 2 ? eio(seg(lt, BEAT - 0.35, BEAT + 0.1)) : 0;
      b.root.opacity = lt < -0.1 || lt > BEAT + 0.1 && j < 2 ? 0 : Math.min(inn, 1 - out);
      b.root.transform = 'translateX(' + (lerp(80, 0, inn) - 120 * out) + 'px)';
      b.ks.forEach((s, i) => { s.opacity = eo(i <= b.i0 ? seg(lt, 0.0 + i * 0.012, 0.3 + i * 0.012) : seg(lt, 0.7 + (i - b.i0) / (b.n - b.i0) * 1.5, 0.9 + (i - b.i0) / (b.n - b.i0) * 1.5)); });
      b.dot.transformOrigin = b.dx + 'px ' + b.dy + 'px'; b.dot.transform = 'scale(' + eob(seg(lt, 0.45, 0.8), 1.8) + ')';
      b.in_.opacity = eo(seg(lt, 0.5, 0.8)); b.zone.opacity = eo(seg(lt, 0.7, 1.6));
      b.out.opacity = eo(seg(lt, 2.1, 2.4));
      b.arrow.style.strokeDasharray = 1000; b.arrow.style.strokeDashoffset = 1000 * (1 - eo(seg(lt, 2.1, 2.6))); b.head.opacity = eo(seg(lt, 2.5, 2.7));
      b.card.opacity = eo(seg(lt, 0.2, 0.6)); b.card.transform = 'translateX(' + lerp(30, 0, eo(seg(lt, 0.2, 0.7))) + 'px)';
      b.net.opacity = eo(seg(lt, 2.3, 2.6)); b.net.transform = 'scale(' + lerp(1.25, 1, eob(seg(lt, 2.3, 2.7), 1.8)) + ')'; b.net.transformOrigin = '0 60%';
    });
    kit.stage.style.opacity = 1 - eio(seg(t, 11.5, 12));
  },
});
