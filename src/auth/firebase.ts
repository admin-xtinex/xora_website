// Everything that talks to Firebase. Loaded on demand (AuthProvider imports it after the page has
// painted), so the landing page does not wait for it.
//
// Data, all in Firestore (rules: firebase/firestore.rules):
//   users/{uid}    profile, sign-in counts, last seen, and a summary of course progress and video watching
//   events/{auto}  one document per activity (signup, signin, lesson_open, video_*, lesson_complete, quiz_attempt …)
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { firebaseOptions } from "./config";

const app = initializeApp(firebaseOptions!);
const auth = getAuth(app);
const db = getFirestore(app);
// Local testing against the Firebase emulators (firebase emulators:start --only auth,firestore).
if (import.meta.env.VITE_FIREBASE_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

export type AppUser = { uid: string; email: string; name: string; emailVerified: boolean; provider: string };

const toAppUser = (u: User): AppUser => ({
  uid: u.uid,
  email: (u.email || "").toLowerCase(),
  name: u.displayName || (u.email || "").split("@")[0],
  emailVerified: u.emailVerified,
  provider: u.providerData[0]?.providerId || "password",
});

// ── Accounts ─────────────────────────────────────────────────────────────────
export function watchUser(cb: (u: AppUser | null) => void) {
  return onAuthStateChanged(auth, async (u) => {
    if (u) await recordVisit(u).catch(() => { /* activity is best effort */ });
    cb(u ? toAppUser(u) : null);
  });
}

export async function signUp(name: string, email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(cred.user, { displayName: name });
  await sendEmailVerification(cred.user).catch(() => { /* they can ask again later */ });
  await recordVisit(cred.user);
  if (name) await updateDoc(doc(db, "users", cred.user.uid), { name }).catch(() => { /* keeps the email name */ });
}
export const signIn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const signOutUser = () => signOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
export const resendVerification = () => (auth.currentUser ? sendEmailVerification(auth.currentUser) : Promise.resolve());

// The first time we see an account it is a sign-up; after that one sign-in per browser session.
// One visit at a time per account (sign-up and the auth listener both ask for it).
const visits = new Map<string, Promise<void>>();
function recordVisit(u: User) {
  let p = visits.get(u.uid);
  if (!p) {
    p = visitOnce(u);
    visits.set(u.uid, p);
  }
  return p;
}
async function visitOnce(u: User) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  const a = toAppUser(u);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: a.uid, email: a.email, name: a.name, provider: a.provider,
      createdAt: serverTimestamp(), lastSeenAt: serverTimestamp(), signInCount: 1,
    });
    await logEvent(a, "signup");
    sessionStorage.setItem("fe-session", a.uid);
    return;
  }
  const newSession = sessionStorage.getItem("fe-session") !== a.uid;
  await updateDoc(ref, { lastSeenAt: serverTimestamp(), ...(newSession ? { signInCount: increment(1) } : {}) });
  if (newSession) {
    sessionStorage.setItem("fe-session", a.uid);
    await logEvent(a, "signin");
  }
}

// ── Activity ─────────────────────────────────────────────────────────────────
export async function logEvent(u: Pick<AppUser, "uid" | "email">, type: string, lesson = "", detail = "") {
  await addDoc(collection(db, "events"), { uid: u.uid, email: u.email, type, lesson, detail, at: serverTimestamp() });
}

export async function touch(u: AppUser) {
  await updateDoc(doc(db, "users", u.uid), { lastSeenAt: serverTimestamp() });
}

/** Highest share of a lesson video the learner has reached (25, 50, 75, 100). */
export async function recordVideo(u: AppUser, lesson: string, pct: number) {
  await updateDoc(doc(db, "users", u.uid), { [`videos.${lesson}`]: pct, lastSeenAt: serverTimestamp() });
}

