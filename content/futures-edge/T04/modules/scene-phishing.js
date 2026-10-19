const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const PH_FLAGS = [6.2, 12.4, 15.0];
const PH_SAFE = ['Type the address yourself, or use a bookmark.', 'Check the spelling: examplex.example', 'Never share codes. Real support never asks.'];
kit.scene('phishing', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const flag = (i, txt) => '<span class="ph-f" style="border-radius:6px;padding:0 4px">' + txt + '</span>';
    const tag = (i, txt) => '<span class="chip ph-tag" style="font-size:22px;padding:6px 14px;border-color:var(--accent);color:var(--accent)">' + (i + 1) + ' · ' + txt + '</span>';
    let safe = '';
    PH_SAFE.forEach((s) => { safe += '<div class="ph-s" style="display:flex;gap:16px;align-items:flex-start"><span style="flex:none;color:var(--main);font-size:30px;font-weight:700">✓</span><span style="font-size:28px;line-height:1.35;font-weight:600">' + s + '</span></div>'; });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1520px"><p class="kick ph-k" style="color:var(--accent)">Spot the fake</p>' +
      '<h2 class="line ph-t">Real or phishing?</h2>' +
      '<p class="def ph-d"><b>Phishing</b> is a fake message or website that tries to steal your login.</p></div>' +
      '<div class="glass ph-m" style="left:140px;top:430px;width:760px;padding:22px 30px;border-color:var(--accent)"><p class="fict" style="margin:0 0 10px">Text message · educational mock · fictional names</p>' +
      '<p style="margin:0;font-size:30px;line-height:1.45">' + flag(0, 'URGENT: your ExampleX account will be locked in 1 hour!') + ' Verify now at ' + flag(1, 'examp1ex-help.example') + ' and ' + flag(2, 'reply with your OTP') + '.</p>' +
      '<div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap">' + tag(0, 'Pressure') + tag(1, 'Look-alike address') + tag(2, 'Asks for a code') + '</div></div>' +
      '<div class="glass ph-g" style="left:940px;top:430px;width:740px;padding:22px 30px;border-color:var(--main);display:flex;flex-direction:column;gap:14px"><p class="kick" style="margin:0">Safer habits</p>' + safe + '</div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)].map((e) => e.style);
    this.k = q('.ph-k').style; this.t = q('.ph-t'); this.d = q('.ph-d'); this.m = q('.ph-m').style; this.g = q('.ph-g').style;
    this.fs = all('.ph-f'); this.tags = all('.ph-tag'); this.ss = all('.ph-s');
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'calm' }, { t: 0.6, pose: 'explain' }, { t: 6.0, pose: 'magnify' }, { t: 18.4, pose: 'checklist' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.05 });
    const m = seg(t, 2.6, 3.3);
    this.m.opacity = eo(m); this.m.transform = 'translateY(' + lerp(30, 0, eo(m)) + 'px)';
    PH_FLAGS.forEach((a, i) => {
      const p = eo(seg(t, a, a + 0.5)), pulse = 1 + 0.25 * Math.sin(Math.PI * seg(t, a, a + 1.0));
      this.fs[i].background = 'color-mix(in srgb, var(--accent) ' + (p * 32 * pulse).toFixed(1) + '%, transparent)';
      this.fs[i].boxShadow = p > 0 ? '0 0 0 2px color-mix(in srgb, var(--accent) ' + (p * 80).toFixed(0) + '%, transparent)' : 'none';
      this.tags[i].opacity = p; this.tags[i].transform = 'scale(' + lerp(0.7, 1, eob(seg(t, a + 0.2, a + 0.7), 1.8)) + ')';
    });
    const g = seg(t, 18.4, 19.1);
    this.g.opacity = eo(g); this.g.transform = 'translateX(' + lerp(40, 0, eo(g)) + 'px)';
    this.ss.forEach((s, i) => { const a = 19.0 + i * 1.2, p = seg(t, a, a + 0.5); s.opacity = eo(p); s.transform = 'translateX(' + lerp(20, 0, eo(p)) + 'px)'; });
    this.tutor.render(t);
  },
});
