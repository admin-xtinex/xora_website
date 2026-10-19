const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const MK_TOP = 300, MK_BOT = 390;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const btn = (cls, txt, bg, fg) => '<div class="' + cls + '" style="position:absolute;left:40px;right:40px;top:0;height:72px;border-radius:14px;display:grid;place-items:center;font-size:32px;font-weight:700;background:' + bg + ';color:' + fg + '">' + txt + '</div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:190px;width:800px"><p class="kick mk-k" style="color:var(--accent)">Common mistake</p>' +
      '<h2 class="line mk-t">Read the label, not the spot</h2>' +
      '<p class="sub mk-s">Many beginners learn where a button sits, not what it says.</p>' +
      '<p class="def mk-d">Buttons move between apps and updates. <b>Read every label</b>, and check the order summary before you confirm.</p></div>' +
      '<div class="glass mk-p" style="left:1060px;top:200px;width:520px;height:560px">' +
      '<p style="position:absolute;left:40px;top:28px;margin:0;font-size:28px;font-weight:700">Place order</p>' +
      '<span class="chip mk-v" style="position:absolute;right:30px;top:20px;font-size:24px;padding:6px 16px">Version 1</span>' +
      '<div style="position:absolute;left:40px;right:40px;top:110px;height:56px;border-radius:12px;border:1.5px solid color-mix(in srgb, var(--second) 16%, transparent);display:flex;align-items:center;padding:0 18px;font-size:26px" class="mono">0.010 BTC</div>' +
      '<div style="position:absolute;left:40px;right:40px;top:190px;height:56px;border-radius:12px;border:1.5px solid color-mix(in srgb, var(--second) 16%, transparent);display:flex;align-items:center;padding:0 18px;font-size:26px" class="mono">60,000 USDT</div>' +
      btn('mk-buy', 'Buy / Long', 'var(--main)', 'var(--ground)') + btn('mk-sell', 'Sell / Short', 'var(--accent)', 'var(--second)') +
      '<p class="fict" style="position:absolute;left:0;right:0;bottom:22px;margin:0;text-align:center">Educational mock · no real orders</p></div>' +
      '<div class="mk-tap" style="position:absolute;left:1320px;top:' + (200 + MK_TOP + 36) + 'px;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;border:5px solid var(--second);box-sizing:border-box"></div>' +
      '<div class="chip mk-mem" style="position:absolute;left:1320px;top:150px;font-size:26px;padding:8px 22px">Memory: Buy is the top button</div>' +
      '<div class="chip mk-up" style="position:absolute;left:1320px;top:150px;font-size:26px;padding:8px 22px;background:color-mix(in srgb, var(--ground) 70%, var(--accent));border-color:var(--accent)">App update</div>' +
      '<div class="chip mk-oops" style="position:absolute;left:1700px;top:' + (200 + MK_TOP + 36) + 'px;font-size:26px;padding:10px 22px;background:var(--accent);border-color:var(--accent)">Oops: Sell!</div>' +
      '<div class="glass mk-cf" style="left:1100px;top:330px;width:440px;padding:26px 30px;border-color:var(--main);background:color-mix(in srgb, var(--ground) 80%, var(--main))">' +
      '<p class="kick" style="margin:0 0 10px">Check, then confirm</p><p style="margin:0;font-size:30px;font-weight:700;line-height:1.35">Buy / Long 0.010 BTC at 60,000 USDT?</p>' +
      '<div style="display:flex;gap:14px;margin-top:18px"><span class="chip" style="font-size:24px;padding:8px 20px">Cancel</span><span class="chip" style="font-size:24px;padding:8px 20px;background:var(--main);color:var(--ground);border-color:var(--main)">Confirm</span></div></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.mk-k').style; this.s = q('.mk-s'); this.mem = q('.mk-mem').style; this.t = q('.mk-t'); this.d = q('.mk-d'); this.p = q('.mk-p').style;
    this.buy = q('.mk-buy').style; this.sell = q('.mk-sell').style; this.v = q('.mk-v');
    this.tap = q('.mk-tap').style; this.up = q('.mk-up').style; this.oops = q('.mk-oops').style; this.cf = q('.mk-cf').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'checklist' }, { t: 0.6, pose: 'think' }, { t: 9.8, pose: 'confused' }, { t: 13.4, pose: 'explain' }, { t: 16.4, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.s, t, 1.0, { stagger: 0.06 });
    const mm = seg(t, 2.6, 3.0);
    this.mem.opacity = (eo(mm) * (1 - eo(seg(t, 6.4, 6.9)))).toFixed(3);
    this.mem.transform = 'translate(-50%,0) translateY(' + lerp(14, 0, eo(mm)).toFixed(1) + 'px)';
    const pp = seg(t, 0.8, 1.5);
    this.p.opacity = eo(pp); this.p.transform = 'translateY(' + lerp(30, 0, eo(pp)).toFixed(1) + 'px)';
    // The update swaps the two buttons.
    const sw = eio(seg(t, 7.4, 8.4));
    this.buy.top = lerp(MK_TOP, MK_BOT, sw).toFixed(1) + 'px'; this.sell.top = lerp(MK_BOT, MK_TOP, sw).toFixed(1) + 'px';
    this.buy.transform = 'translateX(' + (Math.sin(Math.PI * sw) * 30).toFixed(1) + 'px)'; this.sell.transform = 'translateX(' + (-Math.sin(Math.PI * sw) * 30).toFixed(1) + 'px)';
    UI.set(this.v, t < 7.6 ? 'Version 1' : 'Version 2');
    const u = seg(t, 7.0, 7.5);
    this.up.opacity = (eo(u) * (1 - eo(seg(t, 9.0, 9.5)))).toFixed(3);
    this.up.transform = 'translate(-50%,0) scale(' + lerp(0.8, 1, eob(u, 1.6)).toFixed(4) + ')';
    // A tap from memory, at the old Buy position (before the update, at 3 s; after, at 9.6 s).
    const tapAt = (a) => { const p = seg(t, a, a + 0.7); return p > 0 && p < 1 ? p : 0; };
    const tp = tapAt(3.2) || tapAt(9.6);
    this.tap.opacity = (Math.sin(Math.PI * tp)).toFixed(3);
    this.tap.transform = 'scale(' + lerp(0.5, 1.3, eo(tp)).toFixed(3) + ')';
    const hit1 = Math.sin(Math.PI * seg(t, 3.4, 4.2)), hit2 = seg(t, 9.8, 10.2) * (1 - seg(t, 12.6, 13.2));
    this.buy.boxShadow = '0 0 0 ' + (8 * hit1).toFixed(1) + 'px color-mix(in srgb, var(--main) 40%, transparent)';
    this.sell.boxShadow = '0 0 0 ' + (10 * hit2).toFixed(1) + 'px color-mix(in srgb, var(--accent) 50%, transparent)';
    const o = seg(t, 9.9, 10.4);
    this.oops.opacity = (eo(o) * (1 - eo(seg(t, 12.8, 13.3)))).toFixed(3);
    this.oops.transform = 'translate(-50%,-50%) translateX(' + lerp(30, 0, eo(o)).toFixed(1) + 'px)';
    const c = seg(t, 14.2, 14.9);
    this.cf.opacity = eo(c).toFixed(3);
    this.cf.transform = 'scale(' + lerp(0.9, 1, eob(c, 1.5)).toFixed(4) + ')';
    TextFx.fadeFromRight(this.d, t, 13.6, { stagger: 0.05 });
    this.tutor.render(t);
  },
});
