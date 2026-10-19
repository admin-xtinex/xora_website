/**
 * XORA Futures Edge module entry for the host. The course itself (platform/FuturesEdgeApp) is mounted lazily at
 * /learn/futures-edge only when the build-time flag VITE_FUTURES_EDGE_ENABLED is exactly "true".
 * The module has no network, exchange or account code.
 */
export function isFuturesEdgePath(pathname: string): boolean {
  return pathname === '/learn/futures-edge' || pathname.startsWith('/learn/futures-edge/');
}
