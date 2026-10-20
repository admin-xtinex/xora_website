import type { EntitlementStore } from "./store";
import { EMPTY_STATE, type EntitlementState, type SubscriptionRecord } from "./types";

// Local-only preview store (no Firebase): this browser only. Never a verified entitlement.
export const LOCAL_KEY = "xora.preview.entitlements.local-only";

type Saved = { state: EntitlementState; records: SubscriptionRecord[] };

function read(): Saved {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const s = JSON.parse(raw) as Saved;
      if (s && s.state && Array.isArray(s.records)) return s;
    }
  } catch { /* blocked or corrupt: start empty */ }
  return { state: EMPTY_STATE, records: [] };
}

export function localStore(): EntitlementStore {
  return {
    kind: "local",
    load: async () => read().state,
    history: async () => read().records,
    apply: async (fn) => {
      const saved = read();
      const change = fn(saved.state, Date.now());
      if (change.state === saved.state) return change;
      const records = saved.records.map((r) => {
        const u = change.updates.find((x) => x.subscriptionId === r.subscriptionId);
        return u ? { ...r, status: u.status, updatedAt: Date.now() } : r;
      });
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ state: change.state, records: [...change.records, ...records] }));
      return change;
    },
  };
}
