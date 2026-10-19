const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const QA1_FLAGS = [['Asks for codes', 96], ['Odd link', 160], ['Rushes you', 224]];
kit.scene('q-phish', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let flags = '';
    QA1_FLAGS.forEach((f) => { flags += '<span class="chip qa1-f" style="position:absolute;right:20px;top:' + f[1] + 'px;font-size:22px;padding:6px 16px;gap:10px;background:color-mix(in srgb, var(--ground) 70%, var(--accent));border-color:var(--accent)"><span class="dot" style="background:var(--accent)"></span>' + f[0] + '</span>'; });
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Chat · “Exchange Support”</p>' +
      '<div class="qa1-m" style="position:absolute;left:24px;top:70px;width:300px;box-sizing:border-box;padding:16px 20px;border-radius:20px 20px 20px 6px;background:color-mix(in srgb, var(--ground) 80%, var(--second));font-size:23px;line-height:1.35">' +
      'To unlock withdrawals, send your 2FA code and API secret key now. <span class="mono" style="font-size:21px;color:var(--main)">verify-desk.example</span></div>' +
      flags + '<p class="fict" style="position:absolute;left:28px;top:304px;margin:0">Educational mock · not a real message</p>';
    this.quiz = UI.quiz(kit, {
      n: 1, from: 'T04', q: '“Support” asks for your 2FA code and API secret key.',
      opts: ['Send both. Support needs them', 'Send the API key, keep the 2FA code', 'Share neither. Open the official app yourself', 'Send them if the message looks official'],
      ok: 2, bad: 1, vis,
      why: 'Real support never asks for passwords, OTP or 2FA codes, or secret keys.',
      whyNot: 'An API secret key can also control your account.',
    });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.m = kit.stage.querySelector('.qa1-m').style; this.flags = all('.qa1-f').map((e) => e.style);
  },
  render(t) {
    this.chrome(t);
    const m = seg(t, 1.6, 2.2);
    this.m.opacity = eo(m); this.m.transform = 'translateY(' + lerp(20, 0, eo(m)).toFixed(1) + 'px) scale(' + lerp(0.92, 1, eob(m, 1.6)).toFixed(4) + ')';
    this.m.transformOrigin = '0 100%';
    this.flags.forEach((s, i) => { const a = 7.8 + i * 0.5, p = seg(t, a, a + 0.4); s.opacity = eo(p); s.transform = 'scale(' + lerp(0.5, 1, eob(p, 1.8)).toFixed(4) + ')'; });
    this.quiz(t);
  },
});
