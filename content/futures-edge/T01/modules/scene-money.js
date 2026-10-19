const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
kit.scene('money', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:200px;width:820px"><p class="kick mn-k">Start with money</p>' +
      '<h2 class="line mn-t">Money is value people agree to accept</h2>' +
      '<p class="sub mn-s">Most money today is already just numbers in a computer.</p></div>' +
      '<div class="glass mn-def" style="left:140px;top:660px;width:880px;padding:30px 38px"><p class="def" style="margin:0"><b>Value</b> is what something is worth to people. <b>Money</b> is a shared way to store value and exchange it.</p></div>' +
      '<div class="mn-note" style="position:absolute;left:1060px;top:250px;width:480px;height:240px;border-radius:20px;box-sizing:border-box;border:3px solid color-mix(in srgb, var(--main) 60%, transparent);background:linear-gradient(135deg, color-mix(in srgb, var(--ground) 80%, var(--main)), color-mix(in srgb, var(--ground) 80%, var(--accent)));display:grid;place-items:center">' +
      '<span class="mono" style="position:absolute;left:22px;top:14px;font-size:30px">100</span><span class="mono" style="position:absolute;right:22px;bottom:14px;font-size:30px">100</span>' +
      '<span style="width:150px;height:150px;border-radius:50%;border:3px solid color-mix(in srgb, var(--second) 30%, transparent);display:grid;place-items:center"><span class="mono" style="font-size:64px">100</span></span></div>' +
      '<div class="mn-items" style="position:absolute;left:1060px;top:540px;display:flex;gap:18px"><span class="chip mn-i">Food</span><span class="chip mn-i">Bus ticket</span><span class="chip mn-i">Rent</span></div>' +
      '<div class="glass mn-bank" style="left:1070px;top:240px;width:460px;padding:34px 40px"><p class="fict" style="margin:0 0 12px">Example bank app</p><p style="margin:0;font-size:26px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">Account balance</p>' +
      '<p class="mono" style="margin:8px 0 0;font-size:64px">₹5,000.00</p><p style="margin:14px 0 0;font-size:22px;color:color-mix(in srgb, var(--second) 55%, var(--ground))">Stored as a number on the bank computers</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mn-k').style; this.t = q('.mn-t'); this.s = q('.mn-s'); this.def = q('.mn-def').style;
    this.note = q('.mn-note').style; this.bank = q('.mn-bank').style;
    this.items = [...kit.stage.querySelectorAll('.mn-i')].map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.4, pose: 'present' }, { t: 10.2, pose: 'explain' }],
      says: [{ t0: 13.2, t1: 17.6, text: 'Crypto is a newer kind of digital value.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    const n = seg(t, 1.2, 2.0), m = seg(t, 6.2, 7.2);
    this.note.opacity = eo(n) * (1 - ei(m));
    this.note.transform = 'translateY(' + lerp(40, 0, eo(n)) + 'px) rotate(' + lerp(-4, 0, eob(n, 1.6)) + 'deg) scale(' + lerp(1, 0.6, eio(m)) + ')';
    this.items.forEach((s, i) => {
      const a = 2.8 + i * 0.5;
      s.opacity = eo(seg(t, a, a + 0.4)) * (1 - ei(seg(t, 5.8, 6.4)));
      s.transform = 'translateY(' + lerp(24, 0, eo(seg(t, a, a + 0.5))) + 'px)';
    });
    const b = seg(t, 6.8, 7.8);
    this.bank.opacity = eo(b);
    this.bank.transform = 'scale(' + lerp(0.7, 1, eob(b, 1.5)) + ') translateY(' + (-Math.max(0, t - 7.8) * 1.5).toFixed(2) + 'px)';
    TextFx.fadeFromRight(this.s, t, 7.6, { stagger: 0.07 });
    const d = seg(t, 10.2, 10.9);
    this.def.opacity = eo(d);
    this.def.transform = 'translateY(' + lerp(30, 0, eo(d)) + 'px)';
    this.tutor.render(t);
  },
});
