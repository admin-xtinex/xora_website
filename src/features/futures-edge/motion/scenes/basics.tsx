/** Scene renderers: text card and Phase 1 / order basics. Each is a pure function of scene progress p ∈ [0,1]. */
import { linearToyPrice, ordersFill, type BookLevel } from '../../simulation/math';
import { Card, clamp, FictionalBadge, fmt, Frame, H, HLine, lerp, makeScale, pathD, phase, PriceAxis, W } from '../chart';
import { isObj, nums, numOr, objs, strOr, strs } from '../params';
import type { SceneProps } from '../types';

// ------------------------------------------------------------------ text-card

const TEXT_ICONS: Record<string, string> = { plain: '', checklist: '✓', recap: '', 'red-flags': '⚠', 'risk-warning': '!' };

export function TextCardScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'plain');
  const items = strs(params['items']);
  const shown = items.length === 0 ? 0 : Math.ceil(clamp(p * 1.15, 0, 1) * items.length);
  return (
    <div className={`fe-textcard fe-textcard-${variant}`}>
      <p className="fe-textcard-heading">{strOr(params['heading'], '')}</p>
      {items.length > 0 ? (
        <ol className={`fe-textcard-list ${variant === 'recap' ? 'is-numbered' : ''}`}>
          {items.map((it, k) => (
            <li key={k} className={k < shown ? 'is-on' : 'is-off'} aria-hidden={k >= shown}>
              {TEXT_ICONS[variant] ? <span className="fe-textcard-icon" aria-hidden>{TEXT_ICONS[variant]}</span> : null}
              <span>{it}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ value-exchange

export function ValueExchangeScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'value-from-price');
  const asset = strOr(params['asset'], 'BTC');
  const quote = strOr(params['quote'], 'USDT');
  if (variant === 'ledger-record') {
    const entries = objs(params['entries']);
    const shown = Math.ceil(p * entries.length);
    return (
      <Frame label={`A shared ledger records ${entries.length} fictional transfers`}>
        <FictionalBadge />
        <text x={40} y={44} className="fe-svg-title">Shared record (ledger)</text>
        {entries.map((e, k) => {
          const y = 70 + k * 52;
          const on = k < shown;
          return (
            <g key={k} opacity={on ? 1 : 0.15}>
              <rect x={40} y={y} width={560} height={40} rx={8} className="fe-svg-card" />
              <text x={56} y={y + 25} className="fe-svg-card-line">#{k + 1}  {strOr(e['from'], '')} → {strOr(e['to'], '')}</text>
              <text x={584} y={y + 25} textAnchor="end" className="fe-svg-card-title">{fmt(numOr(e['amount'], 0))} {asset}</text>
            </g>
          );
        })}
        <text x={40} y={H - 16} className="fe-svg-small">The balance is an entry in this record, not a physical coin inside a phone.</text>
      </Frame>
    );
  }
  if (variant === 'swap') {
    const give = isObj(params['give']) ? params['give'] : {};
    const get = isObj(params['get']) ? params['get'] : {};
    const t = phase(p, 0.15, 0.8);
    return (
      <Frame label={`Exchange ${numOr(give['amount'], 0)} ${strOr(give['asset'], '')} for ${numOr(get['amount'], 0)} ${strOr(get['asset'], '')}`}>
        <FictionalBadge />
        <Card x={40} y={110} w={220} h={110} title="You give" lines={[`${fmt(numOr(give['amount'], 0))} ${strOr(give['asset'], '')}`]} tone="neutral" />
        <Card x={380} y={110} w={220} h={110} title="You receive" lines={[`${fmt(numOr(get['amount'], 0))} ${strOr(get['asset'], '')}`]} tone={t >= 1 ? 'up' : 'neutral'} />
        <circle cx={lerp(270, 370, t)} cy={150} r={8} className="fe-svg-dot-buy" />
        <circle cx={lerp(370, 270, t)} cy={185} r={8} className="fe-svg-dot-sell" />
        <text x={W / 2} y={260} textAnchor="middle" className="fe-svg-label">{t >= 1 ? 'Swap complete: value changed hands at one agreed price' : 'Both sides agree on a price…'}</text>
      </Frame>
    );
  }
  const quantity = numOr(params['quantity'], 0);
  const prices = nums(params['prices']);
  if (variant === 'balance-quantity') {
    const q = quantity * phase(p, 0.1, 0.7);
    return (
      <Frame label={`A fictional balance of ${quantity} ${asset} appears`}>
        <FictionalBadge />
        <Card x={170} y={90} w={300} h={140} title="Fictional wallet balance" lines={[`${fmt(q, 4)} ${asset}`, 'A number recorded for you,', 'not an object you hold.']} tone="neutral" />
      </Frame>
    );
  }
  // value-from-price: quantity fixed, price steps through `prices`
  const idx = prices.length > 1 ? p * (prices.length - 1) : 0;
  const k = Math.min(prices.length - 1, Math.floor(idx));
  const price = prices.length > 1 ? lerp(prices[k] as number, prices[Math.min(prices.length - 1, k + 1)] as number, idx - k) : (prices[0] ?? 0);
  const value = quantity * price;
  const first = (prices[0] ?? 0) * quantity;
  const sc = makeScale(prices, prices.length, { x: 360, y: 70, w: 240, h: 190 });
  return (
    <Frame label={`${quantity} ${asset} valued at changing fictional prices; value now ${fmt(value, 2)} ${quote}`}>
      <FictionalBadge />
      <Card x={30} y={70} w={300} h={190} title={`${fmt(quantity, 4)} ${asset} × price`} tone={value > first ? 'up' : value < first ? 'down' : 'neutral'}
        lines={[`Price: ${fmt(price, 2)} ${quote} per ${asset}`, `Value: ${fmt(value, 2)} ${quote}`, `Change: ${value >= first ? '+' : '−'}${fmt(Math.abs(value - first), 2)} ${quote}`, 'Quantity did not change.', 'Only the price did.']} />
      <path d={pathD(prices, sc, idx + 1)} className="fe-svg-price" />
      <text x={360} y={290} className="fe-svg-small">Fictional {asset}/{quote} price</text>
    </Frame>
  );
}

// ------------------------------------------------------------------ supply-demand

export function SupplyDemandScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'balanced');
  const base = numOr(params['basePrice'], 100);
  const step = numOr(params['stepPerLevel'], 1);
  const b = nums(params['buyers']);
  const s = nums(params['sellers']);
  const at = (arr: number[], t: number) => lerp(arr[0] ?? 0, arr[1] ?? arr[0] ?? 0, t);
  const samples = 24;
  const hist: number[] = [];
  for (let k = 0; k <= samples; k++) {
    const t = (k / samples) * p;
    const r = linearToyPrice({ buyers: Math.round(at(b, t)), sellers: Math.round(at(s, t)), basePrice: base, stepPerLevel: step });
    hist.push(r.ok ? r.value.price : base);
  }
  const buyers = Math.round(at(b, p));
  const sellers = Math.round(at(s, p));
  const price = hist[hist.length - 1] ?? base;
  const sc = makeScale([...hist, base + step * 3, base - step * 3], samples + 1, { x: 220, y: 60, w: 200, h: 200 });
  const dots = (n: number, x: number, cls: string) => Array.from({ length: Math.min(n, 12) }, (_, k) => <circle key={k} cx={x} cy={290 - k * 20} r={7} className={cls} />);
  return (
    <Frame label={`Illustrative model: ${buyers} buyers, ${sellers} sellers, price ${fmt(price, 2)}`}>
      <FictionalBadge text="ILLUSTRATIVE MODEL — NOT A REAL MARKET" />
      <text x={90} y={44} textAnchor="middle" className="fe-svg-label">Buyers: {buyers}</text>
      {dots(buyers, 90, 'fe-svg-dot-buy')}
      <text x={550} y={44} textAnchor="middle" className="fe-svg-label">Sellers: {sellers}</text>
      {dots(sellers, 550, 'fe-svg-dot-sell')}
      <path d={pathD(hist, sc)} className="fe-svg-price" />
      <text x={320} y={300} textAnchor="middle" className="fe-svg-title">{fmt(price, 2)}</text>
      <text x={320} y={322} textAnchor="middle" className="fe-svg-small">{variant === 'thin-market' ? 'Few orders: one trade moves price a lot' : 'Toy price = base + step × (buyers − sellers)'}</text>
    </Frame>
  );
}

// ------------------------------------------------------------------ trading-pair

export function TradingPairScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'price-tag');
  const base = strOr(params['base'], 'BTC');
  const quote = strOr(params['quote'], 'USDT');
  const price = numOr(params['price'], 0);
  if (variant === 'split') {
    const t = phase(p, 0.1, 0.6);
    return (
      <Frame label={`${base}/${quote}: ${base} is the base asset, ${quote} is the quote asset`}>
        <FictionalBadge />
        <text x={W / 2} y={150} textAnchor="middle" className="fe-svg-hero">{base}/{quote}</text>
        <g opacity={t}>
          <line x1={250} x2={200} y1={165} y2={230} className="fe-svg-pointer" />
          <text x={200} y={252} textAnchor="middle" className="fe-svg-label">BASE: the thing being priced</text>
          <line x1={390} x2={440} y1={165} y2={230} className="fe-svg-pointer" />
          <text x={440} y={252} textAnchor="middle" className="fe-svg-label">QUOTE: the unit of the price</text>
        </g>
        <text x={W / 2} y={310} opacity={phase(p, 0.6, 0.9)} textAnchor="middle" className="fe-svg-small">Symbol on many platforms: {base}{quote} (no slash)</text>
      </Frame>
    );
  }
  if (variant === 'size-compare') {
    const qs = nums(params['quantities']);
    const max = Math.max(...qs.map((q) => q * price), 1);
    return (
      <Frame label={`Value of different ${base} quantities at ${fmt(price, 2)} ${quote}`}>
        <FictionalBadge />
        <text x={40} y={44} className="fe-svg-title">Same price, different quantity</text>
        {qs.map((q, k) => {
          const v = q * price * phase(p, k * 0.3, k * 0.3 + 0.4);
          return (
            <g key={k}>
              <text x={40} y={100 + k * 80} className="fe-svg-label">{q} {base} × {fmt(price, 2)}</text>
              <rect x={40} y={110 + k * 80} width={Math.max(4, (v / max) * 540)} height={26} rx={6} className="fe-svg-fill-neutral" />
              <text x={600} y={100 + k * 80} textAnchor="end" className="fe-svg-card-title">{fmt(v, 2)} {quote}</text>
            </g>
          );
        })}
      </Frame>
    );
  }
  if (variant === 'convert-quote-to-base') {
    const amt = numOr(params['quoteAmount'], 0);
    const t = phase(p, 0.2, 0.8);
    return (
      <Frame label={`${amt} ${quote} ÷ ${price} = ${fmt(amt / price, 6)} ${base}`}>
        <FictionalBadge />
        <Card x={30} y={110} w={180} h={90} title="Spend" lines={[`${fmt(amt, 2)} ${quote}`]} />
        <text x={W / 2} y={160} textAnchor="middle" className="fe-svg-title">÷ {fmt(price, 2)}</text>
        <Card x={430} y={110} w={180} h={90} title="Receive" lines={[`${fmt((amt / price) * t, 6)} ${base}`]} tone={t >= 1 ? 'up' : 'neutral'} />
        <text x={W / 2} y={260} textAnchor="middle" className="fe-svg-small">quantity = quote amount ÷ price (fees ignored)</text>
      </Frame>
    );
  }
  if (variant === 'reprice') {
    const prices = nums(params['prices']);
    const qty = numOr(params['quantity'], 1);
    const idx = Math.min(prices.length - 1, Math.floor(p * prices.length));
    const pr = prices[idx] ?? price;
    return (
      <Frame label={`Price label updates to ${fmt(pr, 2)}; ${qty} ${base} worth ${fmt(pr * qty, 2)} ${quote}`}>
        <FictionalBadge />
        <rect x={170} y={70} width={300} height={90} rx={14} className="fe-svg-card" />
        <text x={W / 2} y={128} textAnchor="middle" className="fe-svg-hero-sm">1 {base} = {fmt(pr, 2)} {quote}</text>
        <text x={W / 2} y={220} textAnchor="middle" className="fe-svg-title">{qty} {base} = {fmt(pr * qty, 2)} {quote}</text>
        <text x={W / 2} y={260} textAnchor="middle" className="fe-svg-small">Update {idx + 1} of {prices.length}: the label changes, your quantity does not</text>
      </Frame>
    );
  }
  // price-tag
  const t = phase(p, 0.1, 0.5);
  return (
    <Frame label={`Price tag: 1 ${base} = ${fmt(price, 2)} ${quote}`}>
      <FictionalBadge />
      <g opacity={t} transform={`translate(0 ${(1 - t) * 20})`}>
        <rect x={150} y={100} width={340} height={110} rx={16} className="fe-svg-card" />
        <text x={W / 2} y={150} textAnchor="middle" className="fe-svg-hero-sm">1 {base}</text>
        <text x={W / 2} y={188} textAnchor="middle" className="fe-svg-title">costs {fmt(price, 2)} {quote}</text>
      </g>
      <text x={W / 2} y={260} opacity={phase(p, 0.5, 0.9)} textAnchor="middle" className="fe-svg-small">Like a shop label: the price of one item, written in another unit</text>
    </Frame>
  );
}

