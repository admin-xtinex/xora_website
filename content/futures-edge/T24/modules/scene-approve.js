const { seg, eo, ei, eob, eio, lerp } = kit;
const AP_CALL = [
  [0.6, 'Auto trade approval · OFF', 'The default: a triggered setup waits for your Approve'],
  [7.4, 'Do nothing?', 'The timer runs out. It expires, and no trade is opened.'],
  [14.0, 'Manual orders', 'The sheet says if the engine agrees, or if it is your call'],
];
kit.scene('approve', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.head = UI.head(kit, 'You stay in control', 'Approve, or let it pass');
    AP_CALL.forEach((c, i) => { c.st = UI.card(kit, 140, 290 + i * 150, 860, c[1], c[2], { fs: 28, pad: '18px 28px' }); });
    const body = '<div class="ap-main" style="display:flex;flex-direction:column;gap:12px"><p style="margin:0;font-family:var(--display);font-weight:700;font-size:34px">SOL / USDT</p>' +
      '<div class="pc ap-c" style="display:flex;flex-direction:column;gap:8px"><p class="pk">Setups awaiting approval</p>' +
      '<p class="pt"><span class="up">BUY</span> · Support reclaim</p>' +
      '<div class="mono" style="display:flex;justify-content:space-between;font-size:22px"><span>ENTRY 150.30</span><span class="dn">STOP 149.40</span></div>' +
      '<span class="btn ap-ok" style="height:54px;background:var(--main);color:var(--ground)"></span>' +
      '<span class="btn" style="height:46px;font-size:22px;border:1.5px solid color-mix(in srgb, var(--second) 30%, transparent)">Skip</span></div>' +
      '<p class="ap-x" style="margin:0;font-size:24px;font-weight:700;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Expired · no trade opened</p></div>' +
      '<div class="ap-sh" style="position:absolute;left:-18px;right:-18px;bottom:0;padding:16px 22px 14px;border-radius:30px 30px 0 0;background:#0d1122;border-top:2px solid color-mix(in srgb, var(--main) 40%, transparent);display:flex;flex-direction:column;gap:10px">' +
      '<div style="display:flex;align-items:center;gap:10px"><span style="flex:1;font-size:28px;font-weight:700">BUY SOL</span><span class="pill up">LONG</span></div>' +
      '<p class="pk" style="text-transform:none;letter-spacing:0">Market order · fills now</p>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div class="pc"><p class="pk">Position</p><p class="pv" style="font-size:26px">30.00</p><p class="pk" style="text-transform:none">3.00 × 10x</p></div><div class="pc"><p class="pk">Stop loss</p><p class="pv dn" style="font-size:26px">149.40</p></div></div>' +
      '<div class="pc ap-m" style="min-height:118px"><p class="ap-m1" style="margin:0;font-size:22px;line-height:1.35;color:var(--up)">✓ The engine agrees — a setup in this direction is live now.</p>' +
      '<p class="ap-m2" style="margin:0;font-size:22px;line-height:1.35;color:color-mix(in srgb, var(--second) 75%, var(--ground))">ⓘ The engine has no setup on this coin right now — this one is your call.</p></div>' +
      '<div style="display:flex;gap:10px"><span class="btn" style="flex:1;height:52px;border:1.5px solid color-mix(in srgb, var(--second) 30%, transparent)">Cancel</span><span class="btn" style="flex:1;height:52px;background:var(--up);color:var(--ground)">Confirm</span></div></div>';
    this.ph = UI.phone(kit, { x: 1110, y: 150, w: 460, h: 640, tab: 1, body });
    this.ph.q('.ph-scr').style.isolation = 'isolate';
    const q = (s) => this.ph.q(s);
    this.ok = q('.ap-ok'); this.main = q('.ap-main').style; this.c = q('.ap-c').style; this.x = q('.ap-x').style; this.sh = q('.ap-sh').style;
    this.m1 = q('.ap-m1').style; this.m2 = q('.ap-m2').style; this.m = q('.ap-m').style;
    this.m2.position = 'absolute'; this.m2.left = '16px'; this.m2.right = '16px'; this.m2.top = '12px';
    this.m.position = 'relative';
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'typing' }, { t: 7.4, pose: 'think' }, { t: 14.0, pose: 'laptop' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ph.render(t, 0.2);
    const left = 12.4 - t;
    UI.set(this.ok, left > 0 ? 'Approve buy · expires ' + UI.mmss(left) : 'Expired');
    const ex = eo(seg(t, 12.4, 12.9));
    this.c.opacity = (eo(seg(t, 1.0, 1.5)) * lerp(1, 0.4, ex)).toFixed(3);
    this.c.transform = 'translateY(' + lerp(20, 0, eo(seg(t, 1.0, 1.6))).toFixed(1) + 'px)';
    UI.glow(this.c, eo(seg(t, 1.6, 2.0)) * (1 - ex) * (0.6 + 0.4 * Math.sin(t * 4)));
    this.ok.style.background = left > 0 ? 'var(--main)' : 'color-mix(in srgb, var(--second) 25%, var(--ground))';
    this.x.opacity = ex.toFixed(3);
    const sp = eio(seg(t, 14.0, 14.8));
    this.sh.transform = 'translateY(' + lerp(560, 0, sp).toFixed(1) + 'px)';
    this.sh.opacity = sp > 0 ? 1 : 0;
    this.main.opacity = (1 - 0.85 * sp).toFixed(3);
    const sw = eo(seg(t, 17.6, 18.0));
    this.m1.opacity = (1 - sw).toFixed(3); this.m2.opacity = sw.toFixed(3);
    UI.glow(this.m, eo(seg(t, 15.0, 15.4)) * (0.7 + 0.3 * Math.sin(t * 4)));
    AP_CALL.forEach((c, i) => {
      const p2 = seg(t, c[0], c[0] + 0.6), nxt = AP_CALL[i + 1];
      c.st.opacity = (eo(p2) * (nxt && t > nxt[0] ? 0.55 : 1)).toFixed(3);
      c.st.transform = 'translateX(' + lerp(30, 0, eo(p2)).toFixed(1) + 'px)';
    });
    this.tutor.render(t);
  },
});