export type ProgressSummary = {
  lessons: Record<string, { done: boolean; best: number | null; attempts: number }>;
  checkpoints: Record<string, { passed: boolean; best: number | null; attempts: number }>;
  started: number;
  completed: number;
};

export async function saveProgress(u: AppUser, p: ProgressSummary) {
  await updateDoc(doc(db, "users", u.uid), {
    progress: p, lessonsStarted: p.started, lessonsCompleted: p.completed, progressAt: serverTimestamp(), lastSeenAt: serverTimestamp(),
  });
}

// ── Admin (the rules let only admin accounts read these) ─────────────────────
export type UserRow = {
  uid: string; email: string; name: string; provider: string;
  createdAt: Date | null; lastSeenAt: Date | null; signInCount: number;
  lessonsStarted: number; lessonsCompleted: number;
  progress?: ProgressSummary; videos?: Record<string, number>;
};
export type EventRow = { id: string; uid: string; email: string; type: string; lesson: string; detail: string; at: Date | null };

const date = (t: unknown) => (t && typeof (t as Timestamp).toDate === "function" ? (t as Timestamp).toDate() : null);

export async function loadUsers(max = 1000): Promise<UserRow[]> {
  const snap = await getDocs(query(collection(db, "users"), orderBy("lastSeenAt", "desc"), limit(max)));
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      uid: d.id, email: x.email || "", name: x.name || "", provider: x.provider || "",
      createdAt: date(x.createdAt), lastSeenAt: date(x.lastSeenAt), signInCount: x.signInCount || 0,
      lessonsStarted: x.lessonsStarted || 0, lessonsCompleted: x.lessonsCompleted || 0,
      progress: x.progress, videos: x.videos,
    };
  });
}

export async function loadEvents(max = 1000): Promise<EventRow[]> {
  const snap = await getDocs(query(collection(db, "events"), orderBy("at", "desc"), limit(max)));
  return snap.docs.map((d) => {
    const x = d.data();
    return { id: d.id, uid: x.uid, email: x.email || "", type: x.type, lesson: x.lesson || "", detail: x.detail || "", at: date(x.at) };
  });
}

/** Preview subscription records and current entitlements, for the admin portal. Dates as epoch ms. */
export type SubRow = {
  subscriptionId: string; userId: string; planId: string; productType: string; purchasedProductId: string; bundleId: string | null;
  billingPeriod: string | null; status: string; activationSource: string; paymentStatus: string; amountCollected: number;
  isRealPurchase: boolean; regularPriceINR: number; displayedOfferPriceINR: number; campaignId: string | null;
  activatedAt: number | null; expiresAt: number | null; createdAt: number | null;
};
export type EntRow = { uid: string; app: { planId: string; billingPeriod: string; expiresAt: number | null; cancelAtPeriodEnd: boolean; scheduledChange: unknown; viaBundle: boolean } | null; course: { activatedAt: number | null; viaBundle: boolean } | null };

const msOf = (t: unknown) => (t && typeof (t as Timestamp).toMillis === "function" ? (t as Timestamp).toMillis() : null);

export async function loadSubscriptions(max = 2000): Promise<SubRow[]> {
  const snap = await getDocs(query(collection(db, "subscriptions"), orderBy("createdAt", "desc"), limit(max)));
  return snap.docs.map((d) => {
    const x = d.data();
    return { ...(x as SubRow), activatedAt: msOf(x.activatedAt), expiresAt: msOf(x.expiresAt), createdAt: msOf(x.createdAt) };
  });
}

export async function loadEntitlements(max = 2000): Promise<EntRow[]> {
  const snap = await getDocs(query(collection(db, "entitlements"), limit(max)));
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      uid: d.id,
      app: x.app ? { ...x.app, expiresAt: msOf(x.app.expiresAt) } : null,
      course: x.course ? { activatedAt: msOf(x.course.activatedAt), viaBundle: !!x.course.viaBundle } : null,
    };
  });
}

/** For the subscription store (src/billing/firestoreStore.ts). */
export { auth, db };
