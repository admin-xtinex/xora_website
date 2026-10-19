const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const NZ_X0 = 200, NZ_PPM = 48, NZ_RX = 1330, nzY = (p) => 588 - (p - 59900) / 290 * 200;
const NZ_15 = UI.agg(UI.M1);
kit.scene('noise', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.cd = UI.cdl(kit, 'nz-c', 20);
    const yA = nzY(60120), yB = nzY(59920);
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="glass nz-p1" style="left:140px;top:316px;width:840px;height:312px"></div>' +
      '<div class="glass nz-p2" style="left:1020px;top:316px;width:620px;height:312px"></div>' +
      '<svg class="art" viewBox="0 0 1920 1080">' +
      '<rect class="nz-band1" x="' + (NZ_X0 + 5 * NZ_PPM - 4) + '" y="' + yA.toFixed(1) + '" width="' + (3 * NZ_PPM + 8) + '" height="' + (yB - yA).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--down) 18%, transparent);stroke:var(--down);stroke-width:2"/>' +
      '<rect class="nz-band2" x="' + (NZ_RX - 90) + '" y="' + yA.toFixed(1) + '" width="180" height="' + (yB - yA).toFixed(1) + '" rx="8" style="fill:color-mix(in srgb, var(--down) 14%, transparent);stroke:var(--down);stroke-width:2;stroke-dasharray:6 6"/>' +
      this.cd.html + '</svg>' +
      '<p class="kick nz-l1" style="position:absolute;left:170px;top:332px;margin:0">1-minute view</p>' +
      '<p class="kick nz-l2" style="position:absolute;left:1050px;top:332px;margin:0">15-minute view</p>' +
      '<p class="tag nz-tag" style="left:' + (NZ_X0 + 5 * NZ_PPM - 4) + 'px;top:' + (yB + 8).toFixed(1) + 'px;font-size:22px;padding:4px 12px;border-color:var(--down)">60,120 → 59,920 · −200</p>' +
      '<p class="tag nz-tag2" style="left:' + (NZ_RX + 100) + 'px;top:' + ((yA + yB) / 2 - 22).toFixed(1) + 'px;border-color:var(--down)">same dip</p>' +
      '<div class="glass nz-d1" style="left:140px;top:646px;width:740px;padding:14px 26px"><p class="def" style="margin:0;font-size:30px"><b>Noise:</b> small back-and-forth moves that hide the bigger picture.</p></div>' +
      '<div class="glass nz-d2" style="left:920px;top:646px;width:720px;padding:14px 26px;border-color:var(--main)"><p class="def" style="margin:0;font-size:30px"><b>Signal:</b> a change that stands out from the noise. Still no promise.</p></div>' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick nz-k">Noise and signal</p>' +
      '<h2 class="line nz-t">Small moves look big up close</h2></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.nz-k').style; this.t = q('.nz-t'); this.p1 = q('.nz-p1').style; this.p2 = q('.nz-p2').style; this.l1 = q('.nz-l1').style; this.l2 = q('.nz-l2').style;
    this.b1 = q('.nz-band1').style; this.b2 = q('.nz-band2').style; this.tag = q('.nz-tag').style; this.tag2 = q('.nz-tag2').style; this.d1 = q('.nz-d1').style; this.d2 = q('.nz-d2').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'idea' }, { t: 0.5, pose: 'explain' }, { t: 5.9, pose: 'confused' }, { t: 10.7, pose: 'point', flip: true }, { t: 16.2, pose: 'calm' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.p1, t, 0.5); this.l1.opacity = eo(seg(t, 0.7, 1.1));
    UI.M1.forEach((c, i) => {
      const p = seg(t, 0.8 + i * 0.12, 1.2 + i * 0.12);
      this.cd.set(i, { x: NZ_X0 + (i + 0.5) * NZ_PPM, w: 28, o: c[0], h: c[1], l: c[2], c: lerp(c[0], c[3], eo(p)), y: nzY, op: eo(p) });
    });
    for (let i = 15; i < 19; i++) this.cd.set(i, { x: 0, w: 1, o: 0, h: 0, l: 0, c: 0, y: nzY, op: 0 });
    UI.rise(this.d1, t, 2.4);
    const b = seg(t, 6.0, 6.6);
    this.b1.opacity = eo(b) * (0.8 + 0.2 * Math.sin(t * 4)); UI.rise(this.tag, t, 6.6);
    UI.rise(this.p2, t, 10.6); this.l2.opacity = eo(seg(t, 10.8, 11.2));
    const f = eob(seg(t, 11.0, 12.0), 1.3);
    this.cd.set(19, { x: NZ_RX, w: 110, o: NZ_15[0], h: NZ_15[1], l: NZ_15[2], c: lerp(NZ_15[0], NZ_15[3], f), y: nzY, op: eo(seg(t, 11.0, 11.4)) });
    this.b2.opacity = eo(seg(t, 12.6, 13.2)); UI.rise(this.tag2, t, 13.0);
    UI.rise(this.d2, t, 16.3);
    this.tutor.render(t);
  },
});
