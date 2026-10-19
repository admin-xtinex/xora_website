/**
 * XORA Futures Edge module entry (EDGE-01). The host (`src/App.tsx`) lazy-imports this file only when
 * VITE_FUTURES_EDGE_ENABLED === "true" and the path is under /learn/futures-edge.
 */
export { FuturesEdgeApp as default, FuturesEdgeApp } from './platform';
