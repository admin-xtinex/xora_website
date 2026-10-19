const { seg, eo, eob, eio, lerp, TextFx } = kit;
kit.scene('token', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const base = (x, label, cls) => '<div class="tk-base ' + cls + '" style="position:absolute;left:' + (x - 160) + 'px;top:560px;width:320px;height:64px;border-radius:14px;display:grid;place-items:center;font-size:24px;font-weight:700;background:color-mix(in srgb, var(--ground) 80%, var(--main));border:2px solid color-mix(in srgb, var(--main) 45%, transparent)">' + label + '</div>';
    const coin = (x, y, label, cls, tok) => '<div class="' + cls + '" style="position:absolute;left:' + (x - 62) + 'px;top:' + (y - 62) + 'px;width:124px;height:124px;border-radius:' + (tok ? '28px' : '50%') + ';display:grid;place-items:center;font-size:30px;font-weight:500;' + (tok ? 'background:color-mix(in srgb, var(--accent) 30%, var(--ground));border:3px solid var(--accent)' : 'background:color-mix(in srgb, var(--main) 25%, var(--ground));border:3px solid var(--main)') + '"><span class="mono">' + label + '</span></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      base(1150, 'Bitcoin blockchain', 'tk-b1') + base(1540, 'Ethereum blockchain', 'tk-b2') +
      coin(1150, 470, 'BTC', 'tk-c1') + coin(1540, 470, 'ETH', 'tk-c2') + coin(1540, 320, 'USDT', 'tk-c3', true) +
      '<p class="kick tk-l1" style="position:absolute;left:1150px;top:650px;margin:0;transform:translateX(-50%)">Coin</p>' +
      '<p class="kick tk-l2" style="position:absolute;left:1670px;top:308px;margin:0;color:var(--accent)">Token</p>' +
      '<div class="words" style="left:140px;top:200px;width:760px"><p class="kick tk-k">Two words you will hear</p>' +
      '<h2 class="line tk-t">Coins and tokens</h2>' +
      '<p class="def tk-d">A <b>coin</b> runs on its own blockchain. A <b>token</b> is built on top of an existing one.</p>' +
      '<p class="sub tk-s">USDT is a token designed to track the US dollar. It runs on several blockchains.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tk-k').style; this.t = q('.tk-t'); this.d = q('.tk-d'); this.s = q('.tk-s');
    this.parts = ['.tk-b1', '.tk-c1', '.tk-l1', '.tk-b2', '.tk-c2', '.tk-c3', '.tk-l2'].map((s) => q(s).style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'think' }, { t: 1.0, pose: 'present' }, { t: 8.2, pose: 'explain' }],
      says: [{ t0: 8.4, t1: 11.8, text: 'We will meet USDT again in lesson three.' }],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    TextFx.fadeFromRight(this.d, t, 0.9, { stagger: 0.06 });
    const at = [1.4, 1.9, 2.3, 3.4, 3.9, 5.0, 5.4];
    this.parts.forEach((s, i) => {
      const p = seg(t, at[i], at[i] + 0.6);
      s.opacity = eo(seg(t, at[i], at[i] + 0.3));
      const drop = i === 1 || i === 4 || i === 5;
      s.transform = (i === 2 ? 'translateX(-50%) ' : '') + (drop ? 'translateY(' + lerp(-80, 0, eob(p, 1.5)) + 'px)' : 'translateY(' + lerp(20, 0, eo(p)) + 'px)');
    });
    TextFx.fadeFromRight(this.s, t, 5.8, { stagger: 0.06 });
    this.tutor.render(t);
  },
});