// ------------------------------------------------------------------ order-book-matching

function readBook(v: unknown): BookLevel[] {
  return objs(v).map((l) => ({ price: numOr(l['price'], NaN), quantity: numOr(l['quantity'], NaN) })).filter((l) => l.price > 0 && l.quantity > 0);
}

export function OrderBookScene({ params, p }: SceneProps) {
  const variant = strOr(params['variant'], 'match');
  const asks = readBook(params['asks']).sort((a, b) => a.price - b.price);
  const bids = readBook(params['bids']).sort((a, b) => b.price - a.price);
  const inc = isObj(params['incoming']) ? params['incoming'] : undefined;
  const incSide = inc && strOr(inc['side'], 'buy') === 'sell' ? 'sell' : 'buy';
  const incQty = inc ? numOr(inc['quantity'], 0) : 0;
  const limit = inc && typeof inc['limitPrice'] === 'number' ? inc['limitPrice'] : undefined;
  const t = inc ? phase(p, 0.25, 0.85) : 0;
  const res = inc
    ? ordersFill({ side: incSide, type: limit !== undefined ? 'limit' : 'market', quantity: Math.max(1e-9, incQty * t), book: incSide === 'buy' ? asks : bids, ...(limit !== undefined ? { limitPrice: limit } : {}) })
    : null;
  const consumed = new Map<number, number>();
  if (res && res.ok) for (const f of res.value.fills) consumed.set(f.price, f.quantity);
  const bestAsk = asks[0]?.price;
  const bestBid = bids[0]?.price;
  const maxQ = Math.max(1, ...asks.map((a) => a.quantity), ...bids.map((b) => b.quantity));
  const rowH = 24;
  const shownAsks = asks.slice(0, 5).reverse();
  const shownBids = bids.slice(0, 5);
  const midY = 40 + shownAsks.length * rowH + 14;
  const row = (l: BookLevel, y: number, kind: 'ask' | 'bid') => {
    const used = kind === (incSide === 'buy' ? 'ask' : 'bid') ? consumed.get(l.price) ?? 0 : 0;
    const left = Math.max(0, l.quantity - used);
    return (
      <g key={`${kind}${l.price}`}>
        <rect x={140} y={y} width={(left / maxQ) * 180} height={rowH - 4} rx={4} className={kind === 'ask' ? 'fe-svg-fill-down' : 'fe-svg-fill-up'} opacity={0.55} />
        <text x={130} y={y + 15} textAnchor="end" className={kind === 'ask' ? 'fe-svg-text-down' : 'fe-svg-text-up'}>{fmt(l.price, 2)}</text>
        <text x={330} y={y + 15} className="fe-svg-small">{fmt(left, 3)}{used > 0 ? ` (−${fmt(used, 3)})` : ''}</text>
      </g>
    );
  };
  const spread = bestAsk !== undefined && bestBid !== undefined ? bestAsk - bestBid : undefined;
  const lines: string[] = [];
  if (inc) {
    lines.push(`${incSide.toUpperCase()} ${fmt(incQty, 3)} ${limit !== undefined ? `limit ${fmt(limit, 2)}` : 'at market'}`);
    if (res && res.ok) {
      const filled = t >= 1 ? res.value.filledQuantity : res.value.filledQuantity;
      lines.push(`Filled: ${fmt(filled, 3)}`);
      if (res.value.averagePrice !== null) lines.push(`Avg price: ${fmt(res.value.averagePrice, 2)}`);
      if (t >= 1 && res.value.remainingQuantity > 0) lines.push(limit !== undefined ? `Waiting in book: ${fmt(res.value.remainingQuantity, 3)}` : `Not filled: ${fmt(res.value.remainingQuantity, 3)}`);
    }
  }
  return (
    <Frame label={`Fictional order book. Best bid ${bestBid ?? 'none'}, best ask ${bestAsk ?? 'none'}${spread !== undefined ? `, spread ${fmt(spread, 2)}` : ''}`}>
      <FictionalBadge />
      <text x={40} y={28} className="fe-svg-label">ASKS (sellers)</text>
      {shownAsks.map((l, k) => row(l, 36 + k * rowH, 'ask'))}
      <line x1={40} x2={420} y1={midY} y2={midY} className="fe-svg-grid" />
      {spread !== undefined ? (
        <text x={40} y={midY + 4} className={`fe-svg-label ${variant === 'bid-ask-spread' ? 'fe-svg-hl-text' : ''}`} opacity={variant === 'bid-ask-spread' ? phase(p, 0.2, 0.5) : 1}>Spread {fmt(spread, 2)}</text>
      ) : <text x={40} y={midY + 4} className="fe-svg-label fe-svg-text-down">Empty side: nobody to trade with</text>}
      <text x={40} y={midY + 26} className="fe-svg-label">BIDS (buyers)</text>
      {shownBids.map((l, k) => row(l, midY + 34 + k * rowH, 'bid'))}
      {inc ? <Card x={440} y={90} w={180} h={40 + lines.length * 20} title="Incoming order" lines={lines} tone={res && res.ok && res.value.remainingQuantity > 0 && t >= 1 ? 'warn' : 'neutral'} /> : null}
    </Frame>
  );
}

