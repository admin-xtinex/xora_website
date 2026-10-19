const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SE = [['Password', 'the secret word you log in with'], ['OTP', 'a one-time code sent to your phone'], ['API secret key', 'a key that lets software use your account']];
kit.scene('security', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let cards = '';
    SE.forEach((s, i) => {
      cards += '<div class="glass se-c" style="left:' + (140 + i * 550) + 'px;top:400px;width:520px;height:220px;padding:24px 30px;display:flex;gap:24px;align-items:center">' +
        '<svg width="90" height="110" viewBox="0 0 90 110" style="flex:none"><path class="se-sh" d="M22 52 L22 32 A23 23 0 0 1 68 32 L68 52" fill="none" stroke-width="8" stroke-linecap="round" style="stroke:var(--second)"/>' +
        '<rect x="8" y="50" width="74" height="56" rx="12" style="fill:var(--main)"/><circle cx="45" cy="74" r="8" style="fill:var(--ground)"/><rect x="41" y="76" width="8" height="16" rx="3" style="fill:var(--ground)"/></svg>' +
        '<div style="display:flex;flex-direction:column;gap:8px"><p style="margin:0;font-size:34px;font-weight:700">' + s[0] + '</p><p style="margin:0;font-size:26px;line-height:1.35;color:color-mix(in srgb, var(--second) 72%, var(--ground))">' + s[1] + '</p>' +
        '<p class="se-n" style="margin:6px 0 0;font-family:var(--mono, monospace);font-size:22px;letter-spacing:.14em;color:var(--accent);font-weight:600">NEVER SHARE</p></div></div>';
    });
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:180px;width:1520px"><p class="kick se-k" style="color:var(--accent)">Account security</p>' +
      '<h2 class="line se-t">Never share these</h2>' +
      '<p class="def se-d"><b>Account security</b> means keeping other people out of your account.</p></div>' + cards +
      '<div class="glass se-2" style="left:140px;top:650px;width:760px;padding:18px 30px;display:flex;align-items:center;gap:24px">' +
      '<div class="se-sw" style="position:relative;flex:none;width:96px;height:52px;border-radius:26px"><div class="se-kn" style="position:absolute;top:6px;width:40px;height:40px;border-radius:50%;background:var(--second)"></div></div>' +
      '<p style="margin:0;font-size:30px;font-weight:600">Two-step verification (2FA)</p><span class="mono se-on" style="margin-left:auto;font-size:26px"></span></div>' +
      '<span class="chip se-sup" style="position:absolute;left:940px;top:664px;border-color:var(--accent)">Real support never asks for these</span>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.k = q('.se-k').style; this.t = q('.se-t'); this.d = q('.se-d');
    this.cards = all('.se-c').map((e) => e.style); this.sh = all('.se-sh').map((e) => e.style); this.ns = all('.se-n').map((e) => e.style);
    this.two = q('.se-2').style; this.sw = q('.se-sw').style; this.kn = q('.se-kn').style; this.on = q('.se-on'); this.sup = q('.se-sup').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'checklist' }, { t: 0.6, pose: 'explain' }, { t: 5.6, pose: 'calm' }, { t: 11.8, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    this.cards.forEach((c, i) => {
      const a = 5.6 + i * 0.9, p = seg(t, a, a + 0.6), l = seg(t, a + 0.6, a + 1.0);
      c.opacity = eo(seg(t, a, a + 0.3)); c.transform = 'translateY(' + lerp(30, 0, eo(p)) + 'px)';
      // The padlock clicks shut, then the warning appears.
      this.sh[i].transform = 'translateY(' + lerp(-14, 0, eob(l, 2)).toFixed(1) + 'px)';
      this.ns[i].opacity = eo(seg(t, a + 1.0, a + 1.4));
    });
    const tw = seg(t, 11.8, 12.4), on = eio(seg(t, 12.8, 13.3));
    this.two.opacity = eo(tw); this.two.transform = 'translateY(' + lerp(30, 0, eo(tw)) + 'px)';
    this.kn.left = lerp(6, 50, on).toFixed(1) + 'px';
    this.sw.background = on > 0.5 ? 'var(--main)' : 'color-mix(in srgb, var(--second) 20%, transparent)';
    UI.set(this.on, on > 0.5 ? 'ON' : 'OFF'); this.on.style.color = on > 0.5 ? 'var(--main)' : 'color-mix(in srgb, var(--second) 55%, var(--ground))';
    const s = seg(t, 13.8, 14.4);
    this.sup.opacity = eo(s); this.sup.transform = 'scale(' + lerp(0.85, 1, eob(s, 1.7)) + ')'; this.sup.transformOrigin = '0 50%';
    this.tutor.render(t);
  },
});
