const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
const TG_K = [[6.0, 59650], [8.8, 59640], [10.4, 59400], [11.0, 59380], [14, 59340], [20, 59360]];
const tgP = (s) => UI.path(TG_K, s) + (s < 10.2 ? Math.sin(s * 7.3) * 14 : 0);
const tgX = (s) => 1000 + (Math.min(s, 18.6) - 6.0) / 12.6 * 580;
kit.scene('trigger', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    this.P = UI.plan('tg-c', { x0: 1000, x1: 1580, y0: 260, y1: 720, lo: 59300, hi: 59700, step: 100,
      levels: [['s', 59400, 'Trigger 59,400', 'var(--accent)']] });
    const Y = this.P.Y, xf = tgX(11.0).toFixed(1), yf = Y(59380).toFixed(1), yt = Y(59400).toFixed(1);
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080">' + this.P.svg +
      '<path class="tg-a" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--second)"/>' +
      '<path class="tg-b" fill="none" stroke-width="4" stroke-dasharray="6 8" style="stroke:color-mix(in srgb, var(--second) 40%, transparent)"/><circle class="tg-dot" r="10" style="fill:var(--second)"/>' +
      '<g class="tg-f"><circle cx="' + xf + '" cy="' + yf + '" r="14" style="fill:var(--accent)"/><text x="' + (+xf - 20) + '" y="' + (+yf + 46) + '" text-anchor="end" style="fill:var(--accent);font-size:24px;font-weight:700">Executed 59,380</text></g>' +
      '<g class="tg-br"><path d="M' + (+xf + 34) + ' ' + yt + ' h16 V' + yf + ' h-16" fill="none" stroke-width="3" style="stroke:var(--second)"/><text x="' + (+xf + 62) + '" y="' + ((+yt + +yf) / 2 + 8).toFixed(1) + '" style="fill:var(--second);font-size:24px;font-weight:700">20 USDT per BTC</text></g>' +
      '<text x="1000" y="232" class="fict" style="fill:color-mix(in srgb, var(--second) 45%, var(--ground))">BTC price in USDT · fictional · zoomed in</text></svg>' +
      '<div class="words" style="left:140px;top:190px;width:820px"><p class="kick tg-k">Two different prices</p>' +
      '<h2 class="line tg-t">Trigger vs execution</h2></div>' +
      '<div class="glass tg-d1" style="left:140px;top:350px;width:820px;padding:22px 34px"><p class="def" style="margin:0"><b style="color:var(--accent)">Trigger price</b>: the price that starts your exit order.</p></div>' +
      '<div class="glass tg-d2" style="left:140px;top:480px;width:820px;padding:22px 34px"><p class="def" style="margin:0"><b>Execution price</b>: the price where it actually fills.</p></div>' +
      '<div class="glass tg-w" style="left:140px;top:620px;width:820px;padding:22px 34px"><p class="mono" style="margin:0;font-size:32px">(59,380 − 60,000) × 0.01 = <span style="color:var(--accent)">−6.20 USDT</span></p>' +
      '<p class="tg-w2" style="margin:8px 0 0;font-size:28px;color:color-mix(in srgb, var(--second) 70%, var(--ground))">Planned −6.00. Actual −6.20, before fees.</p></div>' +
      '</div>'));
    const q = (s) => kit.stage.querySelector(s);
    this.k = q('.tg-k').style; this.t = q('.tg-t'); this.d1 = q('.tg-d1').style; this.d2 = q('.tg-d2').style; this.w = q('.tg-w').style; this.w2 = q('.tg-w2').style;
    this.a = q('.tg-a'); this.b = q('.tg-b'); this.dot = q('.tg-dot'); this.f = q('.tg-f').style; this.br = q('.tg-br').style;
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'thumbs' }, { t: 0.5, pose: 'explain' }, { t: 8.2, pose: 'candles' }, { t: 13.0, pose: 'magnify' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.t, t, 0.1);
    UI.rise(this.d1, t, 0.8); UI.rise(this.d2, t, 4.2);
    this.P.show(kit, { _: eo(seg(t, 0.6, 1.2)), s: seg(t, 1.2, 2.0) });
    const end = Math.max(6.0, Math.min(t, 18.6));
    const ea = Math.min(end, 11.0);
    this.a.setAttribute('d', t < 6.0 ? 'M0 0' : UI.line(tgP, 6.0, ea, tgX, this.P.Y));
    this.b.setAttribute('d', end > 11.0 ? UI.line(tgP, 11.0, end, tgX, this.P.Y) : 'M0 0');
    this.a.style.opacity = this.dot.style.opacity = eo(seg(t, 6.0, 6.4));
    this.dot.setAttribute('cx', tgX(end).toFixed(1)); this.dot.setAttribute('cy', this.P.Y(tgP(end)).toFixed(1));
    const ln = kit.stage.querySelector('.tg-c-s');
    ln.style.opacity = t < 10.4 ? Math.min(1, seg(t, 1.2, 2.0) * 1.6) : 0.4 + 0.6 * Math.abs(Math.cos(seg(t, 10.4, 11.4) * Math.PI * 3));
    this.f.opacity = eo(seg(t, 11.0, 11.4));
    this.br.opacity = eo(seg(t, 11.6, 12.1));
    UI.rise(this.w, t, 13.1); UI.rise(this.w2, t, 15.0, { dy: 14 });
    this.tutor.render(t);
  },
});