// ------------------------------------------------------------------ order-placement

interface PlacedOrder { label: string; type: string; side: 'buy' | 'sell'; price?: number; trigger?: number; limit?: number }

/** When (index) and at what price each order fills along a fictional price path. */
export function orderEvents(path: number[], o: PlacedOrder, slippage: number): { triggerAt: number | null; fillAt: number | null; fillPrice: number | null } {
  const buy = o.side === 'buy';
  if (o.type === 'market') return { triggerAt: 0, fillAt: 0, fillPrice: (path[0] ?? 0) + (buy ? slippage : -slippage) };
  if (o.type === 'limit' && o.price !== undefined) {
    const i = path.findIndex((v) => (buy ? v <= (o.price as number) : v >= (o.price as number)));
    return { triggerAt: null, fillAt: i < 0 ? null : i, fillPrice: i < 0 ? null : o.price };
  }
  if ((o.type === 'stop-market' || o.type === 'stop-limit') && o.trigger !== undefined) {
    const tr = o.trigger;
    const i = path.findIndex((v, k) => k > 0 && (buy ? v >= tr : v <= tr));
    if (i < 0) return { triggerAt: null, fillAt: null, fillPrice: null };
    if (o.type === 'stop-market') return { triggerAt: i, fillAt: i, fillPrice: (path[i] as number) + (buy ? slippage : -slippage) };
    const lim = o.limit ?? tr;
    const j = path.findIndex((v, k) => k >= i && (buy ? v <= lim : v >= lim));
    return { triggerAt: i, fillAt: j < 0 ? null : j, fillPrice: j < 0 ? null : lim };
  }
  return { triggerAt: null, fillAt: null, fillPrice: null };
}

