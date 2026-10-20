const { seg, eo, ei, eob, eio, lerp } = kit;
kit.scene('mistake', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const row = (a, cls) => '<div class="' + cls + '" style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1.5px solid color-mix(in srgb, var(--second) 10%, transparent)">' + a + '</div>';
    const bad = '<div class="glass mk-a" style="left:140px;top:300px;width:760px;height:430px;padding:26px 34px;border-color:color-mix(in srgb, var(--down) 55%, transparent)"><p class="kick" style="margin:0 0 6px;color:var(--down)">Mistake · day one</p>' +
      row('<span style="font-size:30px">Account</span><span class="pill mk-env" style="font-size:26px"></span>', '') +
      row('<span style="font-size:30px">Leverage</span><span class="mono mk-lev" style="font-size:40px"></span>', '') +
      row('<span style="font-size:30px">Approve every setup</span><span class="mono dn" style="font-size:30px">ALL</span>', 'mk-all') +
      '<p style="margin:16px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 66%, var(--ground))">"The app looks smart, so it must win."</p>' +
      '<svg class="mk-x" width="760" height="430" viewBox="0 0 760 430" style="position:absolute;left:0;top:0"><path d="M90 90 L670 360 M670 90 L90 360" pathLength="1" fill="none" stroke-width="10" stroke-linecap="round" style="stroke:color-mix(in srgb, var(--down) 70%, transparent)"/></svg></div>';
    const good = '<div class="glass mk-b" style="left:940px;top:300px;width:700px;height:430px;padding:26px 34px;border-color:color-mix(in srgb, var(--up) 55%, transparent)"><p class="kick" style="margin:0 0 6px;color:var(--up)">Better</p>' +
      ['Practise in <b class="hl">DEMO</b> first', 'Keep leverage <b class="hl">low</b>', 'Read each setup · <b class="hl">skip</b> if unsure', 'A setup is a <b class="hl">maybe</b>, not a promise'].map((s) => '<div class="mk-g" style="display:flex;align-items:center;gap:18px;padding:13px 0"><b style="color:var(--up);font-size:32px">✓</b><span style="font-size:30px;font-weight:600">' + s + '</span></div>').join('') + '</div>';
    kit.stage.append(kit.h('<div>' + bad + good + '</div>'));
    this.head = UI.head(kit, 'Common mistake', 'Live on day one');
    const q = (s) => kit.stage.querySelector(s), all = (s) => [...kit.stage.querySelectorAll(s)];
    this.a = q('.mk-a').style; this.b = q('.mk-b').style; this.env = q('.mk-env'); this.lev = q('.mk-lev'); this.x = q('.mk-x path');
    this.gs = all('.mk-g').map((e) => e.style);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'confused' }, { t: 6.6, pose: 'think' }, { t: 7.8, pose: 'idea' }, { t: 13.0, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    UI.rise(kit, this.a, t, 0.5, 0.6, 30);
    const live = t > 2.0;
    UI.set(this.env, live ? 'LIVE' : 'DEMO');
    this.env.style.color = live ? 'var(--down)' : 'var(--main)';
    const lev = Math.round(lerp(10, 25, eio(seg(t, 3.0, 4.6))));
    UI.set(this.lev, lev + 'x');
    this.lev.style.color = lev > 15 ? 'var(--down)' : 'var(--second)';
    this.x.setAttribute('stroke-dasharray', eio(seg(t, 6.4, 7.2)) + ' 1');
    this.a.opacity = (eo(seg(t, 0.5, 0.9)) * lerp(1, 0.6, eo(seg(t, 7.4, 8.0)))).toFixed(3);
    UI.rise(kit, this.b, t, 7.8, 0.6, 30);
    this.gs.forEach((s, i) => UI.rise(kit, s, t, 8.6 + i * 1.3, 0.5, 14));
    this.tutor.render(t);
  },
});
