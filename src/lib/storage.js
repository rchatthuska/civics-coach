/* ================= cloud profiles (username + passcode) =================
   Accounts and progress live in Firebase: Auth handles the username +
   passcode (as a synthetic email under the hood, since Firebase's
   email/password provider is what backs the security rules below), and
   Firestore stores each user's profile + progress by uid. That's what makes
   the same username/passcode show the same progress in any browser — Firebase
   Auth's local session cache is per-browser, but the data it points to
   (Firestore) is shared. Firestore rules restrict every doc to
   request.auth.uid == the doc id, so only the signed-in user can read/write
   their own record. */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, firebaseReady } from "./firebase";

const EMAIL_DOMAIN = "civicscoach.local";
const toEmail = (key) => `${key}@${EMAIL_DOMAIN}`;

// Firebase's email/password provider needs a valid email local-part, so the
// username is folded down to that character set. Different display names can
// collide onto the same key (e.g. "John Doe" and "john.doe") — that's an
// acceptable trade-off for keeping sign-in a plain name + passcode.
function sanitizeKey(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9._-]/g, "");
}

function friendlyError(e) {
  switch (e.code) {
    case "auth/email-already-in-use":
      return "That name is already taken — try signing in instead.";
    case "auth/weak-password":
      return "Passcode must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Wrong name or passcode.";
    case "auth/invalid-email":
      return "Name must contain at least one letter or number.";
    case "auth/too-many-requests":
      return "Too many attempts — wait a bit and try again.";
    default:
      return "Something went wrong (" + e.code + "). Try again.";
  }
}

export function cloudUnavailable() {
  return !firebaseReady;
}

export async function signUp(name, passcode) {
  const key = sanitizeKey(name);
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      toEmail(key),
      passcode,
    );
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      key,
      createdAt: Date.now(),
    });
    return { uid: cred.user.uid, key, name };
  } catch (e) {
    throw new Error(friendlyError(e));
  }
}

export async function signIn(name, passcode) {
  const key = sanitizeKey(name);
  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      toEmail(key),
      passcode,
    );
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    const storedName = snap.exists() ? snap.data().name : cred.user.displayName || name;
    return { uid: cred.user.uid, key, name: storedName };
  } catch (e) {
    throw new Error(friendlyError(e));
  }
}

export async function loadProgress(uid) {
  const snap = await getDoc(doc(db, "progress", uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveProgress(uid, data) {
  await setDoc(doc(db, "progress", uid), data);
}