export function OrderPlacementScene({ params, p }: SceneProps) {
  const path = nums(params['path']);
  const slip = numOr(params['slippage'], 0);
  const orders: PlacedOrder[] = objs(params['orders']).map((o) => ({
    label: strOr(o['label'], ''), type: strOr(o['type'], 'market'), side: strOr(o['side'], 'buy') === 'sell' ? 'sell' : 'buy',
    ...(typeof o['price'] === 'number' ? { price: o['price'] } : {}),
    ...(typeof o['trigger'] === 'number' ? { trigger: o['trigger'] } : {}),
    ...(typeof o['limit'] === 'number' ? { limit: o['limit'] } : {}),
  }));
  const levels = orders.flatMap((o) => [o.price, o.trigger, o.limit].filter((v): v is number => v !== undefined));
  const box = { x: 56, y: 28, w: 380, h: 290 };
  const sc = makeScale([...path, ...levels], path.length, box);
  const visible = 1 + p * (path.length - 1);
  return (
    <Frame label={`Fictional price path with ${orders.length} orders`}>
      <FictionalBadge />
      <PriceAxis scale={sc} box={box} />
      {orders.map((o, k) => {
        const lv = o.price ?? o.trigger;
        return lv !== undefined ? <HLine key={`l${k}`} y={sc.y(lv)} x1={box.x} x2={box.x + box.w} label={`${o.label}`} cls={o.type.startsWith('stop') ? 'fe-svg-level-stop' : 'fe-svg-level'} side="left" /> : null;
      })}
      <path d={pathD(path, sc, visible)} className="fe-svg-price" />
      {orders.map((o, k) => {
        const ev = orderEvents(path, o, slip);
        if (ev.fillAt === null || ev.fillPrice === null || visible - 1 < ev.fillAt) return null;
        return <circle key={`f${k}`} cx={sc.x(ev.fillAt)} cy={sc.y(ev.fillPrice)} r={6} className={o.side === 'buy' ? 'fe-svg-dot-buy' : 'fe-svg-dot-sell'} />;
      })}
      {orders.map((o, k) => {
        const ev = orderEvents(path, o, slip);
        const now = visible - 1;
        const triggered = ev.triggerAt !== null && now >= ev.triggerAt;
        const filled = ev.fillAt !== null && now >= ev.fillAt;
        const status = filled ? `FILLED at ${fmt(ev.fillPrice as number, 2)}` : triggered ? 'TRIGGERED, not filled yet' : o.type === 'market' ? 'sending…' : 'waiting';
        const tone = filled ? 'up' : triggered ? 'warn' : 'neutral';
        const gap = filled && o.trigger !== undefined && o.type === 'stop-market' ? Math.abs((ev.fillPrice as number) - o.trigger) : 0;
        return <Card key={`c${k}`} x={452} y={28 + k * 98} w={172} h={88} title={o.label} tone={tone} lines={[`${o.side.toUpperCase()} ${o.type}`, status, gap > 0 ? `Slippage: ${fmt(gap, 2)}` : ' ']} />;
      })}
    </Frame>
  );
}

