const { seg, eo, ei, eob, eio, lerp } = kit;
const SG_C = [[149.6, 149.9, 149.4, 149.8], [149.8, 150.1, 149.7, 150.0], [150.0, 150.1, 149.6, 149.7], [149.7, 149.8, 149.3, 149.4], [149.4, 149.6, 149.2, 149.5], [149.5, 149.9, 149.4, 149.8],
  [149.8, 150.2, 149.7, 150.1], [150.1, 150.4, 150.0, 150.3], [150.3, 150.5, 150.0, 150.1], [150.1, 150.2, 149.8, 149.9], [149.9, 150.0, 149.6, 149.7], [149.7, 150.3, 149.65, 150.25]];
const SG_Y = (p) => 150 - (p - 149.1) / 1.5 * 140, SG_X = (i) => 18 + i * 29;
const SG_CALL = [
  [0.6, 'Coins or Xora AI', 'Pick up to 20 coins, or let Xora AI coin selection choose'],
  [8.2, 'Read one coin', 'Price chart · trade opportunity · entry checklist'],
  [16.2, 'Your own orders', 'BUY / LONG and SHORT / SELL: a market order with an automatic stop'],
];
const SG_CHK = [['Trend agrees', 1], ['At a level', 1], ['Volume', 1], ['Buyer pressure', 0]];
kit.scene('signals', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'Tab 2', 'Signals');
    SG_CALL.forEach((c, i) => { c.st = UI.card(kit, 140, 290 + i * 150, 860, c[1], c[2], { fs: 28, pad: '18px 28px' }); });
    this.cd = UI.cdl(kit, 'sg-c', SG_C.length);
    let chk = '';
    SG_CHK.forEach((c) => { chk += '<div class="sg-k" style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:23px">' + c[0] + '</span><b class="sg-m" style="font-size:26px;color:' + (c[1] ? 'var(--up)' : 'var(--down)') + '">' + (c[1] ? '✓' : '✗') + '</b></div>'; });
    const seg2 = (a, b) => '<div style="display:flex;gap:6px;padding:4px;border-radius:14px;background:color-mix(in srgb, var(--second) 7%, transparent)"><span class="sg-s0 btn" style="flex:1;height:40px;font-size:22px">' + a + '</span><span class="sg-s1 btn" style="flex:1;height:40px;font-size:22px">' + b + '</span></div>';
    const body = '<div class="sg-in" style="display:flex;flex-direction:column;gap:12px">' + seg2('Coins', 'Xora AI') +
      '<div style="display:flex;gap:8px"><span class="pill" style="color:color-mix(in srgb, var(--second) 55%, var(--ground))">BTC</span><span class="pill" style="color:var(--main)">SOL</span><span class="pill" style="color:color-mix(in srgb, var(--second) 55%, var(--ground))">ETH</span><span class="pill sg-more" style="color:color-mix(in srgb, var(--second) 55%, var(--ground))">+17</span></div>' +
      '<div class="pc" style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;justify-content:space-between"><p class="pk">SOL · Price action</p></div>' +
      '<div class="mono" style="display:flex;gap:14px;font-size:22px"><span style="color:var(--main)">1M</span><span>5M</span><span>15M</span><span>1H</span></div>' +
      '<svg width="360" height="160" viewBox="0 0 360 160">' + this.cd.html + '<path class="sg-ema" fill="none" stroke-width="2.5" style="stroke:var(--accent)"/></svg></div>' +
      '<div class="pc sg-op" style="display:flex;flex-direction:column;gap:6px"><p class="pk">Trade opportunity</p><p class="pt up">BUY · Support reclaim</p>' +
      '<div class="mono" style="display:flex;justify-content:space-between;font-size:22px"><span>ENTRY 150.30</span><span class="dn">STOP 149.40</span></div></div>' +
      '<div class="pc sg-ck" style="display:flex;flex-direction:column;gap:8px"><p class="pk">Entry checklist</p>' + chk + '</div></div>' +
      '<div class="sg-bt" style="position:absolute;left:0;right:0;bottom:0;display:flex;gap:10px;padding-top:10px;background:linear-gradient(180deg, transparent, #05060f 30%)"><span class="btn sg-b" style="flex:1;height:56px;background:var(--up);color:var(--ground)">BUY / LONG</span><span class="btn sg-s" style="flex:1;height:56px;background:var(--down);color:var(--ground)">SHORT / SELL</span></div>';
    this.ph = UI.phone(kit, { x: 1110, y: 150, w: 460, h: 640, tab: 1, body });
    const pb = this.ph.q('.ph-body').style; pb.overflow = 'hidden';
    const q = (s) => this.ph.q(s), all = (s) => this.ph.all(s);
    this.inEl = q('.sg-in'); this.in = this.inEl.style; this.s0 = q('.sg-s0').style; this.s1 = q('.sg-s1').style; this.ema = q('.sg-ema');
    this.op = q('.sg-op').style; this.ck = q('.sg-ck').style; this.ks = all('.sg-m').map((e) => e.style);
    this.b = q('.sg-b').style; this.s = q('.sg-s').style; this.more = q('.sg-more');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'laptop' }, { t: 8.0, pose: 'magnify' }, { t: 16.0, pose: 'point', flip: true }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ph.render(t, 0.2);
    const ai = eo(seg(t, 4.6, 5.0));
    const on = 'color-mix(in srgb, var(--main) 30%, var(--ground))', off = 'transparent';
    this.s0.background = ai < 0.5 ? on : off; this.s1.background = ai >= 0.5 ? on : off;
    this.s0.color = ai < 0.5 ? 'var(--second)' : 'color-mix(in srgb, var(--second) 55%, var(--ground))';
    this.s1.color = ai >= 0.5 ? 'var(--second)' : 'color-mix(in srgb, var(--second) 55%, var(--ground))';
    UI.set(this.more, ai >= 0.5 ? '+27' : '+17');
    let ema = null, d = '';
    SG_C.forEach((c, i) => {
      const a = 1.0 + i * 0.35, p = eo(seg(t, a, a + 0.4));
      this.cd.set(i, { x: SG_X(i), w: 16, o: c[0], h: c[0] + (c[1] - c[0]) * p, l: c[0] + (c[2] - c[0]) * p, c: c[0] + (c[3] - c[0]) * p, y: SG_Y, op: eo(seg(t, a, a + 0.15)), min: 3 });
      ema = ema == null ? c[3] : ema + (c[3] - ema) * 0.25;
      if (t > a + 0.4) d += (d ? 'L' : 'M') + SG_X(i).toFixed(1) + ' ' + SG_Y(ema).toFixed(1);
    });
    this.ema.setAttribute('d', d || 'M0 0');
    const sc = Math.max(0, this.inEl.offsetHeight - 390) * eio(seg(t, 8.4, 9.4));
    this.in.transform = 'translateY(' + (-sc).toFixed(1) + 'px)';
    UI.fit(this.inEl, sc, 390);
    UI.glow(this.op, eo(seg(t, 9.4, 9.8)) * (1 - ei(seg(t, 11.0, 11.4))));
    UI.glow(this.ck, eo(seg(t, 11.4, 11.8)) * (1 - ei(seg(t, 15.4, 15.8))));
    this.ks.forEach((s, i) => { const a = 11.8 + i * 0.7, p = seg(t, a, a + 0.35); s.opacity = eo(p); s.display = 'inline-block'; s.transform = 'scale(' + lerp(0.3, 1, eob(p, 2)).toFixed(3) + ')'; });
    const g = eo(seg(t, 16.4, 16.8)) * (0.7 + 0.3 * Math.sin(t * 4));
    UI.glow(this.b, g, 'var(--up)'); UI.glow(this.s, g, 'var(--down)');
    SG_CALL.forEach((c, i) => {
      const p2 = seg(t, c[0], c[0] + 0.6), nxt = SG_CALL[i + 1];
      c.st.opacity = (eo(p2) * (nxt && t > nxt[0] ? 0.55 : 1)).toFixed(3);
      c.st.transform = 'translateX(' + lerp(30, 0, eo(p2)).toFixed(1) + 'px)';
    });
    this.tutor.render(t);
  },
});
