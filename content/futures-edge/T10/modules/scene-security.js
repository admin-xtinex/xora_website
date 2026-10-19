const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SC_DRAWER = { x: 1110, y: 198, w: 710, h: 578 };
// [label, detail, switched on at]
const SC_ROWS = [['Two-factor login (2FA)', 'Code from your phone app: <span class="mono" style="color:var(--main)">482 913</span>', 6.0], ['Anti-phishing code', 'Shown in real emails: <span class="mono" style="color:var(--main)">TIGER58</span>', 12.4], ['Withdrawal address list', 'Only saved addresses can receive', 14.6]];
kit.scene('security', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.term = UI.term(kit, { seed: 41 });
    let rows = '';
    SC_ROWS.forEach((r) => {
      rows += '<div style="display:flex;align-items:center;gap:20px;padding:16px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)"><div style="flex:1"><p style="margin:0;font-size:28px;font-weight:700">' + r[0] + '</p><p class="sc-d" style="margin:4px 0 0;font-size:24px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">' + r[1] + '</p></div>' +
        '<div class="sc-tg" style="position:relative;width:76px;height:42px;border-radius:21px;flex:none"><span class="sc-kn" style="position:absolute;top:5px;left:5px;width:32px;height:32px;border-radius:50%;background:var(--second)"></span></div></div>';
    });
    kit.stage.append(kit.h('<div class="glass sc-dr" style="left:' + SC_DRAWER.x + 'px;top:' + SC_DRAWER.y + 'px;width:' + SC_DRAWER.w + 'px;height:' + SC_DRAWER.h + 'px;padding:24px 34px;border-radius:18px">' +
      '<div style="display:flex;align-items:center;gap:14px"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke-width="3" style="stroke:var(--main)"><path d="M20 4 L33 9 V19 C33 27 27 33 20 36 C13 33 7 27 7 19 V9 Z" stroke-linejoin="round"/></svg><span style="font-size:32px;font-weight:700">Security</span><span class="fict" style="margin-left:auto">Mock settings</span></div>' +
      rows +
      '<div class="sc-api" style="margin-top:18px;padding:14px 20px;border-radius:14px;border:2px solid var(--accent);background:color-mix(in srgb, var(--ground) 82%, var(--accent))"><p style="margin:0;font-size:28px;font-weight:700">API keys: none created</p><p style="margin:4px 0 0;font-size:24px;font-weight:600">Never share keys, passwords or codes.</p></div></div>'));
    this.spot = UI.spot(kit);
    const mail = '<div class="sc-mail" style="display:flex;flex-direction:column;gap:10px">' +
      '<div class="sc-m1" style="display:flex;align-items:center;gap:16px;padding:12px 18px;border-radius:14px;border:1.5px solid color-mix(in srgb, var(--main) 45%, transparent)"><span style="font-size:30px;color:var(--main);font-weight:700">✓</span><span style="font-size:26px">Email with your code <span class="mono" style="color:var(--main)">TIGER58</span>: real</span></div>' +
      '<div class="sc-m2" style="display:flex;align-items:center;gap:16px;padding:12px 18px;border-radius:14px;border:1.5px solid color-mix(in srgb, var(--accent) 55%, transparent)"><span style="font-size:30px;color:var(--accent);font-weight:700">✗</span><span style="font-size:26px">Email with no code: treat as fake</span></div></div>';
    this.card = UI.tip(kit, 140, 214, 930, '8 · Security', 'Lock the door first', '<b>Two-factor login</b> asks for a second code from your phone. An <b>API key</b> lets software use your account.', mail);
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.cs = this.card.style; this.dr = q('.sc-dr').style; this.api = q('.sc-api').style;
    this.tg = all('.sc-tg').map((e) => e.style); this.kn = all('.sc-kn').map((e) => e.style); this.dd = all('.sc-d').map((e) => e.style);
    this.m1 = q('.sc-m1').style; this.m2 = q('.sc-m2').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'checklist' }, { t: 0.6, pose: 'explain' }, { t: 5.4, pose: 'calm' }, { t: 11.9, pose: 'magnify' }, { t: 18.5, pose: 'think' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.term.render(t, { sym: 'BTC', pos: { size: 0.01, entry: 60000, mark: 60000 + UI.wig(t, 12) } });
    const r = UI.spotAt([[0, UI.R.sec], [2.6, SC_DRAWER]], t, 0.9);
    this.spot.set(r, eo(seg(t, 0, 0.8)), eo(seg(t, 0.2, 1.0)));
    const d = seg(t, 1.6, 2.5);
    this.dr.opacity = eo(seg(t, 1.6, 2.0)).toFixed(3);
    this.dr.transform = 'translateX(' + lerp(120, 0, eo(d)).toFixed(1) + 'px)';
    UI.show(this.cs, t, 2.4);
    SC_ROWS.forEach((row, i) => {
      const p = eio(seg(t, row[2], row[2] + 0.4));
      this.kn[i].transform = 'translateX(' + (34 * p).toFixed(1) + 'px)';
      this.tg[i].background = 'color-mix(in srgb, var(--main) ' + (14 + 86 * p).toFixed(0) + '%, var(--ground))';
      this.dd[i].opacity = (0.35 + 0.65 * eo(seg(t, row[2] + 0.2, row[2] + 0.7))).toFixed(3);
    });
    this.m1.opacity = eo(seg(t, 12.6, 13.1)).toFixed(3); this.m2.opacity = eo(seg(t, 14.4, 14.9)).toFixed(3);
    const a = seg(t, 18.7, 19.2);
    this.api.opacity = (0.3 + 0.7 * eo(a)).toFixed(3);
    this.api.transform = 'scale(' + (1 + 0.05 * Math.sin(Math.PI * seg(t, 19.0, 19.8))).toFixed(4) + ')';
    this.tutor.render(t);
  },
});