// ------------------------------------------------------------------ mock-terminal-tour

const AREAS: Record<string, { x: number; y: number; w: number; h: number; name: string }> = {
  watchlist: { x: 8, y: 40, w: 120, h: 312, name: 'Watchlist' },
  symbol: { x: 136, y: 40, w: 300, h: 34, name: 'Symbol & last price' },
  chart: { x: 136, y: 80, w: 300, h: 170, name: 'Chart' },
  'order-book': { x: 444, y: 40, w: 188, h: 150, name: 'Order book' },
  'order-entry': { x: 444, y: 196, w: 188, h: 156, name: 'Order entry (DEMO)' },
  positions: { x: 136, y: 256, w: 300, h: 96, name: 'Open positions & PnL' },
  wallet: { x: 8, y: 6, w: 200, h: 28, name: 'Wallet balance' },
  security: { x: 520, y: 6, w: 112, h: 28, name: 'Security / settings' },
};
export const TERMINAL_AREAS = Object.keys(AREAS);

export function MockTerminalScene({ params, p }: SceneProps) {
  const order = strs(params['areas']).filter((a) => a in AREAS);
  const idx = Math.min(order.length - 1, Math.floor(p * order.length));
  const active = order[idx];
  return (
    <Frame label={`Fictional generic trading screen; highlighted: ${active ? AREAS[active]?.name : 'none'}`}>
      <text x={W / 2} y={H - 4} textAnchor="middle" className="fe-svg-badge">EDUCATIONAL MOCK — NOT A REAL EXCHANGE SCREEN</text>
      {Object.entries(AREAS).map(([key, a]) => (
        <g key={key} opacity={key === active ? 1 : 0.45}>
          <rect x={a.x} y={a.y} width={a.w} height={a.h} rx={6} className={key === active ? 'fe-svg-area-on' : 'fe-svg-area'} />
          <text x={a.x + 8} y={a.y + 18} className="fe-svg-small">{a.name}</text>
        </g>
      ))}
      <text x={144} y={66} className="fe-svg-label">{strOr(params['symbol'], 'DEMO/USDT')} · Perpetual · fictional</text>
      {active ? <text x={W / 2} y={H - 22} textAnchor="middle" className="fe-svg-label fe-svg-hl-text">Step {idx + 1} of {order.length}: {AREAS[active]?.name}</text> : null}
      {[0, 1, 2, 3, 4].map((k) => <text key={k} x={16} y={70 + k * 26} className="fe-svg-small">{['DEMO/USDT', 'TOY/USDT', 'MOCK/USDT', 'SAMPLE/USDT', 'TEST/USDT'][k]}</text>)}
    </Frame>
  );
}
