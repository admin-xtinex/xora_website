// Cloud EntitlementStore on Firestore. Each action is one transaction: it reads entitlements/{uid},
// applies the rules (subscriptions.ts) and writes the new state together with its activation records,
// so a bundle is all-or-nothing and two quick clicks cannot both activate.
// firebase/firestore.rules only accepts preview grants (paymentless_preview, amountCollected 0, not a real purchase).
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/auth/firebase";
import type { EntitlementStore } from "./store";
import { newId } from "./store";
import type { Change } from "./subscriptions";
import { EMPTY_STATE, type AppEntitlement, type CourseEntitlement, type EntitlementState, type SubscriptionRecord } from "./types";

const ms = (v: unknown): number | null => (v instanceof Timestamp ? v.toMillis() : typeof v === "number" ? v : null);
const ts = (n: number | null) => (n == null ? null : Timestamp.fromMillis(n));

function fromDoc(d: DocumentData | undefined): EntitlementState {
  if (!d) return EMPTY_STATE;
  const app = d.app ? ({ ...d.app, activatedAt: ms(d.app.activatedAt) ?? 0, expiresAt: ms(d.app.expiresAt) ?? 0 } as AppEntitlement) : null;
  const course = d.course ? ({ ...d.course, activatedAt: ms(d.course.activatedAt) ?? 0, expiresAt: ms(d.course.expiresAt) } as CourseEntitlement) : null;
  return { app, course, launchUsed: { app: !!d.launchUsed?.app, course: !!d.launchUsed?.course }, version: d.version ?? 0 };
}

// Activation times are the server's clock (request.time); expiry dates are checked by the rules against it.
function toDoc(uid: string, s: EntitlementState, before: EntitlementState) {
  const appNew = s.app && s.app.subscriptionId !== before.app?.subscriptionId;
  const courseNew = s.course && s.course.subscriptionId !== before.course?.subscriptionId;
  return {
    uid,
    app: s.app ? { ...s.app, activatedAt: appNew ? serverTimestamp() : ts(s.app.activatedAt), expiresAt: ts(s.app.expiresAt) } : null,
    course: s.course ? { ...s.course, activatedAt: courseNew ? serverTimestamp() : ts(s.course.activatedAt), expiresAt: ts(s.course.expiresAt) } : null,
    launchUsed: s.launchUsed,
    version: s.version,
    updatedAt: serverTimestamp(),
  };
}

function recordDoc(r: SubscriptionRecord) {
  return { ...r, activatedAt: serverTimestamp(), expiresAt: ts(r.expiresAt), createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
}

export function firestoreStore(uid: string): EntitlementStore {
  const ref = doc(db, "entitlements", uid);
  return {
    kind: "cloud",
    load: async () => fromDoc((await getDoc(ref)).data()),
    history: async () => {
      // Filter only (no orderBy), so no composite index is needed; sorted here.
      const snap = await getDocs(query(collection(db, "subscriptions"), where("userId", "==", uid), limit(200)));
      return snap.docs
        .map((d) => {
          const x = d.data();
          return { ...x, activatedAt: ms(x.activatedAt) ?? 0, expiresAt: ms(x.expiresAt), createdAt: ms(x.createdAt) ?? 0, updatedAt: ms(x.updatedAt) ?? 0 } as SubscriptionRecord;
        })
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    apply: (fn) =>
      runTransaction(db, async (tx) => {
        const before = fromDoc((await tx.get(ref)).data());
        const change: Change = fn(before, Date.now());
        if (change.state === before) return change;
        tx.set(ref, toDoc(uid, change.state, before));
        for (const r of change.records) tx.set(doc(db, "subscriptions", r.subscriptionId), recordDoc(r));
        for (const u of change.updates) tx.update(doc(db, "subscriptions", u.subscriptionId), { status: u.status, updatedAt: serverTimestamp() });
        return change;
      }),
  };
}

export { newId };
