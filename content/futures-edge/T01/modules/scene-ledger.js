const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const LG_C = [1340, 470];
const LG_NODES = [30, 90, 150, 210, 270, 330].map((a) => [LG_C[0] + 330 * Math.cos(a * Math.PI / 180), LG_C[1] + 230 * Math.sin(a * Math.PI / 180)]);
kit.scene('ledger', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let lines = '', nodes = '';
    LG_NODES.forEach((n) => {
      lines += '<line class="lg-ln" x1="' + LG_C[0] + '" y1="' + LG_C[1] + '" x2="' + n[0].toFixed(1) + '" y2="' + n[1].toFixed(1) + '" pathLength="1" stroke-width="2" style="stroke:color-mix(in srgb, var(--main) 45%, transparent)"/>';
      nodes += '<g class="lg-node" transform="translate(' + n[0].toFixed(1) + ' ' + n[1].toFixed(1) + ')"><rect x="-46" y="-34" width="92" height="62" rx="10" style="fill:color-mix(in srgb, var(--ground) 80%, var(--main));stroke:color-mix(in srgb, var(--main) 50%, transparent);stroke-width:2"/>' +
        '<rect class="lg-copy" x="-30" y="-20" width="60" height="7" rx="3" style="fill:var(--main)"/><rect class="lg-copy" x="-30" y="-6" width="48" height="7" rx="3" style="fill:var(--main)"/><rect class="lg-copy" x="-30" y="8" width="54" height="7" rx="3" style="fill:var(--accent)"/><rect x="-14" y="30" width="28" height="8" rx="2" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/></g>';
    });
    const row = (a, b, c) => '<div style="display:flex;gap:14px;font-size:22px" class="mono ' + c + '"><span style="color:color-mix(in srgb, var(--second) 50%, var(--ground))">' + a + '</span><span style="flex:1">' + b + '</span></div>';
    let blocks = '';
    for (let i = 0; i < 3; i++) blocks += '<div class="glass lg-blk" style="position:relative;width:200px;height:110px;padding:16px 18px;border-color:color-mix(in srgb, var(--main) 50%, transparent)"><p class="kick" style="margin:0 0 10px;font-size:18px">Block ' + (i + 1) + '</p><div style="height:8px;width:150px;border-radius:4px;margin-bottom:8px;background:color-mix(in srgb, var(--second) 25%, transparent)"></div><div style="height:8px;width:110px;border-radius:4px;background:color-mix(in srgb, var(--second) 25%, transparent)"></div></div>' + (i < 2 ? '<div class="lg-link" style="width:44px;height:6px;border-radius:3px;background:var(--main)"></div>' : '');
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + lines +
      '<circle class="lg-pk" r="16" style="fill:var(--accent)"/>' + nodes + '</svg>' +
      '<div class="lg-p lg-from" style="position:absolute;left:1000px;top:250px;display:flex;flex-direction:column;align-items:center;gap:8px"><span style="width:84px;height:84px;border-radius:50%;background:color-mix(in srgb, var(--accent) 30%, var(--ground));border:2px solid var(--accent)"></span><span style="font-size:24px;font-weight:600">A friend</span></div>' +
      '<div class="lg-p lg-to" style="position:absolute;left:1600px;top:250px;display:flex;flex-direction:column;align-items:center;gap:8px"><span style="width:84px;height:84px;border-radius:50%;background:color-mix(in srgb, var(--main) 30%, var(--ground));border:2px solid var(--main)"></span><span style="font-size:24px;font-weight:600">You</span></div>' +
      '<div class="glass lg-book" style="left:1170px;top:390px;width:340px;padding:20px 24px;display:flex;flex-direction:column;gap:10px;z-index:2"><p class="kick" style="margin:0;font-size:18px">Ledger · shared record</p>' +
      row('#1', 'Ana → Ben 0.20', '') + row('#2', 'Ben → Cai 0.05', '') + row('#3', 'Friend → You 0.01', 'lg-new') + '</div>' +
      '<div class="lg-chain" style="position:absolute;left:990px;top:560px;display:flex;align-items:center">' + blocks + '</div>' +
      '<p class="kick lg-cl" style="position:absolute;left:990px;top:700px;margin:0">Blockchain: pages of the record, linked in order</p>' +
      '<div class="words" style="left:140px;top:200px;width:760px"><p class="kick lg-k">The key idea</p>' +
      '<h2 class="line lg-t">A record everyone can check</h2>' +
      '<p class="def lg-d">A <b>cryptocurrency</b> is a digital asset recorded on a shared public ledger, called a blockchain. People can send it to each other without a bank in the middle.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.lg-k').style; this.t = q('.lg-t'); this.d = q('.lg-d');
    this.from = q('.lg-from').style; this.to = q('.lg-to').style; this.pk = q('.lg-pk');
    this.book = q('.lg-book').style; this.nw = q('.lg-new').style;
    this.lns = all('.lg-ln'); this.nodes = all('.lg-node').map((e) => e.style); this.copies = all('.lg-copy').map((e) => e.style);
    this.blks = all('.lg-blk').map((e) => e.style); this.links = all('.lg-link').map((e) => e.style); this.cl = q('.lg-cl').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 2.0, pose: 'point', flip: true }, { t: 8.2, pose: 'magnify' }, { t: 13.0, pose: 'present' }, { t: 17.2, pose: 'explain' }],
      says: [{ t0: 17.4, t1: 21.7, text: 'No bank in the middle. The network keeps the record.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const pp = seg(t, 1.6, 2.2), po = seg(t, 7.6, 8.2);
    for (const s of [this.from, this.to]) { s.opacity = eo(pp) * (1 - ei(po)); s.transform = 'translate(-50%,0) translateY(' + lerp(20, 0, eo(pp)) + 'px)'; }
    const b = seg(t, 2.2, 2.9);
    this.book.opacity = eo(b) * (1 - ei(seg(t, 12.2, 12.8)));
    this.book.transform = 'scale(' + lerp(0.9, 1, eob(b, 1.5)) * lerp(1, 0.85, eio(seg(t, 12.2, 12.8))) + ')';
    const go = seg(t, 3.2, 4.4), back = seg(t, 5.4, 6.6);
    let px, py;
    if (t < 5.4) { px = lerp(1000, LG_C[0], eio(go)); py = lerp(300, LG_C[1] + 10, eio(go)) - Math.sin(Math.PI * go) * 80; }
    else { px = lerp(LG_C[0], 1600, eio(back)); py = lerp(LG_C[1] + 10, 300, eio(back)) - Math.sin(Math.PI * back) * 80; }
    this.pk.setAttribute('cx', px.toFixed(1)); this.pk.setAttribute('cy', py.toFixed(1));
    this.pk.style.opacity = (t > 3.1 && t < 6.7) ? 1 : 0;
    const nr = seg(t, 4.4, 5.0);
    this.nw.opacity = eo(nr); this.nw.color = 'var(--main)';
    this.nw.transform = 'translateX(' + lerp(20, 0, eo(nr)) + 'px)';
    this.lns.forEach((l, i) => {
      const a = 8.4 + i * 0.25;
      l.setAttribute('stroke-dasharray', eio(seg(t, a, a + 0.6)) + ' 1');
      l.style.opacity = 1 - ei(seg(t, 12.0, 12.6));
    });
    this.nodes.forEach((n, i) => {
      const a = 8.7 + i * 0.25, p = seg(t, a, a + 0.5);
      n.opacity = eo(p) * (1 - ei(seg(t, 12.0, 12.6)));
      n.transformBox = 'fill-box'; n.transformOrigin = 'center';
      n.transform = 'scale(' + lerp(0.5, 1, eob(p, 1.7)) + ')';
    });
    this.copies.forEach((c, i) => {
      const node = Math.floor(i / 3), a = 9.4 + node * 0.25 + (i % 3) * 0.12;
      c.transformBox = 'fill-box'; c.transformOrigin = 'left center';
      c.transform = 'scaleX(' + eo(seg(t, a, a + 0.35)) + ')';
    });
    this.blks.forEach((s, i) => {
      const a = 12.8 + i * 0.45, p = seg(t, a, a + 0.6);
      s.opacity = eo(p);
      s.transform = 'translateY(' + lerp(30, 0, eo(p)) + 'px) scale(' + lerp(0.9, 1, eob(p, 1.6)) + ')';
    });
    this.links.forEach((s, i) => { const a = 13.3 + i * 0.45; s.transformOrigin = '0 50%'; s.transform = 'scaleX(' + eo(seg(t, a, a + 0.3)) + ')'; });
    this.cl.opacity = eo(seg(t, 14.6, 15.2));
    TextFx.fadeFromRight(this.d, t, 15.4, { stagger: 0.045 });
    this.tutor.render(t);
  },
});
