const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const SD_KEYS = [[0, 60000], [5.6, 60000], [7.6, 63000], [11.6, 63000], [13.6, 57000], [30, 57000]];
const sdX = (t) => 230 + Math.min(t, 18) / 18 * 700, sdY = (p) => 545 - (p - 60000) / 4000 * 190;
kit.scene('side', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    let grid = '';
    [57000, 60000, 63000].forEach((p) => { grid += '<line x1="230" x2="940" y1="' + sdY(p) + '" y2="' + sdY(p) + '" style="stroke:color-mix(in srgb, var(--second) 9%, transparent);stroke-width:1.5"/><text x="216" y="' + (sdY(p) + 8) + '" text-anchor="end" class="mono" style="fill:color-mix(in srgb, var(--second) 55%, var(--ground));font-size:22px">' + UI.fmt(p) + '</text>'; });
    const panel = (cls, y, name, col, role, holds, label) => '<div class="glass ' + cls + '" style="left:1040px;top:' + y + 'px;width:740px;padding:22px 30px;display:flex;flex-direction:column;gap:10px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:32px;font-weight:700">' + name + ' <span style="color:' + col + ';font-size:28px">· ' + role + '</span></span><span class="chip ' + cls + '-h" style="font-size:24px;padding:6px 16px">' + holds + '</span></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:28px;color:color-mix(in srgb, var(--second) 65%, var(--ground))">' + label + '</span><span class="mono ' + cls + '-v" style="font-size:48px"></span></div>' +
      '<p class="mono ' + cls + '-f" style="margin:0;font-size:24px;color:color-mix(in srgb, var(--second) 65%, var(--ground))"></p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words" style="left:140px;top:170px;width:1500px"><p class="kick sd-k">Side by side</p>' +
      '<h2 class="line sd-t">Same price, two results</h2></div>' +
      '<svg class="art sd-ch" viewBox="0 0 1920 1080">' + grid +
      '<path class="sd-l" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--main)"/><circle class="sd-dot" r="10" style="fill:var(--second)"/>' +
      '<text x="230" y="380" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional</text></svg>' +
      panel('sd-a', 360, 'Asha', 'var(--main)', 'spot', 'Owns 0.010 BTC', 'Her coins are worth') +
      panel('sd-r', 570, 'Rahul', 'var(--accent)', 'futures long', 'Owns 0 BTC', 'His PnL') +
      '<p class="fict sd-fi" style="position:absolute;left:230px;top:720px;margin:0">Before fees and funding</p>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.sd-k').style; this.t = q('.sd-t'); this.ch = q('.sd-ch').style; this.l = q('.sd-l'); this.dot = q('.sd-dot'); this.fi = q('.sd-fi').style;
    this.a = q('.sd-a').style; this.r = q('.sd-r').style; this.av = q('.sd-a-v'); this.rv = q('.sd-r-v'); this.af = q('.sd-a-f'); this.rf = q('.sd-r-f');
    this.ah = q('.sd-a-h').style; this.rh = q('.sd-r-h').style;
    this.price = UI.path(SD_KEYS);
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.6, pose: 'present' }, { t: 5.1, pose: 'magnify' }, { t: 11.1, pose: 'think' }, { t: 16.4, pose: 'explain' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    this.ch.opacity = eo(seg(t, 0.6, 1.2)); this.fi.opacity = 0.9 * eo(seg(t, 1.0, 1.5));
    UI.show(this.a, t, 1.2); UI.show(this.r, t, 1.6);
    let d = ''; const end = Math.min(t, 18);
    for (let s = 0; s <= end + 1e-6; s += 0.1) d += (s ? 'L' : 'M') + sdX(s).toFixed(1) + ' ' + sdY(this.price(s)).toFixed(1);
    this.l.setAttribute('d', d || 'M230 ' + sdY(60000));
    this.dot.setAttribute('cx', sdX(end).toFixed(1)); this.dot.setAttribute('cy', sdY(this.price(end)).toFixed(1));
    const p = Math.round(this.price(t)), pnl = (p - 60000) * 0.01;
    UI.set(this.av, UI.fmt(p * 0.01, 2) + ' USDT');
    UI.set(this.rv, UI.sgn(pnl, 2) + ' USDT');
    this.rv.style.color = Math.abs(pnl) < 0.005 ? 'var(--second)' : pnl > 0 ? 'var(--main)' : 'var(--accent)';
    UI.set(this.af, '0.010 × ' + UI.fmt(p) + ' = ' + UI.fmt(p * 0.01, 2));
    UI.set(this.rf, '(' + UI.fmt(p) + ' − 60,000) × 0.010 = ' + UI.sgn(pnl, 2));
    const g = eo(seg(t, 16.6, 17.2));
    this.ah.borderColor = 'color-mix(in srgb, var(--main) ' + (30 + 70 * g).toFixed(0) + '%, transparent)';
    this.ah.background = 'color-mix(in srgb, var(--main) ' + (22 * g).toFixed(1) + '%, var(--ground))';
    this.rh.borderColor = 'color-mix(in srgb, var(--accent) ' + (30 + 70 * g).toFixed(0) + '%, transparent)';
    this.tutor.render(t);
  },
});
