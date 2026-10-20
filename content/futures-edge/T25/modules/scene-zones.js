const { seg, eo, ei, eob, eio, lerp } = kit;
kit.scene('zones', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.ch = UI.chart(kit, 'zn', {});
    const D = UI.D;
    this.ch.under.innerHTML = '<g class="zn-s">' + UI.band(60000, 60060, 'var(--up)') + '</g><g class="zn-r">' + UI.band(60480, 60530, 'var(--down)') + '</g>';
    this.ch.ov.innerHTML = '<g class="zn-d"><circle cx="' + D.x(8) + '" cy="' + (D.y(59900) + 22) + '" r="10" style="fill:var(--main)"/><circle cx="' + D.x(13) + '" cy="' + (D.y(60040) + 22) + '" r="10" style="fill:var(--main)"/><circle cx="' + D.x(2) + '" cy="' + (D.y(60500) - 22) + '" r="10" style="fill:var(--accent)"/></g>';
    kit.stage.append(kit.h('<div>' +
      '<div class="glass zn-a" style="left:1230px;top:290px;width:460px;padding:20px 30px;border-color:color-mix(in srgb, var(--down) 60%, transparent)"><p class="kick" style="margin:0 0 6px;color:var(--down)">Resistance zone</p><p class="mono" style="margin:0;font-size:34px">60,480 – 60,530</p><p style="margin:6px 0 0;font-size:26px;color:color-mix(in srgb, var(--second) 66%, var(--ground))">Sellers stepped in here before</p></div>' +
      '<div class="glass zn-b" style="left:1230px;top:480px;width:460px;padding:20px 30px;border-color:color-mix(in srgb, var(--up) 60%, transparent)"><p class="kick" style="margin:0 0 6px;color:var(--up)">Support zone</p><p class="mono" style="margin:0;font-size:34px">60,000 – 60,060</p><p style="margin:6px 0 0;font-size:26px;color:color-mix(in srgb, var(--second) 66%, var(--ground))">Buyers stepped in here before</p></div></div>'));
    this.head = UI.head(kit, 'Step 3 · levels', 'Zones, not lines');
    const q = (s) => kit.stage.querySelector(s);
    this.s = q('.zn-s'); this.r = q('.zn-r'); this.d = q('.zn-d').style; this.a = q('.zn-a').style; this.b = q('.zn-b').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'magnify' }, { t: 5.8, pose: 'point', flip: true }, { t: 13.2, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t); this.head(t);
    this.ch.render(t);
    this.d.opacity = eo(seg(t, 1.6, 2.2)) * (0.6 + 0.4 * Math.sin(t * 4));
    const zs = seg(t, 6.8, 7.8), zr = seg(t, 9.0, 10.0);
    this.s.style.opacity = eo(zs); this.s.setAttribute('transform', 'translate(0 ' + (lerp(1, 0, eo(zs)) * 0).toFixed(1) + ')');
    this.r.style.opacity = eo(zr);
    this.s.style.transformOrigin = '50% ' + UI.D.y(60030) + 'px'; this.s.style.transform = 'scaleY(' + lerp(0.1, 1, eob(zs, 1.4)).toFixed(3) + ')';
    this.r.style.transformOrigin = '50% ' + UI.D.y(60505) + 'px'; this.r.style.transform = 'scaleY(' + lerp(0.1, 1, eob(zr, 1.4)).toFixed(3) + ')';
    UI.rise(kit, this.a, t, 13.2, 0.6, 20); UI.rise(kit, this.b, t, 14.0, 0.6, 20);
    this.tutor.render(t);
  },
});
