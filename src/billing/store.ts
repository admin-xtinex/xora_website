// EntitlementStore: where a learner's entitlements and activation records live.
//  - cloud: Firestore (entitlements/{uid} + subscriptions/{id}), written in one transaction per action.
//  - local: this browser only, used when Firebase is not configured (development / UI testing). It is labelled
//    as such everywhere and is never treated as a verified entitlement or proof of payment.
import type { Change } from "./subscriptions";
import type { EntitlementState, SubscriptionRecord } from "./types";

export interface EntitlementStore {
  readonly kind: "cloud" | "local";
  load(): Promise<EntitlementState>;
  /** Runs `fn` on the latest saved state and saves its result atomically (or nothing at all). */
  apply(fn: (s: EntitlementState, now: number) => Change): Promise<Change>;
  history(): Promise<SubscriptionRecord[]>;
}

export const newId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`).replace(/-/g, "").slice(0, 20);
