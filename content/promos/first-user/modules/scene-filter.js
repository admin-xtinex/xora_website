const { seg, eo, eio, eob, lerp, TextFx } = kit;
const NR = 5, RX0 = 620, RX1 = 1520, CY = 645, N = 120;
const rx = (k) => RX0 + (RX1 - RX0) * k / (NR - 1);
kit.scene('filter', {
  init(kit) {
    const r = kit.rng(17); this.ps = [];
    for (let i = 0; i < N; i++) { const die = r() < 0.06 ? NR : Math.floor(r() * NR); this.ps.push({ t0: i * 0.038, y0: CY + (r() - 0.5) * 520, die, sp: 520 + r() * 160, dx: (r() - 0.5) }); }
    let rings = '';
    for (let k = 0; k < NR; k++) rings += '<g class="filter-ring"><ellipse cx="' + rx(k) + '" cy="' + CY + '" rx="46" ry="' + (300 - k * 34) + '" fill="#3ecbff" fill-opacity=".04" stroke="url(#filterG)" stroke-width="4"/><text x="' + rx(k) + '" y="' + (CY + 300 - k * 34 + 50) + '" text-anchor="middle" fill="#6b7489" font-size="20" font-family="DM Mono, monospace" letter-spacing="3">AI ' + String(k + 1).padStart(2, '0') + '</text></g>';
    let dots = ''; for (let i = 0; i < N; i++) dots += '<circle class="filter-p" r="7"/>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1920 1080"><defs><linearGradient id="filterG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ecbff"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs>' + rings + dots +
      '<circle class="filter-goal" cx="1760" cy="' + CY + '" r="58" fill="#0c0e1f" stroke="#2fd897" stroke-width="5"/>' +
      '<text x="1760" y="' + (CY + 9) + '" text-anchor="middle" fill="#2fd897" font-size="26" font-family="DM Mono, monospace">TRADE</text></svg>' +
      '<div class="words" style="left:150px;top:110px;width:1500px;gap:14px"><p class="tag">XORA Advanced AI</p><h2 class="line filter-head" style="font-size:84px">Filters out the risky trades.</h2></div>' +
      '<div class="words filter-c" style="left:150px;top:262px;width:1300px;gap:4px"><p class="sub" style="font-size:30px">Most setups never make it through. Only the ones that clear every AI layer become trades.</p></div></div>'));
    this.dots = [...kit.stage.querySelectorAll('.filter-p')];
    this.rings = [...kit.stage.querySelectorAll('.filter-ring')].map((e) => e.style);
    this.head = kit.stage.querySelector('.filter-head'); this.goal = kit.stage.querySelector('.filter-goal').style;
    this.c = kit.stage.querySelector('.filter-c').style;
  },
  render(t0) {
    const t = t0 * 1.3;
    TextFx.fadeFromRight(this.head, t, 0.05);
    this.rings.forEach((s, k) => { s.opacity = eo(seg(t, 0.1 + k * 0.1, 0.5 + k * 0.1)); });
    let seen = 0, passed = 0, hit = new Array(NR).fill(0);
    this.ps.forEach((p, i) => {
      const el = this.dots[i], lt = t - 0.4 - p.t0;
      if (lt <= 0) { el.style.opacity = 0; return; }
      seen++;
      let x = 120 + lt * p.sp, y = lerp(p.y0, CY, eio(Math.min(1, (x - 120) / (RX0 - 120)))), o = 1, col = '#3ecbff';
      const stop = p.die < NR ? rx(p.die) : 1760;
      if (x >= stop) {
        const f = (x - stop) / p.sp;
        if (p.die < NR) { x = stop + 30 * f; y = CY + (p.dx > 0 ? 1 : -1) * 360 * f * f * 3 + p.dx * 60 * f; o = Math.max(0, 1 - f * 1.6); col = '#ff5c7c'; hit[p.die]++; }
        else { x = 1760; o = Math.max(0, 1 - f * 4); col = '#2fd897'; passed++; }
      } else { for (let k = 0; k < NR; k++) if (x > rx(k)) col = k >= 3 ? '#a855f7' : '#3ecbff'; }
      el.setAttribute('cx', x.toFixed(1)); el.setAttribute('cy', y.toFixed(1)); el.setAttribute('fill', col); el.style.opacity = o;
    });
    this.rings.forEach((s, k) => { s.filter = 'brightness(' + (1 + Math.min(1.5, hit[k] * 0.04)) + ')'; });
    this.goal.transformOrigin = '1760px ' + CY + 'px'; this.goal.transform = 'scale(' + (1 + 0.08 * Math.sin(t * 4) * Math.min(1, passed)) + ')';
    this.c.opacity = eo(seg(t, 1.2, 1.7));
    kit.stage.style.opacity = 1 - eio(seg(t, 6.0, 6.5));
  },
});
