const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const Q8_FLAGS = [['Rush', 96], ['Asks for OTP', 160], ['Odd link', 230]];
kit.scene('q-phish', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let flags = '';
    Q8_FLAGS.forEach((f) => { flags += '<span class="chip q8-f" style="position:absolute;right:20px;top:' + f[1] + 'px;font-size:22px;padding:6px 16px;gap:10px;background:color-mix(in srgb, var(--ground) 70%, var(--accent));border-color:var(--accent)"><span class="dot" style="background:var(--accent)"></span>' + f[0] + '</span>'; });
    const vis = '<p class="kick" style="position:absolute;left:28px;top:22px;margin:0">Message · unknown sender</p>' +
      '<div class="q8-m" style="position:absolute;left:24px;top:70px;width:300px;box-sizing:border-box;padding:16px 20px;border-radius:20px 20px 20px 6px;background:color-mix(in srgb, var(--ground) 80%, var(--second));font-size:24px;line-height:1.35">' +
      '<b>URGENT:</b> your account is locked. Reply with your OTP within 10 minutes. <span class="mono" style="font-size:22px;color:var(--main)">login-help.example</span></div>' +
      flags + '<p class="fict" style="position:absolute;left:28px;top:304px;margin:0">Educational mock · not a real message</p>';
    this.quiz = UI.quiz(kit, {
      n: 8, from: 'T04', q: 'A message asks for your OTP. What do you do?',
      opts: ['Send the OTP fast. It sounds urgent', 'Share the password, but not the OTP', 'Never share it. Open the app yourself', 'Reply and ask them for proof'],
      ok: 2, bad: 0, vis,
      why: 'Real support never asks for passwords, OTPs or API keys.',
      whyNot: 'Rushing you is a scam trick. An OTP unlocks your account.',
    });
    const all = (s) => [...kit.stage.querySelectorAll(s)];
    this.m = kit.stage.querySelector('.q8-m').style; this.flags = all('.q8-f').map((e) => e.style);
  },
  render(t) {
    this.chrome(t);
    const m = seg(t, 1.6, 2.2);
    this.m.opacity = eo(m); this.m.transform = 'translateY(' + lerp(20, 0, eo(m)).toFixed(1) + 'px) scale(' + lerp(0.92, 1, eob(m, 1.6)).toFixed(4) + ')';
    this.m.transformOrigin = '0 100%';
    this.flags.forEach((s, i) => {
      const a = 7.8 + i * 0.5, p = seg(t, a, a + 0.4);
      s.opacity = eo(p); s.transform = 'scale(' + lerp(0.5, 1, eob(p, 1.8)).toFixed(4) + ')';
    });
    this.quiz(t);
  },
});
