const { seg, eo, ei, eob, eio, lerp, TextFx } = kit;
// Stop distance: a ruler measures entry to stop for a long (600 USDT = 1%) and a short (300 USDT = 0.5%).
const SP_Y = (p) => 740 - (p - 59300) * 0.38;
kit.scene('stop', {
  init(kit) {
    this.chrome = UI.chrome(kit);
    const lineAt = (cls, p, col, dash) => '<line class="' + cls + '" x1="170" x2="760" y1="' + SP_Y(p).toFixed(1) + '" y2="' + SP_Y(p).toFixed(1) + '" stroke-width="4"' + (dash ? ' stroke-dasharray="12 8"' : '') + ' style="stroke:' + col + '"/>';
    const br = (cls, a, b, x, col) => '<path class="' + cls + '" d="M' + x + ' ' + (SP_Y(a)).toFixed(1) + ' V' + SP_Y(b).toFixed(1) + ' M' + (x - 12) + ' ' + SP_Y(a).toFixed(1) + ' H' + (x + 12) + ' M' + (x - 12) + ' ' + SP_Y(b).toFixed(1) + ' H' + (x + 12) + '" fill="none" stroke-width="4" style="stroke:' + col + '"/>';
    this.h = UI.head(kit, 'Stop distance', 'How far is the stop?',
      '<svg class="art" viewBox="0 0 1920 1080">' + lineAt('sp-e', 60000, 'var(--second)') + lineAt('sp-l', 59400, 'var(--accent)', 1) + lineAt('sp-s', 60300, 'var(--accent)', 1) +
      br('sp-bl', 60000, 59400, 700, 'var(--main)') + br('sp-bs', 60000, 60300, 620, 'var(--main)') + '</svg>' +
      '<p class="tag sp-te" style="left:180px;top:' + (SP_Y(60000) + 12).toFixed(0) + 'px">Entry 60,000</p>' +
      '<p class="tag sp-tl" style="left:180px;top:' + (SP_Y(59400) + 12).toFixed(0) + 'px;color:var(--accent);border-color:var(--accent)">Long stop 59,400</p>' +
      '<p class="tag sp-ts" style="left:180px;top:' + (SP_Y(60300) + 12).toFixed(0) + 'px;color:var(--accent);border-color:var(--accent)">Short stop 60,300</p>' +
      '<p class="mono sp-nl" style="position:absolute;margin:0;left:730px;top:' + (SP_Y(59700) - 20).toFixed(0) + 'px;font-size:30px;color:var(--main)">600</p>' +
      '<p class="mono sp-ns" style="position:absolute;margin:0;left:650px;top:' + (SP_Y(60150) - 20).toFixed(0) + 'px;font-size:30px;color:var(--main)">300</p>' +
      '<p class="fict" style="position:absolute;left:170px;top:282px;margin:0">BTC/USDT · fictional prices</p>' +
      '<div class="glass sp-d" style="left:980px;top:300px;width:800px;padding:20px 30px"><p class="kick" style="margin:0 0 8px">Meaning</p>' +
      '<p class="def" style="margin:0;font-size:30px"><b>Stop distance</b>: the gap between your entry price and your stop-loss price.</p></div>' +
      '<div class="glass sp-c1" style="left:980px;top:476px;width:800px;padding:16px 30px"><p class="kick" style="margin:0 0 6px">Long · stop below</p>' +
      '<p class="mono" style="margin:0;font-size:30px;line-height:1.5">60,000 − 59,400 = 600 USDT<br>600 ÷ 60,000 = 0.01 = <span class="hl">1%</span></p></div>' +
      '<div class="glass sp-c2" style="left:980px;top:644px;width:800px;padding:14px 30px"><p class="kick" style="margin:0 0 6px;color:var(--accent)">Short · stop above</p>' +
      '<p class="mono" style="margin:0;font-size:30px;line-height:1.5">60,300 − 60,000 = 300 USDT = <span class="hl">0.5%</span></p></div>');
    const q = (s) => kit.stage.querySelector(s);
    ['e', 'l', 's', 'bl', 'bs'].forEach((k) => { this[k] = q('.sp-' + k); });
    ['te', 'tl', 'ts', 'nl', 'ns', 'd', 'c1', 'c2'].forEach((k) => { this[k] = q('.sp-' + k).style; });
    const C = UI.CORNER;
    this.tutor = UI.tutor(kit, {
      keys: [{ t: 0, x: C.x, y: C.y, s: C.s }],
      poses: [{ t: 0, pose: 'explain' }, { t: 0.6, pose: 'read' }, { t: 6.4, pose: 'writing' }, { t: 13.6, pose: 'explain' }, { t: 19.6, pose: 'thumbs' }],
      says: [],
    });
  },
  render(t) {
    this.chrome(t);
    this.h.k.opacity = eo(seg(t, 0, 0.5));
    TextFx.fadeFromRight(this.h.t, t, 0.1);
    const grow = (el, a) => { const p = eo(seg(t, a, a + 0.7)); el.style.opacity = p > 0 ? 1 : 0; el.style.transformBox = 'fill-box'; el.style.transformOrigin = '0 50%'; el.style.transform = 'scaleX(' + p.toFixed(3) + ')'; };
    grow(this.e, 0.6); UI.fade(this.te, t, 0.9);
    grow(this.l, 1.6); UI.fade(this.tl, t, 1.9);
    UI.rise(kit, this.d, t, 0.8, 0.7);
    const bp = eo(seg(t, 6.6, 7.4)); this.bl.style.opacity = bp; this.bl.style.transformBox = 'fill-box'; this.bl.style.transformOrigin = '50% 0'; this.bl.style.transform = 'scaleY(' + bp.toFixed(3) + ')';
    UI.fade(this.nl, t, 7.4); UI.rise(kit, this.c1, t, 7.8, 0.6);
    grow(this.s, 13.8); UI.fade(this.ts, t, 14.1);
    const sp = eo(seg(t, 14.6, 15.4)); this.bs.style.opacity = sp; this.bs.style.transformBox = 'fill-box'; this.bs.style.transformOrigin = '50% 100%'; this.bs.style.transform = 'scaleY(' + sp.toFixed(3) + ')';
    UI.fade(this.ns, t, 15.4); UI.rise(kit, this.c2, t, 15.8, 0.6);
    this.tutor.render(t);
  },
});
