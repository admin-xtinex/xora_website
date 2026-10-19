window.UI = {
  LESSON: 'T10 · Exchange platform tour',
  TOTAL: 315,
  lockup(kit) {
    return kit.h('<div class="lock"><img alt="" src="' + kit.assets.url('xtinex-x.png') + '"><span class="lock-xt">XTINEX</span><span class="lock-bar"></span><span class="lock-xo">XORA</span></div>');
  },
  // Lesson header: lesson name and a progress bar across the whole film.
  chrome(kit) {
    const el = kit.h('<div class="chrome"><span>' + kit.esc(UI.LESSON) + '</span><div><i></i></div></div>');
    kit.stage.append(el);
    const bar = el.querySelector('i').style, start = kit.start;
    return (t) => { bar.width = (Math.min(1, (start + t) / UI.TOTAL) * 100).toFixed(2) + '%'; };
  },
  fmt(n, dp) { return n.toLocaleString('en-US', { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 }); },
  // Set text only when it changes.
  set(el, v) { v = String(v); if (el.textContent !== v) el.textContent = v; },
  // Signed amount with a real minus sign: +6.00 / −6.00.
  sgn(n, dp) { return (n >= 0 ? '+' : '−') + UI.fmt(Math.abs(n), dp); },
  // Deterministic fictional price walk: returns [[x,y],...] across x0..x1.
  walk(kit, seed, n, x0, x1, y0, y1, amp) {
    const r = kit.rng(seed); const pts = []; let v = 0;
    for (let i = 0; i < n; i++) {
      v += (r() - 0.5) * amp; v *= 0.86;
      const p = i / (n - 1);
      pts.push([x0 + (x1 - x0) * p, y0 + (y1 - y0) * p + v]);
    }
    return pts;
  },
  d(pts) { return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' '); },
  // Eased path through keys [[t, value], ...].
  path(keys) {
    return (t) => {
      let v = keys[0][1];
      for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (t >= a[0]) v = a[1] + (b[1] - a[1]) * window.UI._eio(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])))); }
      return v;
    };
  },
  _eio(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; },
  // A small live wiggle so a price never sits perfectly still (fictional).
  wig(t, amt) { return (Math.sin(t * 1.7) * 0.6 + Math.sin(t * 4.3 + 1) * 0.4) * amt; },
  // Lowest and highest of fn over [a, b] (sampled), for a candle that is still forming.
  hilo(fn, a, b) { let lo = fn(a), hi = lo; for (let s = a; s <= b; s += 0.05) { const v = fn(s); if (v < lo) lo = v; if (v > hi) hi = v; } const v = fn(b); return [Math.min(lo, v), Math.max(hi, v)]; },

  // ── The educational mock terminal ─────────────────────────────────────────
  // Regions in stage pixels. Everything sits above y 776 so the caption band stays clear.
  R: {
    top: { x: 100, y: 120, w: 1720, h: 70 },
    sym: { x: 350, y: 120, w: 710, h: 70 },
    wallet: { x: 1336, y: 120, w: 316, h: 70 },
    sec: { x: 1662, y: 120, w: 158, h: 70 },
    wl: { x: 100, y: 198, w: 290, h: 400 },
    chart: { x: 400, y: 198, w: 710, h: 400 },
    book: { x: 1120, y: 198, w: 320, h: 400 },
    entry: { x: 1450, y: 198, w: 370, h: 578 },
    pos: { x: 100, y: 606, w: 1340, h: 170 },
  },
  SYMS: [['BTC', 60000], ['ETH', 3000], ['SOL', 150], ['XRP', 0.5], ['ADA', 0.4]],
  term(kit, o) {
    o = o || {};
    const R = UI.R, dim = 'color-mix(in srgb, var(--second) 58%, var(--ground))';
    const box = (r, inner, cls) => '<div class="glass tm-p ' + (cls || '') + '" style="left:' + r.x + 'px;top:' + r.y + 'px;width:' + r.w + 'px;height:' + r.h + 'px;border-radius:18px;overflow:hidden">' + inner + '</div>';
    const ab = (x, y, s, inner, cls) => '<div class="' + (cls || '') + '" style="position:absolute;left:' + x + 'px;top:' + y + 'px;' + (s || '') + '">' + inner + '</div>';
    // Top bar
    const top = box(R.top,
      ab(24, 9, 'line-height:1.15', '<div style="font-size:23px;font-weight:700;letter-spacing:0">exchange<span style="color:var(--main)">.example</span></div><div class="fict" style="font-size:16px;letter-spacing:.16em">Educational mock</div>') +
      ab(262, 14, 'width:2px;height:42px;background:color-mix(in srgb, var(--second) 14%, transparent)', '') +
      ab(290, 14, 'display:flex;align-items:center;gap:12px;height:42px', '<span class="tm-sym" style="font-size:28px;font-weight:700"></span><span class="tm-perp" style="font-size:22px;font-weight:600;padding:2px 10px;border-radius:8px;color:var(--main);border:1.5px solid color-mix(in srgb, var(--main) 50%, transparent)">Perp</span><span style="font-size:22px;color:' + dim + '">▾</span>') +
      ab(560, 12, 'height:46px;display:flex;align-items:center', '<span class="mono tm-last" style="font-size:32px"></span>') +
      ab(790, 12, 'height:46px;display:flex;align-items:center;gap:10px', '<span style="font-size:22px;color:' + dim + '">24h</span><span class="mono tm-chg" style="font-size:24px"></span>') +
      ab(1256, 12, 'height:46px;display:flex;align-items:center;gap:12px', '<span style="font-size:22px;color:' + dim + '">Wallet</span><span class="mono tm-bal" style="font-size:24px"></span>') +
      ab(1586, 15, '', '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke-width="3" style="stroke:var(--second)"><path d="M20 4 L33 9 V19 C33 27 27 33 20 36 C13 33 7 27 7 19 V9 Z" stroke-linejoin="round"/><path d="M14 20 L18 24 L26 15" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--main)"/></svg>') +
      ab(1652, 15, '', '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke-width="3" style="stroke:var(--second)"><circle cx="20" cy="20" r="6"/><path d="M20 4 V9 M20 31 V36 M4 20 H9 M31 20 H36 M8.7 8.7 L12.2 12.2 M27.8 27.8 L31.3 31.3 M8.7 31.3 L12.2 27.8 M27.8 12.2 L31.3 8.7" stroke-linecap="round"/></svg>'));
    // Watchlist
    let rows = '';
    UI.SYMS.forEach((s, i) => {
      rows += '<div class="tm-wr" style="position:absolute;left:12px;right:12px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;box-sizing:border-box">' +
        '<span style="font-size:22px;font-weight:600">' + s[0] + '<span style="color:' + dim + ';font-weight:500">/USDT</span></span><span class="mono tm-wp" style="font-size:22px"></span></div>';
    });
    const wl = box(R.wl,
      ab(24, 14, 'font-size:22px;font-weight:700', 'Watchlist') +
      ab(16, 56, 'width:258px;height:46px;box-sizing:border-box;border-radius:12px;display:flex;align-items:center;gap:10px;padding:0 14px;background:color-mix(in srgb, var(--ground) 70%, transparent);border:1.5px solid color-mix(in srgb, var(--second) 16%, transparent)', '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke-width="2.5" style="stroke:' + dim + ';flex:none"><circle cx="9" cy="9" r="6.5"/><path d="M14 14 L20 20" stroke-linecap="round"/></svg><span class="tm-q" style="font-size:22px"></span><span class="tm-caret" style="width:2px;height:26px;background:var(--main)"></span>', 'tm-search') +
      rows);
    // Chart
    const PL = 20, PT = 64, PW = R.chart.w - 120, PH = R.chart.h - 84;
    let grid = '';
    for (let k = -1; k <= 1; k++) grid += '<line x1="' + PL + '" x2="' + (PL + PW) + '" y1="' + (PT + PH / 2 - k * PH / 3) + '" y2="' + (PT + PH / 2 - k * PH / 3) + '" style="stroke:color-mix(in srgb, var(--second) 9%, transparent);stroke-width:1.5"/>';
    const chart = box(R.chart,
      ab(24, 14, 'font-size:22px;font-weight:700', 'Chart') +
      ab(0, 10, 'right:20px;left:auto;display:flex;gap:6px', ['1m', '5m', '15m', '1h'].map((x, i) => '<span class="tm-tf mono" style="font-size:22px;padding:4px 12px;border-radius:8px">' + x + '</span>').join('')) +
      '<svg class="tm-svg" width="' + R.chart.w + '" height="' + R.chart.h + '" style="position:absolute;left:0;top:0;overflow:visible">' + grid + '<g class="tm-c1"></g><g class="tm-c5"></g>' +
      '<line class="tm-pl" x1="' + PL + '" x2="' + (PL + PW) + '" stroke-dasharray="6 6" style="stroke:var(--main);stroke-width:1.5;opacity:.7"/></svg>' +
      [-1, 0, 1].map((k) => ab(PL + PW + 14, PT + PH / 2 - k * PH / 3 - 14, 'font-size:22px;color:' + dim, '', 'mono tm-ax')).join('') +
      ab(PL + PW + 8, 0, 'padding:2px 8px;border-radius:6px;background:var(--main);color:var(--ground);font-size:22px', '', 'mono tm-pt'));
    // Order book
    const brow = (cls, col) => '<div class="tm-br ' + cls + '" style="position:absolute;left:12px;right:12px;height:32px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-radius:8px;box-sizing:border-box">' +
      '<span class="tm-bb" style="position:absolute;right:0;top:3px;bottom:3px;border-radius:6px;background:color-mix(in srgb, ' + col + ' 20%, transparent)"></span>' +
      '<span class="mono tm-bp" style="position:relative;font-size:22px;color:' + col + '"></span><span class="mono tm-bq" style="position:relative;font-size:22px"></span></div>';
    let bk = '';
    for (let i = 0; i < 4; i++) bk += brow('tm-ask', 'var(--accent)');
    for (let i = 0; i < 4; i++) bk += brow('tm-bid', 'var(--main)');
    const book = box(R.book,
      ab(24, 12, 'font-size:22px;font-weight:700', 'Order book') +
      ab(24, 46, 'right:24px;display:flex;justify-content:space-between;font-size:22px;color:' + dim, '<span>Price</span><span>Amount</span>') +
      ab(12, 218, 'right:12px;height:42px;display:flex;align-items:center;justify-content:center;border-top:1.5px solid color-mix(in srgb, var(--second) 12%, transparent);border-bottom:1.5px solid color-mix(in srgb, var(--second) 12%, transparent)', '<span class="mono tm-mid" style="font-size:26px"></span>') +
      bk);
    // Order entry
    const field = (y, label, cls) => ab(20, y, 'right:20px', '<div style="font-size:22px;color:' + dim + ';margin-bottom:6px">' + label + '</div><div class="tm-f ' + cls + '-b" style="height:46px;border-radius:10px;box-sizing:border-box;padding:0 14px;display:flex;align-items:center;background:color-mix(in srgb, var(--ground) 70%, transparent);border:1.5px solid color-mix(in srgb, var(--second) 16%, transparent)"><span class="mono ' + cls + '" style="font-size:24px"></span></div>');
    const line = (y, label, cls) => ab(20, y, 'right:20px;display:flex;justify-content:space-between;font-size:22px', '<span style="color:' + dim + '">' + label + '</span><span class="mono ' + cls + '"></span>');
    const entry = box(R.entry,
      ab(20, 14, 'right:20px;display:flex;justify-content:space-between;align-items:center', '<span style="font-size:22px;font-weight:700">Place order</span><span class="tm-lev" style="font-size:22px;font-weight:600;padding:2px 10px;border-radius:8px;border:1.5px solid color-mix(in srgb, var(--second) 25%, transparent)">Leverage 1x</span>') +
      ab(20, 58, 'right:20px;display:flex;gap:8px', ['Limit', 'Market', 'Stop'].map((x) => '<span class="tm-ty" style="font-size:22px;font-weight:600;padding:4px 12px;border-radius:8px">' + x + '</span>').join('')) +
      field(104, 'Price (USDT)', 'tm-fp') + field(192, 'Size (BTC)', 'tm-fs') +
      line(290, 'Order value', 'tm-fv') + line(324, 'Est. fee', 'tm-ff') + line(358, 'Available', 'tm-fa') +
      ab(20, 404, 'right:20px;height:54px;border-radius:12px;display:grid;place-items:center;font-size:24px;font-weight:700;background:var(--main);color:var(--ground)', 'Buy / Long', 'tm-buy') +
      ab(20, 468, 'right:20px;height:54px;border-radius:12px;display:grid;place-items:center;font-size:24px;font-weight:700;background:var(--accent);color:var(--second)', 'Sell / Short', 'tm-sell') +
      ab(20, 536, 'right:20px;text-align:center', '<span class="fict">Mock · no real orders</span>'));
    // Positions
    const COLS = [24, 270, 420, 610, 840, 1080];
    const cells = (vals, cls, st) => vals.map((v, i) => ab(COLS[i], 0, st, v, cls ? cls + i : '')).join('');
    const pos = box(R.pos,
      ab(24, 12, 'display:flex;gap:30px;font-size:22px;font-weight:600', '<span class="tm-pt0" style="padding-bottom:4px;border-bottom:3px solid var(--main)">Positions (<span class="tm-pn">0</span>)</span><span style="color:' + dim + '">Open orders (0)</span><span style="color:' + dim + '">History</span>') +
      ab(0, 62, 'left:0;right:0;height:30px', cells(['Symbol', 'Side', 'Size', 'Entry price', 'Price now', 'Unrealized PnL'], '', 'font-size:22px;color:' + dim)) +
      ab(0, 104, 'left:0;right:0;height:40px', cells(['BTCUSDT Perp', '', '', '', '', ''], 'tm-pc', 'font-size:24px;font-weight:600'), 'tm-prow') +
      ab(0, 108, 'left:0;right:0;text-align:center;font-size:24px;color:' + dim, 'No open positions', 'tm-pempty'));
    const root = kit.h('<div class="tm" style="position:absolute;inset:0">' + top + wl + chart + book + entry + pos + '</div>');
    kit.stage.append(root);
    const q = (s) => root.querySelector(s), all = (s) => [...root.querySelectorAll(s)];
    const panels = all('.tm-p').map((e) => e.style);
    const E = {
      sym: q('.tm-sym'), last: q('.tm-last'), chg: q('.tm-chg'), bal: q('.tm-bal'),
      q: q('.tm-q'), caret: q('.tm-caret').style, search: q('.tm-search').style,
      wr: all('.tm-wr').map((e) => ({ s: e.style, p: e.querySelector('.tm-wp') })),
      tf: all('.tm-tf').map((e) => e.style), c1: q('.tm-c1'), c5: q('.tm-c5'), pl: q('.tm-pl'), pt: q('.tm-pt'), ax: all('.tm-ax'),
      asks: all('.tm-ask').map((e) => ({ s: e.style, p: e.querySelector('.tm-bp'), q: e.querySelector('.tm-bq'), b: e.querySelector('.tm-bb').style })),
      bids: all('.tm-bid').map((e) => ({ s: e.style, p: e.querySelector('.tm-bp'), q: e.querySelector('.tm-bq'), b: e.querySelector('.tm-bb').style })),
      mid: q('.tm-mid'),
      ty: all('.tm-ty').map((e) => e.style), fp: q('.tm-fp'), fs: q('.tm-fs'), fpb: q('.tm-fp-b').style, fsb: q('.tm-fs-b').style,
      fv: q('.tm-fv'), ff: q('.tm-ff'), fa: q('.tm-fa'), buy: q('.tm-buy').style, sell: q('.tm-sell').style, lev: q('.tm-lev').style,
      pn: q('.tm-pn'), prow: q('.tm-prow').style, pempty: q('.tm-pempty').style, pc: [1, 2, 3, 4, 5].map((i) => q('.tm-pc' + i)),
    };
    E.pc.slice(1).forEach((e) => e.classList.add('mono'));
    // Fictional minute candles (relative to the centre price), ending flat at the centre.
    const r = kit.rng(o.seed || 41), N = 40, base = [];
    let v = 0;
    for (let i = 0; i < N; i++) { const op = v; v += (r() - 0.5) * 0.0034; v *= 0.86; base.push({ o: op, c: v, hw: r() * 0.0008, lw: r() * 0.0008 }); }
    const shift = base[N - 1].c; base.forEach((c) => { c.o -= shift; c.c -= shift; });
    const ry = (rel) => PT + PH / 2 - Math.max(-0.0058, Math.min(0.0058, rel)) / 0.005 * (PH / 2);
    const mkC = (g, n) => { let s = ''; for (let i = 0; i < n; i++) s += '<g><line style="stroke-width:2"/><rect rx="2"/></g>'; g.innerHTML = s; return [...g.children].map((c) => ({ l: c.children[0], r: c.children[1] })); };
    const C1 = mkC(E.c1, 20), C5 = mkC(E.c5, 8);
    const drawC = (els, list, w) => {
      const step = PW / els.length;
      els.forEach((e, i) => {
        const c = list[i], x = PL + step * (i + 0.5), up = c.c >= c.o, col = up ? 'var(--main)' : 'var(--accent)';
        const y1 = ry(Math.max(c.o, c.c)), y2 = ry(Math.min(c.o, c.c));
        e.l.setAttribute('x1', x); e.l.setAttribute('x2', x); e.l.setAttribute('y1', ry(c.h).toFixed(1)); e.l.setAttribute('y2', ry(c.l).toFixed(1));
        e.r.setAttribute('x', (x - w / 2).toFixed(1)); e.r.setAttribute('width', w); e.r.setAttribute('y', y1.toFixed(1)); e.r.setAttribute('height', Math.max(2, y2 - y1).toFixed(1));
        e.l.style.stroke = col; e.r.style.fill = col;
      });
    };
    const api = {
      R, root, E, panels,
      // st: { sym, price, open24, hi, lo, tf (0 = 1m view, 1 = 5m view), search, filter (0..1), sel (row highlight 0..1),
      //       book: {asks:[[p,q,hl]], bids:[...]} (optional), form: {ty, p, s, v, f, a, buy, sell}, pos: {size, entry, mark}, bal }
      render(t, st) {
        const sym = st.sym || 'BTC', C = UI.SYMS.find((s) => s[0] === sym)[1];
        const price = st.price == null ? C + UI.wig(t, C * 0.0004) : st.price;
        const dp = C >= 1000 ? 1 : C >= 10 ? 2 : 4;
        UI.set(E.sym, sym + 'USDT');
        UI.set(E.last, UI.fmt(price, dp));
        const o24 = st.open24 || C * 0.99, ch = (price - o24) / o24 * 100;
        UI.set(E.chg, Math.abs(ch) < 0.005 ? '0.00%' : (ch >= 0 ? '+' : '−') + Math.abs(ch).toFixed(2) + '%');
        E.chg.style.color = E.last.style.color = ch >= 0 ? 'var(--main)' : 'var(--accent)';
        UI.set(E.bal, UI.fmt(st.bal == null ? 1000 : st.bal, 2) + ' USDT');
        // Watchlist: rows filter as the search is typed.
        UI.set(E.q, st.search || 'Search');
        E.q.style.color = st.search ? 'var(--second)' : 'color-mix(in srgb, var(--second) 45%, var(--ground))';
        E.caret.opacity = st.typing ? (Math.floor(t * 2.4) % 2 ? 0 : 1) : 0;
        const f = st.filter || 0;
        let slot = 0;
        UI.SYMS.forEach((s, i) => {
          const w = E.wr[i], keep = !st.search || s[0].startsWith(st.search.replace(/\s/g, '')), y = 116 + 52 * i;
          const p = s[0] === sym ? price : s[1] * (1 + UI.wig(t + i * 1.7, 0.0005));
          UI.set(w.p, UI.fmt(p, s[1] >= 1000 ? 1 : s[1] >= 10 ? 2 : 4));
          const ty = keep ? kit.lerp(y, 116 + 52 * slot, f) : y;
          w.s.top = ty.toFixed(1) + 'px';
          w.s.opacity = keep ? 1 : (1 - f).toFixed(3);
          const hl = s[0] === 'BTC' ? (st.sel || 0) : 0;
          w.s.background = 'color-mix(in srgb, var(--main) ' + (hl * 18).toFixed(1) + '%, transparent)';
          w.s.outline = hl > 0.01 ? '2px solid color-mix(in srgb, var(--main) ' + (hl * 80).toFixed(0) + '%, transparent)' : 'none';
          if (keep) slot++;
        });
        // Chart: 20 one-minute candles, or 8 five-minute candles (each made of five one-minute candles).
        const rel = (price - C) / C, lo = st.lo == null ? Math.min(price, C) : st.lo, hi = st.hi == null ? Math.max(price, C) : st.hi;
        const live = { o: 0, c: rel, h: Math.max((hi - C) / C, rel, 0), l: Math.min((lo - C) / C, rel, 0) };
        const ones = base.slice(1).map((c) => ({ o: c.o, c: c.c, h: Math.max(c.o, c.c) + c.hw, l: Math.min(c.o, c.c) - c.lw }));
        ones.push(live);
        drawC(C1, ones.slice(-20), 14);
        const fives = [];
        for (let i = 0; i < 8; i++) { const g = ones.slice(i * 5, i * 5 + 5); fives.push({ o: g[0].o, c: g[4].c, h: Math.max(...g.map((x) => x.h)), l: Math.min(...g.map((x) => x.l)) }); }
        drawC(C5, fives, 38);
        const tf = st.tf || 0;
        E.c1.style.opacity = (1 - tf).toFixed(3); E.c5.style.opacity = tf.toFixed(3);
        E.tf.forEach((s, i) => {
          const a = i === 0 ? 1 - tf : i === 1 ? tf : 0;
          s.background = 'color-mix(in srgb, var(--main) ' + (a * 24).toFixed(1) + '%, transparent)';
          s.color = a > 0.5 ? 'var(--main)' : 'color-mix(in srgb, var(--second) 58%, var(--ground))';
        });
        const py = ry(rel);
        E.pl.setAttribute('y1', py.toFixed(1)); E.pl.setAttribute('y2', py.toFixed(1));
        UI.set(E.pt, UI.fmt(price, C >= 1000 ? 0 : 2));
        E.pt.style.top = (py - 17).toFixed(1) + 'px';
        const stepY = C / 300;
        E.ax.forEach((e, j) => { UI.set(e, UI.fmt(C + (j - 1) * stepY, C >= 1000 ? 0 : 0)); e.style.opacity = Math.abs(py - (PT + PH / 2 - (j - 1) * PH / 3)) < 34 ? 0 : 1; });
        // Order book: four asks above the middle row, four bids below.
        const tick = C / 6000;
        let bk = st.book;
        if (!bk) {
          const bid = Math.floor(price / tick) * tick, hr = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233 + Math.floor(t * 1.2) * 3.1) * 43758.5; return x - Math.floor(x); };
          bk = { asks: [0, 1, 2, 3].map((i) => [bid + tick * (i + 1), 0.08 + 0.7 * hr(i, 1)]), bids: [0, 1, 2, 3].map((i) => [bid - tick * i, 0.08 + 0.7 * hr(i, 2)]) };
        }
        const bfill = (rows, list, ask) => rows.forEach((rw, i) => {
          const e = list[i];
          if (!e) { rw.s.opacity = 0; return; }
          const sl = e[4] == null ? i : e[4];
          rw.s.top = (ask ? 218 - 34 * (sl + 1) + 1 : 260 + 34 * sl + 1).toFixed(1) + 'px';
          rw.s.opacity = e[3] == null ? 1 : e[3];
          UI.set(rw.p, UI.fmt(e[0], C >= 1000 ? 0 : 1)); UI.set(rw.q, e[1].toFixed(2));
          rw.b.width = Math.min(100, e[1] / 0.9 * 100).toFixed(1) + '%';
          const h = e[2] || 0, col = ask ? 'var(--accent)' : 'var(--main)';
          rw.s.background = 'color-mix(in srgb, ' + col + ' ' + (h * 30).toFixed(1) + '%, transparent)';
          rw.s.outline = h > 0.01 ? '2px solid color-mix(in srgb, ' + col + ' ' + (h * 90).toFixed(0) + '%, transparent)' : 'none';
        });
        bfill(E.asks, bk.asks, true); bfill(E.bids, bk.bids, false);
        UI.set(E.mid, UI.fmt(st.mid == null ? price : st.mid, C >= 1000 ? 1 : 2));
        E.mid.style.color = E.last.style.color;
        // Order entry form.
        const fm = st.form || {};
        E.ty.forEach((s, i) => { const on = i === (fm.ty || 0); s.background = on ? 'color-mix(in srgb, var(--main) 22%, transparent)' : 'transparent'; s.color = on ? 'var(--main)' : 'color-mix(in srgb, var(--second) 58%, var(--ground))'; });
        UI.set(E.fp, fm.p || ''); UI.set(E.fs, fm.s || '');
        E.fpb.borderColor = 'color-mix(in srgb, var(--main) ' + (16 + (fm.pf || 0) * 70).toFixed(0) + '%, transparent)';
        E.fsb.borderColor = 'color-mix(in srgb, var(--main) ' + (16 + (fm.sf || 0) * 70).toFixed(0) + '%, transparent)';
        UI.set(E.fv, fm.v || '—'); UI.set(E.ff, fm.f || '—'); UI.set(E.fa, fm.a || UI.fmt(st.bal == null ? 1000 : st.bal, 2) + ' USDT');
        E.buy.transform = 'scale(' + (1 - 0.05 * Math.sin(Math.PI * (fm.buy || 0))).toFixed(4) + ')';
        E.buy.boxShadow = fm.buy ? '0 0 0 ' + (6 * Math.sin(Math.PI * fm.buy)).toFixed(1) + 'px color-mix(in srgb, var(--main) 40%, transparent)' : 'none';
        // Positions.
        const ps = st.pos;
        UI.set(E.pn, ps ? '1' : '0');
        E.prow.opacity = ps ? (ps.op == null ? 1 : ps.op) : 0;
        E.pempty.opacity = ps ? 1 - (ps.op == null ? 1 : ps.op) : 1;
        if (ps) {
          const pnl = (ps.mark - ps.entry) * ps.size;
          UI.set(E.pc[0], 'Long'); E.pc[0].style.color = 'var(--main)';
          UI.set(E.pc[1], ps.size.toFixed(3) + ' BTC'); UI.set(E.pc[2], UI.fmt(ps.entry, 1)); UI.set(E.pc[3], UI.fmt(ps.mark, 1));
          UI.set(E.pc[4], UI.sgn(pnl, 2) + ' USDT');
          E.pc[4].style.color = pnl >= 0 ? 'var(--main)' : 'var(--accent)';
        }
      },
    };
    return api;
  },
  // A spotlight: everything outside the rectangle dims; the rectangle gets a glowing edge.
  spot(kit) {
    const el = kit.h('<div class="spot" style="position:absolute;left:0;top:0;border-radius:20px;pointer-events:none;box-sizing:border-box"></div>');
    kit.stage.append(el);
    const s = el.style;
    return {
      el,
      // r: {x,y,w,h}; a: dim strength 0..1; g: edge glow 0..1.
      set(r, a, g) {
        const p = 8;
        s.left = (r.x - p).toFixed(1) + 'px'; s.top = (r.y - p).toFixed(1) + 'px';
        s.width = (r.w + 2 * p).toFixed(1) + 'px'; s.height = (r.h + 2 * p).toFixed(1) + 'px';
        s.boxShadow = '0 0 0 3000px rgba(2,3,10,' + (0.8 * a).toFixed(3) + ')' + (g > 0 ? ', 0 0 ' + (30 * g).toFixed(1) + 'px color-mix(in srgb, var(--main) ' + (60 * g).toFixed(0) + '%, transparent)' : '');
        s.border = (3 * Math.min(1, g * 2)).toFixed(2) + 'px solid color-mix(in srgb, var(--main) ' + (90 * g).toFixed(0) + '%, transparent)';
      },
    };
  },
  // Move the spotlight between regions: keys [[t, rect], ...], each move eases over d seconds before its time.
  spotAt(keys, t, d) {
    let r = keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const p = Math.min(1, Math.max(0, (t - (keys[i][0] - (d || 0.9))) / (d || 0.9)));
      if (p <= 0) break;
      const a = r, b = keys[i][1], e = UI._eio(p);
      r = { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, w: a.w + (b.w - a.w) * e, h: a.h + (b.h - a.h) * e };
    }
    return r;
  },
  // A callout card in the dimmed area: kick, headline, body.
  tip(kit, x, y, w, kick, head, body, extra) {
    const el = kit.h('<div class="glass tip" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;padding:30px 36px;display:flex;flex-direction:column;gap:16px;border-color:color-mix(in srgb, var(--main) 45%, transparent)">' +
      '<p class="kick" style="margin:0">' + kick + '</p><h2 class="line" style="margin:0;font-size:64px">' + head + '</h2>' + (body ? '<p class="def" style="margin:0;font-size:30px">' + body + '</p>' : '') + (extra || '') + '</div>');
    kit.stage.append(el);
    return el;
  },
  // Fade and lift an element in at a, out at b.
  show(st, t, a, b, dy) {
    const p = Math.min(1, Math.max(0, (t - a) / 0.6)), q = b == null ? 0 : Math.min(1, Math.max(0, (t - b) / 0.45));
    const eo = 1 - Math.pow(1 - p, 3);
    st.opacity = (eo * (1 - q * q)).toFixed(3);
    st.transform = 'translateY(' + ((1 - eo) * (dy == null ? 30 : dy)).toFixed(1) + 'px)';
  },
  // The tutor sits in this corner between scenes: feet x, feet y, brain width (px).
  CORNER: { x: 1735, y: 1042, s: 160 },
  // Side speech bubbles sit this far higher than in T01, so they clear the two-line caption band (y ≈ 784–930).
  LIFT: 96,
  // The brain tutor. cfg.keys: [{t, x, y, s, d?, ease?}] feet position and brain width, each key reached at t after a d-second move.
  // cfg.poses: [{t, pose, flip?}] ('wave' and 'walk' play their frame loops). cfg.says: [{t0, t1, text, side?: 'left'|'top'}].
  tutor(kit, cfg) {
    const M = kit.json('tutor.json');
    const root = kit.h('<div class="tutor"></div>');
    const shadow = kit.h('<div class="tutor-shadow"></div>');
    root.append(shadow);
    const imgs = {};
    for (const n of Object.keys(M)) {
      const im = kit.h('<img class="tutor-img" alt="" src="' + kit.assets.url('tutor-' + n + '.webp') + '">');
      imgs[n] = im.style; root.append(im);
    }
    const says = (cfg.says || []).map((s) => {
      const b = kit.h('<div class="bubble' + (s.side === 'top' ? ' is-top' : '') + '"><p>' + kit.esc(s.text) + '</p></div>');
      root.append(b);
      return Object.assign({}, s, { st: b.style });
    });
    kit.stage.append(root);
    const keys = cfg.keys, poses = cfg.poses;
    const LOOPS = {
      wave: { f: ['wv1', 'wv2', 'wv3', 'wv4', 'wv3', 'wv2'], fps: 7 },
      walk: { f: ['wk0', 'wk1', 'wk2', 'wk3', 'wk4', 'wk5', 'wk6', 'wk7'], fps: 11 },
    };
    const name = (p, dt) => { const L = LOOPS[p.pose]; return L ? L.f[Math.floor(Math.max(0, dt) * L.fps) % L.f.length] : p.pose; };
    let shown = [];
    const place = (n, flip, x, y, s, op, sc, lift) => {
      const m = M[n], st = imgs[n], k = s / m.bw;
      st.width = (m.w * k).toFixed(1) + 'px'; st.height = (m.h * k).toFixed(1) + 'px';
      st.left = (x - m.ax * k).toFixed(1) + 'px'; st.top = (y - m.feet * k).toFixed(1) + 'px';
      st.transformOrigin = (m.ax * k).toFixed(1) + 'px ' + (m.feet * k).toFixed(1) + 'px';
      st.transform = 'translateY(' + lift.toFixed(2) + 'px) scale(' + (flip ? -sc : sc).toFixed(4) + ',' + sc.toFixed(4) + ')';
      st.opacity = op;
      shown.push(n);
    };
    const api = {
      at(t) {
        let x = keys[0].x, y = keys[0].y, s = keys[0].s;
        for (let i = 1; i < keys.length; i++) {
          const a = keys[i - 1], b = keys[i], d = b.d == null ? 0.8 : b.d;
          const p = kit.seg(t, b.t - d, b.t);
          if (p <= 0) break;
          const e = (b.ease || kit.eio)(p);
          x = kit.lerp(a.x, b.x, e); y = kit.lerp(a.y, b.y, e); s = kit.lerp(a.s, b.s, e);
        }
        return { x, y, s };
      },
      render(t) {
        for (const n of shown) imgs[n].opacity = 0;
        shown = [];
        const { x, y, s } = api.at(t);
        let i = 0;
        for (let j = 0; j < poses.length; j++) if (poses[j].t <= t) i = j;
        const cur = poses[i], dt = t - cur.t;
        const sw = i > 0 ? kit.clamp01(dt / 0.18) : 1;
        const pop = i > 0 ? kit.clamp01(dt / 0.32) : 1;
        const bob = Math.sin(t * 2 * Math.PI / 2.6) * s * 0.025;
        const hop = cur.pose === 'walk' ? 0 : Math.sin(Math.PI * pop) * s * 0.07;
        const step = cur.pose === 'walk' ? Math.abs(Math.sin(dt * Math.PI * 2.75)) * s * 0.03 : 0;
        const breathe = 1 + 0.012 * Math.sin(t * 2 * Math.PI / 3.1);
        const sc = breathe * (cur.pose === 'walk' ? 1 : kit.lerp(0.93, 1, kit.eob(pop, 1.8)));
        if (sw < 1) { const pv = poses[i - 1]; place(name(pv, t - pv.t), !!pv.flip, x, y, s, 1 - sw, breathe, bob); }
        place(name(cur, dt), !!cur.flip, x, y, s, sw, sc, bob - hop - step);
        const sh = shadow.style;
        sh.left = (x - s * 0.6).toFixed(1) + 'px'; sh.top = (y - s * 0.07).toFixed(1) + 'px';
        sh.width = (s * 1.2).toFixed(1) + 'px'; sh.height = (s * 0.16).toFixed(1) + 'px';
        sh.opacity = 0.75 - (hop + step) / s;
        for (const b of says) {
          const p = kit.seg(t, b.t0, b.t0 + 0.32), o = kit.seg(t, b.t1 - 0.25, b.t1);
          b.st.opacity = kit.eo(p) * (1 - kit.ei(o));
          if (b.st.opacity === '0') continue;
          const g = kit.lerp(0.88, 1, kit.eob(p, 1.6)) * kit.lerp(1, 0.96, kit.ei(o));
          if (b.side === 'top') {
            b.st.transformOrigin = '50% 100%';
            b.st.transform = 'translate(' + x.toFixed(1) + 'px,' + (y - s * 1.42).toFixed(1) + 'px) translate(-50%,-100%) scale(' + g.toFixed(4) + ')';
          } else {
            b.st.transformOrigin = '100% 100%';
            b.st.transform = 'translate(' + (x - s * 0.18).toFixed(1) + 'px,' + (y - s * 1.12 - UI.LIFT).toFixed(1) + 'px) translate(-100%,-100%) scale(' + g.toFixed(4) + ')';
          }
        }
      },
    };
    return api;
  },
};
