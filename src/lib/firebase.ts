import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigComplete = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp | null = null;

const initFirebaseApp = (): FirebaseApp | null => {
  if (!isConfigComplete) return null;

  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig as Required<typeof firebaseConfig>);
  }

  return app;
};

const firebaseApp = initFirebaseApp();

export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const hasFirebaseConfig = isConfigComplete;

